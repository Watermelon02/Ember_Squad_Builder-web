import React, { useState, useMemo } from 'react';
import { Part, Drone, Pilot, Team, TacticCard } from '../../../types';

import ListPanel from '../mobile/ListPanelMobile';

import PartListMobile from './part/PartListMobile';
import PilotListMobile from './pilot/PilotListMobile';
import DroneListMobile from './drone/DroneListMobile';
import TacticCardListMobile from './tacticCard/TacticCardListMobile';



//手机端部件选择
interface MobilePartSelectorMobileProps {
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
  imgsrc: string, tabsrc: string, tabSmallSrc: string
  onSetHoverImg: (img: string | null) => void;
  onSetShowHoverImg: (show: boolean) => void;
  showHoverImg: boolean;
  mobileOrTablet: boolean;
  lastScore: number;
  lastPartId: string;
  showKeyword?: boolean;
  onSetShowKeyword: (show: boolean) => void;

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
  onSetShowKeyword,showKeyword,
  imgsrc, tabsrc, tabSmallSrc, onSetHoverImg, onSetShowHoverImg, showHoverImg, mobileOrTablet, lastScore, lastPartId
}: MobilePartSelectorMobileProps) {
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
  }, [pilots, team, searchQuery, containPD, sortOrder]);


  return <div ><div style={{ display: viewMode === 'parts' ? 'block' : 'none' }}>
    <ListPanel
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      sortOrder={sortOrder}
      setSortOrder={setSortOrder}
      containPD={containPD}
      setContainPD={setContainPD}
      showHoverImg={showHoverImg}
      onSetShowHoverImg={onSetShowHoverImg}
      mobileOrTablet={mobileOrTablet}
      translations={translations}
      showKeyword={showKeyword}
      onSetShowKeyword={onSetShowKeyword}
    >
      <PartListMobile
        filteredParts={filteredParts}
        onSelectPart={onSelectPart}
        tabsrc={tabSmallSrc}
        translations={translations}
        lastScore={lastScore}
        selectedPartType={selectedPartType}
      />
    </ListPanel>
  </div>

    <div style={{ display: viewMode === 'pilots' ? 'block' : 'none' }}>
      <ListPanel
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        containPD={containPD}
        setContainPD={setContainPD}
        showHoverImg={showHoverImg}
        onSetShowHoverImg={onSetShowHoverImg}
        mobileOrTablet={mobileOrTablet}
        translations={translations}
      >
        <PilotListMobile
          filteredPilots={filteredPilots}
          onSelectPilot={onSelectPilot}
          onSetHoverImg={onSetHoverImg}
          tabsrc={tabsrc}
          imgsrc={imgsrc}
          translations={translations}
          lastScore={lastScore}
        />
      </ListPanel>
    </div>

    <div style={{ display: viewMode === 'drones' ? 'block' : 'none' }}>
      <ListPanel
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        containPD={containPD}
        setContainPD={setContainPD}
        showHoverImg={showHoverImg}
        onSetShowHoverImg={onSetShowHoverImg}
        mobileOrTablet={mobileOrTablet}
        translations={translations}
        showKeyword={showKeyword}
      onSetShowKeyword={onSetShowKeyword}
      >
        <DroneListMobile
          filteredDrones={filteredDrones}
          onSelectDrone={onSelectDrone}
          onSetHoverImg={onSetHoverImg}
          tabsrc={tabsrc}
          imgsrc={imgsrc}
          translations={translations}
        />
      </ListPanel>
    </div>

    <div style={{ display: viewMode === 'tacticCards' ? 'block' : 'none' }}>
      <ListPanel
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        containPD={containPD}
        setContainPD={setContainPD}
        showHoverImg={showHoverImg}
        onSetShowHoverImg={onSetShowHoverImg}
        mobileOrTablet={mobileOrTablet}
        translations={translations}
      >
        <TacticCardListMobile
          filteredTacticCards={filteredTacticCards}
          onSelectTacticCard={onSelectTacticCard}
          onSetHoverImg={onSetHoverImg}
          imgsrc={imgsrc}
        />
      </ListPanel>
    </div>
  </div>


}