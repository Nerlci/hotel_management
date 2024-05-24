import { ColumnDef } from "@tanstack/react-table";
import { Room } from "@/lib/room-data/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/DataTable/data-table-column-header";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserRoundCheckIcon, UserRoundXIcon } from "lucide-react";
import { DataTableColumnValue } from "../types";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { dataFetch } from "shared";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { logout } = useAuth()!;
  const checkoutMutation = useMutation({
    mutationFn: dataFetch.postReceptionCheckout,
    onSuccess: () => {
      toast.success("退房成功");
      location.reload();
    },
    onError: (e) => {
      if (e.message === "401") {
        logout();
      }
      console.log(e.message);
      toast.error("退房失败");
    },
  });

  return (
    <>
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
          <DropdownMenuItem asChild>
            <div onClick={() => setDialogOpen(true)}>退房</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认退房</DialogTitle>
            <DialogDescription>此操作不能撤销</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                checkoutMutation.mutate(row.getValue("userId"));
              }}
              variant="destructive"
            >
              退房
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const getDisplayName = (column: string) => {
  switch (column) {
    case "startDate":
      return "开始日期";
    case "endDate":
      return "结束日期";
    case "status":
      return "状态";
    case "userId":
      return "用户id";
  }
  return column;
};

export const columns: ColumnDef<Room>[] = [
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
    accessorKey: "startDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="开始日期" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("startDate") === "-"
              ? "-"
              : row.getValue("startDate")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="结束日期" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("endDate") === "-" ? "-" : row.getValue("endDate")}
          </span>
        </div>
      );
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
    accessorKey: "userId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="用户id" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("userId")}
          </span>
        </div>
      );
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

export const statuses: DataTableColumnValue[] = [
  {
    value: "occupied",
    label: "有人",
    icon: UserRoundCheckIcon,
    iconClassName: "text-orange-500",
  },
  {
    value: "empty",
    label: "空闲",
    icon: UserRoundXIcon,
    iconClassName: "text-blue-500",
  },
];

export const filterableColumns = [
  {
    columnId: "status",
    columnValues: statuses,
  },
];
