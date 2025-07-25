import { Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";

import ProtectedRoute from "@/components/ProtectedRoute";
import Shell from "@/components/Shell";
import { ProjectsLayout, ProjectsPage } from "@/pages/private/projects";
import AddProjectPage from "@/pages/private/projects/AddProjectPage/AddProjectPage";
import CaseStudies from "@/pages/private/projects/ProjectDetailsPage/CaseStudies/CaseStudies";
import Finances from "@/pages/private/projects/ProjectDetailsPage/Finances/Finances";
import Overview from "@/pages/private/projects/ProjectDetailsPage/Overview/Overview";
import ProjectDetailsPage from "@/pages/private/projects/ProjectDetailsPage/ProjectDetailsPage";
import Providers from "@/pages/private/projects/ProjectDetailsPage/Providers/Providers";
import StudentDetailsPage from "@/pages/private/projects/ProjectDetailsPage/Students/StudentDetailsPage/StudentDetailsPage";
import Students from "@/pages/private/projects/ProjectDetailsPage/Students/Students";
import LoginPage from "@/pages/public/LoginPage";
import PlaygroundPage from "@/pages/public/PlaygroundPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Shell />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "demo", element: <PlaygroundPage /> },
      {
        path: "projects",
        element: <ProjectsLayout />,
        handle: { breadcrumb: "Projects" },
        children: [
          {
            index: true,
            element: <ProjectsPage />,
          },
          {
            path: ":projectId",
            element: (
              <ProtectedRoute>
                <ProjectDetailsPage />
              </ProtectedRoute>
            ),
            loader: async ({ params }) => {
              if (!params.projectId) throw new Error("Project ID is required");
              const projectName = await new Promise((resolve) => {
                setTimeout(() => {
                  resolve(`Project ${params.projectId}`);
                }, 1000);
              });
              return { projectName };
            },
            handle: {
              breadcrumb: ({ data, params }: { data: any; params: any }) =>
                data?.projectName || `Project ${params.projectId}`,
            },
            children: [
              { index: true, element: <Navigate to="overview" replace /> },
              {
                path: "overview",
                element: <Overview />,
                handle: { breadcrumb: "Overview" },
              },
              {
                path: "students",
                element: <Students />,
                handle: { breadcrumb: "Students" },
                children: [
                  {
                    path: ":studentId",
                    element: <StudentDetailsPage />,
                    loader: async ({ params }) => {
                      if (!params.studentId)
                        throw new Error("Student ID is required");
                      const studentName = await new Promise((resolve) => {
                        setTimeout(() => {
                          resolve(`Student ${params.studentId}`);
                        }, 1000);
                      });
                      return { studentName };
                    },
                    handle: {
                      breadcrumb: ({
                        data,
                        params,
                      }: {
                        data: any;
                        params: any;
                      }) => data?.studentName || `Student ${params.studentId}`,
                    },
                  },
                ],
              },
              {
                path: "finances",
                element: <Finances />,
                handle: { breadcrumb: "Finances" },
              },
              {
                path: "case-studies",
                element: <CaseStudies />,
                handle: { breadcrumb: "Case Studies" },
              },
              {
                path: "providers",
                element: <Providers />,
                handle: { breadcrumb: "Providers" },
              },
            ],
          },
          {
            path: "add",
            element: (
              <ProtectedRoute>
                <AddProjectPage />
              </ProtectedRoute>
            ),
            handle: { breadcrumb: "Add Project" },
          },
        ],
      },

      {
        index: true,
        element: <Navigate to="projects" replace />,
      },
      {
        path: "*",
        element: <Navigate to="projects" replace />,
      },
    ],
  },
];
