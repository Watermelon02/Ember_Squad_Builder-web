import React from 'react';
import { TabsList, TabsTrigger } from '../../radix-ui/tabs';
import { Button } from '../../radix-ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../radix-ui/select';
import { Table2, Loader2, Image, Settings, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLOR_WHITE, COLOR_GREY } from '../../../styles/color';
import { exportTextTeamData } from '../../../util/TextUtil';
import { Team } from '../../../data/types';

interface MechListMobileHeaderProps {
  team: Team;
  translations: any;
  lang: string;
  setLanguage: (lang: "zh" | "en" | "jp") => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onSetViewMode: (mode: any) => void;
  setCPartType: (type: string) => void;
  isExporting: boolean;
  handleExportImage: () => void;
  showProjectileOption: boolean;
  setShowProjectileOption: (val: any) => void;
  includeProjectile: boolean;
  setIncludeProjectile: (val: boolean) => void;
  hideTacticCard: boolean;
  setHideTacticCard: (val: boolean) => void;
}

export const MechListMobileHeader: React.FC<MechListMobileHeaderProps> = ({
  team, translations, lang, setLanguage, currentTab, setCurrentTab, onSetViewMode, setCPartType,
  isExporting, handleExportImage, showProjectileOption, setShowProjectileOption, includeProjectile, setIncludeProjectile, hideTacticCard, setHideTacticCard
}) => {
  return (
    <div className="p-2 border-b border-border flex flex-col gap-2">
      {/* 第 1 行：Tabs */}
      <TabsList className="relative flex" style={{ backgroundColor: COLOR_WHITE, borderRadius: "4px", boxShadow: "0 2px 8px rgba(0,0,0,0.25)", backdropFilter: "blur(6px)", height: "4vh", width: "100%", padding: "0" }}>
        {[
          { key: "mechs", label: `${translations.t22} (${team.mechs.length})`, onClick: () => { setCPartType(""); onSetViewMode("parts"); } },
          { key: "drones", label: `${translations.t23} (${team.drones.length})`, onClick: () => onSetViewMode("drones") },
          { key: "tacticCards", label: `${translations.t87} (${team.tacticCards?.length})`, onClick: () => onSetViewMode("tacticCards") },
        ].map((tab, index, arr) => (
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

      {/* 第 2 行：语言切换 + 按钮 */}
      <div className="flex gap-1">

        {/* 语言选择器：固定宽度 */}
        <div className="w-16 shrink-0">
          <Select value={lang} onValueChange={(v) => setLanguage(v as "zh" | "en" | "jp")}>
            <SelectTrigger className="h-8 text-sm w-full">
              <Globe className="w-4 h-4 text-gray-600 shrink-0" />
              <SelectValue placeholder="CN" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="zh">CN</SelectItem>
              <SelectItem value="en">EN</SelectItem>
              <SelectItem value="jp">JP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 三个按钮平分剩余空间 */}
        <div className="flex-1 min-w-0">
          <Button className="w-full h-8 px-1" variant="outline" size="sm"
            onClick={() => team && exportTextTeamData(team, translations, lang,hideTacticCard)}>
            <Table2 className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[10px] whitespace-nowrap ml-0.5">{translations.t6}</span>
          </Button>
        </div>

        <div className="flex-1 min-w-0 relative">
          <Button className="w-full h-8 px-1" variant="outline" size="sm"
            disabled={isExporting} onClick={handleExportImage}>
            <div className="flex items-center gap-1 justify-center w-full">
              <AnimatePresence>
                {isExporting && (
                  <motion.div key="loader" initial={{ opacity: 0 }}
                    animate={{ opacity: 1, rotate: [0, 360] }} exit={{ opacity: 0 }}
                    transition={{ rotate: { repeat: Infinity, duration: 1, ease: "linear" }, opacity: { duration: 0.2 } }}>
                    <Loader2 className="w-3.5 h-3.5 shrink-0" />
                  </motion.div>
                )}
              </AnimatePresence>
              {isExporting
                ? <span className="text-[10px] whitespace-nowrap">{translations.t79}</span>
                : <>
                  <Image className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[10px] whitespace-nowrap">{translations.t24}</span>
                </>
              }
            </div>
          </Button>
        </div>

        <div className="flex-1 min-w-0 relative">
          <Button className="w-full h-8 px-1" variant="outline" size="sm"
            onClick={() => setShowProjectileOption((v: boolean) => !v)} disabled={isExporting}>
            <Settings className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[10px] whitespace-nowrap ml-0.5">{translations.t99}</span>
          </Button>
          <AnimatePresence>
            {showProjectileOption && (
              <motion.div
                key="checkbox-popup"
                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,          // ← 右对齐，向左展开
                  // 删除 transform、left
                  backgroundColor: "white",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  padding: "8px 12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  fontSize: 12,
                  zIndex: 10,
                  whiteSpace: "nowrap",
                }}
              >
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="include-projectile-mobile" checked={includeProjectile}
                    onChange={(e) => setIncludeProjectile(e.target.checked)}
                    className="h-4 w-4 shrink-0" style={{ accentColor: "#3b82f6" }} />
                  <label htmlFor="include-projectile-mobile"
                    className="cursor-pointer select-none" style={{ color: "#374151" }}>
                    {translations.t91}
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="hide-tactic-card-mobile" checked={hideTacticCard}
                    onChange={(e) => setHideTacticCard(e.target.checked)}
                    className="h-4 w-4 shrink-0" style={{ accentColor: "#3b82f6" }} />
                  <label htmlFor="hide-tactic-card-mobile"
                    className="cursor-pointer select-none" style={{ color: "#374151" }}>
                    {translations.t122}
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* 第 3 行：统计信息 */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1.5vw" }}>
        {[
          { label: translations.t7, value: team.totalScore, highlight: team.totalScore > 900 },
          { label: translations.t8, value: team.mechCount },
          { label: translations.t9, value: team.largeDroneCount },
          { label: translations.t10, value: team.mediumDroneCount },
          { label: translations.t11, value: team.smallDroneCount },
        ].map((stat, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              height: "5vh",
              padding: "0 0.25vw",
              backgroundColor: "#f9fafb",
              borderRadius: "0.5rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "inset 0 0 8px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ fontSize: "1.2vh", color: "#6b7280" }}>
              {stat.label}
            </div>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={stat.value}
                initial={{ scale: 1, y: 0, opacity: 0 }}
                animate={{ y: [-5, 0], opacity: 1 }}
                exit={{ y: 5, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  fontSize: "3vw",
                  fontWeight: 500,
                  color: stat.highlight ? "#dc2626" : "#111",
                }}
              >
                {stat.value}
              </motion.div>
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};