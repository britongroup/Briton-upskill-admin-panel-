import PropTypes from 'prop-types';
import { useMemo, useEffect, useState } from 'react';
import axios from 'axios';

// project-imports
// import Avatar from 'components/@extended/Avatar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { CSVExport } from 'components/third-party/ReactTable';
import { renderFilterTypes } from 'utils/react-table';

import { useFilters, useExpanded, useGlobalFilter, useRowSelect, useSortBy, useTable, usePagination } from 'react-table';
import { Trash } from 'iconsax-react';
import makeData from 'data/react-table';
import { Add, Edit } from 'iconsax-react';
import { ThemeMode } from 'config';
import IconButton from 'components/@extended/IconButton';
import SearchBar from '../components/Searchbar';
import PaginationComponent from '../components/Pagination';
// const avatarImage = require.context('assets/images/users', true);
const server = process.env.REACT_APP_API_URL;
// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, setFaqData }) {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const filterTypes = useMemo(() => renderFilterTypes, []);

  const [sortBy, setSortBy] = useState('');
  const [filterText, setFilterText] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [addquestions, setAddquestions] = useState();
  const [addanswers, setAddanswers] = useState();
  const [addDiscPercentage, setAddDiscPercentage] = useState();
  const [addCouponLimit, setAddCouponLimit] = useState();
  const [addCouponExpDate, setAddCouponExpDate] = useState();
  const [editquestions, setEditquestions] = useState();
  const [editanswers, setEditanswers] = useState();
  const [editDiscPercentage, setEditDiscPercentage] = useState();
  const [editCouponLimit, setEditCouponLimit] = useState();
  const [editCouponExpDate, setEditCouponExpDate] = useState();

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

  const handleClose = () => {
    setOpen(!open);
  };

  //  Edit coupon code

  const [editModal, setEditModal] = useState({
    open: false,
    details: null
  });

  const handleEdit = (details) => {
    setEditModal({
      open: true,
      details: { ...details }
    });

    // Set the initial values for editing
    setEditanswers(details?.question);
    setEditquestions(details?.answer);
  };

  const handleEditModalClose = () => {
    setEditModal({
      open: false
      // blog: { ...blog },
    });
  };

  // Calling the update api
  const handleSaveEdit = async () => {
    try {
      const requestData = {
        question: editquestions,
        answer: editanswers,
        
      };

      // const token = localStorage.getItem('token');
      const response = await axios.put(`${server}/api/faqs/${editModal.details._id}`, requestData, {
        headers: {
          Accept: '*/*',
          // Authorization: `Bearer ${token}`
        }
      });

      // Handle the response as needed

      if (response.status === 200) {
        // Close the edit modal after successful update
        setEditModal({ open: false, details: null });
        setAddquestions();
        setAddanswers();
     

        // Fetch the updated data from the server and update the rowData state
        try {
          // const token = localStorage.getItem('token');
          const updatedData = await axios.get(`${server}/api/faqs`, {
            headers: {
              Accept: '*/*',
              // Authorization: `Bearer ${token}`
            }
          });
          setFaqData(updatedData?.data);
          console.log('Updated rowData:', updatedData);
        } catch (error) {
          console.log('Error', error);
        }

        toast('Coupon Details updated Successfully');
      } else {
        toast.error('Coupon Not updated.. Try Again');
      }
    } catch (error) {
      console.error('Error updating coupons:', error);
      // Handle error and display a toast or error message to the user
      toast.error('Error updating coupon');
    }
  };

  const [addNewModal, setAddNewModal] = useState({
    open: false
  });

  const handleAddModalClose = () => {
    setAddNewModal({
      open: false
    });
  };

  const handleAddNew = () => {
    setAddNewModal({
      open: true
    });
  };

  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    id: null
  });

  const handleSaveNewFaq = async () => {
    try {
      // ---- IT's Working ------
      const requestData = {
        question: addquestions,
        answer: addanswers,
      };

      // const token = localStorage.getItem('token');
      // console.log(token);
      const response = await axios.post(`${server}/api/faqs/create`, requestData, {
        headers: {
          Accept: '*/*',
          // Authorization: `Bearer ${token}`
        }
      });

      // Handle the response as needed
      console.log('Create API response:', response.data);

      if (response.status === 201) {
        // Close the add new modal after successful creation
        setAddNewModal({ open: false });
        setAddquestions('');
        setAddanswers('');

        try {
          // const token = localStorage.getItem('token');
          const updatedData = await axios.get(`${server}/api/faqs`, {
            headers: {
              // Authorization: `Bearer ${token}`
            }
          });

          setFaqData(updatedData.data);
          toast('Faq Added Successfully');
        } catch (error) {
            toast.error('Error Creating Faq')
          console.log('Error duing Updated Data fetching', error);
        }
      } else {
        toast.error('Error Creating Faq');
      }
    } catch (error) {
      console.error('Error creating faq:', error);

      toast.error('Error creating faq');
    }
  };

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

    if (id) {
      try {
        // const token = localStorage.getItem('token');
        // if (!token) {
        // navigate("/");
        // } else {
        await axios.delete(`${server}/api/faqs/${id}`, {
          
          // headers: {
          //   Authorization: `Bearer ${token}`
          // }
        });
        const updatedCustomers = data.filter((customer) => customer._id !== id);

        setFaqData(updatedCustomers);

        toast.success('Faq Deleted Successfully');
        if (page > Math.ceil(updatedCustomers.length / rowsPerPage) - 1) {
          setPage(0);
        }
        // }
      } catch (error) {
        console.error('Error deleting Faq:', error);
        toast.error('Error deleting Faq')
      }
    }
    setDeleteConfirmation({ open: false, id: null });
  };

  return (
    <>
      <Stack spacing={2}>
        <Stack direction="row" spacing={4} justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 0 }}>
          <SearchBar filterText={filterText} setFilterText={setFilterText} handleSearchChange={handleSearchChange} />

          <Stack direction="row" alignItems="center" spacing={3} textAlign="justify">
            {/* <SortingSelect sortBy={sortBy.id} setSortBy={setSortBy} allColumns={allColumns} /> */}
            <Button
              variant="contained"
              className="bg-blue-500 text-white hover:bg-blue-600"
              startIcon={<Add />}
              onClick={handleAddNew}
              data-modal-toggle="add-modal"
            >
              Add
            </Button>
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
              // .filter((row) => row.role !== 'admin')
              .map((row) => (
                // {paginatedData.map((row, i) => (

                <TableRow key={row._id}>
                  <TableCell className="" style={{ width: '25%' }}>
                    {/* {columns.accessor === 'customerName' & */}
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      {/* <Avatar variant="rounded" color="secondary" size="sm" src={`${row.picture}`} /> */}
                      <Typography>{row?.question}</Typography>
                    </Stack>
                    {/* } */}
                  </TableCell>

                  <TableCell className="" style={{ width: '35%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Typography>{row?.answer}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell style={{ width: '25%' }}>
  <Stack direction="row" spacing={1.5} alignItems="center">
    <Typography>
      {row?.createdAt
        ? new Date(row?.createdAt).toLocaleDateString('en-GB') // 'en-GB' for dd-mm-yyyy format
        : ''}
    </Typography>
  </Stack>
</TableCell>

 <TableCell style={{ width: '25%' }}>
                    <Tooltip
                      componentsProps={{
                        tooltip: {
                          sx: {
                            backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                            opacity: 0.9
                          }
                        }
                      }}
                      title="Edit"
                    >
                      <IconButton
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClose();
                          handleEdit(row);
                        //   navigate(`/apps/edit-blog/${row._id}`);
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>

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

      {/*  add new faq  */}
      {addNewModal.open && (
        <div className="fixed top-0 left-0 w-[100vw] h-full flex items-center overflow-y-auto justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md max-w-md w-full mx-4 max-h-[70vh] overflow-y-auto">
            <div className="flex justify-end p-2">
              <button
                type="button"
                className="text-gray-600 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                data-modal-toggle="authentication-modal"
                onClick={() => handleAddModalClose()}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>

            <form
              id="form"
              className="space-y-6"
              onSubmit={(e) => {
                handleAddModalClose();
                handleSaveNewFaq();

                e.preventDefault();
              }}
            >
              <h3 className="text-2xl font-medium text-gray-800 mb-4">Create Faq</h3>

              <div>
                <label htmlFor="header" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Question
                </label>
                <input
                  type="text"
                  name="questions"
                  id="questions"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Question"
                  required=""
                  onChange={(e) => setAddquestions(e.target.value)}
                  value={addquestions}
                />
              </div>
              <div>
                <label htmlFor="answers" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Answers
                </label>
                <input
                  type="text"
                  name="answers"
                  id="answers"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Question"
                  required=""
                  onChange={(e) => setAddanswers(e.target.value)}
                  value={addanswers}
                />
              </div>

          

              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}

      {/*  edit coupon  */}
      {editModal.open && (
        <div className="fixed top-0 left-0 w-[100vw] h-full flex items-center justify-center align-middle  bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md max-w-md w-full mx-4 max-h-[70vh] overflow-y-auto">
            <div className="flex justify-between p-2">
              <div className="div">
                <h3 className="text-2xl font-medium text-gray-800 mb-4">Edit Faq Details</h3>
              </div>

              <div className="">
                <button
                  type="button"
                  className="text-gray-600 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  data-modal-toggle="authentication-modal"
                  onClick={() => handleEditModalClose()}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleEditModalClose();
                handleSaveEdit();
              }}
            >
              <div>
                <label htmlFor="header" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Question
                </label>
                <input
                  type="text"
                  name="questions"
                  id="questions"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Question"
                  required=""
                  onChange={(e) => setEditquestions(e.target.value)}
                  value={editquestions}
                />
              </div>
              <div>
                <label htmlFor="answers" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Answer
                </label>
                <input
                  type="text"
                  name="answers"
                  id="answers"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Answer"
                  required=""
                  onChange={(e) => setEditanswers(e.target.value)}
                  value={editanswers}
                />

                {console.log('editanswers', editanswers, editquestions)}
              </div>


              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800r"
                // disabled={
                //   editTitle === originalTitle &&
                //   editDescription === originalDescription &&
                //   BoolImage === false
                // }
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}

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
  renderRowSubComponent: PropTypes.any
};

// ==============================|| CUSTOMER - LIST ||============================== //

const FaqListPage = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const data = useMemo(() => makeData(200), []);
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [customerDeleteId, setCustomerDeleteId] = useState('');
  const [add, setAdd] = useState(false);
  const [FaqData, setFaqData] = useState([]);

  // const handleAdd = () => {
  //   setAdd(!add);yes

  //   if (customer && !add) setCustomer(null);
  // };

  // const handleClose = () => {
  //   setOpen(!open);
  // };

  useEffect(() => {
    const fetchUsers = async () => {
      // const token = localStorage.getItem('token');
      // if (!token) {
      //   // navigate("/");
      // }
      //  else {
        try {
          const response = await axios.get(`${server}/api/faqs`, {
            headers: {
              // Authorization: `Bearer ${token}`
            }
          });

          if (response?.data) {
            setFaqData(response?.data);
            // console.log('api data', response.data.coupons);
          } else {
            console.error('Empty response data or unexpected format');
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      // }
    };
    fetchUsers();
  }, []);

  const columns = useMemo(
    () => [
      { Header: 'Questions', accessor: 'name' },
      { Header: 'Answers', accessor: 'answers' },
      { Header: 'Created Date', accessor: 'createdDate' },
    //   { Header: 'Coupon Limit', accessor: 'limit' },
    //   { Header: 'Expiry Date', accessor: 'expiryDate' },
      { Header: 'Actions' }
      // { Header: 'Status', accessor: 'status' }
    ],
    []
  );

  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable columns={columns} data={FaqData} setFaqData={setFaqData} />
        {/* <SearchBar filterText={filterText} setFilterText={setFilterText} handleSearchChange={handleSearchChange} /> */}
      </ScrollX>
    </MainCard>
  );
};

// ==============================|| BLOG - DELETE    ||============================== //

// Function to handle closing the delete dialog

export default FaqListPage;
