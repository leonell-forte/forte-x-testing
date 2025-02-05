import { UserRoleType } from "./types/users";

export enum Beneficiaries {
  CREATE = "create:beneficiary",
  UPDATE = "update:beneficiary",
  IMPORT = "import:beneficiary",
  DELETE = "delete:beneficiary",
}

export enum Users {
  CREATE = "create:user",
  UPDATE = "update:user",
  IMPORT = "import:user",
  DELETE = "delete:user",
}

export enum Organizations {
  CREATE = "create:organization",
  UPDATE = "update:organization",
  IMPORT = "import:organization",
  DELETE = "delete:organization",
  LIST = "list:organization",
}

export enum Contracts {
  CREATE = "create:contract",
  UPDATE = "update:contract",
  IMPORT = "import:contract",
  DELETE = "delete:contract",
  LIST = "list:contract",
}

export enum Projects {
  CREATE = "create:project",
  UPDATE = "update:project",
  IMPORT = "import:project",
  DELETE = "delete:project",
  LIST = "list:project",
}

const ROLES: Record<
  UserRoleType,
  Array<Beneficiaries | Users | Organizations | Contracts | Projects>
> = {
  admin: [
    ...Object.values(Beneficiaries),
    ...Object.values(Users),
    ...Object.values(Organizations),
    ...Object.values(Contracts),
    ...Object.values(Projects),
  ],
  "provider.owner": [],
  "provider.admin": [],
  "provider.user": [],
  "read-only": [],
};

type Permission = (typeof ROLES)[UserRoleType] extends (infer U)[] ? U : never;

export const isAuthorized = (
  role: UserRoleType | undefined,
  permissions: Permission[]
): boolean => {
  if (!role) return false;

  return ROLES[role].some((item: Permission) => permissions.includes(item));
};
