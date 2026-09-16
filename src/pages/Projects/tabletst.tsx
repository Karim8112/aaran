import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { type ProjectData } from "./types";
import TablePagination from "@mui/material/TablePagination";
import { Box, IconButton, useTheme } from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

export interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}
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
        accessorFn(originalRow) {
          if (originalRow.Donor) return originalRow.Donor;
          else return "-";
        },
        enableSorting: true,
      },
      {
        header: "Value",
        accessorFn: (originalRow) => originalRow.value ?? "N/A",
        enableSorting: true,
      },
      {
        header: "Start Date",
        accessorFn: (originalRow) =>
          originalRow.startDate
            ? String(originalRow.startDate).split("T")[0]
            : "N/A",
        enableSorting: true,
      },
      {
        header: "End Date",
        accessorFn: (originalRow) =>
          originalRow.startDate
            ? String(originalRow.endDate).split("T")[0]
            : "N/A",
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
    paginationDisplayMode: "pages",

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

    muiTableFooterRowProps: {
      sx: { backgroundColor: "red" },
    },
    muiTableContainerProps: {
      sx: {
        backgroundColor: "#262626",
        border: "1px ",
        borderColor: "#ffffff",
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#262626",
        border: "1px !important",
        borderColor: "#ffffff10 !important",
      },
    },

    // Header Styling
    muiTableHeadRowProps: {
      sx: { backgroundColor: "#262626" },
    },
    muiTableHeadCellProps: {
      sx: {
        color: "#ffb74d",
        "& .MuiSvgIcon-root, & .MuiInputBase-input": {
          color: "#ffffff",
        },
        padding: "10px 0px",
        fontWeight: "bold",
      },
    },

    // 4. Consolidating Body Row styling as recommended by MRT Docs[cite: 1]
    muiTableBodyProps: {
      sx: {
        backgroundColor: "#262626",
        "& tr > td": {
          color: "#ffffff",
          paddingLeft: "10px !important",
        },
        "& tr:hover > td": {
          backgroundColor: "#262626",
        },
      },
    },

    // Top Toolbar
    muiTopToolbarProps: {
      sx: {
        backgroundColor: "#262626",

        "& .MuiSvgIcon-root, & .MuiInputBase-input": {
          color: "#ffffff",
        },
      },
    },

    // Bottom Toolbar (Pagination)
    muiBottomToolbarProps: {
      sx: {
        backgroundColor: "#262626",

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
