// import React, { forwardRef, useImperativeHandle, useState} from 'react';
// import { Box, Grid, Button, Typography, InputLabel, FormHelperText, Tooltip, TextField } from '@mui/material';
// import Captcha from '../../../global/util/Captcha';
// import LoaderProgress from '../../../global/common/LoaderProgress';
// import showAlert from '../../../global/common/MessageBox/AlertService';
// import FormWrapper from '../../../global/util/FormWrapper';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload'; 
// import { styled } from '@mui/material/styles';
// import LicenseIssuanceService from '../../../../service/LicenseIssuanceService/LicenseIssuanceService'
// import ValidatePattern from '../../../global/util/ValidatePattern';
// import dayjs from 'dayjs';
// import { DatePicker } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// const VisuallyHiddenInput = styled('input')({
//     position: 'absolute',
//     width: '1px',
//     height: '1px',
//     padding: '0',
//     margin: '-1px',
//     overflow: 'hidden',
//     clip: 'rect(0,0,0,0)',
//     border: '0',
//   });

// //Errors
// const errorMsg = {
    
//     file: {
//         blank: "Please upload bank guarantee proof.",
//         size: "The file size must not exceed 5MB. Please upload a smaller file.",
//         format: "Only Pdf file is allowed."
//     },

//     issueDate: {
//         blank: "Please select issue date.",
//         diff: "Issue date must be less than expiry date."
//     },

//     expiryDate: {
//         blank: "Please select expiry date.",
//         diff: "Expiry date must be greater than issue date."
//     },

//     transactionNumber: {
//         blank: "Please enter transaction number.",
//         length: "The length must be between 8 and 22 characters.",
//         format: "Please enter valid transaction number."
//     },


//     captchaError: {
//         blank: "Please enter captcha."
//     },
// };

// const BankGuaranteeProof = forwardRef(({intentAppId, refreshApplication}, ref) => {
//     const [requiredDoc, setRequiredDoc] = useState({
//         intentAppId:intentAppId,
//         file: '',
//         issueDate: '',
//         expiryDate: '',
//         transactionNumber: ''

//     });
 
//     const [fileName, setFileName] = useState('')
//     const [fileKey, setFileKey] = useState(Date.now());
//     const [formErrors, setFormErrors] = useState({});
//     const [captchaText, setCaptchaText] = useState('');
//     const [captchaInput, setCaptchaInput] = useState('');
//     const [isLoading, setLoading] = useState(false);
    

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
    
//         setRequiredDoc({
//             ...requiredDoc,
//             [e.target.name]:file
//         });

//         setFileName(file ? file.name : '');

//     };

//     const validateFile = (errors) => {

//         if (requiredDoc.file) {

//             const allowedExtensions = /(\.pdf|\.PDF)$/i;
//             if (!allowedExtensions.exec(requiredDoc.file.name)) {
//                 errors.file = errorMsg.file.format;
//             }

//             const maxSize = 5*1024*1024;

//             if (requiredDoc.file.size > maxSize) {
//                 errors.file = errorMsg.file.size;
//             }
//         } else {
//             errors.file = errorMsg.file.blank;
//         }

//     };
   
//     const handleReset = () => {
//         setRequiredDoc({
//             file: '',
//             issueDate: '',
//             expiryDate: '',
//             transactionNumber: ''
//         });

//         setFileName('');

//         setCaptchaInput('');
//         setFormErrors({});
//     }


//     useImperativeHandle(ref, ()=>{
//         return{
//             handleReset,
//             handleFormSubmit
//         }
//     })


//     const validateForm = () => {
//         const errors = {};
    
//         validateFile(errors);


//         if (!requiredDoc.transactionNumber) {
//             errors.transactionNumber = errorMsg.transactionNumber.blank;
//         } else if (requiredDoc.transactionNumber.length < 8 || requiredDoc.transactionNumber.length > 22) {
//             errors.transactionNumber = errorMsg.transactionNumber.length;
//         } else if (!/^[A-Za-z0-9]+$/.test(requiredDoc.transactionNumber)) {
//             errors.transactionNumber = errorMsg.transactionNumber.format;
//         }

