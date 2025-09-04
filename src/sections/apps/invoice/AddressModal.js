import PropTypes from 'prop-types';
import { useMemo, useEffect, useState } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  FormControl,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material';

// third-party
import { Add, SearchNormal1 } from 'iconsax-react';

// ==============================|| INVOICE - SELECT ADDRESS ||============================== //

const AddressModal = ({ open, setOpen, handlerAddress }) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    email: ''
  });

  function closeAddressModal() {
    setOpen(false);
  }

  function handleInputChange(event, field) {
    setCustomerInfo((prevCustomerInfo) => ({
      ...prevCustomerInfo,
      [field]: event.target.value
    }));
  }

  function addAddress() {
    handlerAddress(customerInfo);
    closeAddressModal();
  }

  return (
    <Dialog
      maxWidth="sm"
      open={open}
      onClose={closeAddressModal}
      sx={{ '& .MuiDialog-paper': { p: 0 }, '& .MuiBackdrop-root': { opacity: '0.5 !important' } }}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Select Address</Typography>
          <Button startIcon={<Add />} onClick={closeAddressModal} color="primary">
            Add New
          </Button>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 2.5 }}>
        <FormControl sx={{ width: '100%', pb: 2 }}>
          <TextField
            autoFocus
            id="name"
            name="name"
            value={customerInfo.name}
            onChange={(e) => handleInputChange(e, 'name')}
            placeholder="Name"
            fullWidth
          />
        </FormControl>
        <FormControl sx={{ width: '100%', pb: 2 }}>
          <TextField
            autoFocus
            id="address"
            name="address"
            value={customerInfo.address}
            onChange={(e) => handleInputChange(e, 'address')}
            placeholder="Address"
            fullWidth
          />
        </FormControl>
        <FormControl sx={{ width: '100%', pb: 2 }}>
          <TextField
            autoFocus
            id="city"
            name="city"
            value={customerInfo.city}
            onChange={(e) => handleInputChange(e, 'city')}
            placeholder="City"
            fullWidth
          />
        </FormControl>
        <FormControl sx={{ width: '100%', pb: 2 }}>
          <TextField
            autoFocus
            id="phone"
            name="phone"
            value={customerInfo.phone}
            onChange={(e) => handleInputChange(e, 'phone')}
            placeholder="Phone"
            fullWidth
          />
        </FormControl>
        <FormControl sx={{ width: '100%', pb: 2 }}>
          <TextField
            autoFocus
            id="email"
            name="email"
            value={customerInfo.email}
            onChange={(e) => handleInputChange(e, 'email')}
            placeholder="Email"
            fullWidth
          />
        </FormControl>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2.5 }}>
        <Button color="error" onClick={closeAddressModal}>
          Cancel
        </Button>
        <Button onClick={addAddress} color="primary" variant="contained" className="bg-blue-500 text-white hover:bg-blue-600">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};



AddressModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  handlerAddress: PropTypes.func
};

const Address = ({ handlerAddress }) => {
  const theme = useTheme();

  const addressData = [
    // {
      // name: 'Ian Carpenter',
    //   address: '1754 Ureate, RhodSA5 5BO',
    //   phone: '+91 1234567890',
    //   email: 'iacrpt65@gmail.com'
    // },
    // { name: 'Belle J. Richter', address: '1300 Mine RoadQuemado, NM 87829', phone: '305-829-7809', email: 'belljrc23@gmail.com' },
    // { name: 'Ritika Yohannan', address: '3488 Arbutus DriveMiami, FL', phone: '+91 1234567890', email: 'rtyhn65@gmail.com' },
    // { name: 'Jesse G. Hassen', address: '3488 Arbutus DriveMiami, FL 33012', phone: '+91 1234567890', email: 'jessghs78@gmail.com' },
    // {
    //   name: 'Christopher P. Iacovelli',
    //   address: '4388 House DriveWesrville, OH',
    //   phone: '+91 1234567890',
    //   email: 'crpthl643@gmail.com'
    // },
    // { name: 'Thomas D. Johnson', address: '4388 House DriveWestville, OH +91', phone: '1234567890', email: 'thomshj56@gmail.com' }
  ];

  return (
    <>
      {/* <{addressData.map((address) => (
        <Box
          onClick={() => handlerAddress(address)}
          key={address.email}
          sx={{
            width: '100%',
            border: '1px solid',
            borderColor: 'secondary.200',
            borderRadius: 1,
            p: 1.25,
            '&:hover': {
              bgcolor: theme.palette.primary.lighter,
              borderColor: theme.palette.primary.lighter
            }
          }}
        >
          <Typography textAlign="left" variant="subtitle1">
            {address.name}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Typography textAlign="left" variant="body2" color="secondary">
              {address.address}
            </Typography>
            <Typography textAlign="left" variant="body2" color="secondary">
              {address.phone}
            </Typography>
            <Typography textAlign="left" variant="body2" color="secondary">
              {address.email}
            </Typography>
          </Stack>
        </Box>
      ))}> */}
    </>
  );
};

Address.propTypes = {
  handlerAddress: PropTypes.func
};

export default AddressModal;
