import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MechImageProps {
  mech: any;
  tabsrc: string;
  translation: any;
}

export const MechImage: React.FC<MechImageProps> = ({ mech, tabsrc, translation }) => {
  const [hovered, setHovered] = useState(false);

  const containerSize = 40; // 容器宽高

  // 保存上一帧的部件 id，用于检测变化
  const [prevParts, setPrevParts] = useState<any>({});
  const [animatingPart, setAnimatingPart] = useState<{ key: string; id: string } | null>(null);

  const partsKeys = ["chasis", "leftHand", "rightHand", "backpack", "pilot"];

  useEffect(() => {
    // 检测非核心部件变化
    for (const key of partsKeys) {
      const prevId = prevParts[key]?.id;
      const currentId = key === "pilot" ? mech.pilot?.id : mech.parts[key]?.id;
      if (currentId && currentId !== prevId) {
        setAnimatingPart({ key, id: currentId });
        break; // 只动画一个部件
      }
    }
    setPrevParts({
      ...mech.parts,
      pilot: mech.pilot,
    });
  }, [mech]);

  const hasTorso = !!mech.parts.torso?.id;
  const pilot = mech.pilot;

  return (
    <div
      className="bg-gray-100"
      style={{
        position: "relative",
        width: `${containerSize}px`,
        height: `${containerSize}px`,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "0.5rem",
        fontSize: "12px",
        color: "#6b7280",
        fontWeight: "bold",
        textAlign: "center",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 核心 Torso */}
      {hasTorso ? (
        <motion.img
          key={mech.parts.torso.id}
          src={`${tabsrc}/${mech.parts.torso.id}.png`}
          alt="torso"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
          initial={{ y: 0 }}
          animate={{ y: hovered ? -containerSize : 0 }}
          transition={{ duration: 0.3 }}
        />
      ) : (
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          initial={{ y: 0 }}
          animate={{ y: hovered ? -containerSize : 0 }}
          transition={{ duration: 0.3 }}
        >
          {translation.t94}
        </motion.div>
      )}

      {/* 非核心部件动画 */}
      <AnimatePresence>
        {animatingPart && animatingPart.key !== "pilot" && (
          <motion.img
            key={animatingPart.id}
            src={
              animatingPart.key === "pilot"
                ? `${tabsrc}/${pilot?.id}.png`
                : `${tabsrc}/${mech.parts[animatingPart.key]?.id}.png`
            }
            alt={animatingPart.key}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            initial={{ y: -containerSize, opacity: 1 }}
            animate={{ y: 0, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            onAnimationComplete={() => setAnimatingPart(null)}
          />
        )}
      </AnimatePresence>

      {/* 驾驶员 hover 动画 */}
      {pilot?.id && (!animatingPart || animatingPart.key !== "pilot") ? (
        <motion.img
          key={pilot.id}
          src={`${tabsrc}/${pilot.id}.png`}
          alt="pilot"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
          initial={{ y: containerSize }}
          animate={{ y: hovered ? 0 : containerSize }}
          transition={{ duration: 0.3 }}
        />
      ) : animatingPart?.key === "pilot" ? (
        <AnimatePresence>
          <motion.img
            key={pilot?.id}
            src={`${tabsrc}/${pilot?.id}.png`}
            alt="pilot"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            initial={{ y: -containerSize, opacity: 1 }}
            animate={{ y: 0, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            onAnimationComplete={() => setAnimatingPart(null)}
          />
        </AnimatePresence>
      ) : null}
    </div>
  );
};
