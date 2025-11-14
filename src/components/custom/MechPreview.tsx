import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mech, Part } from '../../types';

interface MechPreviewProps {
  mech: { parts: Partial<Record<keyof Mech['parts'], Part>> };
  mechImgSrc: string;
  width?: string | number;
  height?: string | number;
  scaleOverrides?: Partial<Record<keyof Mech['parts'], number>>;
  cropLeftPercent?: number;
  defaultParts?: Partial<Record<keyof Mech['parts'], Part>>;
  //这里仅用来临时使用
  championMode: boolean;
  style?: React.CSSProperties;
}

// 不包含 backpack
const partOrder: (keyof Mech['parts'])[] = [
  'leftHand',
  'torso',
  'chasis',
  'rightHand',
];

export const MechPreview: React.FC<MechPreviewProps> = ({
  mech,
  mechImgSrc,
  width = '8rem',
  height = '8rem',
  scaleOverrides = {},
  cropLeftPercent = 0,
  defaultParts = {},
  championMode,
  style,

}) => {
  // 自动生成“替换历史”
  const replaceHistory = useMemo(() => {
    const list: string[] = [];
    partOrder.forEach((key) => {
      const real = mech.parts[key];
      const def = defaultParts[key];

      if (real && def && real.id !== def.id) {
        list.push(`${key}: ${def.name} → ${real.name}`);
      }
    });
    return list;
  }, [mech, defaultParts]);

  // READY 条件：torso、chasis存在，且至少有一只手存在
  const isReady = !!mech.parts.torso?.id &&
    !!mech.parts.chasis?.id &&
    (!!mech.parts.leftHand?.id || !!mech.parts.rightHand?.id);

  return (
    <motion.div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: '0.5rem',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 8px rgba(0,0,0,0.1)',
        ...style,
      }}
      transition={{ duration: 0.3 }}
    >
      {/* 零件图层（不显示 backpack） */}
      {partOrder.map((partKey) => {
        const isRealPart = !!mech.parts[partKey]?.id;
        const part = isRealPart ? mech.parts[partKey] : defaultParts[partKey];
        if (!part?.id) return null;

        const scale = scaleOverrides[partKey] ?? 1;
        const opacity = isRealPart ? 1 : 0.35;

        const initialPos = (() => {
          switch (partKey) {
            case 'torso': return { y: -20, opacity: 0 };
            case 'leftHand': return { x: 20, opacity: 0 };
            case 'rightHand': return { x: -20, opacity: 0 };
            case 'chasis': return { y: 20, opacity: 0 };
            default: return { opacity: 0 };
          }
        })();

        return (
          <AnimatePresence key={partKey} mode="wait">
            <motion.div
              key={part.id}
              style={{
                position: 'absolute',
                top: 0,
                left: `-${cropLeftPercent}%`,
                width: `${100 + cropLeftPercent}%`,
                height: '100%',
                overflow: 'hidden',
                pointerEvents: 'none',
              }}
              initial={{ ...initialPos, scale: 0.95 }}
              animate={{ x: 0, y: 0, opacity, scale }}
              exit={{ ...initialPos, scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img
                loading='lazy'
                src={`${mechImgSrc}/${part.id}.png`}
                alt={part.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  pointerEvents: 'none',
                  transformOrigin: 'center center',
                }}
              />
            </motion.div>
          </AnimatePresence>
        );
      })}

      {/* 左下角黑色小点（固定顺序） */}
     {/* 左下角部位状态块 */}
<div
  style={{
    position: 'absolute',
    top: '0.15rem',
    left: '0.15rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
    padding: '0.15rem 0.25rem',
    pointerEvents: 'none',
  }}
>
  {[
    { key: 'torso', label: 'T' },
    { key: 'chasis', label: 'C' },
    { key: 'leftHand', label: 'L' },
    { key: 'rightHand', label: 'R' },
    { key: 'backpack', label: 'B' },
  ].map(({ key, label }) => {
    const partKey = key as keyof Mech['parts'];
    const isReal = !!mech.parts[partKey]?.id;

    return (
      <div
        key={key}
        title={key} // 鼠标悬停显示部位名称
        style={{
          width: '0.5vh',
          height: '0.5vh',
          borderRadius: '0.15vw', // 圆角方块
          background: isReal ? '#9f9e9a' : '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '0.15rem',
          fontWeight: 'bold',
  
          pointerEvents: 'auto',
          cursor: 'default',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
      >

      </div>
    );
  })}
</div>




      {/* 历史记录（右下角），无背景 + 浮动动画 + 右对齐 */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '0.2rem',
          right: '0.2rem',
          fontSize: typeof height === 'number' ? `${height * 0.08}px` : `calc(${height} * 0.03)`,
          pointerEvents: 'none',
          maxWidth: '50%',
          textAlign: 'right',
          color: '#888888',
        }}
      >
        {championMode && <AnimatePresence>

          {replaceHistory.map((line) => (
            <motion.div
              key={line} // 每行文字作为 key，改变时会触发动画
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              style={{
                whiteSpace: 'pre-line',
                lineHeight: '1.2em',
                overflowWrap: 'break-word',
              }}
            >
              {line}
            </motion.div>
          ))}
        </AnimatePresence>}
      </motion.div>



      {/* READY（右上角） */}
      {isReady && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.25 } }}
          style={{
            position: 'absolute',
            top: '0.25rem',
            right: '0.25rem',
            color: '#888888',
            fontWeight: 'bold',
            fontSize: '0.35rem',
            pointerEvents: 'none',
          }}
        >
          READY
        </motion.div>
      )}

    </motion.div>
  );
};
