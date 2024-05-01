import React from "react";

export type UserType = "customer" | "admin" | "reception" | "aircon-manager";

export type LoggedinUser = {
  username: string;
  type: UserType;
} | null;

export type DataTableColumnValue = {
  value: string;
  label: string;
  icon: React.ElementType;
  iconClassName: string;
};

export type FilterableColumns = {
  columnId: string;
  columnValues: DataTableColumnValue[];
}[];
