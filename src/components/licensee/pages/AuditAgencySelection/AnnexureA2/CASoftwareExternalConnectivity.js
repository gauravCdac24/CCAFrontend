import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, TextField, Button, Collapse, Table, TableHead, TableBody, TableRow, TableCell, TableContainer } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AnnexureService from '../../../../../service/AnnexureA2Service/AnnexureService';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import LoaderProgress from '../../../../global/common/LoaderProgress';
import ValidatePattern from '../../../../global/util/ValidatePattern';


const errorMsg = {
  name: {
    blank: "Name cannot be empty.",
    length: "Name length must be between 3 and 250 characters.",
    format: "Only alphabets, numbers, characters ().,?&- are allowed"
  },
  description: {
    blank: "Description cannot be empty.",
    length: "Description length must be between 3 and 250 characters.",
    format: "Only alphabets, numbers, characters ().,?&- are allowed"
  }
};

const CASoftwareExternalConnectivity = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [caData, setCaData] = useState([
    { id: 1, connectivityDetailsId: '', name: 'Type of each type of external connectivity allowed and details such as access location person etc. Also reference to the coverage under the audit, risk assessment etc', description: '' },
    { id: 2, connectivityDetailsId: '', name: 'Frequency of backup synchronization with DR Site', description: '' },
    { id: 3, connectivityDetailsId: '', name: 'Data loss occurred during the audit period?', description: '' },
    { id: 4, connectivityDetailsId: '', name: 'If data loss occurred, how it was addressed?', description: '' },
  ]);

  
  const validateForm = (data) => {
    const errors = [];
  
    const DESCRIPTION_PATTERN = /^[A-Za-z0-9().,?&\- ]+$/;
  
    data.forEach((item, index) => {
      errors[index] = {};
  
      // Name Validation
      if (!item.name) {
        errors[index].name = errorMsg.name.blank;
      } else if (item.name.length < 3 || item.name.length > 250) {
        errors[index].name = errorMsg.name.length;
      } else if (!DESCRIPTION_PATTERN.test(item.name)) {
        errors[index].name = errorMsg.name.format;
      }
  
      // Description Validation
      if (!item.description) {
        errors[index].description = errorMsg.description.blank;
      } else if (item.description.length < 3 || item.description.length > 250) {
        errors[index].description = errorMsg.description.length;
      } else if (!DESCRIPTION_PATTERN.test(item.description)) {
        errors[index].description = errorMsg.description.format;
      }
    });
  
    return errors.every(err => Object.keys(err).length === 0) ? {} : errors;
  };



  const handleChange = (id, field, value) => {
    setCaData((prevState) => 
            prevState.map((row) =>
            row.id === id ? { ...row, [field]: value } : row
        )
    );
};



const handleSubmit = async () => {
       
  const errors = validateForm(caData);
  
  if (Object.keys(errors).length === 0) {
      setFormErrors({});
      setLoading(true);
      try{

         
          const response = await AnnexureService.addConnectivityDetails(caData);
          setLoading(false);

          showAlert({
              messageTitle: 'Add Audit Period Details',
              messageContent: response.data,
              confirmText: 'Ok',
          })

          getConnectivityDetails();

      }catch(err){
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


const getConnectivityDetails = async () =>{

  setLoading(true);
  try{
      const response = await AnnexureService.getConnectivityDetails();

      if(response.data.length===4){

          
          const list = response.data.map((obj, index) => {
              obj['id'] = index + 1;
              return obj;
          });

          setCaData(list);

      }


      

      setLoading(false);


  }catch(err){
      setLoading(false);
  }
  
  

}


useEffect(()=>{

  getConnectivityDetails();

}, [])




  return (
    <>
    <LoaderProgress open={isLoading} />
    <Box>
      
      <Box display="flex" alignItems="center">
        <Typography variant="h6" sx={{ color: 'primary.main' }} gutterBottom>
          16. CA Software and external connectivity
        </Typography>

        
        <Box sx={{ marginLeft: 'auto' }}>
          
          <IconButton onClick={() => setOpen(!open)} sx={{ color: 'primary.main' }}>
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      
      <Collapse in={open}>
        <Box mt={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'tablecolor.main', color: 'tablecolor.text' }}>
                 <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>S. No.</TableCell>
                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {caData.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                                         {row.id}
                                       </TableCell>
                                       <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                                          {row.name}
                                       </TableCell>
                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                      <TextField
                        fullWidth
                        value={row.description}
                        onChange={(e) => handleChange(row.id, 'description', e.target.value)}
                        variant="outlined"
                        placeholder="Enter details"
                       sx={{minWidth: {lg:'300px'}}}
                        error={!!formErrors[index]?.description}
                        helperText={formErrors[index]?.description || ''}
                        onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9\(\),.?\-& ]+$/)}
                                                slotProps={{
                                                    htmlInput: { maxLength: 250 }, 
                                                  }}
                      />
                    </TableCell>
                  
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          
          <Box display="flex" justifyContent="right" mt={3} sx={{ gap: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              ADD
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
    </>
  );
  
};

export default CASoftwareExternalConnectivity;
