import React, { useState } from 'react';
import { TabsList, TabsTrigger } from '../../radix-ui/tabs'; // Adjust path
import { Loader2, Image, Gamepad2Icon, Zap, Table2, Globe, Store, Trophy } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../radix-ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedButton } from '../../custom/AnimatedButton'; // Adjust path
import { COLOR_GLOBAL, COLOR_GREY, COLOR_WHITE } from '../../../styles/color';
import { exportTextTeamData } from '../../../util/TextUtil';
import { Team } from '../../../data/types';

interface MechListHeaderProps {
    team: Team;
    translations: any;
    lang: string;
    setLanguage: (lang: "zh" | "en" | "jp") => void;
    currentTab: string;
    setCurrentTab: (tab: string) => void;
    onSetViewMode: (mode: any) => void;
    setCPartType: (type: string) => void;
    // Export States
    isExporting: boolean;
    handleExportImage: () => void;
    includeProjectile: boolean;
    setIncludeProjectile: (val: boolean) => void;
    showProjectileOption: boolean;
    setShowProjectileOption: (val: boolean) => void;
    // TTS States
    isExportingTTS: boolean;
    handleExportTTS: () => void;
    //设置已购盒弹窗
    showBoxList: boolean;
    setShowBoxList: (val: boolean) => void;
    // Animation States
    animationCardMode: boolean;
    setAnimationCardMode: (val: boolean) => void;
    competitionRegistrationMode: boolean;
    setCompetitionRegistrationMode: (val: boolean) => void;
    setBoxListDialogOpen: (val: boolean) => void;
    tournamentMode: boolean;
    hideTacticCard: boolean;
    setHideTacticCard: (val: boolean) => void;
    tabsrc: string;
    mechImgSrc: string;
    showCompetitionDialog: boolean;
}

