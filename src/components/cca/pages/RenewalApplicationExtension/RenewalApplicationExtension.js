import { useEffect, useRef, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import showAlert from '../../../global/common/MessageBox/AlertService';
import CustomTable from '../../../global/util/CustomTable';
import LoaderProgress from '../../../global/common/LoaderProgress';
import LicenseIssuanceService from '../../../../service/LicenseIssuanceService/LicenseIssuanceService';
import RenewalExtensionForm from './RenewalExtensionForm';

const RenewalApplicationExtension = () => {
    const [rows, setRows] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const formRef = useRef();

    const getCandidates = () => {
        setLoading(true);
        LicenseIssuanceService.getRenewalExtensionCandidates()
            .then((response) => {
                const list = (response.data || []).map((obj, index) => ({
                    ...obj,
                    id: index + 1,
                    applicantName: obj.applicantName || obj.caName || obj.licenseName || obj.userName || '',
                }));
                setRows(list);
            })
            .catch(() => {
                setRows([]);
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error fetching the renewal application extension list. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => setLoading(false));
    };

    const openExtension = (row) => {
        showAlert({
            messageTitle: 'Renewal application extension',
            messageContent: (
                <RenewalExtensionForm
                    ref={formRef}
                    details={row}
                    refreshList={getCandidates}
                />
            ),
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true,
            fullWidth: true,
            maxWidth: 'sm',
            buttonOneText: 'Submit',
            onButtonOneClick: () => formRef.current?.submit(),
        });
    };

    useEffect(() => {
        getCandidates();
    }, []);

    const columns = [
        { field: 'id', headerName: 'Sl. No.', resizable: false, width: 90 },
        { field: 'userName', headerName: 'Username', resizable: false, width: 180 },
        { field: 'applicantName', headerName: 'Applicant Name', resizable: false, width: 220 },
        {
            field: 'action',
            headerName: 'Action',
            resizable: false,
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <Tooltip title="View">
                    <GridActionsCellItem
                        icon={<VisibilityIcon color="success" />}
                        label="View"
                        onClick={() => openExtension(params.row)}
                    />
                </Tooltip>
            ),
        },
    ];

    return (
        <>
            <LoaderProgress open={isLoading} />
            <CustomTable
                columns={columns}
                rows={rows}
                hideColumnsForExport={['Action']}
                pageSizeOptions={[10, 25, 50, 100]}
            />
        </>
    );
};

export default RenewalApplicationExtension;
