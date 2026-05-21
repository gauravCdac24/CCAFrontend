import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

	const ADMIN_SERVICE = "/admin-service";


    const ADD_NEW_MENU = "/add-new-menu";
	const UPDATE_MENU = "/update-menu";
	const GET_ALL_MENU = "/get-all-menu";
	const GET_ALL_ACTIVE_MENU = "/get-all-active-menu";
	const GET_ALL_INACTIVE_MENU = "/get-all-inactive-menu";
	const CHANGE_MENU_STATUS = "/change-menu-status";
	const GET_MENU_BY_ID = "/get-menu-by-id";
	const GET_ALL_MENU_ORDER = "/get-all-menu-order";
	

	const addNewMenu = (obj)=>{
		let obj1 = {...obj};
		obj1.roleId = encrypt(obj1.roleId);
		return API.post(ADMIN_SERVICE+ADD_NEW_MENU, obj1);
	}

	const updateMenu = (obj)=>{

		let obj1 = {...obj};
		obj1.menuId = encrypt(obj1.menuId);
		obj1.roleId = encrypt(obj1.roleId);

		return API.post(ADMIN_SERVICE+UPDATE_MENU, obj1);
	}

	const getAllMenuList = () =>{
		return API.get(ADMIN_SERVICE+GET_ALL_MENU);
	}

	const changeMenuStatus = (id) =>{
		return API.get(ADMIN_SERVICE+CHANGE_MENU_STATUS,{
			params:{
				id:encrypt(id)
			}
		})
	}

	const getMenuById = (id) =>{

		return API.get(ADMIN_SERVICE+GET_MENU_BY_ID,{
			params:{
				id:encrypt(id)
			}
		})
	}

	const getAllActiveMenu = () =>{
		return API.get(ADMIN_SERVICE+GET_ALL_ACTIVE_MENU)
	}

	const getAllInActiveMenu = () =>{
		return API.get(ADMIN_SERVICE+GET_ALL_INACTIVE_MENU)
	}

	const getAllOrderList = () =>{
		return API.get(ADMIN_SERVICE+GET_ALL_MENU_ORDER)
	}

	



	


export default{
                addNewMenu,
                getAllMenuList,
				changeMenuStatus,
				updateMenu,
				getMenuById,
				getAllActiveMenu,
				getAllInActiveMenu,
				getAllOrderList,
            };
