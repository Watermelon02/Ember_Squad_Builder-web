import { useState } from "react";
import { motion } from "framer-motion";

interface DroneImageProps {
  drone: any; // drone 对象，至少有 id
  tabsrc: string;
}

export const DroneImage: React.FC<DroneImageProps> = ({ drone, tabsrc }) => {
  const [hovered, setHovered] = useState(false);
  const hasImage = !!drone.id;
  const containerSize = 40; // 容器宽高

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

        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hasImage ? (
        <motion.img
          src={`${tabsrc}/${drone.id}.png`}
          alt={drone.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
          initial={{ scale: 1 }}
          animate={{ scale: hovered ? 1.2 : 1 }}
          transition={{ duration: 0.1 }}
        />
      ) : (
        <motion.div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          initial={{ scale: 1 }}
          animate={{ scale: hovered ? 1.2 : 1 }}
          transition={{ duration: 0.1 }}
        >
          空
        </motion.div>
      )}
    </div>
  );
};
