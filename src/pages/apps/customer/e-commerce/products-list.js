import { useMemo, useState, useEffect } from 'react';

// material-ui
import {
  Grid,
  Stack,
  useMediaQuery,
  Button,
  FormControl,
  Select,
  MenuItem,
  Box,
  Dialog,
  Slide,
  Pagination,
  Typography
} from '@mui/material';

// project-imports
import { PopupTransition } from 'components/@extended/Transitions';
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';
import CustomerCard from 'sections/apps/customer/CustomerCard';
import AddCustomer from 'sections/apps/customer/AddCustomer';

import makeData from 'data/react-table';
import { GlobalFilter } from 'utils/react-table';
import usePagination from 'hooks/usePagination';

// assets
import { Add } from 'iconsax-react';
import axios from 'axios';
import ResumeText from './AllServices/Resume_Services/ResumeText';
import ResumeCritique from './AllServices/Resume_Services/ResumeCritique';
import VisualResume from './AllServices/Resume_Services/VisualResume';
import ZapYourResume from './AllServices/Resume_Services/ZapYourResume';
import CoverLetter from './AllServices/Resume_Services/CoverLetter';
import HighYourResume from './AllServices/Resume_Services/HighYourResume';
import InternationalResume from './AllServices/Resume_Services/InternationalResume';
import InterviewPrepration from './AllServices/Resume_Services/InterviewPrepration';
import SocialProfiler from './AllServices/Resume_Services/SocialProfiler';
import VisualInternational from './AllServices/Resume_Services/VisualInternational';
import ComboResumePack from './AllServices/value-packs/ComboResumePack';
import ComboHighlight from './AllServices/value-packs/ComboHighlight';
import DocumentVerification from './AllServices/all-job-services/DocumentVerification';
import JobAlerts from './AllServices/all-job-services/JobAlerts';
import EmployeeVerification from './AllServices/all-job-services/EmployeeVerification';
import JobSearchAssistant from './AllServices/all-job-services/JobSearchAssistant';
// import ResumeCard from './AllServices/ResumeCard';
// constant
const allColumns = [
  {
    id: 1,
    header: 'Default'
  },
  {
    id: 2,
    header: 'Customer Name'
  },
  {
    id: 3,
    header: 'Email'
  },
  {
    id: 4,
    header: 'Contact'
  },
  {
    id: 5,
    header: 'Age'
  },
  {
    id: 6,
    header: 'Country'
  },
  {
    id: 7,
    header: 'Status'
  }
];

// ==============================|| CUSTOMER - CARD ||============================== //

