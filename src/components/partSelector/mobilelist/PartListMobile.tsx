import React from 'react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';

interface PartListProps {
  filteredParts: any[];
  onSelectPart: (part: any) => void;
  onSetHoverImg: (src: string) => void;
  tabsrc: string;
  imgsrc: string;
  translations: any;
  lastScore: number;
  selectedPartType: string;
}

const PartList: React.FC<PartListProps> = ({
  filteredParts,
  onSelectPart,
  onSetHoverImg,
  tabsrc,
  imgsrc,
  translations,
  lastScore,
  selectedPartType,
}) => {
  return (
    <div
      key={selectedPartType}
      className="flex-1 overflow-y-auto space-y-3"
      style={{ paddingTop: '1vh', paddingLeft: '2vw', paddingRight: '2vw' }}
    >
      {filteredParts.map((part) => (
        <Card
          key={part.id}
          className="relative p-3 cursor-pointer hover:bg-accent/50 transition overflow-hidden shadow-sm"
          onClick={() => onSelectPart(part)}
          onMouseEnter={(e) => {
            onSetHoverImg(`${imgsrc}/${part.id}.png`);
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
          {/* 背景图 */}
          <img
            src={`${tabsrc}/${part.id}.png`}
            alt=""
            className="absolute right-0 top-0 w-auto h-full object-contain pointer-events-none"
            style={{ opacity: 0.8 }}
            loading="lazy"
          />

          {/* 内容 */}
          <div className="relative z-10 space-y-2">
            {/* 名称和分数 */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="shrink-0 relative">
                {part.score}
                {part.score !== lastScore && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 2,
                      fontSize: 8,
                      opacity: 0.5,
                    }}
                  >
                    {part.score > lastScore ? '▲' : '▼'}
                  </span>
                )}
              </Badge>
              <h4 className="font-medium truncate">{part.name}</h4>
            </div>

            {/* 属性 */}
            <div className="flex items-center gap-2">
              {(part.armor !== 0 || part.structure !== 0) && (
                <div className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm">
                  <div className="flex items-center gap-1">
                    <img
                      src={`${tabsrc}/icon_armor.png`}
                      alt="armor"
                      className="w-4 h-4"
                      loading="lazy"
                    />
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--muted-foreground)',
                      }}
                    >
                      {part.structure === 0
                        ? translations.t39
                        : `${translations.t39}/${translations.t40}`}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      color:
                        part.armor < 0 || part.structure < 0 ? 'red' : 'inherit',
                    }}
                  >
                    {part.structure === 0
                      ? part.armor
                      : `${part.armor} / ${part.structure}`}
                  </div>
                </div>
              )}

              {[
                { label: translations.t41, value: part.parray, icon: 'icon_parray' },
                {
                  label: translations.t42,
                  value: part.dodge,
                  icon: 'icon_dodge',
                  color: (() => {
                    const v = Math.min(Math.max(part.dodge, 1), 6);
                    const opacity = 0.2 + v * 0.08;
                    return `rgba(0,120,255,${opacity})`;
                  })(),
                },
                {
                  label: translations.t43,
                  value: part.electronic,
                  icon: 'icon_electronic',
                  color: (() => {
                    const v = Math.min(Math.max(part.electronic, 1), 6);
                    const opacity = 0.2 + v * 0.08;
                    return `rgba(255,180,0,${opacity})`;
                  })(),
                },
              ]
                .filter(attr => attr.value !== 0)
                .map(attr => (
                  <div
                    key={attr.label}
                    className="flex flex-col items-center px-1 py-0.5 border rounded-md shadow-sm"
                  >
                    <div className="flex items-center gap-1">
                      <img
                        src={`${tabsrc}/${attr.icon}.png`}
                        alt={attr.label}
                        className="w-4 h-4"
                        loading="lazy"
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

            {/* 描述 */}
            {part.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {part.description}
              </p>
            )}

            {/* 标签 */}
            {part.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {part.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Card>
      ))}

      {filteredParts.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          {translations.t44}
        </div>
      )}
    </div>
  );
};

export default PartList;
