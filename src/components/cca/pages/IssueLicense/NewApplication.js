import { useEffect, useMemo, useRef, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import {Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ClientService from '../../../../service/NewLicenseService/ClientService';
import showAlert from '../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../global/util/DateFormatter';
import CustomTable from '../../../global/util/CustomTable';
import ApplicationTypeService from '../../../../service/AdminService/ApplicationType'
import LicenseCcaReview from './LicenseCcaReview';
import { hasLicenseAction } from '../../../global/util/licenseAcquisitionWorkflow';

const formatApplicationStatus = (status) => {
    if (!status) {
        return 'NA';
    }
    return String(status)
        .toLowerCase()
        .split('_')
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const NewApplication = () => {
    const [allApplicationList, setAllApplicationList] = useState([]);
    const reviewRef = useRef();



    const getApplicationDetails = async () => {
        try{
            const [applicationTypes, applicationList] = await Promise.all([
                ApplicationTypeService.getAllApplicationTypeList(),
                ClientService.getNewAppWithBankGuaranteeProof('CCA')
            ]);

            const list = (applicationList.data || [])
            .filter((obj) => hasLicenseAction(obj.allowedActions, 'REVIEW_LICENSE'))
            .map((obj, index) => {
                obj['id'] = index + 1;
                obj['applicationInitiatedOn'] = dateFormatter(obj.applicationInitiatedOn);
                obj['statusInitiatedOn'] = dateFormatter(obj.statusInitiatedOn);
                obj['applicationType'] = (applicationTypes.data.find(item=>String(item.appTypeMasterId)===String(obj.applicationType)))?.appType || 
                    (obj.applicationType === "1" ? "Individual" :
                     obj.applicationType === "2" ? "Company" :
                     obj.applicationType === "3" ? "Partnership Firm" :
                     obj.applicationType === "4" ? "Government Organization" : "NA")
                obj['applicationStatusLabel'] = formatApplicationStatus(obj.applicationCurrentStatus);
                return obj;
            });
            setAllApplicationList(list);

        }catch(err){
            showAlert({
                messageTitle: 'Error',
                messageContent: 'Error fetching application list. Please try again later.',
                confirmText: 'OK',
            });
        }

    }


    const reviewLicense = (row) => {
        showAlert({
            messageTitle: 'Review License Details',
            messageContent: (
                <LicenseCcaReview
                    ref={reviewRef}
                    intentAppId={row.intentAppId}
                    applicantUsername={row.applicantUserName}
                    refreshList={getApplicationDetails}
                />
            ),
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true,
            fullWidth: true,
            maxWidth: 'md',
            buttonOneText: 'Approve',
            buttonTwoText: 'Sent to Admin',
            onButtonOneClick: () => reviewRef.current?.approve(),
            onButtonTwoClick: () => reviewRef.current?.sendToAdmin(),
        });
    };



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
            { field: 'applicationStatusLabel', headerName: 'Status', resizable: false, width: 260},

            {
                field: 'action',
                headerName: 'Action',
                resizable: false,
                flex: 1,
                minWidth: 150,
                sortable: false,
                renderCell: (params) => (
                    <>
                        <Tooltip title="Review License Details">
                            <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="Review" onClick={() => reviewLicense(params.row)} />
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
