import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface SlidePanelProps {
  collapsed: boolean;
  onClose: () => void;
  position: 'left' | 'right';
  width?: string | number;
  height?: string | number;
  children: React.ReactNode;
}

export const SlidePanel: React.FC<SlidePanelProps> = ({
  collapsed,
  onClose,
  position,
  width = '22vw',
  height = '100%',
  children
}) => {
  const isLeft = position === 'left';
  return (
    <AnimatePresence>
      {!collapsed && (
        <motion.div
          className="fixed inset-0 z-50 flex"
          style={{ willChange: 'transform',justifyContent: isLeft ? 'flex-start' : 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' }}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-background shadow-lg flex flex-col"
            style={{ width, height }}
            onClick={(e) => e.stopPropagation()}
            initial={{ x: isLeft ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isLeft ? '-100%' : '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div
              className="flex-1 overflow-y-auto p-4"

            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
