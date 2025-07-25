import { Container } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFlip } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-flip";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useEffect, useState } from "react";
import { getCategories } from "@/store/slices/categorySlice";
import { CategoryData } from "@/types/category";
import { getProducts } from "@/store/slices/productSlice";
import { ProductData } from "@/types/product";
import { useNavigate } from "react-router-dom";

const TopTheCharts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [loadCats, setLoadCats] = useState<boolean>(true);
  const { categories }: { categories: CategoryData[] } = useSelector(
    (state: RootState) => state.categories
  );
  const { products, loading }: { products: ProductData[]; loading: boolean } =
    useSelector((state: RootState) => state.products);

  const handleFetchCategories = async () => {
    setLoadCats(true);
    await dispatch(getCategories());
    setLoadCats(false);
  };

  const handleFetchProducts = async () => {
    await dispatch(getProducts({ limit: 8 }));
  };

  useEffect(() => {
    handleFetchCategories();
    handleFetchProducts();
  }, [dispatch]);

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
                loop={categories && categories.length > 2 ? true : false}
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
                {!loadCats &&
                  categories.map((c: CategoryData, index: number) => (
                    <SwiperSlide key={index}>
                      <div
                        className="box"
                        data-aos="fade-down"
                        data-aos-duration={`${(index + 1) * 300}`}
                      >
                        <div className="icon">
                          <img src={c.image} />
                        </div>
                        <div className="name">{c.nameEn}</div>
                      </div>
                    </SwiperSlide>
                  ))}
              </Swiper>
            }
          </div>

          <div className="products w-full">
            <Swiper
              spaceBetween={20}
              loop={products && products.length > 2 ? true : false}
              breakpoints={{
                768: { slidesPerView: 1 },
                992: { slidesPerView: 3 },
                1020: { slidesPerView: 4 },
              }}
            >
              {!loading &&
                products &&
                products.length > 0 &&
                products.map((product: ProductData, index) => (
                  <SwiperSlide key={index}>
                    <div
                      key={index}
                      className="product"
                      data-aos="fade-up"
                      data-aos-duration={`${(index + 1) * 300}`}
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      <div className="thumbs h-[26rem] md:h-[28rem]">
                        <Swiper
                          loop={false}
                          speed={600}
                          effect="flip"
                          slidesPerView={1}
                          spaceBetween={10}
                          modules={[EffectFlip]}
                          className="h-full w-full"
                        >
                          {product.images.slice(0, 2).map((src, idx) => (
                            <SwiperSlide key={idx}>
                              <img
                                src={src}
                                className="bg-product-1 h-full w-full object-contain"
                              />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                        <div className="over-mode"></div>
                        {product.isVisible && (
                          <div className="over sale">{"sale"}</div>
                        )}
                        {product.isFeatured && (
                          <div className="over pink">
                            <i className="fi fi-rr-thumbtack flex items-center justify-center"></i>
                          </div>
                        )}
                      </div>

                      <div className="info">
                        <div className="price ">
                          <div className="rem-price">
                            DA <span>{product.price}</span>
                          </div>
                          <div className="new-price">
                            DA <span>{product.price}</span>
                          </div>
                        </div>
                        <div className="name">{product.name}</div>
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
