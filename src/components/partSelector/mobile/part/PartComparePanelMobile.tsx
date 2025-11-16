// PartComparePanel.jsx

import { Part } from "../../../../types";
import PartPreviewMobile from "./PartPreviewMobile";
interface PartComparePanelMobileProps {
    lastPartId: string;
    hoverId: string;
    factionParts: Part[];
    imageSrc: string;
    compareMode: boolean;
    viewMode: string;
}
export default function PartComparePanelMobile({
    lastPartId,
    hoverId,
    factionParts,
    imageSrc,
    compareMode,
    viewMode,
}: PartComparePanelMobileProps) {
    const leftPart = factionParts.find((p) => p.id === lastPartId);
    return (
        <div
            className="flex-shrink-0 flex flex-row gap-4"
            style={{
                height: "35vh",
                width: "100%",
                padding: "0.5rem",
                backgroundColor: "rgba(255,255,255,0.3)",
                borderRight: "1px solid rgba(255,255,255,0.1)",

                alignItems: "stretch", // 两列等高

            }}
        >
            {/* 左侧：当前装备 */}
            {(compareMode && lastPartId !== "") && <PartPreviewMobile
                partId={lastPartId}
                factionParts={factionParts}
                imageSrc={imageSrc}
                compareMode={compareMode}
                leftPreviewExist={true}

            />}

            {/* 右侧：悬浮预览 */}
            <PartPreviewMobile
                partId={(!compareMode && hoverId === "") ? lastPartId : hoverId}
                factionParts={factionParts}
                imageSrc={imageSrc}
                compareMode={compareMode}
                leftPreviewExist={lastPartId !== ""}
            />
        </div>
    );
}
