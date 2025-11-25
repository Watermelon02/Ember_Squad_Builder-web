import React from "react";

interface TeamEligibilityProps {
  team: any; // 包含 mechs 数组
  translations: any;
}

export const TeamEligibility: React.FC<TeamEligibilityProps> = ({ team, translations }) => {
  // 判断单台机体是否可参赛
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
      mech.parts.torso,
      mech.parts.chasis,
      mech.parts.leftHand,
      mech.parts.rightHand,
      mech.parts.backpack,
    ].filter(Boolean);

    const hasPD = parts.some((p) => p.isPD);
    const allPD = parts.every((p) => p.isPD);

    let factionMismatch = hasPD && !allPD;

    if (mech.pilot?.faction === 'PD' && !allPD) factionMismatch = true;
    if (mech.pilot?.faction !== 'PD' && hasPD) factionMismatch = true;

    return isUsable && !isBanned && !factionMismatch;
  };

  // 队伍整体是否可参赛：所有机体都可参赛
  const allEligible = team.mechs.every(isMechEligible);

  return (
    <div
      className="bg-gray-100"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '1.4rem',
        minWidth: '4rem',
        padding: '0 0.25rem',
        borderRadius: '0.3rem',
        fontSize: '0.6rem',
        color: allEligible ? 'gray' : '#dc2626', // ✅ 默认灰色，禁赛红色
        transition: 'all 0.3s ease',
        textAlign: 'center',
      }}
    >
      {allEligible ? translations.t83 : translations.t93} {/* 可参赛 / 禁赛 */}
    </div>
  );
};
