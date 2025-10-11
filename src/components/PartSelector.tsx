import React, { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Part, Drone, Pilot, Team } from '../types';
import { Checkbox } from "./ui/checkbox";
import { AnimatePresence, motion } from 'framer-motion';

interface PartSelectorProps {
  viewMode: 'parts' | 'drones' | 'pilots';
  team?: Team;
  selectedPartType: string;
  parts: Part[];
  drones: Drone[];
  pilots: Pilot[];
  onSelectPart: (part: Part) => void;
  onSelectDrone: (drone: Drone) => void;
  onSelectPilot: (pilot: Pilot) => void;
  translations: any,
  partTypeNames: any,
  imgsrc: string, tabsrc: string
}

export function PartSelector({
  viewMode,
  team,
  selectedPartType,
  parts,
  drones,
  pilots,
  onSelectPart,
  onSelectDrone,
  onSelectPilot,
  translations,
  partTypeNames,
  imgsrc, tabsrc
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

      // 搜索过滤
      if (searchQuery && !part.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !part.description.toLowerCase().includes(searchQuery.toLowerCase())) {
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

    return filtered;
  }, [pilots, team, searchQuery, containPD]);


  return <div className="flex flex-col h-full min-h-0">
    <AnimatePresence mode="wait">

      {viewMode === 'parts' && (

        <div className="min-h-0 flex flex-col">
          <div className="p-4 border-b border-border space-y-4">
            <h3>{translations.t61} - {partTypeNames[selectedPartType as keyof typeof partTypeNames]}</h3>

            {/* 搜索框 */}
            <Input
              placeholder={translations.t35}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />


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

              {/* 星环选择 */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="contain-pd"
                  checked={containPD}
                  onChange={(e) => setContainPD(e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="contain-pd" className="text-sm">
                  {translations.t67}
                </label>
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
                    {filteredParts.slice(rowIndex * 3, (rowIndex + 1) * 3).map(part => (
                      <Card
                        key={part.id}
                        className="relative p-3  cursor-pointer hover:bg-accent/50 transition overflow-hidden shadow-sm"
                        onClick={() => onSelectPart(part)}

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

                        {/* 背景图层 */}
                        <div
                          className="absolute inset-0 bg-contain"
                          style={{
                            backgroundImage: `url(${tabsrc}/${part.id}.png)`,
                            backgroundSize: 'contain',     // 等比缩放，完整显示
                            backgroundRepeat: 'no-repeat', // 不要平铺
                            backgroundPosition: 'right top', // 靠左上对齐
                            opacity: 0.8,
                          }}
                        ></div>


                        {/* 前景文字内容 */}
                        <div className="relative z-10 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="shrink-0">{part.score}</Badge>

                            <h4 className="font-medium truncate">{part.name}</h4>
                          </div>


                          {/* 部件数据 */}
                          <div className="flex items-center gap-2">
                            {/* 装甲/结构 */}
                            {(part.armor !== 0 || part.structure !== 0) && (
                              <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm">
                                <div className="flex items-center gap-1">
                                  {/* icon */}
                                  <img loading="lazy" src={`${tabsrc}/icon_armor.png`} alt="armor" className="w-4 h-4" />
                                  <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                                    {part.structure === 0 ? translations.t39 : `${translations.t39}/${translations.t40}`}
                                  </div>
                                </div>
                                <div
                                  style={{
                                    fontSize: '16px',
                                    color: part.armor < 0 || part.structure < 0 ? 'red' : 'inherit',
                                  }}
                                >
                                  {part.structure === 0 ? part.armor : `${part.armor} / ${part.structure}`}
                                </div>
                              </div>
                            )}

                            {/* 其他属性 */}
                            {[
                              { label: translations.t41, value: part.parray, icon: 'icon_parray' },
                              { label: translations.t42, value: part.dodge, icon: 'icon_dodge' },
                              { label: translations.t43, value: part.electronic, icon: 'icon_electronic' },
                            ]
                              .filter(attr => attr.value !== 0) // 过滤掉值为0
                              .map(attr => (
                                <div
                                  key={attr.label}
                                  className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm"
                                >
                                  <div className="flex items-center gap-1">
                                    {/* icon */}
                                    <img loading="lazy" src={`${tabsrc}/${attr.icon}.png`} alt={attr.label} className="w-4 h-4" />
                                    <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{attr.label}</div>
                                  </div>
                                  <div style={{ fontSize: '16px', color: attr.value < 0 ? 'red' : 'inherit' }}>
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
          </motion.div>
        </div>

      )
      }



      {viewMode === 'pilots' && (

        <div className="min-h-0 flex flex-col">
          <div className="flex-shrink-0 p-4 border-b border-border space-y-4">
            <h3>{translations.t45}</h3>

            {/* 搜索框 */}
            <Input
              placeholder={translations.t46}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

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

              {/* 星环选择 */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="contain-pd"
                  checked={containPD}
                  onChange={(e) => setContainPD(e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="contain-pd" className="text-sm">
                  {translations.t67}
                </label>
              </div>
            </div>
          </div>
          <motion.div
            key="parts"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3 }}
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
                      <h4 className="font-medium">{pilot.name}</h4>
                      <Badge variant="outline">{pilot.score}</Badge>
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

              {/* 星环选择 */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="contain-pd"
                  checked={containPD}
                  onChange={(e) => setContainPD(e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="contain-pd" className="text-sm">
                  {translations.t67}
                </label>
              </div>
            </div>

          </div>

          <motion.div
            key="drones"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3 }}
            transition={{ duration: 0.3 }}
            className="min-h-0 flex flex-col"
          >
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredDrones.map(drone => (
                <Card
                  key={drone.id}
                  className="relative p-3 cursor-pointer hover:bg-accent/50 transition overflow-hidden shadow-sm min-h-[120px]"
                  onClick={() => onSelectDrone(drone)}
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
                      {/* 装甲/结构 */}
                      {(drone.armor !== 0 || drone.structure !== 0) && (
                        <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm">
                          <div className="flex items-center gap-1">
                            {/* icon */}
                            <img loading="lazy" src={`${tabsrc}/icon_armor.png`} alt="armor" className="w-4 h-4" />
                            <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                              {drone.structure === 0 ? translations.t39 : `${translations.t39}/${translations.t40}`}
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: '16px',
                              color: drone.armor < 0 || drone.structure < 0 ? 'red' : 'inherit',
                            }}
                          >
                            {drone.structure === 0 ? drone.armor : `${drone.armor} / ${drone.structure}`}
                          </div>
                        </div>
                      )}

                      {/* 其他属性 */}
                      {[
                        { label: translations.t41, value: drone.parray, icon: 'icon_parray' },
                        { label: translations.t42, value: drone.dodge, icon: 'icon_dodge' },
                        { label: translations.t43, value: drone.electronic, icon: 'icon_electronic' },
                      ]
                        .filter(attr => attr.value !== 0) // 过滤掉值为0
                        .map(attr => (
                          <div
                            key={attr.label}
                            className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm"
                          >
                            <div className="flex items-center gap-1">
                              {/* icon */}
                              <img loading="lazy" src={`${tabsrc}/${attr.icon}.png`} alt={attr.label} className="w-4 h-4" />
                              <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{attr.label}</div>
                            </div>
                            <div style={{ fontSize: '16px', color: attr.value < 0 ? 'red' : 'inherit' }}>
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
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  </div>


}