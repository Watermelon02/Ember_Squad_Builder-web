import React, { useState, useEffect } from 'react';
import { TeamList } from './components/TeamList';
import { MechList } from './components/MechList';
import { PartSelector } from './components/partSelector/desktop/PartSelector';
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

import PartComparePanel from './components/partSelector/desktop/PartComparePanel';
import DroneComparePanel from './components/partSelector/desktop/DroneComparePanel';

import { Button } from './components/ui/button';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import PilotComparePanel from './components/partSelector/desktop/PilotComparePanel';
import { PartSelectorMobile } from './components/partSelector/mobile/PartSelectorMobile';
import PilotComparePanelMobile from './components/partSelector/mobile/pilot/PilotComparePanelMobile';
import PartComparePanelMobile from './components/partSelector/mobile/part/PartComparePanelMobile';
import DroneComparePanelMobile from './components/partSelector/mobile/drone/DroneComparePanelMobile';
import TacticCardComparePanel from './components/partSelector/desktop/TacticCardComparePanel';
import TacticCardComparePanelMobile from './components/partSelector/mobile/tacticCard/TacticCardComparePanelMobile';
import { MechListMobile } from './components/MechListMobile';



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
  const [lastSelectPart, setLastSelectPart] = useState<Part>()
  const [lastSelectPilot, setLastSelectPilot] = useState<Pilot>()
  const [lastSelectDrone, setLastSelectDrone] = useState<Drone>()
  const [lastSelectTacticCard, setLastSelectTacticCard] = useState<TacticCard>()


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
      setLastPartId('');

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
      <>
        <style>
          {`
      @keyframes bgFloat {
        0%   { transform: scale(1) translateX(0); }
        50%  { transform: scale(1.03) translateX(0.5vw); }
        100% { transform: scale(1) translateX(0); }
      }

      @keyframes buttonPulse {
        0%   { transform: scale(1); box-shadow: 0 0 14px rgba(255,255,255,0.5); }
        50%  { transform: scale(1.05); box-shadow: 0 0 28px rgba(255,255,255,0.9); }
        100% { transform: scale(1); box-shadow: 0 0 14px rgba(255,255,255,0.5); }
      }
    `}
        </style>

        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage: `url("res/intro.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            animation: "bgFloat 12s ease-in-out infinite",
            overflow: "hidden",
          }}
        >
          <div style={{ textAlign: "center" }}>
            {/* 文字 */}
            <p
              style={{
                marginBottom: "1rem",
                color: "white",
                textShadow: `
            -1px -1px 1px #000,
             1px -1px 1px #000,
            -1px  1px 1px #000,
             1px  1px 1px #000,
             0px  0px 6px rgba(0,0,0,1)
          `,
                fontWeight: "bold",
                fontSize: isMobileOrTablet ? "3.4vw" : "1.4vw", // 移动设备更大
              }}
            >
              {t.t65}
            </p>

            {/* 按钮 */}
            <button
              onClick={() => initNewTeam('RDL')}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "12px",
                color: "white",
                fontWeight: "bold",
                fontSize: isMobileOrTablet ? "4vw" : "1.2vw", // 移动设备更大

                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                backgroundColor: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.4)",
                textShadow: `
            -1px -1px 1px #000,
             1px -1px 1px #000,
            -1px  1px 1px #000,
             1px  1px 1px #000,
             0 0 6px rgba(255,255,255,0.9)
          `,
                cursor: "pointer",
                animation: "buttonPulse 3.2s ease-in-out infinite",
                transition: "0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.22)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
              }}
            >
              {t.t66}
            </button>
          </div>
        </div>
      </>

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

  // 更新机甲部件
  function handleSelectPart(part: Part) {
    if (!selectedTeam || !selectedMechId) return;
    setHoverImg(part.id);
    const updatedMechs = selectedTeam.mechs.map((mech) =>
      mech.id === selectedMechId
        ? { ...mech, parts: { ...mech.parts, [selectedPartType]: part } }
        : mech
    );

    updateTeam(selectedTeam.id, {
      mechs: updatedMechs,
      totalScore: calculateTotalScore(selectedTeam.drones, selectedTeam.tacticCards, updatedMechs),
    });

    setHoverImg("");
    //电脑端点击部件直接装备并关闭弹窗`
    setIsChangingPart(false);
  }

  function handleSelectPartMobile(part: Part) {
    if (!selectedTeam || !selectedMechId) return;
    setHoverImg(part.id);
    if (lastSelectPart !== undefined && lastSelectPart.id === part.id) {
      // 移动端在部件选择列表选中部件后，第一次先不直接装备该部件，而是显示其预览图，第二次才装备
      const updatedMechs = selectedTeam.mechs.map((mech) =>
        mech.id === selectedMechId
          ? { ...mech, parts: { ...mech.parts, [selectedPartType]: part } }
          : mech
      );

      updateTeam(selectedTeam.id, {
        mechs: updatedMechs,
        totalScore: calculateTotalScore(selectedTeam.drones, selectedTeam.tacticCards, updatedMechs),
      });

      setHoverImg("")
      setIsChangingPart(false)
    }
    setLastSelectPart(part);
  }



  // 更新无人机
  function handleSelectDrone(drone: Drone) {
    if (!selectedTeam) return;
    setHoverImg(drone.id);
    const updatedDrones = [...selectedTeam.drones, drone];

    updateTeam(selectedTeam.id, {
      drones: updatedDrones,
      totalScore: calculateTotalScore(updatedDrones, selectedTeam.tacticCards, selectedTeam.mechs),
      largeDroneCount: updatedDrones.filter((d) => d.type === "large").length,
      mediumDroneCount: updatedDrones.filter((d) => d.type === "medium").length,
      smallDroneCount: updatedDrones.filter((d) => d.type === "small").length,
    });
    setHoverImg("")
    setIsChangingPart(false);
  }

  function handleSelectDroneMobile(drone: Drone) {
    if (!selectedTeam) return;
    setHoverImg(drone.id);

    if (lastSelectDrone && lastSelectDrone.id === drone.id) {
      const updatedDrones = [...selectedTeam.drones, drone];

      updateTeam(selectedTeam.id, {
        drones: updatedDrones,
        totalScore: calculateTotalScore(updatedDrones, selectedTeam.tacticCards, selectedTeam.mechs),
        largeDroneCount: updatedDrones.filter((d) => d.type === "large").length,
        mediumDroneCount: updatedDrones.filter((d) => d.type === "medium").length,
        smallDroneCount: updatedDrones.filter((d) => d.type === "small").length,
      });
      setIsChangingPart(false);
      setHoverImg("")

    }
    setLastSelectDrone(drone);
  }

  // 更新战术卡
  function handleSelectTacticCard(tacticCard: TacticCard) {
    if (!selectedTeam) return;
    setHoverImg(tacticCard.id);
    const updatedTacticCards = [...(selectedTeam.tacticCards ?? []), tacticCard];

    updateTeam(selectedTeam.id, {
      tacticCards: updatedTacticCards,
      totalScore: calculateTotalScore(selectedTeam.drones, updatedTacticCards, selectedTeam.mechs),
    });
    setHoverImg("")
    setIsChangingPart(false);
  }

  function handleSelectTacticCardMobile(tacticCard: TacticCard) {
    if (!selectedTeam) return;
    setHoverImg(tacticCard.id);
    if (lastSelectTacticCard && lastSelectTacticCard.id === tacticCard.id) {
      const updatedTacticCards = [...(selectedTeam.tacticCards ?? []), tacticCard];

      updateTeam(selectedTeam.id, {
        tacticCards: updatedTacticCards,
        totalScore: calculateTotalScore(selectedTeam.drones, updatedTacticCards, selectedTeam.mechs),
      });
      setIsChangingPart(false);
      setHoverImg("");

    }

    setLastSelectTacticCard(tacticCard);
  }

  // 更新驾驶员
  function handleSelectPilot(pilot: Pilot) {
    if (!selectedTeam || !selectedMechId) return;
    setHoverImg(pilot.id);
    const updatedMechs = selectedTeam.mechs.map((mech) =>
      mech.id === selectedMechId ? { ...mech, pilot } : mech
    );

    updateTeam(selectedTeam.id, {
      mechs: updatedMechs,
      totalScore: calculateTotalScore(selectedTeam.drones, selectedTeam.tacticCards, updatedMechs),
    });
    setHoverImg("");

    setIsChangingPart(false);
  }

  function handleSelectPilotMobile(pilot: Pilot) {
    if (!selectedTeam || !selectedMechId) return;
    setHoverImg(pilot.id);

    if (lastSelectPilot !== undefined && lastSelectPilot.id === pilot.id) {
      const updatedMechs = selectedTeam.mechs.map((mech) =>
        mech.id === selectedMechId ? { ...mech, pilot } : mech
      );
      updateTeam(selectedTeam.id, {
        mechs: updatedMechs,
        totalScore: calculateTotalScore(selectedTeam.drones, selectedTeam.tacticCards, updatedMechs),
      });
      setHoverImg("");
      setIsChangingPart(false);
    }
    setLastSelectPilot(pilot);
  }

  // ------------------ 渲染 ------------------
  return (
    <div className="fixed inset-0 bg-gray-100 flex overflow-hidden">

      {/* 三栏主容器 */}
      <div
        className={`flex flex-1 ${!isMobileOrTablet ? 'gap-4 p-4' : ''} overflow-hidden`}
      >
        {isMobileOrTablet && <Button
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
        </Button>}
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

          {!isMobileOrTablet&&<MechList
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
          />}

          {isMobileOrTablet&& <MechListMobile
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
          />}
        </div>

        {/* 上方面板/弹窗 */}
        <AnimatePresence>
          {isMobileOrTablet ? (

            <AnimatePresence>
              {isChangingPart && (
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
                        height: "100%",
                        width: "100%",
                        backgroundColor: "rgba(255,255,255,0.5)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        display: "flex",
                        flexDirection: "column",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* 左上角关闭按钮 */}
                      <button
                        onClick={() => {setIsChangingPart(false);setHoverImg("")}}
                        style={{
                          position: "absolute",
                          zIndex: 20,
                          padding: "1vh 1vw",
                          backgroundColor: "rgba(0,0,0,0.6)",
                          color: "white",
                          borderRadius: "0.375rem",
                          fontWeight: "bold",
                        }}
                      >
                        <ChevronDown />
                      </button>

                      {viewMode === "parts" && (
                        <PartComparePanelMobile
                          lastPartId={lastPartId}
                          hoverId={hoverImg}
                          factionParts={factionParts}
                          imageSrc={imageSrc}
                          compareMode={compareMode}
                          viewMode={viewMode}
                        />
                      )}


                      {viewMode === "pilots" &&
                        <PilotComparePanelMobile
                          lastPilotId={lastPartId}
                          hoverId={hoverImg}
                          factionPilots={factionPilots}
                          imageSrc={imageSrc}
                          compareMode={compareMode}
                          viewMode={viewMode}
                          tabsrc={tabSrc}
                          lang={lang}
                        />}

                        {(viewMode === "drones") &&
                        <DroneComparePanelMobile
                          lastPartId={lastPartId}
                          hoverId={hoverImg}
                          factionDrones={factionDrones}
                          imageSrc={imageSrc}
                          compareMode={compareMode}
                          viewMode={viewMode}
                        />}

                      {(viewMode === "tacticCards") &&
                        <TacticCardComparePanelMobile
                          lastPartId={lastPartId}
                          hoverId={hoverImg}
                          tacticCards={allTacticCards}
                          imageSrc={imageSrc}
                          compareMode={compareMode}
                          viewMode={viewMode}
                        />}

                      {/* 下侧 PartSelector */}
                      <div
                        className="flex-1 relative"
                        style={{
                          backgroundColor: "white",
                          overflowY: "auto",
                        }}
                      >
                        <PartSelectorMobile
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
                          onSelectPart={handleSelectPartMobile}
                          onSelectDrone={handleSelectDroneMobile}
                          onSelectTacticCard={handleSelectTacticCardMobile}
                          onSelectPilot={handleSelectPilotMobile}
                          tabSmallSrc={tabSmallSrc}
                        />
                      </div>
                    </motion.div>

                  </motion.div>
                </>
              )}
            </AnimatePresence>
          ) : (
            // 桌面端：Dialog 弹窗
            <AnimatePresence>
              {isChangingPart && (
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
                        maxWidth:
                          viewMode === "drones"
                            ? "80vw"
                            : viewMode === "tacticCards"
                              ? "40vw"
                              : "60vw",
                        backgroundColor: "rgba(255,255,255,0.5)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        display: "flex",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {viewMode === "parts" &&
                        <PartComparePanel
                          lastPartId={lastPartId}
                          hoverId={hoverImg}
                          factionParts={factionParts}
                          imageSrc={imageSrc}
                          compareMode={compareMode}
                          viewMode={viewMode}
                        />}

                      {viewMode === "pilots" &&
                        <PilotComparePanel
                          lastPilotId={lastPartId}
                          hoverId={hoverImg}
                          factionPilots={factionPilots}
                          imageSrc={imageSrc}
                          compareMode={compareMode}
                          viewMode={viewMode}
                          tabsrc={tabSrc}
                          lang={lang}
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
                      <div
                        className="flex-1 relative"
                        style={{
                          backgroundColor: "white",
                          overflowY: "auto",
                        }}
                      >
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

                          onSelectPart={handleSelectPart}
                          onSelectDrone={handleSelectDrone}
                          onSelectTacticCard={handleSelectTacticCard}
                          onSelectPilot={handleSelectPilot}
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
