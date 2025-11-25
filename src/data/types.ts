import { Keyword } from "./keyword";

export interface Team {
  id: string;
  name: string;
  faction: 'RDL' | 'UN' | 'GOF' | 'PD';
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
  hasImage?:boolean;
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
  actions?:DroneAction[];
  hasImage?:boolean;
  isPD?:boolean;
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
  hasImage?:boolean;
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
  hasImage?:boolean;
}

export interface TacticCard {
  id: string;
  name: string;
  description: string;
  score: number;
}



export const FACTION_COLORS: { [key: string]: string } = {
  RDL: '#EA6D76',
  UN: '#65a2d8',
  GOF: '#E1D07E',
  PD: '#006CB6',
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
    // GOF: '自由卫士',
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