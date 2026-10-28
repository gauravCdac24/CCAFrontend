import AnnualAuditScheduleListTable from '../../global/util/AnnualAuditScheduleListTable';

const ViewApplicationForm = () => (
    <AnnualAuditScheduleListTable
        role="REVIEW_COMMITTEE"
        contextId="REVIEW_COMMITTEE"
        detailRouteSuffix="reviewannualncreport/reviewannualncreports"
        relevantActions={['REVIEW', 'VIEW']}
        showSerialNo
    />
);

export default ViewApplicationForm;
