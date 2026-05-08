/**
 * tournamentTypes.ts
 *
 * 赛事共用的接口定义、硬编码赛程数据、工具函数。
 */

import { TournamentTeam } from '../../../data/types';
import { PARTICIPATING_TOURNAMENT_TEAMS } from './ParticipatingTeams';

// ════════════════════════════════════════════════════════════
// ██  接口
// ════════════════════════════════════════════════════════════

export interface MatchConfig {
  selectionA: 0 | 1;
  selectionB: 0 | 1;
  winner: 0 | 1 | null;
}

// ── 最大负场数（达到即淘汰）──
export const SWISS_MAX_LOSSES = 2;

export interface SwissMatch {
  playerAIdx: number;
  playerBIdx: number;
  selectionA: 0 | 1;
  selectionB: 0 | 1;
  winner: 0 | 1 | null;
}

export type RoundResult = 'win' | 'loss' | 'tbd' | 'none' | 'bye';

export interface SwissStanding {
  player: TournamentTeam;
  idx: number;
  wins: number;
  losses: number;
  roundResults: RoundResult[];
  eliminated: boolean;          // ← 新增
  eliminatedAfterRound: number | null; // ← 新增：第几轮结束后被淘汰（0-indexed）
}

// ════════════════════════════════════════════════════════════
// ██  ★ 硬编码赛程数据
// ════════════════════════════════════════════════════════════

export const TOURNAMENT_MODE: 'elimination' | 'swiss' | 'both' = 'both';

export const MATCH_CONFIGS: MatchConfig[][] = [
  [
    { selectionA: 0, selectionB: 0, winner: null },
    { selectionA: 0, selectionB: 1, winner: null },
    { selectionA: 0, selectionB: 0, winner: null },
    { selectionA: 0, selectionB: 0, winner: null },
    { selectionA: 0, selectionB: 0, winner: null },
  ]
];

export const SWISS_ROUNDS: SwissMatch[][] = [
  // ── 第一轮：全员 0W-0L ──
  [
    { playerAIdx: 0, playerBIdx: 1, selectionA: 0, selectionB: 0, winner: 0 }, // 0→1W | 1→1L
    { playerAIdx: 2, playerBIdx: 3, selectionA: 1, selectionB: 0, winner: 1 }, // 3→1W | 2→1L
    { playerAIdx: 4, playerBIdx: 5, selectionA: 0, selectionB: 1, winner: 0 }, // 4→1W | 5→1L
    { playerAIdx: 6, playerBIdx: 7, selectionA: 1, selectionB: 1, winner: 1 }, // 7→1W | 6→1L
  ],

  // ── 第二轮：1W战1W，1L战1L ──
  [
    { playerAIdx: 0, playerBIdx: 3, selectionA: 0, selectionB: 0, winner: 0 }, // 0→2W      | 3→1W1L
    { playerAIdx: 4, playerBIdx: 7, selectionA: 1, selectionB: 0, winner: 1 }, // 7→2W      | 4→1W1L
    { playerAIdx: 1, playerBIdx: 2, selectionA: 0, selectionB: 1, winner: 0 }, // 1→1W1L    | 2→0W2L ✕淘汰
    { playerAIdx: 5, playerBIdx: 6, selectionA: 1, selectionB: 0, winner: 1 }, // 6→1W1L    | 5→0W2L ✕淘汰
  ],

  // ── 第三轮：2W争首，1W1L求存（2、5已淘汰不再出现）──
  [
    { playerAIdx: 0, playerBIdx: 7, selectionA: 0, selectionB: 1, winner: null }, // 0→3W 🏆   | 7→2W1L
    { playerAIdx: 3, playerBIdx: 4, selectionA: 1, selectionB: 0, winner: null }, // 4→2W1L    | 3→1W2L ✕淘汰
    { playerAIdx: 1, playerBIdx: 6, selectionA: 0, selectionB: 0, winner: null }, // 6→2W1L    | 1→1W2L ✕淘汰
  ],
];
// ════════════════════════════════════════════════════════════
// ██  工具函数 — 淘汰赛
// ════════════════════════════════════════════════════════════

export const nextPow2 = (n: number) => (n <= 1 ? 1 : Math.pow(2, Math.ceil(Math.log2(n))));

export const getCfg = (round: number, idx: number): MatchConfig =>
  MATCH_CONFIGS[round]?.[idx] ?? { selectionA: 0, selectionB: 0, winner: null };

export function subWinner(
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

// ════════════════════════════════════════════════════════════
// ██  工具函数 — 瑞士轮
// ════════════════════════════════════════════════════════════

export function getByeIndices(roundIdx: number, players: (TournamentTeam | null)[]): number[] {
  const round = SWISS_ROUNDS[roundIdx];
  if (!round) return [];
  const inMatch = new Set<number>();
  round.forEach(m => { inMatch.add(m.playerAIdx); inMatch.add(m.playerBIdx); });
  return players.reduce<number[]>((acc, p, i) => {
    if (p && !inMatch.has(i)) acc.push(i);
    return acc;
  }, []);
}

export function computeSwissStandings(players: (TournamentTeam | null)[]): SwissStanding[] {
  const map: Record<number, SwissStanding> = {};
  players.forEach((p, i) => {
    if (p) map[i] = {
      player: p, idx: i, wins: 0, losses: 0,
      roundResults: Array(SWISS_ROUNDS.length).fill('none'),
      eliminated: false, eliminatedAfterRound: null,   // ← 初始化
    };
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
        else              { map[bi].wins++; map[ai].losses++; }
      }
    });

    // 轮空 +1 胜
    Object.keys(map).forEach(k => {
      const idx = Number(k);
      if (!inMatch.has(idx)) {
        map[idx].roundResults[rIdx] = 'bye';
        map[idx].wins++;
      }
    });

    // ── 新增：本轮结束后判定淘汰 ──
    Object.values(map).forEach(s => {
      if (!s.eliminated && s.losses >= SWISS_MAX_LOSSES) {
        s.eliminated = true;
        s.eliminatedAfterRound = rIdx;
      }
    });
  });

  return Object.values(map).sort((a, b) => {
    // 未淘汰 > 已淘汰；同状态内按胜场降序、负场升序
    if (a.eliminated !== b.eliminated) return a.eliminated ? 1 : -1;
    return b.wins - a.wins || a.losses - b.losses;
  });
}

/**
 * 计算每一轮开始前各选手的胜场数（一次性计算所有轮次）。
 * 返回 winsMap[roundIdx][playerIdx] = wins
 */
export function computeAllWinsBeforeRounds(): Record<number, number>[] {
  const result: Record<number, number>[] = [];
  const wins: Record<number, number> = {};
  PARTICIPATING_TOURNAMENT_TEAMS.forEach((p, i) => { if (p) wins[i] = 0; });

  for (let r = 0; r < SWISS_ROUNDS.length; r++) {
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
export function bracketColor(wins: number): string {
  if (wins === 0) return '#ef4444';
  if (wins >= Math.ceil(SWISS_ROUNDS.length * 0.6)) return '#22c55e';
  if (wins >= Math.ceil(SWISS_ROUNDS.length * 0.3)) return '#f59e0b';
  return '#94a3b8';
}

// ════════════════════════════════════════════════════════════
// ██  多语言辅助
// ════════════════════════════════════════════════════════════

export type Lang = 'zh' | 'en' | 'jp';

export const L = (lang: Lang, zh: string, en: string, jp: string) =>
  ({ zh, en, jp }[lang] as string);