//         if (!requiredDoc.issueDate) {
//             errors.issueDate = errorMsg.issueDate.blank;
//         } 

//         if (!requiredDoc.expiryDate) {
//             errors.expiryDate = errorMsg.expiryDate.blank;
//         } 
    
//         if (!captchaInput) {
//             errors.captcha = errorMsg.captchaError.blank;
//         }
    
//         return errors;
//     };



//     const handleConfrimSubmit = () => {

//         setLoading(true);

//         LicenseIssuanceService.uploadBankGuaranteeProof(requiredDoc)
//             .then((response) => {
//                 showAlert({
//                     messageTitle: 'Document Upload',
//                     messageContent: response.data,
//                     confirmText: 'Ok',
//                     enableHeaderCloseBtn:false,
//                     disableOutsideKeyDown:true,
//                     closeParent: true,
//                     //onConfirm: ()=>{window.location.href='/ccaoffice/newapplicationlist'}
//                 })

//                 refreshApplication();
//             })
//             .catch((err) => {
//                 showAlert({
//                     messageTitle: 'Error',
//                     messageContent: err.response.data ? typeof err.response.data === 'object' ? 'Your request cannot be processed at this time. Please try again later.' : err.response.data : 'Your request cannot be processed at this time. Please try again later.',
//                     confirmText: 'Ok',
//                 })
//             })
//             .finally(() => {
//                 setLoading(false);
//             });

//     }


//     const handleFormSubmit = () => {
        
//         const errors = validateForm();

//         if (Object.keys(errors).length === 0) {
//             setFormErrors({});

//             if (captchaInput === captchaText) {

//                 showAlert({
//                     messageTitle: 'Confirm',
//                     messageContent: 'Are you sure, you want to submit? You cannot reupload the documents again. Please verify before uploading the documents.',
//                     confirmText: 'Yes',
//                     closeText: 'No',
//                     fullWidth: true,
//                     maxWidth: 'sm',
//                     onConfirm: ()=>handleConfrimSubmit()
//                 })

                
//             }else{
//                 showAlert({
//                     messageTitle: 'Error',
//                     messageContent: 'Invalid Captcha',
//                     confirmText: 'Ok',
//                 })
//             }
//         } else {
//             setFormErrors(errors);
//         }
//     };


//     // Handle Input Change
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;

//         setRequiredDoc({
//                 ...requiredDoc,
//                 [name]: value,
//             });
        
        
//     }; 

//     //Handle Date Change
//     const handleDateChange = (name, date) => {

//         const isValidDate = (date) => {
//             return dayjs(date).isValid();
//         };

//         if (!isValidDate(date)) {
//             return;
//         }

//         const formatDate = (date) => {
//             return dayjs(date).format('YYYY-MM-DD');
//         };

//         const formattedDate = formatDate(date);

//         setRequiredDoc((prevValues) => ({
//             ...prevValues,
//             [name]: formattedDate,
//         }));
//     };

//     return (
//         <>
//             <LoaderProgress open={isLoading} />
           
//             <FormWrapper headingText="Fill Bank Guarantee Proof Details">
//                 <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={handleFormSubmit}>
//                     <Grid container spacing={2} direction="column">



                       

//                             <Grid item xs={12} sm>
//                                 <InputLabel shrink={false} htmlFor={"transactionNumber"}>
//                                     <Typography variant='body1'>Transaction Number*</Typography>
//                                 </InputLabel>
//                                 <TextField
//                                     id="transactionNumber"
//                                     margin="dense"
//                                     required
//                                     fullWidth
//                                     placeholder='Transaction Number'
//                                     name="transactionNumber"
//                                     variant='outlined'
//                                     error={!!formErrors.transactionNumber}
//                                     helperText={formErrors.transactionNumber || ''}
//                                     onChange={handleInputChange}
//                                     onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9]+$/)}
//                                     value={requiredDoc.transactionNumber}
//                                     size="small"
//                                     inputProps={{ maxLength: 22 }}
//                                 />
//                             </Grid>
                        


