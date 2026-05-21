import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;
import store from '../../store';

	const NERLICENSE_SERVICE = "/newlicense-service";


	const ADD_NEW_INVISUAL_DECLARIZATION = "/add-individual-declarization-form";
    const ADD_NEW_APPLICATIONFORM1 = "/add-individual-application-form";
	const ADD_NEW_APPLICATIONFORM2 = "/add-individual-application-form2";
	const ADD_NEW_APPLICATIONFORM3 = "/add-individual-application-form3";
	const ADD_NEW_APPLICATIONFORM4 = "/add-individual-application-form4";
	const ADD_NEW_APPLICATIONFORM5 = "/add-individual-application-form5";
	const ADD_NEW_APPLICATIONFORM6 = "/add-individual-application-form6";
	const UPDATE_APPLICATIONFORM1 = "/update-individual-application-form";
	const GET_ALL_APPLICATIONFORM1= "/get-all-individual-application-form";
	const DELETE_APPLICATIONFORM_BY_ID = "/delete-application-by-id";
	const CHANGE_APPLICATIONFORM_STATUS = "/change-application-status-by-id";
	const GET_APPLICATIONFORM_BY_ID1 = "/get-individual-application-form-by-id";
	const GET_APPLICATIONFORM_BY_USERNAME="/get-individual-application-form-by-username";
	const GET_APPLICATIONFORM2_BY_USERNAME="/get-second-individual-application-form-by-username";
	const GET_APPLICATIONFORM3_BY_USERNAME="/get-third-individual-application-form-by-username";
	const GET_APPLICATIONFORM4_BY_USERNAME="/get-fourth-individual-application-form-by-username";
	const GET_APPLICATIONFORM5_BY_USERNAME="/get-fifth-individual-application-form-by-username";
	const GET_APPLICATIONFORM6_BY_USERNAME="/get-six-individual-application-form-by-username";
	const UPDATE_NEW_APPLICATIONFORM1 = "/update-individual-application-form";
	const UPDATE_NEW_APPLICATIONFORM2 = "/update-individual-application-form2";
	const UPDATE_NEW_APPLICATIONFORM3 = "/update-individual-application-form3";
	const UPDATE_NEW_APPLICATIONFORM4 = "/update-individual-application-form4";
	const UPDATE_NEW_APPLICATIONFORM5 = "/update-individual-application-form5";
	const UPDATE_NEW_APPLICATIONFORM6 = "/update-individual-application-form6";
	const GET_APPLICATION_DETAILS_FORM_BY_USERNAME="/get-application-details-by-username";
    const DOWLOAD_THREE_STEP_FILE="/get-three-step-file";
	const DOWLOAD_SIX_STEP_FILE="/get-six-step-file";
	const GET_PAYMENT_APPLICATION_FORM="/get-payment-application-form";
	const APPLICATION_FORM_GENERATE_FOR_INDIVIDUAL = "/generate-individual-application-form-pdf";
	const GET_PAYMENT_PROOF_FORM="/get-payment-proof-form";
	const GET_ALL_PAYMENT_PROOF="/get-all-payment-proof";
    const GET_PAYMENT_VERIFICATION_FORM="/get-all-payment-verification";
	const VIEW_FILE="/view-the-file";
	const CCA_REJECTED_DATA = "/cca-rejected-data";
	const CCA_APPROVED_DATA = "/cca-approved-data";
	const APPROVED_DATA = "/approved-data";
const VIEWS_FILE = "/views-file";
const GET_ALL_PAYMENT_PROOF_BY_INTENT_ID="/get-payment-verification-by-intent-id";
const GET_ALL_APPLICATION_TIMELINE="/get-all-application-tumeline";


