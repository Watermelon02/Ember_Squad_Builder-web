/**
 * SwissView.tsx
 *
 * 瑞士轮组件：积分榜 + 各轮对阵（始终按胜场分组）+ 流式图。
 */

import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { Crown, BarChart2, GitMerge } from 'lucide-react';
import { Team, TournamentTeam, FACTION_COLORS } from '../../data/types';
import { PARTICIPATING_TOURNAMENT_TEAMS } from './data/ParticipatingTeams';
import {
  SWISS_ROUNDS,
  type SwissMatch, type SwissStanding, type RoundResult, type Lang,
  getByeIndices, computeSwissStandings, computeAllWinsBeforeRounds, bracketColor, L,
} from './data/tournamentTypes';
import { QQAvatar, TeamViewButtons, PlayerCard, VsSeparator, Connector } from './tournamentShared';

// ════════════════════════════════════════════════════════════
// ██  SwissMatchCard
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
      <VsSeparator />
      <div style={{ padding: '0.2rem 0.48rem 0.42rem' }}>
        <PlayerCard player={pB} slot={match.selectionB} status={stB as any} onClickTeam={onViewTeam} factionNames={factionNames} lang={lang} tabsrc={tabsrc} translations={translations} animDelay={animDelay + 0.04} hideSlot={tbd} />
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════
// ██  ByeCard
// ════════════════════════════════════════════════════════════

