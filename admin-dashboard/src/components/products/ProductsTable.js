import React, { useEffect, useState } from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  Checkbox,
  IconButton,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ProductsTable({
  orderBy,
  order,
  selected,
  onRequestSort,
  onSelectAll,
  onSelect,
  onMoreInfo,
  onEdit,
  onDelete,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API
    fetch("http://localhost:5000/api/storage/all")
      .then((response) => response.json())
      .then((result) => {
        if (result.data) {
          // Transform data if necessary
          const transformedData = result.data.map((item) => ({
            id: item.id,
            name: item.name,
            category: item.type, // Map 'type' to 'category'
            finishes: item.finishes, // Keep finishes array
          }));
          setData(transformedData);
        }
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                onChange={onSelectAll}
                checked={selected.length === data.length}
                indeterminate={
                  selected.length > 0 && selected.length < data.length
                }
              />
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "id"}
                direction={orderBy === "id" ? order : "asc"}
                onClick={() => onRequestSort("id")}
              >
                ID
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "name"}
                direction={orderBy === "name" ? order : "asc"}
                onClick={() => onRequestSort("name")}
              >
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "category"}
                direction={orderBy === "category" ? order : "asc"}
                onClick={() => onRequestSort("category")}
              >
                Category
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "finishes"}
                direction={orderBy === "finishes" ? order : "asc"}
                onClick={() => onRequestSort("finishes")}
              >
                Available Finishes
              </TableSortLabel>
            </TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((product) => (
            <TableRow key={product.id}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selected.indexOf(product.id) !== -1}
                  onChange={() => onSelect(product.id)}
                />
              </TableCell>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.finishes.length}</TableCell>
              <TableCell>
                <IconButton onClick={() => onMoreInfo(product)} color="primary">
                  <InfoIcon />
                </IconButton>
                <IconButton onClick={() => onEdit(product)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDelete(product.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
