import React from 'react';
import { motion } from 'framer-motion';
import { TabsList, TabsTrigger } from '@radix-ui/react-tabs';

interface ViewModeTabListProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  tabs: {
    key: string;
    label: string;
    onClick?: () => void;
  }[];
  height?: string | number;
  style?: React.CSSProperties;
}

export const ViewModeTabList: React.FC<ViewModeTabListProps> = ({
  currentTab,
  setCurrentTab,
  tabs,
  height = '4vh',
  style,
}) => {
  return (
    <TabsList
      className="relative flex p-1"
      style={{
        backgroundColor: 'rgba(31,41,55,0.5)',
        borderRadius: '6px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        backdropFilter: 'blur(6px)',
        height,
        ...style,
      }}
    >
      {tabs.map(tab => (
        <TabsTrigger
          key={tab.key}
          value={tab.key}
          onClick={() => {
            setCurrentTab(tab.key);
            tab.onClick?.();
          }}
          style={{
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  color: currentTab === tab.key ? '#aaaaaa' : 'rgba(255,255,255,0.65)',
  fontWeight: 500,
  fontSize: typeof height === 'number' ? `${height * 0.4}px` : `calc(${height} * 0.4)`,
  borderRadius: '4px',
  transition: 'color 0.2s ease',
  zIndex: 1,
  overflow: 'hidden',
}}

        >
          {tab.label}
          {currentTab === tab.key && (
            <motion.div
              layoutId="tabIndicator"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '4px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.05))',
                boxShadow: '0 0 10px rgba(255,255,255,0.3)',
                backdropFilter: 'blur(4px)',
                zIndex: -1,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
