import { Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText } from '@mui/material';

export default function DeleteConfirmDialog({ open, onClose, onConfirm, singleDelete, count }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete permanently?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {singleDelete
            ? 'This deletes the product and all its photos for good. It cannot be undone (there is no backup).'
            : `This deletes ${count} selected products and all their photos for good. It cannot be undone (there is no backup).`}
        </DialogContentText>
        <DialogContentText sx={{ mt: 1 }}>
          Only hidden products can be deleted. To just remove a product from the website, hiding it is enough.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete permanently
        </Button>
      </DialogActions>
    </Dialog>
  );
}
