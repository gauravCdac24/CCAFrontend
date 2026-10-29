import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Box, Grid, Typography, InputLabel, TextField } from '@mui/material';
import LoaderProgress from '../../../global/common/LoaderProgress';
import showAlert from '../../../global/common/MessageBox/AlertService';
import FormWrapper from '../../../global/util/FormWrapper';
import LicenseIssuanceService from '../../../../service/LicenseIssuanceService/LicenseIssuanceService';
import dayjs from 'dayjs';

const LicenseCcaReview = forwardRef(({ intentAppId, applicantUsername, refreshList }, ref) => {
    const [details, setDetails] = useState(null);
    const [remark, setRemark] = useState('');
    const [remarkError, setRemarkError] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState('');

    useEffect(() => {
        let active = true;
        setLoading(true);
        LicenseIssuanceService.getLicenseFormDefaults(intentAppId, applicantUsername)
            .then((response) => {
                if (!active) {
                    return;
                }
                const data = response.data || {};
                if (!data.reviewId) {
                    setLoadError('License details have not been submitted for review.');
                    setDetails(null);
                    return;
                }
                setDetails(data);
                setRemark(data.ccaRemark || '');
                setLoadError('');
            })
            .catch((err) => {
                if (!active) {
                    return;
                }
                const data = err.response?.data;
                setLoadError((typeof data === 'string' && data) || 'Unable to load the license details.');
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });
        return () => {
            active = false;
        };
    }, [intentAppId, applicantUsername]);

    const finish = (response) => {
        showAlert({
            messageTitle: 'Review License',
            messageContent: response.data,
            confirmText: 'Ok',
            enableHeaderCloseBtn: false,
            disableOutsideKeyDown: true,
            closeParent: true,
        });
        if (refreshList) {
            refreshList();
        }
    };

    const fail = (err) => {
        const data = err.response?.data;
        showAlert({
            messageTitle: 'Error',
            messageContent: (typeof data === 'string' && data) || err.message || 'Your request cannot be processed at this time.',
            confirmText: 'Ok',
        });
    };

    const approve = () => {
        if (!details?.reviewId) {
            showAlert({
                messageTitle: 'Review License',
                messageContent: loadError || 'License details are not ready for review.',
                confirmText: 'Ok',
            });
            return;
        }
        showAlert({
            messageTitle: 'Confirm',
            messageContent: 'Approve these license details and grant the license to the applicant?',
            confirmText: 'Yes',
            closeText: 'No',
            onConfirm: () => {
                setLoading(true);
                LicenseIssuanceService.approveLicenseReview({ reviewId: details.reviewId, remark })
                    .then(finish)
                    .catch(fail)
                    .finally(() => setLoading(false));
            },
        });
    };

    const sendToAdmin = () => {
        if (!details?.reviewId) {
            showAlert({
                messageTitle: 'Review License',
                messageContent: loadError || 'License details are not ready for review.',
                confirmText: 'Ok',
            });
            return;
        }
        if (!remark || !remark.trim()) {
            setRemarkError('Please enter a remark for the admin.');
            return;
        }
        setRemarkError('');
        showAlert({
            messageTitle: 'Confirm',
            messageContent: 'Send this form and your remark back to admin?',
            confirmText: 'Yes',
            closeText: 'No',
            onConfirm: () => {
                setLoading(true);
                LicenseIssuanceService.sendLicenseReviewToAdmin({ reviewId: details.reviewId, remark: remark.trim() })
                    .then(finish)
                    .catch(fail)
                    .finally(() => setLoading(false));
            },
        });
    };

    useImperativeHandle(ref, () => ({
        approve,
        sendToAdmin,
    }));

    const readOnlyField = (id, label, value, multiline = false) => (
        <Grid item xs={12}>
            <InputLabel shrink={false} htmlFor={id}>
                <Typography variant="body1">{label}</Typography>
            </InputLabel>
            <TextField
                id={id}
                margin="dense"
                fullWidth
                multiline={multiline}
                minRows={multiline ? 6 : undefined}
                value={value || ''}
                size={multiline ? 'medium' : 'small'}
                disabled
            />
        </Grid>
    );

    return (
        <>
            <LoaderProgress open={isLoading} />
            <FormWrapper headingText="Review License Details">
                <Box sx={{ mt: 2, p: 2 }}>
                    {loadError && (
                        <Typography color="error" variant="body2" sx={{ mb: 2 }}>{loadError}</Typography>
                    )}
                    {details && (
                        <Grid container spacing={2} direction="column">
                            <Grid item xs={12}>
                                <Typography variant="body2">
                                    {details.applicationKind === 'RENEWAL' ? 'Renewal application' : 'Fresh application'}
                                    {applicantUsername ? ` — ${applicantUsername}` : ''}
                                </Typography>
                            </Grid>
                            {readOnlyField('serialNo', 'License Serial Number', details.serialNo)}
                            {readOnlyField('issueDate', 'Issue Date', details.issueDate ? dayjs(details.issueDate).format('MM/DD/YYYY') : '')}
                            {readOnlyField('expiryDate', 'Expiry Date', details.expiryDate ? dayjs(details.expiryDate).format('MM/DD/YYYY') : '')}
                            {readOnlyField('publicKey', 'Public Key', details.publicKey, true)}
                            <Grid item xs={12}>
                                <InputLabel shrink={false} htmlFor="remark">
                                    <Typography variant="body1">Remark</Typography>
                                </InputLabel>
                                <TextField
                                    id="remark"
                                    margin="dense"
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    placeholder="Enter your remark"
                                    value={remark}
                                    error={!!remarkError}
                                    helperText={remarkError || ''}
                                    onChange={(e) => {
                                        setRemark(e.target.value);
                                        setRemarkError('');
                                    }}
                                />
                            </Grid>
                        </Grid>
                    )}
                </Box>
            </FormWrapper>
        </>
    );
});

export default LicenseCcaReview;
