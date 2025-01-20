import { useQuery } from "@tanstack/react-query";
import authService from "api/auth";
import { Suspense } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "lib/routes";

import AlertProvider from "./AlertProvider";
import DashboardLayout from "./Dashboard/Layout";
import Providers from "./Providers";
import Spinner from "./ui/spinner/spinner";

const RouteProvider = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],

    queryFn: authService.getProfile,
  });
  return (
    <Router>
      <Providers>
        <AlertProvider>
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <Routes>
              {PUBLIC_ROUTES.map((item, index) => {
                const { link, Component } = item;
                return (
                  <Route key={index} path={link} element={<Component />} />
                );
              })}

              {PROTECTED_ROUTES.map((item, index) => {
                const { link, Component, restrictedRoles } = item;

                return (
                  <Route
                    key={index}
                    path={link}
                    element={
                      restrictedRoles?.includes(user?.role as string) ? (
                        <Navigate to="/not-found" />
                      ) : (
                        <DashboardLayout
                          restrictedRoles={restrictedRoles}
                          user={user}
                          isLoading={isLoading}
                        >
                          <Component />
                        </DashboardLayout>
                      )
                    }
                  />
                );
              })}
            </Routes>
          </Suspense>
        </AlertProvider>
      </Providers>
    </Router>
  );
};

export default RouteProvider;
