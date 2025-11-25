import { TacticCard } from "../../../../data/types";
import { Button } from "../../../radix-ui/button";
import { AnimatePresence, motion } from "framer-motion";

interface TacticCardPreviewMobileProps {
  tacticCardId: string;
  factionTacticCards: TacticCard[];
  imageSrc: string;
  compareMode?: boolean;
}

export default function TacticCardPreviewMobile({
  tacticCardId,
  factionTacticCards,
  imageSrc,
}: TacticCardPreviewMobileProps) {
  const tacticCard = factionTacticCards.find((t) => { if (t.id === tacticCardId) { return t } });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        style={{
          width: "100%",
          overflowY: "auto",
          flex: 1,
          position: "relative",
          scrollbarWidth: "none",
          msOverflowStyle: "none",

        }}
        key={tacticCard?.id}
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.2 }}
      >
        <style>
          {`
           div::-webkit-scrollbar {
             display: none;
           }
         `}
        </style>

        {!tacticCardId ? (
          <div style={{ width: "100%", height: "30vw" }} />
        ) : (
          <div
            key={`last-${tacticCardId}`}
            style={{
              width: "100%",
              position: "relative", // ★ 关键：让 Button 相对于这个 div 定位
              display: "inline-block", // ★ 避免占满整行
            }}
          >
            {/* 主图 */}
            <img
              src={`${imageSrc}/${tacticCardId}.png`}
              alt="current part"
              style={{
                display: "block",
                margin: "0 auto",
                width: "50%",
                objectFit: "contain",
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            />

            {/* 右上角按钮 */}
            {tacticCard && (
              <Button
                variant="secondary"
                style={{
                  position: "absolute",
                  top: 0,          // 与图片顶部对齐
                  right: "23%",    // ★ 因为图片是 50% 宽，右侧相对父容器，需要偏移一半
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
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                }}
              >
                {tacticCard.score}
              </Button>
            )}
          </div>

        )}
      </motion.div>
    </AnimatePresence>
  );
}
