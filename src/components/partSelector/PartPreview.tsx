import React, { useState, useRef } from "react";
import { Part } from "../../types";
import { Button } from "../ui/button";

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

    setLensPos({ x: e.clientX - lensSize / 2, y: e.clientY - lensSize / 2 });
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

      {!partId ? (
        <div style={{ width: "100%", height: "25vw" }} />
      ) : (
        <div key={`last-${partId}`} style={{ width: "100%" }}>
          {/* 主图 */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={`${imageSrc}/${partId}.png`}
              alt="current part"
              style={{
                width: "100%",
                objectFit: "contain",
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            />

            {part&&<Button
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
              {part.score}
            </Button>}
          </div>



          {/* projectile + throwIndex */}
          {part && (
            <div
              style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}
            >
              {/* projectile 区域 */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {part.projectile?.map((proj, idx) => (
                  <div key={idx} style={{ position: "relative" }}>
                    <img
                      src={`${imageSrc}/${proj}.png`}
                      alt={`projectile-${idx}`}
                      style={{
                        width: "25vw",
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

              {/* throwIndex */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {part.throwIndex !== undefined && (
                  <div style={{ position: "relative" }}>
                    <img
                      src={`${imageSrc}/${part.throwIndex}.png`}
                      alt={`throw-${part.throwIndex}`}
                      style={{
                        width: "25vw",
                        objectFit: "contain",
                        borderRadius: 4,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
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
                position: "fixed", // 或者 absolute 相对父容器
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
        </div>
      )}
    </div>
  );
}
