export interface IOrganization {
  id?: string;
  name: string;
  registeredName: string;
  region: string;
  type: string;
  status: string;
  registeredAddress: string;
  state: string;
  country: string;
  postalCode: string;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
  noOfProjects?: string;
  noOfUsers?: string;
}
