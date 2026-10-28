import showAlert from '../../../global/common/MessageBox/AlertService';
import AnnualAuditScheduleListTable from '../../../global/util/AnnualAuditScheduleListTable';
import AnnualAuditStartDate from './AnnualAuditStartDate';

const AnnualAudit = () => {
    const handleCustomAction = (row, actionKey) => {
        if (actionKey === 'VIEW') {
            showAlert({
                messageTitle: 'Annual Audit Schedule',
                messageContent: (
                    <AnnualAuditStartDate
                        userName={row.userName}
                        auditScheduleId={row.auditScheduleId}
                        scheduleStartDate={row.scheduleStartDate}
                        auditStatus={row.auditStatus}
                        readOnly={row.readOnly === true}
                    />
                ),
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
                fullWidth: true,
                maxWidth: 'md',
            });
        }
    };

    return (
        <AnnualAuditScheduleListTable
            role="CCA_OFFICER"
            contextId="CCA_OFFICER"
            relevantActions={['VIEW']}
            showSerialNo
            onCustomAction={handleCustomAction}
        />
    );
};

export default AnnualAudit;
