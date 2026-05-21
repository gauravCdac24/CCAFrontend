import React, { useEffect, useState } from 'react';
import { Box, Step, StepLabel, Stepper, Typography } from '@mui/material';
import PersonalDetailsForm from './PersonalDetailsForm';
import AddressDetailsForm from './AddressDetailsForm';
import FinancialDetails from './FinancialDetails';
import AdditionalDetails from './AdditionalDetails';
import Location from './Location';
import CPSDocumentDetails from './CPSDocumentDetails';
import Declarization from './Declarization';
import OrganizationalDetails from './OrganizationalDetails';
import LoaderProgress from '../../../global/common/LoaderProgress';
import FormWrapper from '../../../global/util/FormWrapper';
import { useNavigate } from 'react-router-dom';
import FirmDetails from './FirmDetails';
import IncomeTaxDocumentDetails from './IncomeTaxDocumentDetails';
import Partner from './Partner';
import AuthorizedRepresentativeDetails from './AuthorizedRepresentativeDetails';
import IntentService from '../../../../service/AdminService/IntentService';
import { useDispatch, useSelector } from 'react-redux';
import {setApplicationDetails} from "../../../../store/LicenseApplication/Reducer";
import ApplicationForm from '../../../../service/NewLicenseService/ApplicationForm';
import FirmDeclarization from './FirmDeclarization';
import GovernmentDeclarization from './GovernmentDeclarization';
import TimerApp from '../../../global/util/TimerApp';
import { clearCredentials } from '../../../../store/Auth/Reducer';
import IndividualChecklistPage from './IndividualChecklistPage';
import FirmChecklistPage from './FirmChecklistPage';
import GovernmentChecklistPage from './GovernmentChecklistPage';

