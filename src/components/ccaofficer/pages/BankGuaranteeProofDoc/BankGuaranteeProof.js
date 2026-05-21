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
        blank: "Please upload bank guarantee proof.",
        size: "The file size must not exceed 5MB. Please upload a smaller file.",
        format: "Only Pdf file is allowed."
    },

    issueDate: {
        blank: "Please select issue date.",
        diff: "Issue date must be less than expiry date."
    },

    expiryDate: {
        blank: "Please select expiry date.",
        diff: "Expiry date must be greater than issue date."
    },

    transactionNumber: {
        blank: "Please enter transaction number.",
        length: "The length must be between 8 and 22 characters.",
        format: "Please enter valid transaction number."
    },


    captchaError: {
        blank: "Please enter captcha."
    },
};

const BankGuaranteeProof = forwardRef(({intentAppId, refreshApplication}, ref) => {
    const [requiredDoc, setRequiredDoc] = useState({
        intentAppId:intentAppId,
        file: '',
        issueDate: '',
        expiryDate: '',
        transactionNumber: ''

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
            file: '',
            issueDate: '',
            expiryDate: '',
            transactionNumber: ''
        });

        setFileName('');

        setCaptchaInput('');
        setFormErrors({});
    }


    useImperativeHandle(ref, ()=>{
        return{
            handleReset,
            handleFormSubmit
        }
    })


    const validateForm = () => {
        const errors = {};
    
        validateFile(errors);


        if (!requiredDoc.transactionNumber) {
            errors.transactionNumber = errorMsg.transactionNumber.blank;
        } else if (requiredDoc.transactionNumber.length < 8 || requiredDoc.transactionNumber.length > 22) {
            errors.transactionNumber = errorMsg.transactionNumber.length;
        } else if (!/^[A-Za-z0-9]+$/.test(requiredDoc.transactionNumber)) {
            errors.transactionNumber = errorMsg.transactionNumber.format;
        }

        if (!requiredDoc.issueDate) {
            errors.issueDate = errorMsg.issueDate.blank;
        } 

        if (!requiredDoc.expiryDate) {
            errors.expiryDate = errorMsg.expiryDate.blank;
        } 
    
        if (!captchaInput) {
            errors.captcha = errorMsg.captchaError.blank;
        }
    
        return errors;
    };



    const handleConfrimSubmit = () => {

        setLoading(true);

        LicenseIssuanceService.uploadBankGuaranteeProof(requiredDoc)
            .then((response) => {
                showAlert({
                    messageTitle: 'Document Upload',
                    messageContent: response.data,
                    confirmText: 'Ok',
                    enableHeaderCloseBtn:false,
                    disableOutsideKeyDown:true,
                    closeParent: true,
                    //onConfirm: ()=>{window.location.href='/ccaoffice/newapplicationlist'}
                })

                refreshApplication();
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
    };

    return (
        <>
            <LoaderProgress open={isLoading} />
           
            <FormWrapper headingText="Fill Bank Guarantee Proof Details">
                <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={handleFormSubmit}>
                    <Grid container spacing={2} direction="column">



                       

                            <Grid item xs={12} sm>
                                <InputLabel shrink={false} htmlFor={"transactionNumber"}>
                                    <Typography variant='body1'>Transaction Number*</Typography>
                                </InputLabel>
                                <TextField
                                    id="transactionNumber"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='Transaction Number'
                                    name="transactionNumber"
                                    variant='outlined'
                                    error={!!formErrors.transactionNumber}
                                    helperText={formErrors.transactionNumber || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9]+$/)}
                                    value={requiredDoc.transactionNumber}
                                    size="small"
                                    inputProps={{ maxLength: 22 }}
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
                                <Typography variant='body1'>Upload Bank Guarantee Proof*</Typography>
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

export default BankGuaranteeProof;
