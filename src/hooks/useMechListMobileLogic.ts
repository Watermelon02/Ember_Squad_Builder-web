import { useState, useRef, useEffect } from 'react';
import { Team, Mech, Drone, Part, calculateTotalScore } from '../data/types';
import * as htmlToImage from "html-to-image";
import { exportTeamImage } from '../util/TeamImage';
import { exportTextTeamData } from '../util/TextUtil';
import { 
  gofBackpack, gofChasis, gofLeftHand, gofRightHand, gofTorso, 
  rdlBackpack, rdlChasis, rdlLeftHand, rdlRightHand, rdlTorso, 
  unBackpack, unChasis, unLeftHand, unRightHand, unTorso 
} from '../data/data_cn';

interface UseMechListMobileLogicProps {
  team?: Team;
  onUpdateTeam: (teamId: string, updates: Partial<Team>) => void;
  onSelectMech: (mechId: string) => void;
  selectedMechId: string;
  translations: any;
  lang: string;
  tabsrc: string;
  localImgsrc: string;
  imgsrc: string;
}

export const useMechListMobileLogic = ({
  team,
  onUpdateTeam,
  onSelectMech,
  selectedMechId,
  translations,
  lang,
  tabsrc,
  localImgsrc,
  imgsrc
}: UseMechListMobileLogicProps) => {
  const [editingMechId, setEditingMechId] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const [showProjectileOption, setShowProjectileOption] = useState(false);
  const [cPartType, setCPartType] = useState("");
  const [currentTab, setCurrentTab] = useState("mechs");
  const [open, setOpen] = useState(false);
  const [script, setScript] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const exportRef = useRef<HTMLDivElement>(null);

  const [includeProjectile, setIncludeProjectile] = useState<boolean>(() => {
    const saved = localStorage.getItem("includeProjectile");
    return saved ? JSON.parse(saved) : false; 
  });

  useEffect(() => {
    localStorage.setItem("includeProjectile", JSON.stringify(includeProjectile));
  }, [includeProjectile]);

  const getDefaultPreviewParts = (): {
    leftHand: Part;
    torso: Part;
    rightHand: Part;
    chasis: Part;
    backpack: Part;
  } => {
    switch (team?.faction) {
      case "RDL": {
        return {
          leftHand: rdlLeftHand[0],
          torso: rdlTorso[0],
          rightHand: rdlRightHand[0],
          chasis: rdlChasis[1],
          backpack: rdlBackpack[0],
        };
      }
      case "UN": {
        return {
          leftHand: unLeftHand[3],
          torso: unTorso[5],
          rightHand: unRightHand[8],
          chasis: unChasis[0],
          backpack: unBackpack[3],
        };
      }
      case "GOF":
        return {
          leftHand: gofLeftHand[0],
          torso: gofTorso[0],
          rightHand: gofRightHand[0],
          chasis: gofChasis[0],
          backpack: gofBackpack[0],
        };
      default: {
        return {
          leftHand: unLeftHand[0],
          torso: unTorso[0],
          rightHand: unRightHand[2],
          chasis: unChasis[0],
          backpack: unBackpack[0],
        };
      }
    }
  };

  const getColorByAttr = (type: string, value: number) => {
    const v = Math.min(Math.max(value, 1), 10);
    const dodgeColors = ["#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a", "#172554"];
    const electronicColors = ["#fef9c3", "#fef08a", "#fde047", "#facc15", "#eab308", "#ca8a04", "#a16207", "#854d0e", "#713f12", "#422006"];
    if (type === "dodge") return dodgeColors[v - 1];
    if (type === "electronic") return electronicColors[v - 1];
    return "#111"; 
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
    isExporting, handleExportImage,
    showProjectileOption, setShowProjectileOption,
    cPartType, setCPartType,
    currentTab, setCurrentTab,
    open, setOpen,
    script, setScript,
    isDialogOpen, setIsDialogOpen,
    includeProjectile, setIncludeProjectile,
    exportRef,
    getDefaultPreviewParts,
    getColorByAttr,
    deletePart,
    addMech,
    deleteMech,
    updateMechName,
    copyMech,
    deleteDrone,
    deleteTacticCard
  };
};