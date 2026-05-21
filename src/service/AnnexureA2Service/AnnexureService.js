import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;
import store from '../../store';

const AUDIT_SERVICE = "/audit-service";

const ADD_ANNUAL_AUDIT_PERIOD_DETAILS = "/add-annual-audit-period-details";
const GET_ANNUAL_AUDIT_PERIOD_DETAILS = "/get-annual-audit-period-details";

const ADD_INTERNAL_AUDIT_DETAILS = "/add-internal-audit-details";
const GET_INTERNAL_AUDIT_DETAILS = "/get-internal-audit-details";

const ADD_EKYC_MONTH_DETAILS = "/add-ekyc-month-details";
const GET_EKYC_MONTH_DETAILS = "/get-ekyc-month-details";

const ADD_ACCOUNT_BASED_DETAILS = "/add-account-based-details";
const GET_ACCOUNT_BASED_DETAILS = "/get-account-based-details";

const ADD_RA_AUDIT = "/add-ra-audit";
const GET_RA_AUDIT = "/get-ra-audit";

const ADD_COURT_CASES = "/add-court-cases";
const GET_COURT_CASES = "/get-court-cases";

const ADD_REVOCATION_DETAILS = "/add-revocation-details";
const GET_REVOCATION_DETAILS = "/get-revocation-details";

const ADD_CRYPTO_TOKEN_DETAILS = "/add-crypto-token-details";
const GET_CRYPTO_TOKEN_DETAILS = "/get-crypto-token-details";
const DOWNLOAD_CRYPTO_TOKEN_DOCUMENT = "/download-crypto-token-document";

const ADD_CA_SOFTWARE_DETAILS = "/add-ca-software-details";
const GET_CA_SOFTWARE_DETAILS = "/get-ca-software-details";

const ADD_CA_LOCATION_DETAILS = "/add-ca-location-details";
const GET_CA_LOCATIOIN_DETAILS = "/get-ca-location-details";

const ADD_CA_SERVICE_DETAILS = "/add-ca-service-details";
const GET_CA_SERVICE_DETAILS = "/get-ca-service-details";

const ADD_ASP_DETAILS = "/add-asp-details";
const GET_ASP_DETAILS = "/get-asp-details";
const ADD_PUBLIC_INFO_DETAILS = "/add-public-info-details";
const GET_PUBLIC_INFO_DETAILS = "/get-public-info-details";

const ADD_CERTIFICATE_COST_DETAILS = "/add-certificate-cost-details";
const GET_CERTIFICATE_COST_DETAILS = "/get-certificate-cost-details";

const ADD_SELF_ASSESSMENT_DETAILS = "/add-self-assessment-details";
const GET_SELF_ASSESSMENT_DETAILS = "/get-self-assessment-details";

const ADD_TRUSTED_PERSON_DETAILS = "/add-trusted-person-details";
const GET_TRUSTED_PERSON_DETAILS = "/add-trusted-person-details";

const ADD_CONNECTIVITY_DETAILS = "/add-connectivity-details";
const GET_CONNECTIVITY_DETAILS = "/get-connectivity-details";

const ADD_DOWNTIME_DETAILS = "/add-downtime-details";
const GET_DOWNTIME_DETAILS = "/get-downtime-details";

const GET_AUDITOR_VERIFICATION = "/get-auditor-verification";
const ADD_AUDITOR_VERIFICATION = "/add-auditor-verification";
const CHANGE_STATUS_ANNEXURE = "/change-annexure-details";
const GET_ANNEXURE_MAIN_BY_USERNAME = "/get-annexure-main-by-username";

const UPLOAD_EXCELL_SHEET="/uploadCATrustedPersonExcel";

const sconfig={
	headers: {
		'Content-Type': 'application/octet-stream',
	},
}

const auth = () => {
	const state = store.getState();
	return state.jwtAuthentication;
  }

  //1
