import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;
import store from '../../store';

	const ADMIN_SERVICE = "/admin-service";

    const ADD_ESIGN_API_VERSION = "/add-esign-api-version";
	const UPDATE_ESIGN_API_VERSION = "/update-esign-api-version";
	const GET_ALL_ESIGN_API_VERSION = "/get-all-esign-api-version";
	const CHANGE_ESIGN_API_VERSION_STATUS = "/change-esign-api-version-status";
	const GET_ESIGN_API_VERSION_BY_ID = "/get-esign-api-version-by-id";
    const GET_ESIGN_API_DOCUMENT_BY_ID = "/get-esign-api-document-by-id";

    const auth = () => {
        const state = store.getState();
        return state.jwtAuthentication;
      }

    const config = {
        headers:{
            'content-type': 'multipart/form-data',
        }
    }

    const sconfig={
        headers: {
          'Content-Type': 'application/octet-stream',
        },
    }

	const addNewAPIVersion = (obj, file)=>{
        const username = auth().username;
        obj.createdBy = encrypt(username);
        const obj1 = {...obj};
        obj1.esignApiSpecId = encrypt(obj1.esignApiSpecId);

        const form = new FormData();
        form.append('apiVersionObj', new Blob([JSON.stringify(obj1)], { type: 'application/json' }));
        form.append('file', file);

		return API.post(ADMIN_SERVICE + ADD_ESIGN_API_VERSION, form);
	}

	const updateAPIVersion = (obj, file)=>{

        const username = auth().username;
		const obj1 = {...obj};
        obj1.esignApiVerId = encrypt(obj1.esignApiVerId);
		obj1.esignApiSpecId = encrypt(obj1.esignApiSpecId);
        obj1.updatedBy = encrypt(username);

        

        const form = new FormData();
        form.append('apiVersionObj', new Blob([JSON.stringify(obj1)], { type: 'application/json' }));
        form.append('file', file);

		return API.post(ADMIN_SERVICE + UPDATE_ESIGN_API_VERSION, form, config);
	}

	const getAllAPIVersion = () =>{
		return API.get(ADMIN_SERVICE + GET_ALL_ESIGN_API_VERSION);
	}

	const changeAPIVersionStatus = (id) =>{
        const username = auth().username;
		return API.get(ADMIN_SERVICE + CHANGE_ESIGN_API_VERSION_STATUS,{
			params:{
				id:encrypt(id),
                qid:encrypt(username)
			}
		})
	}

	const getAPIVersionByID = (id) =>{
		return API.get(ADMIN_SERVICE + GET_ESIGN_API_VERSION_BY_ID,{
			params:{
				id:encrypt(id)
			}
		})
	}

    const viewFile = (id)=>{
        return API.get(ADMIN_SERVICE + GET_ESIGN_API_DOCUMENT_BY_ID, {
            params:{
                id:encrypt(id)
            },  responseType: 'blob', 
            ...sconfig
        });
    }


export default{
    addNewAPIVersion,
    updateAPIVersion,
    getAllAPIVersion,
    changeAPIVersionStatus,
    getAPIVersionByID,
    viewFile      
};
