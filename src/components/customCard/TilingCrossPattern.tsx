import React, { useMemo } from 'react';

interface TilingCrossPatternProps {
  zIndex?: number;
  opacity?: number;
}

export const TilingCrossPattern: React.FC<TilingCrossPatternProps> = ({ zIndex = 0, opacity = 0.15 }) => {
  // *** 核心修改参数 ***
  // 十字架的缩小比例
  const SHRINK_FACTOR = 1.5;
  // 原始十字架尺寸 (ViewBox单位): 长度 10, 粗细 2
  const ORIGINAL_CROSS_SIZE = 10;
  const ORIGINAL_THICKNESS = 2;

  // 新的十字架尺寸
  const newCrossSize = ORIGINAL_CROSS_SIZE / SHRINK_FACTOR; // ≈ 6.67
  const newThickness = ORIGINAL_THICKNESS / SHRINK_FACTOR; // ≈ 1.33
  const newHalfCrossSize = newCrossSize / 2; // ≈ 3.335
  const newHalfThickness = newThickness / 2; // ≈ 0.665
  // *********************
   
  const svgBackground = useMemo(() => {
    // 颜色
    const fill = "rgba(0, 0, 0, 0.2)"; 
    
    // SVG 坐标系逻辑 (ViewBox 0 0 45 90) - 保持不变 (间距保持 1.5 倍扩大后的尺寸)
    const VIEWBOX_WIDTH = 45;
    const VIEWBOX_HEIGHT = 90;

    // 中心坐标 - 保持不变
    const center1 = { x: VIEWBOX_WIDTH / 2, y: VIEWBOX_WIDTH / 2 }; // (22.5, 22.5)
    const center2_1 = { x: 0, y: VIEWBOX_HEIGHT * 3 / 4 }; // (0, 67.5)
    const center2_2 = { x: VIEWBOX_WIDTH, y: VIEWBOX_HEIGHT * 3 / 4 }; // (45, 67.5)
    
    // --------------------------------------------------------------------------------
    // 计算矩形起始点，确保以中心点为中心
    // 垂直线: X = 中心 X - 半粗 | Y = 中心 Y - 半长 | Width = 粗细 | Height = 长度
    // 水平线: X = 中心 X - 半长 | Y = 中心 Y - 半粗 | Width = 长度 | Height = 粗细
    // --------------------------------------------------------------------------------
    
    // ### 第一行中心 (22.5, 22.5)
    const row1 = `
      <rect 
        x="${center1.x - newHalfThickness}" 
        y="${center1.y - newHalfCrossSize}" 
        width="${newThickness}" 
        height="${newCrossSize}" 
        fill="${fill}" 
      />
      <rect 
        x="${center1.x - newHalfCrossSize}" 
        y="${center1.y - newHalfThickness}" 
        width="${newCrossSize}" 
        height="${newThickness}" 
        fill="${fill}" 
      />
    `;

    // ### 第二行中心 (0, 67.5) 和 (45, 67.5)
    const row2 = `
      <rect 
        x="${center2_1.x - newHalfThickness}" 
        y="${center2_1.y - newHalfCrossSize}" 
        width="${newThickness}" 
        height="${newCrossSize}" 
        fill="${fill}" 
      />
      <rect 
        x="${center2_1.x - newHalfCrossSize}" 
        y="${center2_1.y - newHalfThickness}" 
        width="${newCrossSize}" 
        height="${newThickness}" 
        fill="${fill}" 
      />
      
      <rect 
        x="${center2_2.x - newHalfThickness}" 
        y="${center2_2.y - newHalfCrossSize}" 
        width="${newThickness}" 
        height="${newCrossSize}" 
        fill="${fill}" 
      />
      <rect 
        x="${center2_2.x - newHalfCrossSize}" 
        y="${center2_2.y - newHalfThickness}" 
        width="${newCrossSize}" 
        height="${newThickness}" 
        fill="${fill}" 
      />
    `;

    const svgString = `
      <svg xmlns='http://www.w3.org/2000/svg' width='${VIEWBOX_WIDTH}' height='${VIEWBOX_HEIGHT}' viewBox='0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}'>
        ${row1}
        ${row2}
      </svg>
    `;

    // 将 SVG 转换为 Data URI
    return `url("data:image/svg+xml,${encodeURIComponent(svgString.trim().replace(/\s+/g, ' '))}")`;
  }, []); // 依赖项列表保持不变

  return (
    <div
      style={{
        position: 'absolute',
        top: '2vh',
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: zIndex,
        opacity: opacity,
        pointerEvents: 'none',
        backgroundImage: svgBackground,
        // 间距保持 1.5 倍扩大后的尺寸
        backgroundSize: '4.5vh 9vh', 
        backgroundRepeat: 'repeat',
      }}
    />
  );
};