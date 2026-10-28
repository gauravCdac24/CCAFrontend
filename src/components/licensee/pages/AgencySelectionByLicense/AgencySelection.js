import AnnualAuditScheduleListTable from '../../../global/util/AnnualAuditScheduleListTable';

const AgencySelection = () => (
    <AnnualAuditScheduleListTable
        role="LICENSEE"
        licenseLookup="single"
        detailRouteSuffix="agencyselection/selectauditagency"
        relevantActions={['SELECT_AGENCY', 'UPDATE_AGENCY', 'VIEW']}
    />
);

export default AgencySelection;
