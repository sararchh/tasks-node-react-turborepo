import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../modules/auth/contexts";
import { queryClient } from "./query-client";
import { LoginPageRoute, RegisterPageRoute, DashboardPageRoute } from "../modules/auth";

export const router = createBrowserRouter([
  {
    element: (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      </QueryClientProvider>
    ),
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: LoginPageRoute.path,
        element: LoginPageRoute.element,
      },
      {
        path: RegisterPageRoute.path,
        element: RegisterPageRoute.element,
      },
      {
        path: DashboardPageRoute.path,
        element: DashboardPageRoute.element,
      },
    ],
  },
]);
