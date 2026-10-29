import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;
import  store  from '../../store';


const LICENSE_ISSUANCE_SERVICE_BASE_URL = "/license-issuance-service";
const GRANT_IN_PRINCIPLE_APPROVAL = "/grant-in-principle-approval";

const UPLOAD_BANK_GUARANTEE_PROOF = "/upload-bank-guarantee-proof";
const ISSUE_LICENSE_TO_APPLICANT = "/issue-license-to-applicant";
const LICENSE_FORM_DEFAULTS = "/license-form-defaults";
const SUBMIT_LICENSE_DETAILS_FOR_REVIEW = "/submit-license-details-for-review";
const APPROVE_LICENSE_REVIEW = "/approve-license-review";
const SEND_LICENSE_REVIEW_TO_ADMIN = "/send-license-review-to-admin";
const GET_LICENSE_DETAILS_BY_USERNAME = "/license-details-by-username";
const VIEW_LICENSE_DOCUMENT = "/view-license-document"

const GET_LICENSE_DETAILS = "/get-all-licensee-details";
const GET_RENEWAL_START_DATE_BY_USERNAME = "/get-renewal-start-date-by-username";

const auth = () => {
  const state = store.getState();
  return state.jwtAuthentication;
}

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

const grantInLicneseApproval = (intentAppId, applicantUsername)=>{

  const username = auth().username;

  return API.get(LICENSE_ISSUANCE_SERVICE_BASE_URL+GRANT_IN_PRINCIPLE_APPROVAL, {
      params:{
        id: encrypt(intentAppId),
        qid: encrypt(username),
        pid: encrypt(applicantUsername)
      }
  })
  
  }


const uploadBankGuaranteeProof = (obj)=>{

    const username = auth().username;

    const form = new FormData();
    form.append('intentAppId', encrypt(obj.intentAppId));
    form.append('uploadedBy', encrypt(username));
    form.append('file', obj.file);
    form.append('issueDate', obj.issueDate);
    form.append('expiryDate', obj.expiryDate);
    form.append('transactionNumber', obj.transactionNumber);


    return API.post(LICENSE_ISSUANCE_SERVICE_BASE_URL + UPLOAD_BANK_GUARANTEE_PROOF, form, config); 
 
  
  }


  const getLicenseFormDefaults = (intentAppId, applicantUsername) => {
    return API.get(LICENSE_ISSUANCE_SERVICE_BASE_URL + LICENSE_FORM_DEFAULTS, {
      params: {
        id: encrypt(intentAppId),
        pid: encrypt(applicantUsername),
      },
    });
  };

  const submitLicenseDetailsForReview = (obj) => {
    const username = auth().username;
    return API.post(LICENSE_ISSUANCE_SERVICE_BASE_URL + SUBMIT_LICENSE_DETAILS_FOR_REVIEW, {
      intentAppId: encrypt(obj.intentAppId),
      applicantUsername: encrypt(obj.applicantUsername),
      submittedBy: encrypt(username),
      serialNo: obj.serialNo,
      issueDate: obj.issueDate,
      expiryDate: obj.expiryDate,
      publicKey: obj.publicKey,
    });
  };

  const approveLicenseReview = (obj) => {
    const username = auth().username;
    return API.post(LICENSE_ISSUANCE_SERVICE_BASE_URL + APPROVE_LICENSE_REVIEW, {
      reviewId: obj.reviewId,
      remark: obj.remark || '',
      reviewedBy: encrypt(username),
    });
  };

  const sendLicenseReviewToAdmin = (obj) => {
    const username = auth().username;
    return API.post(LICENSE_ISSUANCE_SERVICE_BASE_URL + SEND_LICENSE_REVIEW_TO_ADMIN, {
      reviewId: obj.reviewId,
      remark: obj.remark || '',
      reviewedBy: encrypt(username),
    });
  };

  const issueLicenseToApplicant = (obj)=>{

    const username = auth().username;

    const form = new FormData();
    form.append('intentAppId', encrypt(obj.intentAppId));
    form.append('issuedBy', encrypt(username));
    form.append('file', obj.file);
    form.append('issueDate', obj.issueDate);
    form.append('expiryDate', obj.expiryDate);
    form.append('serialNo', obj.serialNo);
    form.append('applicantUsername', encrypt(obj.applicantUsername));


    return API.post(LICENSE_ISSUANCE_SERVICE_BASE_URL + ISSUE_LICENSE_TO_APPLICANT, form, {
        ...config,
        timeout: 120000,
    }); 
 
  
  }

  const getLicenseDetails = () => {

    const username = auth().username;

    return API.get(LICENSE_ISSUANCE_SERVICE_BASE_URL+GET_LICENSE_DETAILS_BY_USERNAME, {
      params:{
        id: encrypt(username),
      }
  })

  }

  const viewLicenseDocument = (id) => {

    return API.get(LICENSE_ISSUANCE_SERVICE_BASE_URL+VIEW_LICENSE_DOCUMENT, {
      params:{
        id: encrypt(id),
      },
      responseType: 'blob',
      ...sconfig
  })

  }
  const getAllLicenseDetails = () => {

    

    return API.get(LICENSE_ISSUANCE_SERVICE_BASE_URL+GET_LICENSE_DETAILS)

  }


  const getLicenseDetailsByUserName = (username) => {

   

    return API.get(LICENSE_ISSUANCE_SERVICE_BASE_URL+GET_LICENSE_DETAILS_BY_USERNAME, {
      params:{
        id: encrypt(username),
      }
  })

  }
  const getRenewalStartDateByUsername = (username) => {

   

    return API.get(LICENSE_ISSUANCE_SERVICE_BASE_URL+GET_RENEWAL_START_DATE_BY_USERNAME, {
      params:{
        id: encrypt(username),
      }
  })

  }
  
  
export default {grantInLicneseApproval,
                uploadBankGuaranteeProof,
                getLicenseFormDefaults,
                submitLicenseDetailsForReview,
                approveLicenseReview,
                sendLicenseReviewToAdmin,
                issueLicenseToApplicant,
                getLicenseDetails,
                viewLicenseDocument,
                getAllLicenseDetails,
                getLicenseDetailsByUserName,
                getRenewalStartDateByUsername,
};