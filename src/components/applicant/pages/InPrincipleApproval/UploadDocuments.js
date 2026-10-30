// import React, { forwardRef, useImperativeHandle, useState} from 'react';
// import { Box, Grid, Button, Typography, InputLabel, FormHelperText, Tooltip } from '@mui/material';
// import Captcha from '../../../global/util/Captcha';
// import LoaderProgress from '../../../global/common/LoaderProgress';
// import showAlert from '../../../global/common/MessageBox/AlertService';
// import FormWrapper from '../../../global/util/FormWrapper';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload'; 
// import { styled } from '@mui/material/styles';
// import IssuanceService from '../../../../service/NewLicenseService/IssuanceService';

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
    
//     bankGuarantee: {
//         blank: "Please upload bank guarantee document.",
//         size: "The file size must not exceed 5MB. Please upload a smaller file.",
//         format: "Only Pdf file is allowed."
//     },
    
//     csr: {
//         blank: "Please upload bank csr document.",
//         size: "The file size must not exceed 5MB. Please upload a smaller file.",
//         format: "Only Pdf file is allowed."
//     },

//     agreement: {
//         blank: "Please upload bank agreement document.",
//         size: "The file size must not exceed 5MB. Please upload a smaller file.",
//         format: "Only Pdf file is allowed."
//     },

//     captchaError: {
//         blank: "Please enter captcha."
//     },
// };

// const UploadDocuments = forwardRef(({intentAppId, refreshList}, ref) => {
//     const [requiredDoc, setRequiredDoc] = useState({
//         intentAppId:intentAppId,
//         bankGuarantee: '',
//         csr: '',
//         agreement: ''

//     });
 
//     const [fileName, setFileName] = useState({
//         bankGuarantee: '',
//         csr: '',
//         agreement: ''
//     })

//     const [bankGuaranteeKey, setBankGuaranteeKey] = useState(Date.now());
//     const [csrKey, setCsrKey] = useState(Date.now());
//     const [agreementKey, setAgreementKey] = useState(Date.now());
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

//         setFileName({
//             ...fileName,
//             [e.target.name]:file ? file.name : ''
//         });

//     };

//     const validateFile = (errors) => {

//         if (requiredDoc.bankGuarantee) {

//             const allowedExtensions = /(\.pdf|\.PDF)$/i;
//             if (!allowedExtensions.exec(requiredDoc.bankGuarantee.name)) {
//                 errors.bankGuarantee = errorMsg.bankGuarantee.format;
//             }

//             const maxSize = 5*1024*1024;

//             if (requiredDoc.bankGuarantee.size > maxSize) {
//                 errors.bankGuarantee = errorMsg.bankGuarantee.size;
//             }
//         } else {
//             errors.bankGuarantee = errorMsg.bankGuarantee.blank;
//         }

//         if (requiredDoc.csr) {

//             const allowedExtensions = /(\.pdf|\.PDF)$/i;
//             if (!allowedExtensions.exec(requiredDoc.csr.name)) {
//                 errors.csr = errorMsg.csr.format;
//             }

//             const maxSize = 5*1024*1024;

//             if (requiredDoc.csr.size > maxSize) {
//                 errors.csr = errorMsg.csr.size;
//             }
//         } else {
//             errors.csr = errorMsg.csr.blank;
//         }

//         if (requiredDoc.agreement) {

//             const allowedExtensions = /(\.pdf|\.PDF)$/i;
//             if (!allowedExtensions.exec(requiredDoc.agreement.name)) {
//                 errors.agreement = errorMsg.agreement.format;
//             }

//             const maxSize = 5*1024*1024;

//             if (requiredDoc.agreement.size > maxSize) {
//                 errors.agreement = errorMsg.agreement.size;
//             }
//         } else {
//             errors.agreement = errorMsg.agreement.blank;
//         }

//     };
   
//     const handleReset = () => {
//         setRequiredDoc({
//             bankGuarantee: '',
//             csr: '',
//             agreement: ''
//         });

//         setFileName({
//             bankGuarantee: '',
//             csr: '',
//             agreement: ''
//         });

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
    
//         if (!captchaInput) {
//             errors.captcha = errorMsg.captchaError.blank;
//         }
    
//         return errors;
//     };


//     const handleConfrimSubmit = () => {

//         setLoading(true);


//                 IssuanceService.uploadRequiredDocuments(requiredDoc)
//                     .then((response) => {
//                         showAlert({
//                             messageTitle: 'Document Upload',
//                             messageContent: response.data,
//                             confirmText: 'Ok',
//                             disableOutsideKeyDown: true,
//                             enableHeaderCloseBtn: false,
//                             closeParent: true,
//                         })

