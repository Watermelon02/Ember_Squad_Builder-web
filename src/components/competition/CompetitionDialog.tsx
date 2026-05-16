import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Dialog, DialogContent } from '../radix-ui/dialog';
import { BOXES, FACTION_COLORS, Team, TournamentTeam } from '../../data/types';
import { exportTextTeamData } from '../../util/TextUtil';
import { MechImage } from '../custom/MechImage';
import { DroneImage } from '../custom/DroneImage';
import { exportTeamImage } from '../../util/TeamImage';
import { TeamEligibility } from '../radix-ui/TeamEligibility';
import { Badge } from '../radix-ui/badge';
import { allTacticCards } from '../../data/data_cn';


interface CompetitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bannerSrc: string;
  backgroundImgsrc: string;
  tabsrc: string;
  teams: Team[];
  translations: any;
  lang: string;
  localImgsrc: string;
  imgsrc: string;
  factionNames: Record<string, string>;
}

// ── 参赛资格详情类型 ──────────────────────────────────────────────────────────
interface EligibilityIssue {
  itemName: string;
  reason: string;
}

interface TeamEligibilityDetail {
  eligible: boolean;
  issues: EligibilityIssue[];
}
// ─────────────────────────────────────────────────────────────────────────────

// ── 禁赛 ID 常量 ──────────────────────────────────────────────────────────────
const BANNED_PART_IDS = new Set(['005', '040', '150', '117', '038', '152', '119']);
const BANNED_PILOT_IDS = new Set(['LPA-23-2', 'FPA-04-2']);
const BANNED_DRONE_IDS = new Set(['543']);
// ─────────────────────────────────────────────────────────────────────────────

// ── 参赛资格逻辑 ──────────────────────────────────────────────────────────────

const checkPartEligibility = (part: any, teamFaction: string): string | null => {
  if (!part) return null;

  if (BANNED_PART_IDS.has(part.id)) return '众筹禁赛部件';

  const sources: any[] = part.containedIn || [];

  if (teamFaction === 'GOF') {
    // 自由：只要有一个来源是人马包或 isPD 就合法
    const isValid = sources.some(
      s => s.box?.id === BOXES.LAB_GOF_CENTAUR.id
    ) || part.isPD;
    if (!isValid) return '自由派系只能使用已发售的 半人马 SK';
    return null;
  }

  // 联合 / 复兴：只要有一个合法来源就放行
  const illegalReasons: string[] = [];
  let hasValidSource = false;

  for (const source of sources) {
    const boxId = source.box?.id;

    if (boxId === BOXES.UNSALE.id || boxId === BOXES.LAB_PD_CRISIS1.id) {
      illegalReasons.push('未发售的部件不可参赛');
      continue;
    }

    if (boxId === BOXES.COMBAT_RAID.id || boxId === BOXES.GAME_PACK.id) {
      illegalReasons.push('游戏包 / 对战包部件不可参赛（日韩地区未发售）');
      continue;
    }

    // 通过所有检查，找到合法来源
    hasValidSource = true;
    break;
  }

  if (!hasValidSource && illegalReasons.length > 0) {
    // 去重后返回第一条原因
    return [...new Set(illegalReasons)][0];
  }

  return null;
};

const checkPilotEligibility = (pilot: any): string | null => {
  if (!pilot) return null;
  if (BANNED_PILOT_IDS.has(pilot.id)) return '禁赛驾驶员';
  if (pilot.faction === 'GOF' && pilot.id !== 'ZPA-46')
    return '自由派系驾驶员仅允许使用 掷弹兵1';
  if (pilot.faction === 'PD' && pilot.id !== 'XPA-60' && pilot.id !== 'ACE-01')
    return '星环动力驾驶员仅允许使用 战斗员A-102 或 卡尔·弗里德';
  return null;
};

