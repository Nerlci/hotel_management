import { UserType } from "./consts";

export function ChineseDateFormat(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

export function parseUserType(type: number): UserType {
  switch (type) {
    case 0:
      return "customer";
    case 1:
      return "admin";
    case 2:
      return "reception";
    case 3:
      return "aircon-manager";
    case 4:
      return "manager";
    default:
      return "customer";
  }
}
