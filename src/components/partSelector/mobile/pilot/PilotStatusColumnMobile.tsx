import { Pilot } from "../../../../data/types";
import { COLOR_GREY } from "../../../../styles/color";

interface PilotStatsColumnMobileProps {
  pilot: Pilot;
  comparePilot?: Pilot;
  tabsrc: string;
  style?: React.CSSProperties;
  compareMode: boolean;
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

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        padding: "0.5rem 0",
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

        // 颜色逻辑保持一致
        const textColor = isEqual ? "#ffffff" : isAdvantage ? "#00ff00" : "#ff4444";
        const shadowColor = "rgba(0,0,0,0.7)";

        return (
          <div
            key={attr.key}
            style={{
              display: "flex",
              alignItems: "center",
              paddingLeft: compareMode ? "1vw" : "2vw",
              gap: "0.3rem",
            }}
          >
            {/* 图标 */}
            <img
              src={`${tabsrc}/icon_${attr.key}.png`}
              alt={attr.key}
              style={{
                height: "2vh",
                scale: compareMode ? "1.2" : "2",
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
              {/* 主柱 - 替换为普通 div */}
              <div
                style={{
                  width: `${barLength}%`, // 直接设置宽度
                  height: "100%",
                  background: isEqual
                    ? mainColor
                    : isAdvantage
                      ? "rgba(0,255,0,0.6)"
                      : mainColor,
                  borderRadius: "0.6vh",
                  backdropFilter: "blur(6px) saturate(160%)",
                  WebkitBackdropFilter: "blur(6px) saturate(160%)",
                  backgroundImage: `
                    linear-gradient(
                      90deg,
                      rgba(255,255,255,0.28),
                      rgba(255,255,255,0.05)
                    )
                  `,
                  boxShadow: isEqual
                    ? `0 0 8px ${mainColor}, 0 0 18px ${mainColor}66 inset`
                    : isAdvantage
                      ? undefined
                      : `0 0 8px ${mainColor}, 0 0 18px ${mainColor}66 inset`,
                }}
              />

              {/* 红色差值 - 替换为普通 div */}
              {!isEqual && !isAdvantage && diff > 0 && (
                <div
                  style={{
                    width: `${diffWidth}%`, // 直接设置宽度
                    height: "100%",
                    background: "rgba(255,0,0,0.6)",
                    position: "absolute",
                    top: 0,
                    left: `${barLength - diffWidth}%`,
                    borderRadius: "0.6vh",
                  }}
                />
              )}

              {/* 数字标签 - 替换为普通 div，移除初始位移效果 */}
               <div
                key={attr.value}

                style={{
                  position: "absolute",
                  top: "-0.3vh", // 上移，更突出
                  left: `${barLength+4}%`,
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
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PilotStatsColumnMobile;