import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

const ADMIN_SERVICE = "/admin-service";

//STATE APIs
    const ADD_NEW_STATE = "/add-new-state";
	const UPDATE_STATE = "/update-state";
	const GET_ALL_STATE = "/get-all-state";
	const GET_ALL_ACTIVE_STATE = "/get-all-active-state";
	const GET_ALL_INACTIVE_STATE = "/get-all-inactive-state";
	const DELETE_STATE_BY_ID = "/delete-state-by-id";
	const GET_STATE_BY_ID = "/get-state-by-id";
	const CHANGE_STATE_STATUS = "/change-state-status";

const addNewState = (objs)=>{
	let obj = {...objs};
	obj.countryId = encrypt(obj.countryId);
	//obj.stateId = encrypt(obj.stateId);
	return API.post(ADMIN_SERVICE+ADD_NEW_STATE, obj);
}

const updateState = (objs)=>{
	let obj = {...objs};
	//obj.stateId = encrypt(obj.stateId);
	obj.countryId = encrypt(obj.countryId);
	return API.post(ADMIN_SERVICE+UPDATE_STATE, obj);
}
const getAllStateList = () =>{
    return API.get(ADMIN_SERVICE+GET_ALL_STATE);
}

const changeStateStatus = (id) =>{
	return API.get(ADMIN_SERVICE+CHANGE_STATE_STATUS,{
		params:{
			id:encrypt(id)
		}
	})
}

const getStatebyId = (id) =>{
	return API.get(ADMIN_SERVICE+GET_STATE_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}


export default{
                addNewState,
                getAllStateList,
				changeStateStatus,
				getStatebyId,
				updateState,
            };
