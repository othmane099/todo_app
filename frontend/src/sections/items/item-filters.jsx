import React, { useState } from 'react';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------


export const PRIORITY_OPTIONS = ['none', 'low', 'medium', 'high'];
export const STATUS_OPTIONS = ['Done', 'Not Yet'];

export default function ItemFilters({ openFilter, onOpenFilter, onCloseFilter, onFilter }) {
  const [selectedPriority, setSelectedPriority] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);

  const handlePriorityChange = (priority) => {
    const updatedPriority = [...selectedPriority];
    const index = updatedPriority.indexOf(priority);
    if (index === -1) {
      updatedPriority.push(priority);
    } else {
      updatedPriority.splice(index, 1);
    }
    setSelectedPriority(updatedPriority);
    // Call the filter function here with updated priority
    filterItems(updatedPriority, selectedStatus);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    // Call the filter function here with updated status
    filterItems(selectedPriority, status);
  };

  const filterItems = (priority, status) => {
    console.log(priority);
    onFilter(priority, status);
  };

  const handleClearButtonClick = () => {
    setSelectedPriority([]);
    setSelectedStatus([]);
    filterItems([], ''); // Clear the filter
  };

  const renderGender = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Priority</Typography>
      <FormGroup>
        {PRIORITY_OPTIONS.map((item) => (
          <FormControlLabel
            key={item}
            control={<Checkbox checked={selectedPriority.includes(item)} onChange={() => handlePriorityChange(item)} />}
            label={item}
          />
        ))}
      </FormGroup>
    </Stack>
  );

  const renderCategory = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Status</Typography>
      <RadioGroup>
        {STATUS_OPTIONS.map((item) => (
          <FormControlLabel
            key={item}
            value={item}
            control={<Radio checked={selectedStatus === item} onChange={() => handleStatusChange(item)} />}
            label={item}
          />
        ))}
      </RadioGroup>
    </Stack>
  );

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={<Iconify icon="ic:round-filter-list" />}
        onClick={onOpenFilter}
      >
        Filters&nbsp;
      </Button>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={onCloseFilter}
        PaperProps={{
          sx: { width: 280, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 1, py: 2 }}
        >
          <Typography variant="h6" sx={{ ml: 1 }}>
            Filters
          </Typography>
          <IconButton onClick={onCloseFilter}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            {renderGender}
            {renderCategory}
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="ic:round-clear-all" />}
            onClick={handleClearButtonClick}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

ItemFilters.propTypes = {
  openFilter: PropTypes.bool,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
  onFilter: PropTypes.func
};
