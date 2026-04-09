/**
 * EliminationView.tsx
 *
 * 淘汰赛对阵图组件。
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { Team, TournamentTeam, FACTION_COLORS } from '../../data/types';
import { PARTICIPATING_TOURNAMENT_TEAMS } from './data/ParticipatingTeams';
import { nextPow2, getCfg, subWinner, L, type Lang } from './data/tournamentTypes';
import { PlayerCard, SingleMatch, Connector, BracketGroup } from './tournamentShared';

// ════════════════════════════════════════════════════════════
// ██  Props
// ════════════════════════════════════════════════════════════

interface EliminationViewProps {
  lang: Lang;
  factionNames: Record<string, string>;
  tabsrc: string;
  translations: any;
  onClickTeam: (t: Team) => void;
}

// ════════════════════════════════════════════════════════════
// ██  EliminationView
// ════════════════════════════════════════════════════════════

export const EliminationView: React.FC<EliminationViewProps> = ({
  lang, factionNames, tabsrc, translations, onClickTeam,
}) => {
  // ── 填充选手到 2^n ──
  const paddedPlayers = useMemo<(TournamentTeam | null)[]>(() => {
    const n = PARTICIPATING_TOURNAMENT_TEAMS.length;
    if (n === 0) return [];
    const p = nextPow2(n);
    return [...PARTICIPATING_TOURNAMENT_TEAMS, ...Array(p - n).fill(null)];
  }, []);

  const numRounds = paddedPlayers.length > 1
    ? Math.log2(paddedPlayers.length)
    : paddedPlayers.length === 1 ? 0 : -1;

  const allIdxs = useMemo(() => paddedPlayers.map((_, i) => i), [paddedPlayers]);

  const championPlayer = useMemo(
    () => numRounds >= 0 ? subWinner(allIdxs, Math.max(numRounds - 1, 0), 0, paddedPlayers) : null,
    [allIdxs, numRounds, paddedPlayers],
  );

  const finalCfg = getCfg(Math.max(numRounds - 1, 0), 0);
  const champSlot: 0 | 1 = finalCfg.winner == null ? 0 : finalCfg.winner === 0 ? finalCfg.selectionA : finalCfg.selectionB;
  const champTeam = championPlayer ? (champSlot === 0 ? championPlayer.team1 : championPlayer.team2) : null;
  const champFC = champTeam ? (FACTION_COLORS[champTeam.faction] ?? '#888') : '#888';

  // ── 文案 ──
  const T = {
    champ: L(lang, '冠军', 'Champion', '優勝'),
    tbd:   L(lang, '待决出', '???', '未定'),
    noElim:L(lang, '暂无参赛选手', 'No players registered', '参加プレイヤーなし'),
  };

  // ── 轮次名称 ──
  const roundName = (r: number) => {
    if (r === numRounds - 1) return L(lang, '决赛', 'Final', '決勝');
    if (r === numRounds - 2 && numRounds >= 3) return L(lang, '半决赛', 'Semi', '準決勝');
    return L(lang, `第${r + 1}轮`, `Round ${r + 1}`, `${r + 1}回戦`);
  };

  // ── 递归对阵图 ──
  const renderNode = (idxs: number[], round: number, match: number, depth: number): React.ReactNode => {
    const delay = match * 0.03 + depth * 0.01;
    if (idxs.length === 2) {
      return (
        <SingleMatch
          playerA={paddedPlayers[idxs[0]] ?? null}
          playerB={paddedPlayers[idxs[1]] ?? null}
          config={getCfg(round, match)}
          onClickTeam={onClickTeam}
          factionNames={factionNames} lang={lang} tabsrc={tabsrc} translations={translations}
          animDelay={delay} roundLabel={roundName(round)}
        />
      );
    }
    const h = idxs.length >> 1;
    const lI = idxs.slice(0, h), rI = idxs.slice(h);
    return (
      <BracketGroup
        innerGap={Math.max(8, 28 - depth * 5)} colGap={80}
        source1={renderNode(lI, round - 1, match * 2, depth + 1)}
        source2={renderNode(rI, round - 1, match * 2 + 1, depth + 1)}
        output={
          <SingleMatch
            playerA={subWinner(lI, round - 1, match * 2, paddedPlayers)}
            playerB={subWinner(rI, round - 1, match * 2 + 1, paddedPlayers)}
            config={getCfg(round, match)}
            onClickTeam={onClickTeam}
            factionNames={factionNames} lang={lang} tabsrc={tabsrc} translations={translations}
            animDelay={delay + 0.08} roundLabel={roundName(round)}
          />
        }
      />
    );
  };

  // ── 渲染 ──
  if (paddedPlayers.length === 0) {
    return (
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.88rem', marginTop: 48, textAlign: 'center' }}>
        {T.noElim}
      </div>
    );
  }

  if (paddedPlayers.length === 1) {
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.58rem', fontWeight: 800, color: '#FFD700' }}>
          <Crown size={10} /> {T.champ} <Crown size={10} />
        </div>
        {paddedPlayers[0] && (
          <PlayerCard
            player={paddedPlayers[0]} slot={0} status="champion" champion
            onClickTeam={onClickTeam} factionNames={factionNames}
            lang={lang} tabsrc={tabsrc} translations={translations}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 22, minWidth: 'max-content' }}>
      {renderNode(allIdxs, numRounds - 1, 0, 0)}
      <Connector />
      {championPlayer && champTeam ? (
        <motion.div
          animate={{
            boxShadow: [
              `0 0 14px ${champFC}33,0 0 0 1.5px rgba(255,215,0,0.4)`,
              `0 0 32px ${champFC}55,0 0 0 2px rgba(255,215,0,0.65)`,
              `0 0 14px ${champFC}33,0 0 0 1.5px rgba(255,215,0,0.4)`,
            ],
          }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ borderRadius: 16 }}
        >
          <div style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.57rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#FFD700', textShadow: '0 0 10px #FFD70077' }}>
            <Crown size={10} /> {T.champ} <Crown size={10} />
          </div>
          <PlayerCard
            player={championPlayer} slot={champSlot} status="champion" champion
            onClickTeam={onClickTeam} factionNames={factionNames}
            lang={lang} tabsrc={tabsrc} translations={translations} animDelay={0.5}
          />
        </motion.div>
      ) : (
        <div>
          <div style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.57rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#FFD700' }}>
            <Crown size={10} /> {T.champ} <Crown size={10} />
          </div>
          <div style={{ width: 222, height: 68, borderRadius: 13, border: '2px dashed rgba(255,215,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,215,0,0.2)', fontSize: '0.7rem', fontStyle: 'italic' }}>
            {T.tbd}
          </div>
        </div>
      )}
    </div>
  );
};

/** 获取冠军选手信息（供顶栏显示） */
export function useEliminationChampion() {
  const n = PARTICIPATING_TOURNAMENT_TEAMS.length;
  if (n === 0) return null;
  const p = nextPow2(n);
  const paddedPlayers: (TournamentTeam | null)[] = [...PARTICIPATING_TOURNAMENT_TEAMS, ...Array(p - n).fill(null)];
  const numRounds = paddedPlayers.length > 1 ? Math.log2(paddedPlayers.length) : paddedPlayers.length === 1 ? 0 : -1;
  const allIdxs = paddedPlayers.map((_, i) => i);
  return numRounds >= 0 ? subWinner(allIdxs, Math.max(numRounds - 1, 0), 0, paddedPlayers) : null;
}
