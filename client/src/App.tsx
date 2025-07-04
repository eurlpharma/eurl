import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Preloader from "./components/global/Preloader";
import MainLayout from "@/layouts/MainLayout";
import AdminLayout from "@/layouts/AdminLayout";
import { getMuiTheme } from "./theme/muiTheme";
import { createEmotionCache } from "./theme/emotionCache";
import i18n from "./i18n";
import AOS from "aos";
import "aos/dist/aos.css";
import { trackPageView } from "./utils/facebookPixel";

// Lazy-loaded pages
const HomePage = lazy(() => import("@/pages/HomePage"));
const ProductsPage = lazy(() => import("@/pages/ProductsPage"));
const ProductDetailPage = lazy(() => import("@/pages/ProductDetailPage"));
const CartPage = lazy(() => import("@/pages/CartPage"));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const ForgotPasswordPage = lazy(
  () => import("@/pages/auth/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordPage"));
const OrderDetailPage = lazy(() => import("@/pages/admin/OrderDetailPage"));
const OrderPrintPage = lazy(() => import("@/pages/admin/OrderPrintPage"));
const SettingsPage = lazy(() => import("@/pages/admin/SettingsPage"));
const AdminDashboardPage = lazy(() => import("@/pages/admin/DashboardPage"));
const AdminAnalyticsPage = lazy(() => import("@/pages/admin/AnalyticsPage"));
const AdminProductsPage = lazy(() => import("@/pages/admin/ProductsPage"));
const AdminProductFormPage = lazy(
  () => import("@/pages/admin/ProductFormPage")
);
const AdminCategoriesPage = lazy(() => import("@/pages/admin/CategoriesPage"));
const AdminOrdersPage = lazy(() => import("@/pages/admin/OrdersPage"));
const AdminUsersPage = lazy(() => import("@/pages/admin/UsersPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));

const App = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Analytics
  useEffect(() => {
    trackPageView(location.pathname);
    const pageName = location.pathname.split("/")[1] || "home";
    window.fbq?.("trackCustom", `PageView`, {
      PAGE: pageName,
      PATH: location.pathname,
      TITLE: document.title,
    });
  }, [location]);

  // Init AOS
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // RTL / LTR logic
  const lang = i18n.language;
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.setAttribute("dir", dir);
    document.body.setAttribute("dir", dir);
  }, [dir]);
  

  const cache = createEmotionCache(dir);
  const theme = getMuiTheme(dir);

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Suspense fallback={<Preloader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:id" element={<ProductDetailPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route
                path="/auth-login"
                element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
              />
              <Route
                path="/auth-forgot-password"
                element={
                  !isAuthenticated ? (
                    <ForgotPasswordPage />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/auth-reset-password/:token"
                element={
                  !isAuthenticated ? <ResetPasswordPage /> : <Navigate to="/" />
                }
              />
              <Route
                path="orders/:id"
                element={
                  <ProtectedRoute>
                    <OrderDetailPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute isAdminRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="analytics" element={<AdminAnalyticsPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="products/add" element={<AdminProductFormPage />} />
              <Route
                path="products/edit/:id"
                element={<AdminProductFormPage />}
              />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route
                path="orders/:id"
                element={
                  <ProtectedRoute>
                    <OrderDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="orders/:id/print"
                element={
                  <ProtectedRoute>
                    <OrderPrintPage />
                  </ProtectedRoute>
                }
              />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;
