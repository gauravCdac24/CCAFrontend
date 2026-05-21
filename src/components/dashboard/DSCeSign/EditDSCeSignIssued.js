import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FormControl, FormHelperText, MenuItem, Select, Typography} from '@mui/material';
import { InputLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import Captcha from '../../global/util/Captcha';
import validatePattern from '../../global/util/ValidatePattern';
import DashboardService from '../../../service/DashboardService/DashboardService';
import LoaderProgress from '../../global/common/LoaderProgress';
import showAlert from '../../global/common/MessageBox/AlertService';
import { useNavigate, useParams } from 'react-router-dom';
import FormWrapper from '../../global/util/FormWrapper';
import { useSelector } from 'react-redux';
import StateService from '../../../service/AdminService/StateService';
import CountryService from '../../../service/AdminService/CountryService';
import ESPApplicationService from '../../../service/ESPApplicationService/ESPApplicationService';
import { decrypt } from '../../global/util/EncryptDecrypt';

//Errors
const errorMsg = {
    
    month: {
        blank: "Please select month.",
        length: "The length must be between 3 and 9 characters.",
        format: "Only alphabets are allowed."
    },

    year: {
        blank: "Please select year.",
        format: "Only digits are allowed"
    },

    countryId:{
        blank: "Please select country."
    },

    stateId:{
        blank: "Please select state."
    },

    dscIssued: {
        blank: "Please enter number of DSC Issued.",
        length: "The length must be between 1 and 10 characters.",
        format: "Only digits are allowed, and leading zeros are not permitted."
    },

    eSignIssued: {
        blank: "Please enter number of eSign Issued.",
        length: "The length must be between 1 and 10 characters.",
        format: "Only digits are allowed, and leading zeros are not permitted."
    },

    captchaError: {
        blank: "Please enter captcha."
    },
    
};

const monthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  


const EditDSCeSignIssued = () => {
    const [formValues, setFormValues] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [captchaText ,setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [filteredState, setFilteredState] = useState([]);
    const [isESP, setIsESP] = useState(false);
    const [data, setData] = useState([]);

    const [selectedMonth, setSelectedMonth] = useState('January');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const navigate = useNavigate();
    const rolePath = useSelector((state) => state.jwtAuthentication.rolePath);
    let {id} = useParams();

    const checkForESP = async () => {

        try{

            const response = await ESPApplicationService.checkForESP();
            setIsESP(decrypt(response.data) === 'true' ? true: false);

        }catch(err){

        }

    }

    


    const fetchData = async(month, year) => {

                        try {

                            setLoading(true);


                            const [response, countries, states] = await Promise.all([
                                 DashboardService.getAllDSCeSignIssuedByYearMonthAndUsername(
                                                                month,
                                                                year
                                                            ),
                                CountryService.getAllCountryList(),
                                StateService.getAllStateList()
                            ]);
            
                            setCountryList(countries.data);
                            setStateList(states.data);
            
                            const filteredStates = states.data.filter(
                                state => state.countryId.countryName === 'India'
                            );
                            setFilteredState(filteredStates);
            
                            const filteredCountry = countries.data.find(
                                country => country.countryName === 'India'
                            );

                            setSelectedMonth(month);
                            setSelectedYear(year);

                            const formValues1 = [];

                            filteredStates.forEach((row, index)=>{

                                const res = response.data.find((f)=>parseInt(decrypt(f.stateId), 10) === row.stateId);

                                const obj = {                                  
                                    countryId: filteredCountry.countryId,
                                    dscesignIssuedId: res.dscesignIssuedId,
                                    stateId: row.stateId,
                                    dscIssued: res?.dscIssued || "0",
                                    eSignIssued: res?.eSignIssued || "0"
                                }

                                formValues1.push(obj);

                            })
                            setFormValues(formValues1);
                        } catch (err) {
                            
                        } finally {
                            setLoading(false);
                        }

    }

    
    useEffect(()=>{

        if(id){

            const uid = decrypt(id);
            const arraylist = uid.split(",");
            const month = arraylist[0]
            const year = arraylist[1]

            fetchData(month, year);
            checkForESP();
        }else {
            navigate(`${rolePath}/dscesignissued`, { replace: true });
        }


        

    }, [])


    // Input Change
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
    
        setFormValues((prevValues) => {
            const updatedArray = [...prevValues];
            updatedArray[index] = { ...updatedArray[index], [name]: value };
    
            return updatedArray;
        });
    };

    



    const validateForm = () => {
        const errors = {};

        const ferror = [];

        formValues.forEach((item, index)=>{

            if (!ferror[index]) {
                ferror[index] = {};
            }

        

                if(!item.countryId){
                    ferror[index].countryId = errorMsg.countryId.blank;
                }

                if(!item.stateId){
                    ferror[index].stateId = errorMsg.stateId.blank;
                }

                if (!item.dscIssued) {
                    ferror[index].dscIssued = errorMsg.dscIssued.blank;
                } else if (!/^(0|[1-9][0-9]*)$/.test(item.dscIssued)) {
                    ferror[index].dscIssued = errorMsg.dscIssued.format;
                } else if (item.dscIssued.length < 1 || item.dscIssued.length > 10) {
                    ferror[index].dscIssued = errorMsg.dscIssued.length;
                }
                
                if (!item.eSignIssued) {
                    ferror[index].eSignIssued = errorMsg.eSignIssued.blank;
                } else if (!/^(0|[1-9][0-9]*)$/.test(item.eSignIssued)) {
                    ferror[index].eSignIssued = errorMsg.eSignIssued.format;
                } else if (item.eSignIssued.length < 1 || item.eSignIssued.length > 10) {
                    ferror[index].eSignIssued = errorMsg.eSignIssued.length;
                }

        })

        if(!selectedMonth){
            errors.month = errorMsg.month.blank;
        } else if (selectedMonth.length < 3 || selectedMonth.length > 9) {
            errors.month = errorMsg.month.length;
        } else if(!/^[A-Za-z]+$/.test(selectedMonth)){
            errors.month = errorMsg.month.format;
        }

        if(!selectedYear){
            errors.year = errorMsg.year.blank;
        } else if(!/^[0-9]+$/.test(selectedYear)){
            errors.year = errorMsg.year.format;
        }

        if(!captchaInput){
            errors.captcha = errorMsg.captchaError.blank;
        }

        errors.ferror = ferror;

        const checkError = ferror.filter(obj => Object.keys(obj).length !== 0);

        if(Object.keys(checkError).length === 0)
            delete errors.ferror;

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
                DashboardService.updateDSCeSign(formValues, selectedMonth, selectedYear)
                .then((response)=>{

                    showAlert({
                        messageTitle: 'Update DSC & eSign Issued',
                        messageContent: response.data,
                        confirmText: 'Ok',
                        onConfirm: () => {navigate(`${rolePath}/dscesignissued`)},
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

                        fetchData(selectedMonth, selectedYear);

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

    const handleBack = () =>{
        navigate(`${rolePath}/dscesignissued`, { replace: true })
    }

    const handleNumberKeyDown = (e, value) => {
        
        if (e.key === 'Backspace' || e.key === 'Tab') {
            return;
        }
        const nextValue = value + e.key;
        if (/^0[0-9]+$/.test(nextValue)) {
            e.preventDefault();
            return;
        }
        if (e.key === '0' && value.length === 0) {
            return;
        }
        if (!/^[0-9]$/.test(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <>

            <LoaderProgress open={isLoading} />

                <Box component="div">

                    <Grid2 container spacing={2} direction={'column'}>

                        <Grid2  sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                            <Button variant="contained"  onClick={handleBack}>
                                <Typography variant="h6">Back</Typography>
                            </Button>
                        </Grid2>
                    </Grid2>

                    


                </Box>

            
                {!isLoading && (<FormWrapper headingText="Update DSC & eSign Issued">


                    <Box component="form" noValidate sx={{ mt: 2, p: 2}} onSubmit={handleFormSubmit} >

                    <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", mt: 2}}>
                        <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12, sm: 6 }} >
                            <InputLabel shrink={false} htmlFor="month">
                                <Typography variant='body1'>Month*</Typography>
                            </InputLabel>
                            <FormControl variant="outlined" fullWidth size="small" sx={{ width: '100%', minWidth: "150px", mt: 1 }}>
                                <Select
                                    id="month"
                                    required
                                    value={selectedMonth}
                                    onChange={(e)=>setSelectedMonth(e.target.value)}
                                    displayEmpty
                                    name="month"
                                    error={!!formErrors.month}
                                    size='small'
                                    disabled
                                >
                                    <MenuItem value="">
                                        Select Month
                                    </MenuItem>
                                    {monthList.map((month, index) => (
                                        <MenuItem key={index} value={month}>
                                            {month}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formErrors.month && <FormHelperText error>{formErrors.month}</FormHelperText>}
                            </FormControl>
                        </Grid2>


                        <Grid2 size={{ xs: 12, sm: 6 }} >
                            <InputLabel shrink={false} htmlFor="year">
                                <Typography variant='body1'>Year*</Typography>
                            </InputLabel>
                            <FormControl variant="outlined" fullWidth size="small" sx={{ width: '100%', minWidth: "150px", mt: 1 }}>
                                <Select
                                    id="year"
                                    required
                                    value={selectedYear}
                                    onChange={(e)=>setSelectedYear(e.target.value)}
                                    displayEmpty
                                    name="year"
                                    error={!!formErrors.year}
                                    size='small'
                                    disabled
                                >
                                    <MenuItem value="">
                                        Select Year
                                    </MenuItem>
                                    {Array.from({ length: (new Date()).getFullYear() - 2025 + 1 }, (_, i) => {
                                        const year = (new Date()).getFullYear() - i;
                                        return (
                                        <MenuItem key={year} value={year}>
                                            {year}
                                        </MenuItem>
                                        );
                                    })}
                                </Select>
                                {formErrors.year && <FormHelperText error>{formErrors.year}</FormHelperText>}
                            </FormControl>
                        </Grid2>
                        



                    </Grid2>
                 </Box>                   

                    {
                        formValues.map((row, index)=>(

                        <Grid2 container  spacing={2} direction="row" key={index} sx={{mt: 4}}>


                                <Grid2 size={1} >
                                    <b>{index+1}.</b>
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }} >
                                    <InputLabel shrink={false} htmlFor="stateId">
                                        <Typography variant='body1'>State/Province*</Typography>
                                    </InputLabel>
                                    <FormControl variant="outlined" fullWidth size="small" sx={{ width: '100%', mt: 1 }}>
                                        <Select
                                            id="stateId"
                                            required
                                            value={row.stateId}
                                            onChange={(e)=>handleInputChange(e, index)}
                                            displayEmpty
                                            name="stateId"
                                            error={!!(formErrors.ferror && formErrors.ferror[index]?.stateId)}
                                            size='small'
                                            disabled 
                                            
                                        >
                                            <MenuItem value="">
                                                Select State/Province
                                            </MenuItem>
                                            {filteredState.map((state, index) => (
                                                <MenuItem key={index} value={state.stateId}>
                                                    {state.stateName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {(formErrors.ferror && formErrors.ferror[index]?.stateId) && (
                                            <FormHelperText error sx={{ ml: 0 }}>{(formErrors.ferror && formErrors.ferror[index]?.stateId)}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid2>

                                <Grid2 size={{ xs: 12, sm: 2 }}>
                                    <InputLabel shrink={false} htmlFor={"dscIssued"}>
                                        <Typography variant='body1'>DSC Issued*</Typography>
                                    </InputLabel>
                                    <TextField
                                        id="dscIssued"
                                        margin="dense"
                                        required
                                        fullWidth
                                        placeholder='DSC Issued'
                                        name="dscIssued"
                                        variant='outlined'
                                        error={!!(formErrors.ferror && formErrors.ferror[index]?.dscIssued)}
                                        helperText={(formErrors.ferror && formErrors.ferror[index]?.dscIssued) || ''}
                                        onChange={(e)=>handleInputChange(e, index)}
                                        onKeyDown={(e) => handleNumberKeyDown(e, row.dscIssued || '')}
                                        value={row.dscIssued}
                                        size="small"
                                        slotProps={{
                                            htmlInput: {
                                                maxLength: 10
                                            }
                                        }}
                                        
                                    />
                                </Grid2>

                                <Grid2 size={{ xs: 12, sm: 2 }}>
                                    <InputLabel shrink={false} htmlFor={"eSignIssued"}>
                                        <Typography variant='body1'>eSign Issued*</Typography>
                                    </InputLabel>
                                    <TextField
                                        id="eSignIssued"
                                        margin="dense"
                                        required
                                        fullWidth
                                        placeholder='eSign Issued'
                                        name="eSignIssued"
                                        variant='outlined'
                                        error={!!(formErrors.ferror && formErrors.ferror[index]?.eSignIssued)}
                                        helperText={(formErrors.ferror && formErrors.ferror[index]?.eSignIssued) || ''}
                                        onChange={(e)=>handleInputChange(e, index)}
                                        onKeyDown={(e) => handleNumberKeyDown(e, row.eSignIssued || '')}
                                        value={row.eSignIssued}
                                        size="small"
                                        slotProps={{
                                            htmlInput: {
                                                maxLength: 10
                                            }
                                        }}
                                        disabled={!isESP}
                                    />
                                </Grid2>


                               



                                    
                        
                        
                    </Grid2>

                        ))

               }
                    <Grid2 container direction="row" justifyContent="center" alignItems="center">
                        <Captcha setCaptcha={setCaptchaText} 
                                setCaptchaInput={setCaptchaInput}
                                captchaInput={captchaInput}
                                captchaError={!!formErrors.captcha}
                                captchaErrorMsg={formErrors.captcha}/> 
                    </Grid2>

                        <Grid2 container direction="row" sx={{ mt: 4}} spacing={2} justifyContent="center" alignItems="center">
                                    <Grid2   >
                                        <Button type="submit" fullWidth variant="contained" sx={{maxWidth: '120px' }}>
                                            Submit
                                        </Button>
                                    </Grid2>
                                    
                        </Grid2>                          

                        </Box>


                </FormWrapper>)}
        
        </>
    );
};

export default EditDSCeSignIssued;
