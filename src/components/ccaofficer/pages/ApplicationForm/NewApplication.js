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
import BankGuranteeProof, { findGrantApprovalValue } from '../BankGuaranteeProofDoc/BankGuaranteeProof';
import ApplicationForm from '../../../../service/NewLicenseService/ApplicationForm';
import { hasLicenseAction } from '../../../global/util/licenseAcquisitionWorkflow';

const NewApplication = () => {
    const [allApplicationList, setAllApplicationList] = useState([]);
    const [allApplicationType, setAllApplicationType] = useState([]);

    const ref = useRef();


    const getApplicationDetails = async () => {
        try{
            const [applicationTypes, applicationList] = await Promise.all([
                ApplicationTypeService.getAllApplicationTypeList(),
                ClientService.getAllAppWithRequiredDocuments()
            ]);

            const list = applicationList.data.map((obj, index) => {
                obj['id'] = index + 1;
                obj['applicationInitiatedOn'] = dateFormatter(obj.applicationInitiatedOn);
                obj['statusInitiatedOn'] = dateFormatter(obj.statusInitiatedOn);
                obj['applicationType'] = (applicationTypes.data.find(item=>item.appTypeMasterId===parseInt(obj.applicationType)))?.appType || 'NA'
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

    const submitBankGuranteeProof = async (intentAppId, applicantUsername) => {
        let grantApprovalOn = '';
        const username = String(applicantUsername || '').trim();
        if (username) {
            try {
                const response = await ApplicationForm.getAllApplicationTimelineList(username);
                grantApprovalOn = findGrantApprovalValue(response.data);
            } catch (err) {
                grantApprovalOn = '';
            }
        }

        showAlert({
            messageTitle: 'Bank Guarantee Proof',
            messageContent: <BankGuranteeProof ref={ref} intentAppId={intentAppId} applicantUsername={username} grantApprovalOn={grantApprovalOn} refreshApplication={getApplicationDetails}/>,
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true,
            buttonOneText: "Submit",
            buttonTwoText: "Reset",
            onButtonOneClick: () => handleSubmitDocuments(),
            onButtonTwoClick: () => handleResetForm()

        })
    }




    
    const viewApplication = (username, apptype, status, intentAppId, allowedActions = []) =>{

        let component = null;
        switch (apptype) {
            case 'Individual':
                component = <IndividualViewData  userName={username}/>;
                
            break;  
            case 'Company':
            case 'Partnership Firm':
                component =  <FirmViewData  userName={username}/>;
            break;
            case 'Government Agency':
                component =  <GovernmentViewData  userName={username}/>;
            break;
            default:
                component = <>No Data Available</>
            break;
        }
                showAlert({
                    messageTitle: 'View Application',
                    messageContent: component,
                    buttonOneText: hasLicenseAction(allowedActions, 'VERIFY_BANK_GUARANTEE') ? 'Submit Bank Gurantee Proof' : 'Ok',
                    onButtonOneClick: hasLicenseAction(allowedActions, 'VERIFY_BANK_GUARANTEE') ? () => submitBankGuranteeProof(intentAppId, username) : undefined,
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: true,
                    maxWidth:'md',
                    fullWidth:true
        })

    
}



    useEffect(() => {
        getApplicationDetails();
    }, []);


    const columns =  [
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
                            <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="View" onClick={() => viewApplication(params.row.applicantUserName, params.row.applicationType, params.row.applicationCurrentStatus, params.row.intentAppId, params.row.allowedActions)} />
                        </Tooltip>
                        
                    </>
                ),
            },
        ]
        
    

    return (
        <>
            <CustomTable columns={columns} rows={allApplicationList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />
        </>
    );
};

export default NewApplication;
