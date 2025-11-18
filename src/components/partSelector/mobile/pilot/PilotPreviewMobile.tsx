// PilotPreview.tsx
import React from "react";
import { Pilot } from "../../../../types";
import { Button } from "../../../ui/button";
import { AnimatePresence, motion } from "framer-motion";
import PilotStatsColumnMobile from "./PilotStatusColumnMobile";

interface PilotPreviewMobileProps {
  pilotId: string;
  comparePilot?: Pilot;
  factionPilots: Pilot[];
  imageSrc: string;
  tabSrc: string;
  lang?: string;
  compareMode: boolean;
  leftPreviewExist: boolean;
}

export default function PilotPreviewMobile({
  pilotId,
  comparePilot,
  factionPilots,
  imageSrc,
  tabSrc,
  lang = "cn",
  compareMode,
  leftPreviewExist
}: PilotPreviewMobileProps) {
  const pilot: Pilot | undefined = factionPilots.find((p) => p.id === pilotId);

  if (!pilotId || !pilot) return <div style={{ width: "100%", height: "25vw" }} />;

  return (
    <div
      style={{
        overflowY: "auto",
        width: compareMode ? leftPreviewExist ? "50%" : "100%" : "100%",
        position: "relative",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        paddingLeft: "1vw",
        paddingRight: "1vw"
      }}
    >
      <style>
        {`
      div::-webkit-scrollbar {
        display: none;
      }
    `}
      </style>
      {/* SCORE BUTTON */}
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
          backgroundColor: "rgba(255,255,255,0.12)",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          zIndex: 3,
        }}
      >
        {pilot.score}
      </Button>
      <AnimatePresence mode="wait">

        {/* PILOT IMAGE */}
        <motion.img
          src={`${tabSrc}/${pilotId}.png`}
          alt={pilot.name}
          style={{
            width: compareMode ? !leftPreviewExist? "40%":"80%": "40%",
            objectFit: "contain",
            borderRadius: 8,
            display: "block",     // ★ 必须，让图片变 block
            margin: "0 auto",     // ★ 水平居中
          }}
          key={pilot.id}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.2 }}
        />
      </AnimatePresence>

      {/* 🧊 毛玻璃 Trait 信息框 */}
      <div
        style={{
          width: "100%",
          height: "7vh",
          padding: "0.8vh 3vw",

          marginBottom: "1vh",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          background: "rgba(255,255,255,0.14)",
          borderRadius: 10,
          boxShadow: "0 0 8px rgba(0,0,0,0.4) inset",

          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          textAlign: "start",

          color: "white",
          zIndex: 2,

          overflowY: "auto",          // ← ★★ 关键代码 ★★
          scrollbarWidth: "thin",     // Firefox
        }}
      >
        <span
          style={{
            fontSize: lang === "en" ? "1.2vh" : "3vw",
            color: "white",
            textShadow: `
        -1px -1px 1px #000,
         1px -1px 1px #000,
        -1px  1px 1px #000,
         1px  1px 1px #000
      `,
          }}
        >
          {pilot.traitDescription}
        </span>
      </div>


      {/* 📊 柱状图 */}
      <PilotStatsColumnMobile
        pilot={pilot}
        comparePilot={comparePilot}
        tabsrc={tabSrc}
        compareMode={compareMode}
      />
    </div>
  );
}
