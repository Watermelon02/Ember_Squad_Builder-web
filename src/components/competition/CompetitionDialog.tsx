import React, { useState } from 'react';
import { Dialog, DialogContent } from '../radix-ui/dialog';
import { FACTION_COLORS, Team, TournamentTeam } from '../../data/types';
import { exportTextTeamData } from '../../util/TextUtil';
import { MechImage } from '../custom/MechImage';
import { DroneImage } from '../custom/DroneImage';
import { exportTeamImage } from '../../util/TeamImage';
import { TeamEligibility } from '../radix-ui/TeamEligibility';
import { Badge } from '../radix-ui/badge';


interface CompetitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bannerSrc: string;
  tabsrc: string;
  teams: Team[];
  translations: any;
  lang: string;
  localImgsrc: string;
  imgsrc: string;
  factionNames: Record<string, string>;
}

// ── 参赛资格逻辑 ──────────────────────────────────────────────────────────────
const isMechEligible = (mech: any) => {
  const isUsable =
    mech.parts.torso &&
    mech.parts.chasis &&
    (mech.parts.leftHand || mech.parts.rightHand) &&
    mech.pilot;

  const bannedBackpack = ['005'].includes(mech.parts.backpack?.id || '');
  const bannedLeft = ['040', '150', '117'].includes(mech.parts.leftHand?.id || '');
  const bannedRight = ['038', '152', '119'].includes(mech.parts.rightHand?.id || '');
  const isBanned = bannedBackpack || bannedLeft || bannedRight;

  const parts = [
    mech.parts.torso, mech.parts.chasis,
    mech.parts.leftHand, mech.parts.rightHand, mech.parts.backpack,
  ].filter(Boolean);

  const hasPD = parts.some((p: any) => p.isPD);
  const allPD = parts.every((p: any) => p.isPD);

  let factionMismatch = hasPD && !allPD;
  if (mech.pilot?.faction === 'PD' && !allPD) factionMismatch = true;
  if (mech.pilot?.faction !== 'PD' && hasPD) factionMismatch = true;

  return isUsable && !isBanned && !factionMismatch;
};

const isTeamEligible = (team: Team) => team.mechs.every(isMechEligible);
// ─────────────────────────────────────────────────────────────────────────────

// ── 共享样式常量 ──────────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: '14px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)',
  border: '1px solid rgba(0,0,0,0.06)',
  padding: '1rem 1.25rem',
  marginBottom: '0.9rem',
};

const sectionLabel: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#9ca3af',
  marginBottom: '0.5rem',
  display: 'block',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.45rem 0.75rem',
  borderRadius: '9px',
  border: '1.5px solid #e5e7eb',
  background: '#f9fafb',
  color: '#111827',
  fontSize: '13px',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.15s',
};
// ─────────────────────────────────────────────────────────────────────────────

