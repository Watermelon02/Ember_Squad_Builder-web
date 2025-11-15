import React, { useState, useRef } from "react";
import { Part } from "../../types";
import { Button } from "../ui/button";
  import { AnimatePresence, motion } from "framer-motion";

interface PartPreviewProps {
  partId: string;
  factionParts: Part[];
  imageSrc: string;
  compareMode?: boolean;
}

export default function PartPreview({
  partId,
  factionParts,
  imageSrc,
}: PartPreviewProps) {
  const part = factionParts.find((p) => p.id === partId);

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

<div
  style={{
    width: "20vw",
    overflowY: "auto",
    flex: 1,
    position: "relative",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
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
        style={{ width: "100%" }}
      >
        {/* 主图 */}
        <div style={{ position: "relative", display: "inline-block" }}>
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
                top: "1vh",
                left: "1vh",
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

        {/* projectile + throwIndex */}
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
                      width: "25vw",
                      objectFit: "contain",
                      borderRadius: 4,
                    }}
                    onMouseMove={(e) => {
                      handleMouseMove(e);
                      setLensImage(`${imageSrc}/${proj}.png`);
                    }}
                    onMouseEnter={() => setLensVisible(true)}
                    onMouseLeave={() => setLensVisible(false)}
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
      </motion.div>
    )}
  </AnimatePresence>
</div>

  );
}
