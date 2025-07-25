import { isAuthenticated } from "@repo/ui/lib/auth";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "@/components/ProtectedRoute";
import Shell from "@/components/Shell";
import { privateRoutes, publicRoutes } from "@/routes";
import type { RouteConfig } from "@/types/routes";

function renderRoutes(
  routes: RouteConfig[],
  isPrivate: boolean = false
): JSX.Element[] {
  return routes.map((route, idx) => {
    const element = isPrivate ? (
      <ProtectedRoute>{route.element}</ProtectedRoute>
    ) : (
      route.element
    );

    if (route.index) {
      return <Route key={`index-${idx}`} index element={element} />;
    }

    return (
      <Route
        key={route.path || `route-${idx}`}
        path={route.path}
        element={element}
      >
        {route.children && renderRoutes(route.children, isPrivate)}
      </Route>
    );
  });
}

const Pages: React.FC = () => {
  return (
    <Routes>
      <Route path="*" element={<Shell />}>
        {renderRoutes(publicRoutes, false)}
        {renderRoutes(privateRoutes, true)}
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
