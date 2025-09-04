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
import { renderFilterTypes } from 'utils/react-table';

import { useFilters, useExpanded, useGlobalFilter, useRowSelect, useSortBy, useTable, usePagination } from 'react-table';
import { Trash } from 'iconsax-react';
import { Add, Edit } from 'iconsax-react';
import { ThemeMode } from 'config';
import IconButton from 'components/@extended/IconButton';
import SearchBar from '../components/Searchbar';
import PaginationComponent from '../components/Pagination';
import { useNavigate } from 'react-router';
// const avatarImage = require.context('assets/images/users', true);
const server = process.env.REACT_APP_API_URL;
// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, setBlogData }) {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const filterTypes = useMemo(() => renderFilterTypes, []);

  const [sortBy, setSortBy] = useState('');
  const [filterText, setFilterText] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);

  const { getTableProps } = useTable(
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

  const navigate = useNavigate();

  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    id: null
  });

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
        await axios.delete(`${server}/api/blogs/${id}`, {
          // headers: {
          //   Authorization: `Bearer ${token}`
          // }
        });
        const updatedBlogs = data.filter((Blog) => Blog._id !== id);

        setBlogData(updatedBlogs);

        toast.success('Blog Deleted Successfully');
        if (page > Math.ceil(updatedBlogs.length / rowsPerPage) - 1) {
          setPage(0);
        }
        // }
      } catch (error) {
        toast.error('Error Deleting Blog')
        console.error('Error deleting blog:', error);
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
              onClick={() => navigate('/apps/create-blog')} // Single line redirect
            >
              Add
            </Button>
          </Stack>
        </Stack>
        <Table {...getTableProps()}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.Header} sx={{ width: column.Header === '' ? '10px' : 'auto' }}>
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
                  <TableCell className="" style={{ width: '20%' }}>
                    <Stack direction="row" alignItems="left">
                      <img src={row?.image} alt="" srcset="" className="h-[10vh] w-[10vw]" />
                    </Stack>
                  </TableCell>

                  <TableCell className="" style={{ width: '30%' }}>
                    <Stack direction="row" alignItems="left">
                      <Typography>{row?.title}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell style={{ width: '25%' }}>
                    <Typography className="ml-8">{row?.content?.length}</Typography>
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
                          // handleEdit(row);
                          navigate(`/apps/edit-blog/${row._id}`);
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

// ==============================|| service - LIST ||============================== //

const BlogsListPage = () => {
  const [BlogData, setBlogData] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      // const token = localStorage.getItem('token');
      // if (!token) {
      //   // navigate("/");
      // }
      //  else {
        try {
          const response = await axios.get(`${server}/api/blogs`, {
            // headers: {
            //   Authorization: `Bearer ${token}`
            // }
          });

          if (response.data) {
            console.log('response data services-->', response?.data);
            setBlogData(response?.data);
            // console.log('api data', response.data.services);
          } else {
            console.error('Empty response data or unexpected format');
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    // };
    fetchBlogs();
  }, []);

  const columns = useMemo(
    () => [
      { Header: 'Blog Profile', accessor: 'blogprofile' },
      { Header: 'Blog Title', accessor: 'blogTitle' },
      // Service overview - ContentPara1
      { Header: 'Total Paragraphs', accessor: 'totalParagraphs' },
      // { Header: 'Other Services', accessor: 'pageheader' },

      { Header: 'Actions' }
      // { Header: 'Status', accessor: 'status' }
    ],
    []
  );

  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable columns={columns} data={BlogData} setBlogData={setBlogData} />
        {/* <SearchBar filterText={filterText} setFilterText={setFilterText} handleSearchChange={handleSearchChange} /> */}
      </ScrollX>
    </MainCard>
  );
};

export default BlogsListPage;
