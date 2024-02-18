import { useState } from 'react';

import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useRouter } from '../../routes/hooks';

// ----------------------------------------------------------------------

export default function ListTableRow({
                                       selected,
                                       name,
                                       handleClick,
                                       items,
                                       id,
                                       onDelete,
                                       onEdit,
                                     }) {
  const [open, setOpen] = useState(null);
  const [editingList, setEditingList] = useState({ id: null, name: '' });

  const router = useRouter();

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleCellClick = () => {
    router.push(`/lists/${id}/items`);
  };


  const handleEditMenuItemClick = () => {
    setOpen(null);
    setEditingList({ id, name });
  };

  const handleCancelEdit = () => {
    setEditingList({ id: null, name: '' });
  };

  const handleSaveEdit = () => {
    onEdit(editingList.id, editingList.name)
    setEditingList({ id: null, name: '' });
  };

  const handleDelete = (theId) => {
    onDelete(theId);
    setOpen(null)
  };


  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            {editingList.id !== null ? (
              <>
                <TextField
                  value={editingList.name}
                  onChange={(e) => setEditingList({ ...editingList, name: e.target.value })}
                  variant="outlined"
                />
                <Button onClick={handleSaveEdit}>Save</Button>
                <Button onClick={handleCancelEdit}>Cancel</Button>
              </>
            ) : (
              <Typography variant="subtitle2" noWrap
                          style={{ cursor: editingList.id ? 'auto' : 'pointer' }}
                          onClick={() => handleCellClick(editingList.id, editingList.name)}>
                {name}
              </Typography>
            )}
          </Stack>
        </TableCell>


        <TableCell>{items}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={() => handleEditMenuItemClick()}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={() => handleDelete(id)} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

ListTableRow.propTypes = {
  handleClick: PropTypes.func,
  name: PropTypes.any,
  items: PropTypes.any,
  selected: PropTypes.any,
  id: PropTypes.any,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};
