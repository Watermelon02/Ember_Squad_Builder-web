import React from 'react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';

interface TacticCardListProps {
  filteredTacticCards: any[];
  onSelectTacticCard: (card: any) => void;
  onSetHoverImg: (src: string) => void;
  imgsrc: string;
}

const TacticCardList: React.FC<TacticCardListProps> = ({
  filteredTacticCards,
  onSelectTacticCard,
  onSetHoverImg,
  imgsrc,
}) => {
  return (
    <div className="min-h-0 flex flex-col">
      <div
        className="flex-1 overflow-y-auto"
        style={{  paddingLeft: '2vw', paddingRight: '2vw' }}
      >
        <div className="grid grid-cols-2 gap-2">
          {filteredTacticCards.map((tacticCard) => (
            <Card
              key={tacticCard.id}
              className="relative cursor-pointer hover:bg-accent/50 transition shadow-sm overflow-hidden"
              onClick={() => onSelectTacticCard(tacticCard)}
              onMouseEnter={(e) => {
                onSetHoverImg(`${imgsrc}/${tacticCard.id}.png`);
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
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TacticCardList;
