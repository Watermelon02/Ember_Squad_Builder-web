import React from 'react';
import { Card } from '../../radix-ui/card';
import { Button } from '../../radix-ui/button';
import { Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MechStatusMobile } from '../../custom/MechStatusMobile';
import { MechPreview } from '../../custom/MechPreview';
import { Mech, PART_TYPE_NAMES } from '../../../data/types';

interface MechListMobileItemProps {
  mech: Mech;
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
  copyMech: (mech: Mech) => void;
  deleteMech: (id: string) => void;
  getColorByAttr: (type: string, value: number) => string;
  defaultPreviewParts: any;
}

export const MechListMobileItem: React.FC<MechListMobileItemProps> = ({
  mech, selectedMechId, onSelectMech, onSelectPartType, onSetViewMode, onSetIsChangingPart,
  cPartType, setCPartType, deletePart, orderedPartTypes, mobileOrTablet, imgsrc, tabsrc, lang,
  mechImgSrc, championMode, translations, editingMechId, setEditingMechId,
  updateMechName, copyMech, deleteMech, getColorByAttr, defaultPreviewParts
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3, ease: "easeInOut" }}>
      <Card
        style={{
          paddingLeft: mobileOrTablet ? '2vw' : '1vw',
          paddingRight: mobileOrTablet ? '2vw' : '1vw',
          paddingTop: mobileOrTablet ? '1vh' : '1vh',
          paddingBottom: mobileOrTablet ? '2vh' : '1vh'
        }}
        className={`rounded-lg transition-transform transition-shadow duration-500 ease-in-out`}
      >
        <div>
          <div style={{ display: 'grid', width: '100%', gap: '0.5vh', gridTemplateColumns: mobileOrTablet ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)' }}>
            {orderedPartTypes.map((partType) => (
              <AnimatePresence mode="wait" key={partType}>
                <motion.div
                  key={mech.parts[partType]?.id || partType}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.1 }}
                  onMouseEnter={(e) => { if (cPartType !== partType) { e.currentTarget.style.boxShadow = "0 6px 10px rgba(0,0,0,0.1)"; } }}
                  onMouseLeave={(e) => { if (cPartType !== partType) { e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)"; } }}
                  className={`relative p-0 overflow-hidden cursor-pointer transition shadow-lg shadow-gray-500 rounded-lg ${selectedMechId === mech.id ? "border-primary" : ""}`}
                >
                  <Button variant="secondary" className="h-6 w-8 flex absolute bottom-0 left-0 m-1 text-xs shadow-lg shadow-gray-500 rounded-lg bg-blue-500/80" style={{ color: 'white', textShadow: '0 0 4px rgba(0,0,0,0.7)' }}>
                    {mech.parts[partType]?.score}
                  </Button>

                  {mech.parts[partType] ? (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => deletePart(mech.id, partType)} className="absolute top-0 right-0 text-white shadow-lg shadow-gray-500 rounded-lg hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <img
                        key={mech.parts[partType]!.id}
                        src={`${imgsrc}/${mech.parts[partType]!.id}.png`}
                        alt={mech.parts[partType]!.name}
                        loading="lazy"
                        className="w-full h-auto object-contain rounded-lg"
                        onClick={() => {
                          setCPartType(partType);
                          onSelectMech(mech.id);
                          onSelectPartType(partType);
                          onSetViewMode('parts');
                          onSetIsChangingPart(true);
                        }}
                      />
                    </>
                  ) : (
                    <div style={{ position: "relative", width: "100%", borderRadius: "0.5rem", overflow: "hidden", cursor: "pointer" }} onClick={() => { setCPartType(partType); onSelectMech(mech.id); onSelectPartType(partType); onSetViewMode("parts"); onSetIsChangingPart(true); }}>
                      <img src={`${imgsrc}/001.png`} loading="lazy" alt="placeholder" style={{ width: "100%", height: "auto", objectFit: "contain", borderRadius: "0.5rem", opacity: 0, userSelect: "none", pointerEvents: "none" }} />
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: window.innerWidth > 768 ? "1.4vw" : "0.9rem", color: "rgba(100, 100, 100, 0.4)", backgroundColor: "rgba(240, 240, 240, 0.4)", borderRadius: "0.5rem", gap: "0.2rem" }}>
                        <img src={`${tabsrc}/icon_part_${partType}.png`} style={{ transform: "translate(-5%, -5%)", width: "20%", height: "auto", objectFit: "contain", opacity: 0.8, pointerEvents: "none", userSelect: "none" }} />
                        {`${PART_TYPE_NAMES[lang][partType]}`}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            ))}

            {mobileOrTablet && (
              <div
                className={`relative p-0 overflow-hidden cursor-pointer transition shadow-lg shadow-gray-500 rounded-lg ${selectedMechId === mech.id ? 'border-primary' : ''}`}
                style={{ position: 'relative', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                onClick={() => { onSelectMech(mech.id); onSetViewMode('pilots'); onSetIsChangingPart(true); }}
              >
                {mech.pilot && (
                  <Button variant="secondary" className="h-6 w-8 flex absolute bottom-0 left-0 m-1 text-xs shadow-lg shadow-gray-500 rounded-lg pa" style={{ color: 'white', textShadow: '0 0 4px rgba(0,0,0,0.7)' }}>
                    {mech.pilot?.score}
                  </Button>
                )}
                {mech.pilot ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img
                      src={`${tabsrc}/${mech.pilot.id}.png`}
                      alt={mech.pilot.name}
                      style={{ position: 'absolute', inset: 0, width: '130%', height: '130%', objectFit: 'cover', objectPosition: 'center', transform: 'translateY(-15%) ', borderRadius: '0.5rem' }}
                    />
                    <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', right: '0.5rem', color: 'white', textShadow: '0 0 4px rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '4vw', textShadow: '0 0 10px rgba(0,0,0,1)' }}>{mech.pilot.name}</span>
                      <span style={{ fontSize: lang === 'en' ? '2.5vw' : '3vw', color: 'white', textShadow: `-1px -1px 1px #000, 1px -1px 1px #000, -1px 1px 1px #000, 1px 1px 1px #000` }}>
                        {mech.pilot.traitDescription}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", color: "rgba(100, 100, 100, 0.4)", backgroundColor: "rgba(240, 240, 240, 0.4)", borderRadius: "0.5rem" }}>
                    {translations.t27}
                  </div>
                )}
              </div>
            )}
          </div>

          {mobileOrTablet && (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: '3vw', width: '100%', marginTop: '1.5vh' }}>
              <MechStatusMobile
                mech={mech} translations={translations} tabsrc={tabsrc} lang={lang}
                editingMechId={editingMechId} setEditingMechId={setEditingMechId}
                updateMechName={updateMechName} copyMech={copyMech} deleteMech={deleteMech}
                getColorByAttr={getColorByAttr} style={{ flex: '2' }} isMobile={mobileOrTablet}
              />
              <MechPreview
                mech={mech} mechImgSrc={mechImgSrc} width="16vh" height="16vh"
                scaleOverrides={{ chasis: 1, backpack: 2 }} cropLeftPercent={13}
                defaultParts={defaultPreviewParts} championMode={championMode} style={{ flex: '1' }}
              />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};