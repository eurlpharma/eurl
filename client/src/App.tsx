import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import AdminLayout from "@/layouts/AdminLayout";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import OrderPrintPage from "@/pages/admin/OrderPrintPage";
import SettingsPage from "@/pages/admin/SettingsPage";
import Preloader from "./components/global/Preloader";

// Lazy-loaded components for better performance
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

// Admin pages
const AdminDashboardPage = lazy(() => import("./pages/admin/DashboardPage"));
const AdminAnalyticsPage = lazy(() => import("./pages/admin/AnalyticsPage"));
const AdminProductsPage = lazy(() => import("./pages/admin/ProductsPage"));
const AdminProductFormPage = lazy(
  () => import("./pages/admin/ProductFormPage")
);
const AdminCategoriesPage = lazy(() => import("./pages/admin/CategoriesPage"));
const AdminOrdersPage = lazy(() => import("./pages/admin/OrdersPage"));
const AdminUsersPage = lazy(() => import("./pages/admin/UsersPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));

import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import { trackPageView } from "./utils/facebookPixel";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);

    const pageName = location.pathname.split("/")[1] || "home";

    window.fbq?.("trackCustom", `PageView`, {
      PAGE: pageName,
      PATH: location.pathname,
      TITLE: document.title,
    });
  }, [location]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const { isAuthenticated } = useAuth();

  return (
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
          {/* Auth routes */}
          <Route
            path="/auth-login"
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
          />

          <Route
            path="/auth-forgot-password"
            element={
              !isAuthenticated ? <ForgotPasswordPage /> : <Navigate to="/" />
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
          <Route path="products/edit/:id" element={<AdminProductFormPage />} />
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

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
