import { useState } from "react";
import { Mech, PART_TYPE_NAMES, Team } from "../data/types";
import { getImage } from "./ImageGetter";

async function generateAndUploadMechImage(team: Team, mech: Mech, lang: string, tabsrc: string, mechImgSrc: string): Promise<string> {
    const partOrder: (keyof Mech['parts'])[] = ['leftHand', 'torso', 'chasis', 'rightHand', 'backpack'];
    const targetSize = 800;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    const padding = 0;
    const canvasSize = targetSize + padding * 2;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // faction 渐变背景
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    if (team.faction === "RDL") {
        gradient.addColorStop(0, `rgba(237,114,124,1)`);
        gradient.addColorStop(1, `rgba(255,255,255,1)`);
    } else if (team.faction === "UN") {
        gradient.addColorStop(0, `rgba(108,128,192,1)`);
        gradient.addColorStop(0.5, `rgba(150,177,209,1)`);
        gradient.addColorStop(1, `rgba(255,255,255,1)`);
    } else {
        // gradient.addColorStop(0.00, `#FFB84D`);
        // gradient.addColorStop(0.33, `#FFD91A`);
        // gradient.addColorStop(0.66, `#FFF585`);
        // gradient.addColorStop(1.00, `#FBFFC2`);
        gradient.addColorStop(0.0, `#FFB84D`);
        gradient.addColorStop(0.5, `#FFED94`);
        gradient.addColorStop(1.0, `#FFFFFF`);
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 加载部件图片
    const partImgs = await Promise.all(
        partOrder.map(async (k) => {
            const id = mech.parts[k]?.id;
            if (!id) return null;

            // ✅ 如果是背包，且阵营为 UN，则从 tabsrc 加载
            if (k === "backpack" && team.faction === "UN") {
                return await getImage(`${tabsrc}/${id}.png`);
            }

            // ✅ 否则走 mechImgSrc 默认逻辑
            return await getImage(`${mechImgSrc}/${id}.png`);
        })
    );


    const torsoImg = partImgs[1];
    const leftHandImg = partImgs[0];
    const chasisImg = partImgs[2];
    const rightHandImg = partImgs[3];


    const drawPart = (img: HTMLImageElement | null, x: number, y: number) => {
        if (!img) return;
        ctx.drawImage(img, x, y, targetSize, targetSize);
    };

    // 绘制背包在左上角
    if (team.faction == "RDL") {
        const backpackImg = partImgs[4]
        drawPart(backpackImg, padding, padding)
    } else {
        if (mech.parts.backpack?.id) {
            const backpackImg = await getImage(`${tabsrc}/${mech.parts.backpack.id}.png`);

            // 按比例缩小
            const scale = 0.5; // 缩小为 1/3
            const backpackWidth = backpackImg.width * scale;
            const backpackHeight = backpackImg.height * scale;

            const x = padding;
            const y = canvas.height - padding - backpackHeight; // 左下角
            ctx.drawImage(backpackImg, x, y, backpackWidth, backpackHeight);
        }
    }

    // 按顺序叠加部件
    drawPart(leftHandImg, padding, padding);
    drawPart(torsoImg, padding, padding);
    drawPart(chasisImg, padding, padding);
    drawPart(rightHandImg, padding, padding);




    // 生成 PNG Blob
    const blob: Blob = await new Promise(resolve =>
        canvas.toBlob(b => resolve(b!), "image/png")
    );

    // 生成时间戳，不然会导致路径重复（格式：YYYYMMDD_HHmmss）
    const now = new Date();
    const timestamp = now
        .toISOString()
        .replace(/[-T:.Z]/g, '')   // 去掉无关字符
        .slice(0, 15)              // 保留 YYYYMMDDHHmmss
        .replace(/(\d{8})(\d{6})/, '$1_$2'); // 加个下划线分隔日期和时间

    // 示例：timestamp = "20251113_104530"

    // 拼接文件名
    const fileName = `mech_${mech.id}_${timestamp}.png`;

    // 上传路径
    const uploadUrl = `https://op-1307392056.cos.ap-guangzhou.myqcloud.com/mechs/${fileName}`;


    await fetch(uploadUrl, {
        method: 'PUT',
        body: blob,
    });

    return uploadUrl; // ✅ 返回 URL
}

async function uploadTTSToCOS(jsonData: string, fileName: string,): Promise<string> {
    const blob = new Blob([jsonData], { type: 'application/txt' });
    const uploadUrl = `https://op-1307392056.cos.ap-guangzhou.myqcloud.com/ttsURL/${fileName}`;

    await fetch(uploadUrl, {
        method: 'PUT',
        body: blob,
    });

    return uploadUrl; // 返回可访问的 URL
}

async function exportTeamToTTS(team: Team, lang: string, tabsrc: string, mechImgSrc: string) {
    const mechImageUrls: Record<string, string> = {};

    // 生成每台机体图片
    await Promise.all(
        team.mechs.map(async mech => {
            const url = await generateAndUploadMechImage(team, mech, lang, tabsrc, mechImgSrc);
            mechImageUrls[mech.id] = url;
        })
    );


    // 开始生成指令文本
    let langCode = lang === "zh" ? "cn" : lang;
    let ttsScript = `# Team ${team.name} [${team.id}] Faction: ${team.faction} Lang: ${langCode}\n\n`;


    // 处理机体
    for (const mech of team.mechs) {
        const url = mechImageUrls[mech.id] || "";
        ttsScript += `# Mech ${mech.name} ${mech.id} ${url}\n`;
        ttsScript += `Pilot: ${mech.pilot?.id}\n`;

        const parts = ["torso", "chasis", "leftHand", "rightHand", "backpack"] as const;
        for (const key of parts) {
            const part = mech.parts[key];
            if (part) {
                const throwText = part.throwIndex ? ` [throwIndex:${part.throwIndex}]` : "";
                ttsScript += `${PART_TYPE_NAMES["en"][key]}: ${part.id}${throwText}\n`;
            }
        }

        // 投射物
        const projectiles: string[] = [];
        parts.forEach(key => {
            const part = mech.parts[key];
            if (part?.projectile) projectiles.push(...part.projectile);
        });
        if (projectiles.length > 0) {
            ttsScript += `Projectile: ${projectiles.join(",")}\n`;
        }

        ttsScript += "\n";
    }

    // 处理无人机
    for (const drone of team.drones) {
        ttsScript += `# Drone ${drone.name} ${drone.id}\n`;
        if (drone.projectile && drone.projectile.length > 0) {
            ttsScript += `Projectile: ${drone.projectile.join(",")}\n`;
        }
        ttsScript += "\n";
    }

    // 处理战术卡
    if (team.tacticCards && team.tacticCards.length > 0) {
        for (const tacticCard of team.tacticCards) {
            ttsScript += `# TacticCard ${tacticCard.name} ${tacticCard.id}\n\n`;
        }
    }

    // 上传到 COS
    const fileName = `tts_${Date.now()}.txt`;
    const cosUrl = await uploadTTSToCOS(ttsScript, fileName);

    // 返回 TTS 指令
    return `!spawn-team-tts-url ${cosUrl}`;
}

export async function exportTTS(team: Team, lang: string, tabsrc: string, mechImgSrc: string) {
    return await exportTeamToTTS(team, lang, tabsrc, mechImgSrc);
}