//                         <Grid item xs={12} sm>
//                             <InputLabel shrink={false} htmlFor={"issueDate"}>
//                                 <Typography variant='body1' >Issue Date*</Typography>
//                             </InputLabel>
//                             <LocalizationProvider dateAdapter={AdapterDayjs} sx={{zIndex: 10015}}> 
//                                 <DatePicker
//                                     id="issueDate"
//                                     disableFuture
//                                     name="issueDate"
//                                     onChange={(date) => handleDateChange('issueDate', date)}
//                                     value={dayjs(requiredDoc.issueDate)}
//                                     slotProps={{
//                                         textField: {
//                                             size: 'small',
//                                             fullWidth: true,
//                                             placeholder: "Issue Date",
//                                             error: !!formErrors.issueDate,
//                                             helperText: formErrors.issueDate || ''
//                                         },
//                                         popper: {
//                                             style: { zIndex: 110015 },
//                                         },
//                                     }}
//                                     sx={{mt:1}}
                                    
//                                 />
//                             </LocalizationProvider>
//                         </Grid>


//                         <Grid item xs={12} sm>
//                             <InputLabel shrink={false} htmlFor={"expiryDate"}>
//                                 <Typography variant='body1' >Expiry Date*</Typography>
//                             </InputLabel>
//                             <LocalizationProvider dateAdapter={AdapterDayjs} sx={{zIndex: 1500}}> 
//                                 <DatePicker
//                                     id="expiryDate"
//                                     disablePast
//                                     name="expiryDate"
//                                     onChange={(date) => handleDateChange('expiryDate', date)}
//                                     value={dayjs(requiredDoc.expiryDate)}
//                                     slotProps={{
//                                         textField: {
//                                             size: 'small',
//                                             fullWidth: true,
//                                             placeholder: "Expiry Date",
//                                             error: !!formErrors.expiryDate,
//                                             helperText: formErrors.expiryDate || ''
//                                         },
//                                         popper: {
//                                             style: { zIndex: 110015 },
//                                         },
//                                     }}
//                                     sx={{mt:1}}
//                                 />
//                             </LocalizationProvider>
//                         </Grid>


//                         {/*Bank Guarantee Proof*/}

//                         <Grid item  xs={12} sm>
//                             <InputLabel shrink={false} htmlFor={"file"} sx={{mb:1}}>
//                                 <Typography variant='body1'>Upload Bank Guarantee Proof*</Typography>
//                             </InputLabel>

//                                     <Grid container direction="row" sx={{border: '1px solid #cfcfcf', borderRadius: '5px'}}>
//                                         <Grid item >
//                                             <Button
//                                             component="label"
//                                             variant="contained"
//                                             startIcon={<CloudUploadIcon />}
//                                         >
//                                             Upload file
//                                             <VisuallyHiddenInput
//                                                 key={fileKey}
//                                                 type="file"
//                                                 name="file"
//                                                 onChange={handleFileChange}
//                                             />
//                                         </Button>
                                        
//                                         </Grid>
//                                         <Grid item xs sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
//                                         {fileName && (
//                                             <Tooltip title={fileName} placement="top">
//                                                 <Typography variant='body2' sx={{
//                                                     display: 'inline-block',
//                                                     whiteSpace: 'nowrap',
//                                                     overflow: 'hidden',
//                                                     textOverflow: 'ellipsis',
//                                                     verticalAlign: 'middle',
//                                                     textAlign: 'center'
//                                                 }}>
//                                                     {fileName}
//                                                 </Typography>
//                                             </Tooltip>
//                                         )}    
//                                         </Grid>
//                                     </Grid>
                                    
//                                     {formErrors.file && (
//                                         <FormHelperText error>{formErrors.file}</FormHelperText>
//                                     )}
//                                 </Grid>
     

//                     </Grid> 

