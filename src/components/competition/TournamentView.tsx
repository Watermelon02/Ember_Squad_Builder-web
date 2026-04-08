/**
 * TournamentView.tsx
 *
 * 比赛进度展示组件。
 * ═══════════════════════════════════════════════════════
 *  ██  修改比赛数据：直接编辑下方 PARTICIPATING_TEAM_IDS、
 *      ROUND_1_WINNERS、ROUND_2_WINNERS、FINAL_WINNER
 * ═══════════════════════════════════════════════════════
 *
 * 布局（从左到右 = 从初赛到冠军）：
 *   Round 1（最多16队，两两配对）→ Round 2 → Final → Champion
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Swords, Crown, ChevronRight, Shield } from 'lucide-react';
import { Team, FACTION_COLORS } from '../../data/types';

// ─────────────────────────────────────────────────────────────────────────────
// ██  硬编码赛程 ── 只需修改这四个常量
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 参赛队伍 ID 列表。
 * 顺序即配对顺序：[0]vs[1], [2]vs[3], [4]vs[5] ...
 * 把你的 team.id 填入此处（与 localStorage 中的 teams 一致）。
 */
export const PARTICIPATING_TEAM_IDS: string[] = [
  '1764243819518',   // 场次1 上方
  'team-2',   // 场次1 下方
  'team-3',   // 场次2 上方
  'team-4',   // 场次2 下方
  'team-5',   // 场次3 上方
  'team-6',   // 场次3 下方
  'team-7',   // 场次4 上方
  'team-8',   // 场次4 下方
  'team-9',   // 场次5 上方
  'team-10',  // 场次5 下方
  'team-11',  // 场次6 上方
  'team-12',  // 场次6 下方
  'team-13',  // 场次7 上方
  'team-14',  // 场次7 下方
  'team-15',  // 场次8 上方
  'team-16',  // 场次8 下方
];

/**
 * 第一轮各场胜者：0 = 上方队伍胜，1 = 下方队伍胜，null = 尚未决出
 * 数组长度应等于 PARTICIPATING_TEAM_IDS.length / 2
 */
export const ROUND_1_WINNERS: (0 | 1 | null)[] = [
  0,    // 场次1: team-1 vs team-2 → team-1 胜
  1,    // 场次2: team-3 vs team-4 → team-4 胜
  0,    // 场次3: team-5 vs team-6 → team-5 胜
  1,    // 场次4: team-7 vs team-8 → team-8 胜
  0,    // 场次5: team-9 vs team-10 → team-9 胜
  1,    // 场次6: team-11 vs team-12 → team-12 胜
  0,    // 场次7: team-13 vs team-14 → team-13 胜
  1,    // 场次8: team-15 vs team-16 → team-16 胜
];

/**
 * 第二轮各场胜者（配对来自 R1 胜者列表）：0 = 上方，1 = 下方，null = 尚未决出
 */
export const ROUND_2_WINNERS: (0 | 1 | null)[] = [
  0,    // R2场次1 → 前者胜
  1,    // R2场次2 → 后者胜
  0,    // R2场次3 → 前者胜
  1,    // R2场次4 → 后者胜
];

/**
 * 决赛胜者：0 = 上方，1 = 下方，null = 尚未决出
 */
export const FINAL_WINNER: 0 | 1 | null = 0;

// ─────────────────────────────────────────────────────────────────────────────
// ██  数据推导（不需要修改）
// ─────────────────────────────────────────────────────────────────────────────

