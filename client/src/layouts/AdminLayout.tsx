import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import userAvatar from "../assets/avatars/avatar-user.png";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  useTheme as useMuiTheme,
  useMediaQuery,
} from "@mui/material";
import Notification from "@/components/ui/Notification";
import {
  IconBellBold,
  IconBoxBold,
  IconChartBold,
  IconChatBold,
  IconHomeBold,
  IconLaptopBold,
  IconMenu,
  IconOrderBold,
  IconSettingBold,
  IconUsersBold,
  IconWidgetBold,
} from "@/components/Iconify";
import clsx from "clsx";

const drawerWidth = 280;

interface MenuItemType {
  key: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  children?: { key: string; label: string; path: string }[];
}

const AdminLayout = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/login");
  };

  const menuItems: MenuItemType[] = [
    {
      key: "app",
      label: t("admin.app"),
      path: "/admin",
      icon: <IconLaptopBold />,
    },
    {
      key: "products",
      label: t("admin.products"),
      path: "/admin/products",
      icon: <IconBoxBold className="w-6 h-6" />,
    },
    {
      key: "categories",
      label: t("admin.categories"),
      path: "/admin/categories",
      icon: <IconWidgetBold className="w-6 h-6" />,
    },
    {
      key: "orders",
      label: t("admin.orders"),
      path: "/admin/orders",
      icon: <IconOrderBold className="w-6 h-6" />,
    },
    {
      key: "users",
      label: t("admin.users"),
      path: "/admin/users",
      icon: <IconUsersBold />,
    },
    {
      key: "messages",
      label: t("admin.messages"),
      path: "/admin/analytics",
      icon: <IconChatBold className="w-6 h-6" />,
    },
    {
      key: "analytics",
      label: t("admin.analytics"),
      path: "/admin/analytics",
      icon: <IconChartBold className="w-6 h-6" />,
    },
    {
      key: "settings",
      label: t("admin.settings"),
      path: "/admin/settings",
      icon: <IconSettingBold />,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/admin" && location.pathname === "/admin") {
      return true;
    }
    return location.pathname.startsWith(path) && path !== "/admin";
  };

  const drawer = (
    <Box>
      <Box className="p-4 flex items-center justify-between">
        <Typography
          variant="h6"
          className="text-girl-secondary font-paris capitalize font-semibold text-xl"
        >
          pharma eurl
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <Box key={item.key}>
            <ListItem
              component={Link}
              to={item.path}
              className={clsx(
                "rounded-lg gap-3",
                isActive(item.path)
                  ? "bg-girl-secondary/20 text-girl-secondary"
                  : "text-girl-typograph"
              )}
              onClick={() => isMobile && setMobileOpen(false)}
            >
              <ListItemIcon
                className={clsx(
                  "w-fit min-w-fit",
                  isActive(item.path)
                    ? "text-girl-secondary"
                    : "text-girl-typograph"
                )}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={<span className="font-public-sans">{item.label}</span>}
              />
            </ListItem>
          </Box>
        ))}
      </List>
      <List>
        <ListItem
          component={Link}
          to="/"
          onClick={() => isMobile && setMobileOpen(false)}
          className="text-girl-secondary gap-3"
          sx={{ gap: 0 }}
        >
          <ListItemIcon className="text-girl-secondary min-w-fit w-fit">
            <IconHomeBold />
          </ListItemIcon>
          <ListItemText
            primary={
              <span className="font-public-sans">{t("admin.backToSite")}</span>
            }
          />
        </ListItem>
      </List>
    </Box>
  );

  const menuId = "admin-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem
        onClick={() => {
          handleMenuClose();
          navigate("/profile");
        }}
      >
        {t("header.profile")}
      </MenuItem>
      <MenuItem onClick={handleLogout}>{t("header.logout")}</MenuItem>
    </Menu>
  );

  return (
    <Box className="flex">
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
        className="backdrop-blur-sm bg-white/60 shadow-sm"
        elevation={1}
        color="default"
      >
        <Toolbar className="h-16">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <IconMenu />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
            className="font-semibold font-paris flex-grow text-girl-secondary"
          >
            Pharma
          </Typography>

          <div className="">
            <IconButton aria-label="alerts">
              <IconBellBold className="w-7 h-7" />
            </IconButton>

            <IconButton aria-label="settings">
              <div className="animate-spin-slow">
                <IconSettingBold className="w-7 h-7" />
              </div>
            </IconButton>

            <IconButton
              aria-label="account"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="primary"
            >
              <div className="rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 p-[2px]">
                <Avatar
                  alt={user?.name || "Profile"}
                  src={userAvatar}
                  className="w-8 h-8 rounded-full object-cover z-10"
                />
              </div>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          container={document.getElementById("root")}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            className: "backdrop-blur-sm bg-white/90 w-[74%] rounded-r-lg px-3",
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
        }}
        className="pt-16 bg-girl-white"
      >
        <Outlet />
      </Box>
      {renderMenu}
      <Notification />
    </Box>
  );
};

export default AdminLayout;