//                     <Captcha setCaptcha={setCaptchaText}
//                         setCaptchaInput={setCaptchaInput}
//                         captchaInput={captchaInput}
//                         captchaError={!!formErrors.captcha}
//                         captchaErrorMsg={formErrors.captcha} />

                    
//                 </Box>
//             </FormWrapper>
//         </>
//     );
// });

// export default BankGuaranteeProof;


//updated
import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { Box, Grid, Button, Typography, InputLabel, FormHelperText, Tooltip, TextField, FormControl, Select, MenuItem } from '@mui/material';
import Captcha from '../../../global/util/Captcha';
import LoaderProgress from '../../../global/common/LoaderProgress';
import showAlert from '../../../global/common/MessageBox/AlertService';
import FormWrapper from '../../../global/util/FormWrapper';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; 
import { styled } from '@mui/material/styles';
import LicenseIssuanceService from '../../../../service/LicenseIssuanceService/LicenseIssuanceService'
import ValidatePattern from '../../../global/util/ValidatePattern';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

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
    issuingBankName: {
        blank: "Please select issuing bank name.",
        format: "Please select a valid issuing bank name."
    },
    bankGuaranteeIssueDate: {
        blank: "Please enter Bank Guarantee issue date in DD-MM-YYYY format.",
        format: "Please enter a valid Bank Guarantee issue date in DD-MM-YYYY format.",
        min: "Bank Guarantee issue date cannot be before the Grant-In-Principle approval date."
    },
    issueDate: {
        blank: "Please enter issue date in DD-MM-YYYY format.",
        format: "Please enter a valid issue date in DD-MM-YYYY format."
    },
    expiryDate: {
        blank: "Expiry date is automatically calculated.",
        diff: "The period between Bank Guarantee issue date and expiry date must be at least 6 years."
    },
    transactionNumber: {
        blank: "Please enter Bank Guarantee number.",
        length: "The length must be between 8 and 22 characters.",
        format: "Please enter valid Bank Guarantee number."
    },
    captchaError: {
        blank: "Please enter captcha."
    },
};

