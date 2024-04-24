import {
  BlendingModeIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  SunIcon,
} from "@radix-ui/react-icons";

export const statuses = [
  {
    value: "on",
    label: "打开",
    icon: CheckCircledIcon,
    iconClassName: "text-green-500",
  },
  {
    value: "off",
    label: "关闭",
    icon: CrossCircledIcon,
    iconClassName: "text-red-500",
  },
];

export const modes = [
  {
    value: "cool",
    label: "制冷",
    icon: BlendingModeIcon,
    iconClassName: "text-blue-500",
  },
  {
    value: "heat",
    label: "制热",
    icon: SunIcon,
    iconClassName: "text-orange-500",
  },
  {
    value: "-",
    label: "-",
    iconClassName: "",
  },
];
