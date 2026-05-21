import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

const ADMIN_SERVICE = "/admin-service";

//Country APIs
    const ADD_NEW_USER = "/add-new-user";
	const UPDATE_USER = "/update-user";
	const GET_ALL_USER = "/get-all-user";
	const GET_ALL_ACTIVE_USER = "/get-all-active-user";
	const GET_ALL_INACTIVE_USER= "/get-all-inactive-user";
	const DELETE_USER_BY_ID = "/delete-user-by-id";
	const CHANGE_USER_STATUS = "/change-user-status";
	const GET_USER_BY_ID = "/get-user-by-id";

const addNewUser = (obj)=>{
	return API.post(ADMIN_SERVICE+ADD_NEW_USER, obj);
}

const updateUser = (obj)=>{

	const obj1 = {...obj};

	obj1.countryId = encrypt(obj1.countryId);

	return API.post(ADMIN_SERVICE+UPDATE_USER, obj);
}

const getAllUserList = () =>{
    return API.get(ADMIN_SERVICE+GET_ALL_USER);
}

const changeUserStatus = (id) =>{
	return API.get(ADMIN_SERVICE+CHANGE_USER_STATUS,{
		params:{
			id:encrypt(id)
		}
	})
}

const getUserById = (id) =>{

	return API.get(ADMIN_SERVICE+GET_USER_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}

const deleteUser = (id) =>{
	return API.get(ADMIN_SERVICE+DELETE_USER_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}


export default{
                addNewUser,
                getAllUserList,
				changeUserStatus,
				updateUser,
				deleteUser,
				getUserById
            };
