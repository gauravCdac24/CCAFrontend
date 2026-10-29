import { useEffect, useMemo, useRef, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ClientService from '../../../../service/NewLicenseService/ClientService';
import showAlert from '../../../global/common/MessageBox/AlertService';
import CustomTable from '../../../global/util/CustomTable';
import IssueLicense from '../../../cca/pages/IssueLicense/IssueLicense';
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

const FillLicenseDetails = () => {
    const [allApplicationList, setAllApplicationList] = useState([]);
    const ref = useRef();

    const getApplicationDetails = async () => {
        try {
            const applicationList = await ClientService.getNewAppWithBankGuaranteeProof();
            const list = (applicationList.data || [])
            .filter((obj) => hasLicenseAction(obj.allowedActions, 'ISSUE_LICENSE'))
            .map((obj, index) => ({
                ...obj,
                id: index + 1,
                applicationStatusLabel: formatApplicationStatus(obj.applicationCurrentStatus),
            }));
            setAllApplicationList(list);
        } catch (err) {
            showAlert({
                messageTitle: 'Error',
                messageContent: 'Error fetching application list. Please try again later.',
                confirmText: 'OK',
            });
        }
    };

    const handleSubmitDocuments = () => {
        ref.current?.handleFormSubmit();
    };

    const handleResetForm = () => {
        ref.current?.handleReset();
    };

    const openFillLicenseDetails = (row) => {
        if (!hasLicenseAction(row.allowedActions, 'ISSUE_LICENSE')) {
            showAlert({
                messageTitle: 'Fill License Details',
                messageContent: 'License details cannot be filled for this application.',
                confirmText: 'Ok',
            });
            return;
        }

        showAlert({
            messageTitle: 'License Details',
            messageContent: (
                <IssueLicense
                    ref={ref}
                    intentAppId={row.intentAppId}
                    applicantName={row.applicantUserName}
                    applicantUsername={row.applicantUserName}
                    refreshList={getApplicationDetails}
                />
            ),
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true,
            fullWidth: true,
            maxWidth: 'md',
            buttonOneText: 'Submit',
            buttonTwoText: 'Reset',
            onButtonOneClick: () => handleSubmitDocuments(),
            onButtonTwoClick: () => handleResetForm(),
        });
    };

    useEffect(() => {
        getApplicationDetails();
    }, []);

    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'SI No', resizable: false, width: 90 },
            { field: 'applicantUserName', headerName: 'Username', resizable: false, width: 220 },
            { field: 'applicationStatusLabel', headerName: 'Status of application', resizable: false, width: 280 },
            {
                field: 'action',
                headerName: 'Action',
                resizable: false,
                flex: 1,
                minWidth: 120,
                sortable: false,
                renderCell: (params) => (
                    <Tooltip title="Fill License Details">
                        <GridActionsCellItem
                            icon={<VisibilityIcon color="success" />}
                            label="View"
                            onClick={() => openFillLicenseDetails(params.row)}
                        />
                    </Tooltip>
                ),
            },
        ],
        [allApplicationList]
    );

    return (
        <CustomTable
            columns={columns}
            rows={allApplicationList}
            hideColumnsForExport={['Action']}
            pageSizeOptions={[10, 25, 50, 100]}
        />
    );
};

export default FillLicenseDetails;