const addAnnualAuditPeriodDetails = (obj)=>{

	if(!Array.isArray(obj)){
		throw new Error("Error in saving data, please try after some time.");
	}


	let obj1 = [...obj]

	const auditPeriods = obj1.map((row) => ({
		...row,
		periodDetailsId: row.periodDetailsId ? encrypt(row.periodDetailsId) : '',
	}));

	const username = auth().username;

	let obj2 = {
			userName: encrypt(username),
			auditPeriods: auditPeriods
		}


	return API.post(AUDIT_SERVICE+ADD_ANNUAL_AUDIT_PERIOD_DETAILS, obj2);
}


const getAnnualAuditPeriodDetails = () =>{

	const username = auth().username;


	return API.get(AUDIT_SERVICE + GET_ANNUAL_AUDIT_PERIOD_DETAILS,{
		params:{
			id: encrypt(username)
		},
	})
}


//2
const addInternalAuditDetails = (obj)=>{

	if(!Array.isArray(obj)){
		throw new Error("Error in saving data, please try after some time.");
	}


	let obj1 = [...obj]

	const internalAudits = obj1.map((row) => ({
		...row,
		inAuditDetailsId: row.inAuditDetailsId ? encrypt(row.inAuditDetailsId) : '',
	}));

	const username = auth().username;

	let obj2 = {
			userName: encrypt(username),
			internalAudits: internalAudits
		}


	return API.post(AUDIT_SERVICE+ADD_INTERNAL_AUDIT_DETAILS, obj2);
}


const getInternalAuditDetails = () =>{

	const username = auth().username;


	return API.get(AUDIT_SERVICE + GET_INTERNAL_AUDIT_DETAILS,{
		params:{
			id: encrypt(username)
		},
	})
}


//3
const addEKYCAcMonthDetails = (obj)=>{

	if(!Array.isArray(obj)){
		throw new Error("Error in saving data, please try after some time.");
	}


	let obj1 = [...obj]

	const ekycMonthDetails = obj1.map((row) => ({
		month: row.month,
		fromDate: row.fromDate,
		toDate: row.toDate,
		observations: row.observations,
		auditorDetails: row.auditorDetails,
		eKYCAcMonthId: row.eKYCAcMonthId ? encrypt(String(row.eKYCAcMonthId)) : '',
	}));

	const username = auth().username;

	let obj2 = {
			userName: encrypt(username),
			ekycMonthDetails: ekycMonthDetails
		}


	return API.post(AUDIT_SERVICE+ADD_EKYC_MONTH_DETAILS, obj2);
}


const getEKYCAcMonthDetails = () =>{

	const username = auth().username;


	return API.get(AUDIT_SERVICE + GET_EKYC_MONTH_DETAILS,{
		params:{
			id: encrypt(username)
		},
	})
}


//4
const addAccountBasedDetails = (obj)=>{

	const username = auth().username;

	const obj1 = {
		...obj,
		userName: encrypt(username),
		ekycAcMainId: obj?.ekycAcMainId != null && obj.ekycAcMainId !== ''
			? encrypt(String(obj.ekycAcMainId))
			: '',
	};

	return API.post(AUDIT_SERVICE+ADD_ACCOUNT_BASED_DETAILS, obj1);
}


const getAccountBasedDetails = () =>{

	const username = auth().username;


	return API.get(AUDIT_SERVICE + GET_ACCOUNT_BASED_DETAILS,{
		params:{
			id: encrypt(username)
		},
	})
}


//5
const addRAAudit = (obj)=>{

	let obj1 = {...obj}


	const username = auth().username;

	obj1.userName = encrypt(username);

	if(obj1.raAuditMainId)
		obj1.raAuditMainId = encrypt(obj1.raAuditMainId)


	return API.post(AUDIT_SERVICE+ADD_RA_AUDIT, obj1);
}


const getRAAudit = () =>{

	const username = auth().username;


	return API.get(AUDIT_SERVICE + GET_RA_AUDIT,{
		params:{
			id: encrypt(username)
		},
	})
}

//6

const addCourtCases = (obj)=>{

	let obj1 = {...obj}


	const username = auth().username;

	obj1.userName = encrypt(username);

	if(obj1.courtCasesMainId)
		obj1.courtCasesMainId = encrypt(obj1.courtCasesMainId)


	return API.post(AUDIT_SERVICE+ADD_COURT_CASES, obj1);
}


