import React from 'react';
import { Grid, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const ViewAuditAgencyDetails = ({ auditAgency }) => {
  const {
    auditAgencyName,
    phoneRecord,
    emailId,
    effectiveFrom,
    effectiveTo,
    blockNo,
    village,
    postOffice,
    subDivision,
    country,
    state,
    city,
    pin,
    auditors,
    status
  } = auditAgency;

  return (
    <Box p={3}>
      <Typography variant="h6" fontWeight="bold" color="primary.tabletext">1. Basic Details</Typography>
      <Grid container spacing={2}>
        <Grid item sm={6}>
          <Typography variant="h6" color="primary.tabletext">Audit Agency Name:</Typography>
        </Grid>
        <Grid item sm={6}>
          <Typography variant="h6">{auditAgencyName}</Typography>
        </Grid>
      </Grid>
      
      <Grid container spacing={2} mt={2}>
        <Grid item xs={12}>
          <Typography variant="h6" fontWeight="bold" color="primary.tabletext">Contacts:</Typography>
          <TableContainer>
            <Table sx={{border:  0.5, borderColor: 'grey.500' }}>
              <TableHead>
                <TableRow sx={{backgroundColor:"tablecolor.main", color: "tablecolor.text"}}>
                  <TableCell sx={{ border:  0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Contact Type</TableCell>
                  <TableCell sx={{border:  0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Area Code</TableCell>
                  <TableCell sx={{border:  0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Mobile Number / Telephone Number</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {phoneRecord.map((contact, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ border:  0.5, borderColor: 'grey.500' }}>{contact.contactType}</TableCell>
                    <TableCell sx={{border:  0.5, borderColor: 'grey.500' }}>{contact.areaCode}</TableCell>
                    <TableCell sx={{ border:  0.5, borderColor: 'grey.500' }}>{contact.mobile}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Grid container spacing={2} mt={2}>
        <Grid item xs={12}>
          <Typography variant="h6" fontWeight="bold" color="primary.tabletext">Emails:</Typography>
          <TableContainer>
            <Table sx={{ border:  0.5, borderColor: 'grey.500' }}>
              <TableHead>
                <TableRow sx={{backgroundColor:"tablecolor.main", color: "tablecolor.text"}}>
                  <TableCell sx={{ border:  0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Email Type</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Email ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {emailId.map((email, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{email.emailType}</TableCell>
                    <TableCell sx={{ border:  0.5, borderColor: 'grey.500' }}>{email.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Grid container spacing={2} mt={2}>
        <Grid item xs={3}>
          <Typography variant="h6" color="primary.tabletext">Effective From:</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6">{effectiveFrom}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6" color="primary.tabletext">Effective To:</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6">{effectiveTo}</Typography>
        </Grid>
      </Grid>

      <Typography variant="h6" mt={4} fontWeight="bold" color="primary.tabletext">2. Address</Typography>
      
      <Grid container spacing={2} mt={2}>
        <Grid item xs={3}>
          <Typography variant="h6" color="primary.tabletext">Flat/Door/Block No:</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6">{blockNo}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6" color="primary.tabletext">Village:</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6">{village}</Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} mt={2}>
        <Grid item xs={3}>
          <Typography variant="h6" color="primary.tabletext">Road/Post Office:</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6">{postOffice}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6" color="primary.tabletext">Area/Sub-Division:</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6">{subDivision}</Typography>
        </Grid>
      </Grid>
      
      <Grid container spacing={2} mt={2}>
        <Grid item xs={3}>
          <Typography variant="h6" color="primary.tabletext">Country:</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6">{country}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6" color="primary.tabletext">State/Province:</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6">{state}</Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} mt={2}>
        <Grid item xs={3}>
          <Typography variant="h6" color="primary.tabletext">District:</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6">{city}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6"color="primary.tabletext">Pin:</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6">{pin}</Typography>
        </Grid>
      </Grid>

      <Typography variant="h6" mt={4} fontWeight="bold" color="primary.tabletext">3. Auditors</Typography>
      <TableContainer>
        <Table sx={{ border:  0.5, borderColor: 'grey.500' }}>
          <TableHead>
            <TableRow sx={{backgroundColor:"tablecolor.main", color: "tablecolor.text"}}>
              <TableCell sx={{ border:  0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Salutation</TableCell>
              <TableCell sx={{ border:  0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>First Name</TableCell>
              <TableCell sx={{ border:  0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Middle Name</TableCell>
              <TableCell sx={{border:  0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Last Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {auditors.map((auditor, index) => (
              <TableRow key={index}>
                <TableCell sx={{ border:  0.5, borderColor: 'grey.500' }}>{auditor.salutation}</TableCell>
                <TableCell sx={{border:  0.5, borderColor: 'grey.500' }}>{auditor.firstName}</TableCell>
                <TableCell sx={{ border:  0.5, borderColor: 'grey.500' }}>{auditor.middleName}</TableCell>
                <TableCell sx={{ border:  0.5, borderColor: 'grey.500' }}>{auditor.lastName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container spacing={2} sx={{ml: 1}}>
                <Grid item sm={6}>
                    <Typography variant="h6" color="primary.tabletext">Status:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="h6">{status==="Active"?"Verified": "Not Verified"}</Typography>
                </Grid>
            </Grid>

    </Box>
  );
};

export default ViewAuditAgencyDetails;
