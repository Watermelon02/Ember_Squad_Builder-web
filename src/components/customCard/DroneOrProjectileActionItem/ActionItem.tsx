import { Rocket } from "lucide-react";
import { DroneAction } from "../../../types";
import { motion } from 'framer-motion';
import './ActionItem.css';
import { getTypeIcon } from "../../../util/CustomCardUtil";

const getTypeGradient = (type: DroneAction['type']) => {
  switch (type) {
    case 'Passive': return 'linear-gradient(135deg, #b4b4b4 0%, #909090 100%)';
    default: return 'linear-gradient(135deg, #000 0%, #000 100% )';
  }
};



export const DroneOrProjectileActionItem: React.FC<{ action: DroneAction; index: number, tabsrc: string }> = ({ action, index, tabsrc }) => {
  const hasStorage = action.storage > 0;
  const hasDice = !hasStorage && (action.redDice > 0 || action.yellowDice > 0);

  // Prepare dice array
  const dice = [];
  if (hasDice) {
    for (let i = 0; i < action.redDice; i++) dice.push('red');
    for (let i = 0; i < action.yellowDice; i++) dice.push('yellow');
  }

  return (
    <motion.div
      className="action-item"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.9)" }}
    >
      {/* Row 1: 时机，动作长度，名字 */}
      <div className="action-row-1">
        <div className="action-type-wrapper">
          <div className="action-type-icon">{getTypeIcon(action.type, tabsrc)}</div>
        </div>

        {/* 动速：指令、自动 */}
        {action.speed !== "passive" ?
          <div className="drone-action-speed vertical">

            {action.speed === 'auto' &&
              <span className="speed-text">?</span>
            }

            {action.speed === 'command'
              && <span className="speed-text">!</span>
            }
          </div> : <div className="drone-action-speed-passive vertical"></div>}

        <div
          className="drone-action-name"
          style={{ background: getTypeGradient(action.type) }}
        >
          |{action.name}|
        </div>
      </div>

      {/* Row 2: Content */}
      <div className="action-row-2">
        {/* Left Column: Stats */}
        <div className="action-content-left">
          {/* Range Row */}
          <div className="action-stat-row range-row">
            {action.range > 0 && <div className="range-badge">
              <div className="range-label">R</div>
              <div className={`range-value ${action.range === 0 ? 'striped' : ''}`}>
                {action.range > 0 && action.range}
              </div>
            </div>}
          </div>

          {/* Storage Row */}
          {hasStorage && (
            <div className="action-stat-row storage-row">
              {Array.from({ length: action.storage }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                >
                  <Rocket size="1.4vh" className="storage-icon-svg" />
                </motion.div>
              ))}
            </div>
          )}

          {/* Dice Row (Only if no storage) */}
          {hasDice && (
            <div className="action-stat-row dice-row">
              {dice.slice(0, 4).map((color, i) => (
                <motion.div
                  key={i}
                  className={`skeuomorphic-dice dice-${color}`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 + i * 0.05 }}
                />
              ))}
            </div>
          )}
          {hasDice && dice.length > 3 && (
            <div className="action-stat-row dice-row">
              {dice.slice(4, 8).map((color, i) => (
                <motion.div
                  key={i + 4}
                  className={`skeuomorphic-dice dice-${color}`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.35 + i * 0.05 }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Description */}
        <div className="drone-action-description">
          <div className="drone-description-text">
            {action.description}
          </div>
        </div>
      </div>
    </motion.div>
  );
};