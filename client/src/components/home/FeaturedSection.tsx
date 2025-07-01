import { Box, Container } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Parallax } from "react-parallax";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import imageParallax from "@/assets/images/banner/feature_01.jpg";
import "swiper/css";
import "swiper/css/effect-fade";
import BoxFeature from "../global/BoxFeature";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getFeaturedProducts } from "@/store/slices/productSlice";
import { AppDispatch, RootState } from "@/store";
import { useNavigate } from "react-router-dom";

const FeaturedSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { featuredProducts, loading } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(getFeaturedProducts(8));
  }, [dispatch]);

  return (
    <Box className="featured">
      <Parallax
        blur={{ min: -15, max: 15 }}
        bgImage={imageParallax}
        bgImageAlt="parallax"
        strength={-200}
        className="i-parallax"
      >
        <div className="overlay"></div>
        <Container>
          <div className="content">
            <section className="top-bar">
              <h2>featured product</h2>
              <div className="ctrls">
                <div className="icon prev">
                  <ChevronLeft className="svg" />
                </div>
                <div className="icon next">
                  <ChevronRight className="svg" />
                </div>
              </div>
            </section>
            {loading && (
              <section>
                {featuredProducts.length > 0 && (
                  <Swiper
                    loop={true}
                    slidesPerView={1}
                    spaceBetween={30}
                    modules={[Navigation]}
                    navigation={{
                      nextEl: ".featured .top-bar .icon.next",
                      prevEl: ".featured .top-bar .icon.prev",
                    }}
                    breakpoints={{
                      640: {
                        slidesPerView: 1,
                        spaceBetween: 20,
                      },
                      768: {
                        slidesPerView: 2,
                        spaceBetween: 40,
                      },
                      1024: {
                        slidesPerView: 3,
                        spaceBetween: 50,
                      },
                    }}
                  >
                    {featuredProducts.map((p: any) => (
                      <SwiperSlide key={p._id}>
                        <BoxFeature
                          title={p.name}
                          src={p.images[0]}
                          category={p.brand}
                          onPress={() => navigate(`/products/${p._id}`)}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </section>
            )}
          </div>
        </Container>
      </Parallax>
    </Box>
  );
};

export default FeaturedSection;
