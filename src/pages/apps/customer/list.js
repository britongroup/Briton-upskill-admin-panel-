import PropTypes from 'prop-types';
import { useMemo, Fragment, useEffect, useState } from 'react';
import axios from 'axios';

// project-imports
import Avatar from '../../../components/@extended/Avatar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography, Chip, Tooltip, Button,TableContainer,Paper } from '@mui/material';
import MainCard from '../../../components/MainCard';
import ScrollX from '../../../components/ScrollX';
import { CSVExport } from '../../../components/third-party/ReactTable';
import { renderFilterTypes } from 'utils/react-table';

import { useFilters, useExpanded, useGlobalFilter, useRowSelect, useSortBy, useTable, usePagination } from 'react-table';
import { Trash, Eye } from 'iconsax-react';
import makeData from 'data/react-table';
import { ThemeMode } from 'config';
// import IconButton from 'components/@extended/IconButton';
import IconButton from '../../../components/@extended/IconButton';
import SearchBar from '../components/Searchbar';
import PaginationComponent from '../components/Pagination';
import { Modal } from '@mui/material';
import Box from '@mui/material/Box';
import { PatternFormat } from 'react-number-format';
// import { PopupTransition } from 'components/@extended/Transitions';
import { PopupTransition } from '../../../components/@extended/Transitions';

