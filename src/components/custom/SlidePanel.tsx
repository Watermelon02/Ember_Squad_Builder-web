import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface SlidePanelProps {
  collapsed: boolean;
  onClose: () => void;
  position: 'left' | 'right';
  width?: string | number;
  height?: string | number;
  children: React.ReactNode;
  className?: string; // 外部 className
  panelBgColor?: string; // 新增：面板背景色
}

export const SlidePanel: React.FC<SlidePanelProps> = ({
  collapsed,
  onClose,
  position,
  width = '22vw',
  height = '100%',
  children,
  className = '',
  panelBgColor = '#ffffff'
}) => {
  const isLeft = position === 'left';
  return (
    <AnimatePresence>
      {!collapsed && (
        <motion.div
          className={`fixed inset-0 z-50 flex ${className}`}
          style={{
            willChange: 'transform',
            justifyContent: isLeft ? 'flex-start' : 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.3)', // 遮罩颜色保持不变
          }}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="shadow-lg flex flex-col"
            style={{
              width,
              height,
              backgroundColor: panelBgColor || undefined, // 使用外部传入颜色
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 overflow-y-auto p-4">
              {children}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
