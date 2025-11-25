import { Part, Drone, Pilot, Projectile,TacticCard } from './types';
import { KEYWORD_LIST } from './keyword';

export const rdlTorso: Part[] = [
  {
    "id": "012",
    "name": "RT-06  Mire  Battle Core",
    "score": 15,
    "structure": 2,
    "armor": 6,
    "parray": 0,
    "dodge": 0,
    "electronic": 2,
    "type": "torso",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords":[]
  },
  {
    "id": "014",
    "name": "RT-07T  Dune  Tactical Core",
    "score": 62,
    "structure": 4,
    "armor": 5,
    "parray": 0,
    "dodge": 0,
    "electronic": 3,
    "type": "torso",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.光环, KEYWORD_LIST.en.灵活时机]
  },
  {
    "id": "015",
    "name": "RT-08  Tempest  Artillery Core",
    "score": 62,
    "structure": 2,
    "armor": 7,
    "parray": 0,
    "dodge": 0,
    "electronic": 3,
    "type": "torso",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.击退X]
  },
  {
    "id": "016",
    "name": "RT-09A  Volcano  Armored Core",
    "score": 66,
    "structure": 4,
    "armor": 6,
    "parray": 0,
    "dodge": 0,
    "electronic": 3,
    "type": "torso",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "projectile": [
      "268"
    ],
    "keywords": [KEYWORD_LIST.en.指定X, KEYWORD_LIST.en.直射]
  },
  {
    "id": "017",
    "name": "RT-15B  Lava  Assault Core",
    "score": 59,
    "structure": 4,
    "armor": 5,
    "parray": 0,
    "dodge": 1,
    "electronic": 3,
    "type": "torso",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "projectile": [
      "268"
    ],
    "keywords": [KEYWORD_LIST.en.直射]
  },
  {
    "id": "019",
    "name": "RT-15C  Glacier  Assault Core",
    "score": 56,
    "structure": 4,
    "armor": 5,
    "parray": 0,
    "dodge": 1,
    "electronic": 2,
    "type": "torso",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "projectile": [
      "268"
    ],
    "keywords":[KEYWORD_LIST.en.直射]
  },
  {
    "id": "018",
    "name": "RT-15/EC  Aurora  ECM Core",
    "score": 60,
    "structure": 4,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 3,
    "type": "torso",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.电子支援, KEYWORD_LIST.en.电战节点X]
  },
  {
    "id": "246",
    "name": "RT-09M  Volcano-M  Armored Core",
    "score": 66,
    "structure": 4,
    "armor": 6,
    "parray": 0,
    "dodge": 0,
    "electronic": 3,
    "type": "torso",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "projectile": [
      "268"
    ],
    "keywords": [KEYWORD_LIST.en.指定X, KEYWORD_LIST.en.直射]
  },
  {
    "id": "280",
    "name": "RT-09M II  Volcano M II  Armored Core",
    "score": 66,
    "structure": 4,
    "armor": 6,
    "parray": 0,
    "dodge": 0,
    "electronic": 3,
    "type": "torso",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "projectile": [
      "268"
    ],
    "keywords": [KEYWORD_LIST.en.指定X, KEYWORD_LIST.en.直射]
  },
  {
    "id": "503",
    "name": "RT-16B Avalanche Assault Core",
    "score": 60,
    "structure": 4,
    "armor": 5,
    "parray": 0,
    "dodge": 1,
    "electronic": 3,
    "type": "torso",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "projectile": [
      "268"
    ],
    "keywords": [KEYWORD_LIST.en.直射]
  },
  {
    "id": "504",
    "name": "RT-15/S Nimbus Support Core",
    "score": 60,
    "structure": 4,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 3,
    "type": "torso",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.电子支援]
  },
  {
    "id": "505",
    "name": "RT-06E  Mire E  Battle Core",
    "score": 21,
    "structure": 2,
    "armor": 6,
    "parray": 0,
    "dodge": 0,
    "electronic": 3,
    "type": "torso",
    "description": "",
    "imgSrc": "",
    "tags": []
  }
];

export const rdlChasis: Part[] = [
  {
    "id": "020",
    "name": "RL-06  Standard Chassis",
    "score": 18,
    "structure": 0,
    "armor": 5,
    "parray": 0,
    "dodge": 3,
    "electronic": 0,
    "type": "chasis",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "021",
    "name": "RL-08  Armored Chassis",
    "score": 30,
    "structure": 1,
    "armor": 6,
    "parray": 0,
    "dodge": 3,
    "electronic": 0,
    "type": "chasis",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.直线移动]
  },
  {
    "id": "022",
    "name": "RL-03D  Swift Steed High-mobility Chassis",
    "score": 42,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 4,
    "electronic": 0,
    "type": "chasis",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "249",
    "name": "RL-08M  Armored Chassis",
    "score": 30,
    "structure": 1,
    "armor": 6,
    "parray": 0,
    "dodge": 3,
    "electronic": 0,
    "type": "chasis",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "281",
    "name": "RL-08M II Armored Chassis",
    "score": 45,
    "structure": 2,
    "armor": 6,
    "parray": 0,
    "dodge": 2,
    "electronic": 0,
    "type": "chasis",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.X姿态, KEYWORD_LIST.en.直线移动]
  },
  {
    "id": "506",
    "name": "RL-06M  Standard Chassis",
    "score": 18,
    "structure": 0,
    "armor": 5,
    "parray": 0,
    "dodge": 3,
    "electronic": 0,
    "type": "chasis",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "507",
    "name": "RL-06MS Support Chassis",
    "score": 24,
    "structure": 0,
    "armor": 5,
    "parray": 0,
    "dodge": 3,
    "electronic": 0,
    "type": "chasis",
    "description": "",
    "imgSrc": "",
    "tags": []
  }
];

export const rdlLeftHand: Part[] = [
  {
    "id": "023",
    "name": "Type 55 Shield + CC-6 Cleaver",
    "score": 54,
    "structure": 0,
    "armor": 5,
    "parray": 2,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "throwIndex": "024",
    "keywords": [KEYWORD_LIST.en.震撼, KEYWORD_LIST.en.频闪武器]
  },
  {
    "id": "024",
    "name": "Type 55 Shield + CC-6 Cleaver (D)",
    "score": 0,
    "structure": 0,
    "armor": 5,
    "parray": 2,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "029",
    "name": "ML-32 Dual Launcher + CC-3 Dagger",
    "score": 33,
    "structure": 0,
    "armor": 4,
    "parray": 1,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "projectile": [
      "071"
    ],
    "keywords": [KEYWORD_LIST.en.齐射X, KEYWORD_LIST.en.曲射]
  },
  {
    "id": "032",
    "name": "R-20 Shoulder-Mounted Railgun (L)",
    "score": 51,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.静止, KEYWORD_LIST.en.穿甲X]
  },
  {
    "id": "034",
    "name": "Type 77 Bulwark",
    "score": 50,
    "structure": 0,
    "armor": 8,
    "parray": 1,
    "dodge": -2,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "throwIndex": "035",
    "keywords": [KEYWORD_LIST.en.指定X]
  },
  {
    "id": "035",
    "name": "Type 77 Bulwark (D)",
    "score": 0,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "040",
    "name": "SPHX-3 Supporting Arm",
    "score": 42,
    "structure": 0,
    "armor": 4,
    "parray": 1,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "041",
    "name": "L-320 SMMG + Type 55 Shield + CC-6 Cleaver",
    "score": 51,
    "structure": 0,
    "armor": 5,
    "parray": 2,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "throwIndex": "042",
    "keywords": [KEYWORD_LIST.en.拦截X, KEYWORD_LIST.en.频闪武器]
  },
  {
    "id": "042",
    "name": "L-320 SMMG + Type 55 Shield + CC-6 Cleaver (D)",
    "score": 0,
    "structure": 0,
    "armor": 5,
    "parray": 2,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "045",
    "name": "Type 79 Combat Shield",
    "score": 56,
    "structure": 0,
    "armor": 6,
    "parray": 2,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.X姿态]
  },
  {
    "id": "050",
    "name": "FCC-12 Big Hand Grappler",
    "score": 69,
    "structure": 0,
    "armor": 4,
    "parray": 3,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.拖拽, KEYWORD_LIST.en.缴械]
  },
  {
    "id": "053",
    "name": "Type 55 Shield + PC-9 Shotgun (L)",
    "score": 48,
    "structure": 0,
    "armor": 5,
    "parray": 2,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "throwIndex": "054",
    "keywords": [KEYWORD_LIST.en.霰射]
  },
  {
    "id": "054",
    "name": "Type 55 Shield + PC-9 Shotgun (L) (D)",
    "score": 0,
    "structure": 0,
    "armor": 5,
    "parray": 2,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "056",
    "name": "G/AC-6 Rocket Launcher",
    "score": 36,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "projectile": [
      "267"
    ],
    "throwIndex": "057",
    "keywords": [KEYWORD_LIST.en.直射]
  },
  {
    "id": "057",
    "name": "G/AC-6 Rocket Launcher (D)",
    "score": 0,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "062",
    "name": "Type 62 Buckler + CC-20 Sabre (L)",
    "score": 63,
    "structure": 0,
    "armor": 5,
    "parray": 3,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.频闪武器]
  },
  {
    "id": "064",
    "name": "Type 55 Shield + MES Beacon Launcher",
    "score": 45,
    "structure": 0,
    "armor": 5,
    "parray": 2,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "projectile": [
      "072"
    ],
    "throwIndex": "065"
  },
  {
    "id": "065",
    "name": "Type 55 Shield + MES Beacon Launcher (D)",
    "score": 0,
    "structure": 0,
    "armor": 5,
    "parray": 2,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "252",
    "name": "Type 77 Bulwark (Early Model)",
    "score": 50,
    "structure": 0,
    "armor": 8,
    "parray": 1,
    "dodge": -2,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "throwIndex": "253",
    "keywords": [KEYWORD_LIST.en.X姿态]
  },
  {
    "id": "253",
    "name": "Type 77 Bulwark (Early Model) (D)",
    "score": 0,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "282",
    "name": "L-330 SMMG + Type 77B Bulwark",
    "score": 56,
    "structure": 0,
    "armor": 9,
    "parray": 1,
    "dodge": -3,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "throwIndex": "283",
    "keywords": [KEYWORD_LIST.en.拦截X, KEYWORD_LIST.en.X姿态]
  },
  {
    "id": "283",
    "name": "L-330 SMMG + Type 77B Bulwark(D)",
    "score": 0,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "510",
    "name": "Type 55 Shield + PC-9K Shotgun (L)",
    "score": 63,
    "structure": 0,
    "armor": 5,
    "parray": 2,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "throwIndex": "511",
    "keywords": [KEYWORD_LIST.en.击退X, KEYWORD_LIST.en.霰射]
  },
  {
    "id": "511",
    "name": "Type 55 Shield + PC-9K Shotgun (L) (D)",
    "score": 0,
    "structure": 0,
    "armor": 5,
    "parray": 2,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "514",
    "name": "AH-21 Pistol + CC-50 Pile Bunker (L)",
    "score": 63,
    "structure": 0,
    "armor": 4,
    "parray": 1,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "throwIndex": "515",
    "keywords": [KEYWORD_LIST.en.全向射击]
  },
  {
    "id": "515",
    "name": "AH-21 Pistol + CC-50 Pile Bunker (L) (D)",
    "score": 0,
    "structure": 0,
    "armor": 4,
    "parray": 1,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "520",
    "name": "Type 55 Shield",
    "score": 30,
    "structure": 0,
    "armor": 5,
    "parray": 2,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.震撼]
  }
];

export const rdlRightHand: Part[] = [
  {
    "id": "025",
    "name": "AC-32 Automatic Rifle",
    "score": 24,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "throwIndex": "026",
    "keywords": [KEYWORD_LIST.en.双手]
  },
  {
    "id": "026",
    "name": "AC-32 Automatic Rifle (D)",
    "score": 0,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "030",
    "name": "AC-150 HMG",
    "score": 42,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": -2,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "throwIndex": "031",
    "keywords": [KEYWORD_LIST.en.静止, KEYWORD_LIST.en.压制]
  },
  {
    "id": "031",
    "name": "AC-150 HMG (D)",
    "score": 0,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "033",
    "name": "R-20 Shoulder-Mounted Railgun (R)",
    "score": 51,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.静止, KEYWORD_LIST.en.穿甲X]
  },
  {
    "id": "036",
    "name": "CC-4 Cleaver (R)",
    "score": 39,
    "structure": 0,
    "armor": 4,
    "parray": 1,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.频闪武器]
  },
  {
    "id": "038",
    "name": "ACX-350 Stratus Prototype HMG",
    "score": 48,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": -2,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "throwIndex": "039",
    "keywords": [KEYWORD_LIST.en.双手, KEYWORD_LIST.en.多目标X, KEYWORD_LIST.en.压制]
  },
  {
    "id": "039",
    "name": "ACX-350 Stratus Prototype HMG (D)",
    "score": 0,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "043",
    "name": "R-35 Heavy Railgun",
    "score": 54,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": -2,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "throwIndex": "044",
    "keywords": [KEYWORD_LIST.en.X姿态, KEYWORD_LIST.en.毁伤, KEYWORD_LIST.en.穿甲X]
  },
  {
    "id": "044",
    "name": "R-35 Heavy Railgun (D)",
    "score": 0,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "046",
    "name": "Type 55 Shield + PC-9 Shotgun (R)",
    "score": 48,
    "structure": 0,
    "armor": 5,
    "parray": 2,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "throwIndex": "047",
    "keywords": [KEYWORD_LIST.en.霰射]
  },
  {
    "id": "047",
    "name": "Type 55 Shield + PC-9 Shotgun (R) (D)",
    "score": 0,
    "structure": 0,
    "armor": 5,
    "parray": 2,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "048",
    "name": "Type 55 Shield + PC-9 Shotgun + Smoke Grenade (R)",
    "score": 57,
    "structure": 0,
    "armor": 5,
    "parray": 2,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "projectile": [
      "268"
    ],
    "throwIndex": "049",
    "keywords": [KEYWORD_LIST.en.直射, KEYWORD_LIST.en.霰射]
  },
  {
    "id": "049",
    "name": "Type 55 Shield + PC-9 Shotgun + Smoke Grenade (R) (D)",
    "score": 0,
    "structure": 0,
    "armor": 5,
    "parray": 2,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "projectile": [
      "268"
    ]
  },
  {
    "id": "051",
    "name": "L-320 SMMG + CC-90 Glaive",
    "score": 63,
    "structure": 0,
    "armor": 4,
    "parray": 1,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "throwIndex": "052",
    "keywords": [KEYWORD_LIST.en.拦截X, KEYWORD_LIST.en.双手, KEYWORD_LIST.en.毁伤, KEYWORD_LIST.en.频闪武器, KEYWORD_LIST.en.顺劈]
  },
  {
    "id": "052",
    "name": "L-320 SMMG + CC-90 Glaive (D)",
    "score": 0,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "055",
    "name": "CC-100 Hercules Meteor Hammer",
    "score": 48,
    "structure": 0,
    "armor": 4,
    "parray": 1,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.毁伤, KEYWORD_LIST.en.粉碎]
  },
  {
    "id": "058",
    "name": "AC-39 Tactical Rifle",
    "score": 45,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "throwIndex": "059",
    "keywords": [KEYWORD_LIST.en.双手]
  },
  {
    "id": "059",
    "name": "AC-39 Tactical Rifle (D)",
    "score": 0,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "063",
    "name": "Type 63 Arm Cannon + CC-20 Sabre (R)",
    "score": 66,
    "structure": 0,
    "armor": 4,
    "parray": 2,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.频闪武器]
  },
  {
    "id": "068",
    "name": "AC-161 SMG",
    "score": 45,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "throwIndex": "069",
    "keywords": [KEYWORD_LIST.en.双手, KEYWORD_LIST.en.静止]
  },
  {
    "id": "069",
    "name": "AC-161 SMG (D)",
    "score": 0,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "254",
    "name": "L-320 SMMG + CC-90 Glaive (Early Model)",
    "score": 63,
    "structure": 0,
    "armor": 4,
    "parray": 1,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "throwIndex": "255",
    "keywords": [KEYWORD_LIST.en.拦截X, KEYWORD_LIST.en.双手, KEYWORD_LIST.en.毁伤, KEYWORD_LIST.en.频闪武器, KEYWORD_LIST.en.顺劈]
  },
  {
    "id": "255",
    "name": "L-320 SMMG + CC-90 Glaive (Early Model) (D)",
    "score": 0,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "284",
    "name": "L-330 SMMG + CC-85 Rock Saw",
    "score": 57,
    "structure": 0,
    "armor": 4,
    "parray": 1,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "throwIndex": "285",
    "keywords": [KEYWORD_LIST.en.拦截X, KEYWORD_LIST.en.双手, KEYWORD_LIST.en.毁伤, KEYWORD_LIST.en.震撼]
  },
  {
    "id": "285",
    "name": "L-330 SMMG + CC-85 Rock Saw(D)",
    "score": 0,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "508",
    "name": "Type 55 Shield + PC-9K Shotgun (R)",
    "score": 63,
    "structure": 0,
    "armor": 5,
    "parray": 2,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "throwIndex": "509",
    "keywords": [KEYWORD_LIST.en.击退X, KEYWORD_LIST.en.霰射]
  },
  {
    "id": "509",
    "name": "Type 55 Shield + PC-9K Shotgun (R) (D)",
    "score": 0,
    "structure": 0,
    "armor": 5,
    "parray": 2,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "512",
    "name": "AH-21 Pistol + CC-50 Pile Bunker (R) (D)",
    "score": 63,
    "structure": 0,
    "armor": 4,
    "parray": 1,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "throwIndex": "513",
    "keywords": [KEYWORD_LIST.en.全向射击]
  },
  {
    "id": "513",
    "name": "AH-21 Pistol + CC-50 Pile Bunker (R) (D)",
    "score": 0,
    "structure": 0,
    "armor": 4,
    "parray": 1,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "516",
    "name": "AC-35 Sniper Rifle",
    "score": 51,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "throwIndex": "517",
    "keywords": [KEYWORD_LIST.en.双手, KEYWORD_LIST.en.狙击]
  },
  {
    "id": "517",
    "name": "AC-35 Sniper Rifle (D)",
    "score": 0,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "518",
    "name": "AC-32C Auto Rifle",
    "score": 36,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "throwIndex": "519",
    "keywords": [KEYWORD_LIST.en.双手, KEYWORD_LIST.en.霰射, KEYWORD_LIST.en.近战射击]
  },
  {
    "id": "519",
    "name": "AC-32C Auto Rifle (D)",
    "score": 0,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  }
];

