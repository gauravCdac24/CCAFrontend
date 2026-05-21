import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;
import store from '../../store';

    const ADMIN_SERVICE = "/admin-service";


    const ADD_DOCUMENT_NAME = "/add-document";
    const UPDATE_DOCUMENT_NAME = "/update-document";
    const GET_ALL_DOCUMENT_NAME = "/get-all-document";
    const CHANGE_DOCUMENT_NAME_STATUS = "/change-document-status";
    const GET_DOCUMENT_NAME_BY_ID = "/get-document-by-id";
    const GET_ALL_ACTIVE_DOCUMENT = "/get-all-active-document";


    const auth = () => {
        const state = store.getState();
        return state.jwtAuthentication;
      }

    const addNewDocumentName = (obj)=>{
        const username = auth().username;
        obj.createdBy = encrypt(username);
        return API.post(ADMIN_SERVICE+ADD_DOCUMENT_NAME, obj);
    }

    const updateDocumentName = (obj)=>{

        const username = auth().username;
        const obj1 = {...obj};
        obj1.documentId = encrypt(obj1.documentId);
        obj1.updatedBy = encrypt(username);

        return API.post(ADMIN_SERVICE+UPDATE_DOCUMENT_NAME, obj1);
    }

    const getAllDocumentName = () =>{
        return API.get(ADMIN_SERVICE+GET_ALL_DOCUMENT_NAME);
    }

    const getAllAciveDocumentName = () =>{
        return API.get(ADMIN_SERVICE+GET_ALL_ACTIVE_DOCUMENT);
    }

    const changeDocumentNameStatus = (id) =>{
        const username = auth().username;
    
        return API.get(ADMIN_SERVICE+CHANGE_DOCUMENT_NAME_STATUS,{
            params:{
                id:encrypt(id),
                qid:encrypt(username)
            }
        })
    }

    const getDocumentNameByID = (id) =>{
        return API.get(ADMIN_SERVICE+GET_DOCUMENT_NAME_BY_ID,{
            params:{
                id:encrypt(id)
            }
        })
    }


export default{
    addNewDocumentName,
    updateDocumentName,
    getAllDocumentName,
    changeDocumentNameStatus,
    getDocumentNameByID,
    getAllAciveDocumentName      
            };
