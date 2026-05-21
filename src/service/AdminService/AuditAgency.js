import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;
import store from '../../store';

const ADMIN_SERVICE = "/admin-service";

//Country APIs
    const ADD_NEW_AUDIT_AGENCY = "/add-audit-agency";
	const UPDATE_AUDIT_AGENCY = "/update-audit-agency";
	const GET_ALL_AUDIT_AGENCY = "/get-all-audit-agency";
	const GET_ALL_ACTIVE_AUDIT_AGENCY = "/get-all-active-audit-agency";
	const GET_ALL_INACTIVE_AUDIT_AGENCY = "/get-all-inactive-audit-agency";
	const DELETE_AUDIT_AGENCY_BY_ID = "/delete-audit-agency-by-id";
	const CHANGE_AUDIT_AGENCY_STATUS = "/status-change";
	const GET_AUDIT_AGENCY_BY_ID = "/get-audit-agency-by-id";
    const DOWNLOAD_FILE="/download-file";
    const VERIFY_NEW_AUDIT_AGENCY="/create-new-user-by-audit-agency";
	const USER_STATUS_CHANGE="/change-audit-agency-user-status-by-id";
const ALL_USER="/get-all-users";

	const sconfig={
		headers: {
			'Content-Type': 'application/octet-stream',
		},
	}

	const state = store.getState();
const username = state.jwtAuthentication.username;

const addNewAuditAgency = (objs)=>{
	let obj = {...objs};
	obj.country = encrypt(obj.country);
    obj.state = encrypt(obj.state);
    obj.city = encrypt(obj.city);
	return API.post(ADMIN_SERVICE+ADD_NEW_AUDIT_AGENCY, obj);
}
const createNewUser = (obj)=>{
	
	return API.post(ADMIN_SERVICE+VERIFY_NEW_AUDIT_AGENCY, obj);
}

const changeUserStatus = (id) =>{
	return API.get(ADMIN_SERVICE+USER_STATUS_CHANGE,{
		params:{
			id:encrypt(id)
		}
	})
}
const updateAuditAgency = (objs)=>{

	let obj = {...objs};

	obj.country = encrypt(obj.country);
    obj.state = encrypt(obj.state);
    obj.city = encrypt(obj.city);

	return API.post(ADMIN_SERVICE+UPDATE_AUDIT_AGENCY, obj);
}

const getAllAuditAgencyList = () =>{
    return API.get(ADMIN_SERVICE+GET_ALL_AUDIT_AGENCY);
}
const getAuditAgencyList = () =>{
    return API.get(ADMIN_SERVICE+ALL_USER);
}

const changeAuditAgencyStatus = (id) =>{
	return API.get(ADMIN_SERVICE+CHANGE_AUDIT_AGENCY_STATUS,{
		params:{
			id:encrypt(id),
			qid:encrypt(username)
		}
	})
}
const downloadFile = ()=>{
	return API.get(ADMIN_SERVICE+DOWNLOAD_FILE, {
		  responseType: 'blob', 
        ...sconfig
	});
}

const getAuditAgencyById = (id) =>{

	return API.get(ADMIN_SERVICE+GET_AUDIT_AGENCY_BY_ID,{
		params:{
			id:encrypt(id),
			qid:encrypt(username)
		}
	})
}

const deleteAuditAgency = (id) =>{
	return API.get(ADMIN_SERVICE+DELETE_AUDIT_AGENCY_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}


export default{
                addNewAuditAgency,
                getAllAuditAgencyList,
				changeAuditAgencyStatus,
				updateAuditAgency,
				deleteAuditAgency,
				getAuditAgencyById,
				downloadFile,
				createNewUser,
				changeUserStatus,
				getAuditAgencyList,
            };
