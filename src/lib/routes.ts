import React from "react";

import SearchResultsPage from "pages/Search/SearchResultsPage";

import {
  Beneficiaries,
  Contracts,
  Organizations,
  Projects,
  Users,
} from "./role-permissions";

const UsersPage = React.lazy(() => import("../pages/Users/UsersPage"));

const ProjectsPage = React.lazy(() => import("../pages/Projects/ProjectsPage"));

const IndividualProjectsPage = React.lazy(
  () => import("../pages/Projects/[id]/IndividualProjectsPage")
);

const OrganizationsPage = React.lazy(
  () => import("../pages/Organizations/OrganizationsPage")
);

const ContractsPage = React.lazy(
  () => import("../pages/Contracts/ContractsPage")
);

const BeneficiariesPage = React.lazy(
  () => import("../pages/Beneficiaries/BeneficiariesPage")
);

const ErrorPage = React.lazy(() => import("../pages/404"));

const LoginPage = React.lazy(() => import("../pages/Login/LoginPage"));

const SignupPage = React.lazy(() => import("../pages/Signup/SignupPage"));

const ForgotPasswordPage = React.lazy(
  () => import("../pages/ForgotPassword/ForgotPasswordPage")
);

const ComponentsPage = React.lazy(
  () => import("../pages/Components/ComponentsPage")
);

interface RouteConfig {
  link: string;
  Component: React.ComponentType;
  permissions: Array<
    Beneficiaries | Users | Organizations | Contracts | Projects
  >;
}

export const ROUTES: RouteConfig[] = [
  {
    link: "/users",

    Component: UsersPage,

    permissions: [Users.NAVIGATE],
  },

  {
    link: "/projects",

    Component: ProjectsPage,

    permissions: [Projects.NAVIGATE],
  },

  {
    link: "/projects/:id",

    Component: IndividualProjectsPage,

    permissions: [Projects.NAVIGATE],
  },

  {
    link: "/organizations",

    Component: OrganizationsPage,

    permissions: [Organizations.NAVIGATE],
  },

  {
    link: "/contracts",

    Component: ContractsPage,

    permissions: [Contracts.NAVIGATE],
  },

  {
    link: "/beneficiaries",

    Component: BeneficiariesPage,

    permissions: [Beneficiaries.NAVIGATE],
  },

  {
    link: "/search/:query",

    Component: SearchResultsPage,

    permissions: [],
  },

  {
    link: "*",

    Component: ErrorPage,

    permissions: [],
  },
  {
    link: "/",

    Component: LoginPage,

    permissions: [],
  },
  {
    link: "/signup",

    Component: SignupPage,

    permissions: [],
  },
  {
    link: "/forgot-password",

    Component: ForgotPasswordPage,

    permissions: [],
  },
  {
    link: "/components",

    Component: ComponentsPage,

    permissions: [],
  },
];
