import { Part, Team } from "../types";
import extractChunks from "png-chunks-extract";
import encodeChunks from "png-chunks-encode";
import { getImage } from "./ImageGetter";


function createSoftSparseTexture(ctx: CanvasRenderingContext2D, spacing = 160, dotSize = 2, faction: string = "RDL"): CanvasPattern {
  const pCanvas = document.createElement("canvas");
  pCanvas.width = spacing;
  pCanvas.height = spacing;
  const pctx = pCanvas.getContext("2d")!;

  // 柔和颜色
  const color = faction === "RDL" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  pctx.fillStyle = color;

  // 四角 + 中心点，间距更大
  const positions = [
    [spacing * 0.25, spacing * 0.25],
    [spacing * 0.75, spacing * 0.25],
    [spacing * 0.25, spacing * 0.75],
    [spacing * 0.75, spacing * 0.75],
    [spacing * 0.5, spacing * 0.5]
  ];

  for (const [x, y] of positions) {
    pctx.beginPath();
    pctx.arc(x, y, dotSize, 0, Math.PI * 2);
    pctx.fill();
  }

  return ctx.createPattern(pCanvas, "repeat")!;
}

// 定义一个绘制圆角矩形路径的函数
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// 混排文字绘制函数：中文/日文使用原字体，数字使用 Orbitron
const drawMixedText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, fontSize: number, lang: string) => {
  const fontMap: Record<string, string> = {
    en: "'Orbitron', sans-serif",
    cn: "'Noto Sans Mono SC', 'Kosugi Maru', sans-serif",
    jp: "'Kosugi Maru', 'Noto Sans Mono SC', sans-serif",
  };
  const chineseFont = fontMap[lang] || "sans-serif";
  const numberFont = "'Orbitron', sans-serif";

  const parts = text.split(/(\d+)/); // 分割数字部分
  let offsetX = x;

  for (const part of parts) {
    if (!part) continue;
    ctx.font = /^\d+$/.test(part) ? `bold ${fontSize}px ${numberFont}` : `bold ${fontSize}px ${chineseFont}`;
    ctx.fillText(part, offsetX, y);
    offsetX += ctx.measureText(part).width;
  }
};


function textChunk(keyword: string, text: string) {
  const keywordBuffer = new TextEncoder().encode(keyword);
  const textBuffer = new TextEncoder().encode(text);
  const separator = new Uint8Array([0]); // null 分隔符
  return {
    name: "tEXt",
    data: new Uint8Array([...keywordBuffer, ...separator, ...textBuffer]),
  };
}

const CONSTANTS = {
  PADDING: 30,
  SPACING: 20,
  RADIUS: 15,
  TARGET_HEIGHT: 400,
  DRONES_PER_ROW: 3,
  CARDS_PER_ROW: 6,
  COLORS: {
    RDL: { start: 'rgba(237,114,124,1)', mid: 'rgba(211,169,158,1)', end: 'rgba(255,255,255,1)' },
    UN: { start: 'rgba(108,128,192,1)', mid: 'rgba(150,177,209,1)', end: 'rgba(255,255,255,1)' },
    DEFAULT: { start: '#FFB84D', mid: '#FFED94', end: '#FFFFFF' },
    DODGE: '#3dafff',
    ELEC: '#fec031',
  }
};

// 根据每个Part或Projectile或Drone的hasImage判断，当{faction!=="GOF"&&(hasImage === undefined || hasImage)时，isGOF为false,否则为true
const checkNoOfficialCard = (faction: string, hasImage?: boolean, isPD?: boolean): boolean => {
  if (isPD) return false;
  const isOfficial = faction !== "GOF" && (hasImage === undefined || hasImage === true);
  return !isOfficial;
};

const setGlowText = (ctx: CanvasRenderingContext2D, fontSize: number, color: string, fontFamily: string) => {
  ctx.fillStyle = color;
  ctx.font = `bold ${fontSize}px ${fontFamily}`;
  ctx.shadowColor = color + "66";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
};

