import React from 'react';
import { TabsContent } from '../../../radix-ui/tabs';
import { Button } from '../../../radix-ui/button';
import { Plus } from 'lucide-react';
import { MechListItem } from '../MechListItem';
import { Team, MechPartType } from '../../../../data/types';

interface MechTabContentProps {
  team: Team;
  selectedMechId: string;
  onSelectMech: (id: string) => void;
  onSelectPartType: (type: string) => void;
  onSetViewMode: (mode: any) => void;
  onSetIsChangingPart: (val: boolean) => void;
  cPartType: string;
  setCPartType: (type: string) => void;
  deletePart: (mechId: string, partType: string) => void;
  addMech: () => void;
  orderedPartTypes: MechPartType[];
  mobileOrTablet: boolean;
  imgsrc: string;
  tabsrc: string;
  lang: string;
  animationCardMode: boolean;
  mechImgSrc: string;
  championMode: boolean;
  translations: any;
  editingMechId: string;
  setEditingMechId: (id: string) => void;
  updateMechName: (id: string, name: string) => void;
  copyMech: (mech: any) => void;
  deleteMech: (id: string) => void;
  getColorByAttr: (type: string, value: number) => string;
  exportRef: React.RefObject<HTMLDivElement>;
}

export const MechTabContent: React.FC<MechTabContentProps> = ({
  team, selectedMechId, onSelectMech, onSelectPartType, onSetViewMode, onSetIsChangingPart,
  cPartType, setCPartType, deletePart, addMech, orderedPartTypes, mobileOrTablet, imgsrc, tabsrc, lang,
  animationCardMode, mechImgSrc, championMode, translations, editingMechId, setEditingMechId,
  updateMechName, copyMech, deleteMech, getColorByAttr, exportRef
}) => {
  return (
    <TabsContent ref={exportRef} value="mechs" className="flex-1 overflow-y-auto p-4 space-y-4">
      {team.mechs.map((mech) => (
        <MechListItem
          key={mech.id}
          mech={mech}
          team={team}
          selectedMechId={selectedMechId}
          onSelectMech={onSelectMech}
          onSelectPartType={onSelectPartType}
          onSetViewMode={onSetViewMode}
          onSetIsChangingPart={onSetIsChangingPart}
          cPartType={cPartType}
          setCPartType={setCPartType}
          deletePart={deletePart}
          orderedPartTypes={orderedPartTypes}
          mobileOrTablet={mobileOrTablet}
          imgsrc={imgsrc}
          tabsrc={tabsrc}
          lang={lang}
          animationCardMode={animationCardMode}
          mechImgSrc={mechImgSrc}
          championMode={championMode}
          translations={translations}
          editingMechId={editingMechId}
          setEditingMechId={setEditingMechId}
          updateMechName={updateMechName}
          copyMech={copyMech}
          deleteMech={deleteMech}
          getColorByAttr={getColorByAttr}
        />
      ))}

      <div className="flex justify-center">
        <Button onClick={addMech} size="sm" className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800">
          <Plus className="w-4 h-4 mr-2" />
          {translations.t29}
        </Button>
      </div>

      {team.mechs.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          {translations.t30}
        </div>
      )}
    </TabsContent>
  );
};