import React, { useState, useCallback } from 'react';
import { VirtuosoGrid } from 'react-virtuoso'; // 引入 VirtuosoGrid
import { Card } from '../../../radix-ui/card';
import { Badge } from '../../../radix-ui/badge';
import { SelectableCard } from '../../../custom/SelectableCard';

interface PartListMobileProps {
  filteredParts: any[];
  onSelectPart: (part: any) => void;
  tabsrc: string;
  translations: any;
  lastScore: number;
  selectedPartType: string;
  faction: string | undefined;
}

// 删除了容易导致点击失效的自定义比较函数
const MemoizedPartCard = React.memo(({
  part,
  isSelected,
  onSelect,
  tabsrc,
  translations,
  lastScore,
  faction
}: any) => {
  return (
    <SelectableCard
      // 增加 h-full 确保在网格中等高；适当缩小 padding 适应窄卡片
      className="relative p-2 h-full cursor-pointer hover:bg-accent/50 transition overflow-hidden shadow-sm flex flex-col"
      selected={isSelected}
      onClick={() => onSelect(part)}
    >
      {(faction && faction === "GOF") || (part.hasImage === undefined || part.hasImage) ? (
        <img
          src={`${tabsrc}/${part.id}.png`}
          alt=""
          className="absolute right-0 top-0 w-auto h-full max-w-[80%] object-contain pointer-events-none"
          style={{ opacity: 0.8 }}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span
          style={{
            display: "flex",
            position: "absolute",
            right: 0,
            padding: "1vh",
            bottom: 0,
            opacity: 0.8,
          }}
        >
          {translations.t108}
        </span>
      )}

      {/* 内容层 */}
      <div className="relative z-10 space-y-2 flex-1 flex flex-col">
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
          {/* 加入 line-clamp 避免名称过长破坏布局 */}
          <h4 className="font-medium text-sm line-clamp-2">{part.name}</h4>
        </div>

        {/* 属性 - 加上 flex-wrap，在一行显示不下时自动折行 */}
        <div className="flex flex-wrap items-center gap-1.5 mt-auto">
          {(part.armor !== 0 || part.structure !== 0) && (
            <div className="flex flex-col items-center px-1 py-0.5 border rounded-md bg-background/50 shadow-sm">
              <div className="flex items-center gap-1">
                <img
                  src={`${tabsrc}/icon_armor.png`}
                  alt="armor"
                  className="w-3 h-3"
                  loading="lazy"
                  decoding="async"
                />
                <div style={{ fontSize: '10px', color: 'var(--muted-foreground)' }}>
                  {part.structure === 0
                    ? translations.t39
                    : `${translations.t39}/${translations.t40}`}
                </div>
              </div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: part.armor < 0 || part.structure < 0 ? 'red' : 'inherit',
                }}
              >
                {part.structure === 0
                  ? part.armor
                  : `${part.armor}/${part.structure}`}
              </div>
            </div>
          )}

          {[
            { label: translations.t41, value: part.parray, icon: 'icon_parray' },
            {
              value: part.dodge,
              icon: 'icon_dodge',
              color: (() => {
                return `rgba(0,120,255)`;
              })(),
            },
            {
              value: part.electronic,
              icon: 'icon_electronic',
              color: (() => {
                return `rgba(255,180,0)`;
              })(),
            },
          ]
            .filter(attr => attr.value !== 0)
            .map(attr => (
              <div
                key={attr.label}
                className="flex flex-col items-center px-1 py-0.5 border rounded-md bg-background/50 shadow-sm"
              >
                <div className="flex items-center gap-1">
                  <img
                    src={`${tabsrc}/${attr.icon}.png`}
                    alt={attr.label}
                    className="w-3 h-3"
                    loading="lazy"
                    decoding="async"
                  />
                  <div style={{ fontSize: '10px', color: 'var(--muted-foreground)' }}>
                    {attr.label}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: attr.value < 0 ? 'red' : attr.color || 'inherit',
                  }}
                >
                  {attr.value}
                </div>
              </div>
            ))}
        </div>

        {/* 标签 - 同样允许换行 */}
        {part.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {part.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-1 py-0">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </SelectableCard>
  );
});

const PartListMobile: React.FC<PartListMobileProps> = ({
  filteredParts,
  onSelectPart,
  faction,
  tabsrc,
  translations,
  lastScore,
  selectedPartType,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = useCallback((part: any) => {
    onSelectPart(part);
    setSelectedId(part.id);
  }, [onSelectPart]);

  // 空状态处理
  if (filteredParts.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        {translations.t44}
      </div>
    );
  }

  return (
    <div key={selectedPartType} style={{ height: "60vh" }}>
      <VirtuosoGrid
        data={filteredParts}
        overscan={window.innerHeight * 0.8}
        components={{
          // 容器：使用 CSS Grid 定义一行两列
          List: React.forwardRef(({ style, children, ...props }, ref) => (
            <div
              ref={ref}
              {...props}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)', // 核心：一行分为同等的两列
                gap: '8px', // 卡片之间的间距
                padding: '10px 2vw',
                ...style,
              }}
            >
              {children}
            </div>
          )),
          // 列表项：确保高度拉伸以填满 Grid
          Item: ({ children, ...props }) => (
            <div {...props} style={{ display: 'flex', flexDirection: 'column' }}>
              {children}
            </div>
          )
        }}
        itemContent={(index, part) => (
          <MemoizedPartCard
            part={part}
            isSelected={selectedId === part.id}
            onSelect={handleSelect}
            tabsrc={tabsrc}
            translations={translations}
            lastScore={lastScore}
            faction={faction}
          />
        )}
      />
    </div>
  );
};

export default PartListMobile;