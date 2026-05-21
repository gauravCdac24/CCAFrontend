import React, { useEffect, useState } from 'react';
import { Box, Grid, Button, Checkbox, Typography, FormControlLabel } from '@mui/material';
import CessationService from '../../../../service/CessationService/CessationService';
import { useNavigate, useParams } from 'react-router-dom';
import { decrypt } from '../../../global/util/EncryptDecrypt';
import FormWrapper from '../../../global/util/FormWrapper';
import { useSelector } from 'react-redux';
import LoaderProgress from '../../../global/common/LoaderProgress';
import showAlert from '../../../global/common/MessageBox/AlertService';

const MAX_FILE_SIZE_MB = 5; // Maximum file size in MB

const LicenseCessationChecklist = () => {
  const { id } = useParams();
  const cessationAppId = decrypt(id);
  const [isLoading, setLoading] = useState(false);
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

  const[getAllActiveDataForCCAOfficer,setAllActiveDataForCCAOfficer]=useState([]);

  const previewApplication = (cessationAppId) => {

    setLoading(true);
  CessationService.getAllActiveDataForCCAOfficer(cessationAppId)
      .then((response) => {
        setAllActiveDataForCCAOfficer(response.data)
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
    }
  }, [])


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

  const handleReset = () => {
    setChecklist(initialChecklist); 
  };


  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("cessationAppId", cessationAppId);
  
    Object.keys(checklist).forEach((key) => {
      const item = checklist[key];
      if (item.checked) {
        // Append key, id, and file for each checked item
        formData.append(`key_${key}`, key); // Append the key
        formData.append(`id_${key}`, item.id); // Append the id
        formData.append(`file_${key}`, item.file); // Append the file
      }
    });
  
    CessationService.saveAllData(formData)
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
          messageContent: err.response?.data || 'Failed to upload the file. Please try again later.',
          confirmText: 'Ok',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  const handleApprove = (e) => {
   
    e.preventDefault(); 
  
    if (validateChecklist()) {
      showAlert({
        messageTitle: 'Confirm',
        messageContent: 'Are you sure you want to cessation this application?',
        confirmText: 'Yes',
        closeText: 'No',
        fullWidth: true,
        maxWidth: 'sm',
        onConfirm: handleSubmit, // On confirmation, trigger handleSubmit
      });
    }
  };
  

  
  const routeRootPath = useSelector((state) => state.jwtAuthentication.rolePath);
    const navigate = useNavigate();

  const handleBack = () => {
    navigate(`${routeRootPath}/viewlicense`, { replace: true })
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

    <FormWrapper headingText=" License Cessation Checklist">
                <Box component="form" noValidate sx={{ mt: 2, p: 2 }}>
      <Grid container spacing={2}>
        {Object.keys(checklist).map((key) => {
          const item = checklist[key];
          return (
            <Grid item xs={12} key={item.id}>
              <Box display="flex" alignItems="center">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!item.checked}
                      onChange={handleCheckboxChange(key)}
                    />
                  }
                  label={item.label}
                />
                <Button variant="outlined" component="label" sx={{ ml: 2 }}>
                  Attach File
                  <input
                    type="file"
                    hidden
                    onChange={handleFileUpload(key)}
                  />
                </Button>
                {item.file && (
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    {item.file.name}
                  </Typography>
                )}
                {item.error && (
                  <Typography variant="body2" sx={{ ml: 2, color: 'red' }}>
                    {item.error}
                  </Typography>
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>
      <Grid container direction="row" sx={{ mt: 4 }} spacing={2} justifyContent="center" alignItems="center">
    <Grid item>
        <Button 
            type="submit" 
            variant="contained" 
            sx={{ maxWidth: '120px', height: '40px' }} 
            onClick={handleApprove}
            aria-label=" Submit"
        >
          Submit
        </Button>
    </Grid>
    <Grid item>
        <Button 
            type="button" 
            variant="contained" 
            sx={{ maxWidth: '120px', height: '40px', color: '#FFFFFF',backgroundColor:'black' }} 
            aria-label="Reset"
            onClick={handleReset}
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

export default LicenseCessationChecklist;
