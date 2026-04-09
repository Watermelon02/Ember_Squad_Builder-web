/**
 * TournamentView.tsx (v6)
 *
 * 变更（相对 v5）：
 * 1. 各轮对阵始终按胜场分组显示，移除切换按钮
 * 2. 性能优化：
 *    - 移除 mech/drone 列表上的 AnimatePresence mode="popLayout"（昂贵的布局动画）
 *    - 减少 motion.div 包装层，静态内容不再使用 framer-motion
 *    - 缓存 computeWinsBeforeRound 结果，避免每轮重复计算
 *    - 减少 backdrop-filter 使用（GPU 开销大）
 *    - 降低动画延迟密度
 */

import React, { useState, useMemo, memo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Swords, Crown, Shield, BarChart2, GitMerge, Layers } from 'lucide-react';
import { Team, TournamentTeam, FACTION_COLORS } from '../../data/types';
import { MechImage } from '../custom/MechImage';
import { DroneImage } from '../custom/DroneImage';
import { PARTICIPATING_TOURNAMENT_TEAMS } from './data/ParticipatingTeams';

// ════════════════════════════════════════════════════════════
// ██  配置接口
// ════════════════════════════════════════════════════════════

interface MatchConfig {
  selectionA: 0 | 1;
  selectionB: 0 | 1;
  winner: 0 | 1 | null;
}

interface SwissMatch {
  playerAIdx: number;
  playerBIdx: number;
  selectionA: 0 | 1;
  selectionB: 0 | 1;
  winner: 0 | 1 | null;
}

type RoundResult = 'win' | 'loss' | 'tbd' | 'none' | 'bye';

interface SwissStanding {
  player: TournamentTeam;
  idx: number;
  wins: number;
  losses: number;
  roundResults: RoundResult[];
}

// ════════════════════════════════════════════════════════════
// ██  ★ 硬编码赛程数据
// ════════════════════════════════════════════════════════════

export const TOURNAMENT_MODE: 'elimination' | 'swiss' | 'both' = 'both';

export const MATCH_CONFIGS: MatchConfig[][] = [
  [
    { selectionA: 0, selectionB: 0, winner: 0 },
    { selectionA: 0, selectionB: 1, winner: 0 },
  ]
];

export const SWISS_ROUNDS: SwissMatch[][] = [
  [
    { playerAIdx:  0, playerBIdx:  1, selectionA: 0, selectionB: 0, winner: 0 },
    { playerAIdx:  4, playerBIdx:  5, selectionA: 0, selectionB: 1, winner: 0 },
    { playerAIdx:  8, playerBIdx:  9, selectionA: 0, selectionB: 0, winner: 0 },
    { playerAIdx: 10, playerBIdx: 11, selectionA: 1, selectionB: 1, winner: 0 },
    { playerAIdx: 12, playerBIdx: 13, selectionA: 0, selectionB: 1, winner: 0 },
    { playerAIdx:  2, playerBIdx:  3, selectionA: 1, selectionB: 0, winner: 1 },
    { playerAIdx:  6, playerBIdx:  7, selectionA: 1, selectionB: 0, winner: 1 },
    // idx 14 轮空
  ],
  [
    { playerAIdx:  0, playerBIdx:  3, selectionA: 1, selectionB: 1, winner: 0 },
    { playerAIdx:  4, playerBIdx:  7, selectionA: 0, selectionB: 0, winner: 1 },
    { playerAIdx:  8, playerBIdx: 10, selectionA: 0, selectionB: 1, winner: 0 },
    { playerAIdx: 12, playerBIdx: 14, selectionA: 1, selectionB: 0, winner: 1 },
    { playerAIdx:  1, playerBIdx:  2, selectionA: 1, selectionB: 0, winner: 1 },
    { playerAIdx:  5, playerBIdx:  6, selectionA: 0, selectionB: 1, winner: 0 },
    { playerAIdx:  9, playerBIdx: 11, selectionA: 1, selectionB: 0, winner: 1 },
    // idx 13 轮空
  ],
  [
    { playerAIdx:  0, playerBIdx:  7, selectionA: 0, selectionB: 1, winner: 1 },
    { playerAIdx:  8, playerBIdx: 14, selectionA: 1, selectionB: 0, winner: 0 },
    { playerAIdx:  3, playerBIdx:  4, selectionA: 0, selectionB: 1, winner: 1 },
    { playerAIdx: 10, playerBIdx:  2, selectionA: 0, selectionB: 0, winner: 0 },
    { playerAIdx:  5, playerBIdx: 11, selectionA: 1, selectionB: 1, winner: 1 },
    { playerAIdx:  1, playerBIdx:  6, selectionA: 0, selectionB: 0, winner: 1 },
    { playerAIdx:  9, playerBIdx: 13, selectionA: 1, selectionB: 1, winner: 0 },
    // idx 12 轮空
  ],
  [
    { playerAIdx:  7, playerBIdx:  8, selectionA: 0, selectionB: 0, winner: null },
    { playerAIdx:  0, playerBIdx:  4, selectionA: 1, selectionB: 0, winner: null },
    { playerAIdx: 10, playerBIdx: 11, selectionA: 0, selectionB: 1, winner: null },
    { playerAIdx: 14, playerBIdx:  2, selectionA: 1, selectionB: 0, winner: null },
    { playerAIdx:  3, playerBIdx: 12, selectionA: 0, selectionB: 1, winner: null },
    { playerAIdx:  5, playerBIdx:  6, selectionA: 1, selectionB: 0, winner: null },
    { playerAIdx:  1, playerBIdx:  9, selectionA: 0, selectionB: 1, winner: null },
    // idx 13 轮空
  ],
];

// ════════════════════════════════════════════════════════════
// ██  工具函数
// ════════════════════════════════════════════════════════════

const nextPow2 = (n: number) => (n <= 1 ? 1 : Math.pow(2, Math.ceil(Math.log2(n))));

const getCfg = (round: number, idx: number): MatchConfig =>
  MATCH_CONFIGS[round]?.[idx] ?? { selectionA: 0, selectionB: 0, winner: null };

function subWinner(
  idxs: number[], round: number, match: number,
  pp: (TournamentTeam | null)[],
): TournamentTeam | null {
  if (idxs.length === 1) return pp[idxs[0]] ?? null;
  if (idxs.length === 2) {
    const pA = pp[idxs[0]] ?? null, pB = pp[idxs[1]] ?? null;
    if (!pB) return pA;
    if (!pA) return pB;
    const c = getCfg(round, match);
    return c.winner == null ? null : c.winner === 0 ? pA : pB;
  }
  const c = getCfg(round, match);
  if (c.winner == null) return null;
  const h = idxs.length >> 1;
  return c.winner === 0
    ? subWinner(idxs.slice(0, h), round - 1, match * 2, pp)
    : subWinner(idxs.slice(h), round - 1, match * 2 + 1, pp);
}

