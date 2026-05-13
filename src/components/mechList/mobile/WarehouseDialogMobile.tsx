import React, { useState } from 'react';
import { Dialog, DialogContent } from '../../radix-ui/dialog';
import { BOXES, FACTION_COLORS, FACTION_NAMES, FactionType } from '../../../data/types';
import { BACKGROUND_SRC } from '../../../data/resource';
import { COLOR_GREY } from '../../../styles/color';

interface WarehouseDialogMobileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventory: Record<number, number>;
  onUpdateInventory: (inventory: Record<number, number>) => void;
  inventoryMode: boolean;
  setInventoryMode: (mode: boolean) => void;
  translations: any;
  lang: string;
  boxCoverSrc: string;
}

type FilterType = FactionType | 'ALL';

const ALL_FACTIONS: FilterType[] = ['ALL', 'RDL', 'UN', 'GOF', 'PD', 'COLLABORATION'];

export const WarehouseDialogMobile: React.FC<WarehouseDialogMobileProps> = ({
  open, onOpenChange, inventory, onUpdateInventory,
  inventoryMode, setInventoryMode, translations, lang, boxCoverSrc,
}) => {
  const [filterFaction, setFilterFaction] = useState<FilterType>('ALL');

  const getBoxCount = (boxId: number) => inventory?.[boxId] || 0;

  const handleUpdateInventory = (boxId: number, delta: number) => {
    const current = inventory?.[boxId] || 0;
    const next = Math.max(0, current + delta);
    onUpdateInventory({ ...inventory, [boxId]: next });
  };

  const factions = ALL_FACTIONS.filter(f => f !== 'ALL') as FactionType[];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{
          maxWidth: '95vw',
          width: '95vw',
          height: '90dvh',
          padding: 0,
          overflow: 'hidden',
          border: '0.1vh solid rgba(255,255,255,0.1)',
          backgroundColor: 'transparent',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 白色边栏区域（顶部标题 + 阵营导航 + 底部切换） */}
        <div style={{
          flexShrink: 0,
          backgroundColor: '#ffffff',
          borderBottom: '0.1vh solid #eaeaea',
          zIndex: 10,
        }}>
          {/* 标题区域 */}
          <div style={{ padding: '2vh 3vw 1vh' }}>
            <h2 style={{ color: '#1a1a1a', fontSize: '2.4vh', fontWeight: 800, letterSpacing: '-0.02em' }}>
              {translations.t112}
            </h2>
            <p style={{ color: '#888', fontSize: '1.3vh', marginTop: '0.4vh', lineHeight: '1.4' }}>
              {translations.t113}
            </p>
          </div>

          {/* 阵营导航（横向滚动，仿桌面端 dot 指示器风格） */}
          <div style={{
            display: 'flex',
            gap: '1vw',
            padding: '1vh 3vw 1.5vh',
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}>
            {/* ALL 按钮 */}
            <button
              onClick={() => setFilterFaction('ALL')}
              style={{
                padding: '0.8vh 2.5vw',
                textAlign: 'left',
                fontSize: '1.4vh',
                fontWeight: filterFaction === 'ALL' ? 700 : 500,
                borderRadius: '0.8vh',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: filterFaction === 'ALL' ? '#f5f5f7' : 'transparent',
                color: filterFaction === 'ALL' ? '#000' : '#666',
                flexShrink: 0,
                transition: 'background-color 0.2s, color 0.2s',
              }}
            >
              {translations.t114}
            </button>

            {factions.map(f => {
              const isSelected = filterFaction === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilterFaction(f)}
                  style={{
                    padding: '0.8vh 2vw',
                    fontSize: '1.4vh',
                    fontWeight: isSelected ? 700 : 500,
                    borderRadius: '0.8vh',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5vw',
                    backgroundColor: isSelected ? `${FACTION_COLORS[f]}12` : 'transparent',
                    color: isSelected ? FACTION_COLORS[f] : '#666',
                    flexShrink: 0,
                    boxShadow: isSelected
                      ? `0 0.6vh 1.5vh ${FACTION_COLORS[f]}15`
                      : 'none',
                    transition: 'background-color 0.2s, color 0.2s, box-shadow 0.2s',
                  }}
                >
                  <div style={{
                    width: '0.7vh',
                    height: '0.7vh',
                    borderRadius: '50%',
                    backgroundColor: isSelected ? FACTION_COLORS[f] : '#d1d1d6',
                    boxShadow: isSelected ? `0 0 0.8vh ${FACTION_COLORS[f]}` : 'none',
                    transition: 'all 0.2s',
                  }} />
                  {FACTION_NAMES.zh[f as keyof typeof FACTION_NAMES.zh] || f}
                </button>
              );
            })}
          </div>
        </div>

        {/* 内容区域（背景图 + backdrop-filter） */}
        <div style={{
          flex: 1,
          position: 'relative',
          backgroundImage: `url(${BACKGROUND_SRC[lang]}/background2.svg)`,
          backdropFilter: 'blur(1.6vh)',
          WebkitBackdropFilter: 'blur(1.6vh)',
          overflow: 'hidden',
        }}>
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '2vh 3vw',
            height: '100%',
          }}>
            {factions
              .filter(f => filterFaction === 'ALL' || filterFaction === f)
              .map((faction) => {
                const factionBoxes = Object.values(BOXES).filter(box =>
                  box.faction.includes(faction) && box.id !== 0
                );
                if (factionBoxes.length === 0) return null;

                return (
                  <div key={faction} style={{ marginBottom: '3vh' }}>
                    <h3 style={{
                      fontSize: '1.6vh',
                      fontWeight: 800,
                      color: FACTION_COLORS[faction],
                      marginBottom: '1.5vh',
                      paddingBottom: '0.5vh',
                      borderBottom: `0.2vh solid ${FACTION_COLORS[faction]}22`,
                    }}>
                      {FACTION_NAMES.zh[faction as keyof typeof FACTION_NAMES.zh] || faction}
                    </h3>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '2vw',
                    }}>
                      {factionBoxes.map((box) => (
                        <div
                          key={box.id}
                          style={{
                            borderRadius: '1.2vh',
                            border: '0.1vh solid #e5e7eb',
                            position: 'relative',
                            overflow: 'hidden',
                            backgroundColor: '#f3f4f6',
                            aspectRatio: '16/10',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            padding: '1.5vh',
                          }}
                        >
                          {box.hasImage ? (
                            <img
                              src={`${boxCoverSrc}/${box.id}.webp`}
                              alt={box.name[lang]}
                              loading="lazy"
                              style={{
                                position: 'absolute',
                                inset: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                zIndex: 0,
                              }}
                            />
                          ) : (
                            <div style={{
                              position: 'absolute',
                              inset: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#e5e7eb',
                              color: '#9ca3af',
                              fontSize: '1.4vh',
                              fontWeight: 600,
                              zIndex: 0,
                            }}>
                              {translations.t108}
                            </div>
                          )}

                          {/* 渐变遮罩 — 完全仿照桌面端 */}
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
                            zIndex: 1,
                          }} />

                          {/* 内容 */}
                          <div style={{
                            position: 'relative',
                            zIndex: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                          }}>
                            <div style={{ color: 'white', maxWidth: '60%' }}>
                              <div style={{
                                fontSize: '1.6vh',
                                fontWeight: 'bold',
                                textShadow: '0 0.2vh 0.4vh rgba(0,0,0,0.5)',
                              }}>
                                {box.name[lang]}
                              </div>
                              <div style={{
                                fontSize: '1.1vh',
                                opacity: 0.8,
                                textTransform: 'uppercase',
                              }}>
                                {box.name.en}
                              </div>
                            </div>

                            {/* 玻璃质感计数器 — 完全仿照桌面端 */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '1.5vw',
                              backgroundColor: 'rgba(255, 255, 255, 0.25)',
                              backdropFilter: 'blur(1.2vh)',
                              WebkitBackdropFilter: 'blur(1.2vh)',
                              padding: '0.6vh 2vw',
                              borderRadius: '1.2vh',
                              border: '0.1vh solid rgba(255, 255, 255, 0.3)',
                              boxShadow: '0 0.4vh 1.2vh rgba(0,0,0,0.2)',
                              position: 'relative',
                              zIndex: 5,
                            }}>
                              <button
                                onClick={() => handleUpdateInventory(box.id, -1)}
                                style={{
                                  border: 'none',
                                  background: 'none',
                                  cursor: 'pointer',
                                  fontSize: '2vh',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: 0,
                                }}
                              >
                                -
                              </button>
                              <span style={{
                                fontSize: '1.8vh',
                                fontWeight: 900,
                                minWidth: '2.5vh',
                                textAlign: 'center',
                                color: 'white',
                                textShadow: '0 0.1vh 0.2vh rgba(0,0,0,0.3)',
                              }}>
                                {getBoxCount(box.id)}
                              </span>
                              <button
                                onClick={() => handleUpdateInventory(box.id, 1)}
                                style={{
                                  border: 'none',
                                  background: 'none',
                                  cursor: 'pointer',
                                  fontSize: '2vh',
                                  color: FACTION_COLORS[faction],
                                  fontWeight: 'bold',
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: 0,
                                }}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* 底部模式切换 — 仿照桌面端卡片感 */}
        <div style={{
          flexShrink: 0,
          backgroundColor: '#ffffff',
          borderTop: '0.1vh solid #eaeaea',
          padding: '1.5vh 3vw',
        }}>
          <div style={{
            padding: '1.5vh 2vw',
            background: '#f9f9fb',
            borderRadius: '1.5vh',
            border: '0.1vh solid #f0f0f2',
          }}>
            <div style={{
              fontSize: '1.1vh',
              color: '#999',
              fontWeight: 700,
              marginBottom: '1vh',
              letterSpacing: '0.05em',
            }}>
              {translations.t115}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{
                fontSize: '1.2vh',
                color: inventoryMode ? '#999' : '#333',
                fontWeight: inventoryMode ? 400 : 600,
              }}>
                {translations.t117}
              </span>
              <div
                onClick={() => setInventoryMode(!inventoryMode)}
                style={{
                  width: '4.2vh',
                  height: '2.4vh',
                  backgroundColor: inventoryMode ? COLOR_GREY : '#e5e5ea',
                  borderRadius: '1.2vh',
                  padding: '0.3vh',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                  transition: 'background-color 0.3s',
                }}
              >
                <div style={{
                  width: '1.8vh',
                  height: '1.8vh',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  position: 'absolute',
                  left: inventoryMode ? 'calc(100% - 2.1vh)' : '0.3vh',
                  boxShadow: '0 0.2vh 0.4vh rgba(0,0,0,0.15)',
                  transition: 'left 0.25s ease',
                }} />
              </div>
              <span style={{
                fontSize: '1.2vh',
                color: inventoryMode ? '#888' : '#999',
                fontWeight: inventoryMode ? 600 : 400,
              }}>
                {translations.t116}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};