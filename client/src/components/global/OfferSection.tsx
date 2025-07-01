import { FC, HTMLAttributes } from "react";

import image1 from "../../assets/images/offerc/content-image-10a.jpg";
import image2 from "../../assets/images/offerc/content-image-8a.jpg";
import image3 from "../../assets/images/offerc/content-image-9a.jpg";
import { Swiper, SwiperSlide } from "swiper/react";

interface OfferSectionProps extends HTMLAttributes<HTMLElement> {}

const items = [
  {
    offer: "get the best in",
    title: "Cosmetics",
    image: image1,
    aos: "fade-right",
  },

  {
    offer: "3 in one",
    title: "Fairness Beauty",
    image: image2,
    aos: "fade-down",
  },

  {
    offer: "10% Off on",
    title: "Face Packs",
    image: image3,
    aos: "fade-left",
  },
];

const OfferSection: FC<OfferSectionProps> = ({ ...props }) => {
  return (
    <div className="pb-28 bg-girl-white font-josefin" {...props}>
      <Swiper
        spaceBetween={20}
        data-aos={"fade-down"}
        breakpoints={{
          768: { slidesPerView: 1 },
          992: { slidesPerView: 2 },
          1022: { slidesPerView: 3 },
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="cover w-full h-[38rem] relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="info absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10 text-center">
                <p className="text-girl-secondary text-xl font-poppins capitalize pb-2">
                  {item.offer}
                </p>
                <p className="text-girl-typograph text-5xl capitalize">
                  {item.title}
                </p>
                <button className="text-girl-white bg-girl-secondary rounded-full capitalize text-lg py-2 px-6 mt-6">
                  shop now
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default OfferSection;