const GET_ESIGNED_DOCUMENT_ID="/get-esign-document-id";

	const auth = () => {
		const state = store.getState();
		return state.jwtAuthentication;
	  }

	const sconfig={
		headers: {
			'Content-Type': 'application/octet-stream',
		},
	}
	

	const addNewApplicationForm = (obj)=>{
		return API.post(NERLICENSE_SERVICE+ADD_NEW_APPLICATIONFORM1, obj);
	}
	const addApplicationForm = (obj)=>{
		return API.post(NERLICENSE_SERVICE+ADD_NEW_INVISUAL_DECLARIZATION, obj);
	}

	const addNewApplicationForm2 = (obj)=>{
		return API.post(NERLICENSE_SERVICE+ADD_NEW_APPLICATIONFORM2, obj);
	}

	const addNewApplicationForm3 = (obj)=>{
		return API.post(NERLICENSE_SERVICE+ADD_NEW_APPLICATIONFORM3, obj);
	}
	const addNewApplicationForm4 = (obj)=>{
		return API.post(NERLICENSE_SERVICE+ADD_NEW_APPLICATIONFORM4, obj);
	}
	const addNewApplicationForm5 = (obj)=>{
		return API.post(NERLICENSE_SERVICE+ADD_NEW_APPLICATIONFORM5, obj);
	}
	const addNewApplicationForm6 = (obj)=>{
		return API.post(NERLICENSE_SERVICE+ADD_NEW_APPLICATIONFORM6, obj);
	}

	const updateNewApplicationForm = (obj)=>{
		return API.post(NERLICENSE_SERVICE+UPDATE_NEW_APPLICATIONFORM1, obj);
	}

	const updateNewApplicationForm2 = (obj)=>{
		return API.post(NERLICENSE_SERVICE+UPDATE_NEW_APPLICATIONFORM2, obj);
	}

	const updateNewApplicationForm3 = (obj)=>{
		return API.post(NERLICENSE_SERVICE+UPDATE_NEW_APPLICATIONFORM3, obj);
	}
	const updateNewApplicationForm4 = (obj)=>{
		return API.post(NERLICENSE_SERVICE+UPDATE_NEW_APPLICATIONFORM4, obj);
	}
	const updateNewApplicationForm5 = (obj)=>{
		return API.post(NERLICENSE_SERVICE+UPDATE_NEW_APPLICATIONFORM5, obj);
	}
	const updateNewApplicationForm6 = (obj)=>{
		return API.post(NERLICENSE_SERVICE+UPDATE_NEW_APPLICATIONFORM6, obj);
	}




	const updateApplicationForm = (obj)=>{

		const obj1 = {...obj};

		obj1.appTypeId = encrypt(obj1.appTypeId);

		return API.post(NERLICENSE_SERVICE+UPDATE_APPLICATIONFORM1, obj);
	}

	const getAllApplicationFormList = () =>{
		return API.get(NERLICENSE_SERVICE+GET_ALL_APPLICATIONFORM1);
	}

	const changeApplicationFormeStatus = (id) =>{
		return API.get(NERLICENSE_SERVICE+CHANGE_APPLICATIONFORM_STATUS,{
			params:{
				id:encrypt(id)
			}
		})
	}

	const getApplicationFormById = (id) =>{

		return API.get(NERLICENSE_SERVICE+GET_APPLICATIONFORM_BY_ID1,{
			params:{
				id:encrypt(id)
			}
		})
	}

	const getApplicationFormByUsername = (userName) =>{

		return API.get(NERLICENSE_SERVICE+GET_APPLICATIONFORM_BY_USERNAME,{
			params:{
				userName:userName
			}
		})
	}

	const getApplicationForm2ByUsername = (userName) =>{

		return API.get(NERLICENSE_SERVICE+GET_APPLICATIONFORM2_BY_USERNAME,{
			params:{
				userName:userName
			}
		})
	}

	const getApplicationForm3ByUsername = (userName) =>{

		return API.get(NERLICENSE_SERVICE+GET_APPLICATIONFORM3_BY_USERNAME,{
			params:{
				userName:userName
			}
		})
	}


	const getApplicationForm4ByUsername = (userName) =>{

		return API.get(NERLICENSE_SERVICE+GET_APPLICATIONFORM4_BY_USERNAME,{
			params:{
				userName:userName
			}
		})
	}

	const getApplicationForm5ByUsername = (userName) =>{

		return API.get(NERLICENSE_SERVICE+GET_APPLICATIONFORM5_BY_USERNAME,{
			params:{
				userName:userName
			}
		})
	}

	const getApplicationDetailsFormByUsername = (userName) =>{

		return API.get(NERLICENSE_SERVICE+GET_APPLICATION_DETAILS_FORM_BY_USERNAME,{
			params:{
				userName:userName
			}
		})
	}


	const getApplicationForm6ByUsername = (userName) =>{

		return API.get(NERLICENSE_SERVICE+GET_APPLICATIONFORM6_BY_USERNAME,{
			params:{
				userName:userName
			}
		})
	}

	const deleteApplicationForm= (id) =>{
		return API.get(NERLICENSE_SERVICE+DELETE_APPLICATIONFORM_BY_ID,{
			params:{
				id:encrypt(id)
			}
		})
	}

	const viewFile = (id) =>{
		return API.get(NERLICENSE_SERVICE+VIEW_FILE,{
			params:{
				id:encrypt(id)
			},
			responseType: 'blob', 
			...sconfig
		})
	}

	const generatePdf = (intentId) =>{
		return API.get(NERLICENSE_SERVICE+APPLICATION_FORM_GENERATE_FOR_INDIVIDUAL,{
			params:{
				intentId:intentId
			},
			responseType: 'blob', 
			...sconfig
		})
	}

	const downloadFile = (id) =>{
		return API.get(NERLICENSE_SERVICE+DOWLOAD_THREE_STEP_FILE,{
			params:{
				id:encrypt(id)
			},
			responseType: 'blob', 
			...sconfig
		})
	}

	const downloadSixStepFile = (id) =>{
		return API.get(NERLICENSE_SERVICE+DOWLOAD_SIX_STEP_FILE,{
			params:{
				id:encrypt(id)
			},
			responseType: 'blob', 
			...sconfig
		})
	}

	const getApplicationPayment = (paymentObj) => {
		return API.post(NERLICENSE_SERVICE +GET_PAYMENT_APPLICATION_FORM, paymentObj);
	};
	
	const getPaymentProofApplicationForm = (paymentProofDTO) => {
		const formData = new FormData();
	
		
		formData.append("intentAppId", paymentProofDTO.intentAppId);
		formData.append("amount", paymentProofDTO.amount);
		formData.append("transactionNumber", paymentProofDTO.transactionNumber);
		formData.append("selectedDate", paymentProofDTO.selectedDate);
	
		
		if (paymentProofDTO.file) {
			formData.append("file", paymentProofDTO.file);
		}
	
		return API.post(NERLICENSE_SERVICE + GET_PAYMENT_PROOF_FORM, formData)
	};
	

	const getAllApplications = ()=>{
		return API.get(NERLICENSE_SERVICE+GET_ALL_PAYMENT_PROOF);
	}

	const getPaymentVerificationApplicationForm = (paymentProofDTO) => {
		const username = auth().username;
		const formData = new FormData();
	
		// Append all required fields
		formData.append("intentAppId", paymentProofDTO.intentAppId || "");
		formData.append("amount", paymentProofDTO.amount || "");
		formData.append("transactionNumber", paymentProofDTO.transactionNumber || "");
		formData.append("selectedDate", paymentProofDTO.selectedDate || "");
		formData.append("userName", username);
	
		// Append file only if it exists
		if (paymentProofDTO.file) {
			formData.append("file", paymentProofDTO.file);
		}
	
		// Send request
		return API.post(NERLICENSE_SERVICE + GET_PAYMENT_VERIFICATION_FORM, formData, {
		});
	};
	
	const addAllAprovedAData = (obj)=>{
		return API.post(NERLICENSE_SERVICE+CCA_APPROVED_DATA, obj);
	}

	const addAllRejectedAData = (obj)=>{
		return API.post(NERLICENSE_SERVICE+CCA_REJECTED_DATA, obj);
	}

	const addAllAproved = (obj)=>{
		return API.post(NERLICENSE_SERVICE+APPROVED_DATA, obj);
	}

	const viewsFile = (id) =>{
		return API.get(NERLICENSE_SERVICE+VIEWS_FILE,{
			params:{
				id:encrypt(id)
			},
			responseType: 'blob', 
			...sconfig
		})
	}

	const getApplicantPaymentProofByIntentId =  (id) =>{
		return API.get(NERLICENSE_SERVICE+GET_ALL_PAYMENT_PROOF_BY_INTENT_ID,{
			params:{
				id:id
			}
		})
	}

	const getEsignedDocumentId = (ApplicantUserName) =>{
		return API.get(NERLICENSE_SERVICE+GET_ESIGNED_DOCUMENT_ID,{
			params:{
			userName:(ApplicantUserName)
			}
		})
	}

