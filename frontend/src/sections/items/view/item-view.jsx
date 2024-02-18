import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


import {
  Select,
  MenuItem,
  TextField,
  Card,
  Stack,
  Table,
  Button,
  Container,
  TableBody,
  Typography,
  TableContainer,
  TablePagination, CardContent,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import ItemTableRow from '../item-table-row';
import ItemTableHead from '../item-table-head';
import TableEmptyRows from '../table-empty-rows';
import { emptyRows, applyFilter, getComparator } from '../utils';
import ItemFilters from '../item-filters';
import {
  createItem,
  deleteItem,
  editItem,
  fetchItems, filterItems,
  toggleIsDone,
} from '../../../services/itemService';

// ----------------------------------------------------------------------

export default function UserPage() {
  const [items, setItems] = useState([]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [item, setItem] = useState({ id: null, title: '', priority: 'none', dueDate: ''});

  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const { list_id } = useParams();

  useEffect(() => {
    fetchItems(list_id, setItems);
  }, []);


  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };


  const dataFiltered = applyFilter({
    inputData: items,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;


  const handleItemNameChange = (event) => setItem({ ...item, title: event.target.value });


  const handlePriorityChange = (event) => setItem({ ...item, priority: event.target.value });

  const handleDateChange = (event) => setItem({ ...item, dueDate: event.target.value });


  const handleSaveItem = async () => createItem(list_id, item, setItem, items, setItems);
  const handleEditItem = (theId, theTitle, thePriority, theDueDate) => editItem(list_id, theId, theTitle, thePriority, theDueDate, setItems);
  const handleDeleteItem = (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete the item?');
    if (isConfirmed) {
      deleteItem(list_id, id, items, setItems);
    }
  };
  const handleIsDoneChange = (theId) => toggleIsDone(theId, setItems);
  const handleFilterItems = (selectedPriority, selectedStatus) => filterItems(list_id, selectedPriority, selectedStatus, setItems)


  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSaveItem();
    }
  };

    return (
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Items</Typography>
          <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Item
          </Button>
        </Stack>

        <Card variant="outlined">
          <CardContent>
            <Stack direction="column" alignItems="flex-center">
              <TextField
                label="Item Name"
                variant="outlined"
                value={item.title}
                onChange={handleItemNameChange}
                onKeyDown={handleKeyDown}
                autoFocus
              />

              {/* Stack for Select, TextField for Due Date, and Save button */}
              <Stack direction={{ xs: 'column', lg: 'row' }} alignItems="center" spacing={2} mt={2}>
                <Select
                  value={item.priority}
                  onChange={handlePriorityChange}
                  variant="outlined"
                  sx={{ width: { xs: '100%', lg: 400 } }} // Full width on small screens, fixed width on large screens
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>

                <TextField
                  label="Due Date"
                  type="date"
                  variant="outlined"
                  value={item.dueDate}
                  onChange={handleDateChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: new Date().toISOString().split('T')[0], // Set min to the current date
                  }}
                  sx={{ width: { xs: '100%', lg: 400 } }} // Full width on small screens, fixed width on large screens
                />

                <Button sx={{ height: 50, width: { xs: '100%', lg: 300 } }}
                        variant="contained" color="primary" onClick={handleSaveItem}>
                  Save
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>


        <Card>

          <Stack
            direction="row"
            alignItems="center"
            flexWrap="wrap-reverse"
            justifyContent="flex-end"
          >
            <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
              <ItemFilters
                openFilter={openFilter}
                onOpenFilter={handleOpenFilter}
                onCloseFilter={handleCloseFilter}
                onFilter={handleFilterItems}
              />
            </Stack>
          </Stack>

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <ItemTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleSort}
                  headLabel={[
                    { id: 'title', label: 'Title' },
                    { id: 'priority', label: 'Priority' },
                    { id: 'dueDate', label: 'Due Date' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <ItemTableRow
                        key={row.id}
                        id={row.id}
                        title={row.title}
                        priority={row.priority}
                        dueDate={row.due_date}
                        isDone={row.is_done}
                        onEdit={handleEditItem}
                        onDelete={handleDeleteItem}
                        onDone={handleIsDoneChange}
                      />
                    ))}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, items.length)}
                  />

                  {notFound && <TableNoData query={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            page={page}
            component="div"
            count={items.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    );
  };
