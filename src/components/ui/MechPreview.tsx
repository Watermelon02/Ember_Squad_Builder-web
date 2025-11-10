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
      <div
        style={{
          position: 'absolute',
          top: '0.15rem',
          left: '0.15rem',
          display: 'flex',
          gap: '0.2rem',
          padding: '0.15rem 0.25rem',
          pointerEvents: 'none',
        }}
      >
        {['torso', 'chasis', 'leftHand', 'rightHand', 'backpack'].map((key) => {
          const partKey = key as keyof Mech['parts'];
          const isReal = !!mech.parts[partKey]?.id;
          return (
            <div
              key={key}
              title={key}
              style={{
                width: '0.28rem',
                height: '0.28rem',
                borderRadius: '50%',
                background: isReal ? '#000000' : '#999',
              }}
            />
          );
        })}
      </div>

      {/* 历史记录（右下角），无背景 + 浮动动画 + 右对齐 */}
      {replaceHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.25 } }}
          style={{
            position: 'absolute',
            bottom: '0.2rem',
            right: '0.2rem',
            color: 'white',
            fontSize: '0.2rem',
            pointerEvents: 'none',
            maxWidth: '100%',
            whiteSpace: 'pre-line',
color: '#888888',
            lineHeight: '0.42rem',
            textAlign: 'right',
          }}
        >
          {replaceHistory.join('\n')}
        </motion.div>
      )}

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
