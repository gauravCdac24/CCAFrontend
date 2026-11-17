import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;


const ADMIN_SERVICE = "/admin-service";
const ADD_NEW_CSRDOC = "/add-csr-document";
const UPDATE_CSRDOC = "/update-csr-document";
const GET_ALL_CSRDOC = "/get-all-csr-document";
const GET_ALL_ACTIVE_CSRDOC = "/get-all-active-csrDoc";
const GET_ALL_INACTIVE_CSRDOC = "/get-all-inactive-csrDoc";
const DELETE_CSRDOC_BY_ID = "/delete-csr-document-by-id";
const CHANGE_CSRDOC_STATUS = "/change-csrDoc-status";
const DOWNLOAD_FILE = "/download-csr-files";
const GET_CSRDOC_BY_ID = "/get-csr-document-by-id";

const sconfig={
    headers: {
        'Content-Type': 'application/octet-stream',
    },
}

const encryptIdParam = (id) => encrypt(String(id));

const addNewCsrDoc = (obj)=>{
	return API.post(ADMIN_SERVICE+ADD_NEW_CSRDOC, obj);
}

const updateCsrDoc = (obj)=>{
	return API.post(ADMIN_SERVICE+UPDATE_CSRDOC, obj);
}

const deleteCsrDoc = (id) => {
	return API.get(ADMIN_SERVICE + DELETE_CSRDOC_BY_ID, {
		params: {
			id: encryptIdParam(id),
		},
	});
}

const downloadFile = (id, activeOnly = false)=>{
	return API.get(ADMIN_SERVICE+DOWNLOAD_FILE, {
		params:{
			id: encryptIdParam(id),
			activeOnly: activeOnly ? true : undefined,
		},  responseType: 'blob', 
        ...sconfig
	});
}

const getAllCsrDocList = () =>{
    return API.get(ADMIN_SERVICE+GET_ALL_CSRDOC);
}

const getAllActiveCsrDocList = () =>{
    return API.get(ADMIN_SERVICE+GET_ALL_ACTIVE_CSRDOC);
}

const changeCsrDocStatus = (id) =>{
	return API.get(ADMIN_SERVICE+CHANGE_CSRDOC_STATUS,{
		params:{
			id: encryptIdParam(id)
		}
	})
}
const getCSRDocById = (id) =>{
	return API.get(ADMIN_SERVICE+GET_CSRDOC_BY_ID,{
		params:{
			id: encryptIdParam(id)
		}
	})
}

const downloadActiveTemplate = async () => {
    const listResponse = await getAllActiveCsrDocList();
    const templates = Array.isArray(listResponse.data) ? listResponse.data : [];
    const active = templates.find((item) => item.status === 'Active') || templates[0];
    if (!active) {
        const error = new Error('No active CSR template is available.');
        error.isTemplateMissing = true;
        throw error;
    }
    const fileResponse = await downloadFile(active.csrDocId, true);
    return {
        data: fileResponse.data,
        contentType: fileResponse.headers['content-type'],
        fileName: active.fileName
    };
};


export default{
    addNewCsrDoc,
    getAllCsrDocList,
    getAllActiveCsrDocList,
    changeCsrDocStatus,
    deleteCsrDoc,
    downloadFile,
    getCSRDocById,
    updateCsrDoc,
    downloadActiveTemplate,
    };
