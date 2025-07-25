import { Outlet } from "react-router-dom";

import ProjectsList from "@/features/projects/ProjectsList";

const ProjectsLayout = () => {
  return <Outlet />;
};

const ProjectsPage = () => {
  return <ProjectsList />;
};

export { ProjectsPage, ProjectsLayout };
