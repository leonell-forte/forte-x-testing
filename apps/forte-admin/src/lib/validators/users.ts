import { z } from "zod";

import { isPhoneValid } from "@/lib/isPhoneValid";

import { UserRoleValues, UserStatusValues, type IUser } from "@/lib/types/users";
  
export const users = {
  defaultValues: (user?: IUser) => {
    let data: IUser = {
      firstName: user?.firstName || "",

      lastName: user?.lastName || "",

      email: user?.email || "",

      phoneNumber: user?.phoneNumber || "+1",

      organizationId: user?.organization?.toString() || "",

      role: (user?.role || "") as IUser["role"],

      status: user?.status || "invited",
    };

    if (user) {
      data.id = user?.id?.toString();
    }

    return data;
  },
  schema: z.object({
    id: z.string().optional(),

    email: z
      .string()
      .min(1, "Email is required")
      .email({ message: "Invalid email" }),

    firstName: z.string().min(1, "First name is a required field"),

    lastName: z.string().min(1, "Last name is a required field"),

    phoneNumber: z
      .string()
      .min(3, "Phone number is a required field")
      .refine((pn) => isPhoneValid(pn), {
        message: "Invalid phone number",
      }),

    organizationId: z.string().min(1, "Organization is a required field"),

    role: z.enum([...UserRoleValues], {
      message: "Role is a required field",
    }),

    status: z.enum([...UserStatusValues], {
      message: "Status is a required field",
    }),
  }),
};
