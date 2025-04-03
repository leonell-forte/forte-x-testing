import React from "react";

import SearchResultsPage from "pages/Search/SearchResultsPage";

import {
  Beneficiaries,
  Contracts,
  Invoices,
  Milestones,
  Organizations,
  PermissionEnums,
  Projects,
  Users,
} from "./role-permissions";

const UsersPage = React.lazy(() => import("../pages/Users/UsersPage"));

const InvoicesPage = React.lazy(() => import("../pages/Invoices/InvoicesPage"));

const ProjectsPage = React.lazy(() => import("../pages/Projects/ProjectsPage"));

const IndividualProjectsPage = React.lazy(
  () => import("../pages/Projects/[id]/IndividualProjectsPage")
);

const OrganizationsPage = React.lazy(
  () => import("../pages/Organizations/OrganizationsPage")
);

const FundersPage = React.lazy(() => import("../pages/Funders/FundersPage"));

const ProvidersPage = React.lazy(
  () => import("../pages/Providers/ProvidersPage")
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
  permissions: Array<PermissionEnums>;
  public?: boolean;
}

export const ROUTES: RouteConfig[] = [
  {
    link: "invoices/*",

    Component: InvoicesPage,

    permissions: [Invoices.NAVIGATE],
  },

  {
    link: "milestones/*",

    Component: MilestonePage,

    permissions: [Milestones.NAVIGATE],
  },

  // {
  //   link: "invoices/:id",

  //   Component: IndividualInvoicePage,

  //   permissions: [Invoices.NAVIGATE],
  // },
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
    link: "funders",

    Component: FundersPage,

    permissions: [Organizations.NAVIGATE],
  },

  {
    link: "providers",

    Component: ProvidersPage,

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

export const ROUTES2 = [
  {
    path: "/invoices",

    link: "invoices",

    Component: InvoicesPage,

    permissions: [Invoices.NAVIGATE],
  },
  // {
  //   link: "invoices/:id",

  //   Component: IndividualInvoicePage,

  //   permissions: [Invoices.NAVIGATE],
  // },
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
