import React, { useEffect, useState } from 'react';
import { Grid, TextField, Typography, MenuItem, FormControl, InputLabel, Select, Box, Button, Tooltip } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import ValidatePattern from '../../../global/util/ValidatePattern';
import FirmApplicationForm from '../../../../service/NewLicenseService/FirmApplicationForm';
import showAlert from '../../../global/common/MessageBox/AlertService';
import { useSelector } from 'react-redux';
import { json } from 'react-router-dom';
import ApplicationReview from '../../../../service/NewLicenseService/ApplicationReview';

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
const NUMBER2TEXT = {
    ones: ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'],
    tens: ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'],
    sep: ['', ' Thousand ', ' Million ', ' Billion ', ' Trillion ', ' Quadrillion ', ' Quintillion ', ' Sextillion ']
};

// Convert number to words
const numberToWords = (num) => {
    const { ones, tens, sep } = NUMBER2TEXT;
    let arr = [], str = '', i = 0;

    if (num === 0) return 'Zero';

    while (num) {
        arr.push(num % 1000);
        num = Math.floor(num / 1000);
    }

    while (arr.length) {
        str = (function (a) {
            const x = Math.floor(a / 100),
                y = Math.floor(a / 10) % 10,
                z = a % 10;

            return (x > 0 ? ones[x] + ' Hundred ' : '') +
                (y >= 2 ? tens[y] + ' ' + ones[z] : ones[10 * y + z]);
        })(arr.shift()) + sep[i++] + str;
    }

    return str.trim();
};

const errorMessages = {
    turnOver: {
        blank: 'Please enter the Turnover.',
        format: 'Turnover must be a positive number.',
    },
    incomTaxPanNo: {
        blank: 'Please enter the Income Tax PAN No.',
        format: 'Invalid PAN format. The correct format is 5 letters followed by 4 digits and 1 letter (e.g., ABCDE1234F).',
    },
    paidUpCapital: {
        blank: 'Please enter the Paid-up Capital.',
        format: 'Paid-up Capital must be a positive number.',
        maxLength: 'Paid-up capital must be less than or equal to 5 crores.',

    },
    netWorth: {
        blank: 'Please enter the Net Worth.',
        format: 'Net Worth must be a positive number.',
        maxLength: 'Net worth must be greater than or equal to 50 crores.',

    },
    insurerCompany: {
        blank: 'Please enter the Insurer Company.',
    },
    policyNo: {
        blank: 'Please enter the Policy No.',
    },
    file1: {
        blank: 'Please upload the required File',
        invalidType: 'File must be a PDF',
        maxSize: 'File cannot be larger than 5MB'
    },
    file2: {
        blank: 'Please upload the required File',
        invalidType: 'File must be a PDF',
        maxSize: 'File cannot be larger than 5MB'
    },
    file3: {
        blank: 'Please upload the required File',
        invalidType: 'File must be a PDF',
        maxSize: 'File cannot be larger than 5MB'
    },
};