function buildBracket(teamIds: string[]) {
  // Round 1
  const r1Pairs: [string | null, string | null][] = [];
  for (let i = 0; i < teamIds.length; i += 2) {
    r1Pairs.push([teamIds[i] ?? null, teamIds[i + 1] ?? null]);
  }

  const r1WinnerIds: (string | null)[] = r1Pairs.map(([a, b], i) => {
    const w = ROUND_1_WINNERS[i];
    if (w === null) return null;
    return w === 0 ? a : b;
  });

  // Round 2
  const r2Pairs: [string | null, string | null][] = [];
  for (let i = 0; i < r1WinnerIds.length; i += 2) {
    r2Pairs.push([r1WinnerIds[i] ?? null, r1WinnerIds[i + 1] ?? null]);
  }

  const r2WinnerIds: (string | null)[] = r2Pairs.map(([a, b], i) => {
    const w = ROUND_2_WINNERS[i];
    if (w === null) return null;
    return w === 0 ? a : b;
  });

  // Final
  const finalPairs: [string | null, string | null][] = [];
  let championId: string | null = null;

  if (r2WinnerIds.length <= 1) {
    // 只有≤4队时，r2 已经是冠军
    championId = r2WinnerIds[0] ?? null;
  } else {
    // 取前两个 r2 胜者打决赛
    finalPairs.push([r2WinnerIds[0] ?? null, r2WinnerIds[1] ?? null]);
    const w = FINAL_WINNER;
    championId = w === null ? null : w === 0 ? (r2WinnerIds[0] ?? null) : (r2WinnerIds[1] ?? null);
  }

  return { r1Pairs, r1WinnerIds, r2Pairs, r2WinnerIds, finalPairs, championId };
}

// ─────────────────────────────────────────────────────────────────────────────
// ██  Props
// ─────────────────────────────────────────────────────────────────────────────

interface TournamentViewProps {
  teams: Team[];
  lang: 'zh' | 'en' | 'jp';
  factionNames: Record<string, string>;
  backgroundImgsrc: string;
  onClose: () => void;
  /** 渲染 MechList 的回调，由 App.tsx 传入已绑定 props 的版本 */
  mechListRenderer: (team: Team) => React.ReactNode;
}

// ─────────────────────────────────────────────────────────────────────────────
// ██  MiniCard ── 队伍名片
// ─────────────────────────────────────────────────────────────────────────────

