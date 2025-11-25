import React from 'react';
import { TabsContent } from '../../../radix-ui/tabs';
import { Button } from '../../../radix-ui/button';
import { Dialog, DialogContent, DialogTrigger } from '../../../radix-ui/dialog';
import { Trash2, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Team } from '../../../../data/types';

interface TacticTabMobileContentProps {
  team: Team;
  mobileOrTablet: boolean;
  imgsrc: string;
  tabsrc: string;
  translations: any;
  onSetViewMode: (mode: any) => void;
  onSetIsChangingPart: (val: boolean) => void;
  deleteTacticCard: (id: number) => void;
}

export const TacticTabMobileContent: React.FC<TacticTabMobileContentProps> = ({
  team, mobileOrTablet, imgsrc, tabsrc, translations, onSetViewMode, onSetIsChangingPart, deleteTacticCard
}) => {
  return (
    <AnimatePresence mode="wait">
      <TabsContent value="tacticCards" className="flex-1 overflow-y-auto p-4 space-y-0">
        <motion.div
          style={{ display: "grid", gridTemplateColumns: mobileOrTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: "1rem" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="flex-1 overflow-y-auto p-4 space-y-0"
        >
          {team.tacticCards?.map((tacticCards, index) => (
            <div key={`${tacticCards.id}-${index}`} className="relative p-0 overflow-hidden cursor-pointer transition shadow-lg shadow-gray-500 rounded-lg" style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 10px rgba(0,0,0,0.1)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)'; }}
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="absolute top-0 bottom-0 text-white shadow-lg shadow-gray-500 rounded-lg bg-blue-500/80">
                    <ZoomIn className="w-3 h-3 text-white" style={{ filter: `drop-shadow(0 0 1px gray) drop-shadow(0 0 1px gray) drop-shadow(0 0 1px gray)` }} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-0 shadow-none bg-transparent p-0">
                  <img key={tacticCards.id} src={`${imgsrc}/${tacticCards.id}.png`} alt={tacticCards.name} className="w-full h-auto object-contain rounded-lg" />
                </DialogContent>
              </Dialog>

              <Button variant="secondary" className="h-6 w-8 absolute bg-blue-500/50 left-0 bottom-0 shadow-lg shadow-gray-500 rounded-lg z-0" style={{ color: 'white', textShadow: '0 0 4px rgba(0,0,0,0.7)' }}>{tacticCards?.score}</Button>
              <img src={`${imgsrc}/${tacticCards.id}.png`} alt={tacticCards.name} onClick={() => onSetViewMode('tacticCards')} className="shadow-lg shadow-gray-500 rounded-lg" style={{ width: '100%', height: '100%', objectFit: 'contain' }} draggable={false} />
              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); deleteTacticCard(index); }} className="absolute top-0 right-0 shadow-lg shadow-gray-500 rounded-lg text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
            </div>
          ))}

          <div style={{ position: 'relative', display: 'flex', padding: '1rem', cursor: 'pointer' }} onClick={() => { onSetViewMode('tacticCards'); onSetIsChangingPart(true); }}>
            <img src={`${imgsrc}/274.png`} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', opacity: 0 }} draggable={false} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <img src={`${tabsrc}/tactic.png`} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', opacity: 1 }} draggable={false} />
            </div>
          </div>
        </motion.div>
      </TabsContent>
    </AnimatePresence>
  );
};