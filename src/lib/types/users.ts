import { z } from "zod";

import { users } from "lib/validators/users";

export interface IUser {
  id?: string;

  firstName: string;

  lastName: string;

  email: string;

  role: string;

  phoneNumber: string;

  organization?: string;

  organizationId?: string;

  createdAt?: Date;

  updatedAt?: Date;
}

export type UserFieldTypes = z.infer<typeof users.schema>;
