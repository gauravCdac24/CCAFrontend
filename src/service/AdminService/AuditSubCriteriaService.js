import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

    const ADMIN_SERVICE = "/admin-service";

    const ADD_AUDIT_SUB_CRITERIA = "/add-audit-sub-criteria";
	const UPDATE_AUDIT_SUB_CRITERIA = "/update-audit-sub-criteria";
	const GET_ALL_AUDIT_SUB_CRITERIA = "/get-all-audit-sub-criteria";
	const GET_AUDIT_SUB_CRITERIA_BY_ID = "/get-audit-sub-criteria-by-id";
	const GET_AUDIT_SUB_CRITERIA_BY_AUDIT_CRITERIA_ID = "/get-audit-sub-criteria-by-audit-criteria-id";
	const CHANGE_AUDIT_SUB_CRITERIA_STATUS = "/change-audit-sub-criteria-status";
	const DELETE_AUDIT_SUB_CRITERIA_BY_ID = "/delete-audit-sub-criteria-by-id";
	const GET_ENABLED_AUDIT_SUB_CRITERIA_FOR_AUDITOR = "/get-enabled-audit-sub-criteria-for-auditor";

const addNewAuditSubCriteria = (objs)=>{
	let obj = {...objs};
    obj.auditCriteriaId = encrypt(obj.auditCriteriaId);
	return API.post(ADMIN_SERVICE+ADD_AUDIT_SUB_CRITERIA, obj);
}

const updateAuditSubCriteria = (objs)=>{
	let obj = {...objs};
    obj.auditSubCriteriaId = encrypt(obj.auditSubCriteriaId);
	obj.auditCriteriaId = encrypt(obj.auditCriteriaId);
	
	return API.post(ADMIN_SERVICE+UPDATE_AUDIT_SUB_CRITERIA, obj);

}

const getAllAuditSubCriteriaList = () =>{
    return API.get(ADMIN_SERVICE+GET_ALL_AUDIT_SUB_CRITERIA);
}

const changeAuditSubCriteriaStatus = (id) =>{
	return API.get(ADMIN_SERVICE+CHANGE_AUDIT_SUB_CRITERIA_STATUS,{
		params:{
			id:encrypt(id)
		}
	})
}

const getAuditSubCriteriaById = (id) =>{

	return API.get(ADMIN_SERVICE+GET_AUDIT_SUB_CRITERIA_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}

const getAuditSubCriteriaByAuditCriteriaId = (id) =>{

	return API.get(ADMIN_SERVICE+GET_AUDIT_SUB_CRITERIA_BY_AUDIT_CRITERIA_ID,{
		params:{
			id:encrypt(id)
		}
	})
}

const deleteAuditSubCriteria = (id) =>{
	return API.get(ADMIN_SERVICE+DELETE_AUDIT_SUB_CRITERIA_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}

const getEnabledForAuditor = () => {
	return API.get(ADMIN_SERVICE + GET_ENABLED_AUDIT_SUB_CRITERIA_FOR_AUDITOR);
}


export default{
    addNewAuditSubCriteria,
    updateAuditSubCriteria,
    getAllAuditSubCriteriaList,
    getAuditSubCriteriaById,
    getAuditSubCriteriaByAuditCriteriaId,
    deleteAuditSubCriteria,
	changeAuditSubCriteriaStatus,
	getEnabledForAuditor,
};
