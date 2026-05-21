import React, {useEffect, useImperativeHandle, useState } from 'react';
import { Grid, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link, TextareaAutosize, TextField, Divider, FormControlLabel, Checkbox, FormHelperText, Collapse, IconButton, Tabs, Tab, AppBar, Button, Grid2 } from '@mui/material';
import ESPApplicationService from '../../../../service/ESPApplicationService/ESPApplicationService';
import { decrypt, encrypt } from '../../../global/util/EncryptDecrypt';
import LoaderProgress from '../../../global/common/LoaderProgress';
import ESignAPIVersionMasterService from '../../../../service/AdminService/ESignAPIVersionMasterService';
import { ErrorMessage } from '../../../global/common/MessageBox/ShowCustomMessage';
import showAlert from '../../../global/common/MessageBox/AlertService';
import Captcha from '../../../global/util/Captcha';
import ValidatePattern from '../../../global/util/ValidatePattern';
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {timeStampToDate} from '../../../global/util/TimestampConverter';
import MinimumAttempt from '../../../../service/AdminService/MinimumAttempt';
import CustomTabPanel from '../../../global/util/CustomTabPanel';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import dateFormatter from '../../../global/util/DateFormatter';
import CessationService from '../../../../service/CessationService/CessationService';

const errorMsg = {
    
  issue: {
      blank: "At least one item must be marked for review.",
  },

  remarks: {
      blank: "Kindly provide your remarks.",
      format: "Only alphabets, numbers and the characters ,./ are allowed",
      length: "Minimum 3 characters and Maximum 500 characters are allowed."
  },

  captchaError: {
      blank: "Please enter captcha."
  },
};

const MAX_FILE_SIZE_MB = 5; 

