// DroneComparePanel.jsx
import { Drone, Part } from "../../../../types";
import DronePreviewMobile from "./DronePreviewMobile";
interface DroneComparePanelMobileProps {
    lastPartId: string;
    hoverId: string;
    factionDrones: Drone[];
    imageSrc: string;
    compareMode: boolean;
    viewMode: string;
}
export default function DroneComparePanelMobile({
    lastPartId,
    hoverId,
    factionDrones,
    imageSrc,
    compareMode,
    viewMode,
}: DroneComparePanelMobileProps) {
    return (
        <div
            className="flex-shrink-0 flex flex-row gap-4"
            style={{
                height: "20vh",
                width: "100%",
                backgroundColor: "rgba(255,255,255,0.3)",
                borderRight: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "0.375rem 0 0 0.375rem",

                alignItems: "stretch", // 两列等高
            }}
        >
            {/* 左侧：当前装备 */}
            {(compareMode&&lastPartId!=="") && <DronePreviewMobile
                droneId={lastPartId}
                factionDrones={factionDrones}
                imageSrc={imageSrc}
                compareMode={compareMode}

            />}

            {/* 右侧：悬浮预览 */}
            <DronePreviewMobile
                droneId={(!compareMode&&hoverId==="")?lastPartId:hoverId}
                factionDrones={factionDrones}
                imageSrc={imageSrc}
                compareMode={compareMode}
            />
        </div>
    );
}