const IncomeTaxDocumentDetails = ({ handleNext, handleBack }) => {
    const [passportExpiryDate, setPassportExpiryDate] = React.useState(null);
    const CardType = ["Visa", "MasterCard", "Amex"]
    const [ispUserName, setIspUserName] = useState('');
    const [output, setOutput] = useState('Please type a number into the text-box.');
    const [fileInputKey, setFileInputKey] = useState(Date.now());
    const [fileName, setFileName] = useState('');
    const [fileInputKey3, setFileInputKey3] = useState(Date.now());
    const [fileName3, setFileName3] = useState('');
    const [fileInputKey2, setFileInputKey2] = useState(Date.now());
    const [fileName2, setFileName2] = useState('');
    const userName = useSelector((state) => state.jwtAuthentication.username);
    const appTypeMasterId = useSelector((state) => state.licenseApplication.applicationType);
    console.log(userName);
    console.log(appTypeMasterId);

    useEffect(() => {

        setBasicDetailsFormValues((prevState) => ({
            ...prevState,
            userName: userName || '',
            appTypeMasterId: appTypeMasterId || '',
        }));
    }, [userName, appTypeMasterId]);
    const [basicDetailsFormValues, setBasicDetailsFormValues] = useState({
        turnOver: '',
        incomTaxPanNo: '',
        paidUpCapital: '',
        netWorth: '',
        insurerCompany: '',
        policyNo: '',
        file1: '',
        file2: '',
        file3: '',
        userName: userName, 
        firmApplicationId: '',
        intentId: '',
        appDocId: '',  
    });
    useEffect(() => {
        if (userName) {
            setLoading(true);
    
            FirmApplicationForm.getAllFirmApplication2(userName)
                .then((response) => {
                    const { appFirmApplication, applicationDocuments, fileNames } = response.data;
    
                  
                    const newFormValues = {
                        turnOver: appFirmApplication.firmTurnover || '',
                        incomTaxPanNo: appFirmApplication.pan || '',
                        paidUpCapital: appFirmApplication.paidUpCapital || '',
                        netWorth: appFirmApplication.firmNetWorth || '',
                        insurerCompany: appFirmApplication.insuranceCompany || '',
                        policyNo: appFirmApplication.insurancePolicyNo || '',
                        file1: '',
                        file2: '',
                        file3: '',
                        userName: appFirmApplication.createdBy || userName, // Preserving the userName from appFirmApplication
                        firmApplicationId: appFirmApplication.firmApplicationId || '',
                        intentId: appFirmApplication.intentAppId || '',
                      
                    };
    
                    // Map through applicationDocuments and set document-specific fields dynamically
                    applicationDocuments.forEach((doc, index) => {
                        if (index === 0) {
                            newFormValues.file1 = doc.fileName || '';
                        } else if (index === 1) {
                            newFormValues.file2 = doc.fileName || '';
                        } else if (index === 2) {
                            newFormValues.file3 = doc.fileName || '';
                        }
                        // You can also set appDocId per document if needed
                        newFormValues[`appDocId${index + 1}`] = doc.appDocId || '';
                    });
    
                    // Update the form state
                    setBasicDetailsFormValues(newFormValues);
                    setFileName(applicationDocuments[0]?.fileName || '');  // fileName for the first document
                    setFileName2(applicationDocuments[1]?.fileName || ''); // fileName for the second document
                    setFileName3(applicationDocuments[2]?.fileName || ''); // fileName for the third document
                
                    // If needed, handle the number conversion
                    setOutput(numberToWords(appFirmApplication.firmTurnover));
                    setOutput1(numberToWords(appFirmApplication.firmNetWorth));
                    setOutput2(numberToWords(appFirmApplication.paidUpCapital));
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
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

    console.log("console===>" + JSON.stringify(fileName))
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Remove non-numeric characters
        const numericValue = value.replace(/[^0-9]/g, '');

        // Update the basicDetailsFormValues with the cleaned numeric value
        setBasicDetailsFormValues((prevValues) => ({
            ...prevValues,
            [name]: numericValue,
        }));

        // Update output to show the numeric value in Rs. format
        if (numericValue === '') {
            setOutput('Please type a number into the text-box.');
        } else {
            const num = parseInt(numericValue, 10);
            if (isNaN(num)) {
                setOutput('Invalid input.');
            } else {
                setOutput(numberToWords(num));
            }
        }
    };


    const handleInputChanges = (e) => {
        const { name, value } = e.target;

        // Update the state for the specific input
        setBasicDetailsFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const [ispUserName1, setIspUserName1] = useState('');
    const [output1, setOutput1] = useState('Please type a number into the text-box.');

    const handleInputChange1 = (e) => {
        const { name, value } = e.target;

        // Remove non-numeric characters
        const numericValue = value.replace(/[^0-9]/g, '');

        // Update the state for the specific input
        setIspUserName1(numericValue);

        // Update the basicDetailsFormValues with the cleaned numeric value
        setBasicDetailsFormValues((prevValues) => ({
            ...prevValues,
            [name]: numericValue,
        }));

        // Handle output based on the numeric value
        if (numericValue === '') {
            setOutput1('Please type a number into the text-box.');
        } else {
            const num = parseInt(numericValue, 10);
            if (isNaN(num)) {
                setOutput1('Invalid input.');
            } else {
                // Convert the number to words (assuming you have a function `numberToWords`)
                setOutput1(numberToWords(num));
            }
        }
    };

    const [ispUserName2, setIspUserName2] = useState('');
    const [output2, setOutput2] = useState('Please type a number into the text-box.');

    const handleInputChange2 = (e) => {
        const { name, value } = e.target;

        // Remove non-numeric characters
        const numericValue = value.replace(/[^0-9]/g, '');

        // Update the state for the specific input
        setIspUserName2(numericValue);

        // Update the basicDetailsFormValues with the cleaned numeric value
        setBasicDetailsFormValues((prevValues) => ({
            ...prevValues,
            [name]: numericValue,
        }));

        // Handle output based on the numeric value
        if (numericValue === '') {
            setOutput2('Please type a number into the text-box.');
        } else {
            const num = parseInt(numericValue, 10);
            if (isNaN(num)) {
                setOutput2('Invalid input.');
            } else {
                // Convert the number to words (assuming you have a function `numberToWords`)
                setOutput2(numberToWords(num));
            }
        }
    };

    const [formErrors, setFormErrors] = useState({});

    // Form validation function
    const validateForm = () => {
        let errors = {};

        // Turnover: Required and must be a positive number
        if (!basicDetailsFormValues.turnOver) {
            errors.turnOver = errorMessages.turnOver.blank;
        } else if (isNaN(basicDetailsFormValues.turnOver) || Number(basicDetailsFormValues.turnOver) <= 0) {
            errors.turnOver = errorMessages.turnOver.format;
        }

        // Income Tax PAN No.: Required and must follow the specific format
        if (!basicDetailsFormValues.incomTaxPanNo) {
            errors.incomTaxPanNo = errorMessages.incomTaxPanNo.blank;
        } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(basicDetailsFormValues.incomTaxPanNo)) {
            errors.incomTaxPanNo = errorMessages.incomTaxPanNo.format;
        }

        // Paid-up Capital: Required and must be a positive number
        if (!basicDetailsFormValues.paidUpCapital) {
            errors.paidUpCapital = errorMessages.paidUpCapital.blank;
        } else if (isNaN(basicDetailsFormValues.paidUpCapital) || Number(basicDetailsFormValues.paidUpCapital) <= 0) {
            errors.paidUpCapital = errorMessages.paidUpCapital.format;
        }else if (Number(basicDetailsFormValues.paidUpCapital) >= 50000000) {
            errors.paidUpCapital = errorMessages.paidUpCapital.maxLength;
        }

        // Net Worth: Required and must be a positive number
        if (!basicDetailsFormValues.netWorth) {
            errors.netWorth = errorMessages.netWorth.blank;
        } else if (isNaN(basicDetailsFormValues.netWorth) || Number(basicDetailsFormValues.netWorth) <= 0) {
            errors.netWorth = errorMessages.netWorth.format;
        } else if (Number(basicDetailsFormValues.netWorth) <= 500000000) {
            errors.netWorth = errorMessages.netWorth.maxLength;
        }

        // Insurer Company: Required
        if (!basicDetailsFormValues.insurerCompany) {
            errors.insurerCompany = errorMessages.insurerCompany.blank;
        }

        // Policy No.: Required
        if (!basicDetailsFormValues.policyNo) {
            errors.policyNo = errorMessages.policyNo.blank;
        }

       // Check file1
if (!basicDetailsFormValues.file1) {
    errors.file1 = errorMessages.file1.blank;
}


// Check file2
if (!basicDetailsFormValues.file2) {
    errors.file2 = errorMessages.file2.blank;
}

// Check file3
if (!basicDetailsFormValues.file3) {
    errors.file3 = errorMessages.file3.blank;
}


        setFormErrors(errors);

        // Return true if there are no errors, otherwise false
        return errors;
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
    
        // Validate file type and size
        if (file) {
            if (file.type !== 'application/pdf') {
                alert('File must be a PDF');
                return; // Stop further processing if invalid type
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB in bytes
                alert('File cannot be larger than 5MB');
                return; // Stop further processing if file size is too large
            }
        }
    
        // Update form state
        setBasicDetailsFormValues({
            ...basicDetailsFormValues,
            file1: file
        });
    
        // Update file name
        setFileName(file ? file.name : '');
    };
    
    const handleFileChange3 = (e) => {
        const file = e.target.files[0];
    
        // Validate file type and size
        if (file) {
            if (file.type !== 'application/pdf') {
                alert('File must be a PDF');
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB in bytes
                alert('File cannot be larger than 5MB');
                return;
            }
        }
    
        // Update form state
        setBasicDetailsFormValues(prevValues => ({
            ...prevValues,
            file3: file
        }));
    
        // Update file name
        setFileName3(file ? file.name : '');
    };
    
    const handleFileChange2 = (e) => {
        const file = e.target.files[0];
    
        // Validate file type and size
        if (file) {
            if (file.type !== 'application/pdf') {
                alert('File must be a PDF');
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB in bytes
                alert('File cannot be larger than 5MB');
                return;
            }
        }
    
        // Update form state
        setBasicDetailsFormValues({
            ...basicDetailsFormValues,
            file2: file
        });
    
        // Update file name
        setFileName2(file ? file.name : '');
    };
    
    const handleBacks = () => {
        handleBack();
    }
    const [isLoading, setLoading] = useState(false);

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            console.log('Validation errors:', errors);
            // Optionally, you can set the errors in state to display them in the UI
            setFormErrors(errors);
        } else {
            const formData = new FormData();

            // Append each field to the formData object
            formData.append('turnOver', basicDetailsFormValues.turnOver);
            formData.append('incomTaxPanNo', basicDetailsFormValues.incomTaxPanNo);
            formData.append('paidUpCapital', basicDetailsFormValues.paidUpCapital);
            formData.append('netWorth', basicDetailsFormValues.netWorth);
            formData.append('insurerCompany', basicDetailsFormValues.insurerCompany);
            formData.append('policyNo', basicDetailsFormValues.policyNo);
            
            // Append files if they are present
            if (basicDetailsFormValues.file1) {
                formData.append('file1', basicDetailsFormValues.file1);
            }
            if (basicDetailsFormValues.file2) {
                formData.append('file2', basicDetailsFormValues.file2);
            }
            if (basicDetailsFormValues.file3) {
                formData.append('file3', basicDetailsFormValues.file3);
            }
            
            formData.append('userName',userName);
            formData.append('firmApplicationId', basicDetailsFormValues.firmApplicationId);
            formData.append('intentId', basicDetailsFormValues.intentId);
            formData.append('appDocId', basicDetailsFormValues.appDocId);
            console.log('Form is valid, proceed with submission.' +JSON.stringify( basicDetailsFormValues));
            console.log('Form is valid, proceed with submission.' + JSON.stringify(formData));
            const requestMethod =basicDetailsFormValues.firmApplicationId? FirmApplicationForm.updateFirmApplication2 :FirmApplicationForm.addNewFirmApplication2;
           //const requestMethod = FirmApplicationForm.addNewFirmApplication2
            requestMethod(formData)
                .then((response) => {
                 
                    showAlert({
                        messageTitle: 'Successful',
                        messageContent: 'first page saved successfully',
                        confirmText: 'Ok',
                        onConfirm: () => { handleNext(); }
                    });
                })
                .catch((err) => {
                    showAlert({
                        messageTitle: 'Error',
                        messageContent: err.response?.data
                            ? typeof err.response.data === 'object'
                                ? 'Your request cannot be processed at this time. Please try again later.'
                                : err.response.data
                            : 'Your request cannot be processed at this time. Please try again later.',
                        confirmText: 'Ok',
                    });
                })
                .finally(() => {
                    setLoading(false);
                });

        }

    
    };


    return (
        <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={handleFormSubmit}>
            <Grid container>
                <Grid item sx={{ mt: 2, mb: 1 }}>
                    <Typography variant='h7'> <b>Income Tax PAN No.(21)</b></Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"incomTaxPanNo"}>
                        <Typography variant='body1'>Income Tax PAN No.*</Typography>
                    </InputLabel>
                    <TextField
                        required
                        id='incomTaxPanNo'
                        name='incomTaxPanNo'
                        placeholder="Income Tax PAN No."
                        fullWidth
                        variant="outlined"
                        value={basicDetailsFormValues.incomTaxPanNo}
                        size='small'
                        error={!!(formErrors.incomTaxPanNo && formErrors.incomTaxPanNo)}
                        helperText={formErrors?.incomTaxPanNo}
                        inputProps={{ maxLength: 10 }}
                        disabled={!isFieldEnabled("")}
                        onKeyDown={(e) => ValidatePattern(e, /^[0-9A-Z]+$/)}
                        onChange={handleInputChanges}
                    />
                </Grid>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"pdffile"}>
                        <Typography variant='body1'>Upload Pan Document (Only PDF and Max allowed size 5 MB)*</Typography>
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
                                    key={fileInputKey}
                                    type="file"
                                    name="file"
                                    disabled={!isFieldEnabled("firmPanCardDocument")}
                                    onChange={handleFileChange}
                                />
                            </Button>

                        </Grid>
                        <Grid item xs sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                    {formErrors.file1 && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {formErrors.file1}
                        </Typography>
                    )}


                </Grid>

            </Grid>
            <Grid container>
                <Grid item sx={{ mt: 2, mb: 1 }}>
                    <Typography variant='h7'> <b>Turnover in the last Financial Year(22)</b></Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"turnOver"}>
                        <Typography variant='body1'>Turnover in the last Financial Year*</Typography>
                    </InputLabel>
                    <TextField
                        required
                        placeholder="TurnOver in the last Financial Year"
                        fullWidth
                        variant="outlined"
                        size='small'
                        name='turnOver'
                        id='turnOver'
                        margin='dense'
                        value={basicDetailsFormValues.turnOver}
                        inputProps={{ maxLength: 16 }}
                        onKeyDown={(e) => ValidatePattern(e, /^[0-9]+$/)}
                        error={!!(formErrors.turnOver && formErrors.turnOver)}
                        helperText={formErrors?.turnOver}
                        onChange={handleInputChange}
                        disabled={!isFieldEnabled("turnover")}
                    />
                </Grid>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"output"}>
                        <Typography variant='body1' style={{ whiteSpace: 'nowrap' }}>
                            <strong>Rs.</strong> {output}{/* Displaying the output value */}
                        </Typography>
                    </InputLabel>
                </Grid>
            </Grid>

            <Grid container>
                <Grid item sx={{ mt: 2, mb: 1 }}>
                    <Typography variant='h7'> <b>Net Worth(23)</b></Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"netWorth"}>
                        <Typography variant='body1'>Net Worth*Rs.</Typography>
                    </InputLabel>
                    <TextField
                        required
                        placeholder="Net worth"
                        fullWidth
                        variant="outlined"
                        size='small'
                        name='netWorth'
                        value={basicDetailsFormValues.netWorth}
                        onKeyDown={(e) => ValidatePattern(e, /^[0-9]+$/)}
                        id='netWorth'
                        margin='dense'
                        error={!!(formErrors.netWorth && formErrors.netWorth)}
                        helperText={formErrors?.netWorth}
                        onChange={handleInputChange1}
                        //disabled={!isFieldEnabled("turnover")}
                    />
                </Grid>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"output"}>
                        <Typography variant='body1' style={{ whiteSpace: 'nowrap' }}>
                            <strong>Rs.</strong> {output1}
                        </Typography>
                    </InputLabel>
                </Grid>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"netWorthDoc"}>
                        <Typography variant='body1'>Upload Net Worth Document (Only PDF and Max allowed size 5 MB)*</Typography>
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
                                    disabled={!isFieldEnabled("firmNetWorthDocument")}
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
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {formErrors.file3}
                        </Typography>
                    )}


                </Grid>
            </Grid>
            <Grid container>
                <Grid item sx={{ mt: 2, mb: 1 }}>
                    <Typography variant='h7'> <b>Paid up Capital(24)</b></Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"paidUpCapital"}>
                        <Typography variant='body1'>Paid up Capital*Rs.</Typography>
                    </InputLabel>
                    <TextField
                        required
                        placeholder="Paid up Capital"
                        fullWidth
                        variant="outlined"
                        size='small'
                        value={basicDetailsFormValues.paidUpCapital}
                        name='paidUpCapital'
                        id='paidUpCapital'
                        inputProps={{ maxLength: 16 }}
                        onKeyDown={(e) => ValidatePattern(e, /^[0-9]+$/)}
                        margin='dense'
                        error={!!(formErrors.paidUpCapital && formErrors.paidUpCapital)}
                        helperText={formErrors?.paidUpCapital}
                        onChange={handleInputChange2}
                    />
                </Grid>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"output"}>
                        <Typography variant='body1' style={{ whiteSpace: 'nowrap' }}>
                            <strong>Rs.</strong> {output2}
                        </Typography>
                    </InputLabel>
                </Grid>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"paidUpCapDoc"}>
                        <Typography variant='body1'>Upload Paid up Capital Document (Only PDF and Max allowed size 5 MB)*</Typography>
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
                                    disabled={!isFieldEnabled("firmPaidUpCapitalDocument")}
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
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {formErrors.file2}
                        </Typography>
                    )}

                </Grid>
            </Grid>
            <Grid container>
                <Grid item sx={{ mt: 2, mb: 1 }}>
                    <Typography variant='h7'> <b>Insurence Details*(25)</b></Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"policyNo"}>
                        <Typography variant='body1' >Insurence Policy No.*</Typography>
                    </InputLabel>
                    <TextField
                        required
                        placeholder="Insurence Policy No."
                        fullWidth
                        variant="outlined"
                        size='small'
                        name='policyNo'
                        value={basicDetailsFormValues.policyNo}
                        onChange={handleInputChanges}
                        error={!!(formErrors.policyNo && formErrors.policyNo)}
                        helperText={formErrors?.policyNo}
                        inputProps={{ maxLength: 16 }}
                        onKeyDown={(e) => ValidatePattern(e, /^[0-9A-Za-z]+$/)}
                        id='policyNo'
                        disabled={!isFieldEnabled("insurancePolicyNo")}
                        margin='dense'
                    />
                </Grid>
                <Grid item xs={12} sm>
                    <InputLabel shrink={false} htmlFor={"insurerCompany"}>
                        <Typography variant='body1'>Insurer Company*</Typography>
                    </InputLabel>
                    <TextField
                        required
                        placeholder="Insurer Company"
                        fullWidth
                        variant="outlined"
                        value={basicDetailsFormValues.insurerCompany}
                        size='small'
                        onChange={handleInputChanges}
                        onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z.]+$/)}
                        name='insurerCompany'
                        error={!!(formErrors.insurerCompany && formErrors.insurerCompany)}
                        helperText={formErrors?.insurerCompany}
                        inputProps={{ maxLength: 75 }}
                        id='insurerCompany'
                        disabled={!isFieldEnabled("insuranceCompany")}
                        margin='dense'
                    />

                </Grid>

            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, ml: 1 }}>
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
            <Grid>
            <InputLabel shrink={false} >
                        <Typography variant='body1'>Note: * marked field are mandatory to be filled </Typography>
                    </InputLabel>
            </Grid>
        </Box>
    );
};

export default IncomeTaxDocumentDetails;