const ByeCard: React.FC<{
  player: TournamentTeam; factionNames: Record<string, string>;
  lang: string; tabsrc: string; translations: any;
  onViewTeam: (t: Team) => void;
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
// ██  MiniStandingRow (用于 SwissFlowDiagram)
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
        {rank <= 3 ? <span style={{ fontSize: rank === 1 ? '1rem' : '0.88rem' }}>{['🥇', '🥈', '🥉'][rank - 1]}</span> : <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.34)' }}>#{rank}</span>}
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

export const SwissFlowDiagram: React.FC<{
  players: (TournamentTeam | null)[]; standings: SwissStanding[];
  onViewTeam: (t: Team) => void; factionNames: Record<string, string>;
  lang: string; tabsrc: string; translations: any;
}> = ({ players, standings, onViewTeam, factionNames, lang, tabsrc, translations }) => {
  if (SWISS_ROUNDS.length === 0) return null;
  const colHeader = (rIdx: number) => {
    if (SWISS_ROUNDS.length > 1 && rIdx === SWISS_ROUNDS.length - 1) return L(lang as Lang, '末轮', 'Final Round', '最終ラウンド');
    return L(lang as Lang, `第 ${rIdx + 1} 轮`, `Round ${rIdx + 1}`, `第${rIdx + 1}ラウンド`);
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
                {byeIdxs.map((bIdx, bi) => { const bp = players[bIdx]; if (!bp) return null; return <ByeCard key={`bye-${bIdx}`} player={bp} factionNames={factionNames} lang={lang} tabsrc={tabsrc} translations={translations} onViewTeam={onViewTeam} />; })}
              </div>
            </div>
          </React.Fragment>
        );
      })}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', width: 22, paddingTop: 30, flexShrink: 0 }}><Connector /></div>
      <div>
        <div style={{ fontSize: '0.57rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 2, color: '#FFD700', display: 'flex', alignItems: 'center', gap: 5, textShadow: '0 0 8px rgba(255,215,0,0.5)' }}>
          <Crown size={9} style={{ color: '#FFD700' }} />{L(lang as Lang, '最终积分', 'Final Standings', '最終結果')}
        </div>
        <motion.div animate={{ boxShadow: ['0 0 12px rgba(255,215,0,0.08)', '0 0 22px rgba(255,215,0,0.18)', '0 0 12px rgba(255,215,0,0.08)'] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: '0.55rem', borderRadius: 14, border: '1px solid rgba(255,215,0,0.18)', background: 'rgba(255,215,0,0.04)' }}>
          {standings.map((s, i) => <MiniStandingRow key={s.idx} standing={s} rank={i + 1} totalRounds={SWISS_ROUNDS.length} onViewTeam={onViewTeam} lang={lang} animDelay={SWISS_ROUNDS.length * 0.06 + i * 0.03} />)}
        </motion.div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// ██  Props
// ════════════════════════════════════════════════════════════

interface SwissViewProps {
  lang: Lang;
  factionNames: Record<string, string>;
  tabsrc: string;
  translations: any;
  onClickTeam: (t: Team) => void;
}

// ════════════════════════════════════════════════════════════
// ██  SwissView 主组件
// ════════════════════════════════════════════════════════════

export const SwissView: React.FC<SwissViewProps> = ({
  lang, factionNames, tabsrc, translations, onClickTeam,
}) => {
  const swissStandings = useMemo(() => computeSwissStandings(PARTICIPATING_TOURNAMENT_TEAMS), []);
  const allWinsBeforeRounds = useMemo(() => computeAllWinsBeforeRounds(), []);

  const T = {
    standings: L(lang, '积分榜', 'Standings', '順位表'),
    rounds: L(lang, '各轮对阵', 'Round Results', 'ラウンド結果'),
    noSwiss: L(lang, '暂无瑞士轮数据', 'No Swiss round data', 'スイスラウンドデータなし'),
  };

  // ── 判断轮次状态 ──
  const getRoundStatus = (round: SwissMatch[]) => {
    if (round.length === 0) return 'upcoming';
    const played = round.filter(m => m.winner != null).length;
    if (played === round.length) return 'completed';
    if (played > 0) return 'ongoing';
    return 'upcoming';
  };

  const ROUND_STATUS_STYLE: Record<string, { label: (lang: Lang) => string; color: string; bg: string; dot: string }> = {
    completed: {
      label: (l) => L(l, '已结束', 'Completed', '終了'),
      color: 'rgba(134,239,172,0.9)', bg: 'rgba(34,197,94,0.12)', dot: '#22c55e',
    },
    ongoing: {
      label: (l) => L(l, '进行中', 'In Progress', '進行中'),
      color: 'rgba(251,191,36,0.95)', bg: 'rgba(245,158,11,0.12)', dot: '#f59e0b',
    },
    upcoming: {
      label: (l) => L(l, '待开始', 'Upcoming', '未開始'),
      color: 'rgba(148,163,184,0.7)', bg: 'rgba(148,163,184,0.08)', dot: 'rgba(148,163,184,0.5)',
    },
  };

  // ── 按胜场分组渲染单轮 ──
  const renderRoundContent = (round: SwissMatch[], rIdx: number) => {
    const byeIdxs = getByeIndices(rIdx, PARTICIPATING_TOURNAMENT_TEAMS);
    const winsMap = allWinsBeforeRounds[rIdx] ?? {};

    const matchGroups: Record<number, SwissMatch[]> = {};
    round.forEach(m => {
      const b = Math.max(winsMap[m.playerAIdx] ?? 0, winsMap[m.playerBIdx] ?? 0);
      (matchGroups[b] ??= []).push(m);
    });

    const byeGroups: Record<number, number[]> = {};
    byeIdxs.forEach(bi => {
      const b = winsMap[bi] ?? 0;
      (byeGroups[b] ??= []).push(bi);
    });

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
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: bOrd === 0 ? '0 0 6px' : '10px 0 6px' }}>
                <div style={{ width: 3, height: 14, borderRadius: 2, background: gc, boxShadow: `0 0 6px ${gc}` }} />
                <span style={{ fontSize: '0.56rem', fontWeight: 800, color: gc, letterSpacing: '0.07em', textShadow: `0 0 8px ${gc}66` }}>
                  {bracketLabel}
                </span>
                <div style={{ flex: 1, height: 1, background: `linear-gradient(to right,${gc}55,transparent)` }} />
              </div>
              {matches.map((match, mIdx) => (
                <div key={mIdx} style={{ marginBottom: 8 }}>
                  <SwissMatchCard match={match} players={PARTICIPATING_TOURNAMENT_TEAMS} onViewTeam={onClickTeam} factionNames={factionNames} lang={lang} tabsrc={tabsrc} translations={translations} animDelay={rIdx * 0.04 + bOrd * 0.02 + mIdx * 0.02} />
                </div>
              ))}
              {byes.map((bIdx, bi) => {
                const bp = PARTICIPATING_TOURNAMENT_TEAMS[bIdx];
                if (!bp) return null;
                return (
                  <div key={`bye-${bIdx}`} style={{ marginBottom: 8 }}>
                    <ByeCard player={bp} factionNames={factionNames} lang={lang} tabsrc={tabsrc} translations={translations} onViewTeam={onClickTeam} />
                  </div>
                );
              })}
            </div>
          );
        })}
      </>
    );
  };

  // ── 空数据 ──
  if (swissStandings.length === 0 && SWISS_ROUNDS.length === 0) {
    return (
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.88rem', marginTop: 48, textAlign: 'center' }}>
        {T.noSwiss}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* ── 积分榜 ── */}
      {swissStandings.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <BarChart2 size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
            <span style={{ color: 'rgba(255,255,255,0.72)', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.08em' }}>{T.standings}</span>
            <div style={{ display: 'flex', gap: 10, marginLeft: 6 }}>
              {([
                ['#22c55e', L(lang, '胜', 'Win', '勝')],
                ['#ef4444', L(lang, '负', 'Loss', '負')],
                ['#f59e0b', L(lang, '轮空', 'BYE', '不戦勝')],
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
              <SwissStandingRow key={s.idx} standing={s} rank={i + 1} totalRounds={SWISS_ROUNDS.length} onViewTeam={onClickTeam} lang={lang} animDelay={i * 0.035} />
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
          {/* ↓ gap 从 14 → 28，视觉分隔更明显 */}
          <div style={{ display: 'flex', gap: '8vw', overflowX: 'auto', paddingBottom: 8 }}>
            {SWISS_ROUNDS.map((round, rIdx) => {
              const status = getRoundStatus(round);
              const ss = ROUND_STATUS_STYLE[status];
              const isOngoing = status === 'ongoing';

              return (
                <div key={rIdx} style={{ flexShrink: 0 }}>
                  {/* 轮次标题 + 状态徽标 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                    <span style={{ fontSize: '0.57rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(200,220,255,0.72)' }}>
                      {L(lang, `第 ${rIdx + 1} 轮`, `Round ${rIdx + 1}`, `第${rIdx + 1}ラウンド`)}
                    </span>
                    {/* 状态徽标，进行中加脉冲动画 */}
                    <motion.div
                      animate={isOngoing ? { opacity: [1, 0.6, 1] } : {}}
                      transition={isOngoing ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : {}}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0.12rem 0.42rem', borderRadius: 20, background: ss.bg, border: `1px solid ${ss.color}44` }}
                    >
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: ss.dot, boxShadow: isOngoing ? `0 0 5px ${ss.dot}` : 'none' }} />
                      <span style={{ fontSize: '0.48rem', fontWeight: 700, color: ss.color, letterSpacing: '0.06em' }}>{ss.label(lang)}</span>
                    </motion.div>
                  </div>
                  {/* 轮次内容外加左边框区分 */}
                  <div style={{
                    display: 'flex', flexDirection: 'column',
                    borderLeft: `2px solid ${status === 'completed' ? 'rgba(34,197,94,0.3)' : status === 'ongoing' ? 'rgba(245,158,11,0.45)' : 'rgba(148,163,184,0.15)'}`,
                    paddingLeft: 10,
                  }}>
                    {renderRoundContent(round, rIdx)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/** 获取瑞士轮榜首（供顶栏显示） */
export function useSwissLeader(): SwissStanding | null {
  const standings = computeSwissStandings(PARTICIPATING_TOURNAMENT_TEAMS);
  return standings[0] ?? null;
}
