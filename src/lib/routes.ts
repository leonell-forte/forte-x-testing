import React from "react";

import SearchResultsPage from "pages/Search/SearchResultsPage";

import {
  Beneficiaries,
  Contracts,
  Funders,
  Invoices,
  Milestones,
  PermissionEnums,
  Projects,
  Providers,
  Users,
} from "./role-permissions";

import DashboardPage from "pages/Dashboard/DashboardPage";

const UsersPage = React.lazy(() => import("../pages/Users/UsersPage"));

const InvoicesPage = React.lazy(() => import("../pages/Invoices/InvoicesPage"));

const ProjectsPage = React.lazy(() => import("../pages/Projects/ProjectsPage"));

const IndividualProjectsPage = React.lazy(
  () => import("../pages/Projects/[id]/IndividualProjectsPage")
);

const FundersPage = React.lazy(() => import("../pages/Funders/FundersPage"));

const IndividualFundersPage = React.lazy(
  () => import("../pages/Funders/[id]/IndividualFundersPage")
);

const OnBoardingSuccessPage = React.lazy(
  () => import("../pages/Onboarding/OnBoardingSuccess")
);

const ProvidersPage = React.lazy(
  () => import("../pages/Providers/ProvidersPage")
);

const IndividualProvidersPage = React.lazy(
  () => import("../pages/Providers/[id]/IndividualProvidersPage")
);

const ContractsPage = React.lazy(
  () => import("../pages/Contracts/ContractsPage")
);

const IndividualContractsPage = React.lazy(
  () => import("../pages/Contracts/[id]/IndividualContractsPage")
);

const BeneficiariesPage = React.lazy(
  () => import("../pages/Beneficiaries/BeneficiariesPage")
);

const MilestonePage = React.lazy(
  () => import("../pages/Milestones/MilestonesPage")
);

const PayoutsPage = React.lazy(() => import("../pages/Payouts/PayoutsPage"));

const IndividualPayoutsPage = React.lazy(
  () => import("../pages/Payouts/[id]/IndividualPayoutsPage")
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
    link: "dashboard",

    Component: DashboardPage,

    permissions: [],
  },
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

    permissions: [Funders.NAVIGATE],
  },

  {
    link: "funders/:id",

    Component: IndividualFundersPage,

    permissions: [Funders.NAVIGATE],
  },

  {
    link: "providers",

    Component: ProvidersPage,

    permissions: [Providers.NAVIGATE],
  },

  {
    link: "providers/:id",

    Component: IndividualProvidersPage,

    permissions: [Providers.NAVIGATE],
  },

  {
    link: "contracts",

    Component: ContractsPage,

    permissions: [Contracts.NAVIGATE],
  },

  {
    link: "beneficiaries/*",

    Component: BeneficiariesPage,

    permissions: [Beneficiaries.NAVIGATE],
  },

  {
    link: "contracts/:id",

    Component: IndividualContractsPage,

    permissions: [Contracts.NAVIGATE],
  },

  {
    link: "payouts",

    Component: PayoutsPage,

    permissions: [],
  },

  {
    link: "payouts/:id",

    Component: IndividualPayoutsPage,

    permissions: [],
  },

  {
    link: "onboarding",

    Component: OnBoardingSuccessPage,

    permissions: [],
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
