import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;
import store from '../../store';

	const ADMIN_SERVICE = "/admin-service";


    const ADD_API_SPECIFICATION = "/add-api-specification";
	const UPDATE_API_SPECIFICATION = "/update-api-specification";
	const GET_ALL_API_SPECIFICATION = "/get-all-api-specification";
	const CHANGE_API_SPECIFICATION_STATUS = "/change-api-specification-status";
	const GET_API_SPECIFICATION_BY_ID = "/get-api-specification-by-id";

    const auth = () => {
        const state = store.getState();
        return state.jwtAuthentication;
      }

	const addNewAPISpecification = (obj)=>{
        const username = auth().username;
        obj.createdBy = encrypt(username);
		return API.post(ADMIN_SERVICE+ADD_API_SPECIFICATION, obj);
	}

	const updateAPISpecification = (obj)=>{

        const username = auth().username;
		const obj1 = {...obj};

		obj1.esignApiSpecId = encrypt(obj1.esignApiSpecId);
        obj1.updatedBy = encrypt(username);

		return API.post(ADMIN_SERVICE+UPDATE_API_SPECIFICATION, obj1);
	}

	const getAllAPISpecification = () =>{
		return API.get(ADMIN_SERVICE+GET_ALL_API_SPECIFICATION);
	}

	const changeAPISpecificationStatus = (id) =>{
        const username = auth().username;
		return API.get(ADMIN_SERVICE+CHANGE_API_SPECIFICATION_STATUS,{
			params:{
				id:encrypt(id),
                qid:encrypt(username)
			}
		})
	}

	const getAPISpecificationByID = (id) =>{
		return API.get(ADMIN_SERVICE+GET_API_SPECIFICATION_BY_ID,{
			params:{
				id:encrypt(id)
			}
		})
	}


export default{
    addNewAPISpecification,
    updateAPISpecification,
    getAllAPISpecification,
    changeAPISpecificationStatus,
    getAPISpecificationByID      
            };
