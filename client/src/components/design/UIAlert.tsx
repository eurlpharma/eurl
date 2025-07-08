import { Alert, AlertTitle } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import clsx from "clsx";

type ColorKey =
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "grey";

type Variant = "filled" | "outlined" | "soft" | "light";

type Position =
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center";

interface UIAlertProps {
  color?: ColorKey;
  variant?: Variant;
  title?: string;
  children?: React.ReactNode;
  autoHideDuration?: number; // milliseconds
  onClose?: () => void;
  position?: Position;
}

const colorMap: Record<ColorKey, string> = {
  primary: "#00A76F",
  secondary: "#8E33FF",
  info: "#00B8D9",
  success: "#22C55E",
  warning: "#FFAB00",
  error: "#FF5630",
  grey: "#1C252E",
};

const positionClasses: Record<Position, string> = {
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
};

const UIAlert: FC<UIAlertProps> = ({
  color = "info",
  variant = "filled",
  title,
  children,
  autoHideDuration = 5000,
  onClose,
  position = "top-right",
}) => {
  const baseColor = colorMap[color];
  const textColor = variant === "filled" ? "#fff" : baseColor;
  const backgroundColor = {
    filled: baseColor,
    soft: `${baseColor}1A`,
    outlined: "transparent",
    light: `${baseColor}0D`,
  }[variant];

  const border = `1px solid ${baseColor}`;

  const [progress, setProgress] = useState(100);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const step = 100 / (autoHideDuration / 100);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev - step;
        if (next <= 0) {
          clearInterval(intervalRef.current!);
          onClose?.();
          return 0;
        }
        return next;
      });
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoHideDuration, onClose]);

  return (
    <div
      className={clsx(
        "fixed z-50 min-w-[280px] max-w-[90%] md:max-w-md transition-all",
        positionClasses[position]
      )}
    >
      <Alert
        icon={false}
        style={{
          backgroundColor,
          color: textColor,
          border,
          padding: "12px 16px",
        }}
      >
        {title && (
          <AlertTitle style={{ color: textColor }}>{title}</AlertTitle>
        )}
        {children}
        {/* Progress Bar */}
        <div
          className="mt-2 h-1 rounded bg-gray-200 overflow-hidden"
          style={{ backgroundColor: `${baseColor}22` }}
        >
          <div
            className="h-full transition-all duration-100"
            style={{
              width: `${progress}%`,
              backgroundColor: baseColor,
            }}
          />
        </div>
      </Alert>
    </div>
  );
};

export default UIAlert;
