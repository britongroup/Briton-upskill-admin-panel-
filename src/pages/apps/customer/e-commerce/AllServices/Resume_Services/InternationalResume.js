import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  Fade,
  Grid,
  InputLabel,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';

// third-party
import { PatternFormat } from 'react-number-format';
import { PDFDownloadLink } from '@react-pdf/renderer';

// project-imports
// import CustomerPreview from 'sections/apps/customer/CustomerPreview';
// import CustomerPreview from './CustomerPreview';
// import AlertCustomerDelete from './AlertCustomerDelete';

import AddCustomer from 'sections/apps/customer/AddCustomer';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import { PopupTransition } from 'components/@extended/Transitions';
// import ListSmallCard from './export-pdf/ListSmallCard';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// assets
import { CallCalling, Link2, Location, More, Sms } from 'iconsax-react';
import axios from 'axios'
import { Edit } from '@mui/icons-material';
const avatarImage = require.context('assets/images/users', true);

// ==============================|| CUSTOMER - CARD ||============================== //
const server = process.env.REACT_APP_API_URL;

const InternationalResume = () => {
    const customer ={
        about:'this is about',
        country:"india",
        firstName:'nandkishore',
        lastname:'chhimpa',
        fatherName:'ratan lal ji chhimpa',
        skills:["C++","C++","C++","C++","C++","C++",],
        time:"200 yrs ago",
        role:'softwaare develoer',
        email:'nkempire@gmail.com',
        contact:'+98551513232',
        avatar:'sadfasdfasd',
    





    }
  const [open, setOpen] = useState(false);
  const [service, setService] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    handleMenuClose();
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [add, setAdd] = useState(false);
  const handleAdd = () => {
    setAdd(!add);
  };


  useEffect(() => {
    const getService = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${server}/api/internationalresumeservice/plans`);
        if (response.data.status !== "success") {
          throw new Error();
        }
        setService(response.data?.plans[0]);
        console.log(response.data?.plans[0]);
      } catch (error) {
        toast.error('Error occured');
        console.log('ERROR IN TEXTRESUME .....', error);
      }
      setLoading(false);
    }
    getService();  
  }, [])

  function handleSubmit(e){
    e.preventDefault();
    alert("data updated successfully")
   
  }

  return (
    <>
      <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
        <Grid id="print" container spacing={2.25}>
          <Grid item xs={12}>
            <List sx={{ width: 1, p: 0 }}>
              <ListItem
                disablePadding
                // secondaryAction={
                //   <IconButton edge="end" aria-label="comments" color="secondary" onClick={handleMenuClick}>
                //     <More style={{ fontSize: '1.15rem' }} />
                //   </IconButton>
                // }
              >
                {/* <ListItemAvatar>
                  <Avatar alt={customer.fatherName} src={avatarImage(`./avatar-${!customer.avatar ? 1 : customer.avatar}.png`)} />
                </ListItemAvatar> */}
                <ListItemText
                  primary={<Typography variant="h4">{service?.serviceName}</Typography>}
                //   secondary={<Typography color="text.secondary">{customer.role}</Typography>}
                />
              </ListItem>
              <ListItemText
                  primary={<Typography variant="h4">{service?.price}</Typography>}
                //   secondary={<Typography color="text.secondary">{customer.role}</Typography>}
                />
          
            </List>
                 {/* <Menu
              id="fade-menu"
              MenuListProps={{
                'aria-labelledby': 'fade-button'
              }}
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              TransitionComponent={Fade}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >
             
              <MenuItem onClick={handleAdd}>Edit</MenuItem>
              <MenuItem onClick={handleAlertClose}>Delete</MenuItem>
            </Menu>  */}
            {/* <Fab color="info" aria-label="edit" onClick={handleAdd}>
            <Edit style={{ fontSize: '0.7rem' }} />
            </Fab> */}
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          {/* <Grid item xs={12}>
            <Typography>Hello, {customer.about}</Typography>
          </Grid> */}
          <Grid item xs={12}>
            <Grid container spacing={1} direction={{ xs: 'column', md: 'row' }}>
              <Grid item xs={12}>
              <Typography variant="h5">Plan Details:-</Typography>
              <List
                component="nav"
                sx={{
                    py: 0,
                    '& .MuiListItemButton-root': {
                    '& .MuiListItemSecondaryAction-root': { position: 'relative' }
                    }
                }}
                >
                
                   {service?.plans?.map((plan,index)=>(

                    <div className="w-full mt-2 px-2 h-auto flex flex-col   justify-between border-[1px] text-[16px] rounded-md border-gray-100 py-2 mx-2 ">
                      <div className="w-full flex flex-row justify-between align-middle items-center">
                        <div>{plan.planName}</div>
                        <div className='hover:underline text-[14px] text-gray-400 px-[4px] rounded-md border-[1px] hover:shadow cursor-pointer py-[2px] '  onClick={handleAdd}>Edit</div>
                      </div>
                      <div>INR {plan.price}/-</div>  

                    </div>

                      
                     ))
                   }          
               
                </List>
              </Grid>
             
            </Grid>
          </Grid>
         
        </Grid>
        <Stack
          direction="row"
          className="hideforPDf"
          alignItems="center"
          spacing={1}
          justifyContent="space-between"
          sx={{ mt: 'auto', mb: 0, pt: 2.25 }}
        >
          <Typography variant="caption" color="text.secondary">
            Last Updated {service?.updatedAt} 
          </Typography>
         
        </Stack>
      </MainCard>

      {/* edit customer dialog */}
      <Dialog
        maxWidth="sm"
        fullWidth
        TransitionComponent={PopupTransition}
        onClose={handleAdd}
        open={add}
        sx={{ '& .MuiDialog-paper': { p: 0 } }}
      >
              <div>

              <DialogTitle>Edit Pricing</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
            <form onSubmit={handleSubmit}>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                          <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-name">Plan ka name</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-name"
                          placeholder="Enter price of plan"
                          // {...getFieldProps('name')}
                          // error={Boolean(touched.name && errors.name)}
                          // helperText={touched.name && errors.name}
                          // value={plan.price}
                        />
                      </Stack>
          </Grid>
        </Grid>
          <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button color="error" onClick={handleAdd}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" className="bg-blue-600 text-white hover:text-blue-600 hover:bg-white ">
                    Save
                  </Button>
                </Stack>
              </Grid>
          </Grid>
            </form>
            </DialogContent>
      </div>
        {/* <AddCustomer service={service} onCancel={handleAdd} /> */}
      </Dialog>
      
    </>
  );
};


export default InternationalResume;