const getCourtCases = () =>{

	const username = auth().username;


	return API.get(AUDIT_SERVICE + GET_COURT_CASES,{
		params:{
			id: encrypt(username)
		},
	})
}

//7

const addRevocationDetails = (obj)=>{

	let obj1 = {...obj}


	const username = auth().username;

	obj1.userName = encrypt(username);

	if(obj1.revocationMainId)
		obj1.revocationMainId = encrypt(obj1.revocationMainId)


	return API.post(AUDIT_SERVICE+ADD_REVOCATION_DETAILS, obj1);
}


const getRevocationDetails = () =>{

	const username = auth().username;


	return API.get(AUDIT_SERVICE + GET_REVOCATION_DETAILS,{
		params:{
			id: encrypt(username)
		},
	})
}

//8
const addCryptoTokenDetails = (obj)=>{

	if(!Array.isArray(obj)){
		throw new Error("Error in saving data, please try after some time.");
	}

	const username = auth().username;



	let obj1 = [...obj]

	const formData = new FormData();
	formData.append("userName", encrypt(username))

	obj1.forEach((element, index) => {

		formData.append(`cryptoTokenDetails[${index}].brandName`, element.brandName ?? '')
		formData.append(`cryptoTokenDetails[${index}].oemDetails`, element.oemDetails ?? '')
		formData.append(`cryptoTokenDetails[${index}].makInPercentage`, element.makInPercentage ?? '')
        formData.append(`cryptoTokenDetails[${index}].fipCertUpTo`, element.fipCertUpTo ?? '')
		formData.append(`cryptoTokenDetails[${index}].filename`, element.filename ?? '')

		const auditFile = element.auditFile instanceof File
			? element.auditFile
			: (element.secAuditDetails instanceof File ? element.secAuditDetails : null);

		if (auditFile) {
			formData.append(`cryptoTokenDetails[${index}].secAuditDetails`, auditFile)
		}

		formData.append(
			`cryptoTokenDetails[${index}].cryptoTokDetailsId`,
			element.cryptoTokDetailsId ? encrypt(String(element.cryptoTokDetailsId)) : ''
		)
		
	});

	

	return API.post(AUDIT_SERVICE+ADD_CRYPTO_TOKEN_DETAILS, formData);
}


const getCryptoTokenDetails = () =>{

	const username = auth().username;


	return API.get(AUDIT_SERVICE + GET_CRYPTO_TOKEN_DETAILS,{
		params:{
			id: encrypt(username)
		},
	})
}

const downloadCryptoTokenDocument = (id) =>{

    return API.get(AUDIT_SERVICE+DOWNLOAD_CRYPTO_TOKEN_DOCUMENT,{
        params:{
            id: encrypt(id),
        },
        responseType: 'blob', 
        ...sconfig
    })
}

//9

const addCASoftwareDetailsDetails = (obj)=>{

	if(!Array.isArray(obj)){
		throw new Error("Error in saving data, please try after some time.");
	}


	let obj1 = [...obj]

	const caWebDetails = obj1.map((row) => ({
		...row,
		caWebDetailsId: row.caWebDetailsId ? encrypt(row.caWebDetailsId) : '',
	}));

	const username = auth().username;

	let obj2 = {
			userName: encrypt(username),
			caSwWebDetails: caWebDetails
		}


	return API.post(AUDIT_SERVICE + ADD_CA_SOFTWARE_DETAILS, obj2);
}


const getCASoftwareDetailsDetails = () =>{

	const username = auth().username;


	return API.get(AUDIT_SERVICE + GET_CA_SOFTWARE_DETAILS,{
		params:{
			id: encrypt(username)
		},
	})
}

//10

