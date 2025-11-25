import { useState, useRef, useEffect } from 'react';
import { Team, Mech, Drone, calculateTotalScore } from '../data/types'; // 根据实际路径调整
import * as htmlToImage from "html-to-image";
import { exportTeamImage } from '../util/TeamImage';
import { exportTTS } from '../util/ttsUtil';

interface UseMechListLogicProps {
  team?: Team;
  onUpdateTeam: (teamId: string, updates: Partial<Team>) => void;
  onSelectMech: (mechId: string) => void;
  selectedMechId: string;
  translations: any;
  lang: string;
  mechImgSrc: string;
  imgsrc: string;
  tabsrc: string;
  localImgsrc: string;
}

export const useMechListLogic = ({
  team,
  onUpdateTeam,
  onSelectMech,
  selectedMechId,
  translations,
  lang,
  mechImgSrc,
  imgsrc,
  tabsrc,
  localImgsrc
}: UseMechListLogicProps) => {
  const [editingMechId, setEditingMechId] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingTTS, setIsExportingTTS] = useState(false);
  const [showProjectileOption, setShowProjectileOption] = useState(false);
  const [showTTSHint, setShowTTSHint] = useState(false);
  const [cPartType, setCPartType] = useState("");
  const [currentTab, setCurrentTab] = useState("mechs");
  const [open, setOpen] = useState(false);
  const [script, setScript] = useState("");
  const [showAnimationHint, setShowAnimationHint] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [includeProjectile, setIncludeProjectile] = useState<boolean>(() => {
    const saved = localStorage.getItem("includeProjectile");
    return saved ? JSON.parse(saved) : false; 
  });

  useEffect(() => {
    localStorage.setItem("includeProjectile", JSON.stringify(includeProjectile));
  }, [includeProjectile]);

  const exportWebAsImage = async () => {
    const node = exportRef.current;
    if (!node) return;

    const originalOverflow = node.style.overflow;
    const originalHeight = node.style.height;
    const originalBackground = node.style.background;

    node.style.overflow = "visible";
    node.style.height = "auto";
    node.style.background = "#e5e7eb"; 

    await new Promise((r) => setTimeout(r, 50));

    const dataUrl = await htmlToImage.toPng(node, {
      pixelRatio: 2,
      cacheBust: true,
    });

    node.style.overflow = originalOverflow;
    node.style.height = originalHeight;
    node.style.background = originalBackground;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "export.png";
    link.click();
  };

  const handleExportImage = async () => {
    setIsExporting(true);
    try {
      if (!team) return;
      await exportTeamImage(team, lang, translations, tabsrc, localImgsrc, imgsrc, includeProjectile);
      showToast(`✅ ${translations.t76}`);
    } catch (err) {
      console.error(`${translations.t77}`, err);
      alert(`${translations.t78}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportTTS = async () => {
    setIsExportingTTS(true);
    try {
        if (!team) return;
      const result = await exportTTS(team, lang, tabsrc, mechImgSrc);
      setScript(result);
      setOpen(true);
      showToast(`✅ ${translations.t76}`);
    } catch (err) {
      console.error(`${translations.t77}`, err);
      alert(`${translations.t78}`);
    } finally {
      setIsExportingTTS(false);
    }
  };

  const showToast = (message: string) => {
    const msg = document.createElement("div");
    msg.textContent = message;
    Object.assign(msg.style, {
      position: "fixed",
      bottom: "40px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(0,0,0,0.75)",
      color: "white",
      padding: "8px 16px",
      borderRadius: "8px",
      fontSize: "14px",
      opacity: "0",
      transition: "opacity 0.3s",
      zIndex: 9999,
    });
    document.body.appendChild(msg);
    requestAnimationFrame(() => (msg.style.opacity = "1"));
    setTimeout(() => {
      msg.style.opacity = "0";
      setTimeout(() => msg.remove(), 300);
    }, 2000);
  };

  const deletePart = (mechId: string, partType: string) => {
    if (!team) return;
    const updatedMechs = team.mechs.map((mech) => {
      if (mech.id === mechId) {
        const updatedParts = { ...mech.parts };
        delete updatedParts[partType]; 
        return { ...mech, parts: updatedParts };
      }
      return mech;
    });
    const totalScore = calculateTotalScore(team.drones, team.tacticCards, updatedMechs);
    onUpdateTeam(team.id, { mechs: updatedMechs, totalScore });
  };

  const addMech = () => {
    if (!team) return;
    const newMech: Mech = { id: Date.now().toString(), name: `${translations.t19}`, parts: {} };
    const updatedMechs = [...team.mechs, newMech];
    onUpdateTeam(team.id, { mechs: updatedMechs, mechCount: updatedMechs.length });
  };

  const deleteMech = (mechId: string) => {
    if (!team) return;
    const updatedMechs = team.mechs.filter((mech) => mech.id !== mechId);
    const totalScore = calculateTotalScore(team.drones, team.tacticCards, updatedMechs);
    onUpdateTeam(team.id, { mechs: updatedMechs, mechCount: updatedMechs.length, totalScore });
    if (selectedMechId === mechId) onSelectMech('');
  };

  const updateMechName = (mechId: string, name: string) => {
    if (!team) return;
    const updatedMechs = team.mechs.map((mech) => mech.id === mechId ? { ...mech, name } : mech);
    onUpdateTeam(team.id, { mechs: updatedMechs });
  };

  const copyMech = (mech: Mech) => {
    if (!team) return;
    const copiedMech: Mech = { ...mech, id: Date.now().toString(), name: `${mech.name} ${translations.t20}` };
    const updatedMechs = [...team.mechs, copiedMech];
    const totalScore = calculateTotalScore(team.drones, team.tacticCards, updatedMechs);
    onUpdateTeam(team.id, { mechs: updatedMechs, mechCount: updatedMechs.length, totalScore });
  };

  const deleteDrone = (droneIndex: number) => {
    if (!team) return;
    const updatedDrones = team.drones.filter((_, index) => index !== droneIndex);
    onUpdateTeam(team.id, {
      drones: updatedDrones,
      totalScore: calculateTotalScore(updatedDrones, team.tacticCards, team.mechs),
      largeDroneCount: updatedDrones.filter((d) => d.type === 'large').length,
      mediumDroneCount: updatedDrones.filter((d) => d.type === 'medium').length,
      smallDroneCount: updatedDrones.filter((d) => d.type === 'small').length,
    });
  };

  const deleteTacticCard = (id: number) => {
    if (!team) return;
    const updatedtacticCard = team.tacticCards?.filter((_, index) => index !== id);
    onUpdateTeam(team.id, {
      totalScore: calculateTotalScore(team.drones, updatedtacticCard, team.mechs),
      tacticCards: updatedtacticCard
    });
  };

  return {
    editingMechId, setEditingMechId,
    isExporting, isExportingTTS,
    showProjectileOption, setShowProjectileOption,
    showTTSHint, setShowTTSHint,
    cPartType, setCPartType,
    currentTab, setCurrentTab,
    open, setOpen,
    script, setScript,
    showAnimationHint, setShowAnimationHint,
    exportRef,
    isDialogOpen, setIsDialogOpen,
    includeProjectile, setIncludeProjectile,
    exportWebAsImage,
    handleExportImage,
    handleExportTTS,
    deletePart,
    addMech,
    deleteMech,
    updateMechName,
    copyMech,
    deleteDrone,
    deleteTacticCard
  };
};