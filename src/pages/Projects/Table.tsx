import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState, // <--- import MRT_ColumnDef
} from "material-react-table";

import { type ProjectData } from "./types";
import { useState } from "react";

const ProjectTable = function ({ data }: { data: ProjectData[] }) {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10, //customize the default page size
  });

  const columns: Array<MRT_ColumnDef<ProjectData>> = [
    {
      header: "Project Name",
      accessorKey: "name",
      enableSorting: true,
    },
    {
      header: "Donor",
      accessorKey: "Donor",
      enableSorting: true,
    },
    {
      header: "Value",
      accessorFn: (originalRow) => Number(originalRow.value),
      enableSorting: true,
    },
    {
      header: "Start Date",
      accessorKey: "startDate",
      enableSorting: true,
    },
    {
      header: "End Date",
      accessorKey: "endDate",
      enableSorting: true,
    },
    {
      header: "Project Type",
      accessorKey: "projectType",
      enableSorting: true,
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data,
    enableGlobalFilter: true,

    onPaginationChange: setPagination,
    state: { pagination },
    muiPaginationProps: {
      rowsPerPageOptions: [10, 20],
    },

    // Styling
    muiTablePaperProps: { sx: { borderRadius: "12px", overflow: "hidden" } },
    muiTableHeadCellProps: {
      sx: { backgroundColor: "#0a0a0a", color: "#ffb74d" },
    },

    muiTableBodyRowProps: {
      sx: {
        backgroundColor: "#262626",
        "&:hover": { backgroundColor: "#333333" },
      },
    },

    muiTableBodyCellProps: { sx: { color: "#ffffff" } },

    muiBottomToolbarProps: { sx: { backgroundColor: "#0a0a0a" } }, // Dark black color: '#ffffff',
    initialState: {
      showColumnFilters: false,
      density: "compact",
    },
  });

  return <MaterialReactTable table={table} />;
};

export default ProjectTable;
