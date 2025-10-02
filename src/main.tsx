import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import "./index.css";
import Landing from "./pages/Landing.tsx";
import MainContent from "./pages/MainContent.tsx";
import { Toaster } from "sonner";
import NotFound from "./pages/NotFound.tsx";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { SignIn } from "./components/auth/SignIn";
import { SignUp } from "./components/auth/SignUp";
import { AuthCallback } from "./components/auth/AuthCallback";
import { AuthInitializer } from "./components/AuthInitializer";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthInitializer>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="/main"
              element={
                <ProtectedRoute>
                  <MainContent />
                </ProtectedRoute>
              }
            />

            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AuthInitializer>
    </Provider>
  </StrictMode>
);
