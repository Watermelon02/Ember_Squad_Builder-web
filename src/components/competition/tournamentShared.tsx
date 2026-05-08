/**
 * tournamentShared.tsx
 *
 * 淘汰赛 & 瑞士轮共用的 UI 组件：
 * QQAvatar, TeamViewButtons, PlayerCard, Connector, TeamDetailModal
 */

import React, { useState, memo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Swords, Crown } from 'lucide-react';
import { Team, TournamentTeam, FACTION_COLORS } from '../../data/types';
import { MechImage } from '../custom/MechImage';
import { DroneImage } from '../custom/DroneImage';
import type { MatchConfig, Lang } from './data/tournamentTypes';

// ════════════════════════════════════════════════════════════
// ██  QQ 头像
// ════════════════════════════════════════════════════════════

const FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'%3E" +
  "%3Ccircle cx='18' cy='18' r='18' fill='%23b0b8c8'/%3E" +
  "%3Ccircle cx='18' cy='14' r='7' fill='%23fff'/%3E" +
  "%3Cellipse cx='18' cy='31' rx='11' ry='8' fill='%23fff'/%3E%3C/svg%3E";

export const QQAvatar: React.FC<{ qq: string; size?: number }> = memo(({ qq, size = 26 }) => (
  <img src={`https://q1.qlogo.cn/g?b=qq&nk=${qq}&s=5`} alt="" width={size} height={size}
    style={{ borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(255,255,255,0.6)', background: '#c8cdd6', flexShrink: 0 }}
    onError={e => { e.currentTarget.src = FALLBACK; }} />
));

// ════════════════════════════════════════════════════════════
// ██  表一/表二 查看按钮组
// ════════════════════════════════════════════════════════════

export const TeamViewButtons: React.FC<{
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
// ██  PlayerCard
// ════════════════════════════════════════════════════════════

const ITEM_SIZE = 40;
const ITEMS_PER_ROW = 4;

export const PlayerCard: React.FC<{
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
    { l: lang === 'zh' ? '大' : 'L', v: team.largeDroneCount },
    { l: lang === 'zh' ? '中' : 'M', v: team.mediumDroneCount },
    { l: lang === 'zh' ? '小' : 'S', v: team.smallDroneCount },
  ];
  const totalItems = (team.mechs?.length ?? 0) + (team.drones?.length ?? 0);
  const ph = (totalItems % ITEMS_PER_ROW === 0) ? 0 : ITEMS_PER_ROW - totalItems % ITEMS_PER_ROW;
  const slotColor = slot === 0 ? '#3b82f6' : '#a855f7';
  const slotLabel = slot === 0
    ? (lang === 'zh' ? '表一' : lang === 'jp' ? 'チーム①' : 'Team 1')
    : (lang === 'zh' ? '表二' : lang === 'jp' ? 'チーム②' : 'Team 2');

  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e) => {
    e.stopPropagation(); // 阻止事件冒泡，不触发父按钮点击
    navigator.clipboard.writeText(player.userQQ);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // 2秒后恢复
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: isLoser ? 0.45 : 1, y: 0 }}
      transition={{ delay: animDelay, duration: 0.24, ease: 'easeOut' }}
      whileHover={!isLoser ? { scale: 1.015, transition: { duration: 0.1 } } : {}}
      whileTap={!isLoser ? { scale: 0.975 } : {}}
      onClick={() => onClickTeam(team)}
      style={{ width: champion ? 224 : 200, borderRadius: 13, overflow: 'hidden', border: `1.5px solid ${borderC}`, background: isLoser ? 'rgba(210,210,210,0.14)' : 'rgba(255,255,255,0.36)', boxShadow: shadow, cursor: 'pointer', padding: '0.42rem 0.52rem', display: 'flex', flexDirection: 'column', gap: '0.24rem', textAlign: 'left', position: 'relative' }}
    >
      {champion && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#FFD700,#FFA500,#FFD700)', borderRadius: '13px 13px 0 0' }} />}
      {!champion && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: isWinner ? fc : 'rgba(180,180,180,0.15)', borderRadius: '13px 0 0 13px' }} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, paddingLeft: 5 }}>
        <QQAvatar qq={player.userQQ} size={22} />
        <span style={{ flex: 1, fontWeight: 700, fontSize: '0.74rem', color: isLoser ? 'rgba(80,80,80,0.4)' : 'rgba(15,15,15,0.88)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{player.userName}</span>
        <span
          onClick={handleCopy}
          style={{
            flex: 1,
            fontWeight: 700,
            fontSize: '0.54rem',
            color: isLoser ? 'rgba(80,80,80,0.4)' : (copied ? '#10b981' : 'rgba(15,15,15,1)'), // 复制后变绿
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            opacity: 0.7,
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.2s'
          }}
        >
          {/* 这里的逻辑：点击后短时间内显示“已复制”，否则显示 QQ 号 */}
          {copied ? '✅ 已复制' : player.userQQ}

        </span>
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
      <TeamViewButtons player={player} activeSlot={hideSlot ? undefined : slot} onViewTeam={onClickTeam} lang={lang} style={{ paddingLeft: 3, marginTop: 1, opacity: isLoser ? 0.85 : 1 }} />
    </motion.button>
  );
});

