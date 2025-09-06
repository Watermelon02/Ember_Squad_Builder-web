import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Part, Drone, Pilot, PART_TYPE_NAMES, Team } from '../types';
import { pdDrones } from '../data';

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
}: PartSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [containPD, setContainPD] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<'score_desc' | 'score_asc'>('score_asc');

  // 获取所有可用标签
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    parts.forEach(part => {
      part.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [parts]);

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
      return true;
    });

    return filtered.sort((a, b) => {
      return sortOrder === 'score_desc' ? b.score - a.score : a.score - b.score;
    });
  }, [drones, searchQuery, sortOrder]);

  // 过滤驾驶员
  const filteredPilots = useMemo(() => {
    let filtered = pilots.filter(pilot => {
      if (searchQuery && !pilot.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !pilot.specialty.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !pilot.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))) {
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
          <h3>部件选择 - {PART_TYPE_NAMES[selectedPartType as keyof typeof PART_TYPE_NAMES]}</h3>

          {/* 搜索框 */}
          <Input
            placeholder="搜索部件名称或描述..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* 标签选择 */}
          {allTags.length > 0 && (
            <div className="space-y-2">
              <Label>标签筛选</Label>
              <div className="flex flex-wrap gap-2">
                <Checkbox
                  id={true}
                  checked={containPD}
                  onCheckedChange={() => {
                    setContainPD(!containPD);
                    drones.concat(pdDrones);
                  }}
                />
                {allTags.map(tag => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={tag}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => handleTagToggle(tag)}
                    />
                    <Label htmlFor={tag} className="text-sm">{tag}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 排序选择 */}
          <div className="space-y-2">
            <Label>排序方式</Label>
            <Select value={sortOrder} onValueChange={(value: 'score_desc' | 'score_asc') => setSortOrder(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score_desc">分数降序</SelectItem>
                <SelectItem value="asc">分数升序</SelectItem>
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
                          <div className="text-[9px] text-muted-foreground">装甲</div>
                          <div className="text-[10px]">{part.armor}</div>
                        </div>
                        <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm">
                          <div className="text-[9px] text-muted-foreground">结构</div>
                          <div className="text-[10px]">{part.structure}</div>
                        </div>
                        <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm">
                          <div className="text-[9px] text-muted-foreground">格挡</div>
                          <div className="text-[10px]">{part.parray}</div>
                        </div>
                        <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm">
                          <div className="text-[9px] text-muted-foreground">闪避</div>
                          <div className="text-[10px]">{part.dodge}</div>
                        </div>
                        <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm">
                          <div className="text-[9px] text-muted-foreground">电子</div>
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
              没有找到符合条件的部件
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
          <h3>驾驶员选择</h3>

          {/* 搜索框 */}
          <Input
            placeholder="搜索驾驶员姓名、专长或技能..."
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
                <SelectItem value="score_desc">分数降序</SelectItem>
                <SelectItem value="score_asc">分数升序</SelectItem>
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
                  backgroundImage: `url(${import.meta.env.BASE_URL}res/cn/${pilot.faction}/pilot/${pilot.id}.png)`,
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
                    <div className="text-[9px] text-muted-foreground">快速</div>
                    <div className="text-[10px]">{pilot.swift}</div>
                  </div>


                  <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm">
                    <div className="text-[9px] text-muted-foreground">近战</div>
                    <div className="text-[10px]">{pilot.melee}</div>
                  </div>


                  <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm">
                    <div className="text-[9px] text-muted-foreground">抛射</div>
                    <div className="text-[10px]">{pilot.projectile}</div>
                  </div>


                  <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm">
                    <div className="text-[9px] text-muted-foreground">射击</div>
                    <div className="text-[10px]">{pilot.firing}</div>
                  </div>


                  <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm">
                    <div className="text-[9px] text-muted-foreground">移动</div>
                    <div className="text-[10px]">{pilot.moving}</div>
                  </div>


                  <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm">
                    <div className="text-[9px] text-muted-foreground">战术</div>
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
              没有找到符合条件的驾驶员
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex flex-col">
      <div className="p-4 border-b border-border space-y-4">
        <h3>无人机选择</h3>

        {/* 搜索框 */}
        <Input
          placeholder="搜索无人机名称..."
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
              <SelectItem value="score_desc">分数降序</SelectItem>
              <SelectItem value="score_asc">分数升序</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
            没有找到符合条件的无人机
          </div>
        )}
      </div>
    </div>
  );
}