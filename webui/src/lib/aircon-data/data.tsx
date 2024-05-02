import {
  BlendingModeIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { Aircon } from "@/lib/aircon-data/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/DataTable/data-table-column-header";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { airconSchema } from "@/lib/aircon-data/schema";
import { FilterableColumns } from "../types";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = airconSchema.parse(row.original);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">打开选项</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>状态</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={task.status}>
              {statuses.map((status) => (
                <DropdownMenuRadioItem key={status.value} value={status.value}>
                  {status.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem>详单</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const getDisplayName = (column: string) => {
  switch (column) {
    case "temperature":
      return "温度";
    case "windspeed":
      return "风速";
    case "mode":
      return "模式";
    case "status":
      return "状态";
  }
  return column;
};

export const columns: ColumnDef<Aircon>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="房间号" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "temperature",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="温度" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("temperature")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "windspeed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="风速" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("windspeed")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "mode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="模式" />
    ),
    cell: ({ row }) => {
      const mode = modes.find((mode) => mode.value === row.getValue("mode"));

      if (!mode) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {mode.icon && (
            <mode.icon className={`mr-2 h-4 w-4 ${mode.iconClassName}`} />
          )}
          <span>{mode.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="状态" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status"),
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className={`mr-2 h-4 w-4 ${status.iconClassName}`} />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="w-8">
        <DataTableRowActions row={row} />
      </div>
    ),
  },
];

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

export const filterableColumns: FilterableColumns = [
  {
    columnId: "mode",
    columnValues: modes,
  },
  {
    columnId: "status",
    columnValues: statuses,
  },
];
