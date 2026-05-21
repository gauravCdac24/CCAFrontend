import React, {useEffect, useImperativeHandle, useState } from 'react';
import { Grid, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link, TextareaAutosize, TextField, Divider, FormControlLabel, Checkbox, FormHelperText, Collapse, IconButton, Tabs, Tab, AppBar, Button } from '@mui/material';
import ESPApplicationService from '../../../../service/ESPApplicationService/ESPApplicationService';
import { decrypt } from '../../../global/util/EncryptDecrypt';
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


const ViewESPApplication = () => {

    const [filteredAPIVersion, setFilteredAPIVersion] = useState({});
    const [isLoading, setIsLoading] = useState(false);
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
      esignLicenseeAppId:decrypt(id),
      ekycMode:false,
      coverLetter:false,
      esignAPIVersion:false,
      auditReport:false,
      cpsDocument:false,
      remarks:'',
      isreject: false,
      ccaRemarks: '',
      purpose: false    
    })


    const routeRootPath = useSelector((state) => state.jwtAuthentication.rolePath);

    const navigate = useNavigate();
  

    const getMinAttemptList = () => {
      setIsLoading(true);
      MinimumAttempt.getAllActiveMinimumAttemptList()
      .then((response)=>{
        const rlist = response.data;
        setMinAttemptList(rlist[0]);
      })
      .catch((err)=>{

      })
      .finally(()=>{
        setIsLoading(false);
      })
    }

    const getReviewData = (id) => {

      setIsLoading(true);

      ESPApplicationService.underReviewData(id)
        .then((response)=>{

          setReviewData(response.data);

          const updatedValue = {
            esignLicenseeAppId:response.data.esignLicenseeAppId.esignLicenseeAppId,
            ekycMode:response.data.ekycMode,
            coverLetter:response.data.coverLetter,
            esignAPIVersion:response.data.esignAPIVersion,
            auditReport:response.data.auditReport,
            cpsDocument:response.data.cpsDocument,
            remarks:response.data.remarks,
            ccaRemarks: response.data.ccaRemarks,
            purpose: response.data.purpose
          }
          setFormValues(updatedValue);

          setIsReviewd(true);

        })
        .catch((err)=>{
          setIsReviewd(false);
        })
        .finally(()=>{
          setIsLoading(false);
        })

    }


    

    const validateForm = () => {

      const error = {};

      if(!formValues.ekycMode &&
          !formValues.coverLetter &&
          !formValues.esignAPIVersion &&
          !formValues.auditReport &&
          !formValues.cpsDocument &&
          !formValues.purpose
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

      if (!captchaInput) {
        error.captcha = errorMsg.captchaError.blank;
    }

      if(!formValues.remarks){
        error.remarks = errorMsg.remarks.blank;
      }else if (!/^[A-Za-z0-9,./ ]+$/.test(formValues.remarks)) {
        error.remarks = errorMsg.remarks.format;


    }

    return error;

    }


    const handleConfirmSubmit = () => {

      setIsLoading(true);

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

      setIsLoading(false);

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


    const handleConfirmRecommendForeSignGoLive = () => {

      setIsLoading(true);

      ESPApplicationService.recommandForeSignGoLive(formValues)
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

      setIsLoading(false);




    }



    const recommendForeSignGoLive = () => {


      const errors = validateForm2();

      if (Object.keys(errors).length === 0) {
          setFormError({});

          if (captchaInput === captchaText) {

              showAlert({
                  messageTitle: 'Confirm',
                  messageContent: 'Are you sure, you want to submit?',
                  confirmText: 'Yes',
                  closeText: 'No',
                  onConfirm: ()=>handleConfirmRecommendForeSignGoLive()
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



    const previewApplication = (id) => {

      setIsLoading(true);
  
      ESPApplicationService.viewESPApplication(id)
      .then(response=>{
        setApplicationObj(response.data);


          ESignAPIVersionMasterService.getAllAPIVersion()
            .then((data)=>{
              
              setFilteredAPIVersion(()=>{
                const filterObj = data.data.filter((e)=>e.esignApiVerId === parseInt(decrypt(response.data.esignAPIVersion.esignAPIVerId)))[0]
                return filterObj;
              })



                ESPApplicationService.previousReviewData(id)
                  .then((response) => {
                    
                    const updatedData = response.data.map((item) => {
                      const filteredAPI = data.data.filter(
                        (e) => e.esignApiVerId === parseInt(decrypt(item.previousData.esignAPIVersion.esignAPIVerId))
                      )[0];
              
                      return {
                        ...item,
                        previousData: {
                          ...item.previousData,
                          esignAPIVersion: {
                            ...item.previousData.esignAPIVersion,
                            filteredAPI: filteredAPI
                          },
                        },
                      };
                    });
          
                   
              
                    
                    const updatedValue = new Array(updatedData.length).fill(false);
                    

                    setPreviousReviewData(updatedData);
                    setCollapseItem(updatedValue);
                  })
                  .catch((err) => {
                    console.error('Error fetching previous review data:', err);
                    
                  })
                  
            })
            .catch((err)=>{

            })
            .finally(()=>{
                
            })


      })
      .catch((err)=>{
          ErrorMessage("Error", "Unable to preview application, Try Again.");
          return;
      })
      .finally(()=>{
          setIsLoading(false);
      })
    }

  const downloadDocument = async (id, type) =>{
    try {
      setIsLoading(true);
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
      setIsLoading(false);
  } catch (error) {
      setIsLoading(false);
      console.error('Error downloading file:', error);
      
  }
  }


const downloadFiles = async (id) => {
  try {
      setIsLoading(true);
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
      setIsLoading(false);
  } catch (error) {
      console.error('Error downloading file:', error);
      setIsLoading(false);
  }
}

useEffect(()=>{

  if(id){
    previewApplication(decrypt(id));
    getReviewData(decrypt(id));
    getMinAttemptList();
  }else{
    navigate(`${routeRootPath}/espreviewapp`, { replace: true })
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
  navigate(`${routeRootPath}/espreviewapp`, { replace: true })
}

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


      <Grid container sx={{mt : 2}}>
        <Grid item xs={6}>
          <Typography variant="h6" fontWeight="bold" >1. Purpose</Typography>
        </Grid>
        <Grid item xs={4}>
          {applicationObj.purpose}
        </Grid>
        <Grid item xs={2}>
              <FormControlLabel
                    control={
                      <Checkbox
                        name="purpose"
                        checked={formValues.purpose}  
                        onChange={() => setFormValues((prev) => ({
                          ...prev, 
                          purpose: !prev.purpose
                        }))}
                        disabled={isReviewd}
                      />
                    }
                    
                  />
            </Grid>
      </Grid>
        
        <Grid container>
            <Grid item xs={6} sx={{mt: 1}}>
              <Typography variant="h6" fontWeight="bold" >2. eKYC Mode(s)</Typography>
            </Grid>
            <Grid item xs={4}>

            </Grid>
            <Grid item xs={2}>
              <FormControlLabel
                    control={
                      <Checkbox
                        name="ekycMode"
                        checked={formValues.ekycMode}  
                        onChange={() => setFormValues((prev) => ({
                          ...prev, 
                          ekycMode: !prev.ekycMode
                        }))}
                        disabled={isReviewd}
                      />
                    }
                    
                  />
            </Grid>
          </Grid>
          
      
          <Grid container mt={2}>
            <Grid item xs={12}>
            <TableContainer>
                <Table sx={{ border:  0.5, borderColor: 'grey.500' }}>
                  <TableHead>
                      <TableRow sx={{backgroundColor:"tablecolor.main"}}>
                        <TableCell sx={{ border:  0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1, width: '60px', color: "tablecolor.text" }}>Sl. No.</TableCell>
                        <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1, width: '500px', color: "tablecolor.text" }}>eKYC Mode</TableCell>
                        <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1, color: "tablecolor.text" }}>eKYC Approval</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {applicationObj?.ekycModes && applicationObj?.ekycModes.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1, color: "tablecolor.text" }}>{index+1}</TableCell>
                          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1, color: "tablecolor.text" }}>{item.ekycModeTitle}</TableCell>
                          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1, color: "tablecolor.text" }}>{(item.fileName && item.isApprovalRequired == true)?<Link href="#" onClick={()=>downloadDocument(item.ekycModeId, "eKYCApproval")}>Download</Link> : "Not Required"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
              </TableContainer>
            </Grid>
          </Grid>

      <Grid container sx={{mt : 2}}>
        <Grid item xs={6}>
          <Typography variant="h6" fontWeight="bold" >3. Cover Letter</Typography>
        </Grid>
        <Grid item xs={4}>
          <Link href="#" onClick={()=>downloadDocument(decrypt(applicationObj.coverLetterId), "CoverLetter")}>Download</Link>
        </Grid>
        <Grid item xs={2}>
              <FormControlLabel
                    control={
                      <Checkbox
                        name="coverLetter"
                        checked={formValues.coverLetter}  
                        onChange={() => setFormValues((prev) => ({
                          ...prev, 
                          coverLetter: !prev.coverLetter
                        }))}
                        disabled={isReviewd}
                      />
                    }
                    
                  />
            </Grid>
      </Grid>

      <Grid container sx={{mt : 2}}>
        <Grid item xs={6}>
          <Typography variant="h6" fontWeight="bold" >4. eSign API Version</Typography>
        </Grid>
        <Grid item xs={4}>
          
        </Grid>
        <Grid item xs={2}>
              <FormControlLabel
                    control={
                      <Checkbox
                        name="esignAPIVersion"
                        checked={formValues.esignAPIVersion}  
                        onChange={() => setFormValues((prev) => ({
                          ...prev, 
                          esignAPIVersion: !prev.esignAPIVersion
                        }))}
                        disabled={isReviewd}
                      />
                    }
                    
                  />
            </Grid>
      </Grid>

      <Grid container mt={2}>
            <Grid item xs={12}>
            <TableContainer>
                <Table sx={{ border:  0.5, borderColor: 'grey.500' }}>
                  <TableHead>
                      <TableRow sx={{backgroundColor:"tablecolor.main", color: "tablecolor.text"}}>
                        <TableCell sx={{ border:  0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1, width: '60px', color: "inherit" }}>Sl. No.</TableCell>
                        <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1, width: '500px', color: "inherit" }}>API Specification</TableCell>
                        <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1, color: "inherit" }}>API Version</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                        <TableRow sx={{color: "tablecolor.text"}}>
                          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1, color: "inherit" }}>{"1"}</TableCell>
                          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1, color: "inherit" }}>{filteredAPIVersion?.esignApiSpecId?.apiSpecification}</TableCell>
                          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1, color: "inherit" }}>{filteredAPIVersion?.apiVersion}</TableCell>
                        </TableRow>
                    </TableBody>
                  </Table>
              </TableContainer>
            </Grid>
          </Grid>

          <Grid container sx={{mt : 2}}>
          <Grid item xs={6}>
            <Typography variant="h6" fontWeight="bold" >5. Audit Report</Typography>
          </Grid>
          <Grid item xs={4}>
            <Link href="#" onClick={()=>downloadFiles(decrypt(applicationObj.auditReportId))}>Download</Link>
          </Grid>
          <Grid item xs={2}>
              <FormControlLabel
                    control={
                      <Checkbox
                        name="esignAPIVersion"
                        checked={formValues.auditReport}  
                        onChange={() => setFormValues((prev) => ({
                          ...prev, 
                          auditReport: !prev.auditReport
                        }))}
                        disabled={isReviewd}
                      />
                    }
                    
                  />
            </Grid>
        </Grid>

        <Grid container sx={{mt : 2}}>
          <Grid item xs={6}>
            <Typography variant="h6" fontWeight="bold" >6. CPS Document</Typography>
          </Grid>
          <Grid item xs={4}>
            <Link href="#" onClick={()=>downloadFiles(decrypt(applicationObj.cpsDocumentId))}>Download</Link>
          </Grid>
          <Grid item xs={2}>
              <FormControlLabel
                    control={
                      <Checkbox
                        name="esignAPIVersion"
                        checked={formValues.cpsDocument}  
                        onChange={() => setFormValues((prev) => ({
                          ...prev, 
                          cpsDocument: !prev.cpsDocument
                        }))}
                        disabled={isReviewd}
                      />
                    }
                    
                  />
            </Grid>
        </Grid>

        {formError.issue && (
            <FormHelperText error>{formError.issue}</FormHelperText>
        )}

        <Divider sx={{mt: 2}}/>

        <Grid container sx={{mt : 2}}>
          <Grid item xs>
            <Typography variant="h6" fontWeight="bold" >Remarks {!isReviewd && (<>(Only alphabets, numbers and the characters ,./ are allowed, with a minimum of 3 and maximum of 500 characters.)</>)} </Typography>
          </Grid>
        </Grid>

        <Grid container sx={{mt : 2}}>
          <Grid item xs>
            <TextField
                multiline
                rows={3}
                sx={{ width: '100%', color: 'primary.text' }}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    remarks: e.target.value,
                  }))
                }
                onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9,./ ]+$/)}
                disabled={isReviewd}
                value = {formValues.remarks}
                inputProps={{ maxLength: 500 }}
                placeholder='Write your remarks...'
              />

          </Grid>
        </Grid>

        {formError.remarks && (
            <FormHelperText error>{formError.remarks}</FormHelperText>
        )}

        {!isReviewd && (<Box sx={{textAlign: 'right', mt:1}}>Characters: {formValues.remarks.length}</Box>)}

        {
          isReviewd && formValues.ccaRemarks && (
            <>
              <Grid container sx={{mt : 2}}>
                <Grid item xs>
                  <Typography variant="h6" fontWeight="bold" >Remarks by CCA</Typography>
                </Grid>
              </Grid>

              <Grid container sx={{mt : 2}}>
                <Grid item xs>
                  <TextField
                      multiline
                      rows={3}
                      sx={{ width: '100%', color: 'primary.text' }}
                      disabled
                      value = {formValues.ccaRemarks}
                    />

                </Grid>
              </Grid>
            
            </>
          )
        }

      {!isReviewd && (<Grid container sx={{mt: 2}}>
          <Grid item xs>
            <b>NOTE:</b> Select the items in which you find any issues, write your remarks, and then submit.
          </Grid>
        </Grid>)}

        {!isReviewd && (<><Grid container sx={{mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Grid item>
            <Captcha setCaptcha={setCaptchaText}
                            setCaptchaInput={setCaptchaInput}
                            captchaInput={captchaInput}
                            captchaError={!!formError.captcha}
                            captchaErrorMsg={formError.captcha} />
          </Grid>
        </Grid>

        

        </>)}

        {!isReviewd && (<Grid container direction="row" sx={{ mt: 4}} spacing={2} justifyContent="center" alignItems="center">

                                      <Grid item  >
                                            <Button type="button" fullWidth variant="contained" sx={{maxWidth: '200px' }} onClick={recommendForeSignGoLive}>
                                                Approve Application
                                            </Button>
                                        </Grid>

                                        <Grid item  >
                                            <Button type="submit" fullWidth variant="contained" sx={{maxWidth: '200px' }}>
                                                {(minAttemptList.esignApplicationReview <= previousReviewData.length) ? 'Recommand for Rejection' : 'Submit for Review'}
                                            </Button>
                                        </Grid>
                                       
                                    </Grid>)}

      </Box>
    </CustomTabPanel>

    <CustomTabPanel value={tabValue} index={1}>

      {/* Previous Reviewd Data */}

    {
     previousReviewData && Array.isArray(previousReviewData) && previousReviewData.length > 0 ? (<>
    {
      previousReviewData.map((element, index)=>(
      
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
                        Reviewd on {dateFormatter(element.reviewESPApp.created)}
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
        

        <Grid container sx={{mt : 2}}>
        <Grid item xs={6}>
          <Typography variant="h6" fontWeight="bold" >1. Purpose</Typography>
        </Grid>
        <Grid item xs={4}>
          {element?.previousData?.purpose}
        </Grid>
        <Grid item xs={2}>
              <FormControlLabel
                    control={
                      <Checkbox
                        name="purpose"
                        checked={element.reviewESPApp.purpose}  
                        disabled={true}
                      />
                    }
                    
                  />
            </Grid>
      </Grid>


        <Grid container>
            <Grid item xs={6} sx={{mt: 1}}>
              <Typography variant="h6" fontWeight="bold">1. eKYC Mode(s)</Typography>
            </Grid>
            <Grid item xs={4}>

            </Grid>
            <Grid item xs={2}>
              <FormControlLabel
                    control={
                      <Checkbox
                        name="ekycMode"
                        checked={element.reviewESPApp.ekycMode}  
                        disabled={true}
                      />
                    }
                    
                  />
            </Grid>
          </Grid>
          
      
          <Grid container mt={2}>
            <Grid item xs={12}>
            <TableContainer>
                <Table sx={{ border:  0.5, borderColor: 'grey.500' }}>
                  <TableHead>
                      <TableRow sx={{backgroundColor:"tablecolor.main", color: "tablecolor.text"}}>
                        <TableCell sx={{ border:  0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1, width: '60px', color: 'inherit' }}>Sl. No.</TableCell>
                        <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1, width: '500px', color: 'inherit' }}>eKYC Mode</TableCell>
                        <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1, color: 'inherit' }}>eKYC Approval</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {element?.previousData?.ekycModes && element?.previousData?.ekycModes.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1, color: 'inherit' }}>{index+1}</TableCell>
                          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1, color: 'inherit' }}>{item.ekycModeTitle}</TableCell>
                          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1, color: 'inherit' }}>{(item.fileName && item.isApprovalRequired == true)?<Link href="#" onClick={()=>downloadDocument(item.ekycModeId, "eKYCApproval")}>Download</Link> : "Not Required"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
              </TableContainer>
            </Grid>
          </Grid>

      <Grid container sx={{mt : 2}}>
        <Grid item xs={6}>
          <Typography variant="h6" fontWeight="bold" >2. Cover Letter</Typography>
        </Grid>
        <Grid item xs={4}>
          <Link href="#" onClick={()=>downloadDocument(decrypt(element.previousData.coverLetterId), "CoverLetter")}>Download</Link>
        </Grid>
        <Grid item xs={2}>
              <FormControlLabel
                    control={
                      <Checkbox
                        name="coverLetter"
                        checked={element.reviewESPApp.coverLetter}  
                        
                        disabled={true}
                      />
                    }
                    
                  />
            </Grid>
      </Grid>

      <Grid container sx={{mt : 2}}>
        <Grid item xs={6}>
          <Typography variant="h6" fontWeight="bold" >3. eSign API Version</Typography>
        </Grid>
        <Grid item xs={4}>
          
        </Grid>
        <Grid item xs={2}>
              <FormControlLabel
                    control={
                      <Checkbox
                        name="esignAPIVersion"
                        checked={element.reviewESPApp.esignAPIVersion}  
                        
                        disabled={true}
                      />
                    }
                    
                  />
            </Grid>
      </Grid>

      <Grid container mt={2}>
            <Grid item xs={12}>
            <TableContainer>
                <Table sx={{ border:  0.5, borderColor: 'grey.500' }}>
                  <TableHead>
                      <TableRow sx={{backgroundColor:"tablecolor.main", color: "tablecolor.text"}}>
                        <TableCell sx={{ border:  0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1, width: '60px', color: 'inherit' }}>Sl. No.</TableCell>
                        <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1, width: '500px', color: 'inherit' }}>API Specification</TableCell>
                        <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1, color: 'inherit' }}>API Version</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                        <TableRow>
                          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1, color: 'inherit' }}>{"1"}</TableCell>
                          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1, color: 'inherit' }}>{element?.previousData?.esignAPIVersion?.filteredAPI?.esignApiSpecId?.apiSpecification}</TableCell>
                          <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1, color: 'inherit' }}>{element?.previousData?.esignAPIVersion?.filteredAPI?.apiVersion}</TableCell>
                        </TableRow>
                    </TableBody>
                  </Table>
              </TableContainer>
            </Grid>
          </Grid>

          <Grid container sx={{mt : 2}}>
          <Grid item xs={6}>
            <Typography variant="h6" fontWeight="bold" >4. Audit Report</Typography>
          </Grid>
          <Grid item xs={4}>
            <Link href="#" onClick={()=>downloadFiles(decrypt(element.previousData.auditReportId))}>Download</Link>
          </Grid>
          <Grid item xs={2}>
              <FormControlLabel
                    control={
                      <Checkbox
                        name="esignAPIVersion"
                        checked={element.reviewESPApp.auditReport}  
                        disabled={true}
                      />
                    }
                    
                  />
            </Grid>
        </Grid>

        <Grid container sx={{mt : 2}}>
          <Grid item xs={6}>
            <Typography variant="h6" fontWeight="bold" >5. CPS Document</Typography>
          </Grid>
          <Grid item xs={4}>
            <Link href="#" onClick={()=>downloadFiles(decrypt(element.previousData.cpsDocumentId))}>Download</Link>
          </Grid>
          <Grid item xs={2}>
              <FormControlLabel
                    control={
                      <Checkbox
                        name="esignAPIVersion"
                        checked={element.reviewESPApp.cpsDocument}  
                        
                        disabled={true}
                      />
                    }
                    
                  />
            </Grid>
        </Grid>

        

        <Divider sx={{mt: 2}}/>

        <Grid container sx={{mt : 2}}>
          <Grid item xs>
            <Typography variant="h6" fontWeight="bold" >Remarks by O/o CCA</Typography>
          </Grid>
        </Grid>

        <Grid container sx={{mt : 2}}>
          <Grid item xs>
          <TextField
              multiline
              rows={3}
              sx={{
                width: '100%',
                "& .MuiInputBase-input .Mui-disabled": {
                  color: "#FFFFFF !important", 
                },
                
              }}
              disabled={true}
              value={element.reviewESPApp.remarks}
            />

          </Grid>
        </Grid>


        { element.reviewESPApp.ccaRemarks && (
          <>

          <Grid container sx={{mt : 2}}>
          <Grid item xs>
            <Typography variant="h6" fontWeight="bold" >Remarks by CCA</Typography>
          </Grid>
        </Grid>

        <Grid container sx={{mt : 2}}>
          <Grid item xs>
          <TextField
              multiline
              rows={3}
              sx={{
                width: '100%',
                "& .MuiInputBase-input .Mui-disabled": {
                  color: "#FFFFFF !important", 
                },
                
              }}
              disabled={true}
              value={element.reviewESPApp.ccaRemarks}
            />

          </Grid>
        </Grid>
        </>
        )
        }

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

export default ViewESPApplication;
