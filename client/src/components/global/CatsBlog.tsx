import { Container } from "@mui/material";
import { FC, HTMLAttributes, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import AOS from "aos";
import "swiper/css";
import 'swiper/css/navigation';

import imageCat1 from "../../assets/images/categories/content-image-11a.jpg";
import imageCat2 from "../../assets/images/categories/content-image-12a.jpg";
import imageCat3 from "../../assets/images/categories/content-image-5a.jpg";

import iconCat1 from "../../assets/icons/stretch/beautycare.png";
import iconCat2 from "../../assets/icons/stretch/organic.png";
import iconCat3 from "../../assets/icons/stretch/potmug.png";
import { Autoplay, EffectFade } from "swiper/modules";

const items = [
  {
    cat: {
      title: "Professional",
      subtitle: "Makeup Kit",
      image: imageCat1,
    },

    shop: {
      icon: iconCat1,
      title: "Perfect Flawless Skin Tone",
    },
  },

  {
    cat: {
      title: "Makeovers",
      subtitle: "Genuine Products",
      image: imageCat2,
    },

    shop: {
      icon: iconCat2,
      title: "Expert Choice Products",
    },
  },

  {
    cat: {
      title: "Organicals",
      subtitle: "Perfect Blend",
      image: imageCat3,
    },

    shop: {
      icon: iconCat3,
      title: "Organic Cosmetic Collections",
    },
  },
];

interface CatsBlogProps extends HTMLAttributes<HTMLElement> {}

const CatsBlog: FC<CatsBlogProps> = ({ ...props }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      AOS.refreshHard();
    }, 100);
  }, [activeIndex]);

  return (
    <div className="py-14 lg:py-24 bg-girl-white font-josefin" {...props}>
      <Container>
        <Swiper
          slidesPerView={1}
          loop={true}
          autoplay={{delay: 6000, disableOnInteraction: true}}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          modules={[Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={2000}
        >
          {items.map((item, index) => (
            <SwiperSlide key={index}>
              <section key={activeIndex} className="flex flex-col lg:flex-row items-start lg:p-4">
                <article className="is-cat space-y-4" data-aos="fade-right">
                  <div className="info flex flex-col gap-3">
                    <div className="title font-paris text-girl-secondary capitalize text-7xl">
                      {item.cat.title}
                    </div>
                    <div className="cat capitalize text-4xl">
                      {item.cat.subtitle}
                    </div>
                  </div>
                  <img src={item.cat.image} className="lg:shadow-lg" />
                </article>

                <article
                  className=" w-full is-shop flex flex-col items-center justify-center gap-4 lg:gap-14 lg:px-20 py-10 lg:py-40 lg:shadow-[0_0_15px_rgba(0,0,0,0.3)] lg:w-1/3"
                  data-aos="fade-left"
                >
                  <div className="icon">
                    <img className="w-16" src={item.shop.icon} />
                  </div>

                  <div className="title capitalize text-3xl text-center line-clamp-1">
                    {item.shop.title}
                  </div>
                  <p className="font-poppins text-[#777] text-center">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Vel dicta earum aliquam. Laboriosam hic nemo nam molestiae
                    harum aliquam ipsam.
                  </p>
                  <button className="border-2 border-girl-secondary text-girl-secondary rounded-full py-2 px-10 capitalize text-lg transition duration-700 hover:bg-girl-secondary hover:text-girl-white">
                    shop now
                  </button>
                </article>
              </section>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </div>
  );
};

export default CatsBlog;
