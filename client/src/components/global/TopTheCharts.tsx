import { Container, IconButton } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFlip } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-flip";
import lotion from "../../assets/icons/gradient/lotion.png";
import concealer from "../../assets/icons/gradient/concealer.png";
import lipstick from "../../assets/icons/gradient/lipstick.png";
import mascara from "../../assets/icons/gradient/mascara.png";
import primer from "../../assets/icons/gradient/primer.png";
import serum from "../../assets/icons/gradient/serum.png";
import { ShoppingCartIcon } from "lucide-react";

const cats = [
  {
    name: "lotion",
    icon: lotion,
    tabId: "lotion",
  },

  {
    name: "Mascara",
    icon: mascara,
    tabId: "Mascara",
  },

  {
    name: "Lipstick",
    icon: lipstick,
    tabId: "Lipstick",
  },

  {
    name: "Serum",
    icon: serum,
    tabId: "Serum",
  },

  {
    name: "Primer",
    icon: primer,
    tabId: "Primer",
  },

  {
    name: "Concealer",
    icon: concealer,
    tabId: "Concealer",
  },

  {
    name: "lotion Taber",
    icon: lotion,
    tabId: "lotion Taber",
  },
];

const items = [
  {
    name: "texas primer",
    price: {
      rem: 4200,
      new: 3000,
    },
    images: [
      "../../assets/images/products/shop-1.jpg",
      "../../assets/images/products/shop-10.jpg",
      "../../assets/images/products/shop-11.jpg",
    ],
  },

  {
    name: "myst spray",
    price: {
      rem: 3200,
      new: 2800,
    },
    images: [
      "../../assets/images/products/shop-12.jpg",
      "../../assets/images/products/shop-13.jpg",
      "../../assets/images/products/shop-14.jpg",
    ],
  },

  {
    name: "texas primer",
    price: {
      rem: 4200,
      new: 3000,
    },
    images: [
      "../../assets/images/products/shop-15.jpg",
      "../../assets/images/products/shop-16.jpg",
      "../../assets/images/products/shop-17.jpg",
    ],
  },

  {
    name: "BB cream",
    price: {
      rem: 5000,
      new: 4100,
    },
    images: [
      "../../assets/images/products/shop-18.jpg",
      "../../assets/images/products/shop-19.jpg",
      "../../assets/images/products/shop-2.jpg",
    ],
  },

  {
    name: "beau concelar",
    price: {
      rem: 2000,
      new: 1500,
    },
    images: [
      "../../assets/images/products/shop-20.jpg",
      "../../assets/images/products/shop-21.jpg",
      "../../assets/images/products/shop-22.jpg",
    ],
  },

  {
    name: "zera makeup spray",
    price: {
      rem: 6000,
      new: 5000,
    },
    images: [
      "../../assets/images/products/shop-23.jpg",
      "../../assets/images/products/shop-24.jpg",
      "../../assets/images/products/shop-25.jpg",
    ],
  },

  {
    name: "eva spray",
    price: {
      rem: 1500,
      new: 1000,
    },
    images: [
      "../../assets/images/products/shop-26.jpg",
      "../../assets/images/products/shop-27.jpg",
      "../../assets/images/products/shop-28.jpg",
    ],
  },

  {
    name: "TT foundition primer",
    price: {
      rem: 1990,
      new: 1000,
    },
    images: [
      "../../assets/images/products/shop-29.jpg",
      "../../assets/images/products/shop-3.jpg",
      "../../assets/images/products/shop-30.jpg",
    ],
  },
];

const products = import.meta.glob("../../assets/images/product01/*.jpg", {
  eager: true,
  import: "default",
});

const productImages: string[] = Object.values(products);


const TopTheCharts = () => {


  return (
    <div className="top-cats">
      <Container>
        <div className="content">
          <div className="header">
            <div className="title">top of the charts</div>
            <div className={"barline"}></div>
          </div>

          <div className="cats">
            {
              <Swiper
                className="w-full"
                slidesPerView={3}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                modules={[Autoplay]}
                breakpoints={{
                  // When window width is >= 640px
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  // When window width is >= 768px
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                  },
                  // When window width is >= 1024px
                  1024: {
                    slidesPerView: 6,
                    spaceBetween: 40,
                  },
                }}
              >
                {cats.map((c, index) => (
                  <SwiperSlide key={index}>
                    <div
                      className="box"
                      data-aos="fade-down"
                      data-aos-duration={`${(index + 1) * 300}`}
                    >
                      <div className="icon">
                        <img src={c.icon} />
                      </div>
                      <div className="name">{c.name}</div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            }
          </div>

          <div className="products w-full">
            <Swiper
              spaceBetween={20}
              loop
              breakpoints={{
                768: { slidesPerView: 1 },
                992: { slidesPerView: 3 },
                1020: { slidesPerView: 4 },
              }}
            >
              {items.map((item, index) => (
                <SwiperSlide key={index}>
                  <div
                    key={index}
                    className="product"
                    // onMouseEnter={() => console.log("mouse enter")}
                    // onMouseLeave={() => console.log("mouse leave")}
                    data-aos="fade-up"
                    data-aos-duration={`${(index + 1) * 300}`}
                  >
                    <div className="thumbs">
                      <Swiper
                        loop={false}
                        speed={600}
                        effect="flip"
                        slidesPerView={1}
                        spaceBetween={10}
                        modules={[EffectFlip]}
                      >
                        {productImages.slice(0, 2).map((src, idx) => (
                          <SwiperSlide key={idx}>
                            <img src={src} className="image" />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      <div className="over-mode"></div>
                      <div className="over sale">{"sale"}</div>
                      <div className="in-cart">
                        <IconButton
                          // onClick={handleAddToCart}
                          // disabled={product.countInStock === 0}
                          className="text-girl-secondary"
                        >
                          <ShoppingCartIcon className="w-7 h-7" />
                        </IconButton>
                      </div>

                      <div className="over pink">
                        <i className="fi fi-rr-thumbtack flex items-center justify-center"></i>
                      </div>
                    </div>

                    <div className="info">
                      <div className="price ">
                        <div className="rem-price">
                          DA <span>{item.price.rem}</span>
                        </div>
                        <div className="new-price">
                          DA <span>{item.price.new}</span>
                        </div>
                      </div>
                      <div className="name">{item.name}</div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TopTheCharts;
