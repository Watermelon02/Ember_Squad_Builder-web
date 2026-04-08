import React from 'react';
import { Tabs } from '../radix-ui/tabs';
import { Team, Drone, MechPartType  } from '../../data/types';
import { MechTabContent } from '../mechList/desktop/tabs/MechTabContent';
import { DroneTabContent } from '../mechList/desktop/tabs/DroneTabContent';
import { TacticTabContent } from '../mechList/desktop/tabs/TacticTabContent';
import { useCompetitionMechListLogic } from './useCompetitionMechListLogic';


interface CompetitionMechListProps {
  team?: Team;
  selectedMechId: string;
  onSelectMech: (mechId: string) => void;
  onSelectPartType: (partType: string) => void;
  onUpdateTeam: (teamId: string, updates: Partial<Team>) => void;
  onSetViewMode: (mode: 'parts' | 'drones' | 'pilots' | 'tacticCards') => void;
  onSetIsChangingPart: (changingPart: boolean) => void,
  onSelectDrone: (droneId: Drone) => void;
  translations: any;
  partTypeNames: 'torso' | 'leftHand' | 'rightHand' | 'backpack' | 'chasis';
  imgsrc: string, tabsrc: string,
  localImgsrc: string, lang: string, mobileOrTablet: boolean, setLanguage: React.Dispatch<React.SetStateAction<"zh" | "en" | "jp">>,
  championMode: boolean,
  mechImgSrc: string,
  boxCoverSrc: string,
}

export function CompetitionMechList({
  team,
  selectedMechId,
  onSelectMech,
  onSelectPartType,
  onUpdateTeam,
  onSetViewMode,
  onSelectDrone,
  translations,
  partTypeNames = 'chasis',
  imgsrc, tabsrc,
  localImgsrc, lang, mobileOrTablet, championMode,
  mechImgSrc, onSetIsChangingPart
}: CompetitionMechListProps) {
  const logic = useCompetitionMechListLogic({
    team, onUpdateTeam, selectedMechId, translations, lang, mechImgSrc, imgsrc, tabsrc, localImgsrc,

  });

  if (!team) {
    return <div className="h-full flex items-center justify-center text-muted-foreground">{translations.t21}</div>;
  }

  const orderedPartTypes: MechPartType[] = mobileOrTablet
    ? ["rightHand", "torso", "leftHand", "backpack", "chasis"]
    : (Object.keys(partTypeNames) as MechPartType[]);

  // 辅助函数
  const getColorByAttr = (type: string, value: number) => {
    const v = Math.min(Math.max(value, 1), 10);
    const dodgeColors = ["#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a", "#172554"];
    const electronicColors = ["#fef9c3", "#fef08a", "#fde047", "#facc15", "#eab308", "#ca8a04", "#a16207", "#854d0e", "#713f12", "#422006"];
    if (type === "dodge") return dodgeColors[v - 1];
    if (type === "electronic") return electronicColors[v - 1];
    return "#111";
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <Tabs defaultValue="mechs" className="flex-1 min-h-0 flex flex-col" onValueChange={(v) => {
        logic.setCurrentTab(v);
        switch (v) {
          case 'mechs':
            logic.setCPartType('');
            onSetViewMode('parts');
            break;
          case 'drones':
            onSetViewMode('drones');
            break;
          case 'tacticCards':
            onSetViewMode('tacticCards');
            break;
        }
      }}>



        <MechTabContent
          team={team}
          selectedMechId={selectedMechId}
          onSelectMech={onSelectMech}
          onSelectPartType={onSelectPartType}
          onSetViewMode={onSetViewMode}
          onSetIsChangingPart={onSetIsChangingPart}
          cPartType={logic.cPartType}
          setCPartType={logic.setCPartType}
          orderedPartTypes={orderedPartTypes}
          mobileOrTablet={mobileOrTablet}
          imgsrc={imgsrc} tabsrc={tabsrc} lang={lang}
           mechImgSrc={mechImgSrc} championMode={championMode} translations={translations}
          editingMechId={logic.editingMechId} setEditingMechId={logic.setEditingMechId}
          copyMech={logic.copyMech} getColorByAttr={getColorByAttr}
          exportRef={logic.exportRef}
        />

        <DroneTabContent
          team={team} mobileOrTablet={mobileOrTablet} imgsrc={imgsrc} tabsrc={tabsrc} translations={translations}
          onSetViewMode={onSetViewMode} onSetIsChangingPart={onSetIsChangingPart} onSelectDrone={onSelectDrone}
           lang={lang} onUpdateTeam={onUpdateTeam}
        />

        <TacticTabContent
          team={team} mobileOrTablet={mobileOrTablet} imgsrc={imgsrc} tabsrc={tabsrc} translations={translations}
          onSetViewMode={onSetViewMode} onSetIsChangingPart={onSetIsChangingPart} 
        />

      </Tabs>

    </div>
  );
}