const addLocationDetails = (obj)=>{

	if(!Array.isArray(obj)){
		throw new Error("Error in saving data, please try after some time.");
	}

	const username = auth().username;



	let obj1 = [...obj]

	const formData = new FormData();
	formData.append("userName", encrypt(username))

	obj1.forEach((element, index) => {

		formData.append(`locationDetails[${index}].location`, element.location)
        formData.append(`locationDetails[${index}].description`, element.description);
		formData.append(`locationDetails[${index}].caAdministratorFileName`, element.caAdministratorFileName)
		formData.append(`locationDetails[${index}].caManpowerFileName`, element.caManpowerFileName)
		formData.append(`locationDetails[${index}].verificationOfficersFileName`, element.verificationOfficersFileName)
		formData.append(`locationDetails[${index}].caOperatorsFileName`, element.caOperatorsFileName)
		formData.append(`locationDetails[${index}].sysAdministratorFileName`, element.sysAdministratorFileName)
		if(element?.caAdministratorCount){
			formData.append(`locationDetails[${index}].caAdministratorCount`, element.caAdministratorCount)
		}
		if(element?.verificationOfficersCount){
			formData.append(`locationDetails[${index}].verificationOfficersCount`, element.verificationOfficersCount)
		}
		if(element?.caOperatorsCount){
			formData.append(`locationDetails[${index}].caOperatorsCount`, element.caOperatorsCount)
		}
		if(element?.sysAdministratorCount){
			formData.append(`locationDetails[${index}].sysAdministratorCount`, element.sysAdministratorCount)
		}	
		if(element?.caManpowerCount){
			formData.append(`locationDetails[${index}].caManpowerCount`, element.caManpowerCount)
		}

		formData.append(`locationDetails[${index}].locationDetailsId`, element.locationDetailsId ? encrypt(element.locationDetailsId) : '')
		
	});

	

	return API.post(AUDIT_SERVICE+ADD_CA_LOCATION_DETAILS, formData);
}


const getCaLocationDetails = () =>{

	const username = auth().username;


	return API.get(AUDIT_SERVICE + GET_CA_LOCATIOIN_DETAILS,{
		params:{
			id: encrypt(username)
		},
	})
}

//11
const addCAServicesDetails = (obj)=>{

	if(!Array.isArray(obj)){
		throw new Error("Error in saving data, please try after some time.");
	}

	const username = auth().username;

	let obj1 = [...obj]

	const formData = new FormData();
	formData.append("userName", encrypt(username))

	obj1.forEach((element, index) => {

        formData.append(`caServicesDetails[${index}].description`, element.description);
		formData.append(`caServicesDetails[${index}].internalOnly`, element.internalOnly)
		formData.append(`caServicesDetails[${index}].externalOnly`, element.externalOnly)
		formData.append(`caServicesDetails[${index}].aspOrgCount`, element.aspOrgCount)
		formData.append(`caServicesDetails[${index}].fileName`, element.fileName)
		if(element?.aspOrgCountFile){
			formData.append(`caServicesDetails[${index}].aspOrgCountFile`, element.aspOrgCountFile)
		}
		formData.append(`caServicesDetails[${index}].caServicesDetailsId`, element.caServicesDetailsId ? encrypt(element.caServicesDetailsId) : '')
		
	});

	return API.post(AUDIT_SERVICE+ADD_CA_SERVICE_DETAILS, formData);
}


const getCaServicesDetails = () =>{

	const username = auth().username;


	return API.get(AUDIT_SERVICE + GET_CA_SERVICE_DETAILS,{
		params:{
			id: encrypt(username)
		},
	})
}

