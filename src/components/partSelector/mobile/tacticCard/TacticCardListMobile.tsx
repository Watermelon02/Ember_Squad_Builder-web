import React, { useState } from 'react';
import { Card } from '../../../radix-ui/card';
import { Badge } from '../../../radix-ui/badge';
import { SelectableCard } from '../../../custom/SelectableCard';

interface TacticCardListMobileProps {
  filteredTacticCards: any[];
  onSelectTacticCard: (card: any) => void;
  onSetHoverImg: (src: string) => void;
  imgsrc: string;
}

const TacticCardListMobile: React.FC<TacticCardListMobileProps> = ({
  filteredTacticCards,
  onSelectTacticCard,
  onSetHoverImg,
  imgsrc,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 取消选中
  const resetSelection = () => setSelectedId(null);
  return (
    <div className="min-h-0 flex flex-col">
      <div
        className="flex-1 overflow-y-auto"
        style={{ paddingLeft: '2vw', paddingRight: '2vw' }}
      >
        <div className="grid grid-cols-2 gap-2">
          {filteredTacticCards.map((tacticCard) => (
            <SelectableCard
              key={tacticCard.id}
              className="relative cursor-pointer hover:bg-accent/50 transition shadow-sm overflow-hidden"
              onClick={() => { onSelectTacticCard(tacticCard); setSelectedId(tacticCard.id) }}
              selected={selectedId === tacticCard.id} // 由父组件控制选中状态
            >
              {/* 图片容器 */}
              <div className="relative flex justify-center items-center h-[200px] w-full">
                <img
                  src={`${imgsrc}/${tacticCard.id}.png`}
                  alt={tacticCard.name}
                  className="max-h-full w-auto pointer-events-none transition-transform duration-300"
                  loading="lazy"
                />

                {/* 徽章固定在图片左下 */}
                <div className="absolute bottom-0 left-0">
                  <Badge variant="outline">{tacticCard.score}</Badge>
                </div>
              </div>
            </SelectableCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TacticCardListMobile;
