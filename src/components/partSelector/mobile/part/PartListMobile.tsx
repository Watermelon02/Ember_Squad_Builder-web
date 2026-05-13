import React, { useState, useCallback } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import { Card } from '../../../radix-ui/card';
import { Badge } from '../../../radix-ui/badge';
import { SelectableCardMobile } from '../../../custom/SelectableCardMobile';

interface PartListMobileProps {
  filteredParts: any[];
  onSelectPart: (part: any) => void;
  tabsrc: string;
  translations: any;
  lastScore: number;
  selectedPartType: string;
  faction: string | undefined;
  remainingCounts?: Record<string, number>;
  inventoryMode?: boolean;
}

const MemoizedPartCard = React.memo(({
  part,
  isSelected,
  onSelect,
  tabsrc,
  translations,
  lastScore,
  faction,
  remainingCount,
  inventoryMode,
}: any) => {
  const isOutOfStock = inventoryMode && remainingCount != null && remainingCount <= 0;

  return (
    <SelectableCardMobile
      className={`relative p-2 h-full cursor-pointer transition overflow-hidden shadow-sm flex flex-col ${isOutOfStock ? 'opacity-60 grayscale' : 'hover:bg-accent/50'}`}
      selected={isSelected}
      onClick={() => {
        if (inventoryMode && isOutOfStock && isSelected) return;
        onSelect(part);
      }}
      style={isOutOfStock ? { filter: 'grayscale(100%)', cursor: 'not-allowed', backgroundColor: '#f3f4f6' } : undefined}
    >
      {/* 与实体卡面相比，进行过属性修改*/}
      {part.isCardModified && (
        <div
          className="group"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '28px 28px 0 0',
            borderColor: '#FACC15 transparent transparent transparent',
            zIndex: 10,
          }}
        >
          <svg
            width="2vh"
            height="2vh"
            viewBox="0 0 24 24"
            fill="white"
            style={{ position: 'absolute', top: -26, left: 2 }}
          >
            <path d="M13.586 3.586a2 2 0 1 1 2.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793 3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </div>
      )}
      {(faction && faction === "GOF") || (part.hasImage === undefined || part.hasImage) ? (
        <img
          src={`${tabsrc}/${part.id}.webp`}
          alt=""
          className="absolute right-0 top-0 w-auto h-full max-w-[80%] object-contain pointer-events-none"
          style={{ opacity: isOutOfStock ? 0.2 : 0.8 }}
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
          <h4 className={`font-medium text-sm line-clamp-2 ${isOutOfStock ? 'line-through text-muted-foreground' : ''}`}>{part.name}</h4>
        </div>

        {/* 属性 */}
        <div className="flex flex-wrap items-center gap-1 mt-auto">

          {inventoryMode && remainingCount != null && (
            <div className="flex flex-col items-center px-1 py-0.5 border rounded-md bg-background/50 shadow-sm">
              <div className="flex items-center gap-1">
                <div style={{ fontSize: '8px', color: 'var(--muted-foreground)' }}>
                  {translations.t111}
                </div>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: remainingCount <= 0 ? '#ef4444' : 'inherit' }}>
                {remainingCount <= 0 ? translations.t94 : `x${remainingCount}`}
              </div>
            </div>
          )}
          {(part.armor !== 0 || part.structure !== 0) && (
            <div className="flex flex-col items-center px-1 py-0.5 border rounded-md bg-background/50 shadow-sm">
              <div className="flex items-center gap-1">

                <div style={{ fontSize: '8px', color: 'var(--muted-foreground)' }}>
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
                    src={`${tabsrc}/${attr.icon}.webp`}
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

        {/* 标签 */}
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
    </SelectableCardMobile>
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
  remainingCounts,
  inventoryMode,
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
    <div key={selectedPartType} style={{ height: '100%' }}>
      <VirtuosoGrid
        data={filteredParts}
        overscan={500}
        components={{
          List: React.forwardRef(({ style, children, ...props }, ref) => (
            <div
              ref={ref}
              {...props}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                padding: '10px 1vw',
                ...style,
              }}
            >
              {children}
            </div>
          )),
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
            remainingCount={remainingCounts?.[part.id]}
            inventoryMode={inventoryMode}
          />
        )}
      />
    </div>
  );
};

export default PartListMobile;