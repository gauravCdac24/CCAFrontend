import React, { useState, useEffect, useRef } from 'react';
import { Box, Grid, FormControlLabel, Checkbox, Typography, Button } from '@mui/material';
import PreviewModal from './PreviewModal';
import showAlert from '../../../global/common/MessageBox/AlertService';
import Undertaking from '../../../../service/AdminService/Undertaking';
import { useSelector } from 'react-redux';
import ApplicationForm from '../../../../service/NewLicenseService/ApplicationForm';
import { useNavigate } from 'react-router-dom';
import IndivSubmitPreview from './IndivSubmitPreview';

const Declarization = ({ handleBack, data }) => {
  const [checkedState, setCheckedState] = useState({});
  const [allUndertakingList, setAllUndertakingList] = useState([]); // Initialize as an array
  const [isLoading, setLoading] = useState(false);
  const [allSubServiceList, setAllSubServiceList] = useState([]);
  const userName = useSelector((state)=>state.jwtAuthentication.username);
  const appTypeMasterId= useSelector((state)=>state.licenseApplication.applicationType);
  console.log(userName);
  console.log(appTypeMasterId);
  // Fetch undertakings
  const getAllUndertaking = () => {
    setLoading(true);
    Undertaking.getAllUndertakingList()
      .then((response) => {
        console.log("Fetched undertaking list:", response.data);
        setAllSubServiceList(response.data);
        const initialCheckedState = {};
        response.data
          .filter(item => item.appTypeMasterId.appTypeMasterId === 1)
          .forEach((item) => {
            initialCheckedState[item.undertakingId] = false; // Store undertakingId as key
          });
        setCheckedState(initialCheckedState);
      })
      .catch((err) => {
        console.error("Error fetching underTaking list:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllUndertaking();
  }, []);

 const ref = useRef();

const handlePreviewSubmit = () =>{
        ref.current.handleSubmit();
    }

    const handlePreviewReset = () => {
        ref.current.handleReset();
    }

  const IndivSubmitPreviewModal = (allUndertakingList) => {

    console.log("allUndertakingList---->", allUndertakingList)

    
    showAlert({
      messageTitle: 'Preview Application',
      messageContent: (
      <>   <IndivSubmitPreview ref={ref} allUndertakingsList={allUndertakingList} /></>),
      
   
      enableHeaderCloseBtn: true,
      disableOutsideKeyDown: true,
      fullWidth: true,
      maxWidth: 'md',
      buttonOneText: 'Submit',
      buttonTwoText: 'Cancel',
      onButtonOneClick: () => handlePreviewSubmit(),
      onButtonTwoClick: () => handlePreviewReset()
    });
     
  }



  // Check if all checkboxes are checked
  const allCheckboxesChecked = () => {
    return Object.values(checkedState).every(value => value === true);
  };

  const handleCheckboxChange = (event, undertakingId) => {
    const { checked } = event.target;

    // Update checked state
    setCheckedState({
      ...checkedState,
      [undertakingId]: checked,
    });

    if (checked) {
      // Add undertaking details to allUndertakingList when checked
      setAllUndertakingList((prevList) => [
        
        {
          AppUndertakingId: '', // You can replace this with actual values if needed
          undertakingId: String(undertakingId),
          userName: userName || '', // Assuming you have userName in data
          intentId: '',  // Assuming you have intentId in data
          appTypeMasterId:String(appTypeMasterId)||'',
        },
      ]);
    } else {
      // Remove the unchecked item from allUndertakingList
      setAllUndertakingList((prevList) =>
        prevList.filter((item) => item.UndertakingId !== undertakingId)
      );
    }
  };
console.log(allUndertakingList)
  const handleBacks = () => {
    handleBack();
  };
  const navigate = useNavigate();


  const preViewData = () => {
    showAlert({
      messageTitle: 'Preview Application Data',
      messageContent: (
        <>
          <PreviewModal checkedState={checkedState} data={data} />
        </>
      ),
      confirmText: 'Ok',
      enableHeaderCloseBtn: true,
      disableOutsideKeyDown: true,
      maxWidth: 'md',
      fullWidth: true,
    });
  };

  return (
    <Box component="form" noValidate sx={{ mt: 2, p: 2 }} >
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ mt: 2, mb: 1 }}>
          <Typography variant="h7"><b>Undertakings</b></Typography>
        </Grid>

        {allSubServiceList
          .filter(item => item.appTypeMasterId.appTypeMasterId === 1)  // Filter for appTypeMasterId = 1
          .map((filteredItem, index) => (
            <Grid item xs={12} key={filteredItem.undertakingId}>
              <FormControlLabel
                control={
                  <Checkbox
                    name={`undertaking${index + 1}`}
                    checked={checkedState[filteredItem.undertakingId] || false}  // Use undertakingId for state
                    onChange={(event) => handleCheckboxChange(event, filteredItem.undertakingId)}  // Pass undertakingId to handleCheckboxChange
                  />
                }
                label={`${index + 1}. ${filteredItem.undertakingsTitle}`}  // Dynamically use the title
              />
            </Grid>
          ))
        }
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, ml: 1 }}>
        <Button
          onClick={handleBacks}
          sx={{ mr: 1 }}
          variant="contained"
          color="primary"
        >
          Back
        </Button>
        <Button
          onClick={preViewData}
          sx={{ mr: 1 }}
          variant="contained"
          color="secondary"
        >
          Preview
        </Button>
        <Button
          type="button"
          variant="contained"
          color="primary"
         onClick={()=>IndivSubmitPreviewModal(allUndertakingList)}
          disabled={!allCheckboxesChecked()}  // Enable submit only if all checkboxes are checked
        >
          Submit Application
        </Button>
      </Box>
    </Box>
  );
};

export default Declarization;
