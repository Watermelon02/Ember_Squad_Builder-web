import { PART_TYPE_NAMES, Team, Drone } from "../data/types";
import { getMechTotalScore } from "./ScoreUtil";

const sanitizeName = (name: string) => name.replace(/[\r\n]/g, ' ');

// 将无人机列表合并为分组（相同 id + 相同背包视为同一种）
interface DroneGroup {
    drone: Drone;
    count: number;
    totalScore: number;
}

const groupDrones = (drones: Drone[]): DroneGroup[] => {
    const map = new Map<string, DroneGroup>();
    drones.forEach(drone => {
        const key = `${drone.id}__${drone.backpack?.id ?? ''}`;
        if (map.has(key)) {
            const group = map.get(key)!;
            group.count += 1;
            group.totalScore += drone.score + (drone.backpack?.score ?? 0);
        } else {
            map.set(key, {
                drone,
                count: 1,
                totalScore: drone.score + (drone.backpack?.score ?? 0),
            });
        }
    });
    return Array.from(map.values());
};

export const exportTextTeamData = (team: Team, translations: any, lang: string) => {
    const hasDrones = team.drones.length > 0;
    const hasTacticCards = !!(team.tacticCards && team.tacticCards.length > 0);
    const hasTrailingSection = hasDrones || hasTacticCards;

    let out = `┏━ ${sanitizeName(team.name)}【${translations.t72}：${team.totalScore}${translations.t71}】\n`;

    team.mechs.forEach((mech, mechIdx) => {
        const isLastMech = mechIdx === team.mechs.length - 1 && !hasTrailingSection;
        const mechBranch = isLastMech ? '┗┳' : '┣┳';
        const mechVLine  = isLastMech ? '　' : '┃';

        out += `${mechBranch} ${sanitizeName(mech.name)}【M.A.P：${getMechTotalScore(mech)}${translations.t71}】\n`;

        const partKeys = (['torso', 'chasis', 'leftHand', 'rightHand', 'backpack'] as const)
            .filter(k => mech.parts[k]);
        const hasPilot = !!mech.pilot;

        partKeys.forEach((key, i) => {
            const isLast = !hasPilot && i === partKeys.length - 1;
            out += `${mechVLine}${isLast ? '┗' : '┣'} ${PART_TYPE_NAMES[lang][key]}：${sanitizeName(mech.parts[key]!.name)}\n`;
        });

        if (hasPilot) {
            out += `${mechVLine}┗ ${translations.t69}：${sanitizeName(mech.pilot!.name)}\n`;
        }

        if (!isLastMech) {
            out += `┃\n`;
        }
    });

    // 无人机
    if (hasDrones) {
        const droneScore = team.drones.reduce((s, d) => s + d.score + (d.backpack?.score ?? 0), 0);
        const droneBranch = hasTacticCards ? '┣┳' : '┗┳';
        const droneVLine  = hasTacticCards ? '┃' : '　';

        out += `${droneBranch}【${translations.t70}：${droneScore}${translations.t71}】\n`;

        const groups = groupDrones(team.drones);
        groups.forEach((group, i) => {
            const { drone, count } = group;
            const isLast = i === groups.length - 1;
            const droneName = sanitizeName(drone.name);
            const countStr  = count > 1 ? ` x${count}` : '';

            out += `${droneVLine}${isLast ? '┗' : '┣'} ${droneName}${countStr}\n`;

            if (drone.backpack) {
                const innerVLine = isLast ? '　　' : `${droneVLine}　`;
                out += `${innerVLine}┗ ${sanitizeName(drone.backpack.name)}\n`;
            }
        });
    }

    // 战术卡
    if (hasTacticCards) {
        const tacticScore = team.tacticCards!.reduce((s, tc) => s + tc.score, 0);
        out += `┗┳【${translations.t90}：${tacticScore}${translations.t71}】\n`;

        team.tacticCards!.forEach((tc, i) => {
            const isLast = i === team.tacticCards!.length - 1;
            out += `　${isLast ? '┗' : '┣'} ${sanitizeName(tc.name)}\n`;
        });
    }

    navigator.clipboard.writeText(out)
        .then(() => alert(translations.t1))
        .catch(() => alert(translations.t2));
};