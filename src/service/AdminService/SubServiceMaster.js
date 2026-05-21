import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

const ADMIN_SERVICE = "/admin-service";

//Country APIs
    const ADD_NEW_SERVICE = "/add-sub-service";
	const UPDATE_SERVICE = "/update-sub-service";
	const GET_ALL_SERVICE = "/get-all-sub-services";
	const GET_ALL_ACTIVE_SERVICE = "/get-all-active-service";
	const GET_ALL_INACTIVE_SERVICE= "/get-all-inactive-service";
	const DELETE_SERVICE_BY_ID = "/delete-service-by-id";
	const CHANGE_SERVICE_STATUS = "/status-change";
	const GET_SERVICE_BY_ID = "/get-sub-service-by-id";
   

	const sconfig={
		headers: {
			'Content-Type': 'application/octet-stream',
		},
	}
const addNewService = (obj)=>{
    obj.serviceId= encrypt( obj.serviceId);
	return API.post(ADMIN_SERVICE+ADD_NEW_SERVICE, obj);
}


const updateService = (obj)=>{

	const obj1 = obj;

	
    obj.serviceId=encrypt( obj.serviceId);
   

	return API.post(ADMIN_SERVICE+UPDATE_SERVICE, obj);
}

const getAllServiceList = () =>{
    return API.get(ADMIN_SERVICE+GET_ALL_SERVICE);
}

const changeServiceStatus = (id) =>{
	return API.get(ADMIN_SERVICE+CHANGE_SERVICE_STATUS,{
		params:{
			id:encrypt(id)
		}
	})
}

const getServiceById = (id) =>{

	return API.get(ADMIN_SERVICE+GET_SERVICE_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}

const deleteService = (id) =>{
	return API.get(ADMIN_SERVICE+DELETE_SERVICE_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}


export default{
                addNewService,
                getAllServiceList,
				changeServiceStatus,
				updateService,
				deleteService,
				getServiceById,
				
            };
