import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

const RENEW_LICENSE_SERVICE = "/renew-license-service";


	const FIRM_APPLICATION_REVIEW = "/add-application-review";

	const GOVERNMENT_AGENCY_APPLICATION_REVIEW = "/add-government-agency-application-review";
    const ADD_NEW_INDIVIDUAL_FORM = "/add-individual-application-review";
	const ADD_NEW_APPLICATIONFORM2 = "/add-individual-application-form2";
	const ADD_NEW_APPLICATIONFORM3 = "/add-individual-application-form3";
	const ADD_NEW_APPLICATIONFORM4 = "/add-individual-application-form4";
	const ADD_NEW_APPLICATIONFORM5 = "/add-individual-application-form5";
	const ADD_NEW_APPLICATIONFORM6 = "/add-individual-application-form6";
	const UPDATE_APPLICATIONFORM1 = "/update-individual-application-form";
	const GET_ALL_APPLICATION_REVIEW= "/get-all-application-review";
	const DELETE_APPLICATIONFORM_BY_ID = "/delete-application-by-id";
	const CHANGE_APPLICATIONFORM_STATUS = "/change-application-status-by-id";
	const GET_APPLICATIONFORM_BY_ID1 = "/get-individual-application-form-by-id";
	const GET_APPLICATION_REVIEW_BY_USERNAME="/get-all-application-review-by-username";
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

	const VIEW_FILE="/view-the-file"


	const sconfig={
		headers: {
			'Content-Type': 'application/octet-stream',
		},
	}
	

	const addFirmApplicationReview = (obj)=>{
		return API.post(RENEW_LICENSE_SERVICE+FIRM_APPLICATION_REVIEW, obj);
	}
	const addGovernmentAgencyApplicationReveiw = (obj)=>{
		return API.post(RENEW_LICENSE_SERVICE+GOVERNMENT_AGENCY_APPLICATION_REVIEW, obj);
	}

	const addNewIndividualReview = (obj)=>{
		return API.post(RENEW_LICENSE_SERVICE+ADD_NEW_INDIVIDUAL_FORM, obj);
	}

	// const addNewApplicationForm3 = (obj)=>{
	// 	return API.post(RENEW_LICENSE_SERVICE+ADD_NEW_APPLICATIONFORM3, obj);
	// }
	// const addNewApplicationForm4 = (obj)=>{
	// 	return API.post(RENEW_LICENSE_SERVICE+ADD_NEW_APPLICATIONFORM4, obj);
	// }
	// const addNewApplicationForm5 = (obj)=>{
	// 	return API.post(RENEW_LICENSE_SERVICE+ADD_NEW_APPLICATIONFORM5, obj);
	// }
	// const addNewApplicationForm6 = (obj)=>{
	// 	return API.post(RENEW_LICENSE_SERVICE+ADD_NEW_APPLICATIONFORM6, obj);
	// }

	// const updateNewApplicationForm = (obj)=>{
	// 	return API.post(RENEW_LICENSE_SERVICE+UPDATE_NEW_APPLICATIONFORM1, obj);
	// }

	// const updateNewApplicationForm2 = (obj)=>{
	// 	return API.post(RENEW_LICENSE_SERVICE+UPDATE_NEW_APPLICATIONFORM2, obj);
	// }

	// const updateNewApplicationForm3 = (obj)=>{
	// 	return API.post(RENEW_LICENSE_SERVICE+UPDATE_NEW_APPLICATIONFORM3, obj);
	// }
	// const updateNewApplicationForm4 = (obj)=>{
	// 	return API.post(RENEW_LICENSE_SERVICE+UPDATE_NEW_APPLICATIONFORM4, obj);
	// }
	// const updateNewApplicationForm5 = (obj)=>{
	// 	return API.post(RENEW_LICENSE_SERVICE+UPDATE_NEW_APPLICATIONFORM5, obj);
	// }
	// const updateNewApplicationForm6 = (obj)=>{
	// 	return API.post(RENEW_LICENSE_SERVICE+UPDATE_NEW_APPLICATIONFORM6, obj);
	// }




	// const updateApplicationForm = (obj)=>{

	// 	const obj1 = {...obj};

	// 	obj1.appTypeId = encrypt(obj1.appTypeId);

	// 	return API.post(RENEW_LICENSE_SERVICE+UPDATE_APPLICATIONFORM1, obj);
	// }

	const getAllApplicationReviewList = () =>{
		return API.get(RENEW_LICENSE_SERVICE+GET_ALL_APPLICATION_REVIEW);
	}

	const getAllApplicationReviewByUserName = (userName) =>{
		return API.get(RENEW_LICENSE_SERVICE+GET_APPLICATION_REVIEW_BY_USERNAME,{
			params:{
				userName:encrypt(userName)
			}
		})
	}

	// const getApplicationFormById = (id) =>{

	// 	return API.get(RENEW_LICENSE_SERVICE+GET_APPLICATIONFORM_BY_ID1,{
	// 		params:{
	// 			id:encrypt(id)
	// 		}
	// 	})
	// }

	// const getApplicationFormByUsername = (userName) =>{

	// 	return API.get(RENEW_LICENSE_SERVICE+GET_APPLICATIONFORM_BY_USERNAME,{
	// 		params:{
	// 			userName:userName
	// 		}
	// 	})
	// }

	// const getApplicationForm2ByUsername = (userName) =>{

	// 	return API.get(RENEW_LICENSE_SERVICE+GET_APPLICATIONFORM2_BY_USERNAME,{
	// 		params:{
	// 			userName:userName
	// 		}
	// 	})
	// }

	// const getApplicationForm3ByUsername = (userName) =>{

	// 	return API.get(RENEW_LICENSE_SERVICE+GET_APPLICATIONFORM3_BY_USERNAME,{
	// 		params:{
	// 			userName:userName
	// 		}
	// 	})
	// }


	// const getApplicationForm4ByUsername = (userName) =>{

	// 	return API.get(RENEW_LICENSE_SERVICE+GET_APPLICATIONFORM4_BY_USERNAME,{
	// 		params:{
	// 			userName:userName
	// 		}
	// 	})
	// }

	// const getApplicationForm5ByUsername = (userName) =>{

	// 	return API.get(RENEW_LICENSE_SERVICE+GET_APPLICATIONFORM5_BY_USERNAME,{
	// 		params:{
	// 			userName:userName
	// 		}
	// 	})
	// }

	// const getApplicationDetailsFormByUsername = (userName) =>{

	// 	return API.get(RENEW_LICENSE_SERVICE+GET_APPLICATION_DETAILS_FORM_BY_USERNAME,{
	// 		params:{
	// 			userName:userName
	// 		}
	// 	})
	// }


	// const getApplicationForm6ByUsername = (userName) =>{

	// 	return API.get(RENEW_LICENSE_SERVICE+GET_APPLICATIONFORM6_BY_USERNAME,{
	// 		params:{
	// 			userName:userName
	// 		}
	// 	})
	// }

	// const deleteApplicationForm= (id) =>{
	// 	return API.get(RENEW_LICENSE_SERVICE+DELETE_APPLICATIONFORM_BY_ID,{
	// 		params:{
	// 			id:encrypt(id)
	// 		}
	// 	})
	// }

	// const viewFile = (id) =>{
	// 	return API.get(RENEW_LICENSE_SERVICE+VIEW_FILE,{
	// 		params:{
	// 			id:encrypt(id)
	// 		},
	// 		responseType: 'blob', 
	// 		...sconfig
	// 	})
	// }


export default{
    addFirmApplicationReview,
				addFirmApplicationReview,
                getAllApplicationReviewList,
				addGovernmentAgencyApplicationReveiw,
				addNewIndividualReview,
				getAllApplicationReviewByUserName,
            };
