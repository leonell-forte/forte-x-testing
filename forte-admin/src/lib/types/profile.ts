import { RolesTypes, StatusTypes } from "./common";

export type ProfileType = {
  id: number;

  firstName: string;

  lastName: string;

  email: string;

  phoneNumber: string;

  organization: string;

  role: RolesTypes;

  status: StatusTypes;

  createdAt: string;

  updatedAt: string;
};