export const CompetitionDialog: React.FC<CompetitionDialogProps> = ({
  open, onOpenChange, bannerSrc, tabsrc, teams, translations, lang, localImgsrc, imgsrc, factionNames
}) => {
  const [showForm, setShowForm] = useState(false);
  const [userQQ, setUserQQ] = useState('');
  const [userName, setUserName] = useState('');
  const [team1Id, setTeam1Id] = useState('');
  const [team2Id, setTeam2Id] = useState('');

  const selectedTeam1 = teams.find(t => t.id === team1Id) ?? null;
  const selectedTeam2 = teams.find(t => t.id === team2Id) ?? null;

  const bothSelected = !!selectedTeam1 && !!selectedTeam2 && team1Id !== team2Id;
  const factionMatch = bothSelected && selectedTeam1!.faction === selectedTeam2!.faction;
  const team1Eligible = selectedTeam1 ? isTeamEligible(selectedTeam1) : true;
  const team2Eligible = selectedTeam2 ? isTeamEligible(selectedTeam2) : true;
  const bothEligible = team1Eligible && team2Eligible;
  const canExport = userQQ.trim() && userName.trim() && bothSelected && factionMatch && bothEligible;

  const validationHint = (() => {
    if (!bothSelected) return null;
    if (!factionMatch) return `两支军表派系不一致（${selectedTeam1!.faction} / ${selectedTeam2!.faction}），无法报名`;
    if (!team1Eligible) return `"${selectedTeam1!.name}" 含有禁赛部件或不符合参赛条件`;
    if (!team2Eligible) return `"${selectedTeam2!.name}" 含有禁赛部件或不符合参赛条件`;
    return null;
  })();

  const handleExport = async () => {
    if (!canExport) return;
    const tournamentTeam: TournamentTeam = {
      userQQ: userQQ.trim(),
      userName: userName.trim(),
      team1: selectedTeam1!,
      team2: selectedTeam2!,
    };
    const blob = new Blob([JSON.stringify(tournamentTeam, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${userName.trim()}_报名数据.json`;
    link.click();
    await exportTeamImage(selectedTeam1, lang, translations, tabsrc, localImgsrc, imgsrc, false);
    await exportTeamImage(selectedTeam2, lang, translations, tabsrc, localImgsrc, imgsrc, false);
  };

  const getStats = (team: Team) => [
    { l: '总分', v: team.totalScore },
    { l: '机甲', v: team.mechCount },
    { l: '大型', v: team.largeDroneCount },
    { l: '中型', v: team.mediumDroneCount },
    { l: '小型', v: team.smallDroneCount },
  ];

  const TeamCard = ({ team, eligible }: { team: Team; eligible: boolean }) => (
    <div style={{
      flex: 1,
      background: '#ffffff',
      borderRadius: '12px',
      border: eligible ? '1.5px solid #e5e7eb' : '1.5px solid #fca5a5',
      boxShadow: eligible
        ? '0 2px 10px rgba(0,0,0,0.06)'
        : '0 2px 10px rgba(220,38,38,0.08)',
      padding: '0.75rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    }}>
      {/* 标题行 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Badge
            style={{
              background: `linear-gradient(to right, ${FACTION_COLORS[team.faction]}, ${FACTION_COLORS[team.faction]}33)`,
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "0.25rem 0.5rem",
              fontWeight: 600,
              cursor: "default",
              transition: "box-shadow 0.3s, transform 0.2s",
              display: "inline-block",
            }}
            onMouseEnter={e => {
              const badge = e.currentTarget as HTMLSpanElement;
              badge.style.transform = "translateY(-1px)";
              badge.style.boxShadow =
                `0 4px 12px rgba(0,0,0,0.2),
                 0 0 12px ${FACTION_COLORS[team.faction]}88,
                 0 0 24px ${FACTION_COLORS[team.faction]}44`;
            }}
            onMouseLeave={e => {
              const badge = e.currentTarget as HTMLSpanElement;
              badge.style.transform = "translateY(0)";
            }}
          >
            {factionNames[team.faction]}
          </Badge>
          <TeamEligibility team={team} translations={translations} />
          <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#111827' }}>
            {team.name}
          </p>
        </div>
      </div>

      {/* 数值统计 */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '2px', background: '#f9fafb',
        borderRadius: '8px', padding: '6px 4px',
      }}>
        {getStats(team).map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ color: '#9ca3af', fontSize: '0.46rem', lineHeight: 1.2 }}>{s.l}</div>
            <div style={{ color: '#374151', fontWeight: 600, fontSize: '0.62rem' }}>{s.v ?? 0}</div>
          </div>
        ))}
      </div>

      {/* 机甲 + 无人机 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', paddingLeft: 2 }}>
        {(team.mechs ?? []).map((m, i) => (
          <div key={`m-${m.id ?? i}`}>
            <MechImage mech={m} tabsrc={tabsrc} translation={translations} />
          </div>
        ))}
        {(team.drones ?? []).map((d, i) => (
          <div key={`d-${d.id}-${i}`}>
            <DroneImage drone={d} tabsrc={tabsrc} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{
        maxWidth: '58vw', width: '58vw', maxHeight: '88vh', height: 'auto',
        padding: 0, overflow: 'hidden', borderRadius: '20px',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 60px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.1)',
        background: '#f3f4f6',
        border: '1px solid rgba(0,0,0,0.08)',
      }}>

        {/* ── 横幅 ── */}
        <div style={{ width: '100%', height: '28vh', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
          <img src={bannerSrc} alt="比赛横幅"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }} />
          {/* 渐变遮罩 */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.3) 60%, #f3f4f6 100%)',
            pointerEvents: 'none',
          }} />
          {/* 状态徽章 */}
          <div style={{
            position: 'absolute', top: '1rem', left: '1.25rem',
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '999px', padding: '4px 12px',
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80',
              boxShadow: '0 0 6px #4ade80',
              animation: 'pulse 2s infinite',
            }} />
            <span style={{ fontSize: '11px', color: '#ffffff', fontWeight: 600, letterSpacing: '0.04em' }}>进行中</span>
          </div>
        </div>

        {/* ── 可滚动内容区 ── */}
        <div style={{
          overflowY: 'auto', flex: 1,
          padding: '1.25rem 1.5rem 1.5rem',
          background: '#f3f4f6',
        }}>

          {/* 标题 */}
          <h2 style={{
            margin: '0 0 1rem',
            fontSize: '1.3rem', fontWeight: 800,
            color: '#111827', lineHeight: 1.3,
            letterSpacing: '-0.01em',
          }}>
            首届官方线上比赛「马蒂尼杯」！
          </h2>

          {/* 奖励卡片 */}
          <div style={{
            ...card,
            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
            border: '1px solid #fde68a',
            boxShadow: '0 4px 16px rgba(239,159,39,0.15), 0 1px 4px rgba(239,159,39,0.1)',
            display: 'flex', alignItems: 'flex-start', gap: '12px',
            padding: '1rem 1.25rem',
          }}>
            <span style={{ fontSize: '22px', flexShrink: 0, lineHeight: 1 }}>🏆</span>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: '11px', fontWeight: 700, color: '#92400e', letterSpacing: '0.06em', textTransform: 'uppercase' }}>冠军奖励</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#78350f', lineHeight: 1.6 }}>
                <strong>8月DC展线下比赛资格</strong>，由雀替报销差旅费！
              </p>
            </div>
          </div>

          {/* 赛制 */}
          <div style={card}>
            <span style={sectionLabel}>比赛赛制</span>
            <p style={{ margin: 0, fontSize: '13px', color: '#374151', lineHeight: 1.8 }}>赛制详情。</p>
          </div>

          {/* 两列卡片：报名方式 + 教程 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.9rem' }}>
            {/* 报名方式 */}
            <div style={{
              ...card,
              margin: 0,
              display: 'flex', flexDirection: 'column', gap: '0.35rem',
            }}>
              <span style={sectionLabel}>报名方式</span>
              <p style={{ margin: 0, fontSize: '13px', color: '#374151', lineHeight: 1.7 }}>
                向 QQ{' '}
                <strong style={{
                  fontSize: '15px', color: '#111827',
                  background: '#f3f4f6', padding: '1px 6px',
                  borderRadius: '5px', fontVariantNumeric: 'tabular-nums',
                }}>
                  3975811496
                </strong>{' '}
                的负责人提交导出的报名数据
              </p>
              <button onClick={() => setShowForm(v => !v)} style={{
                padding: '0.48rem 1.2rem', borderRadius: '10px', border: 'none',
                background: showForm
                  ? '#f3f4f6'
                  : 'linear-gradient(135deg, #f59e0b, #EF9F27)',
                color: showForm ? '#374151' : '#1a0f00',
                fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                boxShadow: showForm
                  ? '0 1px 4px rgba(0,0,0,0.08)'
                  : '0 4px 14px rgba(239,159,39,0.4)',
                transition: 'all 0.15s',
                letterSpacing: '0.02em',
              }}>
                {showForm ? '收起报名' : '📋 导出报名数据'}
              </button>
            </div>

            {/* 教程 */}
            <div style={{
              ...card,
              margin: 0,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.6rem',
            }}>
              <div>
                <span style={sectionLabel}>线上对战方式教程</span>
                <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>点击下方按钮前往 Bilibili 观看</p>
              </div>
              <a
                href="https://www.bilibili.com/video/BV1kBMPzHELa"
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                  padding: '0.45rem 0', borderRadius: '9px',
                  background: '#eeeeee', color: 'black',
                  fontSize: '12px', fontWeight: 600, textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                  transition: 'opacity 0.15s',
                }}
              >
                ▶ 观看 TTS 使用教程
              </a>
            </div>
          </div>

          {/* ── 报名表单（折叠） ── */}
          {showForm && (
            <div style={{
              ...card,
              boxShadow: '0 4px 20px rgba(0,0,0,0.09), 0 1px 4px rgba(0,0,0,0.05)',
            }}>
              <span style={sectionLabel}>导出报名数据</span>

              {/* QQ + 参赛名 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '0.65rem' }}>
                {[
                  { label: 'QQ 号', ph: '请输入你的 QQ 号', val: userQQ, set: setUserQQ },
                  { label: '名字（不需要真实姓名）', ph: '请输入名字', val: userName, set: setUserName },
                ].map(({ label, ph, val, set }) => (
                  <div key={label}>
                    <label style={{ ...sectionLabel, marginBottom: '5px' }}>{label}</label>
                    <input
                      style={inputStyle}
                      placeholder={ph}
                      value={val}
                      onChange={e => set(e.target.value)}
                    />
                  </div>
                ))}
              </div>

              {/* 军表选择 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '0.75rem' }}>
                {[
                  { label: '参赛军表 1', val: team1Id, set: setTeam1Id, disabledId: team2Id },
                  { label: '参赛军表 2', val: team2Id, set: setTeam2Id, disabledId: team1Id },
                ].map(({ label, val, set, disabledId }) => (
                  <div key={label}>
                    <label style={{ ...sectionLabel, marginBottom: '5px' }}>{label}</label>
                    <select style={inputStyle} value={val} onChange={e => set(e.target.value)}>
                      <option value="">-- 请选择 --</option>
                      {teams.map(t => (
                        <option key={t.id} value={t.id} disabled={t.id === disabledId}>
                          {t.name}（{t.totalScore}分）
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* 校验提示 */}
              {validationHint && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '0.55rem 0.85rem', borderRadius: '9px',
                  background: '#fef2f2', border: '1px solid #fecaca',
                  marginBottom: '0.75rem',
                  boxShadow: '0 1px 4px rgba(220,38,38,0.06)',
                }}>
                  <span style={{ fontSize: '13px', flexShrink: 0 }}>⚠️</span>
                  <p style={{ margin: 0, fontSize: '12px', color: '#dc2626', fontWeight: 500 }}>{validationHint}</p>
                </div>
              )}

              {/* 军表预览卡 */}
              {(selectedTeam1 || selectedTeam2) && (
                <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem' }}>
                  {selectedTeam1 && <TeamCard team={selectedTeam1} eligible={team1Eligible} />}
                  {selectedTeam2 && <TeamCard team={selectedTeam2} eligible={team2Eligible} />}
                </div>
              )}

              {/* 导出按钮 */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                <button
                  onClick={handleExport}
                  disabled={!canExport}
                  style={{
                    padding: '0.5rem 1.4rem', borderRadius: '10px', border: 'none',
                    background: 'linear-gradient(135deg, #f59e0b, #EF9F27)',
                    color: '#1a0f00',
                    fontSize: '13px', fontWeight: 700,
                    cursor: canExport ? 'pointer' : 'not-allowed',
                    boxShadow: canExport ? '0 4px 12px rgba(239,159,39,0.35)' : 'none',
                    transition: 'all 0.15s',
                    letterSpacing: '0.02em',
                  }}
                >
                  ↓ 下载报名数据
                </button>
                <button onClick={() => {
                  navigator.clipboard.writeText('3975811496')
                  alert('QQ 号已复制到剪贴板！');
                }} style={{
                  padding: '0.48rem 1.1rem', borderRadius: '10px', border: 'none',
                  background: '#eeeeee', color: 'black',
                  fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  transition: 'opacity 0.15s',
                }}>
                  复制 QQ 号报名
                </button>
              </div>
            </div>
          )}

          {/* ── 底部操作栏 ── */}
          <div style={{
            display: 'flex', gap: '0.6rem', justifyContent: 'flex-end',
            paddingTop: '0.25rem',
          }}>
            <button onClick={() => onOpenChange(false)} style={{
              padding: '0.48rem 1.1rem', borderRadius: '10px',
              border: '1.5px solid #e5e7eb',
              background: '#ffffff', color: '#6b7280',
              fontSize: '13px', fontWeight: 500, cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              transition: 'border-color 0.15s',
            }}>
              关闭
            </button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};