import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Trash2, Copy } from 'lucide-react';
import { Team, Mech, Drone, PART_TYPE_NAMES } from '../types';

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

  const addMech = () => {
    if (!team) return;

    const newMech: Mech = {
      id: Date.now().toString(),
      name: '新机体',
      parts: {},
    };

    const updatedMechs = [...team.mechs, newMech];
    onUpdateTeam(team.id, {
      mechs: updatedMechs,
      mechCount: updatedMechs.length,
    });
  };

  const deleteMech = (mechId: string) => {
    if (!team) return;

    const updatedMechs = team.mechs.filter((mech) => mech.id !== mechId);
    const totalScore =
      updatedMechs.reduce(
        (sum, mech) =>
          sum +
          Object.values(mech.parts).reduce(
            (partSum, part) => partSum + (part?.score || 0),
            0
          ) +
          (mech.pilot?.score || 0),
        0
      ) + team.drones.reduce((sum, drone) => sum + drone.score, 0);

    onUpdateTeam(team.id, {
      mechs: updatedMechs,
      mechCount: updatedMechs.length,
      totalScore,
    });

    if (selectedMechId === mechId) {
      onSelectMech('');
    }
  };

  const updateMechName = (mechId: string, name: string) => {
    if (!team) return;

    const updatedMechs = team.mechs.map((mech) =>
      mech.id === mechId ? { ...mech, name } : mech
    );

    onUpdateTeam(team.id, { mechs: updatedMechs });
  };

  const copyMech = (mech: Mech) => {
    if (!team) return;

    const copiedMech: Mech = {
      ...mech,
      id: Date.now().toString(),
      name: `${mech.name} (副本)`,
    };

    const updatedMechs = [...team.mechs, copiedMech];
    const totalScore =
      updatedMechs.reduce(
        (sum, m) =>
          sum +
          Object.values(m.parts).reduce(
            (partSum, part) => partSum + (part?.score || 0),
            0
          ) +
          (m.pilot?.score || 0),
        0
      ) + team.drones.reduce((sum, drone) => sum + drone.score, 0);

    onUpdateTeam(team.id, {
      mechs: updatedMechs,
      mechCount: updatedMechs.length,
      totalScore,
    });
  };

  const deleteDrone = (droneIndex: number) => {
    if (!team) return;

    const updatedDrones = team.drones.filter((_, index) => index !== droneIndex);
    const droneScore = updatedDrones.reduce((sum, d) => sum + d.score, 0);
    const mechScore = team.mechs.reduce(
      (sum, mech) =>
        sum +
        Object.values(mech.parts).reduce(
          (partSum, part) => partSum + (part?.score || 0),
          0
        ) +
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

  const getMechTotalScore = (mech: Mech) => {
    return (
      Object.values(mech.parts).reduce(
        (sum, part) => sum + (part?.score || 0),
        0
      ) + (mech.pilot?.score || 0)
    );
  };

  if (!team) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        请选择一个小队
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <Tabs defaultValue="mechs" className="flex-1 min-h-0 flex flex-col">
        <div className="p-4 border-b border-border">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="mechs"
              onClick={() => onSetViewMode('parts')}
            >
              机体列表 ({team.mechs.length})
            </TabsTrigger>
            <TabsTrigger
              value="drones"
              onClick={() => onSetViewMode('drones')}
            >
              无人机列表 ({team.drones.length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 机体列表 */}
        <TabsContent value="mechs" className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex justify-end">
            <Button onClick={addMech} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              添加机体
            </Button>
          </div>

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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMech(mech.id)}
                    className="text-destructive "
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-5 gap-3">
                  {(Object.entries(PART_TYPE_NAMES) as [keyof typeof PART_TYPE_NAMES, string][]).map(([partType]) => (
                    <Card
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
                          <img
                            src={`/res/cn/${team.faction}/part/${mech.parts[partType]!.id}.png`}
                            alt={mech.parts[partType]!.name}
                            className="w-full h-auto object-contain"  // 保持比例

                          />
                          <Badge
                            variant="secondary"
                            className="absolute top-2 left-2 text-xs"
                          >
                            {mech.parts[partType]!.score}
                          </Badge>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground bg-muted">
                          未装备
                        </div>
                      )}
                    </Card>
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
                          src={`/res/cn/${team.faction}/pilot/${mech.pilot.id}.png`}
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

                {/* 底部信息 */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyMech(mech)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    复制
                  </Button>
                  <Badge variant="outline">
                    总分: {getMechTotalScore(mech)}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}

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
                  src={`/res/cn/${team.faction}/part/${drone.id}.png`}
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
