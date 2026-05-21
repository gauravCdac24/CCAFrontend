import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, TextField, Button, Collapse, Table, TableHead, TableBody, TableRow, TableCell, TableContainer } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import stringToDateFormat from '../../../../global/util/DateUtil';
import AnnexureService from '../../../../../service/AnnexureA2Service/AnnexureService';
import LoaderProgress from '../../../../global/common/LoaderProgress';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import ValidatePattern from '../../../../global/util/ValidatePattern';
import { useSelector } from 'react-redux';

const errorMsg = {
  fullName: {
    blank: "Full name cannot be empty.",
    length: "Full name must be between 3 and 100 characters.",
    format: "Full name can only contain alphabets and spaces."
  },
  designation: {
    blank: "Designation cannot be empty.",
    length: "Designation must be between 3 and 50 characters.",
    format: "Designation can only contain alphabets and spaces."
  },
  locationOfPosting: {
    blank: "Location of posting cannot be empty.",
    length: "Location of posting must be between 3 and 100 characters.",
    format: "Only alphabets, numbers, characters ().,&- are allowed"
  },
  role: {
    blank: "Role cannot be empty.",
    length: "Role must be between 3 and 50 characters.",
    format: "Role can only contain alphabets and spaces."
  },
  idCardNo: {
    blank: "ID card number cannot be empty.",
    length: "ID card number must be between 3 and 20 characters.",
    format: "ID card number can only contain alphanumeric characters."
  },
  mobileNo: {
    blank: "Mobile number cannot be empty.",
    format: "Mobile number must start with 6, 7, 8, or 9 and be exactly 10 digits."
  },
  identificationDetails: {
    blank: "Identification details cannot be empty.",
    length: "Identification details must be between 3 and 250 characters.",
    format: "Only alphabets, numbers, characters ().,&- are allowed"
  },
  employedSince: {
    blank: "Employed since date cannot be empty."
  },
  trainingDetails: {
    blank: "Training details cannot be empty.",
    length: "Training details must be between 3 and 250 characters.",
    format: "Only alphabets, numbers, characters ().,&- are allowed"
  },
  lastBackVerDate: {
    blank: "Last background verification date cannot be empty."
  }
};

