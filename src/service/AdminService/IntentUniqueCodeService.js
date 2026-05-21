import API from '../../api/ApplicationAPI';
import { encrypt } from '../../components/global/util/EncryptDecrypt';
import  store  from '../../store';

const ADMIN_SERVICE = "/admin-service";

const ADD_INTENT_UNIQUE_CODE = "/add-intent-unique-code";
const UPDATE_INTENT_UNIQUE_CODE = "/update-intent-unique-code";
const GET_ALL_INTENT_UNIQUE_CODE = "/get-all-intent-unique-code";	
const GET_ACTIVE_INTENT_UNIQUE_CODE_BY_ID = "/get-active-intent-by-id";
const REGENERATE_INTENT_UNIQUE_CODE_BY_ID = "/regenrate-unicode-code-by-id";

const state = store.getState();
const username = state.jwtAuthentication.username;


const addNewIntentUniqueCode = (obj)=>{

    let obj1 = {...obj};

    obj1.createdBy = encrypt(username);
    obj1.updatedBy = encrypt(username);

	return API.post(ADMIN_SERVICE+ADD_INTENT_UNIQUE_CODE, obj1);
}

const updateIntentUniqueCode = (obj)=>{

    let obj1 = {...obj};

    obj1.uniqueCodeId = encrypt(obj.uniqueCodeId);
    obj1.updatedBy = encrypt(username);

	return API.post(ADMIN_SERVICE+UPDATE_INTENT_UNIQUE_CODE, obj1);
}

const getIntentUniqueCodeList = () =>{
    return API.get(ADMIN_SERVICE+GET_ALL_INTENT_UNIQUE_CODE);
}

const getActiveUniqueCodeById = (id) =>{
    return API.get(ADMIN_SERVICE+GET_ACTIVE_INTENT_UNIQUE_CODE_BY_ID,{
        params:{
            id:encrypt(id)
        }
    })
}

const regenerateUniqueCodeById = (id) =>{
    return API.get(ADMIN_SERVICE+REGENERATE_INTENT_UNIQUE_CODE_BY_ID,{
        params:{
            id:encrypt(id),
            qid:encrypt(username)
        }
    })
}


export default{
    addNewIntentUniqueCode,
    getIntentUniqueCodeList,
    getActiveUniqueCodeById,
    updateIntentUniqueCode,
    regenerateUniqueCodeById
  };
