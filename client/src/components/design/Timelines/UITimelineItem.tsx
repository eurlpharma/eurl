/* 
{
    "status": "تم استلام الشحنة",
    "location": "الجزائر العاصمة - مركز بئر خادم",
    "timestamp": "2025-07-08T10:00:00Z"
  },*/

import clsx from "clsx";
import moment from "moment";
import { CSSProperties, FC, HTMLAttributes, ReactNode } from "react";

interface UITimelineItemProps extends HTMLAttributes<HTMLElement> {
  startContent?: ReactNode;
  endContent?: ReactNode;
  statusContent?: ReactNode;
  title?: string;
  date?: string;
  description?: string;
  color?:
    | "current"
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "grey";
  isCurrent?: "current" | "progress" | "completed" | "rejected" | "canclled";
  isComplete?: "current" | "progress" | "completed" | "rejected" | "canclled";
}

const colorMap: Record<string, string> = {
  current: "#9d9d9d80",
  primary: "#006fee",
  secondary: "#8E33FF",
  info: "#00B8D9",
  success: "#22C55E",
  warning: "#FFAB00",
  error: "#FF5630",
  grey: "#1C252E",
};

const UITimelineItem: FC<UITimelineItemProps> = ({
  startContent,
  endContent,
  title,
  date,
  description,
  color = "current",
  style,
  isCurrent,
  isComplete,
  ...props
}) => {
  const getDotStyles = (): CSSProperties => {
    switch (isCurrent) {
      case "progress":
        return {
          backgroundColor: colorMap["primary"],
        };
      case "completed":
        return {
          backgroundColor: colorMap["success"],
        };
      case "canclled":
        return {
          backgroundColor: colorMap["error"],
        };
      case "rejected":
        return {
          backgroundColor: colorMap["warning"],
        };
      default: {
        return {
          backgroundColor: colorMap["current"],
        };
      }
    }
  };

  const getStyles = (): CSSProperties => {
    switch (isComplete) {
      case "progress":
        return {
          backgroundColor: colorMap["primary"],
        };
      case "completed":
        return {
          backgroundColor: colorMap["success"],
        };
      case "canclled":
        return {
          backgroundColor: colorMap["error"],
        };
      case "rejected":
        return {
          backgroundColor: colorMap["warning"],
        };
      default: {
        return {
          backgroundColor: colorMap["current"],
        };
      }
    }
  };

  return (
    <div
      className={clsx(
        "relative flex gap-3 items-stretch transition-height min-h-0",
        "py-2 px-3 my-1 w-fit rounded-lg duration-500 max-h-full "
      )}
      {...props}
    >
      <div className="relative w-4 font-public-sans">
        <div
          className={clsx(
            "relative z-10 w-2.5 h-2.5 rounded-full",
            "mx-auto mt-1 transition-background duration-500"
          )}
          style={{
            ...getDotStyles(),
            ...style,
          }}
        ></div>
        <div
          className={clsx(
            "absolute left-1/2 bottom-0 w-0.5 rounded-full",
            "z-0 h-[calc(100%-20px)] top-5 transition-background",
            "-translate-x-1/2 transition-height duration-300"
          )}
          style={{
            ...getStyles(),
            ...style,
          }}
        ></div>
      </div>

      <div className="flex flex-col justify-center">
        {title && <p className="text-sm">{title}</p>}
        {date && (
          <p className="text-tiny text-[#919EAB] font-barlow">
            {moment(date).format("YYYY-MM-DD HH:mm:ss")}
          </p>
        )}
        {description && <p className="p-2 text-sm">{description}</p>}
      </div>
    </div>
  );
};

export default UITimelineItem;
