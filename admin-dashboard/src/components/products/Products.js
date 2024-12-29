import { useState, useEffect } from 'react';
import { Box, Typography, Modal, Grid, Paper, Button } from '@mui/material';
import ProductsSearchBar from './ProductsSearchBar';
import ProductsTable from './ProductsTable';
import AddIcon from '@mui/icons-material/Add';
import AddProductModal from './AddProductModal';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow: 'auto',
};

export default function Products() {
  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderBy, setOrderBy] = useState('id');
  const [order, setOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('name');
  const [openAddModal, setOpenAddModal] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/storage/all")
      .then((response) => response.json())
      .then((result) => {
        if (result.data) {
          setData(result.data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((product) => product.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((itemId) => itemId !== id);
    }

    setSelected(newSelected);
  };

  const handleDeleteSelected = async () => {
    try {
      const deletePromises = selected.map(id =>
        fetch(`http://localhost:5000/api/storage/${id}`, {
          method: 'DELETE'
        })
      );
      
      await Promise.all(deletePromises);
      fetchProducts(); // Refresh the list
      setSelected([]); // Clear selection
    } catch (error) {
      console.error('Error deleting products:', error);
    }
  };

  const handleEdit = (product) => {
    // To be implemented when you have the edit modal ready
    console.log('Editing:', product);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/storage/product/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleMoreInfo = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortData = (data) => {
    return [...data].sort((a, b) => {
      if (orderBy === 'finishes') {
        return order === 'asc' 
          ? a.finishes.length - b.finishes.length
          : b.finishes.length - a.finishes.length;
      }
      
      // Handle category/type field
      if (orderBy === 'category') {
        const aValue = a.type || '';
        const bValue = b.type || '';
        return order === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Handle other fields
      const aValue = a[orderBy] || '';
      const bValue = b[orderBy] || '';
      return order === 'asc' 
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  };

  const filterData = (data) => {
    if (!searchQuery) return data;

    return data.filter(product => {
      const searchValue = searchQuery.toLowerCase();
      switch (searchField) {
        case 'id':
          return product.id.toString().includes(searchValue);
        case 'category':
          return product.type.toLowerCase().includes(searchValue);
        case 'name':
        default:
          return product.name.toLowerCase().includes(searchValue);
      }
    });
  };

  const sortedAndFilteredData = sortData(filterData(data));

  const handleAddProduct = (newProduct) => {
    // Refresh the products list after adding
    fetchProducts();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Products</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddModal(true)}
          sx={{ ml: 'auto' }}
        >
          Add Product
        </Button>
      </Box>
      
      <ProductsSearchBar
        searchQuery={searchQuery}
        searchField={searchField}
        onSearchChange={setSearchQuery}
        onFieldChange={setSearchField}
        selected={selected}
        onDeleteSelected={handleDeleteSelected}
      />

      <ProductsTable
        data={sortedAndFilteredData}
        orderBy={orderBy}
        order={order}
        selected={selected}
        onRequestSort={handleRequestSort}
        onSelectAll={handleSelectAll}
        onSelect={handleSelect}
        onMoreInfo={handleMoreInfo}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Box sx={modalStyle}>
          {selectedProduct && (
            <>
              <Typography variant="h5" sx={{ mb: 2 }}>
                {selectedProduct.name} Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography><strong>ID:</strong> {selectedProduct.id}</Typography>
                  <Typography><strong>Category:</strong> {selectedProduct.type}</Typography>
                  <Typography><strong>Total Finishes:</strong> {selectedProduct.finishes.length}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Available Finishes:</Typography>
                  <Grid container spacing={2}>
                    {selectedProduct.finishes.map((finish, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>                        <Paper sx={{ p: 1 }}>                          <Typography><strong>{finish.finishName}</strong></Typography>                          <img                             src={`http://localhost:5000${finish.imageUrl}`}                            alt={finish.finishName}                            style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'contain' }}                          />                        </Paper>                      </Grid>                    ))}                  </Grid>                </Grid>                {selectedProduct.mockupUrl && (                  <Grid item xs={12}>                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Mockup:</Typography>                    <Grid container spacing={2}>                      <Grid item xs={12}>                        <img 
                          src={`http://localhost:5000${selectedProduct.mockupUrl}`}
                          alt="Mockup"
                          style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'contain' }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </>
          )}
        </Box>
      </Modal>

      <AddProductModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSubmit={handleAddProduct}
      />
    </Box>
  );
}