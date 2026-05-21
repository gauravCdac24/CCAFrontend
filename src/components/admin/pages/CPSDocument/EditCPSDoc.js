import React, { useState, useEffect } from 'react';
import { Box, Grid, Button, TextField, Typography, InputLabel, Tooltip, FormHelperText, FormControl } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import Captcha from '../../../global/util/Captcha';
import validatePattern from '../../../global/util/ValidatePattern';
import CPSDocService from '../../../../service/AdminService/CPSDocService';
import LoaderProgress from '../../../global/common/LoaderProgress';
import showAlert from '../../../global/common/MessageBox/AlertService';
import FormWrapper from '../../../global/util/FormWrapper';
import { decrypt, encrypt } from '../../../global/util/EncryptDecrypt';
import dayjs from 'dayjs';

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

// Error messages
const errorMsg = {
    version: {
        blank: "Please enter a version.",
        length: "The length must be between 3 and 7 characters.",
        format: "Only alphabets and spaces are allowed."
    },
    file: {
        blank: "Please select a file.",
        length: "The size of the file must be less than 4MB.",
        format: "Only Word files are allowed."
    },
    publishDate: {
        blank: "Please enter a Publish Date.",
    },
    captchaError: {
        blank: "Please enter the captcha."
    },
};

const EditCPSDoc = () => {
    const [cpsDocFormValues, setCpsDocFormValues] = useState({
        file: '',
        cpsDocId: '',
        version: '',
        publishDate: null,
        created: '',
        updated: '',
        status: ''
    });

    const [fileName, setFileName] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            setLoading(true);
            CPSDocService.getCPSDocById(decrypt(id))
                .then((response) => {
                    const date = dayjs(response.data.publishDate);
                    setCpsDocFormValues({
                        cpsDocId: response.data.cpsDocId,
                        version: response.data.version,
                        publishDate: date,
                        created: response.data.created,
                        updated: response.data.updated,
                        status: response.data.status
                    });
                    setFileName(response.data.fileName);
                })
                .catch(() => {
                    navigate('/admin/cps', { replace: true });
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            navigate('/admin/cps', { replace: true });
        }
    }, [id, navigate]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setCpsDocFormValues({
            ...cpsDocFormValues,
            file: file
        });
        setFileName(file ? file.name : '');
    };

    const validateFile = (errors) => {
        const file = cpsDocFormValues.file;
        if (file) {
            const allowedExtensions = /(\.doc|\.docx)$/i;
            if (!allowedExtensions.exec(file.name)) {
                errors.file = errorMsg.file.format;
            }
            const maxSize = 4 * 1024 * 1024;
            if (file.size > maxSize) {
                errors.file = errorMsg.file.length;
            }
        } else {
            errors.file = errorMsg.file.blank;
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCpsDocFormValues({
            ...cpsDocFormValues,
            [name]: value,
        });
    };

    const handleDateChange = (name, date) => {
        setCpsDocFormValues({
            ...cpsDocFormValues,
            [name]: date,
        });
    };

    const [fileInputKey, setFileInputKey] = useState(Date.now());
    const validateForm = () => {
        const errors = {};

        // Validate file
        validateFile(errors);

        // Validate version
        if (!cpsDocFormValues.version) {
            errors.version = errorMsg.version.blank;
        } else if (cpsDocFormValues.version.length < 3 || cpsDocFormValues.version.length > 7) {
            errors.version = errorMsg.version.length;
        } else if (!/^[0-9.]+$/.test(cpsDocFormValues.version)) {
            errors.version = errorMsg.version.format;
        }

        // Validate publishDate
        if (!cpsDocFormValues.publishDate) {
            errors.publishDate = errorMsg.publishDate.blank;
        }

        // Validate captcha
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
            if (captchaInput === captchaText) {
                setLoading(true);
                const form = new FormData();
                form.append('file', cpsDocFormValues.file);
                const date = new Date(cpsDocFormValues.publishDate);
                const formattedDate = date.toISOString().split('T')[0];
                form.append('publishDate', formattedDate);
                form.append('version', cpsDocFormValues.version);
                form.append('cpsDocId',encrypt(cpsDocFormValues.cpsDocId))
                form.append('created',cpsDocFormValues.created)
                

                CPSDocService.updateCpsDoc(form)
                    .then((response) => {
                        showAlert({
                            messageTitle: 'Update CPS Document',
                            messageContent: response.data,
                            confirmText: 'Ok',
                            onConfirm: () => { navigate("/admin/cps") }
                        });
                    })
                    .catch((err) => {
                        showAlert({
                            messageTitle: 'Error',
                            messageContent: err.response.data ? typeof err.response.data === 'object' ? 'Your request cannot be processed at this time. Please try again later.' : err.response.data : 'Your request cannot be processed at this time. Please try again later.',
                            confirmText: 'Ok',
                        });
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }
        } else {
            setFormErrors(errors);
        }
    };

    const handleReset = () => {
        setCpsDocFormValues({
            file: '',
            publishDate: null,
            version: '',
        });
        setCaptchaInput('');
        setFormErrors({});
    };

    const handleBack = () => {
        navigate("/admin/cps", { replace: true });
    };

    return (
        <>
            <LoaderProgress open={isLoading} />
            <Box component="div">
                <Grid container spacing={2} direction={'column'}>
                    <Grid item sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right', mr: 2 }}>
                        <Button variant="contained" onClick={handleBack}>
                            <Typography variant="h6">Back</Typography>
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <FormWrapper headingText="Update CPS Document">
                <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={handleFormSubmit}>
                    <Grid container spacing={2} direction="column">
                        <Grid item xs={12}>
                            <InputLabel shrink={false} htmlFor={"version"}>
                                <Typography variant='body1'>Version*</Typography>
                            </InputLabel>
                            <TextField
                                id="version"
                                margin="dense"
                                required
                                fullWidth
                                placeholder='Version'
                                name="version"
                                variant='outlined'
                                error={!!formErrors.version}
                                helperText={formErrors.version || ''}
                                onChange={handleInputChange}
                                onKeyDown={(e) => validatePattern(e,/^[0-9.]+$/)}
                                value={cpsDocFormValues.version}
                                size="small"
                                inputProps={{ maxLength: 7 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel shrink={false} htmlFor={"publishDate"}>
                                <Typography variant='body1'>Publish Date*</Typography>
                            </InputLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    margin="dense"
                                    required
                                    fullWidth
                                    id="publishDate"
                                    disableFuture
                                    name="publishDate"
                                    onChange={(date) => handleDateChange('publishDate', date)}
                                    value={cpsDocFormValues.publishDate}
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            fullWidth: true,
                                            placeholder: "Publish Date",
                                            error: !!formErrors.publishDate,
                                            helperText: formErrors.publishDate || ''
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item  xs={12} sm>
                                    <InputLabel shrink={false} htmlFor={"pdffile"}>
                                        <Typography variant='body1'>Upload File*</Typography>
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
                                                key={fileInputKey}
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
                        
                        <Captcha setCaptcha={setCaptchaText}
                        setCaptchaInput={setCaptchaInput}
                        captchaInput={captchaInput}
                        captchaError={!!formErrors.captcha}
                        captchaErrorMsg={formErrors.captcha} />
                        
                        <Grid container direction="row" sx={{ mt: 4 }} spacing={2} justifyContent="center" alignItems="center">
                        <Grid item>
                            <Button type="submit" fullWidth variant="contained" sx={{ maxWidth: '120px' }}>
                                Submit
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button type="button" onClick={handleReset} color="reset" fullWidth variant="contained" sx={{ maxWidth: '120px', color: "#FFFFFF" }}>
                                Reset
                            </Button>
                        </Grid>
                    </Grid>


                       
                    </Grid>
                </Box>
            </FormWrapper>
        </>
    );
};

export default EditCPSDoc;
