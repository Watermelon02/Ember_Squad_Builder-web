import React, { useState, useMemo } from 'react';
import { Part, Drone, Pilot, Team, TacticCard, BOXES } from '../../../data/types';

import ListPanel from '../mobile/ListPanelMobile';

import PartListMobile from './part/PartListMobile';
import PilotListMobile from './pilot/PilotListMobile';
import DroneListMobile from './drone/DroneListMobile';
import TacticCardListMobile from './tacticCard/TacticCardListMobile';

// 手机端部件选择
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
  translations: any;
  partTypeNames: any;
  imgsrc: string;
  tabsrc: string;
  tabSmallSrc: string;
  onSetHoverImg: (img: string | null) => void;
  onSetShowHoverImg: (show: boolean) => void;
  showHoverImg: boolean;
  mobileOrTablet: boolean;
  lastScore: number;
  lastPartId: string;
  showKeyword?: boolean;
  onSetShowKeyword: (show: boolean) => void;
  competitionRegistrationMode: boolean;
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
  onSetShowKeyword,
  showKeyword,
  imgsrc,
  tabsrc,
  tabSmallSrc,
  onSetHoverImg,
  onSetShowHoverImg,
  showHoverImg,
  mobileOrTablet,
  lastScore,
  lastPartId,
  competitionRegistrationMode,
}: MobilePartSelectorMobileProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [containPD, setContainPD] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<'score_desc' | 'score_asc'>('score_asc');

  // --- 过滤逻辑保持不变（已使用 useMemo 优化） ---
  const filteredParts = useMemo(() => {
    let filtered = parts.filter((part) => {
      if (part.type !== selectedPartType) return false;
      if (part.id === lastPartId) return false;
      if (searchQuery && !part.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (part.isPD && !containPD) return false;
      if ((part.isPD === undefined || !part.isPD) && containPD) return false;
      if (selectedTags.length > 0) {
        const hasSelectedTag = selectedTags.some((tag) => part.tags?.includes(tag));
        if (!hasSelectedTag) return false;
      }
      if (part.score == 0) return false;
      // 如果开启比赛报名模式，进一步过滤掉不可参赛的部件
      if (competitionRegistrationMode) {
        // 众筹部件禁赛
        const bannedPartIds = new Set(['005', '040', '150', '117', '038', '152', '119']);
        if (bannedPartIds.has(part.id)) return false;

        // 根据部件来源进一步过滤
        let hasValidSource = false;
        let hasAnySource = false;

        for (const source of part.containedIn) {
          hasAnySource = true;

          // 未发售的部件不能使用（包括危机1）
          if (source.box === BOXES.UNSALE || source.box === BOXES.LAB_PD_CRISIS1) {
            continue; // 这个来源非法，检查下一个
          }

          // 自由阵营：只能用人马或者中立的部件
          if (team?.faction === "GOF") {
            if (source.box === BOXES.LAB_GOF_CENTAUR || part.isPD) {
              hasValidSource = true;
              break;
            }
            // 否则这个来源对自由无效，继续检查
            continue;
          }

          // 联合与复兴：不能使用游戏包、对战包
          if (source.box === BOXES.COMBAT_RAID || source.box === BOXES.GAME_PACK) {
            continue; // 这个来源非法，检查下一个
          }

          // 通过所有检查，这是一个合法来源
          hasValidSource = true;
          break;
        }

        // 没有任何合法来源则排除
        if (hasAnySource && !hasValidSource) return false;
      }
      return true;
    });
    return filtered.sort((a, b) => (sortOrder === 'score_desc' ? b.score - a.score : a.score - b.score));
  }, [parts, selectedPartType, searchQuery, selectedTags, sortOrder, containPD, lastPartId]);

  const filteredDrones = useMemo(() => {
    let filtered = drones.filter((drone) => {
      if (searchQuery && !drone.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (drone.isPD && !containPD) return false;
      if ((drone.isPD === undefined || !drone.isPD) && containPD) return false;
      if (drone.score == 0) return false;
      //如果开启比赛报名模式，进一步过滤掉不可参赛的无人机
      if (competitionRegistrationMode) {
        let usable = true;
        drone.containedIn.forEach(source => {
          if (team?.faction === "GOF" && !drone.isPD) usable = false;
          else {
            if (drone.id === "543") usable = false; //离子豪猪
          }
        });
        if (!usable) return false;
      }
      return true;
    });
    return filtered.sort((a, b) => (sortOrder === 'score_desc' ? b.score - a.score : a.score - b.score));
  }, [drones, searchQuery, sortOrder, containPD]);

  const filteredTacticCards = useMemo(() => {
    if (!tacticCards) return [];
    const usedTacticIds = new Set<string>();
    team?.tacticCards?.forEach((tactic) => {
      if (tactic?.id) usedTacticIds.add(tactic.id);
    });
    return tacticCards.filter((tacticCard) => {
      if (searchQuery && !tacticCard.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (usedTacticIds.has(tacticCard.id)) return false;
      if (competitionRegistrationMode) return false; // 目前战术卡不允许参赛
      return true;
    });
  }, [tacticCards, team, searchQuery]);

  const filteredPilots = useMemo(() => {
    const usedPilotIds = new Set<string>();
    team?.mechs.forEach((mech) => {
      if (mech.pilot) usedPilotIds.add(mech.pilot.id);
    });
    let filtered = pilots.filter((pilot) => {
      if (searchQuery && !pilot.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (pilot.faction === 'PD' && !containPD) return false;
      if (pilot.faction !== 'PD' && containPD) return false;
      if (usedPilotIds.has(pilot.id)) return false;
      //如果开启比赛报名模式，进一步过滤掉不可参赛的驾驶员
      if (competitionRegistrationMode) {
        let usable = true;
        if (pilot.id === "LPA-23-2" || pilot.id === "FPA-04-2") usable = false;
        if (pilot.faction === "GOF") {
          if (pilot.id !== "ZPA-46") usable = false;
        }
        if (pilot.faction === "PD") {
          if (pilot.id !== "XPA-60" && pilot.id !== "ACE-01") usable = false;
        }
        if (!usable) return false;

      }
      return true;
    });
    return filtered.sort((a, b) => (sortOrder === 'score_desc' ? b.score - a.score : a.score - b.score));
  }, [pilots, team, searchQuery, containPD, sortOrder]);

  // --- 渲染部分：采用条件渲染代替 display:none ---
  return (
    <div style={{ height: 'calc(100dvh - 35vh)', overflow: 'hidden' }}>
      {viewMode === 'parts' && (
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
            faction={team?.faction}
          />
        </ListPanel>
      )}

      {viewMode === 'pilots' && (
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
      )}

      {viewMode === 'drones' && (
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
      )}

      {viewMode === 'tacticCards' && (
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
      )}
    </div>
  );
}