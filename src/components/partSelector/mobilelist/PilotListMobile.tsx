import React from 'react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';

interface PilotListProps {
  filteredPilots: any[];
  onSelectPilot: (pilot: any) => void;
  onSetHoverImg: (src: string) => void;
  tabsrc: string;
  imgsrc: string;
  translations: any;
  lastScore: number;
}

const PilotList: React.FC<PilotListProps> = ({
  filteredPilots,
  onSelectPilot,
  onSetHoverImg,
  tabsrc,
  imgsrc,
  translations,
  lastScore,
}) => {
  return (
    <div
      className="flex-1 overflow-y-auto space-y-3"
      style={{  paddingLeft: '2vw', paddingRight: '2vw'}}
    >
      {filteredPilots.map((pilot) => (
        <Card
          key={pilot.id}
          className="p-4 cursor-pointer hover:bg-accent/50 transition relative overflow-hidden shadow-sm"
          onClick={() => onSelectPilot(pilot)}
          onMouseEnter={(e) => {
            onSetHoverImg(`${imgsrc}/${pilot.id}.png`);
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
  src={`${tabsrc}/${pilot.id}.png`}
  alt=""
  className="absolute right-0 top-0 w-auto h-full object-contain pointer-events-none"
  style={{ opacity: 0.4 }}
  loading='lazy'
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
                  className="flex-1 flex flex-col items-center justify-center h-16 border rounded-md shadow-sm"
                >
                  <img
                    src={`${tabsrc}/${icon}.png`}
                    alt={icon}
                    width={30}
                    height={30}
                    className="object-contain"
                    loading="lazy"
                  />
                  <div className="text-[10px] mt-0.5">{value}</div>
                </div>
              ))}
            </div>

            {/* 特性描述 */}
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
        </Card>
      ))}

      {filteredPilots.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          {translations.t55}
        </div>
      )}
    </div>
  );
};

export default PilotList;
