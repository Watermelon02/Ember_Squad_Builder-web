import React, { useState } from "react";

interface SelectableCardProps {
  children: React.ReactNode;
  selected: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * 可点击选中变灰的卡片组件
 */
export function SelectableCard({
  children,
  selected,
  onClick,
  className = "",
}: SelectableCardProps) {
  return (
    <div
      className={`transition relative rounded-lg overflow-hidden shadow-sm cursor-pointer hover:bg-accent/50 ${className}`}
      style={{
        backgroundColor: selected ? "lightgray" : undefined, // 只改变背景色
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}