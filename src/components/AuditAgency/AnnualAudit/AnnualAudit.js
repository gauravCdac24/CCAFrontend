import AnnualAuditScheduleListTable from '../../global/util/AnnualAuditScheduleListTable';

const AnnualAudit = () => (
    <AnnualAuditScheduleListTable
        role="AUDIT_AGENCY"
        detailRouteSuffix="uploadannualundertaking/annualauditreport"
        relevantActions={['SUBMIT_UNDERTAKING', 'SUBMIT_REPORT', 'VIEW']}
        showSerialNo
    />
);

export default AnnualAudit;