function getByeIndices(roundIdx: number, players: (TournamentTeam | null)[]): number[] {
  const round = SWISS_ROUNDS[roundIdx];
  if (!round) return [];
  const inMatch = new Set<number>();
  round.forEach(m => { inMatch.add(m.playerAIdx); inMatch.add(m.playerBIdx); });
  return players.reduce<number[]>((acc, p, i) => {
    if (p && !inMatch.has(i)) acc.push(i);
    return acc;
  }, []);
}

function computeSwissStandings(players: (TournamentTeam | null)[]): SwissStanding[] {
  const map: Record<number, SwissStanding> = {};
  players.forEach((p, i) => {
    if (p) map[i] = { player: p, idx: i, wins: 0, losses: 0, roundResults: Array(SWISS_ROUNDS.length).fill('none') };
  });
  SWISS_ROUNDS.forEach((round, rIdx) => {
    const inMatch = new Set<number>();
    round.forEach(({ playerAIdx: ai, playerBIdx: bi, winner }) => {
      inMatch.add(ai); inMatch.add(bi);
      if (!map[ai] || !map[bi]) return;
      if (winner == null) {
        map[ai].roundResults[rIdx] = 'tbd';
        map[bi].roundResults[rIdx] = 'tbd';
      } else {
        map[ai].roundResults[rIdx] = winner === 0 ? 'win' : 'loss';
        map[bi].roundResults[rIdx] = winner === 1 ? 'win' : 'loss';
        if (winner === 0) { map[ai].wins++; map[bi].losses++; }
        else { map[bi].wins++; map[ai].losses++; }
      }
    });
    Object.keys(map).forEach(k => {
      const idx = Number(k);
      if (!inMatch.has(idx)) { map[idx].roundResults[rIdx] = 'bye'; map[idx].wins++; }
    });
  });
  return Object.values(map).sort((a, b) => b.wins - a.wins || a.losses - b.losses);
}

/**
 * 计算每一轮开始前各选手的胜场数（一次性计算所有轮次）。
 * 返回 winsMap[roundIdx][playerIdx] = wins
 */
function computeAllWinsBeforeRounds(): Record<number, number>[] {
  const result: Record<number, number>[] = [];
  const wins: Record<number, number> = {};
  PARTICIPATING_TOURNAMENT_TEAMS.forEach((p, i) => { if (p) wins[i] = 0; });

  for (let r = 0; r < SWISS_ROUNDS.length; r++) {
    // 快照当前胜场数
    result.push({ ...wins });

    const round = SWISS_ROUNDS[r];
    if (!round) continue;
    const inMatch = new Set<number>();
    round.forEach(({ playerAIdx: ai, playerBIdx: bi, winner }) => {
      inMatch.add(ai); inMatch.add(bi);
      if (winner === 0) wins[ai] = (wins[ai] ?? 0) + 1;
      else if (winner === 1) wins[bi] = (wins[bi] ?? 0) + 1;
    });
    Object.keys(wins).forEach(k => {
      const idx = Number(k);
      if (!inMatch.has(idx)) wins[idx] = (wins[idx] ?? 0) + 1;
    });
  }
  return result;
}

/** 按胜场数映射分组颜色 */
function bracketColor(wins: number): string {
  if (wins === 0) return '#ef4444';
  if (wins >= Math.ceil(SWISS_ROUNDS.length * 0.6)) return '#22c55e';
  if (wins >= Math.ceil(SWISS_ROUNDS.length * 0.3)) return '#f59e0b';
  return '#94a3b8';
}

// ════════════════════════════════════════════════════════════
// ██  QQ 头像
// ════════════════════════════════════════════════════════════

const FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'%3E" +
  "%3Ccircle cx='18' cy='18' r='18' fill='%23b0b8c8'/%3E" +
  "%3Ccircle cx='18' cy='14' r='7' fill='%23fff'/%3E" +
  "%3Cellipse cx='18' cy='31' rx='11' ry='8' fill='%23fff'/%3E%3C/svg%3E";

