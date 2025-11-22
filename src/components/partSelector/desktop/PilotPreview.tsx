// PilotPreview.tsx
import React from "react";
import { Pilot } from "../../../types";
import { Button } from "../../ui/button";
import PilotStatsColumn from "../../custom/PilotStatusColumn";
import { AnimatePresence, motion } from "framer-motion";

interface PilotPreviewProps {
  pilotId: string;
  comparePilot?: Pilot;
  factionPilots: Pilot[];
  imageSrc: string;
  tabSrc: string;
  lang?: string;
  compareMode: boolean;
  leftPreviewExist:boolean;
}

export default function PilotPreview({
  pilotId,
  comparePilot,
  factionPilots,
  imageSrc,
  tabSrc,
  lang = "cn",
  compareMode,
  leftPreviewExist
}: PilotPreviewProps) {
  const pilot: Pilot | undefined = factionPilots.find((p) => p.id === pilotId);

  if (!pilotId || !pilot) return <div style={{ height: "25vw" }} />;

  return (
    <div
      style={{
        display: "flex",
        width: compareMode ? leftPreviewExist?"50%":"100%" : "100%",
        flexDirection: "column",
        overflowY: "auto",
        position: "relative",
      }}
    >
      {/* SCORE BUTTON */}
      <Button
        variant="secondary"
        style={{
          position: "absolute",
          marginTop: "0.3rem",
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
          src={`${imageSrc}/${pilotId}.png`}
          alt={pilot.name}
          style={{
            width: "100%",
            objectFit: "contain",
            borderRadius: 8,
          }}
          key={pilot.id}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.2 }}
          loading="lazy"
        />
      </AnimatePresence>

      {/* 🧊 毛玻璃 Trait 信息框 */}
      <div
        style={{
          width: "100%",
          height: "6vh",
          padding: "0.4vh 0.5vw",
          marginTop: "1vh",
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
        }}
      >

        <span
          style={{
            fontSize: lang === "en" ? "1.2vh" : "0.9vw",
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
      <PilotStatsColumn
        pilot={pilot}
        comparePilot={comparePilot}
        tabsrc={tabSrc}
      />
    </div>
  );
}
