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

      regions: org?.regions || [],

      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      type: org?.type! || "",

      status: org?.status || "",
    };

    if (org) {
      data.id = org.id;
    }

    return data;
  },

  schema: z.object({
    name: z.string().min(1, "Organization name is required."),

    registeredName: z.string().min(1, "Registered name is required."),

    registeredAddress: z.string().min(1, "Registered address is required."),

    registrationNumber: z.string().min(1, "Registration number is required"),

    state: z.string().min(1, "State is required"),

    country: z.string().min(1, "Country is required"),

    postalCode: z.string().min(1, "Postal code is required"),

    regions: z.array(z.string()).min(1, "Region is required"),

    type: z.enum(["funder", "provider"], { message: "Type is required" }),

    status: z.string().min(1, "Status is required"),
  }),
};
