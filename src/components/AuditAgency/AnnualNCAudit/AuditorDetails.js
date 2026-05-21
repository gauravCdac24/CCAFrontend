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
import AnnualAuditService from '../../../service/AnnualAuditService/AnnualAuditService';

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

const AuditorDetails = (() => {
    const{id}=useParams();
    const ApplicantUserName=decrypt(id)
    console.log(ApplicantUserName)
    const [audiAgencyFormValues, setAudiAgencyFormValues] = useState({ auditAgencyName: '',applicantUserName:ApplicantUserName, intentAppId: '', undertakingFile: null, auditors: [], auditorDesscription: [{ auditorName: '', certificateType: '', file: null }], auditScope: [{ auditTitle: '', description: '', startDate: '', endDate: '' }] });
    const [formErrors, setFormErrors] = useState({});
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [allAuditAgencyList, setAllAuditAgencyList] = useState([]);
    const [allAuditAgencySelectionList, setAllAuditAgencySelectionList] = useState([]);
   
    // Reset form values
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
                date: '', // Add default value for date
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

    useEffect(() => {
        getAllAuditAgency();
    }, []);
    
    // Fetch all audit agencies
    const getAllAuditAgency = () => {
        setLoading(true);
    
        AuditAgency.getAllAuditAgencyList()
            .then((response) => {
                console.log('Audit Agencies:', response.data);
                const agencyList = response.data || []; // Ensure it's not null/undefined
                setAllAuditAgencyList(agencyList); // Update the agency list
    
                // Fetch audit selection list after setting the agency list
                fetchAuditSelectionList(agencyList);
            })
            .catch((error) => {
                console.error('Error fetching audit agencies:', error);
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Failed to fetch audit agencies.',
                });
            })
            .finally(() => setLoading(false));
    };
    
    // Fetch audit selection list and update the form
    const fetchAuditSelectionList = (agencyList) => {
        AnnualAuditService.getAllAuditSelectionList()
            .then((response) => {
                console.log('Audit Agencies Selection Response:', response.data);
                const selectionList = response.data || [];
                setAllAuditAgencySelectionList(selectionList);
    
                // Match selected agency based on `auditAgencyId`
                const selectedAgency = agencyList.find((agency) =>
                    selectionList.some((item) => item.auditAgencyId === agency.auditAgencyId)
                );
    
                console.log('Selected Agency:', selectedAgency);
    
                // Update form values safely
                setAudiAgencyFormValues((prev) => ({
                    ...prev,
                    intentAppId: selectedAgency?.auditAgencyId || '',
                    name: selectedAgency?.auditAgencyName || 'N/A',
                    mobileNo: selectedAgency?.phoneRecord || [],
                    emailId: selectedAgency?.emailId || [],
                    auditors: selectedAgency?.auditors || [],
                }));
            })
            .catch((error) => {
                console.error('Error fetching audit selection list:', error);
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Failed to fetch audit selection list.',
                });
            });
    };
    

    console.log('Audit Agencies cch:', audiAgencyFormValues);

    // Validate form inputs
    const validateForm = () => {
        const errors = {};

        if (!audiAgencyFormValues.auditAgencyName) {
            errors.auditAgencyName = errorMsg.AuditAgencyName.blank;
        }

        if (!captchaInput) {
            errors.captcha = errorMsg.captchaError.blank;
        }

        return errors;
    };

    // Form Submission Handler


    const handleSubmit = (e) => {
        e.preventDefault()
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
        formData.append('auditAgencyName', audiAgencyFormValues.auditAgencyName);
        formData.append('intentAppId', audiAgencyFormValues.intentAppId);
        formData.append('applicantUserName', audiAgencyFormValues.applicantUserName);
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
    
        AnnualAuditService.submitAuditForm(formData)
            .then((response) =>
                showAlert({
                    messageTitle: 'Success',
                    messageContent: response.data,
                    confirmText: 'Ok',
                    onConfirm: () => window.location.href = '/auditagency/uploadannualundertaking/annualauditreport',
                })
            )
            .catch((err) => {
                // Handle error response
                const errorMessage = err.response?.data?.message || 'Request failed. Please try again later.';
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
                                            audiAgencyFormValues?.auditorDesscription?.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.100' }}>
                                                        <Select
                                                            value={row.auditorName}
                                                            onChange={(event) =>
                                                                handleSelectChange(index, 'auditorName', event.target.value)
                                                            }
                                                            displayEmpty
                                                            fullWidth
                                                            size="small"
                                                        >
                                                            <MenuItem value="" disabled>
                                                                Select Auditor
                                                            </MenuItem>
                                                            {Array.isArray(audiAgencyFormValues?.auditors) &&
                                                                audiAgencyFormValues?.auditors.map((auditor, auditorIndex) => (
                                                                    <MenuItem key={auditorIndex} value={`${auditor.firstName} ${auditor.lastName || ''}`}>
                                                                        {auditor.firstName || auditor.lastName
                                                                            ? `${auditor.firstName} ${auditor.lastName || ''}`.trim()
                                                                            : 'Unnamed Auditor'}
                                                                    </MenuItem>
                                                                ))}
                                                        </Select>

                                                    </TableCell>
                                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.100' }}>
                                                        <Select
                                                            value={row.certificateType}
                                                            onChange={(event) =>
                                                                handleSelectChange(index, 'certificateType', event.target.value)
                                                            }
                                                            displayEmpty
                                                            fullWidth
                                                            size="small"
                                                        >
                                                            <MenuItem value="" disabled>
                                                                Select Certificate Type
                                                            </MenuItem>
                                                            {certificateTypes.map((type) => (
                                                                <MenuItem key={type} value={type}>
                                                                    {type}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.100' }}>
                                                        <TextField
                                                            type="date"
                                                            value={row.date || ''}
                                                            onChange={(event) =>
                                                                handleSelectChange(index, 'date', event.target.value)
                                                            }
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            size="small"
                                                            inputProps={{
                                                                min: new Date().toISOString().split('T')[0], // Disables past dates
                                                            }}
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.100' }}>
                                                        <input
                                                            type="file"
                                                            onChange={(event) => handleFileChange(index, event)}
                                                        />
                                                    </TableCell>
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
