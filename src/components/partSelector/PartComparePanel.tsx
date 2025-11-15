// PartComparePanel.jsx
import { Part } from "../../types";
import PartPreview from "./PartPreview";
interface PartComparePanelProps {
    lastPartId: string;
    hoverId: string;
    factionParts: Part[];
    imageSrc: string;
    compareMode: boolean;
    viewMode: string;
}
export default function PartComparePanel({
    lastPartId,
    hoverId,
    factionParts,
    imageSrc,
    compareMode,
    viewMode,
    
}: PartComparePanelProps) {
    return (
        <div
            className="flex-shrink-0 flex flex-row gap-4"
            style={{
                width: (compareMode&&lastPartId!=="")?"40vw":"20vw",
                padding: "0.5rem",
                backgroundColor: "rgba(255,255,255,0.3)",
                borderRight: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "0.375rem 0 0 0.375rem",

                alignItems: "stretch", // 两列等高
            }}
        >
            {/* 左侧：当前装备 */}
            {(compareMode&&lastPartId!=="")&& <PartPreview
                partId={lastPartId}
                factionParts={factionParts}
                imageSrc={imageSrc}
                compareMode={compareMode}
                
            />}

            {/* 右侧：悬浮预览 */}
            <PartPreview
                partId={hoverId}
                factionParts={factionParts}
                imageSrc={imageSrc}
                compareMode={compareMode}
            />
        </div>
    );
}
