import AnnualAuditScheduleListTable from '../../global/util/AnnualAuditScheduleListTable';

const AnnualAudit = () => (
    <AnnualAuditScheduleListTable
        role="AUDIT_AGENCY"
        detailRouteSuffix="ncreports/nccloserreports"
        relevantActions={['VERIFY_NC', 'VIEW']}
        showSerialNo
    />
);

export default AnnualAudit;