export const rdlBackpack: Part[] = [
  {
    "id": "001",
    "name": "SH-15 Field Repair System",
    "score": 30,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 2,
    "electronic": 0,
    "type": "backpack",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.修补]
  },
  {
    "id": "002",
    "name": "ECS-2 External Cooler",
    "score": 33,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 1,
    "electronic": 0,
    "type": "backpack",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.X姿态]
  },
  {
    "id": "003",
    "name": "AMS-190 Active Defense System",
    "score": 27,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 0,
    "electronic": 1,
    "type": "backpack",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.拦截X]
  },
  {
    "id": "004",
    "name": "ML-34 Quad Missile Rack",
    "score": 39,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 1,
    "electronic": 0,
    "type": "backpack",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "projectile": [
      "071"
    ],
    "keywords": [KEYWORD_LIST.en.齐射X, KEYWORD_LIST.en.曲射]
  },
  {
    "id": "005",
    "name": "LGP-80 Artillery",
    "score": 33,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": -2,
    "electronic": 0,
    "type": "backpack",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.毁伤]
  },
  {
    "id": "006",
    "name": "GLP-15 Mine Layer",
    "score": 30,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "backpack",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "projectile": [
      "074"
    ],
    "keywords": [KEYWORD_LIST.en.直射, KEYWORD_LIST.en.静默]
  },
  {
    "id": "007",
    "name": "MUD-1 Muck ECM Backpack",
    "score": 33,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 1,
    "electronic": 1,
    "type": "backpack",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.高亮目标]
  },
  {
    "id": "008",
    "name": "CP-3 Beacon Backpack",
    "score": 36,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "backpack",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "projectile": [
      "075",
      "076",
      "077"
    ],
    "keywords": [KEYWORD_LIST.en.直射, KEYWORD_LIST.en.静默, KEYWORD_LIST.en.投掷]
  },
  {
    "id": "009",
    "name": "MUE/N-20 Echoes Support Backpack",
    "score": 30,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "backpack",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.电子支援]
  },
  {
    "id": "010",
    "name": "TB-600 Jetpack",
    "score": 48,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 2,
    "electronic": 0,
    "type": "backpack",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.空中移动]
  },
  {
    "id": "011",
    "name": "ML-92 Dual Missile Rack",
    "score": 20,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "backpack",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "projectile": [
      "073"
    ],
    "keywords": [KEYWORD_LIST.en.齐射X, KEYWORD_LIST.en.曲射]
  },
  {
    "id": "264",
    "name": "AMS-192 Active Defense System",
    "score": 27,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 0,
    "electronic": 1,
    "type": "backpack",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.拦截X]
  },
  {
    "id": "286",
    "name": "AMS-193 Active Defense System",
    "score": 27,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 0,
    "electronic": 1,
    "type": "backpack",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.拦截X]
  },
  {
    "id": "501",
    "name": "ML-94 Quad Missile Rack",
    "score": 48,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "backpack",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "projectile": [
      "521"
    ],
    "keywords": [KEYWORD_LIST.en.齐射X, KEYWORD_LIST.en.曲射]
  },
  {
    "id": "502",
    "name": "CP-4 Drone Backpack",
    "score": 36,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "backpack",
    "description": "",
    "imgSrc": "",
    "tags": [], "projectile": [
      "522"
    ],
    "keywords": [KEYWORD_LIST.en.曲射, KEYWORD_LIST.en.静默, KEYWORD_LIST.en.投掷]
  }
];

export const rdlDrones: Drone[] = [
  {
    "id": "078",
    "name": "DTG-30M Hyena MG Type",
    "score": 42,
    "structure": 2,
    "armor": 5,
    "parray": 0,
    "dodge": 0,
    "electronic": 2,
    "type": "medium",
    "move": 0,
    "stance": "offensive",
    "description": "",
    "keywords": [KEYWORD_LIST.en.拦截X, KEYWORD_LIST.en.全向射击, KEYWORD_LIST.en.近战射击]
  },
  {
    "id": "079",
    "name": "DTG-30S Hyena Missile Type",
    "score": 33,
    "structure": 2,
    "armor": 5,
    "parray": 0,
    "dodge": 0,
    "electronic": 2,
    "type": "medium",
    "move": 0,
    "stance": "offensive",
    "description": "",
    "projectile": [
      "071"
    ],
    "keywords": [KEYWORD_LIST.en.齐射X, KEYWORD_LIST.en.曲射]
  },
  {
    "id": "080",
    "name": "DTG-30R Hyena Radar Type",
    "score": 27,
    "structure": 2,
    "armor": 5,
    "parray": 0,
    "dodge": 0,
    "electronic": 2,
    "type": "medium",
    "move": 0,
    "stance": "offensive",
    "description": "",
  },
  {
    "id": "522",
    "name": "MD-1 Dragonfly Micro Scout",
    "score": 0,
    "structure": 0,
    "armor": 2,
    "parray": 0,
    "dodge": 2,
    "electronic": 3,
    "type": "small",
    "move": 0,
    "stance": "offensive",
    "description": ""
  }
];

export const unTorso: Part[] = [
  {
    "id": "091",
    "name": "TM31C Gray Wolf Battle Core",
    "score": 45,
    "structure": 4,
    "armor": 4,
    "parray": 0,
    "dodge": 1,
    "electronic": 3,
    "type": "torso",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "projectile": [
      "155"
    ],
    "keywords": [KEYWORD_LIST.en.曲射]
  },
  {
    "id": "092",
    "name": "TM31R Caracal Battle Core",
    "score": 54,
    "structure": 4,
    "armor": 4,
    "parray": 0,
    "dodge": 1,
    "electronic": 4,
    "type": "torso",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "094",
    "name": "TM39 Viper Low Profile Core",
    "score": 63,
    "structure": 3,
    "armor": 3,
    "parray": 0,
    "dodge": 1,
    "electronic": 5,
    "type": "torso",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.低特征, KEYWORD_LIST.en.静默]
  },
  {
    "id": "096",
    "name": "TM641 Octopus Stealth Core",
    "score": 81,
    "structure": 3,
    "armor": 3,
    "parray": 0,
    "dodge": 1,
    "electronic": 5,
    "type": "torso",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.低特征, KEYWORD_LIST.en.静默, KEYWORD_LIST.en.隐秘X]
  },
  {
    "id": "097",
    "name": "TM35N Alligator Electronic Warfare Core",
    "score": 72,
    "structure": 4,
    "armor": 5,
    "parray": 0,
    "dodge": 1,
    "electronic": 4,
    "type": "torso",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.KC装甲, KEYWORD_LIST.en.电子攻击, KEYWORD_LIST.en.静默, KEYWORD_LIST.en.禁足]
  },
  {
    "id": "098",
    "name": "TM35B Bison Assault Core",
    "score": 72,
    "structure": 4,
    "armor": 5,
    "parray": 0,
    "dodge": 1,
    "electronic": 4,
    "type": "torso",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.KC装甲, KEYWORD_LIST.en.高亮目标]
  }, {
    "id": "247",
    "name": "TM641 Octopus Stealth Core Trial Model",
    "score": 81,
    "structure": 3,
    "armor": 3,
    "parray": 0,
    "dodge": 1,
    "electronic": 5,
    "type": "torso",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.低特征, KEYWORD_LIST.en.静默, KEYWORD_LIST.en.隐秘X]
  },
  {
    "id": "555",
    "name": "TM35BT Taurus Experimental Core",
    "score": 84,
    "armor": 5,
    "structure": 4,
    "parray": 0,
    "dodge": 1,
    "electronic": 4,
    "type": "torso",
    "imgSrc": "",
    "description": "",
    "tags": []
  }
];

export const unChasis: Part[] = [
  {
    "id": "099",
    "name": "LM231  Standard Chassis",
    "score": 27,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 4,
    "electronic": 0,
    "type": "chasis",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "100",
    "name": "LM210S  Stealth Chassis",
    "score": 39,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 4,
    "electronic": 0,
    "type": "chasis",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.静默]
  }, {
    "id": "250",
    "name": "LM210S  Stealth Chassis -Trial Mode",
    "score": 39,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 4,
    "electronic": 0,
    "type": "chasis",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.静默]
  },
  {
    "id": "101",
    "name": "LM213B  Combat Chassis",
    "score": 57,
    "structure": 1,
    "armor": 4,
    "parray": 0,
    "dodge": 4,
    "electronic": 0,
    "type": "chasis",
    "description": "",
    "imgSrc": "",
    "tags": []
  }
];

export const unLeftHand: Part[] = [
  {
    "id": "103",
    "name": "S9 Meteor Shield + M5 Pile Bunker",
    "score": 57,
    "structure": 0,
    "armor": 4,
    "parray": 2,
    "dodge": 1,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.震撼, KEYWORD_LIST.en.毁伤]
  },
  {
    "id": "107",
    "name": "S100 Shield + Grenade Pod",
    "score": 66,
    "structure": 0,
    "armor": 5,
    "parray": 2,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "projectile": [
      "154"
    ],
    "throwIndex": "108",
    "keywords": [KEYWORD_LIST.en.齐射X, KEYWORD_LIST.en.曲射]
  },
  {
    "id": "108",
    "name": "S100 Shield + Grenade Pod (D)",
    "score": 0,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "projectile": [
      "154"
    ]
  },
  {
    "id": "111",
    "name": "RH21 Pistol + M3 Vibroblade (L)",
    "score": 45,
    "structure": 0,
    "armor": 3,
    "parray": 1,
    "dodge": 1,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "throwIndex": "112",
    "keywords": [KEYWORD_LIST.en.全向射击]
  },
  {
    "id": "112",
    "name": "RH21 Pistol + M3 Vibroblade (L) (D)",
    "score": 0,
    "structure": 0,
    "armor": 3,
    "parray": 1,
    "dodge": 1,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "117",
    "name": "MDXS Fairy System + R6 SMG (L)",
    "score": 45,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 2,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "throwIndex": "118",
    "keywords": [KEYWORD_LIST.en.激光武器, KEYWORD_LIST.en.静止]
  },
  {
    "id": "118",
    "name": "MDXS Fairy System + R6 SMG (L) (D)",
    "score": 0,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 2,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "121",
    "name": "MSH1 Assistance Arm (L)",
    "score": 24,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.双手]
  },
  {
    "id": "126",
    "name": "K9 Nail Gun + M14BO Wakizashi",
    "score": 42,
    "structure": 0,
    "armor": 3,
    "parray": 1,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.静默]
  }, {
    "id": "256",
    "name": "K9 Nail Gun + M14BO Wakizashi Trial Model (L)",
    "score": 42,
    "structure": 0,
    "armor": 3,
    "parray": 1,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.静默]

  },
  {
    "id": "129",
    "name": "RKG70  Missile Pod",
    "score": 42,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "projectile": [
      "157"
    ],
    "throwIndex": "130",
    "keywords": [KEYWORD_LIST.en.直射, KEYWORD_LIST.en.双手]
  },
  {
    "id": "130",
    "name": "RKG70  Missile Pod (D)",
    "score": 0,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "131",
    "name": "M3S Vibroblade(L)",
    "score": 42,
    "structure": 0,
    "armor": 3,
    "parray": 1,
    "dodge": 1,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "135",
    "name": "M4 Vibroblade + Grenade Pod (L)",
    "score": 54,
    "structure": 0,
    "armor": 3,
    "parray": 1,
    "dodge": 1,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "projectile": [
      "154"
    ],
    "keywords": [KEYWORD_LIST.en.齐射X, KEYWORD_LIST.en.曲射]
  },
  {
    "id": "139",
    "name": "MX82 Multifunctional Whip",
    "score": 48,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 1,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.拖拽, KEYWORD_LIST.en.禁足]
  },
  {
    "id": "142",
    "name": "S100 Shield",
    "score": 48,
    "structure": 0,
    "armor": 5,
    "parray": 2,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "throwIndex": "143"
  },
  {
    "id": "143",
    "name": "S100 Shield (D)",
    "score": 0,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "144",
    "name": "K7 Nail Gun + S10 Shield",
    "score": 54,
    "structure": 0,
    "armor": 5,
    "parray": 2,
    "dodge": 0,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.静默, KEYWORD_LIST.en.X姿态]
  },
  {
    "id": "146",
    "name": "G6 Shotgun + Grenade Pod",
    "score": 75,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 1,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "projectile": [
      "154"
    ],
    "throwIndex": "147",
    "keywords": [KEYWORD_LIST.en.霰射, KEYWORD_LIST.en.激光武器, KEYWORD_LIST.en.近战射击, KEYWORD_LIST.en.齐射X, KEYWORD_LIST.en.曲射]
  },
  {
    "id": "147",
    "name": "G6 Shotgun + Grenade Pod (D)",
    "score": 0,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 1,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "projectile": [
      "154"
    ]
  },
  {
    "id": "150",
    "name": "RHX23 Rainstorm Assault Pistol (L)",
    "score": 57,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 2,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "throwIndex": "151",
    "keywords": [KEYWORD_LIST.en.全向射击, KEYWORD_LIST.en.压制]
  },
  {
    "id": "151",
    "name": "RHX23 Rainstorm Assault Pistol (L) (D)",
    "score": 0,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 2,
    "electronic": 0,
    "type": "leftHand",
    "description": "",
    "imgSrc": "",
    "tags": []
  }
];

