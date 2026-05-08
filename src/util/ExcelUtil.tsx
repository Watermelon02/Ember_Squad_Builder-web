// exportHTMLCards.ts

import { PART_TYPE_NAMES, Team, Mech } from "../data/types";
import { getMechTotalScore } from "./ScoreUtil";
import { getImage } from "./ImageGetter";

const toImageLang = (lang: string) => (lang === "zh" ? "cn" : lang);

const getCardUrl = (idOrUrl: string, lang: string) => {
    if (/^https?:\/\//.test(idOrUrl)) return idOrUrl;
    const l = toImageLang(lang);
    return l === "cn"
        ? `https://op-1307392056.cos.ap-guangzhou.myqcloud.com/res/cn/${idOrUrl}.png`
        : `https://raw.githubusercontent.com/Watermelon02/builder-web/main/res/${l}/${idOrUrl}.png`;
};

const getPilotFaceUrl = (pilotId: string, lang: string) => {
    const l = toImageLang(lang);
    return l === "cn"
        ? `https://op-1307392056.cos.ap-guangzhou.myqcloud.com/res/cn/pilot_dial/${pilotId}-face.png?v=1`
        : `https://raw.githubusercontent.com/Watermelon02/builder-web/main/res/${l}/pilot_dial/${pilotId}-face.png`;
};

// ── 每个基础格的像素尺寸 ──────────────────────────────────────────
const UNIT = 60;      // px，每一格的宽高
const LABEL_H = 18;   // px，标签行固定高度

// 格数定义（colspan × rowspan）
const GRID = {
    mech:     { cols: 3, rows: 3 },
    part:     { cols: 2, rows: 3 },
    drone:    { cols: 3, rows: 2 },
    droneFig: { cols: 2, rows: 2 },
} as const;

// ── 远程图片 → base64 ─────────────────────────────────────────────
const fetchBase64 = async (url: string): Promise<string | null> => {
    try {
        const res = await fetch(url);
        if (!res.ok) return null;
        const blob = await res.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror  = () => resolve(null);
            reader.readAsDataURL(blob);
        });
    } catch {
        return null;
    }
};

// ── 机体合成图（复刻 ttsUtil，返回 base64） ───────────────────────
async function generateMechImageBase64(
    team: Team, mech: Mech, tabsrc: string, mechImgSrc: string
): Promise<string | null> {
    const S = 800;
    const canvas = document.createElement("canvas");
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const g = ctx.createLinearGradient(0, 0, 0, S);
    if (team.faction === "RDL") {
        g.addColorStop(0, "rgba(237,114,124,1)");
        g.addColorStop(1, "rgba(255,255,255,1)");
    } else if (team.faction === "UN") {
        g.addColorStop(0,   "rgba(108,128,192,1)");
        g.addColorStop(0.5, "rgba(150,177,209,1)");
        g.addColorStop(1,   "rgba(255,255,255,1)");
    } else {
        g.addColorStop(0.0, "#FFB84D");
        g.addColorStop(0.5, "#FFED94");
        g.addColorStop(1.0, "#FFFFFF");
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);

    const order: (keyof Mech["parts"])[] = ["leftHand","torso","chasis","rightHand","backpack"];
    const imgs = await Promise.all(order.map(async (k) => {
        const id = mech.parts[k]?.id;
        if (!id) return null;
        if (k === "backpack" && team.faction === "UN")
            return getImage(`${tabsrc}/${id}.png`).catch(() => null);
        return getImage(`${mechImgSrc}/${id}.png`).catch(() => null);
    }));

    const draw = (img: HTMLImageElement | null) => {
        if (img) ctx.drawImage(img, 0, 0, S, S);
    };

    if (team.faction === "RDL") {
        draw(imgs[4]);
    } else if (mech.parts.backpack?.id) {
        const bp = await getImage(`${tabsrc}/${mech.parts.backpack.id}.png`).catch(() => null);
        if (bp) {
            const sc = 0.5;
            ctx.drawImage(bp, 0, S - bp.height * sc, bp.width * sc, bp.height * sc);
        }
    }
    draw(imgs[0]); draw(imgs[1]); draw(imgs[2]); draw(imgs[3]);
    return canvas.toDataURL("image/png");
}

