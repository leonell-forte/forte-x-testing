export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string;
  organization: string;
}

export interface IOrganization {
  id: number;
  name: string;
  registeredName: string;
  region: string;
  type: string;
  status: string;
  updatedAt: string; // ISO 8601 format date string
  createdAt: string; // ISO 8601 format date string
}
