import React, { Suspense } from "react";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import DashboardLayout from "./components/Dashboard/Layout";
import Providers from "./components/Providers";
import QueryProvider from "./components/QueryProvider";
import AlertProvider from "./components/AlertProvider";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "./lib/routes";
import Spinner from "./components/ui/spinner/spinner";

// Lazy load components

function App() {
  return (
    <QueryProvider>
      <div>
        <div className="bg-body-gradient w-screen h-screen fixed top-0 left-0 z-[-1]"></div>
        <Router>
          <Providers>
            <AlertProvider>
              <Suspense
                fallback={
                  <DashboardLayout>
                    <div className="w-full h-full flex items-center justify-center">
                      <Spinner />
                    </div>
                  </DashboardLayout>
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
                    const { link, Component } = item;
                    return (
                      <Route
                        key={index}
                        path={link}
                        element={
                          <DashboardLayout>
                            <Component />
                          </DashboardLayout>
                        }
                      />
                    );
                  })}
                </Routes>
              </Suspense>
            </AlertProvider>
          </Providers>
        </Router>
      </div>
    </QueryProvider>
  );
}

export default App;
