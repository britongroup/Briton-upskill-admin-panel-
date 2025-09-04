// Import necessary dependencies and components
import React, { useEffect, useMemo, Fragment, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useTable } from 'react-table';
import {
  alpha,
  useTheme,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery,
  Typography
} from '@mui/material';
import {
  useFilters,
  useGlobalFilter,
  usePagination
} from 'react-table';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { CSVExport } from 'components/third-party/ReactTable';
import PaginationComponent from './components/Pagination'; // Update the path accordingly
import SearchBar from './components/Searchbar'; // Update the path accordingly
const server = process.env.REACT_APP_API_URL;

// New component to display order details in a nested table
const OrderDetailsTable = ({ orderDetails }) => {
  if (!orderDetails) {
    return null;
  }

  const {
    _id,
    user,
    modeOfPayment,
    status,
    cartDetails: {
      userId,
      items = [],
      cartTotal,
      purchaseDate,
      cartTotalaftergst,
      CGST,
      SGST,
      Discount,
    }= {},
    email,
  } = orderDetails;
  const address = user?.address || {};  
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>Order ID:</TableCell>
          <TableCell>{_id || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Username:</TableCell>
          <TableCell>{user?.name || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>User ID:</TableCell>
          <TableCell>{userId || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Status:</TableCell>
          <TableCell>{status || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Order Date:</TableCell>
          <TableCell>{purchaseDate || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={2}>
            <Typography variant="h6">Items</Typography>
            <ul>
              {items.map((item, index) => (
                <li key={index}>
                  <Typography variant="body2" style={{ fontSize: '14px' }}>
                    Service: {item.service?.name || 'N/A'}, Duration: {item.plan?.durationMonths || 'N/A'} months, Price: {item.plan?.price || 'N/A'}
                  </Typography>
                </li>
              ))}
            </ul>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Service Type:</TableCell>
          <TableCell>{items.length > 0 ? items[0].serviceType : 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Cart Total:</TableCell>
          <TableCell>{cartTotal || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
    </TableRow>
    <TableRow>
      <TableCell>Cart Total After GST:</TableCell>
      <TableCell>{cartTotalaftergst || 'N/A'}</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>CGST:</TableCell>
      <TableCell>{CGST || 'N/A'}</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>SGST:</TableCell>
      <TableCell>{SGST || 'N/A'}</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Discount:</TableCell>
      <TableCell>{Discount || 'N/A'}</TableCell>
    </TableRow>
        <TableRow>
          <TableCell>Mode of Payment:</TableCell>
          <TableCell>{modeOfPayment || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Email:</TableCell>
          <TableCell>{email || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Phone Number:</TableCell>
          <TableCell>{user?.phoneNumber ? user.phoneNumber : 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Address:</TableCell>
          <TableCell>
            {address
              ? `${address.address1}, ${address.city}, ${address.state}, ${address.country}, ${address.pincode}`
              : 'N/A'}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};


// AllOrdersTable component with modifications
function AllOrdersTable({ columns, data,setOrders  }) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setHiddenColumns,
    rows,
    page,
    gotoPage,
    state: { globalFilter, pageIndex, pageSize },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10, hiddenColumns: ['avatar', 'email'] },
    },
    useGlobalFilter,
    useFilters,
    usePagination
  );

  const [expandedRows, setExpandedRows] = useState([]);
  //const [selectedOrder, setSelectedOrder] = useState(null);

  const handleToggleRowExpansion = (rowId) => {
    setExpandedRows((prevExpandedRows) => {
      const isExpanded = prevExpandedRows.includes(rowId);
      return isExpanded
        ? prevExpandedRows.filter((id) => id !== rowId)
        : [...prevExpandedRows, rowId];
    });
  };

  useEffect(() => {
    if (matchDownSM) {
      setHiddenColumns(['age', 'contact', 'visits', 'email', 'status', 'avatar']);
    } else {
      setHiddenColumns(['avatar', 'email']);
    }
  }, [matchDownSM]);


  return (
    <>
      <Stack spacing={3}>
        <Stack
          direction={matchDownSM ? 'column' : 'row'}
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 3, pb: 0 }}
        >
          {/* New SearchBar Component */}
          <SearchBar filterText={globalFilter} setFilterText={setGlobalFilter} handleSearchChange={(e) => setGlobalFilter(e.target.value || undefined)} />
          <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={2}>
            <CSVExport data={data} filename={'order-list.csv'} />
          </Stack>
        </Stack>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup.id} {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                {headerGroup.headers.map((column) => (
                  <TableCell key={column.id} {...column.getHeaderProps([{ className: column.className }])}>
                    {column.render('Header')}
                  </TableCell>
                ))}
             
             <TableCell>Action</TableCell>
              </TableRow>
            
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              const rowProps = row.getRowProps();

              const isExpanded = expandedRows.includes(row.id);

              return (
                <Fragment key={row.id}>
                  <TableRow
                    {...rowProps}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit'
                    }}
                  >
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id} {...cell.getCellProps([{ className: cell.column.className }])}>
                        {cell.render('Cell')}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div
                        style={{  
                          display: 'flex',
                          justifyContent: 'left',
                        }}
                      >
                        <div
                          onClick={() => handleToggleRowExpansion(row.id)}
                          style={{
                            cursor: 'pointer',
                            padding: '6px 12px',
                            backgroundColor: '#3f51b5',
                            color: 'white',
                            borderRadius: '4px',
                          }}
                        >
                          {isExpanded ? 'Hide Details' : 'View Details'}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={columns.length + 1}>
                        <OrderDetailsTable orderDetails={row.original} />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
            <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
              {/* New Pagination Component */}
              <TableCell sx={{ p: 2, py: 3 }} colSpan={columns.length + 1}>
                <PaginationComponent
                  page={pageIndex}
                  setPage={gotoPage}
                  filteredData={rows}
                  rowsPerPage={pageSize}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Stack>
    </>
  );
}

AllOrdersTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  fetchData: PropTypes.func.isRequired,
};

// Define the AllOrders component
const AllOrders = () => {
  const [orders, setOrders] = useState([]);



  useEffect(() => {
    const fetchData = async () => {

      const token = localStorage.getItem('token'); 
     if(token){
      try {
        const response = await axios.get(`${server}/api/order/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (response.data) {
          setOrders(response.data.orders);
        } else {
          console.error('Empty response data or unexpected format');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
  }
    fetchData();
  }, []);

  const columns = useMemo(() => [
    {
      Header: 'Order ID',
      accessor: '_id',
      className: 'cell-center',
    },
    {
      Header: 'Username',
      accessor: 'user.name',
    },
    {
      Header: 'User ID',
      accessor: 'cartDetails.userId',
    },
  
  ], []);

  return (
    <MainCard content={false}>
      <ScrollX>
        <AllOrdersTable columns={columns} data={orders} setOrders={setOrders} />
      </ScrollX>
    </MainCard>
  );
}

export default AllOrders;
