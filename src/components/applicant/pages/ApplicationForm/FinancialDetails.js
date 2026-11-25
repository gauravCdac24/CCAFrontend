import React, { useEffect, useState } from 'react';
import { Grid, TextField, Typography, MenuItem, FormControl, InputLabel, Select, Box, Button, Tooltip, FormHelperText, Link } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import ApplicationForm from '../../../../service/NewLicenseService/ApplicationForm';
import showAlert from '../../../global/common/MessageBox/AlertService';
import { getStepSuccessAlert, getStepErrorAlert } from '../../../global/util/applicationFormSteps';
import { useSelector } from 'react-redux';
import SubServiceMaster from '../../../../service/AdminService/SubServiceMaster';
import ValidatePattern from '../../../global/util/ValidatePattern';
import {
    fetchApplicationReviewDataForEdit,
    isReviewFieldEnabled,
} from '../../../global/util/reviewEditableFields';

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

const ID_CARD_OPTIONS = [
    { value: 'passport', label: 'Passport Details' },
    { value: 'voter', label: "Voter's Identity Details" },
    { value: 'pan', label: 'Income Tax PAN Details' },
];

const emptyPassportDetails = {
    passportName: 'Passport',
    appDocId: '',
    passportNo: '',
    passportIssuingAuthority: '',
    passportExpiryDate: null,
    file1: '',
};

const emptyVoterDetails = {
    voterCardName: 'VoterCard',
    appDocId: '',
    voterIdNo: '',
    file2: '',
};

const emptyPanDetails = {
    panCardName: 'PanCard',
    appDocId: '',
    incomeTaxPanNo: '',
    file3: '',
};

const hasIdDocument = (file, appDocId) => {
    if (appDocId) return true;
    if (!file) return false;
    if (typeof file === 'string') return file.trim() !== '';
    return true;
};