const QQAvatar: React.FC<{ qq: string; size?: number }> = memo(({ qq, size = 26 }) => (
  <img src={`https://q1.qlogo.cn/g?b=qq&nk=${qq}&s=5`} alt="" width={size} height={size}
    style={{ borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(255,255,255,0.6)', background: '#c8cdd6', flexShrink: 0 }}
    onError={e => { e.currentTarget.src = FALLBACK; }} />
));

// ════════════════════════════════════════════════════════════
// ██  共用：表一/表二 查看按钮组
// ════════════════════════════════════════════════════════════

const TeamViewButtons: React.FC<{
  player: TournamentTeam;
  activeSlot?: 0 | 1;
  onViewTeam: (t: Team) => void;
  lang: string;
  style?: React.CSSProperties;
}> = memo(({ player, activeSlot, onViewTeam, lang, style }) => {
  const [hov, setHov] = useState<0 | 1 | null>(null);
  return (
    <div style={{ display: 'flex', gap: 3, ...style }}>
      {([0, 1] as const).map(s => {
        const t = s === 0 ? player.team1 : player.team2;
        const fc = FACTION_COLORS[t.faction] ?? '#888';
        const btnC = s === 0 ? '#3b82f6' : '#a855f7';
        const isActive = s === activeSlot;
        const isH = hov === s;
        const lbl = s === 0
          ? (lang === 'zh' ? '表一' : lang === 'jp' ? 'チーム①' : 'T1')
          : (lang === 'zh' ? '表二' : lang === 'jp' ? 'チーム②' : 'T2');
        return (
          <button key={s} onClick={e => { e.stopPropagation(); onViewTeam(t); }}
            onMouseEnter={() => setHov(s)} onMouseLeave={() => setHov(null)}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, padding: '0.17rem 0', borderRadius: 6, border: `1px solid ${isActive ? btnC + '66' : isH ? btnC + '44' : 'rgba(255,255,255,0.12)'}`, background: isActive ? `${btnC}1a` : isH ? `${btnC}0e` : 'rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'all 0.13s' }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: isActive || isH ? fc : 'rgba(160,160,160,0.4)', boxShadow: isActive || isH ? `0 0 4px ${fc}` : 'none', transition: 'all 0.13s', flexShrink: 0 }} />
            <span style={{ fontSize: '0.5rem', fontWeight: 700, color: isActive ? btnC : isH ? `${btnC}cc` : 'rgba(255,255,255,0.4)', transition: 'color 0.13s' }}>{lbl}</span>
            {isActive && <span style={{ fontSize: '0.44rem', color: btnC, opacity: 0.8 }}>★</span>}
          </button>
        );
      })}
    </div>
  );
});

// ════════════════════════════════════════════════════════════
// ██  PlayerCard (优化：移除 mech/drone 的 AnimatePresence)
// ════════════════════════════════════════════════════════════

const ITEM_SIZE = 30;
const ITEMS_PER_ROW = 4;

const PlayerCard: React.FC<{
  player: TournamentTeam | null; slot: 0 | 1;
  status: 'winner' | 'loser' | 'pending' | 'champion';
  onClickTeam: (t: Team) => void;
  factionNames: Record<string, string>; lang: string; tabsrc: string; translations: any;
  animDelay?: number; champion?: boolean; hideSlot?: boolean;
}> = memo(({ player, slot, status, onClickTeam, factionNames, lang, tabsrc, translations, animDelay = 0, champion = false, hideSlot = false }) => {
  const isLoser = status === 'loser';
  const isWinner = status === 'winner' || champion;

  if (!player) {
    return (
      <div style={{ width: champion ? 224 : 200, minHeight: 60, borderRadius: 13, border: '1.5px dashed rgba(180,180,180,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(120,120,120,0.38)', fontSize: '0.7rem', fontStyle: 'italic', background: 'rgba(255,255,255,0.1)' }}>
        {lang === 'zh' ? '轮空 / 待定' : lang === 'jp' ? '不戦勝 / 未定' : 'Bye / TBD'}
      </div>
    );
  }

  const team = slot === 0 ? player.team1 : player.team2;
  const fc = FACTION_COLORS[team.faction] ?? '#888';
  const borderC = champion ? 'rgba(255,215,0,0.6)' : isWinner ? `${fc}55` : 'rgba(255,255,255,0.2)';
  const shadow = champion ? `0 0 0 2px rgba(255,215,0,0.28), 0 8px 24px rgba(0,0,0,0.15)` : isWinner ? `0 4px 14px rgba(0,0,0,0.11), 0 0 10px ${fc}22` : '0 2px 7px rgba(0,0,0,0.07)';
  const stats = [
    { l: lang === 'zh' ? '分' : 'PT', v: team.totalScore, hi: team.totalScore > 900 },
    { l: lang === 'zh' ? '机' : 'MC', v: team.mechCount },
    { l: lang === 'zh' ? '大' : 'L',  v: team.largeDroneCount },
    { l: lang === 'zh' ? '中' : 'M',  v: team.mediumDroneCount },
    { l: lang === 'zh' ? '小' : 'S',  v: team.smallDroneCount },
  ];
  const totalItems = (team.mechs?.length ?? 0) + (team.drones?.length ?? 0);
  const ph = (totalItems % ITEMS_PER_ROW === 0) ? 0 : ITEMS_PER_ROW - totalItems % ITEMS_PER_ROW;
  const slotColor = slot === 0 ? '#3b82f6' : '#a855f7';
  const slotLabel = slot === 0
    ? (lang === 'zh' ? '表一' : lang === 'jp' ? 'チーム①' : 'Team 1')
    : (lang === 'zh' ? '表二' : lang === 'jp' ? 'チーム②' : 'Team 2');

  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: isLoser ? 0.32 : 1, y: 0 }}
      transition={{ delay: animDelay, duration: 0.24, ease: 'easeOut' }}
      whileHover={!isLoser ? { scale: 1.015, transition: { duration: 0.1 } } : {}}
      whileTap={!isLoser ? { scale: 0.975 } : {}}
      onClick={() => { if (!isLoser) onClickTeam(team); }}
      style={{ width: champion ? 224 : 200, borderRadius: 13, overflow: 'hidden', border: `1.5px solid ${borderC}`, background: isLoser ? 'rgba(210,210,210,0.14)' : 'rgba(255,255,255,0.36)', boxShadow: shadow, cursor: isLoser ? 'default' : 'pointer', padding: '0.42rem 0.52rem', display: 'flex', flexDirection: 'column', gap: '0.24rem', textAlign: 'left', position: 'relative' }}
    >
      {champion && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#FFD700,#FFA500,#FFD700)', borderRadius: '13px 13px 0 0' }} />}
      {!champion && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: isWinner ? fc : 'rgba(180,180,180,0.15)', borderRadius: '13px 0 0 13px' }} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, paddingLeft: 5 }}>
        <QQAvatar qq={player.userQQ} size={22} />
        <span style={{ flex: 1, fontWeight: 700, fontSize: '0.74rem', color: isLoser ? 'rgba(80,80,80,0.4)' : 'rgba(15,15,15,0.88)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{player.userName}</span>
        {!hideSlot && <span style={{ padding: '0.08rem 0.32rem', borderRadius: 5, fontSize: '0.52rem', fontWeight: 700, background: `${slotColor}20`, color: slotColor, border: `1px solid ${slotColor}44`, flexShrink: 0 }}>{slotLabel}</span>}
        {champion && <Crown size={12} style={{ color: '#FFD700', filter: 'drop-shadow(0 0 4px #FFD70099)', flexShrink: 0 }} />}
        {isWinner && !champion && <div style={{ width: 6, height: 6, borderRadius: '50%', background: fc, boxShadow: `0 0 5px ${fc}`, flexShrink: 0 }} />}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 5 }}>
        <span style={{ background: `linear-gradient(to right,${fc},${fc}88)`, color: 'white', borderRadius: 5, padding: '0.07rem 0.34rem', fontSize: '0.54rem', fontWeight: 700, boxShadow: `0 1px 5px ${fc}44`, flexShrink: 0 }}>{factionNames[team.faction] ?? team.faction}</span>
        <span style={{ color: isLoser ? 'rgba(80,80,80,0.36)' : 'rgba(40,40,40,0.72)', fontWeight: 500, fontSize: '0.67rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{team.name}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 2, paddingLeft: 5 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ color: 'rgba(100,100,100,0.52)', fontSize: '0.46rem', lineHeight: 1.2 }}>{s.l}</div>
            <div style={{ color: s.hi ? '#dc2626' : (isLoser ? 'rgba(100,100,100,0.34)' : 'rgba(40,40,40,0.7)'), fontWeight: s.hi ? 700 : 500, fontSize: '0.62rem' }}>{s.v ?? 0}</div>
          </div>
        ))}
      </div>
      {/* 优化：移除 AnimatePresence mode="popLayout"，改用简单 div */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', paddingLeft: 3 }}>
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
        {Array.from({ length: ph }).map((_, i) => (
          <div key={`ph-${i}`} style={{ width: ITEM_SIZE, height: ITEM_SIZE, borderRadius: 6, backgroundImage: 'repeating-linear-gradient(45deg,#eee,#eee 3px,#ddd 3px,#ddd 6px)' }} />
        ))}
      </div>
      {!isLoser && <TeamViewButtons player={player} activeSlot={hideSlot ? undefined : slot} onViewTeam={onClickTeam} lang={lang} style={{ paddingLeft: 3, marginTop: 1 }} />}
    </motion.button>
  );
});

// ════════════════════════════════════════════════════════════
// ██  SingleMatch
// ════════════════════════════════════════════════════════════

