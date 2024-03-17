import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./routes/Root.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./ErrorPage.tsx";
import Login, { UserType } from "./routes/Login.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "login",
    children: [
      {
        path: "customer",
        element: <Login type={UserType.Customer} />,
      },
      {
        path: "staff",
        element: <Login type={UserType.Staff} />,
      },
      {
        path: "admin",
        element: <Login type={UserType.Admin} />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);
