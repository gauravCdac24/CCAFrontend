import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

    const ADMIN_SERVICE = "/admin-service";

    const ADD_AUDIT_PARAMETER = "/add-audit-parameter";
	const UPDATE_AUDIT_PARAMETER = "/update-audit-parameter";
	const GET_ALL_AUDIT_PARAMETER = "/get-all-audit-parameter";
	const GET_AUDIT_PARAMETER_BY_ID = "/get-audit-parameter-by-id";
	const GET_AUDIT_PARAMETER_BY_AUDIT_sub_CRITERIA_ID = "/get-audit-parameter-by-audit-sub-criteria-id";
	const CHANGE_AUDIT_PARAMETER_STATUS = "/change-audit-parameter-status";
	const DELETE_AUDIT_PARAMETER_BY_ID = "/delete-audit-parameter-by-id";

const addNewAuditParameter = (objs)=>{
	let obj = {...objs};
    obj.auditSubCriteriaId = encrypt(obj.auditSubCriteriaId);
	return API.post(ADMIN_SERVICE+ADD_AUDIT_PARAMETER, obj);
}

const updateAuditParameter = (objs)=>{
	let obj = {...objs};
    obj.auditParameterId = encrypt(obj.auditParameterId);
	obj.auditSubCriteriaId = encrypt(obj.auditSubCriteriaId);
	
	return API.post(ADMIN_SERVICE+UPDATE_AUDIT_PARAMETER, obj);

}

const getAllAuditParameterList = () =>{
    return API.get(ADMIN_SERVICE+GET_ALL_AUDIT_PARAMETER);
}

const changeAuditParameterStatus = (id) =>{
	return API.get(ADMIN_SERVICE+CHANGE_AUDIT_PARAMETER_STATUS,{
		params:{
			id:encrypt(id)
		}
	})
}

const getAuditParameterById = (id) =>{

	return API.get(ADMIN_SERVICE+GET_AUDIT_PARAMETER_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}

const getAuditParameterByAuditCriteriaId = (id) =>{

	return API.get(ADMIN_SERVICE+GET_AUDIT_PARAMETER_BY_AUDIT_sub_CRITERIA_ID,{
		params:{
			id:encrypt(id)
		}
	})
}

const deleteAuditParameter = (id) =>{
	return API.get(ADMIN_SERVICE+DELETE_AUDIT_PARAMETER_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}


export default{
    addNewAuditParameter,
    updateAuditParameter,
    getAllAuditParameterList,
    getAuditParameterById,
    getAuditParameterByAuditCriteriaId,
    deleteAuditParameter,
	changeAuditParameterStatus
};
