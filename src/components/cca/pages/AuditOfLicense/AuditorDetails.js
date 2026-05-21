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
import Captcha from '../../../global/util/Captcha';
import LoaderProgress from '../../../global/common/LoaderProgress';
import showAlert from '../../../global/common/MessageBox/AlertService';
import { useNavigate, useParams } from 'react-router-dom';
import FormWrapper from '../../../global/util/FormWrapper';
import AuditAgency from '../../../../service/AdminService/AuditAgency';
import AuditorCertificateTypeService from '../../../../service/AdminService/AuditorCertificateTypeService';
import AuditService from '../../../../service/AuditService/AuditService';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import styled from '@emotion/styled';
import API from '../../../../api/ApplicationAPI';
import { decrypt } from '../../../global/util/EncryptDecrypt';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

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
    const { id } = useParams();
    const ApplicantUserName = decrypt(id)
    console.log(ApplicantUserName)
    const [audiAgencyFormValues, setAudiAgencyFormValues] = useState({ auditAgencyName: '', applicantUserName: ApplicantUserName, intentAppId: '', undertakingFileName: '', undertakingFile: null, auditors: [], auditorDesscription: [{ auditorName: '', certificateType: '', file: null, auditorDescriptionId: '', certificateName: '', certificateExpiry: '' }], auditScope: [{ auditTitle: '', description: '', startDate: '', endDate: '', auditScopeId: '' }] });
    const [formErrors, setFormErrors] = useState({});
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [allAuditAgencyList, setAllAuditAgencyList] = useState([]);
    const [allAuditAgencySelectionList, setAllAuditAgencySelectionList] = useState([]);



    const getAllAuuditorByUserName = () => {
        setLoading(true);

        AuditService.getAuditorApplicationbyApplicatantUserName(ApplicantUserName)
            .then((response) => {
                console.log('getAuditorApplicationbyApplicatantUserName:', response.data);

                // Check if startDate and endDate are correctly parsed
                const processDates = (dateStr) => {
                    if (!dateStr) return '';
                    const date = new Date(dateStr);

                    // Ensure the date is valid
                    if (isNaN(date.getTime())) return ''; // Invalid date check

                    // Format the date as MM/DD/YYYY
                    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (1-12) and ensure it's 2 digits
                    const day = String(date.getDate()).padStart(2, '0'); // Get day (1-31) and ensure it's 2 digits
                    const year = date.getFullYear(); // Get the full year

                    return `${month}/${day}/${year}`; // Return formatted date
                };


                setAudiAgencyFormValues((prevState) => ({
                    ...prevState,
                    auditAgencyName: response.data.auditAgencyName ?? prevState.auditAgencyName,
                    applicantUserName: response.data.applicantUserName ?? prevState.applicantUserName,
                    intentAppId: response.data.intentAppId ?? prevState.intentAppId,
                    undertakingFileName: response.data.undertakingFileName ?? prevState.undertakingFileName,
                    undertakingFile: response.data.undertakingFile ?? prevState.undertakingFile,

                    // Process auditorDesscription array
                                    auditorDesscription: response?.data?.auditorDesscription
                ? response?.data?.auditorDesscription.map((item) => ({
                    auditorDescriptionId: item.auditorDescriptionId ?? '',
                    auditorName: item?.auditorName ?? '',
                    certificateType: item.certificateType ?? '',
                    file: item.file ?? null,
                    certificateName: item.certificateName ?? '',
                    certificateExpiry: item?.certificateExpiry ?? '',
                   
                })):'',


                
                    // Process auditScope array
                    auditScope: response.data.auditScope
                        ? response.data.auditScope.map((item) => ({
                            auditScopeId: item.auditScopeId ?? '',
                            auditTitle: item.auditTitle ?? '',
                            description: item.description ?? '',
                            startDate: processDates(item.startDate), // Convert start date
                            endDate: processDates(item.endDate), // Convert end date
                        }))
                        : prevState.auditScope,
                }));
                setFileName(response?.data?.undertakingFileName)
            })
            .catch(() => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Failed to fetch audit agencies.',
                });
            })
            .finally(() => setLoading(false));
    };

    console.log('audiAgencyFormValues===>:', audiAgencyFormValues);

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
        // If value is a valid date string, Day.js should parse it correctly
        const parsedDate = dayjs(value);

        // Check if the parsed date is valid
        if (!parsedDate.isValid()) {
            console.error('Invalid date:', value);
            return; // Do nothing if the date is invalid
        }

        // If valid, update the state with the parsed date
        const updatedRows = { ...audiAgencyFormValues };
        updatedRows.auditScope[index].endDate = parsedDate.toDate(); // Convert to JavaScript Date object
        setAudiAgencyFormValues(updatedRows); // Update state
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

    // Fetch all audit agencies
    const getAllAuditAgency = () => {
        setLoading(true);
        AuditAgency.getAllAuditAgencyList()
            .then((response) => {
                console.log('Audit Agencies:', response.data); // Debugging API response
                setAllAuditAgencyList(response.data); // Handle null/undefined data gracefully
            })
            .catch(() => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Failed to fetch audit agencies.',
                });
            })
            .finally(() => setLoading(false));
    };

    const getAllAuditAgencySelection = () => {
        setLoading(true);
        AuditService.getAllAuditSelectionList()
          .then((response) => {
            console.log('Audit Agencies Selection:', response.data);
      
            const auditAgencySelectionList = response.data || [];
            setAllAuditAgencySelectionList(auditAgencySelectionList);
      
            if (!allAuditAgencyList || allAuditAgencyList.length === 0) {
              console.error('allAuditAgencyList is not populated');
              return;
            }
      
            const selectedAgency = allAuditAgencyList.find((agency) =>
              auditAgencySelectionList.find(
                (item) => item?.auditAgencyId === agency?.auditAgencyId
              )
            );
      
            console.log('Selected Agency:', selectedAgency);
            console.log('Selected Agency Properties:', {
              auditAgencyName: selectedAgency?.auditAgencyName,
              phoneRecord: selectedAgency?.phoneRecord,
              emailId: selectedAgency?.emailId,
              auditors: selectedAgency?.auditors,
            });
      
            setAudiAgencyFormValues((prev) => {
              const updatedFormValues = { ...prev };
              updatedFormValues.name = selectedAgency?.auditAgencyName || 'N/A';
              updatedFormValues.mobileNo = selectedAgency?.phoneRecord || [];
              updatedFormValues.emailId = selectedAgency?.emailId || [];
              updatedFormValues.auditors = selectedAgency?.auditors || [];
              return updatedFormValues;
            });
          })
          .catch(() => {
            showAlert({
              messageTitle: 'Error',
              messageContent: 'Failed to fetch audit agencies.',
            });
          })
          .finally(() => setLoading(false));
      };
      
      useEffect(() => {
        getAllAuditAgency();
        getAllAuditAgencySelection();
        getAllAuuditorByUserName();
      }, []);

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

    const downloadfile = async (auditorDescriptionId, documentTitle) => {
        try {
            // Fetch the file from the server
            const response = await AuditService.viewFile(auditorDescriptionId);

            // Create a blob from the response data
            const blob = new Blob([response.data], { type: response.headers['content-type'] });

            // Create a link element
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);

            // Extract the filename from the Content-Disposition header
            const contentDisposition = response.headers['content-disposition'];

            console.log(JSON.stringify(contentDisposition))

            const filename = documentTitle;

            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };


    const downloadfiles = async ( documentTitle) => {
        try {
           // alert(documentTitle)
            // Fetch the file from the server
            const response = await AuditService.viewFiles(documentTitle);

            // Create a blob from the response data
            const blob = new Blob([response.data], { type: response.headers['content-type'] });

            // Create a link element
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);

            // Extract the filename from the Content-Disposition header
            const contentDisposition = response.headers['content-disposition'];

            console.log(JSON.stringify(contentDisposition))

            const filename = "AgencyUndertaking";

            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };


    const handleApprovedSubmit = (e) => {
        e.preventDefault()
        showAlert({
            messageTitle: 'Confirm',
            messageContent: 'Are you sure, you want to Approve the Application? You cannot Upload changed Details again. Please verify before the Click the Approved Button.',
            confirmText: 'Yes',
            closeText: 'No',
            fullWidth: true,
            maxWidth: 'md',
            onConfirm: () => approvedFunction()
        })


    };

    const handleRejectedSubmit = (e) => {
        e.preventDefault()
        showAlert({
            messageTitle: 'Confirm',
            messageContent: 'Are you sure, you want to Rejected the Application? You cannot  changed Details again. Please verify before the Click the Rejected Button.',
            confirmText: 'Yes',
            closeText: 'No',
            fullWidth: true,
            maxWidth: 'md',
            onConfirm: () => rejectedFunction()
        })


    };

    const approvedFunction = () => {
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
            formData.append(`auditorDesscription[${index}].auditorDescriptionId`, item.auditorDescriptionId);
            formData.append(`auditorDesscription[${index}].auditorName`, item.auditorName);
            formData.append(`auditorDesscription[${index}].certificateType`, item.certificateType);
            if (item.file) {
                formData.append(`auditorDesscription[${index}].file`, item.file);
            }
        });

        // Append auditScope array
        audiAgencyFormValues.auditScope.forEach((item, index) => {
            formData.append(`auditScope[${index}].auditScopeId`, item.auditScopeId);
            formData.append(`auditScope[${index}].auditTitle`, item.auditTitle);
            formData.append(`auditScope[${index}].description`, item.description);
            formData.append(`auditScope[${index}].startDate`, item.startDate);
            formData.append(`auditScope[${index}].endDate`, item.endDate);
        });



        AuditService.approvedAuditForm(formData)
            .then((response) =>
                showAlert({
                    messageTitle: 'Success',
                    messageContent: response.data,
                    confirmText: 'Ok',
                    onConfirm: () => window.location.href = '/cca/auditorlicense',
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

    const rejectedFunction = () => {
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
            formData.append(`auditorDesscription[${index}].auditorDescriptionId`, item.auditorDescriptionId);
            formData.append(`auditorDesscription[${index}].auditorName`, item.auditorName);
            formData.append(`auditorDesscription[${index}].certificateType`, item.certificateType);
            if (item.file) {
                formData.append(`auditorDesscription[${index}].file`, item.file);
            }
        });

        // Append auditScope array
        audiAgencyFormValues.auditScope.forEach((item, index) => {
            formData.append(`auditScope[${index}].auditScopeId`, item.auditScopeId);
            formData.append(`auditScope[${index}].auditTitle`, item.auditTitle);
            formData.append(`auditScope[${index}].description`, item.description);
            formData.append(`auditScope[${index}].startDate`, item.startDate);
            formData.append(`auditScope[${index}].endDate`, item.endDate);
        });



        AuditService.rejectedAuditForm(formData)
            .then((response) =>
                showAlert({
                    messageTitle: 'Success',
                    messageContent: response.data,
                    confirmText: 'Ok',
                    onConfirm: () => window.location.href = '/cca/auditorlicense',
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
    const [errors, setErrors] = useState({});
    const handleChanges = (e, fieldName) => {
        const { value } = e.target;

        // Reset error for the current field
        setErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: "",
        }));

        // Basic validation
        if (value === "") {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [fieldName]: `${fieldName} cannot be empty`,
            }));
            return;
        }

        // Update state if no validation errors
        setAudiAgencyFormValues((prevValues) => ({
            ...prevValues,
            [fieldName]: value,
        }));
    };



    return (
        <>
            <LoaderProgress open={isLoading} />
            <FormWrapper headingText="Upload Undertaking & Auditors Details">
                <Box component="form" noValidate>
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
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Array.isArray(audiAgencyFormValues?.auditorDesscription) &&
                                            audiAgencyFormValues?.auditorDesscription?.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.100' }}>
                                                    {row?.auditorName || ''}
                                                    </TableCell>
                                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.100' }}>
                                                    {row.certificateType}
                                                    </TableCell>
                                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.100' }}>
                                                    {row?.certificateExpiry || ''}
                                                    </TableCell>
                                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.100' }}>
                                                        {row.certificateName && (
                                                            <a
                                                                onClick={() => downloadfile(row.auditorDescriptionId, row.certificateName)}
                                                                style={{ textDecoration: 'none', color: 'blue' }} // Optional styling
                                                            >
                                                                <span>{row.certificateName}</span>
                                                            </a>
                                                        )}

                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>

                                </Table>

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
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Array.isArray(audiAgencyFormValues?.auditScope) &&
                                            audiAgencyFormValues?.auditScope.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.100' }}>
                                                    {row.auditTitle || ''}
                                                    </TableCell>
                                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.100' }}>
                                                    {row.description || ''}
                                                    </TableCell>
                                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.100' }}>
                                                       {row.startDate}

                                                    </TableCell>
                                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.100' }}>
                                                       {row.endDate}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item sm={6}>
                        <Typography variant="body1">
                        <strong>3. Undertaking File:</strong>{' '}
                        <a
                            onClick={() => downloadfiles(fileName)}
                            style={{ textDecoration: 'none', color: 'blue' }} // Optional styling
                        >
                            <span>{fileName}</span>
                        </a>
                        </Typography>
                        </Grid>
                     
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6" style={{ marginTop: '10px' }}>
                                Remarks
                            </Typography>
                            <TextField
                                multiline
                                rows={4}
                                variant="outlined"
                                fullWidth
                                onChange={(e) => handleChanges(e, 'remarks')}
                                error={!!errors.remarks} // Shows red border if there's an error
                                helperText={errors.remarks || ''} // Displays the error message
                                InputProps={{
                                    style: {
                                        padding: '10px',
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container direction="row" sx={{ mt: 4 }} spacing={2} justifyContent="center" alignItems="center">
                        <Grid item>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ maxWidth: '120px', height: '40px' }}
                                onClick={handleApprovedSubmit}
                                aria-label="Approve the request"
                            >
                                Approved
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                type="button"
                                variant="contained"
                                color="error"
                                sx={{ maxWidth: '120px', height: '40px', color: '#FFFFFF' }}
                                onClick={handleRejectedSubmit}
                                aria-label="Reject the request"
                            >
                                Rejected
                            </Button>
                        </Grid>
                    </Grid>





                </Box>
            </FormWrapper>
        </>
    );
});

export default AuditorDetails;
