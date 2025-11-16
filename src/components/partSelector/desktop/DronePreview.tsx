import React, { useState, useRef } from "react";
import { Drone, Part } from "../../../types";
import { Button } from "../../ui/button";
import { AnimatePresence, motion } from "framer-motion";

interface DronePreviewProps {
  droneId: string;
  factionDrones: Drone[];
  imageSrc: string;
  compareMode?: boolean;
}

export default function DronePreview({
  droneId,
  factionDrones,
  imageSrc,
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
          <div key={`last-${droneId}`} style={{ width: "100%" }}>
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
                top: "1vh",
                left: "1vh",
                height: "3vh",
                width: "3vh",
                fontSize: "2vh",
                color: "#fff",                       // 白色文字
                textShadow: `
      0 0 2px #000,                      // 黑色描边
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
                          width: "30vw",
                          objectFit: "contain",
                          borderRadius: 4,
                          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
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
              </div>
            )}

          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
