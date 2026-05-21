import { Box, Button, FormHelperText, Grid, IconButton, InputLabel, Link, styled, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import LoaderProgress from "../../../global/common/LoaderProgress";
import ESPApplicationService from "../../../../service/ESPApplicationService/ESPApplicationService";
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; 
import { decrypt } from "../../../global/util/EncryptDecrypt";
import showAlert from "../../../global/common/MessageBox/AlertService";
import EditNoteIcon from '@mui/icons-material/EditNote';
import Esign from "../../../global/pages/Esign";
import CallComponent from "../../../global/common/CallComponent/CallComponent";
import EsignService from "../../../../service/EsignService/EsignService";

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
    
    coverLetter: {
        blank: "Please upload cover letter.",
        size: "The file size must not exceed 5MB. Please upload a smaller file.",
        format: "Only Pdf file is allowed."
    },

    eKYCApproval: {
        blank: "Please upload required eKYC Approval.",
        size: "The file size must not exceed 5MB. Please upload a smaller file.",
        format: "Only Pdf file is allowed."
    },

}


const ESPApplicationStepTwo = ({handleNext, handleBack}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [coverLetterDoc, setCoverLetterDoc] = useState({
        fid: '',
        file: null,
        fileName: '',
        fileKey: Date.now(),
        signedId: '' 
    })
    const [eKYCApprovalDoc, setEKYCApprovalDoc] = useState([])
    const [selectedEKYCModes, setSelectedEKYCModes] = useState([]);
    const [reviewData, setReviewData] = useState({coverLetter: true, ekycMode: true});


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



      const downloadSignedDocument = (id, filename)=>{

        EsignService.downloadDigitallySignedDocument(id, filename);

      }


    const getSecondStepData = () => {

        setIsLoading(true);
        ESPApplicationService.getSecondStepData()
        .then((response)=>{

            setCoverLetterDoc({
                fid: response.data.esignDocument.eSignDocId,
                file: null,
                fileName: response.data.esignDocument.fileName.trim(),
                fileKey: Date.now(),
                signedId: response.data?.esignDocument?.esignDocument || ''
            })

            
            const ekycApprovalsObj = [];

            response.data.eKYCMode.forEach((element, index) => {

                const obj = {
                    id: decrypt(element.ekycMode),
                    file: null,
                    fileName: element.fileName.trim(),
                    fileKey: Date.now()+index+1,
                    fid: element.ekycModeId
                }

                ekycApprovalsObj.push(obj);

            })

            setEKYCApprovalDoc(ekycApprovalsObj);

        })
        .catch((err)=>{

        })
        .finally(()=>{
            setIsLoading(false);
        }) 

    }

    const getSelectedEKYCMode = () =>{
        
        setIsLoading(true);

        const updatedEkycSelected = [];

        ESPApplicationService.getSelectedEKYCMode()
        .then(response=>{

            const result = response.data.map((item, index)=>{
                item['ekycMode'] = decrypt(item.ekycMode);

                const emptyFileObj = {
                    id: item.ekycMode,
                    file: null,
                    fileName: '',
                    fileKey: Date.now()+index+1,
                    fid: '' 
                }

                updatedEkycSelected.push(emptyFileObj);

                return item;
            })

            setEKYCApprovalDoc(updatedEkycSelected);
            setSelectedEKYCModes(result);
            
        })
        .catch((err)=>{

        })
        .finally(()=>{
            setIsLoading(false);
        })

    }

    const handleCoverFileChange = (e) => {
        const file = e.target.files?.[0]; 
    
        setCoverLetterDoc((prevState) => ({
            ...prevState,
            file: file || null,
            fileName: file?.name || '',
            fid: '',
            signedId: ''
        }));

        

    };

    const handleEKYCApprovalDoc = (e, index) => {
        const file = e.target.files?.[0]; 
    
        setEKYCApprovalDoc((prevDocs) => {
            
            const updatedDocs = [...prevDocs];
            
            updatedDocs[index] = {
                ...updatedDocs[index], 
                file: file || null,    
                fileName: file?.name || '',
                fid: ''
            };
            return updatedDocs;
        });

    };

    const downloadDocument = async (id, type) => {

        try {
            setIsLoading(true);
            const response = await ESPApplicationService.downloadStepTwoDocument(id, type);
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            const contentDisposition = response.headers['content-disposition'];
            const fileName = contentDisposition 
            ? contentDisposition.split('filename=')[1].replace(/"/g, '')
            : type+".pdf";
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

    

    const validateFile = (errors) => {

        if (coverLetterDoc.file) {

            const allowedExtensions = /(\.pdf|\.PDF)$/i;
            if (!allowedExtensions.exec(coverLetterDoc.file.name)) {
                errors.coverLetter = errorMsg.coverLetter.format;
            }

            if (coverLetterDoc.file?.type !== "application/pdf") {
                errors.coverLetter = errorMsg.coverLetter.format;
            }            

            const maxSize = 5*1024*1024;

            if (coverLetterDoc.file.size > maxSize) {
                errors.coverLetter = errorMsg.coverLetter.size;
            }
        } else if(coverLetterDoc.fid || coverLetterDoc.fileName){
        }else{
            errors.coverLetter = errorMsg.coverLetter.blank;
        }

    };

    const validateApprovalFile = (errors, index) => {

        if (eKYCApprovalDoc[index].file) {

            const allowedExtensions = /(\.pdf|\.PDF)$/i;
            if (!allowedExtensions.exec(eKYCApprovalDoc[index].file.name)) {
                errors.eKYCApproval[index].error = errorMsg.eKYCApproval.format;
            }

            if (eKYCApprovalDoc[index].file?.type !== "application/pdf") {
                errors.eKYCApproval[index].error = errorMsg.eKYCApproval.format;
            }
            

            const maxSize = 5*1024*1024;

            if (eKYCApprovalDoc[index].file.size > maxSize) {
                errors.eKYCApproval[index].error = errorMsg.eKYCApproval.size;
            }
        } else if(eKYCApprovalDoc[index].fid || eKYCApprovalDoc[index].fileName){
        }
        else {
            errors.eKYCApproval[index].error = errorMsg.eKYCApproval.blank;
        }


    }


    const validateForm = () => {
        const errors = {};
        errors.eKYCApproval = [];

        eKYCApprovalDoc.forEach((item, index)=>{

            if (!errors.eKYCApproval[index]) {
                errors.eKYCApproval[index] = {};
            }
            validateApprovalFile(errors, index);
        })

        validateFile(errors);

        const approvalError = errors.eKYCApproval.filter(obj=>Object.keys(obj).length !== 0);

        if(Object.keys(approvalError).length === 0)
            delete errors.eKYCApproval;

        return errors;
    };


    const handleFormSubmit = (e) => {
        e.preventDefault();

        const errors = validateForm();

        if (Object.keys(errors).length === 0) {
            setFormErrors({});
            // Submit form
                setIsLoading(true);
              
                ESPApplicationService.SaveStepTwo(coverLetterDoc, eKYCApprovalDoc)
                .then((response)=>{
                    //SuccessMessage("Success", "Saved successfully.", handleNext);

                    showAlert({
                        messageTitle: 'Alert',
                        messageContent: 'Cover Letter and eKYC approval saved successfully.',
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


        } else {
            setFormErrors(errors);
        }
    };


    const eSignDocument = async () => {
        if ((coverLetterDoc.file === null || coverLetterDoc.file === undefined) && !coverLetterDoc.fid) {
            showAlert({
                messageTitle: 'Error',
                messageContent: "Please upload the cover letter.",
                enableHeaderCloseBtn: false,
                disableOutsideKeyDown: true,
                confirmText: 'Ok'
            });
        } else {
            
            if (!coverLetterDoc.file && !coverLetterDoc.signedId && coverLetterDoc.fid) {
                try {
                    setIsLoading(true);
                    const response = await ESPApplicationService.downloadStepTwoDocument(coverLetterDoc.fid, "CoverLetter");
                    const blob = new Blob([response.data], { type: response.headers['content-type'] });
                    setCoverLetterDoc((prev) => ({
                        ...prev,
                        file: blob
                    }));
    
                    CallComponent({

                        component: (
                            <Esign
                            efile={coverLetterDoc.file}
                            maxFileSize={5}
                            serviceName="/esign-application-service"
                            serviceUrl="/esign-cover-letter"
                            orgFileId={coverLetterDoc.fid}
                            documentPath="/CoverLetter"
                            redirectUrl="/licensee/viewlicense/espapplication"
                        />
                        ),
                    });
                    
                } catch (error) {
                    showAlert({
                        messageTitle: 'Error',
                        messageContent: "File not found.",
                        enableHeaderCloseBtn: false,
                        disableOutsideKeyDown: true,
                        confirmText: 'Ok',
                    });
                } finally {
                    setIsLoading(false);
                }
            } else {
                
                CallComponent({

                    component: (
                        <Esign
                            efile={coverLetterDoc.file}
                            maxFileSize={5}
                            serviceName="/esign-application-service"
                            serviceUrl="/esign-cover-letter"
                            orgFileId={coverLetterDoc.fid}
                            documentPath="/CoverLetter"
                            redirectUrl="/licensee/viewlicense/espapplication"
                        />
                    ),
                });
            }
        }
    };
    

    useEffect(()=>{

        getSelectedEKYCMode();
        getSecondStepData();
        getReviewData();
    },[])

    return (
        <>
            <LoaderProgress open={isLoading} />

            <Box component='form' noValidate sx={{ mt: 2, p: 2}} onSubmit={handleFormSubmit}>
            

            <Grid container spacing={2} direction="row" sx={{mt:1}}>

                <Grid item xs={12} sm>

                            <InputLabel shrink={false} htmlFor={"coverLetter"} sx={{mb:1}}>
                                <Typography variant='body1'><b>1. Upload Cover Letter</b> (Only PDF and Max allowed size is 5MB)</Typography>
                            </InputLabel>

                                    <Grid container direction="row" sx={{border: '1px solid #cfcfcf', borderRadius: '5px'}}>
                                        <Grid item xs>
                                            <Button
                                            component="label"
                                            variant="contained"
                                            startIcon={<CloudUploadIcon />}
                                            disabled={!reviewData?.coverLetter || false}
                                        >
                                            Upload file
                                            <VisuallyHiddenInput
                                                key={coverLetterDoc.fileKey}
                                                type="file"
                                                name="file"
                                                onChange={handleCoverFileChange}
                                            />
                                        </Button>
                                        
                                        </Grid>
                                        <Grid item xs sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        {coverLetterDoc.fileName && (
                                            <Tooltip title={coverLetterDoc.fileName} placement="top">
                                                <Typography variant='body2' sx={{
                                                    display: 'inline-block',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    verticalAlign: 'middle',
                                                    textAlign: 'center'
                                                }}>
                                                    {coverLetterDoc.fileName} {coverLetterDoc.file && (<>({Math.ceil(parseInt(coverLetterDoc.file.size)/1024)} KB) </>)}
                                                </Typography>
                                            </Tooltip>
                                        )}    
                                        </Grid>
                                    </Grid>
                                    
                                    {formErrors.coverLetter && (
                                        <FormHelperText error>{formErrors.coverLetter}</FormHelperText>
                                    )}
 
                    </Grid>

                    <Grid item xs={1} sx={{mt: {md: 4, sm: 4}}}>{coverLetterDoc.fid && !coverLetterDoc.signedId && (
                        <Tooltip title="eSign the Document">
                            <IconButton
                                aria-label="eSign"
                                color="info"
                                onClick={eSignDocument} 
                            ><EditNoteIcon />
                            </IconButton>
                        </Tooltip>)}
                    </Grid>
                    
                    <Grid item xs sx={{mt: {md: 5, sm: 5}}}>{coverLetterDoc.fid && (<Grid item>
                        {
                            coverLetterDoc.signedId ? (
                                <Link href="#" onClick={()=>downloadSignedDocument(coverLetterDoc.signedId, coverLetterDoc.fileName)}>Download</Link>
                            ): (
                                <Link href="#" onClick={()=>downloadDocument(coverLetterDoc.fid, "CoverLetter")}>Download</Link>
                            )
                        }
                                            
                                        </Grid>)}</Grid>
                </Grid>

                <Grid container spacing={2} direction="row" sx={{mt:1}}>

                    <Grid item xs={12} sm>
                    {selectedEKYCModes.length > 0 && (
                         <InputLabel shrink={false} htmlFor={"ekycApprovals"} sx={{mb:1}}>
                                <Typography variant='body1'><b>2. Upload eKYC Approval</b> (Only PDF and Max allowed size is 5MB)</Typography>
                        </InputLabel>
                    )}


                {
                    selectedEKYCModes.map((element, index)=>(
                        <Grid container key={index} spacing={2} direction="row" sx={{mt:1, ml: 0.1}}>

                            <Grid item xs={1} sx={{mt: 1}}>
                                2.{index + 1}
                            </Grid>

                            <Grid item xs sx={{mt: 1}}>
                                {element.ekycModeTitle}
                            </Grid>

                            <Grid item xs={6}>
                               

                            <Grid container direction="row" sx={{border: '1px solid #cfcfcf', borderRadius: '5px'}}>
                                        <Grid item xs>
                                            <Button
                                            component="label"
                                            variant="contained"
                                            startIcon={<CloudUploadIcon />}
                                            disabled={!reviewData?.ekycMode}
                                        >
                                            Upload file
                                            <VisuallyHiddenInput
                                                key={eKYCApprovalDoc[index].fileKey}
                                                type="file"
                                                name="file"
                                                onChange={(e)=>handleEKYCApprovalDoc(e, index)}
                                            />
                                        </Button>
                                        
                                        </Grid>
                                        <Grid item xs sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        {eKYCApprovalDoc[index].fileName && (
                                            <Tooltip title={eKYCApprovalDoc[index].fileName} placement="top">
                                                <Typography variant='body2' sx={{
                                                    display: 'inline-block',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    verticalAlign: 'middle',
                                                    textAlign: 'center'
                                                }}>
                                                    {eKYCApprovalDoc[index].fileName} {eKYCApprovalDoc[index].file && (<>({Math.ceil(parseInt(eKYCApprovalDoc[index].file.size)/1024)} KB) </>)}
                                                </Typography>
                                            </Tooltip>
                                        )}    
                                        </Grid>

                                        
                                        
                                    </Grid>
                                    
                                    {formErrors?.eKYCApproval && formErrors?.eKYCApproval[index]?.error && (
                                        <FormHelperText error>{formErrors?.eKYCApproval[index]?.error}</FormHelperText>
                                    )}


                            </Grid>    

                            {eKYCApprovalDoc[index].fid && (<Grid item xs={1} sx={{mt: 1}}>
                                            <Link href="#" onClick={()=>downloadDocument(eKYCApprovalDoc[index].fid, "eKYCApproval")}>Download</Link>
                                        </Grid>)}
                        </Grid>
                    ))
                }

               
            </Grid>
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

export default ESPApplicationStepTwo;