import { getPoolId } from "../data/dronePools";
import { BOXES, Drone, Part, Pilot, SourceInfo, Team } from "../data/types";

/**
 * 通用函数：计算某部件在用户库存中的总数
 * @param item 具有 containedIn 属性的物品 (Part | Drone | Pilot)
 * @param inventory 用户输入的库存数据 { [boxId: number]: 数量 }
 */
export function calculateTotalOwned(
  item: { containedIn: SourceInfo[] }, 
  inventory: Record<number, number>
): number {
  return item.containedIn.reduce((sum, src) => {
    const ownedBoxCount = inventory[src.box.id] || 0;
    return sum + (ownedBoxCount * src.quantityPerBox);
  }, 0);
}

// 记录 部件/机师/无人机 等资源的使用数量
export type UsageMap = Record<string, number>;

/**
 * 统计一个小队中所有部件的使用数量
 */
export const calculateTeamUsage = (team: Team): UsageMap => {
  const usage: UsageMap = {};

  const add = (id: string | undefined, isDrone: boolean = false) => {
    if (!id) return;
    
    // 如果是无人机，先转换成 PoolId
    const key = isDrone ? getPoolId(id) : id;
    usage[key] = (usage[key] || 0) + 1;
  };

  // 1. 统计机甲部件 
  team.mechs.forEach(mech => {
    Object.values(mech.parts).forEach(part => add(part?.id));
  });

  // 2. 统计无人机
  team.drones.forEach(drone => {
    add(drone.id, true); // 传入 isDrone=true
    add(drone.backpack?.id); // 无人机背包属于 Part 类型
  });

  return usage;
};

/**
 * 获取所有部件的剩余库存映射表
 */
export function getAllPartRemainingCounts(
  team: Team,
  allItems: Part[],
  inventory: Record<number, number>
) {
  // 先算一遍小队用量
  const usageMap = calculateTeamUsage(team);
  
  const remainingMap: Record<string, number> = {};
  
  allItems.forEach(part => {
    const totalOwned = part.containedIn.reduce((sum, src) => 
      sum + ((inventory[src.box.id] || 0) * src.quantityPerBox), 0
    );
    remainingMap[part.id] = totalOwned - (usageMap[part.id] || 0);
  });
  
  return remainingMap;
}

/**
 * 获取所有无人机的剩余库存映射表 (支持共享池逻辑)
 */
export function getAllDroneRemainingCounts(
  team: Team,
  allDrones: Drone[],
  inventory: Record<number, number>
) {
  // 1. 获取小队用量映射表 (此时 usageMap 里的 Key 已经是 PoolId 或独立 ID)
  const usageMap = calculateTeamUsage(team);
  
  const remainingMap: Record<string, number> = {};
  
  allDrones.forEach(drone => {
    // 2. 获取该无人机所属的虚拟池 ID 
    const poolId = getPoolId(drone.id);
    
    // 3. 计算该无人机所在组的总库存
    const totalOwned = drone.containedIn?.reduce((sum, src) => 
      sum + ((inventory[src.box.id] || 0) * src.quantityPerBox), 0
    ) || 0;

    // 4. 计算剩余量：该组总库存 - 该组所有成员的总消耗
    remainingMap[drone.id] = totalOwned - (usageMap[poolId] || 0);
  });
  
  return remainingMap;
}

