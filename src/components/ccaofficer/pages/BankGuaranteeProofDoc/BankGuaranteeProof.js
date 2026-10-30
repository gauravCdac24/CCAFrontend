import React, { forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import { Box, Grid, Button, Typography, InputLabel, FormHelperText, Tooltip, TextField, FormControl, Select, MenuItem } from '@mui/material';
import LoaderProgress from '../../../global/common/LoaderProgress';
import showAlert from '../../../global/common/MessageBox/AlertService';
import FormWrapper from '../../../global/util/FormWrapper';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import LicenseIssuanceService from '../../../../service/LicenseIssuanceService/LicenseIssuanceService';
import ValidatePattern from '../../../global/util/ValidatePattern';
import ApplicationForm from '../../../../service/NewLicenseService/ApplicationForm';

const VisuallyHiddenInput = styled('input')({
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    border: '0',
});

const bankNames = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
    "Kotak Mahindra Bank",
    "Bank of India",
    "IndusInd Bank",
    "Central Bank of India",
    "Indian Bank",
    "Indian Overseas Bank",
    "Bank of Maharashtra"
];

const DATE_PLACEHOLDER = 'DD-MM-YYYY';

const errorMsg = {
    file: {
        blank: "Please upload bank guarantee proof.",
        size: "The file size must not exceed 5MB. Please upload a smaller file.",
        format: "Only Pdf file is allowed."
    },
    bankGuaranteeNumber: {
        blank: "Please enter bank guarantee number.",
        length: "The length must be between 8 and 22 characters.",
        format: "Please enter a valid bank guarantee number."
    },
    bankName: {
        blank: "Please select bank name."
    },
    bankGuaranteeIssueDate: {
        blank: "Please enter bank guarantee issue date in DD-MM-YYYY format.",
        format: "Enter a valid date in DD-MM-YYYY format. Only numbers or alphabets are not allowed.",
        beforeGrant: "Bank Guarantee Issue Date must be later than the Grant in-principle approval date.",
        missingGrant: "Grant in-principle approval date is not available for this application.",
        loadingGrant: "Grant in-principle approval date is still loading. Please try again."
    },
    issueDate: {
        blank: "Please enter issue date in DD-MM-YYYY format.",
        format: "Enter a valid date in DD-MM-YYYY format. Only numbers or alphabets are not allowed."
    },
    expiryDate: {
        blank: "Expiry date is set automatically to 6 years from the Bank Guarantee Issue Date.",
        format: "Enter a valid date in DD-MM-YYYY format. Only numbers or alphabets are not allowed.",
        mismatch: "Expiry date must be 6 years from the Bank Guarantee Issue Date."
    },
};

const selectMenuProps = {
    sx: { zIndex: 110015 },
    PaperProps: {
        sx: { zIndex: 110015 },
    },
};

const isInPrincipleGrant = (status) => {
    const normalized = String(status || '')
        .toLowerCase()
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    const compact = normalized.replace(/\s+/g, '');
    if (compact === 'inprincipleapprovalgranted' || normalized === 'in principle approval granted') {
        return true;
    }
    if (!normalized || normalized.includes('recommend')) {
        return false;
    }
    if (normalized.includes('document') || normalized.includes('bank guarantee') || normalized.includes('licen')) {
        return false;
    }
    const mentionsPrinciple = normalized.includes('in principle')
        || normalized.includes('principle approval')
        || compact.includes('inprinciple')
        || compact.includes('principleapproval');
    return mentionsPrinciple && (normalized.includes('grant') || normalized.includes('approv') || compact.includes('grant'));
};

const timelineEvents = (payload) => {
    if (Array.isArray(payload)) {
        return payload;
    }
    if (Array.isArray(payload?.data)) {
        return payload.data;
    }
    if (Array.isArray(payload?.content)) {
        return payload.content;
    }
    return [];
};

export const findGrantApprovalValue = (payload) => {
    const grantEvent = timelineEvents(payload)
        .filter((event) => isInPrincipleGrant(event?.applicationStatus))
        .filter((event) => event?.created)
        .sort((a, b) => new Date(b.created) - new Date(a.created))[0];
    return grantEvent?.created || '';
};

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const parseApiDate = (value) => {
    const text = String(value || '').trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
        const [year, month, day] = text.split('-').map(Number);
        return new Date(year, month - 1, day);
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : startOfDay(parsed);
};

