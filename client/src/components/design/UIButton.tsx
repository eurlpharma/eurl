import { ButtonBase } from "@mui/material";
import clsx from "clsx";
import { FC, HTMLAttributes, ReactNode, ElementType } from "react";

interface UIButtonProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  radius?: "sm" | "md" | "lg" | "full" | "none";
  size?: "sm" | "md" | "lg";
  variant?: "filled" | "outlined" | "soft" | "light" | "link";
  color?:
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "grey";
  isDisabled?: boolean;
  isLoading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  component?: ElementType;
  to?: string;
  href?: string;
}

const radiusClasses = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
  none: "rounded-none",
};

const sizeClasses = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-2.5 text-lg",
};

const colorMap: Record<string, string> = {
  primary: "#00A76F",
  secondary: "#8E33FF",
  info: "#00B8D9",
  success: "#22C55E",
  warning: "#FFAB00",
  error: "#FF5630",
  grey: "#1C252E",
};

const Spinner = ({ color }: { color: string }) => (
  <svg
    className="animate-spin h-5 w-5 mr-2"
    viewBox="0 0 24 24"
    style={{ color }}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

const UIButton: FC<UIButtonProps> = ({
  children,
  radius = "md",
  size = "md",
  variant = "filled",
  color = "info",
  className,
  isDisabled,
  isLoading,
  style,
  startIcon,
  endIcon,
  component,
  to,
  href,
  ...props
}) => {
  const baseColor = colorMap[color];

  const getStyles = (): React.CSSProperties => {
    switch (variant) {
      case "outlined":
        return {
          backgroundColor: "#fff",
          border: `1px solid ${baseColor}`,
          color: baseColor,
        };
      case "soft":
        return {
          backgroundColor: `${baseColor}1A`,
          border: `1px solid ${baseColor}1A`,
          color: baseColor,
        };
      case "light":
        return {
          backgroundColor: `${baseColor}0D`,
          border: `1px solid ${baseColor}0D`,
          color: baseColor,
        };
      case "link":
        return {
          backgroundColor: "transparent",
          color: baseColor,
          border: "1px solid transparent",
        };
      default:
        return {
          backgroundColor: baseColor,
          border: `1px solid ${baseColor}`,
          color: "#fff",
        };
    }
  };

  const hoverStyles = (): string => {
    switch (variant) {
      case "outlined":
        return "hover:bg-opacity-10 hover:bg-current";
      case "soft":
      case "light":
        return "hover:opacity-90";
      case "link":
        return "hover:bg-opacity-10 hover:bg-current";
      default:
        return "hover:brightness-110";
    }
  };

  const ComponentProps = {
    ...(component ? { component } : {}),
    ...(to ? { to } : {}),
    ...(href ? { href } : {}),
  };

  const isButtonDisabled = isDisabled || isLoading;

  return (
    <ButtonBase
      className={clsx(
        "font-public-sans inline-flex items-center justify-center font-medium transition-all duration-200",
        sizeClasses[size],
        radiusClasses[radius],
        isButtonDisabled && "opacity-50 pointer-events-none",
        hoverStyles(),
        className
      )}
      style={{
        ...getStyles(),
        ...style,
      }}
      disabled={isButtonDisabled}
      {...ComponentProps}
      {...props}
    >
      {isLoading ? (
        <Spinner color={variant === "filled" ? "#fff" : baseColor} />
      ) : (
        <>
          {startIcon && <span className="mr-2">{startIcon}</span>}
          <span>{children}</span>
          {endIcon && <span className="ml-2">{endIcon}</span>}
        </>
      )}
    </ButtonBase>
  );
};

export default UIButton;
