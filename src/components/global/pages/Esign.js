/*import { useEffect, useState } from "react";
import EsignService from '../../../service/EsignService/EsignService';
import { Box, Paper} from '@mui/material';
import showAlert from "../common/MessageBox/AlertService";
import LoaderProgress from "../common/LoaderProgress";

const alertMsg = `Aadhaar eSign is performed by a 3rd party digital signature provider, e-Hastakshar: C-DAC's On-line Digital Signing Service, in collaboration with UIDAI using the details associated with the Aadhaar number. Upon clicking "Proceed", you will be directed to the e-Hastakshar Aadhaar eSign website to complete the signing process. Do you want to continue?`;

const Esign = ({efile,
                maxFileSize,
                serviceName,
                fullName,
                serviceUrl,
                orgFileId,
                documentPath,
                redirectUrl
                }) =>{


    const [isLoading, setLoading] = useState(false);
    const [esignData, setEsignData] = useState({
        file: efile,
        maxSize: maxFileSize,
        serviceName: serviceName,
        fullName:fullName,
        serviceUrl: serviceUrl,
        orgFileId: orgFileId,
        documentPath: documentPath,
        redirectUrl: redirectUrl
    });
    const [eSignRequest, setEsignRequest] = useState({
        eSignRequest: '',
        aspTxnID: '',
        contentType: ''
    })

    const errorMsg = {
        fileUpload: {
            blank: "File not found.",
            filetype: "Please upload in PDF file.",
            filesize: "File size exceeds the limit of 5MB. Please select a smaller file.",
        }
    };


    const [formErrors, setFormErrors] = useState({});



    const validateFile = (errors) => {
        const file = esignData.file;
        if (file) {
            const allowedTypes = ["application/pdf"];
            if (!allowedTypes.includes(file.type)) {
                errors.fileUpload = errorMsg.fileUpload.filetype;
            }
            const maxSize = esignData.maxSize*1024 * 1024;
            if (file.size > maxSize) {
                errors.fileUpload = errorMsg.fileUpload.filesize;
            }
        } else {
            errors.fileUpload = errorMsg.fileUpload.blank;
        }
    };


    const validateForm = () => {
        const errors = {};
        validateFile(errors);
        return errors;
    };


    const handleSignDocument = () => {

        const eSignRequest = document.getElementById("eSignRequest");
        const aspTxnID = document.getElementById("aspTxnID");

        if(!eSignRequest.value || !aspTxnID.value){
            console.log("An error occurred while digitally signing the document.")
        }else{

            
            document.getElementById("esignformid").submit();
        }

    }


    useEffect(()=>{

        if(efile){
            createNewEsignRequest();
        }

    }, [efile])

    const createNewEsignRequest = () => {

        
        const errors = validateForm();

        

        if (Object.keys(errors).length === 0) {
            setFormErrors({});
            // Submit form

            setLoading(true);

            
            EsignService.newEsignRequest(esignData)
            .then((response) => {    
                    
                setEsignRequest({
                    eSignRequest: response.data.eSignRequest,
                    aspTxnID: response.data.aspTxnID,
                    contentType: response.data.contentType
                })

               
            
                showAlert({
                    messageTitle: 'Sign via Aadhaar eSign',
                    messageContent: <Box sx={{textAlign: 'justify'}}>{alertMsg}</Box>,
                    confirmText: 'Sign Document',
                    closeText: 'Cancel',
                    onConfirm: handleSignDocument,
                    fullWidth: true,
                    maxWidth: 'sm',
                    disableOutsideKeyDown: true,
                    closeParent: true,
                })
                
                setLoading(false);

            })
            .catch((err) => {
                
                showAlert({
                    messageTitle: 'Error',
                    messageContent: "Failed to digitally sign the document. Please try again after some time.",
                    confirmText: 'Ok',
                    disableOutsideKeyDown: true,
                    closeParent: true,
                })

                setLoading(false);

            });
            
        } else {
            setFormErrors(errors);

            showAlert({
                messageTitle: 'Error',
                messageContent: formErrors.fileUpload,
                confirmText: 'Ok',
                fullWidth: true,
                maxWidth: 'sm',
                disableOutsideKeyDown: true,
                closeParent: true,
            })

        }

    }


     return(<>
     
     <LoaderProgress open={isLoading} />

     <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        <Paper elevation={1} sx={{ pl: 2, pr: 2, pb: 1, m: 2, borderRadius: "10px", minWidth: {xs: '90%', sm: '450px', display: 'none'}  }}>

            <form action="https://esignservice.cdac.in/esign2.1/2.1/form/signdoc" method="post" id="esignformid">
            <input hidden type="text" id="eSignRequest" name="eSignRequest" value={eSignRequest.eSignRequest}/>
            <input hidden type="text" id="aspTxnID" name="aspTxnID" value={eSignRequest.aspTxnID}/>
            <input hidden type="text" id="Content-Type" name="Content-Type" value="application/xml"/>
            </form>
        </Paper>
     </Box>
     </>)


}

export default Esign; */


