import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Container, Grid, Typography, Link, Box, Divider } from "@mui/material";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { IconDelivery, IconExchange, IconPhone, IconSupport } from "../Iconify";

const itemsTopFooter = [
  {
    title: "free shipping",
    content: "world wide",
    icon: IconDelivery,
  },

  {
    title: "helpline",
    content: "(+213)558-71-48-92",
    icon: IconPhone,
  },

  {
    title: "24x7 extensive",
    content: "customer support",
    icon: IconSupport,
  },

  {
    title: "echanges",
    content: "easy returns",
    icon: IconExchange,
  },
];

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" className="pb-4 relative">

      <div className="top-footer hidden w-full absolute left-1/2 -translate-x-1/2 -top-14 z-20">
        <Container className="bg-girl-white border-1 border-solid border-girl-yellow rounded-lg">
          <div className="flex flex-col lg:flex-row items-center h-fit lg:h-28 justify-center lg:justify-evenly gap-3 w-full">
            {itemsTopFooter.map((itf) => (
              <div
                key={itf.title}
                className="flex flex-col lg:flex-row justify-center items-center gap-3 cursor-pointer"
              >
                <div className="icon">
                  <itf.icon className="w-10 h-10" />
                </div>
                <div className="info capitalize text-center lg:text-start">
                  <p className="text-girl-typograph text-lg">{itf.title}</p>
                  <p className="text-girl-bluishGray">{itf.content}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      <Container maxWidth="lg" className="relative top-20">
        <div className="btm-footer">
          <Grid container spacing={4}>
            {/* Company Info */}
            <Grid item xs={12} md={4}>
              <Box className="flex items-center mb-4">
                <Typography
                  variant="h6"
                  className="text-girl-secondary font-josefin text-xl"
                >
                  Healthy
                </Typography>
              </Box>
              <Typography variant="body2" className="mb-4 text-girl-typograph">
                {t("footer.companyDescription")}
              </Typography>
              <Box className="flex items-center mb-2">
                <PhoneIcon className="w-5 h-5 text-girl-secondary mr-2" />
                <Typography variant="body2" className="text-girl-typograph">
                  +212 123 456 789
                </Typography>
              </Box>
              <Box className="flex items-center mb-2">
                <EnvelopeIcon className="w-5 h-5 text-girl-secondary mr-2" />
                <Typography variant="body2" className="text-girl-typograph">
                  contact@healthy-medical.com
                </Typography>
              </Box>
              <Box className="flex items-center">
                <MapPinIcon className="w-5 h-5 text-girl-secondary mr-2" />
                <Typography variant="body2" className="text-girl-typograph">
                  Algerien, Alger, Street 123
                </Typography>
              </Box>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={2}>
              <div className="mb-4 text-girl-secondary font-josefin text-xl">
                {t("footer.quickLinks")}
              </div>
              <Box component="ul" className="p-0 m-0 list-none">
                <Box component="li" className="mb-2">
                  <Link
                    component={RouterLink}
                    to="/"
                    className="text-girl-typograph hover:text-girl-primary no-underline"
                  >
                    {t("footer.home")}
                  </Link>
                </Box>
                <Box component="li" className="mb-2">
                  <Link
                    component={RouterLink}
                    to="/products"
                    className="text-girl-typograph hover:text-girl-primary no-underline"
                  >
                    {t("footer.products")}
                  </Link>
                </Box>
                <Box component="li" className="mb-2">
                  <Link
                    component={RouterLink}
                    to="/about"
                    className="text-girl-typograph hover:text-girl-primary no-underline"
                  >
                    {t("footer.about")}
                  </Link>
                </Box>
                <Box component="li" className="mb-2">
                  <Link
                    component={RouterLink}
                    to="/contact"
                    className="text-girl-typograph hover:text-girl-primary no-underline"
                  >
                    {t("footer.contact")}
                  </Link>
                </Box>
              </Box>
            </Grid>

            {/* Categories */}
            <Grid item xs={12} sm={6} md={2}>
              <div className="mb-4 text-girl-secondary font-josefin text-xl">
                {t("footer.categories")}
              </div>
              <Box component="ul" className="p-0 m-0 list-none">
                <Box component="li" className="mb-2">
                  <Link
                    component={RouterLink}
                    to="/products?category=vitamins"
                    className="text-girl-typograph hover:text-girl-primary no-underline"
                  >
                    {t("categories.vitamins")}
                  </Link>
                </Box>
                <Box component="li" className="mb-2">
                  <Link
                    component={RouterLink}
                    to="/products?category=supplements"
                    className="text-girl-typograph hover:text-girl-primary no-underline"
                  >
                    {t("categories.supplements")}
                  </Link>
                </Box>
                <Box component="li" className="mb-2">
                  <Link
                    component={RouterLink}
                    to="/products?category=equipment"
                    className="text-girl-typograph hover:text-girl-primary no-underline"
                  >
                    {t("categories.equipment")}
                  </Link>
                </Box>
                <Box component="li" className="mb-2">
                  <Link
                    component={RouterLink}
                    to="/products?category=devices"
                    className="text-girl-typograph hover:text-girl-primary no-underline"
                  >
                    {t("categories.devices")}
                  </Link>
                </Box>
              </Box>
            </Grid>

            {/* Customer Service */}
            <Grid item xs={12} sm={6} md={2}>
              <div className="mb-4 text-girl-secondary font-josefin text-xl">
                {t("footer.customerService")}
              </div>
              <Box component="ul" className="p-0 m-0 list-none">
                <Box component="li" className="mb-2">
                  <Link
                    component={RouterLink}
                    to="/faq"
                    className="text-girl-typograph hover:text-girl-primary no-underline"
                  >
                    {t("footer.faq")}
                  </Link>
                </Box>
                <Box component="li" className="mb-2">
                  <Link
                    component={RouterLink}
                    to="/shipping"
                    className="text-girl-typograph hover:text-girl-primary no-underline"
                  >
                    {t("footer.shipping")}
                  </Link>
                </Box>
                <Box component="li" className="mb-2">
                  <Link
                    component={RouterLink}
                    to="/returns"
                    className="text-girl-typograph hover:text-girl-primary no-underline"
                  >
                    {t("footer.returns")}
                  </Link>
                </Box>
                <Box component="li" className="mb-2">
                  <Link
                    component={RouterLink}
                    to="/privacy"
                    className="text-girl-typograph hover:text-girl-primary no-underline"
                  >
                    {t("footer.privacy")}
                  </Link>
                </Box>
              </Box>
            </Grid>

            {/* Newsletter */}
            <Grid item xs={12} sm={6} md={2}>
              <div className="mb-4 text-girl-secondary font-josefin text-xl">
                {t("footer.newsletter")}
              </div>
              <Typography
                variant="body2"
                className="mb-4 text-girl-typograph hover:text-girl-primary"
              >
                {t("footer.subscribeText")}
              </Typography>
              {/* Newsletter form would go here */}
            </Grid>
          </Grid>

          <Divider className="my-6" />

          {/* Bottom Footer */}
          <Box className="flex flex-col md:flex-row justify-between items-center">
            <Typography
              variant="body2"
              className="text-girl-typograph hover:text-girl-primary mb-2 md:mb-0"
            >
              © {currentYear} Healthy. {t("footer.allRightsReserved")}
            </Typography>
            <Box className="flex space-x-4">
              <Link
                href="#"
                className="text-girl-typograph hover:text-girl-primary no-underline"
              >
                {t("footer.terms")}
              </Link>
              <Link
                href="#"
                className="text-girl-typograph hover:text-girl-primary no-underline"
              >
                {t("footer.privacy")}
              </Link>
              <Link
                href="#"
                className="text-girl-typograph hover:text-girl-primary no-underline"
              >
                {t("footer.cookies")}
              </Link>
            </Box>
          </Box>
        </div>
      </Container>
    </Box>
  );
};

export default Footer;
