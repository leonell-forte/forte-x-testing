import { z } from "zod";

import { users } from "lib/validators/users";

import { OrgTypes } from "./organizations";

export const UserRoleValues = [
  "provider.user",
  "provider.admin",
  "provider.owner",
  "provider.read-only",
  "funder.owner",
  "funder.admin",
  "funder.user",
  "funder.read-only",
  "owner",
  "admin",
  "user",
  "read-only",
] as const;

export type UserRoleType = (typeof UserRoleValues)[number];

export const UserStatusValues = ["active", "suspended", "invited"] as const;

export type UserStatus = (typeof UserStatusValues)[number];

export interface IUser {
  id?: string;

  firstName: string;

  lastName: string;

  email?: string;

  role?: UserRoleType;

  phoneNumber: string;

  organization?: string;

  organizationId?: string;

  orgType?: OrgTypes;

  createdAt?: Date;

  agreedTermsAt?: Date;

  updatedAt?: Date;

  status?: UserStatus;

  termsVersion?: string;

  signUpSource?: string;
}

export type UserFieldTypes = z.infer<typeof users.schema>;

// export type LoginReturnType = {
//   refreshToken: string;

//   role: UserRoleType;

//   token: string;
// };

export type LoginReturnType = {
  sessionToken: string;
};
