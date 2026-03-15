import React, { useState } from 'react';
import { Tabs } from '../../radix-ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../radix-ui/dialog';
import { Button } from '../../radix-ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Team, Drone, MechPartType, FactionType, BOXES, FACTION_NAMES, FACTION_COLORS } from '../../../data/types';
import { MechImage } from '../../custom/MechImage';
import { DroneImage } from '../../custom/DroneImage';
import { useMechListLogic } from '../../../hooks/useMechListLogic';
import { MechListHeader } from './MechListHeader';
import { MechTabContent } from './tabs/MechTabContent';
import { DroneTabContent } from './tabs/DroneTabContent';
import { TacticTabContent } from './tabs/TacticTabContent';
import { BACKGROUND_SRC } from '../../../data/resource';
import { COLOR_GREY } from '../../../styles/color';


interface MechListProps {
  team?: Team;
  inventory?: Record<number, number>;
  selectedMechId: string;
  onSelectMech: (mechId: string) => void;
  onSelectPartType: (partType: string) => void;
  onUpdateTeam: (teamId: string, updates: Partial<Team>) => void;
  onSetViewMode: (mode: 'parts' | 'drones' | 'pilots' | 'tacticCards') => void;
  onSetIsChangingPart: (changingPart: boolean) => void,
  onSelectDrone: (droneId: Drone) => void;
  translations: any;
  partTypeNames: 'torso' | 'leftHand' | 'rightHand' | 'backpack' | 'chasis';
  imgsrc: string, tabsrc: string,
  localImgsrc: string, lang: string, mobileOrTablet: boolean, setLanguage: React.Dispatch<React.SetStateAction<"zh" | "en" | "jp">>,
  championMode: boolean,
  mechImgSrc: string,
  boxCoverSrc: string,
  animationCardMode: boolean,
  setAnimationCardMode: (mode: boolean) => void,
  onUpdateInventory: (inventory: Record<number, number>) => void;
  inventoryMode: boolean;
  onsetInventoryMode: (mode: boolean) => void;
}

