// material-ui
import { useMemo, useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography } from '@mui/material';

// project-imports
import EcommerceDataCard from 'components/cards/statistics/EcommerceDataCard';
import EcommerceDataChart from 'sections/widget/chart/EcommerceDataChart';

import RepeatCustomerRate from 'sections/widget/chart/RepeatCustomerRate';
import ProjectOverview from 'sections/widget/chart/ProjectOverview';
import ProjectRelease from 'sections/dashboard/default/ProjectRelease';
import AssignUsers from 'sections/widget/statistics/AssignUsers';

import Transactions from 'sections/widget/data/Transactions';
import TotalIncome from 'sections/widget/chart/TotalIncome';
import axios from 'axios';

// assets
import { ArrowDown, ArrowUp, Book, Calendar, CloudChange, Wallet3 } from 'iconsax-react';

// ==============================|| DASHBOARD - DEFAULT ||============================== //


const DashboardDefault = () => {
  const theme = useTheme();
  const [income, setIncome] = useState(null);
  const [TotalUsers, setTotalUsers] = useState([]);



  // ---------------Integration with Earning api----------------

  useEffect(() => {
    const fetchIncome = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/totalearnings`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setIncome(data.totalEarnings); // Assuming your API response has a key 'income' with the income value
      } catch (error) {
        console.error('Error fetching income:', error);
      }
    };

    fetchIncome();
  }, []);

  // ---------------- Handling the large values receiving Income from the api -------------->

  const formatIncome = (income) => {
    if (income >= 1e12) {
      return `₹ ${(income / 1e12).toFixed(1)}T`;
    } else if (income >= 1e9) {
      return `₹ ${(income / 1e9).toFixed(1)}B`;
    } else if (income >= 1e6) {
      return `₹ ${(income / 1e6).toFixed(1)}M`;
    } else {
      return `₹ ${income}`;
    }
  };








// ----------------------Fetching Total Users----------------------------
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // If no token is found, you may want to handle it according to your app's logic
        console.error("No token found");
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the bearer token in the Authorization header
        },
      });

      if (response.data) {
        setTotalUsers(response.data.allusers.length);
        // console.log('response Total Users--->', response.data.allusers.length); 
        // Update rowData state with fetched data
      } else {
        console.error('Empty response data or unexpected htmlFormat');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  fetchUsers();
}, []);



// ----------------------Fetching Total Orders----------------------------






const [orders, setOrders] = useState([]);

  // Function to fetch data from the API
  const fetchData = async () => {
    // Replace the token with your actual token
    const token = localStorage.getItem('token')

    try {
      // Fetch data from the API
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/order/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data) {
        // Set the fetched orders to the state
        setOrders(response.data.orders);
        // console.log('API orders--->', response.data.orders);
      } else {
        console.error('Empty response data or unexpected format');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);




























useEffect(() => {
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // If no token is found, you may want to handle it according to your app's logic
        console.error("No token found");
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the bearer token in the Authorization header
        },
      });

      if (response.data) {
        setTotalUsers(response.data.allusers.length);
        // console.log('response Total Users--->', response.data.allusers.length); 
        // Update rowData state with fetched data
      } else {
        console.error('Empty response data or unexpected htmlFormat');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  fetchUsers();
}, []);



  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sm={6} lg={3}>
        <EcommerceDataCard
          title="All Earning"
          count={income ? formatIncome(income) : 'Loading...'}
          iconPrimary={<Wallet3 />}
          percentage={
            <Typography color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {/* <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> 30.6% */}
            </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.primary.main} />
        </EcommerceDataCard>
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>

        <EcommerceDataCard
          title="Total Users"

          count={TotalUsers ? TotalUsers.toString() : 'Loading...'}

          color="warning"
          iconPrimary={<Book color={theme.palette.warning.dark} />}
          percentage={
            <Typography color="warning.dark" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {/* <ArrowDown size={16} style={{ transform: 'rotate(-45deg)' }} /> 30.6% */}
            </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.warning.dark} />
        </EcommerceDataCard>
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        
        <EcommerceDataCard
          title="Total Orders"
          count={orders.length ? orders.length.toString() : 'Loading...'}
          color="success"
          iconPrimary={<Calendar color={theme.palette.success.darker} />}
          percentage={
            <Typography color="success.darker" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {/* <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> 30.6% */}
            </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.success.darker} />
        </EcommerceDataCard>
      </Grid>
      {/* <Grid item xs={12} sm={6} lg={3}>
        <EcommerceDataCard
          title="Download"
          count="₹ 200"
          color="error"
          iconPrimary={<CloudChange color={theme.palette.error.dark} />}
          percentage={
            <Typography color="error.dark" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ArrowDown size={16} style={{ transform: 'rotate(45deg)' }} /> 30.6%
            </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.error.dark} />
        </EcommerceDataCard>
      </Grid> */}

      {/* row 2 */}
      {/* <Grid item xs={12} md={8} lg={9}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <RepeatCustomerRate />
          </Grid>
          <Grid item xs={12}>
            <ProjectOverview />
          </Grid>
        </Grid>
      </Grid> */}
      {/* <Grid item xs={12} md={4} lg={3}>
        <Stack spacing={3}>
          <ProjectRelease />
          <AssignUsers />
        </Stack>
      </Grid> */}

      {/* row 3 */}
      <Grid item xs={12} md={6}>
        <Transactions />
      </Grid>
      <Grid item xs={12} md={6}>
        <TotalIncome orders={orders}/>
      </Grid>
    </Grid>
  );
};

export default DashboardDefault;