const drawCardBackground = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
  faction: string,
  alphaOverride: number = 0.15
) => {
  ctx.save();
  const centerX = x + Math.random() * w;
  const centerY = y + Math.random() * h;
  const r = Math.max(w, h) * (0.6 + Math.random() * 0.2);
  const innerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, r);
  const alpha = alphaOverride + Math.random() * 0.2;

  if (faction === "RDL") {
    innerGradient.addColorStop(0, `rgba(229,85,98,${alpha})`);
    innerGradient.addColorStop(0.5, `rgba(211,169,158,${alpha * 0.8})`);
    innerGradient.addColorStop(1, `rgba(255,255,255,0)`);
  } else if (faction === "UN") {
    innerGradient.addColorStop(0, `rgba(0,120,255,${alpha})`);
    innerGradient.addColorStop(0.5, `rgba(100,180,255,${alpha * 0.8})`);
    innerGradient.addColorStop(1, `rgba(255,255,255,0)`);
  } else {
    innerGradient.addColorStop(0, `rgba(255,194,41,${alpha})`);
    innerGradient.addColorStop(0.5, `rgba(255,247,194,${alpha})`);
    innerGradient.addColorStop(1, `rgba(255,255,255,0)`);
  }

  ctx.fillStyle = innerGradient;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fill();
  ctx.restore();

  // 磨砂玻璃叠加，增加苹果风格质感
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fill();
  ctx.restore();

  // 边框
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.stroke();
  ctx.restore();
};

const drawItemImage = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  noOfficialCard: boolean
) => {
  const pRadius = 15;
  const paddingOffset = noOfficialCard ? 20 : 0;
  const scaleFactor = noOfficialCard ? 0.9 : 1;

  const drawX = x + 10 + paddingOffset;
  const drawY = y + 35 + paddingOffset;
  const drawW = w * scaleFactor;
  const drawH = h * scaleFactor;

  ctx.save();
  if (noOfficialCard) {
    // GOF: 外部阴影
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 16;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = "#00000088";

    ctx.beginPath();
    ctx.roundRect(drawX, drawY, drawW, drawH, pRadius);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.beginPath();
    ctx.roundRect(drawX, drawY, drawW, drawH, pRadius);
    ctx.clip();
  } else {
    // 非 GOF: 保持原有方法
    ctx.beginPath();
    ctx.roundRect(drawX, drawY, drawW, drawH, 0);
    ctx.clip();

    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
  }
  ctx.drawImage(img, drawX, drawY, drawW, drawH);
  ctx.restore();
};

