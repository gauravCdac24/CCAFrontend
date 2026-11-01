import AnnualAuditScheduleListTable from '../../global/util/AnnualAuditScheduleListTable';

const AnnualAudit = () => (
    <AnnualAuditScheduleListTable
        role="AUDIT_AGENCY"
        detailRouteSuffix="annualncaudit/uploadnccontrol"
        relevantActions={['FILL_NC', 'VIEW']}
        showSerialNo
    />
);

export default AnnualAudit;
