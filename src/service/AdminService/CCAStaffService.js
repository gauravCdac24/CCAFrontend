import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;
import  store  from '../../store';

const ADMIN_SERVICE = "/admin-service";

const ADD_CCA_STAFF = "/add-cca-staff";
const UPDATE_CCA_STAFF = "/update-cca-staff";
const GET_ALL_CCA_STAFF = "/get-all-cca-staff";
const GET_CCA_STAFF_BY_ID = "/get-cca-staff-by-id";

const state = store.getState();
const username = state.jwtAuthentication.username;

const addCCAStaff = (obj)=>{

    let obj1 = {...obj};

    obj1.createdBy = encrypt(username);
    obj1.updatedBy = encrypt(username);

	return API.post(ADMIN_SERVICE+ADD_CCA_STAFF, obj1);
}

const updateCCAStaff = (obj)=>{

    let obj1 = {...obj};

    obj1.staffId = encrypt(obj.staffId);
    obj1.createdBy = encrypt(username);
    obj1.updatedBy = encrypt(username);

	return API.post(ADMIN_SERVICE+UPDATE_CCA_STAFF, obj1);
}

const getAllCCAStaffList = () =>{
    return API.get(ADMIN_SERVICE+GET_ALL_CCA_STAFF);
}

const getCCAStaffById = (id) =>{

	return API.get(ADMIN_SERVICE+GET_CCA_STAFF_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}


export default{
    addCCAStaff,
    updateCCAStaff,
    getAllCCAStaffList,
    getCCAStaffById
            };
