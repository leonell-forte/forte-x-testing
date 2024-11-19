import { IOrganization } from "@/pages/Organizations/types";
import { z } from "zod";

export const organizations = {
  defaultValues: (org?: IOrganization) => {
    let data: IOrganization = {
      name: org?.name || "",

      registeredName: org?.registeredName || "",

      registeredAddress: org?.registeredAddress || "",

      registrationNumber: org?.registrationNumber || "",

      state: org?.state || "",

      country: org?.country || "",

      postalCode: org?.postalCode || "",

      region: org?.region || "",

      type: org?.type! || "",

      status: org?.status || "",
    };

    if (org) {
      data.id = org.id;
    }

    return data;
  },

  schema: z.object({
    name: z.string().min(1),

    registeredName: z.string().min(1),

    registeredAddress: z.string().min(1),

    registrationNumber: z.string().min(1),

    state: z.string().min(1, "Required"),

    country: z.string().min(1, "Required"),

    postalCode: z.string().min(1, "Required"),

    region: z.string().min(1),

    type: z.enum(["funder", "provider"], { message: "Please select type" }),

    status: z.string().min(1),
  }),
};
