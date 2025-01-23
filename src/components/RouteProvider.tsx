import { useQuery } from "@tanstack/react-query";
import authService from "api/auth";
import { Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { ROUTES } from "lib/routes";

import AlertProvider from "./AlertProvider";
import Layout from "./Dashboard/Layout";
import Providers from "./Providers";
import Spinner from "./ui/spinner/spinner";

const RouteProvider = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],

    queryFn: authService.getProfile,

    retry: 0,

    refetchOnWindowFocus: false,
  });

  return (
    <Router>
      <Providers>
        <AlertProvider>
          <Layout user={user} isLoading={isLoading}>
            <Suspense
              fallback={
                <div className="flex h-screen w-full items-center justify-center">
                  <Spinner />
                </div>
              }
            >
              <Routes>
                {ROUTES.map((item, index) => {
                  const { link, Component, restrictedRoles } = item;

                  return (
                    <Route
                      key={index}
                      path={link}
                      element={
                        restrictedRoles?.includes(user?.role!) ? (
                          <div className="flex items-center justify-center pt-24">
                            <div className="text-center">
                              <p className="text-[40px] font-bold">404</p>

                              <p className="text-[24px] font-medium">
                                Page not found
                              </p>
                            </div>
                          </div>
                        ) : (
                          <Component />
                        )
                      }
                    />
                  );
                })}
              </Routes>
            </Suspense>
          </Layout>
        </AlertProvider>
      </Providers>
    </Router>
  );
};

export default RouteProvider;
