import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;
import  store  from '../../store';

	const ADMIN_SERVICE = "/admin-service";

    
	const ADD_INTENT = "/add-intent";
	const GET_ALL_INTENT = "/get-all-intent";
	const GET_INTENT_BY_ID = "/get-intent-by-id";
	const VERIFY_INTENT_DETAILS = "/verify-intent-details";
	const GET_BY_INTENT_UNIQUE_CODE = "/get-intent-by-unique-code";
	const GET_ALL_INTENT_LOGIN_DETAILS = "/get-all-intent-login-details";
	const CHANGE_INTENT_ACCOUNT_STATUS = "/change-intent-account-status";
	const GET_INTENT_BY_USERNAME="/get-intent-by-username";

const state = store.getState();
const username = state.jwtAuthentication.username;

const addNewIntent = (objs)=>{
	let obj = {...objs};
	obj.country = encrypt(obj.country);
    obj.state = encrypt(obj.state);
    obj.city = encrypt(obj.city);

	return API.post(ADMIN_SERVICE+ADD_INTENT, obj);
}

const getAllIntentList = () =>{
    return API.get(ADMIN_SERVICE+GET_ALL_INTENT);
}

const getAllIntentWithLoginDetails = () =>{
    return API.get(ADMIN_SERVICE+GET_ALL_INTENT_LOGIN_DETAILS);
}

const getIntentById = (id) =>{
	return API.get(ADMIN_SERVICE+GET_INTENT_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}
const getAllIntentByUniqueCode = (id) =>{
	return API.get(ADMIN_SERVICE+GET_BY_INTENT_UNIQUE_CODE,{
		params:{
			id:encrypt(id)
		}
	})
}

const verifyIntentById = (id) =>{
	return API.get(ADMIN_SERVICE+VERIFY_INTENT_DETAILS,{
		params:{
			id:encrypt(id),
			qid:encrypt(username)
		}
	})
}

const changeIntentAccountStatus = (id) => {
	return API.get(ADMIN_SERVICE+CHANGE_INTENT_ACCOUNT_STATUS,{
		params:{
			id:encrypt(id),
			qid:encrypt(username)
		}
	})
}

const getIntentByUserName = (userName) =>{
	return API.get(ADMIN_SERVICE+GET_INTENT_BY_USERNAME,{
		params:{
			userName:encrypt(userName)
		}
	})
}


export default{
    addNewIntent,
    getAllIntentList,
    getIntentById,
	getAllIntentByUniqueCode,
	verifyIntentById,
	changeIntentAccountStatus,
	getAllIntentWithLoginDetails,
	getIntentByUserName,
};
