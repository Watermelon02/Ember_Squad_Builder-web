import React, { useState, useEffect, useRef } from 'react';
// 引入 react-beautiful-dnd 核心组件
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Button } from '../radix-ui/button';
import { Card } from '../radix-ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../radix-ui/dialog';
import { Plus, Copy, Download, Dice6, Sword, Upload, Trophy, Trash, Calculator } from 'lucide-react';
import { Team, FACTION_COLORS } from '../../data/types';
import { Badge } from '../radix-ui/badge';
import { Input } from '../radix-ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { TeamEligibility } from '../radix-ui/TeamEligibility';
import { MechImage } from '../custom/MechImage';
import { DroneImage } from '../custom/DroneImage';
import { COLOR_TEXT_GREY } from '../../styles/color';
import extractChunks from 'png-chunks-extract';
import { QQGroupButton } from '../custom/QQGroupButton';
import { TeamCard } from './TeamCard';

interface TeamListProps {
  teams: Team[];
  selectedTeamId: string;
  onSelectTeam: (teamId: string) => void;
  onAddTeam: (faction: 'RDL' | 'UN' | 'GOF' | 'PD', teamData?: Team) => void;
  onDeleteTeam: (teamId: string) => void;
  onUpdateTeam: (teamId: string, updates: Partial<Team>) => void;
  onCopyTeam: (newTeam: Team) => void;
  onReorderTeam: (startIndex: number, endIndex: number) => void;
  translations: any;
  factionNames: Record<string, string>;
  lang: string;
  tabsrc: string;
  championMode: boolean;
  onChampionModeChange: (isChampion: boolean) => void;
  competitionDialogOpen: boolean;
  onOpenCompetitionDialog: () => void;
  showCompetitionDialog: boolean;
}

const LIST_GAP = 16;

