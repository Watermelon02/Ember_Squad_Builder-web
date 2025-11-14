// DroneComparePanel.jsx
import { Drone, Part } from "../../types";
import DronePreview from "./DronePreview";
import PartPreview from "./PartPreview";
interface DroneComparePanelProps {
    lastPartId: string;
    hoverId: string;
    factionDrones: Drone[];
    imageSrc: string;
    compareMode: boolean;
    viewMode: string;
}
export default function DroneComparePanel({
    lastPartId,
    hoverId,
    factionDrones,
    imageSrc,
    compareMode,
    viewMode,
}: DroneComparePanelProps) {
    return (
        <div
            className="flex-shrink-0 flex flex-row gap-4"
            style={{
                width: "60vw",
                padding: "0.5rem",
                backgroundColor: "rgba(255,255,255,0.3)",
                borderRight: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "0.375rem 0 0 0.375rem",
                minHeight: "25vw",
                alignItems: "stretch", // 两列等高
            }}
        >
            {/* 左侧：当前装备 */}
            {compareMode && <DronePreview
                droneId={lastPartId}
                factionDrones={factionDrones}
                imageSrc={imageSrc}
                compareMode={compareMode}

            />}

            {/* 右侧：悬浮预览 */}
            <DronePreview
                droneId={hoverId}
                factionDrones={factionDrones}
                imageSrc={imageSrc}
                compareMode={compareMode}
            />
        </div>
    );
}
