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
}

export const MechListMobileHeader: React.FC<MechListMobileHeaderProps> = ({
  team, translations, lang, setLanguage, currentTab, setCurrentTab, onSetViewMode, setCPartType,
  isExporting, handleExportImage, showProjectileOption, setShowProjectileOption, includeProjectile, setIncludeProjectile
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
      <div className="flex gap-2">
        <div className="flex-1">
          <Select value={lang} onValueChange={(v) => setLanguage(v as "zh" | "en" | "jp")}>
            <SelectTrigger className="h-8 text-sm w-full"><Globe className="w-4 h-4 text-gray-600" /><SelectValue placeholder="选择语言" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="zh">CN</SelectItem>
              <SelectItem value="en">EN</SelectItem>
              <SelectItem value="jp">JP</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Button className="w-full" variant="outline" size="sm" onClick={() => team && exportTextTeamData(team, translations, lang)}>
            <Table2 className="w-4 h-4 mr-1" />{translations.t6}
          </Button>
        </div>
        <div className="flex-1 relative">
          <Button className="w-full" variant="outline" size="sm" disabled={isExporting} onClick={handleExportImage}>
            <div className="flex items-center gap-2 justify-center">
              <AnimatePresence>
                {isExporting && (
                  <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1, rotate: [0, 360] }} exit={{ opacity: 0 }} transition={{ rotate: { repeat: Infinity, duration: 1, ease: "linear" }, opacity: { duration: 0.2 } }}>
                    <Loader2 className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
              {isExporting ? <span>{translations.t79}</span> : <div className="flex items-center gap-1"><Image className="w-4 h-4" /><span>{translations.t24}</span></div>}
            </div>
          </Button>
        </div>
        <div className="relative flex-1">
          <Button className="w-full" variant="outline" size="sm" onClick={() => setShowProjectileOption((v: boolean) => !v)} disabled={isExporting}>
            <div className="flex items-center gap-1"><Settings className="w-4 h-4" /><span>{translations.t99}</span></div>
          </Button>
          <AnimatePresence>
            {showProjectileOption && (
              <motion.div key="checkbox-popup" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }} className="absolute top-full left-1/2 -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-lg px-3 py-1.5 flex items-center gap-2 text-sm z-10 max-w-[200px] sm:max-w-[250px] break-words" style={{ backgroundColor: 'white' }}>
                <input type="checkbox" id="include-projectile" checked={includeProjectile} onChange={(e) => setIncludeProjectile(e.target.checked)} className="h-4 w-4" />
                <label htmlFor="include-projectile" className="cursor-pointer select-none whitespace-normal" style={{ color: 'black', WebkitTextStroke: '0.5px white' }}>{translations.t91}</label>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 第 3 行：统计信息 */}
      <div className="grid grid-cols-5 gap-2">
        {[
          { label: translations.t7, value: team.totalScore, highlight: team.totalScore > 900 },
          { label: translations.t8, value: team.mechCount },
          { label: translations.t9, value: team.largeDroneCount },
          { label: translations.t10, value: team.mediumDroneCount },
          { label: translations.t11, value: team.smallDroneCount },
        ].map((stat, idx) => (
          <div key={idx} className="text-center">
            <div className="text-muted-foreground" style={{ fontSize: 12 }}>{stat.label}</div>
            <AnimatePresence mode="popLayout">
              <motion.div key={stat.value} initial={{ scale: 0.9, y: 5, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: -5, opacity: 0 }} transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }} style={{ color: stat.highlight ? '#dc2626' : '#111', fontSize: 12 }}>
                {stat.value}
              </motion.div>
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};