const BankGuaranteeProof = forwardRef(({intentAppId, refreshApplication}, ref) => {
    const [requiredDoc, setRequiredDoc] = useState({
        intentAppId: intentAppId,
        file: '',
        issuingBankName: '',
        bankId: '', // Added bankId to state payload
        bankGuaranteeIssueDate: '',
        issueDate: '',
        expiryDate: '',
        transactionNumber: ''
    });
 
    const [fileName, setFileName] = useState('');
    const [fileKey, setFileKey] = useState(Date.now());
    const [formErrors, setFormErrors] = useState({});
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [grantInPrincipleDate, setGrantInPrincipleDate] = useState(null);

    // Comprehensive bank list with names and IDs
    const bankList = [
        { id: "SBIN", name: "State Bank of India" },
        { id: "HDFC", name: "HDFC Bank" },
        { id: "ICIC", name: "ICICI Bank" },
        { id: "UTIB", name: "Axis Bank" },
        { id: "PUNB", name: "Punjab National Bank" },
        { id: "BARB", name: "Bank of Baroda" },
        { id: "CNRB", name: "Canara Bank" },
        { id: "UBIN", name: "Union Bank of India" },
        { id: "KKBK", name: "Kotak Mahindra Bank" },
        { id: "BKID", name: "Bank of India" },
        { id: "INDB", name: "IndusInd Bank" },
        { id: "CBIN", name: "Central Bank of India" },
        { id: "IDIB", name: "Indian Bank" },
        { id: "IOBA", name: "Indian Overseas Bank" },
        { id: "MAHB", name: "Bank of Maharashtra" }
    ];

    // Fetch application details to get Grant-In-Principle approval date for timeline validation
    useEffect(() => {
        if (intentAppId) {
            try {
                if (LicenseIssuanceService.getApplicationDetails) {
                    LicenseIssuanceService.getApplicationDetails(intentAppId).then(res => {
                        if (res && res.data && (res.data.grantInPrincipleDate || res.data.approvalDate)) {
                            setGrantInPrincipleDate(dayjs(res.data.grantInPrincipleDate || res.data.approvalDate));
                        }
                    }).catch(() => {});
                }
            } catch (e) {
                console.error(e);
            }
        }
    }, [intentAppId]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setRequiredDoc({
            ...requiredDoc,
            [e.target.name]: file
        });
        setFileName(file ? file.name : '');
    };

    const validateFile = (errors) => {
        if (requiredDoc.file) {
            const allowedExtensions = /(\.pdf|\.PDF)$/i;
            if (!allowedExtensions.exec(requiredDoc.file.name)) {
                errors.file = errorMsg.file.format;
            }
            const maxSize = 5 * 1024 * 1024;
            if (requiredDoc.file.size > maxSize) {
                errors.file = errorMsg.file.size;
            }
        } else {
            errors.file = errorMsg.file.blank;
        }
    };
   
    const handleReset = () => {
        setRequiredDoc({
            intentAppId: intentAppId,
            file: '',
            issuingBankName: '',
            bankId: '',
            bankGuaranteeIssueDate: '',
            issueDate: '',
            expiryDate: '',
            transactionNumber: ''
        });
        setFileName('');
        setCaptchaInput('');
        setFormErrors({});
    };

    useImperativeHandle(ref, () => ({
        handleReset,
        handleFormSubmit
    }));

    const formatDateInput = (value) => {
        const digits = value.replace(/\D/g, '');
        const limitedDigits = digits.slice(0, 8);
        if (limitedDigits.length <= 2) {
            return limitedDigits;
        } else if (limitedDigits.length <= 4) {
            return `${limitedDigits.slice(0, 2)}-${limitedDigits.slice(2)}`;
        } else {
            return `${limitedDigits.slice(0, 2)}-${limitedDigits.slice(2, 4)}-${limitedDigits.slice(4)}`;
        }
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        const formattedValue = formatDateInput(value);

        setRequiredDoc((prev) => {
            const updated = { ...prev, [name]: formattedValue };

            // If updating Bank Guarantee Issue Date, auto-calculate Expiry Date (+6 Years)
            if (name === 'bankGuaranteeIssueDate') {
                const parsedDate = dayjs(formattedValue, 'DD-MM-YYYY', true);
                if (parsedDate.isValid()) {
                    updated.expiryDate = parsedDate.add(6, 'year').format('DD-MM-YYYY');
                } else {
                    updated.expiryDate = '';
                }
            }

            return updated;
        });
    };

    // Handle bank selection change to set both name and bankId simultaneously
    const handleBankChange = (e) => {
        const selectedBankName = e.target.value;
        const matchedBank = bankList.find(b => b.name === selectedBankName);
        
        setRequiredDoc((prev) => ({
            ...prev,
            issuingBankName: selectedBankName,
            bankId: matchedBank ? matchedBank.id : ''
        }));
    };

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

       if (!requiredDoc.issuingBankName) {
            errors.issuingBankName = errorMsg.issuingBankName.blank;
        }

        if (!requiredDoc.bankGuaranteeIssueDate) {
            errors.bankGuaranteeIssueDate = errorMsg.bankGuaranteeIssueDate.blank;
        } else {
            const bgIssueD = dayjs(requiredDoc.bankGuaranteeIssueDate, 'DD-MM-YYYY', true);
            if (!bgIssueD.isValid()) {
                errors.bankGuaranteeIssueDate = errorMsg.bankGuaranteeIssueDate.format;
            } else if (grantInPrincipleDate && bgIssueD.isBefore(grantInPrincipleDate, 'day')) {
                errors.bankGuaranteeIssueDate = errorMsg.bankGuaranteeIssueDate.min;
            }
        }

        if (!requiredDoc.issueDate) {
            errors.issueDate = errorMsg.issueDate.blank;
        } else {
            const issueD = dayjs(requiredDoc.issueDate, 'DD-MM-YYYY', true);
            if (!issueD.isValid()) {
                errors.issueDate = errorMsg.issueDate.format;
            }
        }

        if (!requiredDoc.expiryDate) {
            errors.expiryDate = errorMsg.expiryDate.blank;
        } else if (requiredDoc.bankGuaranteeIssueDate) {
            const bgIssueD = dayjs(requiredDoc.bankGuaranteeIssueDate, 'DD-MM-YYYY', true);
            const expiryD = dayjs(requiredDoc.expiryDate, 'DD-MM-YYYY', true);
            if (bgIssueD.isValid() && expiryD.isValid()) {
                const diffYears = expiryD.diff(bgIssueD, 'year', true);
                if (diffYears < 6) {
                    errors.expiryDate = errorMsg.expiryDate.diff;
                }
            }
        }
    
        if (!captchaInput) {
            errors.captcha = errorMsg.captchaError.blank;
        }
    
        return errors;
    };

    const handleConfrimSubmit = () => {
        setLoading(true);

        const payload = {
            intentAppId: requiredDoc.intentAppId,
            file: requiredDoc.file,
            issuingBankName: requiredDoc.issuingBankName,
            bankId: requiredDoc.bankId, // Included bankId in payload sent to backend
            bankGuaranteeIssueDate: dayjs(requiredDoc.bankGuaranteeIssueDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
            issueDate: dayjs(requiredDoc.issueDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
            expiryDate: dayjs(requiredDoc.expiryDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
            transactionNumber: requiredDoc.transactionNumber,
        };

        LicenseIssuanceService.uploadBankGuaranteeProof(payload)
            .then((response) => {
                showAlert({
                    messageTitle: 'Document Upload',
                    messageContent: response.data,
                    confirmText: 'Ok',
                    closeParent: true,
                });
                refreshApplication();
            })
            .catch((err) => {
                console.error("Backend error response:", err.response?.data);
                showAlert({
                    messageTitle: 'Error',
                    messageContent: err.response?.data || 'Your request cannot be processed at this time. Please try again later.',
                    confirmText: 'Ok',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleFormSubmit = () => {
        const errors = validateForm();

        if (errors.expiryDate === errorMsg.expiryDate.diff) {
            showAlert({
                messageTitle: 'Validation Error',
                messageContent: errorMsg.expiryDate.diff,
                confirmText: 'Ok',
            });
            setFormErrors(errors);
            return;
        }

        if (errors.bankGuaranteeIssueDate === errorMsg.bankGuaranteeIssueDate.min) {
            showAlert({
                messageTitle: 'Validation Error',
                messageContent: errorMsg.bankGuaranteeIssueDate.min,
                confirmText: 'Ok',
            });
            setFormErrors(errors);
            return;
        }

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
                    onConfirm: () => handleConfrimSubmit()
                });
            } else {
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRequiredDoc({
            ...requiredDoc,
            [name]: value,
        });
    }; 

    return (
        <>
            <LoaderProgress open={isLoading} />
           
            <FormWrapper headingText="Fill Bank Guarantee Proof Details">
                <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={(e) => { e.preventDefault(); handleFormSubmit(); }}>
                    <Grid container spacing={2} direction="column">

                        {/* Bank Guarantee Number */}
                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor={"transactionNumber"}>
                                <Typography variant='body1'>Bank Guarantee Number*</Typography>
                            </InputLabel>
                            <TextField
                                id="transactionNumber"
                                margin="dense"
                                required
                                fullWidth
                                placeholder='Bank Guarantee Number'
                                name="transactionNumber"
                                variant='outlined'
                                error={!!formErrors.transactionNumber}
                                helperText={formErrors.transactionNumber || ''}
                                onChange={handleInputChange}
                                value={requiredDoc.transactionNumber}
                                size="small"
                                inputProps={{ maxLength: 22 }}
                            />
                        </Grid>

                        {/* Issuing Bank Name Dropdown with high zIndex menu props */}
                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor={"issuingBankName"}>
                                <Typography variant='body1'>Bank Name*</Typography>
                            </InputLabel>
                            <FormControl fullWidth margin="dense" size="small" error={Boolean(formErrors.issuingBankName)}>
                                <Select
                                    id="issuingBankName"
                                    name="issuingBankName"
                                    value={requiredDoc.issuingBankName}
                                    onChange={handleBankChange}
                                    displayEmpty
                                    MenuProps={{
                                        disablePortal: true,
                                        PaperProps: {
                                            sx: {
                                                zIndex: 110015,
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem disabled value="">Select Bank Name</MenuItem>
                                    {bankList.map((bank, index) => (
                                        <MenuItem key={index} value={bank.name}>{bank.name}</MenuItem>
                                    ))}
                                </Select>
                                {formErrors.issuingBankName && <FormHelperText>{formErrors.issuingBankName}</FormHelperText>}
                            </FormControl>
                        </Grid>

                        {/* Bank Guarantee Issue Date */}
                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor={"bankGuaranteeIssueDate"}>
                                <Typography variant='body1'>Bank Guarantee Issue Date*</Typography>
                            </InputLabel>
                            <TextField
                                id="bankGuaranteeIssueDate"
                                margin="dense"
                                required
                                fullWidth
                                placeholder='DD-MM-YYYY'
                                name="bankGuaranteeIssueDate"
                                variant='outlined'
                                error={!!formErrors.bankGuaranteeIssueDate}
                                helperText={formErrors.bankGuaranteeIssueDate || ''}
                                onChange={handleDateChange}
                                value={requiredDoc.bankGuaranteeIssueDate}
                                size="small"
                                inputProps={{ maxLength: 10 }}
                            />
                        </Grid>

                        {/* Submission Issue Date */}
                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor={"issueDate"}>
                                <Typography variant='body1'>Issue Date*</Typography>
                            </InputLabel>
                            <TextField
                                id="issueDate"
                                margin="dense"
                                required
                                fullWidth
                                placeholder='DD-MM-YYYY'
                                name="issueDate"
                                variant='outlined'
                                error={!!formErrors.issueDate}
                                helperText={formErrors.issueDate || ''}
                                onChange={handleDateChange}
                                value={requiredDoc.issueDate}
                                size="small"
                                inputProps={{ maxLength: 10 }}
                            />
                        </Grid>

                        {/* Expiry Date (Auto-calculated 6 years from Bank Guarantee Issue Date) */}
                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor={"expiryDate"}>
                                <Typography variant='body1'>Expiry Date*</Typography>
                            </InputLabel>
                            <TextField
                                id="expiryDate"
                                margin="dense"
                                required
                                fullWidth
                                placeholder='DD-MM-YYYY'
                                name="expiryDate"
                                variant='outlined'
                                error={!!formErrors.expiryDate}
                                helperText={formErrors.expiryDate || ''}
                                value={requiredDoc.expiryDate}
                                size="small"
                                inputProps={{ readOnly: true }}
                            />
                        </Grid>

                        {/* File Upload */}
                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor={"file"} sx={{mb:1}}>
                                <Typography variant='body1'>Upload Bank Guarantee Proof*</Typography>
                            </InputLabel>
                            <Grid container direction="row" sx={{border: '1px solid #cfcfcf', borderRadius: '5px'}}>
                                <Grid item>
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

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <Box>
                                <Typography variant="h6">
                                    <b>Note:</b><br/>1. The Bank Guarantee remains valid period of 6 years from the date of its submission.
                                    <br/>
                                    2. Applicant advised to ensure 6 years validity condition & submit the appropriate valid Bank Guarantee document.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Captcha 
                        setCaptcha={setCaptchaText}
                        setCaptchaInput={setCaptchaInput}
                        captchaInput={captchaInput}
                        captchaError={!!formErrors.captcha}
                        captchaErrorMsg={formErrors.captcha} 
                    />
                </Box>
            </FormWrapper>
        </>
    );
});

export default BankGuaranteeProof;
