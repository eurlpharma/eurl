import clsx from "clsx";
import { FC, HTMLAttributes } from "react";

interface UIProgressProps extends HTMLAttributes<HTMLDivElement> {
  progress: number; // قيمة بين 0 - 100
  radius?: "sm" | "md" | "lg" | "full" | "none";
  size?: "sm" | "md" | "lg";
  variant?: "filled" | "outlined" | "soft";
  color?:
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "grey";
  showPercentage?: boolean;
}

const radiusClasses = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
  none: "rounded-none",
};

const heightMap = {
  sm: "h-1.5",
  md: "h-2",
  lg: "h-2.5",
};

const colorClasses: Record<string, string> = {
  primary: "#00A76F",
  secondary: "#8E33FF",
  info: "#00B8D9",
  success: "#22C55E",
  warning: "#FFAB00",
  error: "#FF5630",
  grey: "#1C252E",
};

const UIProgress: FC<UIProgressProps> = ({
  progress,
  radius = "md",
  size = "md",
  color = "info",
  variant = "filled",
  className,
  style,
  showPercentage = false,
  ...props
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const baseColor = colorClasses[color];

  const getWrapperStyles = () => {
    switch (variant) {
      case "outlined":
        return {
          backgroundColor: "transparent",
          border: `1px solid ${baseColor}`,
        };
      case "soft":
        return {
          backgroundColor: `${baseColor}33`,
        };
      default: // "filled"
        return {
          backgroundColor: "#E5E7EB", // gray-200
        };
    }
  };

  return (
    <div
      className={clsx(
        "relative w-full overflow-hidden",
        radiusClasses[radius],
        heightMap[size],
        className
      )}
      style={{
        ...getWrapperStyles(),
        ...style,
      }}
      {...props}
    >
      <div
        className="absolute top-0 left-0 h-full transition-all duration-300"
        style={{
          width: `${clampedProgress}%`,
          backgroundColor:
            variant === "outlined" ? "transparent" : baseColor,
        }}
      />
      {showPercentage && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white z-10">
          {clampedProgress}%
        </span>
      )}
    </div>
  );
};

export default UIProgress;
