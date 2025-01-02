import { TextField, MenuItem, InputAdornment, Box, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';


export default function ProductsSearchBar({ 
  searchQuery, 
  searchField, 
  onSearchChange, 
  onFieldChange,
  selected,
  onDeleteSelected,
  setOpenDeleteDialog // Add this prop
}) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <TextField
        select
        value={searchField}
        onChange={(e) => onFieldChange(e.target.value)}
        sx={{ width: '150px' }}
        size="small"
      >
        <MenuItem value="name">Search by Name</MenuItem>
        <MenuItem value="category">Search by Category</MenuItem>
        <MenuItem value="id">Search by ID</MenuItem>
      </TextField>

      <TextField
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={`Search by ${searchField}...`}
        sx={{ width: '300px' }}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Button
        variant="contained"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={() => setOpenDeleteDialog(true)} // Update this to open dialog
        disabled={selected.length === 0}
        sx={{ ml: 'auto' }}
      >
        Delete Selected {selected.length > 0 && `(${selected.length})`}
      </Button>
    </Box>
  );
}