const server = process.env.REACT_APP_API_URL;
console.log("this is server varialbe", server);
const ProductList = () => {
  const data = useMemo(() => makeData(12), []);
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [sortBy, setSortBy] = useState('Default');
  const [globalFilter, setGlobalFilter] = useState('');
  const [add, setAdd] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [userCard, setUserCard] = useState([]);
  const [page, setPage] = useState(1);
  const [rowData, setRowData] = useState();
  const [loading, setLoading] = useState(false);
  const handleChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleAdd = () => {
    setAdd(!add);
    if (customer && !add) setCustomer(null);
  };

  // search
  useEffect(() => {
    const newData = data.filter((value) => {
      if (globalFilter) {
        return value.fatherName.toLowerCase().includes(globalFilter.toLowerCase());
      } else {
        return value;
      }
    });
    setUserCard(newData);

  }, [globalFilter, data]);


  // useEffect(()=>{
  //   try{
  //      console.log("API CALL HONE SE PEHLE");

  //     const response = axios.get(`${server}/api/empbgvarification/plans`);
  //     console.log("this is the reponse of api", response);
  //     if(response.data == 200){
  //       setRowData(response.data.plan);
  //     }
  //   }
  //   catch(error){
  //     console.log("ye error aa gyi", error);


  //   }
  // },[])


  
  const PER_PAGE = 6;

  const count = Math.ceil(userCard.length / PER_PAGE);
  const _DATA = usePagination(userCard, PER_PAGE);

  const handleChangePage = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  return (
    <>
      <Box sx={{ position: 'relative', marginBottom: 3 }}>
        <Stack direction="row" alignItems="center">
          {/* <Stack
            direction={matchDownSM ? 'column' : 'row'}
            sx={{ width: '100%' }}
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <GlobalFilter preGlobalFilteredRows={data} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
            <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <Select
                  value={sortBy}
                  onChange={handleChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                  renderValue={(selected) => {
                    if (!selected) {
                      return <Typography variant="subtitle1">Sort By</Typography>;
                    }

                    return <Typography variant="subtitle2">Sort by ({sortBy})</Typography>;
                  }}
                >
                  {allColumns.map((column) => {
                    return (
                      <MenuItem key={column.id} value={column.header}>
                        {column.header}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <Button variant="contained" startIcon={<Add />} onClick={handleAdd} size="large">
                Add Customer
              </Button>
            </Stack>
          </Stack> */}
          <div className='flex flex-row w-[100%] px-5'>
            <div  className='hover:border-b-4 hover:cursor-pointer border-b-4 border-b-transparent transition-transform duration-200 hover:border-orange-500 py-4 px-2'>All Services</div>
            <div  className='hover:border-b-4 hover:cursor-pointer border-b-4 border-b-transparent transition-transform duration-200 hover:border-orange-500  py-4 px-2'>Resume Writing</div>
            <div  className='hover:border-b-4 hover:cursor-pointer border-b-4 border-b-transparent transition-transform duration-200 hover:border-orange-500 py-4 px-2'>International Services</div>
            <div  className='hover:border-b-4 hover:cursor-pointer border-b-4 border-b-transparent transition-transform duration-200 hover:border-orange-500 py-4 px-2'>Career Growth</div>
            <div  className='hover:border-b-4 hover:cursor-pointer border-b-4 border-b-transparent transition-transform duration-200 hover:border-orange-500 py-4 px-2'>Screening Services</div>
            <div  className='hover:border-b-4 hover:cursor-pointer border-b-4 border-b-transparent transition-transform duration-200 hover:border-orange-500 py-4 px-2'>Value Packs</div>

          </div>
        </Stack>
      </Box>
      {/* <Grid container spacing={3}>


        {loading ? (<div className='flex justify-center items-center text-xl text-gray-600 h-[60vh]'>Please Wait...</div>): (
          rowData?.map((user, index) => (
              <Slide key={index} direction="up" in={true} timeout={50}>
                <Grid item xs={12} sm={6} lg={4}>
                  <ResumeCard customer={user} />
                </Grid>
              </Slide>
            ))
        )}
      </Grid>             */}
      
      <Grid container spacing={3}>
      <Slide  direction="up" in={true} timeout={50}>
              <Grid item xs={12} sm={6} lg={4}>
                  <ResumeText/>
                </Grid> 
              
      </Slide>
      {/* <Slide  direction="up" in={true} timeout={50}>
             
             <Grid item xs={12} sm={6} lg={4}>
               <VisualResume/>
             </Grid>
          
   </Slide> */}
   {/* <Slide  direction="up" in={true} timeout={50}>
              <Grid item xs={12} sm={6} lg={4}>
                  <VisualInternational/>
                </Grid> 
              
      </Slide> */}
  
      <Slide  direction="up" in={true} timeout={50}>
              <Grid item xs={12} sm={6} lg={4}>
                  <HighYourResume/>
                </Grid> 
              
      </Slide>
      {/* <Slide  direction="up" in={true} timeout={50}>
              <Grid item xs={12} sm={6} lg={4}>
                  <InternationalResume/>
                </Grid> 
              
      </Slide> */}
      
      {/* Job Services */}
      <Slide  direction="up" in={true} timeout={50}>
             
             <Grid item xs={12} sm={6} lg={4}>
               <DocumentVerification/>
             </Grid> 
     </Slide>
     <Slide  direction="up" in={true} timeout={50}>
             
             <Grid item xs={12} sm={6} lg={4}>
               <EmployeeVerification/>
             </Grid> 
     </Slide>
      <Slide  direction="up" in={true} timeout={50}>
             
             <Grid item xs={12} sm={6} lg={4}>
               <JobAlerts/>
             </Grid> 
     </Slide>
     <Slide  direction="up" in={true} timeout={50}>
             
             <Grid item xs={12} sm={6} lg={4}>
               <JobSearchAssistant/>
             </Grid> 
     </Slide>


      {/* Value Pack service */}

      <Slide  direction="up" in={true} timeout={50}>
             
             <Grid item xs={12} sm={6} lg={4}>
               <ComboResumePack/>
             </Grid> 
     </Slide>
   <Slide  direction="up" in={true} timeout={50}>
             
             <Grid item xs={12} sm={6} lg={4}>
               <ComboHighlight/>
             </Grid> 
   </Slide>
   <Slide  direction="up" in={true} timeout={50}>
              <Grid item xs={12} sm={6} lg={4}>
                  <ResumeCritique/>
                </Grid> 
              
      </Slide>
      <Slide  direction="up" in={true} timeout={50}>
              <Grid item xs={12} sm={6} lg={4}>
                  <CoverLetter/>
                </Grid> 
              
      </Slide>
      <Slide  direction="up" in={true} timeout={50}>
              <Grid item xs={12} sm={6} lg={4}>
                  <InterviewPrepration/>
                </Grid> 
              
      </Slide>
      <Slide  direction="up" in={true} timeout={50}>
              <Grid item xs={12} sm={6} lg={4}>
                  <SocialProfiler/>
                </Grid> 
              
      </Slide>
   

      <Slide  direction="up" in={true} timeout={50}>
             
                <Grid item xs={12} sm={6} lg={4}>
                  <ZapYourResume/>
                </Grid> 
      </Slide>

   

        {/* {userCard.length > 0 ? (
          _DATA
            .currentData()
            .sort(function (a, b) {
              if (sortBy === 'Customer Name') return a.fatherName.localeCompare(b.fatherName);
              if (sortBy === 'Email') return a.email.localeCompare(b.email);
              if (sortBy === 'Contact') return a.contact.localeCompare(b.contact);
              if (sortBy === 'Age') return b.age < a.age ? 1 : -1;
              if (sortBy === 'Country') return a.country.localeCompare(b.country);
              if (sortBy === 'Status') return a.status.localeCompare(b.status);
              return a;
            })
            .map((user, index) => (
              <Slide key={index} direction="up" in={true} timeout={50}>
                <Grid item xs={12} sm={6} lg={4}>
                  <CustomerCard customer={user} />
                </Grid>
              </Slide>
            ))
        ) : (
          <EmptyUserCard title={'Please Add Services .'} />
        )} */}
      </Grid>
      <Stack spacing={2} sx={{ p: 2.5 }} alignItems="flex-end">
        <Pagination
          count={count}
          size="medium"
          page={page}
          showFirstButton
          showLastButton
          variant="combined"
          color="primary"
          onChange={handleChangePage}
        />
      </Stack>

      {/* add customer dialog */}
      <Dialog
        maxWidth="sm"
        fullWidth
        TransitionComponent={PopupTransition}
        onClose={handleAdd}
        open={add}
        sx={{ '& .MuiDialog-paper': { p: 0 } }}
      >
        <AddCustomer customer={customer} onCancel={handleAdd} />
      </Dialog>
    </>
  );
};

export default ProductList;
