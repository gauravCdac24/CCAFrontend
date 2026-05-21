import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;
import store from '../../store';

	const ADMIN_SERVICE = "/admin-service";


    const ADD_DOCUMENT_TYPE = "/add-doc-type";
	const UPDATE_DOCUMENT_TYPE = "/update-doc-type";
	const GET_ALL_DOCUMENT_TYPE = "/get-all-doc-type";
	const CHANGE_DOCUMENT_TYPE_STATUS = "/change-doc-type-status";
	const GET_DOCUMENT_TYPE_BY_ID = "/get-doc-type-by-id";

    const auth = () => {
        const state = store.getState();
        return state.jwtAuthentication;
      }

	const addNewDocType = (obj)=>{
        const username = auth().username;
        obj.createdBy = encrypt(username);
		return API.post(ADMIN_SERVICE+ADD_DOCUMENT_TYPE, obj);
	}

	const updateDocType = (obj)=>{

        const username = auth().username;
		const obj1 = {...obj};
		obj1.esignDocTypeId = encrypt(obj1.esignDocTypeId);
        obj1.updatedBy = encrypt(username);

		return API.post(ADMIN_SERVICE+UPDATE_DOCUMENT_TYPE, obj1);
	}

	const getAllDocType = () =>{
		return API.get(ADMIN_SERVICE+GET_ALL_DOCUMENT_TYPE);
	}

	const changeDocTypeStatus = (id) =>{
        const username = auth().username;
	
		return API.get(ADMIN_SERVICE+CHANGE_DOCUMENT_TYPE_STATUS,{
			params:{
				id:encrypt(id),
                qid:encrypt(username)
			}
		})
	}

	const getDocTypeByID = (id) =>{
		return API.get(ADMIN_SERVICE+GET_DOCUMENT_TYPE_BY_ID,{
			params:{
				id:encrypt(id)
			}
		})
	}


export default{
    addNewDocType,
    updateDocType,
    getAllDocType,
    changeDocTypeStatus,
    getDocTypeByID      
            };
