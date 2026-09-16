import { useState, useMemo, useEffect } from "react";
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
}

const columns: ColumnDef[] = [
  { id: "name", label: "Project Name" },
  { id: "Donor", label: "Donor" },
  { id: "value", label: "Value" },
  { id: "startDate", label: "Start Date" },
  { id: "endDate", label: "End Date" },
  { id: "projectType", label: "Project Type" },
];

export default function ProjectTable({ data = [] }: { data?: ProjectData[] }) {
  // 1. Pagination State
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  // 2. Sorting State
  const [orderBy, setOrderBy] = useState<keyof ProjectData | "">("name");
  const [order, setOrder] = useState<Order>("asc");

  // 3. Search Filter State
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Handle Sort Toggle
  const handleRequestSort = (property: keyof ProjectData) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Filter and Sort Data
  const filteredAndSortedData = useMemo(() => {
    let result = Array.isArray(data) ? [...data] : [];

    // Global Search Filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some(
          (val) => val != null && String(val).toLowerCase().includes(q),
        ),
      );
    }

    // Sorting
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
  }, [data, searchQuery, orderBy, order]);

  // Ensure page index stays valid when data or filters change
  const maxPage = Math.max(
    0,
    Math.ceil(filteredAndSortedData.length / rowsPerPage) - 1,
  );

  useEffect(() => {
    if (page > maxPage) {
      setPage(0);
    }
  }, [page, maxPage]);

  // Slice Current Page Data
  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredAndSortedData.slice(start, start + rowsPerPage);
  }, [filteredAndSortedData, page, rowsPerPage]);

  return (
    <div className="flex flex-col gap-6!">
      {/* Search Bar */}
      <Box
        sx={{
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
              "&:hover fieldset": { borderColor: "#D1B797" },
              "&.Mui-focused fieldset": { borderColor: "#D1B797" },
            },
          }}
        />
      </Box>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: "#121212",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Table */}
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#111316" }}>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    sx={{
                      backgroundColor: "#111316",
                      color: "#D1B797",
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
                        color: "#D1B797 !important",
                        "&.Mui-active": { color: "#D1B797 !important" },
                        "& .MuiTableSortLabel-icon": {
                          color: "#D1B797 !important",
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
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      backgroundColor: "#262626",
                      "&:hover": { backgroundColor: "#333333" },
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
                ))
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
          rowsPerPageOptions={[5, 10, 20, 50]}
          component="div"
          count={filteredAndSortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 20));
            setPage(0);
          }}
          sx={{
            backgroundColor: "#111316",
            color: "#ffffff",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-select, & .MuiSelect-icon, & .MuiIconButton-root":
              {
                color: "#ffffff !important",
              },
          }}
        />
      </Paper>
    </div>
  );
}
