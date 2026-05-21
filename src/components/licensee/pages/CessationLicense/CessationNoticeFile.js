import React, { forwardRef, useImperativeHandle, useState} from 'react';
import { Box, Grid, Button, Typography, InputLabel, FormHelperText, Tooltip, TextField } from '@mui/material';
import Captcha from '../../../global/util/Captcha';
import LoaderProgress from '../../../global/common/LoaderProgress';
import showAlert from '../../../global/common/MessageBox/AlertService';
import FormWrapper from '../../../global/util/FormWrapper';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; 
import { styled } from '@mui/material/styles';
import LicenseIssuanceService from '../../../../service/LicenseIssuanceService/LicenseIssuanceService'
import ValidatePattern from '../../../global/util/ValidatePattern';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CessationService from '../../../../service/CessationService/CessationService';

const VisuallyHiddenInput = styled('input')({
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    border: '0',
  });

//Errors
const errorMsg = {
    
    file: {
        blank: "Please upload license certificate.",
        size: "The file size must not exceed 5MB. Please upload a smaller file.",
        format: "Only Pdf file is allowed."
    },


    captchaError: {
        blank: "Please enter captcha."
    },
};

const CessationNoticeFile = forwardRef(({applicantUsername, refreshList}, ref) => {
    const [requiredDoc, setRequiredDoc] = useState({
        userName: applicantUsername,
        cessationNotice: null,
        licenseId:refreshList.licenseId,
        
    });
 
    const [fileName, setFileName] = useState('')
    const [fileKey, setFileKey] = useState(Date.now());
    const [formErrors, setFormErrors] = useState({});
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    

    const handleFileChange = (e) => {
        const file = e.target.files[0];
    
        setRequiredDoc({
            ...requiredDoc,
            cessationNotice:file
        });

        setFileName(file ? file.name : '');

    };
    console.log("Uoload Notice File====>",requiredDoc.cessationNotice)

    const validateFile = (errors) => {

        if (requiredDoc.cessationNotice) {

            const allowedExtensions = /(\.pdf|\.PDF)$/i;
            if (!allowedExtensions.exec(requiredDoc.cessationNotice.name)) {
                errors.file = errorMsg.file.format;
            }

            const maxSize = 5*1024*1024;

            if (requiredDoc.cessationNotice.size > maxSize) {
                errors.file = errorMsg.file.size;
            }
        } else {
            errors.file = errorMsg.file.blank;
        }

    };
   
    const handleReset = () => {
        setRequiredDoc({
            cessationNotice: '',
        });

        setFileName('');

        setCaptchaInput('');
        setFormErrors({});
    }


    const validateForm = () => {
        const errors = {};
    
        validateFile(errors);
        if (!captchaInput) {
            errors.captcha = errorMsg.captchaError.blank;
        }
    
        return errors;
    };


    const handleConfrimSubmit = () => {

        setLoading(true);
        const formData=new FormData();

        formData.append("cessationNotice",requiredDoc.cessationNotice)
        formData.append("userName",requiredDoc.userName)
        formData.append("licenseId",requiredDoc.licenseId)
        CessationService.addCessationNoticeFile(formData)
            .then((response) => {
                showAlert({
                    messageTitle: 'Uoload Notice File',
                    messageContent: response.data,
                    confirmText: 'Ok',
                    enableHeaderCloseBtn:false,
                    disableOutsideKeyDown:true,
                    closeParent: true,
                })

              
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: err.response.data ? typeof err.response.data === 'object' ? 'Your request cannot be processed at this time. Please try again later.' : err.response.data : 'Your request cannot be processed at this time. Please try again later.',
                    confirmText: 'Ok',
                })
            })
            .finally(() => {
                setLoading(false);
            });

    }


    const handleFormSubmit = () => {
       
        const errors = validateForm();

        if (Object.keys(errors).length === 0) {
            setFormErrors({});

            if (captchaInput === captchaText) {
                showAlert({
                    messageTitle: 'Confirm',
                    messageContent: 'Are you sure, you want to submit? You cannot reupload the documents again. Please verify before uploading the documents.',
                    confirmText: 'Yes',
                    closeText: 'No',
                    fullWidth: true,
                    maxWidth: 'sm',
                    onConfirm: ()=>handleConfrimSubmit()
                })

                
            }else{
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Invalid Captcha',
                    confirmText: 'Ok',
                })
            }
        } else {
            setFormErrors(errors);
        }
    };



    useImperativeHandle(ref, ()=>{
        return{
            handleReset,
            handleFormSubmit
        }
    })

    return (
        <>
            <LoaderProgress open={isLoading} />
           
            <FormWrapper headingText="Upload Notice File">
                <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={handleFormSubmit}>
                    <Grid container spacing={2} direction="column">


                        <Grid item  xs={12} sm>
                            <InputLabel shrink={false} htmlFor={"file"} sx={{mb:1}}>
                                <Typography variant='body1'>Upload Undertaking File*</Typography>
                            </InputLabel>

                                    <Grid container direction="row" sx={{border: '1px solid #cfcfcf', borderRadius: '5px'}}>
                                        <Grid item >
                                            <Button
                                            component="label"
                                            variant="contained"
                                            startIcon={<CloudUploadIcon />}
                                        >
                                            Upload file
                                            <VisuallyHiddenInput
                                                key={fileKey}
                                                type="file"
                                                name="cessationNotice"
                                                onChange={handleFileChange}
                                            />
                                        </Button>
                                        
                                        </Grid>
                                        <Grid item xs sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        {fileName && (
                                            <Tooltip title={fileName} placement="top">
                                                <Typography variant='body2' sx={{
                                                    display: 'inline-block',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    verticalAlign: 'middle',
                                                    textAlign: 'center'
                                                }}>
                                                    {fileName}
                                                </Typography>
                                            </Tooltip>
                                        )}    
                                        </Grid>
                                    </Grid>
                                    
                                    {formErrors.file && (
                                        <FormHelperText error>{formErrors.file}</FormHelperText>
                                    )}
                                </Grid>
     

                    </Grid> 

                    <Captcha setCaptcha={setCaptchaText}
                        setCaptchaInput={setCaptchaInput}
                        captchaInput={captchaInput}
                        captchaError={!!formErrors.captcha}
                        captchaErrorMsg={formErrors.captcha} />

                    
                </Box>
            </FormWrapper>
        </>
    );
});

export default CessationNoticeFile;
