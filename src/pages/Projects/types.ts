import { IOrganization } from "../../pages/Organizations/types";

export interface IOutcome {
  id: number;

  name: string;

  description: string;

  createdAt: string;

  updatedAt: string;
}

export interface IProject {
  id: number;

  name: string;

  createdAt?: string;

  updatedAt?: string;

  provider?: IOrganization[];

  funder?: IOrganization;

  outcomes: IOutcome[];
}
