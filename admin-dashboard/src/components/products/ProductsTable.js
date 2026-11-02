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
  Chip,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
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
  onToggleHidden,
  data // Add data as a prop
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [data]);

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
              <TableCell>
                {product.name}
                {product.hidden && (
                  <Chip label="Hidden from website" size="small" sx={{ ml: 1 }} />
                )}
              </TableCell>
              <TableCell>{product.type}</TableCell>
              <TableCell>{product.finishes.length}</TableCell>
              <TableCell>
                <IconButton onClick={() => onMoreInfo(product)} color="primary">
                  <InfoIcon />
                </IconButton>
                <IconButton onClick={() => onEdit(product)} color="primary">
                  <EditIcon />
                </IconButton>
                {/* Hide/show on the website. Only a hidden product can be deleted for good. */}
                <Tooltip title={product.hidden ? "Show on website" : "Hide from website"}>
                  <IconButton onClick={() => onToggleHidden(product)} color="primary">
                    {product.hidden ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </Tooltip>
                {product.hidden && (
                  <Tooltip title="Delete permanently">
                    <IconButton onClick={() => onDelete(product.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
