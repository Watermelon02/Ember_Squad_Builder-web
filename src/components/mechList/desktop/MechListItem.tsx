import React from 'react';
import { Card } from '../../radix-ui/card';
import { Button } from '../../radix-ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogClose } from '../../radix-ui/dialog';
import { Trash2, ZoomIn, Repeat, Rocket } from 'lucide-react';
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { motion, AnimatePresence } from 'framer-motion';
import { PartCard } from '../../customCard/partCard/PartCard';
import { MechPreview } from '../../custom/MechPreview';
import { MechStatus } from '../../custom/MechStatus';
import PilotStats from '../../custom/PilotStats';
import { Mech, PART_TYPE_NAMES, MechPartType, Team } from '../../../data/types';
import { checkWhiteDwarf } from '../../../util/CustomCardUtil';
import { gofBackpack, gofChasis, gofLeftHand, gofRightHand, gofTorso, rdlBackpack, rdlChasis, rdlLeftHand, rdlRightHand, rdlTorso, unBackpack, unChasis, unLeftHand, unRightHand, unTorso } from '../../../data/data_cn';

interface MechListItemProps {
  mech: Mech;
  team: Team;
  selectedMechId: string;
  onSelectMech: (id: string) => void;
  onSelectPartType: (type: string) => void;
  onSetViewMode: (mode: any) => void;
  onSetIsChangingPart: (val: boolean) => void;
  cPartType: string;
  setCPartType: (type: string) => void;
  deletePart: (mechId: string, partType: string) => void;
  orderedPartTypes: MechPartType[];
  mobileOrTablet: boolean;
  imgsrc: string;
  tabsrc: string;
  lang: string;
  animationCardMode: boolean;
  mechImgSrc: string;
  championMode: boolean;
  translations: any;
  // Stats Props
  editingMechId: string;
  setEditingMechId: (id: string) => void;
  updateMechName: (id: string, name: string) => void;
  copyMech: (mech: Mech) => void;
  deleteMech: (id: string) => void;
  getColorByAttr: (type: string, value: number) => string;
}

