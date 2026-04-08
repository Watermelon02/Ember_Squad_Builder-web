import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import html2canvas from 'html2canvas';
import './PartCardEditor.css';
import '../customCard/partCard/PartCard.css';
import { Action, Part } from '../../data/types';
import { getCardBackGroundClassName } from '../../util/CustomCardUtil';
import { TilingCrossPattern } from '../customCard/TilingCrossPattern';


// ---- 类型 ----
type EditorTab = 'part' | 'actions';

interface PartCardEditorProps {
  initialPart?: Partial<Part>;
  initialFaction?: string;
  tabsrc?: string;
  lang?: string;
  onSave?: (part: Part, faction: string) => void;
}

// ---- 常量 ----
const ACTION_TYPES: Action['type'][] = ['Swift', 'Melee', 'Projectile', 'Firing', 'Moving', 'Tactic', 'Passive'];
const ACTION_SIZES: Action['size'][] = ['s', 'm', 'l'];
const PART_TYPES: Part['type'][] = ['torso', 'chasis', 'leftHand', 'rightHand', 'backpack'];
const FACTIONS = ['RDL', 'UN', 'GOF', 'PD'] as const;
const SIZE_LABEL: Record<Action['size'], string> = { s: '小(s)', m: '中(m)', l: '大(l)' };

const TYPE_GRADIENTS: Record<string, string> = {
  Swift:      'linear-gradient(90deg, #FFF56F 0%, #E2EBAC 100%)',
  Melee:      'linear-gradient(90deg, #f8b845 0%, #E7B67Ef0 90%, #E7B67E90 100%)',
  Projectile: 'linear-gradient(90deg, #ED8571 0%, #EE7375 90%, #E7B67E90 100%)',
  Firing:     'linear-gradient(90deg, #E6422D 0%, #E75A39 60%, #D6B882 100%)',
  Moving:     'linear-gradient(90deg, #686AAF 0%, #20BBED 100%)',
  Tactic:     'linear-gradient(90deg, #05aaa4 0%, #38BAA6f0 60%, #25B1A090 100%)',
  Passive:    'linear-gradient(135deg, #B9B4B6 0%, #909090 100%)',
  Default:    'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
};

const TYPE_CLASS_MAP: Record<string, string> = {
  leftHand: 'part-main-image-wrapper-hand',
  rightHand: 'part-main-image-wrapper-hand',
  backpack: 'part-main-image-wrapper-hand',
  torso: 'part-main-image-wrapper-torso',
  chasis: 'part-main-image-wrapper-chasis',
};

const SHADOW_TYPE_CLASS_MAP: Record<string, string> = {
  leftHand: 'part-main-image-wrapper-shadow-hand',
  rightHand: 'part-main-image-wrapper-shadow-hand',
  backpack: 'part-main-image-wrapper-shadow-hand',
  torso: 'part-main-image-wrapper-shadow-torso',
  chasis: 'part-main-image-wrapper-shadow-chasis',
};

const POINTER_NONE: React.CSSProperties = { pointerEvents: 'none' };
const BG_PATTERN_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: '4vh',
  width: '14vh',
  height: '70%',
  overflow: 'hidden',
  zIndex: 0,
  pointerEvents: 'none',
};

// ---- 默认数据 ----
const DEFAULT_PART: Part = {
  id: 'new_part',
  name: '新部件',
  type: 'torso',
  score: 0,
  structure: 0,
  armor: 3,
  parray: 0,
  dodge: 2,
  electronic: 0,
  move: 0,
  description: '',
  isPD: false,
  keywords: [],
  action: [],
  containedIn: [],
};

const DEFAULT_ACTION = (): Action => ({
  id: `action_${Date.now()}`,
  name: '新动作',
  type: 'Firing',
  size: 's',
  range: 3,
  storage: 0,
  redDice: 1,
  yellowDice: 0,
  description: '',
});

// ---- 辅助函数（与原 PartCard 一致）----
const getPartLetter = (type: Part['type']): string => {
  if (!type) return '';
  const lower = type.toLowerCase();
  if (lower === 'torso') return 'T';
  if (lower === 'lefthand') return 'L';
  return type.charAt(0).toUpperCase();
};

const getSizeCount = (size: Action['size']): number => {
  switch (size) {
    case 's': return 1;
    case 'm': return 2;
    case 'l': return 3;
    default:  return 1;
  }
};

