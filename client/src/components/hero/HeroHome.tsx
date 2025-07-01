import { Box } from "@mui/material";
import { FC, HTMLAttributes, useEffect, useRef, useState } from "react";

import { Link } from "react-scroll";
import { ChevronDown } from "lucide-react";
import { ReactTyped } from "react-typed";

import clsx from "clsx";
import { Swiper, SwiperSlide } from "swiper/react";

import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import FloatingLeaf from "./FloatingLeaf";
import { useNavigate } from "react-router-dom";

const images = import.meta.glob("../../assets/images/landing/*.jpg", {
  eager: true,
  import: "default",
});

const leafs = import.meta.glob("../../assets/images/leaf/*.png", {
  eager: true,
  import: "default",
});

const heroImages: string[] = Object.values(images);
const leafImages: string[] = Object.values(leafs);

interface HeroHomeProps extends HTMLAttributes<HTMLElement> {
  isScreen?: boolean;
}

const HeroHome: FC<HeroHomeProps> = ({ isScreen = true, ...props }) => {

  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      setSize({
        width: containerRef.current!.clientWidth,
        height: containerRef.current!.clientHeight,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <Box className="h-[calc(100vh-80px)] font-josefin" {...props}>
      <div className="swiper w-full h-full">
        <Swiper
          className="h-full"
          loop={true}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          effect="fade"
          speed={3000}
          fadeEffect={{ crossFade: true }}
          modules={[EffectFade, Autoplay]}
        >
          {heroImages.map((src, index) => (
            <SwiperSlide key={index}>
              <img src={src} className="w-full h-full object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>
        {/* <div className="overlay absolute top-0 left-0 w-full h-full z-10 bg-black/60"></div> */}
        <div
          className={clsx(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50",
            "flex flex-col items-center gap-1 lg:gap-2 text-white w-full"
          )}
        >
          <h1 data-aos="fade-down" className=" text-3xl capitalize text-girl-primary font-josefin">
            <ReactTyped
              loop
              typeSpeed={50}
              backSpeed={40}
              backDelay={1500}
              strings={[
                "welcome",
                "Cosmetic face Products",
                "construction",
                "what we do",
              ]}
            />
          </h1>
          <div
            style={{ fontSize: "24px", color: "#007BFF", fontWeight: "bold" }}
          ></div>
          <p data-aos="zoom-in-down" className="px-10 text-center text-2xl lg:text-5xl text-girl-black mx-auto max-w-5xl" 
          style={{lineHeight: 1.6}}>
            Cleansing, Beautifying, Promoting Attractiveness without Affecting
            the Body
          </p>
          <div
            data-aos="zoom-in"
            className={clsx(
              "more mt-8 bg-girl-primary text-white px-8 py-2 rounded-full ",
              "border-2 border-transparent hover:bg-transparent hover:border-girl-primary",
              "hover:border-solid hover:text-girl-primary transition-all cursor-pointer",
              "text-lg capitalize"
            )}
            onClick={() => navigate("/products")}
          >
            Shop Now
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50">
          <Link
            to="next-section"
            smooth={true}
            duration={800}
            offset={-50}
            className="cursor-pointer text-girl-primary"
          >
            <ChevronDown size={42} className="animate-bounce" />
          </Link>
        </div>

        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
          {leafImages.map((src, i) => (
            <FloatingLeaf key={i} src={src} />
          ))}
        </div>
      </div>
    </Box>
  );
};

export default HeroHome;
