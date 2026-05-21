import React, { useState, useEffect } from 'react';
import { Box, Grid, Button, TextField, Typography, InputLabel, Select, MenuItem, FormHelperText, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Captcha from '../../../../global/util/Captcha';
import validatePattern from '../../../../global/util/ValidatePattern';
import CityService from '../../../../../service/AdminService/CityService';
import LoaderProgress from '../../../../global/common/LoaderProgress';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import FormWrapper from '../../../../global/util/FormWrapper';
import StateService from '../../../../../service/AdminService/StateService';
import { useParams } from 'react-router-dom';
import { decrypt } from '../../../../global/util/EncryptDecrypt';
//Errors
const errorMsg = {
    CityName: {
        blank: "Please enter city name.",
        length: "The length must be between 3 and 60 characters.",
        format: "Only alphabets and spaces are allowed."
    },
    stateName: {
        blank: "Please enter state name.",
    },
    captchaError: {
        blank: "Please enter captcha."
    },
};

const EditCity = () => {
    const [cityFormValues, setCityFormValues] = useState({
        cityName: '',
        stateId: ''
    });
 
    const [formErrors, setFormErrors] = useState({});
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [states, setStates] = useState([]);
    useEffect(() => {
        StateService.getAllStateList().then(data => {
            setStates(data.data);
            console.log("Fetched states:",states); // Add console log to debug

        }).catch(error => {
            console.error("Error fetching states:", error);
        });
    }, []);

    const handleReset = () => {
        setCityFormValues({
            cityName: '',
            stateId: '',
        });
        setCaptchaInput('');
        setFormErrors({});
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCityFormValues({
            ...cityFormValues,
            [name]: value,
        });
    };


    let {id} = useParams();

    useEffect(()=>{
        if(id){

            setLoading(true);
            CityService.getCityById(decrypt(id))
            .then((response)=>{

                setCityFormValues({

                    cityId: response.data.cityId,
                    cityName: response.data.cityName,
                    stateId: response.data.stateId.stateId,
                    created: response.data.created,
                    updated: response.data.updated,
                    status: response.data.status
        
                })
                
            })
            .catch((err)=>{
                navigate('/admin/city', { replace: true })
            })
            .finally(()=>{
                setLoading(false);
            })

    }else{
        navigate('/admin/city', { replace: true })
    }

    },[])
    const validateForm = () => {
        const errors = {};

        if (!cityFormValues.cityName) {
            errors.cityName = errorMsg.CityName.blank;
        } else if (cityFormValues.cityName.length < 3 || cityFormValues.cityName.length > 60) {
            errors.cityName = errorMsg.CityName.length;
        } else if (!/^[A-Za-z ]+$/.test(cityFormValues.cityName)) {
            errors.cityName = errorMsg.CityName.format;
        }

        if (!cityFormValues.stateId) {
            errors.stateId = errorMsg.stateId.blank;
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
                console.log(cityFormValues)
                CityService.updateCity(cityFormValues)
                    .then((response) => {
                        showAlert({
                            messageTitle: 'Add City',
                            messageContent: response.data,
                            confirmText: 'Ok',
                            onConfirm: () => { navigate("/admin/city") }
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
        navigate("/admin/city", { replace: true })
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
            <FormWrapper headingText="Add City">
                <Box component="form" noValidate sx={{ mt: 2, p: 2 }} onSubmit={handleFormSubmit}>
                    <Grid container spacing={2} direction="column">
                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor={"cityName"}>
                                <Typography variant='body1'>City Name*</Typography>
                            </InputLabel>
                            <TextField
                                id="cityName"
                                margin="dense"
                                required
                                fullWidth
                                placeholder='City Name'
                                name="cityName"
                                variant='outlined'
                                error={!!formErrors.cityName}
                                helperText={formErrors.cityName || ''}
                                onChange={handleInputChange}
                                onKeyDown={(e) => validatePattern(e, /^[A-Za-z ]+$/)}
                                value={cityFormValues.cityName}
                                size="small"
                                inputProps={{ maxLength: 60 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor="stateId">
                                <Typography variant='body1'>State Name*</Typography>
                            </InputLabel>
                            <FormControl variant="outlined" size="small" sx={{ width: '100%', mt: 1 }}>
                                <Select
                                    id="stateId"
                                    margin='dense'
                                    required
                                    fullWidth
                                    onChange={handleInputChange}
                                    displayEmpty
                                    name="stateId"
                                    value={cityFormValues.stateId}
                                    error={Boolean(formErrors.stateId)}
                                    placeholder='State Name'
                                >
                                    <MenuItem disabled value="">
                                        State Name
                                    </MenuItem>
                                    {states.map((item, index) => (
                                        <MenuItem key={index.stateId} value={item.stateId}>{item.stateName}</MenuItem>
                                    ))}
                                </Select>
                                {formErrors.stateId && (
                                    <FormHelperText error sx={{ ml: 0 }}>{formErrors.stateId}</FormHelperText>
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

export default EditCity;
