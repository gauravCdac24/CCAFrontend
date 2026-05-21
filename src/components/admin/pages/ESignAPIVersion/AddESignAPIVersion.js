import React, {useEffect, useState} from 'react';
import { Box, Grid, Button, Typography, InputLabel, FormHelperText, Tooltip, TextField, MenuItem, Select, FormControl } from '@mui/material';
import Captcha from '../../../global/util/Captcha';
import LoaderProgress from '../../../global/common/LoaderProgress';
import showAlert from '../../../global/common/MessageBox/AlertService';
import FormWrapper from '../../../global/util/FormWrapper';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; 
import { styled } from '@mui/material/styles';
import ESignAPIVersionMasterService from '../../../../service/AdminService/ESignAPIVersionMasterService';
import EsignAPISpecificationService from '../../../../service/AdminService/EsignAPISpecificationService';
import ValidatePattern from '../../../global/util/ValidatePattern';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

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
        blank: "Please upload eSign API Specifications document.",
        size: "The file size must not exceed 5MB. Please upload a smaller file.",
        format: "Only Pdf file is allowed."
    },

    releaseDate: {
        blank: "Please select release date.",
    },

    esignApiSpecId: {
        blank: "Please select eSign API Specification date.",
    },

    apiVersion: {
        blank: "Please enter API Version name.",
        length: "The length must be between 3 and 150 characters.",
        format: "Only alphabets, numbers, dot and space are allowed."
    },


    captchaError: {
        blank: "Please enter captcha."
    },
};

