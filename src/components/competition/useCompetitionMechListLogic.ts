import { useState, useRef, useEffect } from 'react';
import { Team, Mech, Drone, calculateTotalScore } from '../../data/types'; // 根据实际路径调整
import * as htmlToImage from "html-to-image";
import { exportTeamImage } from '../../util/TeamImage';
import { exportTTS } from '../../util/ttsUtil';

interface UseCompetitionMechListLogicProps {
  team?: Team;
  onUpdateTeam: (teamId: string, updates: Partial<Team>) => void;
  selectedMechId: string;
  translations: any;
  lang: string;
  mechImgSrc: string;
  imgsrc: string;
  tabsrc: string;
  localImgsrc: string;
}

export const useCompetitionMechListLogic = ({
  team,
  onUpdateTeam,
  translations,
  lang,
  mechImgSrc,
  imgsrc,
  tabsrc,
  localImgsrc,
}: UseCompetitionMechListLogicProps) => {
  const [editingMechId, setEditingMechId] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingTTS, setIsExportingTTS] = useState(false);
  const [showProjectileOption, setShowProjectileOption] = useState(false);
  const [cPartType, setCPartType] = useState("");
  const [currentTab, setCurrentTab] = useState("mechs");
  const [TTSDialogOpen, setTTSDialogOpen] = useState(false);
  

  const [boxListDialogOpen, setBoxListDialogOpen] = useState(false);
  const [script, setScript] = useState("");
  const exportRef = useRef<HTMLDivElement>(null);
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
      setTTSDialogOpen(true);
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

  

  

  const copyMech = (mech: Mech) => {
    if (!team) return;
    const copiedMech: Mech = { ...mech, id: Date.now().toString(), name: `${mech.name} ${translations.t20}` };
    const updatedMechs = [...team.mechs, copiedMech];
    const totalScore = calculateTotalScore(team.drones, team.tacticCards, updatedMechs);
    onUpdateTeam(team.id, { mechs: updatedMechs, mechCount: updatedMechs.length, totalScore });
  };


  return {
    editingMechId, setEditingMechId,
    isExporting, isExportingTTS,
    showProjectileOption, setShowProjectileOption,
    cPartType, setCPartType,
    currentTab, setCurrentTab,
    TTSDialogOpen, setTTSDialogOpen,
    script, setScript,
    boxListDialogOpen, setBoxListDialogOpen,
    exportRef,
    includeProjectile, setIncludeProjectile,
    exportWebAsImage,
    handleExportImage,
    handleExportTTS,
    copyMech,
  };
};