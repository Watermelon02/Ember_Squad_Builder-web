import React, { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Part, Drone, Pilot, Team } from '../types';

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
  translations:any,
  partTypeNames:any,
  imgsrc:string
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
  imgsrc
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
  }, [parts, selectedPartType, searchQuery, selectedTags, sortOrder]);

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
    let filtered = pilots.filter(pilot => {
      if (searchQuery && !pilot.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

    return filtered.sort((a, b) => {
      return sortOrder === 'score_desc' ? b.score - a.score : a.score - b.score;
    });
  }, [pilots, searchQuery, sortOrder]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (viewMode === 'parts') {
    return (
      <div className="min-h-0 flex flex-col">
        <div className="p-4 border-b border-border space-y-4">
          <h3>{translations.t61} - {partTypeNames[selectedPartType as keyof typeof partTypeNames]}</h3>

          {/* 搜索框 */}
          <Input
            placeholder={translations.t35}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* 排序选择 */}
          <div className="space-y-2">
            <Label>{translations.t36}</Label>
            <Select value={sortOrder} onValueChange={(value: 'score_desc' | 'score_asc') => setSortOrder(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score_desc">{translations.t37}</SelectItem>
                <SelectItem value="asc">{translations.t38}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid gap-4">
            {Array.from({ length: Math.ceil(filteredParts.length / 3) }, (_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-1 gap-3">
                {filteredParts.slice(rowIndex * 3, (rowIndex + 1) * 3).map(part => (
                  <Card
                    key={part.id}
                    className="relative p-3 cursor-pointer hover:bg-accent/50 transition-colors overflow-hidden"
                    onClick={() => onSelectPart(part)}
                  >

                    {/* 前景文字内容 */}
                    <div className="relative z-10 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium truncate">{part.name}</h4>
                        <Badge variant="outline">{part.score}</Badge>
                      </div>

                      {/* 机体数据 */}
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm">
                          <div className="text-[9px] text-muted-foreground">{translations.t39}</div>
                          <div className="text-[10px]">{part.armor}</div>
                        </div>
                        <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm">
                          <div className="text-[9px] text-muted-foreground">{translations.t40}</div>
                          <div className="text-[10px]">{part.structure}</div>
                        </div>
                        <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm">
                          <div className="text-[9px] text-muted-foreground">{translations.t41}</div>
                          <div className="text-[10px]">{part.parray}</div>
                        </div>
                        <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm">
                          <div className="text-[9px] text-muted-foreground">{translations.t42}</div>
                          <div className="text-[10px]">{part.dodge}</div>
                        </div>
                        <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm">
                          <div className="text-[9px] text-muted-foreground">{translations.t43}</div>
                          <div className="text-[10px]">{part.electronic}</div>
                        </div>
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
    );
  }

  if (viewMode === 'pilots') {
    return (
      <div className="min-h-0 flex flex-col">
        <div className="flex-shrink-0 p-4 border-b border-border space-y-4">
          <h3>{translations.t45}</h3>

          {/* 搜索框 */}
          <Input
            placeholder={translations.t46}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* 排序选择 */}
          <div className="space-y-2">
            <Label>排序方式</Label>
            <Select value={sortOrder} onValueChange={(value: 'score_desc' | 'score_asc') => setSortOrder(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score_desc">{translations.t47}</SelectItem>
                <SelectItem value="score_asc">{translations.t48}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredPilots.map(pilot => (
            <Card
              key={pilot.id}
              className="p-4 cursor-pointer hover:bg-accent/50 transition-colors relative overflow-hidden"
              onClick={() => onSelectPilot(pilot)}
            >
              {/* 背景图层 */}
              <div
                className="absolute inset-0 bg-cover bg-left-top"
                style={{
                  backgroundImage: `url(${imgsrc}/${pilot.faction}/pilot/${pilot.id}.png)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'left top -40px' // 向上偏移
                  , opacity: 0.2,
                }}
              ></div>

              {/* 文字内容层 */}
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{pilot.name}</h4>
                  <Badge variant="outline">{pilot.score}</Badge>
                </div>
                {/* 驾驶员数据 */}
                <div className="flex items-center gap-1">

                  <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm">
                    <div className="text-[9px] text-muted-foreground">{translations.t49}</div>
                    <div className="text-[10px]">{pilot.swift}</div>
                  </div>


                  <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm">
                    <div className="text-[9px] text-muted-foreground">{translations.t50}</div>
                    <div className="text-[10px]">{pilot.melee}</div>
                  </div>


                  <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm">
                    <div className="text-[9px] text-muted-foreground">{translations.t51}</div>
                    <div className="text-[10px]">{pilot.projectile}</div>
                  </div>


                  <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm">
                    <div className="text-[9px] text-muted-foreground">{translations.t52}</div>
                    <div className="text-[10px]">{pilot.firing}</div>
                  </div>


                  <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm">
                    <div className="text-[9px] text-muted-foreground">{translations.t53}</div>
                    <div className="text-[10px]">{pilot.moving}</div>
                  </div>


                  <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm">
                    <div className="text-[9px] text-muted-foreground">{translations.t54}</div>
                    <div className="text-[10px]">{pilot.tactic}</div>
                  </div>

                </div>


                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{pilot.traitDescription}</p>

                </div>
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
    );
  }

  return (
    <div className="min-h-0 flex flex-col">
      <div className="p-4 border-b border-border space-y-4">
        <h3>{translations.t56}</h3>

        {/* 搜索框 */}
        <Input
          placeholder={translations.t57}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* 排序选择 */}
        <div className="space-y-2">
          <Label>排序方式</Label>
          <Select value={sortOrder} onValueChange={(value: 'score_desc' | 'score_asc') => setSortOrder(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score_desc">{translations.t58}</SelectItem>
              <SelectItem value="score_asc">{translations.t59}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 星环选择 */}
        {/* <div className="flex items-center space-x-2">
          <Checkbox
            id="contain-pd"
            checked={containPD}
            onCheckedChange={(checked) => setContainPD(!!checked)}
          />
          <Label htmlFor="contain-pd">包含星环</Label>
        </div> */}
      </div>


      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredDrones.map(drone => (
          <Card
            key={drone.id}
            className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => onSelectDrone(drone)}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{drone.name}</h4>
                <Badge variant="outline">{drone.score}</Badge>
              </div>
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
              {drone.description && (
                <p className="text-sm text-muted-foreground">{drone.description}</p>
              )}
            </div>
          </Card>
        ))}

        {filteredDrones.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            {translations.t60}
          </div>
        )}
      </div>
    </div>
  );
}