import React, { useState, useEffect } from 'react';
import { TeamList } from './components/TeamList';
import { MechList } from './components/MechList';
import { PartSelector } from './components/PartSelector';
import { Team, Mech, Part, Drone, Pilot } from './types';
import { gofBackpack, gofChasis, gofDrones, gofLeftHand, gofPilots, gofRightHand, gofTorso, pdBackpack, pdChasis, pdDrones, pdLeftHand, pdPilots, pdRightHand, pdTorso, rdlBackpack, rdlChasis, rdlDrones, rdlLeftHand, rdlPilots, rdlRightHand, rdlTorso, unBackpack, unChasis, unDrones, unLeftHand, unPilots, unRightHand, unTorso } from './data';

// 模拟数据
const initialTeams: Team[] = [
  {
    id: '1',
    name: '第一小队',
    faction: 'RDL',
    mechs: [],
    drones: [],
    totalScore: 0,
    mechCount: 0,
    largeDroneCount: 0,
    mediumDroneCount: 0,
    smallDroneCount: 0
  }
];

export default function App() {
  // ⬇️ 初始化时尝试从 localStorage 读取
  const [teams, setTeams] = useState<Team[]>(() => {
    
    const saved = localStorage.getItem('teams');
    return saved ? JSON.parse(saved) : initialTeams;
  });
  const [selectedTeamId, setSelectedTeamId] = useState<string>('1');
  const [selectedMechId, setSelectedMechId] = useState<string>('');
  const [selectedPartType, setSelectedPartType] = useState<string>('torso');
  const [viewMode, setViewMode] = useState<'parts' | 'drones' | 'pilots'>('parts');

  const addTeam = (faction: 'RDL' | 'UN' | 'GOF' | 'PD') => {
    const newTeam: Team = {
      id: Date.now().toString(),
      name: `新小队`,
      faction,
      mechs: [],
      drones: [],
      totalScore: 0,
      mechCount: 0,
      largeDroneCount: 0,
      mediumDroneCount: 0,
      smallDroneCount: 0
    };
    setSelectedTeamId(newTeam.id); // ⬅️ 顺便切换到新小队
    setTeams(prev => [...prev, newTeam]);
  };

const initNewTeam = (faction: 'RDL' | 'UN' | 'GOF' | 'PD') => {
    const newTeam: Team = {
      id: "1",
      name: `新小队`,
      faction,
      mechs: [],
      drones: [],
      totalScore: 0,
      mechCount: 0,
      largeDroneCount: 0,
      mediumDroneCount: 0,
      smallDroneCount: 0
    };
    setSelectedTeamId(newTeam.id); // ⬅️ 顺便切换到新小队
    setTeams(prev => [...prev, newTeam]);
  };

  // ⬇️ 监听 teams，每次更新时保存到 localStorage
  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
  }, [teams]);
  

 const selectedTeam = teams.find(team => {return team.id === selectedTeamId
   console.log(team.id)}
 );


  // Safely handle the case where selectedTeam might be undefined
