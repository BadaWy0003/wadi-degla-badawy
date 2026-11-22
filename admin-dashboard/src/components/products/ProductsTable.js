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
  Box,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArticleIcon from "@mui/icons-material/Article";

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
  onWebsiteDetails,
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
      {/* Phones: category and finishes columns hidden (category shown under the name), tighter cells */}
      <Table sx={{ '& td, & th': { px: { xs: 1, sm: 2 } } }}>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                onChange={onSelectAll}
                checked={data.length > 0 && data.every((p) => selected.includes(p.id))}
                indeterminate={
                  data.some((p) => selected.includes(p.id)) &&
                  !data.every((p) => selected.includes(p.id))
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
            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
              <TableSortLabel
                active={orderBy === "category"}
                direction={orderBy === "category" ? order : "asc"}
                onClick={() => onRequestSort("category")}
              >
                Category
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
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
                <Box component="span" sx={{ display: { xs: 'block', sm: 'none' }, color: 'text.secondary', fontSize: '0.8rem' }}>
                  {product.type} · {product.finishes.length} finishes
                </Box>
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{product.type}</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{product.finishes.length}</TableCell>
              <TableCell>
                <IconButton onClick={() => onMoreInfo(product)} color="primary">
                  <InfoIcon />
                </IconButton>
                <IconButton onClick={() => onEdit(product)} color="primary">
                  <EditIcon />
                </IconButton>
                {/* Description, origin, sizes, uses… shown on the website page */}
                {onWebsiteDetails && (
                  <Tooltip title="Website details (description, sizes, uses…)">
                    <IconButton onClick={() => onWebsiteDetails(product)} color="primary">
                      <ArticleIcon />
                    </IconButton>
                  </Tooltip>
                )}
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
