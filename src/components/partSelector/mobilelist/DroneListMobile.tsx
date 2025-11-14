import React from 'react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
interface DroneListProps {
  filteredDrones: any[];
  onSelectDrone: (drone: any) => void;
  onSetHoverImg: (src: string) => void;
  tabsrc: string;
  imgsrc: string;
  translations: any;
}

const DroneList: React.FC<DroneListProps> = ({
  filteredDrones,
  onSelectDrone,
  onSetHoverImg,
  tabsrc,
  imgsrc,
  translations,
}) => {
  return (
    <div className="min-h-0 flex flex-col">
      <div
        className="flex-1 overflow-y-auto space-y-3"
        style={{ paddingTop: '1vh', paddingLeft: '2vw', paddingRight: '2vw' }}
      >
        {filteredDrones.map((drone) => (
          <Card
            key={drone.id}
            className="relative p-3 cursor-pointer hover:bg-accent/50 transition overflow-hidden shadow-sm min-h-[120px]"
            onClick={() => onSelectDrone(drone)}
            onMouseEnter={(e) => {
              onSetHoverImg(`${imgsrc}/${drone.id}.png`);
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 10px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              onSetHoverImg('null');
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow =
                '0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)';
            }}
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
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DroneList;
