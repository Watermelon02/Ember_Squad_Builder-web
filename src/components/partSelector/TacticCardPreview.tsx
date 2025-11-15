import { TacticCard } from "../../types";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";

interface TacticCardPreviewProps {
  tacticCardId: string;
  factionTacticCards: TacticCard[];
  imageSrc: string;
  compareMode?: boolean;
}

export default function TacticCardPreview({
  tacticCardId,
  factionTacticCards,
  imageSrc,
}: TacticCardPreviewProps) {
  const tacticCard = factionTacticCards.find((t) => { if (t.id === tacticCardId) { return t } });

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
         <div key={`last-${tacticCardId}`} style={{ width: "100%" }}>
           {/* 主图 */}
           <img
             src={`${imageSrc}/${tacticCardId}`}
             alt="current part"
             style={{
               width: "100%",
               objectFit: "contain",
               borderRadius: 8,
               boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
             }}
             
           />
 {tacticCard&&<Button
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
               {tacticCard.score}
             </Button>}
           {/* projectile + throwIndex */}
           {tacticCard && (
             <div
               style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}
             >
             
             </div>
           )}
 
         </div>
       )}
     </motion.div>
     </AnimatePresence>
   );
}