export const MechListItem: React.FC<MechListItemProps> = ({
  mech, team, selectedMechId, onSelectMech, onSelectPartType, onSetViewMode, onSetIsChangingPart,
  cPartType, setCPartType, deletePart, orderedPartTypes, mobileOrTablet, imgsrc, tabsrc, lang,
  animationCardMode, mechImgSrc, championMode, translations,
  editingMechId, setEditingMechId, updateMechName, copyMech, deleteMech, getColorByAttr
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  function getFactionColor(faction: string, alpha: number) {
    switch (faction) {
      case 'RDL': return `rgba(255, 0, 0, ${alpha})`;
      case 'UN': return `rgba(0, 80, 255, ${alpha})`;
      case 'GOF': return `rgba(225, 208, 126, ${alpha})`;
      default: return `rgba(255, 255, 255, ${alpha})`;
    }
  }

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3, ease: "easeInOut" }}>
      <Card
        style={{
          paddingLeft: mobileOrTablet ? '2vw' : '1vw',
          paddingRight: mobileOrTablet ? '2vw' : '1vw',
          paddingTop: mobileOrTablet ? '1vh' : '1vh',
          paddingBottom: mobileOrTablet ? '0vh' : '1vh'
        }}
        className={`rounded-lg transition-transform duration-500 ease-in-out ${selectedMechId === mech.id ? 'scale-105 shadow-xl' : 'scale-100 shadow-md hover:scale-103 hover:shadow-lg'}`}
      >
        <div>
          {/* 部件网格 */}
          <div style={{ display: 'grid', width: '100%', gap: '12px', gridTemplateColumns: mobileOrTablet ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)' }}>
            {orderedPartTypes.map((partType) => (
              <AnimatePresence mode="wait" key={partType}>
                <motion.div
                  key={mech.parts[partType]?.id || partType}
                  initial={{ opacity: 0, y: -10, scale: ((cPartType === partType && selectedMechId === mech.id)) ? 1.12 : 1 }}
                  animate={{ opacity: 1, y: 0, scale: (cPartType === partType && selectedMechId === mech.id) ? 1.08 : 1 }}
                  exit={{ opacity: 0, y: 10, scale: (cPartType === partType && selectedMechId === mech.id) ? 1.08 : 1 }}
                  transition={{ duration: 0.1 }}
                  onMouseEnter={(e) => {
                    if (cPartType !== partType || selectedMechId !== mech.id) {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = "0 6px 10px rgba(0,0,0,0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (cPartType !== partType || selectedMechId !== mech.id) {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)";
                    }
                  }}
                  className={`relative p-0 overflow-hidden cursor-pointer transition shadow-lg shadow-gray-500 rounded-lg ${selectedMechId === mech.id ? "border-primary" : ""}`}
                >
                  {mech.parts[partType] ? (
                    <>
                      {/* 部件点击 */}
                      <div onClick={() => {
                        setCPartType(partType);
                        onSelectMech(mech.id);
                        onSelectPartType(partType);
                        onSetViewMode('parts');
                        onSetIsChangingPart(true);
                      }}>
                        {((!animationCardMode || (mech.parts[partType].hasImage === undefined) || !checkWhiteDwarf(mech.parts[partType]!.id))) ?
                          <img
                            key={mech.parts[partType]!.id}
                            src={`${imgsrc}/${mech.parts[partType]!.id}.png`}
                            alt={mech.parts[partType]!.name}
                            loading="lazy"
                            className="w-full h-auto object-contain rounded-lg"
                            style={{ scale: (mech.parts[partType].hasImage === undefined ? "1.1" : "1") }}
                          /> :
                          <div style={{ scale: (mech.parts[partType].hasImage === undefined ? "1.1" : "1"), display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
                            <PartCard isThrowCard={false} faction={team.faction} part={mech.parts[partType]} tabsrc={tabsrc} lang={lang} />
                          </div>}
                      </div>

                      <Button variant="ghost" size="sm" onClick={() => deletePart(mech.id, partType)} className="absolute top-0 right-0 text-white shadow-lg shadow-gray-500 rounded-lg hover:text-destructive z-[100]">
                        <Trash2 className="w-4 h-4" />
                      </Button>

                      {team.faction !== "GOF" && <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="absolute top-0 left-0 text-white shadow-lg shadow-gray-500 rounded-lg bg-blue-500/80">
                            <ZoomIn className="w-3 h-3 text-gray-700" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="border-0 shadow-none bg-transparent p-0">
                          {mech.parts[partType] && (
                            <img src={`${imgsrc}/${mech.parts[partType]!.id}.png`} alt={mech.parts[partType]!.name} className="w-full h-auto object-contain rounded-lg" />
                          )}
                        </DialogContent>
                      </Dialog>}

                      <Button variant="secondary" className="h-6 w-8 flex absolute bottom-0 left-0 m-1 text-xs shadow-lg shadow-gray-500 rounded-lg bg-blue-500/80 " style={{ color: 'white', textShadow: '0 0 4px rgba(0,0,0,0.7)' }}>
                        {mech.parts[partType]?.score}
                      </Button>

                      {/* 抛射物和发射物 */}
                      <div className="absolute bottom-0 right-0 flex flex-col-reverse items-end gap-0.5">
                        {!!mech.parts[partType]?.throwIndex && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="secondary" className="h-6 w-8 flex bottom-0 left-0 m-1 text-xs shadow-lg shadow-gray-500 rounded-lg bg-blue-500/80">
                                <Repeat className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="border-0 shadow-none bg-transparent p-0">
                              <img src={`${imgsrc}/${mech.parts[partType]?.throwIndex}.png`} alt={mech.parts[partType]!.name} className="w-full h-auto object-contain rounded-lg" />
                            </DialogContent>
                          </Dialog>
                        )}
                        {Array.isArray(mech.parts[partType]?.projectile) && mech.parts[partType]!.projectile!.length > 0 && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="secondary" className="h-6 w-8 flex bottom-0 left-0 m-1 text-xs shadow-lg shadow-gray-500 rounded-lg bg-blue-500/80">
                                <Rocket className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent style={{ border: 0, boxShadow: "none", background: "transparent", padding: "24px", maxHeight: "90vh", overflowY: "auto" }}>
                              <DialogHeader>
                                <DialogTitle><VisuallyHidden>Projectile Images</VisuallyHidden></DialogTitle>
                                <DialogClose className="absolute top-2 right-2 text-gray-500 hover:text-gray-900" aria-label="Close">✕</DialogClose>
                              </DialogHeader>
                              <div style={{ display: "flex", flexDirection: "column", gap: "24px", alignItems: "center" }}>
                                {mech.parts[partType]!.projectile!.map((proj, idx) => (
                                  <img key={idx} src={`${imgsrc}/${proj}.png`} alt={`Projectile ${proj}`} style={{ width: "90vw", maxWidth: "500px", height: "auto", objectFit: "contain", borderRadius: "0.5rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }} />
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
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
          </div>

          {/* 驾驶员 + 预览 + 状态 */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1vh', marginTop: "2vh" }} >
            {!mobileOrTablet && (
              <div onClick={() => { onSelectMech(mech.id); onSetViewMode('pilots'); onSetIsChangingPart(true); }} style={{ flex: '0 0 20vw', height: '20vh', position: 'relative', cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
                <AnimatePresence mode="wait">
                  {(selectedMechId === mech.id && mech.pilot !== undefined) && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: '0.5rem', background: `conic-gradient(from 0deg, ${getFactionColor(team.faction, 0.5)}, ${getFactionColor(team.faction, 0.2)}, ${getFactionColor(team.faction, 0.5)})`, zIndex: 0, transformOrigin: 'center' }} />
                  )}
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  {mech.pilot ? (
                    <motion.div key={mech.pilot.id} initial={{ opacity: 0, x: 20, scale: 0.97 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 20, scale: 0.97 }} transition={{ duration: 0.3 }} style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}>
                      <img src={`${tabsrc}/${mech.pilot.id}.png`} alt={mech.pilot.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transform: 'translate(10%, 0%)' }} />
                    </motion.div>
                  ) : (
                    <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#9ca3af', fontSize: '0.875rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                      {translations.t27}
                    </span>
                  )}
                </AnimatePresence>
                {mech.pilot && <Button variant="secondary" className="h-6 w-8 flex absolute top-0 right-0 m-1 text-xs shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', boxShadow: '0 0 12px rgba(0,0,0,0.2)', color: 'white', textShadow: '0 0 4px rgba(0,0,0,0.7)', zIndex: 2 }}>{mech.pilot?.score}</Button>}
                {mech.pilot && <PilotStats pilot={mech.pilot} tabsrc={tabsrc} style={{ position: 'absolute', left: '0.2rem', top: '0.2rem', zIndex: 2 }} />}
                {mech.pilot && (
                  <div style={{ position: 'absolute', bottom: '0.5rem', left: '6vw', right: '0.5rem', color: 'white', textShadow: '0 0 4px rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'end', zIndex: 2 }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1vw', textShadow: '0 0 6px rgba(0,0,0,1)' }}>{mech.pilot.name}</span>
                    <span style={{ fontSize: '0.7vw', color: 'white', textShadow: `-1px -1px 1px #000, 1px -1px 1px #000, -1px 1px 1px #000, 1px 1px 1px #000` }}>{mech.pilot.traitDescription}</span>
                  </div>
                )}
              </div>
            )}

            {!mobileOrTablet && team.faction === 'RDL' && (
              <MechPreview mech={mech} mechImgSrc={mechImgSrc} width="20vh" height="20vh" scaleOverrides={{ chasis: 1, backpack: 2 }} cropLeftPercent={13} defaultParts={{ leftHand: rdlLeftHand[0], torso: rdlTorso[0], rightHand: rdlRightHand[0], chasis: rdlChasis[1], backpack: rdlBackpack[0] }} championMode={championMode} />
            )}
            {!mobileOrTablet && (team.faction == 'UN') && (
              <MechPreview mech={mech} mechImgSrc={mechImgSrc} width="20vh" height="20vh" scaleOverrides={{ chasis: 1, backpack: 1, leftHand: 1, rightHand: 1, torso: 1 }} defaultParts={{ leftHand: unLeftHand[3], torso: unTorso[5], rightHand: unRightHand[8], chasis: unChasis[0], backpack: unBackpack[3] }} championMode={championMode} />
            )}
            {!mobileOrTablet && (team.faction === 'GOF') && (
              <MechPreview mech={mech} mechImgSrc={mechImgSrc} width="20vh" height="20vh" scaleOverrides={{ chasis: 1, backpack: 1, leftHand: 1, rightHand: 1, torso: 1 }} defaultParts={{ leftHand: gofLeftHand[0], torso: gofTorso[0], rightHand: gofRightHand[0], chasis: gofChasis[0], backpack: gofBackpack[0] }} championMode={championMode} />
            )}

            {!mobileOrTablet && (
              <MechStatus mech={mech} translations={translations} tabsrc={tabsrc} lang={lang} editingMechId={editingMechId} setEditingMechId={setEditingMechId} updateMechName={updateMechName} copyMech={copyMech} deleteMech={deleteMech} getColorByAttr={getColorByAttr} style={{ flex: '1' }} isMobile={mobileOrTablet} />
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};