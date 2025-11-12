import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Trash2, Plus, Copy, Download, Dice6, Sword, Upload, Trophy } from 'lucide-react';
import { Team, FACTION_COLORS } from '../types';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import extractChunks from "png-chunks-extract";
import { motion } from 'framer-motion';
import { MechImage } from './ui/MechImage';
import { DroneImage } from './ui/DroneImage';

interface TeamListMobileProps {
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

export function TeamListMobile({
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
    <div style={{ display: 'flex', flexDirection: 'column' }} >

      {/* 顶部工具栏 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6}}>
        <h2 style={{ color: '#333' }}>{translations.t3}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChampionModeChange(!championMode)}
          >
            <Trophy className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open("https://watermelon02.github.io/ember-dice/", "_blank")}
          >
            <Dice6 className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open("https://random0v0.github.io/AmadeusEmber/AmadeusEmber_web/", "_blank")}
          >
            <Sword className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex w-full gap-2" >
        <Button
          className="flex-1"
          variant="outline"
          size="sm"
          onClick={() => cloneTeam(selectedTeamId)}
        >
          <Copy className="w-4 h-4 " /> {translations.t4}
        </Button>

        <Button
          className="flex-1"
          variant="outline"
          size="sm"
          onClick={() => document.getElementById("team-upload")?.click()}
        >
          <Upload className="w-4 h-4" /> {translations.t73}
        </Button>

        <Button
          className="flex-1"
          variant="outline"
          size="sm"
          onClick={() => exportTeamAsJson(selectedTeamId)}
        >
          <Download className="w-4 h-4" /> {translations.t74}
        </Button>

        <input
          type="file"
          accept="application/json,image/png"
          id="team-upload"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();

            if (file.type === "application/json") {
              // JSON 文件
              reader.onload = (event) => {
                try {
                  const json = JSON.parse(event.target?.result as string);
                  if (json && json.id && json.faction) {
                    onAddTeam(json.faction, json);
                  }
                } catch (err) {
                  alert(translations.t5 || "导入失败");
                }
              };
              reader.readAsText(file);
            } else if (file.type === "image/png") {
              // PNG 文件
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

                  if (!found) {
                    alert(translations.t5 || "未找到队伍数据");
                  }
                } catch (err) {
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
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16,paddingTop:10}}>
        {teams.map(team => (
          <div
            key={team.id}
            className='rounded-xl'
          >
            <Card
              style={{
                paddingTop: '0.5rem',
                paddingLeft: '1rem',
                paddingRight: '1rem',
                paddingBottom: '0.5rem',
              }}
              className={`cursor-pointer shadow-sm rounded-lg transition-shadow 
          ${selectedTeamId === team.id ? "shadow-lg" : "hover:shadow-md"}`}
              onClick={() => onSelectTeam(team.id)}
            >

              <div className="space-y-1">
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
                        badge.style.boxShadow = `
      0 4px 12px rgba(0,0,0,0.2),
      0 0 12px ${FACTION_COLORS[team.faction]}88,
      0 0 24px ${FACTION_COLORS[team.faction]}44
    `;
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

                    {editingTeamId === team.id ? (
                      <Input
                        value={team.name}
                        onChange={(e) => onUpdateTeam(team.id, { name: e.target.value })}
                        onBlur={() => setEditingTeamId('')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setEditingTeamId('');
                          }
                        }}
                        className="h-8"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          setEditingTeamId(team.id);
                        }}
                        className="font-medium"
                      >
                        {team.name}
                      </span>
                    )}

                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTeam(team.id);
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  
                </div>

                {/* 数据行 */}
                <div className="grid grid-cols-5 gap-2">
                  {/* 动画数字单元格 */}
                  {[
                    { label: translations.t7, value: team.totalScore, highlight: team.totalScore > 900 },
                    { label: translations.t8, value: team.mechCount },
                    { label: translations.t9, value: team.largeDroneCount },
                    { label: translations.t10, value: team.mediumDroneCount },
                    { label: translations.t11, value: team.smallDroneCount },
                  ].map((stat, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-sm text-muted-foreground">{stat.label}</div>

                        <div
                          key={stat.value} // 数字变化时触发动画
                          style={{
                            color: stat.highlight ? '#dc2626' : '#111', // 高亮逻辑
                          }}
                        >
                          {stat.value}
                        </div>
                    </div>
                  ))}
                </div>

                <motion.div
                  ref={containerRef}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: `${gap}px`,
                  }}
                >

                    {team.mechs.map((mech, index) => (
                      <div
                        key={`mech-${mech.id ?? index}`}
                      >
                        <MechImage mech={mech} tabsrc={tabsrc} translation={translations} />
                      </div>
                    ))}

                    {team.drones.map((drone, index) => (
                      <div
                        key={`drone-${drone.id}-${index}`}
                      >
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
                          borderRadius: '4px',
                          backgroundImage: 'repeating-linear-gradient(45deg, #eee, #eee 4px, #ddd 4px, #ddd 8px)',
                        }}
                      />
                    ));
                  })()}
                </motion.div>

              </div>
            </Card>
          </div>




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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
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
