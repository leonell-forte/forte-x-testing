import React from "react";

const UsersPage = React.lazy(() => import("../pages/Users/UsersPage"));

const ProjectsPage = React.lazy(() => import("../pages/Projects/ProjectsPage"));

const IndividualProjectsPage = React.lazy(
  () => import("../pages/Projects/[id]/IndividualProjectsPage"),
);

const OrganizationsPage = React.lazy(
  () => import("../pages/Organizations/OrganizationsPage"),
);

const ContractsPage = React.lazy(
  () => import("../pages/Contracts/ContractsPage"),
);

const BeneficiariesPage = React.lazy(
  () => import("../pages/Beneficiaries/BeneficiariesPage"),
);

export const PROTECTED_ROUTES = [
  {
    link: "/users",

    Component: UsersPage,
  },

  {
    link: "/projects",

    Component: ProjectsPage,
  },

  {
    link: "/projects/:id",

    Component: IndividualProjectsPage,
  },

  {
    link: "/organizations",

    Component: OrganizationsPage,
  },

  {
    link: "/contracts",

    Component: ContractsPage,
  },

  {
    link: "/beneficiaries",

    Component: BeneficiariesPage,
  },
];

const ErrorPage = React.lazy(() => import("../pages/404"));

const LoginPage = React.lazy(() => import("../pages/Login/LoginPage"));

const SignupPage = React.lazy(() => import("../pages/Signup/SignupPage"));

const ForgotPasswordPage = React.lazy(
  () => import("../pages/ForgotPassword/ForgotPasswordPage"),
);

const ComponentsPage = React.lazy(
  () => import("../pages/Components/ComponentsPage"),
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