// ── 单元格构建 ────────────────────────────────────────────────────

/** 图片单元格，colspan/rowspan 决定真实格数 */
const imgTd = (
    src: string | null,
    cols: number,
    rows: number,
    unitPx = UNIT
) => {
    const w = cols * unitPx;
    const h = rows * unitPx;
    const inner = src
        ? `<img src="${src}" width="${w}" height="${h}" style="display:block;object-fit:contain;">`
        : `<div style="width:${w}px;height:${h}px;background:#f3f4f6;border-radius:2px;"></div>`;
    return `<td colspan="${cols}" rowspan="${rows}"
        style="width:${w}px;height:${h}px;padding:2px;
               vertical-align:top;border:1px solid #d1d5db;">${inner}</td>`;
};

/** 标签单元格，仅跨列（高度固定为 LABEL_H） */
const labelTd = (text: string, cols: number) =>
    `<td colspan="${cols}"
        style="width:${cols * UNIT}px;height:${LABEL_H}px;
               text-align:center;font-size:10px;color:#374151;
               background:#f3f4f6;padding:0 2px;
               border:1px solid #d1d5db;white-space:nowrap;">${text}</td>`;

/** 空白占位单元格，colspan/rowspan */
const emptyTd = (cols: number, rows: number) =>
    `<td colspan="${cols}" rowspan="${rows}"
        style="width:${cols*UNIT}px;height:${rows*UNIT}px;
               border:1px solid #d1d5db;"></td>`;

/** section 标题行，横跨整行 */
const headerRow = (text: string, bg: string) =>
    `<tr><td colspan="99"
        style="background:${bg};color:#fff;font-weight:bold;
               font-size:12px;padding:6px 10px;border:none;">${text}</td></tr>`;

/** 空白间距行 */
const gapRow = () =>
    `<tr><td colspan="99" style="height:${UNIT}px;border:none;"></td></tr>`;

/**
 * 生成跨 rowspan 行的空 <tr>。
 * 当某行有 rowspan>1 的单元格时，后续行必须存在（即使为空），
 * 否则腾讯文档粘贴后行高会塌陷。
 */
const fillerRows = (count: number) =>
    Array.from({ length: count }, () =>
        `<tr style="height:${UNIT}px;"></tr>`
    ).join("\n");

