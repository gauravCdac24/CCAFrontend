import React, { useEffect, useState } from 'react';
import { Grid, TextField, Typography, MenuItem, FormControl, InputLabel, Select, Box, Button, Tooltip, FormHelperText, Link } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import ApplicationForm from '../../../../service/NewLicenseService/ApplicationForm';
import showAlert from '../../../global/common/MessageBox/AlertService';
import { useSelector } from 'react-redux';
import SubServiceMaster from '../../../../service/AdminService/SubServiceMaster';
import ValidatePattern from '../../../global/util/ValidatePattern';
import ApplicationReview from '../../../../service/NewLicenseService/ApplicationReview';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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

const errorMessages = {
    atLeastOne: "At least one field must be filled in either Votar Card Details, Pan Card Details and Passport Details.",
    creditcardtype: 'Credit Card Type is required.',
    creditCardNo: {
        required: 'Credit Card Number is required.',
        format: 'Credit Card Number must be 16 digits.'
    },
    issuedBy: 'Issued By is required.',
    passportNo: 'Passport Number is required.',
    passportIssuingAuthority: 'Passport Issuing Authority is required.',
    passportExpiryDate: {
        required: 'Passport Expiry Date is required.',
        past: 'Passport Expiry Date cannot be in the past.'
    },
    voterIdNo: 'Voter ID Number is required.',
    incomeTaxPanNo: 'Income Tax Pan Number is required.',
    ispName: 'ISP Name is required.',
    ispWebsiteAddress: 'ISP Website Address is required.',
    ispUserName: 'ISP Username is required.',
    webPageURL: {
        required: 'Web Page URL is required.',
        format: 'Web Page URL must be a valid URL.'
    },
    capital: 'Capital is required.',
    file1: 'Passport Document is required.',
    file2: 'ID Card Doument is required.',
    file3: 'PanCard Document is required.',
    file4: 'Profession Document is required.',
};



