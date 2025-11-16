// TacticCardComparePanel.jsx
import { TacticCard, Part } from "../../../../types";
import TacticCardPreviewMobile from "./TacticCardPreviewMobile";

interface TacticCardComparePanelMobileProps {
    lastPartId: string;
    hoverId: string;
    tacticCards: TacticCard[];
    imageSrc: string;
    compareMode: boolean;
    viewMode: string;
}
export default function TacticCardComparePanelMobile({
    lastPartId,
    hoverId,
    tacticCards,
    imageSrc,
    compareMode,
    viewMode,
}: TacticCardComparePanelMobileProps) {
    return (
        <div
            className="flex-shrink-0 flex flex-row gap-4"
            style={{
                height: "40vh",
                width: "100%",
                padding: "0.5rem",
                backgroundColor: "rgba(255,255,255,0.3)",
                borderRight: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "0.375rem 0 0 0.375rem",
                minHeight: "25vw",
                alignItems: "stretch", // 两列等高
            }}
        >

            {/* 右侧：悬浮预览 */}
            <TacticCardPreviewMobile
                tacticCardId={hoverId}
                factionTacticCards={tacticCards}
                imageSrc={imageSrc}
                compareMode={compareMode}
            />
        </div>
    );
}
