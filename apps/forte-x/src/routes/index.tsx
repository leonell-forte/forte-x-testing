import ProjectDetailsPage from "@/pages/private/projects/ProjectDetailsPage/ProjectDetailsPage";
import ProjectsPage from "@/pages/private/projects/ProjectsPage";
import LoginPage from "@/pages/public/LoginPage";
import PlaygroundPage from "@/pages/public/PlaygroundPage";

export const publicRoutes = [
  { path: "login", element: <LoginPage /> },
  { path: "demo", element: <PlaygroundPage /> },
];

export const privateRoutes = [
  { path: "projects", element: <ProjectsPage /> },
  { path: "projects/:id", element: <ProjectDetailsPage /> },
  { path: "student/:id", element: "student details" },
];
