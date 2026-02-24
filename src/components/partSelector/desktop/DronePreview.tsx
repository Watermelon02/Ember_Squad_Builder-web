import React, { useState, useRef } from "react";
import { Drone, FACTION_COLORS, Part, Projectile } from "../../../data/types";
import { Button } from "../../radix-ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { DroneCard } from "../../customCard/droneCard/DroneCard";

import { ProjectileCard } from "../../customCard/projectileCard/ProjectileCard";
import { BOX_COVER_SRC } from "../../../data/resource";
import { translations } from "../../../i18n";

interface DronePreviewProps {
  droneId: string;
  factionDrones: Drone[];
  imageSrc: string;
  compareMode?: boolean;
  showKeyword: boolean;
  faction: string;
  tabsrc: string;
  lang: string;
  showSourceBox: boolean;
  gofProjectiles: Projectile[];
}

export default function DronePreview({
  droneId,
  factionDrones,
  imageSrc, showKeyword, faction, tabsrc, lang, showSourceBox, gofProjectiles
}: DronePreviewProps) {
  const drone = factionDrones.find((dr) => { if (dr.id === droneId) { return dr } });

  const [lensVisible, setLensVisible] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [lensBgPos, setLensBgPos] = useState({ x: 0, y: 0 });
  const [lensImage, setLensImage] = useState<string | null>(null);

  const lensSize = 250; // 放大镜直径
  const zoom = 2; // 放大倍数

  const handleMouseMove = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setLensPos({ x: e.clientX - lensSize, y: e.clientY - lensSize / 2 });
    setLensBgPos({ x: -(x * zoom - lensSize / 2), y: -(y * zoom - lensSize / 2) });
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        style={{
          width: "20vw",
          overflowY: "auto",
          flex: 1,
          position: "relative",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        key={drone?.id}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.2 }}
      >
        <style>
          {`
          div::-webkit-scrollbar {
            display: none;
          }
        `}
        </style>

        {!droneId ? (
          <div style={{ width: "100%", height: "30vw" }} />
        ) : (
          <div key={`last-${droneId}`} style={{ width: "100%", display: "flex", alignItems: "center", flexDirection: "column" }}>
            {/* 主图 */}
            {drone?.hasImage === undefined ? <img
              src={`${imageSrc}/${droneId}.png`}
              loading="lazy"
              alt="current part"
              style={{
                width: "100%",
                objectFit: "contain",
                borderRadius: 8,

              }}

            /> : <DroneCard drone={drone} tabsrc={tabsrc} faction={faction} lang={lang} />}

            {/* 🔽 关键词展示区域 🔽 */}
            {showKeyword && drone?.keywords && drone.keywords.length > 0 && (
              <motion.div
                style={{
                  width: "95%",
                  padding: "0.4vh 0.5vw",
                  marginTop: "1vh",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  background: "rgba(255,255,255,0.14)",
                  borderRadius: 10,
                  boxShadow: "0 0 8px rgba(0,0,0,0.4) inset",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  textAlign: "start",
                  color: "white",
                  zIndex: 2,
                }}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 0.1 }}
              >
                {drone.keywords.map((kw, index) => (
                  <span
                    key={index}
                    style={{
                      fontSize: "1.3vh",
                      color: "white",
                      textShadow: `
        -1px -1px 1px #000,
         1px -1px 1px #000,
        -1px  1px 1px #000,
         1px  1px 1px #000
      `,
                      lineHeight: "2.2vh",
                      marginTop: "0.7vh",
                      marginBottom: "0.7vh",
                      display: "block",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.5vh",
                        fontWeight: 600,
                        textDecoration: "underline",

                        /* 🟦 名称样式 */
                        color: "black",

                        padding: "0 0.3vw",                    // ⭐ 背景左右留白
                        borderRadius: "4px",                   // ⭐ 小圆角
                        /* 去除描边，否则黑字会发白 */
                        textShadow: "none",
                      }}
                    >
                      {kw.name}
                    </span>
                    {kw.value}
                  </span>
                ))}

              </motion.div>
            )}


            {/* projectile + throwIndex */}
            {drone && (
              <div
                style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}
              >
                {/* projectile 区域 */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {drone.projectile?.map((projId, idx) => { // 将 proj 改名为 projId 更清晰
                    const currentProjectile = gofProjectiles.find((value) => value.id === projId);

                    return (
                      <div key={idx} style={{ position: "relative" }}>
                        {faction !== "GOF" ? (
                          <img
                            src={`${imageSrc}/${projId}.png`}
                            alt={`projectile-${idx}`}
                            style={{
                              width: "30vw",
                              objectFit: "contain",
                              borderRadius: 4,
                              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                            }}
                            loading="lazy"
                            onMouseMove={(e) => {
                              handleMouseMove(e);
                              setLensImage(`${imageSrc}/${projId}.png`);
                            }}
                            onMouseEnter={() => setLensVisible(true)}
                            onMouseLeave={() => setLensVisible(false)}
                          />
                        ) : (

                          currentProjectile && (
                            <ProjectileCard
                              projectile={currentProjectile}
                              tabsrc={tabsrc}
                              faction={faction}
                              lang={lang}
                            />
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {drone && showSourceBox &&

              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5vh",
                flex: 1,
                marginTop: "0.5vh"
              }}>
                {/*右侧：盒子来源区域 (New Box Sources) */}
                <span style={{
                  fontSize: "1.2vh",
                  color: "#fff",
                  fontWeight: "bold",
                  letterSpacing: "0.1em",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  paddingBottom: "2px",
                  marginBottom: "4px"
                }}>
                  {translations[lang].t118}
                </span>
                {drone.containedIn?.map((src, idx) => (
                  <div
                    key={idx}
                    // 鼠标移入时，通过修改子元素的 grid-template-rows 来实现展开
                    onMouseEnter={(e) => {
                      const drawer = e.currentTarget.querySelector('.img-drawer') as HTMLElement;
                      if (drawer) drawer.style.gridTemplateRows = "1fr";
                    }}
                    onMouseLeave={(e) => {
                      const drawer = e.currentTarget.querySelector('.img-drawer') as HTMLElement;
                      if (drawer) drawer.style.gridTemplateRows = "0fr";
                    }}
                    style={{
                      padding: "0.6vh 0.6vw",
                      backgroundColor: "rgba(255,255,255,0.08)",
                      borderRadius: "4px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                      overflow: "hidden", // 确保折叠时内容不溢出
                      transition: "background-color 0.2s"
                    }}
                  >
                    {/* 1. 标题文字行 */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{
                        fontSize: "1.3vh",
                        width: "25vw",
                        color: "white",
                        lineHeight: "1.4",
                        fontWeight: 500
                      }}>
                        {src.box.name[lang]}
                      </span>
                      {src.quantityPerBox > 1 && (
                        <span style={{ fontSize: "1vh", color: FACTION_COLORS[src.box.faction], fontWeight: "bold" }}>
                          × {src.quantityPerBox}
                        </span>
                      )}
                    </div>

                    {/* 2. 图片展开抽屉 */}
                    <div
                      className="img-drawer"
                      style={{
                        display: "grid",
                        gridTemplateRows: "0fr", // 默认高度为 0
                        transition: "grid-template-rows 0.3s ease-out", // 平滑展开动画
                      }}
                    >
                      <div style={{ minHeight: 0, overflow: "hidden" }}>
                        {src.box.hasImage && <img
                          src={`${BOX_COVER_SRC[lang]}/${src.box.id}.webp`}
                          alt={src.box.name[lang]}
                          loading="lazy"
                          style={{
                            width: "100%",
                            marginTop: "0.8vh",
                            borderRadius: "4px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                            border: "1px solid rgba(255,255,255,0.1)"
                          }}
                        />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
