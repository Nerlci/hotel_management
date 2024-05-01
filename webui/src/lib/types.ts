import { filterableColumns } from "./tasks-data/data";

export type UserType = "customer" | "admin" | "reception" | "aircon-manager";

export type LoggedinUser = {
  username: string;
  type: UserType;
} | null;

export type FilterableColumns = typeof filterableColumns;
