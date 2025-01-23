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
  restrictedRoles?: string[]; // Define this as an array of strings
  isProtected?: boolean;
}

export const ROUTES: RouteConfig[] = [
  {
    link: "/users",

    Component: UsersPage,

    restrictedRoles: ["provider.user", "provider.user"],

    isProtected: true,
  },

  {
    link: "/projects",

    Component: ProjectsPage,

    restrictedRoles: [],

    isProtected: true,
  },

  {
    link: "/projects/:id",

    Component: IndividualProjectsPage,

    restrictedRoles: [],

    isProtected: true,
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

    isProtected: true,
  },

  {
    link: "/contracts",

    Component: ContractsPage,

    restrictedRoles: [],

    isProtected: true,
  },

  {
    link: "/beneficiaries",

    Component: BeneficiariesPage,

    restrictedRoles: [],

    isProtected: true,
  },

  {
    link: "/search/:query",

    Component: SearchResultsPage,

    restrictedRoles: [],

    isProtected: true,
  },

  {
    link: "*",

    Component: ErrorPage,

    isProtected: false,
  },
  {
    link: "/",

    Component: LoginPage,

    isProtected: false,
  },
  {
    link: "/signup",

    Component: SignupPage,

    isProtected: false,
  },
  {
    link: "/forgot-password",

    Component: ForgotPasswordPage,

    isProtected: false,
  },
  {
    link: "/components",

    Component: ComponentsPage,

    isProtected: false,
  },
];
