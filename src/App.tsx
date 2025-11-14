import React, { useState, useEffect } from 'react';
import { TeamList } from './components/TeamList';
import { MechList } from './components/MechList';
import { PartSelector } from './components/partSelector/PartSelector';
import { Team, Mech, Part, Drone, Pilot, PART_TYPE_NAMES, FACTION_NAMES, TacticCard, calculateTotalScore } from './types';

import { translations } from './i18n';
import { IMAGE_SRC, LOCAL_IMAGE_SRC, MECH_IMAGE_SRC, TAB_IMAGE_SRC, TAB_SMALL_IMAGE_SRC } from './resource';
import * as zhData from './data';
import * as enData from './data_en';
import * as jpData from './data_jp';
import { getDeviceFingerprint } from './remote';

import { motion, AnimatePresence } from "framer-motion";
import { SlidePanel } from './components/custom/SlidePanel';
import { TeamListMobile } from './components/TeamListMobile';
import { PartSelectorMobile } from './components/partSelector/PartSelectorMobile';
import PartPreview from './components/partSelector/PartPreview';
import PartComparePanel from './components/partSelector/PartComparePanel';
import DroneComparePanel from './components/partSelector/DroneComparePanel';
import TacticCardComparePanel from './components/partSelector/TacticCardComparePanel';


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
  const [lastViewMode, setLastViewMode] = useState<string>("");
  //前部件ID
  const [lastPartId, setLastPartId] = useState<string>('');
  const [compareMode, setCompareMode] = useState<boolean>(() => {
    // 初始化时从 localStorage 获取
    const stored = localStorage.getItem("showHoverImg");
    return stored !== null ? JSON.parse(stored) : true;
  });
  const [isChangingPart, setIsChangingPart] = useState<boolean>(false);
  const typePartNames = PART_TYPE_NAMES[lang];
  const factionNames = FACTION_NAMES[lang];
  const imageSrc = IMAGE_SRC[lang];
  const tabSrc = TAB_IMAGE_SRC[lang];
  const tabSmallSrc = TAB_SMALL_IMAGE_SRC[lang];
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
    localStorage.setItem("showHoverImg", JSON.stringify(compareMode));
  }, [compareMode]);

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
    if (viewMode !== lastViewMode) {

      setHoverImg("")
    }
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
    setLastViewMode(viewMode)
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
          {isMobileOrTablet ? (
            <SlidePanel
              collapsed={collapsedLeft}
              onClose={() => setCollapsedLeft(true)}
              position="left"
              width="80%"
              height="100vh"
              panelBgColor="#F9FAFB"
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
              className="shadow-xl transition-all duration-300 ease-in-out rounded-lg"
              style={{
                width: collapsedLeft ? '0' : '22vw',
                height: '100%',
                backgroundColor: 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.1)',
                opacity: collapsedLeft ? 0 : 1,

                display: 'flex',      // 🔥 关键
                flexDirection: 'column',
                minHeight: 0,         // 🔥 必须：允许内部滚动区域收缩
                overflow: 'hidden',   // 外层控制边框和裁切，不破坏内层滚动
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
                onChampionModeChange={isChampion => setChampionMode(isChampion)}

              />
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
            onSetIsChangingPart={(changingPart) => { setIsChangingPart(changingPart) }}
            onSelectDrone={(d) => { setLastPartId(d.id) }}

          />
        </div>

        {/* 右侧面板/弹窗 */}
        <AnimatePresence>
          {isMobileOrTablet ? (
            // 移动端仍然使用 SlidePanel
            <SlidePanel
              collapsed={collapsedRight}
              onClose={() => setCollapsedRight(true)}
              position="right"
              width="80%"
              height="100vh"
              panelBgColor="#F9FAFB"
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
                tabSmallSrc={tabSmallSrc}
                onSetHoverImg={handleHoverImg}
                onSetShowHoverImg={setCompareMode}
                showHoverImg={compareMode}
                mobileOrTablet={isMobileOrTablet}
                lastScore={lastScore}
                lastPartId={lastPartId}
                onSelectPart={(part) => {
                  if (selectedTeam && selectedMechId) {
                    const updatedMechs = selectedTeam.mechs.map(mech =>
                      mech.id === selectedMechId
                        ? { ...mech, parts: { ...mech.parts, [selectedPartType]: part } }
                        : mech
                    );
                    updateTeam(selectedTeam.id, {
                      mechs: updatedMechs,
                      totalScore: calculateTotalScore(selectedTeam.drones, selectedTeam.tacticCards, updatedMechs),
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
                    const updatedMechs = selectedTeam.mechs.map(mech =>
                      mech.id === selectedMechId ? { ...mech, pilot } : mech
                    );
                    updateTeam(selectedTeam.id, {
                      mechs: updatedMechs,
                      totalScore: calculateTotalScore(selectedTeam.drones, selectedTeam.tacticCards, updatedMechs),
                    });
                  }
                  setCollapsedRight(true);
                }}
              />
            </SlidePanel>
          ) : (
            // 桌面端：Dialog 弹窗
            <AnimatePresence>
              {isChangingPart && !isMobileOrTablet && (
                <>
                  {/* 遮罩 */}
                  <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    onClick={() => setIsChangingPart(false)}
                  >
                    {/* 弹窗主体 */}
                    <motion.div
                      className="relative flex rounded-lg overflow-hidden shadow-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      style={{

                        maxHeight: "90vh",
                        maxWidth:viewMode==="tacticCards"?"40vw":"90vw",
                        backgroundColor: "rgba(255,255,255,0.5)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        display: "flex",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {(viewMode === "parts" || viewMode === "pilots") &&
                        <PartComparePanel
                          lastPartId={lastPartId}
                          hoverId={hoverImg}
                          factionParts={factionParts}
                          imageSrc={imageSrc}
                          compareMode={compareMode}
                          viewMode={viewMode}
                        />}

                      {(viewMode === "drones") &&
                        <DroneComparePanel
                          lastPartId={lastPartId}
                          hoverId={hoverImg}
                          factionDrones={factionDrones}
                          imageSrc={imageSrc}
                          compareMode={compareMode}
                          viewMode={viewMode}
                        />}

                        {(viewMode === "tacticCards") &&
                        <TacticCardComparePanel
                          lastPartId={lastPartId}
                          hoverId={hoverImg}
                          tacticCards={allTacticCards}
                          imageSrc={imageSrc}
                          compareMode={compareMode}
                          viewMode={viewMode}
                        />}

                      {/* 右侧 PartSelector */}
                      <div className="flex-1 relative">
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
                          onSetHoverImg={handleHoverImg}
                          onSetShowHoverImg={setCompareMode}
                          showHoverImg={compareMode}
                          mobileOrTablet={false}
                          lastScore={lastScore}
                          lastPartId={lastPartId}
                          onSelectPart={(part) => {
                            if (selectedTeam && selectedMechId) {
                              const updatedMechs = selectedTeam.mechs.map((mech) =>
                                mech.id === selectedMechId
                                  ? { ...mech, parts: { ...mech.parts, [selectedPartType]: part } }
                                  : mech
                              );
                              updateTeam(selectedTeam.id, {
                                mechs: updatedMechs,
                                totalScore: calculateTotalScore(
                                  selectedTeam.drones,
                                  selectedTeam.tacticCards,
                                  updatedMechs
                                ),
                              });
                            }
                            setIsChangingPart(false);
                          }}
                          onSelectDrone={(drone) => {
                            if (selectedTeam) {
                              const updatedDrones = [...selectedTeam.drones, drone];
                              updateTeam(selectedTeam.id, {
                                drones: updatedDrones,
                                totalScore: calculateTotalScore(updatedDrones, selectedTeam.tacticCards, selectedTeam.mechs),
                                largeDroneCount: updatedDrones.filter((d) => d.type === "large").length,
                                mediumDroneCount: updatedDrones.filter((d) => d.type === "medium").length,
                                smallDroneCount: updatedDrones.filter((d) => d.type === "small").length,
                              });
                            }
                            setIsChangingPart(false);
                          }}
                          onSelectTacticCard={(tacticCard) => {
                            if (selectedTeam) {
                              const updatedTacticCards = [...(selectedTeam.tacticCards ?? []), tacticCard];
                              updateTeam(selectedTeam.id, {
                                tacticCards: updatedTacticCards,
                                totalScore: calculateTotalScore(selectedTeam.drones, updatedTacticCards, selectedTeam.mechs),
                              });
                            }
                            setIsChangingPart(false);
                          }}
                          onSelectPilot={(pilot) => {
                            if (selectedTeam && selectedMechId) {
                              const updatedMechs = selectedTeam.mechs.map((mech) =>
                                mech.id === selectedMechId ? { ...mech, pilot } : mech
                              );
                              updateTeam(selectedTeam.id, {
                                mechs: updatedMechs,
                                totalScore: calculateTotalScore(selectedTeam.drones, selectedTeam.tacticCards, updatedMechs),
                              });
                            }
                            setIsChangingPart(false);
                          }}
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>




          )}
        </AnimatePresence>

      </div>
    </div>

  );
}
