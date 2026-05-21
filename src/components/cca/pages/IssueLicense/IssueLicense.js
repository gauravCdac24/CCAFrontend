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

    issueDate: {
        blank: "Please select issue date.",
        diff: "Issue date must be less than expiry date."
    },

    expiryDate: {
        blank: "Please select expiry date.",
        diff: "License must be issued for 5 years."
    },

    serialNo: {
        blank: "Please enter serial number.",
        length: "The length must be 24 characters.",
        format: "Please enter valid serial number."
    },


    captchaError: {
        blank: "Please enter captcha."
    },
};

const IssueLicense = forwardRef(({intentAppId, applicantName, applicantUsername, refreshList}, ref) => {
    const [requiredDoc, setRequiredDoc] = useState({
        intentAppId:intentAppId,
        applicantUsername: applicantUsername,
        applicantName: applicantName,
        file: '',
        issueDate: '',
        expiryDate: '',
        serialNo: ''

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
            [e.target.name]:file
        });

        setFileName(file ? file.name : '');

    };

    const validateFile = (errors) => {

        if (requiredDoc.file) {

            const allowedExtensions = /(\.pdf|\.PDF)$/i;
            if (!allowedExtensions.exec(requiredDoc.file.name)) {
                errors.file = errorMsg.file.format;
            }

            const maxSize = 5*1024*1024;

            if (requiredDoc.file.size > maxSize) {
                errors.file = errorMsg.file.size;
            }
        } else {
            errors.file = errorMsg.file.blank;
        }

    };
   
    const handleReset = () => {
        setRequiredDoc({
            intentAppId,
            applicantUsername,
            applicantName,
            file: '',
            issueDate: '',
            expiryDate: '',
            serialNo: ''
        });

        setFileName('');

        setCaptchaInput('');
        setFormErrors({});
    }


    const validateForm = () => {
        const errors = {};
    
        validateFile(errors);


        if (!requiredDoc.serialNo) {
            errors.serialNo = errorMsg.serialNo.blank;
        } else if (requiredDoc.serialNo.length != 24) {
            errors.serialNo = errorMsg.serialNo.length;
        } else if (!/^[A-Za-z0-9]+$/.test(requiredDoc.serialNo)) {
            errors.serialNo = errorMsg.serialNo.format;
        }

        if (!requiredDoc.issueDate) {
            errors.issueDate = errorMsg.issueDate.blank;
        } 

        if (!requiredDoc.expiryDate) {
            errors.expiryDate = errorMsg.expiryDate.blank;
        } 

        const diff = dayjs(requiredDoc.expiryDate).isSame(dayjs(requiredDoc.issueDate).add(5, 'year').subtract(1, 'day'))

        if(diff === false){
            errors.expiryDate = errorMsg.expiryDate.diff;
        }
    
        if (!captchaInput) {
            errors.captcha = errorMsg.captchaError.blank;
        }
    
        return errors;
    };


    const handleConfrimSubmit = () => {

        setLoading(true);

        LicenseIssuanceService.issueLicenseToApplicant(requiredDoc)
            .then((response) => {
                showAlert({
                    messageTitle: 'Issue License',
                    messageContent: response.data,
                    confirmText: 'Ok',
                    enableHeaderCloseBtn:false,
                    disableOutsideKeyDown:true,
                    closeParent: true,
                })

                refreshList();
            })
            .catch((err) => {
                const data = err.response?.data;
                const errorMessage =
                    (typeof data === 'string' && data) ||
                    data?.message ||
                    err.message ||
                    'Your request cannot be processed at this time. Please try again later.';
                showAlert({
                    messageTitle: 'Error',
                    messageContent: errorMessage,
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


    // Handle Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setRequiredDoc({
                ...requiredDoc,
                [name]: value,
            });
        
        
    }; 

    //Handle Date Change
    const handleDateChange = (name, date) => {

        const isValidDate = (date) => {
            return dayjs(date).isValid();
        };

        if (!isValidDate(date)) {
            return;
        }

        const formatDate = (date) => {
            return dayjs(date).format('YYYY-MM-DD');
        };

        const formattedDate = formatDate(date);

        

        setRequiredDoc((prevValues) => ({
            ...prevValues,
            [name]: formattedDate,
        }));

        if(name === "issueDate"){
            // 

            const incrementedDate = dayjs(date).add(5, 'year').subtract(1, 'day');
            const formattedExpiryDate = formatDate(incrementedDate);

            setRequiredDoc((prevValues) => ({
                ...prevValues,
                'expiryDate': formattedExpiryDate,
            }));

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
           
            <FormWrapper headingText="Fill License Details">
                <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={handleFormSubmit}>
                    <Grid container spacing={2} direction="column">



                       

                            <Grid item xs={12} sm>
                                <InputLabel shrink={false} htmlFor={"serialNo"}>
                                    <Typography variant='body1'>License Serial Number*</Typography>
                                </InputLabel>
                                <TextField
                                    id="serialNo"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='License Serial Number'
                                    name="serialNo"
                                    variant='outlined'
                                    error={!!formErrors.serialNo}
                                    helperText={formErrors.serialNo || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9]+$/)}
                                    value={requiredDoc.serialNo}
                                    size="small"
                                    inputProps={{ maxLength: 24 }}
                                />
                            </Grid>
                        


                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor={"issueDate"}>
                                <Typography variant='body1' >Issue Date*</Typography>
                            </InputLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs} sx={{zIndex: 10015}}> 
                                <DatePicker
                                    id="issueDate"
                                    disableFuture
                                    name="issueDate"
                                    onChange={(date) => handleDateChange('issueDate', date)}
                                    value={dayjs(requiredDoc.issueDate)}
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            fullWidth: true,
                                            placeholder: "Issue Date",
                                            error: !!formErrors.issueDate,
                                            helperText: formErrors.issueDate || ''
                                        },
                                        popper: {
                                            style: { zIndex: 110015 },
                                        },
                                    }}
                                    sx={{mt:1}}
                                    
                                />
                            </LocalizationProvider>
                        </Grid>


                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor={"expiryDate"}>
                                <Typography variant='body1' >Expiry Date*</Typography>
                            </InputLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs} sx={{zIndex: 1500}}> 
                                <DatePicker
                                    id="expiryDate"
                                    disablePast
                                    name="expiryDate"
                                    onChange={(date) => handleDateChange('expiryDate', date)}
                                    value={dayjs(requiredDoc.expiryDate)}
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            fullWidth: true,
                                            placeholder: "Expiry Date",
                                            error: !!formErrors.expiryDate,
                                            helperText: formErrors.expiryDate || ''
                                        },
                                        popper: {
                                            style: { zIndex: 110015 },
                                        },
                                    }}
                                    sx={{mt:1}}
                                    
                                />
                            </LocalizationProvider>
                        </Grid>


                        {/*Bank Guarantee Proof*/}

                        <Grid item  xs={12} sm>
                            <InputLabel shrink={false} htmlFor={"file"} sx={{mb:1}}>
                                <Typography variant='body1'>Upload Certificate*</Typography>
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
                                                name="file"
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

export default IssueLicense;
