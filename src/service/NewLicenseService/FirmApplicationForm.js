import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

const ADMIN_SERVICE = "/newlicense-service";

//Country APIs
    const ADD_NEW_FIRM_APPLICATION_FORM = "/add-firm-application-form";
	const UPDATE_FIRM_APPLICATION_FORM = "/update-firm-application-form";
	const GET_FIRM_APPLICATION_BY_USERNAME = "/get-firm-application-form-by-username";
    const ADD_NEW_FIRM_APPLICATION_FORM2 = "/add-firm-application-form-step-2";
	const UPDATE_FIRM_APPLICATION_FORM2 = "/update-firm-application-form-step-2";
	const GET_FIRM_APPLICATION_BY_USERNAME2 = "/get-firm-application-form-step-2-by-username";
	const ADD_NEW_FIRM_APPLICATION_FORM3 = "/add-firm-application-form-step-3";
	const UPDATE_FIRM_APPLICATION_FORM3 = "/update-firm-application-form-step-3";
	const GET_FIRM_APPLICATION_BY_USERNAME3 = "/get-firm-application-form-step-3-by-username";
	const GET_ALL_ACTIVE_APPLICATION_TYPE = "/get-all-active-application-type";
	const GET_ALL_INACTIVE_APPLICATION_TYPE= "/get-all-inactive-application-type";
	const DELETE_APPLICATION_TYPE_BY_ID = "/delete-application-type-by-id";
	const CHANGE_APPLICATION_TYPE_STATUS = "/status-change";
	const GET_APPLICATION_TYPE_BY_ID = "/get-application-type-by-id";
	const ADD_NEW_FIRM_APPLICATION_FORM4 = "/add-firm-application-form-step-4";
	const UPDATE_FIRM_APPLICATION_FORM4 = "/update-firm-application-form-step-4";
	const GET_FIRM_APPLICATION_BY_USERNAME4 = "/get-firm-application-form-step-4-by-username";

	const APPLICATION_FORM_GENERATE_FOR_COMPANY  = "/generate-company-application-form-pdf";

	const sconfig={
		headers: {
			'Content-Type': 'application/octet-stream',
		},
	}
const addNewFirmApplication = (obj)=>{
	return API.post(ADMIN_SERVICE+ADD_NEW_FIRM_APPLICATION_FORM, obj);
}


const updateFirmApplication = (obj)=>{
	return API.post(ADMIN_SERVICE+UPDATE_FIRM_APPLICATION_FORM, obj);
}

const getAllFirmApplication = (userName) =>{
    return API.get(ADMIN_SERVICE+GET_FIRM_APPLICATION_BY_USERNAME,{
        params:{
            userName:userName
        }
        })
    
}

const addNewFirmApplication4 = (obj)=>{
	return API.post(ADMIN_SERVICE+ADD_NEW_FIRM_APPLICATION_FORM4, obj);
}


const updateFirmApplication4 = (obj)=>{
	return API.post(ADMIN_SERVICE+UPDATE_FIRM_APPLICATION_FORM4, obj);
}

const getAllFirmApplication4 = (userName) =>{
    return API.get(ADMIN_SERVICE+GET_FIRM_APPLICATION_BY_USERNAME4,{
        params:{
            userName:userName
        }
        })
    
}

const addNewFirmApplication2 = (obj)=>{
	return API.post(ADMIN_SERVICE+ADD_NEW_FIRM_APPLICATION_FORM2, obj);
}


const updateFirmApplication2 = (obj)=>{
	return API.post(ADMIN_SERVICE+UPDATE_FIRM_APPLICATION_FORM2, obj);
}

const getAllFirmApplication2 = (userName) =>{
    return API.get(ADMIN_SERVICE+GET_FIRM_APPLICATION_BY_USERNAME2,{
        params:{
            userName:userName
        }
        })
    
}

const addNewFirmApplication3 = (obj)=>{
	return API.post(ADMIN_SERVICE+ADD_NEW_FIRM_APPLICATION_FORM3, obj);
}


const updateFirmApplication3 = (obj)=>{
	return API.post(ADMIN_SERVICE+UPDATE_FIRM_APPLICATION_FORM3, obj);
}

const getAllFirmApplication3 = (userName) =>{
    return API.get(ADMIN_SERVICE+GET_FIRM_APPLICATION_BY_USERNAME3,{
        params:{
            userName:userName
        }
        })
    
}

const changeApplicationTypeStatus = (id) =>{
	return API.get(ADMIN_SERVICE+CHANGE_APPLICATION_TYPE_STATUS,{
		params:{
			id:encrypt(id)
		}
	})
}

const getApplicationTypeById = (id) =>{

	return API.get(ADMIN_SERVICE+GET_APPLICATION_TYPE_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}

const deleteApplicationType = (id) =>{
	return API.get(ADMIN_SERVICE+DELETE_APPLICATION_TYPE_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}

const generatePdf = (intentId) =>{
	return API.get(ADMIN_SERVICE+APPLICATION_FORM_GENERATE_FOR_COMPANY,{
		params:{
			intentId:intentId
		},
		responseType: 'blob', 
		...sconfig
	})
}


export default{
                addNewFirmApplication,
                getAllFirmApplication,
				changeApplicationTypeStatus,
				updateFirmApplication,
				deleteApplicationType,
				getApplicationTypeById,
				addNewFirmApplication2,
                getAllFirmApplication2,
                updateFirmApplication2,
				addNewFirmApplication3,
                getAllFirmApplication3,
                updateFirmApplication3,
				addNewFirmApplication4,
                getAllFirmApplication4,
                updateFirmApplication4,
				generatePdf,
            };
