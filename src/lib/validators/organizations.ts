import { z } from "zod";

import { IOrganization, OrgTypes } from "../types/organizations";

export const organizations = {
  defaultValues: (type?: OrgTypes, org?: IOrganization) => {
    console.log(org);
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
      type: org?.type! || type || "",

      status: org?.status || "active",

      invoiceFrequency: org?.invoiceFrequecy || "monthly",
    };

    if (org) {
      data.id = org.id?.toString();
    }

    return data;
  },

  schema: z.object({
    id: z.string().optional(),

    name: z.string().min(1, "Organization name is a required field."),

    registeredName: z.string().min(1, "Registered name is a required field."),

    registrationNumber: z
      .string()
      .min(1, "Registration number is a required field"),

    registeredAddress: z
      .string()
      .min(1, "Registered address is a required field."),

    state: z.string().min(1, "State is required"),

    postalCode: z.string().min(1, "Postal code is required"),

    country: z.string().min(1, "Country is required"),

    regions: z.array(z.string()).min(1, "Region is a required field"),

    type: z.enum(["funder", "provider", "forte"], {
      message: "Type is a required field",
    }),

    status: z.enum(["active", "inactive"], {
      errorMap: () => ({ message: "Status is a required field" }),
    }),

    invoiceFrequency: z.enum(["monthly", "quarterly", "yearly"]).optional(),
  }),
};

const partnerSchema = z.object({
  id: z.number().min(1, "Partner is a required field."),
  name: z.string(),
  registeredName: z.string().min(1, "Registered name is a required field."),
  registeredNumber: z.string().min(1, "Registration ID is a required field."),
});

export const partner = {
  defaultValues: (orgId: number) => {
    return {
      organizationId: orgId,

      partner: {
        id: 0,

        name: "",

        registeredName: "",

        registeredNumber: "",
      },
    };
  },

  schema: z.object({
    organizationId: z.number(),
    partner: partnerSchema,
  }),
};
