import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;
import  store  from '../../store';

const ESIGN_APPLICATION_SERVICE_BASE_URL = "/esign-application-service";
const DOWNLOAD_COVER_LETTER = "/download-cover-letter";
const SAVE_STEP_ONE = "/esp-save-step-one";
const GET_FIRST_STEP_DATA = "/get-first-step-data";
const GET_SELECTED_EKYC_MODES = "/get-selected-ekyc-modes";
const SAVE_STEP_TWO = "/esp-save-step-two";
const GET_SECOND_STEP_DATA = "/get-second-step-data";
const DOWNLOAD_STEP_TWO_DOCUMENT = "/download-step-two-document";
const SAVE_STEP_THREE = "/esp-save-step-three";
const GET_THIRD_STEP_DATA = "/get-third-step-data";
const DOWNLOAD_STEP_THREE_DOCUMENT = "/download-step-three-document";
const GET_PREVIEW = "/esp-preview";
const GET_APPLICATION_DETAILS = "/get-application-details";
const SUBMIT_APPLICATION = "/submit-application";
const GET_ESP_APPLICATION_FOR_REVIEW = "/get-esp-application-for-review";
const VIEW_ESP_APPLICATION = "/view-esp-application";
const SUBMIT_APPLICATION_FOR_REVIEW = "/submit-application-for-review";
const UNDER_REVIEW_DATA = "/under-review-data";
const PREVIOUS_REVIEW_DATA = "/previous-review-data";
const GET_ESP_APPLICATION_RECOMMANDED_FOR_REJECTION = "/get-espapp-recommanded-for-rejection";	
const SUBMIT_APPLICATION_FOR_REJECTION_OR_APPROVE = "/submit-application-approve-reject";
const UNDER_REVIEW_DATA_BY_USERNAME = "/under-review-data-by-username";
const RECOMMEND_FOR_ESIGN_GO_LIVE = "/recommend-for-esign-go-live";
const APPROVE_ESIGN_GO_LIVE = "/approve-esign-go-live";
const GET_ESP_APPLICATION_RECOMMANDED_FOR_ESIGN_GO_LIVE = "/get-esp-application-recommanded-for-esign-go-live";
const GET_ESP_APPLICATION_APPROVED_FOR_ESIGN_GO_LIVE = "/get-esp-application-approved-for-esign-go-live";
const GET_ESP_APPLICATION_REJECTED = "/get-esp-application-rejected";
const GET_ESP_APPLICATION_EXPIRED = "/get-esp-application-expired";
const GET_PREVIOUS_APPLICATION_DETAILS = "/get-previous-application-details";
const GET_PREVIEW_BY_ESP_APPLICATION_ID = "/get-preview-by-esp-app-id"
const CHECK_FOR_ESP = "/check-for-esp";
const GET_ALL_ESP_WITH_EKYC_MODE_APPROVED = "/get-all-esp-with-ekyc-mode-approved";
const DOWNLOAD_APPLICATION_FORM = "/download-application-form";

const sconfig={
    headers: {
        'Content-Type': 'application/octet-stream',
    },
}

const config = {
    headers:{
        'content-type': 'multipart/form-data',
    }
}

const auth = () => {
    const state = store.getState();
    return state.jwtAuthentication;
  }

const downloadCoverLetter = (id) =>{

    const username = auth().username;

    return API.get(ESIGN_APPLICATION_SERVICE_BASE_URL+DOWNLOAD_COVER_LETTER,{
        params:{
            id: encrypt(id.ekycModeTitles),
            pid: encrypt(id.purpose),
            qid:encrypt(username)
        },
        responseType: 'blob', 
        ...sconfig
    })
}

const saveStepOne = (purpose, id, lid) => {

    const username = auth().username;

    return API.get(ESIGN_APPLICATION_SERVICE_BASE_URL + SAVE_STEP_ONE,{
        params:{
            id: encrypt(id),
            qid: encrypt(username),
            pid: encrypt(lid),
            rid: encrypt(purpose),
        },
    })

}

const getFirstStepData = () => {

    const username = auth().username;

    return API.get(ESIGN_APPLICATION_SERVICE_BASE_URL + GET_FIRST_STEP_DATA,{
        params:{
            id: encrypt(username),
        },
    })

}

const getSelectedEKYCMode = () => {

    const username = auth().username;

    return API.get(ESIGN_APPLICATION_SERVICE_BASE_URL + GET_SELECTED_EKYC_MODES,{
        params:{
            id: encrypt(username),
        },
    })

}

