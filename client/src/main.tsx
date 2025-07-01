import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { store } from "./store";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { HeroUIProvider } from "@heroui/react";
import "./styles/index.css";
import 'animate.css'



// Polyfill for global to fix Draft.js error
if (typeof window !== "undefined" && !window.global) {
  (window as any).global = window;
}

// إخفاء إنذارات React Router وإنذارات CSS
const originalConsoleWarn = console.warn;
console.warn = function filterWarnings(msg, ...args) {
  // تجاهل إنذارات React Router وإنذارات CSS
  if (
    typeof msg === "string" &&
    (msg.includes("React Router Future Flag Warning") ||
      msg.includes("SecurityError: Failed to read the 'cssRules'") ||
      msg.includes("Could not access stylesheet rules"))
  ) {
    return;
  }
  return originalConsoleWarn(msg, ...args);
};

// إخفاء أخطاء CSS في وحدة التحكم
const originalConsoleError = console.error;
console.error = function filterErrors(msg, ...args) {
  // تجاهل أخطاء CSS
  if (
    typeof msg === "string" &&
    (msg.includes("Could not access stylesheet rules") ||
      msg.includes("Failed to read the 'cssRules'") ||
      msg.includes("SecurityError"))
  ) {
    return;
  }
  return originalConsoleError(msg, ...args);
};

// تطبيق إعدادات React Router لتجاهل الإنذارات المستقبلية
const routerOptions = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <Provider store={store}>
        <BrowserRouter {...routerOptions}>
          <I18nextProvider i18n={i18n}>
            <ThemeProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </ThemeProvider>
          </I18nextProvider>
        </BrowserRouter>
      </Provider>
    </HeroUIProvider>
  </React.StrictMode>
);
