import { ButtonBase } from "@mui/material";
import clsx from "clsx";
import { FC, HTMLAttributes, ReactNode } from "react";

interface UIChipProps extends HTMLAttributes<HTMLElement> {
  className?: string;
  children?: ReactNode;
  isDisabled?: boolean;
  endContent?: ReactNode;
  startContent?: ReactNode;
  classNames?: {
    endContent?: string;
    startContent?: string;
    centerContent?: string;
  };
  size?: "sm" | "md" | "lg";
  variant?: "filled" | "outlined" | "soft";
  radius?: "sm" | "md" | "lg" | "full" | "none";
  color?:
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "grey";
}

const radiusClasses = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
  none: "rounded-none",
};

const sizeClassess = {
  sm: "22px",
  md: "28px",
  lg: "34px",
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

const UIChip: FC<UIChipProps> = ({
  variant = "filled",
  color = "info",
  startContent,
  endContent,
  children,
  isDisabled,
  size = "md",
  radius = "lg",
  className,
  classNames,
  style,
  ...props
}) => {
  const baseColor = colorClasses[color];
  const baseSize = sizeClassess[size];

  const getStyles = () => {
    switch (variant) {
      case "outlined":
        return {
          backgroundColor: "transparent",
          color: baseColor,
          height: baseSize,
          border: `1px solid ${baseColor}`,
        };
      case "soft":
        return {
          backgroundColor: `${baseColor}33`, //
          color: baseColor,
          height: baseSize,
        };
      default:
        return {
          backgroundColor: baseColor,
          height: baseSize,
          color: "#fff",
        };
    }
  };

  return (
    <ButtonBase
      className={clsx(
        className,
        "flex items-center select-none px-1",
        "py-1 text-[13px] font-public-sans",
        radiusClasses[radius],
        isDisabled && "opacity-50"
      )}
      style={{
        ...getStyles(),
        ...style,
      }}
      disabled={isDisabled}
      {...props}
    >
      {startContent && (
        <span className={classNames?.startContent}>{startContent}</span>
      )}
      <span className={classNames?.centerContent}>{children}</span>
      {endContent && (
        <span className={classNames?.endContent}>{endContent}</span>
      )}
    </ButtonBase>
  );
};

export default UIChip;