// ── 主导出函数 ────────────────────────────────────────────────────
export const exportHTMLCardData = async (
    team: Team,
    translations: any,
    lang: string,
    hideTacticCard: boolean,
    tabsrc: string,
    mechImgSrc: string,
    onProgress?: (msg: string) => void
): Promise<void> => {
    const partNames =
        PART_TYPE_NAMES[lang as keyof typeof PART_TYPE_NAMES] ?? PART_TYPE_NAMES["zh"];

    let rows = "";

    // 队伍总标题
    rows += headerRow(
        `${team.name}　${translations.t72}：${team.totalScore} ${translations.t71}`,
        "#1E3A5F"
    );

    // ══════════════════════════════════════════════════════════════
    // 各机体
    // 列布局（单位：格）：机体图3 | torso2 | chasis2 | left2 | right2 | bp2 | pilot2
    // 行布局：标签行1 + 图片行3（rowspan=3）
    // ══════════════════════════════════════════════════════════════
    for (const mech of team.mechs) {
        onProgress?.(`生成机体图：${mech.name}`);

        rows += headerRow(
            `⚙ ${mech.name}　M.A.P ${getMechTotalScore(mech)} ${translations.t71}`,
            "#2563EB"
        );

        const [mechB64, torsoB64, chasisB64, leftB64, rightB64, bpB64, pilotB64] =
            await Promise.all([
                generateMechImageBase64(team, mech, tabsrc, mechImgSrc),
                mech.parts.torso?.id     ? fetchBase64(getCardUrl(mech.parts.torso.id, lang))     : Promise.resolve(null),
                mech.parts.chasis?.id    ? fetchBase64(getCardUrl(mech.parts.chasis.id, lang))    : Promise.resolve(null),
                mech.parts.leftHand?.id  ? fetchBase64(getCardUrl(mech.parts.leftHand.id, lang))  : Promise.resolve(null),
                mech.parts.rightHand?.id ? fetchBase64(getCardUrl(mech.parts.rightHand.id, lang)) : Promise.resolve(null),
                mech.parts.backpack?.id  ? fetchBase64(getCardUrl(mech.parts.backpack.id, lang))  : Promise.resolve(null),
                mech.pilot?.id           ? fetchBase64(getPilotFaceUrl(mech.pilot.id, lang))      : Promise.resolve(null),
            ]);

        // 标签行（每列标签跨对应格数）
        rows += `<tr style="height:${LABEL_H}px;">
            ${labelTd("机体图",                             GRID.mech.cols)}
            ${labelTd(partNames.torso,                     GRID.part.cols)}
            ${labelTd(partNames.chasis,                    GRID.part.cols)}
            ${labelTd(partNames.leftHand,                  GRID.part.cols)}
            ${labelTd(partNames.rightHand,                 GRID.part.cols)}
            ${labelTd(partNames.backpack,                  GRID.part.cols)}
            ${labelTd(mech.pilot ? (translations.t69 ?? "驾驶员") : "", GRID.part.cols)}
        </tr>`;

        // 图片行：所有 td 都带 rowspan=3，后续 2 行为空行填充行高
        rows += `<tr style="height:${UNIT}px;">
            ${imgTd(mechB64,  GRID.mech.cols, GRID.mech.rows)}
            ${imgTd(torsoB64, GRID.part.cols, GRID.part.rows)}
            ${imgTd(chasisB64,GRID.part.cols, GRID.part.rows)}
            ${imgTd(leftB64,  GRID.part.cols, GRID.part.rows)}
            ${imgTd(rightB64, GRID.part.cols, GRID.part.rows)}
            ${imgTd(bpB64,    GRID.part.cols, GRID.part.rows)}
            ${imgTd(pilotB64, GRID.part.cols, GRID.part.rows)}
        </tr>`;
        // rowspan=3，补充 2 个空行维持行高
        rows += fillerRows(GRID.mech.rows - 1);

        // ── 投射物（3格×2格，第1列留空对齐机体图） ────────────────
        const allProj = (["torso","chasis","leftHand","rightHand","backpack"] as const)
            .flatMap((k) => mech.parts[k]?.projectile ?? []);

        if (allProj.length > 0) {
            onProgress?.(`生成投射物：${mech.name}`);
            const projB64s = await Promise.all(
                allProj.map((id) => fetchBase64(getCardUrl(id, lang)))
            );

            // 标签行
            rows += `<tr style="height:${LABEL_H}px;">
                ${emptyTd(GRID.mech.cols, 1)}
                ${allProj.map((_, i) => labelTd(`投射物 ${i + 1}`, GRID.drone.cols)).join("")}
            </tr>`;

            // 图片行（rowspan=2）+ 补 1 空行
            rows += `<tr style="height:${UNIT}px;">
                ${emptyTd(GRID.mech.cols, GRID.drone.rows)}
                ${projB64s.map((b) => imgTd(b, GRID.drone.cols, GRID.drone.rows)).join("")}
            </tr>`;
            rows += fillerRows(GRID.drone.rows - 1);
        }

        rows += gapRow();
    }

    // ══════════════════════════════════════════════════════════════
    // 无人机：[立绘 2×2][卡片 3×2] 横向排列，标签行 + 图片行
    // ══════════════════════════════════════════════════════════════
    if (team.drones.length > 0) {
        onProgress?.("生成无人机卡片…");
        const droneScore = team.drones.reduce(
            (s, d) => s + d.score + (d.backpack?.score ?? 0), 0
        );

        rows += headerRow(
            `✦ ${translations.t70 ?? "无人机"}　${droneScore} ${translations.t71}`,
            "#059669"
        );

        // 并发拉取立绘 + 卡片
        const dronePairs = await Promise.all(
            team.drones.map(async (d) => ({
                name: d.name,
                fig:  await fetchBase64(`${tabsrc}/${d.id}.png`),
                card: await fetchBase64(getCardUrl(d.id, lang)),
            }))
        );

        // 标签行：立绘标签 + 卡片空标签（各跨对应格数）
        rows += `<tr style="height:${LABEL_H}px;">
            ${dronePairs.map((p) => `
                ${labelTd(p.name, GRID.droneFig.cols)}
                ${labelTd("",     GRID.drone.cols)}
            `).join("")}
        </tr>`;

        // 图片行（两种格子行数相同 =2，rowspan=2）
        rows += `<tr style="height:${UNIT}px;">
            ${dronePairs.map((p) => `
                ${imgTd(p.fig,  GRID.droneFig.cols, GRID.droneFig.rows)}
                ${imgTd(p.card, GRID.drone.cols,    GRID.drone.rows)}
            `).join("")}
        </tr>`;
        rows += fillerRows(GRID.drone.rows - 1);

        // 无人机投射物
        const droneProj = team.drones.flatMap((d) => d.projectile ?? []);
        if (droneProj.length > 0) {
            const dpB64s = await Promise.all(
                droneProj.map((id) => fetchBase64(getCardUrl(id, lang)))
            );

            rows += `<tr style="height:${LABEL_H}px;">
                ${droneProj.map((_, i) => labelTd(`投射物 ${i + 1}`, GRID.drone.cols)).join("")}
            </tr>`;
            rows += `<tr style="height:${UNIT}px;">
                ${dpB64s.map((b) => imgTd(b, GRID.drone.cols, GRID.drone.rows)).join("")}
            </tr>`;
            rows += fillerRows(GRID.drone.rows - 1);
        }

        rows += gapRow();
    }

    // ══════════════════════════════════════════════════════════════
    // 战术卡（2格×3格，同部件卡）
    // ══════════════════════════════════════════════════════════════
    if (team.tacticCards?.length && !hideTacticCard) {
        onProgress?.("生成战术卡片…");
        const tacticScore = team.tacticCards.reduce((s, tc) => s + tc.score, 0);

        rows += headerRow(
            `★ ${translations.t90 ?? "战术卡"}　${tacticScore} ${translations.t71}`,
            "#7C3AED"
        );

        const tacticB64s = await Promise.all(
            team.tacticCards.map((tc) => fetchBase64(getCardUrl(tc.id, lang)))
        );

        rows += `<tr style="height:${LABEL_H}px;">
            ${team.tacticCards.map((tc) => labelTd(tc.name, GRID.part.cols)).join("")}
        </tr>`;
        rows += `<tr style="height:${UNIT}px;">
            ${tacticB64s.map((b) => imgTd(b, GRID.part.cols, GRID.part.rows)).join("")}
        </tr>`;
        rows += fillerRows(GRID.part.rows - 1);
    }

    // ── 组装 HTML ─────────────────────────────────────────────────
    const html = `
        <meta charset="utf-8">
        <table border="1" cellspacing="0" cellpadding="0"
            style="border-collapse:collapse;font-family:Arial,sans-serif;
                   table-layout:fixed;border-color:#d1d5db;">
            ${rows}
        </table>`;

    // ── 写入剪贴板 ────────────────────────────────────────────────
    onProgress?.("写入剪贴板…");
    try {
        await navigator.clipboard.write([
            new ClipboardItem({ "text/html": new Blob([html], { type: "text/html" }) }),
        ]);
        alert("✅ 已复制到剪贴板！\n请直接在腾讯文档表格中粘贴（Ctrl+V / ⌘V）");
    } catch {
        const win = window.open("", "_blank");
        if (win) {
            win.document.write(html);
            win.document.close();
            alert("⚠️ 剪贴板写入失败，已在新标签页打开。\n请全选（Ctrl+A）后复制，再粘贴到腾讯文档。");
        }
    }
};