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
      className={`transition-all relative rounded-xl overflow-hidden shadow-lg cursor-pointer ${className}`}
      style={{
        backgroundColor: selected ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,1)",
        border: "1px solid rgba(255,255,255,0.3)",
        boxShadow: selected
          ? "0 8px 24px rgba(0,0,0,0.15)"
          : "0 4px 12px rgba(0,0,0,0.1)",
        backgroundImage: selected
          ? "linear-gradient(145deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))"
          : "linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
        transition: "background-color 0.25s ease, box-shadow 0.25s ease",
        padding: "0.75rem 1rem",
        WebkitBackfaceVisibility: 'hidden',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = "scale(1.02)";
        el.style.boxShadow = "0 12px 28px rgba(0,0,0,0.2)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = "scale(1)";
        el.style.boxShadow = selected
          ? "0 8px 24px rgba(0,0,0,0.15)"
          : "0 4px 12px rgba(0,0,0,0.1)";
      }}
    >
      {children}
    </div>
  );
}