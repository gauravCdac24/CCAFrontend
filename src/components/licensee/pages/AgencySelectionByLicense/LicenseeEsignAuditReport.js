import { useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import AnnualAuditService from '../../../../service/AnnualAuditService/AnnualAuditService';
import showAlert from '../../../global/common/MessageBox/AlertService';
import LoaderProgress from '../../../global/common/LoaderProgress';
import FormWrapper from '../../../global/util/FormWrapper';
import useAnnualAuditRoute from '../../../global/util/useAnnualAuditRoute';
import Esign from '../../../global/pages/Esign';
import CallComponent from '../../../global/common/CallComponent/CallComponent';

const LicenseeEsignAuditReport = () => {
    const { userName } = useAnnualAuditRoute();
    const signerName = useSelector((state) => state.jwtAuthentication.name);
    const routeRootPath = useSelector((state) => state.jwtAuthentication.rolePath);
    const [loading, setLoading] = useState(false);

    const startEsign = async () => {
        if (!userName) {
            showAlert({
                messageTitle: 'Error',
                messageContent: 'Unable to identify the licensee for this audit.',
                confirmText: 'Ok',
            });
            return;
        }
        setLoading(true);
        try {
            const response = await AnnualAuditService.downloadAuditorReport(userName);
            const file = new File([response.data], 'AnnualAuditReport.pdf', { type: 'application/pdf' });
            CallComponent({
                component: (
                    <Esign
                        efile={file}
                        fullName={(signerName || userName).trim()}
                        maxFileSize={15}
                        serviceName="/annual-audit-service"
                        serviceUrl="/licensee-esign-audit-report"
                        documentPath="/AnnualAuditReport"
                        orgFileId={userName}
                        redirectUrl={`${routeRootPath}/agencyselection`}
                    />
                ),
            });
        } catch (err) {
            showAlert({
                messageTitle: 'Error',
                messageContent: 'Unable to prepare the audit report for eSign. Please try again.',
                confirmText: 'Ok',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <LoaderProgress open={loading} />
            <FormWrapper heading="eSign Annual Audit Report">
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Typography sx={{ mb: 2 }}>
                        The audit agency has verified the action-taken report. Digitally sign the annual audit report.
                        After you sign, the Report Review Committee reviews the report, the non-conformities, and the action-taken report.
                    </Typography>
                    <Box>
                        <Button variant="contained" onClick={startEsign} disabled={loading || !userName}>
                            eSign Audit Report
                        </Button>
                    </Box>
                </Paper>
            </FormWrapper>
        </>
    );
};

export default LicenseeEsignAuditReport;
