import React, { useState, useRef, useEffect } from "react";
import { Part } from "../../../../data/types";
import { Button } from "../../../radix-ui/button";
import { IMAGE_PART_THROW_VERSION, IMAGE_PART_VERSION, IMAGE_PROJECTILE_VERSION } from "../../../../data/resource";

interface PartPreviewMobileProps {
  partId: string;
  factionParts: Part[];
  imageSrc: string;
  compareMode?: boolean;
  leftPreviewExist: boolean;
  showKeyword: boolean;
  lang: string;
}

export default function PartPreviewMobile({
  partId,
  factionParts,
  imageSrc,
  compareMode,
  leftPreviewExist,
  showKeyword,
  lang,
}: PartPreviewMobileProps) {
  const part = factionParts.find((p) => p.id === partId);
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);
  
  // 用于存储所有关键字按钮的引用
  const keywordRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  // 用于存储当前活动关键字按钮的垂直位置
  const [activeKeywordTop, setActiveKeywordTop] = useState<number>(0);

  useEffect(() => {
    setActiveKeyword(null);
  }, [partId]);

  // 当 activeKeyword 改变时，计算其位置
  useEffect(() => {
    if (activeKeyword && keywordRefs.current[activeKeyword]) {
      // 获取被点击按钮相对于其定位父级 (motion.div 关键字列表) 的 top 偏移量
      const top = keywordRefs.current[activeKeyword]!.offsetTop;
      setActiveKeywordTop(top);
    } else {
        setActiveKeywordTop(0);
    }
  }, [activeKeyword]);


  return (
    <div
      style={{
        overflowY: "auto",
        width: compareMode ? (leftPreviewExist ? "50%" : "50%") : "100%",
        flexDirection: "column",
        position: "relative",
        marginLeft: compareMode && !leftPreviewExist ? "25vw" : "0vw",
      }}
    >
      <style>
        {`
      div::-webkit-scrollbar {
        display: none;
      }
    `}
      </style>

      <div>
        {!partId ? (
          <div
            key={part?.id}
            style={{ width: "100%", height: "25vw" }}
          />
        ) : (
          <div
            key={part?.id}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: compareMode ? "flex-start" : "center",
            }}
            onClick={() => {
              if (activeKeyword !== null) {
                setActiveKeyword(null);
              }
            }}
          >
            {/* 比较模式下的内容 (原逻辑 - 弹窗在左侧列表的右侧) */}
            {compareMode && (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                }}
              >
                <img
                  loading="lazy"
                  src={`${imageSrc}/${partId}.png?v=${IMAGE_PART_VERSION}`}
                  alt="current part"
                  style={{
                    width: "100%",
                    objectFit: "contain",
                    borderRadius: 8,
                  }}
                />

                {part && (
                  <Button
                    variant="secondary"
                    style={{
                      position: "absolute",
                      top: "0vh",
                      right: "0vw",
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

                {showKeyword && part?.keywords && part?.keywords.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "4vh",
                      left: "0vw",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5vh",
                      zIndex: 20,
                    }}
                  >
                    {part.keywords.map((kw, index) => (
                      <Button
                        key={index}
                        variant="secondary"
                        style={{
                          fontSize: lang === "en" ? "2vw" : "2vw",
                          borderRadius: "6px",
                          maxWidth: "10vw",
                          padding: "0.5vw 1vw",
                          background: "rgba(255, 255, 255, 0.05)",
                          color: "#fff",
                          backdropFilter: "blur(8px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          transition: "all 0.2s ease",
                          textShadow: `
      1px 1px 1px #000, 
      -1px -1px 1px #000, 
      1px -1px 1px #000, 
      -1px 1px 1px #000,
      0 0 4px rgba(255,255,255,0.6)
    `,
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                          textAlign: "center",
                          display: "inline-block",
                        }}
                        onClick={() =>
                          setActiveKeyword(
                            activeKeyword === kw.name ? null : kw.name
                          )
                        }
                      >
                        {kw.name}
                      </Button>
                    ))}

                    {activeKeyword && activeKeyword.length > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          right: "-31vw",
                          top: 0,
                          padding: "0.6vh 0.8vw",
                          background: "rgba(0,0,0,0.4)",
                          color: "#fff",
                          fontSize: "1.2vh",
                          borderRadius: "6px",
                          width: "30vw",
                          backdropFilter: "blur(8px)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          zIndex: 30,
                          textShadow: `
            1px 1px 1px #000, 
            -1px -1px 1px #000, 
            1px -1px 1px #000, 
            -1px 1px 1px #000,
            0 0 4px rgba(255,255,255,0.6)
          `,
                        }}
                      >
                        {
                          part.keywords.find((kw) => kw.name === activeKeyword)
                            ?.value
                        }
                      </div>
                    )}
                  </div>
                )}

                {part && (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {/* projectile 区域 */}
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      {part.projectile?.map((proj, idx) => (
                        <div key={idx} style={{ position: "relative" }}>
                          <img
                            loading="lazy"
                            src={`${imageSrc}/${proj}.png`}
                            alt={`projectile-${idx}`}
                            style={{
                              width: "100%",
                              objectFit: "contain",
                              borderRadius: 4,
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* throwIndex */}
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      {part.throwIndex !== undefined && (
                        <div style={{ position: "relative" }}>
                          <img
                            loading="lazy"
                            src={`${imageSrc}/${part.throwIndex}.png?v=${IMAGE_PART_THROW_VERSION}`}
                            alt={`throw-${part.throwIndex}`}
                            style={{
                              objectFit: "contain",
                              borderRadius: 4,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 非比较模式下的内容 (修改了关键字位置和弹窗位置) */}
            {!compareMode && (
              <div
                style={{
                  position: "relative",
                  width: compareMode ? "100%" : "90%",
                  display: "flex",
                  gap: "1vw",
                  flexDirection: "column",
                }}
              >
                {/* 图片和关键字列表容器 */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    position: "relative",
                  }}
                >
                  {/* 部件图片容器 */}
                  <div
                    style={{
                      position: "relative",
                      width: "60%",
                    }}
                  >
                    <img
                      loading="lazy"
                      src={`${imageSrc}/${partId}.png?v=${IMAGE_PART_VERSION}`}
                      alt="current part"
                      style={{
                        width: "100%",
                        objectFit: "contain",
                        borderRadius: 8,
                      }}
                    />

                    {/* 原来的分数按钮 (保持在图片右上角) */}
                    {part && (
                      <Button
                        variant="secondary"
                        style={{
                          position: "absolute",
                          top: "0vh",
                          right: "0vw",
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
                  </div>

                  {/* 右侧关键字按钮栏（非比较模式） - 定位父级 */}
                  {showKeyword &&
                    !compareMode &&
                    part?.keywords &&
                    part.keywords.length > 0 && (
                      <div
                        style={{
                          position: "relative", // 确保弹窗相对于此 div 定位
                          width: "40%",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5vh",
                          zIndex: 20,
                          paddingLeft: "1vw",
                          paddingTop: "4vh",
                        }}

                      >
                        {part.keywords.map((kw, index) => (
                          <Button
                            key={index}
                            variant="secondary"
                            ref={(el) => {
                              keywordRefs.current[kw.name] = el;
                            }}
                            style={{
                              padding: "0.5vh 1vw",
                              fontSize: "1.2vh",
                              borderRadius: "6px",
                              background: "rgba(255, 255, 255, 0.05)",
                              color: "#fff",
                              backdropFilter: "blur(8px)",
                              border: "1px solid rgba(255, 255, 255, 0.2)",
                              transition: "all 0.2s ease",
                              textShadow: `
      1px 1px 1px #000, 
      -1px -1px 1px #000, 
      1px -1px 1px #000, 
      -1px 1px 1px #000,
      0 0 4px rgba(255,255,255,0.6)
    `,
                              whiteSpace: "normal",
                              textAlign: "center",
                            }}
                            onClick={() =>
                              setActiveKeyword(
                                activeKeyword === kw.name ? null : kw.name
                              )
                            }
                          >
                            {kw.name}
                          </Button>
                        ))}

                        {/* 弹窗根据 activeKeywordTop 定位，并放置在左侧以防止溢出屏幕 */}
                        {activeKeyword && (
                          <div
                            initial={{ opacity: 0, scale: 0.9, y: 5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 5 }}
                            style={{
                              position: "absolute",
                              right: "100%", // 关键：位于关键字按钮栏的左侧
                              top: activeKeywordTop, // 动态设置 top 偏移
                              marginRight: "1vw", // 增加与按钮栏的间距
                              padding: "0.6vh 0.8vw",
                              background: "rgba(0,0,0,0.4)",
                              color: "#fff",
                              fontSize: "1.2vh",
                              borderRadius: "6px",
                              width: "40vw",
                              textShadow: `
            1px 1px 1px #000, 
            -1px -1px 1px #000, 
            1px -1px 1px #000, 
            -1px 1px 1px #000,
            0 0 4px rgba(255,255,255,0.6)
          `,
                              border: "1px solid rgba(255,255,255,0.2)",
                              zIndex: 30,
                            }}
                          >
                            {
                              part.keywords.find(
                                (kw) => kw.name === activeKeyword
                              )?.value
                            }
                          </div>
                        )}
                      </div>
                    )}
                </div>

                {/* projectile 和 throwIndex (保持在图片下方) */}
                {part && (
                  <div style={{ marginTop: "1vh" }}>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5vw",
                      }}
                    >
                      {part.projectile?.map((proj, idx) => (
                        <div key={idx} style={{ position: "relative" }}>
                          <img
                            loading="lazy"
                            src={`${imageSrc}/${proj}.png?v=${IMAGE_PROJECTILE_VERSION}`}
                            alt={`projectile-${idx}`}
                            style={{
                              width: "100%",
                              objectFit: "contain",
                              borderRadius: 4,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5vw",
                      }}
                    >
                      {part.throwIndex !== undefined && (
                        <div style={{ position: "relative" }}>
                          <img
                            loading="lazy"
                            src={`${imageSrc}/${part.throwIndex}.png?v=${IMAGE_PART_THROW_VERSION}`}
                            alt={`throw-${part.throwIndex}`}
                            style={{
                              objectFit: "contain",
                              borderRadius: 4,
                              width:"60%"

                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}