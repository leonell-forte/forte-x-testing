import { z } from "zod";

import { users } from "lib/validators/users";

export type UserRoleType =
  | "provider.user"
  | "provider.admin"
  | "provider.owner"
  | "provider.read-only"
  | "funder.owner"
  | "owner"
  | "admin";

export interface IUser {
  id?: string;

  firstName: string;

  lastName: string;

  email: string;

  role?: UserRoleType | "";

  phoneNumber: string;

  organization?: string;

  organizationId?: string;

  createdAt?: Date;

  updatedAt?: Date;
}

export type UserFieldTypes = z.infer<typeof users.schema>;

export type LoginReturnType = {
  expiryDate: string;

  role: UserRoleType;

  token: string;
};
