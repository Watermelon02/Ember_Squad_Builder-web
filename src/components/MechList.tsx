import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Trash2, Copy, ZoomIn, Download, Rocket, Repeat, Table, Image, Table2, Globe } from 'lucide-react';
import { Team, Mech, Drone, Part, PART_TYPE_NAMES, } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { rdlBackpack, unBackpack } from '../data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

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
  const setDronePage = (index: number, newPage: number) => {
    setDronePages(prev => ({
      ...prev,
      [index]: newPage,
    }));
  };

  // ---------------- 导出功能开始 ----------------
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const img = document.createElement("img");
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.warn("图片加载失败:", src);
        // 创建一个空的占位图，避免 reject
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
        resolve(phImg);
      };
      img.src = src;
    });
  };

  // 发送 gtag 事件的异步函数
  const sendGtagEvent = async (eventName: string, eventCategory: string, eventLabel: string) => {
    return new Promise<void>((resolve) => {
      window.gtag('event', eventName, {
        event_category: eventCategory,
        event_label: eventLabel,
        value: 1,
      });
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

  const exportTeamImage = async (team: Team) => {
    sendGtagEvent("导出图片", "次数", "1");
    if (!team.mechs.length) {
      alert(`${translations.t14}`);
      return;
    }

    const targetHeight = 400;
    const padding = 30;
    const spacing = 20;
    const radius = 15;

    const mechImages: {
      mech: Mech;
      imgs: HTMLImageElement[];
      score: number;
      dodge: number;
      electronic: number;
    }[] = [];

    for (const mech of team.mechs) {
      const imgs: HTMLImageElement[] = [];
      const partOrder: (keyof typeof mech.parts)[] = [
        "torso",
        "chasis",
        "leftHand",
        "rightHand",
        "backpack",
      ];

      for (const partType of partOrder) {
        const part = mech.parts[partType];
        if (part) {
          const img = await loadImage(
            `${localImgsrc}/${part.id}.png`
          );
          imgs.push(img);
          // sendGtagEvent("选择部件", `select_${partType}_${team.faction}`, part.id);
        }
      }

      if (mech.pilot) {
        const pilotImg = await loadImage(
          `${localImgsrc}/${mech.pilot.id}.png`
        );
        imgs.push(pilotImg);
        // sendGtagEvent("选择驾驶员", `select_pilot_${team.faction}`, mech.pilot.id);
      }

      const score =
        Object.values(mech.parts).reduce(
          (sum, part) => sum + (part?.score || 0),
          0
        ) + (mech.pilot?.score || 0);

      const dodge =
        (mech.parts.torso?.dodge || 0) +
        (mech.parts.chasis?.dodge || 0) +
        (mech.parts.leftHand?.dodge || 0) +
        (mech.parts.rightHand?.dodge || 0) +
        (mech.parts.backpack?.dodge || 0);

      const electronic =
        (mech.parts.torso?.electronic || 0) +
        (mech.parts.chasis?.electronic || 0) +
        (mech.parts.leftHand?.electronic || 0) +
        (mech.parts.rightHand?.electronic || 0) +
        (mech.parts.backpack?.electronic || 0);

      mechImages.push({ mech, imgs, score, dodge, electronic });
    }

    // 计算画布宽度
    let maxRowWidth = 1741;
    for (const { imgs } of mechImages) {

      for (const img of imgs) {
        const scale = targetHeight / img.height;

      }

    }

    const canvas = document.createElement("canvas");
    const droneRows = Math.ceil(team.drones.length / 3);
    canvas.width = maxRowWidth + padding * 2;
    canvas.height =
      (mechImages.length + droneRows) * (targetHeight + spacing + 80) +
      padding * 3;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 背景
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 小队名 + 总分数
    ctx.fillStyle = "#222";
    ctx.font = "bold 42px sans-serif";
    ctx.fillText(`${team.name}`, padding, padding + 20);

    ctx.font = "28px sans-serif";
    ctx.fillText(`${translations.t15}: ${team.totalScore}`, padding, padding + 70);

    let y = padding + 100;

    // 绘制机甲
    for (const { mech, imgs, score, dodge, electronic } of mechImages) {
      let x = padding;
      const boxY = y;
      const boxHeight = 60 + targetHeight;
      const boxWidth = 4.35 * targetHeight;

      // 背景卡片
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      ctx.fillStyle = "#f9f9f9";
      ctx.beginPath();
      ctx.moveTo(padding + radius, boxY);
      ctx.arcTo(padding + boxWidth, boxY, padding + boxWidth, boxY + boxHeight, radius);
      ctx.arcTo(padding + boxWidth, boxY + boxHeight, padding, boxY + boxHeight, radius);
      ctx.arcTo(padding, boxY + boxHeight, padding, boxY, radius);
      ctx.arcTo(padding, boxY, padding + boxWidth, boxY, radius);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 标题文字
      ctx.fillStyle = "#111";
      ctx.font = "bold 26px sans-serif";
      ctx.fillText(mech.name, x + 20, y + 35);

      // 属性文字
      ctx.fillStyle = "#333";
      ctx.font = "18px sans-serif";
      ctx.fillText(`${translations.t16}: ${score}`, x + 220, y + 35);
      ctx.fillText(`${translations.t17}: ${dodge}`, x + 340, y + 35);
      ctx.fillText(`${translations.t18}: ${electronic}`, x + 460, y + 35);

      y += 45;

      // 部件图
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

    // 无人机
    let index = 0;
    for (const drone of team.drones) {
      const droneImg = await loadImage(
        `${localImgsrc}/${drone.id}.png`
      );

      // sendGtagEvent("选择无人机", `select_drone_${team.faction}`, drone.id);


      const droneScore = drone.score || 0;
      const droneWidth = droneImg.width * (targetHeight / droneImg.height);
      const droneY = y + 30;
      let droneX = 30 + (index % 3) * (droneWidth + spacing + 20);

      // 背景卡片
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = "#f5f5f5";
      ctx.beginPath();
      const droneBoxHeight = 30 + targetHeight;
      const droneBoxWidth = droneWidth + spacing / 2;
      ctx.moveTo(droneX + radius, droneY);
      ctx.arcTo(droneX + droneBoxWidth, droneY, droneX + droneBoxWidth, droneY + droneBoxHeight, radius);
      ctx.arcTo(droneX + droneBoxWidth, droneY + droneBoxHeight, droneX, droneY + droneBoxHeight, radius);
      ctx.arcTo(droneX, droneY + droneBoxHeight, droneX, droneY, radius);
      ctx.arcTo(droneX, droneY, droneX + droneBoxWidth, droneY, radius);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 无人机文字
      ctx.fillStyle = "#000";
      ctx.font = "16px sans-serif";
      ctx.fillText(`${translations.t16}: ${droneScore}`, droneX + 20, droneY + 25);



      // 图片
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur = 6;
      ctx.drawImage(droneImg, droneX + 10, droneY + 30, droneWidth, targetHeight);
      ctx.restore();

      // 绘制无人机背包图像
      let backpackImg: HTMLImageElement | null = null;
      if (drone.backpack) {
        ctx.save();

        // 设置阴影效果
        ctx.shadowColor = "rgba(0,0,0,0.4)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;

        backpackImg = await loadImage(`${localImgsrc}/${drone.backpack.id}.png`);
        const backpackScale = 0.4; // 缩小为一半
        const backpackWidth = backpackImg.width * backpackScale;
        const backpackHeight = backpackImg.height * backpackScale;

        // 绘制背包图像
        ctx.drawImage(backpackImg, droneX + 80, droneY + 20, backpackWidth, backpackHeight);

        ctx.restore();
      }



      if ((index + 1) % 3 === 0) {
        y += targetHeight + spacing + 60;
      }
      index++;
    }

    // 下载
    const link = document.createElement("a");
    link.download = `${team.name}.webp`;
    link.href = canvas.toDataURL("image/webp", 0.9);
    link.click();
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
              <Button variant="outline" size="sm" onClick={() => exportTeamImage(team)}>
                <Image className="w-4 h-4 mr-1" />
                {translations.t24}
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
              <Button variant="outline" size="sm" onClick={() => exportTeamImage(team)}>
                <Image className="w-4 h-4 mr-1" />
                {translations.t24}
              </Button>
            </div>
          </div>
        )}




        {/* 机体列表 */}
        <TabsContent value="mechs" className="flex-1 overflow-y-auto p-4 space-y-4">
          {team.mechs.map((mech) => (
            <Card
              key={mech.id}
              className={`p-4 shadow-sm ${selectedMechId === mech.id ? 'bg-accent' : ''}`}
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
                  <div className="flex justify-between gap-2 ">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">{translations.t32}</div>
                      <div>{getMechTotalScore(mech)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">{translations.t33}</div>
                      <div>{Math.max(
                        (mech.parts.torso?.dodge || 0) +
                        (mech.parts.chasis?.dodge || 0) +
                        (mech.parts.leftHand?.dodge || 0) +
                        (mech.parts.rightHand?.dodge || 0) +
                        (mech.parts.backpack?.dodge || 0),
                        0
                      )}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">{translations.t34}</div>
                      <div>{(mech.parts.torso?.electronic || 0) +
                        (mech.parts.chasis?.electronic || 0) +
                        (mech.parts.leftHand?.electronic || 0) +
                        (mech.parts.rightHand?.electronic || 0) +
                        (mech.parts.backpack?.electronic || 0)}</div>
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

                  {(Object.entries(partTypeNames) as [keyof typeof partTypeNames, string][]).map(([partType]) => (
                    <div
                      key={partType}
                      className={`relative p-0 overflow-hidden cursor-pointer transition shadow-lg shadow-gray-500 rounded-lg ${selectedMechId === mech.id ? 'border-primary' : ''
                        }`}

                    >    <Button
                      variant="secondary"
                      className="h-6 w-8 flex absolute bottom-0 left-0 m-1 text-xs shadow-lg shadow-gray-500 rounded-lg bg-blue-500/80"
                      style={{
                        color: 'white',
                        textShadow: '0 0 4px rgba(0,0,0,0.7)',
                      }}
                    >
                        {mech.parts[partType]?.score}
                      </Button>
                      {mech.parts[partType] ? (
                        <>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deletePart(mech.id, partType)} // 删除部件
                            className="absolute top-0 right-0 text-white shadow-lg shadow-gray-500 rounded-lg bg-blue-500/80"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>


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
                            <DialogContent>
                              <img
                                src={`${imgsrc}/${mech.parts[partType]!.id}.png`}
                                alt={mech.parts[partType]!.name}
                                className="w-full h-auto object-contain"
                              />
                            </DialogContent>
                          </Dialog>

                          <div className="absolute bottom-0 right-0 flex flex-col-reverse items-end gap-0.5">
                            {/* 底部的：抛弃 */}
                            {!!mech.parts[partType]?.throwIndex && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="secondary"
                                    className="h-6 w-8 flex  bottom-0 left-0 m-1 text-xs shadow-lg shadow-gray-500 rounded-lg bg-blue-500/80"
                                  >
                                    <Repeat className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>抛弃状态</DialogTitle>
                                  </DialogHeader>
                                  <img
                                    src={`${imgsrc}/${mech.parts[partType]?.throwIndex}.png`}
                                    alt={mech.parts[partType]!.name}
                                    className="w-full h-auto object-contain"
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
                                      className="h-6 w-8 flex  bottom-0 left-0 m-1 text-xs shadow-lg shadow-gray-500 rounded-lg bg-blue-500/80"
                                    >

                                      <Rocket className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>{translations.t25}</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid grid-cols-2 gap-2">
                                      {mech.parts[partType]!.projectile!.map((proj, idx) => (
                                        <img
                                          key={idx}
                                          src={`${imgsrc}/${proj}.png`}
                                          alt={`Projectile ${proj}`}
                                          className="w-full h-auto object-contain"
                                        />
                                      ))}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}
                          </div>



                          <img
                            src={`${imgsrc}/${mech.parts[partType]!.id}.png`}
                            alt={mech.parts[partType]!.name}
                            className="w-full h-auto object-contain"  // 保持比例
                            onClick={() => {
                              onSelectMech(mech.id);
                              onSelectPartType(partType);
                              onSetViewMode('parts');
                            }}
                          />

                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground bg-muted" onClick={() => {
                          onSelectMech(mech.id);
                          onSelectPartType(partType);
                          onSetViewMode('parts');
                        }}>
                          {translations.t26}
                        </div>
                      )}
                    </div>
                  ))}
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
                        <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{translations.t27}</span>
                      )}
                    </div>
                  )}

                </div>


                {/* 驾驶员卡片 pc端显示 */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  {/* 左侧驾驶员卡片 */}
                  {!mobileOrTablet && (
                    <div
                      onClick={() => {
                        onSelectMech(mech.id);
                        onSetViewMode('pilots');
                      }}
                      style={{
                        flex: '0 0 14rem', // 固定宽度
                        height: '6rem',    // 修改高度
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
                      }}
                    >
                      {mech.pilot ? (
                        <>
                          <img
                            src={`${tabsrc}/${mech.pilot.id}.png`}
                            alt={mech.pilot.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'center',
                              transform: 'translate(-20%, 0%)',
                            }}
                          />
                          {/* 分数按钮 */}
                          <Button
                            variant="secondary"
                            className="h-6 w-8 flex absolute top-0 right-0 m-1 text-xs shadow-lg shadow-gray-500 rounded-lg bg-blue-500/80"
                            style={{
                              color: 'white',
                              textShadow: '0 0 4px rgba(0,0,0,0.7)',
                            }}
                          >
                            {mech.pilot?.score}
                          </Button>
                          {/* 文字覆盖层 */}
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
                            }}
                          >
                            <span style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>{mech.pilot.name}</span>
                            <span style={{ fontSize: '0.6rem' }}>{mech.pilot.traitDescription}</span>
                          </div>
                        </>
                      ) : (
                        <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{translations.t27}</span>
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
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '0.25rem',
                      }}
                    >
                      {/* 机体名称和按钮一行 */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 600 }}>
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
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
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
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
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
        <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{attr.value}</div>
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
                  className="relative flex p-4"
                  onClick={() => onSetViewMode('drones')}
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
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{translations.t25}</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-2">
                            {drone!.projectile!.map((proj, idx) => (
                              <img
                                key={idx}
                                src={`${imgsrc}/${proj}.png`}
                                alt={`Projectile ${proj}`}
                                className="w-full h-auto object-contain"
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
