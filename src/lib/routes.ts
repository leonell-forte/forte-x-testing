import React from "react";

import SearchResultsPage from "pages/Search/SearchResultsPage";

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

interface RouteConfig {
  link: string;
  Component: React.ComponentType;
  restrictedRoles: string[]; // Define this as an array of strings
}

export const PROTECTED_ROUTES: RouteConfig[] = [
  {
    link: "/users",

    Component: UsersPage,

    restrictedRoles: ["provider.user", "provider.user"],
  },

  {
    link: "/projects",

    Component: ProjectsPage,

    restrictedRoles: [],
  },

  {
    link: "/projects/:id",

    Component: IndividualProjectsPage,

    restrictedRoles: [],
  },

  {
    link: "/organizations",

    Component: OrganizationsPage,

    restrictedRoles: [
      "provider.user",
      "provider.owner",
      "provider.admin",
      "provider.readonly",
    ],
  },

  {
    link: "/contracts",

    Component: ContractsPage,

    restrictedRoles: [],
  },

  {
    link: "/beneficiaries",

    Component: BeneficiariesPage,

    restrictedRoles: [],
  },

  {
    link: "/search/:query",

    Component: SearchResultsPage,

    restrictedRoles: [],
  },
];

const ErrorPage = React.lazy(() => import("../pages/404"));

const LoginPage = React.lazy(() => import("../pages/Login/LoginPage"));

const SignupPage = React.lazy(() => import("../pages/Signup/SignupPage"));

const ForgotPasswordPage = React.lazy(
  () => import("../pages/ForgotPassword/ForgotPasswordPage")
);

const ComponentsPage = React.lazy(
  () => import("../pages/Components/ComponentsPage")
);

export const PUBLIC_ROUTES = [
  {
    link: "*",

    Component: ErrorPage,
  },
  {
    link: "/",

    Component: LoginPage,
  },
  {
    link: "/signup",

    Component: SignupPage,
  },
  {
    link: "/forgot-password",

    Component: ForgotPasswordPage,
  },
  {
    link: "/components",

    Component: ComponentsPage,
  },
];
