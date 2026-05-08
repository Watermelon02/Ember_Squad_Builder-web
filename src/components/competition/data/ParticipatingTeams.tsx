import { TournamentTeam } from "../../data/types";

/**
 * 参赛选手列表
 *  - 顺序即对阵顺序：位置 0 vs 1、2 vs 3 …
 *  - null 代表轮空（对手自动晋级）
 *  - 数量无限制，自动补至 2 的幂次
 */

export const PARTICIPATING_TOURNAMENT_TEAMS: (TournamentTeam)[] = [
    // 示例（替换为真实数据）：
    {
        userQQ: '100000001',
        userName: '玩家A',
        team2: {
            "id": "1765701343659",
            "name": "New Squad",
            "faction": "RDL",
            "mechs": [

            ],
            "drones": [
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
                    "keywords": [
                        {
                            "name": "Intercept X",
                            "value": "This Part carries X Interception Tokens."
                        },
                        {
                            "name": "•Omni-direction Firing",
                            "value": "This action has no limit of fire direction."
                        },
                        {
                            "name": "Melee Firing",
                            "value": "This action can still be performed during Melee Lock."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 1,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟核心",
                                    "en": "RDL Core",
                                    "jp": "RDLコア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        },
                        {
                            "box": {
                                "id": 2,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟铁骑",
                                    "en": "RDL Cavalry",
                                    "jp": "RDLカブリ"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        },
                        {
                            "box": {
                                "id": 3,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟重金属",
                                    "en": "RDL Heavy Metal",
                                    "jp": "RDLヘビーメタル"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
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
                    "keywords": [
                        {
                            "name": "Volley X",
                            "value": "Fire or deploy up to X Projectiles and consume an equal amount of Ammo Tokens."
                        },
                        {
                            "name": "Fire in arc",
                            "value": "This action does not require visual to the landing point or the target."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 1,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟核心",
                                    "en": "RDL Core",
                                    "jp": "RDLコア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        },
                        {
                            "box": {
                                "id": 2,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟铁骑",
                                    "en": "RDL Cavalry",
                                    "jp": "RDLカブリ"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        },
                        {
                            "box": {
                                "id": 3,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟重金属",
                                    "en": "RDL Heavy Metal",
                                    "jp": "RDLヘビーメタル"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
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
                    "keywords": [
                        {
                            "name": "Fire Control Interference",
                            "value": "Units bearing a Fire Control Interference Token cannot perform Firing Actions or Interception.Projectiles with an Electronic Values are destroyed immediately if they obtain a Fire Control Interference Token."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 13,
                                "faction": [
                                    "PD"
                                ],
                                "name": {
                                    "zh": "LAB 星环动力 收割者轻型",
                                    "en": "LAB PD Reaper Type 1",
                                    "jp": "LAB PD リーパー タイプ1"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
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
                    "isPD": true,
                    "projectile": [
                        "PDAM-001"
                    ],
                    "keywords": [
                        {
                            "name": "Volley X",
                            "value": "Fire or deploy up to X Projectiles and consume an equal amount of Ammo Tokens."
                        },
                        {
                            "name": "Fire in arc",
                            "value": "This action does not require visual to the landing point or the target."
                        },
                        {
                            "name": "Fire Control Interference",
                            "value": "Units bearing a Fire Control Interference Token cannot perform Firing Actions or Interception.Projectiles with an Electronic Values are destroyed immediately if they obtain a Fire Control Interference Token."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 13,
                                "faction": [
                                    "PD"
                                ],
                                "name": {
                                    "zh": "LAB 星环动力 收割者轻型",
                                    "en": "LAB PD Reaper Type 1",
                                    "jp": "LAB PD リーパー タイプ1"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
                }
            ],
            "tacticCards": [],
            "totalScore": 414,
            "mechCount": 1,
            "largeDroneCount": 2,
            "mediumDroneCount": 2,
            "smallDroneCount": 0,
            "deviceID": "d6eeef82f83d4f5158d95ea55eab8837231d6e7061c6ee95c26275204fe3d499"
        },
        team1: {
            "id": "1764243819518",
            "name": "新小队",
            "faction": "UN",
            "mechs": [
                {
                    "id": "1775611833174",
                    "name": "新机体",
                    "parts": {
                        "torso": {
                            "id": "555",
                            "name": "TM35BT 金牛 实验核心",
                            "score": 84,
                            "armor": 5,
                            "structure": 4,
                            "parray": 0,
                            "dodge": 1,
                            "electronic": 4,
                            "type": "torso",
                            "description": "",
                            "imgSrc": "",
                            "tags": [],
                            "keywords": [
                                {
                                    "name": "KC装甲",
                                    "value": "当本机受击时，可消耗本部件的充能标记，将受击骰结果中的 闪电 视为 防御。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 17,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "单机包-金牛",
                                            "en": "Single Pack Taurus",
                                            "jp": "シングル タウラス"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "chasis": {
                            "id": "100",
                            "name": "LM210S 隐秘下肢",
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
                            "keywords": [
                                {
                                    "name": "静默",
                                    "value": "执行本动作时不会解除光学迷彩与低特征。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 5,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "手术刀",
                                            "en": "Scalpel",
                                            "jp": "スカルペル"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 2
                                }
                            ]
                        },
                        "leftHand": {
                            "id": "540",
                            "name": "S9“流星”盾 + IGX106离子炮",
                            "type": "leftHand",
                            "score": 69,
                            "armor": 4,
                            "structure": 0,
                            "parray": 2,
                            "dodge": 1,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "keywords": [
                                {
                                    "name": "空手",
                                    "value": ""
                                },
                                {
                                    "name": "震撼",
                                    "value": "闪电 扣除对方1点链接值。(注：效果可叠加)"
                                },
                                {
                                    "name": "毁伤",
                                    "value": "溢出伤害可结算至结构值。"
                                },
                                {
                                    "name": "霰射",
                                    "value": "如果目标为机甲，溢出伤害结算至目标另1个随机部件。"
                                },
                                {
                                    "name": "离子武器",
                                    "value": "命中拥有脆弱标记的目标时， 闪电 可视为 重击 。"
                                },
                                {
                                    "name": "近战射击",
                                    "value": "在近战锁定中仍可执行本动作。"
                                }
                            ],
                            "action": [
                                {
                                    "id": "540_A",
                                    "name": "盾击",
                                    "description": "· 震撼",
                                    "type": "Melee",
                                    "size": "s",
                                    "range": -1,
                                    "storage": 0,
                                    "yellowDice": 5,
                                    "redDice": 0
                                },
                                {
                                    "id": "540_B",
                                    "name": "点射",
                                    "description": "· [充能]获得毁伤。\r\n· 霰射\r\n· 离子武器\r\n· 近战射击",
                                    "type": "Firing",
                                    "size": "s",
                                    "range": 3,
                                    "storage": 0,
                                    "yellowDice": 3,
                                    "redDice": 1
                                }
                            ],
                            "projectile": [],
                            "isPD": false,
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "rightHand": {
                            "id": "148",
                            "name": "G6霰射炮 + M5刺桩",
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
                            "keywords": [
                                {
                                    "name": "霰射",
                                    "value": "如果目标为机甲，溢出伤害结算至目标另1个随机部件。"
                                },
                                {
                                    "name": "激光武器",
                                    "value": "命中使目标获得脆弱标记。"
                                },
                                {
                                    "name": "近战射击",
                                    "value": "在近战锁定中仍可执行本动作。"
                                },
                                {
                                    "name": "毁伤",
                                    "value": "溢出伤害可结算至结构值。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 6,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "破门锤",
                                            "en": "Doorbreaker",
                                            "jp": "ドアブレイカー"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 2
                                }
                            ]
                        },
                        "backpack": {
                            "id": "538",
                            "name": "JP5机动提升包",
                            "type": "backpack",
                            "score": 60,
                            "armor": 3,
                            "structure": 0,
                            "parray": 0,
                            "dodge": 2,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "keywords": [
                                {
                                    "name": "负载",
                                    "value": "一个部件被无人机携带。无人机并不会获得这个部件的能力与属性。"
                                }
                            ],
                            "action": [
                                {
                                    "id": "538_A",
                                    "name": "滑跃",
                                    "description": "· 本机调整移动距离+1。\r\n· 本部件无法作为负载。",
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
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        }
                    },
                    "pilot": {
                        "id": "LPA-19",
                        "name": "石英",
                        "score": 24,
                        "LV": 4,
                        "faction": "UN",
                        "swift": 2,
                        "melee": 5,
                        "projectile": 4,
                        "firing": 4,
                        "moving": 6,
                        "tactic": 6,
                        "trait": "沉著",
                        "traitDescription": "· 每回合结束时恢复1点链接值。",
                        "box": {
                            "id": 4,
                            "faction": [
                                "UN"
                            ],
                            "name": {
                                "zh": "核心",
                                "en": "Core",
                                "jp": "コア"
                            },
                            "hasImage": true
                        }
                    }
                },
                {
                    "id": "1775611860107",
                    "name": "新机体",
                    "parts": {
                        "torso": {
                            "id": "555",
                            "name": "TM35BT 金牛 实验核心",
                            "score": 84,
                            "armor": 5,
                            "structure": 4,
                            "parray": 0,
                            "dodge": 1,
                            "electronic": 4,
                            "type": "torso",
                            "description": "",
                            "imgSrc": "",
                            "tags": [],
                            "keywords": [
                                {
                                    "name": "KC装甲",
                                    "value": "当本机受击时，可消耗本部件的充能标记，将受击骰结果中的 闪电 视为 防御。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 17,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "单机包-金牛",
                                            "en": "Single Pack Taurus",
                                            "jp": "シングル タウラス"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "chasis": {
                            "id": "250",
                            "name": "LM210SO 隐秘下肢试作型",
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
                            "keywords": [
                                {
                                    "name": "静默",
                                    "value": "执行本动作时不会解除光学迷彩与低特征。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 12,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "LAB 试作章鱼",
                                            "en": "Trial Octopus",
                                            "jp": "トライアル UN オクトパス"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "leftHand": {
                            "id": "150",
                            "name": "RHX23暴雨突击手枪（左）",
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
                            "keywords": [
                                {
                                    "name": "全向射击",
                                    "value": "本动作没有射界限制。"
                                },
                                {
                                    "name": "压制",
                                    "value": "被本动作宣布为目标的机甲会立刻切换为防御姿态（处于宕机姿态的单位不受此影响）。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 6,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "破门锤",
                                            "en": "Doorbreaker",
                                            "jp": "ドアブレイカー"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                },
                                {
                                    "box": {
                                        "id": 4,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "核心",
                                            "en": "Core",
                                            "jp": "コア"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "rightHand": {
                            "id": "115",
                            "name": "S100大盾 + R6SS肩炮",
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
                            "keywords": [
                                {
                                    "name": "激光武器",
                                    "value": "命中使目标获得脆弱标记。"
                                },
                                {
                                    "name": "静止",
                                    "value": "在本次行动机会中，如果本单位执行本动作前没有发生位移，也没有改变朝向，则可以获得本条特殊规则的效果。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 4,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "核心",
                                            "en": "Core",
                                            "jp": "コア"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "backpack": {
                            "id": "084",
                            "name": "DBP龟壳掩体挂架",
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
                            ],
                            "keywords": [],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 5,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "手术刀",
                                            "en": "Scalpel",
                                            "jp": "スカルペル"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        }
                    },
                    "pilot": {
                        "id": "LPA-23-2",
                        "name": "玉髓 温柔和弦",
                        "score": 24,
                        "LV": 4,
                        "faction": "UN",
                        "swift": 6,
                        "melee": 2,
                        "projectile": 3,
                        "firing": 5,
                        "moving": 4,
                        "tactic": 4,
                        "trait": "装饰音",
                        "traitDescription": "· 当本机执行射击动作时，如果目标处于3格内范围，本次射击动作+1Y。",
                        "box": {
                            "id": 18,
                            "faction": [
                                "RDL",
                                "UN"
                            ],
                            "name": {
                                "zh": "对战包-突袭",
                                "en": "Combat Pack Raid",
                                "jp": "コンバットレイド"
                            },
                            "hasImage": true
                        }
                    }
                }
            ],
            "drones": [
                {
                    "id": "543",
                    "name": "ADK15P离子型豪猪",
                    "type": "medium",
                    "score": 70,
                    "armor": 4,
                    "structure": 2,
                    "parray": 0,
                    "dodge": 0,
                    "electronic": 2,
                    "move": 5,
                    "stance": "defensive",
                    "description": "",
                    "projectile": [],
                    "isPD": false,
                    "keywords": [
                        {
                            "name": "毁伤",
                            "value": "溢出伤害可结算至结构值。"
                        },
                        {
                            "name": "离子武器",
                            "value": "命中拥有脆弱标记的目标时， 闪电 可视为 重击 。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 18,
                                "faction": [
                                    "RDL",
                                    "UN"
                                ],
                                "name": {
                                    "zh": "对战包-突袭",
                                    "en": "Combat Pack Raid",
                                    "jp": "コンバットレイド"
                                },
                                "hasImage": false
                            },
                            "quantityPerBox": 1
                        }
                    ],
                    "hasImage": false,
                    "actions": [
                        {
                            "id": "543_A",
                            "name": "点射",
                            "description": "· [充能]获得毁伤。\r\n· 离子武器",
                            "type": "Firing",
                            "speed": "auto",
                            "range": 12,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 4
                        },
                        {
                            "id": "543_B",
                            "name": "充能",
                            "description": "· 为本机进行充能。",
                            "type": "Tactic",
                            "speed": "command",
                            "range": 0,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 0
                        }
                    ]
                },
                {
                    "id": "166",
                    "name": "ADK60S 干扰型渡鸦",
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
                    "keywords": [
                        {
                            "name": "电子攻击",
                            "value": "本动作是一个电子攻击（EA）动作，当有效果限制或强化“电子攻击“时，本动作受其影响；若无进一步描述，本动作以敌方单位为目标，需要进行电子对抗投骰，如果成功则起效。"
                        },
                        {
                            "name": "火控干扰",
                            "value": "携带火控干扰标记的单位不能执行射击动作，也不能进行拦截。有电子值的抛射物在获得火控干扰标记时直接被摧毁。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 4,
                                "faction": [
                                    "UN"
                                ],
                                "name": {
                                    "zh": "核心",
                                    "en": "Core",
                                    "jp": "コア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        }
                    ]
                },
                {
                    "id": "543",
                    "name": "ADK15P离子型豪猪",
                    "type": "medium",
                    "score": 70,
                    "armor": 4,
                    "structure": 2,
                    "parray": 0,
                    "dodge": 0,
                    "electronic": 2,
                    "move": 5,
                    "stance": "defensive",
                    "description": "",
                    "projectile": [],
                    "isPD": false,
                    "keywords": [
                        {
                            "name": "毁伤",
                            "value": "溢出伤害可结算至结构值。"
                        },
                        {
                            "name": "离子武器",
                            "value": "命中拥有脆弱标记的目标时， 闪电 可视为 重击 。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 18,
                                "faction": [
                                    "RDL",
                                    "UN"
                                ],
                                "name": {
                                    "zh": "对战包-突袭",
                                    "en": "Combat Pack Raid",
                                    "jp": "コンバットレイド"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ],
                    "actions": [
                        {
                            "id": "543_A",
                            "name": "点射",
                            "description": "· [充能]获得毁伤。\r\n· 离子武器",
                            "type": "Firing",
                            "speed": "auto",
                            "range": 12,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 4
                        },
                        {
                            "id": "543_B",
                            "name": "充能",
                            "description": "· 为本机进行充能。",
                            "type": "Tactic",
                            "speed": "command",
                            "range": 0,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 0
                        }
                    ]
                },
                {
                    "id": "166",
                    "name": "ADK60S 干扰型渡鸦",
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
                    "keywords": [
                        {
                            "name": "电子攻击",
                            "value": "本动作是一个电子攻击（EA）动作，当有效果限制或强化“电子攻击“时，本动作受其影响；若无进一步描述，本动作以敌方单位为目标，需要进行电子对抗投骰，如果成功则起效。"
                        },
                        {
                            "name": "火控干扰",
                            "value": "携带火控干扰标记的单位不能执行射击动作，也不能进行拦截。有电子值的抛射物在获得火控干扰标记时直接被摧毁。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 4,
                                "faction": [
                                    "UN"
                                ],
                                "name": {
                                    "zh": "核心",
                                    "en": "Core",
                                    "jp": "コア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        }
                    ]
                }
            ],
            "tacticCards": [],
            "totalScore": 893,
            "mechCount": 2,
            "largeDroneCount": 0,
            "mediumDroneCount": 4,
            "smallDroneCount": 0,
            "deviceID": "d6eeef82f83d4f5158d95ea55eab8837231d6e7061c6ee95c26275204fe3d499"
        }
    },
    {
        userQQ: '1446157077',
        userName: '玩家B',
        team2: {
            "id": "1765701343659",
            "name": "New Squad",
            "faction": "RDL",
            "mechs": [
                {
                    "id": "1775033551292",
                    "name": "对战包-复盟",
                    "parts": {
                        "torso": {
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
                            "keywords": [],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 1,
                                        "faction": [
                                            "RDL"
                                        ],
                                        "name": {
                                            "zh": "核心",
                                            "en": "Core",
                                            "jp": "コア"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 4
                                },
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "chasis": {
                            "id": "534",
                            "name": "RL-08C Armored Chassis",
                            "type": "chasis",
                            "score": 24,
                            "armor": 5,
                            "structure": 1,
                            "parray": 0,
                            "dodge": 3,
                            "electronic": 0,
                            "move": 1,
                            "description": "",
                            "keywords": [],
                            "action": [],
                            "projectile": [],
                            "isPD": false,
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "rightHand": {
                            "id": "536",
                            "name": "PC-6 Shotgun",
                            "type": "rightHand",
                            "score": 48,
                            "armor": 4,
                            "structure": 0,
                            "parray": 0,
                            "dodge": 0,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "throwIndex": "537",
                            "keywords": [
                                {
                                    "name": "Melee Firing",
                                    "value": "This action can still be performed during Melee Lock."
                                }
                            ],
                            "projectile": [],
                            "isPD": false,
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "backpack": {
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
                            "keywords": [
                                {
                                    "name": "Intercept X",
                                    "value": "This Part carries X Interception Tokens."
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 1,
                                        "faction": [
                                            "RDL"
                                        ],
                                        "name": {
                                            "zh": "核心",
                                            "en": "Core",
                                            "jp": "コア"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                },
                                {
                                    "box": {
                                        "id": 16,
                                        "faction": [
                                            "RDL"
                                        ],
                                        "name": {
                                            "zh": "单机包-沙丘",
                                            "en": "Single Pack Dune",
                                            "jp": "シングル デューン"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                },
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        }
                    },
                    "pilot": {
                        "id": "FPA-06",
                        "name": "锁眼",
                        "score": 12,
                        "LV": 4,
                        "faction": "RDL",
                        "swift": 2,
                        "melee": 5,
                        "projectile": 4,
                        "firing": 6,
                        "moving": 6,
                        "tactic": 7,
                        "trait": "功率加大",
                        "traitDescription": "· 本机的光环、电子攻击与电子支援，+1范围。",
                        "box": {
                            "id": 2,
                            "faction": [
                                "RDL"
                            ],
                            "name": {
                                "zh": "铁骑",
                                "en": "Cavalry",
                                "jp": "カブリ"
                            },
                            "hasImage": true
                        }
                    }
                }
            ],
            "drones": [
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
                    "keywords": [
                        {
                            "name": "Intercept X",
                            "value": "This Part carries X Interception Tokens."
                        },
                        {
                            "name": "•Omni-direction Firing",
                            "value": "This action has no limit of fire direction."
                        },
                        {
                            "name": "Melee Firing",
                            "value": "This action can still be performed during Melee Lock."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 1,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟核心",
                                    "en": "RDL Core",
                                    "jp": "RDLコア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        },
                        {
                            "box": {
                                "id": 2,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟铁骑",
                                    "en": "RDL Cavalry",
                                    "jp": "RDLカブリ"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        },
                        {
                            "box": {
                                "id": 3,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟重金属",
                                    "en": "RDL Heavy Metal",
                                    "jp": "RDLヘビーメタル"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
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
                    "keywords": [
                        {
                            "name": "Volley X",
                            "value": "Fire or deploy up to X Projectiles and consume an equal amount of Ammo Tokens."
                        },
                        {
                            "name": "Fire in arc",
                            "value": "This action does not require visual to the landing point or the target."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 1,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟核心",
                                    "en": "RDL Core",
                                    "jp": "RDLコア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        },
                        {
                            "box": {
                                "id": 2,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟铁骑",
                                    "en": "RDL Cavalry",
                                    "jp": "RDLカブリ"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        },
                        {
                            "box": {
                                "id": 3,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟重金属",
                                    "en": "RDL Heavy Metal",
                                    "jp": "RDLヘビーメタル"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
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
                    "keywords": [
                        {
                            "name": "Fire Control Interference",
                            "value": "Units bearing a Fire Control Interference Token cannot perform Firing Actions or Interception.Projectiles with an Electronic Values are destroyed immediately if they obtain a Fire Control Interference Token."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 13,
                                "faction": [
                                    "PD"
                                ],
                                "name": {
                                    "zh": "LAB 星环动力 收割者轻型",
                                    "en": "LAB PD Reaper Type 1",
                                    "jp": "LAB PD リーパー タイプ1"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
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
                    "isPD": true,
                    "projectile": [
                        "PDAM-001"
                    ],
                    "keywords": [
                        {
                            "name": "Volley X",
                            "value": "Fire or deploy up to X Projectiles and consume an equal amount of Ammo Tokens."
                        },
                        {
                            "name": "Fire in arc",
                            "value": "This action does not require visual to the landing point or the target."
                        },
                        {
                            "name": "Fire Control Interference",
                            "value": "Units bearing a Fire Control Interference Token cannot perform Firing Actions or Interception.Projectiles with an Electronic Values are destroyed immediately if they obtain a Fire Control Interference Token."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 13,
                                "faction": [
                                    "PD"
                                ],
                                "name": {
                                    "zh": "LAB 星环动力 收割者轻型",
                                    "en": "LAB PD Reaper Type 1",
                                    "jp": "LAB PD リーパー タイプ1"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
                }
            ],
            "tacticCards": [],
            "totalScore": 414,
            "mechCount": 1,
            "largeDroneCount": 2,
            "mediumDroneCount": 2,
            "smallDroneCount": 0,
            "deviceID": "d6eeef82f83d4f5158d95ea55eab8837231d6e7061c6ee95c26275204fe3d499"
        },
        team1: {
            "id": "1764243819518",
            "name": "新小队",
            "faction": "UN",
            "mechs": [
                {
                    "id": "1775611833174",
                    "name": "新机体",
                    "parts": {
                        "torso": {
                            "id": "555",
                            "name": "TM35BT 金牛 实验核心",
                            "score": 84,
                            "armor": 5,
                            "structure": 4,
                            "parray": 0,
                            "dodge": 1,
                            "electronic": 4,
                            "type": "torso",
                            "description": "",
                            "imgSrc": "",
                            "tags": [],
                            "keywords": [
                                {
                                    "name": "KC装甲",
                                    "value": "当本机受击时，可消耗本部件的充能标记，将受击骰结果中的 闪电 视为 防御。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 17,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "单机包-金牛",
                                            "en": "Single Pack Taurus",
                                            "jp": "シングル タウラス"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "chasis": {
                            "id": "100",
                            "name": "LM210S 隐秘下肢",
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
                            "keywords": [
                                {
                                    "name": "静默",
                                    "value": "执行本动作时不会解除光学迷彩与低特征。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 5,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "手术刀",
                                            "en": "Scalpel",
                                            "jp": "スカルペル"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 2
                                }
                            ]
                        },
                        "leftHand": {
                            "id": "540",
                            "name": "S9“流星”盾 + IGX106离子炮",
                            "type": "leftHand",
                            "score": 69,
                            "armor": 4,
                            "structure": 0,
                            "parray": 2,
                            "dodge": 1,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "keywords": [
                                {
                                    "name": "空手",
                                    "value": ""
                                },
                                {
                                    "name": "震撼",
                                    "value": "闪电 扣除对方1点链接值。(注：效果可叠加)"
                                },
                                {
                                    "name": "毁伤",
                                    "value": "溢出伤害可结算至结构值。"
                                },
                                {
                                    "name": "霰射",
                                    "value": "如果目标为机甲，溢出伤害结算至目标另1个随机部件。"
                                },
                                {
                                    "name": "离子武器",
                                    "value": "命中拥有脆弱标记的目标时， 闪电 可视为 重击 。"
                                },
                                {
                                    "name": "近战射击",
                                    "value": "在近战锁定中仍可执行本动作。"
                                }
                            ],
                            "action": [
                                {
                                    "id": "540_A",
                                    "name": "盾击",
                                    "description": "· 震撼",
                                    "type": "Melee",
                                    "size": "s",
                                    "range": -1,
                                    "storage": 0,
                                    "yellowDice": 5,
                                    "redDice": 0
                                },
                                {
                                    "id": "540_B",
                                    "name": "点射",
                                    "description": "· [充能]获得毁伤。\r\n· 霰射\r\n· 离子武器\r\n· 近战射击",
                                    "type": "Firing",
                                    "size": "s",
                                    "range": 3,
                                    "storage": 0,
                                    "yellowDice": 3,
                                    "redDice": 1
                                }
                            ],
                            "projectile": [],
                            "isPD": false,
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "rightHand": {
                            "id": "148",
                            "name": "G6霰射炮 + M5刺桩",
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
                            "keywords": [
                                {
                                    "name": "霰射",
                                    "value": "如果目标为机甲，溢出伤害结算至目标另1个随机部件。"
                                },
                                {
                                    "name": "激光武器",
                                    "value": "命中使目标获得脆弱标记。"
                                },
                                {
                                    "name": "近战射击",
                                    "value": "在近战锁定中仍可执行本动作。"
                                },
                                {
                                    "name": "毁伤",
                                    "value": "溢出伤害可结算至结构值。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 6,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "破门锤",
                                            "en": "Doorbreaker",
                                            "jp": "ドアブレイカー"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 2
                                }
                            ]
                        },
                        "backpack": {
                            "id": "538",
                            "name": "JP5机动提升包",
                            "type": "backpack",
                            "score": 60,
                            "armor": 3,
                            "structure": 0,
                            "parray": 0,
                            "dodge": 2,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "keywords": [
                                {
                                    "name": "负载",
                                    "value": "一个部件被无人机携带。无人机并不会获得这个部件的能力与属性。"
                                }
                            ],
                            "action": [
                                {
                                    "id": "538_A",
                                    "name": "滑跃",
                                    "description": "· 本机调整移动距离+1。\r\n· 本部件无法作为负载。",
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
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        }
                    },
                    "pilot": {
                        "id": "LPA-19",
                        "name": "石英",
                        "score": 24,
                        "LV": 4,
                        "faction": "UN",
                        "swift": 2,
                        "melee": 5,
                        "projectile": 4,
                        "firing": 4,
                        "moving": 6,
                        "tactic": 6,
                        "trait": "沉著",
                        "traitDescription": "· 每回合结束时恢复1点链接值。",
                        "box": {
                            "id": 4,
                            "faction": [
                                "UN"
                            ],
                            "name": {
                                "zh": "核心",
                                "en": "Core",
                                "jp": "コア"
                            },
                            "hasImage": true
                        }
                    }
                },
                {
                    "id": "1775611860107",
                    "name": "新机体",
                    "parts": {
                        "torso": {
                            "id": "555",
                            "name": "TM35BT 金牛 实验核心",
                            "score": 84,
                            "armor": 5,
                            "structure": 4,
                            "parray": 0,
                            "dodge": 1,
                            "electronic": 4,
                            "type": "torso",
                            "description": "",
                            "imgSrc": "",
                            "tags": [],
                            "keywords": [
                                {
                                    "name": "KC装甲",
                                    "value": "当本机受击时，可消耗本部件的充能标记，将受击骰结果中的 闪电 视为 防御。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 17,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "单机包-金牛",
                                            "en": "Single Pack Taurus",
                                            "jp": "シングル タウラス"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "chasis": {
                            "id": "250",
                            "name": "LM210SO 隐秘下肢试作型",
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
                            "keywords": [
                                {
                                    "name": "静默",
                                    "value": "执行本动作时不会解除光学迷彩与低特征。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 12,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "LAB 试作章鱼",
                                            "en": "Trial Octopus",
                                            "jp": "トライアル UN オクトパス"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "leftHand": {
                            "id": "150",
                            "name": "RHX23暴雨突击手枪（左）",
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
                            "keywords": [
                                {
                                    "name": "全向射击",
                                    "value": "本动作没有射界限制。"
                                },
                                {
                                    "name": "压制",
                                    "value": "被本动作宣布为目标的机甲会立刻切换为防御姿态（处于宕机姿态的单位不受此影响）。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 6,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "破门锤",
                                            "en": "Doorbreaker",
                                            "jp": "ドアブレイカー"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                },
                                {
                                    "box": {
                                        "id": 4,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "核心",
                                            "en": "Core",
                                            "jp": "コア"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "rightHand": {
                            "id": "115",
                            "name": "S100大盾 + R6SS肩炮",
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
                            "keywords": [
                                {
                                    "name": "激光武器",
                                    "value": "命中使目标获得脆弱标记。"
                                },
                                {
                                    "name": "静止",
                                    "value": "在本次行动机会中，如果本单位执行本动作前没有发生位移，也没有改变朝向，则可以获得本条特殊规则的效果。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 4,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "核心",
                                            "en": "Core",
                                            "jp": "コア"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "backpack": {
                            "id": "084",
                            "name": "DBP龟壳掩体挂架",
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
                            ],
                            "keywords": [],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 5,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "手术刀",
                                            "en": "Scalpel",
                                            "jp": "スカルペル"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        }
                    },
                    "pilot": {
                        "id": "LPA-23-2",
                        "name": "玉髓 温柔和弦",
                        "score": 24,
                        "LV": 4,
                        "faction": "UN",
                        "swift": 6,
                        "melee": 2,
                        "projectile": 3,
                        "firing": 5,
                        "moving": 4,
                        "tactic": 4,
                        "trait": "装饰音",
                        "traitDescription": "· 当本机执行射击动作时，如果目标处于3格内范围，本次射击动作+1Y。",
                        "box": {
                            "id": 18,
                            "faction": [
                                "RDL",
                                "UN"
                            ],
                            "name": {
                                "zh": "对战包-突袭",
                                "en": "Combat Pack Raid",
                                "jp": "コンバットレイド"
                            },
                            "hasImage": true
                        }
                    }
                }
            ],
            "drones": [
                {
                    "id": "543",
                    "name": "ADK15P离子型豪猪",
                    "type": "medium",
                    "score": 70,
                    "armor": 4,
                    "structure": 2,
                    "parray": 0,
                    "dodge": 0,
                    "electronic": 2,
                    "move": 5,
                    "stance": "defensive",
                    "description": "",
                    "projectile": [],
                    "isPD": false,
                    "keywords": [
                        {
                            "name": "毁伤",
                            "value": "溢出伤害可结算至结构值。"
                        },
                        {
                            "name": "离子武器",
                            "value": "命中拥有脆弱标记的目标时， 闪电 可视为 重击 。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 18,
                                "faction": [
                                    "RDL",
                                    "UN"
                                ],
                                "name": {
                                    "zh": "对战包-突袭",
                                    "en": "Combat Pack Raid",
                                    "jp": "コンバットレイド"
                                },
                                "hasImage": false
                            },
                            "quantityPerBox": 1
                        }
                    ],
                    "hasImage": false,
                    "actions": [
                        {
                            "id": "543_A",
                            "name": "点射",
                            "description": "· [充能]获得毁伤。\r\n· 离子武器",
                            "type": "Firing",
                            "speed": "auto",
                            "range": 12,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 4
                        },
                        {
                            "id": "543_B",
                            "name": "充能",
                            "description": "· 为本机进行充能。",
                            "type": "Tactic",
                            "speed": "command",
                            "range": 0,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 0
                        }
                    ]
                },
                {
                    "id": "166",
                    "name": "ADK60S 干扰型渡鸦",
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
                    "keywords": [
                        {
                            "name": "电子攻击",
                            "value": "本动作是一个电子攻击（EA）动作，当有效果限制或强化“电子攻击“时，本动作受其影响；若无进一步描述，本动作以敌方单位为目标，需要进行电子对抗投骰，如果成功则起效。"
                        },
                        {
                            "name": "火控干扰",
                            "value": "携带火控干扰标记的单位不能执行射击动作，也不能进行拦截。有电子值的抛射物在获得火控干扰标记时直接被摧毁。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 4,
                                "faction": [
                                    "UN"
                                ],
                                "name": {
                                    "zh": "核心",
                                    "en": "Core",
                                    "jp": "コア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        }
                    ]
                },
                {
                    "id": "543",
                    "name": "ADK15P离子型豪猪",
                    "type": "medium",
                    "score": 70,
                    "armor": 4,
                    "structure": 2,
                    "parray": 0,
                    "dodge": 0,
                    "electronic": 2,
                    "move": 5,
                    "stance": "defensive",
                    "description": "",
                    "projectile": [],
                    "isPD": false,
                    "keywords": [
                        {
                            "name": "毁伤",
                            "value": "溢出伤害可结算至结构值。"
                        },
                        {
                            "name": "离子武器",
                            "value": "命中拥有脆弱标记的目标时， 闪电 可视为 重击 。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 18,
                                "faction": [
                                    "RDL",
                                    "UN"
                                ],
                                "name": {
                                    "zh": "对战包-突袭",
                                    "en": "Combat Pack Raid",
                                    "jp": "コンバットレイド"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ],
                    "actions": [
                        {
                            "id": "543_A",
                            "name": "点射",
                            "description": "· [充能]获得毁伤。\r\n· 离子武器",
                            "type": "Firing",
                            "speed": "auto",
                            "range": 12,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 4
                        },
                        {
                            "id": "543_B",
                            "name": "充能",
                            "description": "· 为本机进行充能。",
                            "type": "Tactic",
                            "speed": "command",
                            "range": 0,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 0
                        }
                    ]
                },
                {
                    "id": "166",
                    "name": "ADK60S 干扰型渡鸦",
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
                    "keywords": [
                        {
                            "name": "电子攻击",
                            "value": "本动作是一个电子攻击（EA）动作，当有效果限制或强化“电子攻击“时，本动作受其影响；若无进一步描述，本动作以敌方单位为目标，需要进行电子对抗投骰，如果成功则起效。"
                        },
                        {
                            "name": "火控干扰",
                            "value": "携带火控干扰标记的单位不能执行射击动作，也不能进行拦截。有电子值的抛射物在获得火控干扰标记时直接被摧毁。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 4,
                                "faction": [
                                    "UN"
                                ],
                                "name": {
                                    "zh": "核心",
                                    "en": "Core",
                                    "jp": "コア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        }
                    ]
                }
            ],
            "tacticCards": [],
            "totalScore": 893,
            "mechCount": 2,
            "largeDroneCount": 0,
            "mediumDroneCount": 4,
            "smallDroneCount": 0,
            "deviceID": "d6eeef82f83d4f5158d95ea55eab8837231d6e7061c6ee95c26275204fe3d499"
        }
    },
    {
        userQQ: '2446157077',
        userName: '玩家C',
        team2: {
            "id": "1765701343659",
            "name": "New Squad",
            "faction": "RDL",
            "mechs": [
                {
                    "id": "1775033551292",
                    "name": "对战包-复盟",
                    "parts": {
                        "torso": {
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
                            "keywords": [],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 1,
                                        "faction": [
                                            "RDL"
                                        ],
                                        "name": {
                                            "zh": "核心",
                                            "en": "Core",
                                            "jp": "コア"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 4
                                },
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "chasis": {
                            "id": "534",
                            "name": "RL-08C Armored Chassis",
                            "type": "chasis",
                            "score": 24,
                            "armor": 5,
                            "structure": 1,
                            "parray": 0,
                            "dodge": 3,
                            "electronic": 0,
                            "move": 1,
                            "description": "",
                            "keywords": [],
                            "action": [],
                            "projectile": [],
                            "isPD": false,
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "rightHand": {
                            "id": "536",
                            "name": "PC-6 Shotgun",
                            "type": "rightHand",
                            "score": 48,
                            "armor": 4,
                            "structure": 0,
                            "parray": 0,
                            "dodge": 0,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "throwIndex": "537",
                            "keywords": [
                                {
                                    "name": "Melee Firing",
                                    "value": "This action can still be performed during Melee Lock."
                                }
                            ],
                            "projectile": [],
                            "isPD": false,
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "backpack": {
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
                            "keywords": [
                                {
                                    "name": "Intercept X",
                                    "value": "This Part carries X Interception Tokens."
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 1,
                                        "faction": [
                                            "RDL"
                                        ],
                                        "name": {
                                            "zh": "核心",
                                            "en": "Core",
                                            "jp": "コア"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                },
                                {
                                    "box": {
                                        "id": 16,
                                        "faction": [
                                            "RDL"
                                        ],
                                        "name": {
                                            "zh": "单机包-沙丘",
                                            "en": "Single Pack Dune",
                                            "jp": "シングル デューン"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                },
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        }
                    },
                    "pilot": {
                        "id": "FPA-06",
                        "name": "锁眼",
                        "score": 12,
                        "LV": 4,
                        "faction": "RDL",
                        "swift": 2,
                        "melee": 5,
                        "projectile": 4,
                        "firing": 6,
                        "moving": 6,
                        "tactic": 7,
                        "trait": "功率加大",
                        "traitDescription": "· 本机的光环、电子攻击与电子支援，+1范围。",
                        "box": {
                            "id": 2,
                            "faction": [
                                "RDL"
                            ],
                            "name": {
                                "zh": "铁骑",
                                "en": "Cavalry",
                                "jp": "カブリ"
                            },
                            "hasImage": true
                        }
                    }
                }
            ],
            "drones": [
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
                    "keywords": [
                        {
                            "name": "Intercept X",
                            "value": "This Part carries X Interception Tokens."
                        },
                        {
                            "name": "•Omni-direction Firing",
                            "value": "This action has no limit of fire direction."
                        },
                        {
                            "name": "Melee Firing",
                            "value": "This action can still be performed during Melee Lock."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 1,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟核心",
                                    "en": "RDL Core",
                                    "jp": "RDLコア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        },
                        {
                            "box": {
                                "id": 2,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟铁骑",
                                    "en": "RDL Cavalry",
                                    "jp": "RDLカブリ"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        },
                        {
                            "box": {
                                "id": 3,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟重金属",
                                    "en": "RDL Heavy Metal",
                                    "jp": "RDLヘビーメタル"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
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
                    "keywords": [
                        {
                            "name": "Volley X",
                            "value": "Fire or deploy up to X Projectiles and consume an equal amount of Ammo Tokens."
                        },
                        {
                            "name": "Fire in arc",
                            "value": "This action does not require visual to the landing point or the target."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 1,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟核心",
                                    "en": "RDL Core",
                                    "jp": "RDLコア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        },
                        {
                            "box": {
                                "id": 2,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟铁骑",
                                    "en": "RDL Cavalry",
                                    "jp": "RDLカブリ"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        },
                        {
                            "box": {
                                "id": 3,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟重金属",
                                    "en": "RDL Heavy Metal",
                                    "jp": "RDLヘビーメタル"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
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
                    "keywords": [
                        {
                            "name": "Fire Control Interference",
                            "value": "Units bearing a Fire Control Interference Token cannot perform Firing Actions or Interception.Projectiles with an Electronic Values are destroyed immediately if they obtain a Fire Control Interference Token."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 13,
                                "faction": [
                                    "PD"
                                ],
                                "name": {
                                    "zh": "LAB 星环动力 收割者轻型",
                                    "en": "LAB PD Reaper Type 1",
                                    "jp": "LAB PD リーパー タイプ1"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
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
                    "isPD": true,
                    "projectile": [
                        "PDAM-001"
                    ],
                    "keywords": [
                        {
                            "name": "Volley X",
                            "value": "Fire or deploy up to X Projectiles and consume an equal amount of Ammo Tokens."
                        },
                        {
                            "name": "Fire in arc",
                            "value": "This action does not require visual to the landing point or the target."
                        },
                        {
                            "name": "Fire Control Interference",
                            "value": "Units bearing a Fire Control Interference Token cannot perform Firing Actions or Interception.Projectiles with an Electronic Values are destroyed immediately if they obtain a Fire Control Interference Token."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 13,
                                "faction": [
                                    "PD"
                                ],
                                "name": {
                                    "zh": "LAB 星环动力 收割者轻型",
                                    "en": "LAB PD Reaper Type 1",
                                    "jp": "LAB PD リーパー タイプ1"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
                }
            ],
            "tacticCards": [],
            "totalScore": 414,
            "mechCount": 1,
            "largeDroneCount": 2,
            "mediumDroneCount": 2,
            "smallDroneCount": 0,
            "deviceID": "d6eeef82f83d4f5158d95ea55eab8837231d6e7061c6ee95c26275204fe3d499"
        },
        team1: {
            "id": "1764243819518",
            "name": "新小队",
            "faction": "UN",
            "mechs": [
                {
                    "id": "1775611833174",
                    "name": "新机体",
                    "parts": {
                        "torso": {
                            "id": "555",
                            "name": "TM35BT 金牛 实验核心",
                            "score": 84,
                            "armor": 5,
                            "structure": 4,
                            "parray": 0,
                            "dodge": 1,
                            "electronic": 4,
                            "type": "torso",
                            "description": "",
                            "imgSrc": "",
                            "tags": [],
                            "keywords": [
                                {
                                    "name": "KC装甲",
                                    "value": "当本机受击时，可消耗本部件的充能标记，将受击骰结果中的 闪电 视为 防御。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 17,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "单机包-金牛",
                                            "en": "Single Pack Taurus",
                                            "jp": "シングル タウラス"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "chasis": {
                            "id": "100",
                            "name": "LM210S 隐秘下肢",
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
                            "keywords": [
                                {
                                    "name": "静默",
                                    "value": "执行本动作时不会解除光学迷彩与低特征。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 5,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "手术刀",
                                            "en": "Scalpel",
                                            "jp": "スカルペル"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 2
                                }
                            ]
                        },
                        "leftHand": {
                            "id": "540",
                            "name": "S9“流星”盾 + IGX106离子炮",
                            "type": "leftHand",
                            "score": 69,
                            "armor": 4,
                            "structure": 0,
                            "parray": 2,
                            "dodge": 1,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "keywords": [
                                {
                                    "name": "空手",
                                    "value": ""
                                },
                                {
                                    "name": "震撼",
                                    "value": "闪电 扣除对方1点链接值。(注：效果可叠加)"
                                },
                                {
                                    "name": "毁伤",
                                    "value": "溢出伤害可结算至结构值。"
                                },
                                {
                                    "name": "霰射",
                                    "value": "如果目标为机甲，溢出伤害结算至目标另1个随机部件。"
                                },
                                {
                                    "name": "离子武器",
                                    "value": "命中拥有脆弱标记的目标时， 闪电 可视为 重击 。"
                                },
                                {
                                    "name": "近战射击",
                                    "value": "在近战锁定中仍可执行本动作。"
                                }
                            ],
                            "action": [
                                {
                                    "id": "540_A",
                                    "name": "盾击",
                                    "description": "· 震撼",
                                    "type": "Melee",
                                    "size": "s",
                                    "range": -1,
                                    "storage": 0,
                                    "yellowDice": 5,
                                    "redDice": 0
                                },
                                {
                                    "id": "540_B",
                                    "name": "点射",
                                    "description": "· [充能]获得毁伤。\r\n· 霰射\r\n· 离子武器\r\n· 近战射击",
                                    "type": "Firing",
                                    "size": "s",
                                    "range": 3,
                                    "storage": 0,
                                    "yellowDice": 3,
                                    "redDice": 1
                                }
                            ],
                            "projectile": [],
                            "isPD": false,
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "rightHand": {
                            "id": "148",
                            "name": "G6霰射炮 + M5刺桩",
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
                            "keywords": [
                                {
                                    "name": "霰射",
                                    "value": "如果目标为机甲，溢出伤害结算至目标另1个随机部件。"
                                },
                                {
                                    "name": "激光武器",
                                    "value": "命中使目标获得脆弱标记。"
                                },
                                {
                                    "name": "近战射击",
                                    "value": "在近战锁定中仍可执行本动作。"
                                },
                                {
                                    "name": "毁伤",
                                    "value": "溢出伤害可结算至结构值。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 6,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "破门锤",
                                            "en": "Doorbreaker",
                                            "jp": "ドアブレイカー"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 2
                                }
                            ]
                        },
                        "backpack": {
                            "id": "538",
                            "name": "JP5机动提升包",
                            "type": "backpack",
                            "score": 60,
                            "armor": 3,
                            "structure": 0,
                            "parray": 0,
                            "dodge": 2,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "keywords": [
                                {
                                    "name": "负载",
                                    "value": "一个部件被无人机携带。无人机并不会获得这个部件的能力与属性。"
                                }
                            ],
                            "action": [
                                {
                                    "id": "538_A",
                                    "name": "滑跃",
                                    "description": "· 本机调整移动距离+1。\r\n· 本部件无法作为负载。",
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
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        }
                    },
                    "pilot": {
                        "id": "LPA-19",
                        "name": "石英",
                        "score": 24,
                        "LV": 4,
                        "faction": "UN",
                        "swift": 2,
                        "melee": 5,
                        "projectile": 4,
                        "firing": 4,
                        "moving": 6,
                        "tactic": 6,
                        "trait": "沉著",
                        "traitDescription": "· 每回合结束时恢复1点链接值。",
                        "box": {
                            "id": 4,
                            "faction": [
                                "UN"
                            ],
                            "name": {
                                "zh": "核心",
                                "en": "Core",
                                "jp": "コア"
                            },
                            "hasImage": true
                        }
                    }
                },
                {
                    "id": "1775611860107",
                    "name": "新机体",
                    "parts": {
                        "torso": {
                            "id": "555",
                            "name": "TM35BT 金牛 实验核心",
                            "score": 84,
                            "armor": 5,
                            "structure": 4,
                            "parray": 0,
                            "dodge": 1,
                            "electronic": 4,
                            "type": "torso",
                            "description": "",
                            "imgSrc": "",
                            "tags": [],
                            "keywords": [
                                {
                                    "name": "KC装甲",
                                    "value": "当本机受击时，可消耗本部件的充能标记，将受击骰结果中的 闪电 视为 防御。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 17,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "单机包-金牛",
                                            "en": "Single Pack Taurus",
                                            "jp": "シングル タウラス"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "chasis": {
                            "id": "250",
                            "name": "LM210SO 隐秘下肢试作型",
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
                            "keywords": [
                                {
                                    "name": "静默",
                                    "value": "执行本动作时不会解除光学迷彩与低特征。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 12,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "LAB 试作章鱼",
                                            "en": "Trial Octopus",
                                            "jp": "トライアル UN オクトパス"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "leftHand": {
                            "id": "150",
                            "name": "RHX23暴雨突击手枪（左）",
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
                            "keywords": [
                                {
                                    "name": "全向射击",
                                    "value": "本动作没有射界限制。"
                                },
                                {
                                    "name": "压制",
                                    "value": "被本动作宣布为目标的机甲会立刻切换为防御姿态（处于宕机姿态的单位不受此影响）。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 6,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "破门锤",
                                            "en": "Doorbreaker",
                                            "jp": "ドアブレイカー"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                },
                                {
                                    "box": {
                                        "id": 4,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "核心",
                                            "en": "Core",
                                            "jp": "コア"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "rightHand": {
                            "id": "115",
                            "name": "S100大盾 + R6SS肩炮",
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
                            "keywords": [
                                {
                                    "name": "激光武器",
                                    "value": "命中使目标获得脆弱标记。"
                                },
                                {
                                    "name": "静止",
                                    "value": "在本次行动机会中，如果本单位执行本动作前没有发生位移，也没有改变朝向，则可以获得本条特殊规则的效果。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 4,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "核心",
                                            "en": "Core",
                                            "jp": "コア"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "backpack": {
                            "id": "084",
                            "name": "DBP龟壳掩体挂架",
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
                            ],
                            "keywords": [],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 5,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "手术刀",
                                            "en": "Scalpel",
                                            "jp": "スカルペル"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        }
                    },
                    "pilot": {
                        "id": "LPA-23-2",
                        "name": "玉髓 温柔和弦",
                        "score": 24,
                        "LV": 4,
                        "faction": "UN",
                        "swift": 6,
                        "melee": 2,
                        "projectile": 3,
                        "firing": 5,
                        "moving": 4,
                        "tactic": 4,
                        "trait": "装饰音",
                        "traitDescription": "· 当本机执行射击动作时，如果目标处于3格内范围，本次射击动作+1Y。",
                        "box": {
                            "id": 18,
                            "faction": [
                                "RDL",
                                "UN"
                            ],
                            "name": {
                                "zh": "对战包-突袭",
                                "en": "Combat Pack Raid",
                                "jp": "コンバットレイド"
                            },
                            "hasImage": true
                        }
                    }
                }
            ],
            "drones": [
                {
                    "id": "543",
                    "name": "ADK15P离子型豪猪",
                    "type": "medium",
                    "score": 70,
                    "armor": 4,
                    "structure": 2,
                    "parray": 0,
                    "dodge": 0,
                    "electronic": 2,
                    "move": 5,
                    "stance": "defensive",
                    "description": "",
                    "projectile": [],
                    "isPD": false,
                    "keywords": [
                        {
                            "name": "毁伤",
                            "value": "溢出伤害可结算至结构值。"
                        },
                        {
                            "name": "离子武器",
                            "value": "命中拥有脆弱标记的目标时， 闪电 可视为 重击 。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 18,
                                "faction": [
                                    "RDL",
                                    "UN"
                                ],
                                "name": {
                                    "zh": "对战包-突袭",
                                    "en": "Combat Pack Raid",
                                    "jp": "コンバットレイド"
                                },
                                "hasImage": false
                            },
                            "quantityPerBox": 1
                        }
                    ],
                    "hasImage": false,
                    "actions": [
                        {
                            "id": "543_A",
                            "name": "点射",
                            "description": "· [充能]获得毁伤。\r\n· 离子武器",
                            "type": "Firing",
                            "speed": "auto",
                            "range": 12,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 4
                        },
                        {
                            "id": "543_B",
                            "name": "充能",
                            "description": "· 为本机进行充能。",
                            "type": "Tactic",
                            "speed": "command",
                            "range": 0,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 0
                        }
                    ]
                },
                {
                    "id": "166",
                    "name": "ADK60S 干扰型渡鸦",
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
                    "keywords": [
                        {
                            "name": "电子攻击",
                            "value": "本动作是一个电子攻击（EA）动作，当有效果限制或强化“电子攻击“时，本动作受其影响；若无进一步描述，本动作以敌方单位为目标，需要进行电子对抗投骰，如果成功则起效。"
                        },
                        {
                            "name": "火控干扰",
                            "value": "携带火控干扰标记的单位不能执行射击动作，也不能进行拦截。有电子值的抛射物在获得火控干扰标记时直接被摧毁。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 4,
                                "faction": [
                                    "UN"
                                ],
                                "name": {
                                    "zh": "核心",
                                    "en": "Core",
                                    "jp": "コア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        }
                    ]
                },
                {
                    "id": "543",
                    "name": "ADK15P离子型豪猪",
                    "type": "medium",
                    "score": 70,
                    "armor": 4,
                    "structure": 2,
                    "parray": 0,
                    "dodge": 0,
                    "electronic": 2,
                    "move": 5,
                    "stance": "defensive",
                    "description": "",
                    "projectile": [],
                    "isPD": false,
                    "keywords": [
                        {
                            "name": "毁伤",
                            "value": "溢出伤害可结算至结构值。"
                        },
                        {
                            "name": "离子武器",
                            "value": "命中拥有脆弱标记的目标时， 闪电 可视为 重击 。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 18,
                                "faction": [
                                    "RDL",
                                    "UN"
                                ],
                                "name": {
                                    "zh": "对战包-突袭",
                                    "en": "Combat Pack Raid",
                                    "jp": "コンバットレイド"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ],
                    "actions": [
                        {
                            "id": "543_A",
                            "name": "点射",
                            "description": "· [充能]获得毁伤。\r\n· 离子武器",
                            "type": "Firing",
                            "speed": "auto",
                            "range": 12,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 4
                        },
                        {
                            "id": "543_B",
                            "name": "充能",
                            "description": "· 为本机进行充能。",
                            "type": "Tactic",
                            "speed": "command",
                            "range": 0,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 0
                        }
                    ]
                },
                {
                    "id": "166",
                    "name": "ADK60S 干扰型渡鸦",
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
                    "keywords": [
                        {
                            "name": "电子攻击",
                            "value": "本动作是一个电子攻击（EA）动作，当有效果限制或强化“电子攻击“时，本动作受其影响；若无进一步描述，本动作以敌方单位为目标，需要进行电子对抗投骰，如果成功则起效。"
                        },
                        {
                            "name": "火控干扰",
                            "value": "携带火控干扰标记的单位不能执行射击动作，也不能进行拦截。有电子值的抛射物在获得火控干扰标记时直接被摧毁。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 4,
                                "faction": [
                                    "UN"
                                ],
                                "name": {
                                    "zh": "核心",
                                    "en": "Core",
                                    "jp": "コア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        }
                    ]
                }
            ],
            "tacticCards": [],
            "totalScore": 893,
            "mechCount": 2,
            "largeDroneCount": 0,
            "mediumDroneCount": 4,
            "smallDroneCount": 0,
            "deviceID": "d6eeef82f83d4f5158d95ea55eab8837231d6e7061c6ee95c26275204fe3d499"
        }
    },
    {
        userQQ: '1446155077',
        userName: '玩家D',
        team2: {
            "id": "1765701343659",
            "name": "New Squad",
            "faction": "RDL",
            "mechs": [
                {
                    "id": "1775033551292",
                    "name": "对战包-复盟",
                    "parts": {
                        "torso": {
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
                            "keywords": [],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 1,
                                        "faction": [
                                            "RDL"
                                        ],
                                        "name": {
                                            "zh": "核心",
                                            "en": "Core",
                                            "jp": "コア"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 4
                                },
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "chasis": {
                            "id": "534",
                            "name": "RL-08C Armored Chassis",
                            "type": "chasis",
                            "score": 24,
                            "armor": 5,
                            "structure": 1,
                            "parray": 0,
                            "dodge": 3,
                            "electronic": 0,
                            "move": 1,
                            "description": "",
                            "keywords": [],
                            "action": [],
                            "projectile": [],
                            "isPD": false,
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "rightHand": {
                            "id": "536",
                            "name": "PC-6 Shotgun",
                            "type": "rightHand",
                            "score": 48,
                            "armor": 4,
                            "structure": 0,
                            "parray": 0,
                            "dodge": 0,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "throwIndex": "537",
                            "keywords": [
                                {
                                    "name": "Melee Firing",
                                    "value": "This action can still be performed during Melee Lock."
                                }
                            ],
                            "projectile": [],
                            "isPD": false,
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "backpack": {
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
                            "keywords": [
                                {
                                    "name": "Intercept X",
                                    "value": "This Part carries X Interception Tokens."
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 1,
                                        "faction": [
                                            "RDL"
                                        ],
                                        "name": {
                                            "zh": "核心",
                                            "en": "Core",
                                            "jp": "コア"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                },
                                {
                                    "box": {
                                        "id": 16,
                                        "faction": [
                                            "RDL"
                                        ],
                                        "name": {
                                            "zh": "单机包-沙丘",
                                            "en": "Single Pack Dune",
                                            "jp": "シングル デューン"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                },
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        }
                    },
                    "pilot": {
                        "id": "FPA-06",
                        "name": "锁眼",
                        "score": 12,
                        "LV": 4,
                        "faction": "RDL",
                        "swift": 2,
                        "melee": 5,
                        "projectile": 4,
                        "firing": 6,
                        "moving": 6,
                        "tactic": 7,
                        "trait": "功率加大",
                        "traitDescription": "· 本机的光环、电子攻击与电子支援，+1范围。",
                        "box": {
                            "id": 2,
                            "faction": [
                                "RDL"
                            ],
                            "name": {
                                "zh": "铁骑",
                                "en": "Cavalry",
                                "jp": "カブリ"
                            },
                            "hasImage": true
                        }
                    }
                }
            ],
            "drones": [
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
                    "keywords": [
                        {
                            "name": "Intercept X",
                            "value": "This Part carries X Interception Tokens."
                        },
                        {
                            "name": "•Omni-direction Firing",
                            "value": "This action has no limit of fire direction."
                        },
                        {
                            "name": "Melee Firing",
                            "value": "This action can still be performed during Melee Lock."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 1,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟核心",
                                    "en": "RDL Core",
                                    "jp": "RDLコア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        },
                        {
                            "box": {
                                "id": 2,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟铁骑",
                                    "en": "RDL Cavalry",
                                    "jp": "RDLカブリ"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        },
                        {
                            "box": {
                                "id": 3,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟重金属",
                                    "en": "RDL Heavy Metal",
                                    "jp": "RDLヘビーメタル"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
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
                    "keywords": [
                        {
                            "name": "Volley X",
                            "value": "Fire or deploy up to X Projectiles and consume an equal amount of Ammo Tokens."
                        },
                        {
                            "name": "Fire in arc",
                            "value": "This action does not require visual to the landing point or the target."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 1,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟核心",
                                    "en": "RDL Core",
                                    "jp": "RDLコア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        },
                        {
                            "box": {
                                "id": 2,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟铁骑",
                                    "en": "RDL Cavalry",
                                    "jp": "RDLカブリ"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        },
                        {
                            "box": {
                                "id": 3,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟重金属",
                                    "en": "RDL Heavy Metal",
                                    "jp": "RDLヘビーメタル"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
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
                    "keywords": [
                        {
                            "name": "Fire Control Interference",
                            "value": "Units bearing a Fire Control Interference Token cannot perform Firing Actions or Interception.Projectiles with an Electronic Values are destroyed immediately if they obtain a Fire Control Interference Token."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 13,
                                "faction": [
                                    "PD"
                                ],
                                "name": {
                                    "zh": "LAB 星环动力 收割者轻型",
                                    "en": "LAB PD Reaper Type 1",
                                    "jp": "LAB PD リーパー タイプ1"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
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
                    "isPD": true,
                    "projectile": [
                        "PDAM-001"
                    ],
                    "keywords": [
                        {
                            "name": "Volley X",
                            "value": "Fire or deploy up to X Projectiles and consume an equal amount of Ammo Tokens."
                        },
                        {
                            "name": "Fire in arc",
                            "value": "This action does not require visual to the landing point or the target."
                        },
                        {
                            "name": "Fire Control Interference",
                            "value": "Units bearing a Fire Control Interference Token cannot perform Firing Actions or Interception.Projectiles with an Electronic Values are destroyed immediately if they obtain a Fire Control Interference Token."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 13,
                                "faction": [
                                    "PD"
                                ],
                                "name": {
                                    "zh": "LAB 星环动力 收割者轻型",
                                    "en": "LAB PD Reaper Type 1",
                                    "jp": "LAB PD リーパー タイプ1"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
                }
            ],
            "tacticCards": [],
            "totalScore": 414,
            "mechCount": 1,
            "largeDroneCount": 2,
            "mediumDroneCount": 2,
            "smallDroneCount": 0,
            "deviceID": "d6eeef82f83d4f5158d95ea55eab8837231d6e7061c6ee95c26275204fe3d499"
        },
        team1: {
            "id": "1764243819518",
            "name": "新小队",
            "faction": "UN",
            "mechs": [
                {
                    "id": "1775611833174",
                    "name": "新机体",
                    "parts": {
                        "torso": {
                            "id": "555",
                            "name": "TM35BT 金牛 实验核心",
                            "score": 84,
                            "armor": 5,
                            "structure": 4,
                            "parray": 0,
                            "dodge": 1,
                            "electronic": 4,
                            "type": "torso",
                            "description": "",
                            "imgSrc": "",
                            "tags": [],
                            "keywords": [
                                {
                                    "name": "KC装甲",
                                    "value": "当本机受击时，可消耗本部件的充能标记，将受击骰结果中的 闪电 视为 防御。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 17,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "单机包-金牛",
                                            "en": "Single Pack Taurus",
                                            "jp": "シングル タウラス"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "chasis": {
                            "id": "100",
                            "name": "LM210S 隐秘下肢",
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
                            "keywords": [
                                {
                                    "name": "静默",
                                    "value": "执行本动作时不会解除光学迷彩与低特征。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 5,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "手术刀",
                                            "en": "Scalpel",
                                            "jp": "スカルペル"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 2
                                }
                            ]
                        },
                        "leftHand": {
                            "id": "540",
                            "name": "S9“流星”盾 + IGX106离子炮",
                            "type": "leftHand",
                            "score": 69,
                            "armor": 4,
                            "structure": 0,
                            "parray": 2,
                            "dodge": 1,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "keywords": [
                                {
                                    "name": "空手",
                                    "value": ""
                                },
                                {
                                    "name": "震撼",
                                    "value": "闪电 扣除对方1点链接值。(注：效果可叠加)"
                                },
                                {
                                    "name": "毁伤",
                                    "value": "溢出伤害可结算至结构值。"
                                },
                                {
                                    "name": "霰射",
                                    "value": "如果目标为机甲，溢出伤害结算至目标另1个随机部件。"
                                },
                                {
                                    "name": "离子武器",
                                    "value": "命中拥有脆弱标记的目标时， 闪电 可视为 重击 。"
                                },
                                {
                                    "name": "近战射击",
                                    "value": "在近战锁定中仍可执行本动作。"
                                }
                            ],
                            "action": [
                                {
                                    "id": "540_A",
                                    "name": "盾击",
                                    "description": "· 震撼",
                                    "type": "Melee",
                                    "size": "s",
                                    "range": -1,
                                    "storage": 0,
                                    "yellowDice": 5,
                                    "redDice": 0
                                },
                                {
                                    "id": "540_B",
                                    "name": "点射",
                                    "description": "· [充能]获得毁伤。\r\n· 霰射\r\n· 离子武器\r\n· 近战射击",
                                    "type": "Firing",
                                    "size": "s",
                                    "range": 3,
                                    "storage": 0,
                                    "yellowDice": 3,
                                    "redDice": 1
                                }
                            ],
                            "projectile": [],
                            "isPD": false,
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "rightHand": {
                            "id": "148",
                            "name": "G6霰射炮 + M5刺桩",
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
                            "keywords": [
                                {
                                    "name": "霰射",
                                    "value": "如果目标为机甲，溢出伤害结算至目标另1个随机部件。"
                                },
                                {
                                    "name": "激光武器",
                                    "value": "命中使目标获得脆弱标记。"
                                },
                                {
                                    "name": "近战射击",
                                    "value": "在近战锁定中仍可执行本动作。"
                                },
                                {
                                    "name": "毁伤",
                                    "value": "溢出伤害可结算至结构值。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 6,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "破门锤",
                                            "en": "Doorbreaker",
                                            "jp": "ドアブレイカー"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 2
                                }
                            ]
                        },
                        "backpack": {
                            "id": "538",
                            "name": "JP5机动提升包",
                            "type": "backpack",
                            "score": 60,
                            "armor": 3,
                            "structure": 0,
                            "parray": 0,
                            "dodge": 2,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "keywords": [
                                {
                                    "name": "负载",
                                    "value": "一个部件被无人机携带。无人机并不会获得这个部件的能力与属性。"
                                }
                            ],
                            "action": [
                                {
                                    "id": "538_A",
                                    "name": "滑跃",
                                    "description": "· 本机调整移动距离+1。\r\n· 本部件无法作为负载。",
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
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        }
                    },
                    "pilot": {
                        "id": "LPA-19",
                        "name": "石英",
                        "score": 24,
                        "LV": 4,
                        "faction": "UN",
                        "swift": 2,
                        "melee": 5,
                        "projectile": 4,
                        "firing": 4,
                        "moving": 6,
                        "tactic": 6,
                        "trait": "沉著",
                        "traitDescription": "· 每回合结束时恢复1点链接值。",
                        "box": {
                            "id": 4,
                            "faction": [
                                "UN"
                            ],
                            "name": {
                                "zh": "核心",
                                "en": "Core",
                                "jp": "コア"
                            },
                            "hasImage": true
                        }
                    }
                },
                {
                    "id": "1775611860107",
                    "name": "新机体",
                    "parts": {
                        "torso": {
                            "id": "555",
                            "name": "TM35BT 金牛 实验核心",
                            "score": 84,
                            "armor": 5,
                            "structure": 4,
                            "parray": 0,
                            "dodge": 1,
                            "electronic": 4,
                            "type": "torso",
                            "description": "",
                            "imgSrc": "",
                            "tags": [],
                            "keywords": [
                                {
                                    "name": "KC装甲",
                                    "value": "当本机受击时，可消耗本部件的充能标记，将受击骰结果中的 闪电 视为 防御。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 17,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "单机包-金牛",
                                            "en": "Single Pack Taurus",
                                            "jp": "シングル タウラス"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "chasis": {
                            "id": "250",
                            "name": "LM210SO 隐秘下肢试作型",
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
                            "keywords": [
                                {
                                    "name": "静默",
                                    "value": "执行本动作时不会解除光学迷彩与低特征。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 12,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "LAB 试作章鱼",
                                            "en": "Trial Octopus",
                                            "jp": "トライアル UN オクトパス"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "leftHand": {
                            "id": "150",
                            "name": "RHX23暴雨突击手枪（左）",
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
                            "keywords": [
                                {
                                    "name": "全向射击",
                                    "value": "本动作没有射界限制。"
                                },
                                {
                                    "name": "压制",
                                    "value": "被本动作宣布为目标的机甲会立刻切换为防御姿态（处于宕机姿态的单位不受此影响）。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 6,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "破门锤",
                                            "en": "Doorbreaker",
                                            "jp": "ドアブレイカー"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                },
                                {
                                    "box": {
                                        "id": 4,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "核心",
                                            "en": "Core",
                                            "jp": "コア"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "rightHand": {
                            "id": "115",
                            "name": "S100大盾 + R6SS肩炮",
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
                            "keywords": [
                                {
                                    "name": "激光武器",
                                    "value": "命中使目标获得脆弱标记。"
                                },
                                {
                                    "name": "静止",
                                    "value": "在本次行动机会中，如果本单位执行本动作前没有发生位移，也没有改变朝向，则可以获得本条特殊规则的效果。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 4,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "核心",
                                            "en": "Core",
                                            "jp": "コア"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "backpack": {
                            "id": "084",
                            "name": "DBP龟壳掩体挂架",
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
                            ],
                            "keywords": [],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 5,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "手术刀",
                                            "en": "Scalpel",
                                            "jp": "スカルペル"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        }
                    },
                    "pilot": {
                        "id": "LPA-23-2",
                        "name": "玉髓 温柔和弦",
                        "score": 24,
                        "LV": 4,
                        "faction": "UN",
                        "swift": 6,
                        "melee": 2,
                        "projectile": 3,
                        "firing": 5,
                        "moving": 4,
                        "tactic": 4,
                        "trait": "装饰音",
                        "traitDescription": "· 当本机执行射击动作时，如果目标处于3格内范围，本次射击动作+1Y。",
                        "box": {
                            "id": 18,
                            "faction": [
                                "RDL",
                                "UN"
                            ],
                            "name": {
                                "zh": "对战包-突袭",
                                "en": "Combat Pack Raid",
                                "jp": "コンバットレイド"
                            },
                            "hasImage": true
                        }
                    }
                }
            ],
            "drones": [
                {
                    "id": "543",
                    "name": "ADK15P离子型豪猪",
                    "type": "medium",
                    "score": 70,
                    "armor": 4,
                    "structure": 2,
                    "parray": 0,
                    "dodge": 0,
                    "electronic": 2,
                    "move": 5,
                    "stance": "defensive",
                    "description": "",
                    "projectile": [],
                    "isPD": false,
                    "keywords": [
                        {
                            "name": "毁伤",
                            "value": "溢出伤害可结算至结构值。"
                        },
                        {
                            "name": "离子武器",
                            "value": "命中拥有脆弱标记的目标时， 闪电 可视为 重击 。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 18,
                                "faction": [
                                    "RDL",
                                    "UN"
                                ],
                                "name": {
                                    "zh": "对战包-突袭",
                                    "en": "Combat Pack Raid",
                                    "jp": "コンバットレイド"
                                },
                                "hasImage": false
                            },
                            "quantityPerBox": 1
                        }
                    ],
                    "hasImage": false,
                    "actions": [
                        {
                            "id": "543_A",
                            "name": "点射",
                            "description": "· [充能]获得毁伤。\r\n· 离子武器",
                            "type": "Firing",
                            "speed": "auto",
                            "range": 12,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 4
                        },
                        {
                            "id": "543_B",
                            "name": "充能",
                            "description": "· 为本机进行充能。",
                            "type": "Tactic",
                            "speed": "command",
                            "range": 0,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 0
                        }
                    ]
                },
                {
                    "id": "166",
                    "name": "ADK60S 干扰型渡鸦",
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
                    "keywords": [
                        {
                            "name": "电子攻击",
                            "value": "本动作是一个电子攻击（EA）动作，当有效果限制或强化“电子攻击“时，本动作受其影响；若无进一步描述，本动作以敌方单位为目标，需要进行电子对抗投骰，如果成功则起效。"
                        },
                        {
                            "name": "火控干扰",
                            "value": "携带火控干扰标记的单位不能执行射击动作，也不能进行拦截。有电子值的抛射物在获得火控干扰标记时直接被摧毁。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 4,
                                "faction": [
                                    "UN"
                                ],
                                "name": {
                                    "zh": "核心",
                                    "en": "Core",
                                    "jp": "コア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        }
                    ]
                },
                {
                    "id": "543",
                    "name": "ADK15P离子型豪猪",
                    "type": "medium",
                    "score": 70,
                    "armor": 4,
                    "structure": 2,
                    "parray": 0,
                    "dodge": 0,
                    "electronic": 2,
                    "move": 5,
                    "stance": "defensive",
                    "description": "",
                    "projectile": [],
                    "isPD": false,
                    "keywords": [
                        {
                            "name": "毁伤",
                            "value": "溢出伤害可结算至结构值。"
                        },
                        {
                            "name": "离子武器",
                            "value": "命中拥有脆弱标记的目标时， 闪电 可视为 重击 。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 18,
                                "faction": [
                                    "RDL",
                                    "UN"
                                ],
                                "name": {
                                    "zh": "对战包-突袭",
                                    "en": "Combat Pack Raid",
                                    "jp": "コンバットレイド"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ],
                    "actions": [
                        {
                            "id": "543_A",
                            "name": "点射",
                            "description": "· [充能]获得毁伤。\r\n· 离子武器",
                            "type": "Firing",
                            "speed": "auto",
                            "range": 12,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 4
                        },
                        {
                            "id": "543_B",
                            "name": "充能",
                            "description": "· 为本机进行充能。",
                            "type": "Tactic",
                            "speed": "command",
                            "range": 0,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 0
                        }
                    ]
                },
                {
                    "id": "166",
                    "name": "ADK60S 干扰型渡鸦",
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
                    "keywords": [
                        {
                            "name": "电子攻击",
                            "value": "本动作是一个电子攻击（EA）动作，当有效果限制或强化“电子攻击“时，本动作受其影响；若无进一步描述，本动作以敌方单位为目标，需要进行电子对抗投骰，如果成功则起效。"
                        },
                        {
                            "name": "火控干扰",
                            "value": "携带火控干扰标记的单位不能执行射击动作，也不能进行拦截。有电子值的抛射物在获得火控干扰标记时直接被摧毁。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 4,
                                "faction": [
                                    "UN"
                                ],
                                "name": {
                                    "zh": "核心",
                                    "en": "Core",
                                    "jp": "コア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        }
                    ]
                }
            ],
            "tacticCards": [],
            "totalScore": 893,
            "mechCount": 2,
            "largeDroneCount": 0,
            "mediumDroneCount": 4,
            "smallDroneCount": 0,
            "deviceID": "d6eeef82f83d4f5158d95ea55eab8837231d6e7061c6ee95c26275204fe3d499"
        }
    },
    {
        userQQ: '1443155077',
        userName: '玩家E',
        team2: {
            "id": "1765701343659",
            "name": "New Squad",
            "faction": "RDL",
            "mechs": [
                {
                    "id": "1775033551292",
                    "name": "对战包-复盟",
                    "parts": {
                        "torso": {
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
                            "keywords": [],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 1,
                                        "faction": [
                                            "RDL"
                                        ],
                                        "name": {
                                            "zh": "核心",
                                            "en": "Core",
                                            "jp": "コア"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 4
                                },
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "chasis": {
                            "id": "534",
                            "name": "RL-08C Armored Chassis",
                            "type": "chasis",
                            "score": 24,
                            "armor": 5,
                            "structure": 1,
                            "parray": 0,
                            "dodge": 3,
                            "electronic": 0,
                            "move": 1,
                            "description": "",
                            "keywords": [],
                            "action": [],
                            "projectile": [],
                            "isPD": false,
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "rightHand": {
                            "id": "536",
                            "name": "PC-6 Shotgun",
                            "type": "rightHand",
                            "score": 48,
                            "armor": 4,
                            "structure": 0,
                            "parray": 0,
                            "dodge": 0,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "throwIndex": "537",
                            "keywords": [
                                {
                                    "name": "Melee Firing",
                                    "value": "This action can still be performed during Melee Lock."
                                }
                            ],
                            "projectile": [],
                            "isPD": false,
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "backpack": {
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
                            "keywords": [
                                {
                                    "name": "Intercept X",
                                    "value": "This Part carries X Interception Tokens."
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 1,
                                        "faction": [
                                            "RDL"
                                        ],
                                        "name": {
                                            "zh": "核心",
                                            "en": "Core",
                                            "jp": "コア"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                },
                                {
                                    "box": {
                                        "id": 16,
                                        "faction": [
                                            "RDL"
                                        ],
                                        "name": {
                                            "zh": "单机包-沙丘",
                                            "en": "Single Pack Dune",
                                            "jp": "シングル デューン"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                },
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        }
                    },
                    "pilot": {
                        "id": "FPA-06",
                        "name": "锁眼",
                        "score": 12,
                        "LV": 4,
                        "faction": "RDL",
                        "swift": 2,
                        "melee": 5,
                        "projectile": 4,
                        "firing": 6,
                        "moving": 6,
                        "tactic": 7,
                        "trait": "功率加大",
                        "traitDescription": "· 本机的光环、电子攻击与电子支援，+1范围。",
                        "box": {
                            "id": 2,
                            "faction": [
                                "RDL"
                            ],
                            "name": {
                                "zh": "铁骑",
                                "en": "Cavalry",
                                "jp": "カブリ"
                            },
                            "hasImage": true
                        }
                    }
                }
            ],
            "drones": [
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
                    "keywords": [
                        {
                            "name": "Intercept X",
                            "value": "This Part carries X Interception Tokens."
                        },
                        {
                            "name": "•Omni-direction Firing",
                            "value": "This action has no limit of fire direction."
                        },
                        {
                            "name": "Melee Firing",
                            "value": "This action can still be performed during Melee Lock."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 1,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟核心",
                                    "en": "RDL Core",
                                    "jp": "RDLコア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        },
                        {
                            "box": {
                                "id": 2,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟铁骑",
                                    "en": "RDL Cavalry",
                                    "jp": "RDLカブリ"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        },
                        {
                            "box": {
                                "id": 3,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟重金属",
                                    "en": "RDL Heavy Metal",
                                    "jp": "RDLヘビーメタル"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
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
                    "keywords": [
                        {
                            "name": "Volley X",
                            "value": "Fire or deploy up to X Projectiles and consume an equal amount of Ammo Tokens."
                        },
                        {
                            "name": "Fire in arc",
                            "value": "This action does not require visual to the landing point or the target."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 1,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟核心",
                                    "en": "RDL Core",
                                    "jp": "RDLコア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        },
                        {
                            "box": {
                                "id": 2,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟铁骑",
                                    "en": "RDL Cavalry",
                                    "jp": "RDLカブリ"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        },
                        {
                            "box": {
                                "id": 3,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟重金属",
                                    "en": "RDL Heavy Metal",
                                    "jp": "RDLヘビーメタル"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
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
                    "keywords": [
                        {
                            "name": "Fire Control Interference",
                            "value": "Units bearing a Fire Control Interference Token cannot perform Firing Actions or Interception.Projectiles with an Electronic Values are destroyed immediately if they obtain a Fire Control Interference Token."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 13,
                                "faction": [
                                    "PD"
                                ],
                                "name": {
                                    "zh": "LAB 星环动力 收割者轻型",
                                    "en": "LAB PD Reaper Type 1",
                                    "jp": "LAB PD リーパー タイプ1"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
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
                    "isPD": true,
                    "projectile": [
                        "PDAM-001"
                    ],
                    "keywords": [
                        {
                            "name": "Volley X",
                            "value": "Fire or deploy up to X Projectiles and consume an equal amount of Ammo Tokens."
                        },
                        {
                            "name": "Fire in arc",
                            "value": "This action does not require visual to the landing point or the target."
                        },
                        {
                            "name": "Fire Control Interference",
                            "value": "Units bearing a Fire Control Interference Token cannot perform Firing Actions or Interception.Projectiles with an Electronic Values are destroyed immediately if they obtain a Fire Control Interference Token."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 13,
                                "faction": [
                                    "PD"
                                ],
                                "name": {
                                    "zh": "LAB 星环动力 收割者轻型",
                                    "en": "LAB PD Reaper Type 1",
                                    "jp": "LAB PD リーパー タイプ1"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
                }
            ],
            "tacticCards": [],
            "totalScore": 414,
            "mechCount": 1,
            "largeDroneCount": 2,
            "mediumDroneCount": 2,
            "smallDroneCount": 0,
            "deviceID": "d6eeef82f83d4f5158d95ea55eab8837231d6e7061c6ee95c26275204fe3d499"
        },
        team1: {
            "id": "1764243819518",
            "name": "新小队",
            "faction": "UN",
            "mechs": [
                {
                    "id": "1775611833174",
                    "name": "新机体",
                    "parts": {
                        "torso": {
                            "id": "555",
                            "name": "TM35BT 金牛 实验核心",
                            "score": 84,
                            "armor": 5,
                            "structure": 4,
                            "parray": 0,
                            "dodge": 1,
                            "electronic": 4,
                            "type": "torso",
                            "description": "",
                            "imgSrc": "",
                            "tags": [],
                            "keywords": [
                                {
                                    "name": "KC装甲",
                                    "value": "当本机受击时，可消耗本部件的充能标记，将受击骰结果中的 闪电 视为 防御。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 17,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "单机包-金牛",
                                            "en": "Single Pack Taurus",
                                            "jp": "シングル タウラス"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "chasis": {
                            "id": "100",
                            "name": "LM210S 隐秘下肢",
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
                            "keywords": [
                                {
                                    "name": "静默",
                                    "value": "执行本动作时不会解除光学迷彩与低特征。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 5,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "手术刀",
                                            "en": "Scalpel",
                                            "jp": "スカルペル"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 2
                                }
                            ]
                        },
                        "leftHand": {
                            "id": "540",
                            "name": "S9“流星”盾 + IGX106离子炮",
                            "type": "leftHand",
                            "score": 69,
                            "armor": 4,
                            "structure": 0,
                            "parray": 2,
                            "dodge": 1,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "keywords": [
                                {
                                    "name": "空手",
                                    "value": ""
                                },
                                {
                                    "name": "震撼",
                                    "value": "闪电 扣除对方1点链接值。(注：效果可叠加)"
                                },
                                {
                                    "name": "毁伤",
                                    "value": "溢出伤害可结算至结构值。"
                                },
                                {
                                    "name": "霰射",
                                    "value": "如果目标为机甲，溢出伤害结算至目标另1个随机部件。"
                                },
                                {
                                    "name": "离子武器",
                                    "value": "命中拥有脆弱标记的目标时， 闪电 可视为 重击 。"
                                },
                                {
                                    "name": "近战射击",
                                    "value": "在近战锁定中仍可执行本动作。"
                                }
                            ],
                            "action": [
                                {
                                    "id": "540_A",
                                    "name": "盾击",
                                    "description": "· 震撼",
                                    "type": "Melee",
                                    "size": "s",
                                    "range": -1,
                                    "storage": 0,
                                    "yellowDice": 5,
                                    "redDice": 0
                                },
                                {
                                    "id": "540_B",
                                    "name": "点射",
                                    "description": "· [充能]获得毁伤。\r\n· 霰射\r\n· 离子武器\r\n· 近战射击",
                                    "type": "Firing",
                                    "size": "s",
                                    "range": 3,
                                    "storage": 0,
                                    "yellowDice": 3,
                                    "redDice": 1
                                }
                            ],
                            "projectile": [],
                            "isPD": false,
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "rightHand": {
                            "id": "148",
                            "name": "G6霰射炮 + M5刺桩",
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
                            "keywords": [
                                {
                                    "name": "霰射",
                                    "value": "如果目标为机甲，溢出伤害结算至目标另1个随机部件。"
                                },
                                {
                                    "name": "激光武器",
                                    "value": "命中使目标获得脆弱标记。"
                                },
                                {
                                    "name": "近战射击",
                                    "value": "在近战锁定中仍可执行本动作。"
                                },
                                {
                                    "name": "毁伤",
                                    "value": "溢出伤害可结算至结构值。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 6,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "破门锤",
                                            "en": "Doorbreaker",
                                            "jp": "ドアブレイカー"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 2
                                }
                            ]
                        },
                        "backpack": {
                            "id": "538",
                            "name": "JP5机动提升包",
                            "type": "backpack",
                            "score": 60,
                            "armor": 3,
                            "structure": 0,
                            "parray": 0,
                            "dodge": 2,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "keywords": [
                                {
                                    "name": "负载",
                                    "value": "一个部件被无人机携带。无人机并不会获得这个部件的能力与属性。"
                                }
                            ],
                            "action": [
                                {
                                    "id": "538_A",
                                    "name": "滑跃",
                                    "description": "· 本机调整移动距离+1。\r\n· 本部件无法作为负载。",
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
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        }
                    },
                    "pilot": {
                        "id": "LPA-19",
                        "name": "石英",
                        "score": 24,
                        "LV": 4,
                        "faction": "UN",
                        "swift": 2,
                        "melee": 5,
                        "projectile": 4,
                        "firing": 4,
                        "moving": 6,
                        "tactic": 6,
                        "trait": "沉著",
                        "traitDescription": "· 每回合结束时恢复1点链接值。",
                        "box": {
                            "id": 4,
                            "faction": [
                                "UN"
                            ],
                            "name": {
                                "zh": "核心",
                                "en": "Core",
                                "jp": "コア"
                            },
                            "hasImage": true
                        }
                    }
                },
                {
                    "id": "1775611860107",
                    "name": "新机体",
                    "parts": {
                        "torso": {
                            "id": "555",
                            "name": "TM35BT 金牛 实验核心",
                            "score": 84,
                            "armor": 5,
                            "structure": 4,
                            "parray": 0,
                            "dodge": 1,
                            "electronic": 4,
                            "type": "torso",
                            "description": "",
                            "imgSrc": "",
                            "tags": [],
                            "keywords": [
                                {
                                    "name": "KC装甲",
                                    "value": "当本机受击时，可消耗本部件的充能标记，将受击骰结果中的 闪电 视为 防御。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 17,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "单机包-金牛",
                                            "en": "Single Pack Taurus",
                                            "jp": "シングル タウラス"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "chasis": {
                            "id": "250",
                            "name": "LM210SO 隐秘下肢试作型",
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
                            "keywords": [
                                {
                                    "name": "静默",
                                    "value": "执行本动作时不会解除光学迷彩与低特征。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 12,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "LAB 试作章鱼",
                                            "en": "Trial Octopus",
                                            "jp": "トライアル UN オクトパス"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "leftHand": {
                            "id": "150",
                            "name": "RHX23暴雨突击手枪（左）",
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
                            "keywords": [
                                {
                                    "name": "全向射击",
                                    "value": "本动作没有射界限制。"
                                },
                                {
                                    "name": "压制",
                                    "value": "被本动作宣布为目标的机甲会立刻切换为防御姿态（处于宕机姿态的单位不受此影响）。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 6,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "破门锤",
                                            "en": "Doorbreaker",
                                            "jp": "ドアブレイカー"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                },
                                {
                                    "box": {
                                        "id": 4,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "核心",
                                            "en": "Core",
                                            "jp": "コア"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "rightHand": {
                            "id": "115",
                            "name": "S100大盾 + R6SS肩炮",
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
                            "keywords": [
                                {
                                    "name": "激光武器",
                                    "value": "命中使目标获得脆弱标记。"
                                },
                                {
                                    "name": "静止",
                                    "value": "在本次行动机会中，如果本单位执行本动作前没有发生位移，也没有改变朝向，则可以获得本条特殊规则的效果。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 4,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "核心",
                                            "en": "Core",
                                            "jp": "コア"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "backpack": {
                            "id": "084",
                            "name": "DBP龟壳掩体挂架",
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
                            ],
                            "keywords": [],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 5,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "手术刀",
                                            "en": "Scalpel",
                                            "jp": "スカルペル"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        }
                    },
                    "pilot": {
                        "id": "LPA-23-2",
                        "name": "玉髓 温柔和弦",
                        "score": 24,
                        "LV": 4,
                        "faction": "UN",
                        "swift": 6,
                        "melee": 2,
                        "projectile": 3,
                        "firing": 5,
                        "moving": 4,
                        "tactic": 4,
                        "trait": "装饰音",
                        "traitDescription": "· 当本机执行射击动作时，如果目标处于3格内范围，本次射击动作+1Y。",
                        "box": {
                            "id": 18,
                            "faction": [
                                "RDL",
                                "UN"
                            ],
                            "name": {
                                "zh": "对战包-突袭",
                                "en": "Combat Pack Raid",
                                "jp": "コンバットレイド"
                            },
                            "hasImage": true
                        }
                    }
                }
            ],
            "drones": [
                {
                    "id": "543",
                    "name": "ADK15P离子型豪猪",
                    "type": "medium",
                    "score": 70,
                    "armor": 4,
                    "structure": 2,
                    "parray": 0,
                    "dodge": 0,
                    "electronic": 2,
                    "move": 5,
                    "stance": "defensive",
                    "description": "",
                    "projectile": [],
                    "isPD": false,
                    "keywords": [
                        {
                            "name": "毁伤",
                            "value": "溢出伤害可结算至结构值。"
                        },
                        {
                            "name": "离子武器",
                            "value": "命中拥有脆弱标记的目标时， 闪电 可视为 重击 。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 18,
                                "faction": [
                                    "RDL",
                                    "UN"
                                ],
                                "name": {
                                    "zh": "对战包-突袭",
                                    "en": "Combat Pack Raid",
                                    "jp": "コンバットレイド"
                                },
                                "hasImage": false
                            },
                            "quantityPerBox": 1
                        }
                    ],
                    "hasImage": false,
                    "actions": [
                        {
                            "id": "543_A",
                            "name": "点射",
                            "description": "· [充能]获得毁伤。\r\n· 离子武器",
                            "type": "Firing",
                            "speed": "auto",
                            "range": 12,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 4
                        },
                        {
                            "id": "543_B",
                            "name": "充能",
                            "description": "· 为本机进行充能。",
                            "type": "Tactic",
                            "speed": "command",
                            "range": 0,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 0
                        }
                    ]
                },
                {
                    "id": "166",
                    "name": "ADK60S 干扰型渡鸦",
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
                    "keywords": [
                        {
                            "name": "电子攻击",
                            "value": "本动作是一个电子攻击（EA）动作，当有效果限制或强化“电子攻击“时，本动作受其影响；若无进一步描述，本动作以敌方单位为目标，需要进行电子对抗投骰，如果成功则起效。"
                        },
                        {
                            "name": "火控干扰",
                            "value": "携带火控干扰标记的单位不能执行射击动作，也不能进行拦截。有电子值的抛射物在获得火控干扰标记时直接被摧毁。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 4,
                                "faction": [
                                    "UN"
                                ],
                                "name": {
                                    "zh": "核心",
                                    "en": "Core",
                                    "jp": "コア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        }
                    ]
                },
                {
                    "id": "543",
                    "name": "ADK15P离子型豪猪",
                    "type": "medium",
                    "score": 70,
                    "armor": 4,
                    "structure": 2,
                    "parray": 0,
                    "dodge": 0,
                    "electronic": 2,
                    "move": 5,
                    "stance": "defensive",
                    "description": "",
                    "projectile": [],
                    "isPD": false,
                    "keywords": [
                        {
                            "name": "毁伤",
                            "value": "溢出伤害可结算至结构值。"
                        },
                        {
                            "name": "离子武器",
                            "value": "命中拥有脆弱标记的目标时， 闪电 可视为 重击 。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 18,
                                "faction": [
                                    "RDL",
                                    "UN"
                                ],
                                "name": {
                                    "zh": "对战包-突袭",
                                    "en": "Combat Pack Raid",
                                    "jp": "コンバットレイド"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ],
                    "actions": [
                        {
                            "id": "543_A",
                            "name": "点射",
                            "description": "· [充能]获得毁伤。\r\n· 离子武器",
                            "type": "Firing",
                            "speed": "auto",
                            "range": 12,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 4
                        },
                        {
                            "id": "543_B",
                            "name": "充能",
                            "description": "· 为本机进行充能。",
                            "type": "Tactic",
                            "speed": "command",
                            "range": 0,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 0
                        }
                    ]
                },
                {
                    "id": "166",
                    "name": "ADK60S 干扰型渡鸦",
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
                    "keywords": [
                        {
                            "name": "电子攻击",
                            "value": "本动作是一个电子攻击（EA）动作，当有效果限制或强化“电子攻击“时，本动作受其影响；若无进一步描述，本动作以敌方单位为目标，需要进行电子对抗投骰，如果成功则起效。"
                        },
                        {
                            "name": "火控干扰",
                            "value": "携带火控干扰标记的单位不能执行射击动作，也不能进行拦截。有电子值的抛射物在获得火控干扰标记时直接被摧毁。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 4,
                                "faction": [
                                    "UN"
                                ],
                                "name": {
                                    "zh": "核心",
                                    "en": "Core",
                                    "jp": "コア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        }
                    ]
                }
            ],
            "tacticCards": [],
            "totalScore": 893,
            "mechCount": 2,
            "largeDroneCount": 0,
            "mediumDroneCount": 4,
            "smallDroneCount": 0,
            "deviceID": "d6eeef82f83d4f5158d95ea55eab8837231d6e7061c6ee95c26275204fe3d499"
        }
    },
    {
        userQQ: '2443165077',
        userName: '玩家F',
        team2: {
            "id": "1765701343659",
            "name": "New Squad",
            "faction": "RDL",
            "mechs": [
                {
                    "id": "1775033551292",
                    "name": "对战包-复盟",
                    "parts": {
                        "torso": {
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
                            "keywords": [],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 1,
                                        "faction": [
                                            "RDL"
                                        ],
                                        "name": {
                                            "zh": "核心",
                                            "en": "Core",
                                            "jp": "コア"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 4
                                },
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "chasis": {
                            "id": "534",
                            "name": "RL-08C Armored Chassis",
                            "type": "chasis",
                            "score": 24,
                            "armor": 5,
                            "structure": 1,
                            "parray": 0,
                            "dodge": 3,
                            "electronic": 0,
                            "move": 1,
                            "description": "",
                            "keywords": [],
                            "action": [],
                            "projectile": [],
                            "isPD": false,
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "rightHand": {
                            "id": "536",
                            "name": "PC-6 Shotgun",
                            "type": "rightHand",
                            "score": 48,
                            "armor": 4,
                            "structure": 0,
                            "parray": 0,
                            "dodge": 0,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "throwIndex": "537",
                            "keywords": [
                                {
                                    "name": "Melee Firing",
                                    "value": "This action can still be performed during Melee Lock."
                                }
                            ],
                            "projectile": [],
                            "isPD": false,
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "backpack": {
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
                            "keywords": [
                                {
                                    "name": "Intercept X",
                                    "value": "This Part carries X Interception Tokens."
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 1,
                                        "faction": [
                                            "RDL"
                                        ],
                                        "name": {
                                            "zh": "核心",
                                            "en": "Core",
                                            "jp": "コア"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                },
                                {
                                    "box": {
                                        "id": 16,
                                        "faction": [
                                            "RDL"
                                        ],
                                        "name": {
                                            "zh": "单机包-沙丘",
                                            "en": "Single Pack Dune",
                                            "jp": "シングル デューン"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                },
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        }
                    },
                    "pilot": {
                        "id": "FPA-06",
                        "name": "锁眼",
                        "score": 12,
                        "LV": 4,
                        "faction": "RDL",
                        "swift": 2,
                        "melee": 5,
                        "projectile": 4,
                        "firing": 6,
                        "moving": 6,
                        "tactic": 7,
                        "trait": "功率加大",
                        "traitDescription": "· 本机的光环、电子攻击与电子支援，+1范围。",
                        "box": {
                            "id": 2,
                            "faction": [
                                "RDL"
                            ],
                            "name": {
                                "zh": "铁骑",
                                "en": "Cavalry",
                                "jp": "カブリ"
                            },
                            "hasImage": true
                        }
                    }
                }
            ],
            "drones": [
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
                    "keywords": [
                        {
                            "name": "Intercept X",
                            "value": "This Part carries X Interception Tokens."
                        },
                        {
                            "name": "•Omni-direction Firing",
                            "value": "This action has no limit of fire direction."
                        },
                        {
                            "name": "Melee Firing",
                            "value": "This action can still be performed during Melee Lock."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 1,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟核心",
                                    "en": "RDL Core",
                                    "jp": "RDLコア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        },
                        {
                            "box": {
                                "id": 2,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟铁骑",
                                    "en": "RDL Cavalry",
                                    "jp": "RDLカブリ"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        },
                        {
                            "box": {
                                "id": 3,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟重金属",
                                    "en": "RDL Heavy Metal",
                                    "jp": "RDLヘビーメタル"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
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
                    "keywords": [
                        {
                            "name": "Volley X",
                            "value": "Fire or deploy up to X Projectiles and consume an equal amount of Ammo Tokens."
                        },
                        {
                            "name": "Fire in arc",
                            "value": "This action does not require visual to the landing point or the target."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 1,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟核心",
                                    "en": "RDL Core",
                                    "jp": "RDLコア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        },
                        {
                            "box": {
                                "id": 2,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟铁骑",
                                    "en": "RDL Cavalry",
                                    "jp": "RDLカブリ"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        },
                        {
                            "box": {
                                "id": 3,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟重金属",
                                    "en": "RDL Heavy Metal",
                                    "jp": "RDLヘビーメタル"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
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
                    "keywords": [
                        {
                            "name": "Fire Control Interference",
                            "value": "Units bearing a Fire Control Interference Token cannot perform Firing Actions or Interception.Projectiles with an Electronic Values are destroyed immediately if they obtain a Fire Control Interference Token."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 13,
                                "faction": [
                                    "PD"
                                ],
                                "name": {
                                    "zh": "LAB 星环动力 收割者轻型",
                                    "en": "LAB PD Reaper Type 1",
                                    "jp": "LAB PD リーパー タイプ1"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
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
                    "isPD": true,
                    "projectile": [
                        "PDAM-001"
                    ],
                    "keywords": [
                        {
                            "name": "Volley X",
                            "value": "Fire or deploy up to X Projectiles and consume an equal amount of Ammo Tokens."
                        },
                        {
                            "name": "Fire in arc",
                            "value": "This action does not require visual to the landing point or the target."
                        },
                        {
                            "name": "Fire Control Interference",
                            "value": "Units bearing a Fire Control Interference Token cannot perform Firing Actions or Interception.Projectiles with an Electronic Values are destroyed immediately if they obtain a Fire Control Interference Token."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 13,
                                "faction": [
                                    "PD"
                                ],
                                "name": {
                                    "zh": "LAB 星环动力 收割者轻型",
                                    "en": "LAB PD Reaper Type 1",
                                    "jp": "LAB PD リーパー タイプ1"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
                }
            ],
            "tacticCards": [],
            "totalScore": 414,
            "mechCount": 1,
            "largeDroneCount": 2,
            "mediumDroneCount": 2,
            "smallDroneCount": 0,
            "deviceID": "d6eeef82f83d4f5158d95ea55eab8837231d6e7061c6ee95c26275204fe3d499"
        },
        team1: {
            "id": "1764243819518",
            "name": "新小队",
            "faction": "UN",
            "mechs": [
                {
                    "id": "1775611833174",
                    "name": "新机体",
                    "parts": {
                        "torso": {
                            "id": "555",
                            "name": "TM35BT 金牛 实验核心",
                            "score": 84,
                            "armor": 5,
                            "structure": 4,
                            "parray": 0,
                            "dodge": 1,
                            "electronic": 4,
                            "type": "torso",
                            "description": "",
                            "imgSrc": "",
                            "tags": [],
                            "keywords": [
                                {
                                    "name": "KC装甲",
                                    "value": "当本机受击时，可消耗本部件的充能标记，将受击骰结果中的 闪电 视为 防御。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 17,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "单机包-金牛",
                                            "en": "Single Pack Taurus",
                                            "jp": "シングル タウラス"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "chasis": {
                            "id": "100",
                            "name": "LM210S 隐秘下肢",
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
                            "keywords": [
                                {
                                    "name": "静默",
                                    "value": "执行本动作时不会解除光学迷彩与低特征。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 5,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "手术刀",
                                            "en": "Scalpel",
                                            "jp": "スカルペル"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 2
                                }
                            ]
                        },
                        "leftHand": {
                            "id": "540",
                            "name": "S9“流星”盾 + IGX106离子炮",
                            "type": "leftHand",
                            "score": 69,
                            "armor": 4,
                            "structure": 0,
                            "parray": 2,
                            "dodge": 1,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "keywords": [
                                {
                                    "name": "空手",
                                    "value": ""
                                },
                                {
                                    "name": "震撼",
                                    "value": "闪电 扣除对方1点链接值。(注：效果可叠加)"
                                },
                                {
                                    "name": "毁伤",
                                    "value": "溢出伤害可结算至结构值。"
                                },
                                {
                                    "name": "霰射",
                                    "value": "如果目标为机甲，溢出伤害结算至目标另1个随机部件。"
                                },
                                {
                                    "name": "离子武器",
                                    "value": "命中拥有脆弱标记的目标时， 闪电 可视为 重击 。"
                                },
                                {
                                    "name": "近战射击",
                                    "value": "在近战锁定中仍可执行本动作。"
                                }
                            ],
                            "action": [
                                {
                                    "id": "540_A",
                                    "name": "盾击",
                                    "description": "· 震撼",
                                    "type": "Melee",
                                    "size": "s",
                                    "range": -1,
                                    "storage": 0,
                                    "yellowDice": 5,
                                    "redDice": 0
                                },
                                {
                                    "id": "540_B",
                                    "name": "点射",
                                    "description": "· [充能]获得毁伤。\r\n· 霰射\r\n· 离子武器\r\n· 近战射击",
                                    "type": "Firing",
                                    "size": "s",
                                    "range": 3,
                                    "storage": 0,
                                    "yellowDice": 3,
                                    "redDice": 1
                                }
                            ],
                            "projectile": [],
                            "isPD": false,
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "rightHand": {
                            "id": "148",
                            "name": "G6霰射炮 + M5刺桩",
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
                            "keywords": [
                                {
                                    "name": "霰射",
                                    "value": "如果目标为机甲，溢出伤害结算至目标另1个随机部件。"
                                },
                                {
                                    "name": "激光武器",
                                    "value": "命中使目标获得脆弱标记。"
                                },
                                {
                                    "name": "近战射击",
                                    "value": "在近战锁定中仍可执行本动作。"
                                },
                                {
                                    "name": "毁伤",
                                    "value": "溢出伤害可结算至结构值。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 6,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "破门锤",
                                            "en": "Doorbreaker",
                                            "jp": "ドアブレイカー"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 2
                                }
                            ]
                        },
                        "backpack": {
                            "id": "538",
                            "name": "JP5机动提升包",
                            "type": "backpack",
                            "score": 60,
                            "armor": 3,
                            "structure": 0,
                            "parray": 0,
                            "dodge": 2,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "keywords": [
                                {
                                    "name": "负载",
                                    "value": "一个部件被无人机携带。无人机并不会获得这个部件的能力与属性。"
                                }
                            ],
                            "action": [
                                {
                                    "id": "538_A",
                                    "name": "滑跃",
                                    "description": "· 本机调整移动距离+1。\r\n· 本部件无法作为负载。",
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
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        }
                    },
                    "pilot": {
                        "id": "LPA-19",
                        "name": "石英",
                        "score": 24,
                        "LV": 4,
                        "faction": "UN",
                        "swift": 2,
                        "melee": 5,
                        "projectile": 4,
                        "firing": 4,
                        "moving": 6,
                        "tactic": 6,
                        "trait": "沉著",
                        "traitDescription": "· 每回合结束时恢复1点链接值。",
                        "box": {
                            "id": 4,
                            "faction": [
                                "UN"
                            ],
                            "name": {
                                "zh": "核心",
                                "en": "Core",
                                "jp": "コア"
                            },
                            "hasImage": true
                        }
                    }
                },
                {
                    "id": "1775611860107",
                    "name": "新机体",
                    "parts": {
                        "torso": {
                            "id": "555",
                            "name": "TM35BT 金牛 实验核心",
                            "score": 84,
                            "armor": 5,
                            "structure": 4,
                            "parray": 0,
                            "dodge": 1,
                            "electronic": 4,
                            "type": "torso",
                            "description": "",
                            "imgSrc": "",
                            "tags": [],
                            "keywords": [
                                {
                                    "name": "KC装甲",
                                    "value": "当本机受击时，可消耗本部件的充能标记，将受击骰结果中的 闪电 视为 防御。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 17,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "单机包-金牛",
                                            "en": "Single Pack Taurus",
                                            "jp": "シングル タウラス"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "chasis": {
                            "id": "250",
                            "name": "LM210SO 隐秘下肢试作型",
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
                            "keywords": [
                                {
                                    "name": "静默",
                                    "value": "执行本动作时不会解除光学迷彩与低特征。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 12,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "LAB 试作章鱼",
                                            "en": "Trial Octopus",
                                            "jp": "トライアル UN オクトパス"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "leftHand": {
                            "id": "150",
                            "name": "RHX23暴雨突击手枪（左）",
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
                            "keywords": [
                                {
                                    "name": "全向射击",
                                    "value": "本动作没有射界限制。"
                                },
                                {
                                    "name": "压制",
                                    "value": "被本动作宣布为目标的机甲会立刻切换为防御姿态（处于宕机姿态的单位不受此影响）。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 6,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "破门锤",
                                            "en": "Doorbreaker",
                                            "jp": "ドアブレイカー"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                },
                                {
                                    "box": {
                                        "id": 4,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "核心",
                                            "en": "Core",
                                            "jp": "コア"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "rightHand": {
                            "id": "115",
                            "name": "S100大盾 + R6SS肩炮",
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
                            "keywords": [
                                {
                                    "name": "激光武器",
                                    "value": "命中使目标获得脆弱标记。"
                                },
                                {
                                    "name": "静止",
                                    "value": "在本次行动机会中，如果本单位执行本动作前没有发生位移，也没有改变朝向，则可以获得本条特殊规则的效果。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 4,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "核心",
                                            "en": "Core",
                                            "jp": "コア"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "backpack": {
                            "id": "084",
                            "name": "DBP龟壳掩体挂架",
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
                            ],
                            "keywords": [],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 5,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "手术刀",
                                            "en": "Scalpel",
                                            "jp": "スカルペル"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        }
                    },
                    "pilot": {
                        "id": "LPA-23-2",
                        "name": "玉髓 温柔和弦",
                        "score": 24,
                        "LV": 4,
                        "faction": "UN",
                        "swift": 6,
                        "melee": 2,
                        "projectile": 3,
                        "firing": 5,
                        "moving": 4,
                        "tactic": 4,
                        "trait": "装饰音",
                        "traitDescription": "· 当本机执行射击动作时，如果目标处于3格内范围，本次射击动作+1Y。",
                        "box": {
                            "id": 18,
                            "faction": [
                                "RDL",
                                "UN"
                            ],
                            "name": {
                                "zh": "对战包-突袭",
                                "en": "Combat Pack Raid",
                                "jp": "コンバットレイド"
                            },
                            "hasImage": true
                        }
                    }
                }
            ],
            "drones": [
                {
                    "id": "543",
                    "name": "ADK15P离子型豪猪",
                    "type": "medium",
                    "score": 70,
                    "armor": 4,
                    "structure": 2,
                    "parray": 0,
                    "dodge": 0,
                    "electronic": 2,
                    "move": 5,
                    "stance": "defensive",
                    "description": "",
                    "projectile": [],
                    "isPD": false,
                    "keywords": [
                        {
                            "name": "毁伤",
                            "value": "溢出伤害可结算至结构值。"
                        },
                        {
                            "name": "离子武器",
                            "value": "命中拥有脆弱标记的目标时， 闪电 可视为 重击 。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 18,
                                "faction": [
                                    "RDL",
                                    "UN"
                                ],
                                "name": {
                                    "zh": "对战包-突袭",
                                    "en": "Combat Pack Raid",
                                    "jp": "コンバットレイド"
                                },
                                "hasImage": false
                            },
                            "quantityPerBox": 1
                        }
                    ],
                    "hasImage": false,
                    "actions": [
                        {
                            "id": "543_A",
                            "name": "点射",
                            "description": "· [充能]获得毁伤。\r\n· 离子武器",
                            "type": "Firing",
                            "speed": "auto",
                            "range": 12,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 4
                        },
                        {
                            "id": "543_B",
                            "name": "充能",
                            "description": "· 为本机进行充能。",
                            "type": "Tactic",
                            "speed": "command",
                            "range": 0,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 0
                        }
                    ]
                },
                {
                    "id": "166",
                    "name": "ADK60S 干扰型渡鸦",
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
                    "keywords": [
                        {
                            "name": "电子攻击",
                            "value": "本动作是一个电子攻击（EA）动作，当有效果限制或强化“电子攻击“时，本动作受其影响；若无进一步描述，本动作以敌方单位为目标，需要进行电子对抗投骰，如果成功则起效。"
                        },
                        {
                            "name": "火控干扰",
                            "value": "携带火控干扰标记的单位不能执行射击动作，也不能进行拦截。有电子值的抛射物在获得火控干扰标记时直接被摧毁。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 4,
                                "faction": [
                                    "UN"
                                ],
                                "name": {
                                    "zh": "核心",
                                    "en": "Core",
                                    "jp": "コア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        }
                    ]
                },
                {
                    "id": "543",
                    "name": "ADK15P离子型豪猪",
                    "type": "medium",
                    "score": 70,
                    "armor": 4,
                    "structure": 2,
                    "parray": 0,
                    "dodge": 0,
                    "electronic": 2,
                    "move": 5,
                    "stance": "defensive",
                    "description": "",
                    "projectile": [],
                    "isPD": false,
                    "keywords": [
                        {
                            "name": "毁伤",
                            "value": "溢出伤害可结算至结构值。"
                        },
                        {
                            "name": "离子武器",
                            "value": "命中拥有脆弱标记的目标时， 闪电 可视为 重击 。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 18,
                                "faction": [
                                    "RDL",
                                    "UN"
                                ],
                                "name": {
                                    "zh": "对战包-突袭",
                                    "en": "Combat Pack Raid",
                                    "jp": "コンバットレイド"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ],
                    "actions": [
                        {
                            "id": "543_A",
                            "name": "点射",
                            "description": "· [充能]获得毁伤。\r\n· 离子武器",
                            "type": "Firing",
                            "speed": "auto",
                            "range": 12,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 4
                        },
                        {
                            "id": "543_B",
                            "name": "充能",
                            "description": "· 为本机进行充能。",
                            "type": "Tactic",
                            "speed": "command",
                            "range": 0,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 0
                        }
                    ]
                },
                {
                    "id": "166",
                    "name": "ADK60S 干扰型渡鸦",
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
                    "keywords": [
                        {
                            "name": "电子攻击",
                            "value": "本动作是一个电子攻击（EA）动作，当有效果限制或强化“电子攻击“时，本动作受其影响；若无进一步描述，本动作以敌方单位为目标，需要进行电子对抗投骰，如果成功则起效。"
                        },
                        {
                            "name": "火控干扰",
                            "value": "携带火控干扰标记的单位不能执行射击动作，也不能进行拦截。有电子值的抛射物在获得火控干扰标记时直接被摧毁。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 4,
                                "faction": [
                                    "UN"
                                ],
                                "name": {
                                    "zh": "核心",
                                    "en": "Core",
                                    "jp": "コア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        }
                    ]
                }
            ],
            "tacticCards": [],
            "totalScore": 893,
            "mechCount": 2,
            "largeDroneCount": 0,
            "mediumDroneCount": 4,
            "smallDroneCount": 0,
            "deviceID": "d6eeef82f83d4f5158d95ea55eab8837231d6e7061c6ee95c26275204fe3d499"
        }
    },
    {
        userQQ: '2443165077',
        userName: '玩家F',
        team2: {
            "id": "1765701343659",
            "name": "New Squad",
            "faction": "RDL",
            "mechs": [
                {
                    "id": "1775033551292",
                    "name": "对战包-复盟",
                    "parts": {
                        "torso": {
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
                            "keywords": [],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 1,
                                        "faction": [
                                            "RDL"
                                        ],
                                        "name": {
                                            "zh": "核心",
                                            "en": "Core",
                                            "jp": "コア"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 4
                                },
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "chasis": {
                            "id": "534",
                            "name": "RL-08C Armored Chassis",
                            "type": "chasis",
                            "score": 24,
                            "armor": 5,
                            "structure": 1,
                            "parray": 0,
                            "dodge": 3,
                            "electronic": 0,
                            "move": 1,
                            "description": "",
                            "keywords": [],
                            "action": [],
                            "projectile": [],
                            "isPD": false,
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "rightHand": {
                            "id": "536",
                            "name": "PC-6 Shotgun",
                            "type": "rightHand",
                            "score": 48,
                            "armor": 4,
                            "structure": 0,
                            "parray": 0,
                            "dodge": 0,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "throwIndex": "537",
                            "keywords": [
                                {
                                    "name": "Melee Firing",
                                    "value": "This action can still be performed during Melee Lock."
                                }
                            ],
                            "projectile": [],
                            "isPD": false,
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "backpack": {
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
                            "keywords": [
                                {
                                    "name": "Intercept X",
                                    "value": "This Part carries X Interception Tokens."
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 1,
                                        "faction": [
                                            "RDL"
                                        ],
                                        "name": {
                                            "zh": "核心",
                                            "en": "Core",
                                            "jp": "コア"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                },
                                {
                                    "box": {
                                        "id": 16,
                                        "faction": [
                                            "RDL"
                                        ],
                                        "name": {
                                            "zh": "单机包-沙丘",
                                            "en": "Single Pack Dune",
                                            "jp": "シングル デューン"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                },
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        }
                    },
                    "pilot": {
                        "id": "FPA-06",
                        "name": "锁眼",
                        "score": 12,
                        "LV": 4,
                        "faction": "RDL",
                        "swift": 2,
                        "melee": 5,
                        "projectile": 4,
                        "firing": 6,
                        "moving": 6,
                        "tactic": 7,
                        "trait": "功率加大",
                        "traitDescription": "· 本机的光环、电子攻击与电子支援，+1范围。",
                        "box": {
                            "id": 2,
                            "faction": [
                                "RDL"
                            ],
                            "name": {
                                "zh": "铁骑",
                                "en": "Cavalry",
                                "jp": "カブリ"
                            },
                            "hasImage": true
                        }
                    }
                }
            ],
            "drones": [
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
                    "keywords": [
                        {
                            "name": "Intercept X",
                            "value": "This Part carries X Interception Tokens."
                        },
                        {
                            "name": "•Omni-direction Firing",
                            "value": "This action has no limit of fire direction."
                        },
                        {
                            "name": "Melee Firing",
                            "value": "This action can still be performed during Melee Lock."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 1,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟核心",
                                    "en": "RDL Core",
                                    "jp": "RDLコア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        },
                        {
                            "box": {
                                "id": 2,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟铁骑",
                                    "en": "RDL Cavalry",
                                    "jp": "RDLカブリ"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        },
                        {
                            "box": {
                                "id": 3,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟重金属",
                                    "en": "RDL Heavy Metal",
                                    "jp": "RDLヘビーメタル"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
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
                    "keywords": [
                        {
                            "name": "Volley X",
                            "value": "Fire or deploy up to X Projectiles and consume an equal amount of Ammo Tokens."
                        },
                        {
                            "name": "Fire in arc",
                            "value": "This action does not require visual to the landing point or the target."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 1,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟核心",
                                    "en": "RDL Core",
                                    "jp": "RDLコア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        },
                        {
                            "box": {
                                "id": 2,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟铁骑",
                                    "en": "RDL Cavalry",
                                    "jp": "RDLカブリ"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        },
                        {
                            "box": {
                                "id": 3,
                                "faction": [
                                    "RDL"
                                ],
                                "name": {
                                    "zh": "复盟重金属",
                                    "en": "RDL Heavy Metal",
                                    "jp": "RDLヘビーメタル"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
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
                    "keywords": [
                        {
                            "name": "Fire Control Interference",
                            "value": "Units bearing a Fire Control Interference Token cannot perform Firing Actions or Interception.Projectiles with an Electronic Values are destroyed immediately if they obtain a Fire Control Interference Token."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 13,
                                "faction": [
                                    "PD"
                                ],
                                "name": {
                                    "zh": "LAB 星环动力 收割者轻型",
                                    "en": "LAB PD Reaper Type 1",
                                    "jp": "LAB PD リーパー タイプ1"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
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
                    "isPD": true,
                    "projectile": [
                        "PDAM-001"
                    ],
                    "keywords": [
                        {
                            "name": "Volley X",
                            "value": "Fire or deploy up to X Projectiles and consume an equal amount of Ammo Tokens."
                        },
                        {
                            "name": "Fire in arc",
                            "value": "This action does not require visual to the landing point or the target."
                        },
                        {
                            "name": "Fire Control Interference",
                            "value": "Units bearing a Fire Control Interference Token cannot perform Firing Actions or Interception.Projectiles with an Electronic Values are destroyed immediately if they obtain a Fire Control Interference Token."
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 13,
                                "faction": [
                                    "PD"
                                ],
                                "name": {
                                    "zh": "LAB 星环动力 收割者轻型",
                                    "en": "LAB PD Reaper Type 1",
                                    "jp": "LAB PD リーパー タイプ1"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ]
                }
            ],
            "tacticCards": [],
            "totalScore": 414,
            "mechCount": 1,
            "largeDroneCount": 2,
            "mediumDroneCount": 2,
            "smallDroneCount": 0,
            "deviceID": "d6eeef82f83d4f5158d95ea55eab8837231d6e7061c6ee95c26275204fe3d499"
        },
        team1: {
            "id": "1764243819518",
            "name": "新小队",
            "faction": "UN",
            "mechs": [
                {
                    "id": "1775611833174",
                    "name": "新机体",
                    "parts": {
                        "torso": {
                            "id": "555",
                            "name": "TM35BT 金牛 实验核心",
                            "score": 84,
                            "armor": 5,
                            "structure": 4,
                            "parray": 0,
                            "dodge": 1,
                            "electronic": 4,
                            "type": "torso",
                            "description": "",
                            "imgSrc": "",
                            "tags": [],
                            "keywords": [
                                {
                                    "name": "KC装甲",
                                    "value": "当本机受击时，可消耗本部件的充能标记，将受击骰结果中的 闪电 视为 防御。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 17,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "单机包-金牛",
                                            "en": "Single Pack Taurus",
                                            "jp": "シングル タウラス"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "chasis": {
                            "id": "100",
                            "name": "LM210S 隐秘下肢",
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
                            "keywords": [
                                {
                                    "name": "静默",
                                    "value": "执行本动作时不会解除光学迷彩与低特征。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 5,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "手术刀",
                                            "en": "Scalpel",
                                            "jp": "スカルペル"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 2
                                }
                            ]
                        },
                        "leftHand": {
                            "id": "540",
                            "name": "S9“流星”盾 + IGX106离子炮",
                            "type": "leftHand",
                            "score": 69,
                            "armor": 4,
                            "structure": 0,
                            "parray": 2,
                            "dodge": 1,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "keywords": [
                                {
                                    "name": "空手",
                                    "value": ""
                                },
                                {
                                    "name": "震撼",
                                    "value": "闪电 扣除对方1点链接值。(注：效果可叠加)"
                                },
                                {
                                    "name": "毁伤",
                                    "value": "溢出伤害可结算至结构值。"
                                },
                                {
                                    "name": "霰射",
                                    "value": "如果目标为机甲，溢出伤害结算至目标另1个随机部件。"
                                },
                                {
                                    "name": "离子武器",
                                    "value": "命中拥有脆弱标记的目标时， 闪电 可视为 重击 。"
                                },
                                {
                                    "name": "近战射击",
                                    "value": "在近战锁定中仍可执行本动作。"
                                }
                            ],
                            "action": [
                                {
                                    "id": "540_A",
                                    "name": "盾击",
                                    "description": "· 震撼",
                                    "type": "Melee",
                                    "size": "s",
                                    "range": -1,
                                    "storage": 0,
                                    "yellowDice": 5,
                                    "redDice": 0
                                },
                                {
                                    "id": "540_B",
                                    "name": "点射",
                                    "description": "· [充能]获得毁伤。\r\n· 霰射\r\n· 离子武器\r\n· 近战射击",
                                    "type": "Firing",
                                    "size": "s",
                                    "range": 3,
                                    "storage": 0,
                                    "yellowDice": 3,
                                    "redDice": 1
                                }
                            ],
                            "projectile": [],
                            "isPD": false,
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "rightHand": {
                            "id": "148",
                            "name": "G6霰射炮 + M5刺桩",
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
                            "keywords": [
                                {
                                    "name": "霰射",
                                    "value": "如果目标为机甲，溢出伤害结算至目标另1个随机部件。"
                                },
                                {
                                    "name": "激光武器",
                                    "value": "命中使目标获得脆弱标记。"
                                },
                                {
                                    "name": "近战射击",
                                    "value": "在近战锁定中仍可执行本动作。"
                                },
                                {
                                    "name": "毁伤",
                                    "value": "溢出伤害可结算至结构值。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 6,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "破门锤",
                                            "en": "Doorbreaker",
                                            "jp": "ドアブレイカー"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 2
                                }
                            ]
                        },
                        "backpack": {
                            "id": "538",
                            "name": "JP5机动提升包",
                            "type": "backpack",
                            "score": 60,
                            "armor": 3,
                            "structure": 0,
                            "parray": 0,
                            "dodge": 2,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "keywords": [
                                {
                                    "name": "负载",
                                    "value": "一个部件被无人机携带。无人机并不会获得这个部件的能力与属性。"
                                }
                            ],
                            "action": [
                                {
                                    "id": "538_A",
                                    "name": "滑跃",
                                    "description": "· 本机调整移动距离+1。\r\n· 本部件无法作为负载。",
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
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        }
                    },
                    "pilot": {
                        "id": "LPA-19",
                        "name": "石英",
                        "score": 24,
                        "LV": 4,
                        "faction": "UN",
                        "swift": 2,
                        "melee": 5,
                        "projectile": 4,
                        "firing": 4,
                        "moving": 6,
                        "tactic": 6,
                        "trait": "沉著",
                        "traitDescription": "· 每回合结束时恢复1点链接值。",
                        "box": {
                            "id": 4,
                            "faction": [
                                "UN"
                            ],
                            "name": {
                                "zh": "核心",
                                "en": "Core",
                                "jp": "コア"
                            },
                            "hasImage": true
                        }
                    }
                },
                {
                    "id": "1775611860107",
                    "name": "新机体",
                    "parts": {
                        "torso": {
                            "id": "555",
                            "name": "TM35BT 金牛 实验核心",
                            "score": 84,
                            "armor": 5,
                            "structure": 4,
                            "parray": 0,
                            "dodge": 1,
                            "electronic": 4,
                            "type": "torso",
                            "description": "",
                            "imgSrc": "",
                            "tags": [],
                            "keywords": [
                                {
                                    "name": "KC装甲",
                                    "value": "当本机受击时，可消耗本部件的充能标记，将受击骰结果中的 闪电 视为 防御。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 17,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "单机包-金牛",
                                            "en": "Single Pack Taurus",
                                            "jp": "シングル タウラス"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "chasis": {
                            "id": "250",
                            "name": "LM210SO 隐秘下肢试作型",
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
                            "keywords": [
                                {
                                    "name": "静默",
                                    "value": "执行本动作时不会解除光学迷彩与低特征。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 12,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "LAB 试作章鱼",
                                            "en": "Trial Octopus",
                                            "jp": "トライアル UN オクトパス"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "leftHand": {
                            "id": "150",
                            "name": "RHX23暴雨突击手枪（左）",
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
                            "keywords": [
                                {
                                    "name": "全向射击",
                                    "value": "本动作没有射界限制。"
                                },
                                {
                                    "name": "压制",
                                    "value": "被本动作宣布为目标的机甲会立刻切换为防御姿态（处于宕机姿态的单位不受此影响）。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 6,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "破门锤",
                                            "en": "Doorbreaker",
                                            "jp": "ドアブレイカー"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                },
                                {
                                    "box": {
                                        "id": 4,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "核心",
                                            "en": "Core",
                                            "jp": "コア"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "rightHand": {
                            "id": "115",
                            "name": "S100大盾 + R6SS肩炮",
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
                            "keywords": [
                                {
                                    "name": "激光武器",
                                    "value": "命中使目标获得脆弱标记。"
                                },
                                {
                                    "name": "静止",
                                    "value": "在本次行动机会中，如果本单位执行本动作前没有发生位移，也没有改变朝向，则可以获得本条特殊规则的效果。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 4,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "核心",
                                            "en": "Core",
                                            "jp": "コア"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "backpack": {
                            "id": "084",
                            "name": "DBP龟壳掩体挂架",
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
                            ],
                            "keywords": [],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 5,
                                        "faction": [
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "手术刀",
                                            "en": "Scalpel",
                                            "jp": "スカルペル"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        }
                    },
                    "pilot": {
                        "id": "LPA-23-2",
                        "name": "玉髓 温柔和弦",
                        "score": 24,
                        "LV": 4,
                        "faction": "UN",
                        "swift": 6,
                        "melee": 2,
                        "projectile": 3,
                        "firing": 5,
                        "moving": 4,
                        "tactic": 4,
                        "trait": "装饰音",
                        "traitDescription": "· 当本机执行射击动作时，如果目标处于3格内范围，本次射击动作+1Y。",
                        "box": {
                            "id": 18,
                            "faction": [
                                "RDL",
                                "UN"
                            ],
                            "name": {
                                "zh": "对战包-突袭",
                                "en": "Combat Pack Raid",
                                "jp": "コンバットレイド"
                            },
                            "hasImage": true
                        }
                    }
                }
            ],
            "drones": [
                {
                    "id": "543",
                    "name": "ADK15P离子型豪猪",
                    "type": "medium",
                    "score": 70,
                    "armor": 4,
                    "structure": 2,
                    "parray": 0,
                    "dodge": 0,
                    "electronic": 2,
                    "move": 5,
                    "stance": "defensive",
                    "description": "",
                    "projectile": [],
                    "isPD": false,
                    "keywords": [
                        {
                            "name": "毁伤",
                            "value": "溢出伤害可结算至结构值。"
                        },
                        {
                            "name": "离子武器",
                            "value": "命中拥有脆弱标记的目标时， 闪电 可视为 重击 。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 18,
                                "faction": [
                                    "RDL",
                                    "UN"
                                ],
                                "name": {
                                    "zh": "对战包-突袭",
                                    "en": "Combat Pack Raid",
                                    "jp": "コンバットレイド"
                                },
                                "hasImage": false
                            },
                            "quantityPerBox": 1
                        }
                    ],
                    "hasImage": false,
                    "actions": [
                        {
                            "id": "543_A",
                            "name": "点射",
                            "description": "· [充能]获得毁伤。\r\n· 离子武器",
                            "type": "Firing",
                            "speed": "auto",
                            "range": 12,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 4
                        },
                        {
                            "id": "543_B",
                            "name": "充能",
                            "description": "· 为本机进行充能。",
                            "type": "Tactic",
                            "speed": "command",
                            "range": 0,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 0
                        }
                    ]
                },
                {
                    "id": "166",
                    "name": "ADK60S 干扰型渡鸦",
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
                    "keywords": [
                        {
                            "name": "电子攻击",
                            "value": "本动作是一个电子攻击（EA）动作，当有效果限制或强化“电子攻击“时，本动作受其影响；若无进一步描述，本动作以敌方单位为目标，需要进行电子对抗投骰，如果成功则起效。"
                        },
                        {
                            "name": "火控干扰",
                            "value": "携带火控干扰标记的单位不能执行射击动作，也不能进行拦截。有电子值的抛射物在获得火控干扰标记时直接被摧毁。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 4,
                                "faction": [
                                    "UN"
                                ],
                                "name": {
                                    "zh": "核心",
                                    "en": "Core",
                                    "jp": "コア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        }
                    ]
                },
                {
                    "id": "543",
                    "name": "ADK15P离子型豪猪",
                    "type": "medium",
                    "score": 70,
                    "armor": 4,
                    "structure": 2,
                    "parray": 0,
                    "dodge": 0,
                    "electronic": 2,
                    "move": 5,
                    "stance": "defensive",
                    "description": "",
                    "projectile": [],
                    "isPD": false,
                    "keywords": [
                        {
                            "name": "毁伤",
                            "value": "溢出伤害可结算至结构值。"
                        },
                        {
                            "name": "离子武器",
                            "value": "命中拥有脆弱标记的目标时， 闪电 可视为 重击 。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 18,
                                "faction": [
                                    "RDL",
                                    "UN"
                                ],
                                "name": {
                                    "zh": "对战包-突袭",
                                    "en": "Combat Pack Raid",
                                    "jp": "コンバットレイド"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 1
                        }
                    ],
                    "actions": [
                        {
                            "id": "543_A",
                            "name": "点射",
                            "description": "· [充能]获得毁伤。\r\n· 离子武器",
                            "type": "Firing",
                            "speed": "auto",
                            "range": 12,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 4
                        },
                        {
                            "id": "543_B",
                            "name": "充能",
                            "description": "· 为本机进行充能。",
                            "type": "Tactic",
                            "speed": "command",
                            "range": 0,
                            "storage": 0,
                            "yellowDice": 0,
                            "redDice": 0
                        }
                    ]
                },
                {
                    "id": "166",
                    "name": "ADK60S 干扰型渡鸦",
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
                    "keywords": [
                        {
                            "name": "电子攻击",
                            "value": "本动作是一个电子攻击（EA）动作，当有效果限制或强化“电子攻击“时，本动作受其影响；若无进一步描述，本动作以敌方单位为目标，需要进行电子对抗投骰，如果成功则起效。"
                        },
                        {
                            "name": "火控干扰",
                            "value": "携带火控干扰标记的单位不能执行射击动作，也不能进行拦截。有电子值的抛射物在获得火控干扰标记时直接被摧毁。"
                        }
                    ],
                    "containedIn": [
                        {
                            "box": {
                                "id": 4,
                                "faction": [
                                    "UN"
                                ],
                                "name": {
                                    "zh": "核心",
                                    "en": "Core",
                                    "jp": "コア"
                                },
                                "hasImage": true
                            },
                            "quantityPerBox": 2
                        }
                    ]
                }
            ],
            "tacticCards": [],
            "totalScore": 893,
            "mechCount": 2,
            "largeDroneCount": 0,
            "mediumDroneCount": 4,
            "smallDroneCount": 0,
            "deviceID": "d6eeef82f83d4f5158d95ea55eab8837231d6e7061c6ee95c26275204fe3d499"
        }
    },
    {
        "userQQ": "1446157077",
        "userName": "ai1wei2xi3",
        "team1": {
  "id": "1775635395533",
  "name": "新小队",
  "faction": "RDL",
  "mechs": [
    {
      "id": "1775659833321",
      "name": "新机体 副本 副本",
      "parts": {
        "rightHand": {
          "id": "027",
          "name": "AC-32M射手步枪",
          "type": "rightHand",
          "score": 33,
          "armor": 4,
          "structure": 0,
          "parray": 0,
          "dodge": 0,
          "electronic": 0,
          "move": 0,
          "description": "",
          "throwIndex": "28",
          "keywords": [],
          "action": [
            {
              "id": "27_A",
              "name": "点射",
              "description": "·【双手】+2射程。\r\n· {眼睛}视为{2轻击}。",
              "type": "Firing",
              "size": "m",
              "range": 6,
              "storage": 0,
              "yellowDice": 1,
              "redDice": 3
            }
          ],
          "projectile": [],
          "isPD": false,
          "containedIn": [
            {
              "box": {
                "id": 19,
                "faction": [
                  "RDL",
                  "UN"
                ],
                "name": {
                  "zh": "游戏包",
                  "en": "Game Pack",
                  "jp": "ゲームパック"
                },
                "hasImage": true
              },
              "quantityPerBox": 2
            }
          ]
        },
        "torso": {
          "id": "287",
          "name": "ACE-001 「ホワイトドワーフ」コアパーツ",
          "type": "torso",
          "score": 72,
          "structure": 3,
          "armor": 5,
          "parray": 0,
          "dodge": 1,
          "electronic": 3,
          "description": "",
          "projectile": [
            "288"
          ],
          "isPD": true,
          "hasImage": true,
          "keywords": [],
          "containedIn": [
            {
              "box": {
                "id": 11,
                "faction": [
                  "COLLABORATION"
                ],
                "name": {
                  "zh": "白矮星",
                  "en": "White Dwarf",
                  "jp": "ホワイトドワーフ"
                },
                "hasImage": true
              },
              "quantityPerBox": 1
            }
          ]
        },
        "leftHand": {
          "id": "299",
          "name": "ML-32B双联发射器 + CC-3格斗刀",
          "type": "leftHand",
          "score": 33,
          "armor": 4,
          "structure": 0,
          "parray": 1,
          "dodge": 0,
          "electronic": 0,
          "move": 0,
          "description": "",
          "containedIn": [
            {
              "box": {
                "id": 19,
                "faction": [
                  "RDL",
                  "UN"
                ],
                "name": {
                  "zh": "游戏包",
                  "en": "Game Pack",
                  "jp": "ゲームパック"
                },
                "hasImage": true
              },
              "quantityPerBox": 2
            }
          ],
          "keywords": [
            {
              "name": "空手",
              "value": ""
            }
          ],
          "action": [
            {
              "id": "299_A",
              "name": "刺击",
              "description": "",
              "type": "Melee",
              "size": "s",
              "range": -1,
              "storage": 0,
              "yellowDice": 3,
              "redDice": 1
            },
            {
              "id": "299_B",
              "name": "导弹",
              "description": " · 曲射\r\n· 发射1枚MC-3“利剑”导弹。",
              "type": "Projectile",
              "size": "s",
              "range": 3,
              "storage": 2,
              "yellowDice": 0,
              "redDice": 0
            }
          ],
          "projectile": [
            "071"
          ],
          "isPD": false
        },
        "backpack": {
          "id": "011",
          "name": "ML-92双联导弹包",
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
          "keywords": [
            {
              "name": "齐射X",
              "value": "发射或布撒最多X枚抛射物，并消耗同等数量的弹药标记。"
            },
            {
              "name": "曲射",
              "value": "本动作不需要对落点或目标有视线。"
            }
          ],
          "containedIn": [
            {
              "box": {
                "id": 2,
                "faction": [
                  "RDL"
                ],
                "name": {
                  "zh": "铁骑",
                  "en": "Cavalry",
                  "jp": "カブリ"
                },
                "hasImage": true
              },
              "quantityPerBox": 1
            }
          ]
        },
        "chasis": {
          "id": "289",
          "name": " ACE-001 「ホワイトドワーフ」下肢パーツ",
          "type": "chasis",
          "score": 24,
          "structure": 0,
          "armor": 4,
          "parray": 0,
          "dodge": 3,
          "electronic": 0,
          "description": "",
          "isPD": true,
          "hasImage": true,
          "keywords": [],
          "containedIn": [
            {
              "box": {
                "id": 11,
                "faction": [
                  "COLLABORATION"
                ],
                "name": {
                  "zh": "白矮星",
                  "en": "White Dwarf",
                  "jp": "ホワイトドワーフ"
                },
                "hasImage": true
              },
              "quantityPerBox": 1
            }
          ]
        }
      },
      "pilot": {
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
        "traitDescription": "· When a \"White Dwarf\" Bit performs a roll, it may consume Link from this Mech to re-roll.",
        "box": {
          "id": 11,
          "faction": [
            "COLLABORATION"
          ],
          "name": {
            "zh": "白矮星",
            "en": "White Dwarf",
            "jp": "ホワイトドワーフ"
          },
          "hasImage": true
        }
      }
    },
    {
      "id": "1775659839505",
      "name": "新机体 副本 副本 副本",
      "parts": {
        "rightHand": {
          "id": "027",
          "name": "AC-32M射手步枪",
          "type": "rightHand",
          "score": 33,
          "armor": 4,
          "structure": 0,
          "parray": 0,
          "dodge": 0,
          "electronic": 0,
          "move": 0,
          "description": "",
          "throwIndex": "28",
          "keywords": [],
          "action": [
            {
              "id": "27_A",
              "name": "点射",
              "description": "·【双手】+2射程。\r\n· {眼睛}视为{2轻击}。",
              "type": "Firing",
              "size": "m",
              "range": 6,
              "storage": 0,
              "yellowDice": 1,
              "redDice": 3
            }
          ],
          "projectile": [],
          "isPD": false,
          "containedIn": [
            {
              "box": {
                "id": 19,
                "faction": [
                  "RDL",
                  "UN"
                ],
                "name": {
                  "zh": "游戏包",
                  "en": "Game Pack",
                  "jp": "ゲームパック"
                },
                "hasImage": true
              },
              "quantityPerBox": 2
            }
          ]
        },
        "torso": {
          "id": "019",
          "name": "RT-15C  冰川  突击核心",
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
          "keywords": [
            {
              "name": "直射",
              "value": "本动作需要对落点或目标有视线。"
            }
          ],
          "containedIn": [
            {
              "box": {
                "id": 2,
                "faction": [
                  "RDL"
                ],
                "name": {
                  "zh": "铁骑",
                  "en": "Cavalry",
                  "jp": "カブリ"
                },
                "hasImage": true
              },
              "quantityPerBox": 1
            }
          ]
        },
        "leftHand": {
          "id": "299",
          "name": "ML-32B双联发射器 + CC-3格斗刀",
          "type": "leftHand",
          "score": 33,
          "armor": 4,
          "structure": 0,
          "parray": 1,
          "dodge": 0,
          "electronic": 0,
          "move": 0,
          "description": "",
          "containedIn": [
            {
              "box": {
                "id": 19,
                "faction": [
                  "RDL",
                  "UN"
                ],
                "name": {
                  "zh": "游戏包",
                  "en": "Game Pack",
                  "jp": "ゲームパック"
                },
                "hasImage": true
              },
              "quantityPerBox": 2
            }
          ],
          "keywords": [
            {
              "name": "空手",
              "value": ""
            }
          ],
          "action": [
            {
              "id": "299_A",
              "name": "刺击",
              "description": "",
              "type": "Melee",
              "size": "s",
              "range": -1,
              "storage": 0,
              "yellowDice": 3,
              "redDice": 1
            },
            {
              "id": "299_B",
              "name": "导弹",
              "description": " · 曲射\r\n· 发射1枚MC-3“利剑”导弹。",
              "type": "Projectile",
              "size": "s",
              "range": 3,
              "storage": 2,
              "yellowDice": 0,
              "redDice": 0
            }
          ],
          "projectile": [
            "071"
          ],
          "isPD": false
        },
        "backpack": {
          "id": "011",
          "name": "ML-92双联导弹包",
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
          "keywords": [
            {
              "name": "齐射X",
              "value": "发射或布撒最多X枚抛射物，并消耗同等数量的弹药标记。"
            },
            {
              "name": "曲射",
              "value": "本动作不需要对落点或目标有视线。"
            }
          ],
          "containedIn": [
            {
              "box": {
                "id": 2,
                "faction": [
                  "RDL"
                ],
                "name": {
                  "zh": "铁骑",
                  "en": "Cavalry",
                  "jp": "カブリ"
                },
                "hasImage": true
              },
              "quantityPerBox": 1
            }
          ]
        },
        "chasis": {
          "id": "534",
          "name": "RL-08C\r\n 重甲下肢",
          "type": "chasis",
          "score": 24,
          "armor": 5,
          "structure": 1,
          "parray": 0,
          "dodge": 3,
          "electronic": 0,
          "move": 1,
          "description": "",
          "keywords": [],
          "action": [
            {
              "id": "534_A",
              "name": "奔跑",
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
          "containedIn": [
            {
              "box": {
                "id": 18,
                "faction": [
                  "RDL",
                  "UN"
                ],
                "name": {
                  "zh": "对战包-突袭",
                  "en": "Combat Pack Raid",
                  "jp": "コンバットレイド"
                },
                "hasImage": true
              },
              "quantityPerBox": 1
            }
          ]
        }
      },
      "pilot": {
        "id": "FPA-01",
        "name": "薄雾",
        "score": 15,
        "LV": 4,
        "faction": "RDL",
        "swift": 7,
        "melee": 4,
        "projectile": 5,
        "firing": 3,
        "moving": 3,
        "tactic": 2,
        "trait": "变招",
        "traitDescription": "· 在战术时机，起手动作不限制时机类型。",
        "box": {
          "id": 1,
          "faction": [
            "RDL"
          ],
          "name": {
            "zh": "核心",
            "en": "Core",
            "jp": "コア"
          },
          "hasImage": true
        }
      }
    },
    {
      "id": "1775911897584",
      "name": "新机体",
      "parts": {
        "torso": {
          "id": "547",
          "name": "H2-B“危机”II型",
          "type": "torso",
          "score": 63,
          "armor": 5,
          "structure": 3,
          "parray": 0,
          "dodge": 0,
          "electronic": 2,
          "move": 0,
          "description": "",
          "keywords": [
            {
              "name": "多目标X",
              "value": "本动作可以同时选择X个目标。如果使用多目标效果，则攻击时如下操作：计算本动作的总投骰数，增加攻击骰的效果在此时发动；将总投骰数任意分配给每一个目标，对这些目标依次执行一次攻击流程。攻击中，按照分配的投骰数投攻击骰。如果本动作由机甲发动，对每一个单独的攻击流程都可以专注；如果攻击造成特效，则每一次单独的攻击流程都单独对其目标造成特效。"
            }
          ],
          "action": [
            {
              "id": "547_A",
              "name": "扫射",
              "description": "·【静止】+1Y。\n·多目标5",
              "type": "Firing",
              "size": "m",
              "range": 8,
              "storage": 0,
              "yellowDice": 5,
              "redDice": 0
            },
            {
              "id": "547_B",
              "name": "攻击模式",
              "description": "· 【攻击姿态】本机获得行动机会时，可以增加1时点。",
              "type": "Passive",
              "size": "m",
              "range": 0,
              "storage": 0,
              "yellowDice": 0,
              "redDice": 0
            }
          ],
          "projectile": [],
          "isPD": true,
          "containedIn": [
            {
              "box": {
                "id": 24,
                "faction": [
                  "PD"
                ],
                "name": {
                  "zh": "危机 II",
                  "en": "Crisis II",
                  "jp": "クライシス II"
                },
                "hasImage": true
              },
              "quantityPerBox": 1
            }
          ]
        },
        "chasis": {
          "id": "548",
          "name": "HL2\n“危机”下肢",
          "type": "chasis",
          "score": 21,
          "armor": 5,
          "structure": 0,
          "parray": 0,
          "dodge": 3,
          "electronic": 0,
          "move": 1,
          "description": "",
          "keywords": [],
          "action": [
            {
              "id": "548_A",
              "name": "奔跑",
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
          "isPD": true,
          "containedIn": [
            {
              "box": {
                "id": 24,
                "faction": [
                  "PD"
                ],
                "name": {
                  "zh": "危机 II",
                  "en": "Crisis II",
                  "jp": "クライシス II"
                },
                "hasImage": true
              },
              "quantityPerBox": 1
            }
          ]
        },
        "leftHand": {
          "id": "550",
          "name": "Ls197R机炮（左）",
          "type": "leftHand",
          "score": 48,
          "armor": 3,
          "structure": 0,
          "parray": 0,
          "dodge": 0,
          "electronic": 0,
          "move": 0,
          "description": "",
          "keywords": [
            {
              "name": "遥控武器",
              "value": "指令阶段，友军可以向本机发送指令，使本机执行此动作。本部件每回合只能接收1次指令"
            }
          ],
          "action": [
            {
              "id": "550_A",
              "name": "点射",
              "description": "· 遥控武器",
              "type": "Firing",
              "size": "s",
              "range": 6,
              "storage": 0,
              "yellowDice": 4,
              "redDice": 0
            }
          ],
          "projectile": [],
          "isPD": true,
          "containedIn": [
            {
              "box": {
                "id": 24,
                "faction": [
                  "PD"
                ],
                "name": {
                  "zh": "危机 II",
                  "en": "Crisis II",
                  "jp": "クライシス II"
                },
                "hasImage": true
              },
              "quantityPerBox": 1
            }
          ]
        },
        "rightHand": {
          "id": "551",
          "name": "Ls197R机炮（右）",
          "type": "rightHand",
          "score": 48,
          "armor": 3,
          "structure": 0,
          "parray": 0,
          "dodge": 0,
          "electronic": 0,
          "move": 0,
          "description": "",
          "keywords": [
            {
              "name": "遥控武器",
              "value": "指令阶段，友军可以向本机发送指令，使本机执行此动作。本部件每回合只能接收1次指令"
            }
          ],
          "action": [
            {
              "id": "551_A",
              "name": "点射",
              "description": "· 遥控武器",
              "type": "Firing",
              "size": "s",
              "range": 6,
              "storage": 0,
              "yellowDice": 4,
              "redDice": 0
            }
          ],
          "projectile": [],
          "isPD": true,
          "containedIn": [
            {
              "box": {
                "id": 24,
                "faction": [
                  "PD"
                ],
                "name": {
                  "zh": "危机 II",
                  "en": "Crisis II",
                  "jp": "クライシス II"
                },
                "hasImage": true
              },
              "quantityPerBox": 1
            }
          ]
        },
        "backpack": {
          "id": "545",
          "name": "Ls297双联机炮",
          "type": "backpack",
          "score": 48,
          "armor": 3,
          "structure": 0,
          "parray": 0,
          "dodge": 0,
          "electronic": 0,
          "move": 0,
          "description": "·压制：被本动作宣布为目标的机甲会立刻切换为防御姿态（处于宕机姿态的单位不受此影响）。",
          "keywords": [
            {
              "name": "压制",
              "value": "被本动作宣布为目标的机甲会立刻切换为防御姿态（处于宕机姿态的单位不受此影响）。"
            }
          ],
          "action": [
            {
              "id": "545_A",
              "name": "扫射",
              "description": "· 压制",
              "type": "Firing",
              "size": "s",
              "range": 6,
              "storage": 0,
              "yellowDice": 1,
              "redDice": 2
            },
            {
              "id": "545_B",
              "name": "扫射",
              "description": "· 压制",
              "type": "Firing",
              "size": "s",
              "range": 6,
              "storage": 0,
              "yellowDice": 1,
              "redDice": 2
            }
          ],
          "projectile": [],
          "isPD": true,
          "containedIn": [
            {
              "box": {
                "id": 24,
                "faction": [
                  "PD"
                ],
                "name": {
                  "zh": "危机 II",
                  "en": "Crisis II",
                  "jp": "クライシス II"
                },
                "hasImage": true
              },
              "quantityPerBox": 1
            }
          ]
        }
      },
      "pilot": {
        "id": "XPA-60",
        "name": "战斗员A-102",
        "score": 10,
        "LV": 5,
        "faction": "PD",
        "swift": 8,
        "melee": 4,
        "projectile": 5,
        "firing": 3,
        "moving": 3,
        "tactic": 2,
        "trait": "",
        "traitDescription": "搭载作战员和LUKAS的运输机通常作为空中支援，在战场上空盘旋，以获得最低的延迟。",
        "box": {
          "id": 24,
          "faction": [
            "PD"
          ],
          "name": {
            "zh": "危机 II",
            "en": "Crisis II",
            "jp": "クライシス II"
          },
          "hasImage": true
        }
      }
    }
  ],
  "drones": [],
  "tacticCards": [
    {
      "id": "275",
      "name": "战地复苏",
      "description": "",
      "score": 30
    },
    {
      "id": "274",
      "name": "额外指令",
      "description": "",
      "score": 30
    }
  ],
  "totalScore": 676,
  "mechCount": 3,
  "largeDroneCount": 0,
  "mediumDroneCount": 0,
  "smallDroneCount": 0,
  "deviceID": "4182dae4304962b6f3e7bc7fce1ddcc79045c47eb9314aaef5e41d5272a8eceb"
},
        "team2": {
            "id": "1775659860322",
            "name": "新小队2",
            "faction": "RDL",
            "mechs": [
                {
                    "id": "1775635397718",
                    "name": "新机体",
                    "parts": {
                        "rightHand": {
                            "id": "027",
                            "name": "AC-32M射手步枪",
                            "type": "rightHand",
                            "score": 33,
                            "armor": 4,
                            "structure": 0,
                            "parray": 0,
                            "dodge": 0,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "throwIndex": "28",
                            "keywords": [],
                            "action": [
                                {
                                    "id": "27_A",
                                    "name": "点射",
                                    "description": "·【双手】+2射程。\r\n· {眼睛}视为{2轻击}。",
                                    "type": "Firing",
                                    "size": "m",
                                    "range": 6,
                                    "storage": 0,
                                    "yellowDice": 1,
                                    "redDice": 3
                                }
                            ],
                            "projectile": [],
                            "isPD": false,
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 19,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "游戏包",
                                            "en": "Game Pack",
                                            "jp": "ゲームパック"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 2
                                }
                            ]
                        },
                        "torso": {
                            "id": "019",
                            "name": "RT-15C  冰川  突击核心",
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
                            "keywords": [
                                {
                                    "name": "直射",
                                    "value": "本动作需要对落点或目标有视线。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 2,
                                        "faction": [
                                            "RDL"
                                        ],
                                        "name": {
                                            "zh": "铁骑",
                                            "en": "Cavalry",
                                            "jp": "カブリ"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "leftHand": {
                            "id": "299",
                            "name": "ML-32B双联发射器 + CC-3格斗刀",
                            "type": "leftHand",
                            "score": 33,
                            "armor": 4,
                            "structure": 0,
                            "parray": 1,
                            "dodge": 0,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 19,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "游戏包",
                                            "en": "Game Pack",
                                            "jp": "ゲームパック"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 2
                                }
                            ],
                            "keywords": [
                                {
                                    "name": "空手",
                                    "value": ""
                                }
                            ],
                            "action": [
                                {
                                    "id": "299_A",
                                    "name": "刺击",
                                    "description": "",
                                    "type": "Melee",
                                    "size": "s",
                                    "range": -1,
                                    "storage": 0,
                                    "yellowDice": 3,
                                    "redDice": 1
                                },
                                {
                                    "id": "299_B",
                                    "name": "导弹",
                                    "description": " · 曲射\r\n· 发射1枚MC-3“利剑”导弹。",
                                    "type": "Projectile",
                                    "size": "s",
                                    "range": 3,
                                    "storage": 2,
                                    "yellowDice": 0,
                                    "redDice": 0
                                }
                            ],
                            "projectile": [
                                "071"
                            ],
                            "isPD": false
                        },
                        "backpack": {
                            "id": "011",
                            "name": "ML-92双联导弹包",
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
                            "keywords": [
                                {
                                    "name": "齐射X",
                                    "value": "发射或布撒最多X枚抛射物，并消耗同等数量的弹药标记。"
                                },
                                {
                                    "name": "曲射",
                                    "value": "本动作不需要对落点或目标有视线。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 2,
                                        "faction": [
                                            "RDL"
                                        ],
                                        "name": {
                                            "zh": "铁骑",
                                            "en": "Cavalry",
                                            "jp": "カブリ"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "chasis": {
                            "id": "534",
                            "name": "RL-08C\r\n 重甲下肢",
                            "type": "chasis",
                            "score": 24,
                            "armor": 5,
                            "structure": 1,
                            "parray": 0,
                            "dodge": 3,
                            "electronic": 0,
                            "move": 1,
                            "description": "",
                            "keywords": [],
                            "action": [
                                {
                                    "id": "534_A",
                                    "name": "奔跑",
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
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        }
                    },
                    "pilot": {
                        "id": "FPA-04-2",
                        "name": "锤头鲨-内务能手",
                        "score": 18,
                        "LV": 4,
                        "faction": "RDL",
                        "swift": 4,
                        "melee": 3,
                        "projectile": 2,
                        "firing": 5,
                        "moving": 2,
                        "tactic": 6,
                        "trait": "除虫",
                        "traitDescription": "· 【攻击姿态】当本机获得行动机会时，可最多消耗1点链接值以获得1个动作时点。",
                        "box": {
                            "id": 18,
                            "faction": [
                                "RDL",
                                "UN"
                            ],
                            "name": {
                                "zh": "对战包-突袭",
                                "en": "Combat Pack Raid",
                                "jp": "コンバットレイド"
                            },
                            "hasImage": true
                        }
                    }
                },
                {
                    "id": "1775659829839",
                    "name": "新机体 副本",
                    "parts": {
                        "rightHand": {
                            "id": "027",
                            "name": "AC-32M射手步枪",
                            "type": "rightHand",
                            "score": 33,
                            "armor": 4,
                            "structure": 0,
                            "parray": 0,
                            "dodge": 0,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "throwIndex": "28",
                            "keywords": [],
                            "action": [
                                {
                                    "id": "27_A",
                                    "name": "点射",
                                    "description": "·【双手】+2射程。\r\n· {眼睛}视为{2轻击}。",
                                    "type": "Firing",
                                    "size": "m",
                                    "range": 6,
                                    "storage": 0,
                                    "yellowDice": 1,
                                    "redDice": 3
                                }
                            ],
                            "projectile": [],
                            "isPD": false,
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 19,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "游戏包",
                                            "en": "Game Pack",
                                            "jp": "ゲームパック"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 2
                                }
                            ]
                        },
                        "torso": {
                            "id": "019",
                            "name": "RT-15C  冰川  突击核心",
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
                            "keywords": [
                                {
                                    "name": "直射",
                                    "value": "本动作需要对落点或目标有视线。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 2,
                                        "faction": [
                                            "RDL"
                                        ],
                                        "name": {
                                            "zh": "铁骑",
                                            "en": "Cavalry",
                                            "jp": "カブリ"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "leftHand": {
                            "id": "299",
                            "name": "ML-32B双联发射器 + CC-3格斗刀",
                            "type": "leftHand",
                            "score": 33,
                            "armor": 4,
                            "structure": 0,
                            "parray": 1,
                            "dodge": 0,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 19,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "游戏包",
                                            "en": "Game Pack",
                                            "jp": "ゲームパック"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 2
                                }
                            ],
                            "keywords": [
                                {
                                    "name": "空手",
                                    "value": ""
                                }
                            ],
                            "action": [
                                {
                                    "id": "299_A",
                                    "name": "刺击",
                                    "description": "",
                                    "type": "Melee",
                                    "size": "s",
                                    "range": -1,
                                    "storage": 0,
                                    "yellowDice": 3,
                                    "redDice": 1
                                },
                                {
                                    "id": "299_B",
                                    "name": "导弹",
                                    "description": " · 曲射\r\n· 发射1枚MC-3“利剑”导弹。",
                                    "type": "Projectile",
                                    "size": "s",
                                    "range": 3,
                                    "storage": 2,
                                    "yellowDice": 0,
                                    "redDice": 0
                                }
                            ],
                            "projectile": [
                                "071"
                            ],
                            "isPD": false
                        },
                        "backpack": {
                            "id": "011",
                            "name": "ML-92双联导弹包",
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
                            "keywords": [
                                {
                                    "name": "齐射X",
                                    "value": "发射或布撒最多X枚抛射物，并消耗同等数量的弹药标记。"
                                },
                                {
                                    "name": "曲射",
                                    "value": "本动作不需要对落点或目标有视线。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 2,
                                        "faction": [
                                            "RDL"
                                        ],
                                        "name": {
                                            "zh": "铁骑",
                                            "en": "Cavalry",
                                            "jp": "カブリ"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "chasis": {
                            "id": "534",
                            "name": "RL-08C\r\n 重甲下肢",
                            "type": "chasis",
                            "score": 24,
                            "armor": 5,
                            "structure": 1,
                            "parray": 0,
                            "dodge": 3,
                            "electronic": 0,
                            "move": 1,
                            "description": "",
                            "keywords": [],
                            "action": [
                                {
                                    "id": "534_A",
                                    "name": "奔跑",
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
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        }
                    },
                    "pilot": {
                        "id": "FPA-05",
                        "name": "灰雁",
                        "score": 15,
                        "LV": 4,
                        "faction": "RDL",
                        "swift": 5,
                        "melee": 6,
                        "projectile": 9,
                        "firing": 3,
                        "moving": 8,
                        "tactic": 4,
                        "trait": "不竭",
                        "traitDescription": "· 本机的下肢如果没有结构值，则视为拥有2点结构值。",
                        "box": {
                            "id": 2,
                            "faction": [
                                "RDL"
                            ],
                            "name": {
                                "zh": "铁骑",
                                "en": "Cavalry",
                                "jp": "カブリ"
                            },
                            "hasImage": true
                        }
                    }
                },
                {
                    "id": "1775659833321",
                    "name": "新机体 副本 副本",
                    "parts": {
                        "rightHand": {
                            "id": "027",
                            "name": "AC-32M射手步枪",
                            "type": "rightHand",
                            "score": 33,
                            "armor": 4,
                            "structure": 0,
                            "parray": 0,
                            "dodge": 0,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "throwIndex": "28",
                            "keywords": [],
                            "action": [
                                {
                                    "id": "27_A",
                                    "name": "点射",
                                    "description": "·【双手】+2射程。\r\n· {眼睛}视为{2轻击}。",
                                    "type": "Firing",
                                    "size": "m",
                                    "range": 6,
                                    "storage": 0,
                                    "yellowDice": 1,
                                    "redDice": 3
                                }
                            ],
                            "projectile": [],
                            "isPD": false,
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 19,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "游戏包",
                                            "en": "Game Pack",
                                            "jp": "ゲームパック"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 2
                                }
                            ]
                        },
                        "torso": {
                            "id": "019",
                            "name": "RT-15C  冰川  突击核心",
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
                            "keywords": [
                                {
                                    "name": "直射",
                                    "value": "本动作需要对落点或目标有视线。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 2,
                                        "faction": [
                                            "RDL"
                                        ],
                                        "name": {
                                            "zh": "铁骑",
                                            "en": "Cavalry",
                                            "jp": "カブリ"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "leftHand": {
                            "id": "299",
                            "name": "ML-32B双联发射器 + CC-3格斗刀",
                            "type": "leftHand",
                            "score": 33,
                            "armor": 4,
                            "structure": 0,
                            "parray": 1,
                            "dodge": 0,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 19,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "游戏包",
                                            "en": "Game Pack",
                                            "jp": "ゲームパック"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 2
                                }
                            ],
                            "keywords": [
                                {
                                    "name": "空手",
                                    "value": ""
                                }
                            ],
                            "action": [
                                {
                                    "id": "299_A",
                                    "name": "刺击",
                                    "description": "",
                                    "type": "Melee",
                                    "size": "s",
                                    "range": -1,
                                    "storage": 0,
                                    "yellowDice": 3,
                                    "redDice": 1
                                },
                                {
                                    "id": "299_B",
                                    "name": "导弹",
                                    "description": " · 曲射\r\n· 发射1枚MC-3“利剑”导弹。",
                                    "type": "Projectile",
                                    "size": "s",
                                    "range": 3,
                                    "storage": 2,
                                    "yellowDice": 0,
                                    "redDice": 0
                                }
                            ],
                            "projectile": [
                                "071"
                            ],
                            "isPD": false
                        },
                        "backpack": {
                            "id": "011",
                            "name": "ML-92双联导弹包",
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
                            "keywords": [
                                {
                                    "name": "齐射X",
                                    "value": "发射或布撒最多X枚抛射物，并消耗同等数量的弹药标记。"
                                },
                                {
                                    "name": "曲射",
                                    "value": "本动作不需要对落点或目标有视线。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 2,
                                        "faction": [
                                            "RDL"
                                        ],
                                        "name": {
                                            "zh": "铁骑",
                                            "en": "Cavalry",
                                            "jp": "カブリ"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "chasis": {
                            "id": "534",
                            "name": "RL-08C\r\n 重甲下肢",
                            "type": "chasis",
                            "score": 24,
                            "armor": 5,
                            "structure": 1,
                            "parray": 0,
                            "dodge": 3,
                            "electronic": 0,
                            "move": 1,
                            "description": "",
                            "keywords": [],
                            "action": [
                                {
                                    "id": "534_A",
                                    "name": "奔跑",
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
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        }
                    },
                    "pilot": {
                        "id": "FPA-03",
                        "name": "无霜",
                        "score": 12,
                        "LV": 4,
                        "faction": "RDL",
                        "swift": 6,
                        "melee": 2,
                        "projectile": 3,
                        "firing": 7,
                        "moving": 4,
                        "tactic": 4,
                        "trait": "坚毅",
                        "traitDescription": "· 本机部件被摧毁时，不扣除链接值。",
                        "box": {
                            "id": 3,
                            "faction": [
                                "RDL"
                            ],
                            "name": {
                                "zh": "重金属",
                                "en": "Heavy Metal",
                                "jp": "ヘビーメタル"
                            },
                            "hasImage": true
                        }
                    }
                },
                {
                    "id": "1775659839505",
                    "name": "新机体 副本 副本 副本",
                    "parts": {
                        "rightHand": {
                            "id": "027",
                            "name": "AC-32M射手步枪",
                            "type": "rightHand",
                            "score": 33,
                            "armor": 4,
                            "structure": 0,
                            "parray": 0,
                            "dodge": 0,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "throwIndex": "28",
                            "keywords": [],
                            "action": [
                                {
                                    "id": "27_A",
                                    "name": "点射",
                                    "description": "·【双手】+2射程。\r\n· {眼睛}视为{2轻击}。",
                                    "type": "Firing",
                                    "size": "m",
                                    "range": 6,
                                    "storage": 0,
                                    "yellowDice": 1,
                                    "redDice": 3
                                }
                            ],
                            "projectile": [],
                            "isPD": false,
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 19,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "游戏包",
                                            "en": "Game Pack",
                                            "jp": "ゲームパック"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 2
                                }
                            ]
                        },
                        "torso": {
                            "id": "019",
                            "name": "RT-15C  冰川  突击核心",
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
                            "keywords": [
                                {
                                    "name": "直射",
                                    "value": "本动作需要对落点或目标有视线。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 2,
                                        "faction": [
                                            "RDL"
                                        ],
                                        "name": {
                                            "zh": "铁骑",
                                            "en": "Cavalry",
                                            "jp": "カブリ"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "leftHand": {
                            "id": "299",
                            "name": "ML-32B双联发射器 + CC-3格斗刀",
                            "type": "leftHand",
                            "score": 33,
                            "armor": 4,
                            "structure": 0,
                            "parray": 1,
                            "dodge": 0,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 19,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "游戏包",
                                            "en": "Game Pack",
                                            "jp": "ゲームパック"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 2
                                }
                            ],
                            "keywords": [
                                {
                                    "name": "空手",
                                    "value": ""
                                }
                            ],
                            "action": [
                                {
                                    "id": "299_A",
                                    "name": "刺击",
                                    "description": "",
                                    "type": "Melee",
                                    "size": "s",
                                    "range": -1,
                                    "storage": 0,
                                    "yellowDice": 3,
                                    "redDice": 1
                                },
                                {
                                    "id": "299_B",
                                    "name": "导弹",
                                    "description": " · 曲射\r\n· 发射1枚MC-3“利剑”导弹。",
                                    "type": "Projectile",
                                    "size": "s",
                                    "range": 3,
                                    "storage": 2,
                                    "yellowDice": 0,
                                    "redDice": 0
                                }
                            ],
                            "projectile": [
                                "071"
                            ],
                            "isPD": false
                        },
                        "backpack": {
                            "id": "011",
                            "name": "ML-92双联导弹包",
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
                            "keywords": [
                                {
                                    "name": "齐射X",
                                    "value": "发射或布撒最多X枚抛射物，并消耗同等数量的弹药标记。"
                                },
                                {
                                    "name": "曲射",
                                    "value": "本动作不需要对落点或目标有视线。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 2,
                                        "faction": [
                                            "RDL"
                                        ],
                                        "name": {
                                            "zh": "铁骑",
                                            "en": "Cavalry",
                                            "jp": "カブリ"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "chasis": {
                            "id": "534",
                            "name": "RL-08C\r\n 重甲下肢",
                            "type": "chasis",
                            "score": 24,
                            "armor": 5,
                            "structure": 1,
                            "parray": 0,
                            "dodge": 3,
                            "electronic": 0,
                            "move": 1,
                            "description": "",
                            "keywords": [],
                            "action": [
                                {
                                    "id": "534_A",
                                    "name": "奔跑",
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
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        }
                    },
                    "pilot": {
                        "id": "FPA-02",
                        "name": "长钉",
                        "score": 15,
                        "LV": 4,
                        "faction": "RDL",
                        "swift": 3,
                        "melee": 7,
                        "projectile": 6,
                        "firing": 2,
                        "moving": 5,
                        "tactic": 5,
                        "trait": "鹰眼",
                        "traitDescription": "· 执行射击动作时获得穿甲1。",
                        "box": {
                            "id": 1,
                            "faction": [
                                "RDL"
                            ],
                            "name": {
                                "zh": "核心",
                                "en": "Core",
                                "jp": "コア"
                            },
                            "hasImage": true
                        }
                    }
                },
                {
                    "id": "1775659843938",
                    "name": "新机体 副本 副本 副本 副本",
                    "parts": {
                        "rightHand": {
                            "id": "027",
                            "name": "AC-32M射手步枪",
                            "type": "rightHand",
                            "score": 33,
                            "armor": 4,
                            "structure": 0,
                            "parray": 0,
                            "dodge": 0,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "throwIndex": "28",
                            "keywords": [],
                            "action": [
                                {
                                    "id": "27_A",
                                    "name": "点射",
                                    "description": "·【双手】+2射程。\r\n· {眼睛}视为{2轻击}。",
                                    "type": "Firing",
                                    "size": "m",
                                    "range": 6,
                                    "storage": 0,
                                    "yellowDice": 1,
                                    "redDice": 3
                                }
                            ],
                            "projectile": [],
                            "isPD": false,
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 19,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "游戏包",
                                            "en": "Game Pack",
                                            "jp": "ゲームパック"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 2
                                }
                            ]
                        },
                        "torso": {
                            "id": "019",
                            "name": "RT-15C  冰川  突击核心",
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
                            "keywords": [
                                {
                                    "name": "直射",
                                    "value": "本动作需要对落点或目标有视线。"
                                }
                            ],
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 2,
                                        "faction": [
                                            "RDL"
                                        ],
                                        "name": {
                                            "zh": "铁骑",
                                            "en": "Cavalry",
                                            "jp": "カブリ"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        },
                        "leftHand": {
                            "id": "299",
                            "name": "ML-32B双联发射器 + CC-3格斗刀",
                            "type": "leftHand",
                            "score": 33,
                            "armor": 4,
                            "structure": 0,
                            "parray": 1,
                            "dodge": 0,
                            "electronic": 0,
                            "move": 0,
                            "description": "",
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 19,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "游戏包",
                                            "en": "Game Pack",
                                            "jp": "ゲームパック"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 2
                                }
                            ],
                            "keywords": [
                                {
                                    "name": "空手",
                                    "value": ""
                                }
                            ],
                            "action": [
                                {
                                    "id": "299_A",
                                    "name": "刺击",
                                    "description": "",
                                    "type": "Melee",
                                    "size": "s",
                                    "range": -1,
                                    "storage": 0,
                                    "yellowDice": 3,
                                    "redDice": 1
                                },
                                {
                                    "id": "299_B",
                                    "name": "导弹",
                                    "description": " · 曲射\r\n· 发射1枚MC-3“利剑”导弹。",
                                    "type": "Projectile",
                                    "size": "s",
                                    "range": 3,
                                    "storage": 2,
                                    "yellowDice": 0,
                                    "redDice": 0
                                }
                            ],
                            "projectile": [
                                "071"
                            ],
                            "isPD": false
                        },
                        "chasis": {
                            "id": "534",
                            "name": "RL-08C\r\n 重甲下肢",
                            "type": "chasis",
                            "score": 24,
                            "armor": 5,
                            "structure": 1,
                            "parray": 0,
                            "dodge": 3,
                            "electronic": 0,
                            "move": 1,
                            "description": "",
                            "keywords": [],
                            "action": [
                                {
                                    "id": "534_A",
                                    "name": "奔跑",
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
                            "containedIn": [
                                {
                                    "box": {
                                        "id": 18,
                                        "faction": [
                                            "RDL",
                                            "UN"
                                        ],
                                        "name": {
                                            "zh": "对战包-突袭",
                                            "en": "Combat Pack Raid",
                                            "jp": "コンバットレイド"
                                        },
                                        "hasImage": true
                                    },
                                    "quantityPerBox": 1
                                }
                            ]
                        }
                    },
                    "pilot": {
                        "id": "FPA-06-2",
                        "name": "锁眼-06\n藏木于林",
                        "score": 12,
                        "LV": 4,
                        "faction": "RDL",
                        "swift": 2,
                        "melee": 5,
                        "projectile": 4,
                        "firing": 6,
                        "moving": 6,
                        "tactic": 7,
                        "trait": "功率隐匿",
                        "traitDescription": "· 本机处于友军光环范围内时获得低特征。",
                        "box": {
                            "id": 16,
                            "faction": [
                                "RDL"
                            ],
                            "name": {
                                "zh": "单机包-沙丘",
                                "en": "Single Pack Dune",
                                "jp": "シングル デューン"
                            },
                            "hasImage": true
                        }
                    }
                }
            ],
            "drones": [],
            "tacticCards": [],
            "totalScore": 882,
            "mechCount": 5,
            "largeDroneCount": 0,
            "mediumDroneCount": 0,
            "smallDroneCount": 0,
            "deviceID": "d6eeef82f83d4f5158d95ea55eab8837231d6e7061c6ee95c26275204fe3d499"
        }
    }
    
    // { userQQ: '100000002', userName: '玩家B', team1: {...}, team2: {...} },
];