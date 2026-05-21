import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

const ADMIN_SERVICE = "/admin-service";

//STATE APIs
    const ADD_NEW_CITY = "/add-city";
	const UPDATE_CITY = "/update-city";
	const GET_ALL_CITY = "/get-all-city";
	const GET_CITY_BY_ID="/get-city-by-id";
	const GET_ALL_ACTIVE_CITY = "/get-all-active-city";
	const GET_ALL_INACTIVE_CITY = "/get-all-inactive-city";
	const DELETE_CITY_BY_ID = "/delete-city-by-id";
	const CHANGE_CITY_STATUS = "/change-city-status";

const addNewCity = (objs)=>{
	let obj = {...objs};
	obj.stateId = encrypt(obj.stateId);
	return API.post(ADMIN_SERVICE+ADD_NEW_CITY, obj);
}

const getAllCityList = () =>{
    return API.get(ADMIN_SERVICE+GET_ALL_CITY);
}

const changeCityStatus = (id) =>{
	return API.get(ADMIN_SERVICE+CHANGE_CITY_STATUS,{
		params:{
			id:encrypt(id)
		}
	})
}
const getCityById = (id) =>{

	return API.get(ADMIN_SERVICE+GET_CITY_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}

const updateCity = (obj)=>{

	const obj1 = {...obj};

	obj1.cityId = encrypt(obj1.cityId);
	obj1.stateId = encrypt(obj1.stateId);

	return API.post(ADMIN_SERVICE+UPDATE_CITY, obj);
}


export default{
				addNewCity,
				getAllCityList,
				changeCityStatus,
				getCityById,
				updateCity
            };
