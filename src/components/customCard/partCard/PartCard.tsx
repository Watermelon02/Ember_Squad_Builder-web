import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import './PartCard.css';
import { Action, Part } from '../../../types';
import { TilingCrossPattern } from '../TilingCrossPattern';
import { getCardBackGroundClassName, getTypeIcon } from '../../../util/CustomCardUtil';
import { translations } from '../../../i18n';

interface PartCardProps {
  part: Part;
  tabsrc: string;
  isThrowCard: boolean;
  faction: string
}

// 静态常量与辅助函数移出组件外部
const TYPE_GRADIENTS: Record<string, string> = {
  Swift: 'linear-gradient(135deg, #e1f56d 0%, #b4c457 100%)',
  Melee: 'linear-gradient(90deg, #f8b845 0%, #E7B67Ef0 90%,#E7B67E90 100%)',
  Projectile: 'linear-gradient(90deg, #ED8571 0%, #EE7375 90%,#E7B67E90 100%)',
  Firing: 'linear-gradient(90deg, #E6422D 0%,#E75A39 60%, #D6B882 100%)',
  Moving: 'linear-gradient(90deg, #686AAF 0%, #20BBED 100%)',
  Tactic: 'linear-gradient(90deg, #05aaa4 0%,#38BAA6f0 60%, #25B1A090 100%)',
  Passive: 'linear-gradient(135deg, #B9B4B6 0%, #909090 100%)',
  Default: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
};

const getTypeGradient = (type: Action['type']) => TYPE_GRADIENTS[type] || TYPE_GRADIENTS.Default;

const getPartLetter = (type: Part['type']) => {
  if (!type) return '';
  const lowerType = type.toLowerCase();
  if (lowerType === 'torso') return 'T';
  if (lowerType === 'lefthand') return 'L';
  return type.charAt(0).toUpperCase();
};

export const getSizeCount = (size: Action['size']) => {
  switch (size) {
    case 's': return 1;
    case 'm': return 2;
    case 'l': return 3;
    default: return 1;
  }
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

const POINTER_NONE_STYLE = { pointerEvents: 'none' as const };
const BG_PATTERN_STYLE = {
  position: 'absolute' as const,
  top: 0,
  left: '4vh',
  width: '14vh',
  height: '70%',
  overflow: 'hidden',
  zIndex: 0,
  pointerEvents: 'none' as const,
};

// --- 子组件：Action Item ---
const PartActionItem: React.FC<{ action: Action; index: number, tabsrc: string }> = React.memo(({ action, index, tabsrc }) => {
  const sizeCount = getSizeCount(action.size);
  const hasStorage = action.storage > 0;
  const hasDice = !hasStorage && (action.redDice > 0 || action.yellowDice > 0);

  // 缓存 Dice 数组
  const dice = useMemo(() => {
    if (!hasDice) return [];
    const d = [];
    for (let i = 0; i < action.redDice; i++) d.push('red');
    for (let i = 0; i < action.yellowDice; i++) d.push('yellow');
    return d;
  }, [hasDice, action.redDice, action.yellowDice]);

  const nameStyle = useMemo(() => ({ background: getTypeGradient(action.type) }), [action.type]);

  return (
    <motion.div
      className="action-item"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.9)" }}
    >
      {/* Row 1 */}
      <div className="action-row-1">
        <div className="action-type-wrapper">
          <div className="action-type-icon">{getTypeIcon(action.type, tabsrc)}</div>
        </div>

        {action.type !== "Passive" && (
          <div className="action-size-container vertical">
            {sizeCount === 1 ? (
              // 特殊情况：两个方块（一白一黑）
              <>
                <div className="size-square-white" />
                <div className="size-square-black" />
              </>
            ) : (
              // 优化：使用一个元素通过 CSS 渲染所有方块
              <div
                className="size-visual-many-squares"
                style={{ '--count': sizeCount }}
              />
            )}
          </div>
        )}

        <div className="action-name" style={nameStyle}>
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
                <div className={`range-value ${action.range === 0 ? 'striped' : ''}`}>
                  {action.range}
                </div>
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
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 + i * 0.05 }}
                  />
                ))}
              </div>
              {dice.length > 3 && (
                <div className="action-stat-row dice-row">
                  {dice.slice(4, 8).map((color, i) => (
                    <motion.div
                      key={i + 4}
                      className={`skeuomorphic-dice dice-${color}`}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.35 + i * 0.05 }}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="action-description">
          <div className="description-text">{action.description}</div>
        </div>
      </div>
    </motion.div>
  );
});

