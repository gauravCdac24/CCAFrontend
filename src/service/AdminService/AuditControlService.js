import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;
import store from '../../store';

    const ADMIN_SERVICE = "/admin-service";

    const ADD_AUDIT_CONTROL = "/add-audit-control";
	const UPDATE_AUDIT_CONTROL = "/update-audit-control";
	const GET_ALL_AUDIT_CONTROL = "/get-all-audit-control";
	const GET_AUDIT_CONTROL_BY_ID = "/get-audit-control-by-id";
	const CHANGE_AUDIT_CONTROL_STATUS = "/change-audit-control-status";
	const DELETE_AUDIT_CONTROL_BY_ID = "/delete-audit-control-by-id";
const DATA="/data";
const NC_DATA="/nc-data";

const auth = () => {
    const state = store.getState();
    return state.jwtAuthentication;
  }

const addNewAuditControl = (objs)=>{
	let obj = {...objs};
    obj.auditParameterId = encrypt(obj.auditParameterId);
    obj.auditCheckId = encrypt(obj.auditCheckId);
    obj.auditControlTypeId = encrypt(obj.auditControlTypeId);

	return API.post(ADMIN_SERVICE+ADD_AUDIT_CONTROL, obj);
}

const updateAuditControl = (objs)=>{
	let obj = {...objs};
    obj.auditControlId = encrypt(obj.auditControlId);
	obj.auditParameterId = encrypt(obj.auditParameterId);
    obj.auditCheckId = encrypt(obj.auditCheckId);
    obj.auditControlTypeId = encrypt(obj.auditControlTypeId);
	
	return API.post(ADMIN_SERVICE+UPDATE_AUDIT_CONTROL, obj);

}

const getAllAuditControlList = () =>{
    return API.get(ADMIN_SERVICE+GET_ALL_AUDIT_CONTROL);
}

const data = (ApplicantUserName) =>{
	//const username = auth().username;
    return API.get(ADMIN_SERVICE+DATA,
		{
			params: {
				userName: ApplicantUserName
				}
		}
	);
}

const changeAuditControlStatus = (id) =>{
	return API.get(ADMIN_SERVICE+CHANGE_AUDIT_CONTROL_STATUS,{
		params:{
			id:encrypt(id)
		}
	})
}

const getAuditControlById = (id) =>{

	return API.get(ADMIN_SERVICE+GET_AUDIT_CONTROL_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}

const deleteAuditControl = (id) =>{
	return API.get(ADMIN_SERVICE+DELETE_AUDIT_CONTROL_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}

const NCData = (ApplicantUserName) =>{
	
    return API.get(ADMIN_SERVICE+NC_DATA,
		{
			params: {
				userName: ApplicantUserName
				}
		}
	);
}


export default{
    addNewAuditControl,
    updateAuditControl,
    getAllAuditControlList,
    getAuditControlById,
    deleteAuditControl,
	changeAuditControlStatus,
	data,
	NCData,
};
