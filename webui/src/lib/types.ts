export type UserType = "customer" | "admin" | "reception" | "aircon-manager";

export type LoggedinUser = {
  username: string;
  type: UserType;
};
