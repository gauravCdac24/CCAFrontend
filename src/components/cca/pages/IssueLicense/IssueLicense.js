import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Box, Grid, Typography, InputLabel, TextField } from '@mui/material';
import Captcha from '../../../global/util/Captcha';
import LoaderProgress from '../../../global/common/LoaderProgress';
import showAlert from '../../../global/common/MessageBox/AlertService';
import FormWrapper from '../../../global/util/FormWrapper';
import LicenseIssuanceService from '../../../../service/LicenseIssuanceService/LicenseIssuanceService';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const certificateMarker = (line) => line.replace(/-/g, '').trim();

const hasCertificateEnvelope = (value) => {
    const lines = String(value)
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .split('\n')
        .map(certificateMarker)
        .filter((line) => line.length > 0);
    return lines.length >= 2
        && lines[0] === 'BEGIN CERTIFICATE'
        && lines[lines.length - 1] === 'END CERTIFICATE';
};

const errorMsg = {
    publicKey: {
        blank: 'Please enter the public key.',
        envelope: 'The first line of the public key must be -----BEGIN CERTIFICATE----- and the last line must be -----END CERTIFICATE-----.',
    },
    issueDate: {
        blank: 'Please select issue date.',
        missingApproval: 'In-principle approval date is not available for this application.',
    },
    expiryDate: {
        blank: 'Expiry date must be 5 years from the issue date.',
    },
    serialNo: {
        blank: 'License serial number could not be generated.',
        length: 'The length must be 24 characters.',
    },
    captchaError: {
        blank: 'Please enter captcha.',
    },
};

const pad = (value, width) => String(value).padStart(width, '0');

export const buildLicenseSerial = ({ issueDate, expiryDate, caSerial, keySequence }) => {
    if (issueDate == null || issueDate === '' || expiryDate == null || expiryDate === ''
        || caSerial == null || keySequence == null) {
        return '';
    }
    const issue = dayjs(issueDate);
    const expiry = dayjs(expiryDate);
    if (!issue.isValid() || !expiry.isValid()) {
        return '';
    }
    return `${issue.format('YYYY')}${pad(caSerial, 4)}${expiry.format('DDMMYY')}${pad(keySequence, 3)}0000000`;
};

const expiryFromIssue = (issueDate) => {
    if (!issueDate) {
        return '';
    }
    const issue = dayjs(issueDate);
    return issue.isValid() ? issue.add(5, 'year').format('YYYY-MM-DD') : '';
};

