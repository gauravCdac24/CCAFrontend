import React, { useEffect, useState } from 'react';
import { Box, Grid, Button, Typography, Link } from '@mui/material';
import LoaderProgress from '../../../global/common/LoaderProgress';
import showAlert from '../../../global/common/MessageBox/AlertService';
import FormWrapper from '../../../global/util/FormWrapper';
import CessationService from '../../../../service/CessationService/CessationService';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { decrypt, encrypt } from '../../../global/util/EncryptDecrypt';
import { useSelector } from 'react-redux';
import { timeStampToDate } from '../../../global/util/TimestampConverter';
import LicenseIssuanceService from '../../../../service/LicenseIssuanceService/LicenseIssuanceService';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AnnualAuditService from '../../../../service/AnnualAuditService/AnnualAuditService';

const AnnualAuditStartDate = (userName) => {
  const userNames = userName.userName;
console.log("userName",userNames)





 
  const [licenseDetails, setLicenseDetails] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [cessationList, setCessationList] = useState({});

  const getLicenseDetailsByUsername = () => {
 
         setLoading(true);
         LicenseIssuanceService.getLicenseDetailsByUserName(userNames)
             .then((res) => {
                 setLicenseDetails(res.data);
             })
             .catch((err) => {
 
             })
             .finally(() => {
                 setLoading(false);
             })
 
 
     }


     const [formValues, setFormValues] = useState({
      auditScheduleId: "",
      licenseId: "", // Initialize with an empty string
      startDate: "",
      status: "",
      created: "",
      updated: "",
      createdBy: "",
      updatedBy: "",
      userName: userNames,
    });
  
    // Update licenseId when licenseDetails changes
    useEffect(() => {
      if (licenseDetails?.licenseId) {
        setFormValues((prevValues) => ({
          ...prevValues,
          licenseId: licenseDetails.licenseId,
        }));
      }
    }, [licenseDetails]);

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormValues({ ...formValues, [name]: value });
};

  const handleConfirmSubmit = () => {
    setLoading(true);

    AnnualAuditService.submitLicenseeAuditForm(formValues)
      .then((response) => {
        showAlert({
          messageTitle: 'Success',
          messageContent: response.data,
          confirmText: 'Ok',
          closeParent: true,
         // onConfirm: ()=>handleBack()
        });
      })
      .catch((err) => {
        showAlert({
          messageTitle: 'Error',
          messageContent: err.response?.data || 'Failed to upload the file. Please try again later.',
          confirmText: 'Ok',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleApprove = () => {
    showAlert({
      messageTitle: 'Confirm',
      messageContent: 'Are you sure you want to annual audit of this application?',
      confirmText: 'Yes',
      closeText: 'No',
      fullWidth: true,
      maxWidth: 'sm',
      onConfirm: handleConfirmSubmit,
    });
  };

useEffect(() => {
  getLicenseDetailsByUsername();
  }, []);
 

  return (
    <>
      <LoaderProgress open={isLoading} />


      <FormWrapper headingText="Annual Audit Start Date">
        <Box component="form" noValidate sx={{ mt: 2, p: 2 }}>

                                      <Grid container spacing={2}>
                                        <Grid item xs>
                                            <Typography variant="h6" >UserName:</Typography>
                                        </Grid>
                                        <Grid item xs>
                                            <Typography >{userNames}</Typography>
                                        </Grid>

                                    </Grid>


                                    <Grid container spacing={2}>
                                        <Grid item xs>
                                            <Typography variant="h6" >Serial Number:</Typography>
                                        </Grid>
                                        <Grid item xs>
                                            <Typography >{licenseDetails.serialNo}</Typography>
                                        </Grid>

                                    </Grid>

                                    <Grid container spacing={2} >
                                        <Grid item xs>
                                            <Typography variant="h6" >Issue Date:</Typography>
                                        </Grid>
                                        <Grid item xs>
                                            <Typography >{timeStampToDate(licenseDetails.issueDate)}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={2}>
                                        <Grid item xs>
                                            <Typography variant="h6" >Expiry Date:</Typography>
                                        </Grid>
                                        <Grid item xs>
                                            <Typography >{timeStampToDate(licenseDetails.expiryDate)}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={2} direction="column">
  <Grid container sx={{ mt: 2 }}>
    <Grid item xs>
      <Typography variant="h6">
        Annual Audit Start Date:
      </Typography>
    </Grid>
    <Grid item xs>
      <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ zIndex: 10015 }}>
        <DatePicker
          id="startDate"
          name="startDate"
          minDate={dayjs()}
          onChange={(newValue) => {
            setFormValues({
              ...formValues,
              startDate: newValue ? newValue.format("YYYY-MM-DD") : "",
            });
          }}
          value={formValues.startDate ? dayjs(formValues.startDate) : null}
          slotProps={{
            textField: {
              size: 'small',
              fullWidth: true,
              placeholder: "Annual Audit Start Date",
            },
            popper: {
              style: { zIndex: 110015 },
            },
          }}
        />
      </LocalizationProvider>
    </Grid>
  </Grid>
</Grid>


          <Grid
            container
            direction="row"
            sx={{ mt: 4 }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ maxWidth: '150px' }}
                onClick={handleApprove}
              >
               Audit Schedule
              </Button>
            </Grid>
            <Grid item>
              <Button
                type="button"
                color="reset"
                fullWidth
                variant="contained"
                sx={{ maxWidth: '120px',color:'white' }}
               // onClick={handleReject}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Box>
      </FormWrapper>
    </>
  );
};

export default AnnualAuditStartDate;
