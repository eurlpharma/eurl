import clsx from "clsx";
import { useTranslation } from "react-i18next";

const Preloader = () => {

  const { t } = useTranslation()

  return (
    <div className="w-screen h-screen fixed top-0 left-0 z-[1000000] bg-[#fdfdfd] flex items-center justify-center">
      <div className="loader-inner">
        <div
          className={clsx(
            "loader-text uppercase select-none",
            "font-semibold text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl p-6 tracking-[1px]",
            "text-transparent bg-clip-text animate-loading-effect"
          )}
        >
          {t("common.loading")}
        </div>
      </div>
    </div>
  );
};

export default Preloader;
