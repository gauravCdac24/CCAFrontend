import { useEffect, useMemo, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VerifiedIcon from '@mui/icons-material/Verified';
import showAlert from '../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../global/util/DateFormatter';
import CustomTable from '../../../global/util/CustomTable';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { encrypt } from '../../../global/util/EncryptDecrypt';
import { hasLicenseAction } from '../../../global/util/licenseAcquisitionWorkflow';
import ApplicationForm from '../../../../service/NewLicenseService/ApplicationForm';

const PaymentVerification = () => {
    const [allApplicationList, setAllApplicationList] = useState([]);
    const navigate = useNavigate();
    const routeRootPath = useSelector((state) => state.jwtAuthentication.rolePath);

    const getAllApplications = async () => {
        try {
            const response = await ApplicationForm.getAllApplications();
            const data = Array.isArray(response?.data) ? response.data : [];
            const list = data.map((obj, index) => ({
                ...obj,
                id: index + 1,
                created: dateFormatter(obj.created),
                allowedActions: obj.allowedActions || [],
            }));
            setAllApplicationList(list);
            if (list.length === 0) {
                showAlert({
                    messageTitle: 'No applications',
                    messageContent: 'No applications are pending payment proof verification.',
                    confirmText: 'OK',
                });
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            setAllApplicationList([]);
            showAlert({
                messageTitle: 'Error',
                messageContent: error.response?.data && typeof error.response.data === 'string'
                    ? error.response.data
                    : 'Unable to load payment verification applications. Please try again.',
                confirmText: 'OK',
            });
        }
    };

    const handlePaymentProofForm = (intentAppId) => {
        const encryptedId = encodeURIComponent(encrypt(intentAppId));
        navigate(`${routeRootPath}/paymentverification/paymentProofs/${encryptedId}`);
    };

    useEffect(() => {
        getAllApplications();
    }, []);

    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false },
            { field: 'userName', headerName: 'Applicant Username', resizable: false, width: 150 },
            { field: 'created', headerName: 'Application Start Date', resizable: false, width: 150 },
            { field: 'applicationStatus', headerName: 'Application Status', resizable: false, width: 150 },
            {
                field: 'action',
                headerName: 'Action',
                resizable: false,
                flex: 1,
                minWidth: 150,
                sortable: false,
                renderCell: (params) => {
                    const actions = params.row.allowedActions || [];
                    if (hasLicenseAction(actions, 'VERIFY_PAYMENT')) {
                        return (
                            <Tooltip title="Verify Payment">
                                <GridActionsCellItem
                                    //icon={<VerifiedIcon color="primary" />}
                                    icon={<VisibilityIcon color="success" />}
                                    label="Verify"
                                    onClick={() => handlePaymentProofForm(params.row.intentAppId)}
                                />
                            </Tooltip>
                        );
                    }
                    if (hasLicenseAction(actions, 'VIEW')) {
                        return (
                            <Tooltip title="View">
                                <GridActionsCellItem
                                    icon={<VisibilityIcon color="success" />}
                                    label="View"
                                    onClick={() => handlePaymentProofForm(params.row.intentAppId)}
                                />
                            </Tooltip>
                        );
                    }
                    return null;
                },
            },
        ],
        []
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

export default PaymentVerification;
