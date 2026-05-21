import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

	const ADMIN_SERVICE = "/admin-service";

    const ADD_NEW_ROLE = "/add-new-role";
	const UPDATE_ROLE = "/update-role";
	const GET_ALL_ROLE = "/get-all-role";
	const GET_ALL_ACTIVE_ROLE = "/get-all-active-role";
	const GET_ALL_INACTIVE_ROLE = "/get-all-inactive-role";
	const CHANGE_ROLE_STATUS = "/change-role-status";
	const GET_ROLE_BY_ID = "/get-role-by-id";
	const GET_ROLE_BY_NAME= "/get-role-by-name";
	const GET_ROLE_BY_USERID= "/get-role-by-user-id";
	const ASSIGNED_ROLE= "/add-assigned-role";
	const GET_DETAILS_BY_USERID= "/get-deatisl-userId";
    const CHANGE_USER_ROLE_STATUS="/change-user-role-status";

	const addNewRole = (obj)=>{
		return API.post(ADMIN_SERVICE+ADD_NEW_ROLE, obj);
	}

	const addAssignRole = (obj)=>{
		return API.post(ADMIN_SERVICE+ASSIGNED_ROLE, obj);
	}

	const updateRole = (obj)=>{

		const obj1 = {...obj};

		obj1.roleId = encrypt(obj1.roleId);

		return API.post(ADMIN_SERVICE+UPDATE_ROLE, obj1);
	}

	const getAllRoleList = () =>{
		return API.get(ADMIN_SERVICE+GET_ALL_ROLE);
	}

	const changeRoleStatus = (id) =>{
		return API.get(ADMIN_SERVICE+CHANGE_ROLE_STATUS,{
			params:{
				id:encrypt(id)
			}
		})
	}

	const getRoleById = (id) =>{

		return API.get(ADMIN_SERVICE+GET_ROLE_BY_ID,{
			params:{
				id:encrypt(id)
			}
		})
	}

	const getRoleByName = (name) =>{

		return API.get(ADMIN_SERVICE+GET_ROLE_BY_NAME,{
			params:{
				id:encrypt(name)
			}
		})

	}

	const getDetailsByUserid = (id) =>{

		return API.get(ADMIN_SERVICE+GET_DETAILS_BY_USERID,{
			params:{
				id:encrypt(id)
			}
		})

	}


	const getRoleByUserId = (id) =>{

		return API.get(ADMIN_SERVICE+GET_ROLE_BY_USERID,{
			params:{
				id:encrypt(id)
			}
		})
	}
	const getAllActiveRole = () =>{
		return API.get(ADMIN_SERVICE+GET_ALL_ACTIVE_ROLE)
	}

	const getAllInActiveRole = () =>{
		return API.get(ADMIN_SERVICE+GET_ALL_INACTIVE_ROLE)
	}

	const changeUserRoleStatus = (id) =>{
		return API.get(ADMIN_SERVICE+CHANGE_USER_ROLE_STATUS,{
			params:{
				id:encrypt(id)
			}
		})
	}


export default{
                addNewRole,
                getAllRoleList,
				changeRoleStatus,
				updateRole,
				getRoleById,
				getAllActiveRole,
				getAllInActiveRole,
				getRoleByName,
				getRoleByUserId,
				addAssignRole,
				getDetailsByUserid,
				changeUserRoleStatus,
            };
