import { tuple } from "./tuple";


export const RoleEnum = tuple (
  "Admin",
  "SupperAdmin",
  "Public",
);
export type RoleType = (typeof RoleEnum)[number];
