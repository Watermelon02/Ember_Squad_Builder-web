import React from 'react';
import { Tabs } from '../../radix-ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../radix-ui/dialog';
import { Button } from '../../radix-ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Team, Drone } from '../../../data/types';
import { MechImage } from '../../custom/MechImage';
import { DroneImage } from '../../custom/DroneImage';
import { useMechListMobileLogic } from '../../../hooks/useMechListMobileLogic';
import { MechListMobileHeader } from './MechListMobileHeader';
import { MechTabMobileContent } from './tabs/MechTabMobileContent';
import { TacticTabMobileContent } from './tabs/TacticTabMobileContent';
import { DroneTabMobileContent } from './tabs/DroneTabMobileContent';

interface MechListMobileProps {
  team?: Team;
  selectedMechId: string;
  onSelectMech: (mechId: string) => void;
  onSelectPartType: (partType: string) => void;
  onUpdateTeam: (teamId: string, updates: Partial<Team>) => void;
  onSetViewMode: (mode: 'parts' | 'drones' | 'pilots' | 'tacticCards') => void;
  onSetIsChangingPart: (changingPart: boolean) => void,
  onSelectDrone: (droneId: Drone) => void;
  translations: any;
  partTypeNames: any;
  imgsrc: string, tabsrc: string,
  localImgsrc: string, lang: string, mobileOrTablet: boolean, setLanguage: React.Dispatch<React.SetStateAction<"zh" | "en" | "jp">>,
  championMode: boolean,
  mechImgSrc: string,
}

export function MechListMobile({
  team, selectedMechId, onSelectMech, onSelectPartType, onUpdateTeam, onSetViewMode, onSelectDrone,
  translations, partTypeNames, imgsrc, tabsrc, localImgsrc, lang, mobileOrTablet, setLanguage,
  championMode, mechImgSrc, onSetIsChangingPart,
}: MechListMobileProps) {

  const logic = useMechListMobileLogic({
    team, onUpdateTeam, onSelectMech, selectedMechId, translations, lang, tabsrc, localImgsrc, imgsrc
  });

  if (!team) {
    return <div className="h-full flex items-center justify-center text-muted-foreground">{translations.t21}</div>;
  }

  const orderedPartTypes = mobileOrTablet
    ? ["rightHand", "torso", "leftHand", "backpack", "chasis"]
    : (Object.keys(partTypeNames));

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
          <DialogContent >
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

        <MechListMobileHeader
          team={team} translations={translations} lang={lang} setLanguage={setLanguage}
          currentTab={logic.currentTab} setCurrentTab={logic.setCurrentTab} onSetViewMode={onSetViewMode} setCPartType={logic.setCPartType}
          isExporting={logic.isExporting} handleExportImage={logic.handleExportImage}
          showProjectileOption={logic.showProjectileOption} setShowProjectileOption={logic.setShowProjectileOption}
          includeProjectile={logic.includeProjectile} setIncludeProjectile={logic.setIncludeProjectile}
        />

        <MechTabMobileContent
          team={team}
          selectedMechId={selectedMechId}
          onSelectMech={onSelectMech}
          onSelectPartType={onSelectPartType}
          onSetViewMode={onSetViewMode}
          onSetIsChangingPart={onSetIsChangingPart}
          cPartType={logic.cPartType}
          setCPartType={logic.setCPartType}
          deletePart={logic.deletePart}
          orderedPartTypes={orderedPartTypes}
          mobileOrTablet={mobileOrTablet}
          imgsrc={imgsrc} tabsrc={tabsrc} lang={lang}
          mechImgSrc={mechImgSrc} championMode={championMode} translations={translations}
          editingMechId={logic.editingMechId} setEditingMechId={logic.setEditingMechId}
          updateMechName={logic.updateMechName} copyMech={logic.copyMech} deleteMech={logic.deleteMech}
          getColorByAttr={logic.getColorByAttr} addMech={logic.addMech} exportRef={logic.exportRef}
          defaultPreviewParts={logic.getDefaultPreviewParts()}
        />

        <DroneTabMobileContent
          team={team} mobileOrTablet={mobileOrTablet} imgsrc={imgsrc} translations={translations}
          onSetViewMode={onSetViewMode} onSetIsChangingPart={onSetIsChangingPart} onSelectDrone={onSelectDrone}
          deleteDrone={logic.deleteDrone} isDialogOpen={logic.isDialogOpen} setIsDialogOpen={logic.setIsDialogOpen}
          onUpdateTeam={onUpdateTeam}
        />

        <TacticTabMobileContent
          team={team} mobileOrTablet={mobileOrTablet} imgsrc={imgsrc} tabsrc={tabsrc} translations={translations}
          onSetViewMode={onSetViewMode} onSetIsChangingPart={onSetIsChangingPart} deleteTacticCard={logic.deleteTacticCard}
        />

      </Tabs>
    </div>
  );
}