import React, { useState, useEffect } from 'react';
import { TeamList } from './components/teamList/TeamList';
import { MechList } from './components/mechList/desktop/MechList';
import { PartSelector } from './components/partSelector/desktop/PartSelector';
import { Team, Mech, Part, Drone, Pilot, PART_TYPE_NAMES, FACTION_NAMES, TacticCard, calculateTotalScore } from './data/types';

import { translations } from './i18n';
import { BACKGROUND_SRC, BOX_COVER_SRC, IMAGE_SRC, LOCAL_IMAGE_SRC, MECH_IMAGE_SRC, TAB_IMAGE_SRC, TAB_SMALL_IMAGE_SRC } from './data/resource';
import * as zhData from './data/data_cn';
import * as enData from './data/data_en';
import * as jpData from './data/data_jp';
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { SlidePanel } from './components/custom/SlidePanel';
import { TeamListMobile } from './components/teamList/TeamListMobile';

import PartComparePanel from './components/partSelector/desktop/PartComparePanel';
import DroneComparePanel from './components/partSelector/desktop/DroneComparePanel';

import { ChevronDown, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import PilotComparePanel from './components/partSelector/desktop/PilotComparePanel';
import { PartSelectorMobile } from './components/partSelector/mobile/PartSelectorMobile';
import PilotComparePanelMobile from './components/partSelector/mobile/pilot/PilotComparePanelMobile';
import PartComparePanelMobile from './components/partSelector/mobile/part/PartComparePanelMobile';
import DroneComparePanelMobile from './components/partSelector/mobile/drone/DroneComparePanelMobile';
import TacticCardComparePanel from './components/partSelector/desktop/TacticCardComparePanel';
import TacticCardComparePanelMobile from './components/partSelector/mobile/tacticCard/TacticCardComparePanelMobile';
import { MechListMobile } from './components/mechList/mobile/MechListMobile';
import { getDeviceFingerprint } from './util/RemoteUtil';

import { CompetitionDialog } from './components/competition/CompetitionDialog';
import TournamentView from './components/competition/TournamentView';

export default function App() {
  // ------------------ 语言 ------------------
  const [lang, setLang] = useState<"en" | "zh" | "jp">(() => {
    return (localStorage.getItem("lang") as "en" | "zh" | "jp") || "zh";
  });
  const t = translations[lang];
  const DATA_VERSION = "3";

  // ------------------ 比赛进度 ------------------
  const [showTournament, setShowTournament] = useState(false);

  // ------------------ 队伍状态 ------------------
  const [teams, setTeams] = useState<Team[]>(() => {
    const v = localStorage.getItem("version");
    if (v !== DATA_VERSION) {
      localStorage.clear();
      localStorage.setItem("version", DATA_VERSION);
    }
    const saved = localStorage.getItem('teams');
    return saved ? JSON.parse(saved) : [];
  });

  // ------------------ 用户已经购入的盒 状态 ------------------
  const [inventory, setInventory] = useState<Record<number, number>>(() => {
    const v = localStorage.getItem("version");
    if (v !== DATA_VERSION) {
      localStorage.clear();
      localStorage.setItem("version", DATA_VERSION);
    }
    const saved = localStorage.getItem('inventory');
    try { return saved ? JSON.parse(saved) : {}; }
    catch (e) { return {}; }
  });
  const [inventoryMode, setInventoryMode] = useState<boolean>(() => {
    return (localStorage.getItem("inventoryMode") === "true");
  });

  const [selectedTeamId, setSelectedTeamId] = useState<string>(() => {
    const saved = localStorage.getItem('teams');
    const teams: Team[] = saved ? JSON.parse(saved) : [1];
    return teams[0]?.id || '';
  });

  const [selectedMechId, setSelectedMechId] = useState<string>('');
  const [selectedPartType, setSelectedPartType] = useState<string>('torso');
  const [viewMode, setViewMode] = useState<'parts' | 'drones' | 'pilots' | 'tacticCards'>('parts');
  const [hoverImg, setHoverImg] = useState<string | null>("null");
  const [lastScore, setLastScore] = useState<number>(0);
  const [lastViewMode, setLastViewMode] = useState<string>("");
  const [lastPartId, setLastPartId] = useState<string>('');
  const [compareMode, setCompareMode] = useState<boolean>(() => {
    const stored = localStorage.getItem("compareMode");
    return stored !== null ? JSON.parse(stored) : true;
  });
  const [showSourceBox, setShowSourceBox] = useState<boolean>(() => {
    const stored = localStorage.getItem("showSourceBox");
    return stored !== null ? JSON.parse(stored) : true;
  });
  const [showTeamHintText, setShowTeamHintText] = useState(false);
  const [showKeyword, setShowKeyword] = useState<boolean>(() => {
    const stored = localStorage.getItem("showKeyword");
    return stored !== null ? JSON.parse(stored) : true;
  });
  const [isChangingPart, setIsChangingPart] = useState<boolean>(false);
  const [animationCardMode, setAnimationCardMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("animationCardMode");
    try { return saved ? JSON.parse(saved) : false; }
    catch (e) { return false; }
  });
  const [hideTacticCard, setHideTacticCard] = useState<boolean>(() => {
    const saved = localStorage.getItem("hideTacticCard");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    try { localStorage.setItem("animationCardMode", JSON.stringify(animationCardMode)); }
    catch (e) { }
  }, [animationCardMode]);

  const typePartNames = PART_TYPE_NAMES[lang];
  const factionNames = FACTION_NAMES[lang];
  const imageSrc = IMAGE_SRC[lang];
  const tabSrc = TAB_IMAGE_SRC[lang];
  const tabSmallSrc = TAB_SMALL_IMAGE_SRC[lang];
  const localImgsrc = LOCAL_IMAGE_SRC[lang];
  const mechImgsrc = MECH_IMAGE_SRC[lang];
  const boxCoverSrc = BOX_COVER_SRC[lang];
  const backgroundImgsrc = BACKGROUND_SRC[lang];

  let selectedTeam = teams.find(team => team.id === selectedTeamId);

  // ------------------ 移动端判断 ------------------
  const [isMobileOrTablet, setMobileOrTablet] = useState(false);

  const [isTournamentMode, setTournamentMode] = useState(false);
  const [collapsedLeft, setCollapsedLeft] = useState(isMobileOrTablet ? true : false);
  const [collapsedRight, setCollapsedRight] = useState(isMobileOrTablet ? true : false);
  const [lastSelectPart, setLastSelectPart] = useState<Part>();
  const [lastSelectPilot, setLastSelectPilot] = useState<Pilot>();
  const [lastSelectDrone, setLastSelectDrone] = useState<Drone>();
  const [lastSelectTacticCard, setLastSelectTacticCard] = useState<TacticCard>();

  const showCompetitionDialog = false;
  const BANNER_ID = 'competition_v2';
  const [competitionDialogOpen, setCompetitionDialogOpen] = useState(() => {
    return localStorage.getItem(`has_closed_${BANNER_ID}`) !== 'true';
  });
  const handleCompetitionDialogOpenChange = (open: boolean) => {
    setCompetitionDialogOpen(open);
    if (!open) localStorage.setItem(`has_closed_${BANNER_ID}`, 'true');
  };

  useEffect(() => {
    if (!sessionStorage.getItem('sw_cleared')) {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(r => r.unregister());
        });
      }
      if ('caches' in window) {
        caches.keys().then(names => names.forEach(n => caches.delete(n)));
      }
      sessionStorage.setItem('sw_cleared', 'true');
      window.location.replace(window.location.href);
    }
  }, []);

  useEffect(() => {
    const mobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setMobileOrTablet(mobile);
    if (mobile) { setCollapsedLeft(true); setCollapsedRight(true); }
  }, []);

  useEffect(() => { localStorage.setItem("showKeyword", JSON.stringify(showKeyword)); }, [showKeyword]);
  useEffect(() => { localStorage.setItem("compareMode", JSON.stringify(compareMode)); }, [compareMode]);
  useEffect(() => {
    localStorage.setItem("hideTacticCard", JSON.stringify(hideTacticCard));
  }, [hideTacticCard]);

  if (isMobileOrTablet === null) return null;

  useEffect(() => { localStorage.setItem("showSourceBox", JSON.stringify(compareMode)); }, [showSourceBox]);

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

  useEffect(() => { localStorage.setItem("showHoverImg", JSON.stringify(compareMode)); }, [compareMode]);

  // ------------------ 保存到 localStorage & 服务器 ------------------
  async function saveTeam(team: Team) {
    // team.deviceID = await getDeviceFingerprint();
    // try { axios.post("https://server.emberdice.site/api/teams/save", team); }
    // catch (err) { console.error("保存失败:", err); }
  }

  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
    if (selectedTeam) saveTeam(selectedTeam);
  }, [teams]);

  useEffect(() => {
    if (viewMode !== lastViewMode) { setLastPartId(''); setHoverImg(""); }
    if (!selectedTeam) return;
    const cMech = selectedTeam.mechs.find(mech => mech.id === selectedMechId);
    if (!cMech) { setLastScore(0); return; }
    let score = 0;
    if (viewMode === 'parts') {
      score = cMech.parts[selectedPartType]?.score ?? 0;
      setLastPartId(cMech.parts[selectedPartType]?.id || '');
    } else if (viewMode === 'pilots') {
      score = cMech.pilot?.score ?? 0;
      setLastPartId(cMech.pilot?.id || '');
    }
    setLastScore(score);
    setLastViewMode(viewMode);
  }, [selectedTeam, selectedMechId, selectedPartType, viewMode]);

  useEffect(() => {
    if (isMobileOrTablet) {
      setShowTeamHintText(true);
      const timer = setTimeout(() => setShowTeamHintText(false), 2300);
      return () => clearTimeout(timer);
    }
  }, [isMobileOrTablet]);

  useEffect(() => { localStorage.setItem('inventory', JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem('inventoryMode', JSON.stringify(inventoryMode)); }, [inventoryMode]);

  if (!data) return <div>加载中...</div>;

  const {
    gofBackpack, gofChasis, gofDrones, gofLeftHand, gofPilots, gofRightHand, gofTorso, gofProjectiles,
    pdBackpack, pdChasis, pdDrones, pdLeftHand, pdPilots, pdRightHand, pdTorso, pdProjectiles,
    rdlBackpack, rdlChasis, rdlDrones, rdlLeftHand, rdlPilots, rdlRightHand, rdlTorso,
    unBackpack, unChasis, unDrones, unLeftHand, unPilots, unRightHand, unTorso, allTacticCards
  } = data;

  // ------------------ 添加/初始化团队 ------------------
  const addTeam = (faction: 'RDL' | 'UN' | 'GOF' | 'PD', teamData?: Partial<Team>) => {
    const mechsWithId: Mech[] = (teamData?.mechs || []).map(mech => ({
      ...mech,
      id: Date.now().toString() + Math.random().toString(36).slice(2),
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

  function clearLastSelectState() {
    setLastSelectPart(undefined);
    setLastSelectDrone(undefined);
    setLastSelectPilot(undefined);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ██  比赛进度界面
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (showTournament) {
    // MechList 渲染器：传给 TournamentView 用于弹窗内展示
    const renderMechList = (team: Team) => (
      <div>
        {!isMobileOrTablet && <MechList
          team={team}
          inventory={inventory}
          selectedMechId=""
          onSelectMech={() => { }}
          onSelectPartType={() => { }}
          onUpdateTeam={updateTeam}
          onSetViewMode={() => { }}
          translations={t}
          partTypeNames={typePartNames}
          inventoryMode={inventoryMode}
          onsetInventoryMode={setInventoryMode}
          imgsrc={imageSrc}
          localImgsrc={localImgsrc}
          boxCoverSrc={boxCoverSrc}
          lang={lang}
          tabsrc={tabSrc}
          mobileOrTablet={false}
          setLanguage={setLang}
          tournamentMode={isTournamentMode}
          mechImgSrc={mechImgsrc}
          onSetIsChangingPart={() => { }}
          onSelectDrone={() => { }}
          animationCardMode={animationCardMode}
          setAnimationCardMode={setAnimationCardMode}
          onUpdateInventory={setInventory}
          competitionDialogOpen={false}
          setCompetitionDialogOpen={() => { }}
          showCompetitionDialog={false}
          hideTacticCard={hideTacticCard} setHideTacticCard={setHideTacticCard}
        />}
        {isMobileOrTablet && <MechListMobile
          team={team} selectedMechId={selectedMechId}
          onSelectMech={() => { }} onSelectPartType={() => { }}
          onUpdateTeam={() => { }} onSetViewMode={() => { }}
          translations={t} partTypeNames={typePartNames}
          imgsrc={imageSrc} localImgsrc={localImgsrc}
          lang={lang} tabsrc={tabSrc} mobileOrTablet={isMobileOrTablet}
          setLanguage={setLang} tournamentMode={isTournamentMode} mechImgSrc={mechImgsrc}
          onSetIsChangingPart={() => { }}
          onSelectDrone={() => { }}
          hideTacticCard={hideTacticCard} setHideTacticCard={setHideTacticCard}
        />}
      </div>
    );

    return (
      <TournamentView
        teams={teams}
        lang={lang}
        factionNames={factionNames}
        backgroundImgsrc={backgroundImgsrc}
        tabsrc={tabSrc}          // ← 新增
        translations={t}         // ← 新增
        onClose={() => {
          setShowTournament(false);
          setTournamentMode(false);
        }}
        mechListRenderer={renderMechList}
      />
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ██  空队伍状态（欢迎界面）
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (!selectedTeam) {
    return (
      <>
        <style>{`
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
        `}</style>
        <div style={{
          position: "fixed", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          backgroundImage: `url("res/intro.jpg")`,
          backgroundSize: "cover", backgroundPosition: "center",
          animation: "bgFloat 12s ease-in-out infinite", overflow: "hidden",
        }}>
          <div style={{ textAlign: "center" }}>
            <p style={{
              marginBottom: "1rem", color: "white",
              textShadow: `-1px -1px 1px #000, 1px -1px 1px #000, -1px 1px 1px #000, 1px 1px 1px #000, 0px 0px 6px rgba(0,0,0,1)`,
              fontWeight: "bold", fontSize: isMobileOrTablet ? "3.4vw" : "1.4vw",
            }}>
              {t.t65}
            </p>
            <button
              onClick={() => initNewTeam('RDL')}
              style={{
                padding: "0.75rem 1.5rem", borderRadius: "12px", color: "white", fontWeight: "bold",
                fontSize: isMobileOrTablet ? "4vw" : "1.2vw",
                backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
                backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.4)",
                textShadow: `-1px -1px 1px #000, 1px -1px 1px #000, -1px 1px 1px #000, 1px 1px 1px #000, 0 0 6px rgba(255,255,255,0.9)`,
                cursor: "pointer", animation: "buttonPulse 3.2s ease-in-out infinite", transition: "0.25s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.22)"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)"; }}
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
    const lvm = viewMode;
    setViewMode(mode);
    if (isMobileOrTablet) {
      if ((lvm !== 'drones' && mode === 'drones') || (lvm === 'drones' && mode !== 'drones')) { }
      else if ((lvm !== 'tacticCards' && mode === 'tacticCards') || (lvm === 'tacticCards' && mode !== 'tacticCards')) { }
      else { setCollapsedRight(false); }
    }
  };

  const handleHoverImg = (img: string | null) => { if (img !== null) setHoverImg(img); };

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
        case 'torso': return gofTorso.concat(pdTorso);
        case 'chasis': return gofChasis.concat(pdChasis);
        case 'leftHand': return gofLeftHand.concat(pdLeftHand);
        case 'rightHand': return gofRightHand.concat(pdRightHand);
        case 'backpack': return gofBackpack.concat(pdBackpack);
      }
    }
    return [];
  })();

  const factionDrones: Drone[] = (() => {
    switch (selectedTeam.faction) {
      case 'RDL': return rdlDrones.concat(pdDrones);
      case 'UN': return unDrones.concat(pdDrones);
      case 'GOF': return gofDrones.concat(pdDrones);
      case 'PD': return pdDrones;
    }
    return [];
  })();

  const mergePilots = (a: any[] = [], b: any[] = []) => [...(a || []), ...(b || [])].filter(p => p?.faction);
  const factionPilots: Pilot[] = (() => {
    switch (selectedTeam.faction) {
      case 'RDL': return mergePilots(rdlPilots, pdPilots);
      case 'UN': return mergePilots(unPilots, pdPilots);
      case 'GOF': return mergePilots(gofPilots, pdPilots);
      case 'PD': return pdPilots;
    }
    return [];
  })();

  function updateTeam(teamId: string, updates: Partial<Team>) {
    setTeams(prev => prev.map(team => team.id === teamId ? { ...team, ...updates } : team));
  }
  const copyTeam = (newTeam: Team) => {
    const teamWithNewId: Team = {
      ...newTeam,
      id: Date.now().toString() + Math.random().toString(36).slice(2)
    };

    setTeams(prev => [...prev, teamWithNewId]);
  };

  const deleteTeam = async (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    try {
      team.deviceID = await getDeviceFingerprint();
      axios.post("https://server.emberdice.site/api/teams/delete", team);
    } catch (err) { console.error("删除失败:", err); }
    setTeams(prev => {
      const filtered = prev.filter(t => t.id !== teamId);
      if (selectedTeamId === teamId) setSelectedTeamId(filtered[0]?.id || '');
      return filtered;
    });
    if (selectedTeamId === teamId && teams.length > 1) {
      const remaining = teams.filter(t => t.id !== teamId);
      setSelectedTeamId(remaining[0]?.id || '');
    }
  };

  // ------------------ 部件/无人机/战术卡/驾驶员 选择 ------------------
  function handleSelectPart(part: Part) {
    if (!selectedTeam || !selectedMechId) return;
    setHoverImg(part.id);
    const updatedMechs = selectedTeam.mechs.map(mech =>
      mech.id === selectedMechId ? { ...mech, parts: { ...mech.parts, [selectedPartType]: part } } : mech
    );
    updateTeam(selectedTeam.id, { mechs: updatedMechs, totalScore: calculateTotalScore(selectedTeam.drones, selectedTeam.tacticCards, updatedMechs) });
    setHoverImg(""); setIsChangingPart(false);
  }

  function handleSelectPartMobile(part: Part) {
    if (!selectedTeam || !selectedMechId) return;
    setHoverImg(part.id);
    if (lastSelectPart !== undefined && lastSelectPart.id === part.id) {
      const updatedMechs = selectedTeam.mechs.map(mech =>
        mech.id === selectedMechId ? { ...mech, parts: { ...mech.parts, [selectedPartType]: part } } : mech
      );
      updateTeam(selectedTeam.id, { mechs: updatedMechs, totalScore: calculateTotalScore(selectedTeam.drones, selectedTeam.tacticCards, updatedMechs) });
      setLastSelectPart(undefined); setHoverImg(""); setIsChangingPart(false);
    } else setLastSelectPart(part);
  }

  function handleSelectDrone(drone: Drone) {
    if (!selectedTeam) return;
    const updatedDrones = [...selectedTeam.drones, drone];
    updateTeam(selectedTeam.id, {
      drones: updatedDrones,
      totalScore: calculateTotalScore(updatedDrones, selectedTeam.tacticCards, selectedTeam.mechs),
      largeDroneCount: updatedDrones.filter(d => d.type === "large").length,
      mediumDroneCount: updatedDrones.filter(d => d.type === "medium").length,
      smallDroneCount: updatedDrones.filter(d => d.type === "small").length,
    });
    setHoverImg(""); setIsChangingPart(false);
  }

  function handleSelectDroneMobile(drone: Drone) {
    if (!selectedTeam) return;
    setHoverImg(drone.id);
    if (lastSelectDrone && lastSelectDrone.id === drone.id) {
      const updatedDrones = [...selectedTeam.drones, drone];
      updateTeam(selectedTeam.id, {
        drones: updatedDrones,
        totalScore: calculateTotalScore(updatedDrones, selectedTeam.tacticCards, selectedTeam.mechs),
        largeDroneCount: updatedDrones.filter(d => d.type === "large").length,
        mediumDroneCount: updatedDrones.filter(d => d.type === "medium").length,
        smallDroneCount: updatedDrones.filter(d => d.type === "small").length,
      });
      setIsChangingPart(false); setLastSelectDrone(undefined); setHoverImg("");
    } else setLastSelectDrone(drone);
  }

  function handleSelectTacticCard(tacticCard: TacticCard) {
    if (!selectedTeam) return;
    const updatedTacticCards = [...(selectedTeam.tacticCards ?? []), tacticCard];
    updateTeam(selectedTeam.id, { tacticCards: updatedTacticCards, totalScore: calculateTotalScore(selectedTeam.drones, updatedTacticCards, selectedTeam.mechs) });
    setHoverImg(""); setIsChangingPart(false);
  }

  function handleSelectTacticCardMobile(tacticCard: TacticCard) {
    if (!selectedTeam) return;
    setHoverImg(tacticCard.id);
    if (lastSelectTacticCard && lastSelectTacticCard.id === tacticCard.id) {
      const updatedTacticCards = [...(selectedTeam.tacticCards ?? []), tacticCard];
      updateTeam(selectedTeam.id, { tacticCards: updatedTacticCards, totalScore: calculateTotalScore(selectedTeam.drones, updatedTacticCards, selectedTeam.mechs) });
      setIsChangingPart(false); setLastSelectTacticCard(undefined); setHoverImg("");
    } setLastSelectTacticCard(tacticCard);
  }

  function handleSelectPilot(pilot: Pilot) {
    if (!selectedTeam || !selectedMechId) return;
    setHoverImg(pilot.id);
    const updatedMechs = selectedTeam.mechs.map(mech =>
      mech.id === selectedMechId ? { ...mech, pilot } : mech
    );
    updateTeam(selectedTeam.id, { mechs: updatedMechs, totalScore: calculateTotalScore(selectedTeam.drones, selectedTeam.tacticCards, updatedMechs) });
    setHoverImg(""); setIsChangingPart(false);
  }

  function handleSelectPilotMobile(pilot: Pilot) {
    if (!selectedTeam || !selectedMechId) return;
    setHoverImg(pilot.id);
    if (lastSelectPilot !== undefined && lastSelectPilot.id === pilot.id) {
      const updatedMechs = selectedTeam.mechs.map(mech =>
        mech.id === selectedMechId ? { ...mech, pilot } : mech
      );
      updateTeam(selectedTeam.id, { mechs: updatedMechs, totalScore: calculateTotalScore(selectedTeam.drones, selectedTeam.tacticCards, updatedMechs) });
      setHoverImg(""); setIsChangingPart(false); setLastSelectPilot(undefined);
    } else setLastSelectPilot(pilot);
  }

  const handleReorderTeam = (startIndex: number, endIndex: number) => {
    setTeams(prevTeams => {
      const newTeams = [...prevTeams];
      if (startIndex < 0 || startIndex >= newTeams.length || endIndex < 0 || endIndex >= newTeams.length) return prevTeams;
      const [removed] = newTeams.splice(startIndex, 1);
      newTeams.splice(endIndex, 0, removed);
      return newTeams;
    });
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ██  渲染主界面
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  return (
    <div
      className="fixed inset-0 flex overflow-hidden"
      style={{
        backgroundColor: "white",
        backgroundImage: `url(${backgroundImgsrc}/background.svg)`,
        backgroundSize: "cover", backgroundPosition: "center",
      }}
    >
      {/* 右下角派系图片 */}
      <AnimatePresence>
        {selectedTeam && (
          <motion.img
            key={selectedTeam.id}
            src={`${backgroundImgsrc}/logo_${selectedTeam.faction}.png`}
            alt=""
            style={{ position: "absolute", bottom: 0, right: 0, width: isMobileOrTablet ? "25vw" : "15vw", height: "auto", pointerEvents: "none" }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.2, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* ── 比赛进度入口按钮（悬浮，右下角） ── */}
      {showCompetitionDialog && <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 280, damping: 20 }}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => {
          setShowTournament(true);
          setTournamentMode(true);
        }}
        style={{
          position: 'fixed',
          bottom: isMobileOrTablet ? '1rem' : '1.5rem',
          right: isMobileOrTablet ? '1rem' : '1.5rem',
          zIndex: 50,
          display: 'flex', alignItems: 'center', gap: 6,
          padding: isMobileOrTablet ? '0.45rem 0.8rem' : '0.5rem 1.1rem',
          borderRadius: 12,
          background: 'rgba(0,0,0,0.58)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,215,0,0.32)',
          color: '#FFD700',
          fontWeight: 700,
          fontSize: isMobileOrTablet ? '0.75rem' : '0.82rem',
          cursor: 'pointer',
          letterSpacing: '0.04em',
          boxShadow: '0 0 16px rgba(255,215,0,0.15), 0 4px 16px rgba(0,0,0,0.3)',
          transition: 'background 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(0,0,0,0.72)';
          e.currentTarget.style.boxShadow = '0 0 24px rgba(255,215,0,0.28), 0 6px 20px rgba(0,0,0,0.4)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(0,0,0,0.58)';
          e.currentTarget.style.boxShadow = '0 0 16px rgba(255,215,0,0.15), 0 4px 16px rgba(0,0,0,0.3)';
        }}
      >
        <Trophy size={isMobileOrTablet ? 14 : 16} style={{ filter: 'drop-shadow(0 0 4px #FFD70066)' }} />
        {lang === 'zh' ? '比赛进度' : lang === 'jp' ? '大会進行' : 'Tournament'}
      </motion.button>}

      {/* 三栏主容器 */}
      <div className={`flex flex-1 ${!isMobileOrTablet ? 'gap-4 p-4' : ''} overflow-hidden`}>
        {isMobileOrTablet && (
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute top-3 left-3 z-50"
          >
            <motion.button
              onClick={() => setCollapsedLeft(prev => !prev)}
              style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: "1vw" }}
              className="h-10 shadow flex items-center justify-center overflow-hidden"
              initial={{ width: showTeamHintText ? 'auto' : 40 }}
              animate={{ width: showTeamHintText ? 200 : 40 }}
              transition={{ width: { duration: 0.5, ease: "easeInOut" } }}
            >
              <AnimatePresence mode="wait">
                {showTeamHintText ? (
                  <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-white whitespace-nowrap px-2"
                    style={{ fontSize: lang === "zh" ? "3vw" : "2.4vw" }}
                  >
                    {translations[lang].t105}
                  </motion.span>
                ) : (
                  <motion.div key="icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {collapsedLeft ? <ChevronRight className="w-5 h-5" stroke="white" /> : <ChevronLeft className="w-5 h-5" stroke="white" />}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        )}

        {/* 左侧小队列表 */}
        <div className="relative flex flex-col">
          {isMobileOrTablet ? (
            <SlidePanel collapsed={collapsedLeft} onClose={() => setCollapsedLeft(true)} position="left" width="80%" height="100%" panelBgColor="#F9FAFB">
              <TeamListMobile
                teams={teams} selectedTeamId={selectedTeamId}
                onSelectTeam={setSelectedTeamId} onAddTeam={addTeam}
                onDeleteTeam={deleteTeam} onUpdateTeam={updateTeam} onCopyTeam={copyTeam}
                translations={t} factionNames={factionNames} lang={lang} tabsrc={tabSrc}
                tournamentMode={isTournamentMode} onTournamentModeChange={c => setTournamentMode(c)}
                onReorderTeam={handleReorderTeam}
                hideTacticCard={hideTacticCard}
              />
            </SlidePanel>
          ) : (
            <div className="shadow-xl transition-all duration-300 ease-in-out rounded-lg" style={{
              width: collapsedLeft ? '0' : '22vw', height: '100%',
              border: '1px solid rgba(255,255,255,0.1)', opacity: collapsedLeft ? 0 : 1,
              backgroundColor: 'transparent', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
              display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden',
            }}>
              <TeamList
                teams={teams} selectedTeamId={selectedTeamId}
                onSelectTeam={setSelectedTeamId} onAddTeam={addTeam}
                onDeleteTeam={deleteTeam} onUpdateTeam={updateTeam} onCopyTeam={copyTeam}
                translations={t} factionNames={factionNames} lang={lang} tabsrc={tabSrc}
                tournamentMode={isTournamentMode} onTournamentModeChange={c => setTournamentMode(c)}
                onReorderTeam={handleReorderTeam}
                competitionDialogOpen={competitionDialogOpen}
                onOpenCompetitionDialog={() => setCompetitionDialogOpen(true)}
                showCompetitionDialog={showCompetitionDialog}
                hideTacticCard={hideTacticCard}
              />
            </div>
          )}
        </div>

        {/* 中间机体列表 */}
        <div className="flex-1 flex flex-col overflow-hidden shadow-xl rounded-lg" style={{
          backgroundColor: 'transparent', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',

        }}>
          {!isMobileOrTablet && (
            <MechList
              team={selectedTeam} inventory={inventory} selectedMechId={selectedMechId}
              onSelectMech={setSelectedMechId} onSelectPartType={setSelectedPartType}
              onUpdateTeam={updateTeam} onSetViewMode={handleSetViewMode}
              translations={t} partTypeNames={typePartNames}
              inventoryMode={inventoryMode} onsetInventoryMode={setInventoryMode}
              imgsrc={imageSrc} localImgsrc={localImgsrc} boxCoverSrc={boxCoverSrc}
              lang={lang} tabsrc={tabSrc} mobileOrTablet={isMobileOrTablet}
              setLanguage={setLang} tournamentMode={isTournamentMode}
              mechImgSrc={mechImgsrc}
              onSetIsChangingPart={v => setIsChangingPart(v)}
              onSelectDrone={d => setLastPartId(d.id)}
              animationCardMode={animationCardMode} setAnimationCardMode={setAnimationCardMode}
              onUpdateInventory={setInventory}
              hideTacticCard={hideTacticCard} setHideTacticCard={setHideTacticCard}
            />
          )}
          {/* 线上比赛弹窗 */}
          {showCompetitionDialog &&
            <CompetitionDialog
              open={competitionDialogOpen}
              onOpenChange={setCompetitionDialogOpen}
              bannerSrc={`${backgroundImgsrc}/competition.webp`}
              teams={teams}
              lang={lang}
              translations={t}
              tabsrc={tabSrc}
              localImgsrc={localImgsrc}
              imgsrc={imageSrc}
              factionNames={factionNames}
            />
          }
          {isMobileOrTablet && (
            <MechListMobile
              team={selectedTeam} selectedMechId={selectedMechId}
              onSelectMech={setSelectedMechId} onSelectPartType={setSelectedPartType}
              onUpdateTeam={updateTeam} onSetViewMode={handleSetViewMode}
              translations={t} partTypeNames={typePartNames}
              imgsrc={imageSrc} localImgsrc={localImgsrc}
              lang={lang} tabsrc={tabSrc} mobileOrTablet={isMobileOrTablet}
              setLanguage={setLang} tournamentMode={isTournamentMode} mechImgSrc={mechImgsrc}
              onSetIsChangingPart={v => setIsChangingPart(v)}
              onSelectDrone={d => setLastPartId(d.id)}
              hideTacticCard={hideTacticCard} setHideTacticCard={setHideTacticCard}
            />
          )}
        </div>

        {/* 部件选择弹窗 */}
        <AnimatePresence>
          {isMobileOrTablet ? (
            <div>
              {isChangingPart && (
                <div className="fixed inset-0 z-50 flex items-center justify-center"
                  style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                  onClick={() => setIsChangingPart(false)}
                >
                  <div className="relative flex rounded-lg overflow-hidden shadow-xl"
                    style={{
                      height: "100%", width: "100%",
                      border: "1px solid rgba(255,255,255,0.1)",
                      display: "flex", flexDirection: "column",
                      backgroundColor: "rgba(255,255,255,0.5)",
                      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      onClick={() => { setIsChangingPart(false); setHoverImg(""); clearLastSelectState(); }}
                      style={{ position: "absolute", zIndex: 20, padding: "1vh 1vw", backgroundColor: "rgba(0,0,0,0.6)", color: "white", borderRadius: "0.375rem", fontWeight: "bold" }}
                    >
                      <ChevronDown />
                    </button>
                    {viewMode === "parts" && (
                      <PartComparePanelMobile lastPartId={lastPartId} hoverId={hoverImg} factionParts={factionParts} imageSrc={imageSrc} compareMode={compareMode} viewMode={viewMode} showKeyword={showKeyword} lang={lang} translations={translations} data={data} faction={selectedTeam.faction} />
                    )}
                    {viewMode === "pilots" && (
                      <PilotComparePanelMobile lastPilotId={lastPartId} hoverId={hoverImg} factionPilots={factionPilots} imageSrc={imageSrc} compareMode={compareMode} viewMode={viewMode} tabsrc={tabSrc} lang={lang} />
                    )}
                    {viewMode === "drones" && (
                      <DroneComparePanelMobile lastPartId={lastPartId} hoverId={hoverImg} factionDrones={factionDrones} imageSrc={imageSrc} compareMode={compareMode} viewMode={viewMode} showKeyword={showKeyword} lang={lang} />
                    )}
                    {viewMode === "tacticCards" && (
                      <TacticCardComparePanelMobile lastPartId={lastPartId} hoverId={hoverImg} tacticCards={allTacticCards} imageSrc={imageSrc} compareMode={compareMode} viewMode={viewMode} />
                    )}
                    <div className="flex-1 relative" style={{ backgroundColor: "white", overflowY: "auto" }}>
                      <PartSelectorMobile
                        viewMode={viewMode} team={selectedTeam} selectedPartType={selectedPartType}
                        parts={factionParts} drones={factionDrones} pilots={factionPilots}
                        translations={t} tacticCards={allTacticCards} partTypeNames={typePartNames}
                        imgsrc={imageSrc} tabsrc={tabSrc}
                        onSetHoverImg={handleHoverImg} onSetShowHoverImg={setCompareMode}
                        showHoverImg={compareMode} mobileOrTablet={false}
                        lastScore={lastScore} lastPartId={lastPartId}
                        onSelectPart={handleSelectPartMobile} onSelectDrone={handleSelectDroneMobile}
                        onSelectTacticCard={handleSelectTacticCardMobile} onSelectPilot={handleSelectPilotMobile}
                        tabSmallSrc={tabSmallSrc} showKeyword={showKeyword} onSetShowKeyword={setShowKeyword}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <AnimatePresence>
              {isChangingPart && (
                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                  onClick={() => setIsChangingPart(false)}
                >
                  <motion.div
                    className="relative flex rounded-lg overflow-hidden shadow-xl"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    style={{
                      height: "90vh",
                      maxWidth: viewMode === "drones" ? "80vw" : viewMode === "tacticCards" ? "40vw" : "80vw",
                      backgroundImage: `url(${backgroundImgsrc}/background2.svg)`,
                      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                      border: "1px solid rgba(255,255,255,0.1)", display: "flex",
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    {viewMode === "parts" && (
                      <PartComparePanel lastPartId={lastPartId} hoverId={hoverImg} factionParts={factionParts} imageSrc={imageSrc} compareMode={compareMode} viewMode={viewMode} showKeyword={showKeyword} faction={selectedTeam.faction} tabsrc={tabSrc} data={data} lang={lang} showSourceBox={showSourceBox} />
                    )}
                    {viewMode === "pilots" && (
                      <PilotComparePanel lastPilotId={lastPartId} hoverId={hoverImg} factionPilots={factionPilots} imageSrc={imageSrc} compareMode={compareMode} viewMode={viewMode} tabsrc={tabSrc} lang={lang} />
                    )}
                    {viewMode === "drones" && (
                      <DroneComparePanel lastPartId={lastPartId} hoverId={hoverImg} factionDrones={factionDrones} imageSrc={imageSrc} compareMode={compareMode} viewMode={viewMode} showKeyword={showKeyword} tabsrc={tabSrc} faction={selectedTeam.faction} lang={lang} showSourceBox={showSourceBox} gofProjectiles={gofProjectiles} />
                    )}
                    {viewMode === "tacticCards" && (
                      <TacticCardComparePanel lastPartId={lastPartId} hoverId={hoverImg} tacticCards={allTacticCards} imageSrc={imageSrc} compareMode={compareMode} viewMode={viewMode} />
                    )}
                    <div className="flex-1 relative" style={{ backgroundColor: "white", overflowY: "auto" }}>
                      <PartSelector
                        viewMode={viewMode} inventory={inventory} team={selectedTeam}
                        selectedPartType={selectedPartType} parts={factionParts}
                        drones={factionDrones} pilots={factionPilots}
                        translations={t} tacticCards={allTacticCards} partTypeNames={typePartNames}
                        imgsrc={imageSrc} tabsrc={tabSrc}
                        onSetHoverImg={handleHoverImg} onSetShowHoverImg={setCompareMode}
                        onSetShowKeyword={setShowKeyword} onSetShowSourceBox={setShowSourceBox}
                        showHoverImg={compareMode} mobileOrTablet={false}
                        lastScore={lastScore} lastPartId={lastPartId} lang={lang}
                        showKeyword={showKeyword} showSourceBox={showSourceBox}
                        onSelectPart={handleSelectPart} onSelectDrone={handleSelectDrone}
                        onSelectTacticCard={handleSelectTacticCard} onSelectPilot={handleSelectPilot}
                        inventoryMode={inventoryMode}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
