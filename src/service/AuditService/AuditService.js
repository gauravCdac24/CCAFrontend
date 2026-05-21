import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

const AUDIT_SERVICE = "/audit-service";

//Country APIs
    const ADD_AUDIT_AGENCY_SELECTION = "/audit-agency-selection";
	const UPDATE_APPLICATION_TYPE = "/update-application-type";
	const GET_ALL_AUDIT_SELECTION = "/get-all-audit-selection";
	const GET_ALL_DETAILS_BY_USERNAME = "/get-all-details-by-userId";
	const GET_ALL_ACTIVE_APPLICATION_TYPE = "/get-all-active-application-type";
	const GET_ALL_INACTIVE_APPLICATION_TYPE= "/get-all-inactive-application-type";
	const DELETE_APPLICATION_TYPE_BY_ID = "/delete-application-type-by-id";
	const CHANGE_APPLICATION_TYPE_STATUS = "/status-change";
	const GET_APPLICATION_TYPE_BY_ID = "/get-application-type-by-id";
   const SUBMIT_AUDIT_FORM="/submit";
   const APPLICANT_USERNAME="/getAuditForm"
const REJECTED_AUDIT_FORM="/rejectSubmit"
const APPROVED_AUDIT_FORM="/approveSubmit"
const AUDIT_NC_FORM="/auditor-nc-form"
const GET_ALL_DATA="/get-all-criteria"
const VIEW_DOCUMENT_NAME="/document-name"
const CHANGE_STATUS_BY_APPLICANT_USERNAME="/remarks-applicant-UserName"
const VIEW_REMARKS_AUDITORS="/get-all-remarks";
const CHANGE_BY_APPLICANT_USERNAME="/applicant-remarks-by-applicant-UserName";
const VIEW_AUDIT_NC_FILES="/applicant-document-name";
const CHANGE_STATUS="/auditor-remarks-by-applicant-UserName";
const GET_ALL_DATA_OF_NCS_REPORT="/get-all-data";
const GET_ALL_DATA_OF_SHORT_COMMING="/get-All-ShortComming";

const AUDIT_NC_REPORT="/get-All-AuditNC-details";

const CHANGE_STATUS_REJECTED="/review-by-committee"
const CHANGE_STATUS_APPROVED="/review-by-committees"
const GET_ALL_DATA_REVIEW_REMARKS="/get-All-ShortComming";
const CHANGE_APPLICANT_TO_REVIEWE="/reviewer-remarks-by-applicant";
const APPLICATION_REJECTED="/review-by-cca";
const APPLICATION_AUDIT_CONTROL="/save-audit-control";
const GET_ALL_APPLICANT_BY_USERNAME="/get-All-Audit-Report-Criteria-Details";
   const VIEW_FILE="/downloadFile";
   const VIEW_FILES="/downloadFiles";

const CHANGE_STATUS_OF_APPLICATION="/change-the-status-by-applicant-UserName"	;

const GET_ALL_APPLICANT_ACTION_TAKEN="/get-All-Applicant-Action-Taken-details";

const VIEW_APPLICANT_ACTION_TAKEN_FILES="/applicant-action-taken-document-name";

const AUDITOR_REJECT_NC="/auditor-reject-nc";

const AUDITOR_APPROVE_NC="/auditor-accept-nc";

const FORWORD_TO_APPLICANT="/forword-to-applicant";
const DOWNLOAD_FINAL_RIVISION="/download-auditor-report";
const GET_ESIGNED_DOCUMENT_ID="/get-esign-document-id";
const GET_AUDIT_ESIGN_STATUS="/get-audit-esign-status";
const MARK_AUDIT_ESIGN_FAILED="/mark-audit-esign-failed";

const GET_ALL_SHORT_COMMING_REPORT="/get-All-ShortCommingReport";
const DOWNLOAD_SHORT_COMMING_REPORT="/short-comming-report";
const GET_ALL_ANNEXURE_MAIN="/get-all-annexure-main";
const GET_AUDITOR_REMARKS_TO_REVIEWER="/auditor-remarks-by-auditors";
const GET_ALL_AUDITOR_REVIEW_REPORT="/get-All-Auditor-Review-Report";
const DOWNLOAD_AUDITOR_REVIEW_REPORT="/auditor-review-report";


	const sconfig={
		headers: {
			'Content-Type': 'application/octet-stream',
		},
	}
const addNewAuditAgencySlection = (obj)=>{
	return API.post(AUDIT_SERVICE+ADD_AUDIT_AGENCY_SELECTION, obj);
}

const submitAuditForm=(obj)=>{
	return API.post(AUDIT_SERVICE+SUBMIT_AUDIT_FORM, obj,{
		headers: {
            'Content-Type': 'multipart/form-data', 
        },
	});
}

const approvedAuditForm=(obj)=>{
	return API.post(AUDIT_SERVICE+APPROVED_AUDIT_FORM, obj,{
		headers: {
            'Content-Type': 'multipart/form-data', 
        },
	});
}

const rejectedAuditForm=(obj)=>{
	return API.post(AUDIT_SERVICE+REJECTED_AUDIT_FORM, obj,{
		headers: {
            'Content-Type': 'multipart/form-data', 
        },
	});
}


