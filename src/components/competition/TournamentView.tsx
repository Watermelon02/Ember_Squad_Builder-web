/**
 * TournamentView.tsx (v7)
 *
 * 变更（相对 v6）：
 * - 将淘汰赛和瑞士轮拆分为独立组件
 * - 本文件仅保留外壳（顶栏、模式切换、底部状态栏）+ 子视图委托
 *
 * 文件结构：
 *   tournamentTypes.ts     — 接口、数据、工具函数
 *   tournamentShared.tsx   — 共用 UI 组件
 *   EliminationView.tsx    — 淘汰赛
 *   SwissView.tsx          — 瑞士轮
 *   TournamentView.tsx     — 本文件（外壳）
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Crown, Shield, BarChart2, GitMerge } from 'lucide-react';
import { Team } from '../../data/types';

import { TOURNAMENT_MODE, L, type Lang } from './data/tournamentTypes';
import { TeamDetailModal } from './tournamentShared';
import { EliminationView, useEliminationChampion } from './EliminationView';
import { SwissView, useSwissLeader } from './SwissView';
import { PARTICIPATING_TOURNAMENT_TEAMS } from './data/ParticipatingTeams';

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
// ██  TournamentView 主组件（外壳）
// ════════════════════════════════════════════════════════════

export const TournamentView: React.FC<TournamentViewProps> = ({
  lang, factionNames, backgroundImgsrc, tabsrc, translations, onClose, mechListRenderer,
}) => {
  const [detailTeam, setDetailTeam] = useState<Team | null>(null);
  const [viewMode, setViewMode] = useState<'elimination' | 'swiss'>(
    TOURNAMENT_MODE === 'swiss' ? 'swiss' : 'elimination',
  );

  // ── 顶栏信息 ──
  const championPlayer = useMemo(() => useEliminationChampion(), []);
  const swissLeader = useMemo(() => useSwissLeader(), []);

  const canSwitch = TOURNAMENT_MODE === 'both';

  // ── 文案 ──
  const T = {
    title: L(lang, '「马蒂尼杯」比赛进度', 'Tournament', '大会進行'),
    back:  L(lang, '返回', 'Back', '戻る'),
    elim:  L(lang, '淘汰赛', 'Bracket', '決勝T'),
    swiss: L(lang, '瑞士轮', 'Swiss', 'スイス'),
    hint:  L(lang,
      `共 ${PARTICIPATING_TOURNAMENT_TEAMS.filter(Boolean).length} 位选手参赛 · 点击名片查看阵容详情`,
      `${PARTICIPATING_TOURNAMENT_TEAMS.filter(Boolean).length} players · Click a card to view details`,
      `${PARTICIPATING_TOURNAMENT_TEAMS.filter(Boolean).length} 名参加 · カードをタップで詳細確認`,
    ),
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

          {/* 淘汰赛冠军标签 */}
          {viewMode === 'elimination' && championPlayer && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0.15rem 0.72rem', borderRadius: 20, background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.22)', marginLeft: 4 }}>
              <Crown size={10} style={{ color: '#FFD700' }} />
              <span style={{ color: '#FFD700', fontSize: '0.7rem', fontWeight: 700 }}>{championPlayer.userName}</span>
            </motion.div>
          )}

          {/* 瑞士轮榜首标签 */}
          {viewMode === 'swiss' && swissLeader && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0.15rem 0.72rem', borderRadius: 20, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.22)', marginLeft: 4 }}>
              <span style={{ fontSize: '0.72rem' }}>🥇</span>
              <span style={{ color: '#22c55e', fontSize: '0.7rem', fontWeight: 700 }}>{swissLeader.player.userName}</span>
              <span style={{ color: 'rgba(34,197,94,0.6)', fontSize: '0.62rem' }}>{swissLeader.wins}W</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* 模式切换 */}
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

          {/* 返回按钮 */}
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
          {viewMode === 'elimination' && (
            <motion.div key="elim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <EliminationView
                lang={lang} factionNames={factionNames}
                tabsrc={tabsrc} translations={translations}
                onClickTeam={setDetailTeam}
              />
            </motion.div>
          )}
          {viewMode === 'swiss' && (
            <motion.div key="swiss" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <SwissView
                lang={lang} factionNames={factionNames}
                tabsrc={tabsrc} translations={translations}
                onClickTeam={setDetailTeam}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── 底部状态栏 ── */}
      <div style={{ position: 'relative', zIndex: 2, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 7, padding: '0.33rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.18)' }}>
        <Shield size={10} style={{ color: 'rgba(255,255,255,0.18)' }} />
        <span style={{ color: 'rgba(255,255,255,0.24)', fontSize: '0.62rem' }}>{T.hint}</span>
      </div>

      {/* ── 详情弹窗 ── */}
      <TeamDetailModal
        team={detailTeam} lang={lang} factionNames={factionNames}
        backgroundImgsrc={backgroundImgsrc}
        onClose={() => setDetailTeam(null)}
        mechListRenderer={mechListRenderer}
      />
    </div>
  );
};

export default TournamentView;
