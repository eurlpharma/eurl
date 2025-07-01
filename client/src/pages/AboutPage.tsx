import Breadcrumb from "@/components/global/Breadcrumb";
import { Container } from "@mui/material";
import {
  IconEmailLine,
  IconMapLine,
  IconPhoneLine,
} from "@/components/Iconify";
import girlLinear from "@/assets/images/icons/icon-girl-linear.png";
import AIButton from "@/components/buttons/AIButton";
import imageAboutSection from "@/assets/images/about/about-section.png";
import { useNavigate } from "react-router-dom";

const contactItems = [
  {
    icon: IconMapLine,
    value: "Algerien, Alger, staouiali, PA 17036",
  },

  {
    icon: IconPhoneLine,
    value: "(+213) 558-58-58-58",
  },

  {
    icon: IconEmailLine,
    value: "healthy@email.com",
  },
];

const AboutPage = () => {

  const navigate = useNavigate()

  return (
    <div className="about">
      {/* <img src={coverImage} className="cover" /> */}
      <Breadcrumb pageName="About" />

      {/* about section */}
      <section className="ab-sect">
        <img
          src={imageAboutSection}
          alt="Shop cover section"
          className="cover-sect"
        />
        <Container
          maxWidth="lg"
          className=" relative z-10 flex flex-col items-center justify-center gap-6 text-center"
        >
          <img
            src={girlLinear}
            className="w-20 h-20"
            alt="about page ecommerce"
          />
          <p className="semi-title">A Nature’s Touch</p>
          <p className="extra-title">
            <span className="text-girl-secondary">100%</span> Original & Organic
          </p>
          <p className="text">
            Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna.
            SedMaecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut
            libero venenatis faucibus. Nullam quis ante. Maecenas nec odio et
            ante tincidunt tempus.
          </p>

          <AIButton variant="outlined" radius="full" onClick={() => navigate("/products")}>
            Explore Products
          </AIButton>
        </Container>
      </section>

      {/* contact info */}
      <section className="content">
        <Container maxWidth="lg" className="space-y-10">
          <div className="toolbar">
            <p>keep connected</p>
            <h2>get in touch</h2>
          </div>

          <div className="details flex relative z-20">
            <div className="side start">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12787.660185080798!2d2.876540930308276!3d36.74861018529617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fbb2def044d51%3A0xcde2ad68272e29aa!2sStaoueli!5e0!3m2!1sen!2sdz!4v1750767278879!5m2!1sen!2sdz"
                width="600"
                height="450"
                style={{ border: "0" }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="side end">
              <div className="social-box">
                <div className="social">
                  <h2>contact info</h2>
                  <p>
                    Sed fringilla mauris sit amet nibh. Donec sodales sagittis
                    magna. SedMaecenas nec odio et ante tincidunt tempus.
                  </p>
                  <div className="items">
                    {contactItems.map((ci, index) => (
                      <div className="item" key={index}>
                        <div className="icon">{<ci.icon />}</div>
                        <div className="info">{ci.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default AboutPage;
