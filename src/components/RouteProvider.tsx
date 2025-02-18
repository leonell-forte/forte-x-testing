import { useQuery } from "@tanstack/react-query";
import authService from "api/auth";
import { Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { IsAuthorized } from "lib/role-permissions";
import { ROUTES } from "lib/routes";

import { useInactivityTimeout } from "../lib/useInactivityTimeout";
import AlertProvider from "./AlertProvider";
import Layout from "./Dashboard/Layout";
import { SearchConsole } from "./Layout/Header/SearchConsole";
import Providers from "./Providers";
import Spinner from "./ui/spinner/spinner";

const RouteProvider = () => {
  useInactivityTimeout();
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
                  const { link, Component, permissions } = item;

                  return (
                    <Route
                      key={index}
                      path={link}
                      element={
                        <>
                          <SearchConsole />
                          {!permissions.length || IsAuthorized(permissions) ? (
                            <Component />
                          ) : (
                            <div className="flex items-center justify-center pt-24">
                              <div className="text-center">
                                <p className="text-[40px] font-bold">404</p>

                                <p className="text-[24px] font-medium">
                                  Page not found
                                </p>
                              </div>
                            </div>
                          )}
                        </>
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