const getTeamEligibilityDetail = (team: Team): TeamEligibilityDetail => {
  const issues: EligibilityIssue[] = [];

  team.mechs.forEach(mech => {
    if (!mech.parts.torso)
      issues.push({ itemName: mech.name, reason: '缺少核心部件' });
    if (!mech.parts.chasis)
      issues.push({ itemName: mech.name, reason: '缺少下肢部件' });
    if (!mech.parts.leftHand && !mech.parts.rightHand)
      issues.push({ itemName: mech.name, reason: '至少需要一个手部武器' });
    if (!mech.pilot)
      issues.push({ itemName: mech.name, reason: '缺少驾驶员' });

    const partSlots = ['torso', 'chasis', 'leftHand', 'rightHand', 'backpack'] as const;
    partSlots.forEach(slot => {
      const part = mech.parts[slot];
      if (!part) return;
      const reason = checkPartEligibility(part, team.faction);
      if (reason) issues.push({ itemName: `${mech.name} › ${part.name}`, reason });
    });

    if (mech.pilot) {
      const reason = checkPilotEligibility(mech.pilot);
      if (reason) issues.push({ itemName: `${mech.name} › 驾驶员 ${mech.pilot.name}`, reason });
    }

    const mechParts = [
      mech.parts.torso, mech.parts.chasis,
      mech.parts.leftHand, mech.parts.rightHand, mech.parts.backpack,
    ].filter(Boolean);
    const hasPD = mechParts.some((p: any) => p.isPD);
    const allPD = mechParts.every((p: any) => p.isPD);

    if (hasPD && !allPD)
      issues.push({ itemName: mech.name, reason: '混用了星环动力部件，部件派系不一致' });
    if (mech.pilot?.faction === 'PD' && !allPD)
      issues.push({
        itemName: `${mech.name} › 驾驶员 ${mech.pilot.name}`,
        reason: '星环动力驾驶员需配合全星环动力部件',
      });
    if (mech.pilot && mech.pilot.faction !== 'PD' && hasPD)
      issues.push({
        itemName: `${mech.name} › 驾驶员 ${mech.pilot.name}`,
        reason: '非星环动力驾驶员不能驾驶星环动力机体',
      });
  });

  team.drones.forEach(drone => {
    if (team.faction === 'GOF' && !drone.isPD) {
      issues.push({ itemName: `无人机 › ${drone.name}`, reason: '自由派系无人机未发售' });
    } else if (BANNED_DRONE_IDS.has(drone.id)) {
      issues.push({ itemName: `无人机 › ${drone.name}`, reason: '离子豪猪禁赛 （日韩地区对战包未发售）' });
    }
  });

  (team.tacticCards || []).forEach(card => {
    issues.push({ itemName: `战术卡 › ${card.name}`, reason: '本届比赛不允许使用战术卡' });
  });

  return { eligible: issues.length === 0, issues };
};
// ─────────────────────────────────────────────────────────────────────────────

// ── 共享样式常量 ──────────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: '14px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)',
  border: '1px solid rgba(0,0,0,0.06)',
  padding: '1rem 1.25rem',
  marginBottom: '0.9rem',
  contentVisibility: 'auto',
  containIntrinsicSize: 'auto 120px',
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

const dialogContentStyle: React.CSSProperties = {
  maxWidth: '58vw', width: '58vw', maxHeight: '88vh', height: 'auto',
  padding: 0, overflow: 'hidden', borderRadius: '20px',
  display: 'flex', flexDirection: 'column',
  boxShadow: '0 24px 60px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.1)',
  background: '#f3f4f6',
  border: '0px solid rgba(0,0,0,0)',
};

const bannerWrapStyle: React.CSSProperties = {
  width: '100%',
  height: '28vh',
  flexShrink: 0,
  position: 'relative',
  overflow: 'hidden',
  contain: 'layout paint',
  transform: 'translateZ(0)',
  willChange: 'transform',
};

const bannerImgStyle: React.CSSProperties = {
  width: '100%', height: '100%',
  objectFit: 'cover', objectPosition: 'center 20%',
  display: 'block',
};

const bannerOverlayStyle: React.CSSProperties = {
  position: 'absolute', inset: 0,
  background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.3) 80%, #f3f4f6 100%)',
  pointerEvents: 'none',
};

const bannerBadgeStyle: React.CSSProperties = {
  position: 'absolute', top: '1rem', left: '1.25rem',
  display: 'inline-flex', alignItems: 'center', gap: '5px',
  background: 'rgba(255,255,255,0.15)',
  border: '1px solid rgba(255,255,255,0.3)',
  borderRadius: '999px', padding: '4px 12px',
};

