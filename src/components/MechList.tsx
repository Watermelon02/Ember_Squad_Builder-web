import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Trash2, Copy, ZoomIn, Download } from 'lucide-react';
import { Team, Mech, Drone, PART_TYPE_NAMES } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface MechListProps {
  team?: Team;
  selectedMechId: string;
  onSelectMech: (mechId: string) => void;
  onSelectPartType: (partType: string) => void;
  onUpdateTeam: (teamId: string, updates: Partial<Team>) => void;
  onSetViewMode: (mode: 'parts' | 'drones' | 'pilots') => void;
}

export function MechList({
  team,
  selectedMechId,
  onSelectMech,
  onSelectPartType,
  onUpdateTeam,
  onSetViewMode,
}: MechListProps) {
  const [editingMechId, setEditingMechId] = useState<string>('');

  // ---------------- 导出功能开始 ----------------
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const exportTeamImage = async (team: Team) => {
    if (!team.mechs.length) {
      alert("当前小队没有机体，无法导出图片！");
      return;
    }

    const targetHeight = 400; // 部件图像的统一高度
    const padding = 30;
    const spacing = 20;

    // 机体部件卡片的宽度与高度
    const partCardWidth = 400;  // 根据图片尺寸调整
    const radius = 15; // 圆角的半径



    // 保存每个机甲的图片
    const mechImages: { mech: Mech; imgs: HTMLImageElement[]; score: number; dodge: number; electronic: number }[] = [];

    for (const mech of team.mechs) {
      const imgs: HTMLImageElement[] = [];

      // 按顺序加载部件图
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
            `${import.meta.env.BASE_URL}res/cn/${team.faction}/part/${part.id}.png`
          );
          imgs.push(img);
        }
      }

      // 驾驶员图
      if (mech.pilot) {
        const pilotImg = await loadImage(
          `${import.meta.env.BASE_URL}res/cn/${team.faction}/pilot/${mech.pilot.id}.png`
        );
        imgs.push(pilotImg);
      }

      // 计算分数，闪避，电子值
      const score = Object.values(mech.parts).reduce(
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

    // 计算画布宽度（最长的一行）
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
      (mechImages.length + droneRows)* (targetHeight + spacing + 60) + padding * 2; // 更多高度来放分数、闪避、电子值
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 背景白色
    ctx.fillStyle = "#f0f0f0";
    ctx.font = "36px sans-serif";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制机甲
    let y = padding;

    //绘制小队信息
    ctx.fillStyle = "#000";
    ctx.fillText(`${team.name}`, padding, y + padding);
    ctx.font = "30px sans-serif";
    ctx.fillText(`总分数: ${team.totalScore}`, 300, y + padding);  // 分数绘制在名字下方

    y += 50;

    for (const { mech, imgs, score, dodge, electronic } of mechImages) {
      let x = padding;

      const boxY = y;
      // 计算底部框的尺寸
      const boxHeight = 40 + targetHeight;

      const boxWidth = 4.3 * targetHeight; // 整行宽度

      // 绘制浅灰色圆角矩形框
      ctx.fillStyle = "#ffffff"; // 白色
      ctx.beginPath();
      ctx.moveTo(padding + radius, boxY); // 起点位置，左上角
      ctx.arcTo(padding + boxWidth, boxY, padding + boxWidth, boxY + boxHeight, radius); // 上右角圆弧
      ctx.arcTo(padding + boxWidth, boxY + boxHeight, padding, boxY + boxHeight, radius); // 下右角圆弧
      ctx.arcTo(padding, boxY + boxHeight, padding, boxY, radius); // 下左角圆弧
      ctx.arcTo(padding, boxY, padding + boxWidth, boxY, radius); // 上左角圆弧
      ctx.closePath();
      ctx.fill(); // 填充圆角矩形


      // 绘制机甲名字、分数、闪避、电子值（位于部件图像的上方）
      ctx.fillStyle = "#000";
      ctx.font = "24px sans-serif";
      ctx.fillText(mech.name, x + padding, y + padding);  // 机体名字绘制在部件上方
      ctx.font = "18px sans-serif";
      ctx.fillText(`分数: ${score}`, x + 200, y + padding);  // 分数绘制在名字下方
      ctx.fillText(`闪避: ${dodge}`, x + 300, y + padding);  // 闪避绘制在分数旁边
      ctx.fillText(`电子: ${electronic}`, x + 400, y + padding);  // 电子绘制在闪避旁边


      y += 30;  // 给名字和分数腾出空间
      // 绘制机甲的部件图片
      for (const img of imgs) {
        const scale = targetHeight / img.height;
        const drawWidth = img.width * scale;
        ctx.drawImage(img, x, y, drawWidth, targetHeight);
        x += drawWidth + spacing;
      }

      y += targetHeight + spacing + 30; // 留出空间放文本和图片
    }

    // 绘制无人机部分
    let index = 0;
    for (const drone of team.drones) {

      const droneImg = await loadImage(
        `${import.meta.env.BASE_URL}res/cn/${team.faction}/part/${drone.id}.png`
      );
      const droneScore = drone.score || 0;
      const droneWidth = droneImg.width * (targetHeight / droneImg.height);
      const droneY = y + 30; // 在机甲部分之后开始绘制
      let padding = 0;
      if (index % 3 === 0) {
        padding = 30;
      } else if (index % 3 === 1) { padding = 30 + droneWidth+spacing } else { padding = 30 + droneWidth * 2 + spacing*2 }
      // 绘制无人机的框和图片
      ctx.fillStyle = "#ffffff"; // 白色
      ctx.beginPath();
      const droneBoxHeight = 60+targetHeight; // 高度
      const droneBoxWidth = droneWidth+spacing/2 ; // 宽度
      ctx.moveTo(padding + radius, droneY);
      ctx.arcTo(padding + droneBoxWidth, droneY, padding + droneBoxWidth, droneY + droneBoxHeight, radius);
      ctx.arcTo(padding + droneBoxWidth, droneY + droneBoxHeight, padding, droneY + droneBoxHeight, radius);
      ctx.arcTo(padding, droneY + droneBoxHeight, padding, droneY, radius);
      ctx.arcTo(padding, droneY, padding + droneBoxWidth, droneY, radius);
      ctx.closePath();
      ctx.fill();
      // 绘制无人机分数
      ctx.fillStyle = "#000";
      ctx.font = "18px sans-serif";
      ctx.fillText(`分数: ${droneScore}`, padding + 10, droneY+20);
      // 绘制无人机图片
      ctx.drawImage(droneImg, padding + 10, droneY + 10, droneWidth, targetHeight);

      if ((index+1) % 3 === 0) {
        y += targetHeight + spacing + 60; // 留出空间放文本和图片

      }
      index++;
    }


    // 下载图片
    const link = document.createElement("a");
    link.download = `${team.name}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };



  const addMech = () => {
    if (!team) return;
    const newMech: Mech = { id: Date.now().toString(), name: '新机体', parts: {} };
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
    const copiedMech: Mech = { ...mech, id: Date.now().toString(), name: `${mech.name} (副本)` };
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
    return <div className="h-full flex items-center justify-center text-muted-foreground">请选择一个小队</div>;
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <Tabs defaultValue="mechs" className="flex-1 min-h-0 flex flex-col">
        {/* 顶部工具栏 */}
        <div className="p-4 border-b border-border flex justify-between items-center">
          <TabsList className="grid grid-cols-2 gap-2">
            <TabsTrigger value="mechs" onClick={() => onSetViewMode('parts')}>
              机体列表 ({team.mechs.length})
            </TabsTrigger>
            <TabsTrigger value="drones" onClick={() => onSetViewMode('drones')}>
              无人机列表 ({team.drones.length})
            </TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm" onClick={() => exportTeamImage(team)}>
            <Download className="w-4 h-4 mr-2" />
            导出小队图
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
                  <div className="grid grid-cols-5 gap-2">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">分数</div>
                      <div>{getMechTotalScore(mech)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">闪避</div>
                      <div>{mech.parts.torso?.dodge + mech.parts.chasis?.dodge + mech.parts.leftHand?.dodge + mech.parts.rightHand?.dodge + mech.parts.backpack?.dodge}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">电子</div>
                      <div>{mech.parts.torso?.electronic + mech.parts.chasis?.electronic + mech.parts.leftHand?.electronic + mech.parts.rightHand?.electronic + mech.parts.backpack?.electronic}</div>
                    </div>
                  </div>

                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyMech(mech)}
                      className="text "
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMech(mech.id)}
                      className="text-destructive "
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-3">
                  {(Object.entries(PART_TYPE_NAMES) as [keyof typeof PART_TYPE_NAMES, string][]).map(([partType]) => (
                    <div
                      key={partType}
                      className={`relative p-0 overflow-hidden cursor-pointer transition ${selectedMechId === mech.id ? 'border-primary' : ''
                        }`}
                      onClick={() => {
                        onSelectMech(mech.id);
                        onSelectPartType(partType);
                        onSetViewMode('parts');
                      }}
                    >
                      {mech.parts[partType] ? (
                        <>
                          {/* 左上角工具栏：分数 + 放大按钮 */}
                          <div className="absolute top-2 left-2 flex items-center gap-1">
                            <Badge
                              variant="secondary"
                              className="text-xs px-2 py-0.5"
                            >
                              {mech.parts[partType]?.score}
                            </Badge>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-2 py-0.5"
                                >
                                  <ZoomIn className="w-3 h-3 text-gray-700" />
                                </Badge>
                              </DialogTrigger>
                              <DialogContent>
                                <img
                                  src={`${import.meta.env.BASE_URL}res/cn/${team.faction}/part/${mech.parts[partType]!.id}.png`}
                                  alt={mech.parts[partType]!.name}
                                  className="w-full h-auto object-contain"
                                />
                              </DialogContent>
                            </Dialog>
                          </div>
                          <img
                            src={`${import.meta.env.BASE_URL}res/cn/${team.faction}/part/${mech.parts[partType]!.id}.png`}
                            alt={mech.parts[partType]!.name}
                            className="w-full h-auto object-contain"  // 保持比例

                          />

                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground bg-muted">
                          未装备
                        </div>
                      )}
                    </div>
                  ))}
                </div>


                {/* 驾驶员卡片 */}
                <Card
                  className={`p-4 h-60 cursor-pointer transition-colors  ${selectedMechId === mech.id ? 'border-primary' : ''
                    }`}
                  onClick={() => {
                    onSelectMech(mech.id);
                    onSetViewMode('pilots');
                  }}
                >
                  <div className="flex items-center justify-between">
                    {mech.pilot ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={`${import.meta.env.BASE_URL}res/cn/${team.faction}/pilot/${mech.pilot.id}.png`}
                          alt={mech.pilot.name}
                          className="h-10 w-12 object-contain"
                        />
                        <span className="text-sm">{mech.pilot.name}</span>
                        <p className="text-sm"> {mech.pilot.traitDescription}</p>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        未分配驾驶员
                      </span>
                    )}
                    <div className="text-xs text-muted-foreground">
                      点击选择
                    </div>
                  </div>
                </Card>
              </div>
            </Card>
          ))}
          <div className="flex justify-center">
            <Button onClick={addMech} size="sm" className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800">
              <Plus className="w-4 h-4 mr-2" />
              添加机体
            </Button>
          </div>

          {team.mechs.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              暂无机体，点击上方按钮添加
            </div>
          )}
        </TabsContent>

        {/* 无人机列表 */}
        <TabsContent
          value="drones"
          className="flex-1 overflow-y-auto p-4 space-y-0"
        >
          <div className="grid grid-cols-2 gap-4">
            {team.drones.map((drone, index) => (
              <Card
                key={`${drone.id}-${index}`}
                className="relative flex  p-4"
                onClick={() => onSetViewMode('drones')}
              >
                <img
                  src={`${import.meta.env.BASE_URL}res/cn/${team.faction}/part/${drone.id}.png`}
                  alt={drone.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  draggable={false}
                />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); deleteDrone(index); }}
                  className="absolute top-0 right-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

              </Card>


            ))}

            {team.drones.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                暂无无人机，在右侧选择区域添加
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