//                         //refresh
//                         refreshList();
//                     })
//                     .catch((err) => {
//                         showAlert({
//                             messageTitle: 'Error',
//                             messageContent: err.response.data ? typeof err.response.data === 'object' ? 'Your request cannot be processed at this time. Please try again later.' : err.response.data : 'Your request cannot be processed at this time. Please try again later.',
//                             confirmText: 'Ok',
//                         })
//                     })
//                     .finally(() => {
//                         setLoading(false);
//                     });
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

//     return (
//         <>
//             <LoaderProgress open={isLoading} />
           
//             <FormWrapper headingText="Upload Required Documents">
//                 <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={handleFormSubmit}>
//                     <Grid container spacing={2} direction="column">

//                         {/*Bank Guarantee*/}

//                         <Grid item  xs={12} sm>
//                             <InputLabel shrink={false} htmlFor={"bankGuarantee"}>
//                                 <Typography variant='body1'>Upload Bank Guarantee*</Typography>
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
//                                                 key={bankGuaranteeKey}
//                                                 type="file"
//                                                 name="bankGuarantee"
//                                                 onChange={handleFileChange}
//                                             />
//                                         </Button>
                                        
//                                         </Grid>
//                                         <Grid item xs sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
//                                         {fileName.bankGuarantee && (
//                                             <Tooltip title={fileName.bankGuarantee} placement="top">
//                                                 <Typography variant='body2' sx={{
//                                                     display: 'inline-block',
//                                                     whiteSpace: 'nowrap',
//                                                     overflow: 'hidden',
//                                                     textOverflow: 'ellipsis',
//                                                     verticalAlign: 'middle',
//                                                     textAlign: 'center'
//                                                 }}>
//                                                     {fileName.bankGuarantee}
//                                                 </Typography>
//                                             </Tooltip>
//                                         )}    
//                                         </Grid>
//                                     </Grid>
                                    
//                                     {formErrors.bankGuarantee && (
//                                         <FormHelperText error>{formErrors.bankGuarantee}</FormHelperText>
//                                     )}
//                                 </Grid>

//                             {/*CSR*/}

//                             <Grid item  xs={12} sm>
//                             <InputLabel shrink={false} htmlFor={"csr"}>
//                                 <Typography variant='body1'>Upload CSR*</Typography>
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
//                                                 key={csrKey}
//                                                 type="file"
//                                                 name="csr"
//                                                 onChange={handleFileChange}
//                                             />
//                                         </Button>
                                        
//                                         </Grid>
//                                         <Grid item xs sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
//                                         {fileName.csr && (
//                                             <Tooltip title={fileName.csr} placement="top">
//                                                 <Typography variant='body2' sx={{
//                                                     display: 'inline-block',
//                                                     whiteSpace: 'nowrap',
//                                                     overflow: 'hidden',
//                                                     textOverflow: 'ellipsis',
//                                                     verticalAlign: 'middle',
//                                                     textAlign: 'center'
//                                                 }}>
//                                                     {fileName.csr}
//                                                 </Typography>
//                                             </Tooltip>
//                                         )}    
//                                         </Grid>
//                                     </Grid>
                                    
//                                     {formErrors.csr && (
//                                         <FormHelperText error>{formErrors.csr}</FormHelperText>
//                                     )}
//                                 </Grid>  


//                             {/*Agreement*/}

//                             <Grid item  xs={12} sm>
//                             <InputLabel shrink={false} htmlFor={"agreement"}>
//                                 <Typography variant='body1'>Upload Agreement*</Typography>
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
//                                                 key={agreementKey}
//                                                 type="file"
//                                                 name="agreement"
//                                                 onChange={handleFileChange}
//                                             />
//                                         </Button>
                                        
//                                         </Grid>
//                                         <Grid item xs sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
//                                         {fileName.agreement && (
//                                             <Tooltip title={fileName.agreement} placement="top">
//                                                 <Typography variant='body2' sx={{
//                                                     display: 'inline-block',
//                                                     whiteSpace: 'nowrap',
//                                                     overflow: 'hidden',
//                                                     textOverflow: 'ellipsis',
//                                                     verticalAlign: 'middle',
//                                                     textAlign: 'center'
//                                                 }}>
//                                                     {fileName.agreement}
//                                                 </Typography>
//                                             </Tooltip>
//                                         )}    
//                                         </Grid>
//                                     </Grid>
                                    
