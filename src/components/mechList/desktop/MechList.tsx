import React from 'react';
import { Tabs } from '../../radix-ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../radix-ui/dialog';
import { Button } from '../../radix-ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Team, Drone, MechPartType } from '../../../data/types';
import { MechImage } from '../../custom/MechImage';
import { DroneImage } from '../../custom/DroneImage';
import { useMechListLogic } from '../../../hooks/useMechListLogic';
import { MechListHeader } from './MechListHeader';
import { MechTabContent } from './tabs/MechTabContent';
import { DroneTabContent } from './tabs/DroneTabContent';
import { TacticTabContent } from './tabs/TacticTabContent';


interface MechListProps {
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
  animationCardMode: boolean,
  setAnimationCardMode: (mode: boolean) => void
}

export function MechList({
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
  localImgsrc, lang, mobileOrTablet, setLanguage, championMode,
  mechImgSrc, onSetIsChangingPart, animationCardMode, setAnimationCardMode
}: MechListProps) {

  const logic = useMechListLogic({
    team, onUpdateTeam, onSelectMech, selectedMechId, translations, lang, mechImgSrc, imgsrc, tabsrc, localImgsrc
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

        {/* tts导出消息弹窗 */}
        <Dialog open={logic.open} onOpenChange={logic.setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{translations.t97}</DialogTitle></DialogHeader>
            <pre className="bg-muted p-4 rounded text-sm overflow-auto">{logic.script}</pre>
            <motion.div style={{ display: 'flex', flexWrap: 'wrap', gap: `2px` }}>
              <AnimatePresence mode="popLayout">
                {team.mechs.map((mech, index) => (
                  <motion.div key={`mech-${mech.id ?? index}`} initial={{ opacity: 0, scale: 0.8, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 10 }} transition={{ duration: 0.2 }}>
                    <MechImage mech={mech} tabsrc={tabsrc} translation={translations} />
                  </motion.div>
                ))}
                {team.drones.map((drone, index) => (
                  <motion.div key={`drone-${drone.id}-${index}`} initial={{ opacity: 0, scale: 0.8, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 10 }} transition={{ duration: 0.2 }}>
                    <DroneImage drone={drone} tabsrc={tabsrc} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(logic.script)}>
              {translations.t4}
            </Button>
          </DialogContent>
        </Dialog>

        <MechListHeader
          team={team} translations={translations} lang={lang} setLanguage={setLanguage}
          currentTab={logic.currentTab} setCurrentTab={logic.setCurrentTab} onSetViewMode={onSetViewMode} setCPartType={logic.setCPartType}
          isExporting={logic.isExporting} handleExportImage={logic.handleExportImage}
          includeProjectile={logic.includeProjectile} setIncludeProjectile={logic.setIncludeProjectile}
          showProjectileOption={logic.showProjectileOption} setShowProjectileOption={logic.setShowProjectileOption}
          isExportingTTS={logic.isExportingTTS} handleExportTTS={logic.handleExportTTS}
          showTTSHint={logic.showTTSHint} setShowTTSHint={logic.setShowTTSHint}
          animationCardMode={animationCardMode} setAnimationCardMode={setAnimationCardMode}
          showAnimationHint={logic.showAnimationHint} setShowAnimationHint={logic.setShowAnimationHint}
        />

        <MechTabContent
          team={team}
          selectedMechId={selectedMechId}
          onSelectMech={onSelectMech}
          onSelectPartType={onSelectPartType}
          onSetViewMode={onSetViewMode}
          onSetIsChangingPart={onSetIsChangingPart}
          cPartType={logic.cPartType}
          setCPartType={logic.setCPartType}
          deletePart={logic.deletePart}
          addMech={logic.addMech}
          orderedPartTypes={orderedPartTypes}
          mobileOrTablet={mobileOrTablet}
          imgsrc={imgsrc} tabsrc={tabsrc} lang={lang}
          animationCardMode={animationCardMode} mechImgSrc={mechImgSrc} championMode={championMode} translations={translations}
          editingMechId={logic.editingMechId} setEditingMechId={logic.setEditingMechId}
          updateMechName={logic.updateMechName} copyMech={logic.copyMech} deleteMech={logic.deleteMech} getColorByAttr={getColorByAttr}
          exportRef={logic.exportRef}
        />

        <DroneTabContent
          team={team} mobileOrTablet={mobileOrTablet} imgsrc={imgsrc} tabsrc={tabsrc} translations={translations}
          onSetViewMode={onSetViewMode} onSetIsChangingPart={onSetIsChangingPart} onSelectDrone={onSelectDrone}
          deleteDrone={logic.deleteDrone} animationCardMode={animationCardMode} lang={lang} onUpdateTeam={onUpdateTeam}
          isDialogOpen={logic.isDialogOpen} setIsDialogOpen={logic.setIsDialogOpen}
        />

        <TacticTabContent
          team={team} mobileOrTablet={mobileOrTablet} imgsrc={imgsrc} tabsrc={tabsrc} translations={translations}
          onSetViewMode={onSetViewMode} onSetIsChangingPart={onSetIsChangingPart} deleteTacticCard={logic.deleteTacticCard}
        />

      </Tabs>
    </div>
  );
}