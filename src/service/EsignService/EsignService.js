import API from '../../api/ApplicationAPI';
import { encrypt } from '../../components/global/util/EncryptDecrypt';
import  store  from '../../store';

const ESIGN_SERVICE_BASE_URL = "/esign-service";
const ESIGN_NEW_REQUEST = "/esign";
const GET_DIGITALLY_SIGNED_DOCUMENT = "/get-digitally-signed-document";


const CDAC_ESIGN_LEVEL_1 = "https://es-staging.cdac.in/esignlevel1/2.1/form/signdoc";
const CDAC_ESIGN_LEVEL_2 = "https://es-staging.cdac.in/esignlevel2/2.1/form/signdoc";

const config = {
    headers:{
        'content-type': 'multipart/form-data',
    }
}

const sconfig={
    headers: {
        'Content-Type': 'application/octet-stream',
    },
}

const auth = () => {
    const state = store.getState();
    return state.jwtAuthentication;
  }


const newEsignRequest = (esignData) =>{

    const username = auth().username;


    const formData = new FormData();
    formData.append('files', esignData.file)
    formData.append('userName', encrypt(username))
    if(esignData.fullName != null)
      formData.append('fullNames', encrypt(esignData.fullName))
    formData.append('serviceName', encrypt(esignData.serviceName))
    formData.append('serviceUrl', encrypt(esignData.serviceUrl))
    formData.append('orgFileId', encrypt(esignData.orgFileId))
    formData.append('documentPath', encrypt(esignData.documentPath))
    formData.append('redirectUrl', encrypt(esignData.redirectUrl))
    

    return API.post(ESIGN_SERVICE_BASE_URL+ESIGN_NEW_REQUEST,formData, config);
};

const downloadEsignedDocument = (id) =>{

    return API.get(ESIGN_SERVICE_BASE_URL+GET_DIGITALLY_SIGNED_DOCUMENT,{
        params:{
            id: id,
        },
        responseType: 'blob', 
        ...sconfig
    })
}


const downloadDigitallySignedDocument  = async (id, filename) => {

        try {
            const response = await downloadEsignedDocument(id);
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            const contentDisposition = response.headers['content-disposition'];

            console.log(response)

            // const fileName = contentDisposition 
            // ? contentDisposition.split('filename=')[1].replace(/"/g, '')
            // : "SignedDocument.pdf";

            const fileName = filename;

            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            
        } catch (error) {
            console.error('Error downloading file:', error);
            
        }

    }
    const viewDigitallySignedDocument = async (id) => {
        try {
          const response = await downloadEsignedDocument(id);
          console.log("downloadEsignedDocument Response:", {
            headers: response.headers,
            dataType: typeof response.data,
          });
      
          // Validate content-type
          const contentType = response.headers["content-type"];
          if (!contentType.includes("application/pdf")) {
            throw new Error(`Invalid content-type: ${contentType}`);
          }
      
          // Create Blob
          const blob = new Blob([response.data], { type: contentType });
          console.log("Blob:", blob, "Type:", blob.type, "Size:", blob.size);
      
          if (blob.size === 0) {
            throw new Error("Empty PDF Blob received");
          }
      
          return blob;
        } catch (error) {
          console.error("Error downloading file:", error);
          throw error; // Propagate error to caller
        }
      };


export default {
    newEsignRequest,
    downloadEsignedDocument,
    downloadDigitallySignedDocument,
    viewDigitallySignedDocument
};