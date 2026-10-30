import React, { useState, useEffect } from 'react';
import { Box, Grid, FormControlLabel, Checkbox, Typography, Button } from '@mui/material';
import PreviewModal from './PreviewModal';
import showAlert from '../../../global/common/MessageBox/AlertService';
import { getFinalSubmissionSuccessAlert, getFinalSubmissionErrorAlert } from '../../../global/util/applicationFormSteps';
import FirmPreviewModal from './FirmPreviewModal';
import Undertaking from '../../../../service/AdminService/Undertaking';
import { useSelector } from 'react-redux';
import ApplicationForm from '../../../../service/NewLicenseService/ApplicationForm';
import { useNavigate } from 'react-router-dom';
import printApplicationPreview from '../../../global/util/printApplicationPreview';

const FirmDeclarization = ({ handlePreview, handleNext, handleBack,data  }) => {
  const [checkedState, setCheckedState] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [allUndertakingList, setAllUndertakingList] = useState([]); // Initialize as an array
  const [allSubServiceList, setAllSubServiceList] = useState([]);
  const userName = useSelector((state)=>state.jwtAuthentication.username);
  const homePath = useSelector((state)=>state.jwtAuthentication.homePath);
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
          .filter(item => item.appTypeMasterId.appTypeMasterId === 2)
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
  const handleBacks = () => {
    handleBack();
  };

  const navigate = useNavigate();
  const continues = () => {
    setLoading(true);

    ApplicationForm.addApplicationForm(allUndertakingList)
        .then((response) => {
            console.log(response);
            if (response) {
                const successAlert = getFinalSubmissionSuccessAlert();
                showAlert({
                    messageTitle: successAlert.messageTitle,
                    messageContent: successAlert.messageContent,
                    confirmText: 'OK',
                    onConfirm: () => { navigate(homePath || "/licensee/licenseedashboard", { replace: true }); },
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: true
                });
            }
        })
        .catch((err) => {
            const errorAlert = getFinalSubmissionErrorAlert(err);
            showAlert({
                messageTitle: errorAlert.messageTitle,
                messageContent: errorAlert.messageContent,
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true
            });
        })
        .finally(() => {
            setLoading(false);
        });
};

  const Yes = () => {
    showAlert({
      messageTitle: 'Submit the Application Form',
      messageContent: "After submission, you will not be able to edit the application. Are you sure you want to continue?",
      confirmText: 'yes',
      closeText: "cancel",
      onConfirm: () => continues(),
      enableHeaderCloseBtn: true,
      disableOutsideKeyDown: true,
      maxWidth: 'sm',
      fullWidth: true,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Undertakings to submit:", allUndertakingList); // Logs the selected undertakings with their IDs
    Yes();
   
  };

  const preViewData = () =>{
       
    showAlert({
        messageTitle: 'Preview Application Data',
        messageContent: (<>
            <FirmPreviewModal checkedState={checkedState} data={data}
           />
        </>),
        confirmText: 'Ok',
        enableHeaderCloseBtn: true,
        disableOutsideKeyDown: true,
        maxWidth:'md',
        fullWidth:true,
        headerButtonText: 'Print PDF',
        onHeaderButtonClick: async ({ contentElement }) => {
          try {
            await printApplicationPreview({
              contentElement: contentElement(),
              fetchFile: (appDocId) => ApplicationForm.viewFile(appDocId),
              userName,
              title: 'Renewal Application Form Preview',
            });
          } catch (error) {
            showAlert({
              messageTitle: 'Print PDF',
              messageContent: error?.message || 'Unable to prepare the application for printing.',
              confirmText: 'Ok',
              enableHeaderCloseBtn: true,
            });
          }
        },
    })
   
}



  return (
    <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={handleFormSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ mt: 2, mb: 1 }}>
          <Typography variant="h7"><b>Undertakings</b></Typography>
        </Grid>

        {allSubServiceList
          .filter(item => item.appTypeMasterId.appTypeMasterId === 2)  // Filter for appTypeMasterId = 1
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
          type="submit"
          variant="contained"
          color="primary"
          disabled={!allCheckboxesChecked()}  // Enable submit only if all checkboxes are checked
        >
          Submit Application
        </Button>
      </Box>
    </Box>
  );
};

export default FirmDeclarization;
