import { PART_TYPE_NAMES, Team } from "../data/types";
import { getMechTotalScore } from "./ScoreUtil";

// 辅助函数：替换回车和换行符为空格
const sanitizeName = (name: string) => {
    return name.replace(/[\r\n]/g, ' ');
};

export const exportTextTeamData = (team: Team, translations: any, lang: string) => {

    let clipboardContent = `┏ ${sanitizeName(team.name)}[${translations.t72}：${team.totalScore}${translations.t71}]\n`;

    team.mechs.forEach((mech) => {
        const mechScore = getMechTotalScore(mech);
        clipboardContent += `┣┳ ${sanitizeName(mech.name)}[M.A.P：${mechScore}${translations.t71}]\n`;

        if (mech.parts["torso"]) {
            clipboardContent += `┃┣ ${PART_TYPE_NAMES[lang]["torso"]}：${sanitizeName(mech.parts["torso"].name)}\n`;
        }
        if (mech.parts["chasis"]) {
            clipboardContent += `┃┣ ${PART_TYPE_NAMES[lang]["chasis"]}：${sanitizeName(mech.parts["chasis"].name)}\n`;
        }
        if (mech.parts["leftHand"]) {
            clipboardContent += `┃┣ ${PART_TYPE_NAMES[lang]["leftHand"]}：${sanitizeName(mech.parts["leftHand"].name)}\n`;
        }
        if (mech.parts["rightHand"]) {
            clipboardContent += `┃┣ ${PART_TYPE_NAMES[lang]["rightHand"]}：${sanitizeName(mech.parts["rightHand"].name)}\n`;
        }
        if (mech.parts["backpack"]) {
            clipboardContent += `┃┣ ${PART_TYPE_NAMES[lang]["backpack"]}：${sanitizeName(mech.parts["backpack"].name)}\n`;
        }
        if (mech.pilot) {
            clipboardContent += `┃┗ ${translations.t69}：${sanitizeName(mech.pilot.name)}\n`;
        }
    });
    let droneIndex = 0;
    if (team.drones.length > 0) {
        clipboardContent += `┗┳ [${translations.t70}：${team.drones.reduce((sum, drone) => sum + drone.score + (drone.backpack?.score || 0), 0)}${translations.t71}]\n`;
        team.drones.forEach((drone) => {
            const droneName = sanitizeName(drone.name);
            const backpackName = drone.backpack ? sanitizeName(drone.backpack.name) : null;
            
            if (team.tacticCards && team.tacticCards.length > 0) {
                if (droneIndex == team.drones.length - 1) {
                    clipboardContent += `┃┗ ${droneName}\n`;
                } else {
                    clipboardContent += `┃┣ ${droneName}\n`;
                }
            } else {
                if (droneIndex == team.drones.length - 1) {
                    clipboardContent += `　┗ ${droneName}\n`;
                } else {
                    clipboardContent += `　┣ ${droneName}\n`;
                }
            }

            if (backpackName) {
                clipboardContent += `    ┃  ┗ ${backpackName}\n`;
            }
            droneIndex++;
        });
    }

    let tacticCardIndex = 0;
    if (team.tacticCards && team.tacticCards.length > 0) {
        clipboardContent += `┗┳ [${translations.t90}：${team.tacticCards.reduce((sum, tacticCard) => sum + tacticCard.score + (tacticCard.backpack?.score || 0), 0)}${translations.t71}]\n`;
        team.tacticCards.forEach((tacticCard) => {
            const tacticCardName = sanitizeName(tacticCard.name);
            if (tacticCardIndex == team.tacticCards.length - 1) {
                clipboardContent += `　┗ ${tacticCardName}\n`;
            } else {
                clipboardContent += `　┣ ${tacticCardName}\n`;
            }
            tacticCardIndex++;
        });
    }

    navigator.clipboard.writeText(clipboardContent).then(() => {
        alert(translations.t1);
    }).catch((err) => {
        alert(translations.t2);
    });
};