import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

const ADMIN_SERVICE = "/admin-service";

//Country APIs
    const ADD_NEW_COUNTRY = "/add-new-country";
	const UPDATE_COUNTRY = "/update-country";
	const GET_ALL_COUNTRY = "/get-all-country";
	const GET_ALL_ACTIVE_COUNTRY = "/get-all-active-country";
	const GET_ALL_INACTIVE_COUNTRY = "/get-all-inactive-country";
	const DELETE_COUNTRY_BY_ID = "/delete-country-by-id";
	const CHANGE_COUNTRY_STATUS = "/change-country-status";
	const GET_COUNTRY_BY_ID = "/get-country-by-id";

const addNewCountry = (obj)=>{
	return API.post(ADMIN_SERVICE+ADD_NEW_COUNTRY, obj);
}

const updateCountry = (obj)=>{

	const obj1 = {...obj};

	obj1.countryId = encrypt(obj1.countryId);

	return API.post(ADMIN_SERVICE+UPDATE_COUNTRY, obj);
}

const getAllCountryList = () =>{
    return API.get(ADMIN_SERVICE+GET_ALL_COUNTRY);
}

const changeCountryStatus = (id) =>{
	return API.get(ADMIN_SERVICE+CHANGE_COUNTRY_STATUS,{
		params:{
			id:encrypt(id)
		}
	})
}

const getCountryById = (id) =>{

	return API.get(ADMIN_SERVICE+GET_COUNTRY_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}

const deleteCountry = (id) =>{
	return API.get(ADMIN_SERVICE+DELETE_COUNTRY_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}


export default{
                addNewCountry,
                getAllCountryList,
				changeCountryStatus,
				updateCountry,
				deleteCountry,
				getCountryById
            };
