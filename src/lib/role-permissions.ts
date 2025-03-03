import { useProfile } from "components/ProfileContext";

import { UserRoleType } from "./types/users";

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

export enum Organizations {
  CREATE = "create:organization",
  UPDATE = "update:organization",
  IMPORT = "import:organization",
  DELETE = "delete:organization",
  LIST = "list:organization",
  NAVIGATE = "navigate:organization",
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

const ROLES: Record<
  UserRoleType,
  Array<Beneficiaries | Users | Organizations | Contracts | Projects>
> = {
  owner: [
    ...Object.values(Beneficiaries),
    ...Object.values(Users),
    ...Object.values(Organizations),
    ...Object.values(Contracts),
    ...Object.values(Projects),
  ],
  admin: [
    ...Object.values(Beneficiaries),
    ...Object.values(Users),
    ...Object.values(Organizations),
    ...Object.values(Contracts),
    ...Object.values(Projects),
  ],

  user: [
    ...Object.values(Beneficiaries),
    ...Object.values(Contracts),
    ...Object.values(Organizations),
    ...Object.values(Projects),
    Users.NAVIGATE,
  ],

  "read-only": [
    Beneficiaries.NAVIGATE,
    Projects.NAVIGATE,
    Projects.LIST,
    Contracts.NAVIGATE,
    Contracts.LIST,
    Organizations.NAVIGATE,
    Organizations.LIST,
  ],

  "provider.owner": [
    ...Object.values(Beneficiaries),
    ...Object.values(Contracts),
    ...Object.values(Projects),
    Users.CREATE,
    Users.IMPORT,
    Users.NAVIGATE,
    Users.UPDATE,
    Organizations.NAVIGATE,
    Organizations.LIST,
    Organizations.UPDATE,
    Organizations.DELETE,
  ],

  "provider.admin": [
    ...Object.values(Beneficiaries),
    ...Object.values(Contracts),
    ...Object.values(Projects),
    Users.CREATE,
    Users.IMPORT,
    Users.NAVIGATE,
    Users.UPDATE,
    Organizations.NAVIGATE,
    Organizations.LIST,
    Organizations.UPDATE,
  ],

  "provider.user": [
    ...Object.values(Beneficiaries),
    ...Object.values(Contracts),
    ...Object.values(Projects),
    Organizations.NAVIGATE,
    Organizations.LIST,
  ],

  "provider.read-only": [
    Beneficiaries.NAVIGATE,
    Projects.NAVIGATE,
    Projects.LIST,
    Contracts.NAVIGATE,
    Contracts.LIST,
    Organizations.NAVIGATE,
    Organizations.LIST,
  ],

  "funder.owner": [
    ...Object.values(Beneficiaries),
    ...Object.values(Users),
    ...Object.values(Contracts),
    ...Object.values(Projects),
    Organizations.NAVIGATE,
    Organizations.LIST,
    Organizations.UPDATE,
    Organizations.DELETE,
  ],

  "funder.admin": [
    ...Object.values(Beneficiaries),
    ...Object.values(Contracts),
    ...Object.values(Projects),
    Users.CREATE,
    Users.IMPORT,
    Users.NAVIGATE,
    Users.UPDATE,
    Organizations.NAVIGATE,
    Organizations.UPDATE,
    Organizations.LIST,
  ],

  "funder.user": [
    ...Object.values(Beneficiaries),
    ...Object.values(Contracts),
    ...Object.values(Projects),
    Organizations.NAVIGATE,
    Organizations.LIST,
  ],

  "funder.read-only": [
    Beneficiaries.NAVIGATE,
    Contracts.LIST,
    Contracts.NAVIGATE,
    Organizations.LIST,
    Organizations.NAVIGATE,
    Projects.LIST,
    Projects.NAVIGATE,
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
