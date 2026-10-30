import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Box, Grid, Typography, InputLabel, TextField } from '@mui/material';
import LoaderProgress from '../../../global/common/LoaderProgress';
import showAlert from '../../../global/common/MessageBox/AlertService';
import LicenseIssuanceService from '../../../../service/LicenseIssuanceService/LicenseIssuanceService';

const DATE_PLACEHOLDER = 'DD-MM-YYYY';

const errorMsg = {
    blank: 'Please enter renewal application extension date in DD-MM-YYYY format.',
    format: 'Enter a valid date in DD-MM-YYYY format. Only numbers or alphabets are not allowed.',
    past: 'Renewal application extension date cannot be before today.',
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

const startOfToday = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

const displayDate = (value) => {
    if (!value) {
        return '';
    }
    if (Array.isArray(value) && value.length >= 3) {
        const [year, month, day] = value;
        return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
    }
    const text = String(value).trim();
    const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (iso) {
        return `${iso[3]}-${iso[2]}-${iso[1]}`;
    }
    const parsed = new Date(text);
    if (Number.isNaN(parsed.getTime())) {
        return text;
    }
    const day = String(parsed.getDate()).padStart(2, '0');
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    return `${day}-${month}-${parsed.getFullYear()}`;
};

const readOnlyField = (id, label, value) => (
    <Grid item xs={12}>
        <InputLabel shrink={false} htmlFor={id}>
            <Typography variant="body1">{label}</Typography>
        </InputLabel>
        <TextField
            id={id}
            margin="dense"
            fullWidth
            value={value || ''}
            size="small"
            disabled
        />
    </Grid>
);

const RenewalExtensionForm = forwardRef(({ details, refreshList }, ref) => {
    const [extensionDate, setExtensionDate] = useState('');
    const [dateError, setDateError] = useState('');
    const [isLoading, setLoading] = useState(false);

    const validateDate = (value) => {
        if (!value) {
            return errorMsg.blank;
        }
        if (/^[A-Za-z]+$/.test(value) || /^\d+$/.test(value) || !parseDdMmYyyy(value)) {
            return errorMsg.format;
        }
        if (parseDdMmYyyy(value) < startOfToday()) {
            return errorMsg.past;
        }
        return '';
    };

    const submit = () => {
        const error = validateDate(extensionDate);
        if (error) {
            setDateError(error);
            return;
        }
        setDateError('');
        showAlert({
            messageTitle: 'Confirm',
            messageContent: `Grant the renewal application extension until ${extensionDate}?`,
            confirmText: 'Yes',
            closeText: 'No',
            onConfirm: () => {
                setLoading(true);
                LicenseIssuanceService.grantRenewalExtension({
                    username: details.userName,
                    extensionDate,
                })
                    .then(() => {
                        showAlert({
                            messageTitle: 'Renewal application extension',
                            messageContent: `Renewal application extension granted until ${extensionDate}.`,
                            confirmText: 'Ok',
                            enableHeaderCloseBtn: false,
                            disableOutsideKeyDown: true,
                            closeParent: true,
                        });
                        if (refreshList) {
                            refreshList();
                        }
                    })
                    .catch((err) => {
                        const data = err.response?.data;
                        showAlert({
                            messageTitle: 'Error',
                            messageContent: (typeof data === 'string' && data) || 'Unable to grant the renewal application extension.',
                            confirmText: 'Ok',
                        });
                    })
                    .finally(() => setLoading(false));
            },
        });
    };

    useImperativeHandle(ref, () => ({
        submit,
    }));

    return (
        <>
            <LoaderProgress open={isLoading} />
            <Box sx={{ p: 1 }}>
                <Grid container spacing={1} direction="column">
                    {readOnlyField('ca', 'CA', details.userName)}
                    {readOnlyField('caLicenseNo', 'CA License No', details.serialNo)}
                    {readOnlyField('caLicenseIssueOn', 'CA License Issue On', displayDate(details.issueDate))}
                    {readOnlyField('caLicenseExpiryOn', 'CA License Expiry On', displayDate(details.expiryDate))}
                    {readOnlyField('caName', 'CA Name', details.caName || details.licenseName || details.applicantName)}
                    <Grid item xs={12}>
                        <InputLabel shrink={false} htmlFor="extensionDate">
                            <Typography variant="body1">Renewal application extension date*</Typography>
                        </InputLabel>
                        <TextField
                            id="extensionDate"
                            margin="dense"
                            required
                            fullWidth
                            placeholder={DATE_PLACEHOLDER}
                            name="extensionDate"
                            variant="outlined"
                            error={!!dateError}
                            helperText={dateError || ''}
                            onChange={(e) => {
                                setExtensionDate(formatDateInput(e.target.value));
                                setDateError('');
                            }}
                            value={extensionDate}
                            size="small"
                            inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
});

export default RenewalExtensionForm;
