import React, { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
} from "@mui/material";
import { type ProjectData } from "./types";

type Order = "asc" | "desc";

interface ColumnDef {
  id: keyof ProjectData;
  label: string;
  numeric?: boolean;
}

const columns: ColumnDef[] = [
  { id: "name", label: "test" },
  { id: "Donor", label: "Donor" },
  { id: "value", label: "Value" },
  { id: "startDate", label: "Start Date" },
  { id: "endDate", label: "End Date" },
  { id: "projectType", label: "Project Type" },
];

export default function ProjectTable({ data }: { data: ProjectData[] }) {
  console.log("table data", data);
  // 1. Pagination State (Default 10 items per page)
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  // 2. Sorting State
  const [orderBy, setOrderBy] = useState<keyof ProjectData | "">("name");
  const [order, setOrder] = useState<Order>("asc");

  // 3. Search Filter State
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Handle Sort Change
  const handleRequestSort = (property: keyof ProjectData) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Handle Page Changes
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter and Sort Data
  const filteredAndSortedData = () => {
    let result = [...data];

    // Global Search Filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some(
          (val) => val != null && String(val).toLowerCase().includes(q),
        ),
      );
    }

    // Column Sorting
    if (orderBy) {
      result.sort((a, b) => {
        const aVal = a[orderBy] ?? "";
        const bVal = b[orderBy] ?? "";

        if (aVal < bVal) return order === "asc" ? -1 : 1;
        if (aVal > bVal) return order === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  };

  // Paginated Data Slice
  const paginatedData = () => {
    return filteredAndSortedData().slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#0a0a0a",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Top Search Toolbar */}
      <Box
        sx={{
          p: 2,
          backgroundColor: "#0a0a0a",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(0);
          }}
          sx={{
            width: { xs: "100%", sm: "300px" },
            "& .MuiOutlinedInput-root": {
              color: "#ffffff",
              backgroundColor: "#1a1a1a",
              borderRadius: "8px",
              "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
              "&:hover fieldset": { borderColor: "#ffb74d" },
              "&.Mui-focused fieldset": { borderColor: "#ffb74d" },
            },
            "& .MuiInputBase-input::placeholder": {
              color: "rgba(255, 255, 255, 0.5)",
              opacity: 1,
            },
          }}
        />
      </Box>

      {/* Main Table */}
      <TableContainer>
        <Table size="small" aria-label="projects table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#0a0a0a" }}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sortDirection={orderBy === column.id ? order : false}
                  sx={{
                    backgroundColor: "#0a0a0a",
                    color: "#ffb74d",
                    fontWeight: "bold",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    py: 1.5,
                  }}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : "asc"}
                    onClick={() => handleRequestSort(column.id)}
                    sx={{
                      color: "#ffb74d !important",
                      "&.Mui-active": {
                        color: "#ffb74d !important",
                      },
                      "& .MuiTableSortLabel-icon": {
                        color: "#ffb74d !important",
                      },
                    }}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData().length > 0 ? (
              paginatedData().map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    sx={{
                      backgroundColor: "#262626",
                      "&:hover": { backgroundColor: "#333333" },
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    <TableCell
                      sx={{ color: "#ffffff", borderColor: "#333333" }}
                    >
                      {row.name}
                    </TableCell>
                    <TableCell
                      sx={{ color: "#ffffff", borderColor: "#333333" }}
                    >
                      {row.Donor ?? "N/A"}
                    </TableCell>
                    <TableCell
                      sx={{ color: "#ffffff", borderColor: "#333333" }}
                    >
                      {row.value ?? "N/A"}
                    </TableCell>
                    <TableCell
                      sx={{ color: "#ffffff", borderColor: "#333333" }}
                    >
                      {row.startDate
                        ? String(row.startDate).split("T")[0]
                        : "N/A"}
                    </TableCell>
                    <TableCell
                      sx={{ color: "#ffffff", borderColor: "#333333" }}
                    >
                      {row.endDate ? String(row.endDate).split("T")[0] : "N/A"}
                    </TableCell>
                    <TableCell
                      sx={{ color: "#ffffff", borderColor: "#333333" }}
                    >
                      {row.projectType}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow sx={{ backgroundColor: "#262626" }}>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{ color: "rgba(255, 255, 255, 0.7)", py: 3 }}
                >
                  No projects found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Footer */}
      <TablePagination
        rowsPerPageOptions={[10, 20]}
        component="div"
        count={filteredAndSortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          backgroundColor: "#0a0a0a",
          color: "#ffffff",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
            {
              color: "#ffffff",
            },
          "& .MuiTablePagination-select": {
            color: "#ffffff",
          },
          "& .MuiSelect-icon": {
            color: "#ffffff",
          },
          "& .MuiIconButton-root": {
            color: "#ffffff",
            "&.Mui-disabled": {
              color: "rgba(255, 255, 255, 0.3)",
            },
          },
        }}
      />
    </Paper>
  );
}
