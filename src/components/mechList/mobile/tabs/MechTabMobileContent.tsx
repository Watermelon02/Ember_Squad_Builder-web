import React from 'react';
import { TabsContent } from '../../../radix-ui/tabs';
import { Button } from '../../../radix-ui/button';
import { Plus } from 'lucide-react';
import { MechListMobileItem } from '../MechListMobileItem';
import { Team } from '../../../../data/types';

interface MechTabMobileContentProps {
  team: Team;
  selectedMechId: string;
  onSelectMech: (id: string) => void;
  onSelectPartType: (type: string) => void;
  onSetViewMode: (mode: any) => void;
  onSetIsChangingPart: (val: boolean) => void;
  cPartType: string;
  setCPartType: (type: string) => void;
  deletePart: (mechId: string, partType: string) => void;
  orderedPartTypes: any[];
  mobileOrTablet: boolean;
  imgsrc: string;
  tabsrc: string;
  lang: string;
  mechImgSrc: string;
  championMode: boolean;
  translations: any;
  editingMechId: string;
  setEditingMechId: (id: string) => void;
  updateMechName: (id: string, name: string) => void;
  copyMech: (mech: any) => void;
  deleteMech: (id: string) => void;
  getColorByAttr: (type: string, value: number) => string;
  addMech: () => void;
  exportRef: React.RefObject<HTMLDivElement>;
  defaultPreviewParts: any;
}

export const MechTabMobileContent: React.FC<MechTabMobileContentProps> = ({
  team, selectedMechId, onSelectMech, onSelectPartType, onSetViewMode, onSetIsChangingPart,
  cPartType, setCPartType, deletePart, orderedPartTypes, mobileOrTablet, imgsrc, tabsrc, lang,
  mechImgSrc, championMode, translations, editingMechId, setEditingMechId,
  updateMechName, copyMech, deleteMech, getColorByAttr, addMech, exportRef, defaultPreviewParts
}) => {
  return (
    <TabsContent ref={exportRef} value="mechs" className="flex-1 overflow-y-auto p-1 space-y-4">
      {team.mechs.map((mech) => (
        <MechListMobileItem
          key={mech.id}
          mech={mech}
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
          mechImgSrc={mechImgSrc}
          championMode={championMode}
          translations={translations}
          editingMechId={editingMechId}
          setEditingMechId={setEditingMechId}
          updateMechName={updateMechName}
          copyMech={copyMech}
          deleteMech={deleteMech}
          getColorByAttr={getColorByAttr}
          defaultPreviewParts={defaultPreviewParts}
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