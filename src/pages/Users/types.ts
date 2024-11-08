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

export interface IOrganization {
  id: string;
  name: string;
  registeredName: string;
  region: string;
  type: string;
  status: string;
  updatedAt: string; // ISO 8601 format date string
  createdAt: string; // ISO 8601 format date string
}
