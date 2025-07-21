import { FC, HTMLAttributes, useEffect, useState } from "react";
import bgImage from "../../assets/images/breadcrumb/shop-page.jpg";
import FloatingLeaf from "../hero/FloatingLeaf";
import { useTranslation } from "react-i18next";

const leafs = import.meta.glob("../../assets/images/leaf/*.png", {
  eager: false, // حملها فقط عند الطلب لاحقًا
  import: "default",
});

const loadLeafImages = async () => {
  const entries = await Promise.all(Object.values(leafs).map((fn) => fn()));
  return entries as string[];
};

interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  pageName: string;
}

const Breadcrumb: FC<BreadcrumbProps> = ({ pageName, ...props }) => {
  const { t } = useTranslation();
  const [isTabletOrDesktop, setIsTabletOrDesktop] = useState(false);
  const [leafImages, setLeafImages] = useState<string[]>([]);

  useEffect(() => {
    const checkSize = () => {
      setIsTabletOrDesktop(window.innerWidth >= 768);
    };

    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  useEffect(() => {
    // لا نحمل الصور إلا إذا كانت تابلت أو حاسوب
    if (isTabletOrDesktop) {
      loadLeafImages().then(setLeafImages);
    }
  }, [isTabletOrDesktop]);

  return (
    <div className="h-40 md:h-52 lg:h-64 relative" {...props}>
      {isTabletOrDesktop && (
        <img
          src={bgImage}
          className="absolute top-0 left-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          alt="breadcrumb"
        />
      )}

      <div className="overlay-crumb bg-[#fde6e1bf] absolute top-0 left-0 w-full h-full z-10"></div>

      <div className="main absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center space-y-3">
        <div className="title font-josefin text-xl md:text-2xl lg:text-3xl text-girl-typograph">
          {pageName}
        </div>
        <div className="bread flex items-center gap-3 capitalize text-girl-typograph/90 text-sm md:text-medium lg:text-lg">
          <p>{t("navigation.home")}</p>
          <p>-</p>
          <p>{pageName}</p>
        </div>
      </div>

      {isTabletOrDesktop && (
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
          {leafImages.map((src, i) => (
            <FloatingLeaf key={i} src={src} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Breadcrumb;
