import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

	const ADMIN_SERVICE = "/admin-service";


    const ADD_NEW_ROLE = "/assign-new-client-role";
	const UPDATE_ROLE = "/update-client-role";
	const GET_ALL_ROLE= "/get-all-client-roles";
	const DELETE_ROLE_BY_ID = "/delete-client-role-by-id";
	const CHANGE_ROLE_STATUS = "/change-client-role-status-by-id";
	const GET_ROLE_BY_ID = "/get-client-role-by-id";

	const addNewRole = (obj)=>{
		return API.post(ADMIN_SERVICE+ADD_NEW_ROLE, obj);
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

	const deleteRole = (id) =>{
		return API.get(ADMIN_SERVICE+DELETE_ROLE_BY_ID,{
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
				deleteRole,
				getRoleById
            };
