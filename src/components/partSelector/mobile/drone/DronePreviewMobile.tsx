import React, { useState, useRef, useEffect } from "react";
import { Drone } from "../../../../types";
import { Button } from "../../../ui/button";
import { AnimatePresence, motion } from "framer-motion";

interface DronePreviewMobileProps {
  droneId: string;
  factionDrones: Drone[];
  imageSrc: string;
  compareMode?: boolean;
  showKeyword: boolean;
  lang:string;
}

export default function DronePreviewMobile({
  droneId,
  factionDrones,
  imageSrc,
  showKeyword, compareMode,lang
}: DronePreviewMobileProps) {
  const drone = factionDrones.find((dr) => { if (dr.id === droneId) { return dr } });
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);
  useEffect(() => {
    setActiveKeyword(null);
  }, [droneId]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        style={{
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
          <div style={{ height: "30vw" }} />
        ) : (
          <div key={`last-${droneId}`} >
            {/* 主图 */}
            <img
              src={`${imageSrc}/${droneId}.png`}
              alt="current part"
              style={{
                width: "100%",
                objectFit: "contain",
                borderRadius: 8,

              }}

            />

            {drone && <Button
              variant="secondary"
              style={{
                position: "absolute",
                top: "0vh",
                right: "0vh",
                height: "3vh",
                width: "3vh",
                fontSize: "2vh",
                color: "#fff",                       // 白色文字
                textShadow: `
            0 0 2px #000,
            0 0 4px #000,
            0 0 6px #000
          `,
                backdropFilter: "blur(4px)",          // 背景模糊
                WebkitBackdropFilter: "blur(4px)",    // Safari 支持
                backgroundColor: "rgba(255,255,255,0.1)", // 半透明背景
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              }}
            >
              {drone.score}
            </Button>}

            {/* 词条 */}
            {showKeyword && drone?.keywords && drone?.keywords.length > 0 && (
              <motion.div
                style={{
                  position: "absolute",
                  top: "3vh",
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
                {drone.keywords.map((kw, index) => (
                  <Button
                    key={index}
                    variant="secondary"
                    style={{
                      fontSize: "2vw",
                      borderRadius: "6px",
                      width: "10vw",
                      background: "rgba(255, 255, 255, 0.05)", // 半透明背景
                      color: "#fff",
                      backdropFilter: "blur(8px)", // 毛玻璃效果
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      transition: "all 0.2s ease",
                      textShadow: `
            1px 1px 1px #000, 
            -1px -1px 1px #000, 
            1px -1px 1px #000, 
            -1px 1px 1px #000,
            0 0 4px rgba(255,255,255,0.6)
          `,
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
                    {drone.keywords.find((kw) => kw.name === activeKeyword)?.value}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* projectile + throwIndex */}
            {drone && (
              <div
                style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}
              >
                {/* projectile 区域 */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {drone.projectile?.map((proj, idx) => (
                    <div key={idx} style={{ position: "relative" }}>
                      <img
                        src={`${imageSrc}/${proj}.png`}
                        alt={`projectile-${idx}`}
                        style={{
                          width: "100%",
                          objectFit: "contain",
                          borderRadius: 4,
                          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
