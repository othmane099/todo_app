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
import { Select } from '@mui/material';

import Label from '../../components/label';

// ----------------------------------------------------------------------

export default function UserTableRow({
                                       id,
                                       selected,
                                       title,
                                       priority,
                                       dueDate,
                                       onEdit,
                                       onDelete,
                                       isDone,
                                       onDone,
                                     }) {
  const [open, setOpen] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedPriority, setEditedPriority] = useState(priority);
  const [editedDueDate, setEditedDueDate] = useState(dueDate);

  const handleOpenMenu = (event) => setOpen(event.currentTarget);

  const handleCloseMenu = () => setOpen(null);


  const handleEdit = () => {
    setEditing(true);
    setOpen(null);
  };

  const handleSave = () => {
    onEdit(id, editedTitle, editedPriority, editedDueDate);
    setEditing(false);
    setOpen(null);
  };

  const handleCancel = () => {
    setEditedTitle(title);
    setEditedPriority(priority);
    setEditedDueDate(dueDate);
    setEditing(false);
    setOpen(null);
  };

  const handleDelete = (theId) => {
    onDelete(theId);
    setOpen(null);
  };

  return (
    <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox disableRipple checked={isDone} onChange={() => onDone(id)} />
      </TableCell>

      <TableCell component="th" scope="row" padding="none">
        {editing ? (
          <TextField
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            variant="outlined"
          />
        ) : (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {title}
            </Typography>
          </Stack>
        )}
      </TableCell>

      <TableCell>
        {editing ? (
          <Select
            value={editedPriority}
            onChange={(e) => setEditedPriority(e.target.value)}
            variant="outlined"
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        ) : (
          <Label color={(priority === 'high' && 'error') || (priority === 'medium' && 'warning') ||
            (priority === 'low' && 'primary') ||'default'}>{priority}</Label>

        )}
      </TableCell>

      <TableCell>
        {editing ? (
          <TextField
            type="date"
            value={editedDueDate === null ? '' : editedDueDate}
            onChange={(e) => setEditedDueDate(e.target.value)}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
        ) : (
          dueDate
        )}
      </TableCell>

      <TableCell align="right">
        {editing ? (
          <Stack direction="row" spacing={1}>
            <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
            <Button variant="contained" color="secondary" onClick={handleCancel}>Cancel</Button>
          </Stack>
        ) : (
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        )}
        <Popover
          open={!!open}
          anchorEl={open}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleEdit}>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Edit
          </MenuItem>

          <MenuItem onClick={() => handleDelete(id)} sx={{ color: 'error.main' }}>
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        </Popover>
      </TableCell>
    </TableRow>
  );
}

UserTableRow.propTypes = {
  title: PropTypes.any,
  priority: PropTypes.any,
  dueDate: PropTypes.any,
  id: PropTypes.any,
  selected: PropTypes.any,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  isDone: PropTypes.any,
  onDone: PropTypes.func,
};
