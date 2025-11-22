import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, Zap, Wind, Move, Package, ArrowBigUp } from 'lucide-react';
import './DroneCard.css';
import { Action, Drone } from '../../../types';
import { DroneOrProjectileActionItem } from '../DroneOrProjectileActionItem/ActionItem';
import { TilingCrossPattern } from '../TilingCrossPattern';
import { getDroneCardBackGroundClassName } from '../../../util/CustomCardUtil';

interface DroneCardProps {
    drone: Drone;
    tabsrc: string;
    faction:string;
}


export const DroneCard: React.FC<DroneCardProps> = ({ drone, tabsrc,faction }) => {
    const CARD_WIDTH_VH = 21;
    const LEFT_OFFSET_VH = 0;
    const RIGHT_OFFSET_VH = 0;
    const AVAILABLE_WIDTH_VH = CARD_WIDTH_VH - LEFT_OFFSET_VH - RIGHT_OFFSET_VH;

    const AVAILABLE_HEIGHT_PERCENT = '80%'; // 限制图案的高度
    return (
        <motion.div
            className={`drone-card ${getDroneCardBackGroundClassName(faction,drone.isPD)}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: `${LEFT_OFFSET_VH}vh`,
                    width: `${AVAILABLE_WIDTH_VH}vh`,
                    height: AVAILABLE_HEIGHT_PERCENT,
                    overflow: 'hidden',
                    zIndex: 0,
                    pointerEvents: 'none',
                }}
            >
                <TilingCrossPattern zIndex={0} opacity={0.8} />
            </div>

            <div className="drone-main-image-wrapper">
                {drone.hasImage === undefined || drone.hasImage ? <img
                    src={`${tabsrc}/${drone.id}.png`}
                    alt={`${drone.name} Main Image`}
                    className="drone-main-image"
                    loading='lazy'
                /> : <span className='placeholder'>{drone.name}</span>}
            </div>

            <div className="drone-main-image-wrapper-shadow">
                {drone.hasImage && <img
                    src={`${tabsrc}/${drone.id}.png`}
                    alt={`${drone.name} Main Image`}
                    className="drone-main-image-shadow"
                    loading='lazy'
                />}
            </div>
            <div className='card-overlay'>
                <div className="drone-card-content">
                    {/* Left: Name */}
                    <div className="drone-name">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {drone.name}
                        </motion.span>
                    </div>

                    {/* Top Right: Stats */}
                    <div className="drone-stats-top">
                        {drone.electronic > 0 && <div className="stat-item stat-electronic">
                            <img className="icon-top-left" loading='lazy' src={`${tabsrc}/icon_electronic.png`} />
                            <span className="stat-val">{drone.electronic}</span>
                        </div>}
                        {drone.dodge > 0 && <div className="stat-item stat-dodge">
                            <img loading='lazy' src={`${tabsrc}/icon_dodge.png`} className="icon-top-left" />
                            <span className="stat-val">{drone.dodge}</span>
                        </div>}
                        <div className="stat-item stat-armor">
                            <span className="stat-val">{drone.armor}</span>
                        </div>
                        {drone.structure > 0 && <div className="stat-item stat-structure">
                            <span className="stat-val">{drone.structure}</span>
                        </div>}
                    </div>

                    {/* Middle: Actions */}
                    <div className="drone-actions">
                        <div className="drone-right-grid-bg">
                            <div className="drone-grid-background">
                                {Array.from({ length: 72 }).map((_, i) => (
                                    <div key={i} className="drone-grid-bg-cell" />
                                ))}
                            </div>
                        </div>
                        <div className="action-items-wrapper">
                            {drone.actions?.map((action, index) => (
                                <DroneOrProjectileActionItem key={action.id} action={action} index={index} tabsrc={tabsrc} />
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="drone-footer">
                        {/* Stance */}
                        <div className={`drone-stance-bar drone-stance-${drone.stance}`}>
                            <div className="drone-stance-indicator" />
                            <span className="drone-stance-text">{drone.stance}</span>
                        </div>

                        {/* Move */}
                        <div className="move-label">
                            <ArrowBigUp size="3vh" className="move-icon" />
                            <span>{drone.move}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
