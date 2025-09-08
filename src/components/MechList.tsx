import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Trash2, Copy, ZoomIn, Download, Rocket, Repeat } from 'lucide-react';
import { Team, Mech, Drone, } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface MechListProps {
  team?: Team;
  selectedMechId: string;
  onSelectMech: (mechId: string) => void;
  onSelectPartType: (partType: string) => void;
  onUpdateTeam: (teamId: string, updates: Partial<Team>) => void;
  onSetViewMode: (mode: 'parts' | 'drones' | 'pilots') => void;
  translations:any;
  partTypeNames:any;
  imgsrc:string,
  localImgsrc:string
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
  imgsrc,
  localImgsrc
}: MechListProps) {
  const [editingMechId, setEditingMechId] = useState<string>('');

  // ---------------- 导出功能开始 ----------------
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const img = new Image();
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

const exportTeamImage = async (team: Team) => {
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
          `${localImgsrc}/${team.faction}/part/${part.id}.png`
        );
        imgs.push(img);
      }
    }

    if (mech.pilot) {
      const pilotImg = await loadImage(
        `${localImgsrc}/${team.faction}/pilot/${mech.pilot.id}.png`
      );
      imgs.push(pilotImg);
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
  let maxRowWidth = 0;
  for (const { imgs } of mechImages) {
    let rowWidth = 0;
    for (const img of imgs) {
      const scale = targetHeight / img.height;
      rowWidth += img.width * scale + spacing;
    }
    if (rowWidth > maxRowWidth) maxRowWidth = rowWidth;
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
      `${localImgsrc}/${team.faction}/part/${drone.id}.png`
    );
    const droneScore = drone.score || 0;
    const droneWidth = droneImg.width * (targetHeight / droneImg.height);
    const droneY = y + 30;
    let droneX = 30 + (index % 3) * (droneWidth + spacing+20);

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

    if ((index + 1) % 3 === 0) {
      y += targetHeight + spacing + 60;
    }
    index++;
  }

  // 下载
  const link = document.createElement("a");
  link.download = `${team.name}.png`;
  link.href = canvas.toDataURL("image/png");
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
    const newMech: Mech = { id: Date.now().toString(), name:  `${translations.t19}`, parts: {} };
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
    const copiedMech: Mech = { ...mech, id: Date.now().toString(), name: `${mech.name} {translations.t20}` };
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
        <div className="p-4 border-b border-border flex justify-between items-center">
          <TabsList className="grid grid-cols-2 gap-2">
            <TabsTrigger value="mechs" onClick={() => onSetViewMode('parts')}>
              {translations.t22} ({team.mechs.length})
            </TabsTrigger>
            <TabsTrigger value="drones" onClick={() => onSetViewMode('drones')}>
              {translations.t23} ({team.drones.length})
            </TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm" onClick={() => exportTeamImage(team)}>
            <Download className="w-4 h-4 mr-2" />
            {translations.t24}
          </Button>
        </div>

        {/* 机体列表 */}
        <TabsContent value="mechs" className="flex-1 overflow-y-auto p-4 space-y-4">
          {team.mechs.map((mech) => (
            <Card
              key={mech.id}
              className={`p-4 ${selectedMechId === mech.id ? 'bg-accent' : ''}`}
            >
              <div className="space-y-4">
                {/* 机体标题行 */}
                <div className="flex items-center justify-between">
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
                </div>

                <div className="grid grid-cols-5 gap-3">
                  {(Object.entries(partTypeNames) as [keyof typeof partTypeNames, string][]).map(([partType]) => (
                    <div
                      key={partType}
                      className={`relative p-0 overflow-hidden cursor-pointer transition shadow-lg shadow-gray-500 rounded-lg ${selectedMechId === mech.id ? 'border-primary' : ''
                        }`}
                      onClick={() => {
                        onSelectMech(mech.id);
                        onSelectPartType(partType);
                        onSetViewMode('parts');
                      }}
                    >    <Button
                      variant="secondary"
                      className="h-6 w-8 flex absolute bottom-0 left-0 m-1 text-xs shadow-lg shadow-gray-500 rounded-lg bg-blue-500/80"
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
                                src={`${imgsrc}/${team.faction}/part/${mech.parts[partType]!.id}.png`}
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
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 py-0 leading-none "
                                  >
                                    <Repeat className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>抛弃状态</DialogTitle>
                                  </DialogHeader>
                                  <img
                                    src={`${imgsrc}/${team.faction}/part/${mech.parts[partType]?.throwIndex}.png`}
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
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 px-2 py-0 leading-none "
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
                                          src={`${imgsrc}/${team.faction}/part/${proj}.png`}
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
                            src={`${imgsrc}/${team.faction}/part/${mech.parts[partType]!.id}.png`}
                            alt={mech.parts[partType]!.name}
                            className="w-full h-auto object-contain"  // 保持比例

                          />

                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground bg-muted">
                          {translations.t26}
                        </div>
                      )}
                    </div>
                  ))}
                </div>


                {/* 驾驶员卡片 */}
                <Card
                  className={`p-4 h-60 relative cursor-pointer transition-colors  shadow-lg shadow-gray-500  ${selectedMechId === mech.id ? 'border-primary' : ''
                    }`}
                  onClick={() => {
                    onSelectMech(mech.id);
                    onSetViewMode('pilots');
                  }}
                >
                  {mech.pilot ? (<Badge
                    variant="secondary"
                    className="h-4 w-6 absolute left-0 bottom-0 "
                  >
                    {mech.pilot?.score}
                  </Badge>) : (<></>)}
                  <div className="flex items-center justify-between">

                    {mech.pilot ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={`${imgsrc}/${team.faction}/pilot/${mech.pilot.id}.png`}
                          alt={mech.pilot.name}
                          className="h-10 w-12 object-contain"
                        />
                        <span className="text-sm">{mech.pilot.name}</span>
                        <p className="text-sm"> {mech.pilot.traitDescription}</p>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {translations.t27}
                      </span>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {translations.t28}
                    </div>
                  </div>
                </Card>
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
          <div className="grid grid-cols-2 gap-4 ">
            {team.drones.map((drone, index) => (
              <div
                key={`${drone.id}-${index}`}
                className="relative flex  p-4  "
                onClick={() => onSetViewMode('drones')}
              >
                <Button
                  variant="secondary"
                  className="h-6 w-8 absolute bg-blue-500/50 left-0 top-0  shadow-lg shadow-gray-500 rounded-lg "
                >
                  {drone?.score}
                </Button>

                <img
                  src={`${imgsrc}/${team.faction}/part/${drone.id}.png`}
                  alt={drone.name}
                  className="shadow-lg shadow-gray-500 rounded-lg "
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  draggable={false}
                />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); deleteDrone(index); }}
                  className="absolute top-0 right-0  shadow-lg shadow-gray-500 rounded-lg  text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

              </div>


            ))}

            {team.drones.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                {translations.t31}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
