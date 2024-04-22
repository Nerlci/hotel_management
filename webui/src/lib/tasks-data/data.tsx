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
  },
  {
    value: "off",
    label: "关闭",
    icon: CrossCircledIcon,
  },
];

export const modes = [
  {
    value: "cool",
    label: "制冷",
    icon: BlendingModeIcon,
  },
  {
    value: "heat",
    label: "制热",
    icon: SunIcon,
  },
  {
    value: "-",
    label: "-",
  },
];
