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


const ViewCessationApplication = ({id}) => {

  
    const [isLoading, setLoading] = useState(false);
  
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


    const cessationAppId = decrypt(id);

    console.log("cessationAppId=-=-=-=->",cessationAppId)
 
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

useEffect(()=>{

  if(cessationAppId){
    previewApplication(cessationAppId);
    getReviewData(decrypt(id));
  
  }else{
  }


}, [])


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

      <Box component="form" noValidate sx={{ mt: 2, p: 2 }}>
      <Grid container spacing={2}>
      {Object.keys(checklist).map((key) => {
  const item = checklist[key];
  const relatedUndertaking = getAllCessationAppUndertakings.filter(
    (undertaking) => undertaking.undertakingId === String(item.id)
  );
  console.log("-=0=0=-=-=-=->",item.id)

  console.log("-=0=0=-=-=-=->",relatedUndertaking)
  return (
    <Grid item xs={12} key={item.id}>
      <Box>
        {/* Checklist Item */}
        <Grid container spacing={2} alignItems="center">
          {/* Label */}
          <Grid item xs={6}>
            <Typography variant="h6" fontWeight="bold">
              {`${item.id}. ${item.label}`} {/* Display number and bold label */}
            </Typography>
          </Grid>

          {/* Download Link */}
          <Grid item xs={4}>
            {relatedUndertaking ? (
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

        </Grid>

      </Box>
    </Grid>
  );
})}


</Grid>

    </Box>
    </Box>
  );
};

export default ViewCessationApplication;
