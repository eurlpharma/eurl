import { Container } from "@mui/material";
import { FC, HTMLAttributes } from "react";
const { Autoplay } = await import("swiper/modules");
const  { Swiper, SwiperSlide } = await import("swiper/react");

import imageBlog1 from "../../assets/images/blogs/blog_01.jpg";
import imageBlog2 from "../../assets/images/blogs/blog_02.jpg";
import imageBlog3 from "../../assets/images/blogs/blog_03.jpg";
import imageBlog4 from "../../assets/images/blogs/blog_04.jpg";

interface BlogSectionProps extends HTMLAttributes<HTMLElement> {}

const items = [
  {
    title: "Trendy hair cut for straight hair",
    date: " May 8, 2025",
    content:
      "Enim praesent elementum facilisis leo. Sed augue lacus viverra vitae congue eu consequat ac...",
    image: imageBlog1,
  },
  {
    title: "Herbal treatment for dry scalp",
    date: " May 20, 2025",
    content:
      "Feugiat in ante metus dictum at. Nec feugiat in fermentum posuere urna nec tincidunt...",
    image: imageBlog2,
  },

  {
    title: "Best multi-step skin care treatment",
    date: " May 8, 2020",
    content:
      "Massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin. Tempor nec feugiat nisl...",
    image: imageBlog3,
  },

  {
    title: "Lorem ipsum dolor sit amet consectetur.",
    date: " May 8, 2020",
    content:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quam, non! A, quibusdam!",
    image: imageBlog4,
  },
];

const BlogSection: FC<BlogSectionProps> = () => {
  return (
    <div className="pb-28 bg-girl-white top-cats">
      <Container>
        <div className="content">
          <div className="header">
            <div className="title">from our blogs</div>
            <div className={"barline"}></div>
          </div>

          <div className="products w-full">
            <Swiper
              spaceBetween={20}
              loop={true}
              autoplay={{ delay: 4000, disableOnInteraction: true }}
              breakpoints={{
                768: { slidesPerView: 1 },
                992: { slidesPerView: 2 },
                1020: { slidesPerView: 3 },
              }}
              modules={[Autoplay]}
            >
              {items.map((item, index) => (
                <SwiperSlide key={index}>
                  <div
                    key={index}
                    className="blog"
                    data-aos="fade-up"
                    data-aos-duration={`${(index + 1) * 300}`}
                  >
                    <div className="thumb relative">
                      <img src={item.image} className="image" />
                      <div className="date absolute top-0 left-0 z-10 bg-girl-vividGreenCyan text-girl-white py-1 px-2 font-poppins uppercase">
                        {item.date}
                      </div>
                    </div>

                    <div className="info space-y-2 py-3 px-2">
                      <p className="text-xl capitalize line-clamp-1 text-girl-typograph">
                        {item.title}
                      </p>
                      <p className="font-poppins text-sm text-girl-bluishGray">
                        {item.content}
                      </p>
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

export default BlogSection;
