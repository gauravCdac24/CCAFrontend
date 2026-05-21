import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, Link, MenuItem, Select, styled, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import LoaderProgress from "../../../global/common/LoaderProgress";
import ESignAPIVersionMasterService from "../../../../service/AdminService/ESignAPIVersionMasterService";
import EsignAPISpecificationService from "../../../../service/AdminService/EsignAPISpecificationService";
import ESPApplicationService from "../../../../service/ESPApplicationService/ESPApplicationService";
import { ErrorMessage, SuccessMessage } from "../../../global/common/MessageBox/ShowCustomMessage";
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; 
import { decrypt } from "../../../global/util/EncryptDecrypt";
import showAlert from "../../../global/common/MessageBox/AlertService";

const ESPApplicationStepThree = ({handleNext, handleBack}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [apiVersionList, setAPIVersionList] = useState([]);
    const [apiSpecificationList, setAPISpecificationList] = useState([]);
    const [filteredAPIVersionList, setFilteredAPIVersionList] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [formValues, setFormValues] = useState({
        esignApiSpecId: '',
        apiVersionId: '',
        auditReportFile: {file: null, fileName: '', fid: '', fileKey: Date.now()+1},
        cpsFile: {file: null, fileName: '', fid: '', fileKey: Date.now()+2}
    })
    const [reviewData, setReviewData] = useState({cpsDocument: true, auditReport: true, esignAPIVersion: true});
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

      //Errors
    const errorMsg = {
        
        cpsFile: {
            blank: "Please upload CPS document.",
            size: "The file size must not exceed 5MB. Please upload a smaller file.",
            format: "Only Pdf file is allowed."
        },

        auditReportFile: {
            blank: "Please upload Audit Report.",
            size: "The file size must not exceed 5MB. Please upload a smaller file.",
            format: "Only Pdf file is allowed."
        },

        esignApiSpecId: {
            blank: "Please select eSign API Specification.",
        },

        apiVersionId: {
            blank: "Please select eSign API Version.",
        },


    };

    const getReviewData = () => {

        setIsLoading(true);
  
        ESPApplicationService.underReviewDataByUsername()
          .then((response)=>{
            setReviewData(response.data);
          })
          .catch((err)=>{
            
          })
          .finally(()=>{
            setIsLoading(false);
          })
  
      }

    const getAPIVersionList = () => {

        setIsLoading(true);
        ESignAPIVersionMasterService.getAllAPIVersion()
        .then((response)=>{
            setAPIVersionList(response.data);
        })
        .catch((err)=>{

        })
        .finally(()=>{
            setIsLoading(false);
        })

    }

    const getAPISpecificationList = () => {

        setIsLoading(true);
        EsignAPISpecificationService.getAllAPISpecification()
        .then((response)=>{
            setAPISpecificationList(response.data);
        })
        .catch((err)=>{

        })
        .finally(()=>{
            setIsLoading(false);
        })

    }

    const getThirdStepData = () => {

        setIsLoading(true);
        ESPApplicationService.getThirdStepData()
        .then((response)=>{

            const decryptedEsignApiSpecId = decrypt(response.data.esignApiSpecId);

            setFormValues({
                esignApiSpecId: decrypt(response.data.esignApiSpecId),
                apiVersionId: decrypt(response.data.apiVersionId),
                auditReportFile: {fileName: response.data.auditReport.fileName, fid: response.data.auditReport.esignDocId},
                cpsFile: {fileName: response.data.cps.fileName, fid: response.data.cps.esignDocId}
            })

            setFilteredAPIVersionList(() => {
                const filterAPIVersion = apiVersionList.filter((e) => {

                    return e.esignApiSpecId.esignApiSpecId === parseInt(decryptedEsignApiSpecId);
                });
                
                return filterAPIVersion;
            });

        })
        .catch((err)=>{

        })
        .finally(()=>{
            setIsLoading(false);
        }) 

    }

    const validateForm = () => {

        const errors = {};

        //valid audit report file
        validateFile(formValues.auditReportFile, errors, "auditReportFile", errorMsg.auditReportFile);

        //valid cps doc file
        validateFile(formValues.cpsFile, errors, "cpsFile", errorMsg.cpsFile);

        if (!formValues.esignApiSpecId) {
            errors.esignApiSpecId = errorMsg.esignApiSpecId.blank;
        } 

        if (!formValues.apiVersionId) {
            errors.apiVersionId = errorMsg.apiVersionId.blank;
        }
    
        return errors;
    };

    const validateFile = (filedoc, errors, errorobj, errmsg) => {

        

        if (filedoc.file) {

            const allowedExtensions = /(\.pdf|\.PDF)$/i;
            if (!allowedExtensions.exec(filedoc.file.name)) {
                errors[errorobj] =errmsg.format;
            }

            if (filedoc.file?.type !== "application/pdf") {
                errors[errorobj] = errmsg.format;
            }  

            const maxSize = 5*1024*1024;

            if (filedoc.file.size > maxSize) {
                errors[errorobj] = errmsg.size;
            }
        } else if(filedoc.fid || filedoc.fileName){

        }
        else {
            errors[errorobj] = errmsg.blank;
        }

    };


    const handleFormSubmit = (e) => {
        e.preventDefault();

        const errors = validateForm();

        if (Object.keys(errors).length === 0) {
            setFormErrors({});

            setIsLoading(true);

            //save details
            ESPApplicationService.saveStepThree(formValues)
            .then((response)=>{

                //SuccessMessage("Success", "Saved successfully.", handleNext);

                showAlert({
                    messageTitle: 'Alert',
                    messageContent: 'Selected API version, audit report and cps document saved successfully.',
                    enableHeaderCloseBtn: false,
                    disableOutsideKeyDown: true,
                    confirmText: 'Ok',
                    onConfirm: ()=>handleNext()
                })

            })
            .catch((err)=>{

                let msg = typeof err?.response?.data === "object" 
                    ? "Not Saved, Try Again." 
                    : err?.response?.data ?? "Not Saved, Try Again.";
                    
                   //ErrorMessage("Error", msg);

                   showAlert({
                    messageTitle: 'Error',
                    messageContent: msg,
                    enableHeaderCloseBtn: false,
                    disableOutsideKeyDown: true,
                    confirmText: 'Ok',
                })
            })
            .finally(()=>{
                setIsLoading(false);
            })
        }
        else {
            
            setFormErrors(errors);
        }
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;

        setFormValues((prevState)=>({
            ...prevState,
            [name]:value
        }))

        //filter api version
        if(name === "esignApiSpecId"){
            setFilteredAPIVersionList(()=>{
                const filterAPIVersion = apiVersionList.filter((e)=>e.esignApiSpecId.esignApiSpecId === value);
                return filterAPIVersion;
            })
            
            setFormValues((prevState)=>({
                ...prevState,
                "apiVersionId": ''
            }))
        }
    }

    const handleFileUpload = (e) => {
        const {name, files} = e.target;

        setFormValues((prevState)=>({
            ...prevState,
            [name]:{
                file: files?.[0],
                fileName: files?.[0].name,
            }

        }))

    }

    const downloadStepThreeFiles = async (id) => {
        try {
            setIsLoading(true);
            const response = await ESPApplicationService.downloadStepThreeDocument(id);
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            const contentDisposition = response.headers['content-disposition'];
            const fileName = contentDisposition 
            ? contentDisposition.split('filename=')[1].replace(/"/g, '')
            : new Date()+".pdf";
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            setIsLoading(false);
        } catch (error) {
            console.error('Error downloading file:', error);
            setIsLoading(false);
        }
    }


    useEffect(()=>{
        getAPIVersionList();
        getAPISpecificationList();
        getThirdStepData();
        getReviewData();
    },[])




    return (
        <>
            <LoaderProgress open={isLoading} />

            <Box component='form' noValidate sx={{ mt: 2, p: 2}} onSubmit={handleFormSubmit}>
            
            <Grid container>
                <Grid item>
                    <InputLabel shrink={false} htmlFor={"coverLetter"} sx={{mb:1}}>
                        <Typography variant='body1'><b>1. Select API Version</b></Typography>
                    </InputLabel>
                </Grid>
            </Grid>

            <Grid container spacing={2} direction="row">

                <Grid item xs={6}>
                    <InputLabel shrink={false} htmlFor={"esignApiSpecId"}>
                        <Typography variant='body1' sx={{color: "#000000"}}>API Specification*</Typography>
                    </InputLabel>

                    <FormControl variant="outlined" size="small" sx={{  mt: 1, width: '100%' }}>
                        
                        <Select
                            id="esignApiSpecId"
                            onChange={handleInputChange}
                            displayEmpty
                            value={formValues.esignApiSpecId || ''}
                            name="esignApiSpecId"
                            error={
                                Boolean(formErrors.esignApiSpecId)
                            }
                            disabled={!reviewData?.esignAPIVersion || false}
                            >

                                <MenuItem disabled value={formValues.esignApiSpecId}>
                                    Select API Specification
                                </MenuItem>


                                {
                                    apiSpecificationList.map((item, index)=>(

                                        <MenuItem key={index} value={item.esignApiSpecId}>{item.apiSpecification}</MenuItem>

                                    ))
                                }
                        </Select>
                        {formErrors.esignApiSpecId && (
                        <FormHelperText error sx={{ml:0}}>{formErrors.esignApiSpecId}</FormHelperText>
                    )}
                    </FormControl>
                    </Grid>


                    <Grid item xs={6}>
                    <InputLabel shrink={false} htmlFor={"apiVersionId"}>
                        <Typography variant='body1' sx={{color: "#000000"}}>API Version*</Typography>
                    </InputLabel>

                    <FormControl variant="outlined" size="small" sx={{  mt: 1, width: '100%' }}>
                        
                        <Select
                            id="apiVersionId"
                            onChange={handleInputChange}
                            displayEmpty
                            value={formValues.apiVersionId || ''}
                            name="apiVersionId"
                            error={
                                Boolean(formErrors.apiVersionId)
                            }
                            disabled={!reviewData?.esignAPIVersion || false}
                            >

                                <MenuItem disabled value={formValues.apiVersionId}>
                                    Select API Version
                                </MenuItem>


                                {
                                    filteredAPIVersionList.map((item, index)=>(

                                        <MenuItem key={index} value={item.esignApiVerId}>{item.apiVersion}</MenuItem>

                                    ))
                                }
                        </Select>
                        {formErrors.apiVersionId && (
                        <FormHelperText error sx={{ml:0}}>{formErrors.apiVersionId}</FormHelperText>
                    )}
                    </FormControl>
                    </Grid>
               
                </Grid>

                <Grid container spacing={2} direction="row" sx={{mt:1}}>

                    <Grid item xs={12} sm>

                                <InputLabel shrink={false} htmlFor={"auditReportFile"} sx={{mb:1}}>
                                    <Typography variant='body1'><b>2. Upload Audit Report</b> (Only PDF and Max allowed size is 5MB)</Typography>
                                </InputLabel>

                                        <Grid container direction="row" sx={{border: '1px solid #cfcfcf', borderRadius: '5px'}}>
                                            <Grid item xs>
                                                <Button
                                                component="label"
                                                variant="contained"
                                                startIcon={<CloudUploadIcon />}
                                                disabled={!reviewData?.auditReport || false}
                                            >
                                                Upload file
                                                <VisuallyHiddenInput
                                                    key={formValues.auditReportFile.fileKey}
                                                    type="file"
                                                    name="auditReportFile"
                                                    onChange={handleFileUpload}
                                                />
                                            </Button>
                                            
                                            </Grid>
                                            <Grid item xs sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                            {formValues.auditReportFile.fileName && (
                                                <Tooltip title={formValues.auditReportFile.fileName} placement="top">
                                                    <Typography variant='body2' sx={{
                                                        display: 'inline-block',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        verticalAlign: 'middle',
                                                        textAlign: 'center'
                                                    }}>
                                                        {formValues.auditReportFile.fileName} {formValues.auditReportFile.file && (<>({Math.ceil(parseInt(formValues.auditReportFile.file.size)/1024)} KB) </>)}
                                                    </Typography>
                                                </Tooltip>
                                            )}    
                                            </Grid>
                                        </Grid>
                                        
                                        {formErrors.auditReportFile && (
                                            <FormHelperText error>{formErrors.auditReportFile}</FormHelperText>
                                        )}

                        </Grid>
                        <Grid item xs sx={{mt: {md: 5, sm: 5}}}>{formValues.auditReportFile.fid && (<Grid item>
                            <Link href="#" onClick={()=>downloadStepThreeFiles(formValues.auditReportFile.fid)}>Download</Link>
                        </Grid>)}</Grid>
                    </Grid>



                    <Grid container spacing={2} direction="row" sx={{mt:1}}>

                        <Grid item xs={12} sm>

                                    <InputLabel shrink={false} htmlFor={"cpsFile"} sx={{mb:1}}>
                                        <Typography variant='body1'><b>3. Upload CPS Document</b> (Only PDF and Max allowed size is 5MB)</Typography>
                                    </InputLabel>

                                            <Grid container direction="row" sx={{border: '1px solid #cfcfcf', borderRadius: '5px'}}>
                                                <Grid item xs>
                                                    <Button
                                                    component="label"
                                                    variant="contained"
                                                    startIcon={<CloudUploadIcon />}
                                                    disabled={!reviewData?.cpsDocument || false}
                                                >
                                                    Upload file
                                                    <VisuallyHiddenInput
                                                        key={formValues.cpsFile.fileKey}
                                                        type="file"
                                                        name="cpsFile"
                                                        onChange={handleFileUpload}
                                                    />
                                                </Button>
                                                
                                                </Grid>
                                                <Grid item xs sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                {formValues.cpsFile.fileName && (
                                                    <Tooltip title={formValues.cpsFile.fileName} placement="top">
                                                        <Typography variant='body2' sx={{
                                                            display: 'inline-block',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            verticalAlign: 'middle',
                                                            textAlign: 'center'
                                                        }}>
                                                            {formValues.cpsFile.fileName} {formValues.cpsFile.file && (<>({Math.ceil(parseInt(formValues.cpsFile.file.size)/1024)} KB) </>)}
                                                        </Typography>
                                                    </Tooltip>
                                                )}    
                                                </Grid>
                                            </Grid>
                                            
                                            {formErrors.cpsFile && (
                                                <FormHelperText error>{formErrors.cpsFile}</FormHelperText>
                                            )}

                            </Grid>
                            <Grid item xs sx={{mt: {md: 5, sm: 5}}}>{formValues.cpsFile.fid && (<Grid item>
                                <Link href="#" onClick={()=>downloadStepThreeFiles(formValues.cpsFile.fid)}>Download</Link>
                            </Grid>)}</Grid>
                        </Grid>



                    <Box sx={{ display: 'flex', justifyContent:'space-between', mt: 3 ,ml:1}}>
                                <Button
                                    sx={{ mr: 1, backgroundColor: "#000", color: "#FFFFFF" }}
                                    variant="contained"
                                    onClick = {handleBack}
                                >
                                    Back
                                </Button> 
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    Save & Next
                            </Button>

                    </Box>


            </Box>
    </>
    )

}

export default ESPApplicationStepThree;