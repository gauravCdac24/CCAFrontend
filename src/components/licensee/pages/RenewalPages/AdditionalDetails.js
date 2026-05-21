import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, TextField, FormControl, InputLabel, MenuItem, Select, FormHelperText, FormControlLabel, Checkbox, RadioGroup, Radio, Button, ListItemText, OutlinedInput, ListSubheader } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import ApplicationForm from '../../../../service/NewLicenseService/ApplicationForm';
import showAlert from '../../../global/common/MessageBox/AlertService';
import { useSelector } from 'react-redux';
import SubServiceMaster from '../../../../service/AdminService/SubServiceMaster';
import validatePattern from '../../../global/util/ValidatePattern';
import ApplicationReview from '../../../../service/NewLicenseService/ApplicationReview';
import CheckboxTreeView from './CheckboxTreeView'

const errorMessages = {
  bankName: {
    blank: "Bank Name cannot be empty.",
    
  },
  branch: {
    blank: "Branch cannot be empty.",
    length: "The length of Branch must be between 1 and 30 characters."
  },
  accountType: {
    blank: "Account Type is required."
  },
  accountNo: {
    blank: "Account Number cannot be empty.",
    length: "The length of Account Number must be between 1 and 30 characters."
  },
  draftNo: {
    blank: "Draft Number cannot be empty."
  },
  amount: {
    blank: "Amount cannot be empty."
  },
  passportExpiryDate: {
    blank: "Passport Expiry Date cannot be empty."
  }
};