const errorMessages = {
    idCardType: 'Please select ID Card details.',
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
        idCardType: '',
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
        if (!userName) return;
        setLoading(true);
        fetchApplicationReviewDataForEdit(userName)
            .then((data) => {
                setApplicatioReviewData(data);
            })
            .catch((error) => {
                console.error("Error fetching application review fields:", error);
                setApplicatioReviewData([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [userName]);

const isFieldEnabled = (fieldName) => isReviewFieldEnabled(applicationReviewData, fieldName);      

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
                    // Prefer saved field values over leftover documents from a previous ID type
                    const hasPassportData = Boolean(
                        indivAdditionalDetails.passportNo
                        || indivAdditionalDetails.passportIssuingAuthority
                        || indivAdditionalDetails.passportExpiryDate
                    );
                    const hasVoterData = Boolean(indivAdditionalDetails.voterId);
                    const hasPanData = Boolean(indivAdditionalDetails.pan);
                    const idCardType = hasPassportData
                        ? 'passport'
                        : hasVoterData
                            ? 'voter'
                            : hasPanData
                                ? 'pan'
                                : (passportDoc.appDocId || passportDoc.fileName)
                                    ? 'passport'
                                    : (voterDoc.appDocId || voterDoc.fileName)
                                        ? 'voter'
                                        : (panDoc.appDocId || panDoc.fileName)
                                            ? 'pan'
                                            : '';
    
                    // Set the form values
                    setBasicDetailsFormValues({
                        idCardType,
                        passportDetails: idCardType === 'passport' ? {
                            passportName: 'Passport',
                            passportNo: indivAdditionalDetails.passportNo || '',
                            passportIssuingAuthority: indivAdditionalDetails.passportIssuingAuthority || '',
                            passportExpiryDate: indivAdditionalDetails.passportExpiryDate || null,
                            file1: passportDoc.fileName || '',
                            appDocId: passportDoc.appDocId || '',
                        } : { ...emptyPassportDetails },
                        CardDetails: idCardType === 'voter' ? {
                            voterCardName: 'VoterCard',
                            voterIdNo: indivAdditionalDetails.voterId || '',
                            file2: voterDoc.fileName || '',
                            appDocId: voterDoc.appDocId || '',
                        } : { ...emptyVoterDetails },
                        PanCardDetails: idCardType === 'pan' ? {
                            panCardName: 'PanCard',
                            incomeTaxPanNo: indivAdditionalDetails.pan || '',
                            file3: panDoc.fileName || '',
                            appDocId: panDoc.appDocId || '',
                        } : { ...emptyPanDetails },
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
    
                    // Show only the selected ID card document name
                    setFileName1(idCardType === 'passport' ? (passportDoc.fileName || '') : '');
                    setFileName2(idCardType === 'voter' ? (voterDoc.fileName || '') : '');
                    setFileName3(idCardType === 'pan' ? (panDoc.fileName || '') : '');
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

const handleIdCardTypeChange = (event) => {
    const { value } = event.target;

    setBasicDetailsFormValues((prevState) => ({
        ...prevState,
        idCardType: value,
        passportDetails: value === 'passport' ? prevState.passportDetails : { ...emptyPassportDetails },
        CardDetails: value === 'voter' ? prevState.CardDetails : { ...emptyVoterDetails },
        PanCardDetails: value === 'pan' ? prevState.PanCardDetails : { ...emptyPanDetails },
    }));

    if (value !== 'passport') {
        setFileName1('');
        setFileInputKey1(Date.now());
    }
    if (value !== 'voter') {
        setFileName2('');
        setFileInputKey2(Date.now() + 1);
    }
    if (value !== 'pan') {
        setFileName3('');
        setFileInputKey3(Date.now() + 2);
    }

    setFormErrors((prevErrors) => ({
        ...prevErrors,
        idCardType: '',
        general: '',
        passportNo: '',
        passportIssuingAuthority: '',
        passportExpiryDate: '',
        file1: '',
        voterIdNo: '',
        file2: '',
        incomeTaxPanNo: '',
        file3: '',
    }));
};

// Handle Date changes
const handleDateChange = (name, date) => {
    const formattedDate = date && dayjs(date).isValid() ? dayjs(date).format('YYYY-MM-DD') : '';

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
        if (!basicDetailsFormValues.idCardType) {
            errors.idCardType = errorMessages.idCardType;
        } else if (basicDetailsFormValues.idCardType === 'passport') {
            const passportDetails = basicDetailsFormValues.passportDetails;
            if (!passportDetails.passportNo) errors.passportNo = errorMessages.passportNo;
            if (!passportDetails.passportIssuingAuthority) errors.passportIssuingAuthority = errorMessages.passportIssuingAuthority;
            if (!passportDetails.passportExpiryDate || !dayjs(passportDetails.passportExpiryDate).isValid()) {
                errors.passportExpiryDate = errorMessages.passportExpiryDate.required;
            } else if (!dayjs(passportDetails.passportExpiryDate).isAfter(dayjs(), 'day')) {
                errors.passportExpiryDate = errorMessages.passportExpiryDate.past;
            }
            if (!hasIdDocument(passportDetails.file1, passportDetails.appDocId)) errors.file1 = errorMessages.file1;
        } else if (basicDetailsFormValues.idCardType === 'voter') {
            const cardDetails = basicDetailsFormValues.CardDetails;
            if (!cardDetails.voterIdNo) errors.voterIdNo = errorMessages.voterIdNo;
            if (!hasIdDocument(cardDetails.file2, cardDetails.appDocId)) errors.file2 = errorMessages.file2;
        } else if (basicDetailsFormValues.idCardType === 'pan') {
            const panCardDetails = basicDetailsFormValues.PanCardDetails;
            if (!panCardDetails.incomeTaxPanNo) errors.incomeTaxPanNo = errorMessages.incomeTaxPanNo;
            if (!hasIdDocument(panCardDetails.file3, panCardDetails.appDocId)) errors.file3 = errorMessages.file3;
        }
        
      
        // Credit card details (optional as a group — if any field is entered, require all three)
        const hasAnyCreditCard =
            Boolean(basicDetailsFormValues.creditcardtype) ||
            Boolean(basicDetailsFormValues.creditCardNo) ||
            Boolean(basicDetailsFormValues.issuedBy);
        if (hasAnyCreditCard) {
            if (!basicDetailsFormValues.creditcardtype) {
                errors.creditcardtype = errorMessages.creditcardtype;
            }
            if (!basicDetailsFormValues.creditCardNo) {
                errors.creditCardNo = errorMessages.creditCardNo.required;
            } else if (!/^\d{15,16}$/.test(String(basicDetailsFormValues.creditCardNo).replace(/\s+/g, ''))) {
                errors.creditCardNo = errorMessages.creditCardNo.format;
            }
            if (!basicDetailsFormValues.issuedBy) {
                errors.issuedBy = errorMessages.issuedBy;
            }
        }

        if (!basicDetailsFormValues.ispName) errors.ispName = errorMessages.ispName;
        
        // Validate Professional Details
        if (!basicDetailsFormValues.ProfessionalDetails.capital) errors.capital = errorMessages.capital;
    
        if (!hasIdDocument(basicDetailsFormValues.ProfessionalDetails.file4, basicDetailsFormValues.ProfessionalDetails.appDocId)) {
            errors.file4 = errorMessages.file4;
        }
    
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

    const selectedIdCard = basicDetailsFormValues.idCardType;
    const passportDetails = selectedIdCard === 'passport'
        ? basicDetailsFormValues.passportDetails
        : emptyPassportDetails;
    const voterDetails = selectedIdCard === 'voter'
        ? basicDetailsFormValues.CardDetails
        : emptyVoterDetails;
    const panDetails = selectedIdCard === 'pan'
        ? basicDetailsFormValues.PanCardDetails
        : emptyPanDetails;

    // Append nested passport details
    formData.append('passportappDocId', passportDetails.appDocId);
    formData.append('passportName', passportDetails.passportName);
    formData.append('passportNo', passportDetails.passportNo);
    formData.append('passportIssuingAuthority', passportDetails.passportIssuingAuthority);
    const passportExpiry = passportDetails.passportExpiryDate;
    formData.append(
        'passportExpiryDate',
        passportExpiry && dayjs(passportExpiry).isValid() ? dayjs(passportExpiry).format('YYYY-MM-DD') : ''
    );
    if (passportDetails.file1 instanceof File) {
        formData.append('file1', passportDetails.file1);
        formData.append('fileName1', passportDetails.file1.name);
    }

    // Append nested voter card details
    formData.append('votarappDocId', voterDetails.appDocId);
    formData.append('voterCardName', voterDetails.voterCardName);
    formData.append('voterIdNo', voterDetails.voterIdNo);
    if (voterDetails.file2 instanceof File) {
        formData.append('file2', voterDetails.file2);
        formData.append('fileName2', voterDetails.file2.name);
    }

    // Append nested PAN card details
    formData.append('panappDocId', panDetails.appDocId);
    formData.append('panCardName', panDetails.panCardName);
    formData.append('incomeTaxPanNo', panDetails.incomeTaxPanNo);
    if (panDetails.file3 instanceof File) {
        formData.append('file3', panDetails.file3);
        formData.append('fileName3', panDetails.file3.name);
    }

    // Append nested professional details
    formData.append('capitalappDocId', basicDetailsFormValues.ProfessionalDetails.appDocId || '');
    formData.append('capitalName', basicDetailsFormValues.ProfessionalDetails.capitalName);
    formData.append('userName', basicDetailsFormValues.useName);
    formData.append('capital', basicDetailsFormValues.ProfessionalDetails.capital);
    const capitalFile = basicDetailsFormValues.ProfessionalDetails.file4;
    if (capitalFile instanceof File) {
        formData.append('file4', capitalFile);
        formData.append('fileName4', capitalFile.name);
    } else if (typeof capitalFile === 'string' && capitalFile.trim()) {
        formData.append('fileName4', capitalFile);
    }
    console.log(formData)
            // No errors, proceed with form submission
          
            const requestMethod = (basicDetailsFormValues.indivAdditionalDetailsId) 
            ? ApplicationForm.updateNewApplicationForm3 
            : ApplicationForm.addNewApplicationForm3;  
            requestMethod(formData)
                            .then((response) => {
        
                                 const { messageTitle, messageContent } = getStepSuccessAlert(
                                    appTypeMasterId,
                                    'financialDetails',
                                    !!basicDetailsFormValues.indivAdditionalDetailsId,
                                 );
                                 showAlert({
                                   messageTitle,
                                   messageContent,
                                     confirmText: 'Ok',
                                    onConfirm: () => { handleNext() }
                                 })
                             })
                            
                             .catch((err) => {
                                const errorAlert = getStepErrorAlert(appTypeMasterId, 'financialDetails', err);
                                 showAlert({
                                     messageTitle: errorAlert.messageTitle,
                                     messageContent: errorAlert.messageContent,
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

    const showIdCardDropdown = true;
    const selectedIdCard = basicDetailsFormValues.idCardType;
    const showPassportFields = selectedIdCard === 'passport';
    const showVoterFields = selectedIdCard === 'voter';
    const showPanFields = selectedIdCard === 'pan';

    return (
        <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={handleFormSubmit}>
            <Grid container spacing={2}>
                <Grid container>
                    <Grid item >
                        <Typography variant='h7' sx={{ mt: 1, mb: 1 }} ><b>Credit Card Details</b></Typography>
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
                    <Typography variant='h7'><b>ID Card Details</b></Typography>
                </Grid>
                <Grid item sx={{ mt: 2, mb: 1 }}>
                {formErrors.general && (
    <FormHelperText error>{formErrors.general}</FormHelperText>
)}

</Grid>
            </Grid>
            {showIdCardDropdown && (
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <InputLabel shrink={false} htmlFor="idCardType">
                            <Typography variant='body1'>ID Card Details<span className="req-asterisk">*</span></Typography>
                        </InputLabel>
                        <FormControl variant="outlined" size="small" sx={{ width: '100%', mt: 1 }} error={!!formErrors.idCardType}>
                            <Select
                                id="idCardType"
                                displayEmpty
                                name="idCardType"
                                value={selectedIdCard}
                                onChange={handleIdCardTypeChange}
                                disabled={!(isFieldEnabled("passportNo") || isFieldEnabled("voterIdNo") || isFieldEnabled("incomeTaxPanNo"))}
                            >
                                <MenuItem disabled value="">
                                    Select ID Card Details
                                </MenuItem>
                                {ID_CARD_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formErrors.idCardType && <FormHelperText sx={{ ml: 0 }} error>{formErrors.idCardType}</FormHelperText>}
                        </FormControl>
                    </Grid>
                </Grid>
            )}
            {showPassportFields && (
            <>
            <Grid container spacing={2}>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"passportNo"}>
                        <Typography variant='body1'>Passport No{showIdCardDropdown && <span className="req-asterisk">*</span>}</Typography>
                    </InputLabel>
                    <TextField
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
                        <Typography variant='body1'>Passport Issuing Authority{showIdCardDropdown && <span className="req-asterisk">*</span>}</Typography>
                    </InputLabel>
                    <TextField
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
            <Typography variant='body1'>Passport Expiry Date{showIdCardDropdown && <span className="req-asterisk">*</span>}</Typography>
        </InputLabel>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                id="passportExpiryDate"
                disablePast
                minDate={dayjs().add(1, 'day')}
                name="passportExpiryDate"
                disabled={!isFieldEnabled("passportExpiryDate")}
                onChange={(date) => handleDateChange('passportExpiryDate', date)}
                value={
                    basicDetailsFormValues.passportDetails.passportExpiryDate
                    && dayjs(basicDetailsFormValues.passportDetails.passportExpiryDate).isValid()
                        ? dayjs(basicDetailsFormValues.passportDetails.passportExpiryDate)
                        : null
                }
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
            <Typography variant='body1'>Upload Passport Document (Only PDF and Max allowed size 5 MB){showIdCardDropdown && <span className="req-asterisk">*</span>}</Typography>
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
            </>
            )}

            {showVoterFields && (
            <Grid container spacing={2}>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"firstName"}>
                        <Typography variant='body1'>Voter’s Identity Card No.{showIdCardDropdown && <span className="req-asterisk">*</span>}</Typography>
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
                        margin="dense"
                        inputProps={{ maxLength: 14 }}
                    />
                </Grid>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"pdffile"}>
                        <Typography variant='body1'>Upload ID Card Document (Only PDF and Max allowed size 5 MB){showIdCardDropdown && <span className="req-asterisk">*</span>}</Typography>
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
            )}
            {showPanFields && (
            <Grid container spacing={2}>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"incomTaxPanNo"}>
                        <Typography variant='body1'>Income Tax PAN No.{showIdCardDropdown && <span className="req-asterisk">*</span>}</Typography>
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
                        margin="dense"
                        value={basicDetailsFormValues.PanCardDetails.incomeTaxPanNo}
                        variant="outlined"
                        size='small'
                        inputProps={{ maxLength: 10 }}
                    />
                </Grid>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"pdffile"}>
                        <Typography variant='body1'>Upload Pan Document (Only PDF and Max allowed size 5 MB){showIdCardDropdown && <span className="req-asterisk">*</span>}</Typography>
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
            )}
            <Grid container>
                <Grid item sx={{ mt: 2, mb: 1 }}>
                    <Typography variant='h7' ><b>ISP Details<span className="req-asterisk">*</span></b></Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <InputLabel shrink={false} htmlFor={"ispName"}>
                        <Typography variant='body1'>ISP Name<span className="req-asterisk">*</span></Typography>
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
                <Grid item xs={12} sm={12}>
                    <InputLabel shrink={false} htmlFor={"webPageURL"}>
                        <Typography variant='body1'><b>Web Page URL</b></Typography>
                    </InputLabel>
                    <TextField
                        placeholder="https://www.example.com/"
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
                    <Typography variant='h7'> <b>Business Capital<span className="req-asterisk">*</span></b></Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"salutation"}>
                        <Typography variant='body1' >Capital in the business or profession<span className="req-asterisk">*</span></Typography>
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
                        <Typography variant='body1'>Upload Document<span className="req-asterisk">*</span>(Only PDF and Max allowed size 5 MB)</Typography>
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
            Note: <span className="req-asterisk">*</span> marked field are mandatory to be filled
        </Typography>
    </InputLabel>
</Grid>

        </Box>
    );
};

export default FinancialDetails;
