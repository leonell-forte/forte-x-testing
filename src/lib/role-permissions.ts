import { useProfile } from "./hooks";
import { UserRoleType } from "./types/users";

export enum Beneficiaries {
  CREATE = "create:beneficiary",
  UPDATE = "update:beneficiary",
  IMPORT = "import:beneficiary",
  DELETE = "delete:beneficiary",
  NAVIGATE = "navigate:beneficiary",
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
    Beneficiaries.NAVIGATE,
    Projects.NAVIGATE,
    Contracts.NAVIGATE,
    Users.NAVIGATE,
    Users.UPDATE,
  ],
  "provider.owner": [
    ...Object.values(Beneficiaries),
    ...Object.values(Contracts),
    ...Object.values(Projects),
    ...Object.values(Users),
  ],
  "provider.admin": [
    ...Object.values(Beneficiaries),
    ...Object.values(Contracts),
    ...Object.values(Projects),
    ...Object.values(Users),
  ],
  "provider.user": [
    Beneficiaries.NAVIGATE,
    Projects.NAVIGATE,
    Contracts.NAVIGATE,
    Users.NAVIGATE,
    Users.UPDATE,
  ],
  "provider.read-only": [
    Beneficiaries.NAVIGATE,
    Projects.NAVIGATE,
    Contracts.NAVIGATE,
    Organizations.LIST,
  ],
  "funder.owner": [
    ...Object.values(Beneficiaries),
    ...Object.values(Users),
    ...Object.values(Organizations),
    ...Object.values(Contracts),
    ...Object.values(Projects),
  ],
};

type Permission = (typeof ROLES)[UserRoleType] extends (infer U)[] ? U : never;

export const IsAuthorized = (permissions: Permission[]): boolean => {
  const currentUser = useProfile();
  if (!currentUser?.role) return false;

  return ROLES?.[currentUser.role]?.some((item: Permission) =>
    permissions.includes(item)
  );
};
