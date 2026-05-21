import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

	const ADMIN_SERVICE = "/admin-service";
    const GET_TRACKER = "/get-tracker";

	const getTracker = (pathname) =>{
		return API.get(ADMIN_SERVICE+GET_TRACKER,{
			params:{
				pid:encrypt(pathname)
			}
		})

	} 



export default{
                getTracker
            };
