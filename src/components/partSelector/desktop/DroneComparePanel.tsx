// DroneComparePanel.jsx
import { Drone, Part, Projectile } from "../../../data/types";
import DronePreview from "./DronePreview";
interface DroneComparePanelProps {
    lastPartId: string;
    hoverId: string;
    factionDrones: Drone[];
    imageSrc: string;
    compareMode: boolean;
    viewMode: string;
    showKeyword: boolean;
    faction: string;
    tabsrc: string;
    lang: string;
    showSourceBox: boolean;
    gofProjectiles:Projectile[];
}
export default function DroneComparePanel({
    lastPartId,
    hoverId,
    factionDrones,
    imageSrc,
    compareMode,
    viewMode,
    showKeyword,
    faction,
    tabsrc, lang, showSourceBox,gofProjectiles
}: DroneComparePanelProps) {
    return (
        <div
            className="flex-shrink-0 flex flex-row gap-4"
            style={{
                width: (compareMode && lastPartId !== "") ? "60vw" : "30vw",
                padding: "0.5rem",
                height: "90vh",
                backgroundColor: "rgba(255,255,255,0.3)",
                borderRight: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "0.375rem 0 0 0.375rem",
                minHeight: "25vw",
                alignItems: "stretch", // 两列等高
            }}
        >
            {/* 左侧：当前装备 */}
            {(compareMode && lastPartId !== "") && <DronePreview
                droneId={lastPartId}
                factionDrones={factionDrones}
                imageSrc={imageSrc}
                compareMode={compareMode}
                showKeyword={showKeyword}
                tabsrc={tabsrc}
                faction={faction}
                lang={lang}
                showSourceBox={showSourceBox}
                gofProjectiles={gofProjectiles}
            />}

            {/* 右侧：悬浮预览 */}
            <DronePreview
                droneId={(!compareMode && hoverId === "") ? lastPartId : hoverId}
                factionDrones={factionDrones}
                imageSrc={imageSrc}
                compareMode={compareMode}
                showKeyword={showKeyword}
                tabsrc={tabsrc}
                faction={faction}
                lang={lang}
                showSourceBox={showSourceBox}
                gofProjectiles={gofProjectiles}
            />
        </div>
    );
}
