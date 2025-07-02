import ProjectsPage from "@/pages/private/projects/ProjectsPage";
import LoginPage from "@/pages/public/LoginPage";

export const publicRoutes = [{ path: "/login", element: <LoginPage /> }];

export const privateRoutes = [{ path: "/projects", element: <ProjectsPage /> }];
