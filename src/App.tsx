import React, { useState, useEffect } from 'react';
import { TeamList } from './components/TeamList';
import { MechList } from './components/MechList';
import { PartSelector } from './components/PartSelector';
import { Team, Mech, Part, Drone, Pilot, PART_TYPE_NAMES, FACTION_NAMES, TacticCard, calculateTotalScore } from './types';
import { Button } from './components/ui/button';
import { translations } from './i18n';
import { IMAGE_SRC, LOCAL_IMAGE_SRC, MECH_IMAGE_SRC, TAB_IMAGE_SRC } from './resource';
import * as zhData from './data';
import * as enData from './data_en';
import * as jpData from './data_jp';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import { getDeviceFingerprint } from './remote';
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { SlidePanel } from './components/ui/SlidePanel';
import { PartSelectorMobile } from './components/PartSelectorMobile';
import { TeamListMobile } from './components/TeamListMobile';

export default function App() {
  // ------------------ 语言 ------------------
  const [lang, setLang] = useState<"en" | "zh" | "jp">(() => {
    return (localStorage.getItem("lang") as "en" | "zh" | "jp") || "zh";
  });
  const t = translations[lang];

  // ------------------ 队伍状态 ------------------
  const [teams, setTeams] = useState<Team[]>(() => {
    const v = localStorage.getItem("version");
    if (v !== "3") {
      localStorage.clear();
      localStorage.setItem("version", "3");
    }
    const saved = localStorage.getItem('teams');
    return saved ? JSON.parse(saved) : [];  // 空数组而不是默认队伍
  });


  const [selectedTeamId, setSelectedTeamId] = useState<string>(() => {
    const saved = localStorage.getItem('teams');
    const teams: Team[] = saved ? JSON.parse(saved) : [1];
    return teams[0]?.id || ''; // 如果有队伍就默认选第一个，否则空
  });

  const [selectedMechId, setSelectedMechId] = useState<string>('');
  const [selectedPartType, setSelectedPartType] = useState<string>('torso');
  const [viewMode, setViewMode] = useState<'parts' | 'drones' | 'pilots' | 'tacticCards'>('parts');
  const [hoverImg, setHoverImg] = useState<string | null>("null");
  //前部件分数
  const [lastScore, setLastScore] = useState<number>(0);
  //前部件ID
  const [lastPartId, setLastPartId] = useState<string>('');
  const [showHoverImg, setShowHoverImg] = useState<boolean>(() => {
    // 初始化时从 localStorage 获取
    const stored = localStorage.getItem("showHoverImg");
    return stored !== null ? JSON.parse(stored) : true;
  });

  const typePartNames = PART_TYPE_NAMES[lang];
  const factionNames = FACTION_NAMES[lang];
  const imageSrc = IMAGE_SRC[lang];
  const tabSrc = TAB_IMAGE_SRC[lang];
  const localImgsrc = LOCAL_IMAGE_SRC[lang];
  const mechImgsrc = MECH_IMAGE_SRC[lang];

  let selectedTeam = teams.find(team => team.id === selectedTeamId);

  // ------------------ 移动端判断 ------------------
  const [isMobileOrTablet, setMobileOrTablet] = useState(false);

  const [isChampionMode, setChampionMode] = useState(false);

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
      window.location.replace(window.location.href)
    }
  }, []);

  useEffect(() => {
    const mobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
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

  // 每次 showHoverImg 改变时保存到 localStorage
  useEffect(() => {
    localStorage.setItem("showHoverImg", JSON.stringify(showHoverImg));
  }, [showHoverImg]);

  // ------------------ 保存到 localStorage & 服务器 ------------------
  async function saveTeam(team: Team) {
    team.deviceID = await getDeviceFingerprint()
    // try {
    //   await axios.post("https://4watermelon.fun/api/teams/save", team);
    // } catch (err) {
    //   console.error("保存失败:", err);
    // }
  }

  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
    if (selectedTeam) saveTeam(selectedTeam);
  }, [teams]);

  // ------------------ 当前部件分数和id，用于在部件选择列表中进行对比 ------------------
  useEffect(() => {
    if (!selectedTeam) return;

    const cMech = selectedTeam.mechs.find(mech => mech.id === selectedMechId);
    if (!cMech) {
      setLastScore(0);
      return;
    }

    let score = 0;
    if (viewMode === 'parts') {
      score = cMech.parts[selectedPartType]?.score ?? 0;
      setLastPartId(cMech.parts[selectedPartType]?.id || '');
    } else if (viewMode === 'pilots') {
      score = cMech.pilot?.score ?? 0;
      setLastPartId(cMech.pilot?.id || '');
    }
    setLastScore(score);
  }, [selectedTeam, selectedMechId, selectedPartType, viewMode]);


  if (!data) return <div>加载中...</div>;

  const {
    gofBackpack, gofChasis, gofDrones, gofLeftHand, gofPilots, gofRightHand, gofTorso,
    pdBackpack, pdChasis, pdDrones, pdLeftHand, pdPilots, pdRightHand, pdTorso,
    rdlBackpack, rdlChasis, rdlDrones, rdlLeftHand, rdlPilots, rdlRightHand, rdlTorso,
    unBackpack, unChasis, unDrones, unLeftHand, unPilots, unRightHand, unTorso, allTacticCards
  } = data;

  // ------------------ 添加/初始化团队 ------------------
  const addTeam = (faction: 'RDL' | 'UN' | 'GOF' | 'PD', teamData?: Partial<Team>) => {
    // 先复制机甲数组，如果存在的话
    const mechsWithId: Mech[] = (teamData?.mechs || []).map(mech => ({
      ...mech,
      id: Date.now().toString() + Math.random().toString(36).slice(2), // 确保每个id唯一
    }));

    const newTeam: Team = {
      id: Date.now().toString(),
      name: teamData?.name || t.t64,
      faction,
      mechs: mechsWithId,
      drones: teamData?.drones || [],
      tacticCards: teamData?.tacticCards || [],
      totalScore: teamData?.totalScore || 0,
      mechCount: mechsWithId.length,
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
  const handleSetViewMode = (mode: 'parts' | 'drones' | 'pilots' | 'tacticCards') => {
    const lastViewMode = viewMode;
    setViewMode(mode);
    if (isMobileOrTablet) {
      if ((lastViewMode !== 'drones' && mode === 'drones') || (lastViewMode === 'drones' && mode !== 'drones')) { }
      else if ((lastViewMode !== 'tacticCards' && mode === 'tacticCards') || (lastViewMode === 'tacticCards' && mode !== 'tacticCards')) { }
      else {
        setCollapsedRight(false); // 用户操作时展开浮层
      }
    }
  };

  // ------------------ 设置部件选择预览图 ------------------
  const handleHoverImg = (img: string | null) => {
    if (img !== null) {
      setHoverImg(img);
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
    // try {
    //   team.deviceID = await getDeviceFingerprint();
    //   await axios.post("https://4watermelon.fun/api/teams/delete", team);
    // } catch (err) {
    //   console.error("删除失败:", err);
    // }
    setTeams(prev => {
      const filtered = prev.filter(t => t.id !== teamId);
      // 如果删除的是当前选中的队伍
      if (selectedTeamId === teamId) {
        setSelectedTeamId(filtered[0]?.id || '');
      }
      return filtered;
    });

    if (selectedTeamId === teamId && teams.length > 1) {
      const remainingTeams = teams.filter(t => t.id !== teamId);
      setSelectedTeamId(remainingTeams[0]?.id || '');
    }
  };

  // ------------------ 渲染 ------------------
  return (
    <div className="fixed inset-0 bg-gray-100 flex overflow-hidden">

      {/* 三栏主容器 */}
      <div
        className={`flex flex-1 ${!isMobileOrTablet ? 'gap-4 p-4' : ''} overflow-hidden`}
      >
        {/* 左侧小队列表 */}
        <div className="relative flex flex-col">
          <Button
            size="sm"
            className="absolute top-3 left-3 z-50 flex items-center justify-center w-10 h-10 shadow transition-all duration-300 ease-in-out"
            style={{ backgroundColor: 'rgba(75,85,99,0.2)' }}
            onClick={() => setCollapsedLeft(prev => !prev)}
          >
            {collapsedLeft ? (
              <ChevronRight className="w-5 h-5" stroke="white" />
            ) : (
              <ChevronLeft className="w-5 h-5" stroke="white" />
            )}
          </Button>

          {isMobileOrTablet ? (
            <SlidePanel
              collapsed={collapsedLeft}
              onClose={() => setCollapsedLeft(true)}
              position="left"
              width="80%"
              height="100vh"
            >
              <TeamListMobile
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
                tabsrc={tabSrc}
                championMode={isChampionMode}
                onChampionModeChange={isChampion => setChampionMode(isChampion)}
              />
            </SlidePanel>
          ) : (
            <div
              className="overflow-y-auto min-h-0 shadow-xl transition-all duration-300 ease-in-out rounded-lg"
              style={{
                width: collapsedLeft ? '0' : '22vw',
                height: '100%',
                backgroundColor: 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.1)',
                opacity: collapsedLeft ? 0 : 1,
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
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
                tabsrc={tabSrc}
                championMode={isChampionMode}
                onChampionModeChange={isChampion => setChampionMode(isChampion)} />
            </div>
          )}
        </div>


        {/* 中间机体列表 */}
        <div
          className="flex-1 flex flex-col overflow-hidden  shadow-xl rounded-lg "
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.5)', // 半透明白色，更白
            backdropFilter: 'blur(16px)',              // 毛玻璃模糊
            WebkitBackdropFilter: 'blur(16px)',        // Safari 支持
            border: '1px solid rgba(255, 255, 255, 0.1)' // 半透明边框
          }}
        >
          {/* 屏幕中央的悬浮大图 */}
          <AnimatePresence>
            {!isMobileOrTablet && showHoverImg && hoverImg !== "null" && (
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none flex items-center justify-center"
                style={{
                  maxWidth: collapsedLeft ? "30%" : "80%",
                  maxHeight: collapsedLeft ? "30%" : "80%",
                  backgroundColor: "rgba(255,255,255,0.5)", // 白色半透明背景
                  borderRadius: "0.375rem",
                  padding: "0.25rem"
                }}
                initial={{ opacity: 0, scale: 0.8 }}    // 初始状态
                animate={{ opacity: 1, scale: 1 }}      // 出现动画
                exit={{ opacity: 0, scale: 0.8 }}       // 消失动画
                transition={{ duration: 0.3, ease: "easeOut" }} // 动画时长和缓动
              >
                {(viewMode !== 'drones' && viewMode !== 'tacticCards' && lastPartId !== '') &&
                  <img
                    src={`${imageSrc}/${lastPartId}.png`}
                    alt="last preview"
                    className="max-w-full max-h-full object-contain rounded-md shadow-lg"
                  />}
                <img
                  src={hoverImg}
                  alt="preview"
                  className="max-w-full max-h-full object-contain rounded-md shadow-lg"
                />
              </motion.div>
            )}
          </AnimatePresence>



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
            championMode={isChampionMode}
            mechImgSrc={mechImgsrc}
          />
        </div>

        {/* 右侧面板 */}
        <AnimatePresence>
          {isMobileOrTablet ? (
            <SlidePanel
              collapsed={collapsedRight}
              onClose={() => setCollapsedRight(true)}
              position="right"
              width="80%"
              height="100vh"
            >
              <PartSelectorMobile
              className="overflow-y-auto h-full -webkit-overflow-scrolling-touch"
                viewMode={viewMode}
                team={selectedTeam}
                selectedPartType={selectedPartType}
                parts={factionParts}
                drones={factionDrones}
                pilots={factionPilots}
                translations={t}
                tacticCards={allTacticCards}
                partTypeNames={typePartNames}
                imgsrc={imageSrc}
                tabsrc={tabSrc}
                onSetHoverImg={(img) => handleHoverImg(img)}
                onSetShowHoverImg={(show) => setShowHoverImg(show)}
                showHoverImg={showHoverImg}
                mobileOrTablet={isMobileOrTablet}
                lastScore={lastScore}
                lastPartId={lastPartId}
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

                    updateTeam(selectedTeam.id, {
                      mechs: updatedMechs,
                      totalScore: calculateTotalScore(selectedTeam.drones, selectedTeam.tacticCards, updatedMechs)
                    });
                  }
                  setCollapsedRight(true);
                }}
                onSelectDrone={(drone) => {
                  if (selectedTeam) {
                    const updatedDrones = [...selectedTeam.drones, drone];

                    updateTeam(selectedTeam.id, {
                      drones: updatedDrones,
                      totalScore: calculateTotalScore(updatedDrones, selectedTeam.tacticCards, selectedTeam.mechs),
                      largeDroneCount: updatedDrones.filter(d => d.type === 'large').length,
                      mediumDroneCount: updatedDrones.filter(d => d.type === 'medium').length,
                      smallDroneCount: updatedDrones.filter(d => d.type === 'small').length,
                    });
                  }
                  setCollapsedRight(true);
                }}
                onSelectTacticCard={(tacticCard) => {
                  if (selectedTeam) {
                    const updatedTacticCards = [...(selectedTeam.tacticCards ?? []), tacticCard];

                    updateTeam(selectedTeam.id, {
                      tacticCards: updatedTacticCards,
                      totalScore: calculateTotalScore(selectedTeam.drones, updatedTacticCards, selectedTeam.mechs),
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


                    updateTeam(selectedTeam.id, {
                      mechs: updatedMechs,
                      totalScore: calculateTotalScore(selectedTeam.drones, selectedTeam.tacticCards, updatedMechs)
                    });
                  }
                  setCollapsedRight(true);
                }}
              />
            </SlidePanel>
          ) : (
            <div
              className="flex flex-col overflow-y-auto overflow-hidden shadow-xl rounded-lg"
              style={{
                backgroundColor: 'rgba(255,255,255,0.5)',
                width: '22vw',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {/* 右上角语言切换 */}
                            {!isMobileOrTablet && (
                              <div className="absolute top-2 right-3 flex items-center gap-2 p-2 z-50 ">
                                <Globe className="w-5 h-5 text-gray-600" />
                                <Select value={lang} onValueChange={v => setLang(v as "zh" | "en" | "jp")}>
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
                            )}
              <PartSelector
                viewMode={viewMode}
                team={selectedTeam}
                selectedPartType={selectedPartType}
                parts={factionParts}
                drones={factionDrones}
                pilots={factionPilots}
                translations={t}
                tacticCards={allTacticCards}
                partTypeNames={typePartNames}
                imgsrc={imageSrc}
                tabsrc={tabSrc}
                onSetHoverImg={(img) => handleHoverImg(img)}
                onSetShowHoverImg={(show) => setShowHoverImg(show)}
                showHoverImg={showHoverImg}
                mobileOrTablet={isMobileOrTablet}
                lastScore={lastScore}
                lastPartId={lastPartId}
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

                    updateTeam(selectedTeam.id, {
                      mechs: updatedMechs,
                      totalScore: calculateTotalScore(selectedTeam.drones, selectedTeam.tacticCards, updatedMechs)
                    });
                  }
                  setCollapsedRight(true);
                }}
                onSelectDrone={(drone) => {
                  if (selectedTeam) {
                    const updatedDrones = [...selectedTeam.drones, drone];

                    updateTeam(selectedTeam.id, {
                      drones: updatedDrones,
                      totalScore: calculateTotalScore(updatedDrones, selectedTeam.tacticCards, selectedTeam.mechs),
                      largeDroneCount: updatedDrones.filter(d => d.type === 'large').length,
                      mediumDroneCount: updatedDrones.filter(d => d.type === 'medium').length,
                      smallDroneCount: updatedDrones.filter(d => d.type === 'small').length,
                    });
                  }
                  setCollapsedRight(true);
                }}
                onSelectTacticCard={(tacticCard) => {
                  if (selectedTeam) {
                    const updatedTacticCards = [...(selectedTeam.tacticCards ?? []), tacticCard];

                    updateTeam(selectedTeam.id, {
                      tacticCards: updatedTacticCards,
                      totalScore: calculateTotalScore(selectedTeam.drones, updatedTacticCards, selectedTeam.mechs),
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


                    updateTeam(selectedTeam.id, {
                      mechs: updatedMechs,
                      totalScore: calculateTotalScore(selectedTeam.drones, selectedTeam.tacticCards, updatedMechs)
                    });
                  }
                  setCollapsedRight(true);
                }}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>

  );
}
