import React, { useState, useMemo } from 'react';
import { Card } from '../../radix-ui/card';
import { Input } from '../../radix-ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../radix-ui/select';
import { Badge } from '../../radix-ui/badge';
import { Part, Drone, Pilot, Team, TacticCard } from '../../../data/types';
import { AnimatePresence, motion } from 'framer-motion';
import { getAllDroneRemainingCounts, getAllPartRemainingCounts, getDroneRemainingCount } from '../../../util/BoxContentUtil';
import { DRONE_SHARED_POOLS, getPoolId } from '../../../data/dronePools';


interface PartSelectorProps {
  viewMode: 'parts' | 'drones' | 'pilots' | 'tacticCards';
  team?: Team;
  selectedPartType: string;
  parts: Part[];
  drones: Drone[];
  tacticCards: TacticCard[];
  pilots: Pilot[];
  onSelectPart: (part: Part) => void;
  onSelectDrone: (drone: Drone) => void;
  onSelectPilot: (pilot: Pilot) => void;
  onSelectTacticCard: (tacticCard: TacticCard) => void;
  translations: any,
  partTypeNames: any,
  imgsrc: string, tabsrc: string,
  showKeyword: boolean,
  showSourceBox: boolean,
  onSetHoverImg: (img: string | null) => void;
  onSetShowHoverImg: (show: boolean) => void;
  onSetShowKeyword: (show: boolean) => void;
  onSetShowSourceBox: (show: boolean) => void;
  showHoverImg: boolean;
  mobileOrTablet: boolean;
  lastScore: number;
  lastPartId: string;
  lang: string;
  inventory: Record<number, number>;
  inventoryMode: boolean;
}

