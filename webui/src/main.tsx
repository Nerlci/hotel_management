import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./routes/Root.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./ErrorPage.tsx";
import Login from "./routes/Login.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { CustomerDashboard } from "./routes/CustomerDashboard.tsx";
import { CustomerBooking } from "./routes/CustomerBooking.tsx";
import { Register } from "./routes/Register.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "customer",
    element: <CustomerDashboard />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "booking",
    element: <CustomerBooking />,
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
