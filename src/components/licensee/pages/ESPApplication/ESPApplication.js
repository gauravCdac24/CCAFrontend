import { Box, Button, Grid, Step, StepLabel, Stepper } from "@mui/material";
import { useState } from "react";
import ESPApplicationStepOne from "./ESPApplicationStepOne";
import FormWrapper from "../../../global/util/FormWrapper";
import ESPApplicationStepTwo from "./ESPApplicationStepTwo";
import ESPApplicationStepThree from "./ESPApplicationStepThree";
import ESPApplicationStepFinal from "./ESPApplicationStepFinal";

const steps = [
    'Selection of eKYC Mode',
    'Upload of Cover Letter and eKYC Approval',
    'API Version & Upload of Audit Report & CPS Document',
    'Undertaking'
]

const ESPApplication = () => {

    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }

    const renderStep = (stepIndex) => {

        switch (stepIndex) {
            case 0:
                return <ESPApplicationStepOne handleNext={handleNext} handleBack={handleBack} />
            case 1:
                return <ESPApplicationStepTwo handleNext={handleNext} handleBack={handleBack} />
            case 2:
                return <ESPApplicationStepThree handleNext={handleNext} handleBack={handleBack} />
            case 3:
                return <ESPApplicationStepFinal handleBack={handleBack} />
            default:
                return <></>;
        }
    }

    return (
        <FormWrapper headingText="eSign Service Provider Application">

            <Stepper activeStep={activeStep}>
                {
                    steps.map((label, index)=>(
                        <Step key={index}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))
                }
            </Stepper>

            <Box sx={{mt: 2, mb: 2}}>                
                 {renderStep(activeStep)}           
            </Box>

        </FormWrapper>
    )
}

export default ESPApplication;