import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Trash2, Plus, Copy, Download, ChevronLeft, ChevronRight, Upload, Dice6, Sword } from 'lucide-react';
import { Team, FACTION_COLORS, PART_TYPE_NAMES } from '../types';

interface TeamListProps {
  teams: Team[];
  selectedTeamId: string;
  onSelectTeam: (teamId: string) => void;
  onAddTeam: (faction: 'RDL' | 'UN' | 'GOF' | 'PD') => void;
  onDeleteTeam: (teamId: string) => void;
  onUpdateTeam: (teamId: string, updates: Partial<Team>) => void;
  onCopyTeam: (newTeam: Team) => void;
  translations: any,
  factionNames: any,
  lang: string;
}

export function TeamList({
  teams,
  selectedTeamId,
  onSelectTeam,
  onAddTeam,
  onDeleteTeam,
  onUpdateTeam,
  onCopyTeam, translations, factionNames, lang
}: TeamListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string>('');

  const handleAddTeam = (faction: 'RDL' | 'UN' | 'GOF' | 'PD') => {
    onAddTeam(faction);
    setIsDialogOpen(false);
    if (window.gtag) {
      console.log(faction)
      window.gtag('event', 'select_faction', {
        event_category: 'faction_selection',
        event_label: faction,
        value: 1,
      });
    } else {
      console.error('gtag function is not available');
    }
  };

  const cloneTeam = (teamId: string) => {
    // Find the team you want to clone
    const teamToClone = teams.find(team => team.id === teamId);
    if (teamToClone) {
      // Create a new team object based on the original team's data
      const clonedTeam: Team = {
        ...teamToClone,
        id: Date.now().toString(), // Give it a new unique ID
        name: `${teamToClone.name}`, // Optionally change the name to include "(副本)"
        mechs: [...teamToClone.mechs], // Clone mechs (ensure no reference sharing)
        drones: [...teamToClone.drones], // Clone drones
        totalScore: teamToClone.totalScore,
        mechCount: teamToClone.mechCount,
        largeDroneCount: teamToClone.largeDroneCount,
        mediumDroneCount: teamToClone.mediumDroneCount,
        smallDroneCount: teamToClone.smallDroneCount,
        faction: teamToClone.faction
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
      link.download = `${selectedTeam.name}.json`; // 文件名为小队名称
      link.click();
    }
  };


  return (
    <div className="min-h-0 flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-0">
          <div className="flex items-center gap-2">
            <h2>{translations.t3}</h2>
          </div>
          <div className="flex gap-1">
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
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => cloneTeam(selectedTeamId)} // Trigger cloning when clicked
          >
            <Copy className="w-4 h-4 mr-2" />
            {translations.t4}
          </Button>
          <input
            type="file"
            accept="application/json"
            id="team-upload"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const reader = new FileReader();
              reader.onload = (event) => {
                try {
                  const json = JSON.parse(event.target?.result as string);
                  if (json && json.id) {
                    // 先创建小队
                    onAddTeam(json.faction, json);  // 传递整个 json 作为 teamData
                    alert('小队数据导入成功');
                  } else {
                    alert('剪贴板数据格式不正确');
                  }
                } catch (err) {
                  console.error('导入失败:', err);
                  alert('无法读取数据');
                }
              };
              reader.readAsText(file);
            }}
          />

          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("team-upload")?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            {translations.t73}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportTeamAsJson(selectedTeamId)}
          >
            <Download className="w-4 h-4 mr-2" />
            {translations.t74}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {teams.map((team) => (
          <Card
            key={team.id}
            className={`p-4 cursor-pointer transition-colors ${selectedTeamId === team.id ? 'bg-accent' : 'hover:bg-accent/50'
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
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">{translations.t7}</div>
                  <div>{team.totalScore}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">{translations.t8}</div>
                  <div>{team.mechCount}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">{translations.t9}</div>
                  <div>{team.largeDroneCount}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">{translations.t10}</div>
                  <div>{team.mediumDroneCount}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">{translations.t11}</div>
                  <div>{team.smallDroneCount}</div>
                </div>
              </div>
            </div>
          </Card>
        ))}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <div className="flex justify-center">
              <Button size="sm" className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800">
                <Plus className="w-4 h-4 mr-2" />
                <div className="text-sm text-muted-foreground">{translations.t12}</div>
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{translations.t13}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              {(Object.entries(factionNames) as [keyof typeof factionNames, string][]).map(([key, name]) => (
                <Button
                  key={key}
                  onClick={() => handleAddTeam(key)}
                  className={`${FACTION_COLORS[key]} hover:opacity-80`}
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
