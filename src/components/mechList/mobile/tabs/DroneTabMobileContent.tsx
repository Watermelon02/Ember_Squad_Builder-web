import React from 'react';
import { TabsContent } from '../../../radix-ui/tabs';
import { Button } from '../../../radix-ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '../../../radix-ui/dialog';
import { Trash2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Team, Drone, calculateTotalScore } from '../../../../data/types';
import { unBackpack } from '../../../../data/data_cn';

interface DroneTabMobileContentProps {
  team: Team;
  mobileOrTablet: boolean;
  imgsrc: string;
  translations: any;
  onSetViewMode: (mode: any) => void;
  onSetIsChangingPart: (val: boolean) => void;
  onSelectDrone: (drone: Drone) => void;
  deleteDrone: (index: number) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (val: boolean) => void;
  onUpdateTeam: (id: string, updates: Partial<Team>) => void;
}

export const DroneTabMobileContent: React.FC<DroneTabMobileContentProps> = ({
  team, mobileOrTablet, imgsrc, translations, onSetViewMode, onSetIsChangingPart,
  onSelectDrone, deleteDrone, isDialogOpen, setIsDialogOpen, onUpdateTeam
}) => {
  return (
    <TabsContent value="drones" className="flex-1 overflow-y-auto p-4 space-y-0">
      <div style={{ display: "grid", gridTemplateColumns: mobileOrTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: "16px" }}>
        {team.drones.map((drone, index) => (
          <motion.div
            key={`${drone.id}-${index}`}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.1, delay: index * 0.1, ease: "easeOut" }}
            className="relative p-0 overflow-hidden cursor-pointer transition shadow-lg shadow-gray-500 rounded-lg"
            style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
            onClick={() => { onSetViewMode('drones'); onSetIsChangingPart(true); onSelectDrone(drone) }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 10px rgba(0,0,0,0.1)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)'; }}
          >
            {drone.id === "162" && (
              <Dialog>
                <DialogTrigger asChild>
                  <div onClick={(e) => { e.stopPropagation(); }} className="absolute bottom-0 left-0 flex items-center justify-center bg-blue-500/50 shadow-md rounded-lg cursor-pointer z-10 hover:bg-blue-500/70" style={{ width: '6vw', height: 'auto', aspectRatio: '1' }}>
                    {drone.backpack ? (
                      <img src={`${imgsrc}/${drone.backpack.id}.png`} alt={drone.backpack.name} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} draggable={false} />
                    ) : (
                      <span className="text-xs text-muted-foreground bottom-0" style={{ color: 'white', textShadow: '0 0 4px rgba(0,0,0,0.7)' }}>{translations.t68}</span>
                    )}
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-5xl w-[90vw]" open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogHeader><DialogTitle>{translations.t103} {drone.name} {translations.t68}</DialogTitle></DialogHeader>
                  <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '8px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    {unBackpack.map((bp: any) => (
                      <button
                        key={bp.id} type="button" className="relative h-28 cursor-pointer hover:bg-muted rounded-lg flex items-center justify-center p-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          const updatedDrones = [...team.drones];
                          updatedDrones[index] = { ...drone, backpack: bp };
                          const totalScore = calculateTotalScore(updatedDrones, team.tacticCards, team.mechs);
                          onUpdateTeam(team.id, { drones: updatedDrones, totalScore });
                          setIsDialogOpen(false);
                        }}
                        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                      >
                        <img src={`${imgsrc}/${bp.id}.png`} alt={bp.name} style={{ width: '20vw', height: 'auto', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }} draggable={false} />
                        <Button variant="secondary" className="absolute bg-blue-500/50 left-0 bottom-0 shadow-lg shadow-gray-500 rounded-lg" style={{ color: 'white', textShadow: '0 0 4px rgba(0,0,0,0.7)' }}>{bp?.score}</Button>
                      </button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            )}

            <Button variant="secondary" className="h-6 w-8 absolute bg-blue-500/50 left-0 top-0 shadow-lg shadow-gray-500 rounded-lg z-0" style={{ color: 'white', textShadow: '0 0 4px rgba(0,0,0,0.7)' }}>{drone?.score}</Button>
            <img src={`${imgsrc}/${drone.id}.png`} alt={drone.name} className="shadow-lg shadow-gray-500 rounded-lg" style={{ width: '100%', height: '100%', objectFit: 'contain' }} draggable={false} />
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); deleteDrone(index); }} className="absolute top-0 right-0 shadow-lg shadow-gray-500 rounded-lg text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
          </motion.div>
        ))}

        <div style={{ position: 'relative', display: 'flex', padding: '1rem', cursor: 'pointer' }} onClick={() => { onSetIsChangingPart(true); onSetViewMode('drones') }}>
          <img src={`${imgsrc}/080.png`} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', opacity: 0 }} draggable={false} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <Plus style={{ width: '24px', height: '24px', color: '#6b7280', marginBottom: '4px' }} />
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{translations.t75}</span>
          </div>
        </div>
      </div>
      {!mobileOrTablet && team.drones.length === 0 && <div className="text-center text-muted-foreground py-8">{translations.t31}</div>}
    </TabsContent>
  );
};