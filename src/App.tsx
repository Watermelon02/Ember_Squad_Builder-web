import React, { useState, useEffect } from 'react';
import { TeamList } from './components/TeamList';
import { MechList } from './components/MechList';
import { PartSelector } from './components/PartSelector';
import { Team, Mech, Part, Drone, Pilot, PART_TYPE_NAMES, FACTION_NAMES } from './types';
import { Button } from './components/ui/button';
import { translations } from './i18n';
import { IMAGE_SRC, LOCAL_IMAGE_SRC, TAB_IMAGE_SRC } from './resource';
import * as zhData from './data';
import * as enData from './data_en';
import * as jpData from './data_jp';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import { getDeviceFingerprint } from './remote';
import axios from "axios";

export default function App() {
  // ------------------ 语言 ------------------
  const [lang, setLang] = useState<"en" | "zh" | "jp">(() => {
    return (localStorage.getItem("lang") as "en" | "zh" | "jp") || "zh";
  });
  const t = translations[lang];

  // ------------------ 团队状态 ------------------
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


  const typePartNames = PART_TYPE_NAMES[lang];
  const factionNames = FACTION_NAMES[lang];
  const imageSrc = IMAGE_SRC[lang];
  const tabSrc = TAB_IMAGE_SRC[lang];
  const localImgsrc = LOCAL_IMAGE_SRC[lang];

  let selectedTeam = teams.find(team => team.id === selectedTeamId);

  // ------------------ 移动端判断 ------------------
const [isMobileOrTablet, setMobileOrTablet] = useState(false);


const [collapsedLeft, setCollapsedLeft] = useState(isMobileOrTablet ? true : false);
const [collapsedRight, setCollapsedRight] = useState(isMobileOrTablet ? true : false);

useEffect(() => {
  if (!sessionStorage.getItem('sw_cleared')) {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => registration.unregister());
      });
    }

    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(name => caches.delete(name));
      });
    }

    sessionStorage.setItem('sw_cleared', 'true');
    window.location.reload();
  }
}, []);

useEffect(() => {
  const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  setMobileOrTablet(mobile);
  if (mobile) {
    setCollapsedLeft(true);
    setCollapsedRight(true);
  }
}, []);