const pulseDotStyle: React.CSSProperties = {
  width: '6px', height: '6px', borderRadius: '50%', background: '#FD0267',
  boxShadow: '0 0 6px #FD0167',
  animation: 'pulse 2s infinite',
};

const scrollAreaStyle: React.CSSProperties = {
  overflowY: 'auto', flex: 1,
  padding: '1.25rem 1.5rem 1.5rem',
  background: '#f3f4f6',
  transform: 'translateZ(0)',
  willChange: 'scroll-position',
  contain: 'layout style',
  WebkitOverflowScrolling: 'touch',
};

const titleStyle: React.CSSProperties = {
  margin: '0 0 1rem',
  fontSize: '1.3rem',
  fontWeight: 800,
  color: '#000',
  lineHeight: 1.3,
  letterSpacing: '-0.01em',
};

const titleHighlightStyle: React.CSSProperties = {
  color: '#FD0267',
  textShadow: '0 0 2px #fff',
};

const rewardCardStyle: React.CSSProperties = {
  ...card,
  border: '1px solid #fde68a',
  boxShadow: '0 4px 16px rgba(239,255,255,0.15), 0 1px 4px rgba(255,255,255,0.1)',
  display: 'flex', alignItems: 'flex-start', gap: '12px',
  padding: '1rem 1.25rem',
};
// ─────────────────────────────────────────────────────────────────────────────

// ── 比赛信息常量 ──────────────────────────────────────────────────────────────
const COMPETITION_INFO_ROWS = [
  { l: '比赛时间', v: '2026年6月14日-21日（比赛天数根据最终参与人数决定）' },
  { l: '比赛地点', v: '报名成功后进入线上赛群组' },
  { l: '主办方', v: '雀替建构' },
  { l: '参赛资格', v: '中国境内常住者' },
  { l: '报名截止', v: '2026年6月7日' },
  { l: '分数限制', v: '900分' },
];

const infoRowLabelStyle: React.CSSProperties = {
  fontSize: '11px', fontWeight: 600, color: '#6b7280', minWidth: '5em', flexShrink: 0,
};
const infoRowValueStyle: React.CSSProperties = {
  fontSize: '13px', color: '#111827', fontWeight: 500,
};
// ─────────────────────────────────────────────────────────────────────────────

// ── TeamCard 提到组件外部并 memo 化 ───────────────────────────────────────────
interface TeamCardProps {
  team: Team;
  detail: TeamEligibilityDetail;
  factionNames: Record<string, string>;
  translations: any;
  tabsrc: string;
}

const getStats = (team: Team) => [
  { l: '总分', v: team.totalScore },
  { l: '机甲', v: team.mechCount },
  { l: '大型', v: team.largeDroneCount },
  { l: '中型', v: team.mediumDroneCount },
  { l: '小型', v: team.smallDroneCount },
];

