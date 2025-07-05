import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Link as RouterLink,
  useNavigate,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
// import { useTheme } from "@/hooks/useTheme";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

// MUI Components
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Drawer,
  Divider,
  Avatar,
  Box,
  Container,
  useMediaQuery,
  useTheme as useMuiTheme,
  CircularProgress,
} from "@mui/material";

// Icons
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  // SunIcon,
  // MoonIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  LanguageIcon,
} from "@heroicons/react/24/outline";
import {
  IconEmail,
  IconFacebook,
  IconFlagDZ,
  IconFlagFR,
  IconFlagUS,
  IconHome,
  IconInfo,
  IconInstagram,
  IconPhone,
  IconStore,
  IconTime,
  IconWhatsapp,
} from "../Iconify";

const Header = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, logout, loading } = useAuth();
  // const { mode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  const cart = useSelector((state: RootState) => state.cart);
  const items = cart?.items || [];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLangMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLangMenuClose = () => {
    setLangAnchorEl(null);
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);

    if (lang === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }

    handleLangMenuClose();
    // window.location.reload()
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const menuId = "primary-account-menu";
  const langMenuId = "language-menu";

  const renderMenu = (
    <Menu
      container={document.getElementById("root")}
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      {isAuthenticated ? (
        <>
          {user?.role?.toLowerCase() === "admin" && (
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/admin");
              }}
            >
              <Cog6ToothIcon className="w-5 h-5 mr-2" />
              {t("header.adminPanel")}
            </MenuItem>
          )}
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
            {t("header.logout")}
          </MenuItem>
        </>
      ) : (
        <>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate("/auth/login");
            }}
          >
            {t("header.login")}
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate("/auth/register");
            }}
          >
            {t("header.register")}
          </MenuItem>
        </>
      )}
    </Menu>
  );

  const renderLanguageMenu = (
    <Menu
      anchorEl={langAnchorEl}
      id={langMenuId}
      keepMounted
      open={Boolean(langAnchorEl)}
      onClose={handleLangMenuClose}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem
        onClick={() => handleLanguageChange("fr")}
        selected={i18n.language === "fr"}
      >
        Français
      </MenuItem>
      <MenuItem
        onClick={() => handleLanguageChange("en")}
        selected={i18n.language === "en"}
      >
        English
      </MenuItem>
      <MenuItem
        onClick={() => handleLanguageChange("ar")}
        selected={i18n.language === "ar"}
      >
        Arabic
      </MenuItem>
    </Menu>
  );

  const links = [
    {
      href: "/",
      label: "home",
    },

    {
      href: "/products",
      label: "products",
    },

    {
      href: "/about",
      label: "about",
    },
  ];

  const langsMobile = [
    {
      key: "english",
      label: "english",
      icon: IconFlagUS,
    },

    {
      key: "french",
      label: "français",
      icon: IconFlagFR,
    },

    {
      key: "arabic",
      label: "arabic",
      icon: IconFlagDZ,
    },
  ];

  const linksMobile = [
    {
      key: "/",
      label: "home",
      icon: IconHome,
    },

    {
      key: "/products",
      label: "products",
      icon: IconStore,
    },

    {
      key: "/about",
      label: "about_us",
      icon: IconInfo,
    },
  ];

  const mobileMenu = (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={toggleMobileMenu}
      container={document.getElementById("root")}
      PaperProps={{
        className: "backdrop-blur-sm bg-white/90",
        sx: { width: 280 },
      }}
    >
      <Box className="flex justify-between items-center h-20 px-3">
        <div className="text-2xl font-paris text-girl-secondary capitalize font-semibold">
          new logo
        </div>
        <IconButton onClick={toggleMobileMenu}>
          <XMarkIcon className="w-6 h-6" />
        </IconButton>
      </Box>

      <Divider />
      <div className="p-3 pt-6 space-y-4">
        {linksMobile.map((link) => (
          <NavLink
            to={link.key}
            key={link.key}
            onClick={() => handleLanguageChange(link.key)}
            className="flex items-center gap-3"
          >
            <link.icon />
            <p className="capitalize font-poppins">
              {t(`header.${link.label}`)}
            </p>
          </NavLink>
        ))}
      </div>

      <Divider />
      <div className="p-3 pt-6 space-y-4">
        {langsMobile.map((lang) => (
          <div
            key={lang.key}
            onClick={() => handleLanguageChange(lang.key)}
            className="flex items-center gap-3"
          >
            <lang.icon className="w-5 h-5" />
            <p className="capitalize">{t(`lang.${lang.key}`)}</p>
          </div>
        ))}
      </div>
    </Drawer>
  );

  const socials = [
    {
      icon: IconFacebook,
      href: "https://www.facebook.com",
    },

    {
      icon: IconInstagram,
      href: "https://www.instagram.com",
    },

    {
      icon: IconWhatsapp,
      href: "https://www.whatsapp.com",
    },
  ];

  const contacts = [
    {
      icon: IconPhone,
      href: "+213 558 71 48 90",
      label: "+213558714890",
    },

    {
      icon: IconEmail,
      href: "contact@info.com",
      label: "contact@info.com",
    },

    {
      icon: IconTime,
      href: "#",
      label: "Mon-Fri: 7:00 - 17:00",
    },
  ];

  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY > lastScrollY && currentY > 100) {
        setShowHeader(false); // Scroll Down
      } else {
        setShowHeader(true); // Scroll Up
      }

      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="ui-navbar">
      {/* <Navbar /> */}

      <AppBar
        position="fixed"
        elevation={isScrolled ? 1 : 0}
        className={`transition-all duration-500 z-50 font-josefin ${
          isScrolled
            ? "backdrop-blur-sm bg-white/60 dark:bg-white/60 shadow-md"
            : "bg-white text-black"
        } ${
          showHeader
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <div>
          {/* Top navbar */}
          {!isMobile && (
            <Container maxWidth="xl" className="top hidden">
              <Toolbar disableGutters className="justify-between">
                {/* Social Media */}
                <Box className="socials space-x-2">
                  {socials.map((s) => (
                    <IconButton
                      key={s.href}
                      component={RouterLink}
                      to="/cart"
                      aria-label="cart"
                      color="inherit"
                    >
                      <Badge color="secondary">
                        <s.icon className="w-5 h-5" />
                      </Badge>
                    </IconButton>
                  ))}
                </Box>

                {/* Contacts */}
                <Box className="flex items-center space-x-6 lg:space-x-8">
                  {contacts.map((c) => (
                    <a
                      href={c.href}
                      key={c.href}
                      className="flex items-center gap-1 text-current"
                    >
                      <c.icon className="w-5 h-5" />
                      {!isMobile && <p className="text-tiny">{c.label}</p>}
                    </a>
                  ))}
                </Box>
              </Toolbar>
            </Container>
          )}

          {/* Bottom Navbar */}
          <Container maxWidth="xl" className="btm">
            <Toolbar disableGutters className="content">
              {/* Logo */}
              <Typography
                variant="h6"
                component={RouterLink}
                to="/"
                className="text-girl-primary font-bold font-paris text-2xl no-underline flex items-center"
              >
                {/* <HeartIcon className="w-7 h-7 mr-2 text-girl-primary" /> */}
                {/* Healthy */}
                New Logo
              </Typography>

              {/* Desktop Navigation */}
              {!isMobile && (
                <Box className="flex items-center space-x-8 text-lg">
                  {links.map((link) => (
                    <Link
                      className="capitalize text-girl-black transition hover:text-girl-primary"
                      key={link.label}
                      to={link.href}
                    >
                      {link.label}
                    </Link>
                  ))}
                </Box>
              )}

              {/* Actions */}
              <Box className="flex items-center space-x-2 text-girl-black">
                {/* <IconButton onClick={toggleTheme} color="inherit">
                  {mode === "dark" ? (
                    <SunIcon className="w-5 h-5" />
                  ) : (
                    <MoonIcon className="w-5 h-5" />
                  )}
                </IconButton> */}

                {!isMobile && (
                  <IconButton
                    edge="end"
                    aria-label="language"
                    aria-controls={langMenuId}
                    aria-haspopup="true"
                    onClick={handleLangMenuOpen}
                    color="inherit"
                  >
                    <LanguageIcon className="w-5 h-5" />
                  </IconButton>
                )}

                <IconButton
                  component={RouterLink}
                  to="/cart"
                  aria-label="cart"
                  color="inherit"
                >
                  <Badge badgeContent={items.length} color="secondary">
                    <ShoppingCartIcon className="w-5 h-5" />
                  </Badge>
                </IconButton>

                {isAuthenticated && !loading && (
                  <IconButton
                    edge="end"
                    aria-label="account"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <Avatar
                      className="w-6 h-6"
                      alt={user?.name}
                      sx={{ bgcolor: "primary.main" }}
                    >
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </Avatar>
                  </IconButton>
                )}

                {loading && (
                  <IconButton edge="end" color="secondary" disabled>
                    <CircularProgress size={24} />
                  </IconButton>
                )}

                {isMobile && (
                  <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleMobileMenu}
                  >
                    <Bars3Icon className="w-6 h-6" />
                  </IconButton>
                )}
              </Box>
            </Toolbar>
          </Container>
        </div>
      </AppBar>

      <Box sx={{ height: "80px", backgroundColor: "white" }} />

      {renderMenu}
      {renderLanguageMenu}
      {mobileMenu}
    </div>
  );
};

export default Header;