export function MechList({
  team,
  inventory,
  selectedMechId,
  onSelectMech,
  onSelectPartType,
  onUpdateTeam,
  onSetViewMode,
  onSelectDrone,
  translations,
  partTypeNames = 'chasis',
  imgsrc, tabsrc,
  localImgsrc, lang, mobileOrTablet, setLanguage, championMode,
  mechImgSrc, onSetIsChangingPart, animationCardMode, setAnimationCardMode, onUpdateInventory, inventoryMode, onsetInventoryMode, boxCoverSrc
}: MechListProps) {
  const [filterFaction, setFilterFaction] = useState<FactionType | 'ALL'>('ALL');
  const logic = useMechListLogic({
    team, onUpdateTeam, onSelectMech, selectedMechId, translations, lang, mechImgSrc, imgsrc, tabsrc, localImgsrc,
    onUpdateInventory
  });

  if (!team) {
    return <div className="h-full flex items-center justify-center text-muted-foreground">{translations.t21}</div>;
  }

  // 在你的组件内部或 logic 对象中定义
  const factions: FactionType[] = ["RDL", "UN", "GOF", "PD", "COLLABORATION"];

  // 获取当前库存数量的辅助函数
  const getBoxCount = (boxId: number) => inventory?.[boxId] || 0;

  const handleUpdateInventory = (boxId: number, delta: number) => {
    const current = inventory?.[boxId] || 0;
    const next = Math.max(0, current + delta);

    // 这里的 logic.updateInventory 会触发外部的全局状态更新
    logic.updateInventory({
      inventory: {
        ...inventory,
        [boxId]: next
      }
    });
  };

  const orderedPartTypes: MechPartType[] = mobileOrTablet
    ? ["rightHand", "torso", "leftHand", "backpack", "chasis"]
    : (Object.keys(partTypeNames) as MechPartType[]);

  // 辅助函数
  const getColorByAttr = (type: string, value: number) => {
    const v = Math.min(Math.max(value, 1), 10);
    const dodgeColors = ["#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a", "#172554"];
    const electronicColors = ["#fef9c3", "#fef08a", "#fde047", "#facc15", "#eab308", "#ca8a04", "#a16207", "#854d0e", "#713f12", "#422006"];
    if (type === "dodge") return dodgeColors[v - 1];
    if (type === "electronic") return electronicColors[v - 1];
    return "#111";
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <Tabs defaultValue="mechs" className="flex-1 min-h-0 flex flex-col" onValueChange={(v) => {
        logic.setCurrentTab(v);
        switch (v) {
          case 'mechs':
            logic.setCPartType('');
            onSetViewMode('parts');
            break;
          case 'drones':
            onSetViewMode('drones');
            break;
          case 'tacticCards':
            onSetViewMode('tacticCards');
            break;
        }
      }}>

        {/* tts导出消息弹窗 */}
        <Dialog open={logic.TTSDialogOpen} onOpenChange={logic.setTTSDialogOpen}>
          <DialogContent style={{
              maxWidth: '60vw',
              width: '60vw',
              height: '50vh',
            }}>
            <DialogHeader><DialogTitle>{translations.t97}</DialogTitle></DialogHeader>
            <pre className="bg-muted p-4 rounded text-sm overflow-auto">{logic.script}</pre>
            <motion.div style={{ display: 'flex', flexWrap: 'wrap', gap: `2px` }}>
              <AnimatePresence mode="popLayout">
                {team.mechs.map((mech, index) => (
                  <motion.div key={`mech-${mech.id ?? index}`} initial={{ opacity: 0, scale: 0.8, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 10 }} transition={{ duration: 0.2 }}>
                    <MechImage mech={mech} tabsrc={tabsrc} translation={translations} />
                  </motion.div>
                ))}
                {team.drones.map((drone, index) => (
                  <motion.div key={`drone-${drone.id}-${index}`} initial={{ opacity: 0, scale: 0.8, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 10 }} transition={{ duration: 0.2 }}>
                    <DroneImage drone={drone} tabsrc={tabsrc} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(logic.script)}>
              {translations.t4}
            </Button>
          </DialogContent>
        </Dialog>

        {/* 设置已购盒 弹窗 */}
        <Dialog open={logic.boxListDialogOpen} onOpenChange={logic.setBoxListDialogOpen}>
          <DialogContent
            style={{
              maxWidth: '85vw',
              width: '85vw',
              height: '90vh',
              padding: 0,
              overflow: 'hidden',
              border: "0.1vh solid rgba(255,255,255,0.1)",
              backgroundColor: "transparent",
            }}
          >
            <div style={{
              width: "100%",
              height: "100%",

              display: "flex",

              backgroundColor: "transparent",
              position: "relative",
            }}>

              {/* --- 左侧边栏 --- */}
              <div style={{
                width: "15vw",
                height: "90vh",
                padding: "3vh 1.5vw",
                display: mobileOrTablet ? "none" : "flex",
                flexDirection: "column",
                // 核心修改：白色背景与浅色边框
                backgroundColor: "#ffffff",
                borderRight: "0.1vh solid #eaeaea",
                color: "#333", // 主文字颜色设为深灰
                flexShrink: 0,
                zIndex: 10
              }}>

                {/* 标题区域 */}
                <div style={{ marginBottom: '4vh' }}>
                  <h2 style={{ color: "#1a1a1a", fontSize: "2.4vh", fontWeight: '800', letterSpacing: "-0.02em" }}>
                    {translations.t112}
                  </h2>
                  <p style={{ color: "#888", fontSize: "1.3vh", marginTop: "0.8vh", lineHeight: "1.4" }}>
                    {translations.t113}
                  </p>
                </div>


                {/* 派系导航列表 */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8vh', // 稍微增加间距让阴影不重叠
                  flex: 1,
                  overflowY: 'auto',
                  marginRight: "-0.5vw",
                  paddingRight: "0.5vw",
                  paddingTop: "1vh" // 为第一个按钮的阴影留出空间
                }}>
                  {/* 将原 button 替换为 motion.button */}
                  <motion.button
                    whileHover={{ scale: 1.03, x: 4 }} // 悬停：微放大并向右偏移 4px
                    whileTap={{ scale: 0.98 }}      // 点击：轻微缩减压力感
                    onClick={() => setFilterFaction('ALL')}
                    style={{
                      padding: '1.2vh 1vw',
                      textAlign: 'left',
                      fontSize: '1.4vh',
                      fontWeight: filterFaction === 'ALL' ? '700' : '500',
                      borderRadius: '0.8vh',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: filterFaction === 'ALL' ? '#f5f5f7' : 'transparent',
                      color: filterFaction === 'ALL' ? '#000' : '#666',
                      // 添加选中时的微弱阴影
                      boxShadow: filterFaction === 'ALL' ? '0 0.4vh 1.2vh rgba(0,0,0,0.05)' : 'none',
                      transition: 'background-color 0.2s, color 0.2s', // 只有颜色走 transition，动画走 motion
                      marginBottom: '0.5vh'
                    }}
                  >
                    {translations.t114}
                  </motion.button>

                  {factions.map(f => {
                    const isSelected = filterFaction === f;
                    return (
                      <motion.button
                        key={f}
                        whileHover={{
                          scale: 1.03,
                          x: 4,
                          backgroundColor: isSelected ? `${FACTION_COLORS[f]}18` : "#f9f9fb"
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFilterFaction(f)}
                        style={{
                          padding: '1.2vh 1vw',
                          textAlign: 'left',
                          fontSize: '1.4vh',
                          fontWeight: isSelected ? '700' : '500',
                          borderRadius: '0.8vh',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.8vw',
                          // 选中状态的动态样式
                          backgroundColor: isSelected ? `${FACTION_COLORS[f]}12` : 'transparent',
                          color: isSelected ? FACTION_COLORS[f] : '#666',
                          // 选中时添加彩色外发光阴影
                          boxShadow: isSelected
                            ? `0 0.6vh 1.5vh ${FACTION_COLORS[f]}15`
                            : '0 0 0 rgba(0,0,0,0)',
                          transition: 'background-color 0.2s, color 0.2s, box-shadow 0.2s',
                        }}
                      >
                        <div style={{
                          width: '0.7vh',
                          height: '0.7vh',
                          borderRadius: '50%',
                          backgroundColor: isSelected ? FACTION_COLORS[f] : '#d1d1d6',
                          boxShadow: isSelected ? `0 0 0.8vh ${FACTION_COLORS[f]}` : 'none',
                          transition: 'all 0.2s'
                        }} />
                        {FACTION_NAMES.zh[f as keyof typeof FACTION_NAMES.zh] || f}
                      </motion.button>
                    );
                  })}
                </div>

                {/* 底部模式切换：UI 升级为卡片感 */}
                <div style={{
                  marginTop: "2vh",
                  padding: "2vh 1.2vw",
                  background: "#f9f9fb",
                  borderRadius: "1.5vh",
                  border: "0.1vh solid #f0f0f2"
                }}>
                  <div style={{
                    fontSize: "1.1vh",
                    color: "#999",
                    fontWeight: "700",
                    marginBottom: '1.5vh',
                    letterSpacing: "0.05em"
                  }}>
                    {translations.t115}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '1.2vh', color: inventoryMode ? '#999' : '#333', fontWeight: inventoryMode ? "400" : "600" }}>{translations.t117}</span>
                    <div
                      onClick={() => onsetInventoryMode(!inventoryMode)}
                      style={{
                        width: '4.2vh',
                        height: '2.4vh',
                        backgroundColor: inventoryMode ? COLOR_GREY : '#e5e5ea',
                        borderRadius: '1.2vh',
                        padding: '0.3vh',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                        transition: 'background-color 0.3s'
                      }}
                    >
                      <motion.div
                        initial={false}
                        animate={{ x: inventoryMode ? '1.8vh' : '0' }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        style={{
                          width: '1.8vh',
                          height: '1.8vh',
                          backgroundColor: '#fff',
                          borderRadius: '50%',
                          position: 'absolute',
                          left: '0.3vh',
                          boxShadow: "0 0.2vh 0.4vh rgba(0,0,0,0.15)"
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '1.2vh', color: inventoryMode ? '#888' : '#999', fontWeight: inventoryMode ? "600" : "400" }}>{translations.t116}</span>
                  </div>
                </div>
              </div>

              {/* --- 右侧内容区 --- */}
              <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                height: "90vh",
                position: 'relative',
                backgroundImage: `url(${BACKGROUND_SRC[lang]}/background2.svg)`,
                backdropFilter: "blur(1.6vh)",
                WebkitBackdropFilter: "blur(1.6vh)",
              }}>
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '3vh 2vw',
                }}>
                  <AnimatePresence mode="wait">
                    {factions
                      .filter(f => filterFaction === 'ALL' || filterFaction === f)
                      .map((faction) => {
                        const factionBoxes = Object.values(BOXES).filter(box =>
                          box.faction.includes(faction) && box.id !== 0
                        );
                        if (factionBoxes.length === 0) return null;

                        return (
                          <motion.div
                            key={faction}
                            initial={{ opacity: 0, y: '1vh' }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            style={{ marginBottom: '5vh' }}
                          >
                            <h3 style={{
                              fontSize: '1.6vh',
                              fontWeight: '800',
                              color: FACTION_COLORS[faction],
                              marginBottom: '2vh',
                              paddingBottom: '0.8vh',
                              borderBottom: `0.2vh solid ${FACTION_COLORS[faction]}22`,
                            }}>
                              {FACTION_NAMES.zh[faction as keyof typeof FACTION_NAMES.zh]}
                            </h3>

                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fill, minmax(18vw, 1fr))',
                              gap: '2vh'
                            }}>
                              {factionBoxes.map((box) => (
                                <div
                                  key={box.id}
                                  className='transition'
                                  style={{
                                    height: '25vh',
                                    borderRadius: '1.2vh',
                                    border: '0.1vh solid #e5e7eb',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    backgroundColor: '#f3f4f6',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    padding: '1.5vh',
                                  }}
                                  onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.transform = "scale(1.05)";
                                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                                      "0 6px 10px rgba(0,0,0,0.1)";
                                  }}
                                  onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                                      "0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)";
                                  }}
                                >
                                  {box.hasImage ? (
                                    <img
                                      src={`${boxCoverSrc}/${box.id}.webp`}
                                      alt={box.name.zh}
                                      loading="lazy"
                                      style={{
                                        position: 'absolute',
                                        inset: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        zIndex: 0
                                      }}
                                    />
                                  ) : (
                                    <div style={{
                                      position: 'absolute',
                                      inset: 0,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      backgroundColor: '#e5e7eb',
                                      color: '#9ca3af',
                                      fontSize: '1.4vh',
                                      fontWeight: '600',
                                      letterSpacing: '0.2em',
                                      zIndex: 0
                                    }}>
                                      {translations.t108}
                                    </div>
                                  )}

                                  {/* 渐变遮罩层 */}
                                  <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
                                    zIndex: 1
                                  }} />

                                  {/* 内容层 */}
                                  <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <div style={{ color: 'white', maxWidth: '60%' }}>
                                      <div style={{
                                        fontSize: '1.6vh',
                                        fontWeight: 'bold',
                                        textShadow: '0 0.2vh 0.4vh rgba(0,0,0,0.5)'
                                      }}>
                                        {box.name[lang]}
                                      </div>
                                      <div style={{ fontSize: '1.1vh', opacity: 0.8, textTransform: 'uppercase' }}>{box.name.en}</div>
                                    </div>

                                    {/* 计数器 */}
                                    <div style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.5vw',
                                      // 🚀 核心修改：使用 rgba 配合 backdropFilter
                                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                      backdropFilter: 'blur(1.2vh)',
                                      WebkitBackdropFilter: 'blur(1.2vh)',

                                      padding: '0.6vh 0.8vw',
                                      borderRadius: '1.2vh',

                                      // 增加极其细微的白色边框，让玻璃感更真实
                                      border: '0.1vh solid rgba(255, 255, 255, 0.3)',
                                      boxShadow: '0 0.4vh 1.2vh rgba(0,0,0,0.2)',
                                      position: 'relative',
                                      zIndex: 5
                                    }}>
                                      <button
                                        onClick={() => handleUpdateInventory(box.id, -1)}
                                        style={{
                                          border: 'none',
                                          background: 'none',
                                          cursor: 'pointer',
                                          fontSize: '2vh',
                                          color: 'white', // 调整为白色以适应玻璃背景
                                          fontWeight: 'bold',
                                          display: 'flex',
                                          alignItems: 'center'
                                        }}
                                      >
                                        -
                                      </button>

                                      <span style={{
                                        fontSize: '1.8vh',
                                        fontWeight: '900',
                                        minWidth: '2.5vh',
                                        textAlign: 'center',
                                        color: 'white',
                                        textShadow: '0 0.1vh 0.2vh rgba(0,0,0,0.3)'
                                      }}>
                                        {getBoxCount(box.id)}
                                      </span>

                                      <button
                                        onClick={() => handleUpdateInventory(box.id, 1)}
                                        style={{
                                          border: 'none',
                                          background: 'none',
                                          cursor: 'pointer',
                                          fontSize: '2vh',

                                          color: FACTION_COLORS[faction],
                                          fontWeight: 'bold',
                                          display: 'flex',
                                          alignItems: 'center'
                                        }}
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        );
                      })}
                  </AnimatePresence>
                </div>

              </div>
            </div>
          </DialogContent>
        </Dialog>

        <MechListHeader
          team={team} translations={translations} lang={lang} setLanguage={setLanguage}
          currentTab={logic.currentTab} setCurrentTab={logic.setCurrentTab} onSetViewMode={onSetViewMode} setCPartType={logic.setCPartType}
          isExporting={logic.isExporting} handleExportImage={logic.handleExportImage}
          includeProjectile={logic.includeProjectile} setIncludeProjectile={logic.setIncludeProjectile}
          showProjectileOption={logic.showProjectileOption} setShowProjectileOption={logic.setShowProjectileOption}
          isExportingTTS={logic.isExportingTTS} handleExportTTS={logic.handleExportTTS}
          animationCardMode={animationCardMode} setAnimationCardMode={setAnimationCardMode}
          showBoxList={logic.boxListDialogOpen} setShowBoxList={logic.setBoxListDialogOpen}
          setBoxListDialogOpen={logic.setBoxListDialogOpen}
        />

        <MechTabContent
          team={team}
          selectedMechId={selectedMechId}
          onSelectMech={onSelectMech}
          onSelectPartType={onSelectPartType}
          onSetViewMode={onSetViewMode}
          onSetIsChangingPart={onSetIsChangingPart}
          cPartType={logic.cPartType}
          setCPartType={logic.setCPartType}
          deletePart={logic.deletePart}
          addMech={logic.addMech}
          orderedPartTypes={orderedPartTypes}
          mobileOrTablet={mobileOrTablet}
          imgsrc={imgsrc} tabsrc={tabsrc} lang={lang}
          animationCardMode={animationCardMode} mechImgSrc={mechImgSrc} championMode={championMode} translations={translations}
          editingMechId={logic.editingMechId} setEditingMechId={logic.setEditingMechId}
          updateMechName={logic.updateMechName} copyMech={logic.copyMech} deleteMech={logic.deleteMech} getColorByAttr={getColorByAttr}
          exportRef={logic.exportRef}
        />

        <DroneTabContent
          team={team} mobileOrTablet={mobileOrTablet} imgsrc={imgsrc} tabsrc={tabsrc} translations={translations}
          onSetViewMode={onSetViewMode} onSetIsChangingPart={onSetIsChangingPart} onSelectDrone={onSelectDrone}
          deleteDrone={logic.deleteDrone} animationCardMode={animationCardMode} lang={lang} onUpdateTeam={onUpdateTeam}
        />

        <TacticTabContent
          team={team} mobileOrTablet={mobileOrTablet} imgsrc={imgsrc} tabsrc={tabsrc} translations={translations}
          onSetViewMode={onSetViewMode} onSetIsChangingPart={onSetIsChangingPart} deleteTacticCard={logic.deleteTacticCard}
        />

      </Tabs>
    </div>
  );
}