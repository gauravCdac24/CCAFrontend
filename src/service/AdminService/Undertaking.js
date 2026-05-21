import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

const ADMIN_SERVICE = "/admin-service";

//Country APIs
    const ADD_NEW_UNDERTAKING = "/add-new-undertaking";
	const UPDATE_UNDERTAKING = "/update-undertaking";
	const GET_ALL_UNDERTAKING = "/get-all-undertaking";
	const GET_ALL_ACTIVE_UNDERTAKING = "/get-all-active-undertaking";
	const GET_ALL_INACTIVE_UNDERTAKING= "/get-all-inactive-undertaking";
	const DELETE_UNDERTAKING_BY_ID = "/delete-undertaking-by-id";
	const CHANGE_UNDERTAKING_STATUS = "/status-change";
	const GET_UNDERTAKING_BY_ID = "/get-undertaking-by-id";
   

	const sconfig={
		headers: {
			'Content-Type': 'application/octet-stream',
		},
	}
const addNewUndertaking = (obj)=>{
    obj.appTypeMasterId= encrypt( obj.appTypeMasterId);
	return API.post(ADMIN_SERVICE+ADD_NEW_UNDERTAKING, obj);
}


const updateUndertaking = (obj)=>{

	const obj1 = obj;

	
    obj.serviceId=encrypt( obj.serviceId);
   

	return API.post(ADMIN_SERVICE+UPDATE_UNDERTAKING, obj);
}

const getAllUndertakingList = () =>{
    return API.get(ADMIN_SERVICE+GET_ALL_UNDERTAKING);
}

const changeUndertakingStatus = (id) =>{
	return API.get(ADMIN_SERVICE+CHANGE_UNDERTAKING_STATUS,{
		params:{
			id:encrypt(id)
		}
	})
}

const getUndertakingById = (id) =>{

	return API.get(ADMIN_SERVICE+GET_UNDERTAKING_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}

const deleteUndertaking = (id) =>{
	return API.get(ADMIN_SERVICE+DELETE_UNDERTAKING_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}


export default{
                addNewUndertaking,
                getAllUndertakingList,
				changeUndertakingStatus,
				updateUndertaking,
				deleteUndertaking,
				getUndertakingById,
				
            };
