import { motion } from "framer-motion";
import { Pilot } from "../../types";

interface PilotStatsProps {
  pilot: Pilot;
  tabsrc: string;
  style?: React.CSSProperties;
}

export const PilotStats: React.FC<PilotStatsProps> = ({ pilot, tabsrc, style }) => {
  const stats = [
    { key: 'swift', value: pilot.swift, color: '#F3EC73' },
    { key: 'melee', value: pilot.melee, color: '#EDB246' },
    { key: 'projectile', value: pilot.projectile, color: '#DC6570' },
    { key: 'firing', value: pilot.firing, color: '#DB5C4B' },
    { key: 'moving', value: pilot.moving, color: '#18ACDC' },
    { key: 'tactic', value: pilot.tactic, color: '#8AC4A5' },
  ];

  return (
    <div
      style={{
        width: '30%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3rem',
        padding: '0.5rem',
        borderRadius: '0.8rem',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: '0 0 12px rgba(0,0,0,0.2)',
        ...style,
      }}
    >
      {stats.map((attr) => {
        const barLength = ((10 - attr.value) / 9) * 100;

        return (
          <div
            key={attr.key}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            {/* 图标 */}
            <img
              src={`${tabsrc}/icon_${attr.key}.png`}
              alt={attr.key}
              style={{
                width: '1.2vw',
                height: '1.2vw',
                objectFit: 'contain',
                filter: `drop-shadow(0 0 6px ${attr.color})`,
              }}
            />

            {/* 柱子 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                flex: 1,
                height: '20%',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '0.4vh',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${barLength}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  borderRadius: '0.4vh',
                  background: attr.color,
                  boxShadow: `0 0 8px ${attr.color}, 0 0 16px ${attr.color}44`,
                  position: 'relative',
                }}
              />
            </motion.div>

            {/* 数值 */}
            <span
              style={{
                minWidth: '1.2vw',
                textAlign: 'left',
                fontSize: '1vh',
                fontWeight: 'bold',
                color: 'white',
                textShadow: `
                  -1px -1px 0 #000,
                   1px -1px 0 #000,
                  -1px  1px 0 #000,
                   1px  1px 0 #000
                `,
                pointerEvents: 'none',
              }}
            >
              {attr.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default PilotStats;
