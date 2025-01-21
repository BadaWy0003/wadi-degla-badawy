import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Typography,
  Button,
  IconButton,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import apiClient from '../../util/client';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [orderBy, setOrderBy] = useState('id');
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [editingDocument, setEditingDocument] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('id');
  const [formData, setFormData] = useState({
    documentType: 'INVOICE',
    proformaInvoice: '',
    invoiceDate: '',
    containerId: '',
    invoiceNumber: '',
    customerName: '',
    customerAddress: '',
    customerPhone: '',
    rnc: '',
    notifyContent: '',
    shippingTerm: '',
    PaymentTerms: '',
    items: [
      {
        id: '1',
        description: '',
        quantity: '',
        unitPrice: '',
        total: '',
      },
    ],
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data } = await apiClient.get('/api/export-pdf/all');
      setDocuments(data.data || []);
    } catch (error) {
      console.error('Error:', error);
      setDocuments([]); // Set empty array on error
    }
  };

  const handleSort = property => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAll = event => {
    if (event.target.checked) {
      setSelected(filteredDocuments.map(document => document.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = id => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter(item => item !== id);
    }

    setSelected(newSelected);
  };

  const handleOpenDialog = (document = null) => {
    if (document) {
      setEditingDocument(document);
      setFormData(document);
    } else {
      setEditingDocument(null);
      setFormData({
        documentType: 'INVOICE',
        proformaInvoice: '',
        invoiceDate: '',
        containerId: '',
        invoiceNumber: '',
        customerName: '',
        customerAddress: '',
        customerPhone: '',
        rnc: '',
        notifyContent: '',
        shippingTerm: '',
        PaymentTerms: '',
        items: [
          {
            id: '1',
            description: '',
            quantity: '',
            unitPrice: '',
            total: '',
          },
        ],
      });
    }
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      console.log(formData);
      await apiClient.post('/api/export-pdf/generate-upload-pdf', formData);
      fetchDocuments(); // Refresh the list
      setOpenDialog(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    await apiClient.delete(`/api/export-pdf/invoice/${documentToDelete}`);
    fetchDocuments(); // Refresh the list
    setOpenDeleteDialog(false);
  };

  const handleDownload = async url => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `document-${Date.now()}.pdf`; // or get filename from response headers
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleGenerateAndDownload = async () => {
    const { data } = await apiClient.post(`/api/export-pdf/generate-upload-pdf`, formData);
    console.log('Sent Data', data.data);
    if (data?.pdfUrl) {
      await handleDownload(data.pdfUrl);
    }

    fetchDocuments();
    setOpenDialog(false);
  };

  const handleView = url => {
    window.open(url, '_blank');
  };

  const filteredDocuments = documents
    ? documents.filter(document => {
        // Handle case where searchField might not exist on document
        const searchValue = document[searchField]?.toString().toLowerCase() || '';
        return searchValue.includes(searchQuery.toLowerCase());
      })
    : [];

  const sortedDocuments = filteredDocuments.sort((a, b) => {
    const isAsc = order === 'asc';
    if (a[orderBy] < b[orderBy]) return isAsc ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return isAsc ? 1 : -1;
    return 0;
  });

  const formatDate = timestamp => {
    if (!timestamp) return '';
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleString(); // This will show both date and time in the user's locale
  };

  const renderSearchBar = () => (
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <TextField select value={searchField} onChange={e => setSearchField(e.target.value)} sx={{ width: 150 }}>
        <MenuItem value="id">ID</MenuItem>
        <MenuItem value="invoiceNumber">Invoice Number</MenuItem>
        <MenuItem value="customerName">Customer Name</MenuItem>
      </TextField>
      <TextField
        fullWidth
        placeholder={`Search by ${searchField}...`}
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );

  const renderAddEditDialog = () => (
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
      <DialogTitle>{editingDocument ? 'Edit Document' : 'Add New Document'}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            'documentType',
            'proformaInvoice',
            'invoiceDate',
            'containerId',
            'invoiceNumber',
            'customerName',
            'customerAddress',
            'customerPhone',
            'rnc',
            'notifyContent',
            'shippingTerm',
            'PaymentTerms',
          ].map(field => (
            <TextField
              key={field}
              fullWidth
              label={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              value={formData[field]}
              onChange={e => setFormData({ ...formData, [field]: e.target.value })}
              required
            />
          ))}
          {formData.items.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2 }}>
              {['description', 'quantity', 'unitPrice', 'total'].map(field => (
                <TextField
                  key={field}
                  fullWidth
                  label={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                  value={item[field]}
                  onChange={e => {
                    const newItems = [...formData.items];
                    newItems[index][field] = e.target.value;
                    setFormData({ ...formData, items: newItems });
                  }}
                  required
                />
              ))}
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {editingDocument ? 'Save Changes' : 'Add Document'}
        </Button>
        {!editingDocument && (
          <Button onClick={handleGenerateAndDownload} variant="contained" color="secondary">
            Generate & Download PDF
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  const renderDeleteDialog = () => (
    <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {documentToDelete
            ? 'Are you sure you want to delete this document?'
            : `Are you sure you want to delete ${selected.length} selected documents?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpenDeleteDialog(false);
            setDocumentToDelete(null);
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleDeleteConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Documents</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {selected.length > 0 && (
            <Button variant="contained" color="error" onClick={() => setOpenDeleteDialog(true)}>
              Delete Selected ({selected.length})
            </Button>
          )}
          <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
            Add New Document
          </Button>
        </Box>
      </Box>

      {renderSearchBar()}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < filteredDocuments.length}
                  checked={selected.length === filteredDocuments.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {['id', 'type', 'createdAt'].map(field => (
                <TableCell key={field}>
                  <TableSortLabel active={orderBy === field} direction={orderBy === field ? order : 'asc'} onClick={() => handleSort(field)}>
                    {field === 'createdAt' ? 'Created At' : field.charAt(0).toUpperCase() + field.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedDocuments.map(document => (
              <TableRow key={document.id} selected={selected.includes(document.id)}>
                <TableCell padding="checkbox">
                  <Checkbox checked={selected.includes(document.id)} onChange={() => handleSelect(document.id)} />
                </TableCell>
                <TableCell>{document.id}</TableCell>
                <TableCell>{document.type}</TableCell>
                <TableCell>{formatDate(document.createdAt)}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" color="primary" onClick={() => handleOpenDialog(document)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setDocumentToDelete(document.id);
                        setOpenDeleteDialog(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton size="small" color="primary" onClick={() => handleDownload(document.url)}>
                      <DownloadIcon />
                    </IconButton>
                    <IconButton size="small" color="primary" onClick={() => handleView(document.url)}>
                      <VisibilityIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {renderAddEditDialog()}
      {renderDeleteDialog()}
    </Box>
  );
}
