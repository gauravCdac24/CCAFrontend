import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;

const NEW_LICENSE_SERVICE_BASE_URL = "/newlicense-service";
const GET_ALL_NEW_APPLICATIONS_RECOMMENDED_FOR_IN_PRINCIPAL_APPROVAL = "/get-all-new-app-recommended-application";
const GET_ALL_NEW_APPLICATIONS_WITH_REQUIRED_DOCUMENTS = "/get-all-application-with-required-documents";
const GET_NEW_APPLICATION_WITH_BANK_GUARANTEE_PROOF = "/get-new-application-with-bank-guarantee-proof";
const GET_LICENSE_ISSUED_APPLICATIONS = "/get-license-issued-applications";
/*

Get all new application where status = RECOMMENDED_IN_PRINCIPLE_APPROVAL

*/

const getAllRecommendedNewApplication = () =>{
	return API.get(NEW_LICENSE_SERVICE_BASE_URL+GET_ALL_NEW_APPLICATIONS_RECOMMENDED_FOR_IN_PRINCIPAL_APPROVAL);
}

/*---

Get all new application where status = DOCUMENT_SUBMITTED_FOR_LICENSE

---*/
const getAllAppWithRequiredDocuments = () => {
    return API.get(NEW_LICENSE_SERVICE_BASE_URL+GET_ALL_NEW_APPLICATIONS_WITH_REQUIRED_DOCUMENTS);
}

/*---

Get all new application where status = BANK_GUARANTEE_PROOF_UPLOADED

---*/
const getNewAppWithBankGuaranteeProof = () =>{

    return API.get(NEW_LICENSE_SERVICE_BASE_URL+GET_NEW_APPLICATION_WITH_BANK_GUARANTEE_PROOF);

}

/*---

Get all new application where status = LICENSE_ISSUED

---*/
const getLicenseIssuedApplication = () =>{

    return API.get(NEW_LICENSE_SERVICE_BASE_URL + GET_LICENSE_ISSUED_APPLICATIONS);

}


export default{
    getAllRecommendedNewApplication,
    getAllAppWithRequiredDocuments,
    getNewAppWithBankGuaranteeProof,
    getLicenseIssuedApplication
};