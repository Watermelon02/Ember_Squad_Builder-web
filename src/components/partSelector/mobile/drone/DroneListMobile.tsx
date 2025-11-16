import React, { useState } from 'react';
import { Card } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { SelectableCard } from '../../../custom/SelectableCard';
interface DroneListMobileProps {
  filteredDrones: any[];
  onSelectDrone: (drone: any) => void;
  onSetHoverImg: (src: string) => void;
  tabsrc: string;
  imgsrc: string;
  translations: any;
}

const DroneListMobile: React.FC<DroneListMobileProps> = ({
  filteredDrones,
  onSelectDrone,
  onSetHoverImg,
  tabsrc,
  imgsrc,
  translations,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 取消选中
  const resetSelection = () => setSelectedId(null);
  return (
    <div className="flex flex-col" style={{ minHeight: "70vh" }}>
      <div
        className="flex-1 overflow-y-auto space-y-3"
        style={{ paddingLeft: '2vw', paddingRight: '2vw' }}
      >
        {filteredDrones.map((drone) => (
          <SelectableCard
            key={drone.id}
            className="relative p-3 cursor-pointer hover:bg-accent/50 transition overflow-hidden shadow-sm min-h-[120px]"
            selected={selectedId === drone.id} // 由父组件控制选中状态
            onClick={() => { onSelectDrone(drone); setSelectedId(drone.id) }}
          >
            {/* 背景图层 */}
            <img
              src={`${tabsrc}/${drone.id}.png`}
              alt=""
              className="absolute right-0 top-0 w-auto h-full object-contain pointer-events-none"
              style={{ opacity: 0.8 }}
              loading='lazy'
            />


            {/* 前景文字内容 */}
            <div className="relative z-10 space-y-2">
              {/* 名称和分数 */}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="shrink-0">
                  {drone.score}
                </Badge>
                <h4 className="font-medium truncate">{drone.name}</h4>
              </div>

              {/* 属性 */}
              <div className="flex items-center gap-2">
                {(drone.armor !== 0 || drone.structure !== 0) && (
                  <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm">
                    <div className="flex items-center gap-1">
                      <img
                        loading="lazy"
                        src={`${tabsrc}/icon_armor.png`}
                        alt="armor"
                        className="w-4 h-4"
                      />
                      <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                        {drone.structure === 0
                          ? translations.t39
                          : `${translations.t39}/${translations.t40}`}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '16px',
                        color:
                          drone.armor < 0 || drone.structure < 0 ? 'red' : 'inherit',
                      }}
                    >
                      {drone.structure === 0
                        ? drone.armor
                        : `${drone.armor} / ${drone.structure}`}
                    </div>
                  </div>
                )}

                {[
                  { label: translations.t41, value: drone.parray, icon: 'icon_parray' },
                  {
                    label: translations.t42,
                    value: drone.dodge,
                    icon: 'icon_dodge',
                    color: (() => {
                      const v = Math.min(Math.max(drone.dodge, 1), 6);
                      const opacity = 0.2 + v * 0.08;
                      return `rgba(0,120,255,${opacity})`;
                    })(),
                  },
                  {
                    label: translations.t43,
                    value: drone.electronic,
                    icon: 'icon_electronic',
                    color: (() => {
                      const v = Math.min(Math.max(drone.electronic, 1), 6);
                      const opacity = 0.2 + v * 0.08;
                      return `rgba(255,180,0,${opacity})`;
                    })(),
                  },
                ]
                  .filter((attr) => attr.value !== 0)
                  .map((attr) => (
                    <div
                      key={attr.label}
                      className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm"
                    >
                      <div className="flex items-center gap-1">
                        <img
                          loading="lazy"
                          src={`${tabsrc}/${attr.icon}.png`}
                          alt={attr.label}
                          className="w-4 h-4"
                        />
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'var(--muted-foreground)',
                          }}
                        >
                          {attr.label}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: '16px',
                          color: attr.value < 0 ? 'red' : attr.color || 'inherit',
                        }}
                      >
                        {attr.value}
                      </div>
                    </div>
                  ))}
              </div>

              {/* 类型 */}
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    drone.type === 'large'
                      ? 'destructive'
                      : drone.type === 'medium'
                        ? 'default'
                        : 'secondary'
                  }
                >
                  {drone.type === 'large'
                    ? '大型'
                    : drone.type === 'medium'
                      ? '中型'
                      : '小型'}
                </Badge>
              </div>
            </div>
          </SelectableCard>
        ))}
      </div>
    </div>
  );
};

export default DroneListMobile;
