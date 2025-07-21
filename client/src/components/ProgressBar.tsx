import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.1,
});

const ProgressBar = () => {
  const location = useLocation();

  useEffect(() => {
    NProgress.start();

    const finishProgress = () => {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(() => {
          NProgress.done();
        });
      } else {
        setTimeout(() => {
          NProgress.done();
        }, 300);
      }
    };

    if (document.readyState === "complete") {
      finishProgress();
    } else {
      window.addEventListener("load", finishProgress);
    }

    return () => {
      window.removeEventListener("load", finishProgress);
      NProgress.done();
    };
  }, [location.pathname]);

  return null;
};

export default ProgressBar;
