"use client";

import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { type ProjectData } from "./types";

const ProjectTable = function ({ data }: { data: ProjectData[] }) {
  // 1. MUST memoize columns to prevent infinite re-renders and state resets!
  const columns = useMemo<MRT_ColumnDef<ProjectData>[]>(
    () => [
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
        accessorFn: (originalRow) => originalRow.value ?? "N/A",
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
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableGlobalFilter: true,

    // Initial table state
    initialState: {
      showColumnFilters: false,
      density: "compact",
      pagination: { pageIndex: 0, pageSize: 10 },
    },

    muiPaginationProps: {
      rowsPerPageOptions: [10, 20],
    },

    // 2. Base background color for the table and toolbars[cite: 1]
    mrtTheme: {
      baseBackgroundColor: "#262626",
    },

    // 3. Customize the Paper wrapping the table[cite: 1]
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#0a0a0a",
      },
    },

    // Header Styling
    muiTableHeadRowProps: {
      sx: { backgroundColor: "#0a0a0a" },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#0a0a0a",
        color: "#ffb74d",
        fontWeight: "bold",
      },
    },

    // 4. Consolidating Body Row styling as recommended by MRT Docs[cite: 1]
    muiTableBodyProps: {
      sx: {
        "& tr > td": {
          backgroundColor: "#262626",
          color: "#ffffff",
        },
        "& tr:hover > td": {
          backgroundColor: "#333333",
        },
      },
    },

    // Top Toolbar
    muiTopToolbarProps: {
      sx: {
        backgroundColor: "#0a0a0a",
        "& .MuiSvgIcon-root, & .MuiInputBase-input": {
          color: "#ffffff",
        },
      },
    },

    // Bottom Toolbar (Pagination)
    muiBottomToolbarProps: {
      sx: {
        backgroundColor: "#0a0a0a",
        color: "#ffffff",
        "& .MuiTypography-root, & .MuiSvgIcon-root, & .MuiTablePagination-select, & .MuiInputBase-root":
          {
            color: "#ffffff",
          },
      },
    },
  });

  return <MaterialReactTable table={table} />;
};

export default ProjectTable;
