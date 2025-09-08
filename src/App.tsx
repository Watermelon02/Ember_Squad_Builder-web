import React, { useState, useEffect } from 'react';
import { TeamList } from './components/TeamList';
import { MechList } from './components/MechList';
import { PartSelector } from './components/PartSelector';
import { Team, Mech, Part, Drone, Pilot, PART_TYPE_NAMES, FACTION_NAMES } from './types';
import { Button } from './components/ui/button';
import { translations } from './i18n';
import { IMAGE_SRC, LOCAL_IMAGE_SRC } from './resource';
import * as zhData from './data';
import * as enData from './data_en';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Globe } from 'lucide-react';

export default function App() {
    // ⬇️ 初始化语言，从 localStorage 读取
 const [lang, setLang] = useState<"en" | "zh"|"jp">(() => {
    return (localStorage.getItem("lang") as "en" | "zh"|"jp") || "zh";
  });
  const t = translations[lang]; // 取当前语言的字典
  const [teams, setTeams] = useState<Team[]>(() => {
    const v = localStorage.getItem("version");
    if (v !== "3") {
      localStorage.clear();
      localStorage.setItem("version", "3");
    }
    const saved = localStorage.getItem('teams');
    return saved ? JSON.parse(saved) : [{
      id: '1',
      name: t.t63,
      faction: 'RDL',
      mechs: [],
      drones: [],
      totalScore: 0,
      mechCount: 0,
      largeDroneCount: 0,
      mediumDroneCount: 0,
      smallDroneCount: 0
    }];
  });

  const [selectedTeamId, setSelectedTeamId] = useState<string>('1');
  const [selectedMechId, setSelectedMechId] = useState<string>('');
  const [selectedPartType, setSelectedPartType] = useState<string>('torso');
  const [viewMode, setViewMode] = useState<'parts' | 'drones' | 'pilots'>('parts');


  const [data, setData] = useState<any | null>(null);

  const typePartNames = PART_TYPE_NAMES[lang]
  const factionNames = FACTION_NAMES[lang]
  const imageSrc = IMAGE_SRC[lang]
   const localImgsrc = LOCAL_IMAGE_SRC[lang]

useEffect(() => {
    const selectedData = lang === "zh" ? zhData : enData;
    setData(selectedData);
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
  }, [teams]);

  if (!data) {
    return <div>加载中...</div>;
  }

  const {
    gofBackpack, gofChasis, gofDrones, gofLeftHand, gofPilots, gofRightHand, gofTorso,
    pdBackpack, pdChasis, pdDrones, pdLeftHand, pdPilots, pdRightHand, pdTorso,
    rdlBackpack, rdlChasis, rdlDrones, rdlLeftHand, rdlPilots, rdlRightHand, rdlTorso,
    unBackpack, unChasis, unDrones, unLeftHand, unPilots, unRightHand, unTorso
  } = data;

  const addTeam = (faction: 'RDL' | 'UN' | 'GOF' | 'PD') => {
    const newTeam: Team = {
      id: Date.now().toString(),
      name:t.t64,
      faction,
      mechs: [],
      drones: [],
      totalScore: 0,
      mechCount: 0,
      largeDroneCount: 0,
      mediumDroneCount: 0,
      smallDroneCount: 0
    };
    setSelectedTeamId(newTeam.id);
    setTeams(prev => [...prev, newTeam]);
  };

  const initNewTeam = (faction: 'RDL' | 'UN' | 'GOF' | 'PD') => {
    const newTeam: Team = {
      id: "1",
      name: t.t64,
      faction,
      mechs: [],
      drones: [],
      totalScore: 0,
      mechCount: 0,
      largeDroneCount: 0,
      mediumDroneCount: 0,
      smallDroneCount: 0
    };
    setSelectedTeamId(newTeam.id);
    setTeams(prev => [...prev, newTeam]);
  };

  const selectedTeam = teams.find(team => team.id === selectedTeamId);

  if (!selectedTeam) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">{t.t65}</p>
          <button
            onClick={() => initNewTeam('RDL')}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {t.t66}
          </button>
        </div>
      </div>
    );
  }

  const factionParts: Part[] = (() => {
    if (!selectedTeam.faction) return [];
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

  const factionDrones: Drone[] = (() => {
    switch (selectedTeam.faction) {
      case 'RDL': return rdlDrones.concat(pdDrones);
      case 'UN': return unDrones.concat(pdDrones);
      case 'GOF': return gofDrones.concat(pdDrones);
      case 'PD': return pdDrones;
    }
  })();

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
      {/* 右上角语言切换按钮 */}

      <div className="absolute top-3 right-3 flex items-center gap-2 p-3">
  <Globe className="w-5 h-5 text-gray-600" />
  <Select value={lang} onValueChange={(value) => setLang(value as "zh" | "en" | "jp")}>
    <SelectTrigger className="w-[120px]">
      <SelectValue placeholder="选择语言" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="zh">中文</SelectItem>
      <SelectItem value="en">English</SelectItem>
      <SelectItem value="jp">日本語</SelectItem>
    </SelectContent>
  </Select>
</div>


      {/* 左侧小队列表 */}
      <div className={`border-r border-border transition-all duration-300 overflow-y-auto min-h-0`}>
        <TeamList
          teams={teams}
          selectedTeamId={selectedTeamId}
          onSelectTeam={setSelectedTeamId}
          onAddTeam={addTeam}
          onDeleteTeam={deleteTeam}
          onUpdateTeam={updateTeam}
          onCopyTeam={copyTeam}
          translations={t}
          factionNames={factionNames}
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
          translations={t}
          partTypeNames={typePartNames}
          imgsrc={imageSrc}
          localImgsrc={localImgsrc}
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
          translations={t}
          partTypeNames={typePartNames}
          imgsrc={imageSrc}
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
