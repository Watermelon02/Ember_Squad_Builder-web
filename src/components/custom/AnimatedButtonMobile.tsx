import * as React from "react";
import { motion } from "framer-motion";
import { COLOR_GREY, COLOR_TEXT_GREY, COLOR_WHITE } from "../../styles/color";

interface AnimatedButtonMobileProps {
  onClick: () => void | Promise<void>;
  icon?: React.ReactNode;
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode; // 支持传 loader 或自定义内容
  fontSize?: string | number;
}

export const AnimatedButtonMobile: React.FC<AnimatedButtonMobileProps> = ({
  onClick,
  icon,
  label,
  loading = false,
  disabled = false,
  style,
  children,
  fontSize,
}) => {
  const [hover, setHover] = React.useState(false);

  return (
    <motion.button
      className="flex-1 items-center justify-center p-2 shadow-md backdrop-blur-md border border-white/20"
      style={{
        borderRadius: "1vw",
        fontSize: fontSize ?? "0.875rem",
        gap: 8,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.6 : 1,
        backgroundColor: hover ? COLOR_GREY : COLOR_WHITE,
        color: hover ? COLOR_WHITE : COLOR_TEXT_GREY,
        transition: "all 0.25s ease",
        ...style,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={disabled || loading ? undefined : onClick}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
    >
      {children ? (
        children
      ) : loading ? (
        <span>Loading...</span>
      ) : (
        <>
          {icon} {label}
        </>
      )}
    </motion.button>
  );
};