export const unRightHand: Part[] = [{
  "id": "257",
  "name": "K9 Nail Gun + M14BO Wakizashi Trial Model (L)",
  "score": 42,
  "structure": 0,
  "armor": 3,
  "parray": 1,
  "dodge": 0,
  "electronic": 0,
  "type": "rightHand",
  "description": "",
  "imgSrc": "",
  "tags": [],
    "keywords": [KEYWORD_LIST.en.静默]
},
{
  "id": "104",
  "name": "R7 Automatic Rifle",
  "score": 42,
  "structure": 0,
  "armor": 3,
  "parray": 0,
  "dodge": 0,
  "electronic": 0,
  "type": "rightHand",
  "description": "",
  "imgSrc": "",
  "tags": [],
  "throwIndex": "105",
    "keywords": [KEYWORD_LIST.en.激光武器, KEYWORD_LIST.en.双手]
},
{
  "id": "105",
  "name": "R7 Automatic Rifle (D)",
  "score": 0,
  "structure": 0,
  "armor": 3,
  "parray": 0,
  "dodge": 0,
  "electronic": 0,
  "type": "rightHand",
  "description": "",
  "imgSrc": "",
  "tags": []
},
{
  "id": "106",
  "name": "R33 Sniper Rifle",
  "score": 39,
  "structure": 0,
  "armor": 3,
  "parray": 0,
  "dodge": 0,
  "electronic": 0,
  "type": "rightHand",
  "description": "",
  "imgSrc": "",
  "tags": [],
    "keywords": [KEYWORD_LIST.en.激光武器, KEYWORD_LIST.en.静止, KEYWORD_LIST.en.狙击]
},
{
  "id": "109",
  "name": "R6 SMG",
  "score": 54,
  "structure": 0,
  "armor": 3,
  "parray": 0,
  "dodge": 1,
  "electronic": 0,
  "type": "rightHand",
  "description": "",
  "imgSrc": "",
  "tags": [],
    "keywords": [KEYWORD_LIST.en.激光武器, KEYWORD_LIST.en.双手, KEYWORD_LIST.en.静止]
},
{
  "id": "110",
  "name": "R6 SMG (D)",
  "score": 0,
  "structure": 0,
  "armor": 3,
  "parray": 0,
  "dodge": 1,
  "electronic": 0,
  "type": "rightHand",
  "description": "",
  "imgSrc": "",
  "tags": []
},
{
  "id": "113",
  "name": "RH21 Pistol + M3 Vibroblade (R)",
  "score": 45,
  "structure": 0,
  "armor": 3,
  "parray": 1,
  "dodge": 1,
  "electronic": 0,
  "type": "rightHand",
  "description": "",
  "imgSrc": "",
  "tags": [],
  "throwIndex": "114",
    "keywords": [KEYWORD_LIST.en.全向射击]
},
{
  "id": "114",
  "name": "RH21 Pistol + M3 Vibroblade (R) (D)",
  "score": 0,
  "structure": 0,
  "armor": 3,
  "parray": 1,
  "dodge": 1,
  "electronic": 0,
  "type": "rightHand",
  "description": "",
  "imgSrc": "",
  "tags": []
},
{
  "id": "115",
  "name": "S100 Shield + R6SS SMG",
  "score": 63,
  "structure": 0,
  "armor": 5,
  "parray": 2,
  "dodge": 0,
  "electronic": 0,
  "type": "rightHand",
  "description": "",
  "imgSrc": "",
  "tags": [],
  "throwIndex": "116",
    "keywords": [KEYWORD_LIST.en.激光武器, KEYWORD_LIST.en.静止]
},
{
  "id": "116",
  "name": "S100 Shield + R6SS SMG (D)",
  "score": 0,
  "structure": 0,
  "armor": 4,
  "parray": 0,
  "dodge": 0,
  "electronic": 0,
  "type": "rightHand",
  "description": "",
  "imgSrc": "",
  "tags": []
},
{
  "id": "119",
  "name": "MDXS Fairy System + R6 SMG (R)",
  "score": 45,
  "structure": 0,
  "armor": 3,
  "parray": 0,
  "dodge": 2,
  "electronic": 0,
  "type": "rightHand",
  "description": "",
  "imgSrc": "",
  "tags": [],
  "throwIndex": "120",
    "keywords": [KEYWORD_LIST.en.激光武器, KEYWORD_LIST.en.静止]
},
{
  "id": "120",
  "name": "MDXS Fairy System + R6 SMG (R) (D)",
  "score": 0,
  "structure": 0,
  "armor": 3,
  "parray": 0,
  "dodge": 2,
  "electronic": 0,
  "type": "rightHand",
  "description": "",
  "imgSrc": "",
  "tags": []
},
{
  "id": "122",
  "name": "IGX920 Heavy Ion Gun",
  "score": 60,
  "structure": 0,
  "armor": 4,
  "parray": 0,
  "dodge": -2,
  "electronic": 0,
  "type": "rightHand",
  "description": "",
  "imgSrc": "",
  "tags": [],
  "throwIndex": "123",
    "keywords": [KEYWORD_LIST.en.双手, KEYWORD_LIST.en.狙击, KEYWORD_LIST.en.充能, KEYWORD_LIST.en.毁伤, KEYWORD_LIST.en.离子武器]
},
{
  "id": "123",
  "name": "IGX920 Heavy Ion Gun (D)",
  "score": 0,
  "structure": 0,
  "armor": 4,
  "parray": 0,
  "dodge": 0,
  "electronic": 0,
  "type": "rightHand",
  "description": "",
  "imgSrc": "",
  "tags": []
},
{
  "id": "124",
  "name": "R6SD SMG",
  "score": 60,
  "structure": 0,
  "armor": 3,
  "parray": 0,
  "dodge": 1,
  "electronic": 0,
  "type": "rightHand",
  "description": "",
  "imgSrc": "",
  "tags": [],
  "throwIndex": "125",
    "keywords": [KEYWORD_LIST.en.静默, KEYWORD_LIST.en.激光武器, KEYWORD_LIST.en.双手]
},
{
  "id": "125",
  "name": "R6SD SMG (D)",
  "score": 0,
  "structure": 0,
  "armor": 3,
  "parray": 0,
  "dodge": 1,
  "electronic": 0,
  "type": "rightHand",
  "description": "",
  "imgSrc": "",
  "tags": []
},
{
  "id": "127",
  "name": "R9B Tactical Rifle",
  "score": 48,
  "structure": 0,
  "armor": 3,
  "parray": 0,
  "dodge": 0,
  "electronic": 0,
  "type": "rightHand",
  "description": "",
  "imgSrc": "",
  "tags": [],
  "throwIndex": "128",
    "keywords": [KEYWORD_LIST.en.静默, KEYWORD_LIST.en.激光武器, KEYWORD_LIST.en.双手]
},
{
  "id": "128",
  "name": "R9B Tactical Rifle (D)",
  "score": 0,
  "structure": 0,
  "armor": 3,
  "parray": 0,
  "dodge": 0,
  "electronic": 0,
  "type": "rightHand",
  "description": "",
  "imgSrc": "",
  "tags": []
},
{
  "id": "133",
  "name": "M3S Vibroblade (R)",
  "score": 42,
  "structure": 0,
  "armor": 3,
  "parray": 1,
  "dodge": 1,
  "electronic": 0,
  "type": "rightHand",
  "description": "",
  "imgSrc": "",
  "tags": []
},
{
  "id": "137",
  "name": "M4 Vibroblade + Grenade Pod (R)",
  "score": 54,
  "structure": 0,
  "armor": 3,
  "parray": 1,
  "dodge": 1,
  "electronic": 0,
  "type": "rightHand",
  "description": "",
  "imgSrc": "",
  "tags": [],
  "projectile": [
    "154"
  ],
    "keywords": [KEYWORD_LIST.en.齐射X, KEYWORD_LIST.en.曲射]
},
{
  "id": "140",
  "name": "IGX350 Ion Shotgun",
  "score": 45,
  "structure": 0,
  "armor": 4,
  "parray": 0,
  "dodge": 0,
  "electronic": 0,
  "type": "rightHand",
  "description": "",
  "imgSrc": "",
  "tags": [],
  "throwIndex": "141",
    "keywords": [KEYWORD_LIST.en.充能, KEYWORD_LIST.en.毁伤, KEYWORD_LIST.en.霰射, KEYWORD_LIST.en.离子武器, KEYWORD_LIST.en.近战射击]
},
{
  "id": "141",
  "name": "IGX350 Ion Shotgun (D)",
  "score": 0,
  "structure": 0,
  "armor": 4,
  "parray": 0,
  "dodge": 0,
  "electronic": 0,
  "type": "rightHand",
  "description": "",
  "imgSrc": "",
  "tags": []
},
{
  "id": "145",
  "name": "M15BO Katana",
  "score": 81,
  "structure": 0,
  "armor": 4,
  "parray": 2,
  "dodge": 2,
  "electronic": 0,
  "type": "rightHand",
  "description": "",
  "imgSrc": "",
  "tags": [],
    "keywords": [KEYWORD_LIST.en.双手, KEYWORD_LIST.en.毁伤]
},
{
  "id": "148",
  "name": "G6 Shotgun + M5 Pile Bunker",
  "score": 69,
  "structure": 0,
  "armor": 4,
  "parray": 0,
  "dodge": 1,
  "electronic": 0,
  "type": "rightHand",
  "description": "",
  "imgSrc": "",
  "tags": [],
  "throwIndex": "149",
    "keywords": [KEYWORD_LIST.en.霰射, KEYWORD_LIST.en.激光武器, KEYWORD_LIST.en.近战射击, KEYWORD_LIST.en.毁伤]
},
{
  "id": "149",
  "name": "G6 Shotgun + M5 Pile Bunker (D)",
  "score": 0,
  "structure": 0,
  "armor": 4,
  "parray": 0,
  "dodge": 1,
  "electronic": 0,
  "type": "rightHand",
  "description": "",
  "imgSrc": "",
  "tags": []
},
{
  "id": "152",
  "name": "RHX23 Rainstorm Assault Pistol (R)",
  "score": 57,
  "structure": 0,
  "armor": 3,
  "parray": 0,
  "dodge": 2,
  "electronic": 0,
  "type": "rightHand",
  "description": "",
  "imgSrc": "",
  "tags": [],
  "throwIndex": "153",
    "keywords": [KEYWORD_LIST.en.全向射击, KEYWORD_LIST.en.压制]
},
{
  "id": "153",
  "name": "RHX23 Rainstorm Assault Pistol (R) (D)",
  "score": 0,
  "structure": 0,
  "armor": 3,
  "parray": 0,
  "dodge": 2,
  "electronic": 0,
  "type": "rightHand",
  "description": "",
  "imgSrc": "",
  "tags": []
},
{
    "id": "556",
    "name": "R7MG LMG",
    "score": 50,
    "armor": 3,
    "structure": 0,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "imgSrc": "",
    "tags": [],
    "description": "",
    "throwIndex":"557"
  },
  {
    "id": "557",
    "name": "R7MG LMG (D)",
    "score": 0,
    "armor": 3,
    "structure": 0,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "rightHand",
    "imgSrc": "",
    "description": "",
    "tags": []
  }
];

export const unBackpack: Part[] = [
  {
    "id": "081",
    "name": "EBS/X40 Armor Energy Charger",
    "score": 39,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 2,
    "electronic": 0,
    "type": "backpack",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.KC装甲]
  }, {
    "id": "265",
    "name": "EBS/X40 Armor Energy Charger Trial Model",
    "score": 39,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 2,
    "electronic": 0,
    "type": "backpack",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.KC装甲]
  },
  {
    "id": "082",
    "name": "GSD2A Pholcus Mine Rack",
    "score": 21,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "backpack",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "projectile": [
      "156"
    ],
    "keywords": [KEYWORD_LIST.en.曲射, KEYWORD_LIST.en.投掷, KEYWORD_LIST.en.静默]
  },
  {
    "id": "083",
    "name": "CSC60 Cooler",
    "score": 27,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 1,
    "electronic": 0,
    "type": "backpack",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.激光武器]
  },
  {
    "id": "084",
    "name": "DBP Turtle Shell Barricade Rack",
    "score": 39,
    "structure": 0,
    "armor": 5,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "backpack",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "projectile": [
      "158"
    ]
  },
  {
    "id": "085",
    "name": "AMDS210 Delphinium Carrier",
    "score": 30,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "backpack",
    "description": "",
    "imgSrc": "",
    "tags": []
  },
  {
    "id": "086",
    "name": "RKG70 Ammunition Pack",
    "score": 21,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "backpack",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "projectile": [
      "157"
    ]
  },
  {
    "id": "087",
    "name": "MSH2 Stabilizer Arm",
    "score": 24,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "type": "backpack",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.全向射击]
  },
  {
    "id": "088",
    "name": "JP1 Jetpack",
    "score": 57,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 2,
    "electronic": 0,
    "type": "backpack",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.空中移动, KEYWORD_LIST.en.负载]
  },
  {
    "id": "089",
    "name": "EC50 Electronic Warfare Pod",
    "score": 42,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 1,
    "electronic": 1,
    "type": "backpack",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.电子攻击, KEYWORD_LIST.en.火控干扰]
  },
  {
    "id": "090",
    "name": "OCSP Overloading Pack",
    "score": 49,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 2,
    "electronic": 0,
    "type": "backpack",
    "description": "",
    "imgSrc": "",
    "tags": [],
    "keywords": [KEYWORD_LIST.en.负载]
  }
];

export const unDrones: Drone[] = [
  {
    "id": "159",
    "name": "AMDS210 Delphinium Automatic Defense System",
    "score": 0,
    "structure": 0,
    "armor": 2,
    "parray": 0,
    "dodge": 0,
    "electronic": 2,
    "type": "small",
    "move": 0,
    "stance": "offensive",
    "description": ""
  },
  {
    "id": "160",
    "name": "ADK15D Porcupine CIWS Type",
    "score": 48,
    "structure": 2,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 2,
    "type": "medium",
    "move": 0,
    "stance": "offensive",
    "description": "",
    "keywords": [KEYWORD_LIST.en.激光武器,KEYWORD_LIST.en.拦截X,KEYWORD_LIST.en.全向射击,KEYWORD_LIST.en.近战射击]
  },
  {
    "id": "161",
    "name": "ADK15/MAS Porcupine Microwave Type",
    "score": 30,
    "structure": 2,
    "armor": 4,
    "parray": 0,
    "dodge": 0,
    "electronic": 2,
    "type": "medium",
    "move": 0,
    "stance": "offensive",
    "description": ""
  },
  {
    "id": "162",
    "name": "ADK30C Tarantula Carrier Type",
    "score": 12,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 5,
    "electronic": 2,
    "type": "medium",
    "move": 0,
    "stance": "offensive",
    "description": "",
    "keywords": [KEYWORD_LIST.en.负载]
  },
  {
    "id": "163",
    "name": "ADK30F Tarantula Firepower Type",
    "score": 33,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 5,
    "electronic": 2,
    "type": "small",
    "move": 0,
    "stance": "offensive",
    "description": "",
    "keywords": [KEYWORD_LIST.en.激光武器,KEYWORD_LIST.en.拦截X,KEYWORD_LIST.en.全向射击,KEYWORD_LIST.en.近战射击]
  },
  {
    "id": "164",
    "name": "ADK60R Raven Scout Type",
    "score": 33,
    "structure": 0,
    "armor": 1,
    "parray": 0,
    "dodge": 7,
    "electronic": 3,
    "type": "medium",
    "move": 0,
    "stance": "offensive",
    "description": ""
  },
  {
    "id": "165",
    "name": "ADK60EC Raven EC Type",
    "score": 33,
    "structure": 0,
    "armor": 1,
    "parray": 0,
    "dodge": 7,
    "electronic": 3,
    "type": "medium",
    "move": 0,
    "stance": "offensive",
    "description": "",
    "keywords": [KEYWORD_LIST.en.中继器]
  },
  {
    "id": "166",
    "name": "ADK60S Raven Interference Type",
    "score": 51,
    "structure": 0,
    "armor": 1,
    "parray": 0,
    "dodge": 7,
    "electronic": 3,
    "type": "medium",
    "move": 0,
    "stance": "offensive",
    "description": "",
    "keywords": [KEYWORD_LIST.en.电子攻击,KEYWORD_LIST.en.火控干扰]
  },
  {
    "id": "167",
    "name": "SGM-2 Pholcus Automatic Mine (Unfolded)",
    "score": 0,
    "structure": 0,
    "armor": 0,
    "parray": 0,
    "dodge": 2,
    "electronic": 2,
    "type": "small",
    "move": 0,
    "stance": "offensive",
    "description": ""
  }
];

export const pdDrones: Drone[] = [
  {
    "id": "PRDR-101",
    "name": "MD-4A Reaper Type I",
    "type": "large",
    "score": 90,
    "structure": 4,
    "armor": 5,
    "parray": 0,
    "dodge": 0,
    "electronic": 3,
    "move": 6,
    "stance": "defensive",
    "description": "",
    "isPD": true, "projectile": [
      "PDAM-001"
    ],
    "keywords": [KEYWORD_LIST.en.齐射X, KEYWORD_LIST.en.曲射, KEYWORD_LIST.en.拦截X]
  },
  {
    "id": "PRDR-102",
    "name": "MD-4C Reaper Type III",
    "type": "large",
    "score": 99,
    "structure": 4,
    "armor": 5,
    "parray": 0,
    "dodge": 0,
    "electronic": 3,
    "move": 6,
    "stance": "defensive",
    "description": "",
    "isPD": true, "projectile": [
      "PDAM-001"
    ],
    "keywords": [KEYWORD_LIST.en.齐射X, KEYWORD_LIST.en.曲射, KEYWORD_LIST.en.火控干扰]
  },
  {
    "id": "PRDR-103",
    "name": "MD-4D Reaper Type IV",
    "type": "large",
    "score": 105,
    "structure": 5,
    "armor": 6,
    "parray": 0,
    "dodge": 0,
    "electronic": 3,
    "move": 6,
    "stance": "defensive",
    "description": "",
    "isPD": true
  },
  {
    "id": "PRDR-104",
    "name": "MD-4B Reaper Type II",
    "type": "large",
    "score": 114,
    "structure": 5,
    "armor": 6,
    "parray": 0,
    "dodge": 0,
    "electronic": 3,
    "move": 6,
    "stance": "defensive",
    "description": "",
    "isPD": true,
    "keywords": [KEYWORD_LIST.en.火控干扰]
  },
  {
    "id": "PRDR-105",
    "name": "MD-4E Reaper  Engineer Type",
    "type": "large",
    "score": 90,
    "structure": 4,
    "armor": 5,
    "parray": 0,
    "dodge": 0,
    "electronic": 3,
    "move": 6,
    "stance": "defensive",
    "description": "",
    "isPD": true, "projectile": [
      "PDAM-003", "PDAM-004"
    ],
    "keywords": [KEYWORD_LIST.en.直射]
  },
  {
    "id": "PRDR-201",
    "name": "LD-5A Vigilant Autocannon Type",
    "type": "medium",
    "score": 48,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 4,
    "electronic": 2,
    "move": 6,
    "stance": "mobility",
    "description": "",
    "isPD": true,
    "keywords": [KEYWORD_LIST.en.全向射击, KEYWORD_LIST.en.近战射击, KEYWORD_LIST.en.空中移动]
  },
  {
    "id": "PRDR-202",
    "name": "LD-5M Vigilant MG Type",
    "type": "medium",
    "score": 42,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 4,
    "electronic": 2,
    "move": 6,
    "stance": "mobility",
    "description": "",
    "isPD": true,
    "keywords": [KEYWORD_LIST.en.高亮目标, KEYWORD_LIST.en.空中移动, KEYWORD_LIST.en.全向射击, KEYWORD_LIST.en.近战射击]
  },
  {
    "id": "PRDR-203",
    "name": "LD-5B Vigilant Bombing Type",
    "type": "medium",
    "score": 45,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 4,
    "electronic": 2,
    "move": 6,
    "stance": "mobility",
    "description": "",
    "isPD": true, "projectile": [
      "PDAM-005"
    ],
    "keywords": [KEYWORD_LIST.en.空中移动, KEYWORD_LIST.en.曲射, KEYWORD_LIST.en.齐射X]
  },
  {
    "id": "PRDR-204",
    "name": "LD-5S Vigilant Support Type",
    "type": "medium",
    "score": 48,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 4,
    "electronic": 2,
    "move": 6,
    "stance": "mobility",
    "description": "",
    "isPD": true, "projectile": [
      "PDAM-005", "PDAM-006"
    ],
    "keywords": [KEYWORD_LIST.en.曲射, KEYWORD_LIST.en.齐射X, KEYWORD_LIST.en.直射]
  }
];

