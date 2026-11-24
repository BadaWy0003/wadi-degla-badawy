import { useState, useEffect } from 'react';
import { Box, Typography, Modal, Grid, Paper, Button, TablePagination } from '@mui/material';
import ProductsSearchBar from './ProductsSearchBar';
import ProductsTable from './ProductsTable';
import AddIcon from '@mui/icons-material/Add';
import AddProductModal from './AddProductModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import EditProductModal from './EditProductModal';
import ProductDetailsForm from './ProductDetailsForm';
import SmallPhotosButton from './SmallPhotosButton';
import apiClient from '../../util/client';

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
  const [orderBy, setOrderBy] = useState('name'); // A-Z by name (the ids are random)
  const [order, setOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('name');
  const [openAddModal, setOpenAddModal] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [detailsProduct, setDetailsProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  // pages of the table (the list is long): rows per page is remembered in this browser
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    try {
      return Number(localStorage.getItem('wd-products-rows')) || 25;
    } catch {
      return 25;
    }
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Admin list: includes products hidden from the website.
      const { data } = await apiClient.get('/api/storage/admin/all');
      setData(data.data);
      // stones only (the list also holds the Gallery photos)
      setTotalCount((data.data || []).filter(p => String(p.type || '').trim() !== 'Gallery').length);
    } finally {
      setLoading(false);
    }
  };

  // ticks every product shown on the current page (never the Gallery photos)
  const handleSelectAll = event => {
    if (event.target.checked) {
      const newSelected = pageData.map(product => product.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleSelect = id => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter(itemId => itemId !== id);
    }

    setSelected(newSelected);
  };

  const handleDeleteSelected = async () => {
    // Visible products are refused by the server (hide first); the rest are deleted.
    await Promise.allSettled(selected.map(id => apiClient.delete(`/api/storage/product/${id}`)));
    fetchProducts();
    setSelected([]);
    setOpenDeleteDialog(false);
  };

  const handleEdit = product => {
    setEditingProduct(product);
    setOpenEditModal(true);
  };

  const handleEditSubmit = () => {
    fetchProducts(); // Refresh the list after successful edit
  };

  const handleToggleHidden = async product => {
    try {
      await apiClient.put(`/api/storage/product/${product.id}/visibility`, { hidden: !product.hidden });
    } catch {
      return; // error toast shown by apiClient
    }
    fetchProducts();
  };

  const handleDelete = async id => {
    try {
      await apiClient.delete(`/api/storage/product/${id}`);
    } catch {
      // error toast shown by apiClient
    }
    fetchProducts();
  };


  const handleConfirmDelete = async () => {
    if (productToDelete) {
      // Change from selectedProduct to productToDelete
      await handleDelete(productToDelete);
    } else {
      await handleDeleteSelected();
    }
    setOpenDeleteDialog(false);
    setProductToDelete(null);
  };

  const handleMoreInfo = product => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  const handleRequestSort = property => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortData = data => {
    return [...data].sort((a, b) => {
      if (orderBy === 'finishes') {
        return order === 'asc' ? a.finishes.length - b.finishes.length : b.finishes.length - a.finishes.length;
      }

      // Handle category/type field
      if (orderBy === 'category') {
        const aValue = a.type || '';
        const bValue = b.type || '';
        return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      // Handle other fields
      const aValue = a[orderBy] || '';
      const bValue = b[orderBy] || '';
      return order === 'asc' ? String(aValue).localeCompare(String(bValue)) : String(bValue).localeCompare(String(aValue));
    });
  };

  const filterData = data => {
    // First filter out Gallery items
    const nonGalleryItems = data.filter(product => product.type !== 'Gallery');

    // Then apply search filter if there's a search query
    if (!searchQuery) return nonGalleryItems;

    return nonGalleryItems.filter(product => {
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
  const lastPage = Math.max(0, Math.ceil(sortedAndFilteredData.length / rowsPerPage) - 1);
  const shownPage = Math.min(page, lastPage);
  const pageData = sortedAndFilteredData.slice(shownPage * rowsPerPage, (shownPage + 1) * rowsPerPage);

  // a new search or sort starts again at the first page
  useEffect(() => {
    setPage(0);
  }, [searchQuery, searchField, orderBy, order]);

  const handleAddProduct = newProduct => {
    // Refresh the products list after adding
    fetchProducts();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">Stones</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenAddModal(true)} sx={{ ml: 'auto' }}>
          Add stone
        </Button>
      </Box>

      <SmallPhotosButton products={data} onDone={fetchProducts} />

      <ProductsSearchBar
        searchQuery={searchQuery}
        searchField={searchField}
        onSearchChange={setSearchQuery}
        onFieldChange={setSearchField}
        selected={selected}
        onDeleteSelected={handleDeleteSelected}
        setOpenDeleteDialog={setOpenDeleteDialog} // Add this prop
      />
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        {totalCount} stones
      </Typography>

      <ProductsTable
        data={pageData}
        orderBy={orderBy}
        order={order}
        selected={selected}
        onRequestSort={handleRequestSort}
        onSelectAll={handleSelectAll}
        onSelect={handleSelect}
        onMoreInfo={handleMoreInfo}
        onEdit={handleEdit}
        onToggleHidden={handleToggleHidden}
        onWebsiteDetails={setDetailsProduct}
        onDelete={id => {
          setProductToDelete(id); // Use productToDelete instead of selectedProduct
          setOpenDeleteDialog(true);
        }}
      />
      <TablePagination
        component="div"
        count={sortedAndFilteredData.length}
        page={shownPage}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
        labelRowsPerPage="Per page:"
        sx={{ '& .MuiTablePagination-toolbar': { flexWrap: 'wrap', justifyContent: 'flex-end', px: { xs: 0, sm: 2 } } }}
        onRowsPerPageChange={event => {
          const n = Number(event.target.value);
          setRowsPerPage(n);
          setPage(0);
          try {
            localStorage.setItem('wd-products-rows', String(n));
          } catch {
            /* private browsing: not remembered */
          }
        }}
      />

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={modalStyle}>
          {selectedProduct && (
            <>
              <Typography variant="h5" sx={{ mb: 2 }}>
                {selectedProduct.name} Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography>
                    <strong>Category:</strong> {selectedProduct.type}
                  </Typography>
                  <Typography>
                    <strong>Total Finishes:</strong> {selectedProduct.finishes?.length || 0}
                  </Typography>
                </Grid>

                {selectedProduct.finishes && selectedProduct.finishes.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                      Available Finishes:
                    </Typography>
                    <Grid container spacing={2}>
                      {selectedProduct.finishes.map((finish, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Paper sx={{ p: 1 }}>
                            <Typography>
                              <strong>{finish.finish}</strong>
                            </Typography>
                            {finish.link && (
                              <img
                                src={finish.link}
                                alt={finish.finish}
                                style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'contain' }}
                              />
                            )}
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    {selectedProduct.mockupUrl && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                          Indoor Mockup:
                        </Typography>
                        <img
                          src={`${process.env.REACT_APP_BASE_API_URL}${selectedProduct.mockupUrl}`}
                          alt="Indoor Mockup"
                          style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'contain' }}
                        />
                      </Grid>
                    )}
                    {selectedProduct.mockupOutdoorUrl && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                          Outdoor Mockup:
                        </Typography>
                        <img
                          src={`${process.env.REACT_APP_BASE_API_URL}${selectedProduct.mockupOutdoorUrl}`}
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

      <AddProductModal open={openAddModal} onClose={() => setOpenAddModal(false)} onSubmit={handleAddProduct} />
      <ProductDetailsForm product={detailsProduct} onClose={() => setDetailsProduct(null)} />

      <DeleteConfirmDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setProductToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        singleDelete={!!productToDelete} // Fix the logic and use productToDelete
        count={selected.length}
      />
      <EditProductModal
        open={openEditModal}
        onClose={() => {
          setOpenEditModal(false);
          setEditingProduct(null);
        }}
        onSubmit={handleEditSubmit}
        product={editingProduct}
      />
    </Box>
  );
}