import {
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';

import SimpleBar from '../../../components/third-party/SimpleBar';

// Define styles using makeStyles

// import image from '../../../assets/images/users'

// const avatarImage = require.context('../../../assets/images/users/avatar-1.png', true);
const server = process.env.REACT_APP_API_URL;
// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, renderRowSubComponent, handleAdd, setUserData }) {
  const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const theme = useTheme();
  const mode = theme.palette.mode;
  const filterTypes = useMemo(() => renderFilterTypes, []);

  const [sortBy, setSortBy] = useState('');
  const [filterText, setFilterText] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  // const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  // const [open, setOpen] = React.useState(false);
  // const handleOpenViewModal = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [viewModal, setViewModal] = useState({
    open: false,
    details: null,
    completeDetails: null
  });

  const server = process.env.REACT_APP_API_URL;


  const handleOpenViewModal = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${server}/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Assuming your raw body response is plain text
      const responseDataCart = response.data
      const responseData = response.data.user;
      // console.log('This is view response data', responseData);

      // Adjust this logic based on the actual format of your raw body response
      // For example, if your response is plain text, you might display it directly
      setOpen(true);
      setViewModal({
        details: responseData ,
        completeDetails: responseDataCart// Adjust this line accordingly
      });
    } catch (error) {
      console.error('Error fetching User details:', error);
    }
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
  };

  const {
    getTableProps,
    visibleColumns,
    state: { globalFilter, selectedRowIds, pageIndex, pageSize, expanded },
    preGlobalFilteredRows,
    setGlobalFilter,
    // setSortBy,
    selectedFlatRows
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10, hiddenColumns: ['avatar', 'email'], sortBy: [sortBy] }
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  // const handleClose = () => {
  //   setOpen(!open);
  // };

  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    id: null
  });

  // SearchBar
  // SearchBar
  const filteredData = useMemo(() => {
    if (!filterText) return data; // Using rowData as initial data
    return data.filter((row) => {
      return Object.values(row).some((value) => {
        if (value === null || value === undefined) return false; // Handle null or undefined values
        return value.toString().toLowerCase().includes(filterText.toLowerCase());
      });
    });
  }, [data, filterText]);

  //Pagination

  const paginatedData = useMemo(() => {
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const handleSearchChange = (event) => {
    setFilterText(event.target.value);
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    const { id } = deleteConfirmation;
    console.log('id aayi delet k liye', deleteConfirmation);
    if (id) {
      try {
        const token = localStorage.getItem('token');
        // if (!token) {
        // navigate("/");
        // } else {
        await axios.delete(`${server}/api/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('api url', `${server}/api/user/${id}`);
        console.log('userdata--->', data);
        const updatedCustomers = data.filter((customer) => customer._id !== id);
        console.log('customer id-->customer._id-->', data);
        console.log('updatedcustomers------->', updatedCustomers);

        setUserData(updatedCustomers);
        console.log('Deleted customer of id -->', id);
        toast('Record deleted Successfully');
        if (page > Math.ceil(updatedCustomers.length / rowsPerPage) - 1) {
          setPage(0);
        }
        // }
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
    setDeleteConfirmation({ open: false, id: null });
  };

  return (
    <>
      <Stack spacing={3}>
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 0 }}>
          <SearchBar filterText={filterText} setFilterText={setFilterText} handleSearchChange={handleSearchChange} />

          <Stack direction="row" alignItems="center" spacing={2}>
          
          </Stack>
        </Stack>
        <Table {...getTableProps()}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.Header} sx={{ width: column.Header === 'ID' ? '40px' : 'auto' }}>
                  {column.Header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData
              .filter((row) => row.role !== 'admin')
              .map((row) => (
                // {paginatedData.map((row, i) => (

                <TableRow key={row._id}>
                  <TableCell className="" style={{ width: '15%' }}>
                    {/* {columns.accessor === 'customerName' & */}
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar variant="rounded" color="secondary" size="sm" src={`${row?.picture}`} />
                      <Typography>{row?.name || 'NA'}</Typography>
                    </Stack>
                    {/* } */}
                  </TableCell>

                  <TableCell className="" style={{ width: '15%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Typography>{row?.email || 'NA'}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell style={{ width: '15%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Typography>{row?.phoneNumber || 'NA'}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell style={{ width: '15%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Typography>{row?.workStatus || 'NA'}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell style={{ width: '15%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      {row?.whatsApp ? (
                        <>
                          {/* <Typography>Active</Typography> */}
                          <Chip color="info" label="Active" size="small" variant="light" />
                        </>
                      ) : (
                        <>
                          {/* <Typography>Inactive</Typography> */}
                          <Chip color="success" label="Inactive" size="small" variant="light" />
                        </>
                      )}
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
                      {/* View */}

                      <Tooltip
                        componentsProps={{
                          tooltip: {
                            sx: {
                              backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                              opacity: 0.9
                            }
                          }
                        }}
                        title="View"
                      >
                        <IconButton color="success" onClick={(e) => handleOpenViewModal(row._id)}>
                          <Eye />
                        </IconButton>
                      </Tooltip>

                      <Dialog
                        open={open}
                        TransitionComponent={PopupTransition}
                        keepMounted
                        onClose={handleClose}
                        aria-describedby="alert-dialog-slide-description"
                        sx={{
                          '& .MuiDialog-paper': { width: 2048, maxWidth: 1, m: { xs: 1.75, sm: 2.5, md: 4 } },
                          backgroundColor: '#ffffff',
                          height: '100vh'
                        }}
                      >
                        {/* Viewmodaljsx */}

                        <Box id="PopupPrint" sx={{ px: { xs: 2, sm: 3, md: 5 }, py: 1, height: '70vh' }}>
                          <DialogTitle sx={{ px: 0 }}>
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
                              <List sx={{ width: 1, p: 0 }}>
                                <ListItem disablePadding>
                                  <ListItemAvatar sx={{ mr: 0.75 }}>
                                    <Avatar
                                      //   alt={customer.fatherName}
                                      size="lg"
                                      src={viewModal?.details?.picture}
                                    />
                                  </ListItemAvatar>
                                  {console.log('viewmodal----name--->', viewModal)}
                                  <ListItemText
                                    primary={<Typography variant="h5">{viewModal?.details?.name}</Typography>}
                                    secondary={<Typography color="secondary">{viewModal?.details?.email}</Typography>}
                                  />
                                </ListItem>
                              </List>
                            </Stack>
                          </DialogTitle>
                          <DialogContent dividers sx={{ px: 0 }}>
                            <SimpleBar sx={{ height: 'calc(100vh - 430px)' }}>
                              <Grid container spacing={3}>
                                <Grid item xs={12} sm={12} xl={12}>
                                  <Grid container spacing={2.25}>
                                    {/* <Grid item xs={12}>
                                      <MainCard title="About me">
                                        <Typography>
                                          Hello, Myself Rohan Shridhar, I’m Software Developer in international company,
                                        </Typography>

                                        <Typography>
                                          Hello, Myself Rohan Sanghwan, I’m Ui/Ux developer in international company, amndasbd
                                        </Typography>
                                      </MainCard>
                                    </Grid> */}
                                    <Grid item xs={12}>
                                      <MainCard title="Details">
                                        <List sx={{ py: 0 }}>
                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Contact No.</Typography>
                                                  {/* <Typography>2014-2017</Typography> */}
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">{viewModal?.details?.phoneNumber || 'NA'}</Typography>
                                                  {/* <Typography>-</Typography> */}
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid sx={{ marginTop: '0' }} container spacing={matchDownMD ? 0 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Workstatus</Typography>
                                                  {/* <Typography>2014-2017</Typography> */}
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">{viewModal?.details?.workStatus || 'NA'}</Typography>
                                                  {/* <Typography>-</Typography> */}
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid sx={{ marginTop: '0' }} container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">WhatsApp</Typography>
                                                  {/* <Typography>2014-2017</Typography> */}
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">{viewModal?.details?.whatsApp || 'NA'}</Typography>
                                                  {/* <Typography>-</Typography> */}
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid sx={{ marginTop: '0' }} container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Resume</Typography>
                                                  {/* <Typography>2014-2017</Typography> */}
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                {viewModal?.details?.resume ? (
                                                  <Link
                                                    to={viewModal?.details?.resume}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                                  >
                                                    <Button
                                                      component="a"
                                                      href={viewModal?.details?.resume}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="text-muted font-bold"
                                                    >
                                                      View
                                                    </Button>
                                                  </Link>
                                                ) : (
                                                  <span>NA</span>
                                                )}
                                              </Grid>
                                            </Grid>
                                          </ListItem>
                                        </List>
                                      </MainCard>
                                    </Grid>

                                    {/* ---------------      Cart Section ----------------- */}
                                    {viewModal?.completeDetails?.orders.map((details)=>(
                                    <Grid item xs={12}>
                                      <MainCard title="Cart Details">
                                        <List sx={{ py: 0 }}>
                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography>Purchased Date</Typography>
                                                  <Typography>Total Items</Typography>
                                                  <Typography color="secondary" className="font-semibold">
                                                    Cart Total
                                                  </Typography>
                                                </Stack>
                                              </Grid>
                                                  {/* {viewModal?.completeDetails?.orders.map((details)=>( */}
                                              <Grid item xs={12} md={6}>

                                                <Stack spacing={0.5}>
                                                  {/* {console.log('viewmoal completedetails detail---->',details)} */}
                                                  

                                                    <Typography> {details?.cartDetails?.purchaseDate}</Typography>
                                                    {/* {row?.cartDetails?.purchaseDate} */}
                                                    <Typography color="secondary">{details?.cartDetails?.items?.length }</Typography>
                                                    <Typography color="secondary" className="font-semibold">
                                                      Rs. {details?.cartDetails?.cartTotal}
                                                    </Typography>
                                                  </Stack>

                                              </Grid>
                                                 
                                            </Grid>
                                          </ListItem>


                                          {/* Purchase item details */}


                                          <Grid item xs={12}>
                                      <MainCard title="Purchased Items">
                                        <TableContainer component={Paper}>
                                          <Table sx={{ minWidth: 650 }} aria-label="caption table">
                                            {/* <caption>A basic table example with a caption</caption> */}
                                            <TableHead>
                                              <TableRow>
                                                <TableCell>Plan Name</TableCell>
                                                <TableCell align="right">Plan Type</TableCell>
                                                <TableCell align="right">Pricing</TableCell>
                                                <TableCell align="right">Plan Duration</TableCell>
                                                
                                              </TableRow>
                                            </TableHead>
                                            <TableBody>
                                              {/* {data.map((row) => ( */}
                                              {details?.cartDetails?.items.map((item)=>(



                                                 <TableRow key={item._id}>
                                               {/* <TableRow > */}
                                                  <TableCell component="th" scope="row">
                                                   {item?.service?.name}
                                                  </TableCell>
                                                  <TableCell align="right">{item?.serviceType}</TableCell>
                                                  <TableCell align="right"> {item?.plan?.price ? `Rs.${item?.plan?.price}` : 'NA'}</TableCell>
                                                  <TableCell align="right">  {item?.plan?.durationMonths ? `${item?.plan?.durationMonths} months` : 'NA'}</TableCell>
                                                </TableRow>
                                              ))}
                                            </TableBody>
                                          </Table>
                                        </TableContainer>
                                      </MainCard>
                                    </Grid>



































                                          
                                        </List>
                                      </MainCard>
                                    </Grid>
                                     ))
                                    }

                                    {/* Purchased Details Section */}

                                    {/* <Grid item xs={12}>
                                      <MainCard title="Purchased History">
                                        <TableContainer component={Paper}>
                                          <Table sx={{ minWidth: 650 }} aria-label="caption table">
                                            {/* <caption>A basic table example with a caption</caption> */}
                                            {/* <TableHead>
                                              <TableRow>
                                                <TableCell>Plan Name</TableCell>
                                                <TableCell align="right">Plan Type</TableCell>
                                                <TableCell align="right">Pricing</TableCell>
                                                <TableCell align="right">Plan Duration</TableCell>
                                                
                                              </TableRow>
                                            </TableHead>
                                            <TableBody> */}
                                              {/* {data.map((row) => ( */}
                                                 {/* <TableRow> */}
                                               {/* <TableRow > */}
                                                  {/* <TableCell component="th" scope="row"> */}
                                                   {/* Resume Service */}
                                                  {/* </TableCell> */}
                                                  {/* {console.log('completedetails--->',viewModal.completeDetails)} */}
                                                  {/* <TableCell align="right">{row.calories}</TableCell> */}
                                                  {/* {console.log('Detils cart--->',row)} */}
                                                  {/* <TableCell align="right">{row?.cartDetails?.items?.name}</TableCell> */}
                                                  {/* <TableCell align="right">Text Resume</TableCell>
                                                  <TableCell align="right">1299</TableCell>
                                                  <TableCell align="right">3 months</TableCell> */}
                                                {/* </TableRow> */}
                                             {/* ))} */}
                                            {/* </TableBody>
                                          </Table>
                                        </TableContainer>
                                      </MainCard>
                                    </Grid> */} 

                                    {/* <Grid item xs={12}>
                                      <MainCard title="Skills">
                                        <Box
                                          sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            listStyle: 'none',
                                            p: 0.5,
                                            m: 0
                                          }}
                                          component="ul"
                                        >
                                          {/* {customer.skills.map((skill, index) => (  */}
                                    {/* <ListItem sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                                            <Chip color="secondary" variant="outlined" size="small" label="Angular , Java , Mern" />
                                          </ListItem> */}
                                    {/* ))} */}
                                    {/* </Box>
                                      </MainCard>
                                    </Grid> */}
                                  </Grid>
                                </Grid>
                              </Grid>
                            </SimpleBar>
                          </DialogContent>

                          <DialogActions>
                            <Button
                              color="error"
                              variant="contained"
                              onClick={handleClose}
                              className="bg-red-500 hover:bg-red-700"
                              sx={{
                                '&:hover': {
                                  backgroundColor: 'darkred' // Change this to the hover color you want
                                }
                              }}
                            >
                              Close
                            </Button>
                          </DialogActions>
                        </Box>

                        {/* VIewmodaljsxend */}
                      </Dialog>

                      <Tooltip
                        componentsProps={{
                          tooltip: {
                            sx: {
                              backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                              opacity: 0.9
                            }
                          }
                        }}
                        title="Delete"
                      >
                        <IconButton
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClose();
                            handleDeleteConfirmation(row._id);
                          }}
                        >
                          <Trash />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

            {/* Pagination */}
            <PaginationComponent page={page} setPage={setPage} filteredData={filteredData} rowsPerPage={rowsPerPage} />

            {/* <=====--------------- */}
          </TableBody>
        </Table>
      </Stack>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ color: '#fff' }}
      />

      {/* Delete confirmation  */}

      {deleteConfirmation.open && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md">
            <p className="mb-4">Are you sure you want to delete this record?</p>
            <div className="flex justify-end">
              <button className="bg-red-500 text-white px-4 py-2 rounded-md mr-4" onClick={handleConfirmDelete}>
                Confirm
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                onClick={() => setDeleteConfirmation({ open: false, id: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  renderRowSubComponent: PropTypes.any,
  handleAdd: PropTypes.func
};

// ==============================|| CUSTOMER - LIST ||============================== //

const CustomerListPage = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const data = useMemo(() => makeData(200), []);
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [customerDeleteId, setCustomerDeleteId] = useState('');
  const [add, setAdd] = useState(false);
  const [userData, setUserData] = useState([]);

  const handleAdd = () => {
    setAdd(!add);
    if (customer && !add) setCustomer(null);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // navigate("/");
      } else {
        try {
          const response = await axios.get(`${server}/api/users`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data) {
            setUserData(response.data.allusers);
            console.log('api data', response.data.allusers);
          } else {
            console.error('Empty response data or unexpected format');
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };
    fetchUsers();
  }, []);

  const columns = useMemo(
    () => [
      // { Header: 'ID', accessor: 'id', width: 100  },
      { Header: 'Customer Name', accessor: 'customerName' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Contact', accessor: 'contact' },
      { Header: 'Workstatus', accessor: 'workstatus' },
      { Header: 'Whatsapp', accessor: 'whatsapp' },
      { Header: 'Actions', accessor: 'actions' }
      // { Header: 'Status', accessor: 'status' }
    ],
    []
  );

  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable columns={columns} data={userData} setUserData={setUserData} />
        {/* <SearchBar filterText={filterText} setFilterText={setFilterText} handleSearchChange={handleSearchChange} /> */}
      </ScrollX>
    </MainCard>
  );
};

// Function to handle closing the delete dialog

export default CustomerListPage;
