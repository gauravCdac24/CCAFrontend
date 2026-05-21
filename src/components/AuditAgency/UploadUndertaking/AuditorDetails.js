import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    FormControl, FormHelperText, Typography, InputLabel, Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    Tooltip,
    IconButton,
} from '@mui/material';
import react, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useSelector } from 'react-redux';
import Captcha from '../../global/util/Captcha';
import LoaderProgress from '../../global/common/LoaderProgress';
import showAlert from '../../global/common/MessageBox/AlertService';
import { useNavigate, useParams } from 'react-router-dom';
import FormWrapper from '../../global/util/FormWrapper';
import AuditAgency from '../../../service/AdminService/AuditAgency';
import AuditorCertificateTypeService from '../../../service/AdminService/AuditorCertificateTypeService';
import AuditService from '../../../service/AuditService/AuditService';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import styled from '@emotion/styled';
import API from '../../../api/ApplicationAPI';
import { decrypt } from '../../global/util/EncryptDecrypt';

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



// Error Messages
const errorMsg = {
    AuditAgencyName: {
        blank: 'Please select Audit Agency Name.',
    },
    captchaError: {
        blank: 'Please enter captcha.',
    },
};

const getSubmitErrorMessage = (err) => {
    const data = err?.response?.data;
    if (typeof data === 'string' && data.trim()) {
        return data;
    }
    if (data?.message) {
        return data.message;
    }
    return 'Request failed. Please try again later.';
};