const getTypeIcon = (type: Action['type'], tabsrc: string) => {
  const style: React.CSSProperties = { height: '3vh', width: 'auto' };
  const src = (() => {
    switch (type) {
      case 'Swift':      return `${tabsrc}/icon_swift.png`;
      case 'Melee':      return `${tabsrc}/icon_melee.png`;
      case 'Projectile': return `${tabsrc}/icon_projectile.png`;
      case 'Firing':     return `${tabsrc}/icon_firing.png`;
      case 'Moving':     return `${tabsrc}/icon_moving.png`;
      case 'Tactic':     return `${tabsrc}/icon_tactic.png`;
      default:           return `${tabsrc}/icon_passive.png`;
    }
  })();
  return <img src={src} alt={type} style={style} />;
};

// ---- 子组件：动作预览（与原版 PartActionItem 对齐）----
const ActionItemPreview: React.FC<{
  action: Action;
  index: number;
  tabsrc: string;
  lang: string;
}> = React.memo(({ action, index, tabsrc, lang }) => {
  const sizeCount = getSizeCount(action.size);
  const hasStorage = action.storage > 0;
  const hasDice = !hasStorage && (action.redDice > 0 || action.yellowDice > 0);

  const dice: string[] = [];
  if (hasDice) {
    for (let i = 0; i < action.redDice; i++) dice.push('red');
    for (let i = 0; i < action.yellowDice; i++) dice.push('yellow');
  }

  const nameStyle: React.CSSProperties = {
    background: TYPE_GRADIENTS[action.type] ?? TYPE_GRADIENTS.Default,
  };

  return (
    <motion.div
      className="action-item"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.9)' }}
    >
      {/* Row 1 */}
      <div className="action-row-1">
        <div className="action-type-wrapper">
          <div className="action-type-icon">{getTypeIcon(action.type, tabsrc)}</div>
        </div>

        {action.type !== 'Passive' && (
          <div className="action-size-container vertical">
            {sizeCount === 1 ? (
              <>
                <div className="size-square-white" />
                <div className="size-square-black" />
              </>
            ) : (
              <div
                className="size-visual-many-squares"
                style={{ '--count': sizeCount } as React.CSSProperties}
              />
            )}
          </div>
        )}

        <div
          className={lang === 'zh' ? 'action-name-cn' : 'action-name-en'}
          style={nameStyle}
        >
          |{action.name}|
        </div>
      </div>

      {/* Row 2 */}
      <div className="action-row-2">
        <div className="action-content-left">
          <div className="action-stat-row range-row">
            {action.range > 0 && (
              <div className="range-badge">
                <div className="range-label">R</div>
                <div className="range-value">{action.range}</div>
              </div>
            )}
            {action.range === -1 && (
              <div className="range-badge">
                <div className="range-label">R</div>
                <div className="range-value">--</div>
              </div>
            )}
          </div>

          {hasStorage && (
            <div className="action-stat-row storage-row">
              {Array.from({ length: action.storage }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                >
                  <Rocket size="1.4vh" className="storage-icon-svg" />
                </motion.div>
              ))}
            </div>
          )}

          {hasDice && (
            <>
              <div className="action-stat-row dice-row">
                {dice.slice(0, 4).map((color, i) => (
                  <motion.div
                    key={i}
                    className={`skeuomorphic-dice dice-${color}`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 + i * 0.05 }}
                  />
                ))}
              </div>
              {dice.length > 4 && (
                <div className="action-stat-row dice-row">
                  {dice.slice(4, 8).map((color, i) => (
                    <motion.div
                      key={i + 4}
                      className={`skeuomorphic-dice dice-${color}`}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.35 + i * 0.05 }}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="action-description">
          <div className={lang === 'zh' ? 'description-text-cn' : 'description-text-en'}>
            {action.description}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// ---- 子组件：动作编辑表单 ----
const ActionEditor: React.FC<{
  action: Action;
  index: number;
  onChange: (index: number, field: keyof Action, value: Action[keyof Action]) => void;
  onRemove: (index: number) => void;
}> = ({ action, index, onChange, onRemove }) => (
  <div className="pce-action-card">
    <div className="pce-action-card-header">
      <span className="pce-action-num">动作 {index + 1}</span>
      <button className="pce-btn-remove" onClick={() => onRemove(index)}>删除</button>
    </div>

    <div className="pce-field">
      <label className="pce-label">动作名称</label>
      <input
        type="text"
        value={action.name}
        onChange={e => onChange(index, 'name', e.target.value)}
      />
    </div>

    <div className="pce-field-row">
      <div className="pce-field">
        <label className="pce-label">动作类型</label>
        <select
          value={action.type}
          onChange={e => onChange(index, 'type', e.target.value as Action['type'])}
        >
          {ACTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="pce-field">
        <label className="pce-label">动作大小</label>
        <select
          value={action.size}
          onChange={e => onChange(index, 'size', e.target.value as Action['size'])}
        >
          {ACTION_SIZES.map(s => <option key={s} value={s}>{SIZE_LABEL[s]}</option>)}
        </select>
      </div>
    </div>

    <div className="pce-field-row-3">
      <div className="pce-field">
        <label className="pce-label">射程 Range</label>
        <input
          type="number"
          min={-1}
          value={action.range}
          onChange={e => onChange(index, 'range', Number(e.target.value))}
        />
      </div>
      <div className="pce-field">
        <label className="pce-label">红骰</label>
        <input
          type="number"
          min={0}
          max={10}
          value={action.redDice}
          onChange={e => onChange(index, 'redDice', Number(e.target.value))}
        />
      </div>
      <div className="pce-field">
        <label className="pce-label">黄骰</label>
        <input
          type="number"
          min={0}
          max={10}
          value={action.yellowDice}
          onChange={e => onChange(index, 'yellowDice', Number(e.target.value))}
        />
      </div>
    </div>

    <div className="pce-field">
      <label className="pce-label">弹仓 Storage</label>
      <input
        type="number"
        min={0}
        max={6}
        value={action.storage}
        onChange={e => onChange(index, 'storage', Number(e.target.value))}
      />
    </div>

    <div className="pce-field">
      <label className="pce-label">动作描述</label>
      <textarea
        value={action.description}
        onChange={e => onChange(index, 'description', e.target.value)}
      />
    </div>
  </div>
);

// ---- 主组件 ----
export const PartCardEditor: React.FC<PartCardEditorProps> = ({
  initialPart,
  initialFaction = 'RDL',
  tabsrc = '',
  lang = 'zh',
  onSave,
}) => {
  const [tab, setTab] = useState<EditorTab>('part');
  const [part, setPart] = useState<Part>({ ...DEFAULT_PART, ...initialPart });
  const [faction, setFaction] = useState(initialFaction);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 组件卸载时释放 blob URL
  useEffect(() => {
    return () => {
      if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl);
    };
  }, [uploadedImageUrl]);

  const updatePart = useCallback(<K extends keyof Part>(field: K, value: Part[K]) => {
    setPart(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateAction = useCallback((index: number, field: keyof Action, value: Action[keyof Action]) => {
    setPart(prev => {
      const actions = [...(prev.action ?? [])];
      actions[index] = { ...actions[index], [field]: value };
      return { ...prev, action: actions };
    });
  }, []);

  const addAction = useCallback(() => {
    setPart(prev => ({ ...prev, action: [...(prev.action ?? []), DEFAULT_ACTION()] }));
  }, []);

  const removeAction = useCallback((index: number) => {
    setPart(prev => {
      const actions = [...(prev.action ?? [])];
      actions.splice(index, 1);
      return { ...prev, action: actions };
    });
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadedImageUrl(prev => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    // 清空 input，允许重复上传同一文件
    e.target.value = '';
  }, []);

  const handleClearImage = useCallback(() => {
    setUploadedImageUrl(prev => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  const handleExport = useCallback(async () => {
    if (!cardRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `${part.name || 'part-card'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('导出失败', err);
    } finally {
      setIsExporting(false);
    }
  }, [part.name, isExporting]);

  const mainImageClass  = TYPE_CLASS_MAP[part.type]        ?? 'part-main-image-wrapper';
  const shadowImageClass = SHADOW_TYPE_CLASS_MAP[part.type] ?? '';

  return (
    <div className="pce-layout">
      {/* ===== 左侧编辑区 ===== */}
      <div className="pce-panel pce-editor-panel">
        <div className="pce-tabs">
          {(['part', 'actions'] as EditorTab[]).map(t => (
            <button
              key={t}
              className={`pce-tab${tab === t ? ' active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'part' ? '部件属性' : `动作列表（${part.action?.length ?? 0}）`}
            </button>
          ))}
        </div>

        {/* ---- 部件属性 Tab ---- */}
        {tab === 'part' && (
          <div className="pce-panel-body">
            <div className="pce-section-title">基础信息</div>

            <div className="pce-field">
              <label className="pce-label">部件名称</label>
              <input
                type="text"
                value={part.name}
                onChange={e => updatePart('name', e.target.value)}
              />
            </div>

            <div className="pce-field-row">
              <div className="pce-field">
                <label className="pce-label">部件类型</label>
                <select
                  value={part.type}
                  onChange={e => updatePart('type', e.target.value as Part['type'])}
                >
                  {PART_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="pce-field">
                <label className="pce-label">派系</label>
                <select value={faction} onChange={e => setFaction(e.target.value)}>
                  {FACTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>

            <div className="pce-section-title">数值属性</div>
            <div className="pce-field-row-3">
              {([
                ['armor',     '护甲 Armor'],
                ['structure', '结构 Structure'],
                ['move',      '移动 Move'],
              ] as const).map(([field, label]) => (
                <div key={field} className="pce-field">
                  <label className="pce-label">{label}</label>
                  <input
                    type="number"
                    min={0}
                    value={part[field] ?? 0}
                    onChange={e => updatePart(field, Number(e.target.value))}
                  />
                </div>
              ))}
            </div>
            <div className="pce-field-row-3">
              {([
                ['dodge',      '闪避 Dodge'],
                ['electronic', '电子 Electronic'],
                ['parray',     '相阵 Parray'],
              ] as const).map(([field, label]) => (
                <div key={field} className="pce-field">
                  <label className="pce-label">{label}</label>
                  <input
                    type="number"
                    min={0}
                    value={part[field] ?? 0}
                    onChange={e => updatePart(field, Number(e.target.value))}
                  />
                </div>
              ))}
            </div>

            {/* 立绘上传 */}
            <div className="pce-section-title">立绘图片</div>
            <div
              className="pce-image-upload-area"
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadedImageUrl
                ? <img src={uploadedImageUrl} alt="立绘预览" className="pce-image-thumb" />
                : <span className="pce-image-placeholder">点击上传立绘图片</span>
              }
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
            </div>
            {uploadedImageUrl && (
              <button className="pce-btn-clear-image" onClick={handleClearImage}>
                移除图片
              </button>
            )}

            <div className="pce-section-title">描述</div>
            <div className="pce-field">
              <label className="pce-label">部件描述</label>
              <textarea
                value={part.description}
                onChange={e => updatePart('description', e.target.value)}
              />
            </div>

            {onSave && (
              <button
                className="pce-btn-save"
                onClick={() => onSave(part, faction)}
              >
                保存部件
              </button>
            )}
          </div>
        )}

        {/* ---- 动作列表 Tab ---- */}
        {tab === 'actions' && (
          <div className="pce-panel-body">
            {(part.action ?? []).map((action, idx) => (
              <ActionEditor
                key={action.id}
                action={action}
                index={idx}
                onChange={updateAction}
                onRemove={removeAction}
              />
            ))}
            <button className="pce-btn-add" onClick={addAction}>＋ 添加动作</button>
          </div>
        )}
      </div>

      {/* ===== 右侧预览区 ===== */}
      <div className="pce-panel pce-preview-panel">
        <div className="pce-preview-header">
          <span>卡面预览</span>
          <div className="pce-preview-header-right">
            <span className="pce-preview-faction-tag">{faction}</span>
            <button
              className="pce-btn-export"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? '导出中...' : '导出图片'}
            </button>
          </div>
        </div>

        <div className="pce-preview-bg">
          {/* ref 挂在真实卡片 div 上，用于 html2canvas 截图 */}
          <motion.div
            ref={cardRef}
            className={`part-card ${getCardBackGroundClassName(faction, part.isPD)}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={POINTER_NONE}
          >
            {/* 背景十字纹 */}
            <div style={BG_PATTERN_STYLE}>
              <TilingCrossPattern zIndex={0} opacity={0.8} />
            </div>

            {/* 派系 Logo */}
            <div className="absolute-logo-info action-part-logo-top">
              {tabsrc ? (
                <img
                  src={`${tabsrc}/icon_logo_${faction}.png`}
                  alt={`logo_${faction}`}
                  style={{ height: '3vh' }}
                  loading="lazy"
                />
              ) : (
                <span className="pce-faction-text-badge">{faction}</span>
              )}
            </div>

            {/* 主图：优先显示上传图片，否则显示 tabsrc 图，最后 placeholder */}
            <div className={mainImageClass}>
              {uploadedImageUrl ? (
                <img
                  src={uploadedImageUrl}
                  alt={part.name}
                  className="part-main-image"
                />
              ) : tabsrc && (part.hasImage !== false) ? (
                <img
                  src={`${tabsrc}/${part.id}.png`}
                  alt={part.name}
                  className="part-main-image"
                  loading="lazy"
                />
              ) : (
                <span className="placeholder">{part.name}</span>
              )}
            </div>

            {/* 阴影图 */}
            <div className={shadowImageClass}>
              {(uploadedImageUrl || (tabsrc && part.hasImage !== false)) && (
                <img
                  src={uploadedImageUrl ?? `${tabsrc}/${part.id}.png`}
                  className="part-main-image-shadow"
                  alt=""
                  loading="lazy"
                />
              )}
            </div>

            <div className="card-overlay" />

            <div className="card-content">
              {/* 部件名（竖排） */}
              <div className="left-name relative">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {part.name}
                </motion.span>
              </div>

              {/* 护甲 + 结构 */}
              <div className="top-stats">
                <motion.div
                  className="stat-box part-stat-armor"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {tabsrc ? (
                    <img
                      loading="lazy"
                      src={`${tabsrc}/icon_armor.png`}
                      className="stat-value-icon-armor"
                      alt="armor"
                    />
                  ) : (
                    <span className="pce-stat-fallback-icon">A</span>
                  )}
                  <span className="part-stat-number-armor">{part.armor}</span>
                </motion.div>

                {part.structure > 0 && (
                  <motion.div
                    className="stat-box-structure part-stat-structure"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span className="part-stat-number-structure">{part.structure}</span>
                  </motion.div>
                )}
              </div>

              {/* 右侧属性：闪避 / 电子 / 相阵 */}
              <div className="right-stats">
                <div className="right-grid-bg" />
                <div className="right-stats-values">
                  {part.dodge > 0 && (
                    <motion.div
                      className="stat-value dodge-value"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {tabsrc
                        ? <img loading="lazy" src={`${tabsrc}/icon_dodge.png`} className="stat-value-icon" alt="dodge" />
                        : <span className="pce-stat-fallback-icon">◌</span>
                      }
                      <span>{part.dodge}</span>
                    </motion.div>
                  )}
                  {part.electronic > 0 && (
                    <motion.div
                      className="stat-value electronic-value"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      {tabsrc
                        ? <img loading="lazy" src={`${tabsrc}/icon_electronic.png`} className="stat-value-icon" alt="electronic" />
                        : <span className="pce-stat-fallback-icon">⚡</span>
                      }
                      <span>{part.electronic}</span>
                    </motion.div>
                  )}
                  {part.parray > 0 && (
                    <motion.div
                      className="stat-value parray-value"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      {tabsrc
                        ? <img loading="lazy" src={`${tabsrc}/icon_parray.png`} className="stat-value-icon" alt="parray" />
                        : <span className="pce-stat-fallback-icon">◎</span>
                      }
                      <span>{part.parray}</span>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="type-label">
                <span>{part.type}</span>
              </div>

              {/* 动作列表 */}
              <div className="action-list">
                <div className="action-items-wrapper">
                  {(part.action ?? []).map((action, index) => (
                    <ActionItemPreview
                      key={action.id || index}
                      action={action}
                      index={index}
                      tabsrc={tabsrc}
                      lang={lang}
                    />
                  ))}
                </div>

                {part.type === 'chasis' && (
                  <div className="chassis-move-container">
                    <motion.div
                      className="move-badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: (part.action?.length ?? 0) * 0.1 + 0.2,
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      {part.move}
                    </motion.div>
                  </div>
                )}
              </div>

              {/* 部件类型徽章 */}
              {part.type && (
                <div className="absolute-part-info action-part-icon-top">
                  <div className="part-letter-badge">{getPartLetter(part.type)}</div>
                  {tabsrc && (
                    <img
                      src={`${tabsrc}/icon_part_${part.type}.png`}
                      alt={`${part.type} icon`}
                      style={{ height: '3vh' }}
                      loading="lazy"
                    />
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
