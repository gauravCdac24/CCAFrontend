import { useEffect, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import showAlert from '../common/MessageBox/AlertService';
import dateFormatter from './DateFormatter';
import CustomTable from './CustomTable';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LicenseIssuanceService from '../../../service/LicenseIssuanceService/LicenseIssuanceService';
import AnnualAuditService from '../../../service/AnnualAuditService/AnnualAuditService';
import { encrypt } from './EncryptDecrypt';

const ACTION_CONFIG = {
    SELECT_AGENCY: { label: 'Select', title: 'Select Audit Agency', color: 'success' },
    UPDATE_AGENCY: { label: 'Update', title: 'Update Audit Agency', color: 'primary' },
    SUBMIT_UNDERTAKING: { label: 'Submit', title: 'Submit Undertaking', color: 'success' },
    SUBMIT_REPORT: { label: 'Submit Report', title: 'Submit Audit Report', color: 'success' },
    VERIFY_NC: { label: 'Verify NC', title: 'Verify Non-Conformance', color: 'primary' },
    APPROVE_SCOPE: { label: 'Approve', title: 'Approve Audit Scope', color: 'primary' },
    REVIEW: { label: 'Review', title: 'Review Annual Audit', color: 'primary' },
    VIEW: { label: 'View', title: 'View', color: 'action' },
};

const AnnualAuditScheduleListTable = ({
    role,
    contextId,
    detailRouteSuffix,
    relevantActions,
    onCustomAction,
    showSerialNo = false,
    licenseLookup = 'all',
}) => {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const routeRootPath = useSelector((state) => state.jwtAuthentication.rolePath);
    const loggedInUser = useSelector((state) => state.jwtAuthentication.username);

    const loadRows = () => {
        const scheduleRequestId = contextId || loggedInUser;
        const licenseRequest =
            licenseLookup === 'single'
                ? LicenseIssuanceService.getLicenseDetailsByUserName(scheduleRequestId)
                : LicenseIssuanceService.getAllLicenseDetails();

        Promise.all([
            licenseRequest,
            AnnualAuditService.getAnnualAuditScheduleList(scheduleRequestId, role),
        ])
            .then(([licenseResponse, schedulesResponse]) => {
                const licenseData = licenseResponse.data || {};
                const licenseList = Array.isArray(licenseData) ? licenseData : [licenseData];
                const licenseByUser = licenseList.reduce((acc, license) => {
                    if (license?.userName) {
                        acc[license.userName] = license;
                    }
                    return acc;
                }, {});

                const schedules = schedulesResponse.data || [];
                const formattedRows = schedules.map((schedule, index) => {
                    const license = licenseByUser[schedule.userName] || {};
                    return {
                        id: schedule.auditScheduleId || `row-${index + 1}`,
                        slNo: index + 1,
                        auditScheduleId: schedule.auditScheduleId,
                        userName: schedule.userName,
                        serialNo: license.serialNo || '-',
                        issueDate: license.issueDate ? dateFormatter(license.issueDate) : '-',
                        expiryDate: license.expiryDate ? dateFormatter(license.expiryDate) : '-',
                        status: license.status || '-',
                        scheduleStartDate: schedule.scheduleStartDate
                            ? dateFormatter(schedule.scheduleStartDate)
                            : '-',
                        auditStatus: schedule.status || '-',
                        agencySelected: schedule.agencySelected,
                        scheduleState: schedule.scheduleState,
                        currentStep: schedule.currentStep,
                        readOnly: schedule.readOnly,
                        allowedActions: schedule.allowedActions || [],
                    };
                });

                setRows(formattedRows);
            })
            .catch(() => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error fetching annual audit schedules. Please try again later.',
                    confirmText: 'OK',
                });
            });
    };

    useEffect(() => {
        loadRows();
    }, [role, contextId]);

    const resolveAction = (row) => {
        const actions = row.allowedActions || [];
        const actionPriority = relevantActions || Object.keys(ACTION_CONFIG);
        const matched = actionPriority.find((action) => actions.includes(action));
        if (!matched) {
            return null;
        }
        return { actionKey: matched, ...ACTION_CONFIG[matched] };
    };

    const navigateToDetail = (row, actionKey) => {
        if (!row?.userName || !row?.auditScheduleId) {
            showAlert({
                messageTitle: 'Error',
                messageContent: 'Unable to open annual audit details. Please try again later.',
                confirmText: 'Ok',
            });
            return;
        }

        const routeId = `${row.userName},${row.auditScheduleId}`;
        const encryptedId = encodeURIComponent(encrypt(routeId));
        navigate(`${routeRootPath}/${detailRouteSuffix}/${encryptedId}`, {
            state: {
                readOnly: row.readOnly === true && actionKey === 'VIEW',
                auditScheduleId: row.auditScheduleId,
            },
        });
    };

    const handleAction = (row) => {
        const resolved = resolveAction(row);
        if (!resolved) {
            return;
        }

        if (onCustomAction) {
            onCustomAction(row, resolved.actionKey, resolved);
            return;
        }

        navigateToDetail(row, resolved.actionKey);
    };

    const columns = [
        { field: 'slNo', headerName: 'Sl. No.', resizable: false, width: 70 },
        { field: 'userName', headerName: 'Licensee Username', resizable: false, width: 150 },
        ...(showSerialNo
            ? [{ field: 'serialNo', headerName: 'Serial No', resizable: false, width: 120 }]
            : []),
        { field: 'issueDate', headerName: 'License Issue Date', resizable: false, width: 150 },
        { field: 'expiryDate', headerName: 'Licensee Expiry Date', resizable: false, width: 150 },
        { field: 'status', headerName: 'License Status', resizable: false, width: 130 },
        { field: 'scheduleStartDate', headerName: 'Annual Audit Start Date', resizable: false, width: 170 },
        { field: 'auditStatus', headerName: 'Audit Schedule Status', resizable: false, width: 170 },
        {
            field: 'action',
            headerName: 'Action',
            resizable: false,
            width: 150,
            renderCell: (params) => {
                const resolved = resolveAction(params.row);
                if (!resolved) {
                    return null;
                }

                return (
                    <Tooltip title={resolved.title}>
                        <GridActionsCellItem
                            icon={<VisibilityIcon color={resolved.color} />}
                            label={resolved.label}
                            onClick={() => handleAction(params.row)}
                        />
                    </Tooltip>
                );
            },
        },
    ];

    return (
        <CustomTable
            columns={columns}
            rows={rows}
            hideColumnsForExport={['Action']}
            pageSizeOptions={[10, 25, 50, 100]}
        />
    );
};

export default AnnualAuditScheduleListTable;
