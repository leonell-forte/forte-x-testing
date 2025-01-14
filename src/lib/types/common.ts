export interface File {
  id: number;

  key: string;

  fileUrl: string;

  filename: string;

  createdAt?: string;
}

export interface User {
  id: number;

  firstName: string;

  lastName: string;
}

export type StatusTypes = "active" | "inactive";

export type RolesTypes = "provider" | "admin" | "user";
