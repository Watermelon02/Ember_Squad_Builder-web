import React from 'react';
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../radix-ui/badge';
import { Input } from '../radix-ui/input';
import { TeamEligibility } from '../radix-ui/TeamEligibility';
import { MechImage } from '../custom/MechImage';
import { DroneImage } from '../custom/DroneImage';
import { Team, FACTION_COLORS } from '../../data/types';

interface TeamCardProps {
  team: Team;
  index: number;
  isSelected: boolean;
  isEditing: boolean;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  onSelect: (id: string) => void;
  onUpdateName: (id: string, name: string) => void;
  setEditingId: (id: string) => void;
  translations: any;
  factionNames: Record<string, string>;
  tabsrc: string;
  itemsPerRow: number;
  itemSize: number;
  gap: number;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  team,
  isSelected,
  isEditing,
  provided,
  snapshot,
  onSelect,
  onUpdateName,
  setEditingId,
  translations,
  factionNames,
  tabsrc,
  itemsPerRow,
  itemSize,
  gap
}) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={{
        userSelect: 'none',
        ...provided.draggableProps.style,
        flexShrink: 0,
        borderRadius: '16px',
        overflow: 'hidden',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(255,255,255,0.3)',
        border: '1px solid rgba(255,255,255,0.15)',
        cursor: 'grab',
        boxShadow: isSelected
          ? `0 4px 12px rgba(0,0,0,0.2), 0 0 12px ${FACTION_COLORS[team.faction]}88, 0 0 24px ${FACTION_COLORS[team.faction]}44`
          : (snapshot.isDragging ? "0 15px 30px rgba(0,0,0,0.3)" : "0 2px 6px rgba(0,0,0,0.1)"),
        transition: 'box-shadow 0.3s, transform 0.2s',
        padding: '0.5rem 1rem',
      }}
      onClick={() => onSelect(team.id)}
    >
      <div className="space-y-2">
        {/* 标题行 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              style={{
                background: `linear-gradient(to right, ${FACTION_COLORS[team.faction]}, ${FACTION_COLORS[team.faction]}33)`,
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "0.25rem 0.5rem",
                fontWeight: 600,
                boxShadow: isSelected
                  ? `0 4px 12px rgba(0,0,0,0.2), 0 0 12px ${FACTION_COLORS[team.faction]}88, 0 0 24px ${FACTION_COLORS[team.faction]}44`
                  : "0 2px 6px rgba(0,0,0,0.1)",
                cursor: "default",
                transition: "box-shadow 0.3s, transform 0.2s",
                display: "inline-block",
              }}
            >
              {factionNames[team.faction]}
            </Badge>

            <TeamEligibility team={team} translations={translations} />

            {isEditing ? (
              <Input
                value={team.name}
                onChange={(e) => onUpdateName(team.id, e.target.value)}
                onBlur={() => setEditingId('')}
                onKeyDown={(e) => e.key === 'Enter' && setEditingId('')}
                autoFocus
                onClick={(e) => e.stopPropagation()}
                style={{ color: 'gray' }}
              />
            ) : (
              <span
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setEditingId(team.id);
                }}
                style={{ color: 'gray', fontWeight: 500 }}
              >
                {team.name || "1"}
              </span>
            )}
          </div>
        </div>

        {/* 数据统计行 */}
        <div className="grid grid-cols-5 gap-2 text-center">
          {[
            { label: translations.t7, value: team.totalScore, highlight: team.totalScore > 900 },
            { label: translations.t8, value: team.mechCount },
            { label: translations.t9, value: team.largeDroneCount },
            { label: translations.t10, value: team.mediumDroneCount },
            { label: translations.t11, value: team.smallDroneCount },
          ].map((stat, idx) => (
            <div key={idx}>
              <div style={{ color: 'gray', fontSize: '0.875rem' }}>{stat.label}</div>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={stat.value}
                  initial={{ scale: 0.9, y: 5, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.9, y: -5, opacity: 0 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
                  style={{ color: stat.highlight ? '#dc2626' : 'gray' }}
                >
                  {stat.value}
                </motion.div>
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* 视觉单位展示区 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${gap}px` }}>
          <AnimatePresence mode="popLayout">
            {team.mechs.map((mech, idx) => (
              <motion.div key={`mech-${mech.id ?? idx}`} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <MechImage mech={mech} tabsrc={tabsrc} translation={translations} />
              </motion.div>
            ))}
            {team.drones.map((drone, idx) => (
              <motion.div key={`drone-${drone.id}-${idx}`} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <DroneImage drone={drone} tabsrc={tabsrc} />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* 占位填充 */}
          {(() => {
            const totalItems = team.mechs.length + team.drones.length;
            const remainder = totalItems % itemsPerRow;
            const placeholders = remainder === 0 ? 0 : itemsPerRow - remainder;
            return Array.from({ length: placeholders }).map((_, idx) => (
              <div
                key={`placeholder-${idx}`}
                style={{
                  width: `${itemSize}px`,
                  height: `${itemSize}px`,
                  borderRadius: '8px',
                  backgroundImage: 'repeating-linear-gradient(45deg, #eee, #eee 4px, #ddd 4px, #ddd 8px)',
                }}
              />
            ));
          })()}
        </div>
      </div>
    </div>
  );
};