export const MechListHeader: React.FC<MechListHeaderProps> = ({
    team, translations, lang, setLanguage,
    currentTab, setCurrentTab, onSetViewMode, setCPartType,
    isExporting, handleExportImage, includeProjectile, setIncludeProjectile, showProjectileOption, setShowProjectileOption,
    isExportingTTS, handleExportTTS,
    animationCardMode, setAnimationCardMode, setBoxListDialogOpen, tournamentMode, hideTacticCard, setHideTacticCard, tabsrc, mechImgSrc,
    competitionRegistrationMode, setCompetitionRegistrationMode,showCompetitionDialog
}) => {
    const [showTTSHint, setShowTTSHint] = useState(false);
    const [showAnimationHint, setShowAnimationHint] = useState(false);
    const [showCompetitionHint, setShowCompetitionHint] = useState(false);
    const [showBoxHint, setShowBoxHint] = useState(false);
    const [showTextOption, setShowTextOption] = useState(false);


    return (
        <div className="p-4 border-b border-border flex items-center justify-between relative">
            {/* 左侧按钮组 */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5vw", flexShrink: 0 }}>
                {/* 导出文本 */}
                <div
                    style={{ position: "relative" }}
                    onMouseEnter={() => setShowTextOption(true)}
                    onMouseLeave={() => setShowTextOption(false)}
                >
                    <AnimatedButton
                        onClick={() => {
                            exportTextTeamData(team, translations, lang, hideTacticCard)
                        }
                        }
                        fontSize={"0.8vw"}
                    >
                        <Table2 style={{ width: "1vw", height: "1vw" }} />
                        {translations.t6}
                    </AnimatedButton>

                    <AnimatePresence>
                        {showTextOption && (
                            <motion.div
                                key="text-export-popup"
                                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    position: "absolute",
                                    top: "100%",
                                    left: 0,
                                    marginTop: 4,
                                    background: "white",
                                    borderRadius: 8,
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                                    padding: "8px 12px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 6,
                                    fontSize: "0.8vw",
                                    zIndex: 90,
                                    minWidth: "max-content",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <input
                                        type="checkbox"
                                        id="hide-tactic-card-text"
                                        checked={hideTacticCard}
                                        onChange={(e) => setHideTacticCard(e.target.checked)}
                                        style={{ width: 14, height: 14, accentColor: "#3b82f6", cursor: "pointer", flexShrink: 0 }}
                                    />
                                    <label htmlFor="hide-tactic-card-text" style={{ cursor: "pointer", userSelect: "none", color: "#374151", whiteSpace: "nowrap" }}>
                                        {translations.t122}
                                    </label>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 导出图片 */}
                <div style={{ position: "relative" }} onMouseEnter={() => setShowProjectileOption(true)} onMouseLeave={() => setShowProjectileOption(false)}>
                    <AnimatedButton fontSize={"0.8vw"} onClick={handleExportImage}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <AnimatePresence>
                                {isExporting && (
                                    <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1, rotate: [0, 360] }} exit={{ opacity: 0 }} transition={{ rotate: { repeat: Infinity, duration: 1, ease: "linear" }, opacity: { duration: 0.2 } }}>
                                        <Loader2 style={{ width: "1vw", height: "1vw" }} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {isExporting ? <span>{translations.t79}</span> : <div style={{ display: "flex", alignItems: "center", gap: 2 }}><Image style={{ width: "1vw", height: "1vw" }} /><span>{translations.t24}</span></div>}
                        </div>
                    </AnimatedButton>
                    <AnimatePresence>
                        {showProjectileOption && (
                            <motion.div
                                key="checkbox-popup"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 8 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    position: "absolute",
                                    top: "100%",
                                    right: "-50%",
                                    background: "white",
                                    borderRadius: 8,
                                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                    padding: "8px 12px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8,
                                    fontSize: "1vw",
                                    zIndex: 90,
                                    marginTop: 4
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <input type="checkbox" id="include-projectile" checked={includeProjectile} onChange={(e) => setIncludeProjectile(e.target.checked)} style={{ width: 14, height: 14, accentColor: "#3b82f6", cursor: "pointer", flexShrink: 0 }} />
                                    <label htmlFor="include-projectile" style={{ cursor: "pointer", userSelect: "none", color: "#374151", whiteSpace: "nowrap" }}>{translations.t91}</label>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <input type="checkbox" id="hide-tactic-card" checked={hideTacticCard} onChange={(e) => setHideTacticCard(e.target.checked)} style={{ width: 14, height: 14, accentColor: "#3b82f6", cursor: "pointer", flexShrink: 0 }} />
                                    <label htmlFor="hide-tactic-card" style={{ cursor: "pointer", userSelect: "none", color: "#374151", whiteSpace: "nowrap" }}>{translations.t122}</label>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 导出 TTS */}
                <div style={{ position: "relative" }} onMouseEnter={() => setShowTTSHint(true)} onMouseLeave={() => setShowTTSHint(false)}>
                    <AnimatedButton fontSize={"0.7vw"} onClick={handleExportTTS}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <AnimatePresence>
                                {isExportingTTS && (
                                    <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1, rotate: [0, 360] }} exit={{ opacity: 0 }} transition={{ rotate: { repeat: Infinity, duration: 1, ease: "linear" }, opacity: { duration: 0.2 } }}>
                                        <Loader2 style={{ width: 16, height: 16 }} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {isExportingTTS ? <span>{translations.t79}</span> : <div style={{ display: "flex", alignItems: "center", gap: 2 }}><Gamepad2Icon style={{ width: 16, height: 16 }} /><span>{translations.t95}</span></div>}
                        </div>
                    </AnimatedButton>
                    <AnimatePresence>
                        {showTTSHint && (
                            <motion.div key="checkbox-popup-tts" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }} style={{ position: "absolute", top: "100%", left: "-50%", background: "white", borderRadius: 8, boxShadow: "0 4px 6px rgba(0,0,0,0.1)", padding: "6px 12px", fontSize: "1vw", marginTop: -6, zIndex: 90 }}>
                                <label style={{ cursor: "pointer", userSelect: "none", color: "#374151", whiteSpace: "nowrap" }}>{translations.t96}</label>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 动画模式开关 */}
                {/* {!tournamentMode &&
                    <div style={{ position: "relative" }} onMouseEnter={() => setShowAnimationHint(true)} onMouseLeave={() => setShowAnimationHint(false)}>
                        <AnimatedButton onClick={() => { setAnimationCardMode(!animationCardMode); }} fontSize={"0.8vw"} style={animationCardMode ? { backgroundColor: COLOR_GREY, color: 'white' } : {}}>
                            <div style={{ display: "flex", alignItems: "center", gap: 2 }}><Zap style={{ width: "1vw", height: "1vw" }} /><span>{translations.t106}</span></div>
                        </AnimatedButton>
                        <AnimatePresence>
                            {showAnimationHint && (
                                <motion.div key="animation-mode-hint" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }} style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", background: "white", borderRadius: 8, boxShadow: "0 4px 6px rgba(0,0,0,0.1)", padding: "6px 12px", fontSize: "0.8vw", marginTop: -6, zIndex: 90, whiteSpace: "nowrap" }}>
                                    <label style={{ userSelect: "none", color: "#374151" }}>启用/禁用卡片入场动画</label>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>} */}

                {/* 设置已购盒 按钮 */}
                {!tournamentMode && <div style={{ position: "relative" }} onMouseEnter={() => setShowBoxHint(true)} onMouseLeave={() => setShowBoxHint(false)}>
                    <AnimatedButton fontSize={"0.7vw"} onClick={() => setBoxListDialogOpen(true)}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <Store style={{ width: 16, height: 16 }} /><span>{translations.t111}</span>
                        </div>
                    </AnimatedButton>
                </div>}

                {/* 比赛报名模式开关 */}
                {!tournamentMode &&showCompetitionDialog&& lang === "zh" &&
                    <div style={{ position: "relative" }} onMouseEnter={() => setShowCompetitionHint(true)} onMouseLeave={() => setShowCompetitionHint(false)}>
                        <AnimatedButton onClick={() => { setCompetitionRegistrationMode(!competitionRegistrationMode); }} fontSize={"0.8vw"} style={competitionRegistrationMode ? { backgroundColor: COLOR_GREY, color: 'white' } : {}}>
                            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Trophy style={{ width: "1vw", height: "1vw" }} /><span>报名模式</span></div>
                        </AnimatedButton>
                        <AnimatePresence>
                            {showCompetitionHint && (
                                <motion.div key="competition-mode-hint" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }} style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", background: "white", borderRadius: 8, boxShadow: "0 4px 6px rgba(0,0,0,0.1)", padding: "6px 12px", fontSize: "0.8vw", marginTop: -6, zIndex: 90, whiteSpace: "nowrap" }}>
                                    <label style={{ userSelect: "none", color: "#374151" }}>比赛报名模式，开启后只显示比赛允许的部件</label>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>}

            </div>

            {/* 中间 Tabs */}
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <TabsList className="relative flex" style={{ backgroundColor: COLOR_WHITE, borderRadius: "4px", boxShadow: "0 2px 4px rgba(0,0,0,0.25)", backdropFilter: "blur(6px)", height: "4vh", padding: 0, gap: "2px" }}>
                    {[{ key: "mechs", label: `${translations.t22} (${team.mechs.length})`, onClick: () => { setCPartType(""); onSetViewMode("parts"); } }, { key: "drones", label: `${translations.t23} (${team.drones.length})`, onClick: () => onSetViewMode("drones") }, { key: "tacticCards", label: `${translations.t87} (${team.tacticCards?.length})`, onClick: () => onSetViewMode("tacticCards") }].map((tab, index, arr) => (
                        <React.Fragment key={tab.key}>
                            <TabsTrigger value={tab.key} onClick={() => { setCurrentTab(tab.key); tab.onClick(); }} style={{ position: "relative", color: currentTab === tab.key ? COLOR_WHITE : COLOR_GREY, fontWeight: 500, padding: "8px 18px", borderRadius: "4px", transition: "color 0.25s ease", zIndex: 1 }}>
                                {tab.label}
                                {currentTab === tab.key && (
                                    <motion.div layoutId="tabBG" transition={{ duration: 0.25, ease: "easeInOut" }} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: COLOR_GREY, borderRadius: "4px", zIndex: -1 }} />
                                )}
                            </TabsTrigger>
                            {index < arr.length - 1 && (
                                <div style={{ width: "1.5px", height: "60%", backgroundColor: currentTab === tab.key || currentTab === arr[index + 1].key ? "transparent" : "rgba(0,0,0,0.25)", alignSelf: "center", transition: "background-color 0.25s ease" }} />
                            )}
                        </React.Fragment>
                    ))}
                </TabsList>
            </div>

            {/* 右侧语言切换 */}
            <div className="flex items-center flex-shrink-0" style={{ width: "10vw", gap: "0.5vw", color: COLOR_GREY }}>
                <Globe style={{ width: "2vw", color: COLOR_GLOBAL }} />
                <Select value={lang} onValueChange={(v) => setLanguage(v as "zh" | "en" | "jp")}>
                    <SelectTrigger style={{ width: "8vw" }}><SelectValue placeholder="选择语言" /></SelectTrigger>
                    <SelectContent style={{ color: COLOR_GREY }}>
                        <SelectItem value="zh">中文</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="jp">日本語</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};