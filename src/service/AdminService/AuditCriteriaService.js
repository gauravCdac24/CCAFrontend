import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

    const ADMIN_SERVICE = "/admin-service";

    const ADD_AUDIT_CRITERIA = "/add-audit-criteria";
	const UPDATE_AUDIT_CRITERIA = "/update-audit-criteria";
	const GET_ALL_AUDIT_CRITERIA = "/get-all-audit-criteria";
	const GET_AUDIT_CRITERIA_BY_ID = "/get-audit-criteria-by-id";
    const CHANGE_AUDIT_CRITERIA_STATUS = "/change-audit-criteria-status";
    const DELETE_AUDIT_CRITERIA_BY_ID = "/delete-audit-criteria-by-id";

const addNewAuditCriteria = (obj)=>{
	return API.post(ADMIN_SERVICE+ADD_AUDIT_CRITERIA, obj);
}

const updateAuditCriteria = (obj)=>{
	const obj1 = {...obj};
	obj1.auditCriteriaId = encrypt(obj1.auditCriteriaId);
	return API.post(ADMIN_SERVICE+UPDATE_AUDIT_CRITERIA, obj1);

}

const getAllAuditCriteriaList = () =>{
    return API.get(ADMIN_SERVICE+GET_ALL_AUDIT_CRITERIA);
}

const changeAuditCriteriaStatus = (id) =>{
	return API.get(ADMIN_SERVICE+CHANGE_AUDIT_CRITERIA_STATUS,{
		params:{
			id:encrypt(id)
		}
	})
}

const getAuditCriteriaById = (id) =>{

	return API.get(ADMIN_SERVICE+GET_AUDIT_CRITERIA_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}

const deleteAuditCriteria = (id) =>{
	return API.get(ADMIN_SERVICE+DELETE_AUDIT_CRITERIA_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}


export default{
    addNewAuditCriteria,
    updateAuditCriteria,
    getAllAuditCriteriaList,
    getAuditCriteriaById,
    deleteAuditCriteria,
    changeAuditCriteriaStatus
};
