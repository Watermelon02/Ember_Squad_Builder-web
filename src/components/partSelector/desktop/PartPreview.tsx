import React, { useState, useRef } from "react";
import { FACTION_COLORS, Part, Projectile } from "../../../data/types";
import { Button } from "../../radix-ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { PartCard } from "../../customCard/partCard/PartCard";
import { gofBackpack, gofChasis, gofLeftHand, gofProjectiles, gofRightHand, gofTorso, rdlTorso } from "../../../data/data_cn";
import { ProjectileCard } from "../../customCard/projectileCard/ProjectileCard";
import { checkWhiteDwarf } from "../../../util/CustomCardUtil";
import { BOX_COVER_SRC, IMAGE_PART_THROW_VERSION, IMAGE_PART_VERSION, IMAGE_PROJECTILE_VERSION } from "../../../data/resource";
import { translations } from "../../../i18n";

interface PartPreviewProps {
  partId: string;
  factionParts: Part[];
  imageSrc: string;
  compareMode?: boolean;
  showKeyword: boolean;
  faction: string;
  tabsrc: string
  hasLeft: boolean;
  data: any;
  lang: string;
  showSourceBox: boolean;
}

export default function PartPreview({
  partId,
  factionParts,
  imageSrc, showKeyword, faction, tabsrc, compareMode, hasLeft, data, lang, showSourceBox
}: PartPreviewProps) {
  const part = factionParts.find((p) => p.id === partId);

  const [lensVisible, setLensVisible] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [lensBgPos, setLensBgPos] = useState({ x: 0, y: 0 });
  const [lensImage, setLensImage] = useState<string | null>(null);

  const lensSize = 250;
  const zoom = 2;

  function getPartByFactionAndType(): Part[] {
    switch (faction) {
      case "GOF": {
        switch (part?.type) {
          case "torso": return data.gofTorso;
          case 'backpack': return data.gofBackpack;
          case 'chasis': return data.gofChasis;
          case 'leftHand': return data.gofLeftHand;
          case 'rightHand': return data.gofRightHand;
        }
      }
      case "UN": {
        switch (part?.type) {
          case "torso": return data.unTorso;
          case 'backpack': return data.unBackpack;
          case 'chasis': return data.unChasis;
          case 'leftHand': return data.unLeftHand;
          case 'rightHand': return data.unRightHand;
        }
      }
      case "UN": {
        switch (part?.type) {
          case "torso": return data.rdlTorso;
          case 'backpack': return data.rdlBackpack;
          case 'chasis': return data.rdlChasis;
          case 'leftHand': return data.rdlLeftHand;
          case 'rightHand': return data.rdlRightHand;
        }
      }
      default: return rdlTorso;
    }
  }

  function getProjectileByFaction(isPd: boolean): Projectile[] {
    if (isPd) return data.pdProjectiles;
    switch (faction) {
      case "GOF": return data.gofProjectiles;
      case "UN": return data.unProjectiles;
      case "RDL": return data.rdlProjectiles;
      default: return data.gofProjectiles;
    }
  }

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

    <div
      style={{
        width: "20vw",
        overflowY: "auto",
        flex: 1,
        position: "relative",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        gap: "2vh"
      }}
    >
      <style>
        {`
      div::-webkit-scrollbar {
        display: none;
      }
    `}
      </style>

      {part && (
        <AnimatePresence mode="wait">
          <motion.div
            key={part?.id}
            initial={{ opacity: 0, y: 100, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            <div style={{
              display: "flex",
              flexDirection: "row", // 水平排列图片和所属的包的信息
              alignItems: "flex-start",
              gap: "1vw",

              position: "relative"
            }}>

              {/* 左侧：主图区域 */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                {(faction !== "GOF" && (part.hasImage === undefined || part.hasImage) || !checkWhiteDwarf(part.id)) ? (
                  <img
                    src={`${imageSrc}/${partId}.webp?v=${IMAGE_PART_VERSION}`}
                    alt="current part"
                    style={{
                      maxWidth: "25vh",
                      objectFit: "contain",
                      borderRadius: 8,
                    }}
                    loading="lazy"
                  />
                ) : (
                  <div style={{ scale: "0.92" }}>
                    <PartCard faction={faction} part={part} tabsrc={tabsrc} isThrowCard={false} lang={lang} />
                  </div>
                )}

                
              </div>

              {showSourceBox &&

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
                  {part.containedIn?.map((src, idx) => (
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

            {/* 🔽 关键词展示区域 (移到图片和盒子列表下方) 🔽 */}
            {showKeyword && part?.keywords && part.keywords.length > 0 && (
              <motion.div
                style={{
                  padding: "0.4vh 0.5vw",
                  backdropFilter: "blur(16px)",
                  background: "rgba(255,255,255,0.14)",
                  borderRadius: 10,
                  boxShadow: "0 0 8px rgba(0,0,0,0.4) inset",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  color: "white",
                  zIndex: 2,
                  marginBottom: "2vh"
                }}
              // ... motion props
              >
                {part.keywords.map((kw, index) => (
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
                      marginLeft: "0.5vw",
                      marginRight: "0.5vw",
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

            {part && (
                            <Button
                              variant="secondary"
                              style={{
                                position: "absolute",
                                top: "0",
            
                                height: "3vh",
                                width: "3vh",
                                fontSize: "2vh",
                                color: "#fff",
                                textShadow: `
                  0 0 2px #000,
                  0 0 4px #000,
                  0 0 6px #000
                `,
                                backdropFilter: "blur(4px)",
                                WebkitBackdropFilter: "blur(4px)",
                                backgroundColor: "rgba(255,255,255,0.1)",
                                borderRadius: 6,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {part.score}
                            </Button>
                          )}




            {/* projectile + throwIndex */}
            {part && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {part.projectile && part.projectile.length > 0 &&
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "2vh" }}>
                    {part.projectile?.map((proj, idx) => {
                      const isPd = (part.isPD === undefined || !part.isPD) ? false : true;
                      const currentProjectile = getProjectileByFaction(isPd).find((value) => {
                        if (value.id === proj) return value;
                      });

                      const shouldShowImage = (currentProjectile?.hasImage === undefined);

                      return (
                        <div key={idx} style={{ position: "relative" }}>

                          {shouldShowImage ? (
                            <img
                              src={`${imageSrc}/${proj}.webp?v=${IMAGE_PROJECTILE_VERSION}`}
                              alt={`projectile-${idx}`}
                              style={{
                                width: "20vw",
                                objectFit: "contain",
                                borderRadius: 4,
                              }}
                              onMouseMove={(e) => {
                                handleMouseMove(e);
                                setLensImage(`${imageSrc}/${proj}.webp`);
                              }}
                              onMouseEnter={() => setLensVisible(true)}
                              onMouseLeave={() => setLensVisible(false)}
                            />
                          ) : (
                            <ProjectileCard
                              style={{ width: "20vh" }}
                              faction={faction}
                              projectile={currentProjectile}
                              tabsrc={tabsrc}
                              lang={lang}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>}

                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {part.throwIndex && (
                    <div style={{ position: "relative" }}>
                      {faction !== "GOF" && (part.hasImage === undefined || part.hasImage) ? <img
                        src={`${imageSrc}/${part.throwIndex}.webp?v=${IMAGE_PART_THROW_VERSION}`}
                        alt={`throw-${part.throwIndex}`}
                        style={{
                          objectFit: "contain",
                          borderRadius: 4,
                          maxWidth: "25vh"
                        }}
                        loading="lazy"
                      /> : <div style={{ scale: "0.92" }}><PartCard faction={faction} part={getPartByFactionAndType().find((value) => { if (value.id === part.throwIndex) return value })} tabsrc={tabsrc} isThrowCard={true} lang={lang} /></div>}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 放大镜 */}
            {lensVisible && lensImage && (
              <div
                style={{
                  position: "fixed",
                  pointerEvents: "none",
                  left: lensPos.x,
                  top: lensPos.y,
                  width: lensSize,
                  height: lensSize,
                  borderRadius: "50%",
                  border: "2px solid #aaa",
                  backgroundColor: "#fff",
                  backgroundImage: `url(${lensImage})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: `calc(130% * ${zoom}) calc(100% * ${zoom})`,
                  backgroundPosition: `${lensBgPos.x}px ${lensBgPos.y}px`,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                  zIndex: 9999,
                }}
              />
            )}
          </motion.div></AnimatePresence>
      )}

    </div>

  );
}