// --- 主组件：PartCard ---
export const PartCard: React.FC<PartCardProps> = React.memo(({ part, tabsrc, isThrowCard = false, faction }) => {
  if (!part) return null;

  const mainImageClass = TYPE_CLASS_MAP[part.type] || "part-main-image-wrapper";
  const shadowImageClass = SHADOW_TYPE_CLASS_MAP[part.type];

  return (
    <motion.div
      className={`part-card ${getCardBackGroundClassName(faction,part.isPD)}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={POINTER_NONE_STYLE}
    >
      <div style={BG_PATTERN_STYLE}>
        <TilingCrossPattern zIndex={0} opacity={0.8} />
      </div>

      {/* 派系 Logo */}
      {/* <div className="absolute-logo-info action-part-logo-top">
        <img
          src={`${tabsrc}/icon_logo_${faction}.png`}
          alt={`${part.type} Icon_logo`}
          style={{ height: "3vh" }}
          loading="lazy"
        />
      </div> */}

      {/* 主图 */}
      <div className={mainImageClass}>
        {(part.hasImage === undefined || part.hasImage)? <img
          src={`${tabsrc}/${part.id}.png`}
          alt={`${part.name} Main`}
          className="part-main-image"
          loading="lazy"
        /> : <span className="placeholder">{part.name}</span>}
      </div>

      {/* 阴影图 */}
      <div className={shadowImageClass}>
        {part.hasImage && <img
          src={`${tabsrc}/${part.id}.png`}

          className="part-main-image-shadow"
          loading="lazy"
        />}
      </div>

      <div className="card-overlay" />

      <div className="card-content">
        {/* Name */}
        <div className="left-name relative">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {part.name}
          </motion.span>
        </div>

        {/* Stats */}
        <div className="top-stats">
          <motion.div
            className="stat-box part-stat-armor"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <img loading="lazy" src={`${tabsrc}/icon_armor.png`} className="stat-value-icon-armor" alt="armor" />
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

        {/* Right Grid & Stats */}
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
                <img loading="lazy" src={`${tabsrc}/icon_dodge.png`} className="stat-value-icon" alt="dodge" />
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
                <img loading="lazy" src={`${tabsrc}/icon_electronic.png`} className="stat-value-icon" alt="electronic" />
                <span>{part.electronic}</span>
              </motion.div>
            )}
          </div>
        </div>

        <div className="type-label">
          <span>{part.type}</span>
        </div>

        {/* Actions */}
        <div className="action-list">
          <div className="action-items-wrapper">
            {part.action?.map((action, index) => (
              <PartActionItem key={action.id || index} action={action} index={index} tabsrc={tabsrc} />
            ))}
          </div>

          {part.type === "chasis" && (
            <div className="chassis-move-container">
              <motion.div
                className="move-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: (part.action?.length || 0) * 0.1 + 0.2, type: "spring", stiffness: 300, damping: 20 }}
              >
                {part.move}
              </motion.div>
            </div>
          )}
        </div>

        {/* Part Icon Badge */}
        {part.type && (
          <div className="absolute-part-info action-part-icon-top">
            <div className="part-letter-badge">
              {getPartLetter(part.type)}
            </div>
            <img
              src={`${tabsrc}/icon_part_${part.type}.png`}
              alt={`${part.type} Icon`}
              style={{ height: "3vh" }}
              loading="lazy"
            />
          </div>
        )}

        {/* Throw Status */}
        {part.keywords && part.keywords.find((k) => { if (k.name === "空手") return true }) && (
          <div className="absolute-throw-info throw-status">
            <span className="throw-label-index">{translations.zh.t110}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
});