const FinancialDetails = ({handleNext,handleBack}) => {
    const [passportExpiryDate, setPassportExpiryDate] = React.useState(null);
    const CardType = ["Visa", "MasterCard", "Amex"]
    const [basicDetailsFormValues, setBasicDetailsFormValues] = useState({
        passportDetails:{ 
            passportName:'Passport',
            appDocId:'',
            passportNo: '',
            passportIssuingAuthority: '',
            passportExpiryDate: null,
            file1: '',
        },
        CardDetails:{
            voterCardName:'VoterCard',
            appDocId: '',
            voterIdNo: '',
            file2: '',
        },
       PanCardDetails:{
        panCardName:'PanCard',
        appDocId: '',
        incomeTaxPanNo:'',
        file3: '',
        },
        ProfessionalDetails:{
            capitalName:'Capital',
            appDocId: '',
            capital: '',
            file4: '',
 
       },
        creditcardtype: '',
        creditCardNo: '',
        issuedBy: '',
        ispName: '',
        ispWebsiteAddress: '',
        useName:'',
        ispUserName: '',
        webPageURL: '',
        indivAdditionalDetailsId:'',
    });

    const userName = useSelector((state)=>state.jwtAuthentication.username);
    const appTypeMasterId= useSelector((state)=>state.licenseApplication.applicationType);
    console.log(userName);
    console.log(appTypeMasterId);

    useEffect(() => {
     
      setBasicDetailsFormValues((prevState) => ({
        ...prevState,
        useName: userName || '',  
      }));
    }, [userName]); 


    const[applicationReviewData,setApplicatioReviewData]=useState([])
      useEffect(() => {
        setLoading(true);
        ApplicationReview.getAllApplicationReviewByUserName(userName)
            .then((data) => {
                console.log("data.dtaa===>",data.data)
                setApplicatioReviewData(data.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching application types:", error);
                setLoading(false);
            });
    }, [userName]);

console.log("applicationReviewData===>",applicationReviewData)

const isFieldEnabled = (fieldName) => {
    // Log the applicationReviewData to confirm structure
    console.log("applicationReviewData:", fieldName);
  
    // Enable by default if data is undefined or empty
    if (!applicationReviewData || applicationReviewData.length === 0) {
      console.log(`Enabling ${fieldName} by default (data undefined or empty).`);
      return true;
    }
  
    // Find matching field by name
    const field = applicationReviewData.find((f) => f.fieldName === fieldName);
  
    // Log the field status
    console.log(`Field found for ${fieldName}:`, field);
  
    // Enable if field is "Active", otherwise disable
    const isEnabled = field ?  field.status === "Active"  : false;
    console.log(`isFieldEnabled(${fieldName}) returns:`, isEnabled);
  
    return isEnabled;
  };      

    useEffect(() => {
        if (userName) {
            setLoading(true);
            ApplicationForm.getApplicationForm3ByUsername(userName)
                .then((response) => {
                    console.log(response.data);
                    const { indivAdditionalDetails, applicationDocument } = response.data;
    
                    // Extract document files based on titles
                    const passportDoc = applicationDocument.find(doc => doc.documentTitle === 'passportDocument') || {};
                    const voterDoc = applicationDocument.find(doc => doc.documentTitle === 'idCardDocument') || {};
                    const panDoc = applicationDocument.find(doc => doc.documentTitle === 'panCardDocument') || {};
                    const capitalDoc = applicationDocument.find(doc => doc.documentTitle === 'capitalDocument') || {};
    
                    // Set the form values
                    setBasicDetailsFormValues({
                        passportDetails: {
                            passportName: 'Passport',
                            passportNo: indivAdditionalDetails.passportNo || '',
                            passportIssuingAuthority: indivAdditionalDetails.passportIssuingAuthority || '',
                            passportExpiryDate: indivAdditionalDetails.passportExpiryDate || null,
                            file1: passportDoc.fileName || '', // Set file name for passport
                            appDocId:passportDoc.appDocId || '',
                        },
                        CardDetails: {
                            voterCardName: 'VoterCard',
                            voterIdNo: indivAdditionalDetails.voterId || '',
                            file2: voterDoc.fileName || '',
                            appDocId:voterDoc.appDocId || '',
                        },
                        PanCardDetails: {
                            panCardName: 'PanCard',
                            incomeTaxPanNo: indivAdditionalDetails.pan || '',
                            file3: panDoc.fileName || '',
                            appDocId:panDoc.appDocId || '',
                        },
                        ProfessionalDetails: {
                            capitalName: 'Capital',
                            capital: indivAdditionalDetails.indivCapital || '',
                            file4: capitalDoc.fileName || '',
                            appDocId:capitalDoc.appDocId || '',
                        },
                        creditcardtype: indivAdditionalDetails.creditCardType || '',
                        creditCardNo: indivAdditionalDetails.creditCardNo || '',
                        issuedBy: indivAdditionalDetails.creditCardIssuedBy || '',
                        ispName: indivAdditionalDetails.ispName || '',
                        ispWebsiteAddress: indivAdditionalDetails.ispWebsite || '',
                        ispUserName: indivAdditionalDetails.ispUsername || '',
                        webPageURL: indivAdditionalDetails.personalWebPage || '',
                        indivAdditionalDetailsId:indivAdditionalDetails.indivAdditionalDetailsId || '',
                    });
    
                    // Set the file name display for passport document
                    setFileName1(passportDoc.fileName || '');
                    setFileName2(voterDoc.fileName || '');
                    setFileName3(panDoc.fileName || '');
                    setFileName4(capitalDoc.fileName || '');
                })
                .catch((err) => {
                    console.error(err);
                    // Handle error
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [userName]);
    
    // Optional: Log basicDetailsFormValues whenever it changes
    useEffect(() => {
        console.log(basicDetailsFormValues);
    }, [basicDetailsFormValues]);
    

  // General field change
const handleChange = (e) => {
    const { name, value } = e.target;

    setBasicDetailsFormValues(prevState => {
        // Handle nested state updates based on the field name
        switch (name) {
            case 'passportNo':
            case 'passportIssuingAuthority':
                return {
                    ...prevState,
                    passportDetails: {
                        ...prevState.passportDetails,
                        [name]: value,
                    },
                };
            case 'voterIdNo':
                return {
                    ...prevState,
                    CardDetails: {
                        ...prevState.CardDetails,
                        [name]: value,
                    },
                };
            case 'incomeTaxPanNo':
                return {
                    ...prevState,
                    PanCardDetails: {
                        ...prevState.PanCardDetails,
                        [name]: value,
                    },
                };
            case 'capital':
                return {
                    ...prevState,
                    ProfessionalDetails: {
                        ...prevState.ProfessionalDetails,
                        [name]: value,
                    },
                };
            default:
                // For fields like credit card details, ISP details, etc.
                return {
                    ...prevState,
                    [name]: value,
                };
        }
    });
};

// Handle Date changes
const handleDateChange = (name, date) => {
    const isValidDate = (date) => {
        return dayjs(date).isValid();
    };

    if (!isValidDate(date)) {
        console.error('Invalid date:', date);
        return;
    }

    const formatDate = (date) => {
        return dayjs(date).format('YYYY-MM-DD');
    };

    const formattedDate = formatDate(date);

    setBasicDetailsFormValues(prevState => {
        switch (name) {
            case 'passportExpiryDate':
                return {
                    ...prevState,
                    passportDetails: {
                        ...prevState.passportDetails,
                        [name]: formattedDate,
                    },
                };
            default:
                return prevState;
        }
    });
};
console.log(basicDetailsFormValues)
const [errors, setErrors] = useState({});
const [formErrors, setFormErrors] = useState({});
const [fileInputKey1, setFileInputKey1] = useState(Date.now());
const [fileName1, setFileName1] = useState('');
const [fileInputKey2, setFileInputKey2] = useState(Date.now());
const [fileName2, setFileName2] = useState('');
const [fileInputKey3, setFileInputKey3] = useState(Date.now());
const [fileName3, setFileName3] = useState('');
const [fileInputKey4, setFileInputKey4] = useState(Date.now());
const [fileName4, setFileName4] = useState('');
const allowedFileTypes = ['application/pdf'];
// Handle File change for file1 (passport), file2 (voter card), file3 (PAN card), and file4 (capital proof)
const handleFileChange1 = (e) => {
    const file = e.target.files[0]; // Get the selected file
    let errorMessage = '';

    if (file) {
        // Validate file type
        if (!allowedFileTypes.includes(file.type)) {
            errorMessage = 'Only allowed file types are supported';
        }

        // Validate file size
        if (file.size > 5 * 1024 * 1024) { // 5MB
            errorMessage = 'File size must be less than 5MB';
        }

        // Set form errors if validation fails
        if (errorMessage) {
            setFormErrors(prevErrors => ({
                ...prevErrors,
                file1: errorMessage // Setting the error for file1
            }));
        } else {
            // If no errors, clear the error message and update file
            setFormErrors(prevErrors => ({
                ...prevErrors,
                file1: '' // Clear any previous errors
            }));

            setBasicDetailsFormValues(prevState => ({
                ...prevState,
                passportDetails: {
                    ...prevState.passportDetails,
                    file1: file, // Update the selected file in state
                },
            }));

            setFileName1(file.name); // Update the file name for display
        }
    }
};


const handleFileChange2 = (e) => {
    const file = e.target.files[0];

    let errorMessage = '';

    if (file) {
        // Validate file type
        if (!allowedFileTypes.includes(file.type)) {
            errorMessage = 'Only allowed file types are supported';
        }

        // Validate file size
        if (file.size > 5 * 1024 * 1024) { // 5MB
            errorMessage = 'File size must be less than 5MB';
        }

        // Set form errors if validation fails
        if (errorMessage) {
            setFormErrors(prevErrors => ({
                ...prevErrors,
                file2: errorMessage // Setting the error for file2
            }));
        } else {
            // If no errors, clear the error message and update file
            setFormErrors(prevErrors => ({
                ...prevErrors,
                file2: '' // Clear any previous errors
            }));

            // Update the state with the selected file
            setBasicDetailsFormValues(prevState => ({
                ...prevState,
                CardDetails: {
                    ...prevState.CardDetails,
                    file2: file,
                },
            }));

            // Update the file name for display
            setFileName2(file ? file.name : '');
        }
    }
};


const handleFileChange3 = (e) => {
    const file = e.target.files[0];
    let errorMessage = '';

    if (file) {
        // Validate file type
        if (!allowedFileTypes.includes(file.type)) {
            errorMessage = 'Only allowed file types are supported';
        }

        // Validate file size
        if (file.size > 5 * 1024 * 1024) { // 5MB
            errorMessage = 'File size must be less than 5MB';
        }

        // Set form errors if validation fails
        if (errorMessage) {
            setFormErrors(prevErrors => ({
                ...prevErrors,
                file3: errorMessage // Setting the error for file3
            }));
        } else {
            // If no errors, clear the error message and update file
            setFormErrors(prevErrors => ({
                ...prevErrors,
                file3: '' // Clear any previous errors
            }));

            setBasicDetailsFormValues(prevState => ({
                ...prevState,
                PanCardDetails: {
                    ...prevState.PanCardDetails,
                    file3: file,
                },
            }));

            setFileName3(file ? file.name : '');
        }
    }
};

const handleFileChange4 = (e) => {
    const file = e.target.files[0];
    let errorMessage = '';

    if (file) {
        // Validate file type
        if (!allowedFileTypes.includes(file.type)) {
            errorMessage = 'Only allowed file types are supported';
        }

        // Validate file size
        if (file.size > 5 * 1024 * 1024) { // 5MB
            errorMessage = 'File size must be less than 5MB';
        }

        // Set form errors if validation fails
        if (errorMessage) {
            setFormErrors(prevErrors => ({
                ...prevErrors,
                file4: errorMessage // Setting the error for file4
            }));
        } else {
            // If no errors, clear the error message and update file
            setFormErrors(prevErrors => ({
                ...prevErrors,
                file4: '' // Clear any previous errors
            }));

            setBasicDetailsFormValues(prevState => ({
                ...prevState,
                ProfessionalDetails: {
                    ...prevState.ProfessionalDetails,
                    file4: file,
                },
            }));

            setFileName4(file ? file.name : '');
        }
    }
};




    const validateForm = (basicDetailsFormValues) => {
        const errors = {};

        const cardDetails = basicDetailsFormValues.CardDetails;
    const panCardDetails = basicDetailsFormValues.PanCardDetails;
    const professionalDetails = basicDetailsFormValues.ProfessionalDetails;

    const isCardDetailsEmpty = !cardDetails.appDocId && !cardDetails.voterIdNo && !cardDetails.file2;
    const isPanCardDetailsEmpty = !panCardDetails.appDocId && !panCardDetails.incomeTaxPanNo && !panCardDetails.file3;
    const isProfessionalDetailsEmpty = !professionalDetails.appDocId && !professionalDetails.capital && !professionalDetails.file4;

    if (isCardDetailsEmpty && isPanCardDetailsEmpty && isProfessionalDetailsEmpty) {
        errors.general = errorMessages.atLeastOne; // General error if all are empty
    }
        
      
        if (!basicDetailsFormValues.ispName) errors.ispName = errorMessages.ispName;
      
          if (!/^https?:\/\/[^\s]+$/.test(basicDetailsFormValues.webPageURL)) {
            errors.webPageURL = errorMessages.webPageURL.format;
        }
        
        // Validate Professional Details
        if (!basicDetailsFormValues.ProfessionalDetails.capital) errors.capital = errorMessages.capital;
    
        //
        if (!basicDetailsFormValues.ProfessionalDetails.file4) errors.file4 = errorMessages.file4;
    
        return errors;
    };
    
    const handleBacks = () => {
        handleBack();
     }
 
     const [isLoading, setLoading] = useState(false);

    //  const handleFormSubmit = (e) => {
    //     e.preventDefault();
    //             alert("next part");
    //             handleNext();    
    // };
     
     const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log(basicDetailsFormValues)
       
        const validationErrors = validateForm(basicDetailsFormValues);
        console.log(validationErrors)
        if (Object.keys(validationErrors).length === 0) {
            const formData = new FormData();

    // Append simple form fields (non-nested)
    formData.append('creditcardtype', basicDetailsFormValues.creditcardtype);
    formData.append('creditCardNo', basicDetailsFormValues.creditCardNo);
    formData.append('issuedBy', basicDetailsFormValues.issuedBy);
    formData.append('ispName', basicDetailsFormValues.ispName);
    formData.append('ispWebsiteAddress', basicDetailsFormValues.ispWebsiteAddress);
    formData.append('ispUserName', basicDetailsFormValues.ispUserName);
    formData.append('webPageURL', basicDetailsFormValues.webPageURL);
    formData.append('useName', userName);
    formData.append('indivAdditionalDetailsId', basicDetailsFormValues.indivAdditionalDetailsId);

    // Append nested passport details
    formData.append('passportappDocId', basicDetailsFormValues.passportDetails.appDocId);
    formData.append('passportName', basicDetailsFormValues.passportDetails.passportName);
    formData.append('passportNo', basicDetailsFormValues.passportDetails.passportNo);
    formData.append('passportIssuingAuthority', basicDetailsFormValues.passportDetails.passportIssuingAuthority);
    formData.append('passportExpiryDate', basicDetailsFormValues.passportDetails.passportExpiryDate);
    if (basicDetailsFormValues.passportDetails.file1) {
        formData.append('file1', basicDetailsFormValues.passportDetails.file1);
        formData.append('fileName1',basicDetailsFormValues.passportDetails.file1)
    }

    // Append nested voter card details
    formData.append('votarappDocId', basicDetailsFormValues.CardDetails.appDocId);
    formData.append('voterCardName', basicDetailsFormValues.CardDetails.voterCardName);
    formData.append('voterIdNo', basicDetailsFormValues.CardDetails.voterIdNo);
    if (basicDetailsFormValues.CardDetails.file2) {
        formData.append('file2', basicDetailsFormValues.CardDetails.file2);
        formData.append('fileName2',basicDetailsFormValues.CardDetails.file2)
    }

    // Append nested PAN card details
    formData.append('panappDocId', basicDetailsFormValues.PanCardDetails.appDocId);
    formData.append('panCardName', basicDetailsFormValues.PanCardDetails.panCardName);
    formData.append('incomeTaxPanNo', basicDetailsFormValues.PanCardDetails.incomeTaxPanNo);
    if (basicDetailsFormValues.PanCardDetails.file3) {
        formData.append('file3', basicDetailsFormValues.PanCardDetails.file3);
        formData.append('fileName3',basicDetailsFormValues.PanCardDetails.file3)
    }

    // Append nested professional details
    formData.append('capitalappDocId', basicDetailsFormValues.ProfessionalDetails.appDocId);
    formData.append('capitalName', basicDetailsFormValues.ProfessionalDetails.capitalName);
    formData.append('userName', basicDetailsFormValues.useName);
    formData.append('capital', basicDetailsFormValues.ProfessionalDetails.capital);
    if (basicDetailsFormValues.ProfessionalDetails.file4) {
        formData.append('file4', basicDetailsFormValues.ProfessionalDetails.file4);
        formData.append('fileName4',basicDetailsFormValues.ProfessionalDetails.file4)
    }
    console.log(formData)
            // No errors, proceed with form submission
          
            const requestMethod = (basicDetailsFormValues.indivAdditionalDetailsId) 
            ? ApplicationForm.updateNewApplicationForm3 
            : ApplicationForm.addNewApplicationForm3;  
            requestMethod(formData)
                            .then((response) => {
        
                                 showAlert({
                                   messageTitle: 'Third Step SuccessFull',
                                    messageContent: `Third step ${(basicDetailsFormValues.indivAdditionalDetailsId) 
                                        ? 'updated'
                                        :'saved'} successfully `,
                                     confirmText: 'Ok',
                                    onConfirm: () => { handleNext() }
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
                   
        } else {
            setErrors(validationErrors);
            setFormErrors(validationErrors) // Set validation errors to state
        }
    };
    

    const handleDownloadClick = async (id, file_name) => {
            try {
                // Fetch the file from the server
                const response = await ApplicationForm.downloadFile(id);
    
                // Create a blob from the response data
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
    
                // Create a link element
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
    
                // Extract the filename from the Content-Disposition header
                const contentDisposition = response.headers['content-disposition'];
    
                console.log(JSON.stringify(contentDisposition))
    
                const filename = file_name;
    
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            } catch (error) {
                console.error('Error downloading file:', error);
            }
        };

    return (
        <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={handleFormSubmit}>
            <Grid container spacing={2}>
                <Grid container>
                    <Grid item >
                        <Typography variant='h7' sx={{ mt: 1, mb: 1 }} ><b>Credit Card Details(9)</b></Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={4}>

                    <InputLabel shrink={false} htmlFor={"creditcardtype"}> <Typography variant='body1' >Credit Card Type</Typography></InputLabel>
                    <FormControl variant="outlined" size="small" sx={{ width: '100%', mt: 1 }}>
                        <Select defaultValue="" id="creditcardtype"
                            displayEmpty
                            name="creditcardtype"
                            onChange={handleChange}
                            value={basicDetailsFormValues.creditcardtype}
                            error={!!formErrors.creditcardtype}
                            disabled={!isFieldEnabled("creditCardType")}
                            sx={{
                                width: { xs: '100%', sm: '162px' },
                            }}>
                            <MenuItem disabled value="">
                                Credit Card Type
                            </MenuItem>
                            {CardType.map((item, index) => (
                                <MenuItem key={index} value={item}>{item}</MenuItem>
                            ))}
                          
                        </Select>
                        {formErrors.creditcardtype && <FormHelperText sx={{ ml: 0 }} error>{formErrors.creditcardtype}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <InputLabel shrink={false} htmlFor={"creditCardNo"}>
                        <Typography variant='body1'>Credit Card No.</Typography>
                    </InputLabel>
                    <TextField
                        required
                        id='creditCardNo.'
                        placeholder="Credit Card No."
                        name='creditCardNo'
                        value={basicDetailsFormValues.creditCardNo}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                        error={!!(formErrors.creditCardNo && formErrors.creditCardNo)}
                        helperText={formErrors?.creditCardNo}
                        variant="outlined"
                        size='small'
                        inputProps={{ maxLength: 19 }}
                        disabled={!isFieldEnabled("creditCardNo")}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <InputLabel shrink={false} htmlFor={"issuedBy"}>
                        <Typography variant='body1'>Issued By</Typography>
                    </InputLabel>
                    <TextField
                        required
                        id='issuedBy.'
                        placeholder="Issued By"
                        name='issuedBy'
                        value={basicDetailsFormValues.issuedBy}
                        fullWidth
                        onChange={handleChange}
                        margin="dense"
                        variant="outlined"
                        error={!!(formErrors.issuedBy && formErrors.issuedBy)}
                        helperText={formErrors?.issuedBy}
                        disabled={!isFieldEnabled("issuedBy")}
                        size='small'
                        inputProps={{ maxLength: 40 }}
                    />
                </Grid>
            </Grid>

            <Grid container>
                <Grid item sx={{ mt: 2, mb: 1 }}>
                    <Typography variant='h7'><b>ID Card Details#(12,13,14)</b></Typography>
                </Grid>
                <Grid item sx={{ mt: 2, mb: 1 }}>
                {formErrors.general && (
    <FormHelperText error>{formErrors.general}</FormHelperText>
)}

</Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"passportNo"}>
                        <Typography variant='body1'>Passport No#</Typography>
                    </InputLabel>
                    <TextField
                        required
                        name='passportNo'
                        placeholder="Passport No."
                        fullWidth
                        id='passportNo'
                        value={basicDetailsFormValues.passportDetails.passportNo}
                        onChange={handleChange}
                        variant="outlined"
                        error={!!(formErrors.passportNo && formErrors.passportNo)}
                        helperText={formErrors?.passportNo}
                        size="small"
                        inputProps={{ maxLength: 9 }}
                        margin="dense"
                        disabled={!isFieldEnabled("passportNo")}
                    />
                </Grid>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"passportIssuingAuthority"}>
                        <Typography variant='body1'>Passport Issuing Authority#</Typography>
                    </InputLabel>
                    <TextField
                        required
                        name='passportIssuingAuthority'
                        placeholder="Passport Issuing Authority"
                        error={!!(formErrors.passportIssuingAuthority && formErrors.passportIssuingAuthority)}
                        helperText={formErrors?.passportIssuingAuthority}
                        fullWidth
                        value={basicDetailsFormValues.passportDetails.passportIssuingAuthority}
                        onChange={handleChange}
                        id='passportIssuingAuthority'
                        variant="outlined"
                        size="small"
                        inputProps={{ maxLength: 75 }}
                        margin="dense"
                        disabled={!isFieldEnabled("passportIssuingAuthority")}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
    <Grid item xs={12} sm>
        <InputLabel shrink={false} htmlFor={"passportExpiryDate"}>
            <Typography variant='body1'>Passport Expiry Date#</Typography>
        </InputLabel>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                id="passportExpiryDate"
                disablePast
                minDate={dayjs()}
                name="passportExpiryDate"
                disabled={!isFieldEnabled("passportExpiryDate")}
                onChange={(date) => handleDateChange('passportExpiryDate', date)}
                value={dayjs(basicDetailsFormValues.passportDetails.passportExpiryDate)}
                slotProps={{
                    textField: {
                        size: 'small',
                        fullWidth: true,
                        placeholder: "Passport Expiry Date",
                        error: !!formErrors.passportExpiryDate,
                        helperText: formErrors.passportExpiryDate || ''
                    }
                }}
                sx={{ mt: 1 }}
            />
        </LocalizationProvider>
    </Grid>

    <Grid item xs={12} sm>
        <InputLabel shrink={false} htmlFor={"pdffile"}>
            <Typography variant='body1'>Upload Passport Document (Only PDF and Max allowed size 5 MB)</Typography>
        </InputLabel>

        <Grid container direction="row" sx={{ border: '1px solid #cfcfcf', borderRadius: '5px', mt: 1 }}>
            <Grid item >
                <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                >
                    Upload file
                    <VisuallyHiddenInput
                        key={fileInputKey1}
                        type="file"
                        name="file1"
                        disabled={!isFieldEnabled("file1")}
                        error={!!(formErrors.file1 && formErrors.file1)}
                        helperText={formErrors?.file1}
                        onChange={handleFileChange1}
                    />
                </Button>
            </Grid>

            <Grid item xs sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {fileName1 && (
                    <Tooltip title={fileName1} placement="top">
                        <Typography variant='body2'
                            sx={{
                                display: 'inline-block',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                verticalAlign: 'middle',
                                textAlign: 'center'
                            }}>
                            {fileName1}
                        </Typography>
                    </Tooltip>
                )}
            </Grid>
        </Grid>

        {formErrors.file1 && (
            <FormHelperText error>{formErrors.file1}</FormHelperText>
        )}
    </Grid>

    {basicDetailsFormValues?.passportDetails?.appDocId && (
        <Grid item xs="auto" sx={{ display: 'flex', alignItems: 'center' }}>
                <Link href="#" variant="outlined"
                  onClick={() => handleDownloadClick(basicDetailsFormValues?.passportDetails?.appDocId,"passportDocument")}
                >Download</Link>
        </Grid>
    )}
</Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"firstName"}>
                        <Typography variant='body1'>Voter’s Identity Card No.#</Typography>
                    </InputLabel>

                    <TextField
                        id=''
                        name='voterIdNo'
                        required
                        placeholder="Voter’s Identity Card No."
                        fullWidth
                        disabled={!isFieldEnabled("voterIdNo")}
                        onChange={handleChange}
                        value={basicDetailsFormValues.CardDetails.voterIdNo}
                        variant="outlined"
                        error={!!(formErrors.voterIdNo && formErrors.voterIdNo)}
                        helperText={formErrors?.voterIdNo}
                        size="small"
                        inputProps={{ maxLength: 14 }}
                    />
                </Grid>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"pdffile"}>
                        <Typography variant='body1'>Upload ID Card Document (Only PDF and Max allowed size 5 MB)</Typography>
                    </InputLabel>

                    <Grid container direction="row" sx={{ border: '1px solid #cfcfcf', borderRadius: '5px' }}>
                        <Grid item >
                            <Button
                                component="label"
                                variant="contained"
                                startIcon={<CloudUploadIcon />}
                            >
                                Upload file
                                <VisuallyHiddenInput
                                    key={fileInputKey2}
                                    type="file"
                                    name="file2"
                                    disabled={!isFieldEnabled("file2")}
                                    error={!!(formErrors.file2 && formErrors.file2)}
                                    helperText={formErrors?.file2}
                                    onChange={handleFileChange2}
                                />
                            </Button>

                        </Grid>
                        <Grid item xs sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {fileName2 && (
                                <Tooltip title={fileName2} placement="top">
                                    <Typography variant='body2' sx={{
                                        display: 'inline-block',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        verticalAlign: 'middle',
                                        textAlign: 'center'
                                    }}>
                                        {fileName2}
                                    </Typography>
                                </Tooltip>
                            )}
                        </Grid>
                    </Grid>

                    {formErrors.file2 && (
                                        <FormHelperText error>{formErrors.file2}</FormHelperText>
                                    )}
                </Grid>
                {basicDetailsFormValues?.CardDetails?.appDocId && (
        <Grid item xs="auto" sx={{ display: 'flex', alignItems: 'center' }}>
                <Link href="#" variant="outlined"
                  onClick={() => handleDownloadClick(basicDetailsFormValues?.CardDetails?.appDocId,"voterDocument")}
                >Download</Link>
        </Grid>
    )}
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"incomTaxPanNo"}>
                        <Typography variant='body1'>Income Tax PAN No.#</Typography>
                    </InputLabel>
                    <TextField
                        required
                        id='incomeTaxPanNo'
                        name='incomeTaxPanNo'
                        onChange={handleChange}
                        disabled={!isFieldEnabled("incomeTaxPanNo")}
                        error={!!(formErrors.incomeTaxPanNo && formErrors.incomeTaxPanNo)}
                        helperText={formErrors?.incomeTaxPanNo}
                        placeholder="Income Tax PAN No."
                        fullWidth
                        value={basicDetailsFormValues.PanCardDetails.incomeTaxPanNo}
                        variant="outlined"
                        size='small'
                        inputProps={{ maxLength: 10 }}
                    />
                </Grid>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"pdffile"}>
                        <Typography variant='body1'>Upload Pan Document (Only PDF and Max allowed size 5 MB)</Typography>
                    </InputLabel>

                    <Grid container direction="row" sx={{ border: '1px solid #cfcfcf', borderRadius: '5px' }}>
                        <Grid item >
                            <Button
                                component="label"
                                variant="contained"
                                startIcon={<CloudUploadIcon />}
                            >
                                Upload file
                                <VisuallyHiddenInput
                                    key={fileInputKey3}
                                    type="file"
                                    name="file3"
                                    disabled={!isFieldEnabled("file3")}
                                    onChange={handleFileChange3}
                                />
                            </Button>

                        </Grid>
                        <Grid item xs sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {fileName3 && (
                                <Tooltip title={fileName3} placement="top">
                                    <Typography variant='body2' sx={{
                                        display: 'inline-block',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        verticalAlign: 'middle',
                                        textAlign: 'center'
                                    }}>
                                        {fileName3}
                                    </Typography>
                                </Tooltip>
                            )}
                        </Grid>
                    </Grid>

                    {formErrors.file3 && (
                                        <FormHelperText error>{formErrors.file3}</FormHelperText>
                                    )}
                </Grid>

                {basicDetailsFormValues?.PanCardDetails?.appDocId && (
        <Grid item xs="auto" sx={{ display: 'flex', alignItems: 'center' }}>
                <Link href="#" variant="outlined"
                 onClick={() => handleDownloadClick(basicDetailsFormValues?.PanCardDetails?.appDocId,"panDocument")}
                >Download</Link>
        </Grid>
    )}

            </Grid>
            <Grid container>
                <Grid item sx={{ mt: 2, mb: 1 }}>
                    <Typography variant='h7' ><b>ISP Details*(15)</b></Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <InputLabel shrink={false} htmlFor={"ispName"}>
                        <Typography variant='body1'>ISP Name*</Typography>
                    </InputLabel>
                    <TextField
                        required
                        placeholder="ISP Name"
                        fullWidth
                        variant="outlined"
                        onChange={handleChange}
                        size='small'
                        name='ispName'
                        disabled={!isFieldEnabled("ispName")}
                        value={basicDetailsFormValues.ispName}
                        error={!!(formErrors.ispName && formErrors.ispName)}
                        helperText={formErrors?.ispName}
                        id='ispName'
                        margin='dense'
                        inputProps={{ maxLength: 75 }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <InputLabel shrink={false} htmlFor={"ispWebsiteAddress"}>
                        <Typography variant='body1'>ISP’s Website Address</Typography>
                    </InputLabel>
                    <TextField
                        required
                        placeholder="ISP’s Website Address"
                        fullWidth
                        variant="outlined"
                        onChange={handleChange}
                        value={basicDetailsFormValues.ispWebsiteAddress}
                        size='small'
                        name='ispWebsiteAddress'
                        disabled={!isFieldEnabled("ispWebsiteAddress")}
                        error={!!(formErrors.ispWebsiteAddress && formErrors.ispWebsiteAddress)}
                        helperText={formErrors?.ispWebsiteAddress}
                        id='ispWebsiteAddress'
                        margin='dense'
                        inputProps={{ maxLength: 100 }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <InputLabel shrink={false} htmlFor={"ispUserName"}>
                        <Typography variant='body1'>ISP Username</Typography>
                    </InputLabel>
                    <TextField
                        required
                        placeholder="ISP Username"
                        fullWidth
                        variant="outlined"
                        onChange={handleChange}
                        size='small'
                        value={basicDetailsFormValues.ispUserName}
                        error={!!(formErrors.ispUserName && formErrors.ispUserName)}
                        helperText={formErrors?.ispUserName}
                        id='ispUserName'
                        name='ispUserName'
                        margin='dense'
                        disabled={!isFieldEnabled("ispUserName")}
                        inputProps={{ maxLength: 25 }}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"webPageURL"}>
                        <Typography variant='body1'>Web Page URL*(16)</Typography>
                    </InputLabel>
                    <TextField
                        required
                        placeholder="Web Page URL"
                        fullWidth
                        variant="outlined"
                        onChange={handleChange}
                        size='small'
                        name='webPageURL'
                        value={basicDetailsFormValues.webPageURL}
                        error={!!(formErrors.webPageURL && formErrors.webPageURL)}
                        helperText={formErrors?.webPageURL}
                        id='webPageURL'
                        margin='dense'
                        disabled={!isFieldEnabled("webPageURL")}
                        inputProps={{ maxLength: 100 }}
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item sx={{ mt: 2, mb: 1 }}>
                    <Typography variant='h7'> <b>Business Capital*(17)</b></Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"salutation"}>
                        <Typography variant='body1' >Capital in the business or profession*</Typography>
                    </InputLabel>
                    <TextField
                        required
                        placeholder="Capital in the business or profession"
                        fullWidth
                        variant="outlined"
                        size='small'
                        onChange={handleChange}
                        value={basicDetailsFormValues.ProfessionalDetails.capital}
                        name='capital'
                        error={!!(formErrors.capital && formErrors.capital)}
                        helperText={formErrors?.capital}
                        id='capital'
                        margin='dense'
                        disabled={!isFieldEnabled("capital")}
                        onKeyDown={(e) => ValidatePattern(e, /^[0-9]+$/)}
                        inputProps={{ maxLength: 10 }}
                    />
                </Grid>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"pdffile"}>
                        <Typography variant='body1'>Upload Document*(Only PDF and Max allowed size 5 MB)</Typography>
                    </InputLabel>

                    <Grid container direction="row" sx={{ border: '1px solid #cfcfcf', borderRadius: '5px', mt: 1 }}>
                        <Grid item >
                            <Button
                                component="label"
                                variant="contained"
                                startIcon={<CloudUploadIcon />}
                            >
                                Upload file
                                <VisuallyHiddenInput
                                    key={fileInputKey4}
                                    type="file"
                                    name="file4"
                                    disabled={!isFieldEnabled("file4")}
                                    onChange={handleFileChange4}
                                />
                            </Button>

                        </Grid>
                        <Grid item xs sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {fileName4 && (
                                <Tooltip title={fileName4} placement="top">
                                    <Typography variant='body2' sx={{
                                        display: 'inline-block',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        verticalAlign: 'middle',
                                        textAlign: 'center'
                                    }}>
                                        {fileName4}
                                    </Typography>
                                </Tooltip>
                            )}
                        </Grid>
                    </Grid>
                    {formErrors.file4 && (
                                        <FormHelperText error>{formErrors.file4}</FormHelperText>
                                    )}

                </Grid>
                {basicDetailsFormValues?.ProfessionalDetails?.appDocId && (
                        <Grid item xs="auto" sx={{ display: 'flex', alignItems: 'center' }}>
                            <Link
                                href="#"
                                variant="outlined"
                                onClick={() => handleDownloadClick(basicDetailsFormValues?.ProfessionalDetails?.appDocId,"capitalDocument")}
                            >
                                Download
                            </Link>
                        </Grid>
                    )}


            </Grid>
            <Box sx={{ display: 'flex', justifyContent:'space-between', mt: 3 ,ml:1}}>
            <Button
                                        onClick={handleBacks}
                                        sx={{ mr: 1 }}
                                        variant="contained"
                                        color="primary"
                                    >
                                        Back
                                    </Button>
            <Button
            type="submit"
                                        variant="contained"
                                        color="primary"
                                      
                                    >
                                        Save & Next
                                    </Button>

</Box>
<Grid item xs={12}>
    <InputLabel shrink={false}>
        <Typography variant='body1'>
            Note: * marked field are mandatory to be filled
        </Typography>
        <Typography variant='body1'>
        Note: # marked field are Optional to be filled
        </Typography>
    </InputLabel>
</Grid>

        </Box>
    );
};

export default FinancialDetails;
