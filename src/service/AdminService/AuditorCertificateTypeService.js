import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

    const ADMIN_SERVICE = "/admin-service";

    const ADD_AUDITOR_CERTIFICATE_TYPE = "/add-auditor-certificate-type";
	const UPDATE_AUDITOR_CERTIFICATE_TYPE = "/update-auditor-certificate-type";
	const GET_ALL_AUDITOR_CERTIFICATE_TYPE = "/get-all-auditor-certificate-type";
	const GET_AUDITOR_CERTIFICATE_TYPE_BY_ID = "/get-auditor-certificate-type-by-id";
    const CHANGE_AUDITOR_CERTIFICATE_TYPE_STATUS = "/change-auditor-certificate-type-status";
    const DELETE_AUDITOR_CERTIFICATE_TYPE_BY_ID = "/delete-auditor-certificate-type-by-id";

const addNewAuditorCertificateType = (obj)=>{
	return API.post(ADMIN_SERVICE+ADD_AUDITOR_CERTIFICATE_TYPE, obj);
}

const updateAuditorCertificateType = (obj)=>{
	const obj1 = {...obj};
	obj1.auditorCertificateTypeId = encrypt(obj1.auditorCertificateTypeId);
	return API.post(ADMIN_SERVICE+UPDATE_AUDITOR_CERTIFICATE_TYPE, obj1);

}

const getAllAuditorCertificateTypeList = () =>{
    return API.get(ADMIN_SERVICE+GET_ALL_AUDITOR_CERTIFICATE_TYPE);
}

const changeAuditorCertificateTypeStatus = (id) =>{
	return API.get(ADMIN_SERVICE+CHANGE_AUDITOR_CERTIFICATE_TYPE_STATUS,{
		params:{
			id:encrypt(id)
		}
	})
}

const getAuditorCertificateTypeById = (id) =>{

	return API.get(ADMIN_SERVICE+GET_AUDITOR_CERTIFICATE_TYPE_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}

const deleteAuditorCertificateType = (id) =>{
	return API.get(ADMIN_SERVICE+DELETE_AUDITOR_CERTIFICATE_TYPE_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}


export default{
    addNewAuditorCertificateType,
    updateAuditorCertificateType,
    getAllAuditorCertificateTypeList,
    getAuditorCertificateTypeById,
    deleteAuditorCertificateType,
    changeAuditorCertificateTypeStatus
};
