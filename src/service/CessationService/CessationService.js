import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

const CESSATION_SERVICE = "/cessation-service";


const ADD_CESSATION_NOTICE_FILE = "/add-license-cessation-application";
const GET_ALL_LICENSE_DETAILS= "/get-all-data-by-license-id";
 const GET_ALL_DATA="/get-all-data";
 const GET_BY_CESSATION_ID="/get-by-cessation-id";
const VIEW_NOTICE_FILES="/download-notice-file";
const APPROVE_BY_CESSATION_ID="/get-all-data-by-cessation-id";
const REJECT_BY_CESSATION_ID="/reject-the-notice-file"
const SAVE_ALL_DATA="/save-all-data";
const GET_ALL_BY_CESSATION_ID="/get-all-undertaking-by-cessation-id";
const GET_ALL_DATA_OF_CESSATIONAPP="/get-all-data-of-undertaking";
const GET_ALL_DATA_FOR_UNDERTAKING="/get-all-data-approval-undertaking";
const VIEW_UNDERTAKING_FILE="/get-download-undertaking-file";
const APPROVE_FROM_CCA_OFFICER = "/approve-from-cca-officer";
const REJECT_FROM_CCA_OFFICER = "/reject-from-cca-officer";
const GET_ALL_DATA_FROM_CCA_OFFICER = "/get-all-data-from-cca-officer";
const GET_ALL_ACTIVE_DATA_FROM_CCA_OFFICER = "/get-all-active-data-from-cca-officer";
const EDIT_ALL_DATA="/edit-all-data-by-license";
const GET_ALL_DATA_FROM_CCA ="/get-all-data-from-cca";
const REJECT_FROM_CCA = "/reject-from-cca";
const APPROVE_FROM_CCA ="/approve-from-cca";
const GET_ALL_DATA_FROM_CCA_OFFICER_TO_CCA = "/get-all-data-from-cca-officer-to-cca";
const GET_ALL_DATA_FROM_CCA_OFFICERS = "/get-all-data-from-cca-officeres";

 const sconfig={
    headers: {
        'Content-Type': 'application/octet-stream',
    },
}


const addCessationNoticeFile = (obj)=>{
	return API.post(CESSATION_SERVICE+ADD_CESSATION_NOTICE_FILE, obj);
}
const getAllLicenseId = (licenseId)=>{
	return API.get(CESSATION_SERVICE+GET_ALL_LICENSE_DETAILS
        ,{
            params:{
                licenseId:encrypt(licenseId)
            }
        })
}

const getALLData = (obj)=>{
	return API.get(CESSATION_SERVICE+GET_ALL_DATA, obj);
}

const getByCessationAppId = (cessationAppId)=>{
	return API.get(CESSATION_SERVICE+GET_BY_CESSATION_ID
        ,{
            params:{
                cessationAppId:encrypt(cessationAppId)
            }
        })
}

const downloadStepTwoDocument= (id) =>{
	return API.get(CESSATION_SERVICE+VIEW_NOTICE_FILES,{
		params:{
			id:(id)
		},
		responseType: 'blob', 
		...sconfig
	})
}


const approveCessationNoticeFile = (cessationAppId)=>{

	return API.get(CESSATION_SERVICE+APPROVE_BY_CESSATION_ID
        ,{
            params:{
                cessationAppId:encrypt(cessationAppId)
            }
        })
}


const rejectCessationNoticeFile = (cessationAppId)=>{

	return API.get(CESSATION_SERVICE+REJECT_BY_CESSATION_ID
        ,{
            params:{
                cessationAppId:encrypt(cessationAppId)
            }
        })
}

const saveAllData = (obj)=>{
	return API.post(CESSATION_SERVICE+SAVE_ALL_DATA, obj);
}

const getAllDataByCessationAppId = (cessationAppId)=>{

	return API.get(CESSATION_SERVICE+GET_ALL_BY_CESSATION_ID
        ,{
            params:{
                cessationAppId:(cessationAppId)
            }
        })
}

const getALLDataOfCessationAppUndertaking = ()=>{
	return API.get(CESSATION_SERVICE+GET_ALL_DATA_OF_CESSATIONAPP);
}


const getAllDataForApprovalUndertaking = ()=>{
	return API.get(CESSATION_SERVICE+GET_ALL_DATA_FOR_UNDERTAKING);
}

const downloadStepThreeDocument= (id) =>{
	return API.get(CESSATION_SERVICE+VIEW_UNDERTAKING_FILE,{
		params:{
			id:encrypt(id)
		},
		responseType: 'blob', 
		...sconfig
	})
}


const approveApplicationForCCAOfficer=(obj)=>{
    return API.post(CESSATION_SERVICE+APPROVE_FROM_CCA_OFFICER,obj)
       
    
}

const rejectApplicationForCCAOfficer=(obj)=>{
    return API.post(CESSATION_SERVICE+REJECT_FROM_CCA_OFFICER,obj)

}

const getAllDataForCCAOfficer=(cessationAppId)=>{
    return API.get(CESSATION_SERVICE+GET_ALL_DATA_FROM_CCA_OFFICER
        ,{
            params:{
                cessationAppId:(cessationAppId)
            }
        })
    
}

const getAllActiveDataForCCAOfficer=(cessationAppId)=>{
    return API.get(CESSATION_SERVICE+GET_ALL_ACTIVE_DATA_FROM_CCA_OFFICER ,{
        params:{
            cessationAppId:(cessationAppId)
        }
    })
}
const editAllData = (obj)=>{
	return API.post(CESSATION_SERVICE+EDIT_ALL_DATA, obj);
}


const getAllDataForCCA = ()=>{
	return API.get(CESSATION_SERVICE+GET_ALL_DATA_FROM_CCA);
}

const rejectApplicationForCCA = (obj)=>{
	return API.post(CESSATION_SERVICE+REJECT_FROM_CCA, obj);
}

const approveApplicationForCCA = (obj)=>{
	return API.post(CESSATION_SERVICE+APPROVE_FROM_CCA, obj);
}

const getAllDataForCCAOfficerToCCA = ()=>{
	return API.get(CESSATION_SERVICE+GET_ALL_DATA_FROM_CCA_OFFICER_TO_CCA);
}

const getAllDataForCCAOfficers = ()=>{
	return API.get(CESSATION_SERVICE+GET_ALL_DATA_FROM_CCA_OFFICERS);
}


export default{
    addCessationNoticeFile,
    getAllLicenseId,
    getALLData,
    getByCessationAppId,
    downloadStepTwoDocument,
    approveCessationNoticeFile,
    rejectCessationNoticeFile,
    saveAllData,
    getALLDataOfCessationAppUndertaking,
    getAllDataByCessationAppId,
    getAllDataForApprovalUndertaking,
    downloadStepThreeDocument,
    approveApplicationForCCAOfficer,
    rejectApplicationForCCAOfficer,
    getAllDataForCCAOfficer,
    getAllActiveDataForCCAOfficer,
    editAllData,
    getAllDataForCCA,
    rejectApplicationForCCA,
    approveApplicationForCCA,
    getAllDataForCCAOfficerToCCA,
    getAllDataForCCAOfficers,
}