// material-ui
import { Button, Grid, IconButton, Typography } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';

// assets
import { More } from 'iconsax-react';

import Avatar1 from 'assets/images/users/avatar-5.png';
import Avatar2 from 'assets/images/users/avatar-6.png';
import Avatar3 from 'assets/images/users/avatar-7.png';
import Avatar4 from 'assets/images/users/avatar-8.png';
import Avatar5 from 'assets/images/users/avatar-9.png';

// ==============================|| INVOICE - DASHBOARD USER ||============================== //

const InvoiceUserList = ({Invoices}) => {
  return (
    <MainCard
      title="Recent Invoice"
      secondary={
        <IconButton edge="end" aria-label="comments" color="secondary">
          <More style={{ fontSize: '1.15rem' }} />
        </IconButton>
      }
    >

      {/* {console.log('Invoice user k list--->',Invoices)} */}
      <Grid container spacing={2.5} alignItems="center">
      {Invoices.slice(-5).map((row) => (
        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar alt="User 1" src={Avatar1} />
            </Grid>
            <Grid item xs zeroMinWidth>
              <Typography align="left" variant="subtitle1">
                {row.name} -{' '}
                <Typography color="secondary" component="span">
                  {' '}
                  {/* #790841 */}
                  {row.orderId}
                </Typography>
              </Typography>
              <Typography align="left" color="primary">
              {/* ₹ 329.20 */}
              </Typography>
            </Grid>
            <Grid item>
              <Typography align="left" variant="caption" color="secondary">
                {/* 5 min ago */}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      ))}
       
        {/* <Grid item xs={12}>
          <Button fullWidth variant="outlined" color="secondary">
            View All
          </Button>
        </Grid> */}
      </Grid>
    </MainCard>
  );
};

export default InvoiceUserList;
