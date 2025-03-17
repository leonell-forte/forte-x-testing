import React from "react";

import SearchResultsPage from "pages/Search/SearchResultsPage";

import {
  Beneficiaries,
  Contracts,
  Milestones,
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

const MilestonePage = React.lazy(
  () => import("../pages/Milestones/MilestonesPage")
);

const LoginPage = React.lazy(() => import("../pages/Login/LoginPage"));

const SignupPage = React.lazy(() => import("../pages/Signup/SignupPage"));

const ForgotPasswordPage = React.lazy(
  () => import("../pages/ForgotPassword/ForgotPasswordPage")
);

const ComponentsPage = React.lazy(
  () => import("../pages/Components/ComponentsPage")
);

export interface RouteConfig {
  link: string;
  Component: React.ComponentType;
  permissions: Array<
    Beneficiaries | Users | Organizations | Contracts | Projects | Milestones
  >;
  public?: boolean;
}

export const ROUTES: RouteConfig[] = [
  {
    link: "users",

    Component: UsersPage,

    permissions: [Users.NAVIGATE],
  },

  {
    link: "projects",

    Component: ProjectsPage,

    permissions: [Projects.NAVIGATE],
  },

  {
    link: "projects/:id",

    Component: IndividualProjectsPage,

    permissions: [Projects.NAVIGATE],
  },

  {
    link: "organizations",

    Component: OrganizationsPage,

    permissions: [Organizations.NAVIGATE],
  },

  {
    link: "contracts",

    Component: ContractsPage,

    permissions: [Contracts.NAVIGATE],
  },

  {
    link: "beneficiaries",

    Component: BeneficiariesPage,

    permissions: [Beneficiaries.NAVIGATE],
  },

  {
    link: "milestones/*",

    Component: MilestonePage,

    permissions: [Milestones.NAVIGATE],
  },

  {
    link: "search/:query",

    Component: SearchResultsPage,

    permissions: [],
  },

  {
    link: "/",

    Component: LoginPage,

    permissions: [],

    public: true,
  },
  {
    link: "/signup",

    Component: SignupPage,

    permissions: [],

    public: true,
  },
  {
    link: "/forgot-password",

    Component: ForgotPasswordPage,

    permissions: [],

    public: true,
  },
  {
    link: "/components",

    Component: ComponentsPage,

    permissions: [],

    public: true,
  },
];

export const publicRoutes = ROUTES.filter((route) => route.public).map(
  (route) => route.link
);
