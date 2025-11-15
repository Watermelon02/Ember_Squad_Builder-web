import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Trash2, Copy, ZoomIn, Rocket, Image, Table2, Loader2, Repeat, Settings, Globe, Gamepad2Icon } from 'lucide-react';
import { Team, Mech, Part, PART_TYPE_NAMES, calculateTotalScore, Drone } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from './ui/dialog';
import { rdlBackpack, rdlChasis, rdlLeftHand, rdlRightHand, rdlTorso, unBackpack, unChasis, unLeftHand, unRightHand, unTorso } from '../data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { motion, AnimatePresence } from 'framer-motion';
import { DroneImage } from './custom/DroneImage';
import { MechImage } from './custom/MechImage';
import { MechPreview } from './custom/MechPreview';
import { exportTeamImage } from '../util/TeamImage';
import { getImage } from '../util/ImageGetter';
import { MechStatus } from './custom/MechStatus';
import { AnimatedButton } from './custom/AnimatedButton';
import { COLOR_GLOBAL, COLOR_GREY, COLOR_WHITE } from '../styles/color';
import { MechStatusMobile } from './custom/MechStatusMobile';
import * as htmlToImage from "html-to-image";
import PilotStats from './custom/PilotStats';

interface MechListProps {
  team?: Team;
  selectedMechId: string;
  onSelectMech: (mechId: string) => void;
  onSelectPartType: (partType: string) => void;
  onUpdateTeam: (teamId: string, updates: Partial<Team>) => void;
  onSetViewMode: (mode: 'parts' | 'drones' | 'pilots' | 'tacticCards') => void;
  onSetIsChangingPart: (changingPart: boolean) => void,
  onSelectDrone: (droneId: Drone) => void;
  translations: any;
  partTypeNames: any;
  imgsrc: string, tabsrc: string,
  localImgsrc: string, lang: string, mobileOrTablet: boolean, setLanguage: React.Dispatch<React.SetStateAction<"zh" | "en" | "jp">>,
  championMode: boolean,
  mechImgSrc: string,
}