const AddApplicationForm = () => {
    const [applicationType, setApplicationType] = useState({
        appTypeMasterId: '',
        appType: '',
    });
    const [activeStep, setActiveStep] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [steps, setSteps] = useState([]); // Store steps based on application type

    const navigate = useNavigate();
    const userName = useSelector((state) => state.jwtAuthentication.username);

    const dispatch = useDispatch();
    dispatch(setApplicationDetails({applicationType: applicationType.appTypeMasterId}))

    const formDataInitialState = {
        personalDetails: {},
        addressDetails: {},
        financialDetails: {},
        additionalDetails: {},
        location: {},
        cpsDocumentDetails: {},
        OrganizationalDetails: {},
    };
    const [formData, setFormData] = useState(formDataInitialState);

    const [applicationTypeData, setApplicationTypeData] = useState({});
    useEffect(() => {
        setLoading(true);
        IntentService.getIntentByUserName(userName)
            .then(data => {
                const appData = data.data;
                setApplicationTypeData(appData);

                if (appData && appData.appTypeMasterId) {
                    const appTypeId = appData.appTypeMasterId.appTypeMasterId;
                    setApplicationType({
                        appTypeMasterId: appTypeId,
                        appType: appData.appTypeMasterId.appType,
                    });

                    // Set steps based on app type
                    const stepsList = getStepsByAppType(appTypeId);
                    setSteps(stepsList);
                }

                setActiveStep(0);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching application types:", error);
                setLoading(false);
            });
    }, [userName]);


    useEffect(() => {
        if (userName) {
            console.log(userName);
            setLoading(true);
            ApplicationForm.getApplicationFormByUsername(userName)
                .then((response) => {
                    console.log(response.data);
    
                  
                })
                .catch((err) => {
                    console.log(err);
                    // Handle error (e.g., navigate or display a message)
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            // Handle the case where `userName` is not available
            // Example: navigate('/admin/state', { replace: true });
        }
    }, [userName]); // Include userName in the dependency array

    const getStepsByAppType = (appTypeMasterId) => {
        switch (appTypeMasterId) {
            case 1:
                return [
                    'Personal Details',
                    'Contact Details',
                    'Financial Details',
                    'Additional Details',
                    'Location of Facility',
                    'CPS & Additional Document',
                    'Application Checklist',
                    'Confirmation & Declaration',
                ];
            case 2:
            case 3:
                return [
                    'Firm Details',
                    'Contact Details',
                    'Details Of Partners',
                    'Authorized Representative Details',
                    'Additional Details',
                    'Location of Facility',
                    'CPS & Additional Document',
                    'Application Checklist',
                    'Confirmation & Declaration',
                ];
            case 4:
                return [
                    'Organization Details',
                    'Financial Details',
                    'Location of Facility',
                    'CPS & Additional Document',
                    'Application Checklist',
                    'Confirmation & Declaration',
                ];
            default:
                return [];
        }
    };

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        if (activeStep === 0) {
            navigate("/applicant/applicationform", { replace: true });
        } else {
            setActiveStep(prevActiveStep => prevActiveStep - 1);
        }
    };

    const handleFormDataChange = (data) => {
        setFormData(prevData => ({
            ...prevData,
            ...data,
        }));
    };

    const renderStepContent = (step) => {
        switch (applicationType.appTypeMasterId) {
            case 1:
                return renderIndividualSteps(step);
            case 2:
            case 3:
                return renderFirmOrCompanySteps(step);
            case 4:
                return renderGovernmentAgencySteps(step);
            default:
                return <Typography variant="h6">Unknown step</Typography>;
        }
    };

    const renderIndividualSteps = (step) => {
        switch (step) {
            case 0: return <PersonalDetailsForm handleNext={handleNext} handleFormDataChange={handleFormDataChange} />;
            case 1: return <AddressDetailsForm handleNext={handleNext} handleBack={handleBack} handleFormDataChange={handleFormDataChange} />;
            case 2: return <FinancialDetails handleNext={handleNext} handleBack={handleBack} handleFormDataChange={handleFormDataChange} />;
            case 3: return <AdditionalDetails handleNext={handleNext} handleBack={handleBack} handleFormDataChange={handleFormDataChange} />;
            case 4: return <Location handleNext={handleNext} handleBack={handleBack} />;
            case 5: return <CPSDocumentDetails handleNext={handleNext} handleBack={handleBack} handleFormDataChange={handleFormDataChange} />;
            case 6: return <IndividualChecklistPage handleNext={handleNext} handleBack={handleBack} handleFormDataChange={handleFormDataChange} />;
            case 7: return <Declarization
                handleBack={handleBack}
                handlePreview={handlePreview}
                allCheckboxesChecked={allCheckboxesChecked}
                data={formData}
            />;
            default: return <Typography variant="h6">Unknown step</Typography>;
        }
    };
    const renderFirmOrCompanySteps = (step) => {
        switch (step) {
            case 0: return <FirmDetails handleNext={handleNext} handleFormDataChange={handleFormDataChange}/>; // Update with actual Firm details form
            case 1: return <IncomeTaxDocumentDetails handleNext={handleNext} handleBack={handleBack} handleFormDataChange={handleFormDataChange}/>;
            case 2: return <Partner handleNext={handleNext} handleBack={handleBack} handleFormDataChange={handleFormDataChange}/>;
            case 3: return <AuthorizedRepresentativeDetails handleNext={handleNext} handleBack={handleBack} handleFormDataChange={handleFormDataChange}/>;
            case 4: return <AdditionalDetails handleNext={handleNext} handleBack={handleBack} handleFormDataChange={handleFormDataChange}/>;
            case 5: return <Location handleNext={handleNext} handleBack={handleBack} handleFormDataChange={handleFormDataChange}/>;
            case 6: return <CPSDocumentDetails handleNext={handleNext} handleBack={handleBack} handleFormDataChange={handleFormDataChange}/>;
            case 7: return <FirmChecklistPage handleNext={handleNext} handleBack={handleBack} handleFormDataChange={handleFormDataChange} />;
            case 8: return <FirmDeclarization
                handleBack={handleBack}
                handlePreview={handlePreview}
                allCheckboxesChecked={allCheckboxesChecked}
                data={formData}
            />;
            default: return <Typography variant="h6">Unknown step</Typography>;
        }
    };
    const renderGovernmentAgencySteps = (step) => {
        switch (step) {
            case 0: return <OrganizationalDetails  handleNext={handleNext} handleFormDataChange={handleFormDataChange} />; // Update with actual Government Agency details form
                case 1: return <AdditionalDetails handleNext={handleNext} handleBack={handleBack} handleFormDataChange={handleFormDataChange}/>;
                case 2: return <Location handleNext={handleNext} handleBack={handleBack} handleFormDataChange={handleFormDataChange}/>;
                case 3: return <CPSDocumentDetails handleNext={handleNext} handleBack={handleBack} handleFormDataChange={handleFormDataChange}/>;
                case 4: return <GovernmentChecklistPage handleNext={handleNext} handleBack={handleBack} handleFormDataChange={handleFormDataChange} />;
                case 5: return <GovernmentDeclarization
                    handleBack={handleBack}
                    handlePreview={handlePreview}
                    allCheckboxesChecked={allCheckboxesChecked}
                />;
                default: return <Typography variant="h6">Unknown step</Typography>;
        }
    };
    // Define renderFirmOrCompanySteps and renderGovernmentAgencySteps similarly based on your previous logic

    const handlePreview = () => {
        console.log("Previewing the application...");
    };


    const allCheckboxesChecked = () => {
        return true;
    };

    

    //logout
    // const logout = () => {

    //             dispatch(clearCredentials())
    //             localStorage.removeItem("timers");
    //             navigate("/login",{ replace: true });
                
        
    // }

    return (
        <>
            <LoaderProgress open={isLoading} />
            {/* <TimerApp onTimeout={logout} timeLimit={1800} /> */}

            <FormWrapper wrapperWidth="100%" headingText={`Application Form for ${applicationTypeData?.appTypeMasterId?.appType || '...'}`}>
                {!isLoading && steps.length > 0 && (
                    <Box>
                        <Stepper activeStep={activeStep}>
                            {steps.map((label, index) => (
                                <Step key={index}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        {renderStepContent(activeStep)}
                    </Box>
                )}
            </FormWrapper>
        </>
    );
};

export default AddApplicationForm;
