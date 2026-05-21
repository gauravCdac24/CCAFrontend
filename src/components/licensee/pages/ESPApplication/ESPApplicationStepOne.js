import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, Typography } from "@mui/material";
import EKYCModeService from "../../../../service/AdminService/EKYCModeService";
import LoaderProgress from "../../../global/common/LoaderProgress";
import { useEffect, useState } from "react";
import ESPApplicationService from "../../../../service/ESPApplicationService/ESPApplicationService";
import LicenseIssuanceService from "../../../../service/LicenseIssuanceService/LicenseIssuanceService";
import showAlert from "../../../global/common/MessageBox/AlertService";

const errorMsg = {
    ekycMode: {
        blank: "Please select at least one eKYC mode.",
    },
    purpose:{
        blank: "Please select the purpose."
    }
};


const ESPApplicationStepOne = ({handleNext, handleBack}) => {

    const [formValues, setFormValues] = useState({
        ekycMode:[],
        ekycModeTitles:[],
        purpose:''
    });
    const [formErrors, setFormErrors] = useState({});

    const [eKYCModeList, setEKYCModeList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [licenseDetails, setLicenseDetails] = useState({});
    const [reviewData, setReviewData] = useState({purpose: true, ekycMode: true});


    const getReviewData = () => {

        setIsLoading(true);
  
        ESPApplicationService.underReviewDataByUsername()
          .then((response)=>{
            setReviewData(response.data);
          })
          .catch((err)=>{
            
          })
          .finally(()=>{
            setIsLoading(false);
          })
  
      }

    const getAlleKYCMode = () =>{

        setIsLoading(true);

        EKYCModeService.getAllEKYCMode()
        .then((response)=>{
            setEKYCModeList(response.data);
        })
        .catch((err)=>{

        })
        .finally(()=>{
            setIsLoading(false);
        })

    }


const handlePurposeChange = (event) => {
    setFormValues({
      ...formValues, 
      purpose: event.target.value, 
    });
  };


    const handleInputChange = (value, valuetitle) => {        

        const ekycmode = formValues.ekycMode;
        const ekycmodetitles = formValues.ekycModeTitles;

        const ekycModeIndex = ekycmode.indexOf(value);
        const ekycModeTitleIndex = ekycmodetitles.indexOf(valuetitle);

        if(ekycModeIndex === -1){
            ekycmode.push(value);
            ekycmodetitles.push(valuetitle);
        }else{
            ekycmode.splice(ekycModeIndex, 1);
            ekycmodetitles.splice(ekycModeTitleIndex, 1);
        }

        setFormValues({
                ...formValues,
                'ekycMode': ekycmode,
                'ekycModeTitles': ekycmodetitles
        })

        const errors = validateForm();
        setFormErrors(errors);

    };

    const validateForm = () => {
        const errors = {};

        if(formValues.ekycMode.length === 0){
            errors.ekycMode = errorMsg.ekycMode.blank;
        } 
        if(!formValues.purpose){
            errors.purpose = errorMsg.purpose.blank;
        }

        
        return errors;
    };

    const getLicenseDetailsByUsername = () => {

        setIsLoading(true);
        LicenseIssuanceService.getLicenseDetails()
        .then((res)=>{
            setLicenseDetails(res.data)
        })
        .catch((err)=>{
        
        })
        .finally(()=>{
            setIsLoading(false);
        })


    }

    const getFirstStepData = () => {

        setIsLoading(true);

        ESPApplicationService.getFirstStepData()
        .then((response)=>{
            setFormValues(response.data);
        })
        .catch((err)=>{

        })
        .finally(()=>{
            setIsLoading(false);
        })

        

    }

    useEffect(()=>{
        getLicenseDetailsByUsername();
        getFirstStepData();
       
    },[])

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const errors = validateForm();

        

        if (Object.keys(errors).length === 0) {
            setFormErrors({});

            setIsLoading(true);

            //save details
            ESPApplicationService.saveStepOne(formValues.purpose, formValues.ekycMode, licenseDetails.licenseId)
            .then((response)=>{

                

                showAlert({
                    messageTitle: 'Alert',
                    messageContent: 'Selected eKYC Mode saved successfully.',
                    enableHeaderCloseBtn: false,
                    disableOutsideKeyDown: true,
                    confirmText: 'Ok',
                    onConfirm: ()=>handleNext()
                })

            })
            .catch((err)=>{

                

                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Not Saved, Try Again.',
                    enableHeaderCloseBtn: false,
                    disableOutsideKeyDown: true,
                    confirmText: 'Ok',
                })

            })
            .finally(()=>{
                setIsLoading(false);
            })
        }
        else {
            
            setFormErrors(errors);
        }

    }

    const downloadCoverLetter = async () => {



        try {
            setIsLoading(true);
            const response = await ESPApplicationService.downloadCoverLetter(formValues);
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            const contentDisposition = response.headers['content-disposition'];
            const filename = "ESP Cover Letter";
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            setIsLoading(false);
        } catch (error) {
            console.error('Error downloading file:', error);
            setIsLoading(false);
        }

    }


    useEffect(()=>{
        getAlleKYCMode();
        getReviewData();
    },[])

    return (
        <>
            <LoaderProgress open={isLoading} />

            <Box component='form' noValidate sx={{ mt: 2, p: 2}} onSubmit={handleFormSubmit}>
            
            <Grid item xs={12} sm>
                <InputLabel shrink={false} htmlFor={"purpose"}>
                    <Typography variant='body1'><b>1. Select the Purpose*</b></Typography>
                </InputLabel>

                <RadioGroup
                            row
                            name="purpose"
                            value={formValues.purpose} 
                            onChange={handlePurposeChange} 
                          
                        >
                            <FormControlLabel
                            value="Internal"
                            control={<Radio />}
                            label="Internal"
                            disabled={!reviewData?.purpose}
                            />
                            <FormControlLabel
                            value="External"
                            control={<Radio />}
                            label="External"
                            disabled={!reviewData?.purpose}
                            />
                        </RadioGroup>

                        {formErrors.purpose && (
                        <FormHelperText error sx={{ml:0, mt: 2}}>{formErrors.purpose}</FormHelperText>
                    )}

            </Grid>



            <Grid container spacing={2} direction="row" sx={{mt:1}}>

          
                <Grid item xs={12} sm>

                    <InputLabel shrink={false} htmlFor={"ekycMode"}>
                        <Typography variant='body1'><b>2. Select eKYC Mode(s)*</b></Typography>
                    </InputLabel>

                    <FormControl variant="outlined" size="small" sx={{  mt: 1, width: '100%' }}>


                        <FormGroup>

                        {eKYCModeList.length>0 && eKYCModeList.map((item, index)=>(

                            <FormControlLabel
                                key={index}
                                control={
                                    <Checkbox   checked={formValues.ekycMode.includes(item.ekycModeId)} 
                                                onChange={()=>handleInputChange(item.ekycModeId, item.ekycModeTitle)} 
                                                name="ekycMode" sx={{color: 'inherit'}} disabled={!reviewData?.ekycMode}/>
                                }
                                label={item.ekycModeTitle}
                                sx={{width: 'auto', backgroundColor: (index%2===0) ?'checkboxbg.main': '', borderRadius: '3px'}}
                                />

                            ))}

                        </FormGroup>

                        {formErrors.ekycMode && (
                        <FormHelperText error sx={{ml:0, mt: 2}}>{formErrors.ekycMode}</FormHelperText>
                    )}
                    </FormControl>
                    </Grid>
                </Grid>

               
                        <Box  sx={{ display: 'flex', justifyContent:'space-between', mt: 3 ,ml:1, mr: 1}}>
                            <Box>
                                <Typography variant="body1"><b>3. Download Cover Letter</b></Typography>
                            </Box>
                            <Box>
                                <Button type="button" color="primary" onClick={downloadCoverLetter} disabled={formValues.ekycMode.length===0}>
                                        Download
                                </Button>

                            </Box>
                        </Box>
                  


                    <Box sx={{ display: 'flex', justifyContent:'space-between', mt: 3 ,ml:1}}>
                                 <Button
                                    sx={{ mr: 1, backgroundColor: "#000", color: "#FFFFFF" }}
                                    variant="contained"
                                    disabled   
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


            </Box>
        </>
    )
}

export default ESPApplicationStepOne;