//12
const addASPDetails = (rows) => {
	
	if(!Array.isArray(rows)){
		throw new Error("Error in saving data, please try after some time.");
	}

	const username = auth().username;
	const rowAspCount = rows.find((r) => r.id === 1) || rows[0];
	const rowAuditOverdue = rows.find((r) => r.id === 2) || rows[1];

	const aspFile = rowAspCount?.aspCountFile instanceof File
		? rowAspCount.aspCountFile
		: (rowAspCount?.aspCount instanceof File ? rowAspCount.aspCount : null);

	const auditOverdueFile = rowAuditOverdue?.aspsAuditOverdueCountFile instanceof File
		? rowAuditOverdue.aspsAuditOverdueCountFile
		: (rowAuditOverdue?.aspsAuditOverdueCount instanceof File
			? rowAuditOverdue.aspsAuditOverdueCount
			: null);

	const formData = new FormData();
	formData.append("userName", encrypt(username));

	if (rowAspCount?.aspDetailsId) {
		formData.append("aspDetailsId", encrypt(String(rowAspCount.aspDetailsId)));
	}

	formData.append("aspCountFileName", rowAspCount?.aspCountFileName ?? '');
	formData.append("aspsAuditOverdueCountFileName", rowAuditOverdue?.aspsAuditOverdueCountFileName ?? '');

	if (aspFile) {
		formData.append("aspCount", aspFile);
	}
	if (auditOverdueFile) {
		formData.append("aspsAuditOverdueCount", auditOverdueFile);
	}

	return API.post(AUDIT_SERVICE+ADD_ASP_DETAILS, formData);
}

const getASPDetails = () =>{

	const username = auth().username;


	return API.get(AUDIT_SERVICE + GET_ASP_DETAILS,{
		params:{
			id: encrypt(username)
		},
	})
}

//13
const addPublicInfoDetails = (obj)=>{

	if(!Array.isArray(obj)){
		throw new Error("Error in saving data, please try after some time.");
	}


	let obj1 = [...obj]

	const publicInfoDetails = obj1.map((row) => ({
		description: row.description,
		webLink: row.webLink,
		publicInfoDetailsId: row.dbPublicInfoDetailsId
			? encrypt(String(row.dbPublicInfoDetailsId))
			: '',
	}));

	const username = auth().username;

	let obj2 = {
			userName: encrypt(username),
			publicInfoDetails: publicInfoDetails
		}


	return API.post(AUDIT_SERVICE + ADD_PUBLIC_INFO_DETAILS, obj2);
}


const getPublicInfoDetails = () =>{

	const username = auth().username;


	return API.get(AUDIT_SERVICE + GET_PUBLIC_INFO_DETAILS,{
		params:{
			id: encrypt(username)
		},
	})
}

//14
const addCertificateDetails = (obj)=>{

	let obj1 = {...obj}


	const username = auth().username;

	obj1.userName = encrypt(username);

	if(obj1.certCostId)
		obj1.certCostId = encrypt(obj1.certCostId)


	return API.post(AUDIT_SERVICE+ADD_CERTIFICATE_COST_DETAILS, obj1);
}


const getCertificateDetails = () =>{

	const username = auth().username;


	return API.get(AUDIT_SERVICE + GET_CERTIFICATE_COST_DETAILS,{
		params:{
			id: encrypt(username)
		},
	})
}
//15
const addSelfAssessmentDetails = (obj)=>{

	let obj1 = {...obj}


	const username = auth().username;

	obj1.userName = encrypt(username);
	return API.post(AUDIT_SERVICE+ADD_SELF_ASSESSMENT_DETAILS, obj1);
}


const getSelfAssessmentDetails = () =>{

	const username = auth().username;


	return API.get(AUDIT_SERVICE + GET_SELF_ASSESSMENT_DETAILS,{
		params:{
			id: encrypt(username)
		},
	})
}


//16
const addConnectivityDetails = (obj)=>{

	if(!Array.isArray(obj)){
		throw new Error("Error in saving data, please try after some time.");
	}


	let obj1 = [...obj]

	const connectivityDetails = obj1.map((row) => ({
		...row,
		connectivityDetailsId: row.connectivityDetailsId ? encrypt(row.connectivityDetailsId) : '',
	}));

	const username = auth().username;

	let obj2 = {
			userName: encrypt(username),
			connectivityDetails: connectivityDetails
		}


	return API.post(AUDIT_SERVICE+ADD_CONNECTIVITY_DETAILS, obj2);
}


const getConnectivityDetails = () =>{

	const username = auth().username;


	return API.get(AUDIT_SERVICE + GET_CONNECTIVITY_DETAILS,{
		params:{
			id: encrypt(username)
		},
	})
}


