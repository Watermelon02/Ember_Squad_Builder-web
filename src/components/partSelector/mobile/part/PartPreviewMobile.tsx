import React, { useState, useRef, useEffect } from "react";
import { Part } from "../../../../types";
import { Button } from "../../../ui/button";
import { AnimatePresence, motion } from "framer-motion";

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
  leftPreviewExist, showKeyword, lang
}: PartPreviewMobileProps) {
  const part = factionParts.find((p) => p.id === partId);
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);
  useEffect(() => {
    setActiveKeyword(null);
  }, [partId]);

  return (

    <div
      style={{
        overflowY: "auto",
        width: compareMode ? leftPreviewExist ? "50%" : "50%" : "100%",
        flexDirection: "column",
        position: "relative",
        marginLeft: (compareMode && !leftPreviewExist) ? "25vw" : "0vw"
      }}
    >
      <style>
        {`
      div::-webkit-scrollbar {
        display: none;
      }
    `}
      </style>

      <AnimatePresence mode="wait">
        {!partId ? (
          <motion.div
            key={part?.id}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.2 }}
            style={{ width: "100%", height: "25vw" }}
          />
        ) : (
          <motion.div
            key={part?.id}
            initial={{ opacity: 0, y: 100, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: compareMode ? "flex-start" : "center", // 关键：根据 compareMode 居中或靠左
            }}
            onClick={() => {
              if (activeKeyword !== null) { setActiveKeyword(null) }
            }}
          >
            {compareMode && <div
              style={{
                position: "relative",
                width: "100%", // !compareMode 时 50%
              }}
            >
              <img
              loading="lazy"
                src={`${imageSrc}/${partId}.png`}
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
                <motion.div
                  style={{
                    position: "absolute",
                    top: "4vh",
                    left: "0vw",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5vh",
                    zIndex: 20,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  {part.keywords.map((kw, index) => (
                    <Button
                      key={index}
                      variant="secondary"
                      style={{
                        fontSize: lang === "en" ? "2vw" : "2vw",
                        borderRadius: "6px",
                        maxWidth: "10vw",           // 可根据需求调整
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
                        whiteSpace: "normal",       // 允许换行
                        wordBreak: "break-word",    // 单词过长自动换行
                        textAlign: "center",        // 居中显示
                        display: "inline-block",
                      }}
                      onClick={() =>
                        setActiveKeyword(activeKeyword === kw.name ? null : kw.name)
                      }
                    >
                      {kw.name}
                    </Button>

                  ))}

                  {activeKeyword && activeKeyword.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 5 }}
                      style={{
                        position: "absolute",
                        right: "-31vw",
                        top: 0,
                        padding: "0.6vh 0.8vw",
                        background: "rgba(0,0,0,0.4)", // 半透明背景
                        color: "#fff",
                        fontSize: "1.2vh",
                        borderRadius: "6px",
                        width: "30vw",
                        backdropFilter: "blur(8px)", // 毛玻璃效果
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
                      {part.keywords.find((kw) => kw.name === activeKeyword)?.value}
                    </motion.div>
                  )}
                </motion.div>
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
                          src={`${imageSrc}/${part.throwIndex}.png`}
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

            </div>}
            {!compareMode && <div
              style={{
                position: "relative",
                width: compareMode ? "100%" : "50%",
                display: "flex",
                gap: "1vw",
                flexDirection: "column"
              }}

            >
              <div style={{
                display: "flex",
                flexDirection: "row"
              }}>
                <img
                loading="lazy"
                  src={`${imageSrc}/${partId}.png`}
                  alt="current part"
                  style={{
                    width: "100%",
                    objectFit: "contain",
                    borderRadius: 8,
                  }}
                />

                {/* 右侧关键字按钮栏（非比较模式） */}
                {showKeyword && !compareMode && part?.keywords && part.keywords.length > 0 && (
                  <motion.div
                    style={{
                      position: "absolute",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5vh",
                      marginLeft: "1vw",
                      top: 0,
                      left: "100%",
                      zIndex: 20,
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    {part.keywords.map((kw, index) => (
                      <Button
                        key={index}
                        variant="secondary"
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
                        }}
                        onClick={() =>
                          setActiveKeyword(activeKeyword === kw.name ? null : kw.name)
                        }
                      >
                        {kw.name}
                      </Button>
                    ))}

                    {activeKeyword && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 5 }}
                        style={{
                          position: "absolute",
                          left: "-42vw",
                          top: "3vh",
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
                        {part.keywords.find((kw) => kw.name === activeKeyword)?.value}
                      </motion.div>
                    )}
                  </motion.div>
                )}




                {/* 原来的分数按钮 */}
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

              {/* projectile 和 throwIndex */}
              {part && (
                <div style={{ marginTop: "1vh" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5vw" }}>
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
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5vw" }}>
                    {part.throwIndex !== undefined && (
                      <div style={{ position: "relative" }}>
                        <img
                        loading="lazy"
                          src={`${imageSrc}/${part.throwIndex}.png`}
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
            </div>}
          </motion.div>

        )}
      </AnimatePresence>
    </div>

  );
}
