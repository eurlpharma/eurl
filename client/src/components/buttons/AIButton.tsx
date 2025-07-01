import clsx from "clsx";
import { ButtonHTMLAttributes, FC, ReactNode } from "react";
import { IconLoadingOne } from "../Iconify";

interface AIButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  startContent?: ReactNode | null;
  endContent?: ReactNode | null;
  children?: ReactNode | null;
  isIconOnly?: boolean;
  fullWidth?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  variant?: "solid" | "outlined" | "liner";
  radius?: "sm" | "md" | "lg" | "xl" | "full" | "none";
  className?: string;
}

const AIButton: FC<AIButtonProps> = ({
  startContent,
  endContent,
  children,
  isIconOnly,
  isLoading,
  isDisabled,
  fullWidth = false,
  variant = "solid",
  radius = "lg",
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(
        className,
        "flex items-center gap-1 justify-center",
        `rounded-${radius} px-3 py-2`,
        "transition duration-500 cursor-pointer select-none",
        variant === "solid" && "bg-girl-secondary text-girl-white",
        variant === "outlined" &&
          "border-1 border-solid border-girl-secondary hover:bg-girl-secondary text-girl-secondary hover:text-girl-white",
        variant === "liner" &&
          "border-0 border-transparent text-girl-secondary",
        fullWidth ? "w-full" : "w-fit",
        isDisabled && "cursor-not-allowed pointer-events-none opacity-80",
        isLoading && "cursor-wait opacity-80 pointer-events-none"
      )}
      {...props}
    >
      {isLoading ? (
        <IconLoadingOne />
      ) : (
        startContent && <span>{startContent}</span>
      )}
      {children}
      {isLoading && endContent && <span>{endContent}</span>}
    </button>
  );
};

export default AIButton;