export const rdlPilots: Pilot[] = [
  {
    "id": "FPA-01",
    "name": " Misty",
    "score": 15,
    "LV": 4,
    "faction": "RDL",
    "swift": 7,
    "melee": 4,
    "projectile": 5,
    "firing": 3,
    "moving": 3,
    "tactic": 2,
    "trait": " Variation",
    "traitDescription": " · In Tactical Timing, may perform Starting Action from any timing."
  },
  {
    "id": "FPA-02",
    "name": " Spike",
    "score": 15,
    "LV": 4,
    "faction": "RDL",
    "swift": 3,
    "melee": 7,
    "projectile": 6,
    "firing": 2,
    "moving": 5,
    "tactic": 5,
    "trait": " Eagle-eye",
    "traitDescription": " · When performing Firing Action, gain Armor Piercing 1."
  },
  {
    "id": "FPA-03",
    "name": "Wu",
    "score": 12,
    "LV": 4,
    "faction": "RDL",
    "swift": 6,
    "melee": 2,
    "projectile": 3,
    "firing": 7,
    "moving": 4,
    "tactic": 4,
    "trait": "Fortitude",
    "traitDescription": "· Piloted Mech does not suffer reduced Link when a part is destroyed."
  },
  {
    "id": "FPA-04",
    "name": "Hammerhead",
    "score": 10,
    "LV": 4,
    "faction": "RDL",
    "swift": 4,
    "melee": 3,
    "projectile": 2,
    "firing": 5,
    "moving": 2,
    "tactic": 6,
    "trait": "Onslaught",
    "traitDescription": "· [Offensive Stance] Melee Action may exchange {Eye} for {Light Hit}."
  },
  {
    "id": "FPA-05",
    "name": "Anser",
    "score": 15,
    "LV": 4,
    "faction": "RDL",
    "swift": 5,
    "melee": 6,
    "projectile": 9,
    "firing": 3,
    "moving": 8,
    "tactic": 4,
    "trait": "Inexhaustible",
    "traitDescription": "· If the Chassis of the piloted mech has no Structure Value, consider as having 2 Structure Value."
  },
  {
    "id": "FPA-06",
    "name": "KeyHole",
    "score": 12,
    "LV": 4,
    "faction": "RDL",
    "swift": 2,
    "melee": 5,
    "projectile": 4,
    "firing": 6,
    "moving": 6,
    "tactic": 7,
    "trait": "Amplify",
    "traitDescription": "· Range of Aura, Electronic Attack and Electronic Support of the piloted mech +1 grid."
  },
  {
    "id": "FPA-09",
    "name": "Shock Troop-09",
    "score": 6,
    "LV": 4,
    "faction": "RDL",
    "swift": 6,
    "melee": 2,
    "projectile": 3,
    "firing": 7,
    "moving": 4,
    "tactic": 4,
    "trait": "",
    "traitDescription": "A new Shock Troop from Test and Evaluation Squadron 066"
  },
  {
    "id": "FPA-10",
    "name": "Shock Troop-10",
    "score": 6,
    "LV": 4,
    "faction": "RDL",
    "swift": 6,
    "melee": 2,
    "projectile": 3,
    "firing": 7,
    "moving": 4,
    "tactic": 4,
    "trait": "",
    "traitDescription": "A new Shock Troop from Test and Evaluation Squadron 066"
  },
  {
    "id": "FPA-11",
    "name": "Shock Troop-11",
    "score": 6,
    "LV": 4,
    "faction": "RDL",
    "swift": 6,
    "melee": 2,
    "projectile": 3,
    "firing": 7,
    "moving": 4,
    "tactic": 4,
    "trait": "",
    "traitDescription": "A new Shock Troop from Test and Evaluation Squadron 066"
  },
  {
    "id": "FPA-12",
    "name": "Shock Troop-12",
    "score": 6,
    "LV": 4,
    "faction": "RDL",
    "swift": 6,
    "melee": 2,
    "projectile": 3,
    "firing": 7,
    "moving": 4,
    "tactic": 4,
    "trait": "",
    "traitDescription": "A new Shock Troop from Test and Evaluation Squadron 066"
  },
  {
    "id": "FPA-13",
    "name": "Shock Troop-13",
    "score": 6,
    "LV": 4,
    "faction": "RDL",
    "swift": 6,
    "melee": 2,
    "projectile": 3,
    "firing": 7,
    "moving": 4,
    "tactic": 4,
    "trait": "",
    "traitDescription": "A new Shock Troop from Test and Evaluation Squadron 066"
  },
  {
    "id": "FPA-14",
    "name": "Scout-14",
    "score": 9,
    "LV": 4,
    "faction": "RDL",
    "swift": 5,
    "melee": 6,
    "projectile": 7,
    "firing": 4,
    "moving": 7,
    "tactic": 3,
    "trait": "",
    "traitDescription": "A new Scout from Test and Evaluation Squadron 066"
  },
  {
    "id": "FPA-15",
    "name": "Scout-15",
    "score": 9,
    "LV": 4,
    "faction": "RDL",
    "swift": 5,
    "melee": 6,
    "projectile": 7,
    "firing": 4,
    "moving": 7,
    "tactic": 3,
    "trait": "",
    "traitDescription": "A new Scout from Test and Evaluation Squadron 066"
  },
  {
    "id": "FPA-16",
    "name": "Scout-16",
    "score": 9,
    "LV": 4,
    "faction": "RDL",
    "swift": 5,
    "melee": 6,
    "projectile": 7,
    "firing": 4,
    "moving": 7,
    "tactic": 3,
    "trait": "",
    "traitDescription": "A new Scout from Test and Evaluation Squadron 066"
  },
  {
    "id": "FPA-17",
    "name": "Scout-17",
    "score": 9,
    "LV": 4,
    "faction": "RDL",
    "swift": 5,
    "melee": 6,
    "projectile": 7,
    "firing": 4,
    "moving": 7,
    "tactic": 3,
    "trait": "",
    "traitDescription": "A new Scout from Test and Evaluation Squadron 066"
  },
  {
    "id": "FPA-18",
    "name": "Scout-18",
    "score": 9,
    "LV": 4,
    "faction": "RDL",
    "swift": 5,
    "melee": 6,
    "projectile": 7,
    "firing": 4,
    "moving": 7,
    "tactic": 3,
    "trait": "",
    "traitDescription": "A new Scout from Test and Evaluation Squadron 066"
  },
  {
    "id": "FPA-06-2",
    "name": "KeyHole",
    "score": 12,
    "LV": 4,
    "faction": "RDL",
    "swift": 2,
    "melee": 5,
    "projectile": 4,
    "firing": 6,
    "moving": 6,
    "tactic": 7,
    "trait": "Hidden",
    "traitDescription": "·When piloted Mech is within range of allied Aura, gains Low Profile."
  }
];

export const unPilots: Pilot[] = [
  {
    "id": "LPA-19",
    "name": "Quartz",
    "score": 24,
    "LV": 4,
    "faction": "UN",
    "swift": 2,
    "melee": 5,
    "projectile": 4,
    "firing": 4,
    "moving": 6,
    "tactic": 6,
    "trait": " Calm",
    "traitDescription": "Recover 1 Link at the end of each round"
  },
  {
    "id": "LPA-20",
    "name": "Panzer",
    "score": 15,
    "LV": 4,
    "faction": "UN",
    "swift": 3,
    "melee": 3,
    "projectile": 2,
    "firing": 5,
    "moving": 2,
    "tactic": 6,
    "trait": "Block",
    "traitDescription": " · When Breaking Away from piloted mech, the Enemy Unit needs to consume 1 additional Move Range or 1 Link."
  },
  {
    "id": "LPA-21",
    "name": "Firefly",
    "score": 18,
    "LV": 4,
    "faction": "UN",
    "swift": 3,
    "melee": 7,
    "projectile": 6,
    "firing": 1,
    "moving": 5,
    "tactic": 5,
    "trait": " Stealth",
    "traitDescription": " · Piloted Mech's movement route may pass through other units when Optical Camouflage is on or in Low Profile."
  },
  {
    "id": "LPA-22",
    "name": "Yoyu",
    "score": 21,
    "LV": 4,
    "faction": "UN",
    "swift": 7,
    "melee": 4,
    "projectile": 5,
    "firing": 3,
    "moving": 4,
    "tactic": 1,
    "trait": " Provoke",
    "traitDescription": " · When Electronic Counter Roll is successful, may switch the Responder mech to Offensive Stance."
  },
  {
    "id": "LPA-23",
    "name": "Onyx",
    "score": 21,
    "LV": 4,
    "faction": "UN",
    "swift": 6,
    "melee": 2,
    "projectile": 3,
    "firing": 5,
    "moving": 4,
    "tactic": 4,
    "trait": " Chase",
    "traitDescription": "· Piloted mech may Crush large units."
  },
  {
    "id": "LPA-24",
    "name": "Sealock",
    "score": 21,
    "LV": 4,
    "faction": "UN",
    "swift": 5,
    "melee": 4,
    "projectile": 8,
    "firing": 4,
    "moving": 7,
    "tactic": 3,
    "trait": " Chase",
    "traitDescription": " · When attacking a target with Fragile Token, may exchange {Eye} as {Heavy Hit}."
  },
  {
    "id": "LPA-27",
    "name": "Rifleman1",
    "score": 9,
    "LV": 4,
    "faction": "UN",
    "swift": 3,
    "melee": 7,
    "projectile": 6,
    "firing": 2,
    "moving": 5,
    "tactic": 5,
    "trait": "",
    "traitDescription": "Trainee Rifleman of 303 Squadron."
  },
  {
    "id": "LPA-28",
    "name": "Rifleman2",
    "score": 9,
    "LV": 4,
    "faction": "UN",
    "swift": 3,
    "melee": 7,
    "projectile": 6,
    "firing": 2,
    "moving": 5,
    "tactic": 5,
    "trait": "",
    "traitDescription": "Trainee Rifleman of 303 Squadron."
  },
  {
    "id": "LPA-29",
    "name": "Rifleman3",
    "score": 9,
    "LV": 4,
    "faction": "UN",
    "swift": 3,
    "melee": 7,
    "projectile": 6,
    "firing": 2,
    "moving": 5,
    "tactic": 5,
    "trait": "",
    "traitDescription": "Trainee Rifleman of 303 Squadron."
  },
  {
    "id": "LPA-30",
    "name": "Rifleman4",
    "score": 9,
    "LV": 4,
    "faction": "UN",
    "swift": 3,
    "melee": 7,
    "projectile": 6,
    "firing": 2,
    "moving": 5,
    "tactic": 5,
    "trait": "",
    "traitDescription": "Trainee Rifleman of 303 Squadron."
  },
  {
    "id": "LPA-31",
    "name": "Charger1",
    "score": 6,
    "LV": 4,
    "faction": "UN",
    "swift": 4,
    "melee": 3,
    "projectile": 2,
    "firing": 5,
    "moving": 2,
    "tactic": 6,
    "trait": "",
    "traitDescription": "Trainee Charger of 303 Squadron."
  },
  {
    "id": "LPA-32",
    "name": "Charger2",
    "score": 6,
    "LV": 4,
    "faction": "UN",
    "swift": 4,
    "melee": 3,
    "projectile": 2,
    "firing": 5,
    "moving": 2,
    "tactic": 6,
    "trait": "",
    "traitDescription": "Trainee Charger of 303 Squadron."
  },
  {
    "id": "LPA-33",
    "name": "Charger3",
    "score": 6,
    "LV": 4,
    "faction": "UN",
    "swift": 4,
    "melee": 3,
    "projectile": 2,
    "firing": 5,
    "moving": 2,
    "tactic": 6,
    "trait": "",
    "traitDescription": "Trainee Charger of 303 Squadron."
  },
  {
    "id": "LPA-34",
    "name": "Charger4",
    "score": 6,
    "LV": 4,
    "faction": "UN",
    "swift": 4,
    "melee": 3,
    "projectile": 2,
    "firing": 5,
    "moving": 2,
    "tactic": 6,
    "trait": "",
    "traitDescription": "Trainee Charger of 303 Squadron."
  },
   {
    "id": "LPA-66",
    "name": "Charger34",
    "score": 9,
    "LV": 4,
    "faction": "UN",
    "swift": 3,
    "melee": 7,
    "projectile": 6,
    "firing": 2,
    "moving": 5,
    "tactic": 5,
    "trait": "",
    "traitDescription": "Trainee Charger of 303 Squadron."
  }
];

export const pdTorso: Part[] = [
  {
    "id": "287",
    "name": "ACE-001 White Dwarf Core Part",
    "type": "torso",
    "score": 72,
    "structure": 3,
    "armor": 5,
    "parray": 0,
    "dodge": 1,
    "electronic": 3,
    "description": "",
    "projectile": ["288"],
    "isPD": true
  }
];

export const pdChasis: Part[] = [
  {
    "id": "289",
    "name": "ACE-001 White Chassis Part",
    "type": "chasis",
    "score": 24,
    "structure": 0,
    "armor": 4,
    "parray": 0,
    "dodge": 3,
    "electronic": 0,
    "description": "",
    "isPD": true
  }
];

export const pdLeftHand: Part[] = [{
  "id": "291",
  "name": "ACE-001 White Left Arm Part",
  "type": "leftHand",
  "score": 57,
  "structure": 0,
  "armor": 4,
  "parray": 0,
  "dodge": 0,
  "electronic": 0,
  "description": "",
  "isPD": true,
  "keywords": [KEYWORD_LIST.en.近战射击, KEYWORD_LIST.en.脆弱]
}
];

export const pdRightHand: Part[] = [

  {
    "id": "290",
    "name": "ACE-001 White Right Arm Part",
    "type": "rightHand",
    "score": 72,
    "structure": 0,
    "armor": 4,
    "parray": 1,
    "dodge": 0,
    "electronic": 0,
    "description": "",
    "isPD": true,
    "keywords": [KEYWORD_LIST.en.近战射击, KEYWORD_LIST.en.毁伤]
  }
];

export const pdBackpack: Part[] = [
  {
    "id": "292",
    "name": "ACE-001 White Left Bit Part",
    "type": "backpack",
    "score": 60,
    "structure": 0,
    "armor": 3,
    "parray": 0,
    "dodge": 1,
    "electronic": 2,
    "description": "",
    "projectile": ["293", "294", "295"],
    "isPD": true
  }
];

export const pdPilots: Pilot[] = [
  {
    "id": "ACE-01",
    "name": "Karl·Fried",
    "score": 15,
    "LV": 4,
    "faction": "PD",
    "swift": 5,
    "melee": 7,
    "projectile": 6,
    "firing": 3,
    "moving": 8,
    "tactic": 6,
    "trait": "Synesthesia",
    "traitDescription": "· When a \"White Dwarf\" Bit performs a roll, it may consume Link from this Mech to re-roll."
  }
];

export const allTacticCards: TacticCard[] = [
  {
    "id": "274",
    "name": "Additional Command",
    "description": "",
    "score": 30
  },{
    "id": "275",
    "name": "Battlefield Recovery",
    "description": "",
    "score": 30
  },{
    "id": "276",
    "name": "Hit and Run",
    "description": "",
    "score": 30
  },{
    "id": "277",
    "name": "System Repair",
    "description": "",
    "score": 30
  },{
    "id": "278",
    "name": "Tactical Dispostion",
    "description": "",
    "score": 30
  },{
    "id": "279",
    "name": "Remote Restart",
    "description": "",
    "score": 30
  },
]

