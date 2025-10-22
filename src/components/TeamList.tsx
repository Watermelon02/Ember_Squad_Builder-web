import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Trash2, Plus, Copy, Download, Dice6, Sword, Upload } from 'lucide-react';
import { Team, FACTION_COLORS } from '../types';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import extractChunks from "png-chunks-extract";
import { AnimatePresence, motion } from 'framer-motion';

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
  factionNames, lang
}: TeamListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string>('');
  const [screenFlash, setScreenFlash] = useState<Record<string, number>>({});
  const [knobAngles, setKnobAngles] = useState<Record<string, number>>({});
  const [scanConfigs, setScanConfigs] = useState<Record<string, { speed: number; delay: number }>>({});


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



  return (
    <div style={{  display: 'flex', flexDirection: 'column', padding: 10 }} >
      
      {/* 顶部工具栏 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ color: '#333' }}>{translations.t3}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
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
      <div className="flex w-full gap-2 mb-4">
        <Button
          className="flex-1"
          variant="outline"
          size="sm"
          onClick={() => cloneTeam(selectedTeamId)}
        >
          <Copy className="w-4 h-4 mr-2" /> {translations.t4}
        </Button>

        <Button
          className="flex-1"
          variant="outline"
          size="sm"
          onClick={() => document.getElementById("team-upload")?.click()}
        >
          <Upload className="w-4 h-4 mr-2" /> {translations.t73}
        </Button>

        <Button
          className="flex-1"
          variant="outline"
          size="sm"
          onClick={() => exportTeamAsJson(selectedTeamId)}
        >
          <Download className="w-4 h-4 mr-2" /> {translations.t74}
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
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {teams.map(team => (
          <Card
            key={team.id}
            className={`p-4 cursor-pointer transition-colors shadow-sm ${selectedTeamId === team.id ? 'bg-accent' : 'hover:bg-accent/50'
              }`}
            onClick={() => onSelectTeam(team.id)}
          >
            <div className="space-y-3">
              {/* 标题行 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={FACTION_COLORS[team.faction]}>{factionNames[team.faction]}</Badge>
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
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        key={stat.value} // 数字变化时触发动画
                        initial={{ scale: 0.9, y: 5, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: -5, opacity: 0 }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
                        style={{
                          color: stat.highlight ? '#dc2626' : '#111', // 高亮逻辑
                        }}
                      >
                        {stat.value}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                ))}
              </div>

            </div>
          </Card>





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
                <Button key={key} onClick={() => handleAddTeam(key)} className={`${FACTION_COLORS[key]}`} style={{ color: '#fff' }}>
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
