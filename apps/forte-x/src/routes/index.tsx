import Playground from "@/features/Playground";
import ProjectDetailsPage from "@/pages/private/projects/ProjectDetailsPage";
import ProjectsPage from "@/pages/private/projects/ProjectsPage";
import LoginPage from "@/pages/public/LoginPage";

export const publicRoutes = [{ path: "/login", element: <LoginPage /> }];

export const privateRoutes = [
  { path: "/projects", element: <ProjectsPage /> },
  { path: "/playground", element: <Playground /> },
  { path: "/projects/:id", element: <ProjectDetailsPage /> },
  { path: "/student/:id", element: "student details" },
];