export const gofChasis: Part[] = [
    {
      "id": "179",
      "name": "PL1 Standard Chassis",
      "type": "chasis",
      "score": 37,
      "armor": 1,
      "structure": 5,
      "parray": 0,
      "dodge": 3,
      "electronic": 0,
      "move": 1,
      "description": "",
      "keywords": [],
      "action": [
        {
          "id": "179_A",
          "name": "Sprint",
          "description": "",
          "type": "Moving",
          "size": "m",
          "range": 4,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ],
      "projectile": [],
      "isPD": false,
      "hasImage":true,
    },
    {
      "id": "180",
      "name": "PL29\r\n Stealth Chassis",
      "type": "chasis",
      "score": 61,
      "armor": 1,
      "structure": 5,
      "parray": 0,
      "dodge": 4,
      "electronic": 0,
      "move": 1,
      "description": "· Silence: Optical Camouflage and Low Profile will not be removed when this action is performed.",
      "keywords": [KEYWORD_LIST.en.静默],
      "action": [
        {
          "id": "180_A",
          "name": "Sprint",
          "description": "",
          "type": "Moving",
          "size": "m",
          "range": 3,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        },
        {
          "id": "180_B",
          "name": "Stealth Movement",
          "description": "· All Move Actions and Maneuver of this Part have Silence.",
          "type": "Passive",
          "size": "m",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ],
      "projectile": [],
      "isPD": false,
      "hasImage":true,
    },
    {
      "id": "181",
      "name": "PLK400\n“Centaur”\nHigh-mobility Chassis",
      "type": "chasis",
      "score": 90,
      "armor": 5,
      "structure": 3,
      "parray": 0,
      "dodge": 3,
      "electronic": 0,
      "move": 2,
      "description": "·Unstoppable: Movement Actions with this Keyword can still be performed when Immobilized.\n·Non-humanoid X: When performing this Action, -X Link Value.\n·Push X: Move the target X grids in straight line in the direction this unit is facing, then this unit performs the same movement.",
      "keywords": [KEYWORD_LIST.en.异形X, KEYWORD_LIST.en.不可阻挡, KEYWORD_LIST.en.推动X],
      "action": [
        {
          "id": "181_A",
          "name": "Run",
          "description": "· Non-humanoid 1\n· Unstoppable\n· If there is an Enemy Ground Unit in the adjacent grid in front of the Mech after performing this Action, may cause Push 1.",
          "type": "Moving",
          "size": "m",
          "range": 5,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        },
        {
          "id": "181_B",
          "name": "Sprint",
          "description": "",
          "type": "Moving",
          "size": "s",
          "range": 2,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ],
      "projectile": [],
      "isPD": false,
      "hasImage":true,
    },
    {
      "id": "182",
      "name": "PL35\nArmored Chassis",
      "type": "chasis",
      "score": 64,
      "armor": 6,
      "structure": 2,
      "parray": 0,
      "dodge": 3,
      "electronic": 0,
      "move": 1,
      "description": "·Push X: Move the target X grids in straight line in the direction this unit is facing, then this unit performs the same movement.",
     "keywords": [KEYWORD_LIST.en.推动X],
      "action": [
        {
          "id": "182_A",
          "name": "Sprint",
          "description": "",
          "type": "Moving",
          "size": "m",
          "range": 4,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        },
        {
          "id": "182_B",
          "name": "Kick",
          "description": "·[On Hit], Push 1.",
          "type": "Melee",
          "size": "s",
          "range": 1,
          "storage": 0,
          "yellowDice": 5,
          "redDice": 0
        }
      ],
      "projectile": [],
      "isPD": false,
      "hasImage":true,
    }
  ]

export const gofLeftHand: Part[] = [
    {
      "id": "ZHLA-101",
      "name": "SS12 Buckler",
      "type": "leftHand",
      "score": 53,
      "armor": 4,
      "structure": 5,
      "parray": 2,
      "dodge": 0,
      "electronic": 0,
      "move": 0,
      "description": "",
      "keywords": [KEYWORD_LIST.en.空手, KEYWORD_LIST.en.震撼],
      "action": [
        {
          "id": "ZHLA-101_A",
          "name": "Defense Reaction",
          "description": "· If Penetration occurs against any Part of this Mech, it may immediately change to Defensive Stance.",
          "type": "Passive",
          "size": "m",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        },
        {
          "id": "ZHLA-101_B",
          "name": "Shield Bash",
          "description": "· Concussion",
          "type": "Melee",
          "size": "s",
          "range": -1,
          "storage": 0,
          "yellowDice": 5,
          "redDice": 0
        }
      ],
      "projectile": [],
      "isPD": false,
      "hasImage":true,
    },
    {
      "id": "ZHLA-102",
      "name": "Dual \"Swift\" Launcher",
      "type": "leftHand",
      "score": 35,
      "armor": 1,
      "structure": 4,
      "parray": 0,
      "dodge": 0,
      "electronic": 0,
      "move": 0,
      "description": "",
      "keywords": [KEYWORD_LIST.en.齐射X, KEYWORD_LIST.en.曲射, KEYWORD_LIST.en.指令协调X],
      "action": [
        {
          "id": "ZHLA-102_A",
          "name": "Missile",
          "description": "· Volley 2 · Fire in arc\n· Launch 1 M707 \"Swift\" Missile.\n· Command Coordination 1",
          "type": "Projectile",
          "size": "m",
          "range": 3,
          "storage": 2,
          "yellowDice": 0,
          "redDice": 0
        },
        {
          "id": "ZHLA-102_B",
          "name": "Command Coordination",
          "description": "·  Give 1 Command Token to 1 Ally Drone.",
          "type": "Tactic",
          "size": "s",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ],
      "projectile": [
        "ZHAM-001A"
      ],
    "throwIndex": "ZHLA-102-T",
      "isPD": false,
      "hasImage":true,
    },
    {
      "id": "ZHLA-102-T",
      "name": "Dual \"Swift\" Launcher (D)",
      "type": "leftHand",
      "score": 0,
      "armor": 1,
      "structure": 4,
      "parray": 0,
      "dodge": 0,
      "electronic": 0,
      "move": 0,
      "description": "",
      "keywords": [
        KEYWORD_LIST.en.空手
      ],
      "action": [
        {
          "id": "ZHLA-102_B",
          "name": "Command Coordination",
          "description": "·  Give 1 Command Token to 1 Ally Drone.",
          "type": "Tactic",
          "size": "s",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ],
      "projectile": [],
      "isPD": false,
      "hasImage":false,
    },
    {
      "id": "ZHLA-201",
      "name": "GSD7 Mortar",
      "type": "leftHand",
      "score": 29,
      "armor": 1,
      "structure": 4,
      "parray": 0,
      "dodge": 0,
      "electronic": 1,
      "move": 0,
      "description": "",
      "keywords": [KEYWORD_LIST.en.曲射, KEYWORD_LIST.en.静止, KEYWORD_LIST.en.指令协调X],
      "action": [
        {
          "id": "ZHLA-201_A",
          "name": "Mortar",
          "description": "· Fire in arc\n· Launch 1 PK3 Sensor-fused Munition or M25 Shrapnel Shell.\n· [Stationary] Range +1 grid。\n· Command Coordination 1",
          "type": "Projectile",
          "size": "m",
          "range": 8,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        },
        {
          "id": "ZHLA-201_B",
          "name": "Command Coordination",
          "description": "·  Give 1 Command Token to 1 Ally Drone.",
          "type": "Tactic",
          "size": "s",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ],
      "projectile": [
        "ZHAM-003",
        "ZHAM-004"
      ],
      "isPD": false,
      "hasImage":true,
      "throwIndex": "ZHLA-201-T",
    },
    {
      "id": "ZHLA-201-T",
      "name": "GSD7 Mortar (D)",
      "type": "leftHand",
      "score": 0,
      "armor": 1,
      "structure": 4,
      "parray": 0,
      "dodge": 0,
      "electronic": 0,
      "move": 0,
      "description": "",
      "keywords": [
        KEYWORD_LIST.en.空手
      ],
      "action": [
        {
          "id": "ZHLA-201_B",
          "name": "Command Coordination",
          "description": "·  Give 1 Command Token to 1 Ally Drone.",
          "type": "Tactic",
          "size": "s",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ],
      "projectile": [],
      "isPD": false,
      "hasImage":false,
    },
    {
      "id": "ZHLA-202",
      "name": "M4 Combat Claw",
      "type": "leftHand",
      "score": 65,
      "armor": 1,
      "structure": 5,
      "parray": 3,
      "dodge": 0,
      "electronic": 0,
      "move": 0,
      "description": "",
      "keywords": [
        KEYWORD_LIST.en.空手
      ],
      "action": [
        {
          "id": "ZHLA-202_A",
          "name": "Tear",
          "description": "· [On hit], target gains 1 Fragile Token.",
          "type": "Melee",
          "size": "s",
          "range": -1,
          "storage": 0,
          "yellowDice": 5,
          "redDice": 0
        },
        {
          "id": "ZHLA-202_B",
          "name": "Reposte",
          "description": "· On a Successful Parry with this part, the Attacker must immediately end the current Action Opportunity, and then the Defender may immediately perform a Melee Action.",
          "type": "Passive",
          "size": "m",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ],
      "projectile": [],
      "isPD": false,
      "hasImage":true,
    },
    {
      "id": "ZHLA-301",
      "name": "SS30 Heavy Shield",
      "type": "leftHand",
      "score": 75,
      "armor": 6,
      "structure": 5,
      "parray": 2,
      "dodge": 0,
      "electronic": 0,
      "move": 0,
      "description": "",
      "keywords": [],
      "throwIndex": "ZHLA-301-T",
      "action": [
        {
          "id": "ZHLA-301_A",
          "name": "Shield Up",
          "description": "· This Mech may Designate this part to resolve damage in the Defensive Stance.",
          "type": "Passive",
          "size": "m",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        },
        {
          "id": "ZHLA-301_B",
          "name": "Defense Reaction",
          "description": "· If Penetration occurs against any Part of this Mech, it may immediately change to Defensive Stance.",
          "type": "Passive",
          "size": "m",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ],
      "projectile": [],
      "isPD": false,
      "hasImage":true,
    },
    {
      "id": "ZHLA-301-T",
      "name": "SS30 Heavy Shield (D)",
      "type": "leftHand",
      "score": 0,
      "armor": 1,
      "structure": 5,
      "parray": 1,
      "dodge": 0,
      "electronic": 0,
      "move": 0,
      "description": "",
      "keywords": [
        KEYWORD_LIST.en.空手
      ],
      "action": [],
      "projectile": [],
      "isPD": false,
      "hasImage":false,
    },
    {
      "id": "ZHLA-302",
      "name": "MR870 Shotgun",
      "type": "leftHand",
      "score": 56,
      "armor": 1,
      "structure": 5,
      "parray": 1,
      "dodge": 0,
      "electronic": 0,
      "move": 0,
      "description": "",
      "keywords": [KEYWORD_LIST.en.霰射, KEYWORD_LIST.en.近战射击],
      "throwIndex": "ZHLA-302-T",
      "action": [
        {
          "id": "ZHLA-302_A",
          "name": "Burst Fire",
          "description": "· Scatter-shot · Melee Firing",
          "type": "Firing",
          "size": "s",
          "range": 4,
          "storage": 0,
          "yellowDice": 2,
          "redDice": 1
        },
        {
          "id": "ZHLA-302_B",
          "name": "Power Shot",
          "description": "· Scatter-shot · Melee Firing",
          "type": "Firing",
          "size": "l",
          "range": 4,
          "storage": 0,
          "yellowDice": 6,
          "redDice": 1
        }
      ],
      "projectile": [],
      "isPD": false,
      "hasImage":true,
    },
    {
      "id": "ZHLA-302-T",
      "name": "MR870 Shotgun (D)",
      "type": "leftHand",
      "score": 0,
      "armor": 1,
      "structure": 5,
      "parray": 1,
      "dodge": 0,
      "electronic": 0,
      "move": 0,
      "description": "",
      "keywords": [
        KEYWORD_LIST.en.空手
      ],
      "action": [],
      "projectile": [],
      "isPD": false,
      "hasImage":false,
    },
    {
      "id": "ZHLA-303",
      "name": "Support Arm",
      "type": "leftHand",
      "score": 29,
      "armor": 1,
      "structure": 5,
      "parray": 1,
      "dodge": 0,
      "electronic": 0,
      "move": 0,
      "description": "",
      "keywords": [
        KEYWORD_LIST.en.空手
      ],
      "action": [
        {
          "id": "ZHLA-303_A",
          "name": "Melee Support",
          "description": "· If this part is Designated as Freehand for Melee Action, that Action +1R.",
          "type": "Passive",
          "size": "m",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ],
      "projectile": [],
      "isPD": false,
      "hasImage":true,
    },
    {
      "id": "ZHLA-304",
      "name": "MH-K1 Heat Heavy Sword (L)",
      "type": "leftHand",
      "score": 47,
      "armor": 1,
      "structure": 5,
      "parray": 2,
      "dodge": 0,
      "electronic": 0,
      "move": 0,
      "description": "",
      "keywords": [KEYWORD_LIST.en.顺劈, KEYWORD_LIST.en.毁伤],
      "throwIndex": "ZHLA-304-T",
      "action": [
        {
          "id": "ZHLA-304_A",
          "name": "Chop",
          "description": "· Cleaving",
          "type": "Melee",
          "size": "s",
          "range": -1,
          "storage": 0,
          "yellowDice": 5,
          "redDice": 0
        },
        {
          "id": "ZHLA-304_B",
          "name": "Slash",
          "description": "· [Two-Handed] Gains Mutilation.",
          "type": "Melee",
          "size": "l",
          "range": -1,
          "storage": 0,
          "yellowDice": 2,
          "redDice": 5
        }
      ],
      "projectile": [],
      "isPD": false,
      "hasImage":true,
    },
    {
      "id": "ZHLA-304-T",
      "name": "MH-K1 Heat Heavy Sword (L)(D)",
      "type": "leftHand",
      "score": 0,
      "armor": 1,
      "structure": 5,
      "parray": 1,
      "dodge": 0,
      "electronic": 0,
      "move": 0,
      "description": "",
      "keywords": [
        KEYWORD_LIST.en.空手
      ],
      "action": [],
      "projectile": [],
      "isPD": false,
      "hasImage":false,
    }
  ]

  export const gofRightHand: Part[] = [
    {
      "id": "ZHRA-101",
      "name": "MR14 Railgun",
      "type": "rightHand",
      "score": 29,
      "armor": 1,
      "structure": 4,
      "parray": 0,
      "dodge": 0,
      "electronic": 0,
      "move": 0,
      "description": "",
      "keywords": [KEYWORD_LIST.en.穿甲X, KEYWORD_LIST.en.双手],
      "throwIndex": "ZHRA-101-T",
      "action": [
        {
          "id": "ZHRA-101_A",
          "name": "Burst Fire",
          "description": "· Armor Piercing 1",
          "type": "Firing",
          "size": "m",
          "range": 8,
          "storage": 0,
          "yellowDice": 2,
          "redDice": 2
        },
        {
          "id": "ZHRA-101_B",
          "name": "Power Shot",
          "description": "· Armour Piercing 1\n· [Two-Handed] Range +2 grids.",
          "type": "Firing",
          "size": "l",
          "range": 8,
          "storage": 0,
          "yellowDice": 2,
          "redDice": 3
        }
      ],
      "projectile": [],
      "isPD": false,
      "hasImage":true,
    },
    {
      "id": "ZHRA-101-T",
      "name": "MR14 Railgun (D)",
      "type": "rightHand",
      "score": 0,
      "armor": 1,
      "structure": 4,
      "parray": 0,
      "dodge": 0,
      "electronic": 0,
      "move": 0,
      "description": "",
      "keywords": [
        KEYWORD_LIST.en.空手
      ],
      "action": [],
      "projectile": [],
      "isPD": false,
      "hasImage":false,
    },
    {
      "id": "ZHRA-102",
      "name": "MR16 Railgun",
      "type": "rightHand",
      "score": 32,
      "armor": 1,
      "structure": 4,
      "parray": 0,
      "dodge": 0,
      "electronic": 0,
      "move": 0,
      "description": "",
      "keywords": [KEYWORD_LIST.en.穿甲X],
      "throwIndex": "ZHRA-102-T",
      "action": [
        {
          "id": "ZHRA-102_A",
          "name": "Burst Fire",
          "description": "· Armor Piercing 1\n· [Offensive Stance] This action is considerd a Short Action.",
          "type": "Firing",
          "size": "m",
          "range": 6,
          "storage": 0,
          "yellowDice": 5,
          "redDice": 0
        },
        {
          "id": "ZHRA-102_B",
          "name": "Power Shot",
          "description": "· Armor Piercing 1",
          "type": "Firing",
          "size": "l",
          "range": 6,
          "storage": 0,
          "yellowDice": 3,
          "redDice": 3
        }
      ],
      "projectile": [],
      "isPD": false,
      "hasImage":true,
    },
    {
      "id": "ZHRA-102-T",
      "name": "MR16 Railgun (D)",
      "type": "rightHand",
      "score": 0,
      "armor": 1,
      "structure": 4,
      "parray": 0,
      "dodge": 0,
      "electronic": 0,
      "move": 0,
      "description": "",
      "keywords": [
        KEYWORD_LIST.en.空手
      ],
      "action": [],
      "projectile": [],
      "isPD": false,
      "hasImage":false,
    },
    {
      "id": "ZHRA-103",
      "name": "M115 Spear",
      "type": "rightHand",
      "score": 29,
      "armor": 1,
      "structure": 4,
      "parray": 0,
      "dodge": 0,
      "electronic": 0,
      "move": 0,
      "description": "",
      "keywords": [KEYWORD_LIST.en.冲锋X, KEYWORD_LIST.en.毁伤],
       "throwIndex": "ZHRA-103-T",
      "action": [
        {
          "id": "ZHRA-103_A",
          "name": "Thrust",
          "description": "· [Offensive Stance] gains Shock Attack 1.",
          "type": "Melee",
          "size": "m",
          "range": -1,
          "storage": 0,
          "yellowDice": 3,
          "redDice": 3
        },
        {
          "id": "ZHRA-103_B",
          "name": "Power Thrust",
          "description": "· [Two-Handed] Gains Mutilation.",
          "type": "Melee",
          "size": "l",
          "range": -1,
          "storage": 0,
          "yellowDice": 3,
          "redDice": 4
        }
      ],
      "projectile": [],
      "isPD": false,
      "hasImage":true,
    },
    {
      "id": "ZHRA-103-T",
      "name": "M115 Spear (D)",
      "type": "rightHand",
      "score": 0,
      "armor": 1,
      "structure": 4,
      "parray": 0,
      "dodge": 0,
      "electronic": 0,
      "move": 0,
      "description": "",
      "keywords": [
        KEYWORD_LIST.en.空手
      ],
      "action": [],
      "projectile": [],
      "isPD": false,
      "hasImage":false,
    },
    {
      "id": "ZHRA-201",
      "name": "MR21 Railgun",
      "type": "rightHand",
      "score": 68,
      "armor": 1,
      "structure": 4,
      "parray": 0,
      "dodge": 0,
      "electronic": 1,
      "move": 0,
      "description": "",
      "keywords": [KEYWORD_LIST.en.穿甲X, KEYWORD_LIST.en.指令协调X, KEYWORD_LIST.en.狙击, KEYWORD_LIST.en.毁伤],
       "throwIndex": "ZHRA-201-T",
      "action": [
        {
          "id": "ZHRA-201_A",
          "name": "Single Shot",
          "description": "· Armor Piercing 1\n· Command Coordination 1",
          "type": "Firing",
          "size": "m",
          "range": 12,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 3
        },
        {
          "id": "ZHRA-201_B",
          "name": "Power Shot",
          "description": "· Armor Piercing 1 · Snipe\n· [Two-Handed] Gains Mutilation.\n· [Offensive Stance]+{1R}.",
          "type": "Firing",
          "size": "l",
          "range": 12,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 4
        }
      ],
      "projectile": [],
      "isPD": false,
      "hasImage":true,
    },
    {
      "id": "ZHRA-201-T",
      "name": "MR21 Railgun (D)",
      "type": "rightHand",
      "score": 0,
      "armor": 1,
      "structure": 4,
      "parray": 0,
      "dodge": 0,
      "electronic": 1,
      "move": 0,
      "description": "",
      "keywords": [
        KEYWORD_LIST.en.空手
      ],
      "action": [
        {
          "id": "ZHRA-201_B",
          "name": "Command Coordination",
          "description": "·  Give 1 Command Token to 1 Ally Drone.",
          "type": "Tactic",
          "size": "s",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ],
      "projectile": [],
      "isPD": false,
      "hasImage":false,
    },
    {
      "id": "ZHRA-202",
      "name": "MR24 Railgun",
      "type": "rightHand",
      "score": 68,
      "armor": 1,
      "structure": 4,
      "parray": 0,
      "dodge": 0,
      "electronic": 1,
      "move": 0,
      "description": "",
      "keywords": [KEYWORD_LIST.en.穿甲X, KEYWORD_LIST.en.静默, KEYWORD_LIST.en.指令协调X, KEYWORD_LIST.en.狙击, KEYWORD_LIST.en.毁伤],
       "throwIndex": "ZHRA-202-T",
      "action": [
        {
          "id": "ZHRA-202_A",
          "name": "Single Shot",
          "description": "· Armor Piercing 1\n· Silence· Command Coordination 1",
          "type": "Firing",
          "size": "m",
          "range": 12,
          "storage": 0,
          "yellowDice": 1,
          "redDice": 2
        },
        {
          "id": "ZHRA-202_B",
          "name": "Power Shot",
          "description": "· Armor Piercing 1 · Snipe\n· [Two-Handed] Gains Mutilation.",
          "type": "Firing",
          "size": "l",
          "range": 12,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 4
        }
      ],
      "projectile": [],
      "isPD": false,
      "hasImage":true,
    },
    {
      "id": "ZHRA-202-T",
      "name": "MR24 Railigun (D)",
      "type": "rightHand",
      "score": 0,
      "armor": 1,
      "structure": 4,
      "parray": 0,
      "dodge": 0,
      "electronic": 1,
      "move": 0,
      "description": "",
      "keywords": [
        KEYWORD_LIST.en.空手
      ],
      "action": [
        {
          "id": "ZHRA-202_B",
          "name": "Command Coordination",
          "description": "·  Give 1 Command Token to 1 Ally Drone.",
          "type": "Tactic",
          "size": "s",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ],
      "projectile": [],
      "isPD": false,
      "hasImage":false,
    },
    {
      "id": "ZHRA-301",
      "name": "M100 Lance",
      "type": "rightHand",
      "score": 56,
      "armor": 1,
      "structure": 5,
      "parray": 1,
      "dodge": 0,
      "electronic": 0,
      "move": 0,
      "description": "",
      "keywords": [KEYWORD_LIST.en.冲锋X, KEYWORD_LIST.en.近战射击],
       "throwIndex": "ZHRA-301-T",
      "action": [
        {
          "id": "ZHRA-301_A",
          "name": "Thrust",
          "description": "· [Offensive Stance] gains Shock Attack 1.",
          "type": "Melee",
          "size": "m",
          "range": -1,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 5
        },
        {
          "id": "ZHRA-301_B",
          "name": "Single Shot",
          "description": "· Melee Firing",
          "type": "Firing",
          "size": "l",
          "range": 6,
          "storage": 0,
          "yellowDice": 3,
          "redDice": 3
        }
      ],
      "projectile": [],
      "isPD": false,
      "hasImage":true,
    },
    {
      "id": "ZHRA-301-T",
      "name": "M100 Lance (D)",
      "type": "rightHand",
      "score": 0,
      "armor": 1,
      "structure": 5,
      "parray": 1,
      "dodge": 0,
      "electronic": 0,
      "move": 0,
      "description": "",
      "keywords": [
        KEYWORD_LIST.en.空手
      ],
      "action": [],
      "projectile": [],
      "isPD": false,
      "hasImage":false,
    },
    {
      "id": "ZHRA-303",
      "name": "M105 Halberd",
      "type": "rightHand",
      "score": 38,
      "armor": 1,
      "structure": 4,
      "parray": 0,
      "dodge": 0,
      "electronic": 0,
      "move": 0,
      "description": "",
      "keywords": [KEYWORD_LIST.en.冲锋X, KEYWORD_LIST.en.拖拽, KEYWORD_LIST.en.压制, KEYWORD_LIST.en.毁伤],
      "throwIndex": "ZHRA-303-T",
      "action": [
        {
          "id": "ZHRA-303_A",
          "name": "Thrust Pick",
          "description": "· [Offensive Stance] gains Shock Attack 1.\n· [On Hit] Causes Drag.",
          "type": "Melee",
          "size": "m",
          "range": -1,
          "storage": 0,
          "yellowDice": 3,
          "redDice": 3
        },
        {
          "id": "ZHRA-303_B",
          "name": "Slash",
          "description": "· [Two-Handed] Gains Suppression and Mutilation.",
          "type": "Melee",
          "size": "l",
          "range": -1,
          "storage": 0,
          "yellowDice": 4,
          "redDice": 3
        }
      ],
      "projectile": [],
      "isPD": false,
      "hasImage":true,
    },
    {
      "id": "ZHRA-303-T",
      "name": "M105 Halberd (D)",
      "type": "rightHand",
      "score": 0,
      "armor": 1,
      "structure": 4,
      "parray": 0,
      "dodge": 0,
      "electronic": 0,
      "move": 0,
      "description": "",
      "keywords": [
        KEYWORD_LIST.en.空手
      ],
      "action": [],
      "projectile": [],
      "isPD": false,
      "hasImage":false,
    },
    {
      "id": "ZHRA-304",
      "name": "MH-K1 Heat Heavy Sword (R)",
      "type": "rightHand",
      "score": 47,
      "armor": 1,
      "structure": 5,
      "parray": 2,
      "dodge": 0,
      "electronic": 0,
      "move": 0,
      "description": "",
      "keywords": [KEYWORD_LIST.en.顺劈, KEYWORD_LIST.en.毁伤],
      "throwIndex": "ZHRA-304-T",
      "action": [
        {
          "id": "ZHRA-304_A",
          "name": "Chop",
          "description": "· Cleaving",
          "type": "Melee",
          "size": "s",
          "range": -1,
          "storage": 0,
          "yellowDice": 5,
          "redDice": 0
        },
        {
          "id": "ZHRA-304_B",
          "name": "Slash",
          "description": "· [Two-Handed] Gains Mutilation.",
          "type": "Melee",
          "size": "l",
          "range": -1,
          "storage": 0,
          "yellowDice": 2,
          "redDice": 5
        }
      ],
      "projectile": [],
      "isPD": false,
      "hasImage":true,
    },
    {
      "id": "ZHRA-304-T",
      "name": "MH-K1 Heat Heavy Sword (R)(D)",
      "type": "rightHand",
      "score": 0,
      "armor": 1,
      "structure": 5,
      "parray": 1,
      "dodge": 0,
      "electronic": 0,
      "move": 0,
      "description": "",
      "keywords": [
        KEYWORD_LIST.en.空手
      ],
      "action": [],
      "projectile": [],
      "isPD": false,
      "hasImage":false,
    }
  ]

  export const gofBackpack: Part[] =  [
    {
      "id": "ZYBP-101",
      "name": "DLSP Swarm Control Backpack",
      "type": "backpack",
      "score": 33,
      "armor": 3,
      "structure": 0,
      "parray": 0,
      "dodge": 1,
      "electronic": 1,
      "move": 0,
      "description": "· Fire in arc: This action does not require visual to the landing point or the target.\r\n· Volley X: Fire or deploy up to X projectiles and consume an equal amount of Ammo Tokens.",
      "keywords": [KEYWORD_LIST.en.曲射, KEYWORD_LIST.en.齐射X],
      "action": [
        {
          "id": "ZYBP-101_A",
          "name": "Nest Guardian Swarm",
          "description": "· Fire in arc · Volley 2\n· Launch 1 Nest Guardian Swarm.",
          "type": "Projectile",
          "size": "s",
          "range": 6,
          "storage": 2,
          "yellowDice": 0,
          "redDice": 0
        },
        {
          "id": "ZYBP-101_B",
          "name": "Command Coordination",
          "description": "·  Give 1 Command Token to 1 Ally Drone.",
          "type": "Tactic",
          "size": "s",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ],
      "projectile": [],
      "isPD": false,
      "hasImage":true,
    },
    {
      "id": "ZYBP-102",
      "name": "Integrated Data Link Pod",
      "type": "backpack",
      "score": 33,
      "armor": 3,
      "structure": 0,
      "parray": 0,
      "dodge": 1,
      "electronic": 1,
      "move": 0,
      "description": "·Command Coordination X: After this action is completed, may immediately give 1 Command Token to X Ally Drones.",
       "keywords": [KEYWORD_LIST.en.指令协调X],
      "action": [
        {
          "id": "ZYBP-102_A",
          "name": "Distributed Collaboration",
          "description": "· When this mech ends it's Action Opportunity, Command Coordination 1.",
          "type": "Passive",
          "size": "m",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ],
      "projectile": [],
      "isPD": false
    },
    {
      "id": "ZYBP-201",
      "name": "CSS20 “Cloak” Optical Camouflage System",
      "type": "backpack",
      "score": 45,
      "armor": 3,
      "structure": 0,
      "parray": 0,
      "dodge": 1,
      "electronic": 0,
      "move": 0,
      "description": "· Stealth X: When the Optical Camouflage is released, the Mech may appear within X grids.",
      "keywords": [KEYWORD_LIST.en.隐秘X],
      "action": [
        {
          "id": "ZYBP-201_A",
          "name": "Optical Camouflage",
          "description": "· Activate Optical Camouflage, Stealth 0.",
          "type": "Tactic",
          "size": "s",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ],
      "projectile": [],
      "isPD": false
    },
    {
      "id": "ZYBP-202",
      "name": "ECP9 “Whistle” Drone Command System",
      "type": "backpack",
      "score": 48,
      "armor": 3,
      "structure": 0,
      "parray": 0,
      "dodge": 1,
      "electronic": 1,
      "move": 0,
      "description": "",
      "keywords": [KEYWORD_LIST.en.光环],
      "action": [
        {
          "id": "ZYBP-202_A",
          "name": "Convolution algorithm",
          "description": "· Aura\n· When a Ally Drone within Range performs a roll, it may consume 1 Command Token from this Mech to re-roll.",
          "type": "Passive",
          "size": "m",
          "range": 4,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        },
        {
          "id": "ZYBP-202_B",
          "name": "Command Coordination",
          "description": "·  Give 1 Command Token to 1 Ally Drone.",
          "type": "Tactic",
          "size": "s",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ],
      "projectile": [],
      "isPD": false
    },
    {
      "id": "ZYBP-301",
      "name": "MCP7 “Boomerang” Carry Rack",
      "type": "backpack",
      "score": 27,
      "armor": 3,
      "structure": 0,
      "parray": 0,
      "dodge": 1,
      "electronic": 0,
      "move": 0,
      "description": "· Fire in arc: This action does not require visual to the landing point or the target.\r\n· Volley X: Fire or deploy up to X projectiles and consume an equal amount of Ammo Tokens.",
      "keywords": [KEYWORD_LIST.en.曲射, KEYWORD_LIST.en.齐射X],
      "action": [
        {
          "id": "ZYBP-301_A",
          "name": "Missile",
          "description": "· Fire in arc · Volley 2 \n· Launch 1 M60 “Boomerang” Missile.",
          "type": "Projectile",
          "size": "s",
          "range": 3,
          "storage": 2,
          "yellowDice": 0,
          "redDice": 0
        }
      ],
      "projectile": [
        "ZHAM-002"
      ],
      "isPD": false
    },
    {
      "id": "ZYBP-302",
      "name": "“Halo” Melee Collaboration System",
      "type": "backpack",
      "score": 39,
      "armor": 3,
      "structure": 0,
      "parray": 0,
      "dodge": 1,
      "electronic": 0,
      "move": 0,
      "description": "",
      "keywords": [],
      "action": [
        {
          "id": "ZYBP-302_A",
          "name": "Dodge Enhancement",
          "description": "· {Dodge} may cancel 1 Attack Dice.",
          "type": "Passive",
          "size": "m",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        },
        {
          "id": "ZYBP-302_B",
          "name": "Melee Evasion",
          "description": "· On Parry, gains 1 extra Dodge.",
          "type": "Passive",
          "size": "m",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ],
      "projectile": [],
      "isPD": false
    }
  ]

  export const gofPilots: Pilot[] = [
    {
      "id": "ZPA-35",
      "name": "Chef",
      "score": 15,
      "LV": 4,
      "faction": "GOF",
      "swift": 3,
      "melee": 4,
      "projectile": 4,
      "firing": 6,
      "moving": 6,
      "tactic": 7,
      "trait": "CQC",
      "traitDescription": "· When performing Melee Actions, may consume 1 Command Token to exchange {Eye} for {Heavy Hit}."
    },
    {
      "id": "ZPA-36",
      "name": "Aster",
      "score": 12,
      "LV": 4,
      "faction": "GOF",
      "swift": 6,
      "melee": 4,
      "projectile": 5,
      "firing": 3,
      "moving": 3,
      "tactic": 4,
      "trait": "Adjustment",
      "traitDescription": "· Once per round, during the Command Phase, may consume 1 Cmmand Token to restore 1 Link to an Ally mech."
    },
    {
      "id": "ZPA-37",
      "name": "Foxhund",
      "score": 15,
      "LV": 4,
      "faction": "GOF",
      "swift": 3,
      "melee": 7,
      "projectile": 6,
      "firing": 2,
      "moving": 5,
      "tactic": 5,
      "trait": "Trace",
      "traitDescription": "· If there are 2 or more Ally Drones that have line of sight to the target, Firing Actions of this Mech ignore Low Profile."
    },
    {
      "id": "ZPA-38",
      "name": "Firewatch",
      "score": 15,
      "LV": 4,
      "faction": "GOF",
      "swift": 5,
      "melee": 6,
      "projectile": 7,
      "firing": 4,
      "moving": 7,
      "tactic": 3,
      "trait": "Wetware Advantages",
      "traitDescription": "· When performing Electronic Counter Rolls, may consume 1 Link to exchange {Eye} for {Lightning}."
    },
    {
      "id": "ZPA-39",
      "name": "Cadaver",
      "score": 18,
      "LV": 4,
      "faction": "GOF",
      "swift": 4,
      "melee": 3,
      "projectile": 2,
      "firing": 5,
      "moving": 4,
      "tactic": 7,
      "trait": "Survival Willing",
      "traitDescription": "· When this Mech has less than 4 Parts, this Mech's Focus re-roll does not consume Link."
    },
    {
      "id": "ZPA-40",
      "name": "Shrike",
      "score": 12,
      "LV": 4,
      "faction": "GOF",
      "swift": 5,
      "melee": 2,
      "projectile": 3,
      "firing": 8,
      "moving": 4,
      "tactic": 4,
      "trait": "Joy",
      "traitDescription": "· [Offensive Stance] When this Mech Destroys enemy Parts with Melee Actions, restore 1 Link."
    },
    {
      "id": "ZPA-43",
      "name": "Ranger-1",
      "score": 4,
      "LV": 4,
      "faction": "GOF",
      "swift": 2,
      "melee": 5,
      "projectile": 4,
      "firing": 6,
      "moving": 6,
      "tactic": 8,
      "trait":"",
      "traitDescription": "Trainee Ranger from 525 Squadron."
    },
    {
      "id": "ZPA-44",
      "name": "Ranger-2",
      "score": 4,
      "LV": 4,
      "faction": "GOF",
      "swift": 2,
      "melee": 5,
      "projectile": 4,
      "firing": 6,
      "moving": 6,
      "tactic": 8,
      "trait":"",
      "traitDescription": "Trainee Ranger from 525 Squadron."
    },
    {
      "id": "ZPA-45",
      "name": "Ranger-3",
      "score": 4,
      "LV": 4,
      "faction": "GOF",
      "swift": 2,
      "melee": 5,
      "projectile": 4,
      "firing": 6,
      "moving": 6,
      "tactic": 8,
      "trait":"",
      "traitDescription": "Trainee Ranger from 525 Squadron."
    },
    {
      "id": "ZPA-46",
      "name": "Grenadier-1",
      "score": 4,
      "LV": 4,
      "faction": "GOF",
      "swift": 8,
      "melee": 4,
      "projectile": 5,
      "firing": 3,
      "moving": 3,
      "tactic": 2,
      "trait":"",
      "traitDescription": "Trainee Grenadiers from 525 Squadron."
    },
    {
      "id": "ZPA-47",
      "name": "Grenadier-2",
      "score": 4,
      "LV": 4,
      "faction": "GOF",
      "swift": 8,
      "melee": 4,
      "projectile": 5,
      "firing": 3,
      "moving": 3,
      "tactic": 2,
      "trait":"",
      "traitDescription": "Trainee Grenadiers from 525 Squadron."
    },
    {
      "id": "ZPA-48",
      "name": "Grenadier-3",
      "score": 4,
      "LV": 4,
      "faction": "GOF",
      "swift": 8,
      "melee": 4,
      "projectile": 5,
      "firing": 3,
      "moving": 3,
      "tactic": 2,
      "trait":"",
      "traitDescription": "Trainee Grenadiers from 525 Squadron."
    },
    {
      "id": "ZPA-49",
      "name": "Grenadier-4",
      "score": 4,
      "LV": 4,
      "faction": "GOF",
      "swift": 8,
      "melee": 4,
      "projectile": 5,
      "firing": 3,
      "moving": 3,
      "tactic": 2,
      "trait":"",
      "traitDescription": "Trainee Grenadiers from 525 Squadron."
    }
  ]

export const gofProjectiles: Projectile[]=[
    {
      "id": "ZHAM-001A",
      "name": "M707 \"Swift\" Missile",
      "armor": 0,
      "structure": 0,
      "parray": 0,
      "dodge": 3,
      "electronic": 2,
      "stance": "mobility",
      "hasImage": true,
      "keywords": [
        {
          "name": "Projectile"
        },
        {
          "name": "Missile"
        }
      ],
      "actions": [
        {
          "id": "ZHAM-001A_A",
          "name": "Guided Attack",
          "description": "· Target 1 Enemy Unit within range, Fly into target grid and undergo Detonation.\n· On Detonation, cause Explosion damage to target.\n· Cruising",
          "type": "Projectile",
          "speed": "passive",
          "range": 6,
          "storage": 0,
          "yellowDice": 4,
          "redDice": 0
        }
      ]
    },
    {
      "id": "ZHAM-002",
      "name": "M60 “Boomerang” Missile",
      "armor": 0,
      "structure": 0,
      "parray": 0,
      "dodge": 6,
      "electronic": 1,
      "stance": "mobility",
      "hasImage": true,
      "keywords": [
        {
          "name": "Projectile"
        },
        {
          "name": "Missile"
        }
      ],
      "actions": [
        {
          "id": "ZHAM-002_A",
          "name": "Guided Attack",
          "description": "· Target 1 Enemy Unit within range, Fly into target grid and undergo Detonation.\n· On Detonation, cause Explosion damage to target.",
          "type": "Projectile",
          "speed": "passive",
          "range": 3,
          "storage": 0,
          "yellowDice": 1,
          "redDice": 3
        }
      ]
    },
    {
      "id": "ZHAM-003",
      "name": "PK3 Sensor-fused Munition",
      "armor": 0,
      "structure": 0,
      "parray": 0,
      "dodge": 2,
      "electronic": 1,
      "stance": "mobility",
      "hasImage": true,
      "keywords": [
        {
          "name": "Projectile"
        },
        {
          "name": "Sensor-fused Munition"
        }
      ],
      "actions": [
        {
          "id": "ZHAM-003_A",
          "name": "Delayed Detonation",
          "description": "· Target 1 Enemy Unit within range, Fly into target grid and undergo Detonation.\n· Prioritize Enemy Mechs as target.\n· On Detonation, cause Explosion damage to target.\n· Mutilation",
          "type": "Projectile",
          "speed": "passive",
          "range": -1,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 3
        }
      ]
    },
    {
      "id": "ZHAM-004",
      "name": "M25 Shrapnel Shell",
      "armor": 0,
      "structure": 0,
      "parray": 0,
      "dodge": 2,
      "electronic": 0,
      "stance": "mobility",
      "hasImage": true,
      "keywords": [
        {
          "name": "Projectile"
        },
        {
          "name": "Grenade"
        }
      ],
      "actions": [
        {
          "id": "ZHAM-004_A",
          "name": "Delayed Detonation",
          "description": "· Undergo Detonation at current grid.\n· On Detonation, cause Explosion damage to all units wihin range.",
          "type": "Projectile",
          "speed": "passive",
          "range": -1,
          "storage": 0,
          "yellowDice": 3,
          "redDice": 0
        }
      ]
    }
  ]

  export const gofDrones: Drone[] =[
    {
      "id": "ZHDR-201",
      "name": "N31 Hound I “Beagle”",
      "type": "medium",
      "score": 40,
      "armor": 6,
      "structure": 0,
      "parray": 2,
      "dodge": 0,
      "electronic": 2,
      "move": 5,
      "stance": "offensive",
      "description": "",
      "projectile": [
        "ZHAM-002"
      ],
      "isPD": false,
      "hasImage":true,
      "keywords": [KEYWORD_LIST.en.齐射X, KEYWORD_LIST.en.曲射],
      "actions": [
        {
          "id": "ZHDR-201_A",
          "name": "Tear",
          "description": "· [On hit], target gains 1 Fragile Token.",
          "type": "Melee",
          "speed": "auto",
          "range": -1,
          "storage": 0,
          "yellowDice": 5,
          "redDice": 0
        },
        {
          "id": "ZHDR-201_B",
          "name": "Missile",
          "description": "· Volley 3 · Fire in arc\n· Fire 1 M60 “Boomerang” Missile.",
          "type": "Projectile",
          "speed": "command",
          "range": 6,
          "storage": 3,
          "yellowDice": 0,
          "redDice": 0
        }
      ]
    },
    {
      "id": "ZHDR-202",
      "name": "N31 Hound II “Watchdog”",
      "type": "medium",
      "score": 36,
      "armor": 6,
      "structure": 0,
      "parray": 2,
      "dodge": 0,
      "electronic": 2,
      "move": 5,
      "stance": "offensive",
      "description": "",
      "projectile": [],
      "isPD": false,
      "hasImage":true,
      "keywords": [KEYWORD_LIST.en.光环],
      "actions": [
        {
          "id": "ZHDR-202_A",
          "name": "Tear",
          "description": "· [On hit], target gains 1 Fragile Token.",
          "type": "Melee",
          "speed": "auto",
          "range": -1,
          "storage": 0,
          "yellowDice": 5,
          "redDice": 0
        },
        {
          "id": "ZHDR-202_B",
          "name": "Electronic Warfare Weakening",
          "description": "· Aura\n· When Enemy Units within range make Electronic Counter Rolls, Strength -1. This effect cannot be stacked.",
          "type": "Passive",
          "speed": "passive",
          "range": 4,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ]
    },
    {
      "id": "ZHDR-203",
      "name": "N31 Hound III “Bulldog”",
      "type": "medium",
      "score": 36,
      "armor": 6,
      "structure": 0,
      "parray": 2,
      "dodge": 0,
      "electronic": 2,
      "move": 5,
      "stance": "offensive",
      "description": "",
      "projectile": [],
      "isPD": false,
      "hasImage":true,
      "keywords": [KEYWORD_LIST.en.空中移动],
      "actions": [
        {
          "id": "ZHDR-203_A",
          "name": "Tear",
          "description": "· [On hit], target gains 1 Fragile Token.",
          "type": "Melee",
          "speed": "auto",
          "range": -1,
          "storage": 0,
          "yellowDice": 5,
          "redDice": 0
        },
        {
          "id": "ZHDR-203_B",
          "name": "Jump",
          "description": "· Airborne Movement",
          "type": "Moving",
          "speed": "command",
          "range": 3,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ]
    },
    {
      "id": "ZHDR-303",
      "name": "N503 “Valkyrie”",
      "type": "medium",
      "score": 72,
      "armor": 2,
      "structure": 4,
      "parray": 0,
      "dodge": 0,
      "electronic": 3,
      "move": 5,
      "stance": "offensive",
      "description": "",
      "projectile": [],
      "isPD": false,
      "hasImage":true,
      "keywords": [KEYWORD_LIST.en.全向射击, KEYWORD_LIST.en.近战射击, KEYWORD_LIST.en.光环],
      "actions": [
        {
          "id": "ZHDR-303_A",
          "name": "Single Shot",
          "description": "· Omni-direction Firing\n· Melee Firing\n· {Lightning}  may make Target Mech switch into Shutdown Stance immediately.",
          "type": "Firing",
          "speed": "auto",
          "range": 4,
          "storage": 0,
          "yellowDice": 1,
          "redDice": 2
        },
        {
          "id": "ZHDR-303_B",
          "name": "Appease",
          "description": "· Aura\n· At the end of each Round, all Ally Mechs within range recover 1 Link.",
          "type": "Passive",
          "speed": "passive",
          "range": 2,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ]
    },
    {
      "id": "ZHDR-304",
      "name": "N504 “Harpy”",
      "type": "medium",
      "score": 72,
      "armor": 2,
      "structure": 4,
      "parray": 0,
      "dodge": 0,
      "electronic": 3,
      "move": 5,
      "stance": "offensive",
      "description": "",
      "projectile": [],
      "isPD": false,
      "hasImage":true,
     "keywords": [KEYWORD_LIST.en.全向射击, KEYWORD_LIST.en.近战射击],
      "actions": [
        {
          "id": "ZHDR-304_A",
          "name": "Single Shot",
          "description": "· Omni-direction Firing\n· Melee Firing\n· {Lightning}  may make Target Mech switch into Shutdown Stance immediately.",
          "type": "Firing",
          "speed": "auto",
          "range": 4,
          "storage": 0,
          "yellowDice": 1,
          "redDice": 2
        },
        {
          "id": "ZHDR-304_B",
          "name": "Air Transport",
          "description": "· When performing Command Movement, may consume 1 extral Command Token to drag an adjacent Ally Unit.",
          "type": "Passive",
          "speed": "passive",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ]
    },
    {
      "id": "ZHDR-101",
      "name": "N11 Vanguard I “Scutum”",
      "type": "medium",
      "score": 36,
      "armor": 5,
      "structure": 3,
      "parray": 0,
      "dodge": 0,
      "electronic": 2,
      "move": 5,
      "stance": "defensive",
      "description": "",
      "projectile": [],
      "isPD": false,
      "hasImage":true,
      "keywords": [KEYWORD_LIST.en.自动盾牌],
      "actions": [
        {
          "id": "ZHDR-101_A",
          "name": "Mobile Bunker",
          "description": "· May provide Unit Protection to Ally Units.\n· Automatic Shield",
          "type": "Passive",
          "speed": "passive",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ]
    },
    {
      "id": "ZHDR-102",
      "name": "N12 Vanguard II “Crossbow”",
      "type": "medium",
      "score": 24,
      "armor": 4,
      "structure": 0,
      "parray": 0,
      "dodge": 0,
      "electronic": 2,
      "move": 5,
      "stance": "defensive",
      "description": "",
      "projectile": [],
      "isPD": false,
      "hasImage":true,
      "keywords": [KEYWORD_LIST.en.拦截X, KEYWORD_LIST.en.全向射击, KEYWORD_LIST.en.近战射击],
      "actions": [
        {
          "id": "ZHDR-102_A",
          "name": "Full-auto",
          "description": "· Intercept 1\n· Omni-direction Firing\n· Melee Firing",
          "type": "Firing",
          "speed": "auto",
          "range": 6,
          "storage": 0,
          "yellowDice": 2,
          "redDice": 1
        }
      ]
    },
    {
      "id": "ZHDR-103",
      "name": "N13 Vanguard III “Claymore”",
      "type": "medium",
      "score": 24,
      "armor": 4,
      "structure": 0,
      "parray": 0,
      "dodge": 0,
      "electronic": 2,
      "move": 5,
      "stance": "defensive",
      "description": "",
      "projectile": [],
      "isPD": false,
      "hasImage":true,
      "keywords": [KEYWORD_LIST.en.全向射击, KEYWORD_LIST.en.近战射击],
      "actions": [
        {
          "id": "ZHDR-103_A",
          "name": "Full-auto",
          "description": "· Omni-direction Firing\n· Melee Firing",
          "type": "Firing",
          "speed": "auto",
          "range": 4,
          "storage": 0,
          "yellowDice": 4,
          "redDice": 0
        }
      ]
    },
    {
      "id": "ZHDR-104",
      "name": "N14 Vanguard IV “Javelin”",
      "type": "medium",
      "score": 24,
      "armor": 4,
      "structure": 0,
      "parray": 0,
      "dodge": 0,
      "electronic": 2,
      "move": 5,
      "stance": "defensive",
      "description": "",
      "projectile": [
        "ZHAM-001A"
      ],
      "isPD": false,
      "hasImage":true,
      "keywords": [KEYWORD_LIST.en.曲射],
      "actions": [
        {
          "id": "ZHDR-104_A",
          "name": "Missile",
          "description": "· Fire in arc\n· Fire 1 M707 \"Swift\" Missile.",
          "type": "Projectile",
          "speed": "command",
          "range": 6,
          "storage": 2,
          "yellowDice": 0,
          "redDice": 0
        }
      ]
    },
    {
      "id": "ZHDR-106",
      "name": "N113 Aegis II “Ballista”",
      "type": "medium",
      "score": 72,
      "armor": 3,
      "structure": 6,
      "parray": 0,
      "dodge": 0,
      "electronic": 2,
      "move": 4,
      "stance": "offensive",
      "description": "",
      "projectile": [
        "ZHAM-001A"
      ],
      "isPD": false,
      "hasImage":true,
      "keywords": [KEYWORD_LIST.en.穿甲X, KEYWORD_LIST.en.近战射击, KEYWORD_LIST.en.曲射],
      "actions": [
        {
          "id": "ZHDR-106_A",
          "name": "Single Shot",
          "description": "· Armor Piercing 1\n· Melee Firing",
          "type": "Firing",
          "speed": "command",
          "range": 12,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 3
        },
        {
          "id": "ZHDR-106_B",
          "name": "Missile",
          "description": "· Fire in arc\n· Fire 1 M707 \"Swift\" Missile.",
          "type": "Projectile",
          "speed": "command",
          "range": 6,
          "storage": 2,
          "yellowDice": 0,
          "redDice": 0
        }
      ]
    },
    {
      "id": "ZHDR-107",
      "name": "N113 Aegis III “Ram”",
      "type": "medium",
      "score": 60,
      "armor": 3,
      "structure": 6,
      "parray": 0,
      "dodge": 0,
      "electronic": 2,
      "move": 4,
      "stance": "offensive",
      "description": "",
      "projectile": [],
      "isPD": false,
      "hasImage":true,
      "keywords": [KEYWORD_LIST.en.压制],
      "actions": [
        {
          "id": "ZHDR-107_A",
          "name": "Full-auto",
          "description": "· Suppression",
          "type": "Firing",
          "speed": "command",
          "range": 6,
          "storage": 0,
          "yellowDice": 5,
          "redDice": 0
        }
      ]
    },
    {
      "id": "ZHDR-301",
      "name": "N51 “Apologist”",
      "type": "medium",
      "score": 60,
      "armor": 2,
      "structure": 5,
      "parray": 0,
      "dodge": 0,
      "electronic": 2,
      "move": 5,
      "stance": "defensive",
      "description": "",
      "projectile": [],
      "isPD": false,
      "hasImage":true,
      "keywords": [KEYWORD_LIST.en.霰射, KEYWORD_LIST.en.近战射击, KEYWORD_LIST.en.击退X, KEYWORD_LIST.en.自动盾牌],
      "actions": [
        {
          "id": "ZHDR-301_A",
          "name": "Single Shot",
          "description": "· Scatter-shot · Melee Firing\n· Knock Back 1",
          "type": "Firing",
          "speed": "command",
          "range": 3,
          "storage": 0,
          "yellowDice": 3,
          "redDice": 1
        },
        {
          "id": "ZHDR-301_B",
          "name": "Dense Armor Hand",
          "description": "· When this Unit is attacked, may use {Defense} to offset {Heavy Hit}.\n· Automatic Shield.",
          "type": "Passive",
          "speed": "passive",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ]
    },
    {
      "id": "ZHDR-302",
      "name": "N52 “Zealot”",
      "type": "medium",
      "score": 60,
      "armor": 2,
      "structure": 5,
      "parray": 1,
      "dodge": 0,
      "electronic": 2,
      "move": 5,
      "stance": "defensive",
      "description": "",
      "projectile": [],
      "isPD": false,
      "hasImage":true,
      "keywords": [KEYWORD_LIST.en.禁足],
      "actions": [
        {
          "id": "ZHDR-302_A",
          "name": "Chop",
          "description": "· [On Hit] target gains 1 Immobilized Token.",
          "type": "Melee",
          "speed": "command",
          "range": -1,
          "storage": 0,
          "yellowDice": 5,
          "redDice": 0
        },
        {
          "id": "ZHDR-302_B",
          "name": "Martyrdom",
          "description": "· When this unit is destroyed, undergo Detonation immediately.\n· On Detonation, cause Explosion damage to all units within range.",
          "type": "Passive",
          "speed": "passive",
          "range": 1,
          "storage": 0,
          "yellowDice": 2,
          "redDice": 4
        }
      ]
    },
    {
      "id": "ZHDR-204",
      "name": "N305 Eagle I “Misty Eagle”",
      "type": "medium",
      "score": 36,
      "armor": 2,
      "structure": 0,
      "parray": 0,
      "dodge": 7,
      "electronic": 3,
      "move": 6,
      "stance": "mobility",
      "description": "",
      "projectile": [],
      "isPD": false,
      "hasImage":true,
      "keywords": [KEYWORD_LIST.en.低特征],
      "actions": [
        {
          "id": "ZHDR-204_A",
          "name": "Feature reduction",
          "description": "· When Enemy Units within range perform a Firing Action, the target is considered to have Low Profile.",
          "type": "Passive",
          "speed": "passive",
          "range": 5,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ]
    },
    {
      "id": "ZHDR-205",
      "name": "N306 Eagle II “Roaring Eagle”",
      "type": "medium",
      "score": 36,
      "armor": 2,
      "structure": 0,
      "parray": 0,
      "dodge": 7,
      "electronic": 3,
      "move": 6,
      "stance": "mobility",
      "description": "",
      "projectile": [],
      "isPD": false,
      "hasImage":true,
      "keywords": [KEYWORD_LIST.en.电子攻击],
      "actions": [
        {
          "id": "ZHDR-205_A",
          "name": "Scream",
          "description": "· Electronic Attack\n· Perform Electronic Counter Roll with all Enemy Mechs within range, Strength +1, reduce 1 Link of Target if successful.",
          "type": "Tactic",
          "speed": "auto",
          "range": 4,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ]
    },
    {
      "id": "ZHDR-206",
      "name": "N307 Eagle III “Patrol Eagle”",
      "type": "medium",
      "score": 36,
      "armor": 2,
      "structure": 0,
      "parray": 0,
      "dodge": 7,
      "electronic": 3,
      "move": 6,
      "stance": "mobility",
      "description": "",
      "projectile": [],
      "isPD": false,
      "hasImage":true,
      "keywords": [KEYWORD_LIST.en.静默, KEYWORD_LIST.en.电子支援],
      "actions": [
        {
          "id": "ZHDR-206_A",
          "name": "Dynamic Perception",
          "description": "· All Actions of Enemy Units within range lose Silence.",
          "type": "Passive",
          "speed": "passive",
          "range": 3,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        },
        {
          "id": "ZHDR-206_B",
          "name": "Stance feedback",
          "description": "· Electronic Support\n· May make an Ally Mech within range switch Stance, except if in Shutdown Stance.",
          "type": "Tactic",
          "speed": "command",
          "range": 6,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ]
    },
    {
      "id": "ZYDR-108",
      "name": "SU1 “Nest Guardian Swarm”",
      "type": "medium",
      "score": 0,
      "armor": 1,
      "structure": 0,
      "parray": 0,
      "dodge": 2,
      "electronic": 1,
      "move": 5,
      "stance": "mobility",
      "description": "",
      "projectile": [],
      "isPD": false,
      "hasImage":true,
      "keywords": [KEYWORD_LIST.en.全向射击],
      "actions": [
        {
          "id": "ZYDR-108_A",
          "name": "Single Shot",
          "description": "· Omni-direction Firing",
          "type": "Firing",
          "speed": "auto",
          "range": 2,
          "storage": 0,
          "yellowDice": 3,
          "redDice": 0
        },
        {
          "id": "ZYDR-108_B",
          "name": "Armor Patch",
          "description": "· Remove 1 Damaged Token from Ally Unit, then remove this Unit.",
          "type": "Tactic",
          "speed": "command",
          "range": 2,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ]
    }
  ]

export const gofTorso: Part[] = [
    {
      "id": "172",
      "name": "P7\n“Warrior”\nBattle Core",
      "type": "torso",
      "score": 76,
      "armor": 5,
      "structure": 3,
      "parray": 0,
      "dodge": 0,
      "electronic": 3,
      "move": 0,
      "hasImage":true,
      "description": "·Command Generation X：This Unit generates X Command Tokens in the Command Phase.\n·Command Coordination X: After performing this Action, this Mech may issue 1 Command Token to X Ally Drones.",
      "keywords": [KEYWORD_LIST.en.指令生成X, KEYWORD_LIST.en.指令协调X],
      "action": [
        {
          "id": "172_A",
          "name": "N4 Data Link",
          "description": "· Command Generation 4",
          "type": "Passive",
          "size": "m",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        },
        {
          "id": "172_B",
          "name": "Melee Synergy",
          "description": "· Melee Actions by this Unit gain Command Coordination 1.",
          "type": "Passive",
          "size": "m",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ],
      "projectile": [],
      "isPD": false
    },
    {
      "id": "173",
      "name": "P7-A3\n“Centurion”\nNode Core",
      "type": "torso",
      "score": 79,
      "armor": 5,
      "structure": 3,
      "parray": 0,
      "dodge": 0,
      "electronic": 3,
      "move": 0,
      "hasImage":true,
      "description": "·Command Generation X：This Unit generates X Command Tokens in the Command Phase.",
      "keywords": [KEYWORD_LIST.en.指令生成X, KEYWORD_LIST.en.光环],
      "action": [
        {
          "id": "173_A",
          "name": "N4 Data Link",
          "description": "· Command Generation 4",
          "type": "Passive",
          "size": "m",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        },
        {
          "id": "173_B",
          "name": "Fire Control Planning",
          "description": "· Aura\n· Ally Drones within Range performing Firing Actions gain Range + 2 grids.\nThis effect does not stack.",
          "type": "Passive",
          "size": "m",
          "range": 4,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ],
      "projectile": [],
      "isPD": false
    },
    {
      "id": "174",
      "name": "P22\n“Hunter”\nElectronic Warfare Core",
      "type": "torso",
      "score": 91,
      "armor": 5,
      "structure": 4,
      "parray": 0,
      "dodge": 0,
      "electronic": 4,
      "move": 0,
      "hasImage":true,
      "description": "·Command Generation X：At the beginning of each Command Phase, this Unit automatically generates X Command Tokens rather than 1.",
       "keywords": [KEYWORD_LIST.en.指令生成X],
      "action": [
        {
          "id": "174_A",
          "name": "N4 Data Link",
          "description": "· Command Generation 4",
          "type": "Passive",
          "size": "m",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        },
        {
          "id": "174_B",
          "name": "Target Tracing",
          "description": "· When this mech is attacked by Melee/Firing Actions of Enemy Mech, may perfrom a Electronic Conter Roll with Attacker, reduce 1 Link of Target when successful.",
          "type": "Passive",
          "size": "m",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ],
      "projectile": [],
      "isPD": false
    },
    {
      "id": "175",
      "name": "P28\n“Dragoon”\nArmored Core",
      "type": "torso",
      "score": 97,
      "armor": 5,
      "structure": 4,
      "parray": 0,
      "dodge": 0,
      "electronic": 2,
      "move": 0,
      "hasImage":true,
      "description": "·Command Generation X：At the beginning of each Command Phase, this Unit automatically generates X Command Tokens rather than 1.",
      "keywords": [KEYWORD_LIST.en.指令生成X],
      "action": [
        {
          "id": "175_A",
          "name": "A2 Data Link",
          "description": "· Command Generation 2\n· When recieving Commands from this Mech, Ally Drones may perform Automatic Actions instead of Command Actions.",
          "type": "Passive",
          "size": "m",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        },
        {
          "id": "175_B",
          "name": "Dense Armor",
          "description": "· When this Part is designated as the Target Part, may use {Defense} to offset {Heavy Hit}.",
          "type": "Passive",
          "size": "m",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ],
      "projectile": [],
      "isPD": false
    },
    {
      "id": "176",
      "name": "P24\n“Chariot”\nArmored Core",
      "type": "torso",
      "score": 94,
      "armor": 5,
      "structure": 4,
      "parray": 0,
      "dodge": 0,
      "electronic": 2,
      "move": 0,
      "hasImage":true,
      "description": "·Command Generation X：At the beginning of each Command Phase, this Unit automatically generates X Command Tokens rather than 1.",
      "keywords": [KEYWORD_LIST.en.指令生成X],
      "action": [
        {
          "id": "176_A",
          "name": "M2 Data Link",
          "description": "· Command Generation 2\n· When receiving Commands from this Mech, Ally Drones may move 1 grid before performing Actions.",
          "type": "Passive",
          "size": "m",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        },
        {
          "id": "176_B",
          "name": "Dense Armor",
          "description": "· When this Part is designated as the Target Part, may use {Defense} to offset {Heavy Hit}.",
          "type": "Passive",
          "size": "m",
          "range": 0,
          "storage": 0,
          "yellowDice": 0,
          "redDice": 0
        }
      ],
      "projectile": [],
      "isPD": false
    }
  ]

export const rdlProjectiles: Projectile[] = [
  {
    "id": "70",
    "name": "GA-3 高爆榴弹",
    "armor": 0,
    "structure": 0,
    "parray": 0,
    "dodge": 4,
    "electronic": 0,
    "stance": "mobility",
    "keywords": [
      {
        "name": "抛射物"
      },
      {
        "name": "榴弹"
      }
    ],
    "actions": [
      {
        "id": "70_A",
        "name": "延时引爆",
        "description": "· 在当前位置引爆。\n· 引爆时，对相邻的所有单位造成爆炸伤害。",
        "type": "Tactic",
        "speed": "passive",
        "range": 0,
        "storage": 0,
        "yellowDice": 3,
        "redDice": 0
      }
    ]
  },
  {
    "id": "71",
    "name": "MC-3 “利剑”导弹",
    "armor": 0,
    "structure": 0,
    "parray": 0,
    "dodge": 6,
    "electronic": 1,
    "stance": "mobility",
    "keywords": [
      {
        "name": "抛射物"
      },
      {
        "name": "导弹"
      }
    ],
    "actions": [
      {
        "id": "71_A",
        "name": "制导攻击",
        "description": "· 以范围内1个敌方单位为目标，飞行进入目标格并引爆。\n· 引爆时，对目标造成爆炸伤害。",
        "type": "Tactic",
        "speed": "passive",
        "range": 3,
        "storage": 0,
        "yellowDice": 1,
        "redDice": 3
      }
    ]
  },
  {
    "id": "72",
    "name": "MES信标",
    "armor": 1,
    "structure": 0,
    "parray": 0,
    "dodge": 0,
    "electronic": 1,
    "stance": "mobility",
    "keywords": [
      {
        "name": "设置物"
      },
      {
        "name": "信标"
      }
    ],
    "actions": [
      {
        "id": "72_A",
        "name": "诱饵",
        "description": "· 光环\n· 范围内的友军单位获得低特征。",
        "type": "Passive",
        "speed": "passive",
        "range": -1,
        "storage": 0,
        "yellowDice": 0,
        "redDice": 0
      }
    ]
  },
  {
    "id": "73",
    "name": "MR-9 “猎鹰”导弹",
    "armor": 0,
    "structure": 0,
    "parray": 0,
    "dodge": 4,
    "electronic": 1,
    "stance": "mobility",
    "keywords": [
      {
        "name": "抛射物"
      },
      {
        "name": "导弹"
      }
    ],
    "actions": [
      {
        "id": "73_A",
        "name": "制导攻击",
        "description": "· 以范围内1个敌方单位为目标，飞行进入目标格并引爆。\n· 引爆时，对目标造成爆炸伤害。",
        "type": "Tactic",
        "speed": "passive",
        "range": 6,
        "storage": 0,
        "yellowDice": 3,
        "redDice": 0
      }
    ]
  },
  {
    "id": "74",
    "name": "GM-35 反装甲地雷",
    "armor": 2,
    "structure": 0,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "stance": "mobility",
    "keywords": [
      {
        "name": "设置物"
      },
      {
        "name": "地雷"
      }
    ],
    "actions": [
      {
        "id": "74_A",
        "name": "触发",
        "description": "· 地面单位进入地雷所在格时，无需碾压，但总会引爆地雷。\n· 引爆时，对格内所有地面单位造成爆炸伤害。",
        "type": "Passive",
        "speed": "passive",
        "range": 0,
        "storage": 0,
        "yellowDice": 1,
        "redDice": 3
      }
    ]
  },
  {
    "id": "75",
    "name": "B3/1 链接信标",
    "armor": 2,
    "structure": 0,
    "parray": 0,
    "dodge": 0,
    "electronic": 3,
    "stance": "mobility",
    "keywords": [
      {
        "name": "设置物"
      },
      {
        "name": "信标"
      }
    ],
    "actions": [
      {
        "id": "75_A",
        "name": "链接支援",
        "description": "· 范围内的所有友军机甲，恢复1链接值。",
        "type": "Tactic",
        "speed": "passive",
        "range": 3,
        "storage": 0,
        "yellowDice": 0,
        "redDice": 0
      }
    ]
  },
  {
    "id": "76",
    "name": "B3/2 诱饵信标",
    "armor": 2,
    "structure": 2,
    "parray": 0,
    "dodge": 0,
    "electronic": 3,
    "stance": "mobility",
    "keywords": [
      {
        "name": "设置物"
      },
      {
        "name": "信标"
      }
    ],
    "actions": [
      {
        "id": "76_A",
        "name": "诱饵",
        "description": "·本信标为高亮目标。",
        "type": "Passive",
        "speed": "passive",
        "range": 0,
        "storage": 0,
        "yellowDice": 0,
        "redDice": 0
      }
    ]
  },
  {
    "id": "77",
    "name": "B3/3 战术信标",
    "armor": 2,
    "structure": 0,
    "parray": 0,
    "dodge": 0,
    "electronic": 3,
    "stance": "mobility",
    "keywords": [
      {
        "name": "设置物"
      },
      {
        "name": "信标"
      }
    ],
    "actions": [
      {
        "id": "77_A",
        "name": "辅助计算",
        "description": "·光环\n·范围内的友军机甲所有动作获得灵活时机。",
        "type": "Passive",
        "speed": "passive",
        "range": 3,
        "storage": 0,
        "yellowDice": 0,
        "redDice": 0
      }
    ]
  },
  {
    "id": "267",
    "name": "RA-81火箭弹",
    "armor": 0,
    "structure": 0,
    "parray": 0,
    "dodge": 4,
    "electronic": 0,
    "stance": "mobility",
    "keywords": [
      {
        "name": "抛射物"
      },
      {
        "name": "火箭"
      }
    ],
    "actions": [
      {
        "id": "267_A",
        "name": "多级串联战斗部",
        "description": "· 以落点格的1个敌方单位为目标，立即引爆。\n· 引爆时，对目标造成爆炸伤害。",
        "type": "Tactic",
        "speed": "passive",
        "range": 0,
        "storage": 0,
        "yellowDice": 0,
        "redDice": 3
      }
    ]
  },
  {
    "id": "268",
    "name": "GS-2 烟幕弹",
    "armor": 0,
    "structure": 0,
    "parray": 0,
    "dodge": 4,
    "electronic": 0,
    "stance": "mobility",
    "keywords": [
      {
        "name": "抛射物"
      },
      {
        "name": "烟幕弹"
      }
    ],
    "actions": [
      {
        "id": "268_A",
        "name": "发烟",
        "description": "· 立即引爆。\n· 引爆时，以所在格为起点，相连放置最多3烟幕。",
        "type": "Tactic",
        "speed": "passive",
        "range": 0,
        "storage": 0,
        "yellowDice": 0,
        "redDice": 0
      }
    ]
  },
  {
    "id": "521",
    "name": "MR-10 “红隼”导弹",
    "armor": 0,
    "structure": 0,
    "parray": 0,
    "dodge": 4,
    "electronic": 1,
    "stance": "mobility",
    "keywords": [
      {
        "name": "抛射物"
      },
      {
        "name": "导弹"
      }
    ],
    "actions": [
      {
        "id": "521_A",
        "name": "制导攻击",
        "description": "· 以范围内1个敌方单位为目标，飞行进入目标格并引爆。\n· 引爆时，对目标造成爆炸伤害。",
        "type": "Tactic",
        "speed": "passive",
        "range": 6,
        "storage": 0,
        "yellowDice": 0,
        "redDice": 2
      }
    ]
  }
]

export const unProjectiles: Projectile[] = [
  {
    "id": "154",
    "name": "M7手雷",
    "armor": 0,
    "structure": 0,
    "parray": 0,
    "dodge": 2,
    "electronic": 0,
    "stance": "mobility",
    "keywords": [
      {
        "name": "抛射物"
      },
      {
        "name": "榴弹"
      }
    ],
    "actions": [
      {
        "id": "154_A",
        "name": "引爆",
        "description": "· 立即引爆。\n· 引爆时，对所在格的所有单位造成爆炸伤害。",
        "type": "Tactic",
        "speed": "passive",
        "range": 0,
        "storage": 0,
        "yellowDice": 3,
        "redDice": 1
      }
    ]
  },
  {
    "id": "155",
    "name": "M9闪光弹",
    "armor": 0,
    "structure": 0,
    "parray": 0,
    "dodge": 2,
    "electronic": 0,
    "stance": "mobility",
    "keywords": [
      {
        "name": "抛射物"
      },
      {
        "name": "榴弹"
      }
    ],
    "actions": [
      {
        "id": "155_A",
        "name": "引爆",
        "description": "· 立即引爆。\n· 引爆时，范围内所有对本单位有视线的单位均获得1枚火控干扰标记。",
        "type": "Tactic",
        "speed": "passive",
        "range": -1,
        "storage": 0,
        "yellowDice": 0,
        "redDice": 0
      }
    ]
  },
  {
    "id": "156",
    "name": "SGM2“幽灵蛛”自行地雷",
    "armor": 0,
    "structure": 0,
    "parray": 0,
    "dodge": 2,
    "electronic": 2,
    "stance": "mobility",
    "keywords": [
      {
        "name": "抛射物"
      },
      {
        "name": "自行地雷"
      }
    ],
    "actions": [
      {
        "id": "156_A",
        "name": "展开",
        "description": "· 将本单位替换为SGM2“幽灵蛛”自行地雷(展开）。\n· 替换后，如果所在格被占据，直接引爆。",
        "type": "Tactic",
        "speed": "passive",
        "range": 0,
        "storage": 0,
        "yellowDice": 0,
        "redDice": 0
      }
    ]
  },
  {
    "id": "157",
    "name": "RKG70导弹组",
    "armor": 0,
    "structure": 0,
    "parray": 0,
    "dodge": 3,
    "electronic": 1,
    "stance": "mobility",
    "keywords": [
      {
        "name": "抛射物"
      },
      {
        "name": "导弹"
      }
    ],
    "actions": [
      {
        "id": "157_A",
        "name": "制导攻击",
        "description": "· 以范围内1个敌方单位为目标，飞行进入目标格并引爆。\n· 引爆时，对目标造成爆炸伤害。\n· 导弹组3",
        "type": "Tactic",
        "speed": "passive",
        "range": 2,
        "storage": 0,
        "yellowDice": 1,
        "redDice": 2
      }
    ]
  },
  {
    "id": "158",
    "name": "DBP“龟壳”机动掩体",
    "armor": 5,
    "structure": 0,
    "parray": 0,
    "dodge": 0,
    "electronic": 0,
    "stance": "defensive",
    "keywords": [
      {
        "name": "设置物"
      },
      {
        "name": "机动掩体"
      }
    ],
    "actions": [
      {
        "id": "158_A",
        "name": "机动掩体",
        "description": "· 机动掩体\n· 此单位不可被碾压。",
        "type": "Passive",
        "speed": "passive",
        "range": 0,
        "storage": 0,
        "yellowDice": 0,
        "redDice": 0
      }
    ]
  }
];