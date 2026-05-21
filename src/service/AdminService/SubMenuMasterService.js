import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

	const ADMIN_SERVICE = "/admin-service";


    const ADD_NEW_SUB_MENU = "/add-new-sub-menu";
	const UPDATE_SUB_MENU = "/update-sub-menu";
	const GET_ALL_SUB_MENU = "/get-all-sub-menu";
	const GET_ALL_ACTIVE_SUB_MENU = "/get-all-active-sub-menu";
	const GET_ALL_INACTIVE_SUB_MENU = "/get-all-inactive-sub-menu";
	const CHANGE_SUB_MENU_STATUS = "/change-sub-menu-status";
	const GET_SUB_MENU_BY_ID = "/get-sub-menu-by-id";
	const GET_SUB_MENU_ORDER_BY_MENU_ID = "/get-sub-menu-order-by-menu-id";
	const GET_ROUTES_BY_ROLE = "/get-routes-by-role";
	const GET_SIDEBAR_BY_ROLE = "/get-sidebar-by-role";

	const addNewSubMenu = (objs)=>{
		let obj = {...objs};
		obj.menuId = encrypt(obj.menuId);
		obj.roleId = encrypt(obj.roleId);
		return API.post(ADMIN_SERVICE+ADD_NEW_SUB_MENU, obj);
	}

	const updateSubMenu = (obj)=>{

		const obj1 = {...obj};

		obj1.subMenuId = encrypt(obj1.subMenuId);
		obj1.menuId = encrypt(obj1.menuId);
		obj1.roleId = encrypt(obj1.roleId);
		return API.post(ADMIN_SERVICE+UPDATE_SUB_MENU, obj1);
	}

	const getAllSubMenuList = () =>{
		return API.get(ADMIN_SERVICE+GET_ALL_SUB_MENU);
	}

	const changeSubMenuStatus = (id) =>{
		return API.get(ADMIN_SERVICE+CHANGE_SUB_MENU_STATUS,{
			params:{
				id:encrypt(id)
			}
		})
	}

	const getSubMenuById = (id) =>{

		return API.get(ADMIN_SERVICE+GET_SUB_MENU_BY_ID,{
			params:{
				id:encrypt(id)
			}
		})
	}

	const getAllActiveSubMenu = () =>{
		return API.get(ADMIN_SERVICE+GET_ALL_ACTIVE_SUB_MENU)
	}

	const getAllInActiveSubMenu = () =>{
		return API.get(ADMIN_SERVICE+GET_ALL_INACTIVE_SUB_MENU)
	}

	const getAllSubMenuOrderByMenuId = (id) =>{
		return API.get(ADMIN_SERVICE+GET_SUB_MENU_ORDER_BY_MENU_ID,{
			params:{
				id:encrypt(id)
			}
		})

	} 


	const getRoutesByRole = (role, pathname) =>{
		return API.get(ADMIN_SERVICE+GET_ROUTES_BY_ROLE,{
			params:{
				id:encrypt(role),
				pid:encrypt(pathname)
			}
		})

	} 

	const getSidebarByRole = (role) =>{
		return API.get(ADMIN_SERVICE+GET_SIDEBAR_BY_ROLE,{
			params:{
				id:encrypt(role),
			}
		})

	} 


export default{
                addNewSubMenu,
                getAllSubMenuList,
				changeSubMenuStatus,
				updateSubMenu,
				getSubMenuById,
				getAllActiveSubMenu,
				getAllInActiveSubMenu,
				getAllSubMenuOrderByMenuId,
				getRoutesByRole,
				getSidebarByRole
            };