if (isMobileOrTablet === null) return null; // 或者显示 loading



  // ------------------ 语言数据 ------------------
  const [data, setData] = useState<any | null>(null);
  useEffect(() => {
    switch (lang) {
      case "zh": setData(zhData); break;
      case "en": setData(enData); break;
      case "jp": setData(jpData); break;
    }
    localStorage.setItem("lang", lang);
  }, [lang]);

  // ------------------ 保存到 localStorage & 服务器 ------------------
  async function saveTeam(team: Team) {
    team.deviceID = await getDeviceFingerprint()
    try {
      await axios.post("https://4watermelon.fun/api/teams/save", team);
    } catch (err) {
      console.error("保存失败:", err);
    }
  }

  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
    if (selectedTeam) saveTeam(selectedTeam);
  }, [teams]);

  if (!data) return <div>加载中...</div>;

  const {
    gofBackpack, gofChasis, gofDrones, gofLeftHand, gofPilots, gofRightHand, gofTorso,
    pdBackpack, pdChasis, pdDrones, pdLeftHand, pdPilots, pdRightHand, pdTorso,
    rdlBackpack, rdlChasis, rdlDrones, rdlLeftHand, rdlPilots, rdlRightHand, rdlTorso,
    unBackpack, unChasis, unDrones, unLeftHand, unPilots, unRightHand, unTorso
  } = data;

  // ------------------ 添加/初始化团队 ------------------
  const addTeam = (faction: 'RDL' | 'UN' | 'GOF' | 'PD', teamData?: Partial<Team>) => {
    const newTeam: Team = {
      id: Date.now().toString(),
      name: t.t64,
      faction,
      mechs: teamData?.mechs || [],
      drones: teamData?.drones || [],
      totalScore: teamData?.totalScore || 0,
      mechCount: teamData?.mechCount || 0,
      largeDroneCount: teamData?.largeDroneCount || 0,
      mediumDroneCount: teamData?.mediumDroneCount || 0,
      smallDroneCount: teamData?.smallDroneCount || 0,
    };
    setSelectedTeamId(newTeam.id);
    setTeams(prev => [...prev, newTeam]);
  };

  const initNewTeam = (faction: 'RDL' | 'UN' | 'GOF' | 'PD') => addTeam(faction);

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


  // ------------------ 设置视图模式 ------------------
  const handleSetViewMode = (mode: 'parts' | 'drones' | 'pilots') => {
    const lastViewMode = viewMode;
    setViewMode(mode);
    if (isMobileOrTablet) {
      if ((lastViewMode !== 'drones' && mode === 'drones') || (lastViewMode === 'drones' && mode !== 'drones')) { } else {
        setCollapsedRight(false); // 用户操作时展开浮层
      }
    }
  };


  // ------------------ 阵营数据 ------------------
  const factionParts: Part[] = (() => {
    if (!selectedTeam.faction) return [];
    switch (selectedTeam.faction) {
      case 'RDL': switch (selectedPartType) {
        case 'torso': return [...rdlTorso, ...pdTorso].filter(p => p?.type);
        case 'chasis': return [...rdlChasis, ...pdChasis].filter(p => p?.type);
        case 'leftHand': return [...rdlLeftHand, ...pdLeftHand].filter(p => p?.type);
        case 'rightHand': return [...rdlRightHand, ...pdRightHand].filter(p => p?.type);
        case 'backpack': return [...rdlBackpack, ...pdBackpack].filter(p => p?.type);
      }
      case 'UN': switch (selectedPartType) {
        case 'torso': return unTorso.concat(pdTorso);
        case 'chasis': return unChasis.concat(pdChasis);
        case 'leftHand': return unLeftHand.concat(pdLeftHand);
        case 'rightHand': return unRightHand.concat(pdRightHand);
        case 'backpack': return unBackpack.concat(pdBackpack);
      }
      case 'GOF': switch (selectedPartType) {
        case 'torso': return gofTorso;
        case 'chasis': return gofChasis;
        case 'leftHand': return gofLeftHand;
        case 'rightHand': return gofRightHand;
        case 'backpack': return gofBackpack;
      }
      case 'PD': switch (selectedPartType) {
        case 'torso': return pdTorso;
        case 'chasis': return pdChasis;
        case 'leftHand': return pdLeftHand;
        case 'rightHand': return pdRightHand;
        case 'backpack': return pdBackpack;
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

  const mergePilots = (a: any[] = [], b: any[] = []) =>
    [...(a || []), ...(b || [])].filter(p => p?.faction);

  const factionPilots: Pilot[] = (() => {
    switch (selectedTeam.faction) {
      case 'RDL': return mergePilots(rdlPilots, pdPilots);
      case 'UN': return mergePilots(unPilots, pdPilots);
      case 'GOF': return gofPilots;
      case 'PD': return pdPilots;
    }
  })();

  const updateTeam = (teamId: string, updates: Partial<Team>) => {
    setTeams(prev => prev.map(team => team.id === teamId ? { ...team, ...updates } : team));
  };

  const copyTeam = (newTeam: Team) => setTeams(prev => [...prev, newTeam]);

  const deleteTeam = async (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    try {
      team.deviceID = await getDeviceFingerprint();
      await axios.post("https://4watermelon.fun/api/teams/delete", team);
    } catch (err) {
      console.error("删除失败:", err);
    }
    setTeams(prev => prev.filter(t => t.id !== teamId));
    if (selectedTeamId === teamId && teams.length > 1) {
      const remainingTeams = teams.filter(t => t.id !== teamId);
      setSelectedTeamId(remainingTeams[0]?.id || '');
    }
  };

  // ------------------ 渲染 ------------------
  return (
    <div className="fixed inset-0 bg-background flex overflow-hidden">
      {/* 右上角语言切换 */}
      {!isMobileOrTablet && <div className="absolute top-3 right-3 flex items-center gap-2 p-3 z-50">
        <Globe className="w-5 h-5 text-gray-600" />
        <Select value={lang} onValueChange={v => setLang(v as "zh" | "en" | "jp")}>
          <SelectTrigger className="w-[120px]"><SelectValue placeholder="选择语言" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="zh">中文</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="jp">日本語</SelectItem>
          </SelectContent>
        </Select>
      </div>}

      {/* 左侧小队列表 */}
      <div className="relative flex">
        {/* 左侧折叠按钮 */}
        <Button
          size="sm"
          className="absolute top-3 left-3 z-50 flex items-center justify-center w-10 h-10 rounded-md shadow transition-all duration-300 ease-in-out"
          style={{ backgroundColor: 'rgba(75,85,99,0.2)' }}
          onClick={() => setCollapsedLeft(prev => !prev)}
        >
          {collapsedLeft ? <ChevronRight className="w-5 h-5" stroke="white" /> : <ChevronLeft className="w-5 h-5" stroke="white" />}
        </Button>

        {/* 左侧面板 */}
        <div className={`transition-all duration-300 ease-in-out overflow-y-auto min-h-0 ${collapsedLeft ? 'w-0 opacity-0' : 'w-80 opacity-100'}`}>
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
            lang={lang}
          />
        </div>
        {!collapsedLeft && <div className="w-px bg-border" />}
      </div>

      {/* 中间机体列表 */}
      <div className="flex-1 border-r border-border min-h-0 min-w-0 flex flex-col overflow-hidden">
        <MechList
          team={selectedTeam}
          selectedMechId={selectedMechId}
          onSelectMech={setSelectedMechId}
          onSelectPartType={setSelectedPartType}
          onUpdateTeam={updateTeam}
          onSetViewMode={handleSetViewMode}
          translations={t}
          partTypeNames={typePartNames}
          imgsrc={imageSrc}
          localImgsrc={localImgsrc}
          lang={lang}
          tabsrc={tabSrc}
          mobileOrTablet={isMobileOrTablet}
          setLanguage={setLang}
        />
      </div>

      {/* 右侧面板 */}
      {/* 右侧面板 */}
      {isMobileOrTablet ? (
        !collapsedRight && (
          <div
            className="fixed inset-0 z-50 bg-black/50 flex justify-end"
            onClick={() => setCollapsedRight(true)}
          >
            <div
              className="bg-background shadow-lg w-80 h-[70vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 滚动容器 */}
              <div className="flex-1 overflow-y-auto p-4" style={{ WebkitOverflowScrolling: 'touch' }}>
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
                  tabsrc={tabSrc}
                  onSelectPart={(part) => {
                    if (selectedTeam && selectedMechId) {
                      const updatedMechs = selectedTeam.mechs.map(mech => {
                        if (mech.id === selectedMechId) {
                          return {
                            ...mech,
                            parts: { ...mech.parts, [selectedPartType]: part }
                          };
                        }
                        return mech;
                      });

                      const totalScore = updatedMechs.reduce((sum, mech) =>
                        sum + Object.values(mech.parts).reduce((partSum, part) => partSum + (part?.score || 0), 0)
                        + (mech.pilot?.score || 0), 0
                      );

                      updateTeam(selectedTeam.id, {
                        mechs: updatedMechs,
                        totalScore: totalScore + selectedTeam.drones.reduce((sum, drone) => sum + drone.score, 0)
                      });
                    }
                    setCollapsedRight(true);
                  }}
                  onSelectDrone={(drone) => {
                    if (selectedTeam) {
                      const updatedDrones = [...selectedTeam.drones, drone];
                      const droneScore = updatedDrones.reduce((sum, d) => sum + d.score, 0);
                      const mechScore = selectedTeam.mechs.reduce((sum, mech) =>
                        sum + Object.values(mech.parts).reduce((partSum, part) => partSum + (part?.score || 0), 0)
                        + (mech.pilot?.score || 0), 0
                      );

                      updateTeam(selectedTeam.id, {
                        drones: updatedDrones,
                        totalScore: mechScore + droneScore,
                        largeDroneCount: updatedDrones.filter(d => d.type === 'large').length,
                        mediumDroneCount: updatedDrones.filter(d => d.type === 'medium').length,
                        smallDroneCount: updatedDrones.filter(d => d.type === 'small').length,
                      });
                    }
                    setCollapsedRight(true);
                  }}
                  onSelectPilot={(pilot) => {
                    if (selectedTeam && selectedMechId) {
                      const updatedMechs = selectedTeam.mechs.map(mech => {
                        if (mech.id === selectedMechId) {
                          return { ...mech, pilot };
                        }
                        return mech;
                      });

                      const mechScore = updatedMechs.reduce((sum, mech) =>
                        sum + Object.values(mech.parts).reduce((partSum, part) => partSum + (part?.score || 0), 0)
                        + (mech.pilot?.score || 0), 0
                      );
                      const droneScore = selectedTeam.drones.reduce((sum, drone) => sum + drone.score, 0);

                      updateTeam(selectedTeam.id, {
                        mechs: updatedMechs,
                        totalScore: mechScore + droneScore
                      });
                    }
                    setCollapsedRight(true);
                  }}
                />
              </div>
            </div>
          </div>
        )
      ) : <div className="w-80 min-h-0 flex flex-col">
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
          tabsrc={tabSrc}
          onSelectPart={(part) => {
            if (selectedTeam && selectedMechId) {
              const updatedMechs = selectedTeam.mechs.map(mech => {
                if (mech.id === selectedMechId) {
                  return {
                    ...mech,
                    parts: { ...mech.parts, [selectedPartType]: part }
                  };
                }
                return mech;
              });

              const totalScore = updatedMechs.reduce((sum, mech) =>
                sum + Object.values(mech.parts).reduce((partSum, part) => partSum + (part?.score || 0), 0)
                + (mech.pilot?.score || 0), 0
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
                sum + Object.values(mech.parts).reduce((partSum, part) => partSum + (part?.score || 0), 0)
                + (mech.pilot?.score || 0), 0
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
                  return { ...mech, pilot };
                }
                return mech;
              });

              const mechScore = updatedMechs.reduce((sum, mech) =>
                sum + Object.values(mech.parts).reduce((partSum, part) => partSum + (part?.score || 0), 0)
                + (mech.pilot?.score || 0), 0
              );
              const droneScore = selectedTeam.drones.reduce((sum, drone) => sum + drone.score, 0);

              updateTeam(selectedTeam.id, {
                mechs: updatedMechs,
                totalScore: mechScore + droneScore
              });
            }
          }}
        />
      </div>}





    </div>
  );
}
