import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

const ADMIN_SERVICE = "/admin-service";

//Country APIs
    const ADD_NEW_APPLICATION_TYPE = "/add-application-type";
	const UPDATE_APPLICATION_TYPE = "/update-application-type";
	const GET_ALL_APPLICATION_TYPE = "/get-all-application-types";
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
const addNewApplicationType = (obj)=>{
	return API.post(ADMIN_SERVICE+ADD_NEW_APPLICATION_TYPE, obj);
}


const updateApplicationType = (obj)=>{

	const obj1 = obj;

	obj.appTypeMasterId = encrypt(obj.appTypeMasterId);
   

	return API.post(ADMIN_SERVICE+UPDATE_APPLICATION_TYPE, obj);
}

const getAllApplicationTypeList = () =>{
    return API.get(ADMIN_SERVICE+GET_ALL_APPLICATION_TYPE);
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
                addNewApplicationType,
                getAllApplicationTypeList,
				changeApplicationTypeStatus,
				updateApplicationType,
				deleteApplicationType,
				getApplicationTypeById,
				
            };
