import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

const ADMIN_SERVICE = "/admin-service";

//Country APIs
    const ADD_NEW_MINIMUM_ATTEMPT = "/add-minimum-attempts";
    
	const UPDATE_MINIMUM_ATTEMPT = "/update-minimum-attempts";
	const GET_ALL_MINIMUM_ATTEMPT = "/get-all-minimum-attempts";
	const GET_ALL_ACTIVE_MINIMUM_ATTEMPT= "/get-all-active-minimum-attempt";
	const GET_ALL_INACTIVE_MINIMUM_ATTEMPT = "/get-all-inactive-minimum-attempt";
	const DELETE_MINIMUM_ATTEMPT_BY_ID = "/delete-minimum-attempts-by-id";
    const GET_MINIMUM_ATTEMPT_BY_ID = "/get-minimum-attempts-by-id";
	const CHANGE_MINIMUM_ATTEMPT_STATUS = "/change-minimum-attempt-status";
    const GET_ALL_ACTIVE_MINIMUM_ATTEMPTS = "/get-all-active-minimum-attempt";
const addNewMinimumAttempt = (obj)=>{
	return API.post(ADMIN_SERVICE+ADD_NEW_MINIMUM_ATTEMPT, obj);
}

const getAllMinimumAttemptList = () =>{
    return API.get(ADMIN_SERVICE+GET_ALL_MINIMUM_ATTEMPT);
}

const getAllActiveMinimumAttemptList = () =>{
    return API.get(ADMIN_SERVICE+GET_ALL_ACTIVE_MINIMUM_ATTEMPTS);
}

const changeMinimumAttemptStatus = (id) =>{
	return API.get(ADMIN_SERVICE+CHANGE_MINIMUM_ATTEMPT_STATUS,{
		params:{
			id:encrypt(id)
		}
	})
}
const deleteMinimumAttempt = (id) =>{
	return API.get(ADMIN_SERVICE+DELETE_MINIMUM_ATTEMPT_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}

const updateMinimumAttempt = (obj)=>{

	const obj1 = {...obj};

	obj1.attemptId = encrypt(obj1.attemptId);

	return API.post(ADMIN_SERVICE+UPDATE_MINIMUM_ATTEMPT, obj);
}

const getMinimumAttemptById = (id) =>{
	return API.get(ADMIN_SERVICE+GET_MINIMUM_ATTEMPT_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}

export default{
                addNewMinimumAttempt,
                getAllMinimumAttemptList,
				changeMinimumAttemptStatus,
				deleteMinimumAttempt,
                getAllActiveMinimumAttemptList,
                getMinimumAttemptById,
                updateMinimumAttempt
            };
