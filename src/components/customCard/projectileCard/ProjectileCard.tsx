import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, Zap, Wind, Move, Package, ArrowBigUp } from 'lucide-react';
import './ProjectileCard.css';
import { Action, Projectile } from '../../../types';
import { TilingCrossPattern } from '../TilingCrossPattern';
import { DroneOrProjectileActionItem } from '../DroneOrProjectileActionItem/ActionItem';
import { getDroneCardBackGroundClassName } from '../../../util/CustomCardUtil';

interface ProjectileCardProps extends React.ComponentProps<'div'> {
    projectile: Projectile;
    tabsrc: string;
    faction: string;
    lang: string;
}


export const ProjectileCard: React.FC<ProjectileCardProps> = ({ projectile, faction, tabsrc, lang, ...restProps }) => {
    const CARD_WIDTH_VH = 32;
    const LEFT_OFFSET_VH = 5;
    const RIGHT_OFFSET_VH = 7;
    const AVAILABLE_WIDTH_VH = CARD_WIDTH_VH - LEFT_OFFSET_VH - RIGHT_OFFSET_VH;

    const AVAILABLE_HEIGHT_PERCENT = '80%'; // 限制图案的高度
    return (
        <motion.div
            className={`projectile-card ${getDroneCardBackGroundClassName(faction, projectile.isPD)}`}
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

            <div className="projectile-main-image-wrapper">
                {projectile.hasImage === undefined || projectile.hasImage ? <img
                    src={`${tabsrc}/${projectile.id}.png`}
                    alt={`${projectile.name} Main Image`}
                    className="projectile-main-image"
                    loading='lazy'
                /> : <span className='placeholder'>{projectile.name}</span>}
            </div>

            <div className="projectile-main-image-wrapper-shadow">
                {projectile.hasImage === undefined || projectile.hasImage && <img
                    src={`${tabsrc}/${projectile.id}.png`}
                    alt={`${projectile.name} Main Image`}
                    className="projectile-main-image-shadow"
                    loading='lazy'
                />}
            </div>
            <div className='card-overlay'>
                <div className="projectile-card-content">
                    {/* Left: Name */}
                    <div className="projectile-name">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {projectile.name}
                        </motion.span>
                    </div>

                    {/* Top Right: Stats */}
                    <div className="projectile-stats-top">
                        {projectile.electronic > 0 && <div className="stat-item stat-electronic">
                            <img className="icon-top-left" loading='lazy' src={`${tabsrc}/icon_electronic.png`} />
                            <span className="stat-val">{projectile.electronic}</span>
                        </div>}
                        {projectile.dodge > 0 && <div className="stat-item stat-dodge">
                            <img loading='lazy' src={`${tabsrc}/icon_dodge.png`} className="icon-top-left" />
                            <span className="stat-val">{projectile.dodge}</span>
                        </div>}
                        <div className="stat-item stat-armor">
                            <span className="stat-val">{projectile.armor}</span>
                        </div>
                        {projectile.structure > 0 && <div className="stat-item stat-structure">
                            <span className="stat-val">{projectile.structure}</span>
                        </div>}
                    </div>

                    {/* Middle: Actions */}
                    <div className="projectile-actions">
                        <div className="keyword-row">
                            {/* <span className="name-large">{projectile.keywords[0].name}</span>
                            <span className="value-small-bg">{projectile.keywords[1].name}</span> */}
                        </div>
                        <div className="projectile-right-grid-bg">
                            <div className="projectile-grid-background">
                                {Array.from({ length: 72 }).map((_, i) => (
                                    <div key={i} className="projectile-grid-bg-cell" />
                                ))}
                            </div>
                        </div>
                        <div className="action-items-wrapper">
                            {projectile.actions?.map((action, index) => (
                                <DroneOrProjectileActionItem key={action.id} action={action} index={index} tabsrc={tabsrc} lang={lang} />
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="projectile-footer">
                        {/* Stance */}
                        <div className={`stance-bar stance-${projectile.stance}`}>
                            <div className="stance-indicator" />
                            <span className="stance-text">{projectile.stance}</span>
                        </div>

                        {/* Move */}
                        <div className="move-label">
                            <ArrowBigUp size="3vh" className="move-icon" />
                            <span>{projectile.move}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
