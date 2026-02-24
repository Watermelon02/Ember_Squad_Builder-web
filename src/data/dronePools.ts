// 为了实现在启用仓库管理功能后，能够根据用户拥有的扩展包数量，限制写表器中可用的无人机数量。
//但每个扩展包中的无人机可用数量是按照无人机大类（“渡鸦”、“鬣狗”）来计算的，而非是具体到某一张卡片的数量，故新增此表
// 共享池映射表：Key 是虚拟 Pool ID，Value 是包含的无人机 ID 列表
export const DRONE_SHARED_POOLS: Record<string, string[]> = {
"UN_RAVEN_POOL": ["164", "165", "166"], // 渡鸦系列
    "RDL_HYENA_POOL":["078","079","080"],//鬣狗系列
    "UN_TARANTULA_POOL":["162","163"],//狼蛛
    "UN_PORCUPINE_POOL":["160","161"],//豪猪
    "PD_REAPER_TYPE_1_POOL":["PRDR-101","PRDR-102"],//收割者1
    "PD_REAPER_TYPE_2_POOL":["PRDR-103","PRDR-104"],//收割者2
    "GOF_VALKYRIE_POOL":["ZHDR-303","ZHDR-304"],//鹰身女妖，女武神
    "GOF_APOLOGIST_POOL":["ZHDR-301","ZHDR-302"],//护教者，狂热者
    "GOF_HOUND_POOL":["ZHDR-201","ZHDR-202","ZHDR-203"],//猎犬
    "GOF_VANGUARD_POOL":["ZHDR-101","ZHDR-102","ZHDR-103","ZHDR-104"],//先锋
    "GOF_EAGLE_POOL":["ZHDR-204","ZHDR-205","ZHDR-206"],//猎鹰

};

export const getPoolId = (id: string): string => {
  for (const [poolId, members] of Object.entries(DRONE_SHARED_POOLS)) {
    if (members.includes(id)) return poolId;
  }
  return id; // 如果不在池子里，则返回自身 ID 作为独立池
};