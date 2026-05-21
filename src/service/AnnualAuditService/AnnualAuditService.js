import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

const AUDIT_SERVICE = "/annual-audit-service";

//Country APIs
    const ADD_AUDIT_AGENCY_SELECTION = "/audit-agency-selection";
	const UPDATE_APPLICATION_TYPE = "/update-application-type";
	const GET_ALL_AUDIT_SELECTION = "/get-all-audit-selection";
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
const ADD_AUNNUAL_AUDIT="/licensee-audit";
const AUDIT_NC_REPORT="/get-All-AuditNC-details";

const CHANGE_STATUS_REJECTED="/review-by-committee"
const CHANGE_STATUS_APPROVED="/review-by-committees"
const GET_ALL_DATA_REVIEW_REMARKS="/get-All-ShortComming";
const CHANGE_APPLICANT_TO_REVIEWE="/reviewer-remarks-by-applicant";
const APPLICATION_REJECTED="/review-by-cca";
const GET_ANNUAL_AUDIT_START_DATE_BY_USERNAME="/get-annual-audit-started";

   const VIEW_FILE="/downloadFile";
   const DOWNLOAD_AUDITOR_REPORT="/download-auditor-report";

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
	return API.post(AUDIT_SERVICE+CHANGE_BY_APPLICANT_USERNAME,obj)
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
	return API.post(AUDIT_SERVICE+CHANGE_APPLICANT_TO_REVIEWE,obj)
}

const applicationRejected = (obj) =>{
	return API.post(AUDIT_SERVICE+APPLICATION_REJECTED,obj)
}

const submitLicenseeAuditForm = (obj) =>{
	return API.post(AUDIT_SERVICE+ADD_AUNNUAL_AUDIT,obj)
}
const downloadAuditorReport = () =>{
	return API.get(AUDIT_SERVICE+DOWNLOAD_AUDITOR_REPORT,{
		responseType: 'blob', 
		...sconfig
	})
}


const getAnnualAuditStartDateByUsername= (userName) =>{

	return API.get(AUDIT_SERVICE+GET_ANNUAL_AUDIT_START_DATE_BY_USERNAME,{
		params:{
			id:encrypt(userName)
		}
	})
}


export default{
    addNewAuditAgencySlection,
	getAllAuditSelectionList,
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
				submitLicenseeAuditForm,
				downloadAuditorReport,
				getAnnualAuditStartDateByUsername,
				
            };
