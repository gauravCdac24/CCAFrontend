import React, {useEffect, useState } from 'react';
import { Grid, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link, TextareaAutosize, TextField, Divider, FormControlLabel, Checkbox, FormHelperText, Collapse, IconButton, Tabs, Tab, AppBar, Button } from '@mui/material';
import ESPApplicationService from '../../../../../service/ESPApplicationService/ESPApplicationService';
import { decrypt } from '../../../../global/util/EncryptDecrypt';
import LoaderProgress from '../../../../global/common/LoaderProgress';
import ESignAPIVersionMasterService from '../../../../../service/AdminService/ESignAPIVersionMasterService';
import { ErrorMessage } from '../../../../global/common/MessageBox/ShowCustomMessage';
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {timeStampToDate} from '../../../../global/util/TimestampConverter';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import dateFormatter from '../../../../global/util/DateFormatter';

const errorMsg = {

  captchaError: {
      blank: "Please enter captcha."
  },
};


const ViewPreviousReviewedApplication = () => {

    const [filteredAPIVersion, setFilteredAPIVersion] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [applicationObj, setApplicationObj] = useState({});
    const [previousReviewData, setPreviousReviewData] = useState([]);
    const [collapseItem, setCollapseItem] = useState([]);
    const {id} = useParams();
    const routeRootPath = useSelector((state) => state.jwtAuthentication.rolePath);
    const navigate = useNavigate();
  
    // validate form

   
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
  }else{
    navigate(`${routeRootPath}/espappcapproved`, { replace: true })
  }


}, [])


const handleBack = () => {
  navigate(`${routeRootPath}/espappcapproved`, { replace: true })
}

  return (
   <>
      <LoaderProgress open={isLoading} />

      <Box component="div" sx={{mb: 2}}>
        <Grid container spacing={2} direction={'column'}>
            <Grid item sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right', mr: 2 }}>
                <Button variant="contained" onClick={handleBack}>
                    <Typography variant="h6">Back</Typography>
                </Button>
            </Grid>
        </Grid>
    </Box>

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
                        <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1, color: 'inherit' }}>eKYC Mode</TableCell>
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
                        <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1, color: 'inherit' }}>API Specification</TableCell>
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
            <Typography variant="h6" fontWeight="bold" >Remarks By O/o CCA</Typography>
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
  }
   
</>
  );
};

export default ViewPreviousReviewedApplication;
