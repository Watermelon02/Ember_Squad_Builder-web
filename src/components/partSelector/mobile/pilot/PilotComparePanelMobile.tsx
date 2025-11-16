// PilotComparePanel.tsx
import { Pilot } from "../../../../types";
import PilotPreviewMobile from "./PilotPreviewMobile";

interface PilotComparePanelMobileProps {
    lastPilotId: string;
    hoverId: string;
    factionPilots: Pilot[];
    imageSrc: string;
    compareMode: boolean;
    tabsrc: string;
    lang: string;
}

export default function PilotComparePanelMobile({
    lastPilotId,
    hoverId,
    factionPilots,
    imageSrc,
    compareMode,
    tabsrc,
    lang
}: PilotComparePanelMobileProps) {
    const leftPilot = factionPilots.find((p) => p.id === lastPilotId);
    const rightPilot = factionPilots.find((p) => p.id === hoverId);

    return (
        <div
            className="flex-shrink-0 flex flex-row"
            style={{
                height: "50%",
                width: "100%",
                padding: "0.5rem",
                backgroundColor: "rgba(255,255,255,0.3)",
                borderRight: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "0.375rem 0 0 0.375rem",
                minHeight: "25vw",
                alignItems: "stretch",
            }}
        >
            {/* 左侧：上一次的Pilot */}
            {(compareMode && lastPilotId !== "") && (
                <PilotPreviewMobile
                    pilotId={lastPilotId}
                    comparePilot={undefined}
                    factionPilots={factionPilots}
                    imageSrc={imageSrc}
                    tabSrc={tabsrc}
                    lang={lang}
                    compareMode={compareMode}
                    leftPreviewExist={true}
                />
            )}

            {/* 右侧：悬浮Pilot，显示与左侧差值 */}
            {rightPilot && (
                <PilotPreviewMobile
                    pilotId={(!compareMode && (hoverId === ""||hoverId==="null")) ? lastPilotId : hoverId}
                    comparePilot={leftPilot}
                    factionPilots={factionPilots}
                    imageSrc={imageSrc}
                    tabSrc={tabsrc}
                    lang={lang}
                    compareMode={compareMode}
                    leftPreviewExist={lastPilotId !== ""}
                />
            )}
        </div>
    );
}
