import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

const ADMIN_SERVICE = "/newlicense-service";

//Country APIs
    const GET_ALL_NEW_APPLICATION = "/get-all-application-in-review";
	const UPDATE_GOVERNMENT_AGENCY_FORM = "/update-government-agency-application-form";
	const GET_GOVERNMENT_AGENCY_BY_USERNAME = "/get-government-agency-application-form-by-username";
	const GET_ALL_ACTIVE_APPLICATION_TYPE = "/get-all-active-application-type";
	const GET_ALL_INACTIVE_APPLICATION_TYPE= "/get-all-inactive-application-type";
	const DELETE_APPLICATION_TYPE_BY_ID = "/delete-application-type-by-id";
	const CHANGE_APPLICATION_TYPE_STATUS = "/status-change";
	const GET_APPLICATION_TYPE_BY_ID = "/get-application-type-by-id";
   const GET_ALL_NEW_APPLICATIONS_IN_REVIEW_BY_CCA="/get-all-application-in-review-by-cca";

	const sconfig={
		headers: {
			'Content-Type': 'application/octet-stream',
		},
	}
const getAllNewApplication = ()=>{
	return API.get(ADMIN_SERVICE+GET_ALL_NEW_APPLICATION);
}

const getAllNewApplications = ()=>{
	return API.get(ADMIN_SERVICE+GET_ALL_NEW_APPLICATIONS_IN_REVIEW_BY_CCA);
}

const updateGovernmentAgency = (obj)=>{
	return API.post(ADMIN_SERVICE+UPDATE_GOVERNMENT_AGENCY_FORM, obj);
}

const getAllGovernmentAgency = (userName) =>{
    return API.get(ADMIN_SERVICE+GET_GOVERNMENT_AGENCY_BY_USERNAME,{
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


export default{
                getAllNewApplication,
                getAllGovernmentAgency,
				changeApplicationTypeStatus,
				updateGovernmentAgency,
				deleteApplicationType,
				getApplicationTypeById,
				getAllNewApplications,
				
            };
