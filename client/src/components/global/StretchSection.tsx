import { Container } from "@mui/material";
import leftStretchImage from "../../assets/images/stretch/content-image7.png";
import backgroundStretch from "../../assets/images/stretch/section-bgimage6.jpg";
import clsx from "clsx";

import organicCreate from "../../assets/icons/stretch/organic.png";
import naturalExtracts from "../../assets/icons/stretch/potmug.png";
import qualityAssurance from "../../assets/icons/stretch/quality.png";
import fruitDelicacies from "../../assets/icons/stretch/beautycare.png";
import justPicked from "../../assets/icons/stretch/tree.png";
import organicVeggies from "../../assets/icons/stretch/stickbottle.png";
import FloatingLeaf from "../hero/FloatingLeaf";

const items = [
  {
    title: "Organic Cream",
    content: "Last all day and gives you smooth gentle skin itself.",
    icon: organicCreate,
    isActive: true,
  },

  {
    title: "Natural Extracts",
    content: "Natural colors, functional and nutritional substances.",
    icon: naturalExtracts,
    isActive: false,
  },

  {
    title: "Quality Assurance",
    content: "Each product are certified by our quality control.",
    icon: qualityAssurance,
    isActive: false,
  },

  {
    title: "Fruit Delicacies",
    content: "Natural Aloe Vera, honey, papaya, pulp, argan oil...",
    icon: fruitDelicacies,
    isActive: true,
  },

  {
    title: "Just Picked Fruit",
    content: "It enhances your beauty without damaging it.",
    icon: justPicked,
    isActive: true,
  },

  {
    title: "Organic Veggies",
    content: "Pleasant aroma of naturally made fragrance Oils.",
    icon: organicVeggies,
    isActive: false,
  },
];

const leafs = import.meta.glob("../../assets/images/leaf/*.png", {
  eager: true,
  import: "default",
});

const leafImages: string[] = Object.values(leafs);

const StretchSection = () => {
  return (
    <section className="stretch">
      <img className="back-over" src={backgroundStretch} />
      <Container>
        <div className="content">
          <div className="side left">
            <img data-aos="fade-right" src={leftStretchImage} />
          </div>
          <div className="side right">
            <div className="items">
              {items.map((item, index) => (
                <div
                  key={index}
                  className={"item "}
                  data-aos="fade-up"
                  // style={{ marginLeft: index + "em" }}
                >
                  <div className="icon">
                    <img src={item.icon} />
                  </div>
                  <div className="info">
                    <div className={clsx("name", item.isActive && "active")}>
                      {item.title}
                    </div>
                    <div className="text">{item.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>

      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        {leafImages.map((src, i) => (
          <FloatingLeaf key={i} src={src} />
        ))}
      </div>
    </section>
  );
};

export default StretchSection;