const TrustedPersonsList = () => {
  const [open, setOpen] = useState(false);
  const userName = useSelector((state) => state.jwtAuthentication.username);
  const [isLoading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [personsData, setPersonsData] = useState([
    {
      id: 1,
      personId: '',
      fullName: '',
      designation: '',
      locationOfPosting: '',
      role: '',
      idCardNo: '',
      mobileNo: '',
      identificationDetails: '',
      employedSince: '',
      trainingDetails: '',
      lastBackVerDate: '',
    },
  ]);

  const validateForm = (data) => {
    const errors = [];

    data.forEach((item, index) => {
      errors[index] = {};

      const NAME_PATTERN = /^[A-Za-z ]+$/;
      const ID_CARD_PATTERN = /^[A-Za-z0-9]{3,20}$/;
      const MOBILE_PATTERN = /^[6-9]{1}[0-9]{9}$/;
      const STRING_PATTERN = /^[A-Za-z0-9().,&\- ]+$/;

      // Full Name Validation
      if (!item.fullName) {
        errors[index].fullName = errorMsg.fullName.blank;
      } else if (item.fullName.length < 3 || item.fullName.length > 100) {
        errors[index].fullName = errorMsg.fullName.length;
      } else if (!NAME_PATTERN.test(item.fullName)) {
        errors[index].fullName = errorMsg.fullName.format;
      }

      // Designation Validation
      if (!item.designation) {
        errors[index].designation = errorMsg.designation.blank;
      } else if (item.designation.length < 3 || item.designation.length > 50) {
        errors[index].designation = errorMsg.designation.length;
      } else if (!NAME_PATTERN.test(item.designation)) {
        errors[index].designation = errorMsg.designation.format;
      }

      // Location of Posting Validation
      if (!item.locationOfPosting) {
        errors[index].locationOfPosting = errorMsg.locationOfPosting.blank;
      } else if (item.locationOfPosting.length < 3 || item.locationOfPosting.length > 100) {
        errors[index].locationOfPosting = errorMsg.locationOfPosting.length;
      } else if (!STRING_PATTERN.test(item.locationOfPosting)) {
        errors[index].locationOfPosting = errorMsg.locationOfPosting.format;
      }

      // Role Validation
      if (!item.role) {
        errors[index].role = errorMsg.role.blank;
      } else if (item.role.length < 3 || item.role.length > 50) {
        errors[index].role = errorMsg.role.length;
      } else if (!NAME_PATTERN.test(item.role)) {
        errors[index].role = errorMsg.role.format;
      }

      // ID Card Validation
      if (!item.idCardNo) {
        errors[index].idCardNo = errorMsg.idCardNo.blank;
      } else if (!ID_CARD_PATTERN.test(item.idCardNo)) {
        errors[index].idCardNo = errorMsg.idCardNo.format;
      }

      // Mobile Number Validation
      if (!item.mobileNo) {
        errors[index].mobileNo = errorMsg.mobileNo.blank;
      } else if (!MOBILE_PATTERN.test(item.mobileNo)) {
        errors[index].mobileNo = errorMsg.mobileNo.format;
      }

      // Identification Details Validation
      if (!item.identificationDetails) {
        errors[index].identificationDetails = errorMsg.identificationDetails.blank;
      } else if (item.identificationDetails.length < 3 || item.identificationDetails.length > 250) {
        errors[index].identificationDetails = errorMsg.identificationDetails.length;
      } else if (!STRING_PATTERN.test(item.identificationDetails)) {
        errors[index].identificationDetails = errorMsg.identificationDetails.format;
      }

      // Employed Since Validation
      if (!item.employedSince) {
        errors[index].employedSince = errorMsg.employedSince.blank;
      }

      // Training Details Validation
      if (!item.trainingDetails) {
        errors[index].trainingDetails = errorMsg.trainingDetails.blank;
      } else if (item.trainingDetails.length < 3 || item.trainingDetails.length > 250) {
        errors[index].trainingDetails = errorMsg.trainingDetails.length;
      } else if (!STRING_PATTERN.test(item.trainingDetails)) {
        errors[index].trainingDetails = errorMsg.trainingDetails.format;
      }

      // Last Background Verification Date Validation
      if (!item.lastBackVerDate) {
        errors[index].lastBackVerDate = errorMsg.lastBackVerDate.blank;
      }
    });

    return errors.every(err => Object.keys(err).length === 0) ? {} : errors;
  };

  const getTrustedPersonsList = async () => {

    setLoading(true);
    try {
      const response = await AnnexureService.getTrustedPersonDetails();

      if (response.data.length > 0) {


        const list = response.data.map((obj, index) => {
          obj['id'] = index + 1;
          obj['employedSince'] = stringToDateFormat(obj.employedSince, "yyyy-MM-dd");
          obj['lastBackVerDate'] = stringToDateFormat(obj.lastBackVerDate, "yyyy-MM-dd");
          return obj;
        });

        setPersonsData(list);

      }




      setLoading(false);


    } catch (err) {
      setLoading(false);
    }



  }


  useEffect(() => {

    getTrustedPersonsList();

  }, [])




  const handleChange = (id, field, value) => {
    setPersonsData(
      personsData.map((person) =>
        person.id === id ? { ...person, [field]: value } : person
      )
    );
  };

  const handleAddRow = () => {
    setPersonsData([
      ...personsData,
      {
        id: personsData.length > 0 ? personsData[personsData.length - 1].id + 1 : 1,
        personId: '',
        fullName: '',
        designation: '',
        locationOfPosting: '',
        role: '',
        idCardNo: '',
        mobileNo: '',
        identificationDetails: '',
        employedSince: '',
        trainingDetails: '',
        lastBackVerDate: '',
      },
    ]);
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showAlert({
        messageTitle: 'Validation Error',
        messageContent: 'Please select a file first!',
        confirmText: 'OK',
        enableHeaderCloseBtn: true,
        disableOutsideKeyDown: true,
      });
      return;
    }

    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!validTypes.includes(selectedFile.type)) {
      showAlert({
        messageTitle: 'Validation Error',
        messageContent: 'Please select a valid Excel file (.xls or .xlsx)',
        confirmText: 'OK',
        enableHeaderCloseBtn: true,
        disableOutsideKeyDown: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('userName', userName);

    try {
      setLoading(true);
      const response = await AnnexureService.uploadExcelSheet(formData); // Assuming personsData is from the uploaded file or state
      setLoading(false);

      showAlert({
        messageTitle: 'Add Audit Period Details',
        messageContent: response.data,
        confirmText: 'Ok',
      });

      getTrustedPersonsList(); // Refresh list after successful upload

    } catch (error) {
      setLoading(false);
      showAlert({
        messageTitle: 'Error',
        messageContent:
          error?.response?.data || error.message || 'Something went wrong while uploading!',
        confirmText: 'OK',
        enableHeaderCloseBtn: true,
        disableOutsideKeyDown: true,
      });
    }
  };



  const handleRemoveRow = (id) => {
    if (personsData.length > 1) {
      setPersonsData(personsData.filter((person) => person.id !== id));
    }
  };





  const handleSubmit = async () => {

    const errors = validateForm(personsData);

    if (Object.keys(errors).length === 0) {
      setFormErrors({});
      setLoading(true);
      try {


        const response = await AnnexureService.addTrustedPerson(personsData);
        setLoading(false);

        showAlert({
          messageTitle: 'Add Audit Period Details',
          messageContent: response.data,
          confirmText: 'Ok',
        })

        getTrustedPersonsList();

      } catch (err) {
        setLoading(false);



        showAlert({
          messageTitle: 'Error',
          messageContent: err.response.data ? typeof err.response.data === 'object' ? 'Your request cannot be processed at this time. Please try again later.' : err.response.data : 'Your request cannot be processed at this time. Please try again later.',
          confirmText: 'Ok',
        })
      }



    } else {
      setFormErrors(errors);
    }

  };

 const handleDownload = () => {
  const fileUrl = `${process.env.PUBLIC_URL}/file/TrustedPersonsList.xlsx`;

  
  const link = document.createElement('a');
  link.href = fileUrl;
  link.setAttribute('download', 'TrustedPersonsList.xlsx'); // rename on download if desired
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};





  return (
    <>
      <LoaderProgress open={isLoading} />
      <Box>
        <Box display="flex" alignItems="center">
          <Typography variant="h6" sx={{ color: 'primary.main' }} gutterBottom>
            18. List of CA Trusted Persons
          </Typography>
          <Box sx={{ marginLeft: 'auto' }}>
            <IconButton onClick={() => setOpen(!open)} sx={{ color: 'primary.main' }}>
              {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>





        <Collapse in={open}>


          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
            {/* Left side: Choose File, File Name, Upload */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Hidden file input */}
              <input
                accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                id="contained-button-file"
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              {/* Choose File button */}
              <label htmlFor="contained-button-file">
                <Button variant="contained" component="span">
                  Choose File
                </Button>
              </label>

              {/* Selected file name */}
              {selectedFile && (
                <Typography
                  variant="body2"
                  noWrap
                  sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {selectedFile.name}
                </Typography>
              )}

              {/* Upload button */}
              <Button variant="contained" color="primary" onClick={handleUpload}>
                Upload
              </Button>
            </Box>

            {/* Right side: Download Sample File button */}
            <Button variant="contained" color="primary" onClick={handleDownload}>
              Download Sample File
            </Button>
          </Box>





          <Box mt={2}>
            <TableContainer >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'tablecolor.main', color: 'tablecolor.text' }}>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>S. No.</TableCell>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Designation</TableCell>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Location of Posting DC/DR</TableCell>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Role in CA</TableCell>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>ID Card No</TableCell>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Mobile No</TableCell>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Identification Details in the CA Payroll</TableCell>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Employed Since</TableCell>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Training Details</TableCell>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Date of last background verification</TableCell>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {personsData.map((person, index) => (
                    <TableRow key={index + 1}>
                      <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{index + 1}</TableCell>
                      <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                        <TextField slotProps={{
                          htmlInput: { maxLength: 100 },
                        }} onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z ]+$/)} fullWidth error={!!formErrors[index]?.fullName}
                          helperText={formErrors[index]?.fullName || ''} value={person.fullName} onChange={(e) => handleChange(person.id, 'fullName', e.target.value)} variant="outlined" placeholder="Enter Full Name" />
                      </TableCell>
                      <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                        <TextField slotProps={{
                          htmlInput: { maxLength: 100 },
                        }} onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z ]+$/)} fullWidth error={!!formErrors[index]?.designation}
                          helperText={formErrors[index]?.designation || ''} value={person.designation} onChange={(e) => handleChange(person.id, 'designation', e.target.value)} variant="outlined" placeholder="Enter Designation" />
                      </TableCell>
                      <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                        <TextField slotProps={{
                          htmlInput: { maxLength: 100 },
                        }} onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9\(\),.\-& ]+$/)} fullWidth error={!!formErrors[index]?.locationOfPosting}
                          helperText={formErrors[index]?.locationOfPosting || ''} value={person.locationOfPosting} onChange={(e) => handleChange(person.id, 'locationOfPosting', e.target.value)} variant="outlined" placeholder="Enter Location" />
                      </TableCell>
                      <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                        <TextField slotProps={{
                          htmlInput: { maxLength: 50 },
                        }} onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z ]+$/)} fullWidth error={!!formErrors[index]?.role}
                          helperText={formErrors[index]?.role || ''} value={person.role} onChange={(e) => handleChange(person.id, 'role', e.target.value)} variant="outlined" placeholder="Enter Role" />
                      </TableCell>
                      <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                        <TextField slotProps={{
                          htmlInput: { maxLength: 20 },
                        }} onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9]+$/)} fullWidth error={!!formErrors[index]?.idCardNo}
                          helperText={formErrors[index]?.idCardNo || ''} value={person.idCardNo} onChange={(e) => handleChange(person.id, 'idCardNo', e.target.value)} variant="outlined" placeholder="Enter ID Card No" />
                      </TableCell>
                      <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                        <TextField slotProps={{
                          htmlInput: { maxLength: 10 },
                        }} onKeyDown={(e) => ValidatePattern(e, /^[0-9]+$/)} fullWidth error={!!formErrors[index]?.mobileNo}
                          helperText={formErrors[index]?.mobileNo || ''} value={person.mobileNo} onChange={(e) => handleChange(person.id, 'mobileNo', e.target.value)} variant="outlined" placeholder="Enter Mobile No" />
                      </TableCell>
                      <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                        <TextField slotProps={{
                          htmlInput: { maxLength: 250 },
                        }} onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9\(\),.\-& ]+$/)} fullWidth error={!!formErrors[index]?.identificationDetails}
                          helperText={formErrors[index]?.identificationDetails || ''} value={person.identificationDetails} onChange={(e) => handleChange(person.id, 'identificationDetails', e.target.value)} variant="outlined" placeholder="Enter Identification Details" />
                      </TableCell>
                      <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                        <TextField fullWidth type="date" error={!!formErrors[index]?.employedSince}
                          helperText={formErrors[index]?.employedSince || ''} value={person.employedSince} onChange={(e) => handleChange(person.id, 'employedSince', e.target.value)} variant="outlined" />
                      </TableCell>
                      <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                        <TextField slotProps={{
                          htmlInput: { maxLength: 250 },
                        }} onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9\(\),.\-& ]+$/)} fullWidth value={person.trainingDetails} error={!!formErrors[index]?.trainingDetails}
                          helperText={formErrors[index]?.trainingDetails || ''} onChange={(e) => handleChange(person.id, 'trainingDetails', e.target.value)} variant="outlined" placeholder="Enter Training Details" />
                      </TableCell>
                      <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                        <TextField fullWidth error={!!formErrors[index]?.lastBackVerDate}
                          helperText={formErrors[index]?.lastBackVerDate || ''} type="date" value={person.lastBackVerDate} onChange={(e) => handleChange(person.id, 'lastBackVerDate', e.target.value)} variant="outlined" />
                      </TableCell>
                      <TableCell>

                        {personsData.length === index + 1 && (<IconButton color="primary" onClick={handleAddRow}><AddIcon /></IconButton>)}
                        {personsData.length > 1 && (<IconButton color="error" onClick={() => handleRemoveRow(person.id)}><RemoveIcon /></IconButton>)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box display="flex" justifyContent="right" mt={3}>
              <Button variant="contained" color="primary" onClick={handleSubmit} disabled={selectedFile}>Add</Button>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </>
  );
};

export default TrustedPersonsList;