export function TeamList({
  teams,
  selectedTeamId,
  onSelectTeam,
  onAddTeam,
  onDeleteTeam,
  onUpdateTeam,
  onCopyTeam,
  onReorderTeam,
  translations,
  factionNames, lang, tabsrc, championMode,
  onChampionModeChange, competitionDialogOpen, onOpenCompetitionDialog, showCompetitionDialog
}: TeamListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string>('');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex !== destinationIndex) {
      onReorderTeam(sourceIndex, destinationIndex);
    }
  };

  const handleAddTeam = (faction: 'RDL' | 'UN' | 'GOF' | 'PD') => {
    onAddTeam(faction);
    setIsDialogOpen(false);
  };

  const cloneTeam = (teamId: string) => {
    const teamToClone = teams.find(team => team.id === teamId);
    if (teamToClone) {
      const clonedTeam: Team = {
        ...teamToClone,
        id: Date.now().toString(),
        name: `${teamToClone.name}`,
        mechs: [...teamToClone.mechs],
        drones: [...teamToClone.drones],
        totalScore: teamToClone.totalScore,
        mechCount: teamToClone.mechCount,
        largeDroneCount: teamToClone.largeDroneCount,
        mediumDroneCount: teamToClone.mediumDroneCount,
        smallDroneCount: teamToClone.smallDroneCount,
        faction: teamToClone.faction,
      };
      onCopyTeam(clonedTeam);
    }
  };

  const exportTeamAsJson = (teamId: string) => {
    const selectedTeam = teams.find((team) => team.id === teamId);
    if (selectedTeam) {
      const blob = new Blob([JSON.stringify(selectedTeam, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${selectedTeam.name}.json`;
      link.click();
    }
  };

  const itemSize = 40;
  const gap = 4;

  const [itemsPerRow, setItemsPerRow] = useState(1);
const measureRef = React.useCallback((node: HTMLDivElement | null) => {
  if (node !== null) {
    const update = () => {
      // 1. 获取容器的总宽度
      const containerWidth = node.offsetWidth;
      
      // 2. 减去 TeamCard 的左右 padding (1rem * 2 = 32px) 
      // 以及左右边框 (1px * 2 = 2px)
      const horizontalPadding = 34; 
      const availableWidth = containerWidth - horizontalPadding;

      // 3. 使用剩余的可用宽度计算
      const perRow = Math.floor((availableWidth + gap) / (itemSize + gap));
      
      console.log("可用宽度:", availableWidth, "每行实际可容纳:", perRow);
      setItemsPerRow(perRow || 1);
    };

    update();
    const resizeObserver = new ResizeObserver(() => update());
    resizeObserver.observe(node);
  }
}, [gap, itemSize]);


  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, backgroundColor: 'transparent', }}>

      {/* 顶部工具栏 (保持不变) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5vh",
          paddingLeft: "1vw",
          paddingRight: 10,
          paddingTop: 10,
          flexShrink: 0,
        }}
      >
        <h2 style={{ color: COLOR_TEXT_GREY, fontSize: "2vh", fontWeight: "600" }}>{translations.t3}</h2>

        {/* 比赛报名按钮 */}
        {showCompetitionDialog && lang === "zh" &&
          <motion.div
            onClick={onOpenCompetitionDialog}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 10px",
              borderRadius: "999px",
              background: "rgba(239, 159, 39, 0.15)", // 橙黄色调呼应比赛
              border: "1px solid rgba(239, 159, 39, 0.4)",
              cursor: "pointer",
              color: "#633806",
            }}
            whileHover={{ scale: 1.05, background: "rgba(239, 159, 39, 0.25)" }}
            whileTap={{ scale: 0.95 }}
          >
            <Trophy className="w-3 h-3" style={{ color: "#EF9F27" }} />
            <span style={{ fontSize: "12px", fontWeight: 600 }}>线上比赛</span>
          </motion.div>}



        <Card
          className="flex flex-row-reverse gap-0 "
          style={{
            border: "none",
          }}
        >
          {/** 动画图标组件 */}
          {[
            {
              icon: <Calculator className="w-4 h-4" />, onClick: () => {
                if (lang === "zh") { window.open("https://emberdice.site/index.html", "_blank") }
                else { window.open("https://watermelon02.github.io/ember-dice/", "_blank") }
              }
            },
            {
              icon: <Dice6 className="w-4 h-4" />, onClick: () => {
                if (lang === "zh") { window.open("https://ember-dice-simulator.site/", "_blank") }
                else { window.open("https://watermelon02.github.io/dice-simulator/", "_blank") }
              }
            },
            { icon: <Sword className="w-4 h-4" />, onClick: () => window.open("https://random0v0.github.io/AmadeusEmber/AmadeusEmber_web/", "_blank") },
          ].map((btn, idx) => (
            <motion.div
              key={idx}
              onClick={btn.onClick}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "0.375rem",
                border: "1px solid rgba(255,255,255,0.1)",
                backgroundColor: "rgba(255,255,255,0.2)",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.35)" }}
              whileTap={{ scale: 0.95, backgroundColor: "rgba(255,255,255,0.25)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {btn.icon}
            </motion.div>
          ))}
          <QQGroupButton lang={lang} />
        </Card>


      </div>

      {/* 小队操作按钮 (保持不变) */}
      <div
        style={{
          display: "flex",
          height: "6vh",
          justifyContent: "center",
          width: "100%",
          marginTop: 8,
          marginBottom: 8,
          paddingLeft: 12,
          paddingRight: 12,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            borderRadius: "8px",
            overflow: "hidden",
            gap: 0,
            backgroundColor: "rgba(255,255,255,0.3)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {[
            { key: "copy", icon: <Copy style={{ width: 16, height: 16 }} />, label: translations.t4, onClick: () => cloneTeam(selectedTeamId) },
            { key: "upload", icon: <Upload style={{ width: 16, height: 16 }} />, label: translations.t73, onClick: () => document.getElementById("team-upload")?.click() },
            { key: "download", icon: <Download style={{ width: 16, height: 16 }} />, label: translations.t74, onClick: () => exportTeamAsJson(selectedTeamId) },
            { key: "delete", icon: <Trash style={{ width: 16, height: 16 }} />, label: translations.t100, onClick: () => onDeleteTeam(selectedTeamId) },
          ].map((btn, index) => (
            <React.Fragment key={btn.key}>
              <button
                onClick={btn.onClick}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  backgroundColor: "rgba(255,255,255,0.3)",
                  color: COLOR_TEXT_GREY,
                  fontWeight: 600,
                  borderRadius: 0,
                  border: "none",
                  outline: "none",
                  cursor: "pointer",
                  transition: "transform 0.25s ease",
                  padding: "4px 0",
                  transform: hoverIndex === index ? "scale(1.05)" : "scale(1)",
                }}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                {btn.icon}
                <span style={{ fontSize: "0.75rem" }}>{btn.label}</span>
              </button>

              {/* 竖线 */}
              {index < 3 && (
                <div
                  style={{
                    width: "1px",
                    height: "60%",
                    alignSelf: "center",
                    backgroundColor: "rgba(50,50,50,0.2)",
                    transition: "background-color 0.25s ease",
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        <input
          type="file"
          accept="application/json,image/png"
          id="team-upload"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();

            if (file.type === "application/json") {
              reader.onload = (event) => {
                try {
                  const json = JSON.parse(event.target?.result as string);
                  if (json && json.id && json.faction) {
                    onAddTeam(json.faction, json);
                  }
                } catch {
                  alert(translations.t5 || "导入失败");
                }
              };
              reader.readAsText(file);
            } else if (file.type === "image/png") {
              reader.onload = async (event) => {
                try {
                  const buffer = new Uint8Array(event.target?.result as ArrayBuffer);
                  const chunks = extractChunks(buffer);
                  const textDecoder = new TextDecoder();
                  let found = false;
                  for (const chunk of chunks) {
                    if (chunk.name === "tEXt") {
                      const data = chunk.data;
                      const sepIndex = data.indexOf(0);
                      const keyword = textDecoder.decode(data.slice(0, sepIndex));
                      const text = textDecoder.decode(data.slice(sepIndex + 1));
                      if (keyword === "TeamData") {
                        const json = JSON.parse(text);
                        if (json && json.id && json.faction) {
                          onAddTeam(json.faction, json);
                        }
                        found = true;
                        break;
                      }
                    }
                  }
                  if (!found) alert(translations.t5 || "未找到队伍数据");
                } catch {
                  alert(translations.t5 || "导入失败");
                }
              };
              reader.readAsArrayBuffer(file);
            } else {
              alert("不支持的文件类型");
            }
          }}
        />
      </div>

      {/* 小队列表 - 使用 DragDropContext 包裹 */}
      {/* 小队列表 */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="teamList" direction="vertical">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={measureRef}
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: LIST_GAP,
                padding: '10px',
                minHeight: 0,
              }}
            >
              {teams.map((team, index) => (
                <Draggable key={team.id} draggableId={team.id} index={index}>
                  {(p, s) => (
                    <TeamCard
                      team={team}
                      index={index}
                      provided={p}
                      snapshot={s}
                      isSelected={selectedTeamId === team.id}
                      isEditing={editingTeamId === team.id}
                      onSelect={onSelectTeam}
                      onUpdateName={(id, name) => onUpdateTeam(id, { name })}
                      setEditingId={setEditingTeamId}
                      translations={translations}
                      factionNames={factionNames}
                      tabsrc={tabsrc}
                      itemsPerRow={itemsPerRow}
                      itemSize={itemSize}
                      gap={gap}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* 新增小队按钮 (保持不变) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button size="sm" className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800">
              <Plus className="w-4 h-4 mr-2" />
              <div style={{ fontSize: 12 }}>{translations.t12}</div>
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{translations.t13}</DialogTitle>
          </DialogHeader>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {(Object.entries(factionNames) as [keyof typeof factionNames, string][]).map(([key, name]) => (
              <Button
                key={key}
                onClick={() => handleAddTeam(key)}
                style={{
                  background: `linear-gradient(135deg, ${FACTION_COLORS[key]}, ${FACTION_COLORS[key]}cc)`,
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.5rem 1rem",
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.3s",
                }}
                onMouseEnter={e => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.transform = "translateY(-2px)";
                  btn.style.boxShadow = `
      0 6px 16px rgba(0,0,0,0.25),
      0 0 20px ${FACTION_COLORS[key]}88,
      0 0 40px ${FACTION_COLORS[key]}44
    `;
                }}
                onMouseLeave={e => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.transform = "translateY(0)";
                  btn.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                }}
              >
                {name}
              </Button>


            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div >
  );
}