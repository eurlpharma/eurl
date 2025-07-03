import { useDispatch } from "react-redux";
import { showNotification, hideNotification } from "@/store/slices/uiSlice";
import { useCallback } from "react";

export const useNotification = () => {
  const dispatch = useDispatch();

  const notify = useCallback(
    (
      message: string,
      type: "success" | "error" | "info" | "warning" = "info",
      duration = 5000
    ) => {
      dispatch(showNotification({ message, type }));

      if (duration > 0) {
        setTimeout(() => {
          dispatch(hideNotification());
        }, duration);
      }
    },
    [dispatch]
  );

  const closeNotification = useCallback(() => {
    dispatch(hideNotification());
  }, [dispatch]);

  return {
    success: (message: string, duration?: number) =>
      notify(message, "success", duration),
    error: (message: string, duration?: number) =>
      notify(message, "error", duration),
    info: (message: string, duration?: number) =>
      notify(message, "info", duration),
    warning: (message: string, duration?: number) =>
      notify(message, "warning", duration),
    close: closeNotification,
  };
};