//                                     {formErrors.agreement && (
//                                         <FormHelperText error>{formErrors.agreement}</FormHelperText>
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

// export default UploadDocuments;



import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Box, Grid, Button, Typography, InputLabel, FormHelperText, Tooltip } from '@mui/material';
import Captcha from '../../../global/util/Captcha';
import LoaderProgress from '../../../global/common/LoaderProgress';
import showAlert from '../../../global/common/MessageBox/AlertService';
import FormWrapper from '../../../global/util/FormWrapper';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import { styled } from '@mui/material/styles';
import IssuanceService from '../../../../service/NewLicenseService/IssuanceService';

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

const errorMsg = {
    bankGuarantee: {
        blank: "Please upload bank guarantee document.",
        size: "The file size must not exceed 5MB. Please upload a smaller file.",
        format: "Only Pdf file is allowed."
    },
    csr: {
        blank: "Please upload bank csr document.",
        size: "The file size must not exceed 5MB. Please upload a smaller file.",
        format: "Only Pdf file is allowed."
    },
    agreement: {
        blank: "Please upload bank agreement document.",
        size: "The file size must not exceed 5MB. Please upload a smaller file.",
        format: "Only Pdf file is allowed."
    },
    crossCertification: {
        blank: "Please upload cross certification arrangement document.",
        size: "The file size must not exceed 5MB. Please upload a smaller file.",
        format: "Only Pdf file is allowed."
    },
    captchaError: {
        blank: "Please enter captcha."
    },
};