if (!selectedTeam) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">目前没有小队，请新建一个小队。</p>
          <button
            onClick={() => initNewTeam('RDL')}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            新建小队
          </button>
        </div>
      </div>
    );
  }


  // Now we can safely access the `faction` property
  const factionParts: Part[] = (() => {
    if (!selectedTeam.faction) return [];  // Safely return an empty array if faction is not found

    switch (selectedTeam.faction) {
      case 'RDL': {
        switch (selectedPartType) {
          case 'torso': return rdlTorso;
          case 'chasis': return rdlChasis;
          case 'leftHand': return rdlLeftHand;
          case 'rightHand': return rdlRightHand;
          case 'backpack': return rdlBackpack;
        }
      }
      case 'UN': {
        switch (selectedPartType) {
          case 'torso': return unTorso;
          case 'chasis': return unChasis;
          case 'leftHand': return unLeftHand;
          case 'rightHand': return unRightHand;
          case 'backpack': return unBackpack;
        }
      }
      case 'GOF': {
        switch (selectedPartType) {
          case 'torso': return gofTorso;
          case 'chasis': return gofChasis;
          case 'leftHand': return gofLeftHand;
          case 'rightHand': return gofRightHand;
          case 'backpack': return gofBackpack;
        }
      }
      case 'PD': {
        switch (selectedPartType) {
          case 'torso': return pdTorso;
          case 'chasis': return pdChasis;
          case 'leftHand': return pdLeftHand;
          case 'rightHand': return pdRightHand;
          case 'backpack': return pdBackpack;
        }
      }
    }
  })();

  // 根据小队派系过滤无人机
  const factionDrones: Drone[] = (() => {
    switch (selectedTeam.faction) {
      case 'RDL': return rdlDrones;
      case 'UN': return unDrones;
      case 'GOF': return gofDrones;
      case 'PD': return pdDrones;
    }
  })();

  // 根据小队派系过滤无人机
  const factionPilots: Pilot[] = (() => {
    switch (selectedTeam.faction) {
      case 'RDL': return rdlPilots;
      case 'UN': return unPilots;
      case 'GOF': return gofPilots;
      case 'PD': return pdPilots;
    }
  })();

  const updateTeam = (teamId: string, updates: Partial<Team>) => {
    setTeams(prev => prev.map(team =>
      team.id === teamId ? { ...team, ...updates } : team
    ));
  };

  const copyTeam = (newTeam: Team) => {
    setTeams(prev => [...prev, newTeam]);
  };

  const deleteTeam = (teamId: string) => {
    setTeams(prev => prev.filter(team => team.id !== teamId));
    if (selectedTeamId === teamId && teams.length > 1) {
      const remainingTeams = teams.filter(team => team.id !== teamId);
      setSelectedTeamId(remainingTeams[0]?.id || '');
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex overflow-hidden">
      {/* 左侧小队列表 */}
      <div
        className={`border-r border-border transition-all duration-300 overflow-y-auto min-h-0`}
      >
        <TeamList
          teams={teams}
          selectedTeamId={selectedTeamId}
          onSelectTeam={setSelectedTeamId}
          onAddTeam={addTeam}
          onDeleteTeam={deleteTeam}
          onUpdateTeam={updateTeam}
          onCopyTeam={copyTeam}
        />
      </div>

      {/* 中间机体列表 */}
      <div className="flex-1 border-r border-border min-h-0 min-w-0 flex flex-col overflow-hidden">
        <MechList
          team={selectedTeam}
          selectedMechId={selectedMechId}
          onSelectMech={setSelectedMechId}
          onSelectPartType={setSelectedPartType}
          onUpdateTeam={updateTeam}
          onSetViewMode={setViewMode}
        />
      </div>

      {/* 右侧部件/无人机选择器 */}
      <div className="w-80 min-h-0 flex flex-col">
        <PartSelector
          viewMode={viewMode}
          team={selectedTeam}
          selectedPartType={selectedPartType}
          parts={factionParts}
          drones={factionDrones}
          pilots={factionPilots}
          onSelectPart={(part) => {
            if (selectedTeam && selectedMechId) {
              const updatedMechs = selectedTeam.mechs.map(mech => {
                if (mech.id === selectedMechId) {
                  return {
                    ...mech,
                    parts: {
                      ...mech.parts,
                      [selectedPartType]: part
                    }
                  };
                }
                return mech;
              });

              const totalScore = updatedMechs.reduce((sum, mech) =>
                sum + Object.values(mech.parts).reduce((partSum, part) =>
                  partSum + (part?.score || 0), 0
                ) + (mech.pilot?.score || 0), 0
              );

              updateTeam(selectedTeam.id, {
                mechs: updatedMechs,
                totalScore: totalScore + selectedTeam.drones.reduce((sum, drone) => sum + drone.score, 0)
              });
            }
          }}
          onSelectDrone={(drone) => {
            if (selectedTeam) {
              const updatedDrones = [...selectedTeam.drones, drone];
              const droneScore = updatedDrones.reduce((sum, d) => sum + d.score, 0);
              const mechScore = selectedTeam.mechs.reduce((sum, mech) =>
                sum + Object.values(mech.parts).reduce((partSum, part) =>
                  partSum + (part?.score || 0), 0
                ) + (mech.pilot?.score || 0), 0
              );

              updateTeam(selectedTeam.id, {
                drones: updatedDrones,
                totalScore: mechScore + droneScore,
                largeDroneCount: updatedDrones.filter(d => d.type === 'large').length,
                mediumDroneCount: updatedDrones.filter(d => d.type === 'medium').length,
                smallDroneCount: updatedDrones.filter(d => d.type === 'small').length,
              });
            }
          }}
          onSelectPilot={(pilot) => {
            if (selectedTeam && selectedMechId) {
              const updatedMechs = selectedTeam.mechs.map(mech => {
                if (mech.id === selectedMechId) {
                  return {
                    ...mech,
                    pilot: pilot
                  };
                }
                return mech;
              });

              const mechScore = updatedMechs.reduce((sum, mech) =>
                sum + Object.values(mech.parts).reduce((partSum, part) =>
                  partSum + (part?.score || 0), 0
                ) + (mech.pilot?.score || 0), 0
              );
              const droneScore = selectedTeam.drones.reduce((sum, drone) => sum + drone.score, 0);

              updateTeam(selectedTeam.id, {
                mechs: updatedMechs,
                totalScore: mechScore + droneScore
              });
            }
          }}
        />
      </div>
    </div>
  );
}