const AuditorDetails = (() => {
    const{id}=useParams();
    const ApplicantUserName = id ? decrypt(decodeURIComponent(id)) : '';
    console.log(ApplicantUserName)
    const [audiAgencyFormValues, setAudiAgencyFormValues] = useState({ auditAgencyName: '',applicantUserName:ApplicantUserName, intentAppId: '', undertakingFile: null, auditors: [], auditorDesscription: [{ auditorName: '', certificateType: '', file: null }], auditScope: [{ auditTitle: '', description: '', startDate: '', endDate: '' }] });
    const [formErrors, setFormErrors] = useState({});
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [allAuditAgencyList, setAllAuditAgencyList] = useState([]);
    const [allAuditAgencySelectionList, setAllAuditAgencySelectionList] = useState([]);
    const loggedInUsername = useSelector((state) => state.jwtAuthentication.username);
   
   
    const handleReset = () => {
        setAudiAgencyFormValues((prev) => prev.map((formValue) => ({
            ...formValue,
            auditAgencyName: '', // Reset only the specific fields
            intentAppId: '',
            file: null,
            // Check if auditorDescription exists and then reset its fields
            auditorDescription: formValue.auditorDescription?.map((description) => ({
                ...description,
                auditorName: '', // Reset auditor name
                certificateType: '', // Reset certificate type
                file: null // Reset the file
            })) || [], // If auditorDescription is undefined, initialize it as an empty array
            // Check if auditScope exists and then reset its fields
            auditScope: formValue.auditScope?.map((scope) => ({
                ...scope,
                auditTitle: '', // Reset audit title
                description: '', // Reset description
                startDate: '', // Reset start date
                endDate: '' // Reset end date
            })) || [], // If auditScope is undefined, initialize it as an empty array
        })));
        setCaptchaInput('');
        setFormErrors({});
    };



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const selectedAgency = allAuditAgencyList.find(
            (agency) => agency.auditAgencyId === value
        );

        console.log("Selected Agency:", selectedAgency); // Debugging selected agency
        console.log("Before Update:", audiAgencyFormValues); // Debugging state before update

        setAudiAgencyFormValues((prev) => ({
            ...prev,
            [name]: value,
            name: selectedAgency?.auditAgencyName || '',
            mobileNo: selectedAgency?.mobileNo || '',
            emailId: selectedAgency?.emailId || '',
        }));

        console.log("After Update:", audiAgencyFormValues); // Debugging state after update
    };

    // Options for dropdowns
    const auditorNames = ['John Doe', 'Jane Smith', 'Alice Johnson'];
    const certificateTypes = ['ISO 9001', 'ISO 27001', 'ISO 14001'];

    // Handle dropdown changes
    const handleSelectChange = (index, field, value) => {
        const updatedRows = { ...audiAgencyFormValues };
        updatedRows.auditorDesscription[index][field] = value;  // Access the first object and update the auditorDesscription array
        setAudiAgencyFormValues(updatedRows);
    };

    // Handle file upload
    const handleFileChange = (index, event) => {
        const updatedRows = { ...audiAgencyFormValues };
        updatedRows.auditorDesscription[index].file = event.target.files[0];  // Update file in auditorDesscription
        setAudiAgencyFormValues(updatedRows);
    };

    const [selectedIndex, setSelectedIndex] = useState(null); // Track the selected row index

    const [fileInputKey, setFileInputKey] = useState(Date.now());
    const [fileName, setFileName] = useState('');

    const handleFilesChange = (e) => {
        const file = e.target.files[0];

        // Check if a file was selected
        if (file) {
            // Check if the file is a PDF
            if (file.type !== 'application/pdf') {
                alert('Only PDF files are allowed!');
                return; // Exit the function if the file is not a PDF
            }

            // Check if the file size exceeds 5MB (5 * 1024 * 1024 bytes = 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size exceeds 5 MB!');
                return; // Exit the function if the file size exceeds 5 MB
            }

            // If file is valid, update state for `undertakingFile` while keeping other values intact
            setAudiAgencyFormValues((prevValues) => ({
                ...prevValues,
                undertakingFile: file, // Update only the `undertakingFile` key
            }));

            // Set the file name for display purposes
            setFileName(file.name);
        }
    };

  


    // Add a new row
    const handleAddRow = () => {
        setAudiAgencyFormValues((prevState) => {
            const updatedRows = { ...prevState };
            updatedRows.auditorDesscription.push({
                auditorName: '',
                certificateType: '',
                file: null,
                date: '', 
            });
            return updatedRows;
        });
    };

    const handleAddAuditScopeRow = () => {
        const updatedRows = { ...audiAgencyFormValues };
        updatedRows.auditScope.push({
            auditTitle: '',
            description: '',
            startDate: '',
            endDate: '',
        });
        setAudiAgencyFormValues(updatedRows);
    };
    const handleDeleteRow = (index) => {
        setAudiAgencyFormValues((prevState) => {
            const updatedRows = { ...prevState };
            updatedRows.auditorDesscription = updatedRows.auditorDesscription.filter((_, i) => i !== index);  // Remove the row
            return updatedRows;
        });
    };

    const handleDeleteAuditScopeRow = (index) => {
        const updatedRows = { ...audiAgencyFormValues };
        updatedRows.auditScope.splice(index, 1);
        setAudiAgencyFormValues(updatedRows);
    };

    const handleDateChange = (index, date) => {
        setAudiAgencyFormValues((prev) =>
            prev.map((item, idx) =>
                idx === index ? { ...item, date } : item
            )
        );
    };

    const handleStartDateChange = (index, value) => {
        const updatedRows = { ...audiAgencyFormValues };
        updatedRows.auditScope[index].startDate = value;
        setAudiAgencyFormValues(updatedRows);
    };
    const handleEndDateChange = (index, value) => {
        const updatedRows = { ...audiAgencyFormValues };
        updatedRows.auditScope[index].endDate = value;
        setAudiAgencyFormValues(updatedRows);
    };


    const handleDescriptionChange = (index, value) => {
        const updatedRows = { ...audiAgencyFormValues };
        updatedRows.auditScope[index].description = value;
        setAudiAgencyFormValues(updatedRows);
    };

    const handleAuditTitleChange = (index, value) => {
        const updatedRows = { ...audiAgencyFormValues };
        updatedRows.auditScope[index].auditTitle = value;
        setAudiAgencyFormValues(updatedRows);
    };

   

    const getAllAuditAgency = async () => {
        try {
            setLoading(true);
            const response = await AuditAgency.getAllAuditAgencyList();
            console.log('Audit Agencies:', response.data);
    
            setAllAuditAgencyList(response.data);
        } catch (error) {
            console.error('Error fetching audit agencies:', error);
            showAlert({
                messageTitle: 'Error',
                messageContent: 'Failed to fetch audit agencies.',
            });
        } finally {
            setLoading(false);
        }
    };

    const getAllAuditAgencySelection = async () => {
        try {
            setLoading(true);
            // Use the logged-in username to filter audit selections for this specific audit agency
            const response = await AuditService.getAllAuditSelectionByUsername(loggedInUsername);
            console.log('Audit Agencies Selection:', response.data);
    
            const auditAgencySelectionList = response.data || [];
            setAllAuditAgencySelectionList(auditAgencySelectionList);
    
            // Ensure allAuditAgencyList is loaded before finding selected agency
            setAllAuditAgencyList((prevAgencyList) => {
                const selectedAgencyIds = new Set(
                    auditAgencySelectionList.map(({ auditAgencyId }) => String(auditAgencyId))
                );
    
                // Find selected agency
                const selectedAgency = prevAgencyList.find(agency =>
                    selectedAgencyIds.has(String(agency.auditAgencyId))
                );
    
                console.log('Selected Agency:', selectedAgency);
    
                setAudiAgencyFormValues({
                    auditAgencyName: selectedAgency?.auditAgencyName || 'N/A',
                    name: selectedAgency?.auditAgencyName || 'N/A',
                    mobileNo: selectedAgency?.phoneRecord || [],
                    emailId: selectedAgency?.emailId || [],
                    auditors: selectedAgency?.auditors || [],
                    undertakingFile: null,
                    auditorDesscription: [{ auditorName: '', certificateType: '', file: null }],
                    auditScope: [{ auditTitle: '', description: '', startDate: '', endDate: '' }],
                    applicantUserName: ApplicantUserName || '',
                    intentAppId: '',

                });
    
                return prevAgencyList; // Keep state unchanged
            });
        } catch (error) {
            console.error('Error fetching audit agency selection:', error);
            showAlert({
                messageTitle: 'Error',
                messageContent: 'Failed to fetch audit agencies.',
            });
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getAllAuditAgency().then(() => getAllAuditAgencySelection());
    }, []);

    console.log('Audit Agencies cch:', audiAgencyFormValues);

    const validateForm = () => {
        const errors = {};

        if (!ApplicantUserName) {
            errors.applicant = 'Invalid applicant reference. Please open this page from the application list again.';
        }

        if (!audiAgencyFormValues.auditAgencyName && !audiAgencyFormValues.name) {
            errors.auditAgencyName = errorMsg.AuditAgencyName.blank;
        }

        if (!audiAgencyFormValues.undertakingFile) {
            errors.file1 = 'Please upload undertaking file (PDF, max 5 MB).';
        }

        const auditorRows = audiAgencyFormValues.auditorDesscription || [];
        if (!auditorRows.length) {
            errors.auditors = 'Please add at least one auditor.';
        } else {
            auditorRows.forEach((row, index) => {
                if (!row.auditorName?.trim()) {
                    errors[`auditorName_${index}`] = `Auditor name is required for row ${index + 1}.`;
                }
                if (!row.certificateType?.trim()) {
                    errors[`certificateType_${index}`] = `Certificate type is required for row ${index + 1}.`;
                }
                if (!row.file) {
                    errors[`auditorFile_${index}`] = `Certificate file is required for row ${index + 1}.`;
                }
            });
        }

        const scopeRows = audiAgencyFormValues.auditScope || [];
        if (!scopeRows.length) {
            errors.auditScope = 'Please add at least one audit schedule.';
        } else {
            scopeRows.forEach((row, index) => {
                if (!row.auditTitle?.trim()) {
                    errors[`auditTitle_${index}`] = `Audit title is required for row ${index + 1}.`;
                }
                if (!row.description?.trim()) {
                    errors[`description_${index}`] = `Description is required for row ${index + 1}.`;
                }
                if (!row.startDate?.trim()) {
                    errors[`startDate_${index}`] = `Start date is required for row ${index + 1}.`;
                }
                if (!row.endDate?.trim()) {
                    errors[`endDate_${index}`] = `End date is required for row ${index + 1}.`;
                }
            });
        }

        if (!captchaInput) {
            errors.captcha = errorMsg.captchaError.blank;
        } else if (captchaInput !== captchaText) {
            errors.captcha = 'Captcha does not match.';
        }

        return errors;
    };

    // Form Submission Handler


    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            const firstError = Object.values(errors)[0];
            showAlert({
                messageTitle: 'Validation Error',
                messageContent: firstError,
                confirmText: 'Ok',
            });
            return;
        }

        showAlert({
            messageTitle: 'Confirm',
            messageContent: 'Are you sure, you want to submit? You cannot Upload Undertaking & Auditors Details again. Please verify before the Upload Undertaking & Auditors Details.',
            confirmText: 'Yes',
            closeText: 'No',
            fullWidth: true,
            maxWidth: 'md',
            onConfirm: () => handleConfrimSubmit()
        })


    };


    const handleConfrimSubmit = () => {
        console.log("sfgydgc=====>", audiAgencyFormValues);
    
        const formData = new FormData();
    
        // Append basic fields
        formData.append('auditAgencyName', audiAgencyFormValues.auditAgencyName || audiAgencyFormValues.name || '');
        formData.append('intentAppId', audiAgencyFormValues.intentAppId || '');
        formData.append('applicantUserName', audiAgencyFormValues.applicantUserName || ApplicantUserName);
        if (audiAgencyFormValues.undertakingFile) {
            formData.append('undertakingFile', audiAgencyFormValues.undertakingFile);
        }
    
// Append auditorDescription array
audiAgencyFormValues.auditorDesscription.forEach((item, index) => {
    formData.append(`auditorDesscription[${index}].auditorName`, item.auditorName);
    formData.append(`auditorDesscription[${index}].certificateType`, item.certificateType);
    if (item.file) {
        formData.append(`auditorDesscription[${index}].file`, item.file);
    }
});

// Append auditScope array
audiAgencyFormValues.auditScope.forEach((item, index) => {
    formData.append(`auditScope[${index}].auditTitle`, item.auditTitle);
    formData.append(`auditScope[${index}].description`, item.description);
    formData.append(`auditScope[${index}].startDate`, item.startDate);
    formData.append(`auditScope[${index}].endDate`, item.endDate);
});

        setLoading(true); // Show loading spinner if applicable
    
        AuditService.submitAuditForm(formData)
            .then((response) =>
                showAlert({
                    messageTitle: 'Success',
                    messageContent: response.data,
                    confirmText: 'Ok',
                    onConfirm: () => window.location.href = '/auditagency/uploadundertaking',
                })
            )
            .catch((err) => {
                const errorMessage = getSubmitErrorMessage(err);
                showAlert({
                    messageTitle: 'Error',
                    messageContent: errorMessage,
                    confirmText: 'Ok',
                });
            })
            .finally(() => setLoading(false));
    };
    

    return (
        <>
            <LoaderProgress open={isLoading} />
            <FormWrapper headingText="Upload Undertaking & Auditors Details">
                <Box component="form" noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={2} direction="column">
                        <Grid item xs={12}>
                            {/* Render additional rows based on the selected agency */}
                            {audiAgencyFormValues?.name && (
                                <>
                                    <Grid container spacing={2} sx={{ ml: 0.5 }}>
                                        <Grid item sm>
                                            <Typography variant="body2"><strong>Name:</strong></Typography>
                                        </Grid>
                                        <Grid item sm>
                                            <Typography variant="body2">{audiAgencyFormValues?.name || 'N/A'}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={2} sx={{ ml: 0.5 }}>
                                        <Grid item xs>
                                            <Typography variant="body2"><strong>Mobile No.:</strong></Typography>
                                        </Grid>
                                        <Grid item sm>
                                            <Typography variant="body2">
                                                {audiAgencyFormValues?.mobileNo?.length > 0
                                                    ? audiAgencyFormValues.mobileNo
                                                        .map((mobileObj) => mobileObj.mobile)
                                                        .join(', ') // Join multiple numbers with a comma
                                                    : 'N/A'}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={2} sx={{ ml: 0.5 }}>
                                        <Grid item xs>
                                            <Typography variant="body2"><strong>Email ID:</strong></Typography>
                                        </Grid>
                                        <Grid item sm>
                                            <Typography variant="body2">
                                                {audiAgencyFormValues?.emailId?.length > 0
                                                    ? audiAgencyFormValues.emailId
                                                        .map((emailObj) => emailObj.email)
                                                        .join(', ') // Join multiple emails with a comma
                                                    : 'N/A'}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </>
                            )}

                        </Grid>
                        <Grid item sm={6}>
                            <Typography variant="body1"><strong>1. Add Auditor Details:</strong></Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TableContainer>
                                <Table >
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: "tablecolor.main", color: "tablecolor.text" }}>
                                            <TableCell sx={{ border: 0.5, borderColor: 'grey.100', fontWeight: 'bold' }} >Auditor Name</TableCell>
                                            <TableCell sx={{ border: 0.5, borderColor: 'grey.100', fontWeight: 'bold' }}>Certificate Type</TableCell>
                                            <TableCell sx={{ border: 0.5, borderColor: 'grey.100', fontWeight: 'bold' }}>Certificate Expiry</TableCell>
                                            <TableCell sx={{ border: 0.5, borderColor: 'grey.100', fontWeight: 'bold' }}>File Upload</TableCell>
                                            <TableCell sx={{ border: 0.5, borderColor: 'grey.100', fontWeight: 'bold' }}>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                            {Array.isArray(audiAgencyFormValues?.auditorDesscription) &&
                                (audiAgencyFormValues?.auditorDesscription || []).map((row, index) => (
                                <TableRow key={index}>
                                    {/* Auditor Name Selection */}
                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.100' }}>
                                    <Select
                                        value={row.auditorName || ''}
                                        onChange={(event) => handleSelectChange(index, 'auditorName', event.target.value)}
                                        displayEmpty
                                        fullWidth
                                        size="small"
                                    >
                                        <MenuItem value="" disabled>Select Auditor</MenuItem>
                                        {Array.isArray(audiAgencyFormValues?.auditors) &&
                                        audiAgencyFormValues.auditors.map((auditor, auditorIndex) => (
                                            <MenuItem key={auditorIndex} value={`${auditor.firstName} ${auditor.lastName || ''}`.trim()}>
                                            {auditor.firstName || auditor.lastName ? `${auditor.firstName} ${auditor.lastName || ''}`.trim() : 'Unnamed Auditor'}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    </TableCell>

                                    {/* Certificate Type Selection */}
                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.100' }}>
                                    <Select
                                        value={row.certificateType || ''}
                                        onChange={(event) => handleSelectChange(index, 'certificateType', event.target.value)}
                                        displayEmpty
                                        fullWidth
                                        size="small"
                                    >
                                        <MenuItem value="" disabled>Select Certificate Type</MenuItem>
                                        {certificateTypes.map((type) => (
                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                        ))}
                                    </Select>
                                    </TableCell>

                                    {/* Date Picker */}
                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.100' }}>
                                    <TextField
                                        type="date"
                                        value={row.date || ''}
                                        onChange={(event) => handleSelectChange(index, 'date', event.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        size="small"
                                        inputProps={{ min: new Date().toISOString().split('T')[0] }} // Prevents selecting past dates
                                        fullWidth
                                    />
                                    </TableCell>

                                    {/* File Upload */}
                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.100' }}>
                                    <input type="file" onChange={(event) => handleFileChange(index, event)} />
                                    </TableCell>

                                    {/* Delete Row */}
                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.100' }}>
                                    <IconButton color="error" onClick={() => handleDeleteRow(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>

                                </Table>
                                <Button
                                    variant="contained"
                                    onClick={handleAddRow}
                                    style={{ margin: '10px' }}
                                >
                                    Add Row
                                </Button>

                            </TableContainer>

                        </Grid>
                        <Grid item sm={6}>
                            <Typography variant="body1"><strong>2. Add Audit Schedule:</strong></Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: "tablecolor.main", color: "tablecolor.text" }}>
                                            <TableCell sx={{ border: 0.5, borderColor: 'grey.100', fontWeight: 'bold' }}>Audit Title</TableCell>
                                            <TableCell sx={{ border: 0.5, borderColor: 'grey.100', fontWeight: 'bold' }}>Description</TableCell>
                                            <TableCell sx={{ border: 0.5, borderColor: 'grey.100', fontWeight: 'bold' }}>Start Date</TableCell>
                                            <TableCell sx={{ border: 0.5, borderColor: 'grey.100', fontWeight: 'bold' }}>End Date</TableCell>
                                            <TableCell sx={{ border: 0.5, borderColor: 'grey.100', fontWeight: 'bold' }}>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Array.isArray(audiAgencyFormValues?.auditScope) &&
                                            audiAgencyFormValues?.auditScope.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.100' }}>
                                                        <TextField
                                                            placeholder="Audit Title"
                                                            value={row.auditTitle || ''}
                                                            onChange={(event) => handleAuditTitleChange(index, event.target.value)}
                                                            multiline
                                                            rows={3}
                                                            fullWidth
                                                            InputProps={{
                                                                style: {
                                                                    padding: '10px',
                                                                },
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.100' }}>
                                                        <TextField
                                                            placeholder="Description"
                                                            value={row.description || ''}
                                                            onChange={(event) => handleDescriptionChange(index, event.target.value)}
                                                            multiline
                                                            rows={3}
                                                            fullWidth
                                                            InputProps={{
                                                                style: {
                                                                    padding: '10px',
                                                                },
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.100' }}>
                                                        <TextField
                                                            type="date"
                                                            value={row.startDate || ''}
                                                            onChange={(event) => handleStartDateChange(index, event.target.value)}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            inputProps={{
                                                                min: new Date().toISOString().split('T')[0], // Disables past dates
                                                            }}
                                                            size='small'
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.100' }}>
                                                        <TextField
                                                            type="date"
                                                            value={row.endDate || ''}
                                                            onChange={(event) => handleEndDateChange(index, event.target.value)}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            inputProps={{
                                                                min: new Date().toISOString().split('T')[0], // Disables past dates
                                                            }}
                                                            size='small'
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.100' }}>
                                                        <IconButton color="error" onClick={() => handleDeleteAuditScopeRow(index)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                                <Button
                                    variant="contained"
                                    onClick={handleAddAuditScopeRow}
                                    style={{ margin: '10px' }}
                                >
                                    Add Row
                                </Button>
                            </TableContainer>
                        </Grid>
                        <Grid item sm={6}>
                            <Typography variant="body1"><strong>3. Upload Undertaking: (Only PDF and Max allowed size 5 MB)</strong></Typography>
                        </Grid>
                        <Grid item sm={11}>
                            <Grid container direction="row" sx={{ border: '1px solid #cfcfcf', borderRadius: '5px' }}>
                                <Grid item >
                                    <Button
                                        component="label"
                                        variant="contained"
                                        startIcon={<CloudUploadIcon />}
                                    >
                                        Upload file
                                        <VisuallyHiddenInput
                                            key={fileInputKey}
                                            type="file"
                                            name="undertakingFile"
                                            onChange={handleFilesChange}
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
                            {formErrors.file1 && (
                                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                    {formErrors.file1}
                                </Typography>
                            )}


                        </Grid>

                    </Grid>

                    <Grid container sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>

                        <Grid item>
                            <Captcha setCaptcha={setCaptchaText}
                                setCaptchaInput={setCaptchaInput}
                                captchaInput={captchaInput}
                                captchaError={!!formErrors.captcha}
                                captchaErrorMsg={formErrors.captcha} />

                        </Grid>
                    </Grid>

                    <Grid container direction="row" sx={{ mt: 4 }} spacing={2} justifyContent="center" alignItems="center">
                        <Grid item  >
                            <Button type="submit" fullWidth variant="contained" sx={{ maxWidth: '120px' }}>
                                Submit
                            </Button>
                        </Grid>
                        <Grid item  >
                            <Button type="button" onClick={handleReset} color="reset" fullWidth variant="contained" sx={{ maxWidth: '120px', color: "#FFFFFF" }}>
                                Reset
                            </Button>
                        </Grid>
                    </Grid>




                </Box>
            </FormWrapper>
        </>
    );
});

export default AuditorDetails;