const AuditNCForm=(obj)=>{
	return API.post(AUDIT_SERVICE+AUDIT_NC_FORM, obj,{
		headers: {
            'Content-Type': 'multipart/form-data', 
        },
	});
}

const updateApplicationType = (obj)=>{

	const obj1 = obj;

	obj.appTypeMasterId = encrypt(obj.appTypeMasterId);
   

	return API.post(AUDIT_SERVICE+UPDATE_APPLICATION_TYPE, obj);
}

const getAllAuditSelectionList = () =>{
    return API.get(AUDIT_SERVICE+GET_ALL_AUDIT_SELECTION);
}

const getAllAuditSelectionByUsername = (username) =>{
    return API.get(AUDIT_SERVICE+GET_ALL_DETAILS_BY_USERNAME+"/"+encrypt(username));
}

const getAuditorApplicationbyApplicatantUserName = (userName) =>{
	return API.get(AUDIT_SERVICE+APPLICANT_USERNAME,{
		params:{
			userName:(userName)
		}
	})
}

const getApplicationTypeById = (id) =>{

	return API.get(AUDIT_SERVICE+GET_APPLICATION_TYPE_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}

const deleteApplicationType = (id) =>{
	return API.get(AUDIT_SERVICE+DELETE_APPLICATION_TYPE_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}
const viewFile = (id) =>{
	return API.get(AUDIT_SERVICE+VIEW_FILE,{
		params:{
			id:encrypt(id)
		},
		responseType: 'blob', 
		...sconfig
	})
}

const viewFiles = (id) =>{
	//alert(id)
	return API.get(AUDIT_SERVICE+VIEW_FILES,{
		params:{
			id:encrypt(id)
		},
		responseType: 'blob', 
		...sconfig
	})
}



const viewDocumentName = (documentName) =>{
	return API.get(AUDIT_SERVICE+VIEW_DOCUMENT_NAME,{
		params:{
			documentName:encrypt(documentName)
		},
		responseType: 'blob', 
		...sconfig
	})
}

const getAllDatas = () =>{

	return API.get(AUDIT_SERVICE+GET_ALL_DATA
		
	)
}

const changeTheStatusByApplicantUserName = (obj) =>{
	return API.post(AUDIT_SERVICE+CHANGE_STATUS_BY_APPLICANT_USERNAME,obj)
}

const viewRemarks = (applicantUserName) =>{
	return API.get(AUDIT_SERVICE+VIEW_REMARKS_AUDITORS,{
		params:{
			applicantUserName:applicantUserName
		},
	})
}

const changeByApplicantUserName = (obj) =>{
	return API.post(AUDIT_SERVICE+CHANGE_BY_APPLICANT_USERNAME, obj, {
		timeout: 120000,
		headers: { 'Content-Type': 'multipart/form-data' },
	})
}

const auditNCReport = (userName) =>{
	return API.get(AUDIT_SERVICE+AUDIT_NC_REPORT,{
		params:{
			applicantUserName:(userName)
		}
	})
}

const viewAuditNCReport= (id) =>{
	return API.get(AUDIT_SERVICE+VIEW_AUDIT_NC_FILES,{
		params:{
			documentName:encrypt(id)
		},
		responseType: 'blob', 
		...sconfig
	})
}
const changeTheStatus = (obj) =>{
	return API.post(AUDIT_SERVICE+CHANGE_STATUS,obj)
}

const getAllData = () =>{

	return API.get(AUDIT_SERVICE+GET_ALL_DATA_OF_NCS_REPORT
		
	)
}
const getAllShortComming= (userName) =>{

	return API.get(AUDIT_SERVICE+GET_ALL_DATA_OF_SHORT_COMMING,{
		params:{
			applicantUserName:(userName)
		}
	})
}

const changeTheStatusRejected = (obj) =>{
	return API.post(AUDIT_SERVICE+CHANGE_STATUS_REJECTED,obj)
}

const changeTheStatusApprove = (obj) =>{
	return API.post(AUDIT_SERVICE+CHANGE_STATUS_APPROVED,obj)
}

const viewReviewerRemarks= (userName) =>{

	return API.get(AUDIT_SERVICE+GET_ALL_DATA_REVIEW_REMARKS,{
		params:{
			applicantUserName:(userName)
		}
	})
}


const changestatusToReviewer = (obj) =>{
	// FormData: let axios set Content-Type with boundary automatically
	return API.post(AUDIT_SERVICE+CHANGE_APPLICANT_TO_REVIEWE, obj);
}

const applicationRejected = (obj) =>{
	return API.post(AUDIT_SERVICE+APPLICATION_REJECTED,obj)
}

const addNewAuditControl = (obj) =>{
	return API.post(AUDIT_SERVICE+APPLICATION_AUDIT_CONTROL,obj)
}

const getByApplicantUserNames= (userName) =>{

	return API.get(AUDIT_SERVICE+GET_ALL_APPLICANT_BY_USERNAME,{
		params:{
			applicantUserName:(userName)
		}
	})
}
const changeTheStatusOfApplication=(obj) =>{

	return API.post(AUDIT_SERVICE+CHANGE_STATUS_OF_APPLICATION,obj
	)
	
}
const getByApplicantActionTaken= (userName) =>{

	return API.get(AUDIT_SERVICE+GET_ALL_APPLICANT_ACTION_TAKEN,{
		params:{
			applicantUserName:(userName)
		}
	})
}

const viewApplicantActionTaken = (id) =>{ 
return API.get(AUDIT_SERVICE+VIEW_APPLICANT_ACTION_TAKEN_FILES,{
	params:{
		documentName:encrypt(id)
	},
	responseType: 'blob', 
	...sconfig
})
}

const getAuditorRejectedData = (obj) =>{
	return API.post(AUDIT_SERVICE+AUDITOR_REJECT_NC,obj)
}

const getAuditorApprovedData = (obj) =>{
	return API.post(AUDIT_SERVICE+AUDITOR_APPROVE_NC,obj)
}


const forwordToApplicant=(obj) =>{

	return API.post(AUDIT_SERVICE+FORWORD_TO_APPLICANT,obj
	)
	
}

const downloadDocument = (obj) => {
  return API.post(AUDIT_SERVICE + DOWNLOAD_FINAL_RIVISION, obj, {
    responseType: 'blob',
    ...sconfig
  });
}


const getEsignedDocumentId = (ApplicantUserName) =>{
	return API.get(AUDIT_SERVICE+GET_ESIGNED_DOCUMENT_ID,{
		params:{
		userName:(ApplicantUserName)
		}
	})
}

const getAuditEsignStatus = (applicantUserName) => {
	return API.get(AUDIT_SERVICE + GET_AUDIT_ESIGN_STATUS, {
		params: { userName: applicantUserName },
	});
};

const markAuditEsignFailed = (applicantUserName) => {
	return API.post(AUDIT_SERVICE + MARK_AUDIT_ESIGN_FAILED, null, {
		params: { userName: applicantUserName },
	});
};


const getByAllShortCommingReportApplicantUserName = (ApplicantUserName) =>{
	return API.get(AUDIT_SERVICE+GET_ALL_SHORT_COMMING_REPORT,{
		params:{
			applicantUserName:(ApplicantUserName)
		}
	})
}

const downloadShortCommingDocument = (fileName) =>{
	return API.get(AUDIT_SERVICE+DOWNLOAD_SHORT_COMMING_REPORT,{
		params:{
		documentName:encrypt(fileName)
		},
		responseType: 'blob', 
		...sconfig
	})
}

const viewAuditReport = (fileName) =>{
	return API.get(AUDIT_SERVICE+DOWNLOAD_AUDITOR_REVIEW_REPORT,{
		params:{
		documentName:encrypt(fileName)
		},
		responseType: 'blob', 
		...sconfig
	})
}

const getAllAuditorMain=() =>{

	return API.get(AUDIT_SERVICE+GET_ALL_ANNEXURE_MAIN)
	
}

const getAuditorRemarksToReviewer=(obj) =>{

	return API.post(AUDIT_SERVICE+GET_AUDITOR_REMARKS_TO_REVIEWER,obj
	)
	
}


const getByAllAuditorRemarksByApplicantUserName = (ApplicantUserName) =>{
	return API.get(AUDIT_SERVICE+GET_ALL_AUDITOR_REVIEW_REPORT,{
		params:{
			applicantUserName:(ApplicantUserName)
		}
	})
}

// Accept NC report and move to NC Closure step (breaks the loop)
const acceptAuditorRemarks = (obj) => {
	return API.post(AUDIT_SERVICE+"/accept-auditor-remarks",obj)
}

export default{

    addNewAuditAgencySlection,
	getAllAuditSelectionList,
	getAllAuditSelectionByUsername,
	getAuditorApplicationbyApplicatantUserName,
				updateApplicationType,
				deleteApplicationType,
				getApplicationTypeById,
				submitAuditForm,
				viewFile,
				approvedAuditForm,
				rejectedAuditForm,
				AuditNCForm,
				getAllDatas,
				viewDocumentName,
				changeTheStatusByApplicantUserName,
				viewRemarks,
				changeByApplicantUserName,
				auditNCReport,
				viewAuditNCReport,
				changeTheStatus,
				getAllData,
				getAllShortComming,
				changeTheStatusRejected,
				changeTheStatusApprove,
				viewReviewerRemarks,
				changestatusToReviewer,
				applicationRejected,
				addNewAuditControl,
				getByApplicantUserNames,
				changeTheStatusOfApplication,
				getByApplicantActionTaken,
				viewApplicantActionTaken,
				getAuditorRejectedData,
				getAuditorApprovedData,
				forwordToApplicant,
				downloadDocument,
				getEsignedDocumentId,
				getAuditEsignStatus,
				markAuditEsignFailed,
				getByAllShortCommingReportApplicantUserName,
				downloadShortCommingDocument,
				viewFiles,
				getAllAuditorMain,
				getAuditorRemarksToReviewer,
				getByAllAuditorRemarksByApplicantUserName,
				viewAuditReport,
				acceptAuditorRemarks,
            };
