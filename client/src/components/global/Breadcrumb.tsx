import { FC, HTMLAttributes } from "react";
import bgImage from "../../assets/images/breadcrumb/shop-page.jpg";
import FloatingLeaf from "../hero/FloatingLeaf";

const leafs = import.meta.glob("../../assets/images/leaf/*.png", {
  eager: true,
  import: "default",
});

const leafImages: string[] = Object.values(leafs);

interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  pageName: string;
}

const Breadcrumb: FC<BreadcrumbProps> = ({ pageName, ...props }) => {
  return (
    <div className="h-64 relative" {...props}>
      <img
        src={bgImage}
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <div className="overlay-crumb bg-[#fde6e1bf] absolute top-0 left-0 w-full h-full z-10"></div>

      <div className="main absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center space-y-3">
        <div className="title font-josefin text-3xl text-girl-typograph">
          {pageName}
        </div>
        <div className="bread flex items-center gap-3 capitalize text-girl-typograph/90">
          <p>home</p>
          <p>-</p>
          <p>{pageName}</p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        {leafImages.map((src, i) => (
          <FloatingLeaf key={i} src={src} />
        ))}
      </div>
    </div>
  );
};

export default Breadcrumb;
