    import API from '../../api/ApplicationAPI';
    import {encrypt} from "../../components/global/util/EncryptDecrypt" ;
    
        const ADMIN_SERVICE = "/admin-service";
    
        const ADD_AUDIT_CONTORL_TYPE = "/add-audit-control-type";
        const UPDATE_AUDIT_CONTORL_TYPE = "/update-audit-control-type";
        const GET_ALL_AUDIT_CONTORL_TYPE = "/get-all-audit-control-type";
        const GET_AUDIT_CONTORL_TYPE_BY_ID = "/get-audit-control-type-by-id";
        const CHANGE_AUDIT_CONTORL_TYPE_STATUS = "/change-audit-control-type-status";
        const DELETE_AUDIT_CONTORL_TYPE_BY_ID = "/delete-audit-control-type-by-id";
        
    const addNewAuditControlType = (obj)=>{
        return API.post(ADMIN_SERVICE+ADD_AUDIT_CONTORL_TYPE, obj);
    }
    
    const updateAuditControlType = (obj)=>{
        
        const obj1 = {...obj};
        obj1.auditControlTypeId = encrypt(obj1.auditControlTypeId);
        return API.post(ADMIN_SERVICE+UPDATE_AUDIT_CONTORL_TYPE, obj1);
    
    }
    
    const getAllAuditControlTypeList = () =>{
        return API.get(ADMIN_SERVICE+GET_ALL_AUDIT_CONTORL_TYPE);
    }
    
    const changeAuditControlTypeStatus = (id) =>{
        return API.get(ADMIN_SERVICE+CHANGE_AUDIT_CONTORL_TYPE_STATUS,{
            params:{
                id:encrypt(id)
            }
        })
    }
    
    const getAuditControlTypeById = (id) =>{
    
        return API.get(ADMIN_SERVICE+GET_AUDIT_CONTORL_TYPE_BY_ID,{
            params:{
                id:encrypt(id)
            }
        })
    }
    
    const deleteAuditControlType = (id) =>{
        return API.get(ADMIN_SERVICE+DELETE_AUDIT_CONTORL_TYPE_BY_ID,{
            params:{
                id:encrypt(id)
            }
        })
    }
    
    
    export default{
        addNewAuditControlType,
        updateAuditControlType,
        getAllAuditControlTypeList,
        getAuditControlTypeById,
        deleteAuditControlType,
        changeAuditControlTypeStatus
    };
    