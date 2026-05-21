import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

const RENEW_LICENSE_SERVICE = "/renew-license-service";

//Country APIs
    const ADD_NEW_GOVERNMENT_AGENCY_FORM = "/add-government-agency-application-form";
	const UPDATE_GOVERNMENT_AGENCY_FORM = "/update-government-agency-application-form";
	const GET_GOVERNMENT_AGENCY_BY_USERNAME = "/get-government-agency-application-form-by-username";
	const GET_ALL_ACTIVE_APPLICATION_TYPE = "/get-all-active-application-type";
	const GET_ALL_INACTIVE_APPLICATION_TYPE= "/get-all-inactive-application-type";
	const DELETE_APPLICATION_TYPE_BY_ID = "/delete-application-type-by-id";
	const CHANGE_APPLICATION_TYPE_STATUS = "/status-change";
	const GET_APPLICATION_TYPE_BY_ID = "/get-application-type-by-id";
   

	const sconfig={
		headers: {
			'Content-Type': 'application/octet-stream',
		},
	}
const addNewGovernmentAgency = (obj)=>{
	return API.post(RENEW_LICENSE_SERVICE+ADD_NEW_GOVERNMENT_AGENCY_FORM, obj);
}


const updateGovernmentAgency = (obj)=>{
	return API.post(RENEW_LICENSE_SERVICE+UPDATE_GOVERNMENT_AGENCY_FORM, obj);
}

const getAllGovernmentAgency = (userName) =>{
    return API.get(RENEW_LICENSE_SERVICE+GET_GOVERNMENT_AGENCY_BY_USERNAME,{
        params:{
            userName:userName
        }
        })
    
}

const changeApplicationTypeStatus = (id) =>{
	return API.get(RENEW_LICENSE_SERVICE+CHANGE_APPLICATION_TYPE_STATUS,{
		params:{
			id:encrypt(id)
		}
	})
}

const getApplicationTypeById = (id) =>{

	return API.get(RENEW_LICENSE_SERVICE+GET_APPLICATION_TYPE_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}

const deleteApplicationType = (id) =>{
	return API.get(RENEW_LICENSE_SERVICE+DELETE_APPLICATION_TYPE_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}


export default{
                addNewGovernmentAgency,
                getAllGovernmentAgency,
				changeApplicationTypeStatus,
				updateGovernmentAgency,
				deleteApplicationType,
				getApplicationTypeById,
				
            };
