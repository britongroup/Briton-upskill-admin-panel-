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

const HighYourResume = () => {
    const customer ={
        about:'this is about',
        country:"india",
        firstName:'sdfs',
        lastname:'dsfsadfdsf',
        fatherName:'faslkdjflasdkjfsd',
        skills:["C++","C++","C++","C++","C++","C++",],
        time:"200 yrs ago",
        role:'softwaare develoer',
        email:'einsdfre@gmail.com',
        contact:'+98551513232',
        avatar:'sadfasdfasd',
        }
  const [open, setOpen] = useState(false);
  const [service, setService] = useState([]);
  const [loading, setLoading] = useState(false);
  // Edit Code starting from here
  const [editPrice, setEditPrice] = useState();
  const [editId, setEditId] = useState()
  const [editPlanName, setEditPlanName]= useState();
  const [editPlanArray, setEditPlanArray] = useState([]);
  // Define a state variable to track whether data has been updated
  const [dataUpdated, setDataUpdated] = useState(false);
  

  async function handleSubmit(e){
    const token = localStorage.getItem('token');
    console.log("this is token ",token);
    e.preventDefault();
   console.log('this is the ID of Plan', editId)
    console.log('this is Price', editPrice);
    console.log('this is plan Name/Option Name', editPlanName);

    const requestData = {
      serviceName:editPlanName,
      plans: editPlanArray
    }
    console.log("this is request|Data in Highlight resume", requestData);

    try {
      const response = await axios.patch(`${server}/api/highlightresume/update-highlight-resume/${editId}`,requestData, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.status !== 200) {
        throw new Error();
      }

      toast.success("Price Updated Successfully");
      console.log("this the response", response);
    } catch (error) {
      toast.error('Error occured');
      console.log('ERROR IN TEXTRESUME .....', error);
    }
    setDataUpdated(true);
  }


// // Use dataUpdated state variable to conditionally render or perform actions
// useEffect(() => {
//   if (dataUpdated) {
//     // Perform actions that need to happen after data update

//     // Reset dataUpdated state variable
//     setDataUpdated(false);
//   }
// }, [dataUpdated]);




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
    console.log("this is starting point in highlight resume");
    const getService = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${server}/api/highlightresume/highlight-resumes`);
        if (response.data.status !== "success") {
          throw new Error();
        }
        setService(response.data?.highlightResumes[0]);
        console.log('this is Highlight resume data',response.data?.highlightResumes[0]);
        setEditPlanArray(response.data?.highlightResumes[0]?.plans);
      } catch (error) {
        // toast.error('Error occured');
        console.log('ERROR IN TEXTRESUME .....', error);
      }
      setLoading(false);
    }
    getService();  
  }, [])



  const onChange = (e, index) => {
    const updatedPlans = [...editPlanArray]; // create a copy of editPlanArray
    console.log("updated Plans", updatedPlans);
    console.log("this is editPlanArray", editPlanArray)
    updatedPlans[index].price = e.target.value; // update the price of the plan at the given index
    setEditPlanArray(updatedPlans); // update the state with the modified array
  };
  

  return (
    <>
      <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
        <Grid id="print" container spacing={2.25}>
          <Grid item xs={12}>
            <List sx={{ width: 1, p: 0 }}>
              <ListItem
                disablePadding
                secondaryAction={
                  <IconButton edge="end" aria-label="comments" color="secondary"  onClick={()=>{
                    // setEditPrice(service?.price);
                      // setEditPlanName(service?.serviceName);
                      setEditId(service?._id);
                      handleAdd();

                  }}>
                    <div className='py-[3px] px-4 border-[2px] border-gray-200 rounded-md cursor-pointer hover:shadow' 
                    onClick={()=>{
                      // setEditPrice(service?.price);
                      // setEditPlanName(service?.serviceName);
                      // setEditId(service?._id);
                      handleAdd();
                    }
                    }>
              Edit
            </div>
                  </IconButton>
                }
              >
                    
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
                        <div>{plan?.durationMonths} months</div>
                        {/* <div className='hover:underline text-[14px] text-gray-400 px-[4px] rounded-md border-[1px] hover:shadow cursor-pointer py-[2px] '  onClick={()=>{
                          setEditId(plan?._id);
                          setEditPlanName(plan?.durationMonths);
                          setEditPrice(plan?.price)
                          handleAdd();
                          }}>Edit</div> */}
                      </div>
                      <div>INR {plan?.price}/-</div>  

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
            {editPlanArray?.map((plan,index)=>(
              <Grid item xs={12} key={index}>
                          <Stack spacing={1.25}>
                          <InputLabel htmlFor={`customer-name-${index}`}>{plan?.durationMonths} Months</InputLabel>
                          <TextField
                            fullWidth
                            id={`customer-name-${index}`}
                            placeholder="Enter price of plan"
                            onChange={(e) => onChange(e, index)}
                            value={plan.price}
                          />

                      </Stack>
          </Grid>
             ))
            } 
        </Grid>
          <Grid container justifyContent="space-between" alignItems="center" className="mt-2">
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
      {/* <ToastContainer
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
      /> */}
      
    </>
  );
};


export default HighYourResume;
