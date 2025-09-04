import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState, Fragment } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import {
  Button,
  Chip,
  Dialog,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';

// third-party
import { PatternFormat } from 'react-number-format';
import { useFilters, useExpanded, useGlobalFilter, useRowSelect, useSortBy, useTable, usePagination } from 'react-table';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import { PopupTransition } from 'components/@extended/Transitions';
import {
  CSVExport,
  HeaderSort,
  IndeterminateCheckbox,
  SortingSelect,
  TablePagination,
  TableRowSelection
} from 'components/third-party/ReactTable';

import AddCustomer from 'sections/apps/customer/AddCustomer';
import CustomerView from 'sections/apps/customer/CustomerView';
import AlertCustomerDelete from 'sections/apps/customer/AlertCustomerDelete';
import axios from 'axios';
import makeData from 'data/react-table';
import { renderFilterTypes, GlobalFilter } from 'utils/react-table';

// assets
import { Add, Edit, Eye, Trash } from 'iconsax-react';
import { ThemeMode } from 'config';

// const avatarImage = require.context('assets/images/users', true);

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, renderRowSubComponent, handleAdd }) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    // setHiddenColumns,
    allColumns,
    visibleColumns,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { globalFilter, selectedRowIds, pageIndex, pageSize, expanded, sortBy },
    preGlobalFilteredRows,
    setGlobalFilter,
    setSortBy,
    selectedFlatRows
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10, hiddenColumns: ['avatar', 'email'], sortBy: [{ id: 'id', desc: false }] }
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  // useEffect(() => {
  //   if (matchDownSM) {
  //     // setHiddenColumns(['workstatus', 'contact', 'whatsapp', 'email', 'status', 'customerName']);
  //   } else {
  //     // setHiddenColumns(['avatar', 'email']);
  //   }
  //   // eslint-disable-next-line
  // }, [matchDownSM]);

  return (
    <>
      <TableRowSelection selected={Object.keys(selectedRowIds).length} />
      <Stack spacing={3}>
        <Stack
          direction={matchDownSM ? 'column' : 'row'}
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 3, pb: 0 }}
        >
          <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
          <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={2}>
            <SortingSelect sortBy={sortBy[0].id} setSortBy={setSortBy} allColumns={allColumns} />
            <Button variant="contained" startIcon={<Add />} onClick={handleAdd} size="small">
              Add Customer
            </Button>
            <CSVExport data={selectedFlatRows.length > 0 ? selectedFlatRows.map((d) => d.original) : data} filename={'customer-list.csv'} />
          </Stack>
        </Stack>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup} {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                {headerGroup.headers.map((column) => (
                  <TableCell key={column} {...column.getHeaderProps([{ className: column.className }])}>
                    <HeaderSort column={column} sort />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              const rowProps = row.getRowProps();

              return (
                <Fragment key={i}>
                  <TableRow
                    {...row.getRowProps()}
                    onClick={() => {
                      row.toggleRowSelected();
                    }}
                    sx={{ cursor: 'pointer', bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit' }}
                  >
                    {row.cells.map((cell) => (
                      <TableCell key={cell} {...cell.getCellProps([{ className: cell.column.className }])}>
                        {cell.render('Cell')}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.isExpanded && renderRowSubComponent({ row, rowProps, visibleColumns, expanded })}
                </Fragment>
              );
            })}
            <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
              <TableCell sx={{ p: 2, py: 3 }} colSpan={9}>
                <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Stack>
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
  const [data, setData] = useState([]);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   console.log('toktne-->',token)
  //   axios.get('process.env.REACT_APP_API_URL/api/users', {
  //     headers: {
  //       "token": token,
  //     }}
  //   )

  //     .then((response) => {
  //       setData(response.data);
  //       console.log('response data',response.data)
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching data:', error);
  //     });
  // }, []);
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // navigate("/");
      } else {
        try {
          const response = await axios.get('process.env.REACT_APP_API_URL/api/users', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data) {
            setData(response.data.allusers);
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
      { Header: 'ID', accessor: 'id' },
      { Header: 'Customer Name', accessor: 'customerName' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Contact', accessor: 'contact' },
      { Header: 'Workstatus', accessor: 'workstatus' },
      { Header: 'Whatsapp', accessor: 'whatsapp' }
      // { Header: 'Status', accessor: 'status' }
    ],
    []
  );

  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable
          columns={columns}
          data={data}
          handleAdd={() => console.log('Add Customer')}
          renderRowSubComponent={(row) => {
            return (
              <div style={{ padding: '20px', backgroundColor: alpha(theme.palette.primary.lighter, 0.15), borderRadius: '10px' }}>
                <Typography variant="subtitle1">Customer Details</Typography>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ flex: 1 }}>
                    Customer ID: {row._id}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ flex: 1 }}>
                    Email: {row.customerName}
                    {console.log('Customer name--->',row.customerName)}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ flex: 1 }}>
                    Contact: {row.email}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ flex: 1 }}>
                    Work Status: {row.row.original.workstatus}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ flex: 1 }}>
                    Whatsapp: {row.row.original.whatsapp}
                  </Typography>
                </Stack>
              </div>
            );
          }}
        />
      </ScrollX>
    </MainCard>
  );
};

export default CustomerListPage;

