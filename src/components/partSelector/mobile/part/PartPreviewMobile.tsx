import React, { useState, useRef } from "react";
import { Part } from "../../../../types";
import { Button } from "../../../ui/button";
import { AnimatePresence, motion } from "framer-motion";

interface PartPreviewMobileProps {
  partId: string;
  factionParts: Part[];
  imageSrc: string;
  compareMode?: boolean;
  leftPreviewExist:boolean;
}

export default function PartPreviewMobile({
  partId,
  factionParts,
  imageSrc,
  compareMode,
  leftPreviewExist
}: PartPreviewMobileProps) {
  const part = factionParts.find((p) => p.id === partId);


  return (

    <div
      style={{
        overflowY: "auto",
        width: compareMode ? leftPreviewExist?"50%":"100%" : "100%",
        flexDirection: "column",
        position: "relative",
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
          >
            <div
              style={{
                position: "relative",
                width: compareMode ? "100%" : "50%", // !compareMode 时 50%
              }}
            >
              <img
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
                    right:"0vw",
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
                 {part && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {/* projectile 区域 */}
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {part.projectile?.map((proj, idx) => (
                    <div key={idx} style={{ position: "relative" }}>
                      <img
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

            </div>
          </motion.div>

        )}
      </AnimatePresence>
    </div>

  );
}
