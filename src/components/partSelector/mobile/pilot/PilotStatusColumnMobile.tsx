import { motion } from "framer-motion";
import { Pilot } from "../../../../data/types";
import { COLOR_GREY } from "../../../../styles/color";
import { useState, useEffect } from "react";

interface PilotStatsColumnMobileProps {
  pilot: Pilot;
  comparePilot?: Pilot;
  tabsrc: string;
  style?: React.CSSProperties;
  compareMode:boolean;
}

export const PilotStatsColumnMobile: React.FC<PilotStatsColumnMobileProps> = ({
  pilot,
  comparePilot,
  tabsrc,
  style,
  compareMode
}) => {
  const stats = [
    { key: "swift", value: pilot.swift },
    { key: "melee", value: pilot.melee },
    { key: "projectile", value: pilot.projectile },
    { key: "firing", value: pilot.firing },
    { key: "moving", value: pilot.moving },
    { key: "tactic", value: pilot.tactic },
  ];

  const mainColor = COLOR_GREY;

  const [prevValues, setPrevValues] = useState<Record<string, number>>({});

  useEffect(() => {
    const newValues: Record<string, number> = {};
    stats.forEach((attr) => {
      newValues[attr.key] = attr.value;
    });
    setPrevValues(newValues);
  }, [pilot]);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        padding: "0.5rem 0",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        background: "rgba(255,255,255,0.14)",
        borderRadius: 10,
        boxShadow: "0 0 8px rgba(0,0,0,0.4) inset",
        ...style,
      }}
    >
      {stats.map((attr) => {
        const barLength = (attr.value / 10) * 100;
        const compareValue = comparePilot
          ? (comparePilot[attr.key as keyof Pilot] as number)
          : 0;
        const noCompare = !comparePilot;

        const isEqual = noCompare || attr.value === compareValue;
        const isAdvantage = !noCompare && attr.value < compareValue;
        const diff = attr.value - compareValue;
        const diffWidth = !isEqual && diff > 0 ? (diff / 10) * 100 : 0;

        const prevValue = prevValues[attr.key] ?? attr.value;
        const delta = attr.value - prevValue;

        // 优化后的文字和阴影颜色
        const textColor = isEqual ? "#ffffff" : isAdvantage ? "#00ff00" : "#ff4444";
        const shadowColor = "rgba(0,0,0,0.7)";

        return (
          <div
            key={attr.key}
            style={{
              display: "flex",
              alignItems: "center",
              paddingLeft:compareMode?"1vw":"2vw",
              gap: "0.3rem",
            }}
          >
            {/* 图标 */}
            <img
              src={`${tabsrc}/icon_${attr.key}.png`}
              alt={attr.key}
              style={{
                height:"2vh",
                scale:compareMode?"1.2":"2",
                objectFit: "contain",
                filter: `drop-shadow(0 0 6px ${mainColor})`,
              }}
            />

            {/* 主柱容器 */}
            <div
              style={{
                flex: 1,
                height: "1.2vh",
                position: "relative",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "0.6vh",
                overflow: "visible",
              }}
            >
              {/* 主柱 */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${barLength}%` }}
                transition={{ duration: 0.6 }}
                style={{
                  height: "100%",
                  background: isEqual
                    ? mainColor
                    : isAdvantage
                      ? "rgba(0,255,0,0.6)"
                      : mainColor,
                  borderRadius: "0.6vh",

                  /* ⭐⭐ 加入毛玻璃核心 ⭐⭐ */
                  backdropFilter: "blur(6px) saturate(160%)",
                  WebkitBackdropFilter: "blur(6px) saturate(160%)",

                  /* HUD 玻璃渐变，让柱子像透明能量条 */
                  backgroundImage: `
    linear-gradient(
      90deg,
      rgba(255,255,255,0.28),
      rgba(255,255,255,0.05)
    )
  `,

                  /* 玻璃能量辉光 */
                  boxShadow: isEqual
                    ? `0 0 8px ${mainColor}, 0 0 18px ${mainColor}66 inset`
                    : isAdvantage
                      ? undefined
                      : `0 0 8px ${mainColor}, 0 0 18px ${mainColor}66 inset`,
                }}

              />

              {/* 红色差值 */}
              {!isEqual && !isAdvantage && diff > 0 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${diffWidth}%` }}
                  transition={{ duration: 0.6 }}
                  style={{
                    height: "100%",
                    background: "rgba(255,0,0,0.6)",
                    position: "absolute",
                    top: 0,
                    left: `${barLength - diffWidth}%`,
                    borderRadius: "0.6vh",
                  }}
                />
              )}

              {/* 数字动画：柱子顶部玻璃质感 */}
              <motion.div
                key={attr.value}
                initial={{
                  x: delta < 0 ? 20 : delta > 0 ? -20 : 0,
                  opacity: 0,
                }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                style={{
                  position: "absolute",
                  top: "-0.3vh", // 上移，更突出
                  left: `${barLength}%`,
                  transform: "translateX(-50%)",
                  fontSize: "1.2vh",
                  fontWeight: "bold",
                  color: textColor,
                  textAlign: "center",
                  textShadow: `
                    -1px -1px 0 ${shadowColor},
                     1px -1px 0 ${shadowColor},
                    -1px  1px 0 ${shadowColor},
                     1px  1px 0 ${shadowColor}
                  `,
                  borderRadius: 4,
                  padding: "0 0.3vw",
                  whiteSpace: "nowrap",
                }}
              >
                {attr.value}
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PilotStatsColumnMobile;
