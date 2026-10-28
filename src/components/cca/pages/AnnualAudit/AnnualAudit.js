import AnnualAuditScheduleListTable from '../../../global/util/AnnualAuditScheduleListTable';

const AnnualAudit = () => (
    <AnnualAuditScheduleListTable
        role="CCA"
        contextId="CCA"
        detailRouteSuffix="uploadannualundertakings/annualauditreports"
        relevantActions={['APPROVE_SCOPE', 'VIEW']}
        showSerialNo
    />
);

export default AnnualAudit;
