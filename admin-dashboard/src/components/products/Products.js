import { useState } from 'react';
import { productData } from './productData';
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

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = productData.map((product) => product.id);
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

  const handleDeleteSelected = () => {
    // Implement delete functionality
    console.log('Deleting:', selected);
  };

  const handleEdit = (product) => {
    // Implement edit functionality
    console.log('Editing:', product);
  };

  const handleDelete = (id) => {
    // Implement delete functionality
    console.log('Deleting single:', id);
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
          ? a.finish.length - b.finish.length
          : b.finish.length - a.finish.length;
      }
      
      if (a[orderBy] < b[orderBy]) {
        return order === 'asc' ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
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
          return product.category.toLowerCase().includes(searchValue);
        case 'name':
        default:
          return product.name.toLowerCase().includes(searchValue);
      }
    });
  };

  const sortedAndFilteredData = sortData(filterData(productData));

  const handleAddProduct = (newProduct) => {
    // This will be replaced with an API call when connected to the database
    console.log('Adding new product:', {
      ...newProduct,
      id: Math.max(...productData.map(p => p.id)) + 1 // Temporary ID generation
    });
  };

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
                  <Typography><strong>Category:</strong> {selectedProduct.category}</Typography>
                  <Typography><strong>Total Finishes:</strong> {selectedProduct.finish.length}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Available Finishes:</Typography>
                  <Grid container spacing={2}>
                    {selectedProduct.finish.map((finish, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper sx={{ p: 1 }}>
                          <Typography><strong>{finish.finishName}</strong></Typography>
                          <img 
                            src={finish.imageUrl} 
                            alt={finish.finishName}
                            style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'contain' }}
                          />
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Mockups:</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography>Indoor Mockup:</Typography>
                      <img 
                        src={selectedProduct.mockup} 
                        alt="Indoor Mockup"
                        style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'contain' }}
                      />
                    </Grid>
                    {selectedProduct.mockupOutdoor && (
                      <Grid item xs={12} sm={6}>
                        <Typography>Outdoor Mockup:</Typography>
                        <img 
                          src={selectedProduct.mockupOutdoor} 
                          alt="Outdoor Mockup"
                          style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'contain' }}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Grid>
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