const IssueLicense = forwardRef(({ intentAppId, applicantName, applicantUsername, refreshList }, ref) => {
    const [requiredDoc, setRequiredDoc] = useState({
        intentAppId,
        applicantUsername,
        applicantName,
        issueDate: '',
        expiryDate: '',
        serialNo: '',
        publicKey: '',
        applicationKind: '',
        previousSerialNo: '',
        caSerial: null,
        keySequence: null,
        rootCaKeyCount: 0,
        ccaRemark: '',
        issueDateEditable: false,
    });
    const [initialDoc, setInitialDoc] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState('');

    const applyDefaults = (data) => {
        const issueDate = data?.issueDate || '';
        const expiryDate = expiryFromIssue(issueDate) || data?.expiryDate || '';
        const generated = buildLicenseSerial({
            issueDate,
            expiryDate,
            caSerial: data?.caSerial,
            keySequence: data?.keySequence,
        });
        const serialNo = generated
            || (data?.applicationKind === 'RENEWAL' ? (data?.previousSerialNo || data?.serialNo || '') : (data?.serialNo || ''));
        const next = {
            intentAppId,
            applicantUsername,
            applicantName,
            issueDate,
            expiryDate: generated ? expiryDate : '',
            serialNo,
            publicKey: data?.publicKey || '',
            applicationKind: data?.applicationKind || '',
            previousSerialNo: data?.previousSerialNo || '',
            caSerial: data?.caSerial ?? null,
            keySequence: data?.keySequence ?? null,
            rootCaKeyCount: data?.rootCaKeyCount ?? 0,
            ccaRemark: data?.ccaRemark || '',
            issueDateEditable: !!data?.issueDateEditable,
        };
        setRequiredDoc(next);
        setInitialDoc(next);
        setFormErrors({});
        setCaptchaInput('');
    };

    useEffect(() => {
        let active = true;
        setLoading(true);
        LicenseIssuanceService.getLicenseFormDefaults(intentAppId, applicantUsername)
            .then((response) => {
                if (active) {
                    applyDefaults(response.data || {});
                    setLoadError('');
                }
            })
            .catch((err) => {
                if (!active) {
                    return;
                }
                const data = err.response?.data;
                setLoadError(
                    (typeof data === 'string' && data)
                    || 'License details could not be prepared. Please close and try again.'
                );
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

    const handleReset = () => {
        if (initialDoc) {
            setRequiredDoc(initialDoc);
        }
        setCaptchaInput('');
        setFormErrors({});
    };

    const serialHelper = () => {
        if (formErrors.serialNo) {
            return formErrors.serialNo;
        }
        if (requiredDoc.applicationKind === 'RENEWAL' && requiredDoc.previousSerialNo) {
            const keys = Number(requiredDoc.rootCaKeyCount) || 0;
            const increment = Math.max(keys, 1);
            return `Previous license serial: ${requiredDoc.previousSerialNo}. NNN increments by ${increment} for ${keys} root CA key${keys === 1 ? '' : 's'} on the application.`;
        }
        return 'Generated automatically (24 characters).';
    };

    const validateForm = () => {
        const errors = {};

        if (!requiredDoc.publicKey || !requiredDoc.publicKey.trim()) {
            errors.publicKey = errorMsg.publicKey.blank;
        } else if (!hasCertificateEnvelope(requiredDoc.publicKey)) {
            errors.publicKey = errorMsg.publicKey.envelope;
        }

        if (!requiredDoc.issueDate) {
            errors.issueDate = requiredDoc.applicationKind === 'FRESH'
                ? errorMsg.issueDate.missingApproval
                : errorMsg.issueDate.blank;
        }

        const expectedExpiry = expiryFromIssue(requiredDoc.issueDate);
        if (!requiredDoc.expiryDate || requiredDoc.expiryDate !== expectedExpiry) {
            errors.expiryDate = errorMsg.expiryDate.blank;
        }

        const expectedSerial = buildLicenseSerial({
            issueDate: requiredDoc.issueDate,
            expiryDate: expectedExpiry,
            caSerial: requiredDoc.caSerial,
            keySequence: requiredDoc.keySequence,
        });
        if (!expectedSerial) {
            errors.serialNo = errorMsg.serialNo.blank;
        } else if (expectedSerial.length !== 24 || requiredDoc.serialNo !== expectedSerial) {
            errors.serialNo = errorMsg.serialNo.length;
        }

        if (!captchaInput) {
            errors.captcha = errorMsg.captchaError.blank;
        }

        return errors;
    };

    const handleConfrimSubmit = () => {
        setLoading(true);
        LicenseIssuanceService.submitLicenseDetailsForReview(requiredDoc)
            .then((response) => {
                showAlert({
                    messageTitle: 'License Details',
                    messageContent: response.data,
                    confirmText: 'Ok',
                    enableHeaderCloseBtn: false,
                    disableOutsideKeyDown: true,
                    closeParent: true,
                });
                refreshList();
            })
            .catch((err) => {
                const data = err.response?.data;
                const errorMessage = (typeof data === 'string' && data)
                    || data?.message
                    || err.message
                    || 'Your request cannot be processed at this time. Please try again later.';
                showAlert({
                    messageTitle: 'Error',
                    messageContent: errorMessage,
                    confirmText: 'Ok',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleFormSubmit = () => {
        const errors = validateForm();
        if (Object.keys(errors).length === 0) {
            setFormErrors({});
            if (captchaInput === captchaText) {
                showAlert({
                    messageTitle: 'Confirm',
                    messageContent: 'Are you sure you want to send these license details to CCA for review?',
                    confirmText: 'Yes',
                    closeText: 'No',
                    fullWidth: true,
                    maxWidth: 'sm',
                    onConfirm: () => handleConfrimSubmit(),
                });
            } else {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Invalid Captcha',
                    confirmText: 'Ok',
                });
            }
        } else {
            setFormErrors(errors);
        }
    };

    const handleDateChange = (date) => {
        if (!requiredDoc.issueDateEditable || !dayjs(date).isValid()) {
            return;
        }
        const issueDate = dayjs(date).format('YYYY-MM-DD');
        const expiryDate = expiryFromIssue(issueDate);
        const serialNo = buildLicenseSerial({
            issueDate,
            expiryDate,
            caSerial: requiredDoc.caSerial,
            keySequence: requiredDoc.keySequence,
        });
        setRequiredDoc((prev) => ({
            ...prev,
            issueDate,
            expiryDate,
            serialNo,
        }));
    };

    useImperativeHandle(ref, () => ({
        handleReset,
        handleFormSubmit,
    }));

    const dateSlot = (field, placeholder, errorText) => ({
        textField: {
            size: 'small',
            fullWidth: true,
            placeholder,
            error: !!formErrors[field],
            helperText: errorText || '',
        },
        popper: {
            style: { zIndex: 110015 },
        },
    });

    return (
        <>
            <LoaderProgress open={isLoading} />
            <FormWrapper headingText="Fill License Details">
                <Box component="form" noValidate sx={{ mt: 2, p: 2 }}>
                    {loadError && (
                        <Typography color="error" variant="body2" sx={{ mb: 2 }}>{loadError}</Typography>
                    )}
                    {requiredDoc.ccaRemark && (
                        <Box sx={{ mb: 2, p: 1.5, border: '1px solid #e0c36a', borderRadius: 1, backgroundColor: '#fff8e1' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>CCA remark</Typography>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{requiredDoc.ccaRemark}</Typography>
                        </Box>
                    )}
                    {requiredDoc.applicationKind && (
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            {requiredDoc.applicationKind === 'RENEWAL' ? 'Renewal application' : 'Fresh application'}
                        </Typography>
                    )}
                    <Grid container spacing={2} direction="column">
                        <Grid item xs={12}>
                            <InputLabel shrink={false} htmlFor="serialNo">
                                <Typography variant="body1">License Serial Number*</Typography>
                            </InputLabel>
                            <TextField
                                id="serialNo"
                                margin="dense"
                                required
                                fullWidth
                                placeholder="License Serial Number"
                                name="serialNo"
                                variant="outlined"
                                error={!!formErrors.serialNo}
                                helperText={serialHelper()}
                                value={requiredDoc.serialNo}
                                size="small"
                                disabled
                                inputProps={{ maxLength: 24, readOnly: true }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <InputLabel shrink={false} htmlFor="issueDate">
                                <Typography variant="body1">Issue Date*</Typography>
                            </InputLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    id="issueDate"
                                    disableFuture
                                    disabled={!requiredDoc.issueDateEditable}
                                    onChange={handleDateChange}
                                    value={requiredDoc.issueDate ? dayjs(requiredDoc.issueDate) : null}
                                    slotProps={dateSlot('issueDate', 'Issue Date', formErrors.issueDate || (requiredDoc.issueDateEditable
                                        ? 'Enter the issue date for this renewal.'
                                        : 'In-principle approval date given by CCA.'))}
                                    sx={{ mt: 1 }}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12}>
                            <InputLabel shrink={false} htmlFor="expiryDate">
                                <Typography variant="body1">Expiry Date*</Typography>
                            </InputLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    id="expiryDate"
                                    disabled
                                    value={requiredDoc.expiryDate ? dayjs(requiredDoc.expiryDate) : null}
                                    slotProps={dateSlot('expiryDate', 'Expiry Date', formErrors.expiryDate || 'Set automatically to 5 years from the issue date.')}
                                    sx={{ mt: 1 }}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12}>
                            <InputLabel shrink={false} htmlFor="publicKey">
                                <Typography variant="body1">Public Key*</Typography>
                            </InputLabel>
                            <TextField
                                id="publicKey"
                                margin="dense"
                                required
                                fullWidth
                                multiline
                                minRows={8}
                                maxRows={14}
                                placeholder="Paste the public key"
                                name="publicKey"
                                variant="outlined"
                                error={!!formErrors.publicKey}
                                helperText={formErrors.publicKey || ''}
                                onChange={(e) => setRequiredDoc((prev) => ({ ...prev, publicKey: e.target.value }))}
                                value={requiredDoc.publicKey}
                            />
                        </Grid>
                    </Grid>

                    <Captcha
                        setCaptcha={setCaptchaText}
                        setCaptchaInput={setCaptchaInput}
                        captchaInput={captchaInput}
                        captchaError={!!formErrors.captcha}
                        captchaErrorMsg={formErrors.captcha}
                    />
                </Box>
            </FormWrapper>
        </>
    );
});

export default IssueLicense;
