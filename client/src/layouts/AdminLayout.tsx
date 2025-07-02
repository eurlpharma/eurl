import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Divider,
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
  Collapse,
} from "@mui/material";
import {
  ChartBarIcon,
  ShoppingBagIcon,
  TagIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Squares2X2Icon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import Notification from "@/components/ui/Notification";

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
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSubmenuToggle = (key: string) => {
    setOpenSubmenu(openSubmenu === key ? null : key);
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
      key: "dashboard",
      label: t("admin.dashboard"),
      path: "/admin",
      icon: <Squares2X2Icon className="w-6 h-6" />,
    },
    {
      key: "products",
      label: t("admin.products"),
      path: "/admin/products",
      icon: <ShoppingBagIcon className="w-6 h-6" />,
      children: [
        {
          key: "allProducts",
          label: t("admin.allProducts"),
          path: "/admin/products",
        },
        {
          key: "addProduct",
          label: t("admin.addProduct"),
          path: "/admin/products/add",
        },
      ],
    },
    {
      key: "categories",
      label: t("admin.categories"),
      path: "/admin/categories",
      icon: <TagIcon className="w-6 h-6" />,
    },
    {
      key: "orders",
      label: t("admin.orders"),
      path: "/admin/orders",
      icon: <ShoppingBagIcon className="w-6 h-6" />,
    },
    {
      key: "users",
      label: t("admin.users"),
      path: "/admin/users",
      icon: <UserGroupIcon className="w-6 h-6" />,
    },
    {
      key: "analytics",
      label: t("admin.analytics"),
      path: "/admin/analytics",
      icon: <ChartBarIcon className="w-6 h-6" />,
    },
    {
      key: "settings",
      label: t("admin.settings"),
      path: "/admin/settings",
      icon: <Cog6ToothIcon className="w-6 h-6" />,
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
          className="text-girl-secondary flex items-center font-josefin"
        >
          <Cog6ToothIcon className="w-6 h-6 mr-2" />
          {t("admin.adminPanel")}
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <XMarkIcon className="w-6 h-6" />
          </IconButton>
        )}
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <Box key={item.key}>
            {item.children ? (
              <>
                <ListItem
                  onClick={() => handleSubmenuToggle(item.key)}
                  className={`${
                    isActive(item.path) ? "bg-girl-secondary/20 text-secondary" : ""
                  }`}
                >
                  <ListItemIcon
                    className={isActive(item.path) ? "text-girl-secondary" : ""}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} className={isActive(item.path) ? "text-girl-secondary" : ""} />
                  {openSubmenu === item.key ? (
                    <ChevronUpIcon className="w-5 h-5" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5" />
                  )}
                </ListItem>
                <Collapse
                  in={openSubmenu === item.key}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItem
                        key={child.key}
                        component={Link}
                        to={child.path}
                        className={`pl-12 ${
                          location.pathname === child.path
                            ? "bg-girl-secondary/20 text-girl-secondary"
                            : ""
                        }`}
                        onClick={() => isMobile && setMobileOpen(false)}
                      >
                        <ListItemText primary={child.label} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItem
                component={Link}
                to={item.path}
                className={`${
                  isActive(item.path) ? "bg-girl-secondary/20 text-girl-secondary" : "text-girl-typograph"
                }`}
                onClick={() => isMobile && setMobileOpen(false)}
              >
                <ListItemIcon
                  className={isActive(item.path) ? "text-girl-secondary" : "text-girl-typograph"}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            )}
          </Box>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem
          component={Link}
          to="/"
          onClick={() => isMobile && setMobileOpen(false)}
          className="text-girl-secondary"
        >
          <ListItemIcon className="text-girl-secondary">
            <HomeIcon className="w-6 h-6" />
          </ListItemIcon>
          <ListItemText primary={t("admin.backToSite")} />
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
            <Bars3Icon className="w-6 h-6" />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
            className="font-semibold flex-grow"
          >
            {menuItems.find((item) =>
              item.path === "/admin"
                ? location.pathname === "/admin"
                : location.pathname.startsWith(item.path)
            )?.label || t("admin.adminPanel")}
          </Typography>

          <IconButton
            edge="end"
            aria-label="account"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="primary"
          >
            <Avatar
              alt={user?.name}
              className="w-8 h-8"
              // src="@/assets/icons/default/default-user.png"
            />
          </IconButton>
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
            keepMounted: true, // Better open performance on mobile
          }}
          PaperProps={{
            className: "backdrop-blur-sm bg-white/80",
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
