import React, { useCallback, useState } from 'react';
import { Virtuoso } from 'react-virtuoso'; // 1. 引入 Virtuoso
import { Card } from '../../../radix-ui/card';
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

const MemoizedPilotCard = React.memo(({
    pilot,
    isSelected,
    onSelect,
    tabsrc,
    imgsrc,
    translations,
    lastScore
}: any) => {
    return (
        /* Virtuoso 每一行建议包裹一层 div 处理间距 */
        <div style={{ paddingBottom: '12px', paddingLeft: '2vw', paddingRight: '2vw' }}>
            <SelectableCard
                selected={isSelected}
                className="p-4 cursor-pointer relative overflow-hidden shadow-sm"
                onClick={() => onSelect(pilot)}
            >
                {/* 背景图层 - 增加 decoding="async" 减少滚动阻塞 */}
                <img
                    src={`${tabsrc}/${pilot.id}.png?v=${TAB_PILOT_VERSION}`}
                    alt=""
                    className="absolute right-0 top-0 w-auto h-full object-contain pointer-events-none"
                    style={{ opacity: 0.4 }}
                    loading='lazy'
                    decoding="async"
                />

                {/* 文字内容层 */}
                <div className="relative z-10 space-y-2">
                    {/* 名称和分数 */}
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium">{pilot.name}</h4>
                        <Badge variant="outline" className="relative">
                            {pilot.score}
                            {pilot.score !== lastScore && (
                                <span
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 2,
                                        fontSize: 8,
                                        opacity: 0.5,
                                    }}
                                >
                                    {pilot.score > lastScore ? '▲' : '▼'}
                                </span>
                            )}
                        </Badge>
                    </div>

                    {/* 驾驶员属性 */}
                    <div className="flex items-stretch gap-1 w-full">
                        {[
                            { value: pilot.swift, icon: 'icon_swift' },
                            { value: pilot.melee, icon: 'icon_melee' },
                            { value: pilot.projectile, icon: 'icon_projectile' },
                            { value: pilot.firing, icon: 'icon_firing' },
                            { value: pilot.moving, icon: 'icon_moving' },
                            { value: pilot.tactic, icon: 'icon_tactic' },
                        ].map(({ value, icon }) => (
                            <div
                                key={icon}
                                className="flex-1 flex flex-col items-center justify-center h-16 border rounded-md bg-background/50"
                            >
                                <img
                                    src={`${tabsrc}/${icon}.png`}
                                    alt={icon}
                                    width={30}
                                    height={30}
                                    className="object-contain"
                                    decoding="async"
                                    loading="lazy"
                                />
                                <div className="text-[10px] mt-0.5">{value}</div>
                            </div>
                        ))}
                    </div>

                    {/* 特性描述 - 优化点：使用 WebkitTextStroke 代替多重 textShadow */}
                    {pilot.traitDescription && (
                        <div className="space-y-2">
                            <p
                                className="text-sm text-muted-foreground"
                                style={{
                                    color: 'white',
                                    textShadow: `
          -1px -1px 1px #000,
           1px -1px 1px #000,
          -1px  1px 1px #000,
           1px  1px 1px #000
        `,
                                }}
                            >
                                {pilot.traitDescription}
                            </p>
                        </div>
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
        // 如果需要切换大图预览，取消下面注释
        // onSetHoverImg(`${imgsrc}/${pilot.id}.png`);
    }, [onSelectPilot, onSetHoverImg, imgsrc]);

    // 渲染空状态
    if (filteredPilots.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-8">
                {translations.t55}
            </div>
        );
    }

    return (
        /* 2. 使用 Virtuoso 替换原有的 div.map */
        <Virtuoso
            style={{ height: '60vh', width: '100%' }}
            data={filteredPilots}
            overscan={window.innerHeight * 0.8}
            itemContent={(index, pilot) => (
                <MemoizedPilotCard
                    key={pilot.id}
                    pilot={pilot}
                    isSelected={selectedPilotId === pilot.id}
                    onSelect={handleSelect}
                    tabsrc={tabsrc}
                    imgsrc={imgsrc}
                    translations={translations}
                    lastScore={lastScore}
                />
            )}
        />
    );
};

export default PilotListMobile;