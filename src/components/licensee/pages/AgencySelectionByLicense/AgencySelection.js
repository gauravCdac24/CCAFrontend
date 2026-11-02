import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AnnualAuditScheduleListTable from '../../../global/util/AnnualAuditScheduleListTable';
import { encrypt } from '../../../global/util/EncryptDecrypt';

const AgencySelection = () => {
    const navigate = useNavigate();
    const routeRootPath = useSelector((state) => state.jwtAuthentication.rolePath);

    const handleAction = (row, actionKey) => {
        if (!row?.userName || !row?.auditScheduleId) {
            return;
        }
        const routeId = `${row.userName},${row.auditScheduleId}`;
        const encryptedId = encodeURIComponent(encrypt(routeId));
        if (actionKey === 'ESIGN_REPORT') {
            navigate(`${routeRootPath}/agencyselection/esignauditreport/${encryptedId}`);
            return;
        }
        navigate(`${routeRootPath}/agencyselection/selectauditagency/${encryptedId}`, {
            state: {
                readOnly: row.readOnly === true && actionKey === 'VIEW',
                auditScheduleId: row.auditScheduleId,
            },
        });
    };

    return (
        <AnnualAuditScheduleListTable
            role="LICENSEE"
            licenseLookup="single"
            detailRouteSuffix="agencyselection/selectauditagency"
            relevantActions={['ESIGN_REPORT', 'SELECT_AGENCY', 'UPDATE_AGENCY', 'VIEW']}
            onCustomAction={handleAction}
        />
    );
};

export default AgencySelection;
