import { useEffect, useMemo, useState } from 'react';
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
import LicenseIssuanceService from '../../../../service/LicenseIssuanceService/LicenseIssuanceService'

const NewApplication = () => {
    const [allApplicationList, setAllApplicationList] = useState([]);
    const [allApplicationType, setAllApplicationType] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const getApplicationDetails = async () => {
        try{
            const [applicationTypes, applicationList] = await Promise.all([
                ApplicationTypeService.getAllApplicationTypeList(),
                ClientService.getAllRecommendedNewApplication()
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

    const inprincipleApprovalGrant = (intentAppId, applicantUsername) =>{

        setLoading(true);
        LicenseIssuanceService.grantInLicneseApproval(intentAppId, applicantUsername)
        .then((response)=>{

            getApplicationDetails();

            showAlert({
                messageTitle: 'Success',
                messageContent: 'In-principle approval has been granted successfully.',
                confirmText: 'OK',
                disableOutsideKeyDown: true,
                closeParent: true,
                enableHeaderCloseBtn: false,
            });
            
        }).catch((err)=>{

            showAlert({
                messageTitle: 'Error',
                messageContent: 'Error in granting In-principle approval. Please try again later.',
                confirmText: 'OK',
                disableOutsideKeyDown: true,
                enableHeaderCloseBtn: false,
            });

        }).finally(()=>{
            setLoading(false);
        })


    }

    const grantInPrincipleApproval = (intentAppId, applicantUsername) => {

        showAlert({
            messageTitle: 'Alert',
            messageContent: "Are you sure, you want to grant In-Principle approval?",
            confirmText: 'Yes',
            closeText: 'No',
            onConfirm: () => inprincipleApprovalGrant(intentAppId, applicantUsername),
            enableHeaderCloseBtn: false,
            disableOutsideKeyDown: true,
})
            
       

    }


    

    
    const viewApplication = (username, apptype, status, intentAppId) =>{

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
                    buttonOneText: status==='Recommended for In Principle Approval'?'Grant In-Principle Approval':'Ok',
                    onButtonOneClick: status==='Recommended for In Principle Approval'?() => grantInPrincipleApproval(intentAppId, username):'',
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