export function MechList({
  team,
  selectedMechId,
  onSelectMech,
  onSelectPartType,
  onUpdateTeam,
  onSetViewMode,
  onSelectDrone,
  translations,
  partTypeNames,
  imgsrc, tabsrc,
  localImgsrc, lang, mobileOrTablet, setLanguage, championMode,
  mechImgSrc, onSetIsChangingPart,
}: MechListProps) {
  const [editingMechId, setEditingMechId] = useState<string>('');
  // 用一个对象记录每个无人机的页码
  const [dronePages, setDronePages] = React.useState<{ [index: number]: number }>({});
  const [tacticCardPages, settacticCardPages] = React.useState<{ [index: number]: number }>({});
  const pageSize = 4; // 每页展示几个背包
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingTTS, setIsExportingTTS] = useState(false);
  const [showProjectileOption, setShowProjectileOption] = useState(false);
  const [showTTSHint, setShowTTSHint] = useState(false);
  const [cPartType, setCPartType] = useState("");
  const [currentTab, setCurrentTab] = useState("mechs");
  const orderedPartTypes: (keyof typeof partTypeNames)[] = mobileOrTablet
    ? ["rightHand", "torso", "leftHand", "backpack", "chasis"]
    : (Object.keys(partTypeNames) as (keyof typeof partTypeNames)[]);
  //直接用html样式导出图片
  const exportRef = useRef<HTMLDivElement>(null);

  const exportWebAsImage = async () => {
    const node = exportRef.current;
    if (!node) return;

    // 1. 记录原始样式
    const originalOverflow = node.style.overflow;
    const originalHeight = node.style.height;
    const originalBackground = node.style.background;

    // 2. 展开内容，防止只导出可见部分
    node.style.overflow = "visible";
    node.style.height = "auto";

    // 3. 添加纯灰色背景（导出专用）
    node.style.background = "#e5e7eb"; // ← 纯灰色

    // 等布局刷新
    await new Promise((r) => setTimeout(r, 50));

    // 4. 截图
    const dataUrl = await htmlToImage.toPng(node, {
      pixelRatio: 2,
      cacheBust: true,
    });

    // 5. 恢复原样
    node.style.overflow = originalOverflow;
    node.style.height = originalHeight;
    node.style.background = originalBackground;

    // 6. 下载图片
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "export.png";
    link.click();
  };

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
        if (team.tacticCards && team.tacticCards.length > 0) {
          if (droneIndex == team.drones.length - 1) {
            clipboardContent += `┃┗ ${drone.name}\n`;
          } else {
            clipboardContent += `┃┣ ${drone.name}\n`;
          }
        } else {
          if (droneIndex == team.drones.length - 1) {
            clipboardContent += `　┗ ${drone.name}\n`;
          } else {
            clipboardContent += `　┣ ${drone.name}\n`;
          }
        }

        if (drone.backpack) {
          clipboardContent += `    ┃  ┗ ${drone.backpack.name}\n`;
        }
        droneIndex++;
      });
    }

    let tacticCardIndex = 0;
    if (team.tacticCards && team.tacticCards.length > 0) {
      clipboardContent += `┗┳ [${translations.t90}：${team.tacticCards.reduce((sum, tacticCard) => sum + tacticCard.score + (tacticCard.backpack?.score || 0), 0)}${translations.t71}]\n`;
      team.tacticCards.forEach((tacticCard) => {
        if (tacticCardIndex == team.tacticCards.length - 1) {
          clipboardContent += `　┗ ${tacticCard.name}\n`;
        } else {
          clipboardContent += `　┣ ${tacticCard.name}\n`;
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


  // 初始化时从 localStorage 读取
  const [includeProjectile, setIncludeProjectile] = useState<boolean>(() => {
    const saved = localStorage.getItem("includeProjectile");
    return saved ? JSON.parse(saved) : false; // 默认值 false
  });

  // 当状态变化时写入 localStorage
  useEffect(() => {
    localStorage.setItem("includeProjectile", JSON.stringify(includeProjectile));
  }, [includeProjectile]);

  async function generateAndUploadMechImage(team: Team, mech: Mech, lang: string): Promise<string> {
    sendGtagEvent("导出图片", "次数", "1");


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
    } else {
      gradient.addColorStop(0, `rgba(108,128,192,1)`);
      gradient.addColorStop(1, `rgba(255,255,255,1)`);
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
  async function uploadTTSToCOS(jsonData: string, fileName: string): Promise<string> {
    const blob = new Blob([jsonData], { type: 'application/txt' });
    const uploadUrl = `https://op-1307392056.cos.ap-guangzhou.myqcloud.com/ttsURL/${fileName}`;

    await fetch(uploadUrl, {
      method: 'PUT',
      body: blob,
    });

    return uploadUrl; // 返回可访问的 URL
  }

  async function exportTeamToTTS(team: Team, lang: string) {
    const mechImageUrls: Record<string, string> = {};

    // 生成每台机体图片
    await Promise.all(
      team.mechs.map(async mech => {
        const url = await generateAndUploadMechImage(team, mech, lang);
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

  const [open, setOpen] = useState(false);
  const [script, setScript] = useState("");

  async function exportTTS(team: Team, lang: string) {
    const result = await exportTeamToTTS(team, lang);
    setScript(result);
    setOpen(true);
  }







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
    const totalScore = calculateTotalScore(team.drones, team.tacticCards, updatedMechs);

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
    const totalScore = calculateTotalScore(team.drones, team.tacticCards, updatedMechs);

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
    const totalScore = calculateTotalScore(team.drones, team.tacticCards, updatedMechs);

    onUpdateTeam(team.id, { mechs: updatedMechs, mechCount: updatedMechs.length, totalScore });
  };

  const deleteDrone = (droneIndex: number) => {
    if (!team) return;
    const updatedDrones = team.drones.filter((_, index) => index !== droneIndex);

    onUpdateTeam(team.id, {
      drones: updatedDrones,
      totalScore: calculateTotalScore(updatedDrones, team.tacticCards, team.mechs),
      largeDroneCount: updatedDrones.filter((d) => d.type === 'large').length,
      mediumDroneCount: updatedDrones.filter((d) => d.type === 'medium').length,
      smallDroneCount: updatedDrones.filter((d) => d.type === 'small').length,
    });
  };

  const deleteTacticCard = (id: number) => {
    if (!team) return;
    const updatedtacticCard = team.tacticCards?.filter((_, index) => index !== id);
    onUpdateTeam(team.id, {
      totalScore: calculateTotalScore(team.drones, updatedtacticCard, team.mechs),
      tacticCards: updatedtacticCard
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

  //数字颜色映射
  // 颜色表（1~10）
  const dodgeColors = [
    "#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6",
    "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a", "#172554"
  ];

  const electronicColors = [
    "#fef9c3", "#fef08a", "#fde047", "#facc15", "#eab308",
    "#ca8a04", "#a16207", "#854d0e", "#713f12", "#422006"
  ];

  // 根据 value 生成颜色（1~10）
  const getColorByAttr = (type, value) => {
    const v = Math.min(Math.max(value, 1), 10); // 限制范围 1~10

    if (type === "dodge") {
      return dodgeColors[v - 1];
    }
    if (type === "electronic") {
      return electronicColors[v - 1];
    }

    return "#111"; // 默认
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },      // 初始状态：透明并下移
    visible: { opacity: 1, y: 0 },     // 出现状态：完全显示
    exit: { opacity: 0, y: -20 },      // 消失状态：透明并上移
  };


  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <Tabs defaultValue="mechs" className="flex-1 min-h-0 flex flex-col" onValueChange={(v) => {
        setCurrentTab(v);

        // 同步右侧侧边栏
        switch (v) {
          case 'mechs':
            setCPartType('');
            onSetViewMode('parts');
            break;
          case 'drones':
            onSetViewMode('drones');
            break;
          case 'tacticCards':
            onSetViewMode('tacticCards');
            break;
        }
      }}>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent >
            <DialogHeader>
              <DialogTitle>{translations.t97}</DialogTitle>
            </DialogHeader>

            <pre className="bg-muted p-4 rounded text-sm overflow-auto">
              {script}
            </pre>
            <motion.div

              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: `2px`,
              }}
            >
              <AnimatePresence mode="popLayout">
                {team.mechs.map((mech, index) => (
                  <motion.div
                    key={`mech-${mech.id ?? index}`}
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MechImage mech={mech} tabsrc={tabsrc} translation={translations} />
                  </motion.div>
                ))}

                {team.drones.map((drone, index) => (
                  <motion.div
                    key={`drone-${drone.id}-${index}`}
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DroneImage drone={drone} tabsrc={tabsrc} />
                  </motion.div>
                ))}
              </AnimatePresence>


            </motion.div>
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(script)}>
              {translations.t4}
            </Button>
          </DialogContent>
        </Dialog>

        {/* 顶部工具栏 */}
        {mobileOrTablet ? (
          /* 移动端：三行布局 */
          <div className="p-2 border-b border-border flex flex-col gap-2">
            {/* 第 1 行：Tabs */}
            <TabsList
              className="relative flex"
              style={{
                backgroundColor: COLOR_WHITE,
                borderRadius: "4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                backdropFilter: "blur(6px)",
                height: "4vh",
                width: "100%",
                padding: "0",
              }}
            >
              {[
                { key: "mechs", label: `${translations.t22} (${team.mechs.length})`, onClick: () => { setCPartType(""); onSetViewMode("parts"); } },
                { key: "drones", label: `${translations.t23} (${team.drones.length})`, onClick: () => onSetViewMode("drones") },
                { key: "tacticCards", label: `${translations.t87} (${team.tacticCards?.length})`, onClick: () => onSetViewMode("tacticCards") },
              ].map((tab, index, arr) => (
                <React.Fragment key={tab.key}>

                  {/* Tab 按钮 */}
                  <TabsTrigger
                    value={tab.key}
                    onClick={() => setCurrentTab(tab.key)}
                    style={{
                      position: "relative",
                      color: currentTab === tab.key ? COLOR_WHITE : COLOR_GREY,
                      fontWeight: 500,
                      padding: "8px 18px",
                      borderRadius: "4px",
                      transition: "color 0.25s ease",
                      zIndex: 1,
                    }}
                  >
                    {tab.label}

                    {/* ▼ 背景动画：只负责背景，不覆盖文字 */}
                    {currentTab === tab.key && (
                      <motion.div
                        layoutId="tabBG"
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: COLOR_GREY,
                          borderRadius: "4px",
                          zIndex: -1,
                        }}
                      />
                    )}
                  </TabsTrigger>

                  {/* ▼ 分隔竖线（当两边任意一个被选中 → 隐藏） */}
                  {index < arr.length - 1 && (
                    <div
                      style={{
                        width: "1.5px",
                        height: "60%",
                        backgroundColor:
                          currentTab === tab.key || currentTab === arr[index + 1].key
                            ? "transparent"
                            : "rgba(0,0,0,0.25)",
                        alignSelf: "center",
                        transition: "background-color 0.25s ease",
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </TabsList>

            {/* 第 2 行：语言切换 + 按钮 */}
            <div className="flex gap-2">
              {/* 语言选择 */}
              <div className="flex-1">
                <Select value={lang} onValueChange={(v) => setLanguage(v as "zh" | "en" | "jp")}>
                  <SelectTrigger className="h-8 text-sm w-full">
                    <Globe className="w-4 h-4 text-gray-600" />
                    <SelectValue placeholder="选择语言" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zh">CN</SelectItem>
                    <SelectItem value="en">EN</SelectItem>
                    <SelectItem value="jp">JP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 导出文本按钮 */}
              <div className="flex-1">
                <Button
                  className="w-full"
                  variant="outline"
                  size="sm"
                  onClick={() => team && exportTextTeamData(team)}
                >
                  <Table2 className="w-4 h-4 mr-1" />
                  {translations.t6}
                </Button>
              </div>

              {/* 导出图片按钮 */}
              <div className="flex-1 relative">
                <Button
                  className="w-full"
                  variant="outline"
                  size="sm"
                  disabled={isExporting}
                  onClick={async () => {
                    setIsExporting(true);
                    try {
                      await exportTeamImage(team, lang, translations, tabsrc, localImgsrc, imgsrc, includeProjectile);
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
                  <div className="flex items-center gap-2 justify-center">
                    <AnimatePresence>
                      {isExporting && (
                        <motion.div
                          key="loader"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1, rotate: [0, 360] }}
                          exit={{ opacity: 0 }}
                          transition={{
                            rotate: { repeat: Infinity, duration: 1, ease: "linear" },
                            opacity: { duration: 0.2 },
                          }}
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


              {/* 小齿轮按钮 + 悬浮层 */}
              <div className="relative flex-1">
                <Button
                  className="w-full"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowProjectileOption((v) => !v)}
                  disabled={isExporting}
                >
                  <div className="flex items-center gap-1">
                    <Settings className="w-4 h-4" />
                    <span>{translations.t99}</span>
                  </div>
                </Button>

                {/* 悬浮选项浮层 */}
                <AnimatePresence>
                  {showProjectileOption && (
                    <motion.div
                      key="checkbox-popup"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-lg px-3 py-1.5 flex items-center gap-2 text-sm z-10 max-w-[200px] sm:max-w-[250px] break-words"
                      style={{
                        backgroundColor: 'white',
                      }}
                    >
                      <input
                        type="checkbox"
                        id="include-projectile"
                        checked={includeProjectile}
                        onChange={(e) => setIncludeProjectile(e.target.checked)}
                        className="h-4 w-4"
                      />
                      <label
                        htmlFor="include-projectile"
                        className="cursor-pointer select-none whitespace-normal"
                        style={{
                          color: 'black',
                          WebkitTextStroke: '0.5px white', // 黑字白边
                        }}
                      >
                        {translations.t91}
                      </label>
                    </motion.div>

                  )}
                </AnimatePresence>

              </div>

            </div>



            {/* 第 3 行：统计信息 */}
            <div className="grid grid-cols-5 gap-2" >
              {/* 动画数字单元格 */}
              {[
                { label: translations.t7, value: team.totalScore, highlight: team.totalScore > 900 },
                { label: translations.t8, value: team.mechCount },
                { label: translations.t9, value: team.largeDroneCount },
                { label: translations.t10, value: team.mediumDroneCount },
                { label: translations.t11, value: team.smallDroneCount },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-muted-foreground" style={{
                    fontSize: 12
                  }}>{stat.label}</div>
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={stat.value} // 数字变化时触发动画
                      initial={{ scale: 0.9, y: 5, opacity: 0 }}
                      animate={{ scale: 1, y: 0, opacity: 1 }}
                      exit={{ scale: 0.9, y: -5, opacity: 0 }}
                      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
                      style={{
                        color: stat.highlight ? '#dc2626' : '#111', // 高亮逻辑
                        fontSize: 12
                      }}
                    >
                      {stat.value}
                    </motion.div>
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* 桌面端：原来的两边布局 */
          <div className="p-4 border-b border-border flex items-center justify-between relative">
            {/* 左侧按钮组 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5vw",
                flexShrink: 0, // 防止收缩
              }}
            >
              {/* 导出文本 */}
              <AnimatedButton
                onClick={() => team && exportTextTeamData(team)}
                fontSize={"0.8vw"}
              >
                <Table2 style={{ width: "1vw", height: "1vw" }} />
                {translations.t6}
              </AnimatedButton>

              {/* 导出图片 + 悬浮 checkbox */}
              <div
                style={{ position: "relative" }}
                onMouseEnter={() => setShowProjectileOption(true)}
                onMouseLeave={() => setShowProjectileOption(false)}
              >
                <AnimatedButton
                  fontSize={"0.8vw"}
                  onClick={async () => {
                    setIsExporting(true);
                    try {
                      await exportTeamImage(team, lang, translations, tabsrc, localImgsrc, imgsrc, includeProjectile);
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
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <AnimatePresence>
                      {isExporting && (
                        <motion.div
                          key="loader"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1, rotate: [0, 360] }}
                          exit={{ opacity: 0 }}
                          transition={{
                            rotate: { repeat: Infinity, duration: 1, ease: "linear" },
                            opacity: { duration: 0.2 },
                          }}
                        >
                          <Loader2 style={{ width: "1vw", height: "1vw" }} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {isExporting ? (
                      <span>{translations.t79}</span>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Image style={{ width: "1vw", height: "1vw" }} />
                        <span>{translations.t24}</span>
                      </div>
                    )}
                  </div>
                </AnimatedButton>

                {/* 悬浮 checkbox */}
                <AnimatePresence>
                  {showProjectileOption && (
                    <motion.div
                      key="checkbox-popup"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: "absolute",
                        top: "100%",
                        right: 0,
                        background: "white",
                        borderRadius: 8,
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        padding: "6px 12px",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "1vw",
                        marginTop: -6,
                      }}
                    >
                      <input
                        type="checkbox"
                        id="include-projectile"
                        checked={includeProjectile}
                        onChange={(e) => setIncludeProjectile(e.target.checked)}
                        style={{
                          width: 16,
                          height: 16,
                          accentColor: "#3b82f6",
                          marginRight: 6,
                          cursor: "pointer",
                        }}
                      />
                      <label
                        htmlFor="include-projectile"
                        style={{
                          cursor: "pointer",
                          userSelect: "none",
                          color: "#374151",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {translations.t91}
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 导出 TTS */}
              <div
                style={{ position: "relative" }}
                onMouseEnter={() => setShowTTSHint(true)}
                onMouseLeave={() => setShowTTSHint(false)}
              >
                <AnimatedButton
                  fontSize={"0.7vw"}
                  onClick={async () => {
                    setIsExportingTTS(true);
                    try {
                      await exportTTS(team, lang);
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
                      setIsExportingTTS(false);
                    }
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <AnimatePresence>
                      {isExportingTTS && (
                        <motion.div
                          key="loader"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1, rotate: [0, 360] }}
                          exit={{ opacity: 0 }}
                          transition={{
                            rotate: { repeat: Infinity, duration: 1, ease: "linear" },
                            opacity: { duration: 0.2 },
                          }}
                        >
                          <Loader2 style={{ width: 16, height: 16 }} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {isExportingTTS ? (
                      <span>{translations.t79}</span>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Gamepad2Icon style={{ width: 16, height: 16 }} />
                        <span>{translations.t95}</span>
                      </div>
                    )}
                  </div>
                </AnimatedButton>

                {/* 悬浮提示 */}
                <AnimatePresence>
                  {showTTSHint && (
                    <motion.div
                      key="checkbox-popup-tts"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: "absolute",
                        top: "100%",
                        right: 0,
                        background: "white",
                        borderRadius: 8,
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        padding: "6px 12px",
                        fontSize: "1vw",
                        marginTop: -6,
                      }}
                    >
                      <label
                        htmlFor="include-projectile"
                        style={{
                          cursor: "pointer",
                          userSelect: "none",
                          color: "#374151",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {translations.t96}
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* 中间 Tabs */}
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <TabsList
                className="relative flex"
                style={{
                  backgroundColor: COLOR_WHITE,
                  borderRadius: "4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
                  backdropFilter: "blur(6px)",
                  height: "4vh",
                  padding: 0,
                  gap: "2px",
                }}
              >
                {[
                  { key: "mechs", label: `${translations.t22} (${team.mechs.length})`, onClick: () => { setCPartType(""); onSetViewMode("parts"); } },
                  { key: "drones", label: `${translations.t23} (${team.drones.length})`, onClick: () => onSetViewMode("drones") },
                  { key: "tacticCards", label: `${translations.t87} (${team.tacticCards?.length})`, onClick: () => onSetViewMode("tacticCards") },
                ].map((tab, index, arr) => (
                  <React.Fragment key={tab.key}>
                    <TabsTrigger
                      value={tab.key}
                      onClick={() => setCurrentTab(tab.key)}
                      style={{
                        position: "relative",
                        color: currentTab === tab.key ? COLOR_WHITE : COLOR_GREY,
                        fontWeight: 500,
                        padding: "8px 18px",
                        borderRadius: "4px",
                        transition: "color 0.25s ease",
                        zIndex: 1,
                      }}
                    >
                      {tab.label}
                      {currentTab === tab.key && (
                        <motion.div
                          layoutId="tabBG"
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: COLOR_GREY,
                            borderRadius: "4px",
                            zIndex: -1,
                          }}
                        />
                      )}
                    </TabsTrigger>
                    {index < arr.length - 1 && (
                      <div
                        style={{
                          width: "1.5px",
                          height: "60%",
                          backgroundColor:
                            currentTab === tab.key || currentTab === arr[index + 1].key
                              ? "transparent"
                              : "rgba(0,0,0,0.25)",
                          alignSelf: "center",
                          transition: "background-color 0.25s ease",
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </TabsList>
            </div>

            {/* 右侧语言切换 */}
            <div className="flex items-center flex-shrink-0" style={{ width: "10vw", gap: "0.5vw", color: COLOR_GREY }}>
              <Globe style={{ width: "2vw", color: COLOR_GLOBAL }} />
              <Select value={lang} onValueChange={(v) => setLanguage(v as "zh" | "en" | "jp")}>
                <SelectTrigger style={{ width: "8vw" }}>
                  <SelectValue placeholder="选择语言" />
                </SelectTrigger>
                <SelectContent style={{ color: COLOR_GREY }}>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="jp">日本語</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>



        )}

        {/* 机体列表 */}
        <TabsContent ref={exportRef} value="mechs" className="flex-1 overflow-y-auto p-4 space-y-4 ">
          {team.mechs.map((mech) => (
            <motion.div
              key={mech.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Card
                key={mech.id}
                style={{
                  paddingLeft: mobileOrTablet ? '2vw' : '1vw',
                  paddingRight: mobileOrTablet ? '2vw' : '1vw',
                  paddingTop: mobileOrTablet ? '1vh' : '1vh',
                  paddingBottom: mobileOrTablet ? '0vh' : '1vh'
                }}
                className={`rounded-lg transition-transform transition-shadow duration-500 ease-in-out ${selectedMechId === mech.id
                  ? 'scale-105 shadow-xl  '  // 选中效果
                  : 'scale-100 shadow-md hover:scale-103 hover:shadow-lg'
                  }`}
              >
                <div >
                  <div
                    style={{
                      display: 'grid',
                      width: '100%',
                      gap: '12px', // gap-3 相当于 0.75rem ≈ 12px
                      gridTemplateColumns: mobileOrTablet ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)',
                    }}
                  >

                    {orderedPartTypes.map((partType) => (
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={mech.parts[partType]?.id || partType}
                          initial={{ opacity: 0, y: -10, scale: ((cPartType === partType && selectedMechId === mech.id) && selectedMechId === mech.id) ? 1.12 : 1 }}
                          animate={{ opacity: 1, y: 0, scale: (cPartType === partType && selectedMechId === mech.id) ? 1.08 : 1 }}
                          exit={{ opacity: 0, y: 10, scale: (cPartType === partType && selectedMechId === mech.id) ? 1.08 : 1 }}
                          transition={{ duration: 0.1 }}

                          onMouseEnter={(e) => {
                            if (cPartType !== partType) {
                              e.currentTarget.style.transform = "scale(1.05)";
                              e.currentTarget.style.boxShadow = "0 6px 10px rgba(0,0,0,0.1)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (cPartType !== partType) {
                              e.currentTarget.style.transform = "scale(1)";
                              e.currentTarget.style.boxShadow =
                                "0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)";
                            }
                          }}

                          className={`relative p-0 overflow-hidden cursor-pointer transition shadow-lg shadow-gray-500 rounded-lg ${selectedMechId === mech.id ? "border-primary" : ""
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
                                className="absolute top-0 right-0 text-white shadow-lg shadow-gray-500 rounded-lg hover:text-destructive"
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

                              {/* 底部的抛射物卡 */}
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
                                  setCPartType(partType);
                                  onSelectMech(mech.id);
                                  onSelectPartType(partType);
                                  onSetViewMode('parts');
                                  onSetIsChangingPart(true);
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
                                setCPartType(partType);
                                onSelectMech(mech.id);
                                onSelectPartType(partType);
                                onSetViewMode("parts");
                                onSetIsChangingPart(true);
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
                                  flexDirection: "column", // 垂直排列
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: window.innerWidth > 768 ? "1.4vw" : "0.9rem", // 响应式字体
                                  color: "rgba(100, 100, 100, 0.4)",
                                  backgroundColor: "rgba(240, 240, 240, 0.4)",
                                  borderRadius: "0.5rem",
                                  gap: "0.2rem", // 图标和文字之间间距
                                }}
                              >
                                {/* icon_part 图片（居中 + 缩小） */}
                                <img
                                  src={`${tabsrc}/icon_part_${partType}.png`}
                                  style={{
                                    transform: "translate(-5%, -5%)", // 居中
                                    width: "20%", // 缩小尺寸（可改 40%～70%）
                                    height: "auto",
                                    objectFit: "contain",
                                    opacity: 0.8,
                                    pointerEvents: "none",
                                    userSelect: "none",
                                  }}
                                />
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
                          onSetIsChangingPart(true);
                        }}
                      >

                        {mech.pilot ? (<Button
                          variant="secondary"
                          className="h-6 w-8 flex absolute bottom-0 left-0 m-1 text-xs shadow-lg shadow-gray-500 rounded-lg pa"
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
                                position: 'absolute', // ✅ 让图片覆盖整个卡片
                                inset: 0,
                                width: '130%',
                                height: '130%',
                                objectFit: 'cover', // ✅ 填满卡片
                                objectPosition: 'center',
                                transform: 'translateY(-15%) ',
                                borderRadius: '0.5rem',
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
                              <span
                                style={{
                                  fontWeight: 'bold',
                                  fontSize: lang === 'en'
                                    ? '4vw' // 📱 移动端英文
                                    : '4vw',   // 📱 移动端中文
                                  textShadow: '0 0 10px rgba(0,0,0,1)',
                                }}
                              >
                                {mech.pilot.name}
                              </span>

                              <span
                                style={{
                                  fontSize:
                                    lang === 'en'
                                      ? '2.5vw' // 📱 移动端英文说明小一些
                                      : '3vw',   // 📱 移动端中文说明稍大
                                  color: 'white',
                                  textShadow: `
      -1px -1px 1px #000,
       1px -1px 1px #000,
      -1px  1px 1px #000,
       1px  1px 1px #000
    `,
                                }}
                              >
                                {mech.pilot.traitDescription}
                              </span>


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
                  {/* 机体信息 */}
                  {mobileOrTablet && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        gap: '3vw',               // 元素之间的间距
                        width: '100%',
                        marginTop: '1.5vh'
                      }}
                    >
                      <MechStatusMobile
                        mech={mech}
                        translations={translations}
                        tabsrc={tabsrc}
                        lang={lang}
                        editingMechId={editingMechId}
                        setEditingMechId={setEditingMechId}
                        updateMechName={updateMechName}
                        copyMech={copyMech}
                        deleteMech={deleteMech}
                        getMechTotalScore={getMechTotalScore}
                        getColorByAttr={getColorByAttr}
                        style={{ flex: '2' }}
                        isMobile={mobileOrTablet} />
                      <MechPreview
                        mech={mech}
                        mechImgSrc={mechImgSrc}
                        width="16vh"
                        height="16vh"
                        scaleOverrides={{ chasis: 1, backpack: 2 }}
                        cropLeftPercent={13}
                        defaultParts={{
                          leftHand: rdlLeftHand[0],
                          torso: rdlTorso[0],
                          rightHand: rdlRightHand[0],
                          chasis: rdlChasis[0],
                          backpack: rdlBackpack[0],
                        }}
                        championMode={championMode}
                        style={{ flex: '1' }}
                      />
                    </div>
                  )}


                  {/* 驾驶员卡片 pc端显示 */}
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1vh', marginTop: "2vh" }} >

                    {/* 左侧驾驶员卡片 */}
                    {!mobileOrTablet && (
                      <div
                        onClick={() => {
                          onSelectMech(mech.id);
                          onSetViewMode('pilots');
                          onSetIsChangingPart(true);
                        }}
                        style={{
                          flex: '0 0 20vw',
                          height: '20vh',
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          borderRadius: '0.5rem',
                          overflow: 'hidden',
                          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)'
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget;
                          el.style.transform = 'scale(1.03)';
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget;
                          el.style.transform = 'scale(1)';

                        }}
                      >


                        <AnimatePresence mode="wait">
                          {/* 背景动画层，始终在最底层 */}
                          {(selectedMechId === mech.id && mech.pilot !== undefined) && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              style={{
                                position: 'absolute',
                                inset: 0,
                                pointerEvents: 'none',
                                borderRadius: '0.5rem',
                                background: `conic-gradient(
      from 0deg,
      ${getFactionColor(team.faction, 0.5)},
      ${getFactionColor(team.faction, 0.2)},
      ${getFactionColor(team.faction, 0.5)}
    )`,
                                zIndex: 0,
                                transformOrigin: 'center',
                              }}

                            />

                          )}
                        </AnimatePresence>

                        {/* 图片 + AnimatePresence，zIndex 默认比背景高 */}
                        <AnimatePresence mode="wait">
                          {mech.pilot ? (
                            <motion.div
                              key={mech.pilot.id}
                              initial={{ opacity: 0, x: 20, scale: 0.97 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{ opacity: 0, x: 20, scale: 0.97 }}
                              transition={{ duration: 0.3 }}
                              style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}
                            >
                              <img
                                src={`${tabsrc}/${mech.pilot.id}.png`}
                                alt={mech.pilot.name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  objectPosition: 'center',
                                  transform: 'translate(10%, 0%)', // ✅ 这里百分比就生效
                                }}
                              />
                            </motion.div>


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
                            className="h-6 w-8 flex absolute top-0 right-0 m-1 text-xs shadow-lg "
                            style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(8px)',
                              WebkitBackdropFilter: 'blur(8px)',
                              boxShadow: '0 0 12px rgba(0,0,0,0.2)',color: 'white', textShadow: '0 0 4px rgba(0,0,0,0.7)', zIndex: 2
                            }}
                          >
                            {mech.pilot?.score}
                          </Button>
                        )}

                        {mech.pilot && (
                          <PilotStats pilot={mech.pilot} tabsrc={tabsrc} style={{ position: 'absolute', left: '0.2rem', top: '0.2rem', zIndex: 2 }} />
                        )}


                        {/* 文字覆盖层 */}
                        {mech.pilot && (
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '0.5rem',
                              left: '6vw',
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
                            <span style={{
                              fontWeight: 'bold', fontSize: lang === 'en'
                                ? '1vw' // 💻 英文
                                : '1vw', // 💻 中文
                              textShadow: '0 0 6px rgba(0,0,0,1)',
                            }}>{mech.pilot.name}</span>
                            <span
                              style={{
                                fontSize: lang === 'en' ? '0.7vw' : '0.7vw',
                                color: 'white',
                                textShadow: `
  -1px -1px 1px #000,
   1px -1px 1px #000,
  -1px  1px 1px #000,
   1px  1px 1px #000
`,

                              }}
                            >
                              {mech.pilot.traitDescription}
                            </span>

                          </div>
                        )}
                      </div>
                    )}




                    {!mobileOrTablet && team.faction === 'RDL' && !mech.parts.torso?.isPD && (

                      <MechPreview
                        mech={mech}
                        mechImgSrc={mechImgSrc}
                        width="20vh"
                        height="20vh"
                        scaleOverrides={{ chasis: 1, backpack: 2 }}
                        cropLeftPercent={13}
                        defaultParts={{
                          leftHand: rdlLeftHand[0],
                          torso: rdlTorso[0],
                          rightHand: rdlRightHand[0],
                          chasis: rdlChasis[0],
                          backpack: rdlBackpack[0],
                        }}
                        championMode={championMode}
                      />

                    )}

                    {!mobileOrTablet && (team.faction === 'UN' || mech.parts.torso?.isPD) && (
                      <MechPreview
                        mech={mech}
                        mechImgSrc={mechImgSrc}
                        width="20vh"
                        height="20vh"
                        scaleOverrides={{
                          chasis: 1,
                          backpack: 1,
                          leftHand: 1,
                          rightHand: 1,
                          torso: 1,
                        }}
                        defaultParts={{
                          leftHand: unLeftHand[0],
                          torso: unTorso[0], rightHand: unRightHand[3], chasis: unChasis[0], backpack: unBackpack[0],
                        }}
                        championMode={championMode}
                      />
                    )}



                    {/* 右侧信息卡片 */}
                    {!mobileOrTablet && (
                      <MechStatus
                        mech={mech}
                        translations={translations}
                        tabsrc={tabsrc}
                        lang={lang}
                        editingMechId={editingMechId}
                        setEditingMechId={setEditingMechId}
                        updateMechName={updateMechName}
                        copyMech={copyMech}
                        deleteMech={deleteMech}
                        getMechTotalScore={getMechTotalScore}
                        getColorByAttr={getColorByAttr}
                        style={{ flex: '1' }}
                        isMobile={mobileOrTablet}

                      />
                    )}
                  </div>



                </div>
              </Card>
            </motion.div>
          ))}

          <div className="flex justify-center">
            <Button
              onClick={addMech}
              size="sm"
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800"
            >
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: mobileOrTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
              gap: "16px", // 相当于 gap-4
            }}
          >
            {team.drones.map((drone, index) => {

              return (
                <motion.div
                  key={`${drone.id}-${index}`}
                  initial={{ y: -20, opacity: 0 }} // 初始向上偏移 20px，透明
                  animate={{ y: 0, opacity: 1 }}   // 目标位置
                  transition={{
                    duration: 0.1,                // 动画时长
                    delay: index * 0.1,           // 可以让多个卡片依次出现
                    ease: "easeOut",
                  }}
                  className={`relative p-0 overflow-hidden cursor-pointer transition shadow-lg shadow-gray-500 rounded-lg 
                        }`}
                  style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                  onClick={() => { onSetViewMode('drones'); onSetIsChangingPart(true); onSelectDrone(drone) }}
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
                          className="absolute bottom-0 left-0 flex items-center justify-center 
      bg-blue-500/50 shadow-md rounded-lg cursor-pointer z-10 hover:bg-blue-500/70"
                          style={{
                            width: '6vw',      // 改为 6vw
                            height: 'auto',    // 保持比例
                            aspectRatio: '1',  // 如果希望保持正方形按钮结构，可去掉
                          }}
                        >
                          {drone.backpack ? (
                            <img
                              src={`${imgsrc}/${drone.backpack.id}.png`}
                              alt={drone.backpack.name}
                              style={{
                                width: '100%',
                                height: 'auto',      // 保持比例
                                objectFit: 'contain'
                              }}
                              draggable={false}
                            />
                          ) : (
                            <span
                              className="text-xs text-muted-foreground bottom-0"
                              style={{
                                color: 'white',
                                textShadow: '0 0 4px rgba(0,0,0,0.7)',
                              }}
                            >
                              {translations.t68}
                            </span>
                          )}
                        </div>
                      </DialogTrigger>


                      <DialogContent className="max-w-5xl w-[90vw]" open={isDialogOpen}>
                        <DialogHeader>
                          <DialogTitle>{translations.t103} {drone.name} {translations.t68}</DialogTitle>
                        </DialogHeader>

                        <div
                          style={{
                            maxHeight: '60vh',       // 控制最大高度，超出可滚动
                            overflowY: 'auto',       // 竖向滚动
                            paddingRight: '8px',     // 防止滚动条挡住内容
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)', // 每行两列
                            gap: '12px',             // 列间距、行间距
                          }}
                        >
                          {unBackpack
                            .map((bp: Part) => (
                              <button
                                key={bp.id}
                                type="button"
                                className="relative h-28 cursor-pointer hover:bg-muted rounded-lg flex items-center justify-center p-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const updatedDrones = [...team.drones];
                                  updatedDrones[index] = { ...drone, backpack: bp };

                                  const totalScore = calculateTotalScore(updatedDrones, team.tacticCards, team.mechs);

                                  onUpdateTeam(team.id, { drones: updatedDrones, totalScore });
                                  setIsDialogOpen(false);
                                }}
                                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                              >
                                <img
                                  src={`${imgsrc}/${bp.id}.png`}
                                  alt={bp.name}
                                  style={{
                                    width: '20vw',       // 每个图片宽度
                                    height: 'auto',     // 保持比例
                                    objectFit: 'contain',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                                  }}
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

                          {/* 放大预览 Dialog */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"

                                className="absolute top-0 bottom-0 text-white shadow-lg shadow-gray-500 rounded-lg bg-blue-500/80"
                              >
                                <ZoomIn
                                  className="w-3 h-3 text-white"
                                  style={{
                                    filter: `
      drop-shadow(0 0 1px gray)
      drop-shadow(0 0 1px gray)
      drop-shadow(0 0 1px gray)
    `,
                                  }}
                                />

                              </Button>
                            </DialogTrigger>
                            <DialogContent className="border-0 shadow-none bg-transparent p-0">
                              <img
                                key={drone.id}
                                src={`${imgsrc}/${drone.id}.png`}
                                alt={drone.name}
                                className="w-full h-auto object-contain rounded-lg"

                              />
                            </DialogContent>
                          </Dialog>

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
                </motion.div>
              );
            })}


            {/* 新增无人机按钮 */}
            <div
              style={{ position: 'relative', display: 'flex', padding: '1rem', cursor: 'pointer' }}
              onClick={() => {
                onSetIsChangingPart(true);
                onSetViewMode('drones')
              }}
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

            </div>

          </div>
          {!mobileOrTablet && team.drones.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              {translations.t31}
            </div>
          )}
        </TabsContent>

        {/* 战术卡列表 */}
        <AnimatePresence mode="wait">
          <TabsContent
            value="tacticCards"
            className="flex-1 overflow-y-auto p-4 space-y-0"
          >
            <motion.div
              style={{
                display: "grid",
                gridTemplateColumns: mobileOrTablet
                  ? "repeat(2, 1fr)" // 手机或平板：3列
                  : "repeat(3, 1fr)", // 桌面端：5列
                gap: "1rem", // 等价于 gap-4
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="flex-1 overflow-y-auto p-4 space-y-0"
            >
              {team.tacticCards?.map((tacticCards, index) => {
                const backpackList = Object.values(unBackpack);

                return (
                  <div
                    key={`${tacticCards.id}-${index}`}
                    className={`relative p-0 overflow-hidden cursor-pointer transition shadow-lg shadow-gray-500 rounded-lg 
                        }`}
                    style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
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
                    {/* 放大预览 Dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"

                          className="absolute top-0 bottom-0 text-white shadow-lg shadow-gray-500 rounded-lg bg-blue-500/80"
                        >
                          <ZoomIn
                            className="w-3 h-3 text-white"
                            style={{
                              filter: `
      drop-shadow(0 0 1px gray)
      drop-shadow(0 0 1px gray)
      drop-shadow(0 0 1px gray)
    `,
                            }}
                          />

                        </Button>
                      </DialogTrigger>
                      <DialogContent className="border-0 shadow-none bg-transparent p-0">
                        <img
                          key={tacticCards.id}
                          src={`${imgsrc}/${tacticCards.id}.png`}
                          alt={tacticCards.name}
                          className="w-full h-auto object-contain rounded-lg"

                        />
                      </DialogContent>
                    </Dialog>

                    {/* 战术卡分数角标 */}
                    <Button
                      variant="secondary"
                      className="h-6 w-8 absolute bg-blue-500/50 left-0 bottom-0 shadow-lg shadow-gray-500 rounded-lg z-0"
                      style={{
                        color: 'white',
                        textShadow: '0 0 4px rgba(0,0,0,0.7)',
                      }}
                    >
                      {tacticCards?.score}
                    </Button>

                    <img
                      src={`${imgsrc}/${tacticCards.id}.png`}
                      alt={tacticCards.name}
                      onClick={() => onSetViewMode('tacticCards')}
                      className="shadow-lg shadow-gray-500 rounded-lg"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      draggable={false}
                    />

                    {/* 删除按钮 */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); deleteTacticCard(index); }}
                      className="absolute top-0 right-0 shadow-lg shadow-gray-500 rounded-lg text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                  </div>
                );
              })}


              {/* 新增战术卡按钮 */}
              <div
                style={{ position: 'relative', display: 'flex', padding: '1rem', cursor: 'pointer' }}
                onClick={() => { onSetViewMode('tacticCards'); onSetIsChangingPart(true); }}
              >
                <img
                  src={`${imgsrc}/274.png`}
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

                  <img
                    src={`${tabsrc}/tactic.png`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      opacity: 1, // 透明
                    }}
                    draggable={false}
                  />
                </div>

              </div>

            </motion.div>
            {!mobileOrTablet && team.tacticCards?.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                {translations.t89}
              </div>
            )}
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
