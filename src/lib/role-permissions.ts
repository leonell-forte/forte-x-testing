import { useProfile } from "components/ProfileContext";

import { UserRoleType } from "./types/users";

export type PermissionEnums =
  | Beneficiaries
  | Users
  | Contracts
  | Projects
  | Invoices
  | Milestones
  | Providers
  | Funders
  | Dashboard
  | Evidences
  | Payouts;

export enum Beneficiaries {
  CREATE = "create:beneficiary",
  UPDATE = "update:beneficiary",
  IMPORT = "import:beneficiary",
  DELETE = "delete:beneficiary",
  NAVIGATE = "navigate:beneficiary",
  EXECUTE = "execute:beneficiary",
}

export enum Users {
  CREATE = "create:user",
  UPDATE = "update:user",
  IMPORT = "import:user",
  DELETE = "delete:user",
  NAVIGATE = "navigate:user",
}

export enum Providers {
  CREATE = "create:provider",
  UPDATE = "update:provider",
  IMPORT = "import:provider",
  DELETE = "delete:provider",
  LIST = "list:provider",
  NAVIGATE = "navigate:provider",
}

export enum Funders {
  CREATE = "create:funder",
  UPDATE = "update:funder",
  IMPORT = "import:funder",
  DELETE = "delete:funder",
  LIST = "list:funder",
  NAVIGATE = "navigate:funder",
}

export enum Contracts {
  CREATE = "create:contract",
  UPDATE = "update:contract",
  IMPORT = "import:contract",
  DELETE = "delete:contract",
  LIST = "list:contract",
  NAVIGATE = "navigate:contract",
}

export enum Projects {
  CREATE = "create:project",
  UPDATE = "update:project",
  IMPORT = "import:project",
  DELETE = "delete:project",
  LIST = "list:project",
  NAVIGATE = "navigate:project",
}

export enum Invoices {
  CREATE = "create:invoice",
  UPDATE = "update:invoice",
  DELETE = "delete:invoice",
  LIST = "list:invoice",
  NAVIGATE = "navigate:invoice",
}

export enum Milestones {
  CREATE = "create:milestone",
  UPDATE = "update:milestone",
  IMPORT = "import:milestone",
  DELETE = "delete:milestone",
  LIST = "list:milestone",
  NAVIGATE = "navigate:milestone",
  DOWNLOAD = "download:milestone",
}

export enum Dashboard {
  NAVIGATE = "navigate:dashboard",
}

export enum Evidences {
  CREATE = "create:evidence",
  UPDATE = "update:evidence",
  REPLACE = "replace:evidence",
  IMPORT = "import:evidence",
  DELETE = "delete:evidence",
  LIST = "list:evidence",
  NAVIGATE = "navigate:evidence",
  DOWNLOAD = "download:evidence",
}

export enum Payouts {
  CREATE = "create:payout",
  UPDATE = "update:payout",
  IMPORT = "import:payout",
  DELETE = "delete:payout",
  LIST = "list:payout",
  NAVIGATE = "navigate:payout",
  SETUP = "setup:payout",
}

