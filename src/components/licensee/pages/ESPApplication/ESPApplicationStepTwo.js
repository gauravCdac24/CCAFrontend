import { Box, Button, FormHelperText, Grid, IconButton, InputLabel, Link, styled, TextField, Tooltip, Typography } from "@mui/material";
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
        format: "Only Pdf file is allowed.",
        length: "Entered details must not exceed 255 characters."
    },

}

const ekycModeKind = (title = '') => {
    const normalized = title.toLowerCase();
    if (normalized.includes('offline')) return 'aadhaarOffline';
    if (normalized.includes('online')) return 'aadhaarOnline';
    if (normalized.includes('organis') || normalized.includes('organiz')) return 'organisational';
    if (normalized.includes('bank')) return 'banking';
    if (normalized.includes('pan')) return 'pan';
    return 'default';
};

const blankDetail = (value) => !value || !value.trim();


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


    const approvalDocFromMode = (mode, index, saved) => {
        const source = saved || mode;
        return {
            id: decrypt(mode.ekycMode),
            file: null,
            fileName: (source.fileName || '').trim(),
            fileKey: Date.now() + index + 1,
            fid: (source.fileName || '').trim() ? (source.ekycModeId || mode.ekycModeId || '') : '',
            serviceProviderName: source.serviceProviderName || '',
            integrationDetails: source.integrationDetails || '',
            integrationDate: source.integrationDate || '',
            entityName: source.entityName || '',
        };
    };

    const loadStepTwo = () => {
        setIsLoading(true);

        Promise.all([
            ESPApplicationService.getSelectedEKYCMode(),
            ESPApplicationService.getSecondStepData().catch(() => ({ data: {} })),
        ])
        .then(([selectedResponse, savedResponse]) => {
            const savedModes = savedResponse.data?.eKYCMode || [];
            const savedById = {};
            savedModes.forEach((element) => {
                savedById[decrypt(element.ekycMode)] = element;
            });

            const docs = [];
            const modes = (selectedResponse.data || []).map((item, index) => {
                const modeId = decrypt(item.ekycMode);
                docs.push(approvalDocFromMode(item, index, savedById[modeId]));
                return { ...item, ekycMode: modeId };
            });

            setEKYCApprovalDoc(docs);
            setSelectedEKYCModes(modes);

            const cover = savedResponse.data?.esignDocument;
            if (cover?.fileName || cover?.eSignDocId) {
                setCoverLetterDoc({
                    fid: cover.eSignDocId,
                    file: null,
                    fileName: (cover.fileName || '').trim(),
                    fileKey: Date.now(),
                    signedId: cover.esignDocument || ''
                });
            }
        })
        .catch(() => {})
        .finally(() => {
            setIsLoading(false);
        });
    };

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

    const handleDetailChange = (index, field, value) => {
        setEKYCApprovalDoc((prevDocs) => {
            const updatedDocs = [...prevDocs];
            updatedDocs[index] = {
                ...updatedDocs[index],
                [field]: value,
            };
            return updatedDocs;
        });
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

    const validateModeDetails = (errors, index, kind) => {
        const doc = eKYCApprovalDoc[index];
        if (!doc) {
            return;
        }

        if (kind === 'aadhaarOnline' && blankDetail(doc.serviceProviderName)) {
            errors.eKYCApproval[index].serviceProviderName = "Please enter Aadhaar Authorised Verification Service Provider Name.";
        }
        if (kind === 'pan' && blankDetail(doc.serviceProviderName)) {
            errors.eKYCApproval[index].serviceProviderName = "Please enter PAN Authorised Verification Service Provider Name.";
        }
        if (kind === 'banking') {
            if (blankDetail(doc.integrationDetails)) {
                errors.eKYCApproval[index].integrationDetails = "Please enter Bank eKYC Integration.";
            }
            if (blankDetail(doc.integrationDate)) {
                errors.eKYCApproval[index].integrationDate = "Please select the date.";
            }
            if (blankDetail(doc.entityName)) {
                errors.eKYCApproval[index].entityName = "Please enter Bank Name.";
            }
        }
        if (kind === 'organisational') {
            if (blankDetail(doc.integrationDetails)) {
                errors.eKYCApproval[index].integrationDetails = "Please enter Organisational eKYC Integration.";
            }
            if (blankDetail(doc.integrationDate)) {
                errors.eKYCApproval[index].integrationDate = "Please select the date.";
            }
            if (blankDetail(doc.entityName)) {
                errors.eKYCApproval[index].entityName = "Please enter Organisation Name.";
            }
        }
        if ([doc.serviceProviderName, doc.integrationDetails, doc.entityName].some((value) => value && value.trim().length > 255)) {
            errors.eKYCApproval[index].length = errorMsg.eKYCApproval.length;
        }
    };

    const validateApprovalFile = (errors, index, kind) => {

        if (kind === 'aadhaarOffline') {
            return;
        }

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
            const kind = ekycModeKind(selectedEKYCModes[index]?.ekycModeTitle);
            validateApprovalFile(errors, index, kind);
            validateModeDetails(errors, index, kind);
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

        loadStepTwo();
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
                                <Typography variant='body1'><b>2. eKYC Approval Details</b> (Document upload: only PDF, max 5MB)</Typography>
                        </InputLabel>
                    )}


                {
                    selectedEKYCModes.map((element, index)=>{
                        const kind = ekycModeKind(element.ekycModeTitle);
                        const doc = eKYCApprovalDoc[index];
                        if (!doc) {
                            return null;
                        }
                        const fieldError = formErrors?.eKYCApproval?.[index] || {};
                        const fieldsDisabled = !reviewData?.ekycMode;

                        const textField = (field, label) => (
                            <Box sx={{ mt: 1.5 }} key={field}>
                                <InputLabel shrink={false} htmlFor={`${field}-${index}`}>
                                    <Typography variant='body2'><b>{label}*</b></Typography>
                                </InputLabel>
                                <TextField
                                    id={`${field}-${index}`}
                                    size="small"
                                    fullWidth
                                    value={doc[field] || ''}
                                    onChange={(e) => handleDetailChange(index, field, e.target.value)}
                                    disabled={fieldsDisabled}
                                    inputProps={{ maxLength: 255 }}
                                    error={Boolean(fieldError[field])}
                                    helperText={fieldError[field] || ''}
                                />
                            </Box>
                        );

                        return (
                        <Box key={index} sx={{ mt: 2, p: 1.5, border: '1px solid #e0e0e0', borderRadius: '6px' }}>
                            <Typography variant='body1'><b>2.{index + 1} {element.ekycModeTitle}</b></Typography>

                            {kind === 'aadhaarOnline' && textField('serviceProviderName', 'Aadhaar Authorised Verification Service Provider Name')}
                            {kind === 'pan' && textField('serviceProviderName', 'PAN Authorised Verification Service Provider Name')}

                            {kind === 'banking' && (
                                <>
                                    {textField('integrationDetails', 'Bank eKYC Integration')}
                                    <Box sx={{ mt: 1.5, maxWidth: 280 }}>
                                        <InputLabel shrink={false} htmlFor={`integrationDate-${index}`}>
                                            <Typography variant='body2'><b>Date*</b></Typography>
                                        </InputLabel>
                                        <TextField
                                            id={`integrationDate-${index}`}
                                            type="date"
                                            size="small"
                                            fullWidth
                                            value={doc.integrationDate || ''}
                                            onChange={(e) => handleDetailChange(index, 'integrationDate', e.target.value)}
                                            disabled={fieldsDisabled}
                                            InputLabelProps={{ shrink: true }}
                                            error={Boolean(fieldError.integrationDate)}
                                            helperText={fieldError.integrationDate || ''}
                                        />
                                    </Box>
                                </>
                            )}

                            {kind === 'organisational' && (
                                <>
                                    {textField('integrationDetails', 'Organisational eKYC Integration')}
                                    <Box sx={{ mt: 1.5, maxWidth: 280 }}>
                                        <InputLabel shrink={false} htmlFor={`integrationDate-${index}`}>
                                            <Typography variant='body2'><b>Date*</b></Typography>
                                        </InputLabel>
                                        <TextField
                                            id={`integrationDate-${index}`}
                                            type="date"
                                            size="small"
                                            fullWidth
                                            value={doc.integrationDate || ''}
                                            onChange={(e) => handleDetailChange(index, 'integrationDate', e.target.value)}
                                            disabled={fieldsDisabled}
                                            InputLabelProps={{ shrink: true }}
                                            error={Boolean(fieldError.integrationDate)}
                                            helperText={fieldError.integrationDate || ''}
                                        />
                                    </Box>
                                </>
                            )}

                            {kind === 'aadhaarOffline' && (
                                <Typography variant='body2' sx={{ mt: 1 }}>Document upload is not required.</Typography>
                            )}

                            {kind !== 'aadhaarOffline' && (
                            <Grid container spacing={1} direction="row" sx={{ mt: 1.5 }} alignItems="center">
                            <Grid item xs={12} sm={8}>
                            <Grid container direction="row" sx={{border: '1px solid #cfcfcf', borderRadius: '5px'}}>
                                        <Grid item xs>
                                            <Button
                                            component="label"
                                            variant="contained"
                                            startIcon={<CloudUploadIcon />}
                                            disabled={fieldsDisabled}
                                        >
                                            Upload file
                                            <VisuallyHiddenInput
                                                key={doc.fileKey}
                                                type="file"
                                                name="file"
                                                onChange={(e)=>handleEKYCApprovalDoc(e, index)}
                                            />
                                        </Button>
                                        
                                        </Grid>
                                        <Grid item xs sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        {doc.fileName && (
                                            <Tooltip title={doc.fileName} placement="top">
                                                <Typography variant='body2' sx={{
                                                    display: 'inline-block',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    verticalAlign: 'middle',
                                                    textAlign: 'center'
                                                }}>
                                                    {doc.fileName} {doc.file && (<>({Math.ceil(parseInt(doc.file.size)/1024)} KB) </>)}
                                                </Typography>
                                            </Tooltip>
                                        )}    
                                        </Grid>
                                    </Grid>
                                    {fieldError.error && (
                                        <FormHelperText error>{fieldError.error}</FormHelperText>
                                    )}
                            </Grid>
                            </Grid>
                            )}

                            {kind === 'banking' && textField('entityName', 'Bank Name')}
                            {kind === 'organisational' && textField('entityName', 'Organisation Name')}

                            {fieldError.length && (
                                <FormHelperText error>{fieldError.length}</FormHelperText>
                            )}
                        </Box>
                        );
                    })
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