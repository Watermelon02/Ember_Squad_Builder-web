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
import extractChunks from "png-chunks-extract";
import { MechImage } from '../custom/MechImage';
import { DroneImage } from '../custom/DroneImage';
import { TeamEligibility } from '../radix-ui/TeamEligibility';
import { QQGroupButton } from '../custom/QQGroupButton';

const COLOR_TEXT_GREY = 'gray';
const LIST_GAP = 16;

interface TeamListMobileProps {
  teams: Team[];
  selectedTeamId: string;
  onSelectTeam: (teamId: string) => void;
  onAddTeam: (faction: 'RDL' | 'UN' | 'GOF' | 'PD', teamData?: Team) => void;
  onDeleteTeam: (teamId: string) => void;
  onUpdateTeam: (teamId: string, updates: Partial<Team>) => void;
  onCopyTeam: (newTeam: Team) => void;
  // === 新增：用于拖拽排序的回调函数 ===
  onReorderTeam: (startIndex: number, endIndex: number) => void;
  translations: any;
  factionNames: Record<string, string>;
  lang: string;
  tabsrc: string;
  championMode: boolean;
  onChampionModeChange: (isChampion: boolean) => void;
}

export function TeamListMobile({
  teams,
  selectedTeamId,
  onSelectTeam,
  onAddTeam,
  onDeleteTeam,
  onUpdateTeam,
  onCopyTeam,
  onReorderTeam, // 接收新的属性
  translations,
  factionNames, lang, tabsrc, championMode,
  onChampionModeChange
}: TeamListMobileProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string>('');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // === 拖拽逻辑：处理拖拽结束事件 ===
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
  // ===================================

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

  const containerRef = useRef<HTMLDivElement>(null);
  const [itemsPerRow, setItemsPerRow] = useState(1);

  const itemSize = 40; // mech/drone 宽高
  const gap = 4;       // 0.3rem ≈ 4px

  useEffect(() => {
    const updateItemsPerRow = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const perRow = Math.floor((containerWidth + gap) / (itemSize + gap));
      setItemsPerRow(perRow || 1);
    };

    updateItemsPerRow();
    window.addEventListener("resize", updateItemsPerRow);
    return () => window.removeEventListener("resize", updateItemsPerRow);
  }, []);


  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        height: '100%',
        backgroundColor: 'transparent'
      }}
    >

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

        {/* 按钮容器 */}
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
            <div
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
            >
              {btn.icon}
            </div>
          ))}
          <QQGroupButton lang={lang} />

        </Card>
      </div>

      {/* 小队操作按钮 (保持不变) */}
      <div
        style={{
          display: "flex",
          height: "6%",
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
      <DragDropContext onDragEnd={handleDragEnd}>
        {/* === Droppable：设置为垂直方向，只允许 Y 轴移动 === */}
        <Droppable droppableId="teamList" direction="vertical">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef} // 绑定 Droppable 引用
              style={{
                flex: 1,
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
                display: 'flex',
                flexDirection: 'column',
                gap: LIST_GAP,
                padding: '10px 10px 30px 10px',
                minHeight: 0,
              }}
            >

              {teams.map((team, index) => (
                // === Draggable：设置 key 和 index ===
                <Draggable key={team.id} draggableId={team.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps} // 拖拽属性
                      {...provided.dragHandleProps} // 拖拽手柄：将整个卡片作为手柄

                      style={{
                        userSelect: 'none',
                        // rbd 提供的动态样式 (负责移动和浮动)
                        ...provided.draggableProps.style,

                        // 您的自定义静态样式
                        flexShrink: 0,
                        borderRadius: '16px',
                        overflow: 'hidden',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        cursor: 'grab',
                        boxShadow: selectedTeamId === team.id
                          ? `0 4px 12px rgba(0,0,0,0.2), 0 0 12px ${FACTION_COLORS[team.faction]}88, 0 0 24px ${FACTION_COLORS[team.faction]}44`
                          : (snapshot.isDragging ? "0 15px 30px rgba(0,0,0,0.3)" : "0 2px 6px rgba(0,0,0,0.1)"), // 拖拽时的浮动阴影

                        padding: '0.5rem 1rem',

                        // 确保拖拽时 item 浮在最上层
                        zIndex: snapshot.isDragging ? 99 : 'auto',
                      }}
                      onClick={() => onSelectTeam(team.id)}
                    >
                      <div className="space-y-2">
                        {/* 标题行 (保持不变) */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge
                              style={{
                                background: `linear-gradient(to right, ${FACTION_COLORS[team.faction]}, ${FACTION_COLORS[team.faction]}33)`,
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                padding: "0.25rem 0.5rem",
                                fontWeight: 600,
                                boxShadow:
                                  selectedTeamId === team.id
                                    ? `0 4px 12px rgba(0,0,0,0.2), 0 0 12px ${FACTION_COLORS[team.faction]}88, 0 0 24px ${FACTION_COLORS[team.faction]}44`
                                    : "0 2px 6px rgba(0,0,0,0.1)",
                                cursor: "default",
                                display: "inline-block",
                              }}
                              onMouseEnter={e => {
                                const badge = e.currentTarget as HTMLSpanElement;
                                badge.style.transform = "translateY(-1px)";
                                badge.style.boxShadow =
                                  `0 4px 12px rgba(0,0,0,0.2), 0 0 12px ${FACTION_COLORS[team.faction]}88, 0 0 24px ${FACTION_COLORS[team.faction]}44`;
                              }}
                              onMouseLeave={e => {
                                const badge = e.currentTarget as HTMLSpanElement;
                                badge.style.transform = "translateY(0)";
                                badge.style.boxShadow =
                                  selectedTeamId === team.id
                                    ? `0 4px 12px rgba(0,0,0,0.2), 0 0 12px ${FACTION_COLORS[team.faction]}88, 0 0 24px ${FACTION_COLORS[team.faction]}44`
                                    : "0 2px 6px rgba(0,0,0,0.1)";
                              }}
                            >
                              {factionNames[team.faction]}
                            </Badge>

                            <TeamEligibility team={team} translations={translations} />

                            {editingTeamId === team.id ? (
                              <Input
                                value={team.name}
                                onChange={(e) => onUpdateTeam(team.id, { name: e.target.value })}
                                onBlur={() => setEditingTeamId('')}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') setEditingTeamId('');
                                }}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                                style={{ color: 'gray' }}
                              />
                            ) : (
                              <span
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  setEditingTeamId(team.id);
                                }}
                                style={{ color: 'gray', fontWeight: 500 }}
                              >
                                {team.name || "1"}
                              </span>
                            )}

                          </div>
                        </div>

                        {/* 数据行 (保持不变) */}
                        <div className="grid grid-cols-5 gap-2 text-center">
                          {[
                            { label: translations.t7, value: team.totalScore, highlight: team.totalScore > 900 },
                            { label: translations.t8, value: team.mechCount },
                            { label: translations.t9, value: team.largeDroneCount },
                            { label: translations.t10, value: team.mediumDroneCount },
                            { label: translations.t11, value: team.smallDroneCount },
                          ].map((stat, idx) => (
                            <div key={idx}>
                              <div style={{ color: 'gray', fontSize: '0.875rem' }}>{stat.label}</div>
                              <div
                                key={stat.value}
                                style={{ color: stat.highlight ? '#dc2626' : 'gray' }}
                              >
                                {stat.value}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div
                          ref={containerRef}
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: `${gap}px`,
                          }}
                        >

                          {team.mechs.map((mech, index) => (
                            <div key={`mech-${mech.id ?? index}`}>
                              <MechImage mech={mech} tabsrc={tabsrc} translation={translations} />
                            </div>
                          ))}

                          {team.drones.map((drone, index) => (
                            <div key={`drone-${drone.id}-${index}`}>
                              <DroneImage drone={drone} tabsrc={tabsrc} />
                            </div>
                          ))}


                          {/* 占位条纹填满一行 */}
                          {(() => {
                            const totalItems = team.mechs.length + team.drones.length;
                            const remainder = totalItems % itemsPerRow;
                            const placeholders = remainder === 0 ? 0 : itemsPerRow - remainder;

                            return Array.from({ length: placeholders }).map((_, idx) => (
                              <div
                                key={`placeholder-${idx}`}
                                style={{
                                  width: `${itemSize}px`,
                                  height: `${itemSize}px`,
                                  borderRadius: '8px',
                                  backgroundImage: 'repeating-linear-gradient(45deg, #eee, #eee 4px, #ddd 4px, #ddd 8px)',
                                }}
                              />
                            ));
                          })()}
                        </div>

                      </div>
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* 新增小队按钮 (保持不变) */}
      <div
        style={{
          padding: '10px 10px 10px 10px',
          flexShrink: 0
        }}
      >
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
      </div>
    </div>
  );
}