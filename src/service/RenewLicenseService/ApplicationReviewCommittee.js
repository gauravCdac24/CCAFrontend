import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

const RENEW_LICENSE_SERVICE = "/renew-license-service";
const NEW_LICENSE_SERVICE = "/newlicense-service";
const GET_ALL_AUDIT_APPLICATIONS = "/get-all-data";

//Country APIs
    const GET_ALL_NEW_APPLICATION = "/get-all-application-in-review";
	const UPDATE_GOVERNMENT_AGENCY_FORM = "/update-government-agency-application-form";
	const GET_GOVERNMENT_AGENCY_BY_USERNAME = "/get-government-agency-application-form-by-username";
	const GET_ALL_ACTIVE_APPLICATION_TYPE = "/get-all-active-application-type";
	const GET_ALL_INACTIVE_APPLICATION_TYPE= "/get-all-inactive-application-type";
	const DELETE_APPLICATION_TYPE_BY_ID = "/delete-application-type-by-id";
	const CHANGE_APPLICATION_TYPE_STATUS = "/status-change";
	const GET_APPLICATION_TYPE_BY_ID = "/get-application-type-by-id";
   const GET_ALL_APPLICATION_FOR_AUDITOR="/get-all-application-by-auditor"
    const GET_ALL_APPLICATION ="/get-all-data";

	const sconfig={
		headers: {
			'Content-Type': 'application/octet-stream',
		},
	}
const getAllNewApplication = ()=>{
	return API.get(RENEW_LICENSE_SERVICE+GET_ALL_NEW_APPLICATION);
}

const getAllApplicationForAuditor = async (userName) => {
	try {
		const newLicenseResponse = await API.get(
			NEW_LICENSE_SERVICE + GET_ALL_APPLICATION_FOR_AUDITOR,
			{ params: { userName } }
		);
		if (Array.isArray(newLicenseResponse?.data) && newLicenseResponse.data.length > 0) {
			return newLicenseResponse;
		}
	} catch (err) {
		console.warn('newlicense-service auditor list failed, trying renew-license-service', err);
	}

	return API.get(RENEW_LICENSE_SERVICE + GET_ALL_APPLICATION_FOR_AUDITOR, {
		params: { userName },
	});
};

const getAllApplication = async () => {
	try {
		const newLicenseResponse = await API.get(
			NEW_LICENSE_SERVICE + GET_ALL_AUDIT_APPLICATIONS
		);
		if (Array.isArray(newLicenseResponse?.data) && newLicenseResponse.data.length > 0) {
			return newLicenseResponse;
		}
	} catch (err) {
		console.warn("newlicense-service audit application list failed, trying renew-license-service", err);
	}

	return API.get(RENEW_LICENSE_SERVICE + GET_ALL_APPLICATION);
};



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
                getAllNewApplication,
                getAllGovernmentAgency,
				changeApplicationTypeStatus,
				updateGovernmentAgency,
				deleteApplicationType,
				getApplicationTypeById,
				getAllApplicationForAuditor,
				getAllApplication,
				
            };
