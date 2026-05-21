import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;
import store from '../../store';

	const ADMIN_SERVICE = "/admin-service";


    const ADD_EKYC_MODE = "/add-ekyc-mode";
	const UPDATE_EKYC_MODE = "/update-ekyc-mode";
	const GET_ALL_EKYC_MODE = "/get-all-ekyc-mode";
	const CHANGE_EKYC_MODE_STATUS = "/change-ekyc-mode-status";
	const GET_EKYC_MODE_BY_ID = "/get-ekyc-mode-by-id";

    const auth = () => {
        const state = store.getState();
        return state.jwtAuthentication;
      }

	const addNewEKYCMode = (obj)=>{
        const username = auth().username;
        obj.createdBy = encrypt(username);
		return API.post(ADMIN_SERVICE+ADD_EKYC_MODE, obj);
	}

	const updateEKYCMode = (obj)=>{

        const username = auth().username;
		const obj1 = {...obj};
		obj1.esignEKYCModeId = encrypt(obj1.esignEKYCModeId);
        obj1.updatedBy = encrypt(username);

		return API.post(ADMIN_SERVICE+UPDATE_EKYC_MODE, obj1);
	}

	const getAllEKYCMode = () =>{
		return API.get(ADMIN_SERVICE+GET_ALL_EKYC_MODE);
	}

	const changeEKYCModeStatus = (id) =>{
        const username = auth().username;
	
		return API.get(ADMIN_SERVICE+CHANGE_EKYC_MODE_STATUS,{
			params:{
				id:encrypt(id),
                qid:encrypt(username)
			}
		})
	}

	const getEKYCModeByID = (id) =>{
		return API.get(ADMIN_SERVICE+GET_EKYC_MODE_BY_ID,{
			params:{
				id:encrypt(id)
			}
		})
	}


export default{
    addNewEKYCMode,
    updateEKYCMode,
    getAllEKYCMode,
    changeEKYCModeStatus,
    getEKYCModeByID      
            };
