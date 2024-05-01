import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "../DataTable/data-table-faceted-filter";
import { FilterableColumns } from "@/lib/types";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchPlaceholder?: string;
  getDisplayName: (column: string) => string;
  filterableColumns: FilterableColumns;
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder,
  getDisplayName,
  filterableColumns,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={searchPlaceholder ?? "..."}
          value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("id")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {filterableColumns.map(
          (column) =>
            table.getColumn(column.columnId) && (
              <DataTableFacetedFilter
                key={column.columnId}
                column={table.getColumn(column.columnId)}
                title={getDisplayName(column.columnId)}
                // @ts-expect-error typing is not there yet
                options={column.columnValues}
              />
            ),
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            重置
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} getDisplayName={getDisplayName} />
    </div>
  );
}
