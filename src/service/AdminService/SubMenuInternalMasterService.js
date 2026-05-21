import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

	const ADMIN_SERVICE = "/admin-service";


    const ADD_NEW_SUB_MENU_INTERNAL = "/add-new-sub-internal-menu";
	const UPDATE_SUB_MENU_INTERNAL = "/update-sub-menu-internal";
	const GET_ALL_SUB_MENU_INTERNAL= "/get-all-sub-menu-internal";
	const GET_ALL_ACTIVE_SUB_MENU_INTERNAL = "/get-all-active-sub-menu-internal";
	const GET_ALL_INACTIVE_SUB_MENU_INTERNAL = "/get-all-inactive-sub-menu-internal";
	const CHANGE_SUB_MENU_INTERNAL_STATUS = "/change-sub-menu-internal-status";
	const GET_SUB_MENU_INTERNAL_BY_ID = "/get-sub-menu-internal-by-id";
	

	const addNewSubMenuInternal = (objs)=>{
		let obj = {...objs};
		obj.subMenuId = encrypt(obj.subMenuId);
		return API.post(ADMIN_SERVICE+ADD_NEW_SUB_MENU_INTERNAL, obj);
	}

	const updateSubMenuInternal = (obj)=>{

		const obj1 = {...obj};

		obj1.subMenuInternalId = encrypt(obj1.subMenuInternalId);
		obj1.subMenuId = encrypt(obj1.subMenuId);
		
		return API.post(ADMIN_SERVICE+UPDATE_SUB_MENU_INTERNAL, obj1);
	}

	const getAllSubMenuInternalList = () =>{
		return API.get(ADMIN_SERVICE+GET_ALL_SUB_MENU_INTERNAL);
	}

	const changeSubMenuInternalStatus = (id) =>{
		return API.get(ADMIN_SERVICE+CHANGE_SUB_MENU_INTERNAL_STATUS,{
			params:{
				id:encrypt(id)
			}
		})
	}

	const getSubMenuInternalById = (id) =>{

		return API.get(ADMIN_SERVICE+GET_SUB_MENU_INTERNAL_BY_ID,{
			params:{
				id:encrypt(id)
			}
		})
	}

	const getAllActiveSubMenuInternal = () =>{
		return API.get(ADMIN_SERVICE+GET_ALL_ACTIVE_SUB_MENU_INTERNAL)
	}

	const getAllInActiveSubMenuInternal = () =>{
		return API.get(ADMIN_SERVICE+GET_ALL_INACTIVE_SUB_MENU_INTERNAL)
	}


export default{
    addNewSubMenuInternal,
    updateSubMenuInternal,
    getAllSubMenuInternalList,
    changeSubMenuInternalStatus,
    getSubMenuInternalById,
    getAllActiveSubMenuInternal,
    getAllInActiveSubMenuInternal
            };
