import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import ListsTableRow from '../list-table-row';
import ListsTableHead from '../list-table-head';
import TableEmptyRows from '../table-empty-rows';
import ListsTableToolbar from '../list-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { createList, deleteList, editList, fetchLists } from '../../../services/listService';

// ----------------------------------------------------------------------

export default function ListPage() {
  const [lists, setLists] = useState([]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isAddingList, setIsAddingList] = useState(false);

  const [listName, setListName] = useState('');


  useEffect(() => {
    fetchLists(setLists);
  }, []);


  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = lists.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: lists,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleNewListClick = () => setIsAddingList(true);


  const handleListNameChange = (event) => setListName(event.target.value);


  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSaveList();
    }
  };

  const handleCancelList = () => setIsAddingList(false);


  const handleSaveList = () => {
    createList(listName, setListName, lists, setLists);
    setIsAddingList(false)
  }
  const handleEditList = (id, name) => editList(id, name, setLists);
  const handleDelete = (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete the list?');
    if (isConfirmed) {
      deleteList(id, lists, setLists);
    }
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Lists</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleNewListClick}
        >
          New List
        </Button>
      </Stack>

      {isAddingList && (

        <Stack direction="column" alignItems="flex-end" mt={2}>
          <TextField label="Enter list name"
                     variant="outlined" value={listName}
                     onChange={handleListNameChange}
                     onKeyDown={handleKeyDown}
                     autoFocus
          />
          <Stack direction="row" mt={1} mb={5}>
            <Button variant="contained" color="primary" onClick={handleSaveList}>Save</Button>
            <Button variant="contained" color="secondary" onClick={handleCancelList}>Cancel</Button>
          </Stack>
        </Stack>

      )}

      <Card>
        <ListsTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <ListsTableHead
                order={order}
                orderBy={orderBy}
                rowCount={lists.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'items', label: 'Items' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <ListsTableRow
                      key={row.id}
                      name={row.name}
                      items={row.items_count}
                      id={row.id}
                      onEdit={handleEditList}
                      onDelete={handleDelete}
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => handleClick(event, row.name)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, lists.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={lists.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
