import { z } from "zod";

import { IUser } from "../types/users";

export const users = {
  defaultValues: (user?: IUser) => {
    let data: IUser = {
      firstName: user?.firstName || "",

      lastName: user?.lastName || "",

      email: user?.email || "",

      phoneNumber: user?.phoneNumber || "",

      organizationId: user?.organization?.toString() || "",

      role: user?.role || "",
    };

    if (user) {
      data.id = user?.id?.toString();
    }

    return data;
  },
  schema: z.object({
    id: z.string().optional(),

    firstName: z.string().min(1, "First name is a required field"),

    lastName: z.string().min(1, "Last name is a required field"),

    email: z.string().email(),

    phoneNumber: z.string().min(1, "Phone number is a required field"),

    organizationId: z.string().min(1, "Organization is a required field"),

    role: z.string().min(1, "Role is a required field"),
  }),
};
