import React, { useEffect, useState } from 'react';
import { Box, Collapse, IconButton, Typography, TextField,Button,Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ValidatePattern from '../../../global/util/ValidatePattern';
import showAlert from '../../../global/common/MessageBox/AlertService';
import AnnexureService from '../../../../service/AnnexureA2Service/AnnexureService';

import LoaderProgress from '../../../global/common/LoaderProgress';
import stringToDateFormat from '../../../global/util/DateUtil';
import { useParams } from 'react-router-dom';
import { decrypt } from '../../../global/util/EncryptDecrypt';
import AnnexureAuditorService from '../../../../service/AnnexureA2Service/AnnexureAuditorService';

const errorMsg = {

    observations: {
        blank: "Observation cannot be empty.",
        length: "The length must be between 3 and 500 characters.",
        format: "Only alphabet, numbers, characters ().,-& and spaces are allowed.",
        words: "Maximum 50 words are allowed."
    },

    fromDate: {
        blank: "Please select from date.",
        diff: "From Date must be less than to date."
    },

    toDate: {
        blank: "Please select to date.",
        diff: "To date must be greater than from date."
    },
}



const AuditDetails = () => {
    const {id}=useParams();
    const applicantUserName = decrypt(id);
    
    const [data, setData] = useState([
            { id: 1, periodDetailsId: '', description: 'Audit period of last Annual Audit', fromDate: '', toDate: '', observations: '' },
            { id: 2, periodDetailsId: '', description: 'Audit period of this Annual Audit', fromDate: '', toDate: '', observations: '' },
            { id: 3, periodDetailsId: '', description: 'Audit period of next Annual Audit', fromDate: '', toDate: '', observations: '' },
        ]
    );
    
    const [annexure, setAnnexure] = useState({
        userName: applicantUserName,
        apiNum: '1',
        auditorVerification:''
    })

  
    useEffect(() => {
     
        setAnnexure((prevState) => ({
            ...prevState,
            userName: applicantUserName,
        }));
    }, [applicantUserName]); 

    const handleChanges = (e, field) => {
        setAnnexure(prevState => ({
            ...prevState,
            auditorVerification: field === 'remarks' ? e.target.value : prevState.auditorVerification
        }));
    };

    const [open, setOpen] = useState(true); 
    const [formErrors, setFormErrors] = useState({});

    const countWords = (str) => {

        return str.trim().split(/\s+/).filter(Boolean).length;

    }
    const [isLoading, setLoading] = useState(false);
    const getAnnualAuditPeriodDetails = async () =>{

        setLoading(true);
        try{
            const response = await AnnexureService.getAuditorVerification(annexure);

            console.log("abcd-=-->",response.data);
            const data = response?.data?.details||[];
            

                
                const list = data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['fromDate'] = stringToDateFormat(obj.fromDate, "yyyy-MM-dd");
                    obj['toDate'] = stringToDateFormat(obj.toDate, "yyyy-MM-dd");
                    return obj;
                });

                setData(list);

            
                setAnnexure(prevState => ({
                    ...prevState,
                    auditorVerification:response?.data?.auditorVerification
                }));

            

            setLoading(false);


        }catch(err){
            setLoading(false);
        }
        
        
    
    }


    useEffect(()=>{

        getAnnualAuditPeriodDetails();

    }, [])

    const validateForm = () => {

        const errors = [];

        data.map((item, index)=>{

            if (!errors[index]) {
                errors[index] = {};
            }

            //Observations
            if (!item.observations) {
                errors[index].observations = errorMsg.observations.blank;
            }else if (countWords(item.observations) > 50){
                errors[index].observations = errorMsg.observations.words;
            } 
            else if (item.observations.length < 3 || item.observations.length > 500) {
                errors[index].observations = errorMsg.observations.length;
            } else if (!/^[A-Za-z0-9\(\).,&\- ]+$/.test(item.observations)) {
                errors[index].observations = errorMsg.observations.format;
            }

            //From Date & To Date

             if (!item.fromDate) {
                errors[index].fromDate = errorMsg.fromDate.blank;
            }else if(item.fromDate >= item.toDate){
                errors[index].fromDate = errorMsg.fromDate.diff
                
            }
            
            if (!item.toDate) {
                errors[index].toDate = errorMsg.toDate.blank;
            }else if(item.fromDate >= item.toDate){
                
                errors[index].toDate = errorMsg.toDate.diff
            }
           
        });
    
        let isError = false;
        for(let i=0; i<errors.length; i++){
            if(Object.keys(errors[i]).length !== 0){
                isError = true;
            }
        }
        if(!isError)
            return {};

       return errors;


    }


    const handleChange = (id, field, value) => {
        setData((prevState) => 
                prevState.map((row) =>
                row.id === id ? { ...row, [field]: value } : row
            )
        );
    };


    const handleSubmit = async () => {
       
        // const errors = validateForm();
        
        // if (Object.keys(errors).length === 0) {
        //     setFormErrors({});
            setLoading(true);
            try{

               
                const response = await AnnexureService.addAuditorVerification(annexure);
                setLoading(false);

                showAlert({
                    messageTitle: 'Add Audit Period Details',
                    messageContent: response.data,
                    confirmText: 'Ok',
                })

                getAnnualAuditPeriodDetails();

            }catch(err){
                setLoading(false);

                

                showAlert({
                    messageTitle: 'Error',
                    messageContent: err.response.data ? typeof err.response.data === 'object' ? 'Your request cannot be processed at this time. Please try again later.' : err.response.data : 'Your request cannot be processed at this time. Please try again later.',
                    confirmText: 'Ok',
                })
            }

                

        // } else {
        //     setFormErrors(errors);
        // }
    };
    
   
    return (
        <Box>
            
            <LoaderProgress open={isLoading} />

            <Box display="flex" alignItems="center">
                <Typography variant="h6" sx={{color:"primary.main"}} gutterBottom>
                    1. Annual Audit Period Details
                </Typography>
                <Box sx={{ marginLeft: 'auto' }}>
                    <IconButton
                        onClick={() => setOpen(!open)}
                    sx={{color:"primary.main"}}
                    >
                        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                </Box>
            </Box>
                <Collapse in={open}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "tablecolor.main", color: "tablecolor.text" }}>
                                <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>S. No.</TableCell>
                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Description</TableCell>
                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>From</TableCell>
                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>To</TableCell>
                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Brief details of open observation (max 50 words)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {data.map((row, index) => (
                                    <TableRow key={row.id}>
                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{row.id}</TableCell>
                                        <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{row.description}</TableCell>
                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                                            <TextField
                                                disabled
                                                type="date"
                                                value={row.fromDate}
                                                onChange={(e) =>
                                                    handleChange(row.id, 'fromDate', e.target.value)
                                                }
                                                fullWidth
                                                error={!!formErrors[index]?.fromDate}
                                                helperText={formErrors[index]?.fromDate || ''}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                                            <TextField
                                                disabled
                                                type="date"
                                                value={row.toDate}
                                                onChange={(e) =>
                                                    handleChange(row.id, 'toDate', e.target.value)
                                                }
                                                fullWidth
                                                error={!!formErrors[index]?.toDate}
                                                helperText={formErrors[index]?.toDate || ''}
                                            />
                                        </TableCell>
                                    <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                                            <TextField
                                                disabled
                                                multiline
                                                rows={2}
                                                value={row.observations}
                                                onChange={(e) =>
                                                    handleChange(row.id, 'observations', e.target.value)
                                                }
                                                fullWidth
                                                error={!!formErrors[index]?.observations}
                                                helperText={formErrors[index]?.observations || ''}
                                                onKeyDown={(e) => ValidatePattern(e, /^[A-Za-z0-9\(\),.\-& ]+$/)}
                                                slotProps={{
                                                    htmlInput: { maxLength: 500 }, 
                                                  }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box>
        <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" style={{ marginTop: '10px' }}>Auditor Remarks</Typography>
              <TextField
                multiline
                rows={4}
                variant="outlined"
                value={annexure.auditorVerification}
                fullWidth
                onChange={(e) => handleChanges(e, 'remarks')}

                InputProps={{
                  style: {
                    padding: '10px',
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>
                    
           <Box display="flex" justifyContent="right" mt={3} sx={{ gap: 2 }}>
                    <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    ADD
                </Button>
            </Box>


                </Collapse>
            
        </Box>
    );
};


export default AuditDetails;