const getAllApplicationTimelineList = (ApplicantUserName) =>{
		return API.get(NERLICENSE_SERVICE+GET_ALL_APPLICATION_TIMELINE,{
			params:{
			userName:encrypt(ApplicantUserName)
			}
		})
	}

export default{
                addNewApplicationForm,
                getAllApplicationFormList,
				changeApplicationFormeStatus,
				updateApplicationForm,
				deleteApplicationForm,
				getApplicationFormById,
				addNewApplicationForm2,
				addNewApplicationForm3,
				addNewApplicationForm4,
				addNewApplicationForm5,
				addNewApplicationForm6,
				getApplicationFormByUsername,
				getApplicationForm2ByUsername,
				getApplicationForm3ByUsername,
				getApplicationForm4ByUsername,
				getApplicationForm5ByUsername,
				getApplicationForm6ByUsername,
				updateNewApplicationForm,
				updateNewApplicationForm2,
				updateNewApplicationForm3,
				updateNewApplicationForm4,
				updateNewApplicationForm5,
				updateNewApplicationForm6,
				viewFile,
				getApplicationDetailsFormByUsername,
				addApplicationForm,
				generatePdf,
				downloadFile,
				downloadSixStepFile,
				getApplicationPayment,
				getPaymentProofApplicationForm,
				getAllApplications,
				getPaymentVerificationApplicationForm,
				addAllAprovedAData,
				addAllRejectedAData,
				addAllAproved,
				viewsFile,
				getApplicantPaymentProofByIntentId,
				getEsignedDocumentId,
				getAllApplicationTimelineList,
            };
