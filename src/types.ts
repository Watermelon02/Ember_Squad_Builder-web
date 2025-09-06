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

export interface Part {
  id: string;
  name: string;
  type: 'torso' | 'chasis' | 'leftHand' | 'rightHand' | 'backpack';
  score: number;
  structure:number;
  armor:number;
  parray:number;
  dodge:number;
  electronic:number;
  description: string;
  imgSrc?: string;
  tags?: string[];
}

export interface Projectile {
  id: string;
  name: string;
  structure:number;
  armor:number;
  parray:number;
  dodge:number;
  electronic:number;
  stance:'offensive' | 'defensive' | 'mobility';
  imgSrc?: string;
}

export interface Drone {
  id: string;
  name: string;
  type: 'small' | 'medium' | 'large';
  score: number;
  structure:number;
  armor:number;
  parray:number;
  dodge:number;
  electronic:number;
  move:number;
  stance:'offensive' | 'defensive' | 'mobility';
  description?: string;
}

export interface Pilot {
  id: string;
  name: string;
  score: number;
  LV:number;
  faction:'RDL' | 'UN' | 'GOF' | 'PD';
  swift:number;
  melee:number;
  projectile:number;
  firing:number;
  moving:number;
  tactic:number;
  trait:string;
  traitDescription: string;
}

export const FACTION_COLORS = {
  RDL: 'bg-red-500',
  UN: 'bg-blue-500',
  GOF: 'bg-yellow-500',
  PD: 'bg-gray-500',
} as const;

export const FACTION_NAMES = {
  RDL: '复兴发展同盟',
  UN: '联合网络',
  // GOF: '自由卫士',
  // PD: '星环动力',
  //没有卡片数据
} as const;

export const PART_TYPE_NAMES = {
  torso: '核心',
  chasis: '下肢',
  leftHand: '左手',
  rightHand: '右手',
  backpack: '背包',
} as const;