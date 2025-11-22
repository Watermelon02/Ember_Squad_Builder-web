import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Trash2, Plus, Copy, Download, Dice6, Sword, Upload, Trophy, Trash } from 'lucide-react';
import { Team, FACTION_COLORS } from '../types';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { TeamEligibility } from './ui/TeamEligibility';
import { MechImage } from './custom/MechImage';
import { DroneImage } from './custom/DroneImage';
import { COLOR_GREY, COLOR_TEXT_GREY } from '../styles/color';
import extractChunks from 'png-chunks-extract';

interface TeamListProps {
  teams: Team[];
  selectedTeamId: string;
  onSelectTeam: (teamId: string) => void;
  onAddTeam: (faction: 'RDL' | 'UN' | 'GOF' | 'PD', teamData?: Team) => void;
  onDeleteTeam: (teamId: string) => void;
  onUpdateTeam: (teamId: string, updates: Partial<Team>) => void;
  onCopyTeam: (newTeam: Team) => void;
  translations: any;
  factionNames: Record<string, string>;
  lang: string;
  tabsrc: string;
  championMode: boolean;
  onChampionModeChange: (isChampion: boolean) => void;
}

export function TeamList({
  teams,
  selectedTeamId,
  onSelectTeam,
  onAddTeam,
  onDeleteTeam,
  onUpdateTeam,
  onCopyTeam,
  translations,
  factionNames, lang, tabsrc, championMode,
  onChampionModeChange
}: TeamListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string>('');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);


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
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0,backgroundColor: 'transparent',  }}>

      {/* 顶部工具栏 */}
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
        <h2 style={{ color: COLOR_TEXT_GREY,fontSize:"2vh",fontWeight:"600" }}>{translations.t3}</h2>

        {/* 按钮容器：从右往左排列 */}
        <Card
          className="flex flex-row-reverse gap-0 "
          style={{
            border: "none",
          }}
        >
          {/** 动画图标组件 */}
          {[
            { icon: <Trophy className="w-4 h-4" />, onClick: () => onChampionModeChange(!championMode) },
            { icon: <Dice6 className="w-4 h-4" />, onClick: () => window.open("https://watermelon02.github.io/ember-dice/", "_blank") },
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
        </Card>


      </div>

      {/* 小队操作按钮 */}
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
            backgroundColor: "rgba(255,255,255,0.3)", // 半透明背景
            backdropFilter: "blur(12px)",             // 背景模糊
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
                  backgroundColor: "rgba(255,255,255,0.3)", // 保持半透明背景不变
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

      {/* 小队列表 */}
      <div
        style={{
          flex: 1,               // 占满剩余空间
          overflowY: 'auto',     // 内部滚动
          WebkitOverflowScrolling: 'touch', // 平滑滚动（移动端）
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          padding: '10px',
          minHeight: 0,
        }}
      >
        {teams.map(team => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, y: -5, scale: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 1 }}
            transition={{ duration: 0.12 }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
              transition: { duration: 0.15, ease: "easeOut" }
            }}
            style={{
              flexShrink: 0,
              borderRadius: '16px',
              overflow: 'hidden',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              backgroundColor: 'rgba(255,255,255,0.3)',
              border: '1px solid rgba(255,255,255,0.15)',
              cursor: 'pointer',
              boxShadow: selectedTeamId === team.id
                ? `0 4px 12px rgba(0,0,0,0.2),
         0 0 12px ${FACTION_COLORS[team.faction]}88,
         0 0 24px ${FACTION_COLORS[team.faction]}44`
                : "0 2px 6px rgba(0,0,0,0.1)",
              transition: 'box-shadow 0.3s, transform 0.2s',
              padding: '0.5rem 1rem',
            }}
            onClick={() => onSelectTeam(team.id)}
          >
            <div className="space-y-2">
              {/* 标题行 */}
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
                          ? `0 4px 12px rgba(0,0,0,0.2),
                   0 0 12px ${FACTION_COLORS[team.faction]}88,
                   0 0 24px ${FACTION_COLORS[team.faction]}44`
                          : "0 2px 6px rgba(0,0,0,0.1)",
                      cursor: "default",
                      transition: "box-shadow 0.3s, transform 0.2s",
                      display: "inline-block",
                    }}
                    onMouseEnter={e => {
                      const badge = e.currentTarget as HTMLSpanElement;
                      badge.style.transform = "translateY(-1px)";
                      badge.style.boxShadow =
                        `0 4px 12px rgba(0,0,0,0.2),
               0 0 12px ${FACTION_COLORS[team.faction]}88,
               0 0 24px ${FACTION_COLORS[team.faction]}44`;
                    }}
                    onMouseLeave={e => {
                      const badge = e.currentTarget as HTMLSpanElement;
                      badge.style.transform = "translateY(0)";
                      badge.style.boxShadow =
                        selectedTeamId === team.id
                          ? `0 4px 12px rgba(0,0,0,0.2),
                   0 0 12px ${FACTION_COLORS[team.faction]}88,
                   0 0 24px ${FACTION_COLORS[team.faction]}44`
                          : "0 2px 6px rgba(0,0,0,0.1)";
                    }}
                  >
                    {factionNames[team.faction]}
                  </Badge>

                  {/* 可参赛状态显示 */}
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
                      {team.name}
                    </span>
                  )}
                </div>
              </div>

              {/* 数据行 */}
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
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        key={stat.value}
                        initial={{ scale: 0.9, y: 5, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: -5, opacity: 0 }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
                        style={{ color: stat.highlight ? '#dc2626' : 'gray' }}
                      >
                        {stat.value}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Mech + Drone 显示 */}
              <motion.div
                ref={containerRef}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: `${gap}px`,
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
              </motion.div>
            </div>
          </motion.div>

        ))}

        {/* 新增小队按钮 */}
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
      </div>
    </div>
  );
}
