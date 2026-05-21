import { useEffect, useMemo, useRef, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import {Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ClientService from '../../../../service/NewLicenseService/ClientService';
import showAlert from '../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../global/util/DateFormatter';
import CustomTable from '../../../global/util/CustomTable';
import ApplicationTypeService from '../../../../service/AdminService/ApplicationType'
import IndividualViewData from '../../../applicant/pages/ApplicationForm/IndividualViewData';
import FirmViewData from '../../../applicant/pages/ApplicationForm/FirmViewData';
import GovernmentViewData from '../../../applicant/pages/ApplicationForm/GovernmentViewData';
import IssueLicense from './IssueLicense';
import FirmApplicationForm from '../../../../service/NewLicenseService/FirmApplicationForm';
import ApplicationForm from '../../../../service/NewLicenseService/ApplicationForm';
import GovernmentAgencyForm from '../../../../service/NewLicenseService/GovernmentAgencyForm';

const NewApplication = () => {
    const [allApplicationList, setAllApplicationList] = useState([]);
    const [allApplicationType, setAllApplicationType] = useState([]);
    const [isLoading, setLoading] = useState(false);



    const ref = useRef();


    const getApplicationDetails = async () => {
        try{
            const [applicationTypes, applicationList] = await Promise.all([
                ApplicationTypeService.getAllApplicationTypeList(),
                ClientService.getNewAppWithBankGuaranteeProof()
            ]);

            const list = applicationList.data.map((obj, index) => {
                obj['id'] = index + 1;
                obj['applicationInitiatedOn'] = dateFormatter(obj.applicationInitiatedOn);
                obj['statusInitiatedOn'] = dateFormatter(obj.statusInitiatedOn);
                obj['applicationType'] = (applicationTypes.data.find(item=>String(item.appTypeMasterId)===String(obj.applicationType)))?.appType || 
                    (obj.applicationType === "1" ? "Individual" :
                     obj.applicationType === "2" ? "Company" :
                     obj.applicationType === "3" ? "Partnership Firm" :
                     obj.applicationType === "4" ? "Government Organization" : "NA")
                return obj;
            });
            setAllApplicationList(list);
            setAllApplicationType(applicationTypes.data);

        }catch(err){
            showAlert({
                messageTitle: 'Error',
                messageContent: 'Error fetching application list. Please try again later.',
                confirmText: 'OK',
            });
        }

    }


    const handleSubmitDocuments = () =>{
        ref.current.handleFormSubmit()
    }

    const handleResetForm = () =>{
        ref.current.handleReset()
    }


    const submitLicenseDetails = (intentAppId, applicantUsername, applicantName) => {

        if(applicantName === null)
            return;

        showAlert({
            messageTitle: 'License Details',
            messageContent: <IssueLicense ref={ref} intentAppId={intentAppId} applicantName={applicantName} applicantUsername={applicantUsername} refreshList={getApplicationDetails}/>,
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true,
            buttonOneText: "Submit",
            buttonTwoText: "Reset",
            onButtonOneClick: () => handleSubmitDocuments(),
            onButtonTwoClick: () => handleResetForm()

        })
    }


    const getFirmName = async(username) => {

        try{
            const res = await FirmApplicationForm.getAllFirmApplication(username);

            

            if (!res.data || !res.data.appFirmApplication) {
                return null;
            }

            return res.data.appFirmApplication.officeName;
        }catch(err){
            return null;
        }

    }

    const getIndividualName = async (username) => {
        try {
            const res = await ApplicationForm.getApplicationFormByUsername(username);
    
            if (!res.data || !res.data.application) {
                return null;
            }
    
            const { firstName1, middleName1, lastName1 } = res.data.application;
            const name = `${firstName1 || ''} ${middleName1 || ''} ${lastName1 || ''}`.trim();
    
            return name || null;
        } catch (err) {
            
            return null;
        }
    };


    const getOrganizationName = async(username) => {

        try{
            const res = await GovernmentAgencyForm.getAllGovernmentAgency(username);

            if (!res.data || !res.data.appGovtOrganizationApplication) {
                return null;
            }

            return res.data.appGovtOrganizationApplication.orgName;
        }catch(err){
            return null;
        }

    }
    
    
    const viewApplication = async (username, apptype, status, intentAppId) =>{

        let component = null;

        let applicantName = null;

        switch (apptype) {
            case 'Individual':
                applicantName = await getIndividualName(username);
                component = <IndividualViewData  userName={username}/>;
                
            break;  
            case 'Company':
            case 'Partnership Firm':
                applicantName = await getFirmName(username);
                component =  <FirmViewData  userName={username}/>;
                

            break;
            case 'Government Agency':
                applicantName = await getOrganizationName(username);
                component =  <GovernmentViewData  userName={username}/>;
                

            break;
            default:
                component = <>No Data Available</>
            break;
        }
                showAlert({
                    messageTitle: 'View Application',
                    messageContent: component,
                    buttonOneText: status==='BANK_GUARANTEE_PROOF_UPLOADED'?'Submit License Details':'Ok',
                    onButtonOneClick: status==='BANK_GUARANTEE_PROOF_UPLOADED'?() => submitLicenseDetails(intentAppId, username, applicantName):'',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: true,
                    maxWidth:'md',
                    fullWidth:true
        })

    
}



    useEffect(() => {
        getApplicationDetails();
    }, []);


    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false },
            { field: 'applicationType', headerName: 'Application Type', resizable: false, width: 200},
            { field: 'applicantUserName', headerName: 'Applicant Username', resizable: false, width: 200},
            { field: 'acknowledgementNo', headerName: 'Acknowledgement Number', resizable: false, width: 200},
            { field: 'applicationInitiatedOn', headerName: 'Application Start Date', resizable: false, width: 200},
            { field: 'statusInitiatedOn', headerName: 'Recommended On', resizable: false, width: 200},

            {
                field: 'action',
                headerName: 'Action',
                resizable: false,
                flex: 1,
                minWidth: 150,
                sortable: false,
                renderCell: (params) => (
                    <>
                        <Tooltip title="View">
                            <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="View" onClick={() => viewApplication(params.row.applicantUserName, params.row.applicationType, params.row.applicationCurrentStatus, params.row.intentAppId)} />
                        </Tooltip>
                        
                    </>
                ),
            },
        ],
        [allApplicationList] 
    );

    return (
        <>
            <CustomTable columns={columns} rows={allApplicationList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />
        </>
    );
};

export default NewApplication;