const TeamCard: React.FC<TeamCardProps> = React.memo(({ team, detail, factionNames, translations, tabsrc }) => {
  const handleBadgeEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    const badge = e.currentTarget;
    badge.style.transform = 'translateY(-1px)';
    badge.style.boxShadow =
      `0 4px 12px rgba(0,0,0,0.2),
       0 0 12px ${FACTION_COLORS[team.faction]}88,
       0 0 24px ${FACTION_COLORS[team.faction]}44`;
  };
  const handleBadgeLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.currentTarget.style.transform = 'translateY(0)';
  };

  return (
    <div style={{
      flex: 1,
      background: '#ffffff',
      borderRadius: '12px',
      border: detail.eligible ? '1.5px solid #e5e7eb' : '1.5px solid #fca5a5',
      padding: '0.75rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Badge
            style={{
              background: `linear-gradient(to right, ${FACTION_COLORS[team.faction]}, ${FACTION_COLORS[team.faction]}33)`,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.25rem 0.5rem',
              fontWeight: 600,
              cursor: 'default',
              transition: 'box-shadow 0.3s, transform 0.2s',
              display: 'inline-block',
            }}
            onMouseEnter={handleBadgeEnter}
            onMouseLeave={handleBadgeLeave}
          >
            {factionNames[team.faction]}
          </Badge>
          <TeamEligibility team={team} translations={translations} />
          <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#111827' }}>
            {team.name}
          </p>
        </div>
      </div>

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

      {!detail.eligible && detail.issues.length > 0 && (
        <div style={{
          borderRadius: '8px',
          border: '1px solid #fecaca',
          background: '#fff5f5',
          padding: '0.5rem 0.65rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          <span style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#dc2626',
            textTransform: 'uppercase',
            marginBottom: '2px',
          }}>
            不合格原因
          </span>
          {detail.issues.map((issue, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '5px',
              fontSize: '11px',
              lineHeight: 1.5,
            }}>
              <span style={{ color: '#dc2626', flexShrink: 0, marginTop: '1px' }}>✕</span>
              <span>
                <span style={{ fontWeight: 600, color: '#7f1d1d' }}>{issue.itemName}</span>
                <span style={{ color: '#6b7280' }}> — </span>
                <span style={{ color: '#dc2626' }}>{issue.reason}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
TeamCard.displayName = 'TeamCard';
// ─────────────────────────────────────────────────────────────────────────────

export const CompetitionDialog: React.FC<CompetitionDialogProps> = ({
  open, onOpenChange, bannerSrc, backgroundImgsrc, tabsrc, teams, translations, lang, localImgsrc, imgsrc, factionNames
}) => {
  const [showForm, setShowForm] = useState(false);
  const [userQQ, setUserQQ] = useState('');
  const [userName, setUserName] = useState('');
  const [team1Id, setTeam1Id] = useState('');
  const [team2Id, setTeam2Id] = useState('');

  // 延迟渲染重内容：dialog 打开动画跑完再挂载内容
  const [contentReady, setContentReady] = useState(false);
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setContentReady(true), 220);
      return () => clearTimeout(t);
    } else {
      setContentReady(false);
    }
  }, [open]);

  // 横幅图片预加载（与 <img> 标签共用浏览器缓存）
  useEffect(() => {
    if (!bannerSrc) return;
    const img = new Image();
    img.src = bannerSrc;
  }, [bannerSrc]);

  // 二维码图片预加载
  useEffect(() => {
    if (!backgroundImgsrc) return;
    const img = new Image();
    img.src = `${backgroundImgsrc}/competition_qrcode.webp`;
  }, [backgroundImgsrc]);

  const selectedTeam1 = useMemo(
    () => teams.find(t => t.id === team1Id) ?? null,
    [teams, team1Id]
  );
  const selectedTeam2 = useMemo(
    () => teams.find(t => t.id === team2Id) ?? null,
    [teams, team2Id]
  );

  // select 选项列表缓存，避免输入时重复创建
  const teamOptions = useMemo(
    () => teams.map(t => ({ id: t.id, name: t.name, score: t.totalScore })),
    [teams]
  );

  // 资格检查 memo 化，避免输入 QQ/姓名时重复计算
  const team1Detail = useMemo(
    () => selectedTeam1 ? getTeamEligibilityDetail(selectedTeam1) : null,
    [selectedTeam1]
  );
  const team2Detail = useMemo(
    () => selectedTeam2 ? getTeamEligibilityDetail(selectedTeam2) : null,
    [selectedTeam2]
  );

  const bothSelected = !!selectedTeam1 && !!selectedTeam2 && team1Id !== team2Id;
  const factionMatch = bothSelected && selectedTeam1!.faction === selectedTeam2!.faction;
  const team1Eligible = team1Detail?.eligible ?? true;
  const team2Eligible = team2Detail?.eligible ?? true;
  const bothEligible = team1Eligible && team2Eligible;
  const scoreValid = bothSelected && selectedTeam1!.totalScore <= 900 && selectedTeam2!.totalScore <= 900;
  const canExport = !!(userQQ.trim() && userName.trim() && bothSelected && factionMatch && bothEligible && scoreValid);

  const validationHint = (() => {
    if (!bothSelected) return null;
    if (!factionMatch) return `两支军表派系不一致（${selectedTeam1!.faction} / ${selectedTeam2!.faction}），无法报名`;
    if (!team1Eligible) return `"${selectedTeam1!.name}" 含有不符合参赛条件的部件、驾驶员或无人机`;
    if (!team2Eligible) return `"${selectedTeam2!.name}" 含有不符合参赛条件的部件、驾驶员或无人机`;
    if (!scoreValid) return `每张军表的分数必须小于 900 分`;
    return null;
  })();

  const handleExport = useCallback(async () => {
    if (!canExport) return;
    const team1Copy: any = { ...selectedTeam1, tacticCards: selectedTeam1?.tacticCards ? [...selectedTeam1.tacticCards] : selectedTeam1?.tacticCards };
    const team2Copy: any = { ...selectedTeam2, tacticCards: selectedTeam2?.tacticCards ? [...selectedTeam2.tacticCards] : selectedTeam2?.tacticCards };
    if (team1Copy.tacticCards && team1Copy.tacticCards.length > 0) {
      for (let i = 0; i < team1Copy.tacticCards.length; i++) {
        team1Copy.tacticCards[i] = allTacticCards[0];
      }
    }
    if (team2Copy.tacticCards && team2Copy.tacticCards.length > 0) {
      for (let i = 0; i < team2Copy.tacticCards.length; i++) {
        team2Copy.tacticCards[i] = allTacticCards[0];
      }
    }
    const tournamentTeam: TournamentTeam = {
      userQQ: userQQ.trim(),
      userName: userName.trim(),
      team1: team1Copy,
      team2: team2Copy,
    };
    const blob = new Blob([JSON.stringify(tournamentTeam, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${userName.trim()}_报名数据.json`;
    link.click();

    await exportTeamImage(team1Copy, lang, translations, tabsrc, localImgsrc, imgsrc, false, true);
    await exportTeamImage(team2Copy, lang, translations, tabsrc, localImgsrc, imgsrc, false, true);
  }, [canExport, selectedTeam1, selectedTeam2, userQQ, userName, lang, translations, tabsrc, localImgsrc, imgsrc]);

  const handleClose = useCallback(() => onOpenChange(false), [onOpenChange]);
  const handleCopyQQ = useCallback(() => {
    alert('QQ 号已复制到剪贴板！');
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={dialogContentStyle}>

        {/* ── 横幅 ── */}
        <div style={bannerWrapStyle}>
          <img
            src={bannerSrc}
            alt="比赛横幅"
            decoding="async"
            // @ts-ignore — fetchpriority 是较新的 HTML 属性
            fetchpriority="high"
            style={bannerImgStyle}
          />
          <div style={bannerOverlayStyle} />
          <div style={bannerBadgeStyle}>
            <span style={pulseDotStyle} />
            <span style={{ fontSize: '11px', color: '#ffffff', fontWeight: 600, letterSpacing: '0.04em' }}>
              报名进行中
            </span>
          </div>
        </div>

        {/* ── 可滚动内容区（延迟挂载，让打开动画先跑完） ── */}
        <div style={scrollAreaStyle}>
          {!contentReady ? (
            <div style={{ minHeight: '40vh' }} />
          ) : (
            <>
              <h2 style={titleStyle}>
                <span style={titleHighlightStyle}>
                  「月尘：黑曜协议」亚洲锦标赛2026 中国预选赛 线上组
                </span>
              </h2>

              {/* 奖励卡片 */}
              <div style={rewardCardStyle}>
                <span style={{ fontSize: '22px', flexShrink: 0, lineHeight: 1 }}>🏆</span>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: '11px', fontWeight: 700, color: '#92400e', letterSpacing: '0.06em', textTransform: 'uppercase' }}>冠军奖励</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#78350f', lineHeight: 1.6 }}>
                    亚洲锦标赛2026参赛资格，往来路费及比赛期间的住宿费用将由雀替建构承担
                  </p>
                </div>
              </div>

              {/* 比赛信息 */}
              <div style={card}>
                <span style={sectionLabel}>比赛信息</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {COMPETITION_INFO_ROWS.map((row, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={infoRowLabelStyle}>{row.l}</span>
                      <span style={infoRowValueStyle}>{row.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 两列卡片：扫码报名 + 规则指引 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.9rem' }}>
                <div style={{ ...card, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <span style={sectionLabel}>扫码报名</span>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <img
                      src={`${backgroundImgsrc}/competition_qrcode.webp`}
                      alt="报名二维码"
                      loading="lazy"
                      style={{
                        width: '10vh', height: '10vh',
                        objectFit: 'contain',
                        borderRadius: '10px',
                        border: '1px solid #e5e7eb',
                      }}
                    />
                    <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
                      扫描二维码提交报名信息
                    </p>
                  </div>
                  <button onClick={() => setShowForm(v => !v)} style={{
                    padding: '0.48rem 1.2rem', borderRadius: '10px', border: 'none',
                    background: showForm
                      ? '#f3f4f6'
                      : 'linear-gradient(135deg, #FD0267, #FD418D)',
                    color: showForm ? '#374151' : 'white',
                    fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                    boxShadow: showForm
                      ? '0 1px 4px rgba(0,0,0,0.08)'
                      : '0 4px 14px rgba(254,1,102,0.4)',
                    transition: 'all 0.15s',
                    letterSpacing: '0.02em',
                  }}>
                    {showForm ? '收起报名' : '📋 导出报名数据'}
                  </button>
                </div>

                <div style={{ ...card, margin: 0, display: 'flex', flexDirection: 'column',  gap: '0.5rem' }}>
                  <span style={sectionLabel}>比赛规则</span>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <img
                      src={`${backgroundImgsrc}/competition_qqgroup.webp`}
                      alt="报名二维码"
                      loading="lazy"
                      style={{
                        width: '10vh', height: '10vh',
                        objectFit: 'contain',
                        borderRadius: '10px',
                        border: '1px solid #e5e7eb',
                      }}
                    />
                    <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
                      锦标赛规则、可用部件列表等详细信息，请通过资讯群内文件进行查看
                    </p>
                  </div>
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
                    <div>
                      <label style={{ ...sectionLabel, marginBottom: '5px' }}>QQ 号</label>
                      <input
                        style={inputStyle}
                        placeholder="请输入你的 QQ 号"
                        value={userQQ}
                        onChange={e => setUserQQ(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ ...sectionLabel, marginBottom: '5px' }}>名字（不需要真实姓名）</label>
                      <input
                        style={inputStyle}
                        placeholder="请输入名字"
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* 军表选择 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '0.75rem' }}>
                    <div>
                      <label style={{ ...sectionLabel, marginBottom: '5px' }}>参赛军表 1</label>
                      <select style={inputStyle} value={team1Id} onChange={e => setTeam1Id(e.target.value)}>
                        <option value="">-- 请选择 --</option>
                        {teamOptions.map(t => (
                          <option key={t.id} value={t.id} disabled={t.id === team2Id}>
                            {t.name}（{t.score}分）
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ ...sectionLabel, marginBottom: '5px' }}>参赛军表 2</label>
                      <select style={inputStyle} value={team2Id} onChange={e => setTeam2Id(e.target.value)}>
                        <option value="">-- 请选择 --</option>
                        {teamOptions.map(t => (
                          <option key={t.id} value={t.id} disabled={t.id === team1Id}>
                            {t.name}（{t.score}分）
                          </option>
                        ))}
                      </select>
                    </div>
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
                      {selectedTeam1 && team1Detail && (
                        <TeamCard
                          team={selectedTeam1}
                          detail={team1Detail}
                          factionNames={factionNames}
                          translations={translations}
                          tabsrc={tabsrc}
                        />
                      )}
                      {selectedTeam2 && team2Detail && (
                        <TeamCard
                          team={selectedTeam2}
                          detail={team2Detail}
                          factionNames={factionNames}
                          translations={translations}
                          tabsrc={tabsrc}
                        />
                      )}
                    </div>
                  )}

                  {/* 导出按钮 */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                    <button
                      onClick={handleExport}
                      disabled={!canExport}
                      style={{
                        padding: '0.5rem 1.4rem', borderRadius: '10px', border: 'none',
                        background: 'linear-gradient(135deg, #FD0267, #FD418D)',
                        color: 'white',
                        fontSize: '13px', fontWeight: 700,
                        cursor: canExport ? 'pointer' : 'not-allowed',
                        boxShadow: canExport ? '0 4px 12px rgba(239,159,39,0.35)' : 'none',
                        transition: 'all 0.15s',
                        letterSpacing: '0.02em',
                      }}
                    >
                      ↓ 下载报名数据
                    </button>
                   
                  </div>
                </div>
              )}

              {/* ── 底部操作栏 ── */}
              <div style={{
                display: 'flex', gap: '0.6rem', justifyContent: 'flex-end',
                paddingTop: '0.25rem',
              }}>
                <button onClick={handleClose} style={{
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};