const AddEsignAPIVersion = () => {
    const [apiVerForm, setAPIVerForm] = useState({
        esignApiSpecId:'',
        apiVersion: '',
        releaseDate: '',
        espReadinessBy: '',
        deprecationDate: '',
    });
 
    const [verfile, setVerFile] = useState('');
    const [fileName, setFileName] = useState('')
    const [fileKey, setFileKey] = useState(Date.now());
    const [formErrors, setFormErrors] = useState({});
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [specificationList, setSpecificationList] = useState([]);
    
    const navigate = useNavigate();
    const rolePath = useSelector((state) => state.jwtAuthentication.rolePath);

    const getAllEsignSpecification = () => {

        setLoading(true);

        EsignAPISpecificationService.getAllAPISpecification()
        .then((response)=>{
            setSpecificationList(response.data);
        })
        .catch((err)=>{

        })
        .finally(()=>{
            setLoading(false);
        })

    }

    useEffect(()=>{
        getAllEsignSpecification();
    },[])

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        setVerFile(file);

        setFileName(file ? file.name : '');

    };

    const validateFile = (errors) => {

        if (verfile) {

            const allowedExtensions = /(\.pdf|\.PDF)$/i;
            if (!allowedExtensions.exec(verfile.name)) {
                errors.file = errorMsg.file.format;
            }

            const maxSize = 5*1024*1024;

            if (verfile.size > maxSize) {
                errors.file = errorMsg.file.size;
            }
        } else {
            errors.file = errorMsg.file.blank;
        }

    };
   
    const handleReset = () => {
        setAPIVerForm({
            esignApiSpecId:'',
            apiVersion: '',
            releaseDate: '',
            espReadinessBy: '',
            deprecationDate: '',
        });

        setFileName('');
        setVerFile('');

        setCaptchaInput('');
        setFormErrors({});
    }


    const validateForm = () => {
        const errors = {};
    
        validateFile(errors);


        if (!apiVerForm.apiVersion) {
            errors.apiVersion = errorMsg.apiVersion.blank;
        } else if (apiVerForm.apiVersion.length < 3 || apiVerForm.apiVersion.length > 150) {
            errors.apiVersion = errorMsg.apiVersion.length;
        } else if (!/^[A-Za-z0-9. ]+$/.test(apiVerForm.apiVersion)) {
            errors.apiVersion = errorMsg.apiVersion.format;
        }

        if (!apiVerForm.releaseDate) {
            errors.releaseDate = errorMsg.releaseDate.blank;
        } 

        if (!apiVerForm.esignApiSpecId) {
            errors.esignApiSpecId = errorMsg.esignApiSpecId.blank;
        }

        if (!captchaInput) {
            errors.captcha = errorMsg.captchaError.blank;
        }
    
        return errors;
    };


    const handleFormSubmit = (e) => {
        e.preventDefault();

        const errors = validateForm();

        if (Object.keys(errors).length === 0) {
            setFormErrors({});
            // Submit form

            if(captchaInput === captchaText){

                setLoading(true);

                //Save
                ESignAPIVersionMasterService.addNewAPIVersion(apiVerForm, verfile)
                .then((response)=>{

                    showAlert({
                        messageTitle: 'Add API Version',
                        messageContent: response.data,
                        confirmText: 'Ok',
                        onConfirm: () => {navigate(`${rolePath}/apiversion`)},
                        enableHeaderCloseBtn: false,
                        disableOutsideKeyDown: true
                    })

                })
                .catch((err)=>{

                        showAlert({
                            messageTitle: 'Error',
                            messageContent: err.response.data? typeof err.response.data === 'object'? 'Your request cannot be processed at this time. Please try again later.': err.response.data:'Your request cannot be processed at this time. Please try again later.',
                            confirmText: 'Ok',
                            enableHeaderCloseBtn: true,
                            disableOutsideKeyDown: false
                        })

                })
                .finally(()=>{
                    setLoading(false);
                   });
            }else{
                showAlert({
                    messageTitle: 'Error',
                    messageContent: "Invalid Captcha, try again!!",
                    confirmText: 'Ok',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false
                })
            }

        } else {
            setFormErrors(errors);
        }
    };

    // Handle Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setAPIVerForm({
                ...apiVerForm,
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

        

        setAPIVerForm((prevValues) => ({
            ...prevValues,
            [name]: formattedDate,
        }));

    };

    return (
        <>
            <LoaderProgress open={isLoading} />
           
            <FormWrapper headingText="Add eSign API Version">
                <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={handleFormSubmit}>
                    <Grid container spacing={2}>


                            <Grid item xs>
                                <InputLabel shrink={false} htmlFor={"apiVersion"}>
                                    <Typography variant='body1'>API Version Name*</Typography>
                                </InputLabel>
                                <TextField
                                    id="apiVersion"
                                    margin="dense"
                                    required
                                    fullWidth
                                    placeholder='API Version Name'
                                    name="apiVersion"
                                    variant='outlined'
                                    error={!!formErrors.apiVersion}
                                    helperText={formErrors.apiVersion || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9. ]+$/)}
                                    value={apiVerForm.apiVersion}
                                    size="small"
                                    inputProps={{ maxLength: 150 }}
                                />
                            </Grid>

                            <Grid item xs>

                                <InputLabel shrink={false} htmlFor={"esignApiSpecId"}>
                                    <Typography variant='body1' sx={{color: "#000000"}}>API Specification*</Typography>
                                </InputLabel>

                                <FormControl variant="outlined" size="small" sx={{  mt: 1, width: '100%' }}>
                                    
                                    <Select
                                        id="esignApiSpecId"
                                        onChange={handleInputChange}
                                        displayEmpty
                                        value={apiVerForm.esignApiSpecId || ''}
                                        name="esignApiSpecId"
                                        error={
                                            Boolean(formErrors.esignApiSpecId)
                                        }
                                        >

                                            <MenuItem disabled value={apiVerForm.esignApiSpecId}>
                                                API Specification
                                            </MenuItem>


                                            {
                                                specificationList.map((item, index)=>(

                                                    <MenuItem key={index} value={item.esignApiSpecId}>{item.apiSpecification}</MenuItem>

                                                ))
                                            }
                                    </Select>
                                    {formErrors.esignApiSpecId && (
                                    <FormHelperText error sx={{ml:0}}>{formErrors.esignApiSpecId}</FormHelperText>
                                )}
                                </FormControl>
                                </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{mt: 0.1}}>

                        <Grid item xs>
                            <InputLabel shrink={false} htmlFor={"releaseDate"}>
                                <Typography variant='body1' >Release Date*</Typography>
                            </InputLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs} sx={{zIndex: 10015}}> 
                                <DatePicker
                                    id="releaseDate"
                                    
                                    name="releaseDate"
                                    onChange={(date) => handleDateChange('releaseDate', date)}
                                    value={dayjs(apiVerForm.releaseDate)}
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            fullWidth: true,
                                            placeholder: "Release Date",
                                            error: !!formErrors.releaseDate,
                                            helperText: formErrors.releaseDate || ''
                                        },
                                        popper: {
                                            style: { zIndex: 110015 },
                                        },
                                    }}
                                    sx={{mt:1}}
                                    
                                />
                            </LocalizationProvider>
                        </Grid>


                        <Grid item xs>
                            <InputLabel shrink={false} htmlFor={"espReadinessBy"}>
                                <Typography variant='body1' >ESP Readiness By</Typography>
                            </InputLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs} sx={{zIndex: 1500}}> 
                                <DatePicker
                                    id="espReadinessBy"
                                    
                                    name="espReadinessBy"
                                    onChange={(date) => handleDateChange('espReadinessBy', date)}
                                    value={dayjs(apiVerForm.espReadinessBy)}
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            fullWidth: true,
                                            placeholder: "ESP Readiness By",
                                            error: !!formErrors.espReadinessBy,
                                            helperText: formErrors.espReadinessBy || ''
                                        },
                                        popper: {
                                            style: { zIndex: 110015 },
                                        },
                                    }}
                                    sx={{mt:1}}
                                    
                                />
                            </LocalizationProvider>
                        </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{mt: 0.1}}>
                        <Grid item>
                            <InputLabel shrink={false} htmlFor={"deprecationDate"}>
                                <Typography variant='body1' >Deprecation Date</Typography>
                            </InputLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs} sx={{zIndex: 1500}}> 
                                <DatePicker
                                    id="deprecationDate"
                                    
                                    name="deprecationDate"
                                    onChange={(date) => handleDateChange('deprecationDate', date)}
                                    value={dayjs(apiVerForm.deprecationDate)}
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            fullWidth: true,
                                            placeholder: "Deprecation Date",
                                            error: !!formErrors.deprecationDate,
                                            helperText: formErrors.deprecationDate || ''
                                        },
                                        popper: {
                                            style: { zIndex: 110015 },
                                        },
                                    }}
                                    sx={{mt:1}}
                                    
                                />
                            </LocalizationProvider>
                        </Grid>



                        <Grid item xs>
                            <InputLabel shrink={false} htmlFor={"verfile"} sx={{mb:1}}>
                                <Typography variant='body1'>Upload API Specifications*</Typography>
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

                <Grid container sx={{width: "100%", display:'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Grid item>
                    <Captcha setCaptcha={setCaptchaText}
                        setCaptchaInput={setCaptchaInput}
                        captchaInput={captchaInput}
                        captchaError={!!formErrors.captcha}
                        captchaErrorMsg={formErrors.captcha} />
                    </Grid>
                </Grid>

                    <Grid container direction="row" sx={{ mt: 4}} spacing={2} justifyContent="center" alignItems="center">
                                    <Grid item  >
                                        <Button type="submit" fullWidth variant="contained" sx={{maxWidth: '120px' }}>
                                            Submit
                                        </Button>
                                    </Grid>
                                    <Grid item  >
                                        <Button type="button" onClick={handleReset} color="reset" fullWidth variant="contained" sx={{maxWidth: '120px', color: "#FFFFFF" }}>
                                            Reset
                                        </Button>
                                    </Grid>
                        </Grid>  

                    
                </Box>
            </FormWrapper>
        </>
    );
};

export default AddEsignAPIVersion;
