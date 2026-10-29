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

// Local/dev: skip CDAC and complete eSign against the local mock endpoint.
// Set to false for production CDAC flow.
const LOCAL_ESIGN_SKIP = true;

const alertMsg = `Aadhaar eSign is performed by a 3rd party digital signature provider, e-Hastakshar: C-DAC's On-line Digital Signing Service, in collaboration with UIDAI using the details associated with the Aadhaar number. Upon clicking "Proceed", you will be directed to the e-Hastakshar Aadhaar eSign website to complete the signing process. Do you want to continue?`;

const resolveFrontendRedirect = (locationHeader) => {
    if (!locationHeader) {
        return `${window.location.origin}/esignresponse`;
    }
    try {
        const absolute = new URL(locationHeader, window.location.origin);
        return `${window.location.origin}${absolute.pathname}${absolute.search}${absolute.hash}`;
    } catch (err) {
        if (locationHeader.startsWith("/")) {
            return `${window.location.origin}${locationHeader}`;
        }
        return locationHeader;
    }
};

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
            const allowedTypes = ["application/pdf", "application/octet-stream"];
            // Blob from axios may have empty type; still allow if size is present
            if (file.type && !allowedTypes.includes(file.type) && !String(file.type).includes("pdf")) {
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

    const finishLocalEsignSkip = async (aspTxnID) => {
        setLoading(true);
        try {
            const response = await EsignService.completeLocalEsignSkip(aspTxnID);
            const payload = response?.data || {};
            if (payload.id && payload.pid) {
                const qs = new URLSearchParams({
                    id: payload.id,
                    pid: payload.pid,
                });
                window.location.href = `${window.location.origin}/esignresponse?${qs.toString()}`;
                return;
            }
            window.location.href = resolveFrontendRedirect(payload.redirectUrl);
        } catch (err) {
            console.error("Local eSign skip failed:", err);
            showAlert({
                messageTitle: "Error",
                messageContent: "Local eSign skip failed. Please try Submit & eSign again.",
                confirmText: "Ok",
                disableOutsideKeyDown: true,
                closeParent: true,
            });
            setLoading(false);
        }
    };

    const handleSignDocument = () => {
        const aspTxnID = eSignRequest.aspTxnID || document.getElementById("aspTxnID")?.value;
        if (!aspTxnID) {
            console.log("An error occurred while digitally signing the document.");
            return;
        }
        if (LOCAL_ESIGN_SKIP) {
            finishLocalEsignSkip(aspTxnID);
            return;
        }
        document.getElementById("esignformid").submit();
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
                const nextRequest = {
                    eSignRequest: response.data.eSignRequest,
                    aspTxnID: response.data.aspTxnID,
                    contentType: response.data.contentType
                };
                setEsignRequest(nextRequest);

                if (LOCAL_ESIGN_SKIP) {
                    // Skip CDAC callback entirely for local/dev Submit & eSign.
                    return finishLocalEsignSkip(nextRequest.aspTxnID);
                }

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
                messageContent: formErrors.fileUpload || errors.fileUpload,
                confirmText: 'Ok',
                fullWidth: true,
                maxWidth: 'sm',
                disableOutsideKeyDown: true,
                closeParent: true,
            })
        }
    }

    const gatewayEsignResponseUrl =
        `${process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api"}/esign-service/esignresponse`;

    return (<>
        <LoaderProgress open={isLoading} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper elevation={1} sx={{ pl: 2, pr: 2, pb: 1, m: 2, borderRadius: "10px", minWidth: {xs: '90%', sm: '450px', display: 'none'} }}>
                {/* Production CDAC posts here only when LOCAL_ESIGN_SKIP is false */}
                <form action={LOCAL_ESIGN_SKIP ? gatewayEsignResponseUrl : "https://esignservice.cdac.in/esign2.1/2.1/form/signdoc"} method="post" id="esignformid">
                    <input hidden type="text" id="eSignRequest" name="eSignRequest" value={eSignRequest.eSignRequest}/>
                    <input hidden type="text" id="aspTxnID" name={LOCAL_ESIGN_SKIP ? "espTxnID" : "aspTxnID"} value={eSignRequest.aspTxnID}/>
                    <input hidden type="text" id="Content-Type" name="Content-Type" value="application/xml"/>
                </form>
            </Paper>
        </Box>
    </>)
}

export default Esign;