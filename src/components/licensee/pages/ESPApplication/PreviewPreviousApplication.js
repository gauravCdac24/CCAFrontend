import React, { useEffect, useState } from 'react';
import { Grid, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link } from '@mui/material';
import ESPApplicationService from '../../../../service/ESPApplicationService/ESPApplicationService';
import { decrypt } from '../../../global/util/EncryptDecrypt';
import LoaderProgress from '../../../global/common/LoaderProgress';
import ESignAPIVersionMasterService from '../../../../service/AdminService/ESignAPIVersionMasterService';
import { ErrorMessage } from '../../../global/common/MessageBox/ShowCustomMessage';

const PreviewPreviousApplication = ({espappid}) => {

    const [filteredAPIVersion, setFilteredAPIVersion] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [applicationObj, setApplicationObj] = useState({});

    const previewApplication = () => {

      setIsLoading(true);
  
      ESPApplicationService.getPreviewById(espappid)
      .then(response=>{
        setApplicationObj(response.data);


          ESignAPIVersionMasterService.getAllAPIVersion()
            .then((data)=>{
              
              setFilteredAPIVersion(()=>{
                const filterObj = data.data.filter((e)=>e.esignApiVerId === parseInt(decrypt(response.data.esignAPIVersion.esignAPIVerId)))[0]
                return filterObj;
              })
            })
            .catch((err)=>{

            })
            .finally(()=>{
                
            })


      })
      .catch((err)=>{
          //ErrorMessage("Error", "Unable to preview application, Try Again.");
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
  previewApplication();
}, [])

  return (
    <Box p={3}>
      <LoaderProgress open={isLoading} />


 <Grid container sx={{mt : 2, mb: 2}}>
    <Grid item xs={6}>
      <Typography variant="h6" fontWeight="bold" color="primary.tabletext">1. Purpose</Typography>
    </Grid>
    <Grid item xs={6}>
      {applicationObj?.purpose}
    </Grid>
  </Grid>


      <Typography variant="h6" fontWeight="bold" color="primary.tabletext">2. eKYC Mode(s)</Typography>
  
      <Grid container mt={2}>
        <Grid item xs={12}>
        <TableContainer>
            <Table sx={{ border:  0.5, borderColor: 'grey.500' }}>
              <TableHead>
                  <TableRow sx={{backgroundColor:"tablecolor.main", color: "tablecolor.text"}}>
                    <TableCell sx={{ border:  0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1, width: '60px' }}>Sl. No.</TableCell>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1, width: '350px' }}>eKYC Mode</TableCell>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1 }}>eKYC Approval</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {applicationObj?.ekycModes && applicationObj?.ekycModes.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1 }}>{index+1}</TableCell>
                      <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1 }}>{item.ekycModeTitle}</TableCell>
                      <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1 }}>{(item.fileName && item.isApprovalRequired == true)?<Link href="#" onClick={()=>downloadDocument(item.ekycModeId, "eKYCApproval")}>Download</Link>  
                                                                                                                                                : ((item.fileName == null || item.fileName == '') && item.isApprovalRequired===true) ? "Not Uploaded": "Not required"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </TableContainer>
        </Grid>
      </Grid>
{
  filteredAPIVersion && (
  <Grid container sx={{mt : 2}}>
    <Grid item xs={6}>
      <Typography variant="h6" fontWeight="bold" color="primary.tabletext">3. Cover Letter</Typography>
    </Grid>
    <Grid item xs={6}>
      <Link href="#" onClick={()=>downloadDocument(decrypt(applicationObj.coverLetterId), "CoverLetter")}>Download</Link>
    </Grid>
  </Grid>
  )
}

  {filteredAPIVersion && (
  <>
  <Grid container sx={{mt : 2}}>
    <Grid item xs={6}>
      <Typography variant="h6" fontWeight="bold" color="primary.tabletext">4. eSign API Version</Typography>
    </Grid>
  </Grid>
  
  <Grid container mt={2}>
        <Grid item xs={12}>
        <TableContainer>
            <Table sx={{ border:  0.5, borderColor: 'grey.500' }}>
              <TableHead>
                  <TableRow sx={{backgroundColor:"tablecolor.main", color: "tablecolor.text"}}>
                    <TableCell sx={{ border:  0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1, width: '60px' }}>Sl. No.</TableCell>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1, width: '350px' }}>API Specification</TableCell>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold', padding: 1 }}>API Version</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                    <TableRow>
                      <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1 }}>{"1"}</TableCell>
                      <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1 }}>{filteredAPIVersion?.esignApiSpecId?.apiSpecification}</TableCell>
                      <TableCell sx={{ border: 0.5, borderColor: 'grey.500', padding: 1 }}>{filteredAPIVersion?.apiVersion}</TableCell>
                    </TableRow>
                </TableBody>
              </Table>
          </TableContainer>
        </Grid>
      </Grid>
      </>
  )
}
{applicationObj.auditReportId && (

      <Grid container sx={{mt : 2}}>
      <Grid item xs={6}>
        <Typography variant="h6" fontWeight="bold" color="primary.tabletext">5. Audit Report</Typography>
      </Grid>
      <Grid item xs={6}>
        <Link href="#" onClick={()=>downloadFiles(decrypt(applicationObj.auditReportId))}>Download</Link>
      </Grid>
    </Grid>
)
}

{ applicationObj.cpsDocumentId && (

    <Grid container sx={{mt : 2}}>
      <Grid item xs={6}>
        <Typography variant="h6" fontWeight="bold" color="primary.tabletext">6. CPS Document</Typography>
      </Grid>
      <Grid item xs={6}>
        <Link href="#" onClick={()=>downloadFiles(decrypt(applicationObj.cpsDocumentId))}>Download</Link>
      </Grid>
    </Grid>
)
}

    </Box>
  );
};

export default PreviewPreviousApplication;
