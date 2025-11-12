import { Team } from "../types";
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

  //直接下载TeammImage
export const exportTeamImage = async (team: Team, lang: string, translations: any, tabsrc: string, localImgsrc: string, imgsrc: string, includeProjectile: boolean) => {
  if (!team.mechs.length) {
    alert(`${translations.t14}`);
    return;
  }

  if (team.tacticCards === undefined) {
    team.tacticCards = []
  }

  const padding = 30;
  const spacing = 20;
  const radius = 15;
  const targetHeight = 400;
  const dronesPerRow = 3;
  const tacticCardsPerRow = 6;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // 字体映射
  const fontMap: Record<string, string> = {
    en: "'Orbitron', sans-serif",
    cn: "'Orbitron', 'Noto Sans Mono SC', 'Kosugi Maru', sans-serif",
    jp: "'Orbitron', 'Kosugi Maru', 'Noto Sans Mono SC', sans-serif",
  };
  const fontFamily = fontMap[lang] || "sans-serif";

  const setGlowText = (ctx: CanvasRenderingContext2D, fontSize: number, color: string) => {
    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.shadowColor = color + "66";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  };


  // 预加载 icon
  const [iconLogo, iconDodge, iconElectronic] = await Promise.all([
    getImage(`${tabsrc}/logo.png`),
    getImage(`${tabsrc}/icon_dodge.png`),
    getImage(`${tabsrc}/icon_electronic.png`),
  ]);

  // 并行加载 mech images
  const mechImages = await Promise.all(
    team.mechs.map(async mech => {
      const partOrder: (keyof typeof mech.parts)[] = ["torso", "chasis", "leftHand", "rightHand", "backpack"];
      const partImgs = await Promise.all(
        partOrder.map(async p => mech.parts[p] ? getImage(`${localImgsrc}/${mech.parts[p]!.id}.png`) : null)
      );
      const pilotImg = mech.pilot ? await getImage(`${localImgsrc}/${mech.pilot.id}.png`) : null;

      const imgs = [...partImgs.filter(Boolean), pilotImg].filter(Boolean) as HTMLImageElement[];
      const score = Object.values(mech.parts).reduce((sum, part) => sum + (part?.score || 0), 0) + (mech.pilot?.score || 0);
      const dodge = partOrder.reduce((sum, key) => sum + (mech.parts[key]?.dodge || 0), 0);
      const electronic = partOrder.reduce((sum, key) => sum + (mech.parts[key]?.electronic || 0), 0);

      return { mech, imgs, score, dodge, electronic };
    })
  );

  // 并行加载 drones
  const droneImages = await Promise.all(
    team.drones.map(async drone => {
      const img = await getImage(`${localImgsrc}/${drone.id}.png`);
      let backpackImg: HTMLImageElement | null = null;
      if (drone.backpack) backpackImg = await getImage(`${localImgsrc}/${drone.backpack.id}.png`);
      return { drone, img, backpackImg };
    })
  );

  // 并行加载战术卡
  const tacticImages = await Promise.all(
    team.tacticCards.map(async tacticCard => {
      const img = await getImage(`${localImgsrc}/${tacticCard.id}.png`);
      return { tacticCard, img };
    })
  );

  // Step 1: 收集所有唯一 projectile ID
  const uniqueProjectileIds = new Set<string>();

  team.mechs.forEach((mech) => {
    const partOrder: (keyof typeof mech.parts)[] = [
      "torso",
      "chasis",
      "leftHand",
      "rightHand",
      "backpack",
    ];

    partOrder.forEach((p) => {
      const projectiles = mech.parts[p]?.projectile; // string[] | undefined
      if (projectiles === undefined) return;
      //排除白矮星变形卡（尺寸不一样）
      if (projectiles[0] == '288') return;
      projectiles.forEach((projId) => uniqueProjectileIds.add(projId));
    });
  });

  team.drones.forEach((drone) => {
    drone.projectile?.forEach((projId) => uniqueProjectileIds.add(projId));
  })

  // Step 2: 并行加载所有唯一 projectile 图片
  const projectileImageIndex = new Map<string, HTMLImageElement>();

  await Promise.all(
    Array.from(uniqueProjectileIds).map(async (projId) => {
      const img = await getImage(`${imgsrc}/${projId}.png`);
      projectileImageIndex.set(projId, img);
    })
  );

  // Step 3: 生成绘制数组（每张图片只出现一次）
  const projectileImages = Array.from(projectileImageIndex.values());




  // 计算画布大小
  let y = padding + 100;
  for (const { imgs } of mechImages) y += 55 + targetHeight + spacing + 40;
  const totalDroneRows = Math.ceil(team.drones.length / dronesPerRow);
  const totaltacticCardsRows = Math.ceil(tacticImages.length / tacticCardsPerRow);
  const droneRowHeight = targetHeight + 30 + spacing;
  let canvasHeight = 0;
  if (includeProjectile) {
    const totalProjectileRows = Math.ceil(projectileImages.length / dronesPerRow);
    canvasHeight = y + (totalDroneRows + totalProjectileRows + totaltacticCardsRows) * droneRowHeight + padding;
  } else {
    canvasHeight = y + (totalDroneRows + totaltacticCardsRows) * droneRowHeight + padding;
  }
  canvas.width = 1741 + padding * 2;
  canvas.height = canvasHeight;

  const width = canvas.width;
  const height = canvas.height;

  const gradient = ctx.createLinearGradient(0, 0, 0, height); // 从顶部到底部

  if (team.faction === "RDL") {
    gradient.addColorStop(0, `rgba(237,114,124,1)`);
    gradient.addColorStop(0.5, `rgba(211,169,158,1)`);
    gradient.addColorStop(1, `rgba(255,255,255,1)`);
  } else {
    gradient.addColorStop(0, `rgba(108,128,192,1)`);
    gradient.addColorStop(0.5, `rgba(150,177,209,1)`);
    gradient.addColorStop(1, `rgba(255,255,255,1)`);
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 磨砂玻璃叠加，增加苹果风格质感
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "#ffffff";
  ctx.filter = "blur(80px)";
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // 使用
  ctx.fillStyle = createSoftSparseTexture(ctx, 160, 2, team.faction);
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // small header text
  ctx.save();
  setGlowText(ctx, 42, "#ffffff");
  ctx.fillText(`${team.name}`, padding, padding + 20);
  setGlowText(ctx, 28, "#ffffff");
  drawMixedText(ctx, `${translations.t15}:  ${team.totalScore}`, padding, padding + 70, 38, lang);
  ctx.restore();

  ctx.drawImage(iconLogo, 1640, 20, 100, 100);

  // 绘制机甲（注意 icon 对齐修正）
  y = padding + 100;

  for (const { mech, imgs, score, dodge, electronic } of mechImages) {
    let x = padding;
    const boxHeight = 60 + targetHeight;
    const boxWidth = 4.35 * targetHeight;

    // ----------------------------
    // 磨砂玻璃
    // ----------------------------
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.roundRect(x, y, boxWidth, boxHeight, radius);
    ctx.fill();
    ctx.restore();

    ctx.save();
    const alpha = 0.15 + Math.random() * 0.2;
    const r = boxWidth;
    const centerX = x + Math.random() * boxWidth;
    const centerY = y + Math.random() * boxHeight;

    const innerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, r);

    if (team.faction === "RDL") {
      innerGradient.addColorStop(0, `rgba(229,85,98,${alpha})`);
      innerGradient.addColorStop(0.5, `rgba(211,169,158,${alpha * 0.8})`);
      innerGradient.addColorStop(1, `rgba(255,255,255,0)`); // 逐渐透明
    } else {
      innerGradient.addColorStop(0, `rgba(0,120,255,${alpha})`);       // 鲜蓝
      innerGradient.addColorStop(0.5, `rgba(100,180,255,${alpha * 0.8})`); // 浅蓝
      innerGradient.addColorStop(1, `rgba(255,255,255,0)`);           // 透明

    }

    ctx.fillStyle = innerGradient;
    ctx.beginPath();
    ctx.roundRect(x, y, boxWidth, boxHeight, radius / 5);
    ctx.fill();
    ctx.restore();



    // ----------------------------
    // 边框
    // ----------------------------
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, boxWidth, boxHeight, radius);
    ctx.stroke();
    ctx.restore();

    // 名称 & 分数
    ctx.save();
    setGlowText(ctx, 36, "#ffffff");
    ctx.fillText(mech.name, x + 20, y + 50);
    drawMixedText(ctx, `${translations.t16}: ${score}`, x + 260, y + 50, 36, lang);
    ctx.restore();

    // icons
    const iconSize = 64;
    const dodgeX = x + 560;
    const dodgeY = y + 50 - iconSize / 2;
    ctx.drawImage(iconDodge, dodgeX, dodgeY - 12, iconSize, iconSize);
    setGlowText(ctx, 36, "#3dafff");
    ctx.fillStyle = "#3dafff";
    drawMixedText(ctx, `${dodge}`, dodgeX + iconSize + 12, y + 50, 36, lang);

    const elecX = x + 720;
    const elecY = y + 50 - iconSize / 2;
    ctx.drawImage(iconElectronic, elecX, elecY - 12, iconSize, iconSize);
    setGlowText(ctx, 36, "#fec031");
    ctx.fillStyle = "#fec031";
    drawMixedText(ctx, `${electronic}`, elecX + iconSize + 12, y + 50, 36, lang);

    // 绘制零件图片
    y += 55;
    for (const img of imgs) {
      const scale = targetHeight / img.height;
      const drawWidth = img.width * scale;
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.drawImage(img, x + 10, y, drawWidth, targetHeight);
      ctx.restore();
      x += drawWidth + spacing;
    }
    y += targetHeight + spacing + 40;

  }

  // 绘制无人机（绘制前显式设置白色字体，避免颜色继承）
  let droneY = y;
  for (let i = 0; i < droneImages.length; i++) {
    const { drone, img, backpackImg } = droneImages[i];
    const droneWidth = img.width * (targetHeight / img.height);
    const col = i % dronesPerRow;
    const row = Math.floor(i / dronesPerRow);
    const droneX = padding + col * (droneWidth + spacing + 20);
    droneY = y + row * (targetHeight + 30 + spacing);

    // ----------------------------
    // 渐变背景（无人机专属，径向随机版）
    // ----------------------------
    const alpha = 0.3; // 更低调的透明度
    const gradientRadius = Math.max(droneWidth, targetHeight) * (0.6 + Math.random() * 0.2);

    // 随机中心点（保证在卡片范围内）
    const centerX = droneX + (droneWidth + spacing) * (0.3 + Math.random() * 0.4);
    const centerY = droneY + (targetHeight + 30) * (0.3 + Math.random() * 0.4);

    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, gradientRadius
    );

    if (team.faction === "RDL") {
      gradient.addColorStop(0, `rgba(229,85,98,${alpha})`); // 中心红
      gradient.addColorStop(1, `rgba(255,255,255,0)`);      // 边缘透明
    } else {
      gradient.addColorStop(0, `rgba(80,140,255,${alpha})`);   // 中心接近白的电青

      gradient.addColorStop(1, "rgba(80,140,255,0.1)");   // 紫蓝过渡

    }

    ctx.save();
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(droneX, droneY, droneWidth + spacing, targetHeight + 30, radius);
    ctx.fill();
    ctx.restore();


    // 磨砂玻璃 & 边框
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.roundRect(droneX, droneY, droneWidth + spacing, targetHeight + 30, radius);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(droneX, droneY, droneWidth + spacing, targetHeight + 30, radius);
    ctx.stroke();
    ctx.restore();


    ctx.save();
    setGlowText(ctx, 36, "#ffffff");
    drawMixedText(ctx, `${translations.t16}: ${drone.score || 0}`, droneX + 20, droneY + 30, 24, lang);
    ctx.restore();

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowBlur = 6;
    ctx.drawImage(img, droneX + 10, droneY + 35, droneWidth, targetHeight);
    ctx.restore();

    if (backpackImg) {
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      ctx.shadowBlur = 10;
      const backpackScale = 0.4;
      ctx.drawImage(backpackImg, droneX + 80, droneY + 25, backpackImg.width * backpackScale, backpackImg.height * backpackScale);
      ctx.restore();
    }
  }

  // 计算无人机绘制结束后的最大Y值
  let projectileY = 0;
  let tacticCardY = 0;
  if (includeProjectile) {
    projectileY = droneY + targetHeight + 30 + spacing;
    tacticCardY = projectileY;
    // 绘制抛射物
    for (let i = 0; i < projectileImages.length; i++) {
      const img = projectileImages[i];
      const projWidth = img.width * (targetHeight / img.height);
      const col = i % dronesPerRow;
      const row = Math.floor(i / dronesPerRow);

      const projX = padding + col * (projWidth + spacing + 20);
      const projY = projectileY + row * (targetHeight + 30 + spacing);
      tacticCardY = projY;

      // 背景渐变
      const alpha = 0.3;
      const gradientRadius = Math.max(projWidth, targetHeight) * (0.6 + Math.random() * 0.2);
      const centerX = projX + (projWidth + spacing) * (0.3 + Math.random() * 0.4);
      const centerY = projY + (targetHeight + 30) * (0.3 + Math.random() * 0.4);

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, gradientRadius);

      if (team.faction === "RDL") {
        gradient.addColorStop(0, `rgba(229,85,98,${alpha})`);
        gradient.addColorStop(1, `rgba(255,255,255,0)`);
      } else {
        gradient.addColorStop(0, `rgba(80,140,255,${alpha})`);
        gradient.addColorStop(1, "rgba(80,140,255,0.1)");
      }

      // 绘制背景
      ctx.save();
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(projX, projY, projWidth + spacing, targetHeight + 30, radius);
      ctx.fill();
      ctx.restore();

      // 磨砂玻璃
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.roundRect(projX, projY, projWidth + spacing, targetHeight + 30, radius);
      ctx.fill();
      ctx.restore();

      // 边框
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(projX, projY, projWidth + spacing, targetHeight + 30, radius);
      ctx.stroke();
      ctx.restore();

      // 图片本体
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur = 6;
      ctx.drawImage(img, projX + 10, projY + 35, projWidth, targetHeight);
      ctx.restore();
    }
  } else {
    tacticCardY = droneY + spacing;
  }

  // 绘制战术卡
  const tacticCardsStartY = tacticCardY + targetHeight + 30 + spacing; // 起始 Y
  for (let i = 0; i < tacticImages.length; i++) {
    const { tacticCard, img } = tacticImages[i];

    const cardWidth = img.width * (targetHeight / img.height);
    const col = i % tacticCardsPerRow;
    const row = Math.floor(i / tacticCardsPerRow);

    const cardX = padding + col * (cardWidth + spacing + 20);
    const cardY = tacticCardsStartY + row * (targetHeight + 30 + spacing); // 固定行高

    // 背景
    const alpha = 0.3;
    const gradientRadius = Math.max(cardWidth, targetHeight) * (0.6 + Math.random() * 0.2);
    const centerX = cardX + (cardWidth + spacing) * (0.3 + Math.random() * 0.4);
    const centerY = cardY + (targetHeight + 30) * (0.3 + Math.random() * 0.4);

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, gradientRadius);
    if (team.faction === "RDL") {
      gradient.addColorStop(0, `rgba(229,85,98,${alpha})`);
      gradient.addColorStop(1, `rgba(255,255,255,0)`);
    } else {
      gradient.addColorStop(0, `rgba(80,140,255,${alpha})`);
      gradient.addColorStop(1, "rgba(80,140,255,0.1)");
    }

    ctx.save();
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardWidth + spacing, targetHeight + 30, radius);
    ctx.fill();
    ctx.restore();

    // 磨砂玻璃
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardWidth + spacing, targetHeight + 30, radius);
    ctx.fill();
    ctx.restore();

    // 边框
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardWidth + spacing, targetHeight + 30, radius);
    ctx.stroke();
    ctx.restore();

    // 分数文本
    ctx.save();
    setGlowText(ctx, 36, "#ffffff");
    drawMixedText(ctx, `${translations.t16}: ${tacticCard.score || 0}`, cardX + 20, cardY + 30, 24, lang);
    ctx.restore();

    // 图片本体
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowBlur = 6;
    ctx.drawImage(img, cardX + 10, cardY + 35, cardWidth, targetHeight);
    ctx.restore();
  }


  // 把 canvas 导出为 PNG
  const blob: Blob = await new Promise(resolve =>
    canvas.toBlob(b => resolve(b!), "image/png")
  );
  if (!blob) return;

  // 转成 ArrayBuffer
  const buffer = new Uint8Array(await blob.arrayBuffer());

  // 提取 PNG chunks
  const chunks = extractChunks(buffer);

  // 插入 JSON 数据
  const jsonString = JSON.stringify(team);
  const customChunk = textChunk("TeamData", jsonString);
  chunks.splice(-1, 0, customChunk); // 在 IEND 前插入

  // 重新编码 PNG
  const outputBuffer = encodeChunks(chunks);
  const outBlob = new Blob([outputBuffer], { type: "image/png" });

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