import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Trash2 } from "lucide-react";
import { FACTION_COLORS, Mech } from "../../types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { COLOR_TEXT_GREY } from "../../styles/color";

interface MechStatusProps {
    mech: Mech;
    translations: Record<string, string>;
    tabsrc: string;
    lang: string;
    editingMechId: string;
    setEditingMechId: (id: string) => void;
    updateMechName: (id: string, name: string) => void;
    copyMech: (mech: Mech) => void;
    deleteMech: (id: string) => void;
    getMechTotalScore: (mech: Mech) => number;
    getColorByAttr: (type: "dodge" | "electronic", value: number) => string;
    style?: React.CSSProperties;
    isMobile: boolean
}

export const MechStatus: React.FC<MechStatusProps> = ({
    mech,
    translations,
    tabsrc,
    lang,
    editingMechId,
    setEditingMechId,
    updateMechName,
    copyMech,
    deleteMech,
    getMechTotalScore,
    getColorByAttr,
    style,
    isMobile
}) => {
    const getStatusColor = () => {
        const usable =
            mech.parts.torso &&
            mech.parts.chasis &&
            (mech.parts.leftHand || mech.parts.rightHand) &&
            mech.pilot;
        if (!usable) return "#dc2626";

        const bannedBackpack = ["005"].includes(mech.parts.backpack?.id || "");
        const bannedLeft = ["040", "150", "117"].includes(mech.parts.leftHand?.id || "");
        const bannedRight = ["038", "152", "119"].includes(mech.parts.rightHand?.id || "");
        const isBanned = bannedBackpack || bannedLeft || bannedRight;

        const parts = [
            mech.parts.torso,
            mech.parts.chasis,
            mech.parts.leftHand,
            mech.parts.rightHand,
            mech.parts.backpack,
        ].filter(Boolean);

        const hasPD = parts.some((p) => p.isPD);
        const allPD = parts.every((p) => p.isPD);

        let factionMismatch = hasPD && !allPD;
        if (mech.pilot?.faction === "PD" && !allPD) factionMismatch = true;
        if (mech.pilot?.faction !== "PD" && hasPD) factionMismatch = true;

        if (isBanned || factionMismatch) return "#dc2626";

        return "#111"; // 正常
    };

    const getStatusText = () => {
        const usable =
            mech.parts.torso &&
            mech.parts.chasis &&
            (mech.parts.leftHand || mech.parts.rightHand) &&
            mech.pilot;
        if (!usable) return translations.t81;

        const bannedBackpack = ["005"].includes(mech.parts.backpack?.id || "");
        const bannedLeft = ["040", "150", "117"].includes(mech.parts.leftHand?.id || "");
        const bannedRight = ["038", "152", "119"].includes(mech.parts.rightHand?.id || "");
        const isBanned = bannedBackpack || bannedLeft || bannedRight;

        const parts = [
            mech.parts.torso,
            mech.parts.chasis,
            mech.parts.leftHand,
            mech.parts.rightHand,
            mech.parts.backpack,
        ].filter(Boolean);

        const hasPD = parts.some((p) => p.isPD);
        const allPD = parts.every((p) => p.isPD);

        let factionMismatch = hasPD && !allPD;
        if (mech.pilot?.faction === "PD" && !allPD) factionMismatch = true;
        if (mech.pilot?.faction !== "PD" && hasPD) factionMismatch = true;

        if (factionMismatch) return translations.t84;
        if (isBanned) return translations.t82;

        return translations.t83;
    };

    const attributes = [
        { label: translations.t32, value: getMechTotalScore(mech), type: "score" as const },
        {
            label: translations.t42,
            value: Math.max(
                (mech.parts.torso?.dodge || 0) +
                (mech.parts.chasis?.dodge || 0) +
                (mech.parts.leftHand?.dodge || 0) +
                (mech.parts.rightHand?.dodge || 0) +
                (mech.parts.backpack?.dodge || 0),
                0
            ),
            type: "dodge" as const,
            icon: `${tabsrc}/icon_dodge.png`,
        },
        {
            label: translations.t43,
            value:
                (mech.parts.torso?.electronic || 0) +
                (mech.parts.chasis?.electronic || 0) +
                (mech.parts.leftHand?.electronic || 0) +
                (mech.parts.rightHand?.electronic || 0) +
                (mech.parts.backpack?.electronic || 0),
            type: "electronic" as const,
            icon: `${tabsrc}/icon_electronic.png`,
        },
    ];

    return (
        <div
            style={{
                height: "20vh",
                padding: isMobile ? "2vh 3vw" : "2vh 1.5vw",
                borderRadius: "0.5rem",
                boxShadow: "inset 0 0 8px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "66.6%",
                ...style,
            }}
        >
            {/* 名字 + 按钮行 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {/* 机体参数 */}
                <div
                    style={{
                        height: "7.5vh",
                        width: isMobile ? "16vw" : "12vw",
                        borderRadius: "0.5rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f9fafb",
                        fontSize: "1.4vh",
                        color: getStatusColor(),
                        boxShadow: "inset 0 0 8px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease",
                    }}
                >
                    <div className="text-ssm text-muted-foreground">{translations.t98}</div>
                    <div style={{ fontSize: isMobile ? "2.4vw" : "2vh" }}>{getStatusText()}</div>
                </div>

                {/* 机体名字 */}
                <div
                    style={{
                        fontSize: isMobile
                            ? lang === "en"
                                ? "2.8vw"   // 📱 移动端英文更小
                                : "3vw"     // 📱 移动端中文稍大
                            : lang === "en"
                                ? "1.4vw"   // 💻 桌面端英文
                                : "1.3vw",    // 💻 桌面端中文
                        flexShrink: 0,
                        maxWidth: isMobile
                            ? lang === "en"
                                ? "30vw"    // 📱 移动端英文较窄
                                : "40vw"    // 📱 移动端中文较宽
                            : "40vw",      // 💻 桌面端统一
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        marginLeft: "0.5vw",
                        marginRight: "0.5vw",
                        color:COLOR_TEXT_GREY
                    }}

                >
                    {editingMechId === mech.id ? (
                        <Input
                            value={mech.name}
                            onChange={(e) => updateMechName(mech.id, e.target.value)}
                            onBlur={() => setEditingMechId("")}
                            onKeyDown={(e) => e.key === "Enter" && setEditingMechId("")}
                            className="h-8 w-full"
                            autoFocus
                        />
                    ) : (
                        <span onDoubleClick={() => setEditingMechId(mech.id)}>{mech.name || "1"}</span>
                    )}
                </div>

                {/* 操作按钮 */}
                <div style={{ display: "flex", gap: "0.25vw" }}>
                    {/* 复制按钮 */}
                    <Button
                        onClick={() => copyMech(mech)}
                        style={{
                            background: "#FFFFFF", // 白底
                            color: "#000000",      // 黑字
                            border: "none",
                            borderRadius: "8px",
                            padding: "0.25rem 0.5rem",
                            fontWeight: 600,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2), 0 0 6px rgba(0,0,0,0.1)", // 阴影
                            cursor: "pointer",
                            transition: "box-shadow 0.25s ease, transform 0.2s ease",
                            display: "inline-block",
                        }}
                        onMouseEnter={e => {
                            const btn = e.currentTarget as HTMLButtonElement;
                            btn.style.transform = "translateY(-2px)";
                            btn.style.boxShadow = "0 4px 8px rgba(0,0,0,0.25), 0 0 6px rgba(0,0,0,0.15)";
                        }}
                        onMouseLeave={e => {
                            const btn = e.currentTarget as HTMLButtonElement;
                            btn.style.transform = "translateY(0)";
                            btn.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2), 0 0 6px rgba(0,0,0,0.1)";
                        }}
                    >
                        <Copy className="w-4 h-4" />
                    </Button>

                    {/* 删除按钮 */}
                    <Button
                        onClick={() => deleteMech(mech.id)}
                        style={{
                            background: "#FFFFFF", // 白底
                            color: "#000000",      // 黑字
                            border: "none",
                            borderRadius: "8px",
                            padding: "0.25rem 0.5rem",
                            fontWeight: 600,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2), 0 0 6px rgba(0,0,0,0.1)", // 阴影
                            cursor: "pointer",
                            transition: "box-shadow 0.25s ease, transform 0.2s ease",
                            display: "inline-block",
                        }}
                        onMouseEnter={e => {
                            const btn = e.currentTarget as HTMLButtonElement;
                            btn.style.transform = "translateY(-2px)";
                            btn.style.boxShadow = "0 4px 8px rgba(0,0,0,0.25), 0 0 6px rgba(0,0,0,0.15)";
                        }}
                        onMouseLeave={e => {
                            const btn = e.currentTarget as HTMLButtonElement;
                            btn.style.transform = "translateY(0)";
                            btn.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2), 0 0 6px rgba(0,0,0,0.1)";
                        }}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>


            </div>

            {/* 属性卡片 */}
            <div style={{ display: "flex", justifyContent: "space-between", gap: isMobile ? "1.5vw" : "0.25vw" }}>
                {attributes.map((attr, idx) => (
                    <div
                        key={idx}
                        style={{
                            flex: 1,
                            height: "7.5vh",
                            padding: "0 0.25vw",
                            backgroundColor: "#f9fafb",
                            borderRadius: "0.5rem",
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: "inset 0 0 8px rgba(0,0,0,0.1)",
                        }}
                    >
                        <div style={{ fontSize: "1.4vh", color: "#6b7280", marginBottom: "0.15rem" }}>
                            {attr.label}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.25vw" }}>
                            {attr.icon && <img src={attr.icon} alt={attr.label} style={{
                                width: isMobile ? "4vw" : "1.8vw",
                                height: isMobile ? "4vw" : "1.8vw",
                            }} />}
                            <AnimatePresence mode="popLayout">
                                <motion.div
                                    key={attr.value}
                                    initial={{ scale: 1, y: 0, opacity: 0 }}
                                    animate={{ y: [-5, 0], opacity: 1 }}
                                    exit={{ y: 5, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        fontSize: isMobile ? "3vw" : "1.2vw",
                                        fontWeight: 500,
                                        color:
                                            attr.type === "dodge"
                                                ? getColorByAttr("dodge", attr.value)
                                                : attr.type === "electronic"
                                                    ? getColorByAttr("electronic", attr.value)
                                                    : "#111",
                                    }}
                                >
                                    {attr.value}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