const ROLES: Record<UserRoleType, Array<PermissionEnums>> = {
  owner: [
    ...Object.values(Beneficiaries),
    ...Object.values(Users),
    ...Object.values(Providers),
    ...Object.values(Funders),
    ...Object.values(Contracts),
    ...Object.values(Projects),
    ...Object.values(Invoices),
    ...Object.values(Milestones),
    ...Object.values(Dashboard),
    ...Object.values(Payouts).filter((item) => item !== Payouts.SETUP),
    ...Object.values(Evidences).filter((item) => item !== Evidences.REPLACE),
  ],
  admin: [
    ...Object.values(Beneficiaries),
    ...Object.values(Users),
    ...Object.values(Funders),
    ...Object.values(Providers),
    ...Object.values(Contracts),
    ...Object.values(Projects),
    ...Object.values(Invoices),
    ...Object.values(Milestones),
    ...Object.values(Dashboard),
    ...Object.values(Payouts).filter((item) => item !== Payouts.SETUP),
    ...Object.values(Evidences).filter((item) => item !== Evidences.REPLACE),
  ],
  user: [
    ...Object.values(Beneficiaries),
    ...Object.values(Contracts),
    ...Object.values(Providers),
    ...Object.values(Funders),
    ...Object.values(Projects),
    ...Object.values(Milestones),
    ...Object.values(Dashboard),
    ...Object.values(Evidences).filter((item) => item !== Evidences.REPLACE),
    Invoices.LIST,
    Invoices.NAVIGATE,
    Payouts.NAVIGATE,
  ],

  "read-only": [
    Beneficiaries.NAVIGATE,
    Projects.NAVIGATE,
    Projects.LIST,
    Contracts.NAVIGATE,
    Contracts.LIST,
    Providers.NAVIGATE,
    Providers.LIST,
    Funders.NAVIGATE,
    Funders.LIST,
    Invoices.NAVIGATE,
    Invoices.LIST,
    Milestones.LIST,
    Milestones.NAVIGATE,
    Invoices.LIST,
    Invoices.NAVIGATE,
    Payouts.NAVIGATE,
    ...Object.values(Dashboard),
  ],

  "provider.owner": [
    ...Object.values(Beneficiaries),
    ...Object.values(Contracts),
    ...Object.values(Projects),
    ...Object.values(Milestones),
    ...Object.values(Payouts),
    ...Object.values(Evidences).filter((item) => item !== Evidences.UPDATE),

    Users.CREATE,
    Users.IMPORT,
    Users.NAVIGATE,
    Users.UPDATE,
    Providers.LIST,
    Providers.UPDATE,
    Providers.DELETE,
    Funders.NAVIGATE,
    Funders.LIST,
    Funders.UPDATE,
    Funders.DELETE,
    Invoices.LIST,
  ],

  "provider.admin": [
    ...Object.values(Beneficiaries),
    ...Object.values(Contracts),
    ...Object.values(Projects),
    ...Object.values(Milestones),
    ...Object.values(Payouts).filter((item) => item !== Payouts.SETUP),
    ...Object.values(Evidences).filter((item) => item !== Evidences.UPDATE),

    Users.CREATE,
    Users.IMPORT,
    Users.NAVIGATE,
    Users.UPDATE,
    Providers.LIST,
    Providers.UPDATE,
    Funders.NAVIGATE,
    Funders.LIST,
    Funders.UPDATE,
    Invoices.LIST,
  ],

  "provider.user": [
    ...Object.values(Beneficiaries),
    ...Object.values(Contracts),
    ...Object.values(Projects),
    ...Object.values(Milestones),
    ...Object.values(Evidences).filter((item) => item !== Evidences.UPDATE),

    Providers.LIST,
    Funders.NAVIGATE,
    Funders.LIST,
    Invoices.LIST,
    Payouts.LIST,
    Payouts.NAVIGATE,
  ],

  "provider.read-only": [
    Beneficiaries.NAVIGATE,
    Projects.NAVIGATE,
    Projects.LIST,
    Contracts.NAVIGATE,
    Contracts.LIST,
    Providers.LIST,
    Funders.NAVIGATE,
    Funders.LIST,
    Invoices.LIST,
    Milestones.LIST,
    Milestones.NAVIGATE,
    Payouts.LIST,
    Payouts.NAVIGATE,
    Evidences.LIST,
    Evidences.NAVIGATE,
  ],

  "funder.owner": [
    ...Object.values(Beneficiaries),
    ...Object.values(Users),
    ...Object.values(Contracts),
    ...Object.values(Projects),
    ...Object.values(Milestones),
    ...Object.values(Dashboard),
    ...Object.values(Evidences).filter((item) => item !== Evidences.REPLACE),

    Providers.NAVIGATE,
    Providers.LIST,
    Providers.UPDATE,
    Providers.DELETE,
    Funders.LIST,
    Funders.UPDATE,
    Funders.DELETE,
    Invoices.LIST,
    Invoices.NAVIGATE,
  ],

  "funder.admin": [
    ...Object.values(Beneficiaries),
    ...Object.values(Contracts),
    ...Object.values(Projects),
    ...Object.values(Milestones),
    ...Object.values(Dashboard),

    ...Object.values(Evidences).filter((item) => item !== Evidences.REPLACE),
    Users.CREATE,
    Users.IMPORT,
    Users.NAVIGATE,
    Users.UPDATE,
    Providers.NAVIGATE,
    Providers.UPDATE,
    Providers.LIST,
    Funders.UPDATE,
    Funders.LIST,
    Invoices.LIST,
    Invoices.NAVIGATE,
  ],

  "funder.user": [
    ...Object.values(Beneficiaries),
    ...Object.values(Contracts),
    ...Object.values(Projects),
    ...Object.values(Dashboard),
    Providers.NAVIGATE,
    Providers.LIST,
    Funders.LIST,
    Invoices.LIST,
    Invoices.NAVIGATE,
    Evidences.LIST,
    Evidences.NAVIGATE,
  ],

  "funder.read-only": [
    Beneficiaries.NAVIGATE,
    Contracts.LIST,
    Contracts.NAVIGATE,
    Providers.LIST,
    Providers.NAVIGATE,
    Funders.LIST,
    Projects.LIST,
    Projects.NAVIGATE,
    Invoices.LIST,
    Invoices.NAVIGATE,
    Milestones.LIST,
    Milestones.NAVIGATE,
    ...Object.values(Dashboard),
    Evidences.LIST,
    Evidences.NAVIGATE,
  ],
};

type Permission = (typeof ROLES)[UserRoleType] extends (infer U)[] ? U : never;

export const IsAuthorized = (permissions: Permission[]): boolean => {
  const { profile: currentUser } = useProfile();

  if (permissions.length === 0) return true;
  if (!currentUser?.role) return false;

  return ROLES?.[currentUser.role]?.some((item: Permission) =>
    permissions.includes(item)
  );
};
