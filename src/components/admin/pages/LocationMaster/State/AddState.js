import React, { useState, useEffect } from 'react';
import { Box, Grid, Button, TextField, Typography, InputLabel, Select, MenuItem, FormHelperText, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Captcha from '../../../../global/util/Captcha';
import validatePattern from '../../../../global/util/ValidatePattern';
import CountryService from '../../../../../service/AdminService/CountryService';
import LoaderProgress from '../../../../global/common/LoaderProgress';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import FormWrapper from '../../../../global/util/FormWrapper';
import StateService from '../../../../../service/AdminService/StateService';

//Errors
const errorMsg = {
    StateName: {
        blank: "Please enter state name.",
        length: "The length must be between 3 and 60 characters.",
        format: "Only alphabets and spaces are allowed."
    },
    countryName: {
        blank: "Please select country name.",
    },
    captchaError: {
        blank: "Please enter captcha."
    },
};

const AddState = () => {
    const [stateFormValues, setStateFormValues] = useState({
        stateName: '',
        countryId: ''
    });
    const [countries, setCountries] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        CountryService.getAllCountryList().then(data => {
            setCountries(data.data);
            console.log("Fetched countries:", countries); // Add console log to debug

        }).catch(error => {
            console.error("Error fetching countries:", error);
        });
    }, []);

    const handleReset = () => {
        setStateFormValues({
            stateName: '',
            countryId: ''
        });
        setCaptchaInput('');
        setFormErrors({});
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStateFormValues({
            ...stateFormValues,
            [name]: value,
        });
    };

    const validateForm = () => {
        const errors = {};

        if (!stateFormValues.stateName) {
            errors.stateName = errorMsg.StateName.blank;
        } else if (stateFormValues.stateName.length < 3 || stateFormValues.stateName.length > 60) {
            errors.stateName = errorMsg.StateName.length;
        } else if (!/^[A-Za-z ]+$/.test(stateFormValues.stateName)) {
            errors.stateName = errorMsg.StateName.format;
        }

        if (!stateFormValues.countryId) {
            errors.countryId = errorMsg.countryName.blank;
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
            if (captchaInput === captchaText) {
                setLoading(true);
                console.log(stateFormValues)
                StateService.addNewState(stateFormValues)
                    .then((response) => {
                        showAlert({
                            messageTitle: 'Add State',
                            messageContent: response.data,
                            confirmText: 'Ok',
                            onConfirm: () => { navigate("/admin/state") }
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
            }
        } else {
            setFormErrors(errors);
        }
    };

    const handleBack = () => {
        navigate("/admin/state", { replace: true })
    }

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
            <FormWrapper headingText="Add State">
                <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={handleFormSubmit}>
                    <Grid container spacing={2} direction="column">
                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor={"stateName"}>
                                <Typography variant='body1'>State Name*</Typography>
                            </InputLabel>
                            <TextField
                                id="stateName"
                                margin="dense"
                                required
                                fullWidth
                                placeholder='State Name'
                                name="stateName"
                                variant='outlined'
                                error={!!formErrors.stateName}
                                helperText={formErrors.stateName || ''}
                                onChange={handleInputChange}
                                onKeyDown={(e) => validatePattern(e, /^[A-Za-z ]+$/)}
                                value={stateFormValues.stateName}
                                size="small"
                                inputProps={{ maxLength: 60 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor="countryId">
                                <Typography variant='body1'>Country Name*</Typography>
                            </InputLabel>
                            <FormControl variant="outlined" size="small" sx={{ width: '100%', mt: 1 }}>
                                <Select
                                    id="countryId"
                                    margin='dense'
                                    required
                                    fullWidth
                                    onChange={handleInputChange}
                                    displayEmpty
                                    name="countryId"
                                    value={stateFormValues.countryId}
                                    error={Boolean(formErrors.countryId)}
                                    placeholder='Country Name'
                                >
                                    <MenuItem disabled value="">
                                        Country Name
                                    </MenuItem>
                                    {countries.map((item, index) => (
                                        <MenuItem key={index} value={item.countryId}>{item.countryName}</MenuItem>
                                    ))}
                                </Select>
                                {formErrors.countryId && (
                                    <FormHelperText error sx={{ ml: 0 }}>{formErrors.countryId}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
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
                </Box>
            </FormWrapper>
        </>
    );
};

export default AddState;