//17
const addDownTimeDetails = (obj)=>{

	let obj1 = {...obj}
	if(obj1.downTimeId)
		obj1.downTimeId = encrypt(obj1.downTimeId)

	const username = auth().username;

	obj1.userName = encrypt(username);
	return API.post(AUDIT_SERVICE+ADD_DOWNTIME_DETAILS, obj1);
}


const getDownTimeDetails = () =>{

	const username = auth().username;


	return API.get(AUDIT_SERVICE + GET_DOWNTIME_DETAILS,{
		params:{
			id: encrypt(username)
		},
	})
}


//18
const addTrustedPerson = (obj)=>{

	if(!Array.isArray(obj)){
		throw new Error("Error in saving data, please try after some time.");
	}


	let obj1 = [...obj]

	const caTrustedPerson = obj1.map((row) => ({
		...row,
		personId: row.personId ? encrypt(row.personId) : '',
	}));

	const username = auth().username;

	let obj2 = {
			userName: encrypt(username),
			caTrustedPerson: caTrustedPerson
		}


	return API.post(AUDIT_SERVICE+ADD_TRUSTED_PERSON_DETAILS, obj2);
}


const getTrustedPersonDetails = () =>{

	const username = auth().username;


	return API.get(AUDIT_SERVICE + GET_TRUSTED_PERSON_DETAILS,{
		params:{
			id: encrypt(username)
		},
	})
}


// for Auditor/ Audit Agency role to Add,view and get the data

const getAuditorVerification = (obj) =>{

//alert(obj.apiNum);

	return API.get(AUDIT_SERVICE + GET_AUDITOR_VERIFICATION,{
		params:{
			id: encrypt(obj.userName),
			pid: encrypt(obj.apiNum)
			
		},
	})
}

const addAuditorVerification = (obj)=>{

	let obj1 = {...obj}
	obj1.userName = encrypt(obj1.userName)
	obj1.apiNumber = encrypt(obj1.apiNum)
	obj1.auditorVerification= (obj1.auditorVerification)
	return API.post(AUDIT_SERVICE+ADD_AUDITOR_VERIFICATION, obj1);
}

const changeAnnexureStatus = (userName) => {
	return API.get(AUDIT_SERVICE + CHANGE_STATUS_ANNEXURE, {
		params: {
			username: encrypt(userName),
		},
	});
}

const getAnnexureMainByUsername = (userName) => {
	return API.get(AUDIT_SERVICE + GET_ANNEXURE_MAIN_BY_USERNAME, {
		params: {
			username: encrypt(userName),
		},
	});
}

const uploadExcelSheet = (obj) =>{
	return API.post(AUDIT_SERVICE + UPLOAD_EXCELL_SHEET,obj)
}



export default{
	addAnnualAuditPeriodDetails,
	getAnnualAuditPeriodDetails,
	addInternalAuditDetails,
	getInternalAuditDetails,
	addEKYCAcMonthDetails,
	getEKYCAcMonthDetails,
	addAccountBasedDetails,
	getAccountBasedDetails,
	addRAAudit,
	getRAAudit,
	addCourtCases,
	getCourtCases,
	addRevocationDetails,
	getRevocationDetails,
	addCryptoTokenDetails,
	getCryptoTokenDetails,
	downloadCryptoTokenDocument,
	addCASoftwareDetailsDetails,
	getCASoftwareDetailsDetails,
	addLocationDetails,
	getCaLocationDetails,
	addCAServicesDetails,
	getCaServicesDetails,
	addASPDetails,
	getASPDetails,
	addPublicInfoDetails,
	getPublicInfoDetails,

	addCertificateDetails,
	getCertificateDetails,

	addSelfAssessmentDetails,
	getSelfAssessmentDetails,

	addTrustedPerson,
	getTrustedPersonDetails,
	addConnectivityDetails,
	getConnectivityDetails,
	addDownTimeDetails,
	getDownTimeDetails,
	getAuditorVerification,
	addAuditorVerification,
	changeAnnexureStatus,
	getAnnexureMainByUsername,
	uploadExcelSheet,

};