const SingleMatch: React.FC<{
  playerA: TournamentTeam | null; playerB: TournamentTeam | null;
  config: MatchConfig; onClickTeam: (t: Team) => void;
  factionNames: Record<string, string>; lang: string; tabsrc: string; translations: any;
  animDelay?: number; roundLabel?: string;
}> = ({ playerA, playerB, config, onClickTeam, factionNames, lang, tabsrc, translations, animDelay = 0, roundLabel }) => {
  const byeB = !playerB, byeA = !playerA;
  const stA = byeB ? 'winner' : byeA ? 'loser' : config.winner == null ? 'pending' : config.winner === 0 ? 'winner' : 'loser';
  const stB = byeA ? 'winner' : byeB ? 'loser' : config.winner == null ? 'pending' : config.winner === 1 ? 'winner' : 'loser';
  const tbd = config.winner == null && !!playerA && !!playerB;
  return (
    <div>
      {roundLabel && <div style={{ fontSize: '0.53rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(200,220,255,0.6)', marginBottom: 4 }}>{roundLabel}</div>}
      <div style={{ borderRadius: 15, border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.07)', overflow: 'hidden', boxShadow: '0 5px 16px rgba(0,0,0,0.15)' }}>
        <div style={{ padding: '0.42rem 0.48rem 0.2rem' }}>
          <PlayerCard player={playerA} slot={config.selectionA} status={stA as any} onClickTeam={onClickTeam} factionNames={factionNames} lang={lang} tabsrc={tabsrc} translations={translations} animDelay={animDelay} hideSlot={tbd} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', padding: '0.06rem 0.85rem', borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'rgba(0,0,0,0.03)' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.07)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'rgba(100,100,100,0.36)', fontSize: '0.52rem', fontWeight: 800, margin: '0 0.4rem' }}>
            <Swords size={6} style={{ opacity: 0.32 }} />VS<Swords size={6} style={{ opacity: 0.32, transform: 'scaleX(-1)' }} />
          </div>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.07)' }} />
        </div>
        <div style={{ padding: '0.2rem 0.48rem 0.42rem' }}>
          <PlayerCard player={playerB} slot={config.selectionB} status={stB as any} onClickTeam={onClickTeam} factionNames={factionNames} lang={lang} tabsrc={tabsrc} translations={translations} animDelay={animDelay + 0.04} hideSlot={tbd} />
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// ██  BracketGroup & Connector
// ════════════════════════════════════════════════════════════

const Connector: React.FC = () => (
  <div style={{ flexShrink: 0, color: 'rgba(255,255,255,0.25)', fontSize: '1.3rem', lineHeight: 1, userSelect: 'none', paddingBottom: 1 }}>›</div>
);

const BracketGroup: React.FC<{ source1: React.ReactNode; source2: React.ReactNode; output: React.ReactNode; innerGap?: number; colGap?: number }> =
  ({ source1, source2, output, innerGap = 10, colGap = 20 }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: innerGap }}>{source1}{source2}</div>
      <div style={{ width: colGap, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Connector /></div>
      {output}
    </div>
  );

// ════════════════════════════════════════════════════════════
// ██  SwissMatchCard (优化：移除 backdrop-filter)
// ════════════════════════════════════════════════════════════

const SwissMatchCard: React.FC<{
  match: SwissMatch; players: (TournamentTeam | null)[];
  onViewTeam: (t: Team) => void; factionNames: Record<string, string>;
  lang: string; tabsrc: string; translations: any; animDelay?: number;
}> = memo(({ match, players, onViewTeam, factionNames, lang, tabsrc, translations, animDelay = 0 }) => {
  const pA = players[match.playerAIdx] ?? null;
  const pB = players[match.playerBIdx] ?? null;
  const tbd = match.winner == null;
  const stA = tbd ? 'pending' : match.winner === 0 ? 'winner' : 'loser';
  const stB = tbd ? 'pending' : match.winner === 1 ? 'winner' : 'loser';
  return (
    <div style={{ borderRadius: 15, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.07)', boxShadow: '0 5px 16px rgba(0,0,0,0.15)' }}>
      <div style={{ padding: '0.42rem 0.48rem 0.2rem' }}>
        <PlayerCard player={pA} slot={match.selectionA} status={stA as any} onClickTeam={onViewTeam} factionNames={factionNames} lang={lang} tabsrc={tabsrc} translations={translations} animDelay={animDelay} hideSlot={tbd} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0.06rem 0.85rem', borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'rgba(0,0,0,0.03)' }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.07)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'rgba(100,100,100,0.36)', fontSize: '0.52rem', fontWeight: 800, margin: '0 0.4rem' }}>
          <Swords size={6} style={{ opacity: 0.32 }} />VS<Swords size={6} style={{ opacity: 0.32, transform: 'scaleX(-1)' }} />
        </div>
        <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.07)' }} />
      </div>
      <div style={{ padding: '0.2rem 0.48rem 0.42rem' }}>
        <PlayerCard player={pB} slot={match.selectionB} status={stB as any} onClickTeam={onViewTeam} factionNames={factionNames} lang={lang} tabsrc={tabsrc} translations={translations} animDelay={animDelay + 0.04} hideSlot={tbd} />
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════
// ██  ByeCard (优化：移除 motion 包装和 backdrop-filter)
// ════════════════════════════════════════════════════════════

const ByeCard: React.FC<{
  player: TournamentTeam; factionNames: Record<string, string>;
  lang: string; tabsrc: string; translations: any;
  onViewTeam: (t: Team) => void; animDelay?: number;
}> = memo(({ player, factionNames, lang, tabsrc, translations, onViewTeam }) => {
  const lbl = lang === 'zh' ? '轮空 · +1 胜场' : lang === 'jp' ? '不戦勝 +1W' : 'BYE · +1 Win';
  return (
    <div style={{ borderRadius: 15, overflow: 'hidden', border: '1px solid rgba(245,158,11,0.35)', background: 'rgba(245,158,11,0.05)', boxShadow: '0 3px 10px rgba(0,0,0,0.12)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.26rem 0.65rem', borderBottom: '1px solid rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.1)' }}>
        <span style={{ fontSize: '0.8rem', lineHeight: 1 }}>🏖️</span>
        <span style={{ fontSize: '0.52rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.08em' }}>{lbl}</span>
      </div>
      <div style={{ padding: '0.42rem 0.48rem' }}>
        <PlayerCard player={player} slot={0} status="winner" onClickTeam={onViewTeam} factionNames={factionNames} lang={lang} tabsrc={tabsrc} translations={translations} animDelay={0} hideSlot />
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════
// ██  SwissStandingRow
// ════════════════════════════════════════════════════════════

const DOT: Record<RoundResult, string> = {
  win: '#22c55e', loss: '#ef4444', tbd: 'rgba(255,255,255,0.26)', none: 'rgba(255,255,255,0.08)', bye: '#f59e0b',
};
const DOT_TITLE: Record<RoundResult, string> = { win: '胜', loss: '负', tbd: 'TBD', none: '-', bye: '轮空' };

const SwissStandingRow: React.FC<{
  standing: SwissStanding; rank: number; totalRounds: number;
  onViewTeam: (t: Team) => void; lang: string; animDelay?: number;
}> = memo(({ standing, rank, totalRounds, onViewTeam, lang, animDelay = 0 }) => {
  const { player, wins, losses, roundResults } = standing;
  return (
    <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: animDelay, duration: 0.22 }}
      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.48rem 0.75rem', borderRadius: 11, background: rank === 1 ? 'rgba(255,215,0,0.08)' : rank <= 3 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)', border: `1px solid ${rank === 1 ? 'rgba(255,215,0,0.22)' : rank <= 3 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)'}` }}
    >
      <div style={{ width: 24, textAlign: 'center', flexShrink: 0 }}>
        {rank === 1 ? <span style={{ fontSize: '1rem' }}>🥇</span> : rank === 2 ? <span style={{ fontSize: '0.9rem' }}>🥈</span> : rank === 3 ? <span style={{ fontSize: '0.9rem' }}>🥉</span> : <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.36)' }}>#{rank}</span>}
      </div>
      <QQAvatar qq={player.userQQ} size={30} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: '0.74rem', color: 'rgba(255,255,255,0.9)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 3 }}>{player.userName}</div>
        <TeamViewButtons player={player} onViewTeam={onViewTeam} lang={lang} />
      </div>
      <div style={{ textAlign: 'center', flexShrink: 0, padding: '0 4px' }}>
        <div style={{ fontSize: '0.44rem', color: 'rgba(255,255,255,0.32)', marginBottom: 1 }}>{lang === 'zh' ? '胜-负' : 'W-L'}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#22c55e' }}>{wins}</span>
          <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: '0.6rem' }}>-</span>
          <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#ef4444' }}>{losses}</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
        {Array.from({ length: totalRounds }).map((_, ri) => {
          const r: RoundResult = roundResults[ri] ?? 'none';
          const dc = DOT[r];
          return <div key={ri} title={`R${ri + 1}: ${DOT_TITLE[r]}`} style={{ width: 9, height: 9, borderRadius: '50%', background: r === 'none' ? 'transparent' : dc, border: `1.5px solid ${r === 'none' ? 'rgba(255,255,255,0.1)' : dc}`, boxShadow: r !== 'none' && r !== 'loss' ? `0 0 5px ${dc}88` : 'none' }} />;
        })}
      </div>
    </motion.div>
  );
});

// ════════════════════════════════════════════════════════════
// ██  MiniStandingRow
// ════════════════════════════════════════════════════════════

const MiniStandingRow: React.FC<{
  standing: SwissStanding; rank: number; totalRounds: number;
  onViewTeam: (t: Team) => void; lang: string; animDelay?: number;
}> = memo(({ standing, rank, totalRounds, onViewTeam, lang, animDelay = 0 }) => {
  const { player, wins, losses, roundResults } = standing;
  return (
    <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: animDelay, duration: 0.22 }}
      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.36rem 0.6rem', borderRadius: 10, background: rank === 1 ? 'rgba(255,215,0,0.09)' : rank <= 3 ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${rank === 1 ? 'rgba(255,215,0,0.24)' : rank <= 3 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.07)'}`, minWidth: 196 }}
    >
      <div style={{ width: 20, textAlign: 'center', flexShrink: 0 }}>
        {rank <= 3 ? <span style={{ fontSize: rank === 1 ? '1rem' : '0.88rem' }}>{['🥇','🥈','🥉'][rank-1]}</span> : <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.34)' }}>#{rank}</span>}
      </div>
      <QQAvatar qq={player.userQQ} size={24} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: '0.7rem', color: 'rgba(255,255,255,0.9)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{player.userName}</div>
        <TeamViewButtons player={player} onViewTeam={onViewTeam} lang={lang} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <span style={{ fontWeight: 800, fontSize: '0.76rem', color: '#22c55e' }}>{wins}</span>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.56rem' }}>-</span>
          <span style={{ fontWeight: 800, fontSize: '0.76rem', color: '#ef4444' }}>{losses}</span>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          {Array.from({ length: totalRounds }).map((_, ri) => {
            const r: RoundResult = roundResults[ri] ?? 'none';
            return <div key={ri} style={{ width: 6, height: 6, borderRadius: '50%', background: r === 'none' ? 'transparent' : DOT[r], border: `1px solid ${r === 'none' ? 'rgba(255,255,255,0.1)' : DOT[r]}`, boxShadow: r !== 'none' && r !== 'loss' ? `0 0 4px ${DOT[r]}88` : 'none' }} />;
          })}
        </div>
      </div>
    </motion.div>
  );
});

// ════════════════════════════════════════════════════════════
// ██  SwissFlowDiagram
// ════════════════════════════════════════════════════════════

const SwissFlowDiagram: React.FC<{
  players: (TournamentTeam | null)[]; standings: SwissStanding[];
  onViewTeam: (t: Team) => void; factionNames: Record<string, string>;
  lang: string; tabsrc: string; translations: any;
}> = ({ players, standings, onViewTeam, factionNames, lang, tabsrc, translations }) => {
  if (SWISS_ROUNDS.length === 0) return null;
  const L = (zh: string, en: string, jp: string) => ({ zh, en, jp }[lang] as string);
  const colHeader = (rIdx: number) => {
    if (SWISS_ROUNDS.length > 1 && rIdx === SWISS_ROUNDS.length - 1) return L('末轮', 'Final Round', '最終ラウンド');
    return L(`第 ${rIdx + 1} 轮`, `Round ${rIdx + 1}`, `第${rIdx + 1}ラウンド`);
  };
  return (
    <div style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 0, minWidth: 'max-content' }}>
      {SWISS_ROUNDS.map((round, rIdx) => {
        const byeIdxs = getByeIndices(rIdx, players);
        return (
          <React.Fragment key={rIdx}>
            {rIdx > 0 && <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', width: 22, paddingTop: 30, flexShrink: 0 }}><Connector /></div>}
            <div>
              <div style={{ fontSize: '0.57rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(200,220,255,0.62)', marginBottom: 8, paddingLeft: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(180,200,255,0.5)' }} />
                {colHeader(rIdx)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {round.map((match, mIdx) => <SwissMatchCard key={mIdx} match={match} players={players} onViewTeam={onViewTeam} factionNames={factionNames} lang={lang} tabsrc={tabsrc} translations={translations} animDelay={rIdx * 0.06 + mIdx * 0.03} />)}
                {byeIdxs.map((bIdx, bi) => { const bp = players[bIdx]; if (!bp) return null; return <ByeCard key={`bye-${bIdx}`} player={bp} factionNames={factionNames} lang={lang} tabsrc={tabsrc} translations={translations} onViewTeam={onViewTeam} animDelay={rIdx * 0.06 + round.length * 0.03 + bi * 0.03} />; })}
              </div>
            </div>
          </React.Fragment>
        );
      })}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', width: 22, paddingTop: 30, flexShrink: 0 }}><Connector /></div>
      <div>
        <div style={{ fontSize: '0.57rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 2, color: '#FFD700', display: 'flex', alignItems: 'center', gap: 5, textShadow: '0 0 8px rgba(255,215,0,0.5)' }}>
          <Crown size={9} style={{ color: '#FFD700' }} />{L('最终积分', 'Final Standings', '最終結果')}
        </div>
        <motion.div animate={{ boxShadow: ['0 0 12px rgba(255,215,0,0.08)', '0 0 22px rgba(255,215,0,0.18)', '0 0 12px rgba(255,215,0,0.08)'] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: '0.55rem', borderRadius: 14, border: '1px solid rgba(255,215,0,0.18)', background: 'rgba(255,215,0,0.04)' }}>
          {standings.map((s, i) => <MiniStandingRow key={s.idx} standing={s} rank={i + 1} totalRounds={SWISS_ROUNDS.length} onViewTeam={onViewTeam} lang={lang} animDelay={SWISS_ROUNDS.length * 0.06 + i * 0.03} />)}
        </motion.div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// ██  TeamDetailModal
// ════════════════════════════════════════════════════════════

const TeamDetailModal: React.FC<{
  team: Team | null; lang: string; factionNames: Record<string, string>;
  backgroundImgsrc: string; onClose: () => void;
  mechListRenderer: (t: Team) => React.ReactNode;
}> = ({ team, lang, factionNames, backgroundImgsrc, onClose, mechListRenderer }) =>
  createPortal(
    <AnimatePresence>
      {team && (() => {
        const fc = FACTION_COLORS[team.faction] ?? '#888';
        return (
          <motion.div key="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)' }}
            onClick={onClose}
          >
            <motion.div key="pnl" initial={{ opacity: 0, scale: 0.92, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 16 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: '92vw', maxWidth: 1100, height: '88vh', borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column', border: `1px solid ${fc}44`, boxShadow: `0 28px 70px rgba(0,0,0,0.65)`, backgroundImage: `url(${backgroundImgsrc}/background2.svg)`, backgroundSize: 'cover' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 1.2rem', borderBottom: `1px solid ${fc}2a`, background: `linear-gradient(90deg,${fc}18,rgba(0,0,0,0.55))`, backdropFilter: 'blur(20px)', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: fc, boxShadow: `0 0 7px ${fc}` }} />
                  <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: '0.96rem' }}>{team.name}</span>
                  <span style={{ padding: '0.12rem 0.55rem', borderRadius: 7, background: `${fc}22`, color: fc, fontSize: '0.65rem', fontWeight: 700, border: `1px solid ${fc}38` }}>{factionNames[team.faction] ?? team.faction}</span>
                  {team.totalScore > 0 && <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.66rem' }}>{team.totalScore} pt</span>}
                </div>
                <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0.3rem 0.72rem', borderRadius: 9, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.62)', cursor: 'pointer', fontSize: '0.74rem', fontWeight: 600 }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')} onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}>
                  <X size={13} />{lang === 'zh' ? '关闭' : lang === 'jp' ? '閉じる' : 'Close'}
                </button>
              </div>
              <div style={{ flex: 1, overflow: 'auto', background: 'rgba(255,255,255,0.93)' }}>{mechListRenderer(team)}</div>
            </motion.div>
          </motion.div>
        );
      })()}
    </AnimatePresence>,
    document.body,
  );

// ════════════════════════════════════════════════════════════
// ██  Props
// ════════════════════════════════════════════════════════════

interface TournamentViewProps {
  teams: Team[];
  lang: 'zh' | 'en' | 'jp';
  factionNames: Record<string, string>;
  backgroundImgsrc: string;
  tabsrc: string;
  translations: any;
  onClose: () => void;
  mechListRenderer: (team: Team) => React.ReactNode;
}

// ════════════════════════════════════════════════════════════
// ██  TournamentView 主组件
// ════════════════════════════════════════════════════════════

export const TournamentView: React.FC<TournamentViewProps> = ({
  lang, factionNames, backgroundImgsrc, tabsrc, translations, onClose, mechListRenderer,
}) => {
  const [detailTeam, setDetailTeam] = useState<Team | null>(null);
  const [viewMode, setViewMode] = useState<'elimination' | 'swiss'>(
    TOURNAMENT_MODE === 'swiss' ? 'swiss' : 'elimination',
  );

  // ── 淘汰赛 ───────────────────────────────────────────────
  const paddedPlayers = useMemo<(TournamentTeam | null)[]>(() => {
    const n = PARTICIPATING_TOURNAMENT_TEAMS.length;
    if (n === 0) return [];
    const p = nextPow2(n);
    return [...PARTICIPATING_TOURNAMENT_TEAMS, ...Array(p - n).fill(null)];
  }, []);
  const numRounds = paddedPlayers.length > 1 ? Math.log2(paddedPlayers.length) : paddedPlayers.length === 1 ? 0 : -1;
  const allIdxs = useMemo(() => paddedPlayers.map((_, i) => i), [paddedPlayers]);
  const championPlayer = useMemo(() => numRounds >= 0 ? subWinner(allIdxs, Math.max(numRounds - 1, 0), 0, paddedPlayers) : null, [allIdxs, numRounds, paddedPlayers]);
  const finalCfg = getCfg(Math.max(numRounds - 1, 0), 0);
  const champSlot: 0 | 1 = finalCfg.winner == null ? 0 : finalCfg.winner === 0 ? finalCfg.selectionA : finalCfg.selectionB;
  const champTeam = championPlayer ? (champSlot === 0 ? championPlayer.team1 : championPlayer.team2) : null;
  const champFC = champTeam ? (FACTION_COLORS[champTeam.faction] ?? '#888') : '#888';

  // ── 瑞士轮 ───────────────────────────────────────────────
  const swissStandings = useMemo(() => computeSwissStandings(PARTICIPATING_TOURNAMENT_TEAMS), []);

  // ── 预计算所有轮次的胜场数（避免每轮重复计算） ─────────
  const allWinsBeforeRounds = useMemo(() => computeAllWinsBeforeRounds(), []);

  // ── 轮次名称 ─────────────────────────────────────────────
  const roundName = (r: number) => {
    if (r === numRounds - 1) return ({ zh: '决赛', en: 'Final', jp: '決勝' } as any)[lang];
    if (r === numRounds - 2 && numRounds >= 3) return ({ zh: '半决赛', en: 'Semi', jp: '準決勝' } as any)[lang];
    return ({ zh: `第${r + 1}轮`, en: `Round ${r + 1}`, jp: `${r + 1}回戦` } as any)[lang];
  };

  // ── 递归对阵图 ───────────────────────────────────────────
  const renderNode = (idxs: number[], round: number, match: number, depth: number): React.ReactNode => {
    const delay = match * 0.03 + depth * 0.01;
    if (idxs.length === 2) return <SingleMatch playerA={paddedPlayers[idxs[0]] ?? null} playerB={paddedPlayers[idxs[1]] ?? null} config={getCfg(round, match)} onClickTeam={setDetailTeam} factionNames={factionNames} lang={lang} tabsrc={tabsrc} translations={translations} animDelay={delay} roundLabel={roundName(round)} />;
    const h = idxs.length >> 1;
    const lI = idxs.slice(0, h), rI = idxs.slice(h);
    return (
      <BracketGroup innerGap={Math.max(8, 28 - depth * 5)} colGap={20}
        source1={renderNode(lI, round - 1, match * 2, depth + 1)}
        source2={renderNode(rI, round - 1, match * 2 + 1, depth + 1)}
        output={<SingleMatch playerA={subWinner(lI, round - 1, match * 2, paddedPlayers)} playerB={subWinner(rI, round - 1, match * 2 + 1, paddedPlayers)} config={getCfg(round, match)} onClickTeam={setDetailTeam} factionNames={factionNames} lang={lang} tabsrc={tabsrc} translations={translations} animDelay={delay + 0.08} roundLabel={roundName(round)} />}
      />
    );
  };

  // ── 文案 ─────────────────────────────────────────────────
  const L = (zh: string, en: string, jp: string) => ({ zh, en, jp }[lang]);
  const T = {
    title:    L('比赛进度', 'Tournament', '大会進行'),
    champ:    L('冠军', 'Champion', '優勝'),
    tbd:      L('待决出', '???', '未定'),
    back:     L('返回', 'Back', '戻る'),
    elim:     L('淘汰赛', 'Bracket', '決勝T'),
    swiss:    L('瑞士轮', 'Swiss', 'スイス'),
    standings:L('积分榜', 'Standings', '順位表'),
    rounds:   L('各轮对阵', 'Round Results', 'ラウンド結果'),
    noElim:   L('暂无参赛选手', 'No players registered', '参加プレイヤーなし'),
    noSwiss:  L('暂无瑞士轮数据', 'No Swiss round data', 'スイスラウンドデータなし'),
    hint:     L(
      `共 ${PARTICIPATING_TOURNAMENT_TEAMS.filter(Boolean).length} 位选手参赛 · 点击名片查看阵容详情`,
      `${PARTICIPATING_TOURNAMENT_TEAMS.filter(Boolean).length} players · Click a card to view details`,
      `${PARTICIPATING_TOURNAMENT_TEAMS.filter(Boolean).length} 名参加 · カードをタップで詳細確認`,
    ),
  };

  const canSwitch = TOURNAMENT_MODE === 'both';

  // ════════════════════════════════════════════════════════
  // ▼  各轮对阵渲染（始终按胜场分组）
  // ════════════════════════════════════════════════════════

  const renderRoundContent = (round: SwissMatch[], rIdx: number) => {
    const byeIdxs = getByeIndices(rIdx, PARTICIPATING_TOURNAMENT_TEAMS);
    const winsMap = allWinsBeforeRounds[rIdx] ?? {};

    // 将对局按双方最高胜场归档
    const matchGroups: Record<number, SwissMatch[]> = {};
    round.forEach(m => {
      const b = Math.max(winsMap[m.playerAIdx] ?? 0, winsMap[m.playerBIdx] ?? 0);
      (matchGroups[b] ??= []).push(m);
    });

    // 将轮空选手也归档
    const byeGroups: Record<number, number[]> = {};
    byeIdxs.forEach(bi => {
      const b = winsMap[bi] ?? 0;
      (byeGroups[b] ??= []).push(bi);
    });

    // 所有胜场档，降序
    const allBrackets = Array.from(
      new Set([...Object.keys(matchGroups).map(Number), ...Object.keys(byeGroups).map(Number)])
    ).sort((a, b) => b - a);

    return (
      <>
        {allBrackets.map((b, bOrd) => {
          const gc = bracketColor(b);
          const matches = matchGroups[b] ?? [];
          const byes = byeGroups[b] ?? [];
          const bracketLabel = lang === 'zh' ? `${b} 胜` : lang === 'jp' ? `${b} 勝` : `${b}W`;

          return (
            <div key={b}>
              {/* 胜场档标题 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: bOrd === 0 ? '0 0 6px' : '10px 0 6px' }}>
                <div style={{ width: 3, height: 14, borderRadius: 2, background: gc, boxShadow: `0 0 6px ${gc}` }} />
                <span style={{ fontSize: '0.56rem', fontWeight: 800, color: gc, letterSpacing: '0.07em', textShadow: `0 0 8px ${gc}66` }}>
                  {bracketLabel}
                </span>
                <div style={{ flex: 1, height: 1, background: `linear-gradient(to right,${gc}55,transparent)` }} />
              </div>

              {/* 该档的对局卡 */}
              {matches.map((match, mIdx) => (
                <div key={mIdx} style={{ marginBottom: 8 }}>
                  <SwissMatchCard match={match} players={PARTICIPATING_TOURNAMENT_TEAMS} onViewTeam={setDetailTeam} factionNames={factionNames} lang={lang} tabsrc={tabsrc} translations={translations} animDelay={rIdx * 0.04 + bOrd * 0.02 + mIdx * 0.02} />
                </div>
              ))}

              {/* 该档的轮空卡 */}
              {byes.map((bIdx, bi) => {
                const bp = PARTICIPATING_TOURNAMENT_TEAMS[bIdx];
                if (!bp) return null;
                return (
                  <div key={`bye-${bIdx}`} style={{ marginBottom: 8 }}>
                    <ByeCard player={bp} factionNames={factionNames} lang={lang} tabsrc={tabsrc} translations={translations} onViewTeam={setDetailTeam} animDelay={0} />
                  </div>
                );
              })}
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundImage: `url(${backgroundImgsrc}/background.svg)`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(155deg,rgba(6,8,18,0.72) 0%,rgba(4,7,20,0.62) 100%)' }} />
      <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,215,0,0.07) 0%,transparent 65%)', pointerEvents: 'none' }} />

      {/* ── 顶栏 ── */}
      <div style={{ position: 'relative', zIndex: 2, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.26)', backdropFilter: 'blur(18px)', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Trophy size={18} style={{ color: '#FFD700', filter: 'drop-shadow(0 0 6px #FFD70077)' }} />
          <span style={{ color: 'rgba(255,255,255,0.88)', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.07em' }}>{T.title}</span>
          {viewMode === 'elimination' && championPlayer && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0.15rem 0.72rem', borderRadius: 20, background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.22)', marginLeft: 4 }}>
              <Crown size={10} style={{ color: '#FFD700' }} />
              <span style={{ color: '#FFD700', fontSize: '0.7rem', fontWeight: 700 }}>{championPlayer.userName}</span>
            </motion.div>
          )}
          {viewMode === 'swiss' && swissStandings[0] && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0.15rem 0.72rem', borderRadius: 20, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.22)', marginLeft: 4 }}>
              <span style={{ fontSize: '0.72rem' }}>🥇</span>
              <span style={{ color: '#22c55e', fontSize: '0.7rem', fontWeight: 700 }}>{swissStandings[0].player.userName}</span>
              <span style={{ color: 'rgba(34,197,94,0.6)', fontSize: '0.62rem' }}>{swissStandings[0].wins}W</span>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {canSwitch && (
            <div style={{ display: 'flex', borderRadius: 9, border: '1px solid rgba(255,255,255,0.14)', overflow: 'hidden', flexShrink: 0 }}>
              {(['elimination', 'swiss'] as const).map(mode => {
                const isA = viewMode === mode;
                const Icon = mode === 'elimination' ? GitMerge : BarChart2;
                return (
                  <button key={mode} onClick={() => setViewMode(mode)}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0.3rem 0.82rem', background: isA ? 'rgba(255,255,255,0.16)' : 'transparent', border: 'none', color: isA ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.42)', cursor: 'pointer', fontSize: '0.74rem', fontWeight: 700, transition: 'all 0.18s' }}>
                    <Icon size={12} />{mode === 'elimination' ? T.elim : T.swiss}
                  </button>
                );
              })}
            </div>
          )}
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onClose}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.33rem 0.9rem', borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)', color: 'rgba(255,255,255,0.68)', cursor: 'pointer', fontSize: '0.77rem', fontWeight: 600 }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')} onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}>
            <X size={13} /> {T.back}
          </motion.button>
        </div>
      </div>

      {/* ── 主体 ── */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, overflow: 'auto', padding: '1.6rem 2rem 3rem' }}>
        <AnimatePresence mode="wait">

          {/* ━━━ 淘汰赛 ━━━ */}
          {viewMode === 'elimination' && (
            <motion.div key="elim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              {paddedPlayers.length === 0 ? (
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.88rem', marginTop: 48, textAlign: 'center' }}>{T.noElim}</div>
              ) : paddedPlayers.length === 1 ? (
                <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.58rem', fontWeight: 800, color: '#FFD700' }}><Crown size={10} /> {T.champ} <Crown size={10} /></div>
                  {paddedPlayers[0] && <PlayerCard player={paddedPlayers[0]} slot={0} status="champion" champion onClickTeam={setDetailTeam} factionNames={factionNames} lang={lang} tabsrc={tabsrc} translations={translations} />}
                </div>
              ) : (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 22, minWidth: 'max-content' }}>
                  {renderNode(allIdxs, numRounds - 1, 0, 0)}
                  <Connector />
                  {championPlayer && champTeam ? (
                    <motion.div animate={{ boxShadow: [`0 0 14px ${champFC}33,0 0 0 1.5px rgba(255,215,0,0.4)`, `0 0 32px ${champFC}55,0 0 0 2px rgba(255,215,0,0.65)`, `0 0 14px ${champFC}33,0 0 0 1.5px rgba(255,215,0,0.4)`] }} transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }} style={{ borderRadius: 16 }}>
                      <div style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.57rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#FFD700', textShadow: '0 0 10px #FFD70077' }}><Crown size={10} /> {T.champ} <Crown size={10} /></div>
                      <PlayerCard player={championPlayer} slot={champSlot} status="champion" champion onClickTeam={setDetailTeam} factionNames={factionNames} lang={lang} tabsrc={tabsrc} translations={translations} animDelay={0.5} />
                    </motion.div>
                  ) : (
                    <div>
                      <div style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.57rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#FFD700' }}><Crown size={10} /> {T.champ} <Crown size={10} /></div>
                      <div style={{ width: 222, height: 68, borderRadius: 13, border: '2px dashed rgba(255,215,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,215,0,0.2)', fontSize: '0.7rem', fontStyle: 'italic' }}>{T.tbd}</div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ━━━ 瑞士轮 ━━━ */}
          {viewMode === 'swiss' && (
            <motion.div key="swiss" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 28 }}
            >
              {swissStandings.length === 0 && SWISS_ROUNDS.length === 0 ? (
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.88rem', marginTop: 48, textAlign: 'center' }}>{T.noSwiss}</div>
              ) : (
                <>
                  {/* ── 积分榜 ── */}
                  {swissStandings.length > 0 && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <BarChart2 size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
                        <span style={{ color: 'rgba(255,255,255,0.72)', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.08em' }}>{T.standings}</span>
                        <div style={{ display: 'flex', gap: 10, marginLeft: 6 }}>
                          {([
                            ['#22c55e', L('胜', 'Win', '勝')],
                            ['#ef4444', L('负', 'Loss', '負')],
                            ['#f59e0b', L('轮空', 'BYE', '不戦勝')],
                            ['rgba(255,255,255,0.26)', 'TBD'],
                          ] as [string, string][]).map(([c, lbl]) => (
                            <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <div style={{ width: 7, height: 7, borderRadius: '50%', background: c, border: `1.5px solid ${c}` }} />
                              <span style={{ fontSize: '0.48rem', color: 'rgba(255,255,255,0.36)', fontWeight: 600 }}>{lbl}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(310px,1fr))', gap: 7 }}>
                        {swissStandings.map((s, i) => (
                          <SwissStandingRow key={s.idx} standing={s} rank={i + 1} totalRounds={SWISS_ROUNDS.length} onViewTeam={setDetailTeam} lang={lang} animDelay={i * 0.035} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── 各轮对阵（始终按胜场分组） ── */}
                  {SWISS_ROUNDS.length > 0 && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <GitMerge size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
                        <span style={{ color: 'rgba(255,255,255,0.72)', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.08em' }}>{T.rounds}</span>
                      </div>

                      {/* 各轮列（横向滚动） */}
                      <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8 }}>
                        {SWISS_ROUNDS.map((round, rIdx) => (
                          <div key={rIdx} style={{ flexShrink: 0 }}>
                            <div style={{ fontSize: '0.57rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(200,220,255,0.58)', marginBottom: 8 }}>
                              {L(`第 ${rIdx + 1} 轮`, `Round ${rIdx + 1}`, `第${rIdx + 1}ラウンド`)}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              {renderRoundContent(round, rIdx)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── 底部状态栏 ── */}
      <div style={{ position: 'relative', zIndex: 2, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 7, padding: '0.33rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.18)' }}>
        <Shield size={10} style={{ color: 'rgba(255,255,255,0.18)' }} />
        <span style={{ color: 'rgba(255,255,255,0.24)', fontSize: '0.62rem' }}>{T.hint}</span>
      </div>

      <TeamDetailModal team={detailTeam} lang={lang} factionNames={factionNames} backgroundImgsrc={backgroundImgsrc} onClose={() => setDetailTeam(null)} mechListRenderer={mechListRenderer} />
    </div>
  );
};

export default TournamentView;