export const exportTeamImage = async (team: Team, lang: string, translations: any, tabsrc: string, localImgsrc: string, imgsrc: string, includeProjectile: boolean) => {
  if (!team.mechs.length) {
    alert(`${translations.t14}`);
    return;
  }

  if (team.tacticCards === undefined) {
    team.tacticCards = []
  }

  const { PADDING, SPACING, TARGET_HEIGHT } = CONSTANTS;

  // 字体映射
  const fontMap: Record<string, string> = {
    en: "'Orbitron', sans-serif",
    cn: "'Orbitron', 'Noto Sans Mono SC', 'Kosugi Maru', sans-serif",
    jp: "'Orbitron', 'Kosugi Maru', 'Noto Sans Mono SC', sans-serif",
  };
  const fontFamily = fontMap[lang] || "sans-serif";

  // 预加载 icon
  const [iconLogo, iconDodge, iconElectronic] = await Promise.all([
    getImage(`${tabsrc}/logo.png`),
    getImage(`${tabsrc}/icon_dodge.png`),
    getImage(`${tabsrc}/icon_electronic.png`),
  ]);

  // 并行加载 mech images
  const mechData = await Promise.all(team.mechs.map(async mech => {
    const partOrder: (keyof typeof mech.parts)[] = ["torso", "chasis", "leftHand", "rightHand", "backpack"];
    const partsInfo = await Promise.all(partOrder.map(async key => {
      const part = mech.parts[key];
      if (!part) return null;
      const img = await getImage(`${localImgsrc}/${part.id}.png`);
      return { part, img };
    }));
    const validParts = partsInfo.filter((p): p is { part: Part,img: HTMLImageElement } => p !== null);

    const pilotImg = mech.pilot ? await getImage(`${localImgsrc}/${mech.pilot.id}.png`) : null;

    const score = Object.values(mech.parts).reduce((sum, part) => sum + (part?.score || 0), 0) + (mech.pilot?.score || 0);
    const dodge = partOrder.reduce((sum, key) => sum + (mech.parts[key]?.dodge || 0), 0);
    const electronic = partOrder.reduce((sum, key) => sum + (mech.parts[key]?.electronic || 0), 0);

    return { mech, parts: validParts, pilotImg, score, dodge, electronic };
  }));

  // 并行加载 drones
  const droneData = await Promise.all(team.drones.map(async drone => {
    const img = await getImage(`${localImgsrc}/${drone.id}.png`);
    let backpackImg: HTMLImageElement | null = null;
    if (drone.backpack) backpackImg = await getImage(`${localImgsrc}/${drone.backpack.id}.png`);
    return { drone, img, backpackImg };
  }));

  // 并行加载战术卡
  const tacticData = await Promise.all(team.tacticCards.map(async card => {
    const img = await getImage(`${localImgsrc}/${card.id}.png`);
    return { card, img };
  }));

  // Step 1: 收集所有唯一 projectile ID
  const uniqueProjectileIds = new Set<string>();
  team.mechs.forEach(m => {
    Object.values(m.parts).forEach(p => {
      //排除白矮星变形卡（尺寸不一样）
      if (p?.projectile && p.projectile[0] !== '288') {
        p.projectile.forEach(pid => uniqueProjectileIds.add(pid));
      }
    });
  });
  team.drones.forEach(d => d.projectile?.forEach(pid => uniqueProjectileIds.add(pid)));

  // Step 2: 并行加载所有唯一 projectile 图片
  const projectileImages: HTMLImageElement[] = [];
  await Promise.all(Array.from(uniqueProjectileIds).map(async pid => {
    const img = await getImage(`${imgsrc}/${pid}.png`);
    projectileImages.push(img);
  }));

  // 计算画布大小
  let y = PADDING + 100;
  const mechRowHeight = 55 + TARGET_HEIGHT + SPACING + 40;
  y += mechData.length * mechRowHeight;

  const calcGridHeight = (count: number, perRow: number) => Math.ceil(count / perRow) * (TARGET_HEIGHT + 30 + SPACING);

  let canvasHeight = y + calcGridHeight(droneData.length, CONSTANTS.DRONES_PER_ROW);
  if (includeProjectile) {
    canvasHeight += calcGridHeight(projectileImages.length, CONSTANTS.DRONES_PER_ROW);
  }
  canvasHeight += calcGridHeight(tacticData.length, CONSTANTS.CARDS_PER_ROW) + PADDING;

  const canvas = document.createElement("canvas");
  canvas.width = 1741 + PADDING * 2;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const gradient = ctx.createLinearGradient(0, 0, 0, height); // 从顶部到底部

  if (team.faction === "RDL") {
    const c = CONSTANTS.COLORS.RDL;
    gradient.addColorStop(0, c.start); gradient.addColorStop(0.5, c.mid); gradient.addColorStop(1, c.end);
  } else if (team.faction === "UN") {
    const c = CONSTANTS.COLORS.UN;
    gradient.addColorStop(0, c.start); gradient.addColorStop(0.5, c.mid); gradient.addColorStop(1, c.end);
  } else {
    const c = CONSTANTS.COLORS.DEFAULT;
    gradient.addColorStop(0, c.start); gradient.addColorStop(0.5, c.mid); gradient.addColorStop(1, c.end);
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 磨砂玻璃叠加，增加苹果风格质感
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.filter = "blur(80px)";
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // @ts-ignore
  ctx.fillStyle = createSoftSparseTexture(ctx, 160, 2, team.faction);
  ctx.fillRect(0, 0, width, height);

  // small header text
  ctx.save();
  setGlowText(ctx, 42, "#ffffff", fontFamily);
  ctx.fillText(`${team.name}`, PADDING, PADDING + 20);
  setGlowText(ctx, 28, "#ffffff", fontFamily);
  // @ts-ignore
  drawMixedText(ctx, `${translations.t15}:  ${team.totalScore}`, PADDING, PADDING + 70, 38, lang);
  ctx.restore();

  ctx.drawImage(iconLogo, 1640, 20, 100, 100);

  // 绘制机甲（注意 icon 对齐修正）
  y = PADDING + 100;

  for (const { mech, parts, pilotImg, score, dodge, electronic } of mechData) {
    const x = PADDING;
    const boxHeight = 60 + TARGET_HEIGHT;
    const boxWidth = 4.35 * TARGET_HEIGHT;

    // ----------------------------
    // 磨砂玻璃
    // ----------------------------
    drawCardBackground(ctx, x, y, boxWidth, boxHeight, CONSTANTS.RADIUS, team.faction);

    // 名称 & 分数
    ctx.save();
    setGlowText(ctx, 36, "#ffffff", fontFamily);
    ctx.fillText(mech.name, x + 20, y + 50);
    // @ts-ignore
    drawMixedText(ctx, `${translations.t16}: ${score}`, x + 260, y + 50, 36, lang);
    ctx.restore();

    // icons
    const iconSize = 64;
    const dodgeX = x + 560;
    ctx.drawImage(iconDodge, dodgeX, y + 50 - iconSize / 2 - 12, iconSize, iconSize);
    setGlowText(ctx, 36, CONSTANTS.COLORS.DODGE, fontFamily);
    // @ts-ignore
    drawMixedText(ctx, `${dodge}`, dodgeX + iconSize + 12, y + 50, 36, lang);

    const elecX = x + 720;
    ctx.drawImage(iconElectronic, elecX, y + 50 - iconSize / 2 - 12, iconSize, iconSize);
    setGlowText(ctx, 36, CONSTANTS.COLORS.ELEC, fontFamily);
    // @ts-ignore
    drawMixedText(ctx, `${electronic}`, elecX + iconSize + 12, y + 50, 36, lang);

    // 绘制部件图片
    let partDrawX = x + 10;
    for (const { part, img } of parts) {
      const scale = TARGET_HEIGHT / img.height;
      const drawWidth = img.width * scale;

      const noOfficialCard = checkNoOfficialCard(team.faction, part.hasImage, part.isPD);
      drawItemImage(ctx, img, partDrawX, y + 20, drawWidth, TARGET_HEIGHT, noOfficialCard);

      partDrawX += drawWidth + SPACING;
    }

    if (pilotImg) {
      const scale = TARGET_HEIGHT / pilotImg.height;
      const drawWidth = pilotImg.width * scale;
      //驾驶员不需要再画阴影了
      const noOfficialCardPilot = false;
      drawItemImage(ctx, pilotImg, partDrawX, y + 20, drawWidth, TARGET_HEIGHT, noOfficialCardPilot);
    }
    y += mechRowHeight;
  }

  // 绘制无人机（绘制前显式设置白色字体，避免颜色继承）
  const drawGrid = <T,>(items: T[], perRow: number, startY: number, renderer: (item: T, x: number, y: number, w: number, h: number) => void) => {
    if (!items.length) return startY;
    const rowHeight = TARGET_HEIGHT + 30 + SPACING;
    items.forEach((item, i) => {
      // @ts-ignore
      const img = item.img || item;
    const width = img.width * (TARGET_HEIGHT / img.height);
    const col = i % perRow;
    const row = Math.floor(i / perRow);
    const x = PADDING + col * (width + SPACING + 20);
    const itemY = startY + row * rowHeight;
    renderer(item, x, itemY, width, TARGET_HEIGHT);
    });
    return startY + Math.ceil(items.length / perRow) * rowHeight;
  };

  y = drawGrid(droneData, CONSTANTS.DRONES_PER_ROW, y, (data, x, y, w, h) => {
    const {drone, img, backpackImg} = data;

    // ----------------------------
    // 渐变背景（无人机专属，径向随机版）
    // ----------------------------
    drawCardBackground(ctx, x, y, w + SPACING, h + 30, CONSTANTS.RADIUS, team.faction, 0.3);

    ctx.save();
    setGlowText(ctx, 36, "#ffffff", fontFamily);
    // @ts-ignore
    drawMixedText(ctx, `${translations.t16}: ${drone.score || 0}`, x + 20, y + 30, 24, lang);
    ctx.restore();

    const noOfficialCard = checkNoOfficialCard(team.faction, drone.hasImage, drone.isPD);
    drawItemImage(ctx, img, x, y, w, h, noOfficialCard);

    if (backpackImg) {
      ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.4)";
    ctx.shadowBlur = 10;
    const backpackScale = 0.4;
    ctx.drawImage(backpackImg, x + 80, y + 25, backpackImg.width * backpackScale, backpackImg.height * backpackScale);
    ctx.restore();
    }
  });

    if (includeProjectile) {
    // 绘制抛射物
    const projItems = projectileImages.map(img => ({img}));
    y = drawGrid(projItems, CONSTANTS.DRONES_PER_ROW, y, (data, x, y, w, h) => {
      drawCardBackground(ctx, x, y, w + SPACING, h + 30, CONSTANTS.RADIUS, team.faction, 0.3);
    const noOfficialCard = checkNoOfficialCard(team.faction, true, false);
    drawItemImage(ctx, data.img, x, y, w, h, noOfficialCard);
    });
  }

  // 绘制战术卡
  drawGrid(tacticData, CONSTANTS.CARDS_PER_ROW, y, (data, x, y, w, h) => {
      drawCardBackground(ctx, x, y, w + SPACING, h + 30, CONSTANTS.RADIUS, team.faction, 0.3);

    ctx.save();
    setGlowText(ctx, 36, "#ffffff", fontFamily);
    // @ts-ignore
    drawMixedText(ctx, `${translations.t16}: ${data.card.score || 0}`, x + 20, y + 30, 24, lang);
    ctx.restore();

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowBlur = 6;
    ctx.drawImage(data.img, x + 10, y + 35, w, h);
    ctx.restore();
  });

  // 把 canvas 导出为 PNG
  const blob: Blob = await new Promise(resolve => canvas.toBlob(b => resolve(b!), "image/png"));
    if (!blob) return;

    // 转成 ArrayBuffer
    const buffer = new Uint8Array(await blob.arrayBuffer());

    // 提取 PNG chunks
    // @ts-ignore
    const chunks = extractChunks(buffer);

    // 插入 JSON 数据
    const jsonString = JSON.stringify(team);
    // @ts-ignore
    const customChunk = textChunk("TeamData", jsonString);
    chunks.splice(-1, 0, customChunk); // 在 IEND 前插入

    // 重新编码 PNG
    // @ts-ignore
    const outputBuffer = encodeChunks(chunks);
    const outBlob = new Blob([outputBuffer], {type: "image/png" });

    const blobUrl = URL.createObjectURL(outBlob);
    const link = document.createElement("a");
    link.download = `${team.name}.png`;
    link.href = blobUrl;

    // 尝试在用户交互环境触发
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(blobUrl), 500);
};
//直接下载TeammImage
