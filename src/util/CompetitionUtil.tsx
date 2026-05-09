import { Part } from "../data/types";

// 判断该部件是否可参赛
const isPartEligible = (part: Part) => {
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