export function PartSelector({
  viewMode,
  team,
  selectedPartType,
  parts,
  drones,
  tacticCards,
  pilots,
  onSelectPart,
  onSelectDrone,
  onSelectPilot,
  onSelectTacticCard,
  onSetShowKeyword,
  translations,
  imgsrc, tabsrc, onSetHoverImg, onSetShowHoverImg, onSetShowSourceBox, showHoverImg, mobileOrTablet, lastScore, lastPartId, showSourceBox,
  lang, showKeyword, inventory, inventoryMode
}: PartSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [containPD, setContainPD] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<'score_desc' | 'score_asc'>('score_desc');

  // 过滤部件
  const filteredParts = useMemo(() => {
    let filtered = parts.filter(part => {
      // 类型过滤
      if (part.type !== selectedPartType) return false;

      if (part.id === lastPartId) return false;

      // 搜索过滤
      if (searchQuery && !part.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      if (part.isPD && !containPD) {
        return false;
      }

      if (((part.isPD === undefined || !part.isPD)) && containPD) {
        return false;
      }

      // 标签过滤
      if (selectedTags.length > 0) {
        const hasSelectedTag = selectedTags.some(tag => part.tags?.includes(tag));
        if (!hasSelectedTag) return false;
      }

      // ⬇️ 过滤掉带 "弃置" 的
      if (part.score == 0) return false;

      return true;
    });

    // 排序
    return filtered.sort((a, b) => {
      return sortOrder === 'score_desc' ? b.score - a.score : a.score - b.score;
    });
  }, [parts, selectedPartType, searchQuery, selectedTags, sortOrder, containPD]);

  // 过滤无人机
  const filteredDrones = useMemo(() => {
    let filtered = drones.filter(drone => {
      if (searchQuery && !drone.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // 如果是星环无人机 且 当前不包含星环 => 过滤掉
      if (drone.isPD && !containPD) {
        return false;
      }

      if ((drone.isPD === undefined || !drone.isPD) && containPD) {
        return false;
      }

      // ⬇️ 过滤低价值无人机
      if (drone.score == 0) return false;
      return true;


    });

    return filtered.sort((a, b) => {
      return sortOrder === 'score_desc' ? b.score - a.score : a.score - b.score;
    });
  }, [drones, searchQuery, sortOrder, containPD]);

  const filteredTacticCards = useMemo(() => {
    if (!tacticCards) return [];

    // 获取队伍中已使用的战术卡 id
    const usedTacticIds = new Set<string>();
    team?.tacticCards?.forEach((tactic) => {
      if (tactic?.id) {
        usedTacticIds.add(tactic.id);
      }
    });

    return tacticCards.filter((tacticCard) => {
      // 搜索过滤
      if (searchQuery && !tacticCard.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // ⬇️ 过滤掉队伍中已经存在的战术卡
      if (usedTacticIds.has(tacticCard.id)) {
        return false;
      }

      return true;
    });
  }, [tacticCards, team, searchQuery]);


  // 过滤驾驶员
  const filteredPilots = useMemo(() => {
    // 获取队伍中已用驾驶员的 id
    const usedPilotIds = new Set<string>();
    team?.mechs.forEach(mech => {
      if (mech.pilot) {
        usedPilotIds.add(mech.pilot.id);
      }
    });

    let filtered = pilots.filter(pilot => {
      // 搜索过滤
      if (searchQuery && !pilot.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // 星环动力 (PD) 筛选
      if (pilot.faction === "PD" && !containPD) return false;
      if (pilot.faction !== "PD" && containPD) return false;

      // ⬇️ 过滤掉已使用的驾驶员
      if (usedPilotIds.has(pilot.id)) return false;

      return true;
    });

    return filtered.sort((a, b) => {
      return sortOrder === 'score_desc' ? b.score - a.score : a.score - b.score;
    });
  }, [pilots, team, searchQuery, containPD, sortOrder]);

  const remainingCounts = useMemo(() => {
    if (!team) return {};
    return getAllPartRemainingCounts(team, parts, inventory);
  }, [team, parts, inventory]);

  const droneRemainingCounts = useMemo(() => {
    if (!team) return {};
    return getAllDroneRemainingCounts(team, drones, inventory);
  }, [team, parts, inventory]);


  return <div className="flex flex-col h-full min-h-0 " style={{ width: "20vw" }}>
    <AnimatePresence mode="wait">

      {viewMode === 'parts' && (

        <div className="min-h-0 flex flex-col" >
          <div className="p-4 border-b border-border space-y-4" >


            {/* 搜索框 */}
            <Input
              placeholder={translations.t35}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />


            <div className="flex items-center justify-between space-x-4">
              {/* 排序选择 */}
              <div className="flex items-center space-x-2">

                <Select
                  value={sortOrder}
                  onValueChange={(value: 'score_desc' | 'score_asc') => setSortOrder(value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score_desc">{translations.t58}</SelectItem>
                    <SelectItem value="score_asc">{translations.t59}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* 是否显示卡片预览 */}
              <div className="flex gap-1">
                <div className="flex flex-col items-center space-x-2">
                  <input
                    type="checkbox"
                    id="show-hover-img"
                    checked={showHoverImg}
                    onChange={(e) => onSetShowHoverImg(e.target.checked)}

                    style={{ accentColor: "#ffffff" }} // 灰色勾选
                  />
                  <label htmlFor="show-hover-img" style={{ fontSize: lang === "en" ? "0.6vw" : "1vw" }}>
                    {translations.t92}
                  </label>
                </div>

                <div className="flex flex-col items-center space-x-2">
                  <input
                    type="checkbox"
                    id="show-keyword"
                    checked={showKeyword}
                    onChange={(e) => onSetShowKeyword(e.target.checked)}

                    style={{ accentColor: "#ffffff" }} // 灰色勾选
                  />
                  <label htmlFor="show-keyword" style={{ fontSize: lang === "en" ? "0.6vw" : "1vw" }}>
                    {translations.t104}
                  </label>
                </div>

                {/* 星环选择 */}
                <div className="flex flex-col items-center space-x-2">
                  <input
                    type="checkbox"
                    id="contain-pd"
                    checked={containPD}
                    onChange={(e) => setContainPD(e.target.checked)}

                    style={{
                      accentColor: "#ffffff",   // 勾选颜色为灰色
                    }}
                  />
                  <label htmlFor="contain-pd" style={{ fontSize: lang === "en" ? "0.6vw" : "1vw" }}>
                    {translations.t67}
                  </label>
                </div>

                <div className="flex flex-col items-center space-x-2">
                  <input
                    type="checkbox"
                    id="show-belong-box"
                    checked={showSourceBox}
                    onChange={(e) => onSetShowSourceBox(e.target.checked)}

                    style={{ accentColor: "#ffffff" }} // 灰色勾选
                  />
                  <label htmlFor="show-keyword" style={{ fontSize: lang === "en" ? "0.6vw" : "1vw" }}>
                    {translations.t118}
                  </label>
                </div>
              </div>

            </div>
          </div>
          <motion.div
            key={`${selectedPartType}`}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3 }}
            className="min-h-0 flex flex-col"
          >
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid gap-4">
                {Array.from({ length: Math.ceil(filteredParts.length / 3) }, (_, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-1 gap-3">
                    {filteredParts.slice(rowIndex * 3, (rowIndex + 1) * 3).map(part => {
                      // 1. 获取当前部件的剩余数量 (确保 remainingCounts 已通过 useMemo 计算)
                      const count = remainingCounts[part.id] ?? 0;
                      const isOutOfStock = count <= 0;

                      return (
                        <Card
                          key={part.id}
                          className="relative p-3 cursor-pointer transition overflow-hidden shadow-sm"
                          // 动态点击逻辑：库存不足时可以禁止点击或弹出提醒
                          onClick={() => {
                            if (inventoryMode && isOutOfStock) return;
                            onSelectPart(part);
                          }}
                          onMouseEnter={(e) => {
                            onSetHoverImg(`${part.id}`);
                            (e.currentTarget as HTMLDivElement).style.transform = "scale(1.05)";
                            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 10px rgba(0,0,0,0.1)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)";
                          }}
                          style={{
                            // 2. 如果没货了，整体变灰并降低透明度
                            filter: inventoryMode && isOutOfStock ? 'grayscale(100%)' : 'none',
                            opacity: inventoryMode && isOutOfStock ? 0.6 : 1,
                            cursor: inventoryMode && isOutOfStock ? 'not-allowed' : 'pointer',
                            backgroundColor: inventoryMode && isOutOfStock ? '#f3f4f6' : 'inherit',
                          }}
                        >
                          {/* 背景图层 - 没货时进一步淡化 */}
                          {(part.hasImage === undefined || part.hasImage) ? (
                            <div
                              className="absolute inset-0 bg-contain"
                              style={{
                                backgroundImage: `url(${tabsrc}/${part.id}.png)`,
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right top',
                                opacity: inventoryMode && isOutOfStock ? 0.2 : 0.8, // 没货时图片极其淡化
                              }}
                            />
                          ) : (
                            <span style={{ display: "flex", position: "absolute", right: 0, padding: "1vh", bottom: 0, opacity: 0.8 }}>
                              {translations.t108}
                            </span>
                          )}

                          {/* 前景内容 */}
                          <div className="relative z-10 space-y-2">
                            <div className="flex items-center gap-2">
                              {/* 分数 Badge */}
                              <Badge variant="outline" className="shrink-0 relative">
                                {part.score}
                                {part.score !== lastScore && (
                                  <span style={{ position: 'absolute', top: 0, left: 2, fontSize: 8, opacity: 0.5 }}>
                                    {part.score > lastScore ? '▲' : '▼'}
                                  </span>
                                )}
                              </Badge>

                              {/* 3. 部件剩余量显示 */}
                              {inventoryMode &&
                                <Badge
                                  variant={isOutOfStock ? "destructive" : "outline"}
                                  className="shrink-0 font-mono"
                                  style={{
                                    backgroundColor: isOutOfStock ? '#ef4444' : 'transparent',
                                    color: isOutOfStock ? 'white' : 'inherit',
                                    borderColor: isOutOfStock ? '#ef4444' : 'inherit'
                                  }}
                                >
                                  {isOutOfStock ? translations.t94 : `x${count}`}
                                </Badge>}

                              {/* 4. 名称：没货时加删除线 */}
                              <h4 className={`font-medium truncate ${inventoryMode && isOutOfStock ? 'line-through text-muted-foreground' : ''}`}>
                                {part.name}
                              </h4>
                            </div>

                            {/* 部件数据区 (即便没货也显示数值，但受 Card 整体 grayscale 影响) */}
                            <div className="flex items-center gap-2">
                              {(part.armor !== 0 || part.structure !== 0) && (
                                <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm bg-background/50">
                                  <div className="flex items-center gap-1">
                                    <img loading="lazy" src={`${tabsrc}/icon_armor.png`} alt="armor" className="w-4 h-4" />
                                    <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                                      {part.structure === 0 ? translations.t39 : `${translations.t39}/${translations.t40}`}
                                    </div>
                                  </div>
                                  <div style={{ fontSize: '16px', color: part.armor < 0 || part.structure < 0 ? 'red' : 'inherit' }}>
                                    {part.structure === 0 ? part.armor : `${part.armor} / ${part.structure}`}
                                  </div>
                                </div>
                              )}

                              {[
                                { label: translations.t41, value: part.parray, icon: 'icon_parray' },
                                {
                                  label: translations.t42,
                                  value: part.dodge,
                                  icon: 'icon_dodge',
                                  color: inventoryMode && isOutOfStock ? 'inherit' : `rgba(0,120,255,${0.20 + Math.min(Math.max(part.dodge, 1), 6) * 0.08})`
                                },
                                {
                                  label: translations.t43,
                                  value: part.electronic,
                                  icon: 'icon_electronic',
                                  color: inventoryMode && isOutOfStock ? 'inherit' : `rgba(255,180,0,${0.20 + Math.min(Math.max(part.electronic, 1), 6) * 0.08})`
                                },
                              ]
                                .filter(attr => attr.value !== 0)
                                .map(attr => (
                                  <div key={attr.label} className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm bg-background/50">
                                    <div className="flex items-center gap-1">
                                      <img loading="lazy" src={`${tabsrc}/${attr.icon}.png`} alt={attr.label} className="w-4 h-4" />
                                      <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{attr.label}</div>
                                    </div>
                                    <div style={{ fontSize: '16px', color: attr.value < 0 ? 'red' : attr.color || 'inherit' }}>
                                      {attr.value}
                                    </div>
                                  </div>
                                ))}
                            </div>

                            {/* 标签区 */}
                            {part.tags && part.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {part.tags.map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-[10px] px-1 py-0">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                ))}
              </div>

              {filteredParts.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  {translations.t44}
                </div>
              )}
            </div>
          </motion.div>
        </div>

      )
      }



      {viewMode === 'pilots' && (

        <div className="min-h-0 flex flex-col">
          <div className="flex-shrink-0 p-4 border-b border-border space-y-4">


            {/* 搜索框 */}
            <Input
              placeholder={translations.t46}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="flex items-center justify-between space-x-4">
              {/* 排序选择 */}
              <div className="flex items-center space-x-2">

                <Select
                  value={sortOrder}
                  onValueChange={(value: 'score_desc' | 'score_asc') => setSortOrder(value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score_desc">{translations.t58}</SelectItem>
                    <SelectItem value="score_asc">{translations.t59}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="flex gap-1">
                  {/* 是否显示卡片预览 */}
                  <div className="flex flex-col items-center space-x-2">
                    <input
                      type="checkbox"
                      id="show-hover-img"
                      checked={showHoverImg}
                      onChange={(e) => onSetShowHoverImg(e.target.checked)}

                      style={{ accentColor: "#ffffff", fontSize: lang }} // 灰色勾选
                    />
                    <label htmlFor="show-hover-img" style={{ fontSize: lang === "en" ? "0.6vw" : "1vw" }}>
                      {translations.t92}
                    </label>
                  </div>


                  {/* 星环选择 */}
                  <div className="flex flex-col items-center space-x-2">
                    <input
                      type="checkbox"
                      id="contain-pd"
                      checked={containPD}
                      onChange={(e) => setContainPD(e.target.checked)}

                      style={{
                        accentColor: "#ffffff",   // 勾选颜色为灰色
                        backgroundColor: "#ffffff" // 背景白色
                      }}
                    />
                    <label htmlFor="contain-pd" style={{ fontSize: lang === "en" ? "0.6vw" : "1vw" }}>
                      {translations.t67}
                    </label>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <motion.div
            key="parts"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3 }}
            className="min-h-0 flex flex-col"
          >
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredPilots.map(pilot => (
                <Card
                  key={pilot.id}
                  className="p-4 cursor-pointer hover:bg-accent/50 transition relative overflow-hidden shadow-sm"
                  onClick={() => onSelectPilot(pilot)}
                  onMouseEnter={(e) => {
                    onSetHoverImg(`${pilot.id}`);
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
                  {/* 背景图层 */}
                  <div
                    className="absolute inset-0 bg-cover bg-left-top"
                    style={{
                      backgroundImage: `url(${tabsrc}/${pilot.id}.png)`,
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right top',
                      opacity: 0.4,
                    }}
                  ></div>

                  {/* 文字内容层 */}
                  <div className="relative z-10 space-y-2">
                    {/* 名称和分数 */}
                    <div className="flex items-center justify-between">
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8vw', // 名字和 Badge 之间的间距
                        width: '100%'
                      }}>
                        {/* 名字：通过 truncate 类防止名字太长把 Badge 挤出去 */}
                        <h4 className="font-medium truncate" style={{ margin: 0 }}>
                          {pilot.name}
                        </h4>

                        <Badge
                          variant="outline"
                        >
                          {pilot.box.name[lang]}
                        </Badge>
                      </div>
                      <Badge variant="outline" className="relative">
                        {pilot.score}

                        {pilot.score !== lastScore && (
                          <span
                            style={{
                              position: 'absolute',
                              top: 0,
                              right: 2,
                              fontSize: 8,
                              opacity: 0.5, // 半透明
                            }}
                          >
                            {pilot.score > lastScore ? '▲' : '▼'}
                          </span>
                        )}
                      </Badge>
                    </div>

                    {/* 驾驶员属性 */}
                    <div className="flex items-stretch gap-1 w-full">
                      {[
                        { value: pilot.swift, icon: 'icon_swift' },
                        { value: pilot.melee, icon: 'icon_melee' },
                        { value: pilot.projectile, icon: 'icon_projectile' },
                        { value: pilot.firing, icon: 'icon_firing' },
                        { value: pilot.moving, icon: 'icon_moving' },
                        { value: pilot.tactic, icon: 'icon_tactic' },
                      ].map(({ value, icon }) => (
                        <div
                          key={icon}
                          className="flex-1 flex flex-col items-center justify-center h-16 border rounded-md shadow-sm"
                        >
                          <img
                            src={`${tabsrc}/${icon}.png`}
                            alt={icon}
                            width={30}
                            height={30}
                            className="object-contain"
                            loading="lazy"
                          />
                          <div className="text-[10px] mt-0.5">{value}</div>
                        </div>
                      ))}
                    </div>



                    {/* 特性描述 */}
                    {pilot.traitDescription && (
                      <div className="space-y-2">
                        <p
                          className="text-sm text-muted-foreground"
                          style={{
                            color: 'white',
                            textShadow: `
          -1px -1px  #000,
           1px -1px  #000,
          -1px  1px #000,
           1px  1px  #000
        `,
                          }}
                        >
                          {pilot.traitDescription}
                        </p>
                      </div>
                    )}

                  </div>
                </Card>
              ))}

              {filteredPilots.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  {translations.t55}
                </div>
              )}
            </div>
          </motion.div>
        </div>

      )
      }

      {viewMode === 'drones' && (

        <div className="min-h-0 flex flex-col">
          <div className="p-4 border-b border-border space-y-4">
            <h3>{translations.t56}</h3>

            {/* 搜索框 */}
            <Input
              placeholder={translations.t57}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* 排序 + 星环选择 同一行 */}
            <div className="flex items-center justify-between space-x-4">
              {/* 排序选择 */}
              <div className="flex items-center space-x-2">

                <Select
                  value={sortOrder}
                  onValueChange={(value: 'score_desc' | 'score_asc') => setSortOrder(value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score_desc">{translations.t58}</SelectItem>
                    <SelectItem value="score_asc">{translations.t59}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="flex gap-1">
                  {/* 是否显示卡片预览 */}
                  <div className="flex flex-col items-center space-x-2">
                    <input
                      type="checkbox"
                      id="show-hover-img"
                      checked={showHoverImg}
                      onChange={(e) => onSetShowHoverImg(e.target.checked)}
                      style={{ accentColor: "#ffffff" }} // 灰色勾选
                    />
                    <label htmlFor="show-hover-img" style={{ fontSize: lang === "en" ? "0.6vw" : "1vw" }}>
                      {translations.t92}
                    </label>
                  </div>

                  <div className="flex flex-col items-center space-x-2">
                    <input
                      type="checkbox"
                      id="show-keyword"
                      checked={showKeyword}
                      onChange={(e) => onSetShowKeyword(e.target.checked)}
                      style={{ accentColor: "#ffffff" }} // 灰色勾选
                    />
                    <label htmlFor="show-keyword" style={{ fontSize: lang === "en" ? "0.6vw" : "1vw" }}>
                      {translations.t104}
                    </label>
                  </div>

                  {/* 星环选择 */}
                  <div className="flex flex-col items-center space-x-2">
                    <input
                      type="checkbox"
                      id="contain-pd"
                      checked={containPD}
                      onChange={(e) => setContainPD(e.target.checked)}

                      style={{
                        accentColor: "#ffffff",   // 勾选颜色为灰色
                        backgroundColor: "#ffffff" // 背景白色
                      }}
                    />
                    <label htmlFor="contain-pd" style={{ fontSize: lang === "en" ? "0.6vw" : "1vw" }}>
                      {translations.t67}
                    </label>
                  </div>

                  <div className="flex flex-col items-center space-x-2">
                    <input
                      type="checkbox"
                      id="show-belong-box"
                      checked={showSourceBox}
                      onChange={(e) => onSetShowSourceBox(e.target.checked)}

                      style={{ accentColor: "#ffffff" }} // 灰色勾选
                    />
                    <label htmlFor="show-keyword" style={{ fontSize: lang === "en" ? "0.6vw" : "1vw" }}>
                      {translations.t118}
                    </label>
                  </div>
                </div>
              </div>

            </div>

          </div>

          <motion.div
            key="drones"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3 }}
            className="min-h-0 flex flex-col"
          >
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredDrones.map(drone => {
                // 1. 直接通过 drone.id 获取剩余数量
                // 此时 droneRemainingCounts 的数据结构为 { "164": 2, "165": 2, "166": 2 }
                // 这三个 ID 对应同一个池子，所以拿到的值会自动同步
                const count = droneRemainingCounts[drone.id] ?? 0;
                const isOutOfStock = count <= 0;

                return (
                  <Card
                    key={drone.id}
                    className="relative p-3 cursor-pointer transition overflow-hidden shadow-sm min-h-[120px]"
                    onClick={() => {
                      if (inventoryMode && isOutOfStock) return;
                      onSelectDrone(drone);
                    }}
                    onMouseEnter={(e) => {
                      onSetHoverImg(`${drone.id}`);
                      (e.currentTarget as HTMLDivElement).style.transform = "scale(1.05)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 10px rgba(0,0,0,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)";
                    }}
                    style={{
                      filter: inventoryMode && isOutOfStock ? 'grayscale(100%)' : 'none',
                      opacity: inventoryMode && isOutOfStock ? 0.6 : 1,
                      cursor: inventoryMode && isOutOfStock ? 'not-allowed' : 'pointer',
                      backgroundColor: inventoryMode && isOutOfStock ? '#f3f4f6' : 'inherit',
                    }}
                  >
                    {/* 背景图层 */}
                    {(drone.hasImage === undefined || drone.hasImage) ? (
                      <div
                        className="absolute inset-0 bg-contain"
                        style={{
                          backgroundImage: `url(${tabsrc}/${drone.id}.png)`,
                          backgroundSize: 'contain',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right top',
                          opacity: inventoryMode && isOutOfStock ? 0.2 : 0.8,
                        }}
                      />
                    ) : (
                      <span style={{ display: "flex", position: "absolute", right: 0, padding: "1vh", bottom: 0, opacity: 0.8 }}>
                        {translations.t108}
                      </span>
                    )}

                    {/* 前景内容 */}
                    <div className="relative z-10 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">{drone.score}</Badge>

                        {/* 库存状态 */}
                        {inventoryMode && (
                          <Badge
                            variant={isOutOfStock ? "destructive" : "outline"}
                            className="shrink-0 font-mono"
                            style={{
                              backgroundColor: isOutOfStock ? '#ef4444' : 'rgba(255,255,255,0.8)',
                              color: isOutOfStock ? 'white' : 'inherit',
                              borderColor: isOutOfStock ? '#ef4444' : 'rgba(0,0,0,0.1)'
                            }}
                          >
                            {isOutOfStock ? "空" : `x${count}`}
                          </Badge>
                        )}

                        <h4 className={`font-medium truncate ${inventoryMode && isOutOfStock ? 'line-through text-muted-foreground opacity-70' : ''}`}>
                          {drone.name}
                        </h4>
                      </div>

                      {/* 属性数值区 */}
                      <div className="flex items-center gap-2">
                        {/* 装甲/结构 */}
                        {(drone.armor !== 0 || drone.structure !== 0) && (
                          <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm bg-background/50">
                            <div className="flex items-center gap-1">
                              <img loading="lazy" src={`${tabsrc}/icon_armor.png`} alt="armor" className="w-4 h-4" />
                              <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                                {drone.structure === 0 ? translations.t39 : `${translations.t39}/${translations.t40}`}
                              </div>
                            </div>
                            <div style={{ fontSize: '16px', color: drone.armor < 0 || drone.structure < 0 ? 'red' : 'inherit' }}>
                              {drone.structure === 0 ? drone.armor : `${drone.armor} / ${drone.structure}`}
                            </div>
                          </div>
                        )}

                        {/* 其他属性 (电子/闪避等) */}
                        {[
                          { label: translations.t41, value: drone.parray, icon: 'icon_parray' },
                          {
                            label: translations.t42,
                            value: drone.dodge,
                            icon: 'icon_dodge',
                            color: inventoryMode && isOutOfStock ? 'inherit' : `rgba(0,120,255,${0.20 + Math.min(Math.max(drone.dodge, 1), 6) * 0.08})`
                          },
                          {
                            label: translations.t43,
                            value: drone.electronic,
                            icon: 'icon_electronic',
                            color: inventoryMode && isOutOfStock ? 'inherit' : `rgba(255,180,0,${0.20 + Math.min(Math.max(drone.electronic, 1), 6) * 0.08})`
                          },
                        ]
                          .filter(attr => attr.value !== 0)
                          .map(attr => (
                            <div key={attr.label} className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm bg-background/50">
                              <div className="flex items-center gap-1">
                                <img loading="lazy" src={`${tabsrc}/${attr.icon}.png`} alt={attr.label} className="w-4 h-4" />
                                <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{attr.label}</div>
                              </div>
                              <div style={{ fontSize: '16px', color: attr.value < 0 ? 'red' : attr.color || 'inherit' }}>
                                {attr.value}
                              </div>
                            </div>
                          ))}
                      </div>

                      {/* 底部类型标签 */}
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            drone.type === 'large' ? 'destructive' :
                              drone.type === 'medium' ? 'default' : 'secondary'
                          }
                        >
                          {drone.type === 'large' ? translations.t9 :
                            drone.type === 'medium' ? translations.t10 : translations.t11}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </motion.div>

        </div>
      )}

      {viewMode === 'tacticCards' && (

        <div className="min-h-0 flex flex-col">
          <div className="p-4 border-b border-border space-y-4">
            <h3>{translations.t85}</h3>

            {/* 搜索框 */}
            <Input
              placeholder={translations.t86}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

          </div>

          <motion.div
            key="tacticCards"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3 }}
            className="min-h-0 flex flex-col"
          >
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-2">
                {filteredTacticCards.map(tacticCard => (
                  <Card
                    key={tacticCard.id}
                    className="relative cursor-pointer hover:bg-accent/50 transition shadow-sm overflow-hidden"
                    onClick={() => onSelectTacticCard(tacticCard)}
                    onMouseEnter={(e) => {
                      onSetHoverImg(`${tacticCard.id}`);
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
                    {/* 图片容器：相对定位 */}
                    <div className="relative flex justify-center items-center h-[200px] w-full">
                      <img
                        src={`${imgsrc}/${tacticCard.id}.png`}
                        alt={tacticCard.name}
                        className="max-h-full w-auto pointer-events-none transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* 徽章固定在图片左下 */}
                      <div className="absolute bottom-0 left-0">
                        <Badge
                          variant="outline"
                        >
                          {tacticCard.score}
                        </Badge>
                      </div>
                    </div>

                  </Card>

                ))}
              </div>
            </div>

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  </div>


}