const SaveStepTwo = (coverLetterObj, approvalObj)=>{

    const username = auth().username;

    const formData = new FormData();
    if (coverLetterObj?.file) {
        formData.append("coverLetterDoc.file", coverLetterObj.file);
    }
    formData.append("coverLetterDoc.fileName", coverLetterObj.fileName)
    formData.append("userName", encrypt(username))
    if(approvalObj?.length>0){
        approvalObj.forEach((element, index) => {
            formData.append(`eKYCApprovalDoc[${index}].id`, encrypt(element.id))
            if(element?.file){
                formData.append(`eKYCApprovalDoc[${index}].file`, element.file)
            }
            formData.append(`eKYCApprovalDoc[${index}].fileName`, element.fileName)
        });
    }

	return API.post(ESIGN_APPLICATION_SERVICE_BASE_URL+SAVE_STEP_TWO,formData,config);

}

const getSecondStepData = () => {

    const username = auth().username;

    return API.get(ESIGN_APPLICATION_SERVICE_BASE_URL + GET_SECOND_STEP_DATA,{
        params:{
            id: encrypt(username),
        },
    })

}

const downloadStepTwoDocument = (id, type) =>{

    return API.get(ESIGN_APPLICATION_SERVICE_BASE_URL + DOWNLOAD_STEP_TWO_DOCUMENT, {
		params:{
			id:encrypt(id),
            pid: encrypt(type)
		},  responseType: 'blob', 
        ...sconfig
	});

}

const saveStepThree = (formValues) => {

    const username = auth().username;

    const formData = new FormData();
    if (formValues?.auditReportFile?.file) {
        formData.append("auditReportFile", formValues.auditReportFile.file);
    }else{
        formData.append("auditReportFileName", formValues.auditReportFile.fileName);
    }

    if (formValues?.cpsFile?.file) {
        formData.append("cpsFile", formValues.cpsFile.file);
    }else{
        formData.append("cpsFileName", formValues.cpsFile.fileName);
    }

    formData.append("esignApiSpecId", encrypt(formValues.esignApiSpecId));
    formData.append("apiVersionId", encrypt(formValues.apiVersionId));
    formData.append("userName", encrypt(username))
    
	return API.post(ESIGN_APPLICATION_SERVICE_BASE_URL+SAVE_STEP_THREE,formData,config);

}

const getThirdStepData = () => {

    const username = auth().username;

    return API.get(ESIGN_APPLICATION_SERVICE_BASE_URL + GET_THIRD_STEP_DATA,{
        params:{
            id: encrypt(username),
        },
    })

}

const downloadStepThreeDocument = (id) =>{

    return API.get(ESIGN_APPLICATION_SERVICE_BASE_URL + DOWNLOAD_STEP_THREE_DOCUMENT, {
		params:{
			id:encrypt(id),
		},  responseType: 'blob', 
        ...sconfig
	});

}

const getPreview = () => {

    const username = auth().username;

    return API.get(ESIGN_APPLICATION_SERVICE_BASE_URL + GET_PREVIEW,{
        params:{
            id: encrypt(username),
        },
    })

}


const getPreviewById = (id) => {

    return API.get(ESIGN_APPLICATION_SERVICE_BASE_URL + GET_PREVIEW_BY_ESP_APPLICATION_ID,{
        params:{
            id: encrypt(id),
        },
    })

}


const getApplicationDetails = () => {

    const username = auth().username;

    return API.get(ESIGN_APPLICATION_SERVICE_BASE_URL + GET_APPLICATION_DETAILS,{
        params:{
            id: encrypt(username),
        },
    })
}

const submitApplication = () => {

    const username = auth().username;

    return API.get(ESIGN_APPLICATION_SERVICE_BASE_URL + SUBMIT_APPLICATION,{
        params:{
            id: encrypt(username),
        },
    })
}

const getAllApplicationUnderReview = () => {

    return API.get(ESIGN_APPLICATION_SERVICE_BASE_URL + GET_ESP_APPLICATION_FOR_REVIEW)
}

const viewESPApplication = (id) => {
    return API.get(ESIGN_APPLICATION_SERVICE_BASE_URL + VIEW_ESP_APPLICATION,{
        params:{
            id: encrypt(id),
        },
    })
}

const submitReviewESPApplication = (obj) => {

    const username = auth().username;
    const obj1 = {...obj};
    obj1.userName = encrypt(username);
    obj1.esignLicenseeAppId = encrypt(obj1.esignLicenseeAppId);

    return API.post(ESIGN_APPLICATION_SERVICE_BASE_URL + SUBMIT_APPLICATION_FOR_REVIEW, obj1);
}

const underReviewData = (id) => {
    return API.get(ESIGN_APPLICATION_SERVICE_BASE_URL + UNDER_REVIEW_DATA,{
        params:{
            id: encrypt(id),
        },
    })
}

