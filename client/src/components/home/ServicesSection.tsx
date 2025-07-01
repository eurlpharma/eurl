import { ServicesBox } from "@/data/services";
import { Container, Box } from "@mui/material";
import BoxService from "../global/BoxService";

const ServicesSection = () => {
  return (
    <Box id="next-section" className="services">
      <Container>
        <section className="space-y-16">
          <div className="title">main services</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-16">
            {ServicesBox.map((s, index) => (
              <BoxService
                key={index}
                title={s.title}
                description={s.description}
                icon={<s.icon />}
              />
            ))}
          </div>
        </section>
      </Container>
    </Box>
  );
};

export default ServicesSection;
