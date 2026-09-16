import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef, // <--- import MRT_ColumnDef
} from "material-react-table";

import { type ProjectData } from "./types";
import { useState } from "react";

const ProjectTable = function ({ data }: { data: ProjectData[] }) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5, //customize the default page size
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
    enableGlobalFilter: true, //override default options
    initialState: {
      showColumnFilters: false, //override default initial state for just this table
    },
    onPaginationChange: setPagination, //hoist pagination state to your state when it changes internally
    state: { pagination }, //pass the pagination state to the table
    //...
  });

  return <MaterialReactTable table={table} />;
};

export default ProjectTable;