const previousReviewData = (id) => {
    return API.get(ESIGN_APPLICATION_SERVICE_BASE_URL + PREVIOUS_REVIEW_DATA,{
        params:{
            id: encrypt(id),
        },
    })
}

const getEspApplicationRecommandedForRejection = () => {
    return API.get(ESIGN_APPLICATION_SERVICE_BASE_URL + GET_ESP_APPLICATION_RECOMMANDED_FOR_REJECTION)
}

const approveOrRjectEspApplicationByCCA = (obj) => {

    const username = auth().username;
    const obj1 = {...obj};
    obj1.userName = encrypt(username);
    obj1.esignLicenseeAppId = encrypt(obj1.esignLicenseeAppId);

    return API.post(ESIGN_APPLICATION_SERVICE_BASE_URL + SUBMIT_APPLICATION_FOR_REJECTION_OR_APPROVE, obj1);
}

const underReviewDataByUsername = () => {
    const username = auth().username;
    return API.get(ESIGN_APPLICATION_SERVICE_BASE_URL + UNDER_REVIEW_DATA_BY_USERNAME,{
        params:{
            id: encrypt(username),
        },
    })
}

const recommandForeSignGoLive = (obj) => {
    const username = auth().username;
    const obj1 = {...obj};
    obj1.userName = encrypt(username);
    obj1.esignLicenseeAppId = encrypt(obj1.esignLicenseeAppId);

    return API.post(ESIGN_APPLICATION_SERVICE_BASE_URL + RECOMMEND_FOR_ESIGN_GO_LIVE, obj1);
}

const approveForeSignGoLive = (id) => {
    const username = auth().username;
    return API.get(ESIGN_APPLICATION_SERVICE_BASE_URL + APPROVE_ESIGN_GO_LIVE,{
        params:{
            id: encrypt(id),
            pid: encrypt(username)
        },
    })
}

const getEspApplicationRecommandedForEsignGoLive = () => {
    return API.get(ESIGN_APPLICATION_SERVICE_BASE_URL + GET_ESP_APPLICATION_RECOMMANDED_FOR_ESIGN_GO_LIVE)
}

const getEspApplicationApprovedForEsignGoLive = () => {
    return API.get(ESIGN_APPLICATION_SERVICE_BASE_URL + GET_ESP_APPLICATION_APPROVED_FOR_ESIGN_GO_LIVE)
}

const getEspApplicationRejected = () => {
    return API.get(ESIGN_APPLICATION_SERVICE_BASE_URL + GET_ESP_APPLICATION_REJECTED)
}

const getEspApplicationExpired = () => {
    return API.get(ESIGN_APPLICATION_SERVICE_BASE_URL + GET_ESP_APPLICATION_EXPIRED)
}

const getPreviousApplicationDetails = () => {

    const username = auth().username;

    return API.get(ESIGN_APPLICATION_SERVICE_BASE_URL + GET_PREVIOUS_APPLICATION_DETAILS,{
        params:{
            id: encrypt(username),
        },
    })
}


const checkForESP = () => {

    const username = auth().username;

    return API.get(ESIGN_APPLICATION_SERVICE_BASE_URL + CHECK_FOR_ESP,{
        params:{
            id: encrypt(username),
        },
    })
}

const getAllESPWithEkycModeApproved = () =>{

    return API.get(ESIGN_APPLICATION_SERVICE_BASE_URL + GET_ALL_ESP_WITH_EKYC_MODE_APPROVED)
}

const downloadApplicationForm = () => {

    const username = auth().username;

    return API.get(ESIGN_APPLICATION_SERVICE_BASE_URL + DOWNLOAD_APPLICATION_FORM,{
        params:{
            id: encrypt(username),
        },
        responseType: 'blob', 
        ...sconfig
    })
}

export default{
    downloadCoverLetter,
    saveStepOne,
    getFirstStepData,
    getSelectedEKYCMode,
    SaveStepTwo,
    getSecondStepData,
    downloadStepTwoDocument,
    saveStepThree,
    getThirdStepData,
    downloadStepThreeDocument,
    getPreview,
    getApplicationDetails,
    submitApplication,
    getAllApplicationUnderReview,
    viewESPApplication,
    submitReviewESPApplication,
    underReviewData,
    previousReviewData,
    getEspApplicationRecommandedForRejection,
    approveOrRjectEspApplicationByCCA,
    underReviewDataByUsername,
    recommandForeSignGoLive,
    approveForeSignGoLive,
    getEspApplicationRecommandedForEsignGoLive,
    getEspApplicationApprovedForEsignGoLive,
    getEspApplicationRejected,
    getEspApplicationExpired,
    getPreviousApplicationDetails,
    getPreviewById,
    checkForESP,
    getAllESPWithEkycModeApproved,
    downloadApplicationForm
}