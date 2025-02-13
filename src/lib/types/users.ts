import { z } from "zod";

import { users } from "lib/validators/users";

export const UserRoleValues = [
  "provider.user",
  "provider.admin",
  "provider.owner",
  "provider.read-only",
  "funder.owner",
  "owner",
  "admin",
  "user",
  "",
] as const;

export type UserRoleType = (typeof UserRoleValues)[number];

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
  refreshToken: string;

  role: UserRoleType;

  token: string;
};
