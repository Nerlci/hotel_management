import {
  columns,
  filterableColumns,
  getDisplayName,
} from "@/lib/room-data/data";
import { DataTable } from "./DataTable/data-table";
import { Room } from "@/lib/room-data/schema";

const tasks: Room[] = [
  {
    id: "1001",
    status: "occupied",
    startDate: new Date(2024, 0, 1).toLocaleString().split(" ")[0],
    endDate: new Date(2024, 0, 2).toLocaleString().split(" ")[0],
  },
  {
    id: "1002",
    status: "empty",
    startDate: "-",
    endDate: "-",
  },
  {
    id: "1003",
    status: "occupied",
    startDate: new Date(2024, 0, 4).toLocaleString().split(" ")[0],
    endDate: new Date(2024, 0, 5).toLocaleString().split(" ")[0],
  },
  {
    id: "2001",
    status: "occupied",
    startDate: new Date(2024, 0, 5).toLocaleString().split(" ")[0],
    endDate: new Date(2024, 0, 6).toLocaleString().split(" ")[0],
  },
];

export default function ReceptionCheckinCheckout() {
  return (
    <div>
      <DataTable
        data={tasks}
        columns={columns}
        getDisplayName={getDisplayName}
        searchPlaceholder="搜索房间号..."
        filterableColumns={filterableColumns}
      />
    </div>
  );
}
