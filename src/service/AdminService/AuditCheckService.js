import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

    const ADMIN_SERVICE = "/admin-service";

    const ADD_AUDIT_CHECK = "/add-audit-check";
    const UPDATE_AUDIT_CHECK = "/update-audit-check";
    const GET_ALL_AUDIT_CHECK = "/get-all-audit-check";
    const GET_AUDIT_CHECK_BY_ID = "/get-audit-check-by-id";
    const CHANGE_AUDIT_CHECK_STATUS = "/change-audit-check-status";
    const DELETE_AUDIT_CHECK_BY_ID = "/delete-audit-check-by-id";
    
const addNewAuditCheck = (obj)=>{
    return API.post(ADMIN_SERVICE+ADD_AUDIT_CHECK, obj);
}

const updateAuditCheck = (obj)=>{
    let obj1 = {...obj};
    obj1.auditCheckId = encrypt(obj.auditCheckId);
    return API.post(ADMIN_SERVICE+UPDATE_AUDIT_CHECK, obj1);

}

const getAllAuditCheckList = () =>{
    return API.get(ADMIN_SERVICE+GET_ALL_AUDIT_CHECK);
}

const changeAuditCheckStatus = (id) =>{
    return API.get(ADMIN_SERVICE+CHANGE_AUDIT_CHECK_STATUS,{
        params:{
            id:encrypt(id)
        }
    })
}

const getAuditCheckById = (id) =>{

    return API.get(ADMIN_SERVICE+GET_AUDIT_CHECK_BY_ID,{
        params:{
            id:encrypt(id)
        }
    })
}

const deleteAuditCheck = (id) =>{
    return API.get(ADMIN_SERVICE+DELETE_AUDIT_CHECK_BY_ID,{
        params:{
            id:encrypt(id)
        }
    })
}


export default{
    addNewAuditCheck,
    updateAuditCheck,
    getAllAuditCheckList,
    getAuditCheckById,
    deleteAuditCheck,
    changeAuditCheckStatus
};
