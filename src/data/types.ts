import { Keyword } from "./keyword";
export type FactionType = "RDL" | "UN" | "GOF" | "PD" | "COLLABORATION";

export interface Team {
  id: string;
  name: string;
  faction: FactionType;
  mechs: Mech[];
  drones: Drone[];
  totalScore: number;
  mechCount: number;
  largeDroneCount: number;
  mediumDroneCount: number;
  smallDroneCount: number;
  deviceID?: string;
  tacticCards?: TacticCard[];
}

export interface Mech {
  id: string;
  name: string;
  pilot?: Pilot;
  parts: {
    torso?: Part;
    chasis?: Part;
    leftHand?: Part;
    rightHand?: Part;
    backpack?: Part;
  };
}

export interface Action {
  id: string;
  name: string;
  description: string;
  type: 'Swift' | 'Melee' | 'Projectile' | 'Firing' | 'Moving' | 'Tactic' | 'Passive';
  size: 's' | 'm' | 'l';
  range: number;
  storage: number;
  redDice: number;
  yellowDice: number;
}

export interface DroneAction {
  id: string;
  name: string;
  description: string;
  type: 'Swift' | 'Melee' | 'Projectile' | 'Firing' | 'Moving' | 'Tactic' | 'Passive';
  range: number;
  storage: number;
  redDice: number;
  yellowDice: number;
  speed: 'auto' | 'command' | 'passive'
}

export interface Part {
  id: string;
  name: string;
  type: 'torso' | 'chasis' | 'leftHand' | 'rightHand' | 'backpack';
  score: number;
  structure: number;
  armor: number;
  parray: number;
  dodge: number;
  electronic: number;
  move?: number;
  description: string;
  imgSrc?: string;
  tags?: string[];
  throwIndex?: string;//是否有对应的抛弃卡，如果有设置为其序号
  projectile?: string[];//是否有对应的导弹\设置物卡，如果有设置为其序号
  isPD?: boolean,
  keywords?: Keyword[];
  action?: Action[]
  hasImage?: boolean;
  containedIn: SourceInfo[];
}

export interface Projectile {
  id: string;
  name: string;
  structure: number;
  armor: number;
  parray: number;
  dodge: number;
  electronic: number;
  stance: 'offensive' | 'defensive' | 'mobility';
  imgSrc?: string;
  keywords?: Keyword[];
  actions?: DroneAction[];
  hasImage?: boolean;
  isPD?: boolean;
}

export interface Drone {
  id: string;
  name: string;
  type: 'small' | 'medium' | 'large';
  score: number;
  structure: number;
  armor: number;
  parray: number;
  dodge: number;
  electronic: number;
  move: number;
  stance: 'offensive' | 'defensive' | 'mobility';
  description?: string;
  projectile?: string[];
  isPD?: boolean;
  backpack?: Part;
  keywords?: Keyword[];
  actions?: DroneAction[];
  hasImage?: boolean;
  containedIn: SourceInfo[];
  valueLess?:boolean;
}

export interface Pilot {
  id: string;
  name: string;
  score: number;
  LV: number;
  faction: 'RDL' | 'UN' | 'GOF' | 'PD';
  swift: number;
  melee: number;
  projectile: number;
  firing: number;
  moving: number;
  tactic: number;
  trait: string;
  traitDescription: string;
  hasImage?: boolean;
  box: Box;
}

export interface TacticCard {
  id: string;
  name: string;
  description: string;
  score: number;
}

//用于描述该 部件\驾驶员\无人机 在哪个盒里，有几份。
export interface SourceInfo {
  box: Box;
  quantityPerBox: number; // 每个盒子里包含该物品的数量
}

//用于描述该 部件\驾驶员\无人机 在哪个盒里，有几份。
export interface Box {
  id: number;
  faction: FactionType[];
  name: { zh: string; en: string; jp: string; };
  hasImage: boolean
}

