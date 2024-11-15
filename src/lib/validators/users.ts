import { IUser } from "@/pages/Users/types";
import { z } from "zod";

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

    firstName: z.string().min(1),

    lastName: z.string().min(1),

    email: z.string().email(),

    phoneNumber: z.string().min(1),

    organizationId: z.string().min(1),

    role: z.string().min(1),
  }),
};
