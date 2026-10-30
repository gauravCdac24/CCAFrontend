// import API from '../../api/ApplicationAPI';
// import {encrypt} from "../../components/global/util/EncryptDecrypt" ;
// import  store  from '../../store';

// const NEW_LICENSE_APPLICATION_BASE_URL = "/newlicense-service";
// const UPLOAD_REQUIRED_DOCUMENTS_FOR_LICENSE_ISSUANCE = "/required-documents-for-license-issuance";

// const state = store.getState();
// const username = state.jwtAuthentication.username;

// const config = {
//     headers:{
//         'content-type': 'multipart/form-data',
//     }
// }


// const uploadRequiredDocuments = (obj)=>{

//     const form = new FormData();
//     form.append('intentAppId', encrypt(obj.intentAppId));
//     form.append('createdBy', encrypt(username));
//     form.append('bankGuarantee', obj.bankGuarantee);
//     if(obj.csr !== null)
//         form.append('csr', obj.csr);
//     form.append('agreement', obj.agreement);


//     return API.post(NEW_LICENSE_APPLICATION_BASE_URL + UPLOAD_REQUIRED_DOCUMENTS_FOR_LICENSE_ISSUANCE, form, config); 
 
  
//   }

  
  
// export default {uploadRequiredDocuments};



//updated
import API from '../../api/ApplicationAPI';
import { encrypt } from "../../components/global/util/EncryptDecrypt";
import store from '../../store';

const NEW_LICENSE_APPLICATION_BASE_URL = "/newlicense-service";
const UPLOAD_REQUIRED_DOCUMENTS_FOR_LICENSE_ISSUANCE = "/required-documents-for-license-issuance";

const state = store.getState();
const username = state.jwtAuthentication.username;

const config = {
    headers: {
        'content-type': 'multipart/form-data',
    }
}

const uploadRequiredDocuments = (obj) => {
    const form = new FormData();
    form.append('intentAppId', encrypt(obj.intentAppId));
    form.append('createdBy', encrypt(username));
    form.append('bankGuarantee', obj.bankGuarantee);
    if(obj.csr !== null)
        form.append('csr', obj.csr);
    form.append('agreement', obj.agreement);

    return API.post(NEW_LICENSE_APPLICATION_BASE_URL + UPLOAD_REQUIRED_DOCUMENTS_FOR_LICENSE_ISSUANCE, form, config);
}

// Added method to handle downloading document templates
const downloadTemplate = (templateName) => {
    return API.get(`${NEW_LICENSE_APPLICATION_BASE_URL}/download-template/${templateName}`, {
        responseType: 'blob', // Important for handling binary/pdf files
    });
}

export default { uploadRequiredDocuments, downloadTemplate };