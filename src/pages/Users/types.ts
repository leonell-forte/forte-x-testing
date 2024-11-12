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