const ViewCessationApplication = () => {

    const [filteredAPIVersion, setFilteredAPIVersion] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [applicationObj, setApplicationObj] = useState({});
    const [formError, setFormError] = useState({});
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [reviewData, setReviewData] = useState({});
    const [previousReviewData, setPreviousReviewData] = useState([]);
    const  [isReviewd, setIsReviewd] = useState(false);
    const [collapseItem, setCollapseItem] = useState([]);
    const [minAttemptList, setMinAttemptList] = useState({});
    const [tabValue, setTabValue] = useState(0);
    
    const {id} = useParams();

    const [formValues, setFormValues] = useState({
      remarks:'', 
    })


    const routeRootPath = useSelector((state) => state.jwtAuthentication.rolePath);

    const navigate = useNavigate();
  

    const getMinAttemptList = () => {
      setLoading(true);
      MinimumAttempt.getAllActiveMinimumAttemptList()
      .then((response)=>{
        const rlist = response.data;
        setMinAttemptList(rlist[0]);
      })
      .catch((err)=>{

      })
      .finally(()=>{
        setLoading(false);
      })
    }
    const[getAllActiveDataForCCAOfficer,setAllActiveDataForCCAOfficer]=useState([]);

    const getReviewData = (id) => {

      setLoading(true);

      CessationService.getAllDataForCCAOfficer(id)
        .then((response)=>{

         // setReviewData(response.data);
       console.log("vfhfg-=-=-=-->",response.data)
          const cessationDocuments = response.data?.reviewDocuments;
          setAllActiveDataForCCAOfficer(cessationDocuments)

        })
        .catch((err)=>{
          //setIsReviewd(false);
        })
        .finally(()=>{
          setLoading(false);
        })

    }

    console.log("setAllActiveDataForCCAOfficer=-=-=-=->",getAllActiveDataForCCAOfficer)


    

    const validateForm = () => {

      const error = {};

      if(!formValues.ekycMode &&
          !formValues.coverLetter &&
          !formValues.esignAPIVersion &&
          !formValues.auditReport &&
          !formValues.cpsDocument
      ){
        error.issue = errorMsg.issue.blank;
      }

      if (!captchaInput) {
        error.captcha = errorMsg.captchaError.blank;
    }

      if(!formValues.remarks){
        error.remarks = errorMsg.remarks.blank;
      }else if (!/^[A-Za-z0-9,./ ]+$/.test(formValues.remarks)) {
        error.remarks = errorMsg.remarks.format;
      }else if(formValues.remarks.length<3 || formValues.remarks.length>500){
        error.remarks = errorMsg.remarks.length;
      }

    return error;

    }


    const validateForm2 = () => {

      const error = {};

      if(!formValues.remarks){
        error.remarks = errorMsg.remarks.blank;
      }else if (!/^[A-Za-z0-9,./ ]+$/.test(formValues.remarks)) {
        error.remarks = errorMsg.remarks.format;


    }

    return error;

    }


    const handleConfirmSubmit = () => {

      setLoading(true);

      ESPApplicationService.submitReviewESPApplication(formValues)
      .then((response)=>{

        // back

        showAlert({
          messageTitle: 'Alert',
          messageContent: 'Successfully submitted.',
          confirmText: 'Ok',
          enableHeaderCloseBtn:false,
          disableOutsideKeyDown:true,
          closeParent: true,
          onConfirm: ()=>handleBack()
      })

      })
      .catch((err)=>{

        showAlert({
          messageTitle: 'Error',
          messageContent: 'Unable to submit, try again.',
          confirmText: 'Ok',
      })

      })
      .finally(()=>{

      })

      setLoading(false);

    }

    // validate form

    const submitForReview = (e) => {
      e.preventDefault();
      const errors = validateForm();

      if (Object.keys(errors).length === 0) {
          setFormError({});

          if (captchaInput === captchaText) {

            if(minAttemptList.esignApplicationReview <= previousReviewData.length){
              formValues.isreject = true;
            }

              showAlert({
                  messageTitle: 'Confirm',
                  messageContent: 'Are you sure, you want to submit?',
                  confirmText: 'Yes',
                  closeText: 'No',
                  onConfirm: ()=>handleConfirmSubmit()
              })

              
          }else{
              showAlert({
                  messageTitle: 'Error',
                  messageContent: 'Invalid Captcha',
                  confirmText: 'Ok',
              })
          }
      } else {
          setFormError(errors);
      }
    }


  


    const cessationAppId = decrypt(id);
 
    const initialChecklist = {
      advertisement: {
        id: 1,
        checked: false,
        file: null,
        error: '',
        label: 'I confirm that I have advertised my intention to cease my license in newspapers.',
      },
      notification: {
        id: 2,
        checked: false,
        file: null,
        error: '',
        label: 'I confirm that I have notified my intention to cease acting as a Certifying Authority to subscribers and Cross Certifying Authorities.',
      },
      noticeSent: {
        id: 3,
        checked: false,
        file: null,
        error: '',
        label: 'I confirm that I have sent notices to the Controller, affected subscribers, and Cross Certifying Authorities digitally and via registered post.',
      },
      certificateRevocation: {
        id: 4,
        checked: false,
        file: null,
        error: '',
        label: 'I confirm that I have revoked all remaining Digital Signature Certificates.',
      },
      disruptionMinimization: {
        id: 5,
        checked: false,
        file: null,
        error: '',
        label: 'I confirm that I have made reasonable efforts to minimize disruption to subscribers and users.',
      },
      recordPreservation: {
        id: 6,
        checked: false,
        file: null,
        error: '',
        label: 'I confirm that I have made arrangements for preserving records for seven years.',
      },
      restitution: {
        id: 7,
        checked: false,
        file: null,
        error: '',
        label: 'I confirm that I have provided reasonable restitution to subscribers for revoked certificates.',
      },
      privateKeyDestruction: {
        id: 8,
        checked: false,
        file: null,
        error: '',
        label: 'I confirm that I will destroy the certificate-signing private key after license expiry and will confirm the date and time of destruction of the private key to the Controller.',
      },
    };
  
    const [checklist, setChecklist] = useState(initialChecklist);
  
    const handleCheckboxChange = (key) => (event) => {
      setChecklist((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          checked: event.target.checked ? prev[key].id : false,
        },
      }));
    };
  
    console.log("checklist=-=-=-=-=->",checklist)
    const handleFileUpload = (key) => (event) => {
      const file = event.target.files[0];
      if (file) {
        if (file.type !== 'application/pdf') {
          setChecklist((prev) => ({
            ...prev,
            [key]: { ...prev[key], file: null, error: 'File must be a PDF' },
          }));
          return;
        }
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          setChecklist((prev) => ({
            ...prev,
            [key]: { ...prev[key], file: null, error: 'File size must not exceed 5 MB' },
          }));
          return;
        }
        setChecklist((prev) => ({
          ...prev,
          [key]: { ...prev[key], file, error: '' },
        }));
      }
    };
  
    const validateChecklist = () => {
      let isValid = true;
      const updatedChecklist = { ...checklist };
  
      Object.keys(updatedChecklist).forEach((key) => {
        if (!updatedChecklist[key].checked) {
          updatedChecklist[key].error = 'This checkbox must be checked.';
          isValid = false;
        }
        if (!updatedChecklist[key].file) {
          updatedChecklist[key].error = updatedChecklist[key].error
            ? `${updatedChecklist[key].error} File is required.`
            : 'File is required.';
          isValid = false;
        }
      });
  
      setChecklist(updatedChecklist);
      return isValid;
    };
  
  

    const[getAllActiveForCCAOfficer,setAllActiveForCCAOfficer]=useState([]);
    
        const previewApplication = (cessationAppId) => {
    
          setLoading(true);
        CessationService.getAllActiveDataForCCAOfficer(cessationAppId)
            .then((response) => {
              setAllActiveForCCAOfficer(response.data);
    console.log("getAllActiveDataForCCAOfficer-=-=-=-=-=-=->",response.data);
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




    const handleSubmit = () => {
    
      const formData = new FormData();
      formData.append("cessationAppId", cessationAppId);
    formData.append("remarks",formValues.remarks)
      Object.keys(checklist).forEach((key) => {
        const item = checklist[key];
        if (item.checked) {
          // Append key, id, and file for each checked item
          formData.append(`key_${key}`, key); 
          formData.append(`id_${key}`, item.id); 
        }
      });
    
console.log("formData=-=-=-=-=-=-=-=->",formData)

      CessationService.rejectApplicationForCCA(formData)
        .then((response) => {
          showAlert({
            messageTitle: 'Success',
            messageContent: response.data,
            confirmText: 'Ok',
            closeParent: true,
            onConfirm: () => handleBack()
          });
        })
        .catch((err) => {
          showAlert({
            messageTitle: 'Error',
            messageContent: err.response?.data || 'Failed to rejected  this application. Please try again later.',
            confirmText: 'Ok',
          });
        })
        .finally(() => {
          setLoading(false);
        });
    };
    
    const handleApprove = (e) => {
     
      e.preventDefault(); 
    
      
        showAlert({
          messageTitle: 'Confirm',
          messageContent: 'Are you sure you want to rejected  this application?',
          confirmText: 'Yes',
          closeText: 'No',
          fullWidth: true,
          maxWidth: 'sm',
          onConfirm: handleSubmit, // On confirmation, trigger handleSubmit
        });
     
    };
    


    const handleApproveSubmit = () => {
    
      const formData = new FormData();
      formData.append("cessationAppId", cessationAppId);
    formData.append("remarks",formValues.remarks)
      Object.keys(checklist).forEach((key) => {
        const item = checklist[key];
        if (item.checked) {
          // Append key, id, and file for each checked item
          formData.append(`key_${key}`, key); 
          formData.append(`id_${key}`, item.id); 
        }
      });
    
console.log("formData=-=-=-=-=-=-=-=->",formData)

      CessationService.approveApplicationForCCA(formData)
        .then((response) => {
          showAlert({
            messageTitle: 'Success',
            messageContent: response.data,
            confirmText: 'Ok',
            closeParent: true,
            onConfirm: () => handleBack()
          });
        })
        .catch((err) => {
          showAlert({
            messageTitle: 'Error',
            messageContent: err.response?.data || 'Failed to rejected  this application. Please try again later.',
            confirmText: 'Ok',
          });
        })
        .finally(() => {
          setLoading(false);
        });
    };
    
    const handleReject = (e) => {
     
      e.preventDefault(); 
    
      
        showAlert({
          messageTitle: 'Confirm',
          messageContent: 'Are you sure you want to rejected  this application?',
          confirmText: 'Yes',
          closeText: 'No',
          fullWidth: true,
          maxWidth: 'sm',
          onConfirm: handleApproveSubmit, // On confirmation, trigger handleSubmit
        });
     
    };



  const downloadDocument = async (id, type) =>{
    try {
      setLoading(true);
      const response = await ESPApplicationService.downloadStepTwoDocument(id, type);
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      const contentDisposition = response.headers['content-disposition'];
      const fileName = contentDisposition 
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : type+".pdf";
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setLoading(false);
  } catch (error) {
    setLoading(false);
      console.error('Error downloading file:', error);
      
  }
  }


const downloadFiles = async (id) => {
  try {
    setLoading(true);
      const response = await ESPApplicationService.downloadStepThreeDocument(id);
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      const contentDisposition = response.headers['content-disposition'];
      const fileName = contentDisposition 
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : new Date()+".pdf";
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setLoading(false);
  } catch (error) {
      console.error('Error downloading file:', error);
      setLoading(false);
  }
}

useEffect(()=>{

  if(cessationAppId){
    previewApplication(cessationAppId);
    getReviewData(decrypt(id));
    getMinAttemptList();
  }else{
    navigate(`${routeRootPath}/cessationapplicationforcca`, { replace: true })
  }


}, [])

const handleTabChange = (e, newValue) => {
  
  setTabValue(newValue);

};


const allyProps = (index) =>{
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const handleBack = () => {
  navigate(`${routeRootPath}/cessationapplicationforcca`, { replace: true })
}

const [getAllCessationAppUndertakings, setAllCessationAppUndertakings] = useState([]);

const getAllCessationAppUndertaking = () => {
  setLoading(true);
 
  CessationService.getAllDataByCessationAppId( encrypt(cessationAppId))
      .then((res) => {
       
        setAllCessationAppUndertakings(res.data);
      })
      .catch((err) => {
          console.error(err);
          setAllCessationAppUndertakings(null);
      })
      .finally(() => {
        setLoading(false);
      });
};


useEffect(() => {
  if (cessationAppId) {
      console.log("Triggering fetch for cessation app undertakings.");
      getAllCessationAppUndertaking();
  } else {
      console.warn("Cessation App ID not ready yet.");
  }
}, [cessationAppId]);


console.log("getAllCessationAppUndertakings=-=-=-=->",JSON.stringify(getAllCessationAppUndertakings))

const handleDownloadClick = async(id) => {
  // Your logic to handle the download action related to the ID
  console.log(`Downloading document for ID: ${id}`);
  try {
    setLoading(true);
      const response = await CessationService.downloadStepThreeDocument(id);
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      const contentDisposition = response.headers['content-disposition'];
      const fileName = contentDisposition 
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : new Date()+".pdf";
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setLoading(false);
  } catch (error) {
      console.error('Error downloading file:', error);
      setLoading(false);
  }
};

  return (
    <Box p={3}>
      <LoaderProgress open={isLoading} />

      <Box component="div">
        <Grid container spacing={2} direction={'column'}>
            <Grid item sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right', mr: 2 }}>
                <Button variant="contained" onClick={handleBack}>
                    <Typography variant="h6">Back</Typography>
                </Button>
            </Grid>
        </Grid>
    </Box>
    
      <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label= "tabs"
          variant="fullWidth"
        >

            <Tab 
              label="Review Application"
              {...allyProps(0)}
            />

            <Tab 
              label="Previous Reviewed Details"
              {...allyProps(1)}
            />

        </Tabs>
    


        <CustomTabPanel value={tabValue} index={0}>
  <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={submitForReview}>
    <Grid container spacing={2}>
      {getAllActiveDataForCCAOfficer &&
      Array.isArray(getAllActiveDataForCCAOfficer) &&
      getAllActiveDataForCCAOfficer.filter((el) => el.status === "Active").length > 0 ? (
        getAllActiveDataForCCAOfficer
          .filter((el) => el.status === "Active")
          .map((element, index) => (
            <Grid container spacing={2} key={index}>
              {Object.keys(checklist).map((key) => {
                const item = checklist[key];
                const relatedUndertaking = getAllCessationAppUndertakings.filter(
                  (undertaking) => undertaking.undertakingId === String(item.id)
                );
                const cessationDocuments = getAllActiveForCCAOfficer?.cessationDocument || [];
                const relatedUndertakings = cessationDocuments.filter(
                  (doc) => String(doc.undertakingId) === String(item.id)
                );

                const isDisabled = relatedUndertakings.length === 0;

                return (
                  <Grid item xs={12} key={item.id}>
                    <Box>
                      <Grid container spacing={2} alignItems="center">
                        {/* Checklist Label */}
                        <Grid item xs={6}>
                          <Typography variant="h6" fontWeight="bold">
                            {`${item.id}. ${item.label}`}
                          </Typography>
                        </Grid>

                        {/* Download Link */}
                        <Grid item xs={4}>
                          {relatedUndertaking.length > 0 ? (
                            <Link
                              href="#"
                              underline="hover"
                              onClick={() =>
                                handleDownloadClick(
                                  relatedUndertaking[0].appUndertakingId
                                )
                              }
                            >
                              Download Document
                            </Link>
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              No Document Available
                            </Typography>
                          )}
                        </Grid>

                        {/* Checkbox */}
                        <Grid item xs={2}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={!isDisabled}
                                onChange={handleCheckboxChange(key)}
                                disabled
                              />
                            }
                            label=""
                          />
                        </Grid>
                      </Grid>

                      {/* Additional Info */}
                      {item.file && (
                        <Typography variant="body2" sx={{ mt: 1, ml: 2 }}>
                          {item.file.name}
                        </Typography>
                      )}
                      {item.error && (
                        <Typography
                          variant="body2"
                          sx={{ mt: 1, ml: 2, color: "red" }}
                        >
                          {item.error}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                );
              })}

              {/* Remarks Section */}
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                  Remarks by O/o CCA
                </Typography>
                <TextField
                  multiline
                  rows={3}
                  sx={{ width: "100%", color: "primary.text", mt: 1 }}
                  
                  disabled
                  value={element.remarks}
                  inputProps={{ maxLength: 500 }}
                  placeholder="Write your remarks..."
                />
                {formError.remarks && (
                  <FormHelperText error>{formError.remarks}</FormHelperText>
                )}
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                  Remarks by CCA
                </Typography>
                <TextField
                  multiline
                  rows={3}
                  sx={{ width: "100%", color: "primary.text", mt: 1 }}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      remarks: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9,./ ]+$/)}
                 
                  //value={element.remarks}
                  inputProps={{ maxLength: 500 }}
                  placeholder="Write your remarks..."
                />
                {formError.remarks && (
                  <FormHelperText error>{formError.remarks}</FormHelperText>
                )}
              </Grid>

            </Grid>
          ))
      ) : (
        <Box sx={{ textAlign: "center", mt: 4 }}>No Records Found</Box>
      )}

      {/* Buttons */}
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
            type="submit"
            variant="contained"
            sx={{ maxWidth: "120px", height: "40px" }}
            aria-label="Submit"
            onClick={handleReject}
          >
            Approval
          </Button>
        </Grid>
        <Grid item>
          <Button
            type="button"
            variant="contained"
            sx={{
              maxWidth: "120px",
              height: "40px",
              color: "#FFFFFF",
              backgroundColor: "black",
            }}
            aria-label="Reset"
            onClick={handleApprove}
          >
           Reject
          </Button>
        </Grid>
      </Grid>
    </Grid>
  </Box>
</CustomTabPanel>


    <CustomTabPanel value={tabValue} index={1}>

      {/* Previous Reviewd Data */}

    {
     getAllActiveDataForCCAOfficer && Array.isArray(getAllActiveDataForCCAOfficer) && getAllActiveDataForCCAOfficer.length > 0 ? (<>
    {
      getAllActiveDataForCCAOfficer.map((element, index)=>(
      
        <Box sx={{ mb: 1, pb: 2, color: 'primary.text' }} key={index}>

        <Box sx={{ display: "flex", 
                   alignItems: "center", 
                   backgroundColor: "primary.main", p:1, 
                   borderRadius: '5px',
                   boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;', cursor: 'pointer'}}
                   
                   onClick={() =>
                    setCollapseItem((prev) => {
                      const newCollapseItem = [...prev]; 
                      newCollapseItem[index] = !newCollapseItem[index]; 
                      return newCollapseItem; 
                    })
                  }

                   >
                      <Typography variant="h6" sx={{flexGrow: 1 }}>
                        Reviewd on {dateFormatter(element.created)}
                      </Typography>
                      <IconButton 
                        
                      sx={{ backgroundColor: "transparent",
                        '&:hover': {
                            backgroundColor: "transparent"
                          },
                          fontSize: '20px',
                          color: 'primary.text'
                      }}>
                        {collapseItem[index] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>

                    
        </Box>

        <Collapse in={collapseItem[index]} sx={{pl: 1, pr: 1, backgroundColor: 'primary.light', color: 'bodycolor.text'}}>
        
        <Grid container spacing={2}>
  {Object.keys(checklist).map((key) => {
    const item = checklist[key];

    // Filter related undertakings and cessation documents
    const relatedUndertaking = getAllCessationAppUndertakings.filter(
      (undertaking) => undertaking.undertakingId === String(item.id)
    );

    const cessationDocuments = getAllActiveForCCAOfficer?.cessationDocument || [];
    const relatedUndertakings = cessationDocuments.filter(
      (undertaking) => String(undertaking.undertakingId).trim() === String(item.id).trim()
    );

    console.log("relatedUndertaking-=-=-=-=-=->", relatedUndertaking);
    console.log("String(item.id)-=-=-=-=-=->", item.id);

    // Determine if the checkbox is disabled or checked
    const isDisabled = relatedUndertakings.length === 0;

    return (
      <Grid item xs={12} key={item.id}>
        <Box>
          {/* Checklist Item */}
          <Grid container spacing={2} alignItems="center">
            {/* Label */}
            <Grid item xs={6}>
              <Typography
                variant="h6"
                fontWeight="bold"
              >
                {`${item.id}. ${item.label}`}
              </Typography>
            </Grid>

            {/* Download Link */}
            <Grid item xs={4}>
              {relatedUndertaking.length > 0 ? (
                <Link
                  href="#"
                  underline="hover"
                  onClick={() => handleDownloadClick(relatedUndertaking[0].appUndertakingId)}
                >
                  Download Document
                </Link>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No Document Available
                </Typography>
              )}
            </Grid>

            {/* Checkbox */}
            <Grid item xs={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!isDisabled} 
                    onChange={handleCheckboxChange(key)}
                    disabled={!isDisabled} 
                  />
                }
                label=""
              />
            </Grid>
          </Grid>

          {/* Additional Info (File and Error Messages) */}
          {item.file && (
            <Typography variant="body2" sx={{ mt: 1, ml: 2 }}>
              {item.file.name}
            </Typography>
          )}
          {item.error && (
            <Typography variant="body2" sx={{ mt: 1, ml: 2, color: "red" }}>
              {item.error}
            </Typography>
          )}
        </Box>
      </Grid>
    );
  })}

  {/* Remarks Section */}
  <Grid container sx={{ mt: 2 }}>
    <Grid item xs>
      <Typography variant="h6" fontWeight="bold">
        Remarks by O/o CCA
      </Typography>
    </Grid>
  </Grid>

  <Grid container sx={{ mt: 2 }}>
    <Grid item xs>
      <TextField
        multiline
        rows={3}
        sx={{ width: "100%", color: "primary.text" }}
        onChange={(e) =>
          setFormValues((prev) => ({
            ...prev,
            remarks: e.target.value,
          }))
        }
        onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9,./ ]+$/)}
        disabled
        value={element.remarks}
        inputProps={{ maxLength: 500 }}
        placeholder="Write your remarks..."
      />
    </Grid>
  </Grid>

  {formError.remarks && <FormHelperText error>{formError.remarks}</FormHelperText>}
</Grid>


        </Collapse>
      </Box>
    ))
  }</>):(<Box sx={{textAlign: 'center', mt: 4}}>
    No Records Found
  </Box>)

}
      {/*--------------- END -----------*/}
</CustomTabPanel>
    </Box>
  );
};

export default ViewCessationApplication;