import { useEffect, useState } from "react";
import EsignService from '../../../service/EsignService/EsignService';
import { Box, Paper} from '@mui/material';
import showAlert from "../common/MessageBox/AlertService";
import LoaderProgress from "../common/LoaderProgress";

const alertMsg = `Aadhaar eSign is performed by a 3rd party digital signature provider, e-Hastakshar: C-DAC's On-line Digital Signing Service, in collaboration with UIDAI using the details associated with the Aadhaar number. Upon clicking "Proceed", you will be directed to the e-Hastakshar Aadhaar eSign website to complete the signing process. Do you want to continue?`;

const Esign = ({efile,
                maxFileSize,
                serviceName,
                fullName,
                serviceUrl,
                orgFileId,
                documentPath,
                redirectUrl
                }) => {

    const [isLoading, setLoading] = useState(false);
    const [esignData, setEsignData] = useState({
        file: efile,
        maxSize: maxFileSize,
        serviceName: serviceName,
        fullName: fullName,
        serviceUrl: serviceUrl,
        orgFileId: orgFileId,
        documentPath: documentPath,
        redirectUrl: redirectUrl
    });
    const [eSignRequest, setEsignRequest] = useState({
        eSignRequest: '',
        aspTxnID: '',
        contentType: ''
    })

    const errorMsg = {
        fileUpload: {
            blank: "File not found.",
            filetype: "Please upload in PDF file.",
            filesize: "File size exceeds the limit of 5MB. Please select a smaller file.",
        }
    };

    const [formErrors, setFormErrors] = useState({});

    const validateFile = (errors) => {
        const file = esignData.file;
        if (file) {
            const allowedTypes = ["application/pdf"];
            if (!allowedTypes.includes(file.type)) {
                errors.fileUpload = errorMsg.fileUpload.filetype;
            }
            const maxSize = esignData.maxSize * 1024 * 1024;
            if (file.size > maxSize) {
                errors.fileUpload = errorMsg.fileUpload.filesize;
            }
        } else {
            errors.fileUpload = errorMsg.fileUpload.blank;
        }
    };

    const validateForm = () => {
        const errors = {};
        validateFile(errors);
        return errors;
    };

    const handleSignDocument = () => {
        const eSignRequestInput = document.getElementById("eSignRequest");
        const aspTxnIDInput = document.getElementById("aspTxnID");

        if(!eSignRequestInput.value || !aspTxnIDInput.value){
            console.log("An error occurred while digitally signing the document.");
        } else {
            // Submits directly to your backend mock endpoint instead of CDAC
            document.getElementById("esignformid").submit();
        }
    }

    useEffect(()=>{
        if(efile){
            createNewEsignRequest();
        }
    }, [efile])

    const createNewEsignRequest = () => {
        const errors = validateForm();

        if (Object.keys(errors).length === 0) {
            setFormErrors({});
            setLoading(true);

            EsignService.newEsignRequest(esignData)
            .then((response) => {    
                setEsignRequest({
                    eSignRequest: response.data.eSignRequest,
                    aspTxnID: response.data.aspTxnID,
                    contentType: response.data.contentType
                })

                showAlert({
                    messageTitle: 'Sign via Aadhaar eSign (Mock Bypass)',
                    messageContent: <Box sx={{textAlign: 'justify'}}>Clicking sign will complete the eSign locally using test credentials without opening CDAC.</Box>,
                    confirmText: 'Sign Document',
                    closeText: 'Cancel',
                    onConfirm: handleSignDocument,
                    fullWidth: true,
                    maxWidth: 'sm',
                    disableOutsideKeyDown: true,
                    closeParent: true,
                })
                
                setLoading(false);
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: "Failed to digitally sign the document. Please try again after some time.",
                    confirmText: 'Ok',
                    disableOutsideKeyDown: true,
                    closeParent: true,
                })
                setLoading(false);
            });
            
        } else {
            setFormErrors(errors);
            showAlert({
                messageTitle: 'Error',
                messageContent: formErrors.fileUpload,
                confirmText: 'Ok',
                fullWidth: true,
                maxWidth: 'sm',
                disableOutsideKeyDown: true,
                closeParent: true,
            })
        }
    }

    return (<>
        <LoaderProgress open={isLoading} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper elevation={1} sx={{ pl: 2, pr: 2, pb: 1, m: 2, borderRadius: "10px", minWidth: {xs: '90%', sm: '450px', display: 'none'} }}>
                {/* POINT ACTION TO YOUR LOCAL BACKEND RESPONSE ENDPOINT INSTEAD OF CDAC */}
                <form action="http://localhost:3000/api/esign-service/esignresponse" method="post" id="esignformid">
                    <input hidden type="text" id="eSignRequest" name="eSignRequest" value={eSignRequest.eSignRequest}/>
                    {/* Send aspTxnID mapped as espTxnID or handled by backend fallback */}
                    <input hidden type="text" id="aspTxnID" name="espTxnID" value={eSignRequest.aspTxnID}/>
                    <input hidden type="text" id="Content-Type" name="Content-Type" value="application/xml"/>
                </form>
            </Paper>
        </Box>
    </>)
}

export default Esign;