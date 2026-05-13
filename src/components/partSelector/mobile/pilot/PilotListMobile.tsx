import React, { useCallback, useState, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Badge } from '../../../radix-ui/badge';
import { SelectableCard } from '../../../custom/SelectableCard';
import { TAB_PILOT_VERSION } from '../../../../data/resource';

interface PilotListMobileProps {
    filteredPilots: any[];
    onSelectPilot: (pilot: any) => void;
    onSetHoverImg: (src: string) => void;
    tabsrc: string;
    imgsrc: string;
    translations: any;
    lastScore: number;
    selectedId?: string | null;
}

const PILOT_ATTR_ICONS = [
    'icon_swift',
    'icon_melee',
    'icon_projectile',
    'icon_firing',
    'icon_moving',
    'icon_tactic',
    'icon_LV'
] as const;

const PILOT_ATTR_KEYS = [
    'swift',
    'melee',
    'projectile',
    'firing',
    'moving',
    'tactic',
    'LV'
] as const;

const TRAIT_TEXT_STYLE: React.CSSProperties = {
    color: 'white',
    textShadow: '-1px -1px 1px #000, 1px -1px 1px #000, -1px 1px 1px #000, 1px 1px 1px #000',
};

const MemoizedPilotCard = React.memo(({
    pilot,
    isSelected,
    onSelect,
    tabsrc,
    translations,
    lastScore,
}: any) => {
    const attrs = useMemo(() =>
        PILOT_ATTR_KEYS.map((key, i) => ({
            value: pilot[key],
            icon: PILOT_ATTR_ICONS[i],
        })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [pilot.swift, pilot.melee, pilot.projectile, pilot.firing, pilot.moving, pilot.tactic]
    );

    return (
        <div
          style={{ paddingBottom: '12px', paddingLeft: '2vw', paddingRight: '2vw',
                   contentVisibility: 'auto', containIntrinsicSize: 'auto 11rem' }}
        >
            <SelectableCard
                selected={isSelected}
                className="p-4 cursor-pointer relative overflow-hidden shadow-sm"
                onClick={() => onSelect(pilot)}
            >
                <img
                    src={`${tabsrc}/${pilot.id}.webp?v=${TAB_PILOT_VERSION}`}
                    alt=""
                    className="absolute right-0 top-0 w-auto h-full object-contain pointer-events-none"
                    style={{ opacity: 0.4 }}
                    loading="lazy"
                    decoding="async"
                />

                <div className="relative z-10 space-y-2">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium">{pilot.name}</h4>
                        <Badge variant="outline" className="relative">
                            {pilot.score}
                            {pilot.score !== lastScore && (
                                <span style={{ position: 'absolute', top: 0, right: 2, fontSize: 8, opacity: 0.5 }}>
                                    {pilot.score > lastScore ? '▲' : '▼'}
                                </span>
                            )}
                        </Badge>
                    </div>

                    <div className="flex items-stretch gap-1 w-full" style={{ contain: 'layout style paint', height: '4.5rem' }}>
                        {attrs.map(({ value, icon }) => (
                            <div
                                key={icon}
                                className="flex-1 flex flex-col items-center justify-center h-16 border rounded-md bg-background/50"
                                style={{ height: '4.5rem', minHeight: '4.5rem' }}
                            >
                                <img
                                    src={`${tabsrc}/${icon}.webp`}
                                    alt={icon}
                                    width={28}
                                    height={28}
                                    className="object-contain"
                                    decoding="async"
                                />
                                <div className="text-[10px] mt-0.5">{value}</div>
                            </div>
                        ))}
                    </div>

                    {pilot.traitDescription && (
                        <p className="text-sm text-muted-foreground" style={TRAIT_TEXT_STYLE}>
                            {pilot.traitDescription}
                        </p>
                    )}
                </div>
            </SelectableCard>
        </div>
    );
});

const PilotListMobile: React.FC<PilotListMobileProps> = ({
    filteredPilots,
    onSelectPilot,
    onSetHoverImg,
    tabsrc,
    imgsrc,
    translations,
    lastScore,
}) => {
    const [selectedPilotId, setSelectedPilotId] = useState<string | null>(null);

    const handleSelect = useCallback((pilot: any) => {
        onSelectPilot(pilot);
        setSelectedPilotId(pilot.id);
    }, [onSelectPilot]);
    // ✅ 修复5：移除无用的 onSetHoverImg / imgsrc 依赖，它们在函数体内根本没有被使用

    if (filteredPilots.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-8">
                {translations.t55}
            </div>
        );
    }

    return (
        <Virtuoso
            style={{ height: '100%', width: '100%' }}
            data={filteredPilots}
            overscan={200}
            computeItemKey={(index, pilot) => pilot.id}
            itemContent={(index, pilot) => (
                <MemoizedPilotCard
                    // ✅ 修复7：Virtuoso 的 itemContent 已通过 index 管理 key，
                    //    内部组件不需要再传 key，传了也会被忽略
                    pilot={pilot}
                    isSelected={selectedPilotId === pilot.id}
                    onSelect={handleSelect}
                    tabsrc={tabsrc}
                    translations={translations}
                    lastScore={lastScore}
                />
            )}
        />
    );
};

export default PilotListMobile;