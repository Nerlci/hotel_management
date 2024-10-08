import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./routes/Root.tsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorPage from "./ErrorPage.tsx";
import Login from "./routes/Login.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { Register } from "./routes/Register.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { AuthProvider } from "./components/AuthProvider.tsx";
import { Aircon } from "./routes/Aircon.tsx";
import { Customer } from "./routes/Customer.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import Reception from "./routes/Reception.tsx";
import { Manager } from "./routes/Manager.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Root />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/customer"
                element={
                  <ProtectedRoute roles={["customer"]}>
                    <Customer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/airconmanager"
                element={
                  <ProtectedRoute roles={["aircon-manager", "admin"]}>
                    <Aircon />
                  </ProtectedRoute>
                }
              />
              <Route path="/register" element={<Register />} />
              <Route
                path="/reception"
                element={
                  <ProtectedRoute roles={["reception"]}>
                    <Reception />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager"
                element={
                  <ProtectedRoute roles={["manager"]}>
                    <Manager />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
