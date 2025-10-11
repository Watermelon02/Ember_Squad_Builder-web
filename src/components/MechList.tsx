import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Trash2, Copy, ZoomIn, Rocket, Image, Table2, Loader2, Repeat } from 'lucide-react';
import { Team, Mech, Part, PART_TYPE_NAMES, } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from './ui/dialog';
import { unBackpack } from '../data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import extractChunks from "png-chunks-extract";
import encodeChunks from "png-chunks-encode";
import { motion, AnimatePresence } from 'framer-motion';

interface MechListProps {
  team?: Team;
  selectedMechId: string;
  onSelectMech: (mechId: string) => void;
  onSelectPartType: (partType: string) => void;
  onUpdateTeam: (teamId: string, updates: Partial<Team>) => void;
  onSetViewMode: (mode: 'parts' | 'drones' | 'pilots') => void;
  translations: any;
  partTypeNames: any;
  imgsrc: string, tabsrc: string,
  localImgsrc: string, lang: string, mobileOrTablet: boolean, setLanguage: React.Dispatch<React.SetStateAction<"zh" | "en" | "jp">>
}

export function MechList({
  team,
  selectedMechId,
  onSelectMech,
  onSelectPartType,
  onUpdateTeam,
  onSetViewMode,
  translations,
  partTypeNames,
  imgsrc, tabsrc,
  localImgsrc, lang, mobileOrTablet, setLanguage
}: MechListProps) {
  const [editingMechId, setEditingMechId] = useState<string>('');
  // 用一个对象记录每个无人机的页码
  const [dronePages, setDronePages] = React.useState<{ [index: number]: number }>({});
  const pageSize = 4; // 每页展示几个背包
  const [isExporting, setIsExporting] = useState(false);
  const setDronePage = (index: number, newPage: number) => {
    setDronePages(prev => ({
      ...prev,
      [index]: newPage,
    }));
  };


  // 发送 gtag 事件的异步函数
  const sendGtagEvent = async (eventName: string, eventCategory: string, eventLabel: string) => {
    return new Promise<void>((resolve) => {
      if (typeof window.gtag === "function") {
        window.gtag("event", eventName, {
          event_category: eventCategory,
          event_label: eventLabel,
          value: 1,
        });
      } else {
        console.warn("⚠️ Google Analytics 未初始化，跳过事件:", eventName);
      }
      resolve();
    });
  };


  const exportTextTeamData = (team: Team) => {
    sendGtagEvent("导出文件军表", "次数", "1");

    let clipboardContent = `┏ ${team.name}[${translations.t72}：${team.totalScore}${translations.t71}]\n`;

    team.mechs.forEach((mech) => {
      const mechScore = getMechTotalScore(mech);
      clipboardContent += `┣┳ ${mech.name}[M.A.P：${mechScore}${translations.t71}]\n`;

      if (mech.parts["torso"]) {
        clipboardContent += `┃┣ ${PART_TYPE_NAMES[lang]["torso"]}：${mech.parts["torso"].name}\n`;
      }
      if (mech.parts["chasis"]) {
        clipboardContent += `┃┣ ${PART_TYPE_NAMES[lang]["chasis"]}：${mech.parts["chasis"].name}\n`;
      }
      if (mech.parts["leftHand"]) {
        clipboardContent += `┃┣ ${PART_TYPE_NAMES[lang]["leftHand"]}：${mech.parts["leftHand"].name}\n`;
      }
      if (mech.parts["rightHand"]) {
        clipboardContent += `┃┣ ${PART_TYPE_NAMES[lang]["rightHand"]}：${mech.parts["rightHand"].name}\n`;
      }
      if (mech.parts["backpack"]) {
        clipboardContent += `┃┣ ${PART_TYPE_NAMES[lang]["backpack"]}：${mech.parts["backpack"].name}\n`;
      }
      if (mech.pilot) {
        clipboardContent += `┃┗ ${translations.t69}：${mech.pilot.name}\n`;
      }
    });
    let droneIndex = 0;
    if (team.drones.length > 0) {
      clipboardContent += `┗┳ [${translations.t70}：${team.drones.reduce((sum, drone) => sum + drone.score + (drone.backpack?.score || 0), 0)}${translations.t71}]\n`;
      team.drones.forEach((drone) => {
        if (droneIndex == team.drones.length - 1) {
          clipboardContent += `　┗ ${drone.name}\n`;
        } else {
          clipboardContent += `　┣ ${drone.name}\n`;
        }

        if (drone.backpack) {
          clipboardContent += `    ┃  ┗ ${drone.backpack.name}\n`;
        }
        droneIndex++;
      });
    }

    navigator.clipboard.writeText(clipboardContent).then(() => {
      alert(translations.t1);
    }).catch((err) => {
      alert(translations.t2);
    });
  };

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


  const imageCache = new Map<string, HTMLImageElement>();

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const img = document.createElement("img");
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.warn("图片加载失败:", src);
        // 使用 canvas 生成占位图
        const placeholder = document.createElement("canvas");
        placeholder.width = 100;
        placeholder.height = 100;
        const ctx = placeholder.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#ccc";
          ctx.fillRect(0, 0, placeholder.width, placeholder.height);
          ctx.fillStyle = "#000";
          ctx.font = "12px sans-serif";
          ctx.fillText("No Img", 10, 50);
        }
        const phImg = new Image();
        phImg.src = placeholder.toDataURL();
        resolve(phImg); // 直接返回占位图
      };
      img.src = src;
    });
  };


  async function getImage(src: string) {
    if (imageCache.has(src)) return imageCache.get(src)!;

    const img = await loadImage(src); // 如果失败会返回占位图
    imageCache.set(src, img);
    return img;
  }

  function textChunk(keyword: string, text: string) {
    const keywordBuffer = new TextEncoder().encode(keyword);
    const textBuffer = new TextEncoder().encode(text);
    const separator = new Uint8Array([0]); // null 分隔符
    return {
      name: "tEXt",
      data: new Uint8Array([...keywordBuffer, ...separator, ...textBuffer]),
    };
  }

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

  const exportTeamImage = async (team: Team, lang: string) => {
    sendGtagEvent("导出图片", "次数", "1");

    if (!team.mechs.length) {
      alert(`${translations.t14}`);
      return;
    }

    const padding = 30;
    const spacing = 20;
    const radius = 15;
    const targetHeight = 400;
    const dronesPerRow = 3;

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

        projectiles.forEach((projId) => uniqueProjectileIds.add(projId));
      });
    });

    // Step 2: 并行加载所有唯一 projectile 图片
    const projectileImageIndex = new Map<string, HTMLImageElement>();

    await Promise.all(
      Array.from(uniqueProjectileIds).map(async (projId) => {
        const img = await getImage(`${localImgsrc}/${projId}.png`);
        projectileImageIndex.set(projId, img);
      })
    );

    // Step 3: 生成绘制数组（每张图片只出现一次）
    const projectileImages = Array.from(projectileImageIndex.values());




    // 计算画布大小
    let y = padding + 100;
    for (const { imgs } of mechImages) y += 55 + targetHeight + spacing + 40;
    const totalDroneRows = Math.ceil(team.drones.length / dronesPerRow);
    const totalProjectileRows = Math.ceil(projectileImages.length / dronesPerRow);
    const droneRowHeight = targetHeight + 30 + spacing;
    const canvasHeight = y + (totalDroneRows + totalProjectileRows) * droneRowHeight + padding;
    canvas.width = 1741 + padding * 2;
    canvas.height = canvasHeight;

    const width = canvas.width;
    const height = canvas.height;

    const gradient = ctx.createLinearGradient(0, 0, 0, height); // 从顶部到底部

    if (team.faction === "RDL") {
      gradient.addColorStop(0, `rgba(229,85,98,1)`);
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
      const r = boxWidth ; 
      const centerX = x + Math.random() * boxWidth;
      const centerY = y + Math.random() * boxHeight;

      const innerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, r);

      if (team.faction === "RDL") {
        innerGradient.addColorStop(0, `rgba(229,85,98,${alpha})`);
        innerGradient.addColorStop(0.5, `rgba(211,169,158,${alpha * 0.8})`);
        innerGradient.addColorStop(1, `rgba(255,255,255,0)`); // 逐渐透明
      } else {
        innerGradient.addColorStop(0, `rgba(108,128,192,${alpha})`);
        innerGradient.addColorStop(0.5, `rgba(150,177,209,${alpha * 0.8})`);
        innerGradient.addColorStop(1, `rgba(255,255,255,0)`);
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
      const dodgeX = x + 460;
      const dodgeY = y + 50 - iconSize / 2;
      ctx.drawImage(iconDodge, dodgeX, dodgeY - 12, iconSize, iconSize);
      setGlowText(ctx, 36, "#3dafff");
      ctx.fillStyle = "#3dafff";
      drawMixedText(ctx, `${dodge}`, dodgeX + iconSize + 12, y + 50, 36, lang);

      const elecX = x + 600;
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
    let lastDroneBottom = droneY + targetHeight + 30 + spacing;

    // 绘制抛射物
    for (let i = 0; i < projectileImages.length; i++) {

      for (let j = 0; j < projectileImages.length; j++) {
        const img = projectileImages[j];
        const projWidth = img.width * (targetHeight / img.height);
        const index = i * projectileImages.length + j;
        const col = index % dronesPerRow;
        const row = Math.floor(index / dronesPerRow);

        const projX = padding + col * (projWidth + spacing + 20);
        // 🚀 关键：让抛射物从无人机部分的底部往下偏移一行
        const projY = lastDroneBottom + row * (targetHeight + 30 + spacing);

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

        // 背景 + 边框 + 投影绘制部分（保持原样）
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(projX, projY, projWidth + spacing, targetHeight + 30, radius);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.roundRect(projX, projY, projWidth + spacing, targetHeight + 30, radius);
        ctx.fill();
        ctx.restore();

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


  const deletePart = (mechId: string, partType: string) => {
    if (!team) return;

    // 更新机甲的部件数据
    const updatedMechs = team.mechs.map((mech) => {
      if (mech.id === mechId) {
        const updatedParts = { ...mech.parts };
        delete updatedParts[partType]; // 删除对应的部件
        return { ...mech, parts: updatedParts };
      }
      return mech;
    });

    // 更新机甲的总分数
    const totalScore = updatedMechs.reduce(
      (sum, mech) =>
        sum +
        Object.values(mech.parts).reduce((partSum, part) => partSum + (part?.score || 0), 0) +
        (mech.pilot?.score || 0),
      0
    ) + team.drones.reduce((sum, drone) => sum + drone.score, 0);

    onUpdateTeam(team.id, { mechs: updatedMechs, totalScore });
  };


  const addMech = () => {
    if (!team) return;
    const newMech: Mech = { id: Date.now().toString(), name: `${translations.t19}`, parts: {} };
    const updatedMechs = [...team.mechs, newMech];
    onUpdateTeam(team.id, { mechs: updatedMechs, mechCount: updatedMechs.length });
  };

  const deleteMech = (mechId: string) => {
    if (!team) return;
    const updatedMechs = team.mechs.filter((mech) => mech.id !== mechId);
    const totalScore =
      updatedMechs.reduce(
        (sum, mech) =>
          sum +
          Object.values(mech.parts).reduce((partSum, part) => partSum + (part?.score || 0), 0) +
          (mech.pilot?.score || 0),
        0
      ) + team.drones.reduce((sum, drone) => sum + drone.score, 0);

    onUpdateTeam(team.id, { mechs: updatedMechs, mechCount: updatedMechs.length, totalScore });
    if (selectedMechId === mechId) onSelectMech('');
  };

  const updateMechName = (mechId: string, name: string) => {
    if (!team) return;
    const updatedMechs = team.mechs.map((mech) => mech.id === mechId ? { ...mech, name } : mech);
    onUpdateTeam(team.id, { mechs: updatedMechs });
  };

  const copyMech = (mech: Mech) => {
    if (!team) return;
    const copiedMech: Mech = { ...mech, id: Date.now().toString(), name: `${mech.name} ${translations.t20}` };
    const updatedMechs = [...team.mechs, copiedMech];
    const totalScore =
      updatedMechs.reduce(
        (sum, m) =>
          sum +
          Object.values(m.parts).reduce((partSum, part) => partSum + (part?.score || 0), 0) +
          (m.pilot?.score || 0),
        0
      ) + team.drones.reduce((sum, drone) => sum + drone.score, 0);

    onUpdateTeam(team.id, { mechs: updatedMechs, mechCount: updatedMechs.length, totalScore });
  };

  const deleteDrone = (droneIndex: number) => {
    if (!team) return;
    const updatedDrones = team.drones.filter((_, index) => index !== droneIndex);
    const droneScore = updatedDrones.reduce((sum, d) => sum + d.score, 0);
    const mechScore = team.mechs.reduce(
      (sum, mech) =>
        sum +
        Object.values(mech.parts).reduce((partSum, part) => partSum + (part?.score || 0), 0) +
        (mech.pilot?.score || 0),
      0
    );
    onUpdateTeam(team.id, {
      drones: updatedDrones,
      totalScore: mechScore + droneScore,
      largeDroneCount: updatedDrones.filter((d) => d.type === 'large').length,
      mediumDroneCount: updatedDrones.filter((d) => d.type === 'medium').length,
      smallDroneCount: updatedDrones.filter((d) => d.type === 'small').length,
    });
  };

  const getMechTotalScore = (mech: Mech) =>
    Object.values(mech.parts).reduce((sum, part) => sum + (part?.score || 0), 0) +
    (mech.pilot?.score || 0);

  if (!team) {
    return <div className="h-full flex items-center justify-center text-muted-foreground">{translations.t21}</div>;
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function getFactionColor(faction: string, alpha: number) {
    switch (faction) {
      case 'RDL':
        return `rgba(255, 0, 0, ${alpha})`; // 红色
      case 'UN':
        return `rgba(0, 80, 255, ${alpha})`; // 蓝色
      case 'GOF':
        return `rgba(0, 255, 0, ${alpha})`; // 绿色
      default:
        return `rgba(255, 255, 255, ${alpha})`; // 白色默认
    }
  }


  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <Tabs defaultValue="mechs" className="flex-1 min-h-0 flex flex-col">
        {/* 顶部工具栏 */}
        {mobileOrTablet ? (
          /* 移动端：三行布局 */
          <div className="p-4 border-b border-border flex flex-col gap-3">
            {/* 第 1 行：Tabs */}
            <TabsList className="flex justify-center gap-2 w-full">
              <TabsTrigger
                value="mechs"
                onClick={() => onSetViewMode('parts')}
                className="flex-1 max-w-[150px]"
              >
                {translations.t22} ({team.mechs.length})
              </TabsTrigger>
              <TabsTrigger
                value="drones"
                onClick={() => onSetViewMode('drones')}
                className="flex-1 max-w-[150px]"
              >
                {translations.t23} ({team.drones.length})
              </TabsTrigger>
            </TabsList>


            {/* 第 2 行：语言切换 + 按钮 */}
            <div className="flex items-center justify-end gap-2">
              <Select value={lang} onValueChange={v => setLanguage(v as "zh" | "en" | "jp")}>
                <SelectTrigger className=" h-8 text-sm">
                  <SelectValue placeholder="选择语言" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="jp">日本語</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={() => team && exportTextTeamData(team)}>
                <Table2 className="w-4 h-4 mr-1" />
                {translations.t6}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={isExporting}
                onClick={async () => {
                  setIsExporting(true);

                  try {
                    await exportTeamImage(team, lang);
                    // 成功动画提示（渐隐显示）
                    const msg = document.createElement("div");
                    msg.textContent = `✅ ${translations.t76}`;
                    Object.assign(msg.style, {
                      position: "fixed",
                      bottom: "40px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "rgba(0,0,0,0.75)",
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      opacity: "0",
                      transition: "opacity 0.3s",
                      zIndex: 9999,
                    });
                    document.body.appendChild(msg);
                    requestAnimationFrame(() => (msg.style.opacity = "1"));
                    setTimeout(() => {
                      msg.style.opacity = "0";
                      setTimeout(() => msg.remove(), 300);
                    }, 2000);
                  } catch (err) {
                    console.error(`${translations.t77}`, err);
                    alert(`${translations.t78}`);
                  } finally {
                    setIsExporting(false);
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  <AnimatePresence>
                    {isExporting && (
                      <motion.div
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, rotate: [0, 360] }}
                        exit={{ opacity: 0 }}
                        transition={{ rotate: { repeat: Infinity, duration: 1, ease: "linear" }, opacity: { duration: 0.2 } }}
                      >
                        <Loader2 className="w-4 h-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {isExporting ? (
                    <span>{translations.t79}</span>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Image className="w-4 h-4" />
                      <span>{translations.t24}</span>
                    </div>
                  )}
                </div>

              </Button>

            </div>

            {/* 第 3 行：统计信息 */}
            <div className="grid grid-cols-5 gap-2 text-center pt-2">
              <div>
                <div className="text-xs text-muted-foreground">{translations.t7}</div>
                <div className="font-medium">{team.totalScore}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{translations.t8}</div>
                <div className="font-medium">{team.mechCount}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{translations.t9}</div>
                <div className="font-medium">{team.largeDroneCount}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{translations.t10}</div>
                <div className="font-medium">{team.mediumDroneCount}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{translations.t11}</div>
                <div className="font-medium">{team.smallDroneCount}</div>
              </div>
            </div>
          </div>
        ) : (
          /* 桌面端：原来的两边布局 */
          <div className="p-4 border-b border-border flex items-center justify-between">
            {/* 左侧 Tabs */}
            <TabsList className="grid grid-cols-2 gap-2">
              <TabsTrigger value="mechs" onClick={() => onSetViewMode('parts')}>
                {translations.t22} ({team.mechs.length})
              </TabsTrigger>
              <TabsTrigger value="drones" onClick={() => onSetViewMode('drones')}>
                {translations.t23} ({team.drones.length})
              </TabsTrigger>
            </TabsList>

            {/* 右侧按钮 */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => team && exportTextTeamData(team)}>
                <Table2 className="w-4 h-4 mr-1" />
                {translations.t6}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={isExporting}
                onClick={async () => {
                  setIsExporting(true);

                  try {
                    await exportTeamImage(team, lang);
                    // 成功动画提示（渐隐显示）
                    const msg = document.createElement("div");
                    msg.textContent = `✅ ${translations.t76}`;
                    Object.assign(msg.style, {
                      position: "fixed",
                      bottom: "40px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "rgba(0,0,0,0.75)",
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      opacity: "0",
                      transition: "opacity 0.3s",
                      zIndex: 9999,
                    });
                    document.body.appendChild(msg);
                    requestAnimationFrame(() => (msg.style.opacity = "1"));
                    setTimeout(() => {
                      msg.style.opacity = "0";
                      setTimeout(() => msg.remove(), 300);
                    }, 2000);
                  } catch (err) {
                    console.error(`${translations.t77}`, err);
                    alert(`${translations.t78}`);
                  } finally {
                    setIsExporting(false);
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  <AnimatePresence>
                    {isExporting && (
                      <motion.div
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, rotate: [0, 360] }}
                        exit={{ opacity: 0 }}
                        transition={{ rotate: { repeat: Infinity, duration: 1, ease: "linear" }, opacity: { duration: 0.2 } }}
                      >
                        <Loader2 className="w-4 h-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {isExporting ? (
                    <span>{translations.t79}</span>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Image className="w-4 h-4" />
                      <span>{translations.t24}</span>
                    </div>
                  )}
                </div>

              </Button>

            </div>
          </div>
        )}



        
        {/* 机体列表 */}
        <TabsContent value="mechs" className="flex-1 overflow-y-auto p-4 space-y-4">
          {team.mechs.map((mech) => (
            <Card
              key={mech.id}
              className={`p-4 rounded-lg transition-transform transition-shadow duration-500 ease-in-out ${selectedMechId === mech.id
                ? 'scale-105 shadow-xl  border-blue-500'  // 选中效果
                : 'scale-100 shadow-md hover:scale-103 hover:shadow-lg'
                }`}
            >
              <div className="space-y-4">
                {/* 机体标题行 */}
                {mobileOrTablet && <div className="flex items-center justify-between">
                  {editingMechId === mech.id ? (
                    <Input
                      value={mech.name}
                      onChange={(e) => updateMechName(mech.id, e.target.value)}
                      onBlur={() => setEditingMechId('')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setEditingMechId('');
                        }
                      }}
                      className="h-8 max-w-48"
                      autoFocus
                    />
                  ) : (
                    <span
                      onDoubleClick={() => setEditingMechId(mech.id)}
                      className="font-medium cursor-pointer"
                    >
                      {mech.name}
                    </span>
                  )}
                  {/* 机体数据 */}


                  <div className="flex justify-between gap-2">
                    {/* 总分 */}
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">{translations.t32}</div>
                      <AnimatePresence mode="popLayout">
                        <motion.div
                          key={getMechTotalScore(mech)}
                          initial={{ scale: 1, y: 0, opacity: 0 }}
                          animate={{ y: [-5, 0], opacity: 1 }}
                          exit={{ scale: 1, y: 5, opacity: 0 }}
                          transition={{ duration: 0.3, times: [0, 1] }}
                          className="text-base font-medium"
                        >
                          {getMechTotalScore(mech)}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* 闪避 */}
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">{translations.t33}</div>
                      <AnimatePresence mode="popLayout">
                        <motion.div
                          key={Math.max(
                            (mech.parts.torso?.dodge || 0) +
                            (mech.parts.chasis?.dodge || 0) +
                            (mech.parts.leftHand?.dodge || 0) +
                            (mech.parts.rightHand?.dodge || 0) +
                            (mech.parts.backpack?.dodge || 0),
                            0
                          )}
                          initial={{ scale: 1, y: 0, opacity: 0 }}
                          animate={{ y: [-5, 0], opacity: 1 }}
                          exit={{ scale: 1, y: 5, opacity: 0 }}
                          transition={{ duration: 0.3, times: [0, 1] }}
                          className="text-base font-medium"
                        >
                          {Math.max(
                            (mech.parts.torso?.dodge || 0) +
                            (mech.parts.chasis?.dodge || 0) +
                            (mech.parts.leftHand?.dodge || 0) +
                            (mech.parts.rightHand?.dodge || 0) +
                            (mech.parts.backpack?.dodge || 0),
                            0
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* 电子 */}
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">{translations.t34}</div>
                      <AnimatePresence mode="popLayout">
                        <motion.div
                          key={
                            (mech.parts.torso?.electronic || 0) +
                            (mech.parts.chasis?.electronic || 0) +
                            (mech.parts.leftHand?.electronic || 0) +
                            (mech.parts.rightHand?.electronic || 0) +
                            (mech.parts.backpack?.electronic || 0)
                          }
                          initial={{ scale: 1, y: 0, opacity: 0 }}
                          animate={{ y: [-5, 0], opacity: 1 }}
                          exit={{ scale: 1, y: 5, opacity: 0 }}
                          transition={{ duration: 0.3, times: [0, 1] }}
                          className="text-base font-medium"
                        >
                          {(mech.parts.torso?.electronic || 0) +
                            (mech.parts.chasis?.electronic || 0) +
                            (mech.parts.leftHand?.electronic || 0) +
                            (mech.parts.rightHand?.electronic || 0) +
                            (mech.parts.backpack?.electronic || 0)}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>


                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyMech(mech)}
                      className="text shadow-lg shadow-gray-500 rounded-lg bg-blue-500/80"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMech(mech.id)}
                      className="text-destructive shadow-lg shadow-gray-500 rounded-lg bg-blue-500/80"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>}

                <div
                  style={{
                    display: 'grid',
                    width: '100%',
                    gap: '12px', // gap-3 相当于 0.75rem ≈ 12px
                    gridTemplateColumns: mobileOrTablet ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)',
                  }}
                >

                  {(Object.entries(partTypeNames) as [keyof typeof partTypeNames, string][]).map(
                    ([partType]) => (
                      <AnimatePresence mode="wait" key={partType}>
                        <motion.div
                          key={mech.parts[partType]?.id || partType}
                          initial={{ opacity: 0, y: -10, scale: 1 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLDivElement).style.transform = "scale(1.05)";
                            (e.currentTarget as HTMLDivElement).style.boxShadow =
                              "0 6px 10px rgba(0,0,0,0.1)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                            (e.currentTarget as HTMLDivElement).style.boxShadow =
                              "0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)";
                          }}
                          className={`relative p-0 overflow-hidden  cursor-pointer transition shadow-lg shadow-gray-500 rounded-lg ${selectedMechId === mech.id ? "border-primary" : ""
                            }`}
                        >
                          {/* 分数按钮 */}
                          <Button
                            variant="secondary"
                            className="h-6 w-8 flex absolute bottom-0 left-0 m-1 text-xs shadow-lg shadow-gray-500 rounded-lg bg-blue-500/80"
                            style={{ color: 'white', textShadow: '0 0 4px rgba(0,0,0,0.7)' }}
                          >
                            {mech.parts[partType]?.score}
                          </Button>

                          {mech.parts[partType] ? (
                            <>
                              {/* 删除按钮 */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deletePart(mech.id, partType)}
                                className="absolute top-0 right-0 text-white shadow-lg shadow-gray-500 rounded-lg bg-blue-500/80"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>

                              {/* 放大预览 Dialog */}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute top-0 left-0 text-white shadow-lg shadow-gray-500 rounded-lg bg-blue-500/80"
                                  >
                                    <ZoomIn className="w-3 h-3 text-gray-700" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="border-0 shadow-none bg-transparent p-0">
                                  {mech.parts[partType] && (
                                    <img
                                      key={mech.parts[partType]!.id}
                                      src={`${imgsrc}/${mech.parts[partType]!.id}.png`}
                                      alt={mech.parts[partType]!.name}
                                      className="w-full h-auto object-contain rounded-lg"
                                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                      transition={{ duration: 0.3 }}
                                    />
                                  )}
                                </DialogContent>
                              </Dialog>

                              {/* 底部的：抛弃 */}
                          <div className="absolute bottom-0 right-0 flex flex-col-reverse items-end gap-0.5">

                            {!!mech.parts[partType]?.throwIndex && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="secondary"
                                    className="h-6 w-8 flex bottom-0 left-0 m-1 text-xs shadow-lg shadow-gray-500 rounded-lg bg-blue-500/80"
                                  >
                                    <Repeat className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="border-0 shadow-none bg-transparent p-0">
                                  <img
                                    src={`${imgsrc}/${mech.parts[partType]?.throwIndex}.png`}
                                    alt={mech.parts[partType]!.name}
                                    className="w-full h-auto object-contain rounded-lg"
                                  />
                                </DialogContent>
                              </Dialog>

                            )}

                            {/* 上方的：发射 */}
                            {Array.isArray(mech.parts[partType]?.projectile) &&
                              mech.parts[partType]!.projectile!.length > 0 && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="secondary"
                                      className="h-6 w-8 flex bottom-0 left-0 m-1 text-xs shadow-lg shadow-gray-500 rounded-lg bg-blue-500/80"
                                    >
                                      <Rocket className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>

                                  <DialogContent
                                    style={{
                                      border: 0,
                                      boxShadow: "none",
                                      background: "transparent",
                                      padding: "24px",
                                      maxHeight: "90vh", // 限制弹窗高度
                                      overflowY: "auto", // 竖向滑动
                                    }}
                                  >
                                    <DialogHeader>
                                      <DialogTitle>
                                        <VisuallyHidden>Projectile Images</VisuallyHidden>
                                      </DialogTitle>
                                      <DialogClose
                                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
                                        aria-label="Close"
                                      >
                                        ✕
                                      </DialogClose>
                                    </DialogHeader>

                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "24px",
                                        alignItems: "center",
                                      }}
                                    >
                                      {mech.parts[partType]!.projectile!.map((proj, idx) => (
                                        <img
                                          key={idx}
                                          src={`${imgsrc}/${proj}.png`}
                                          alt={`Projectile ${proj}`}
                                          style={{
                                            width: "90vw",       // 移动端自适应
                                            maxWidth: "500px",   // 桌面端最大宽度
                                            height: "auto",
                                            objectFit: "contain",
                                            borderRadius: "0.5rem",
                                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                          }}
                                        />
                                      ))}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}


                          </div>

                              

                              {/* 外层主显示图片 */}

                              <img
                                key={mech.parts[partType]!.id}
                                src={`${imgsrc}/${mech.parts[partType]!.id}.png`}
                                alt={mech.parts[partType]!.name}
                                loading="lazy"
                                className="w-full h-auto object-contain rounded-lg"
                                onClick={() => {
                                  onSelectMech(mech.id);
                                  onSelectPartType(partType);
                                  onSetViewMode('parts');
                                }}
                              />

                            </>
                          ) : (
                            <div
                              style={{
                                position: "relative",
                                width: "100%",
                                borderRadius: "0.5rem",
                                overflow: "hidden",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                onSelectMech(mech.id);
                                onSelectPartType(partType);
                                onSetViewMode("parts");
                              }}
                            >
                              {/* 透明占位图：保持高度 */}
                              <img
                                src={`${imgsrc}/001.png`}
                                loading="lazy"
                                alt="placeholder"
                                style={{
                                  width: "100%",
                                  height: "auto",
                                  objectFit: "contain",
                                  borderRadius: "0.5rem",
                                  opacity: 0, // 透明但保留空间
                                  userSelect: "none",
                                  pointerEvents: "none",
                                }}
                              />

                              {/* 叠加显示“未装备”文字 */}
                              <div
                                style={{
                                  position: "absolute",
                                  inset: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "0.9rem",
                                  color: "rgba(100, 100, 100, 0.4)",
                                  backgroundColor: "rgba(240, 240, 240, 0.4)", // 可选，轻微底色提升可读性
                                  borderRadius: "0.5rem",
                                }}
                              >
                              {`${PART_TYPE_NAMES[lang][partType]}`}
                              </div>
                            </div>



                          )}
                        </motion.div>
                      </AnimatePresence>
                    )
                  )}

                  {mobileOrTablet && (
                    <div

                      className={`relative p-0 overflow-hidden cursor-pointer transition shadow-lg shadow-gray-500 rounded-lg ${selectedMechId === mech.id ? 'border-primary' : ''
                        }`}
                      style={{
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center', // 居中图片和文字
                      }}
                      onClick={() => {
                        onSelectMech(mech.id);
                        onSetViewMode('pilots');
                      }}
                    >

                      {mech.pilot ? (<Button
                        variant="secondary"
                        className="h-6 w-8 flex absolute bottom-0 left-0 m-1 text-xs shadow-lg shadow-gray-500 rounded-lg bg-blue-500/80"
                        style={{
                          color: 'white',
                          textShadow: '0 0 4px rgba(0,0,0,0.7)',
                        }}
                      >
                        {mech.pilot?.score}
                      </Button>) : (<></>)}
                      {mech.pilot ? (
                        <div

                          style={{
                            display: 'flex',
                            flexDirection: 'column', // 竖直排列
                            alignItems: 'center',

                          }}
                        >
                          <img
                            src={`${tabsrc}/${mech.pilot.id}.png`}
                            alt={mech.pilot.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',          // 保持比例填满容器
                              objectPosition: 'center', // 可以调整显示区域：'center', 'top', 'bottom', 'left', 'right', 或百分比
                              borderRadius: '0.5rem',       // 圆角
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '0.5rem',
                              left: '0.5rem',
                              right: '0.5rem',
                              color: 'white',
                              textShadow: '0 0 4px rgba(0,0,0,0.7)',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-end', textAlign: 'right',
                            }}
                          >
                            <span style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>{mech.pilot.name}</span>
                            <span style={{ fontSize: '0.75rem' }}>{mech.pilot.traitDescription}</span>
                          </div>
                        </div>
                      ) : (
                        <div
                                style={{
                                  position: "absolute",
                                  inset: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "0.9rem",
                                  color: "rgba(100, 100, 100, 0.4)",
                                  backgroundColor: "rgba(240, 240, 240, 0.4)", // 可选，轻微底色提升可读性
                                  borderRadius: "0.5rem",
                                }}
                              >
                                {translations.t27}
                              </div>
                      )}
                    </div>
                  )}

                </div>


                {/* 驾驶员卡片 pc端显示 */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }} >
                  {/* 左侧驾驶员卡片 */}
                  {!mobileOrTablet && (
                    <div
                      onClick={() => {
                        onSelectMech(mech.id);
                        onSetViewMode('pilots');
                      }}
                      style={{
                        flex: '0 0 14rem',
                        height: '6rem',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.03)';
                        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 10px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
                        (e.currentTarget as HTMLDivElement).style.boxShadow =
                          '0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)';
                      }}
                    >
                      {/* 背景动画层，始终在最底层 */}
                      {(selectedMechId === mech.id && mech.pilot !== undefined) && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            top: '-300%',
                            left: '-300%',
                            width: '600%',
                            height: '600%',
                            pointerEvents: 'none',
                            borderRadius: '0.5rem',
                            background: `conic-gradient(
            from 0deg,
            ${getFactionColor(team.faction, 0.5)},
            ${getFactionColor(team.faction, 0.2)},
            ${getFactionColor(team.faction, 0.5)}
          )`,
                            animation: 'rotateBg 6s linear infinite',
                            zIndex: 0, // 确保在最底层
                          }}
                        />
                      )}

                      {/* 图片 + AnimatePresence，zIndex 默认比背景高 */}
                      <AnimatePresence mode="wait">
                        {mech.pilot ? (
                          <motion.img
                            key={mech.pilot.id}
                            src={`${tabsrc}/${mech.pilot.id}.png`}
                            alt={mech.pilot.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'center',
                              transform: 'translate(-20%, 0%)',
                              position: 'relative', // 相对于父容器
                              zIndex: 1,
                            }}
                            initial={{ opacity: 0, x: -10, scale: 0.97 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 10, scale: 0.97 }}
                            transition={{ duration: 0.3 }}
                          />
                        ) : (
                          <span
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              height: '100%',
                              color: '#9ca3af',
                              fontSize: '0.875rem',
                              textAlign: 'center',
                              position: 'relative',
                              zIndex: 1,
                            }}
                          >
                            {translations.t27}
                          </span>
                        )}
                      </AnimatePresence>

                      {/* 分数按钮 */}
                      {mech.pilot && (
                        <Button
                          variant="secondary"
                          className="h-6 w-8 flex absolute top-0 right-0 m-1 text-xs shadow-lg shadow-gray-500 rounded-lg bg-blue-500/80"
                          style={{ color: 'white', textShadow: '0 0 4px rgba(0,0,0,0.7)', zIndex: 2 }}
                        >
                          {mech.pilot?.score}
                        </Button>
                      )}

                      {/* 文字覆盖层 */}
                      {mech.pilot && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '0.5rem',
                            left: '0.5rem',
                            right: '0.5rem',
                            color: 'white',
                            textShadow: '0 0 4px rgba(0,0,0,0.7)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            textAlign: 'end',
                            zIndex: 2,
                          }}
                        >
                          <span style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>{mech.pilot.name}</span>
                          <span style={{ fontSize: '0.6rem' }}>{mech.pilot.traitDescription}</span>
                        </div>
                      )}
                    </div>
                  )}


                  {/* 右侧信息卡片 */}
                  {!mobileOrTablet && (
                    <div
                      style={{
                        flex: 1,
                        height: '6rem', // 高度统一
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        boxShadow: 'inset 0 0 8px  rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '0.25rem',
                      }}
                    >
                      {/* 机体名称和按钮一行 */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                          {/* 可用状态 */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                            {/* 可用状态 */}
                            <div
                              style={{
                                flex: 1,
                                height: '1.8rem',
                                borderRadius: '0.3rem',
                                width: '4rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f9fafb',
                                fontSize: '0.6rem',
                                color:
                                  mech.parts.torso &&
                                    mech.parts.chasis &&
                                    (mech.parts.leftHand || mech.parts.rightHand) &&
                                    mech.pilot
                                    ? '#111' // 可用
                                    : '#dc2626', // 禁用红色
                                boxShadow: 'inset 0 0 8px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease',
                              }}
                            >
                              {mech.parts.torso &&
                                mech.parts.chasis &&
                                (mech.parts.leftHand || mech.parts.rightHand) &&
                                mech.pilot
                                ? translations.t80
                                : translations.t81}
                            </div>

                            {/* 众筹禁赛状态 */}
                            <div
                              style={{
                                flex: 1,
                                height: '1.8rem',
                                width: '5rem',
                                borderRadius: '0.3rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f9fafb',
                                fontSize: '0.6rem',
                                color: (() => {
                                  const bannedBackpack = ['005'].includes(mech.parts.backpack?.id || '');
                                  const bannedLeft = ['040', '150', '117'].includes(mech.parts.leftHand?.id || '');
                                  const bannedRight = ['038', '152', '119'].includes(mech.parts.rightHand?.id || '');
                                  const isBanned = bannedBackpack || bannedLeft || bannedRight;

                                  // 必须可用且不禁赛才能可参赛
                                  const isUsable =
                                    mech.parts.torso &&
                                    mech.parts.chasis &&
                                    (mech.parts.leftHand || mech.parts.rightHand) &&
                                    mech.pilot;

                                  return !isUsable || isBanned ? '#dc2626' : '#111';
                                })(),
                                boxShadow: 'inset 0 0 8px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease',
                              }}
                            >
                              {(() => {
                                const bannedBackpack = ['005'].includes(mech.parts.backpack?.id || '');
                                const bannedLeft = ['040', '150', '117'].includes(mech.parts.leftHand?.id || '');
                                const bannedRight = ['038', '152', '119'].includes(mech.parts.rightHand?.id || '');
                                const isBanned = bannedBackpack || bannedLeft || bannedRight;

                                const isUsable =
                                  mech.parts.torso &&
                                  mech.parts.chasis &&
                                  (mech.parts.leftHand || mech.parts.rightHand) &&
                                  mech.pilot;

                                return !isUsable || isBanned ? translations.t82 : translations.t83;
                              })()}
                            </div>

                          </div>

                        </div>
                        <div style={{ fontSize: '1rem' }}>
                          {editingMechId === mech.id ? (
                            <Input
                              value={mech.name}
                              onChange={(e) => updateMechName(mech.id, e.target.value)}
                              onBlur={() => setEditingMechId('')}
                              onKeyDown={(e) => { if (e.key === 'Enter') setEditingMechId(''); }}
                              className="h-8 w-full"
                              autoFocus
                            />
                          ) : (
                            <span onDoubleClick={() => setEditingMechId(mech.id)} className="cursor-pointer">
                              {mech.name}
                            </span>
                          )}
                        </div>

                        {/* 状态栏 */}



                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyMech(mech)}
                            className="text shadow-lg shadow-gray-500 rounded-lg bg-blue-500/80"
                            style={{ boxShadow: 'inset 0 0 0px  rgba(0,0,0,0.1)' }}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMech(mech.id)}
                            className="text-destructive shadow-lg shadow-gray-500 rounded-lg bg-blue-500/80"
                            style={{ boxShadow: 'inset 0 0 0px  rgba(0,0,0,0.1)' }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* 属性卡片 */}

                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.25rem' }}>
                        {[
                          { label: translations.t32, value: getMechTotalScore(mech) }, // 第一项无图标
                          {
                            value: Math.max(
                              (mech.parts.torso?.dodge || 0) +
                              (mech.parts.chasis?.dodge || 0) +
                              (mech.parts.leftHand?.dodge || 0) +
                              (mech.parts.rightHand?.dodge || 0) +
                              (mech.parts.backpack?.dodge || 0),
                              0
                            ),
                            icon: `${tabsrc}/icon_dodge.png`,
                          },
                          {
                            value:
                              (mech.parts.torso?.electronic || 0) +
                              (mech.parts.chasis?.electronic || 0) +
                              (mech.parts.leftHand?.electronic || 0) +
                              (mech.parts.rightHand?.electronic || 0) +
                              (mech.parts.backpack?.electronic || 0),
                            icon: `${tabsrc}/icon_electronic.png`,
                          },
                        ].map((attr, idx) => (
                          <div
                            key={idx}
                            style={{
                              flex: 1,
                              height: '2.5rem', // 缩小高度
                              padding: '0 0.25rem',
                              backgroundColor: '#f9fafb',
                              borderRadius: '0.5rem',
                              textAlign: 'center',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center', boxShadow: 'inset 0 0 8px  rgba(0,0,0,0.1)'
                            }}
                          >
                            {/* 标签 */}
                            <div style={{ fontSize: '0.65rem', color: '#6b7280', marginBottom: '0.15rem' }}>
                              {attr.label}
                            </div>

                            {/* 数字 + 可选 icon 水平排列 */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              {attr.icon && (
                                <img
                                  src={attr.icon}
                                  alt={attr.label}
                                  style={{ width: '1.25rem', height: '1.25rem' }} // icon 更大
                                />
                              )}
                              <AnimatePresence mode="popLayout">
                                <motion.div
                                  key={attr.value} // 数字变化时触发动画
                                  initial={{ scale: 1, y: 0, opacity: 0 }}
                                  animate={{ y: [-5, 0], opacity: 1 }} // 放大后回原位 + 向上跳动
                                  exit={{ scale: 1, y: 5, opacity: 0 }}
                                  transition={{ duration: 0.3, times: [0, 1] }}
                                  style={{ fontSize: '0.875rem', fontWeight: 500 }}
                                >
                                  {attr.value}
                                </motion.div>
                              </AnimatePresence>
                            </div>
                          </div>
                        ))}
                      </div>


                    </div>
                  )}
                </div>


              </div>
            </Card>
          ))}
          <div className="flex justify-center">
            <Button onClick={addMech} size="sm" className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800">
              <Plus className="w-4 h-4 mr-2" />
              {translations.t29}
            </Button>
          </div>

          {team.mechs.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              {translations.t30}
            </div>
          )}
        </TabsContent>

        {/* 无人机列表 */}
        <TabsContent
          value="drones"
          className="flex-1 overflow-y-auto p-4 space-y-0"
        >
          <div className="grid grid-cols-2 gap-4">
            {team.drones.map((drone, index) => {
              const page = dronePages[index] || 0;
              const backpackList = Object.values(unBackpack);
              const totalPages = Math.max(1, Math.ceil(backpackList.length / pageSize));

              return (
                <div
                  key={`${drone.id}-${index}`}
                  className={`relative p-0 overflow-hidden cursor-pointer transition shadow-lg shadow-gray-500 rounded-lg 
                        }`}
                  style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                  onClick={() => onSetViewMode('drones')}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.03)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 10px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      '0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)';
                  }}
                >
                  {/* 背包选择触发器（保留原来结构） */}
                  {drone.id === "162" && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <div
                          onClick={(e) => { e.stopPropagation(); }}
                          className="absolute bottom-0 left-0 w-12 h-12 flex items-center justify-center 
               bg-blue-500/50 shadow-md rounded-lg cursor-pointer z-10 hover:bg-blue-500/70"
                        >
                          {drone.backpack ? (
                            <img
                              src={`${imgsrc}/${drone.backpack.id}.png`}
                              alt={drone.backpack.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground bottom-0">{translations.t68}</span>
                          )}
                        </div>
                      </DialogTrigger>

                      <DialogContent className="max-w-5xl w-[90vw]" open={isDialogOpen}>
                        <DialogHeader>
                          <DialogTitle>为 {drone.name} {translations.t68}</DialogTitle>
                        </DialogHeader>

                        <div className="flex flex-col gap-4">
                          {/* 背包网格（每页 slice） */}
                          <div className="grid grid-cols-2 gap-4">
                            {backpackList
                              .slice(page * pageSize, (page + 1) * pageSize)
                              .map((bp: Part) => (
                                <button
                                  key={bp.id}
                                  type="button"
                                  className="w-full relative h-28 cursor-pointer hover:bg-muted rounded-lg flex items-center justify-center p-2"
                                  onClick={(e) => {
                                    e.stopPropagation(); // 防止 dialog 的父容器触发 onClick
                                    const updatedDrones = [...team.drones];
                                    updatedDrones[index] = { ...drone, backpack: bp };

                                    const totalScore =
                                      team.mechs.reduce(
                                        (sum, m) =>
                                          sum +
                                          Object.values(m.parts).reduce(
                                            (partSum, part) => partSum + (part?.score || 0),
                                            0
                                          ) +
                                          (m.pilot?.score || 0),
                                        0
                                      ) +
                                      updatedDrones.reduce(
                                        (sum, d) => sum + d.score + (d.backpack?.score || 0),
                                        0
                                      );

                                    onUpdateTeam(team.id, { drones: updatedDrones, totalScore });
                                    setIsDialogOpen(false);
                                  }}
                                >
                                  <img
                                    src={`${imgsrc}/${bp.id}.png`}
                                    alt={bp.name}
                                    className="max-w-full max-h-full object-contain shadow-lg shadow-gray-500 rounded-lg"
                                    draggable={false}
                                  />
                                  <Button
                                    variant="secondary"
                                    className="absolute bg-blue-500/50 left-0 bottom-0 shadow-lg shadow-gray-500 rounded-lg"
                                    style={{
                                      color: 'white',
                                      textShadow: '0 0 4px rgba(0,0,0,0.7)',
                                    }}
                                  >
                                    {bp?.score}
                                  </Button>
                                </button>
                              ))}
                          </div>

                          {/* 分页控制 */}
                          <div className="flex justify-center items-center gap-4">
                            <Button
                              variant="outline"
                              disabled={page === 0}
                              onClick={() => setDronePage(index, page - 1)}
                            >
                              上一页
                            </Button>
                            <span>
                              {page + 1} / {totalPages}
                            </span>
                            <Button
                              variant="outline"
                              disabled={page === totalPages - 1}
                              onClick={() => setDronePage(index, page + 1)}
                            >
                              下一页
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>)}

                  {/* 无人机分数角标 */}
                  <Button
                    variant="secondary"
                    className="h-6 w-8 absolute bg-blue-500/50 left-0 top-0 shadow-lg shadow-gray-500 rounded-lg z-0"
                    style={{
                      color: 'white',
                      textShadow: '0 0 4px rgba(0,0,0,0.7)',
                    }}
                  >
                    {drone?.score}
                  </Button>

                  <img
                    src={`${imgsrc}/${drone.id}.png`}
                    alt={drone.name}
                    className="shadow-lg shadow-gray-500 rounded-lg"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    draggable={false}
                  />

                  {/* 删除按钮 */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); deleteDrone(index); }}
                    className="absolute top-0 right-0 shadow-lg shadow-gray-500 rounded-lg text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>


                  {Array.isArray(drone.projectile) &&
                    drone!.projectile!.length > 0 && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute bottom-0 left-0 shadow-lg shadow-gray-500 rounded-lg"
                          >
                            <Rocket className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>

                        <DialogContent
                          style={{
                            border: 0,
                            boxShadow: "none",
                            background: "transparent",
                            padding: "24px",
                            maxHeight: "90vh", // 限制弹窗高度
                            overflowY: "auto", // 竖向滑动
                          }}
                        >
                          <DialogHeader>
                            <DialogTitle>
                              <VisuallyHidden>Projectile Images</VisuallyHidden>
                            </DialogTitle>
                            <DialogClose
                              className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
                              aria-label="Close"
                            >
                              ✕
                            </DialogClose>
                          </DialogHeader>

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "24px",
                              alignItems: "center",
                            }}
                          >
                            {drone.projectile!.map((proj, idx) => (
                              <img
                                key={idx}
                                src={`${imgsrc}/${proj}.png`}
                                alt={`Projectile ${proj}`}
                                style={{
                                  width: "90vw",       // 移动端自适应
                                  maxWidth: "500px",   // 桌面端最大宽度
                                  height: "auto",
                                  objectFit: "contain",
                                  borderRadius: "0.5rem",
                                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                }}
                              />
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                </div>
              );
            })}


            {/* 新增无人机按钮 */}
            <div
              style={{ position: 'relative', display: 'flex', padding: '1rem', cursor: 'pointer' }}
              onClick={() => onSetViewMode('drones')}
            >
              <img
                src={`${imgsrc}/080.png`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  opacity: 0, // 透明
                }}
                draggable={false}
              />

              {mobileOrTablet && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <Plus style={{ width: '24px', height: '24px', color: '#6b7280', marginBottom: '4px' }} />
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {translations.t75}
                  </span>
                </div>
              )}
            </div>

          </div>
          {!mobileOrTablet && team.drones.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              {translations.t31}
            </div>
          )}
        </TabsContent>

      </Tabs>
    </div>
  );
}
