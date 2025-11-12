import React, { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Part, Drone, Pilot, Team, TacticCard } from '../types';

//手机端部件选择
interface MobilePartSelectorProps {
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
  onSetHoverImg: (img: string | null) => void;
  onSetShowHoverImg: (show: boolean) => void;
  showHoverImg: boolean;
  mobileOrTablet: boolean;
  lastScore: number;
  lastPartId: string;
}

export function PartSelectorMobile({
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
  translations,
  partTypeNames,
  imgsrc, tabsrc, onSetHoverImg, onSetShowHoverImg, showHoverImg, mobileOrTablet, lastScore, lastPartId
}: PartSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [containPD, setContainPD] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<'score_desc' | 'score_asc'>('score_asc');

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

      if ((part.isPD === undefined) && containPD) {
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

      if ((drone.isPD === undefined) && containPD) {
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
  }, [pilots, team, searchQuery, containPD]);


  return <div className="flex flex-col h-full min-h-0">
      {viewMode === 'parts' && (

        <div className="min-h-0 flex flex-col">
          <div className=" space-y-4" style={{paddingBottom:"1vh"}}>

            {/* 搜索框 */}
            <Input
              placeholder={translations.t35}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />


            <div className="flex items-center justify-between space-x-4  border-b border-border" style={{paddingBottom:"1vh"}}>
              {/* 排序选择 */}
              <div className="flex items-center space-x-2">
                <Label>{translations.t36}</Label>
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
              {!mobileOrTablet && <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="show-hover-img"
                  checked={showHoverImg}
                  onChange={(e) => onSetShowHoverImg(e.target.checked)}
                  className="h-4 w-4"
                  style={{ accentColor: "#ffffff" }} // 灰色勾选
                />
                <label htmlFor="show-hover-img" className="text-sm">
                  {translations.t92}
                </label>
              </div>}

              {/* 星环选择 */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="contain-pd"
                  checked={containPD}
                  onChange={(e) => setContainPD(e.target.checked)}
                  className="h-4 w-4"
                  style={{
                    accentColor: "#ffffff",   // 勾选颜色为灰色
                  }}
                />
                <label htmlFor="contain-pd" className="text-sm">
                  {translations.t67}
                </label>
              </div>

            </div>
          </div>
          <div
            key={`${selectedPartType}`}
            className="min-h-0 flex flex-col"
          >
            <div className="flex-1 overflow-y-auto" style={{ paddingTop: '1vh',paddingLeft:"2vw",paddingRight:"2vw" }}>
              <div className="grid gap-4">
                {Array.from({ length: Math.ceil(filteredParts.length / 3) }, (_, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-1 gap-3">
                    {filteredParts.slice(rowIndex * 3, (rowIndex + 1) * 3).map(part => (
                      <Card
                        key={part.id}
                        className="relative p-3 cursor-pointer hover:bg-accent/50 transition overflow-hidden shadow-sm"
                        onClick={() => onSelectPart(part)}
                        onMouseEnter={(e) => {
                          onSetHoverImg(`${imgsrc}/${part.id}.png`);
                          (e.currentTarget as HTMLDivElement).style.transform = "scale(1.05)";
                          (e.currentTarget as HTMLDivElement).style.boxShadow =
                            "0 6px 10px rgba(0,0,0,0.1)";
                        }}
                        onMouseLeave={(e) => {
                          onSetHoverImg("null"); (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                          (e.currentTarget as HTMLDivElement).style.boxShadow =
                            "0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)";
                        }}
                      >
                        {/* 背景图层 */}
                        <div
                          className="absolute inset-0 bg-contain"
                          style={{
                            backgroundImage: `url(${tabsrc}/${part.id}.png)`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right top',
                            opacity: 0.8,
                          }}
                        ></div>

                        {/* 前景文字内容 */}
                        <div className="relative z-10 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="shrink-0 relative"
                            >
                              {part.score}
                              {part.score !== lastScore && (
                                <span
                                  style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 2,
                                    fontSize: 8,
                                    opacity: 0.5, // 半透明
                                  }}
                                >
                                  {part.score > lastScore ? '▲' : '▼'}
                                </span>
                              )}
                            </Badge>

                            <h4 className="font-medium truncate">{part.name}</h4>
                          </div>


                          {/* 部件数据 */}
                          <div className="flex items-center gap-2">
                            {(part.armor !== 0 || part.structure !== 0) && (
                              <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm">
                                <div className="flex items-center gap-1">
                                  <img
                                    loading="lazy"
                                    src={`${tabsrc}/icon_armor.png`}
                                    alt="armor"
                                    className="w-4 h-4"
                                  />
                                  <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                                    {part.structure === 0
                                      ? translations.t39
                                      : `${translations.t39}/${translations.t40}`}
                                  </div>
                                </div>

                                <div
                                  style={{
                                    fontSize: '16px',
                                    color:
                                      part.armor < 0 || part.structure < 0 ? 'red' : 'inherit',
                                  }}
                                >
                                  {part.structure === 0
                                    ? part.armor
                                    : `${part.armor} / ${part.structure}`}
                                </div>
                              </div>
                            )}

                            {[
                              { label: translations.t41, value: part.parray, icon: 'icon_parray' },

                              // 🔵 dodge（弱化发光）
                              {
                                label: translations.t42,
                                value: part.dodge,
                                icon: 'icon_dodge',
                                color: (() => {
                                  const v = Math.min(Math.max(part.dodge, 1), 6);
                                  const opacity = 0.20 + v * 0.08; // ✅ 弱化光效
                                  return `rgba(0,120,255,${opacity})`;
                                })(),
                              },

                              // 🟡 electronic（弱化发光）
                              {
                                label: translations.t43,
                                value: part.electronic,
                                icon: 'icon_electronic',
                                color: (() => {
                                  const v = Math.min(Math.max(part.electronic, 1), 6);
                                  const opacity = 0.20 + v * 0.08; // ✅ 弱化光效
                                  return `rgba(255,180,0,${opacity})`;
                                })(),
                              },
                            ]
                              .filter(attr => attr.value !== 0)
                              .map(attr => (
                                <div
                                  key={attr.label}
                                  className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm"
                                >
                                  <div className="flex items-center gap-1">
                                    <img
                                      loading="lazy"
                                      src={`${tabsrc}/${attr.icon}.png`}
                                      alt={attr.label}
                                      className="w-4 h-4"
                                    />
                                    <div
                                      style={{
                                        fontSize: '12px',
                                        color: 'var(--muted-foreground)',
                                      }}
                                    >
                                      {attr.label}
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      fontSize: '16px',
                                      color:
                                        attr.value < 0 ? 'red' : attr.color || 'inherit',
                                    }}
                                  >
                                    {attr.value}
                                  </div>
                                </div>
                              ))}
                          </div>



                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {part.description}
                          </p>
                          {part.tags && part.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {part.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                ))}
              </div>

              {filteredParts.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  {translations.t44}
                </div>
              )}
            </div>
          </div>
        </div>

      )
      }



      {viewMode === 'pilots' && (

        <div className="min-h-0 flex flex-col">
          <div className="flex-shrink-0 border-b border-border space-y-4" style={{paddingBottom:"1vh"}}>
            {/* 搜索框 */}
            <Input
              placeholder={translations.t46}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="flex items-center justify-between space-x-4" >
              {/* 排序选择 */}
              <div className="flex items-center space-x-2" >
                <Label>{translations.t36}</Label>
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
              {!mobileOrTablet && <div className="flex items-center space-x-2" >
                <input
                  type="checkbox"
                  id="show-hover-img"
                  checked={showHoverImg}
                  onChange={(e) => onSetShowHoverImg(e.target.checked)}
                  className="h-4 w-4"
                  style={{ accentColor: "#ffffff" }} // 灰色勾选
                />
                <label htmlFor="show-hover-img" className="text-sm">
                  {translations.t92}
                </label>
              </div>}

              {/* 星环选择 */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="contain-pd"
                  checked={containPD}
                  onChange={(e) => setContainPD(e.target.checked)}
                  className="h-4 w-4"
                  style={{
                    accentColor: "#ffffff",   // 勾选颜色为灰色
                    backgroundColor: "#ffffff" // 背景白色
                  }}
                />
                <label htmlFor="contain-pd" className="text-sm">
                  {translations.t67}
                </label>
              </div>

            </div>
          </div>
          <div
            key="parts"
            className="min-h-0 flex flex-col"
          >
            <div className="flex-1 overflow-y-auto space-y-3" style={{ paddingTop: '1vh',paddingLeft:"2vw",paddingRight:"2vw" }} >
              {filteredPilots.map(pilot => (
                <Card
                  key={pilot.id}
                  className="p-4 cursor-pointer hover:bg-accent/50 transition relative overflow-hidden shadow-sm"
                  onClick={() => onSelectPilot(pilot)}
                  onMouseEnter={(e) => {
                    onSetHoverImg(`${imgsrc}/${pilot.id}.png`);
                    (e.currentTarget as HTMLDivElement).style.transform = "scale(1.05)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 6px 10px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    onSetHoverImg("null"); (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
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
                      <h4 className="font-medium">{pilot.name}</h4>
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
                      <div className="space-y-2" >
                        <p className="text-sm text-muted-foreground" style={{
                          color: 'white',
                          textShadow: '0 0 4px rgba(0,0,0,0.7)',
                        }}>{pilot.traitDescription}</p>
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
          </div>
        </div>

      )
      }

      {viewMode === 'drones' && (

        <div className="min-h-0 flex flex-col">
          <div className=" border-b border-border space-y-4" style={{paddingBottom:"1vh"}}>
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
                <Label>{translations.t36}</Label>
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
              {!mobileOrTablet && <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="show-hover-img"
                  checked={showHoverImg}
                  onChange={(e) => onSetShowHoverImg(e.target.checked)}
                  className="h-4 w-4"
                  style={{ accentColor: "#ffffff" }} // 灰色勾选
                />
                <label htmlFor="show-hover-img" className="text-sm">
                  {translations.t92}
                </label>
              </div>}

              {/* 星环选择 */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="contain-pd"
                  checked={containPD}
                  onChange={(e) => setContainPD(e.target.checked)}
                  className="h-4 w-4"
                  style={{
                    accentColor: "#ffffff",   // 勾选颜色为灰色
                    backgroundColor: "#ffffff" // 背景白色
                  }}
                />
                <label htmlFor="contain-pd" className="text-sm">
                  {translations.t67}
                </label>
              </div>

            </div>

          </div>

          <div
            key="drones"
            className="min-h-0 flex flex-col"
          >
            <div className="flex-1 overflow-y-auto space-y-3" style={{ paddingTop: '1vh',paddingLeft:"2vw",paddingRight:"2vw" }}>
              {filteredDrones.map(drone => (
                <Card
                  key={drone.id}
                  className="relative p-3 cursor-pointer hover:bg-accent/50 transition overflow-hidden shadow-sm min-h-[120px]"
                  onClick={() => onSelectDrone(drone)}
                  onMouseEnter={(e) => {
                    onSetHoverImg(`${imgsrc}/${drone.id}.png`);
                    (e.currentTarget as HTMLDivElement).style.transform = "scale(1.05)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 6px 10px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    onSetHoverImg("null"); (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)";
                  }}
                >

                  {/* 背景图层 */}
                  <div
                    className="absolute inset-0 bg-contain"
                    style={{
                      backgroundImage: `url(${tabsrc}/${drone.id}.png)`,
                      backgroundSize: 'contain',     // 等比缩放，完整显示
                      backgroundRepeat: 'no-repeat', // 不要平铺
                      backgroundPosition: 'right top', // 靠右上角
                      opacity: 0.8,
                    }}
                  ></div>

                  {/* 前景文字内容 */}
                  <div className="relative z-10 space-y-2">
                    {/* 名称和分数 */}
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="shrink-0">{drone.score}</Badge>
                      <h4 className="font-medium truncate">{drone.name}</h4>
                    </div>


                    <div className="flex items-center gap-2">
                      {(drone.armor !== 0 || drone.structure !== 0) && (
                        <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm">
                          <div className="flex items-center gap-1">
                            <img
                              loading="lazy"
                              src={`${tabsrc}/icon_armor.png`}
                              alt="armor"
                              className="w-4 h-4"
                            />
                            <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                              {drone.structure === 0
                                ? translations.t39
                                : `${translations.t39}/${translations.t40}`}
                            </div>
                          </div>

                          <div
                            style={{
                              fontSize: '16px',
                              color:
                                drone.armor < 0 || drone.structure < 0 ? 'red' : 'inherit',
                            }}
                          >
                            {drone.structure === 0
                              ? drone.armor
                              : `${drone.armor} / ${drone.structure}`}
                          </div>
                        </div>
                      )}

                      {[
                        { label: translations.t41, value: drone.parray, icon: 'icon_parray' },

                        // 🔵 dodge（弱化发光）
                        {
                          label: translations.t42,
                          value: drone.dodge,
                          icon: 'icon_dodge',
                          color: (() => {
                            const v = Math.min(Math.max(drone.dodge, 1), 6);
                            const opacity = 0.20 + v * 0.08; // ✅ 弱化光效
                            return `rgba(0,120,255,${opacity})`;
                          })(),
                        },

                        // 🟡 electronic（弱化发光）
                        {
                          label: translations.t43,
                          value: drone.electronic,
                          icon: 'icon_electronic',
                          color: (() => {
                            const v = Math.min(Math.max(drone.electronic, 1), 6);
                            const opacity = 0.20 + v * 0.08; // ✅ 弱化光效
                            return `rgba(255,180,0,${opacity})`;
                          })(),
                        },
                      ]
                        .filter(attr => attr.value !== 0)
                        .map(attr => (
                          <div
                            key={attr.label}
                            className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm"
                          >
                            <div className="flex items-center gap-1">
                              <img
                                loading="lazy"
                                src={`${tabsrc}/${attr.icon}.png`}
                                alt={attr.label}
                                className="w-4 h-4"
                              />
                              <div
                                style={{
                                  fontSize: '12px',
                                  color: 'var(--muted-foreground)',
                                }}
                              >
                                {attr.label}
                              </div>
                            </div>

                            <div
                              style={{
                                fontSize: '16px',
                                color:
                                  attr.value < 0 ? 'red' : attr.color || 'inherit',
                              }}
                            >
                              {attr.value}
                            </div>
                          </div>
                        ))}
                    </div>


                    {/* 类型 */}
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          drone.type === 'large' ? 'destructive' :
                            drone.type === 'medium' ? 'default' : 'secondary'
                        }
                      >
                        {drone.type === 'large' ? '大型' :
                          drone.type === 'medium' ? '中型' : '小型'}
                      </Badge>
                    </div>


                  </div>
                </Card>
              ))}
            </div>
          </div>

        </div>
      )}

      {viewMode === 'tacticCards' && (

        <div className="min-h-0 flex flex-col">
          <div className="border-b border-border space-y-4" style={{paddingBottom:"1vh"}}>
            <h3>{translations.t85}</h3>

            {/* 搜索框 */}
            <Input
              placeholder={translations.t86}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

          </div>

          <div
            key="tacticCards"
            className="min-h-0 flex flex-col"
          >
            <div className="flex-1 overflow-y-auto"style={{ paddingTop: '1vh',paddingLeft:"2vw",paddingRight:"2vw" }}>
              <div className="grid grid-cols-2 gap-2">
                {filteredTacticCards.map(tacticCard => (
                  <Card
                    key={tacticCard.id}
                    className="relative cursor-pointer hover:bg-accent/50 transition shadow-sm overflow-hidden"
                    onClick={() => onSelectTacticCard(tacticCard)}
                    onMouseEnter={(e) => {
                      onSetHoverImg(`${imgsrc}/${tacticCard.id}.png`);
                      (e.currentTarget as HTMLDivElement).style.transform = "scale(1.05)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        "0 6px 10px rgba(0,0,0,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      onSetHoverImg("null"); (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
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

          </div>

        </div>
      )}
  </div>


}