import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Trash2, Plus, Copy, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Team, FACTION_COLORS, FACTION_NAMES } from '../types';

interface TeamListProps {
  teams: Team[];
  selectedTeamId: string;
  onSelectTeam: (teamId: string) => void;
  onAddTeam: (faction: 'RDL' | 'UN' | 'GOF' | 'PD') => void;
  onDeleteTeam: (teamId: string) => void;
  onUpdateTeam: (teamId: string, updates: Partial<Team>) => void;
}

export function TeamList({
  teams,
  selectedTeamId,
  onSelectTeam,
  onAddTeam,
  onDeleteTeam,
  onUpdateTeam,
}: TeamListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string>('');

  const handleAddTeam = (faction: 'RDL' | 'UN' | 'GOF' | 'PD') => {
    onAddTeam(faction);
    setIsDialogOpen(false);
  };

  const handleUpdateTeamName = (teamId: string, newName: string) => {
    onUpdateTeam(teamId, { name: newName });
    setEditingTeamId('');
  };

  const copyTeamData = (team: Team) => {
    const data = JSON.stringify(team, null, 2);
    navigator.clipboard.writeText(data);
  };

  const exportTeamData = (team: Team) => {
    const data = JSON.stringify(team, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${team.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-0 flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2>机体小队列表</h2>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                新增
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>选择派系</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                {(Object.entries(FACTION_NAMES) as [keyof typeof FACTION_NAMES, string][]).map(([key, name]) => (
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

      <div className="p-4 border-t border-border">
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const selectedTeam = teams.find(t => t.id === selectedTeamId);
              if (selectedTeam) copyTeamData(selectedTeam);
            }}
          >
            <Copy className="w-4 h-4 mr-2" />
            复制
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const selectedTeam = teams.find(t => t.id === selectedTeamId);
              if (selectedTeam) exportTeamData(selectedTeam);
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            导出
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {teams.map((team) => (
          <Card
            key={team.id}
            className={`p-4 cursor-pointer transition-colors ${
              selectedTeamId === team.id ? 'bg-accent' : 'hover:bg-accent/50'
            }`}
            onClick={() => onSelectTeam(team.id)}
          >
            <div className="space-y-3">
              {/* 标题行 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={FACTION_COLORS[team.faction]}>{FACTION_NAMES[team.faction]}</Badge>
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
                  <div className="text-sm text-muted-foreground">总分</div>
                  <div>{team.totalScore}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">机体</div>
                  <div>{team.mechCount}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">大型</div>
                  <div>{team.largeDroneCount}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">中型</div>
                  <div>{team.mediumDroneCount}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">小型</div>
                  <div>{team.smallDroneCount}</div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}