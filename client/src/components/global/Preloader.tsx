import clsx from "clsx";

const Preloader = () => {
  return (
    <div className="w-screen h-screen fixed top-0 left-0 z-[1000000] bg-[#fdfdfd] flex items-center justify-center">
      <div className="loader-inner">
        <div
          className={clsx(
            "loader-text uppercase select-none",
            "font-semibold text-6xl p-6 tracking-[1px]",
            "text-transparent bg-clip-text animate-loading-effect"
          )}
        >
          loading...
        </div>
      </div>
    </div>
  );
};

export default Preloader;