export const BOXES: Record<string, Box> = {
  UNSALE: { id: 0, faction: ["PD"], name: { zh: "未售卖内容", en: "Unsale Content", jp: "未販売コンテンツ" }, hasImage: false },
  RDL_CORE: { id: 1, faction: ["RDL"], name: { zh: "核心", en: "Core", jp: "コア" }, hasImage: true },
  RDL_CAVALRY: { id: 2, faction: ["RDL"], name: { zh: "铁骑", en: "Cavalry", jp: "カブリ" }, hasImage: true },
  RDL_HEAVY_METAL: { id: 3, faction: ["RDL"], name: { zh: "重金属", en: "Heavy Metal", jp: "ヘビーメタル" }, hasImage: true },
  UN_CORE: { id: 4, faction: ["UN"], name: { zh: "核心", en: "Core", jp: "コア" }, hasImage: true },
  UN_SCALPEL: { id: 5, faction: ["UN"], name: { zh: "手术刀", en: "Scalpel", jp: "スカルペル" }, hasImage: true },
  UN_DOORBREAKER: { id: 6, faction: ["UN"], name: { zh: "破门锤", en: "Doorbreaker", jp: "ドアブレイカー" }, hasImage: true },
  GOF_CORE: { id: 7, faction: ["GOF"], name: { zh: "核心", en: "Core", jp: "GOFコア" }, hasImage: false },
  GOF_JUSTICE: { id: 8, faction: ["GOF"], name: { zh: "正义", en: "Justice", jp: "ジャスティス" }, hasImage: false },
  GOF_HUNTERS: { id: 9, faction: ["GOF"], name: { zh: "猎人", en: "Hunter", jp: "ハンターズ" }, hasImage: false },
  LAB_RDL_GENJI_AND_MALLARD: { id: 10, faction: ["RDL"], name: { zh: "野鸭蚰蜒", en: "Genji and Mallard", jp: "ゲンジとマラード" }, hasImage: true },
  LAB_WHITE_DWARF: { id: 11, faction: ["COLLABORATION"], name: { zh: "白矮星", en: "White Dwarf", jp: "ホワイトドワーフ" }, hasImage: true },
  LAB_TRIAL_UN_OCTOPUS: { id: 12, faction: ["UN"], name: { zh: "LAB 试作章鱼", en: "Trial Octopus", jp: "トライアル UN オクトパス" }, hasImage: true },
  LAB_PD_REAPER_TYPE_1: { id: 13, faction: ["PD"], name: { zh: "收割者轻型", en: "Reaper Type 1", jp: "リーパー タイプ1" }, hasImage: true },
  LAB_PD_REAPER_TYPE_2: { id: 14, faction: ["PD"], name: { zh: "收割者重型", en: "Reaper Type 2", jp: "リーパー タイプ2" }, hasImage: true },
  LAB_PD_REAPER_TYPE_E: { id: 15, faction: ["PD"], name: { zh: "收割者工兵型", en: "Reaper Type E", jp: "リーパー タイプE" }, hasImage: true },
  SINGLE_RDL_DUNE: { id: 16, faction: ["RDL"], name: { zh: "单机包-沙丘", en: "Single Pack Dune", jp: "シングル デューン" }, hasImage: true },
  SINGLE_UN_TAURUS: { id: 17, faction: ["UN"], name: { zh: "单机包-金牛", en: "Single Pack Taurus", jp: "シングル タウラス" }, hasImage: true },
  COMBAT_RAID: { id: 18, faction: ["RDL", "UN"], name: { zh: "对战包-突袭", en: "Combat Pack Raid", jp: "コンバットレイド" }, hasImage: true },
  GAME_PACK: { id: 19, faction: ["RDL", "UN"], name: { zh: "游戏包", en: "Game Pack", jp: "ゲームパック" }, hasImage: true },
  LAB_PD_CRISIS1: { id: 20, faction: ["PD"], name: { zh: "危机 I", en: "Crisis I", jp: "クライシス I" }, hasImage: false },
  LAB_PD_CRISIS2: { id: 24, faction: ["PD"], name: { zh: "危机 II", en: "Crisis II", jp: "クライシス II" }, hasImage: true },
  LAB_PD_Vigilant_Bombing_Support: { id: 21, faction: ["PD"], name: { zh: "\"警惕\" 轰炸&支援型", en: "\"Vigilant\" Bombing & Support type", jp: "ヴィジラント」爆撃&支援型" }, hasImage: true },
  LAB_PD_Vigilant_Autocannon_MG: { id: 22, faction: ["PD"], name: { zh: "\"警惕\" 机炮&机枪型", en: "\"Vigilant\" Autocannon & MG type", jp: "ヴィジラント」オートキャノン&機関銃型" }, hasImage: true },
  LAB_GOF_CENTAUR: { id: 23, faction: ["GOF"], name: { zh: "半人马SK", en: "Centaur SK", jp: "セントール" }, hasImage: true },
}

export const FACTION_COLORS: { [key: string]: string } = {
  RDL: '#EA6D76',
  UN: '#65a2d8',
  GOF: '#E1D07E',
  PD: '#666666',
  COLLABORATION: '#666666',
};


export const FACTION_NAMES = {
  zh: {
    RDL: 'RDL',
    UN: 'UN',
    GOF: 'GOF',
    // PD: '星环动力',
    //没有卡片数据
  }, en: {
    RDL: 'RDL',
    UN: 'UN',
    GOF: 'GOF',
    // PD: '星环动力',
    //没有卡片数据
  }, jp: {
    RDL: 'RDL',
    UN: 'UN',
    GOF: 'GOF',
    // PD: '星环动力',
    //没有卡片数据
  }
} as const;

export const PART_TYPE_NAMES = {
  zh: {
    torso: '核心',
    chasis: '下肢',
    leftHand: '左手',
    rightHand: '右手',
    backpack: '背包',
  }, en: {
    torso: 'Torso',
    chasis: 'Chasis',
    leftHand: 'LeftArm',
    rightHand: 'RightArm',
    backpack: 'Backpack',
  }, jp: {
    torso: '胴',
    chasis: '下肢',
    leftHand: '左腕',
    rightHand: '右腕',
    backpack: 'バックパック',
  }
} as const;

export type MechPartType = 'torso' | 'chasis' | 'leftHand' | 'rightHand' | 'backpack';

export const calculateTotalScore = (drones: Drone[], tacticCards: TacticCard[] | undefined, meches: Mech[]) => {
  const droneScore = drones.reduce(
    (sum, d) => sum + d.score + (d.backpack?.score || 0),
    0
  );
  const tacticCardScore = tacticCards ? tacticCards.reduce((sum, tacticCard) => sum + tacticCard.score, 0) : 0;
  const mechScore = meches.reduce((sum, mech) =>
    sum + Object.values(mech.parts).reduce((partSum, part) => partSum + (part?.score || 0), 0)
    + (mech.pilot?.score || 0), 0
  );
  return droneScore + tacticCardScore + mechScore
}