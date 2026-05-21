import API from '../../api/ApplicationAPI';
import axios from 'axios';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;


const ADMIN_SERVICE = "/admin-service";
const ADD_NEW_CPSDOC = "/add-cps-document";
const UPDATE_CPSDOC = "/update-cps-document";
const GET_ALL_CPSDOC = "/get-all-cps-document";
const GET_ALL_ACTIVE_CPSDOC = "/get-all-active-cpsDoc";
const GET_ALL_INACTIVE_CPSDOC = "/get-all-inactive-cpsDoc";
const DELETE_CPSDOC_BY_ID = "/delete-cpsDoc-by-id";
const CHANGE_CPSDOC_STATUS = "/change-cpsDoc-status";
const DOWNLOAD_FILE = "/download-files";
const GET_CPSDOC_BY_ID = "/get-cps-document-by-id";

const config = {
    headers:{
        'content-type': 'multipart/form-data',
    }
}

const sconfig={
    headers: {
        'Content-Type': 'application/octet-stream',
    },
}

const econfig = {
    headers:{        
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
    }
}

const addNewCpsDoc = (obj)=>{
	return API.post(ADMIN_SERVICE+ADD_NEW_CPSDOC, obj,config);
}

const updateCpsDoc = (obj)=>{
	return API.post(ADMIN_SERVICE+UPDATE_CPSDOC, obj,config);
}

const downloadFile = (id)=>{
	return API.get(ADMIN_SERVICE+DOWNLOAD_FILE, {
		params:{
			id:encrypt(id)
		},  responseType: 'blob', 
        ...sconfig
	});
}

const getAllCpsDocList = () =>{
    return API.get(ADMIN_SERVICE+GET_ALL_CPSDOC);
}

const changeCpsDocStatus = (id) =>{
	return API.get(ADMIN_SERVICE+CHANGE_CPSDOC_STATUS,{
		params:{
			id:encrypt(id)
		}
	})
}
const getCPSDocById = (id) =>{
	return API.get(ADMIN_SERVICE+GET_CPSDOC_BY_ID,{
		params:{
			id:encrypt(id)
		}
	})
}


export default{
    addNewCpsDoc,
    getAllCpsDocList,
    changeCpsDocStatus,
    downloadFile,
    getCPSDocById,
    updateCpsDoc,
    };