const MiniCard: React.FC<{
  team: Team | null;
  status: 'winner' | 'loser' | 'pending' | 'champion';
  onClick: () => void;
  factionNames: Record<string, string>;
  lang: string;
  animDelay?: number;
}> = ({ team, status, onClick, factionNames, lang, animDelay = 0 }) => {
  const isChampion = status === 'champion';
  const isLoser = status === 'loser';
  const fc = team ? (FACTION_COLORS[team.faction] ?? '#888') : '#555';

  if (!team) {
    return (
      <div style={{
        width: isChampion ? 204 : 164,
        minHeight: isChampion ? 68 : 54,
        borderRadius: 12,
        border: '1.5px dashed rgba(255,255,255,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'rgba(255,255,255,0.18)', fontSize: '0.7rem', fontStyle: 'italic',
        background: 'rgba(0,0,0,0.12)',
      }}>
        {lang === 'zh' ? '待定' : lang === 'jp' ? '未定' : 'TBD'}
      </div>
    );
  }

  const shadowColor = isChampion ? '#FFD700' : fc;
  const borderColor = isChampion
    ? 'rgba(255,215,0,0.55)'
    : status === 'winner'
      ? `${fc}88`
      : 'rgba(255,255,255,0.08)';

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isLoser ? 0.32 : 1, y: 0 }}
      transition={{ delay: animDelay, duration: 0.32, ease: 'easeOut' }}
      whileHover={!isLoser ? { scale: 1.04, transition: { duration: 0.14 } } : {}}
      whileTap={!isLoser ? { scale: 0.97 } : {}}
      onClick={() => { if (!isLoser) onClick(); }}
      style={{
        width: isChampion ? 204 : 164,
        minHeight: isChampion ? 68 : 54,
        borderRadius: isChampion ? 16 : 12,
        border: `1.5px solid ${borderColor}`,
        background: isChampion
          ? `linear-gradient(135deg, ${fc}38 0%, rgba(10,12,22,0.7) 100%)`
          : `linear-gradient(135deg, ${fc}22 0%, rgba(10,12,22,0.55) 100%)`,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow: isChampion
          ? `0 0 0 1px rgba(255,215,0,0.2), 0 8px 28px rgba(0,0,0,0.45), 0 0 32px ${fc}22`
          : status === 'winner'
            ? `0 4px 18px rgba(0,0,0,0.35), 0 0 12px ${fc}33`
            : '0 2px 10px rgba(0,0,0,0.25)',
        cursor: isLoser ? 'default' : 'pointer',
        padding: isChampion ? '0.6rem 0.9rem' : '0.42rem 0.72rem',
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        position: 'relative', overflow: 'hidden',
        textAlign: 'left',
        transition: 'box-shadow 0.3s, border-color 0.3s',
      }}
    >
      {/* 左侧色条 */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: isChampion ? 4 : 3,
        background: isChampion ? `linear-gradient(180deg, #FFD700 0%, ${fc} 100%)` : fc,
        opacity: isLoser ? 0.2 : 1,
        borderRadius: '12px 0 0 12px',
      }} />

      {/* 胜者右侧光斑 */}
      {(status === 'winner' || isChampion) && (
        <div style={{
          position: 'absolute', right: -15, top: -15, width: 55, height: 55,
          background: `radial-gradient(circle, ${isChampion ? '#FFD70028' : `${fc}28`} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      )}

      <div style={{ marginLeft: '0.35rem', flex: 1, minWidth: 0 }}>
        <div style={{
          color: isLoser ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.9)',
          fontWeight: status === 'winner' || isChampion ? 700 : 500,
          fontSize: isChampion ? '0.98rem' : '0.78rem',
          lineHeight: 1.25,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          letterSpacing: isChampion ? '0.02em' : 'normal',
        }}>
          {team.name || (lang === 'zh' ? '队伍' : 'Team')}
        </div>
        <div style={{
          marginTop: 2,
          color: isLoser ? 'rgba(255,255,255,0.15)' : (isChampion ? '#FFD700' : fc),
          fontSize: isChampion ? '0.7rem' : '0.62rem',
          fontWeight: 600, letterSpacing: '0.05em',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span>{factionNames[team.faction] ?? team.faction}</span>
          {team.totalScore > 0 && (
            <span style={{ opacity: 0.6, fontWeight: 400 }}>{team.totalScore}pt</span>
          )}
        </div>
      </div>

      {isChampion && (
        <Crown size={17} style={{
          color: '#FFD700', flexShrink: 0,
          filter: 'drop-shadow(0 0 5px #FFD70099)',
        }} />
      )}
      {status === 'winner' && !isChampion && (
        <div style={{
          width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
          background: fc, boxShadow: `0 0 6px ${fc}`,
        }} />
      )}
    </motion.button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ██  MatchBox ── 一场对战
// ─────────────────────────────────────────────────────────────────────────────

const MatchBox: React.FC<{
  teamA: Team | null;
  teamB: Team | null;
  winnerSide: 0 | 1 | null;
  onClickTeam: (t: Team) => void;
  factionNames: Record<string, string>;
  lang: string;
  animDelay?: number;
  showArrow?: boolean;
}> = ({ teamA, teamB, winnerSide, onClickTeam, factionNames, lang, animDelay = 0, showArrow }) => {
  const statusA = winnerSide === null ? 'pending' : winnerSide === 0 ? 'winner' : 'loser';
  const statusB = winnerSide === null ? 'pending' : winnerSide === 1 ? 'winner' : 'loser';

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* 对战容器 */}
      <div style={{
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.09)',
        background: 'rgba(0,0,0,0.28)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        overflow: 'hidden',
        boxShadow: '0 6px 24px rgba(0,0,0,0.4)',
      }}>
        {/* 队伍 A */}
        <div style={{ padding: '0.55rem 0.65rem 0.3rem' }}>
          <MiniCard
            team={teamA} status={statusA as any}
            onClick={() => teamA && onClickTeam(teamA)}
            factionNames={factionNames} lang={lang}
            animDelay={animDelay}
          />
        </div>

        {/* VS 分割 */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '0.12rem 1.1rem',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(255,255,255,0.025)',
        }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            color: 'rgba(255,255,255,0.22)',
            fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.14em',
          }}>
            <Swords size={8} style={{ opacity: 0.5 }} />
            VS
            <Swords size={8} style={{ opacity: 0.5, transform: 'scaleX(-1)' }} />
          </div>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
        </div>

        {/* 队伍 B */}
        <div style={{ padding: '0.3rem 0.65rem 0.55rem' }}>
          <MiniCard
            team={teamB} status={statusB as any}
            onClick={() => teamB && onClickTeam(teamB)}
            factionNames={factionNames} lang={lang}
            animDelay={animDelay + 0.05}
          />
        </div>
      </div>

      {/* 右侧连接箭头 */}
      {showArrow && (
        <div style={{
          position: 'absolute', right: -26, top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex', alignItems: 'center', gap: 0,
          pointerEvents: 'none',
        }}>
          <div style={{ width: 18, height: 1, background: 'rgba(255,255,255,0.18)' }} />
          <ChevronRight size={11} style={{ color: 'rgba(255,255,255,0.2)', marginLeft: -2 }} />
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ██  RoundLabel
// ─────────────────────────────────────────────────────────────────────────────

const RoundLabel: React.FC<{ text: string; accent?: string }> = ({
  text, accent = 'rgba(180,200,255,0.55)',
}) => (
  <div style={{
    fontSize: '0.62rem', fontWeight: 800,
    letterSpacing: '0.16em', textTransform: 'uppercase',
    color: accent, textShadow: `0 0 10px ${accent}66`,
    padding: '0.22rem 0.9rem', borderRadius: 20,
    background: 'rgba(255,255,255,0.055)',
    border: `1px solid ${accent}2a`,
    backdropFilter: 'blur(4px)',
    whiteSpace: 'nowrap',
    marginBottom: '0.9rem',
  }}>
    {text}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ██  TeamDetailModal ── 队伍详情弹窗
// ─────────────────────────────────────────────────────────────────────────────

const TeamDetailModal: React.FC<{
  team: Team;
  lang: string;
  factionNames: Record<string, string>;
  backgroundImgsrc: string;
  onClose: () => void;
  mechListRenderer: (team: Team) => React.ReactNode;
}> = ({ team, lang, factionNames, backgroundImgsrc, onClose, mechListRenderer }) => {
  const fc = FACTION_COLORS[team.faction] ?? '#888';

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ backgroundColor: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(5px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '92vw', maxWidth: 1100, height: '88vh',
          borderRadius: 20, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          border: `1px solid ${fc}44`,
          boxShadow: `0 0 0 1px rgba(255,255,255,0.07), 0 28px 70px rgba(0,0,0,0.65), 0 0 48px ${fc}1a`,
          backgroundImage: `url(${backgroundImgsrc}/background2.svg)`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 弹窗标题栏 */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.65rem 1.25rem',
          borderBottom: `1px solid ${fc}2e`,
          background: `linear-gradient(90deg, ${fc}1a 0%, rgba(0,0,0,0.55) 100%)`,
          backdropFilter: 'blur(20px)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 11, height: 11, borderRadius: '50%', background: fc, boxShadow: `0 0 8px ${fc}` }} />
            <span style={{ color: 'rgba(255,255,255,0.92)', fontWeight: 700, fontSize: '1rem' }}>
              {team.name}
            </span>
            <span style={{
              padding: '0.14rem 0.6rem', borderRadius: 8,
              background: `${fc}25`, color: fc,
              fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em',
              border: `1px solid ${fc}40`,
            }}>
              {factionNames[team.faction] ?? team.faction}
            </span>
            {team.totalScore > 0 && (
              <span style={{ color: 'rgba(255,255,255,0.32)', fontSize: '0.7rem' }}>
                {team.totalScore} pt
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '0.35rem 0.8rem', borderRadius: 10,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.65)', cursor: 'pointer',
              fontSize: '0.78rem', fontWeight: 600,
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
          >
            <X size={14} />
            {lang === 'zh' ? '关闭' : lang === 'jp' ? '閉じる' : 'Close'}
          </button>
        </div>

        {/* MechList 区域 */}
        <div style={{ flex: 1, overflow: 'auto', background: 'rgba(255,255,255,0.93)' }}>
          {mechListRenderer(team)}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ██  TournamentView ── 主组件
// ─────────────────────────────────────────────────────────────────────────────

export const TournamentView: React.FC<TournamentViewProps> = ({
  teams, lang, factionNames, backgroundImgsrc, onClose, mechListRenderer,
}) => {
  const [detailTeam, setDetailTeam] = useState<Team | null>(null);

  // id → Team 映射
  const byId = React.useMemo(() => {
    const m: Record<string, Team> = {};
    teams.forEach(t => { m[t.id] = t; });
    return m;
  }, [teams]);

  const gt = (id: string | null): Team | null => (id ? byId[id] ?? null : null);

  const { r1Pairs, r2Pairs, finalPairs, championId } = React.useMemo(
    () => buildBracket(PARTICIPATING_TEAM_IDS),
    [],
  );

  const championTeam = gt(championId);
  const hasFinal = finalPairs.length > 0;
  const hasR2 = r2Pairs.length > 0;

  const labelMap: Record<string, Record<string, string>> = {
    r1: { zh: '首轮', en: 'Round 1', jp: '1回戦' },
    r2: { zh: '次轮', en: 'Round 2', jp: '2回戦' },
    sf: { zh: '半决赛', en: 'Semi-Final', jp: '準決勝' },
    final: { zh: '决赛', en: 'Final', jp: '決勝' },
    champ: { zh: '冠军', en: 'Champion', jp: '優勝' },
  };
  const L = (k: string) => labelMap[k]?.[lang] ?? k;
  const r2Key = r2Pairs.length === 2 ? 'sf' : 'r2';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      backgroundImage: `url(${backgroundImgsrc}/background.svg)`,
      backgroundSize: 'cover', backgroundPosition: 'center',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* 深色蒙版 */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(155deg, rgba(6,8,18,0.78) 0%, rgba(4,7,20,0.68) 100%)',
      }} />

      {/* 装饰光斑 */}
      <div style={{
        position: 'absolute', top: -100, right: -100, width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,215,0,0.07) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -60, left: -60, width: 300, height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(100,162,216,0.06) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* ── 顶部导航栏 ── */}
      <div style={{
        position: 'relative', zIndex: 2, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.7rem 1.6rem',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(0,0,0,0.32)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Trophy size={20} style={{ color: '#FFD700', filter: 'drop-shadow(0 0 7px #FFD70077)' }} />
          <span style={{
            color: 'rgba(255,255,255,0.88)', fontWeight: 800,
            fontSize: '1.05rem', letterSpacing: '0.07em',
          }}>
            {lang === 'zh' ? '比赛进度' : lang === 'jp' ? '大会進行' : 'Tournament Bracket'}
          </span>

          {championTeam && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '0.18rem 0.8rem', borderRadius: 20,
                background: 'rgba(255,215,0,0.1)',
                border: '1px solid rgba(255,215,0,0.22)',
                marginLeft: 6,
              }}
            >
              <Crown size={11} style={{ color: '#FFD700' }} />
              <span style={{ color: '#FFD700', fontSize: '0.74rem', fontWeight: 700 }}>
                {championTeam.name}
              </span>
            </motion.div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={onClose}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '0.38rem 1rem', borderRadius: 10,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.13)',
            color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
            fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.03em',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
        >
          <X size={14} />
          {lang === 'zh' ? '返回' : lang === 'jp' ? '戻る' : 'Back'}
        </motion.button>
      </div>

      {/* ── 赛程主体（水平可滚动） ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        flex: 1, overflow: 'auto',
        padding: '2rem 3rem 3rem',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{
          display: 'flex', flexDirection: 'row',
          alignItems: 'center',
          gap: '3.2rem',
          minWidth: 'max-content',
          margin: '0 auto',
        }}>

          {/* 第一轮 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <RoundLabel text={L('r1')} accent="rgba(180,205,255,0.55)" />
            <div style={{
              display: 'flex', flexDirection: 'column',
              gap: '1.1rem', alignItems: 'center',
            }}>
              {r1Pairs.map(([aId, bId], i) => (
                <MatchBox
                  key={`r1-${i}`}
                  teamA={gt(aId)} teamB={gt(bId)}
                  winnerSide={ROUND_1_WINNERS[i] ?? null}
                  onClickTeam={setDetailTeam}
                  factionNames={factionNames} lang={lang}
                  animDelay={i * 0.04}
                  showArrow={hasR2}
                />
              ))}
            </div>
          </div>

          {/* 第二轮 */}
          {hasR2 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <RoundLabel
                text={L(r2Key)}
                accent={r2Key === 'sf' ? 'rgba(255,190,80,0.7)' : 'rgba(180,205,255,0.55)'}
              />
              <div style={{
                display: 'flex', flexDirection: 'column',
                gap: '2.2rem', alignItems: 'center',
              }}>
                {r2Pairs.map(([aId, bId], i) => (
                  <MatchBox
                    key={`r2-${i}`}
                    teamA={gt(aId)} teamB={gt(bId)}
                    winnerSide={ROUND_2_WINNERS[i] ?? null}
                    onClickTeam={setDetailTeam}
                    factionNames={factionNames} lang={lang}
                    animDelay={0.28 + i * 0.06}
                    showArrow={hasFinal}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 决赛 */}
          {hasFinal && finalPairs.map(([aId, bId], i) => (
            <div key={`final-${i}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <RoundLabel text={L('final')} accent="rgba(255,215,0,0.8)" />
              <MatchBox
                teamA={gt(aId)} teamB={gt(bId)}
                winnerSide={FINAL_WINNER}
                onClickTeam={setDetailTeam}
                factionNames={factionNames} lang={lang}
                animDelay={0.52}
                showArrow={!!championId}
              />
            </div>
          ))}

          {/* 冠军 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            {/* 冠军标签 */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: '#FFD700',
              textShadow: '0 0 14px #FFD70077',
            }}>
              <Crown size={12} style={{ color: '#FFD700' }} />
              {L('champ')}
              <Crown size={12} style={{ color: '#FFD700' }} />
            </div>

            {championTeam ? (
              <motion.div
                animate={{
                  boxShadow: [
                    `0 0 18px ${FACTION_COLORS[championTeam.faction] ?? '#888'}33, 0 0 0 1.5px rgba(255,215,0,0.45)`,
                    `0 0 40px ${FACTION_COLORS[championTeam.faction] ?? '#888'}55, 0 0 0 2px rgba(255,215,0,0.7)`,
                    `0 0 18px ${FACTION_COLORS[championTeam.faction] ?? '#888'}33, 0 0 0 1.5px rgba(255,215,0,0.45)`,
                  ],
                }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ borderRadius: 18 }}
              >
                <MiniCard
                  team={championTeam} status="champion"
                  onClick={() => setDetailTeam(championTeam)}
                  factionNames={factionNames} lang={lang}
                  animDelay={0.75}
                />
              </motion.div>
            ) : (
              <div style={{
                width: 204, height: 68, borderRadius: 16,
                border: '2px dashed rgba(255,215,0,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,215,0,0.22)', fontSize: '0.75rem', fontStyle: 'italic',
              }}>
                {lang === 'zh' ? '待决出' : '???'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 底部状态栏 ── */}
      <div style={{
        position: 'relative', zIndex: 2, flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0.38rem 1.6rem',
        borderTop: '1px solid rgba(255,255,255,0.055)',
        background: 'rgba(0,0,0,0.22)',
      }}>
        <Shield size={11} style={{ color: 'rgba(255,255,255,0.22)' }} />
        <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.66rem' }}>
          {lang === 'zh'
            ? `共 ${PARTICIPATING_TEAM_IDS.length} 支队伍参赛 · 点击队伍名片查看详细配置`
            : lang === 'jp'
              ? `${PARTICIPATING_TEAM_IDS.length} チーム参加 · チームカードをクリックで詳細確認`
              : `${PARTICIPATING_TEAM_IDS.length} teams · Click any team card to view build details`}
        </span>
      </div>

      {/* ── 队伍详情弹窗 ── */}
      <AnimatePresence>
        {detailTeam && (
          <TeamDetailModal
            team={detailTeam} lang={lang}
            factionNames={factionNames}
            backgroundImgsrc={backgroundImgsrc}
            onClose={() => setDetailTeam(null)}
            mechListRenderer={mechListRenderer}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TournamentView;