// ════════════════════════════════════════════════════════════
// ██  SingleMatch（淘汰赛 & 共用对局卡）
// ════════════════════════════════════════════════════════════

export const SingleMatch: React.FC<{
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
        <VsSeparator />
        <div style={{ padding: '0.2rem 0.48rem 0.42rem' }}>
          <PlayerCard player={playerB} slot={config.selectionB} status={stB as any} onClickTeam={onClickTeam} factionNames={factionNames} lang={lang} tabsrc={tabsrc} translations={translations} animDelay={animDelay + 0.04} hideSlot={tbd} />
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// ██  VS 分隔线 & Connector
// ════════════════════════════════════════════════════════════

export const VsSeparator: React.FC = memo(() => (
  <div style={{ display: 'flex', alignItems: 'center', padding: '0.06rem 0.85rem', borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'rgba(0,0,0,0.03)' }}>
    <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.07)' }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'rgba(100,100,100,0.36)', fontSize: '0.52rem', fontWeight: 800, margin: '0 0.4rem' }}>
      <Swords size={6} style={{ opacity: 0.32 }} />VS<Swords size={6} style={{ opacity: 0.32, transform: 'scaleX(-1)' }} />
    </div>
    <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.07)' }} />
  </div>
));

export const Connector: React.FC = () => (
  <div style={{ flexShrink: 0, color: 'rgba(255,255,255,0.25)', fontSize: '7rem', lineHeight: 1, userSelect: 'none', paddingBottom: 1 }}>›</div>
);

export const BracketGroup: React.FC<{
  source1: React.ReactNode; source2: React.ReactNode;
  output: React.ReactNode; innerGap?: number; colGap?: number;
}> = ({ source1, source2, output, innerGap = 10, colGap = 20 }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: innerGap }}>{source1}{source2}</div>
    <div style={{ width: colGap, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Connector /></div>
    {output}
  </div>
);

// ════════════════════════════════════════════════════════════
// ██  TeamDetailModal
// ════════════════════════════════════════════════════════════

export const TeamDetailModal: React.FC<{
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 1.2rem', borderBottom: `1px solid ${fc}2a`, background: `#EEEEEE`, backdropFilter: 'blur(20px)', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: fc, boxShadow: `0 0 7px ${fc}` }} />
                    <span style={{ color: '#929292', fontWeight: 700, fontSize: '0.96rem' }}>{team.name}</span>
                    <span style={{ padding: '0.12rem 0.55rem', borderRadius: 7, background: `${fc}22`, color: fc, fontSize: '0.65rem', fontWeight: 700, border: `1px solid ${fc}38` }}>{factionNames[team.faction] ?? team.faction}</span>
                    {team.totalScore > 0 && <span style={{ color: '#929292', fontSize: '0.96rem' }}>{team.totalScore} 分</span>}
                  </div>
                  <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0.3rem 0.72rem', borderRadius: 9, background: 'rgba(255,255,255,0.07)', border: '1px solid grey', color: '#929292', cursor: 'pointer', fontSize: '0.74rem', fontWeight: 600 }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')} onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}>
                    {lang === 'zh' ? '关闭' : lang === 'jp' ? '閉じる' : 'Close'}
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
