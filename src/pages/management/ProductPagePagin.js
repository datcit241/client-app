import {Helmet} from 'react-helmet-async';
import {filter} from 'lodash';
import {useEffect, useState} from 'react';
// @mui
import {
    Avatar,
    Button,
    Card,
    Checkbox,
    Container,
    IconButton,
    MenuItem,
    Paper,
    Popover,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
    Typography,
} from '@mui/material';

import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import {UserListHead, UserListToolbar} from '../../sections/@dashboard/user';
// mock
import {delAll, list, setPagingParams} from "../../features/productsSlice";
import Loader from "../../components/loader/Loader";
import ActionDialog from "./ActionDialog";
import initialPagingParams from "../../features/config/initialPagingParams";
import pagingConfig from "../../features/config/pagingConfig";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    {id: 'name', label: 'Name', alignRight: false},
    {id: 'description', label: 'Description', alignRight: false, noWarp: true},
    {id: 'quantity', label: 'Quantity', alignRight: false},
    {id: 'price', label: 'Price', alignRight: false},
    {id: 'status', label: 'Status', alignRight: false},
    {id: '', alignRight: true},
];

// ----------------------------------------------------------------------
function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function ProductPagePagin(props) {
    const {
        isLoading,
        hasError,
        products: data,
        pagingParams,
        pagination: {pageSize: rowsPerPage, currentPage: page, totalCount, totalPages}
    } = useSelector(store => store.products);
    const {user} = useSelector(store => store.user);
    const dispatch = useDispatch();
    console.log(data)

    useEffect(() => {
        dispatch(setPagingParams({pageNumber: 1, pageSize: initialPagingParams.pageSize}));
    }, []);

    useEffect(() => {
        console.log('fetching')
        dispatch(list());
    }, [pagingParams, user]);

    const handleSetPaginParams = (params) => {
        const newParams = {...pagingParams}

        if (params.pageNumber) newParams.pageNumber = params.pageNumber;
        if (params.pageSize) newParams.pageSize = params.pageSize;
        if (params.order) newParams.order = params.order;
        if (params.orderBy) newParams.orderBy = params.orderBy;
        if (params.searchString !== undefined && params.searchString !== null) {
            newParams.searchString = params.searchString;
        }
        console.log(newParams)

        dispatch(setPagingParams(newParams));
    }

    const [open, setOpen] = useState(null);

    const [action, setAction] = useState(); // {label, handler}
    const [currentRow, setCurrentRow] = useState(null);

    const actionHandler = {
        del: () => {
            handleDelete([currentRow]);
            setOpen(false);
        },
        delSelected: () => {
            handleDelete(selected);
            setSelected([]);
        }
    }

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const handleOpenMenu = (event, id) => {
        setOpen(event.currentTarget);
        setCurrentRow(id);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        const ordr = isAsc ? 'desc' : 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        if (ordr !== pagingParams.order || property !== pagingParams.orderBy) {
            console.log('setting paging params')
            console.log(ordr, property)
            handleSetPaginParams({pageNumber: 1, order: ordr, orderBy: property});
            console.log(pagingParams)
        }
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = data.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        console.log('changing page', filterName)
        handleSetPaginParams({pageNumber: newPage + 1});
        console.log('after page changed', filterName)
    };

    const handleChangeRowsPerPage = (event) => {
        handleSetPaginParams({pageNumber: 1, pageSize: parseInt(event.target.value, 10)})
    };

    const handleFilterByName = (event) => {
        // handleSetPaginParams({pageNumber: 1})
        setFilterName(event.target.value);
    };

    const handleSearch = (event) => {
        console.log('searching for', filterName)
        handleSetPaginParams({searchString: filterName, pageNumber: 1});
    }

    const handleClear = (event) => {
        console.log('Clearing')
        handleSetPaginParams({searchString: '', pageNumber: 1});
        setFilterName('');
    }

    const navigator = useNavigate();
    const handleDelete = (products) => {
        dispatch(delAll(products)).then(() => {
            dispatch(list());
        });
    }

    const emptyRows = isLoading ? rowsPerPage : (page > 0 ? rowsPerPage - data.length : 0);

    const isNotFound = !data.length && !!filterName;

    return (
        <>
            <Helmet>
                <title>Product Management</title>
            </Helmet>

            {isLoading && <Loader/>}
            <ActionDialog
                action={action}
                setAction={setAction}
                message={action?.label === 'Delete' ? "Are you sure you want to delete?" : null}
            >
                <></>
            </ActionDialog>
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Product
                    </Typography>
                    <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill"/>}>
                        New Product
                    </Button>
                </Stack>

                <Card>
                    <UserListToolbar
                        numSelected={selected.length}
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                        handleDelete={() => setAction({label: 'Delete', handler: actionHandler.delSelected})}
                        handleSearch={handleSearch}
                        isSearching={!pagingParams.searchString || pagingParams.searchString !== filterName}
                        handleClear={handleClear}
                    />

                    <Scrollbar>
                        <TableContainer sx={{minWidth: 800}}>
                            <Table>
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={data.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {data.map((row) => {
                                        const {id, name} = row;
                                        const selectedUser = selected.indexOf(id) !== -1;

                                        return (
                                            <TableRow hover key={id} tabIndex={-1} role="checkbox"
                                                      selected={selectedUser}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={selectedUser}
                                                              onChange={(event) => handleClick(event, id)}/>
                                                </TableCell>
                                                {TABLE_HEAD.map((header, index) => {
                                                    const value = row[header.id];
                                                    const alignRight = row[header.alignRight];

                                                    return <TableCell key={index} align={alignRight ? 'right' : 'left'}>
                                                        {index === 0
                                                            ? (
                                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                                    {row.img &&
                                                                        <Avatar alt={name} src={row.img}/>
                                                                    }
                                                                    <Typography variant="subtitle2" noWrap>
                                                                        {value}
                                                                    </Typography>
                                                                </Stack>
                                                            )
                                                            : (value !== undefined ? value : <IconButton
                                                                size="large"
                                                                color="inherit"
                                                                onClick={(e) => handleOpenMenu(e, id)}>
                                                                <Iconify icon={'eva:more-vertical-fill'}/>
                                                            </IconButton>)
                                                        }
                                                    </TableCell>
                                                })}
                                            </TableRow>
                                        );
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{height: 53 * emptyRows}}>
                                            <TableCell colSpan={6}/>
                                        </TableRow>
                                    )}
                                </TableBody>

                                {isNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{py: 3}}>
                                                <Paper
                                                    sx={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Typography variant="h6" paragraph>
                                                        Not found
                                                    </Typography>

                                                    <Typography variant="body2">
                                                        No results found for &nbsp;
                                                        <strong>&quot;{filterName}&quot;</strong>.
                                                        <br/> Try checking for typos or using complete words.
                                                    </Typography>
                                                </Paper>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={pagingConfig.pageSizes}
                        component="div"
                        count={totalCount}
                        rowsPerPage={rowsPerPage}
                        page={page - 1}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>

            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                PaperProps={{
                    sx: {
                        p: 1,
                        width: 140,
                        '& .MuiMenuItem-root': {
                            px: 1,
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}
            >
                <MenuItem>
                    <Iconify icon={'eva:edit-fill'} sx={{mr: 2}}/>
                    Edit
                </MenuItem>

                <MenuItem
                    sx={{color: 'error.main'}}
                    onClick={() => setAction({label: 'Delete', handler: actionHandler.del})}
                >
                    <Iconify icon={'eva:trash-2-outline'} sx={{mr: 2}}/>
                    Delete
                </MenuItem>
            </Popover>
        </>
    )
}