const UploadDocuments = forwardRef(({ intentAppId, refreshList }, ref) => {
    const [requiredDoc, setRequiredDoc] = useState({
        intentAppId: intentAppId,
        bankGuarantee: '',
        csr: '',
        agreement: '',
        crossCertification: ''
    });

    const [fileName, setFileName] = useState({
        bankGuarantee: '',
        csr: '',
        agreement: '',
        crossCertification: ''
    })

    const [bankGuaranteeKey] = useState(Date.now());
    const [csrKey] = useState(Date.now());
    const [agreementKey] = useState(Date.now());
    const [crossCertificationKey] = useState(Date.now());
    const [formErrors, setFormErrors] = useState({});
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setRequiredDoc({
            ...requiredDoc,
            [e.target.name]: file
        });
        setFileName({
            ...fileName,
            [e.target.name]: file ? file.name : ''
        });
    };

    const handleDownloadTemplate = (templateName, title) => {
        setLoading(true);
        IssuanceService.downloadTemplate(templateName)
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${templateName}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: `Unable to download ${title} template. Please try again later.`,
                    confirmText: 'Ok',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const validateFile = (errors) => {
        const validateSingleFile = (fieldValue, fieldKey, msgObj) => {
            if (fieldValue) {
                const allowedExtensions = /(\.pdf|\.PDF)$/i;
                if (!allowedExtensions.exec(fieldValue.name)) {
                    errors[fieldKey] = msgObj.format;
                }
                if (fieldValue.size > 5 * 1024 * 1024) {
                    errors[fieldKey] = msgObj.size;
                }
            } else {
                errors[fieldKey] = msgObj.blank;
            }
        };

        validateSingleFile(requiredDoc.bankGuarantee, 'bankGuarantee', errorMsg.bankGuarantee);
        validateSingleFile(requiredDoc.csr, 'csr', errorMsg.csr);
        validateSingleFile(requiredDoc.agreement, 'agreement', errorMsg.agreement);
        validateSingleFile(requiredDoc.crossCertification, 'crossCertification', errorMsg.crossCertification);
    };
   
    const handleReset = () => {
        setRequiredDoc({ bankGuarantee: '', csr: '', agreement: '', crossCertification: '' });
        setFileName({ bankGuarantee: '', csr: '', agreement: '', crossCertification: '' });
        setCaptchaInput('');
        setFormErrors({});
    }

    useImperativeHandle(ref, () => ({
        handleReset,
        handleFormSubmit
    }))

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
        IssuanceService.uploadRequiredDocuments(requiredDoc)
            .then((response) => {
                showAlert({
                    messageTitle: 'Document Upload',
                    messageContent: response.data,
                    confirmText: 'Ok',
                    disableOutsideKeyDown: true,
                    enableHeaderCloseBtn: false,
                    closeParent: true,
                })
                refreshList();
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: err.response?.data ? (typeof err.response.data === 'object' ? 'Your request cannot be processed at this time.' : err.response.data) : 'Your request cannot be processed at this time.',
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
                    messageContent: 'Are you sure, you want to submit? You cannot reupload the documents again.',
                    confirmText: 'Yes',
                    closeText: 'No',
                    fullWidth: true,
                    maxWidth: 'sm',
                    onConfirm: () => handleConfrimSubmit()
                })
            } else {
                showAlert({ messageTitle: 'Error', messageContent: 'Invalid Captcha', confirmText: 'Ok' })
            }
        } else {
            setFormErrors(errors);
        }
    };

    // Helper for fields WITH template download button
    const renderUploadFieldWithTemplate = (label, name, keyState, fileErrorMsg, templateCode) => (
        <Grid item xs={12} sm>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <InputLabel shrink={false} htmlFor={name}>
                    <Typography variant='body1'>{label}*</Typography>
                </InputLabel>
                <Button
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownloadTemplate(templateCode, label)}
                    sx={{ textTransform: 'none' }}
                >
                    Download Template
                </Button>
            </Box>

            <Grid container direction="row" sx={{ border: '1px solid #cfcfcf', borderRadius: '5px', p: 1 }}>
                <Grid item>
                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                        Upload file
                        <VisuallyHiddenInput key={keyState} type="file" name={name} onChange={handleFileChange} />
                    </Button>
                </Grid>
                <Grid item xs sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', px: 2 }}>
                    {fileName[name] && (
                        <Tooltip title={fileName[name]} placement="top">
                            <Typography variant='body2' sx={{
                                display: 'inline-block',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                verticalAlign: 'middle',
                                textAlign: 'center'
                            }}>
                                {fileName[name]}
                            </Typography>
                        </Tooltip>
                    )}
                </Grid>
            </Grid>
            {fileErrorMsg && <FormHelperText error>{fileErrorMsg}</FormHelperText>}
        </Grid>
    );

    // Helper for fields WITHOUT template download button (Upload only)
    const renderUploadFieldOnly = (label, name, keyState, fileErrorMsg) => (
        <Grid item xs={12} sm>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <InputLabel shrink={false} htmlFor={name}>
                    <Typography variant='body1'>{label}*</Typography>
                </InputLabel>
            </Box>

            <Grid container direction="row" sx={{ border: '1px solid #cfcfcf', borderRadius: '5px', p: 1 }}>
                <Grid item>
                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                        Upload file
                        <VisuallyHiddenInput key={keyState} type="file" name={name} onChange={handleFileChange} />
                    </Button>
                </Grid>
                <Grid item xs sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', px: 2 }}>
                    {fileName[name] && (
                        <Tooltip title={fileName[name]} placement="top">
                            <Typography variant='body2' sx={{
                                display: 'inline-block',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                verticalAlign: 'middle',
                                textAlign: 'center'
                            }}>
                                {fileName[name]}
                            </Typography>
                        </Tooltip>
                    )}
                </Grid>
            </Grid>
            {fileErrorMsg && <FormHelperText error>{fileErrorMsg}</FormHelperText>}
        </Grid>
    );

    return (
        <>
            <LoaderProgress open={isLoading} />
            <FormWrapper headingText="Upload Required Documents prior to commencement of operation as CA">
                <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={handleFormSubmit}>
                    <Grid container spacing={3} direction="column">
                        {renderUploadFieldWithTemplate("Bank Guarantee Document", "bankGuarantee", bankGuaranteeKey, formErrors.bankGuarantee, "BankGuarantee")}
                        {renderUploadFieldWithTemplate("CSR Document", "csr", csrKey, formErrors.csr, "CSR")}
                        {renderUploadFieldWithTemplate("Agreement Document", "agreement", agreementKey, formErrors.agreement, "Agreement")}
                        {renderUploadFieldOnly("Cross Certification Arrangement Document", "crossCertification", crossCertificationKey, formErrors.crossCertification)}
                    </Grid>

            <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box>
                <Typography variant="h6">
                <b>Note:</b><br/>1. The Bank Guarantee remains valid period of 6 years from the date of its submission.<br/>
                 2. Applicant advised to ensure 6 years validity condition & submit the appropriate valid Bank Guarantee document.
                </Typography>
              </Box>
            </Grid>
          </Grid>

                    <Box sx={{ mt: 3 }}>
                        <Captcha setCaptcha={setCaptchaText}
                            setCaptchaInput={setCaptchaInput}
                            captchaInput={captchaInput}
                            captchaError={!!formErrors.captcha}
                            captchaErrorMsg={formErrors.captcha} />
                    </Box>
                </Box>
            </FormWrapper>
        </>
    );
});

export default UploadDocuments;
