import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;
import  store  from '../../store';

const NOTIFICATION_SERVICE_BASE_URL = "/notification-service";
const GET_NOTIFICATION_BY_USERNAME_AND_ROLE = "/get-notification-by-username-role";
const READ_NOTIFICATION_BY_USERNAME_AND_ROLE = "/read-notification-by-username-role";
const READ_NOTIFICATION_BY_ID = "/read-notification-by-id";

const getAuth = () => {
	const state = store.getState();
	return state.jwtAuthentication;
  };


const getNotificationByUsernameAndRole = () =>{

  	const auth = getAuth();
	const username = auth.username;
	const role = auth.currentRole;

	return API.get(NOTIFICATION_SERVICE_BASE_URL+GET_NOTIFICATION_BY_USERNAME_AND_ROLE,{
		params:{
			id: encrypt(username),
			pid: encrypt(role)
		}
	})
}

const readNotificationByUsernameAndRole = () =>{

	const auth = getAuth();
	const username = auth.username;
	const role = auth.currentRole;



	return API.get(NOTIFICATION_SERVICE_BASE_URL+READ_NOTIFICATION_BY_USERNAME_AND_ROLE,{
		params:{
			id:encrypt(username),
			pid: encrypt(role)
		}
	})
}


const readNotificationById = (id) =>{
	return API.get(NOTIFICATION_SERVICE_BASE_URL+READ_NOTIFICATION_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}



export default{
	getNotificationByUsernameAndRole,
	readNotificationByUsernameAndRole,
	readNotificationById
};