const formatDdMmYyyy = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}-${month}-${date.getFullYear()}`;
};

const toIsoDate = (value) => {
    const date = parseDdMmYyyy(value);
    if (!date) {
        return '';
    }
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
};

const parseDdMmYyyy = (value) => {
    if (!/^\d{2}-\d{2}-\d{4}$/.test(value || '')) {
        return null;
    }
    const [day, month, year] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
        return null;
    }
    return date;
};

const addYears = (date, years) => {
    const result = new Date(date.getTime());
    const month = result.getMonth();
    result.setFullYear(result.getFullYear() + years);
    if (result.getMonth() !== month) {
        result.setDate(0);
    }
    return result;
};

const formatDateInput = (raw) => {
    const digits = String(raw || '').replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 2) {
        return digits;
    }
    if (digits.length <= 4) {
        return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    }
    return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
};

const BankGuaranteeProof = forwardRef(({intentAppId, applicantUsername, grantApprovalOn, refreshApplication}, ref) => {
    const [requiredDoc, setRequiredDoc] = useState({
        intentAppId,
        file: '',
        bankGuaranteeNumber: '',
        bankName: '',
        bankGuaranteeIssueDate: '',
        issueDate: '',
        expiryDate: '',
    });

    const [fileName, setFileName] = useState('');
    const [fileKey, setFileKey] = useState(Date.now());
    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [grantApprovalDate, setGrantApprovalDate] = useState(() => parseApiDate(grantApprovalOn));

    useEffect(() => {
        const fromProp = parseApiDate(grantApprovalOn);
        if (fromProp) {
            setGrantApprovalDate(fromProp);
        }
        if (!applicantUsername) {
            if (!fromProp) {
                setGrantApprovalDate(null);
            }
            return undefined;
        }

        let active = true;
        const applyGrantDate = (value) => {
            const parsed = parseApiDate(value);
            if (parsed) {
                setGrantApprovalDate(parsed);
            }
            return parsed;
        };

        ApplicationForm.getAllApplicationTimelineList(String(applicantUsername).trim())
            .then(async (response) => {
                if (!active) {
                    return;
                }
                if (applyGrantDate(findGrantApprovalValue(response.data))) {
                    return;
                }

                try {
                    const defaults = await LicenseIssuanceService.getLicenseFormDefaults(intentAppId, applicantUsername);
                    const data = defaults.data || {};
                    if (active && data.issueDate && data.issueDateEditable === false && applyGrantDate(data.issueDate)) {
                        return;
                    }
                } catch (err) {
                    // Timeline did not include the grant date, and license defaults are not available yet.
                }

                if (active && !fromProp) {
                    setGrantApprovalDate(null);
                }
            })
            .catch(() => {
                if (active && !fromProp) {
                    setGrantApprovalDate(null);
                }
            });

        return () => {
            active = false;
        };
    }, [applicantUsername, intentAppId, grantApprovalOn]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setRequiredDoc({
            ...requiredDoc,
            [e.target.name]: file
        });
        setFileName(file ? file.name : '');
    };

    const validateFile = (errors) => {
        if (requiredDoc.file) {
            const allowedExtensions = /(\.pdf|\.PDF)$/i;
            if (!allowedExtensions.exec(requiredDoc.file.name)) {
                errors.file = errorMsg.file.format;
            }
            const maxSize = 5 * 1024 * 1024;
            if (requiredDoc.file.size > maxSize) {
                errors.file = errorMsg.file.size;
            }
        } else {
            errors.file = errorMsg.file.blank;
        }
    };

    const handleReset = () => {
        setRequiredDoc({
            intentAppId,
            file: '',
            bankGuaranteeNumber: '',
            bankName: '',
            bankGuaranteeIssueDate: '',
            issueDate: '',
            expiryDate: '',
        });
        setFileName('');
        setFileKey(Date.now());
        setFormErrors({});
    };

    useImperativeHandle(ref, () => ({
        handleReset,
        handleFormSubmit
    }));

    const validateDateField = (value, messages) => {
        if (!value) {
            return messages.blank;
        }
        if (/^[A-Za-z]+$/.test(value) || /^\d+$/.test(value) || !parseDdMmYyyy(value)) {
            return messages.format;
        }
        return '';
    };

    const validateForm = () => {
        const errors = {};
        validateFile(errors);

        if (!requiredDoc.bankGuaranteeNumber) {
            errors.bankGuaranteeNumber = errorMsg.bankGuaranteeNumber.blank;
        } else if (requiredDoc.bankGuaranteeNumber.length < 8 || requiredDoc.bankGuaranteeNumber.length > 22) {
            errors.bankGuaranteeNumber = errorMsg.bankGuaranteeNumber.length;
        } else if (!/^[A-Za-z0-9]+$/.test(requiredDoc.bankGuaranteeNumber)) {
            errors.bankGuaranteeNumber = errorMsg.bankGuaranteeNumber.format;
        }

        if (!requiredDoc.bankName) {
            errors.bankName = errorMsg.bankName.blank;
        }

        const bankGuaranteeIssueError = validateDateField(requiredDoc.bankGuaranteeIssueDate, errorMsg.bankGuaranteeIssueDate);
        if (bankGuaranteeIssueError) {
            errors.bankGuaranteeIssueDate = bankGuaranteeIssueError;
        } else if (grantApprovalDate === undefined) {
            errors.bankGuaranteeIssueDate = errorMsg.bankGuaranteeIssueDate.loadingGrant;
        } else if (!grantApprovalDate) {
            errors.bankGuaranteeIssueDate = errorMsg.bankGuaranteeIssueDate.missingGrant;
        } else {
            const issue = startOfDay(parseDdMmYyyy(requiredDoc.bankGuaranteeIssueDate));
            if (issue.getTime() <= grantApprovalDate.getTime()) {
                errors.bankGuaranteeIssueDate = `${errorMsg.bankGuaranteeIssueDate.beforeGrant} (${formatDdMmYyyy(grantApprovalDate)}).`;
            }
        }

        const issueDateError = validateDateField(requiredDoc.issueDate, errorMsg.issueDate);
        if (issueDateError) {
            errors.issueDate = issueDateError;
        }

        const expectedExpiry = parseDdMmYyyy(requiredDoc.bankGuaranteeIssueDate)
            ? formatDdMmYyyy(addYears(parseDdMmYyyy(requiredDoc.bankGuaranteeIssueDate), 6))
            : '';
        const expiryError = validateDateField(requiredDoc.expiryDate, errorMsg.expiryDate);
        if (expiryError) {
            errors.expiryDate = expiryError;
        } else if (expectedExpiry && requiredDoc.expiryDate !== expectedExpiry) {
            errors.expiryDate = errorMsg.expiryDate.mismatch;
        }

        return errors;
    };

    const handleConfrimSubmit = () => {
        setLoading(true);
        const payload = {
            ...requiredDoc,
            transactionNumber: requiredDoc.bankGuaranteeNumber,
            bankGuaranteeIssueDate: toIsoDate(requiredDoc.bankGuaranteeIssueDate),
            issueDate: toIsoDate(requiredDoc.issueDate),
            expiryDate: toIsoDate(requiredDoc.expiryDate),
        };

        LicenseIssuanceService.uploadBankGuaranteeProof(payload)
            .then((response) => {
                showAlert({
                    messageTitle: 'Document Upload',
                    messageContent: response.data,
                    confirmText: 'Ok',
                    enableHeaderCloseBtn: false,
                    disableOutsideKeyDown: true,
                    closeParent: true,
                });
                refreshApplication();
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: err.response?.data ? typeof err.response.data === 'object' ? 'Your request cannot be processed at this time. Please try again later.' : err.response.data : 'Your request cannot be processed at this time. Please try again later.',
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
            showAlert({
                messageTitle: 'Confirm',
                messageContent: 'Are you sure, you want to submit? You cannot reupload the documents again. Please verify before uploading the documents.',
                confirmText: 'Yes',
                closeText: 'No',
                fullWidth: true,
                maxWidth: 'sm',
                onConfirm: () => handleConfrimSubmit()
            });
        } else {
            setFormErrors(errors);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRequiredDoc({
            ...requiredDoc,
            [name]: value,
        });
    };

    const handleDateInput = (name) => (e) => {
        const formatted = formatDateInput(e.target.value);
        setRequiredDoc((prev) => {
            const next = {
                ...prev,
                [name]: formatted,
            };
            if (name === 'bankGuaranteeIssueDate') {
                const parsed = parseDdMmYyyy(formatted);
                next.expiryDate = parsed ? formatDdMmYyyy(addYears(parsed, 6)) : '';
            }
            return next;
        });
    };

    return (
        <>
            <LoaderProgress open={isLoading} />

            <FormWrapper headingText="Fill Bank Guarantee Proof Details">
                <Box component="form" noValidate sx={{ mt: 2, p: 2 }}>
                    <Grid container spacing={2} direction="column">
                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor="bankGuaranteeNumber">
                                <Typography variant='body1'>Bank Guarantee Number*</Typography>
                            </InputLabel>
                            <TextField
                                id="bankGuaranteeNumber"
                                margin="dense"
                                required
                                fullWidth
                                placeholder="Bank Guarantee Number"
                                name="bankGuaranteeNumber"
                                variant="outlined"
                                error={!!formErrors.bankGuaranteeNumber}
                                helperText={formErrors.bankGuaranteeNumber || ''}
                                onChange={handleInputChange}
                                onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9]+$/)}
                                value={requiredDoc.bankGuaranteeNumber}
                                size="small"
                                inputProps={{ maxLength: 22 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor="bankName">
                                <Typography variant='body1'>Bank Name*</Typography>
                            </InputLabel>
                            <FormControl fullWidth margin="dense" size="small" error={!!formErrors.bankName}>
                                <Select
                                    id="bankName"
                                    displayEmpty
                                    name="bankName"
                                    value={requiredDoc.bankName}
                                    onChange={handleInputChange}
                                    MenuProps={selectMenuProps}
                                >
                                    <MenuItem disabled value="">
                                        Bank Name
                                    </MenuItem>
                                    {bankNames.map((item) => (
                                        <MenuItem key={item} value={item}>{item}</MenuItem>
                                    ))}
                                </Select>
                                {formErrors.bankName && <FormHelperText>{formErrors.bankName}</FormHelperText>}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor="bankGuaranteeIssueDate">
                                <Typography variant='body1'>Bank Guarantee Issue Date*</Typography>
                            </InputLabel>
                            <TextField
                                id="bankGuaranteeIssueDate"
                                margin="dense"
                                required
                                fullWidth
                                placeholder={DATE_PLACEHOLDER}
                                name="bankGuaranteeIssueDate"
                                variant="outlined"
                                error={!!formErrors.bankGuaranteeIssueDate}
                                helperText={formErrors.bankGuaranteeIssueDate || ''}
                                onChange={handleDateInput('bankGuaranteeIssueDate')}
                                value={requiredDoc.bankGuaranteeIssueDate}
                                size="small"
                                inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                            />
                        </Grid>

                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor="issueDate">
                                <Typography variant='body1'>Issue Date*</Typography>
                            </InputLabel>
                            <TextField
                                id="issueDate"
                                margin="dense"
                                required
                                fullWidth
                                placeholder={DATE_PLACEHOLDER}
                                name="issueDate"
                                variant="outlined"
                                error={!!formErrors.issueDate}
                                helperText={formErrors.issueDate || ''}
                                onChange={handleDateInput('issueDate')}
                                value={requiredDoc.issueDate}
                                size="small"
                                inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                            />
                        </Grid>

                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor="expiryDate">
                                <Typography variant='body1'>Expiry Date*</Typography>
                            </InputLabel>
                            <TextField
                                id="expiryDate"
                                margin="dense"
                                required
                                fullWidth
                                placeholder={DATE_PLACEHOLDER}
                                name="expiryDate"
                                variant="outlined"
                                error={!!formErrors.expiryDate}
                                helperText={formErrors.expiryDate || ''}
                                value={requiredDoc.expiryDate}
                                size="small"
                                InputProps={{ readOnly: true }}
                                inputProps={{ maxLength: 10 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm>
                            <InputLabel shrink={false} htmlFor="file" sx={{ mb: 1 }}>
                                <Typography variant='body1'>Upload Bank Guarantee Proof*</Typography>
                            </InputLabel>
                            <Grid container direction="row" sx={{ border: '1px solid #cfcfcf', borderRadius: '5px' }}>
                                <Grid item>
                                    <Button
                                        component="label"
                                        variant="contained"
                                        startIcon={<CloudUploadIcon />}
                                    >
                                        Upload File
                                        <VisuallyHiddenInput
                                            key={fileKey}
                                            type="file"
                                            name="file"
                                            onChange={handleFileChange}
                                        />
                                    </Button>
                                </Grid>
                                <Grid item xs sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {fileName && (
                                        <Tooltip title={fileName} placement="top">
                                            <Typography variant='body2' sx={{
                                                display: 'inline-block',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                verticalAlign: 'middle',
                                                textAlign: 'center'
                                            }}>
                                                {fileName}
                                            </Typography>
                                        </Tooltip>
                                    )}
                                </Grid>
                            </Grid>
                            {formErrors.file && (
                                <FormHelperText error>{formErrors.file}</FormHelperText>
                            )}
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>Note:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            1. The Bank Guarantee remains valid period of 6 years from the date of its submission.
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            2. Applicant advised to ensure 6 years validity condition & submit the appropriate valid Bank Guarantee document.
                        </Typography>
                    </Box>
                </Box>
            </FormWrapper>
        </>
    );
});

export default BankGuaranteeProof;