const AdditionalDetails = ({ handleNext, handleBack }) => {

  const bankNames = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
    "Kotak Mahindra Bank",
    "Bank of India",
    "IndusInd Bank",
    "Central Bank of India",
    "Indian Bank",
    "Indian Overseas Bank",
    "Bank of Maharashtra"
];

  const userName = useSelector((state)=>state.jwtAuthentication.username);
  const appTypeMasterId= useSelector((state)=>state.licenseApplication.applicationType);
  console.log(userName);
  console.log(appTypeMasterId);
    const AccountType = ["Saving", "Current", "Salary"];
  const [selectedOption, setSelectedOption] = useState('no');
  const [knownByOtherName, setKnownByOtherName] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [basicDetailsFormValues, setBasicDetailsFormValues] = useState({
    bankDetails: {
      bankDetailsId:'',
      bankName: '',
      branch: '',
      accountType: '',
      accountNo: '',
    },
    bankDraft: {
      bankDraftId:'',
      bankName: '',
      draftNo: '',
      issueDate: '',
      amount: '',
    },
    knownByOtherName: false,
    DSC: true,
    eSign: false,
    TimeStamp: false,
    SSL: false,
    userName:'',
  });


  useEffect(() => {
    if (userName) {
      setBasicDetailsFormValues((prevState) => ({
        ...prevState,
        userName: userName, // Only update when userName exists
      }));
    }
  }, [userName]);

  console.log("basic====>"+JSON.stringify(basicDetailsFormValues));


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

  const [servicesData, setServicesData] = useState([]);
  const [selectedDSCSubServices, setSelectedDSCSubServices] = useState([]);
  const [selectedESignSubServices, setSelectedESignSubServices] = useState([]);
  const [isESignSelected, setIsESignSelected] = useState(false);

  const getAllSubService = () => {
    setLoading(true);
    SubServiceMaster.getAllServiceList()
      .then((response) => {
        setServicesData(response.data);
      })
      .catch((err) => {
        console.error("Error fetching Service list:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllSubService();
  }, []);

  useEffect(() => {
    if (servicesData.length > 0) {
      const mandatoryDSCSubServices = servicesData
        .filter(service => service.serviceId.serviceTitle === "DSC" && service.isMandatory)
        .map(service => service.subServiceName);

      setSelectedDSCSubServices(mandatoryDSCSubServices);
    }
  }, [servicesData]);

  const handleESignChange = (event) => {
    const isChecked = event.target.checked;
    setIsESignSelected(isChecked);

    if (isChecked) {
      const eSignSubServices = servicesData
        .filter(service => service.serviceId.serviceTitle === "eSign")
        .map(service => service.subServiceName);

      setSelectedESignSubServices(eSignSubServices);
    } else {
      setSelectedESignSubServices([]); // Clear selection if eSign is unchecked
    }
  };

  const handleCheckboxChange = (event, subServiceName) => {
    const { checked } = event.target;

    if (checked) {
      setSelectedDSCSubServices(prevState => [...prevState, subServiceName]);
    } else {
      setSelectedDSCSubServices(prevState => prevState.filter(name => name !== subServiceName));
    }
  };

  useEffect(() => {
    if (userName) {
      console.log(userName);
      setLoading(true);
  
      ApplicationForm.getApplicationForm4ByUsername(userName)
        .then((response) => {
          console.log(response.data);
  
          // Assuming the structure of the response matches your state keys
          const {
            bankDetails,
            bankDraft,
            knownByOtherName,
            DSC,
            eSign,
            TimeStamp,
            SSL,
            userName,
          } = response.data;
  
          // Update state with API response
          setBasicDetailsFormValues((prevValues) => ({
            ...prevValues,
            bankDetails: {
              bankDetailsId:bankDetails?.bankDetailsId||'',
              bankName: bankDetails?.bankName || '',
              branch: bankDetails?.branchName	 || '',
              accountType: bankDetails?.bankAccountType	 || '',
              accountNo: bankDetails?.bankAccountNo	 || '',
              status:bankDetails?.status || '',
              created:bankDetails?.created||'',
              updated:bankDetails?.updated||'',
            },
            bankDraft: {
              bankDraftId:bankDraft?.bankDraftId||'',
              bankName: bankDraft?.bankName	 || '',
              draftNo: bankDraft?.draftNo	 || '',
              issueDate: bankDraft?.issueDate || null,
              amount: bankDraft?.amount	 || '',
              status:bankDraft?.status || '',
              created:bankDraft?.created||'',
              updated:bankDraft?.updated||'',
            },
            DSC: DSC || false,
            eSign: eSign || false,
            TimeStamp: TimeStamp || false,
            SSL: SSL || false,
           
          }));
  
          // Log updated state
          setTimeout(() => {
            console.log('Updated basicDetailsFormValues:', basicDetailsFormValues);
          }, 0);
        })
        .catch((err) => {
          console.log(err);
          // Handle error (e.g., navigate or display a message)
        })
        .finally(() => {
         // setLoading(false);
        });
    } else {
     
    }
  }, [userName]);


  useEffect(() => {
    // Check if any of the bank draft details are filled
    if (
      basicDetailsFormValues.bankDraft?.bankDraftId || 
      basicDetailsFormValues.bankDraft?.bankName || 
      basicDetailsFormValues.bankDraft?.draftNo || 
      basicDetailsFormValues.bankDraft?.amount || 
      basicDetailsFormValues.bankDraft?.issueDate
    ) {
      const newKnownByOtherName = 'yes';
      
     
      setKnownByOtherName(newKnownByOtherName);
      setSelectedOption(newKnownByOtherName)
     
      setBasicDetailsFormValues((prevState) => ({
        ...prevState,
        knownByOtherName: true,
      }));
    }
  }, [basicDetailsFormValues.bankDraft]); 
  
 
  const handleKnownByOtherNameChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    const newKnownByOtherName = selectedValue === 'yes';
    setKnownByOtherName(newKnownByOtherName);
    setBasicDetailsFormValues((prevState) => ({
      ...prevState,
      knownByOtherName: newKnownByOtherName,
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const namePath = name.split('.');
    setBasicDetailsFormValues((prevState) => {
      if (namePath.length === 2) {
        return {
          ...prevState,
          [namePath[0]]: {
            ...prevState[namePath[0]],
            [namePath[1]]: type === 'checkbox' ? checked : value
          }
        };
      }
      return {
        ...prevState,
        [name]: type === 'checkbox' ? checked : value,
      };
    });
  };

  const handleDateChange = (name, date) => {
    if (!dayjs(date).isValid()) {
      console.error('Invalid date:', date);
      return;
    }

    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setBasicDetailsFormValues((prevState) => ({
      ...prevState,
      bankDraft: {
        ...prevState.bankDraft,
        [name]: formattedDate,
      },
    }));
  };
  const [isLoading, setLoading] = useState(false);
  const validateForm = () => {
    const errors = {};

    // Bank Name validation
    if (!basicDetailsFormValues.bankDetails.bankName) {
      errors.bankName = errorMessages.bankName.blank;
    } 

    if (!basicDetailsFormValues.bankDetails.branch) {
      errors.branch = errorMessages.branch.blank;
    } else if (basicDetailsFormValues.bankDetails.branch.length < 1 || basicDetailsFormValues.bankDetails.branch.length > 30) {
      errors.branch = errorMessages.branch.length;
    }

    // Account Type validation
    if (!basicDetailsFormValues.bankDetails.accountType) {
      errors.accountType = errorMessages.accountType.blank;
    }

    // Account Number validation
    if (!basicDetailsFormValues.bankDetails.accountNo) {
      errors.accountNo = errorMessages.accountNo.blank;
    } else if (basicDetailsFormValues.bankDetails.accountNo.length < 1 || basicDetailsFormValues.bankDetails.accountNo.length > 30) {
      errors.accountNo = errorMessages.accountNo.length;
    }

    // Additional bank draft validation
    if (knownByOtherName) {
      if (!basicDetailsFormValues.bankDraft.bankName) {
        errors.bankDraftBankName = errorMessages.bankName.blank;
      }
      if (!basicDetailsFormValues.bankDraft.draftNo) {
        errors.draftNo = errorMessages.draftNo.blank;
      }
      if (!basicDetailsFormValues.bankDraft.amount) {
        errors.amount = errorMessages.amount.blank;
      }
      // if (!basicDetailsFormValues.bankDraft.issueDate) {
      //   errors.passportExpiryDate = errorMessages.passportExpiryDate.blank;
      // }
    }

    setFormErrors(errors);
    return errors;
  };
  console.log(basicDetailsFormValues)
  
       const handleFormSubmit = (e) => {
        e.preventDefault();

        console.log(basicDetailsFormValues)
        const errors = validateForm();
        console.log(errors)
        if (Object.keys(errors).length === 0) {
            setFormErrors({});
            setLoading(true);
            
            const requestMethod = (basicDetailsFormValues.bankDetails.bankDetailsId || basicDetailsFormValues.bankDraft.bankDraftId) ? ApplicationForm.updateNewApplicationForm4 : ApplicationForm.addNewApplicationForm4;


            requestMethod(basicDetailsFormValues)
                    .then((response) => {

                        
                       // handleFormDataChange({ addressDetails: JSON.stringify(response.data) });

                        showAlert({
                            messageTitle: 'SuccessFull',
                          messageContent: ` ${(basicDetailsFormValues.bankDetails.bankDetailsId || basicDetailsFormValues.bankDraft.bankDraftId) ? 'updated': 'saved' } successfully `,
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
            //     // Set form errors if validation fails
            setFormErrors(errors);
        }
    };
    

  //   const handleFormSubmit = (e) => {
  //     e.preventDefault();
  //             alert("next part");
  //             handleNext();    
  // };
  const handleBacks = () => {
    handleBack();
 }

  return (
    <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={handleFormSubmit}>
      <Grid container spacing={2}>
        <Grid container spacing={2}>
          <Grid container>
            <Grid item>
              <Typography variant='h7' sx={{ mt: 1, mb: 1 }}><b>Bank Details*</b></Typography>
            </Grid>
          </Grid>

          <Grid item xs={12} sm>
            <InputLabel shrink={false} htmlFor={"bankName"}>
              <Typography variant='body1'>Bank Name*</Typography>
            </InputLabel>
            {/* <TextField
              required
              id='bankName'
              placeholder="Bank Name"
              name='bankDetails.bankName'
              fullWidth
              margin="dense"
              variant="outlined"
              value={basicDetailsFormValues.bankDetails.bankName}
              onChange={handleChange}
              size='small'
              onKeyDown={(e) => validatePattern(e, /^[A-Za-z]+$/)}
              error={Boolean(formErrors.bankName)}
              helperText={formErrors.bankName}
              inputProps={{ maxLength: 75 }}
            /> */}


<FormControl variant="outlined" size="small" fullWidth margin="dense">
              <Select
                id="bankName"
                displayEmpty
                name="bankDetails.bankName"
                disabled={!isFieldEnabled("bankName")}
                value={basicDetailsFormValues.bankDetails.bankName}
                onChange={handleChange}
                error={Boolean(formErrors.bankName)}
              >
                <MenuItem disabled value="">
                  Bank Name
                </MenuItem>
                {bankNames.map((item, index) => (
                  <MenuItem key={index} value={item}>{item}</MenuItem>
                ))}
              </Select>
              {formErrors.bankName && <FormHelperText error>{formErrors.bankName}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm>
            <InputLabel shrink={false} htmlFor={"branch"}>
              <Typography variant='body1'>Branch*</Typography>
            </InputLabel>
            <TextField
              required
              id='branch'
              placeholder="Branch"
              name='bankDetails.branch'
              fullWidth
              disabled={!isFieldEnabled("branchName")}
              margin="dense"
              variant="outlined"
              value={basicDetailsFormValues.bankDetails.branch}
              onChange={handleChange}
              size='small'
              onKeyDown={(e) => validatePattern(e, /^[A-Za-z]+$/)}
              error={Boolean(formErrors.branch)}
              helperText={formErrors.branch}
              inputProps={{ maxLength: 50 }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} sm>
            <InputLabel shrink={false} htmlFor={"accountType"}>
              <Typography variant='body1'>Account Type*</Typography>
            </InputLabel>
            <FormControl variant="outlined" size="small" fullWidth margin="dense">
              <Select
                id="accountType"
                displayEmpty
                name="bankDetails.accountType"
                disabled={!isFieldEnabled("bankAccountType")}
                value={basicDetailsFormValues.bankDetails.accountType}
                onChange={handleChange}
                error={Boolean(formErrors.accountType)}
              >
                <MenuItem disabled value="">
                  Account Type
                </MenuItem>
                {AccountType.map((item, index) => (
                  <MenuItem key={index} value={item}>{item}</MenuItem>
                ))}
              </Select>
              {formErrors.accountType && <FormHelperText error>{formErrors.accountType}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm>
            <InputLabel shrink={false} htmlFor={"accountNo"}>
              <Typography variant='body1'>Account Number*</Typography>
            </InputLabel>
            <TextField
              required
              id='accountNo'
              placeholder="Account Number"
              name='bankDetails.accountNo'
              fullWidth
              disabled={!isFieldEnabled("bankAccountNo")}
              margin="dense"
              onKeyDown={(e) => validatePattern(e, /^[0-9]+$/)}
              variant="outlined"
              value={basicDetailsFormValues.bankDetails.accountNo}
              onChange={handleChange}
              error={Boolean(formErrors.accountNo)}
              helperText={formErrors.accountNo}
              size='small'
              inputProps={{ maxLength: 18 }}
            />
          </Grid>
        </Grid>

        <Grid item xs={12}>
  <Box display="flex" alignItems="center">
    <Typography variant="body1">Have you ever used a Bank Draft?</Typography>
    <RadioGroup
      row
      value={selectedOption}
      onChange={handleKnownByOtherNameChange} // Make sure this updates `knownByOtherName`
      sx={{ ml: 2 }}
    >
      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
      <FormControlLabel value="no" control={<Radio />} label="No" />
    </RadioGroup>
  </Box>
</Grid>


{knownByOtherName  && (
  <>
  <Grid container spacing={2}>
            <Grid item xs={12} sm>
              <InputLabel shrink={false} htmlFor={"bankName"}>
                <Typography variant='body1'>Bank Name*</Typography>
              </InputLabel>
              {/* <TextField
                required
                id='bankDraftBankName'
                placeholder="Bank Name"
                name='bankDraft.bankName'
                fullWidth
                margin="dense"
                variant="outlined"
                onKeyDown={(e) => validatePattern(e, /^[A-Za-z]+$/)}
                value={basicDetailsFormValues.bankDraft.bankName || ''} // Ensure non-null value
                onChange={handleChange}
                error={Boolean(formErrors.bankDraft?.bankName)}
                helperText={formErrors.bankDraft?.bankName}
                size='small'
                inputProps={{ maxLength: 75 }} /> */}
                <FormControl variant="outlined" size="small" fullWidth margin="dense">
              <Select
                id="bankDraftBankName"
                displayEmpty
                name="bankDraft.bankName"
                value={basicDetailsFormValues.bankDraft.bankName || ''}
                onChange={handleChange}
                disabled={!isFieldEnabled("bankDraft.bankName")}
                error={Boolean(formErrors.bankDraft?.bankName)}
              >
                <MenuItem disabled value="">
                  Bank Name
                </MenuItem>
                {bankNames.map((item, index) => (
                  <MenuItem key={index} value={item}>{item}</MenuItem>
                ))}
              </Select>
              {formErrors.bankDraft?.bankName && <FormHelperText error>{formErrors.bankDraft?.bankName}</FormHelperText>}
            </FormControl>
            </Grid>


            <Grid item xs={12} sm>
              <InputLabel shrink={false} htmlFor={"draftNo"}>
                <Typography variant='body1'>Draft No.*</Typography>
              </InputLabel>
              <TextField
                required
                id='draftNo'
                placeholder="Draft No."
                name='bankDraft.draftNo'
                fullWidth
                margin="dense"
                variant="outlined"
                disabled={!isFieldEnabled("bankDraft.draftNo")}
                onKeyDown={(e) => validatePattern(e, /^[A-Za-z0-9]+$/)}
                value={basicDetailsFormValues.bankDraft.draftNo || ''}
                onChange={handleChange}
                error={Boolean(formErrors.bankDraft?.draftNo)}
                helperText={formErrors.bankDraft?.draftNo}
                size='small'   inputProps={{ maxLength: 10 }}/>
            </Grid>
          </Grid><Grid container spacing={2}>
              <Grid item xs={12} sm>
                <InputLabel shrink={false} htmlFor={"amount"}>
                  <Typography variant='body1'>Amount*</Typography>
                </InputLabel>
                <TextField
                  required
                  id='amount'
                  placeholder="Amount"
                  name='bankDraft.amount'
                  fullWidth
                  disabled={!isFieldEnabled("bankDraft.amount")}
                  margin="dense"
                  variant="outlined"
                  onKeyDown={(e) => validatePattern(e, /^[0-9]+$/)}
                  value={basicDetailsFormValues.bankDraft.amount || ''}
                  onChange={handleChange}
                  error={Boolean(formErrors.bankDraft?.amount)}
                  helperText={formErrors.bankDraft?.amount}
                  size='small'  inputProps={{ maxLength: 6 }} />
              </Grid>

              <Grid item xs={12} sm>
                <InputLabel shrink={false} htmlFor={"issueDate"}>
                  <Typography variant='body1'>Issue Date*</Typography>
                </InputLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    id="issueDate"
                    disableFuture
                    name="bankDraft.issueDate"
                    maxDate={dayjs()}
                    disabled={!isFieldEnabled("bankDraft.issueDate")}
                    placeholder="Issue Date"
                    onChange={(date) => handleDateChange('issueDate', date)}
                    value={basicDetailsFormValues.bankDraft.issueDate ? dayjs(basicDetailsFormValues.bankDraft.issueDate) : null}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        placeholder: "Issue Date",
                        error: Boolean(formErrors.bankDraft?.issueDate),
                        helperText: formErrors.bankDraft?.issueDate || ''
                      }
                    }}
                    sx={{ mt: 1 }} />
                </LocalizationProvider>
              </Grid>
            </Grid>
            </>
)}


<CheckboxTreeView />

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
       
    </InputLabel>
</Grid>
    </Box>
  );
};

export default AdditionalDetails;
