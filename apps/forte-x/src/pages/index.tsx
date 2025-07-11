import { isAuthenticated } from "@repo/ui/lib/auth";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "@/components/ProtectedRoute";
import Shell from "@/components/Shell";
import { privateRoutes, publicRoutes } from "@/routes";

const Pages: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="*" element={<Shell />}>
        {publicRoutes.map((route, index) => (
          <Route
            key={`public-${index}`}
            path={route.path}
            element={route.element}
          />
        ))}

        {/* Private Routes */}
        {privateRoutes.map((route, index) => (
          <Route
            key={`private-${index}`}
            path={route.path}
            element={<ProtectedRoute>{route.element}</ProtectedRoute>}
          />
        ))}

        {/* Root redirect */}
        <Route
          path=""
          element={
            isAuthenticated() ? (
              <Navigate to="projects" replace />
            ) : (
              <Navigate to="login" replace />
            )
          }
        />
      </Route>
    </Routes>
  );
};

export default Pages;
