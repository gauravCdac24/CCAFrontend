import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;
import store from '../../store';

	const DASHBOARD_SERVICE_BASE_URL = "/dashboard-service";
	const ADD_DSC_ESIGN_ISSUED = "/add-dsc-esign-issued";
	const UPDATE_DSC_ESIGN_ISSUED = "/update-dsc-esign-issued";

	const GET_ALL_DSC_ESIGN_ISSUED = "/get-all-dsc-esign-issued";
	const GET_DSC_ESIGN_ISSUED_BY_ID = "/get-dsc-esign-issued-by-id";
	const ADD_ASP_DETAILS = "/add-asp-details";
	const GET_ALL_ASP = "/get-all-asp";
	const GET_ASP_BY_ID = "/get-asp-by-id";
	const GET_ALL_ACTIVE_CA = "/get-all-active-ca";
	const GET_ALL_ACTIVE_ESP = "/get-all-active-esp";
	//
	const GET_CCA_DASHBOARD_DETAILS = "/get-cca-dshboard-details";
	const GET_TOTAL_ESIGN_AND_DSC_ISSUED = "/get-total-esign-and-dsc-issued";
	const GET_GRAPH_DATA_ESIGN_DSC = "/get-graph-data-esign-dsc";
	const GET_LICENSEE_DASHBOARD_DETAILS = "/get-licensee-dashboard-details";
	const GET_LICENSEE_GRAPH_DATA_ESIGN_DSC = "/get-licensee-graph-data-esign-dsc";
	const GET_MONTHLY_DSC_ESIGN_ISSUED = "/get-monthly-dsc-esign-issued";
	const DOWNLOAD_MONTHLY_REPORT_DSC_ESIGN_ISSUED = "/download-monthly-report-dsc-esign-issued";
	const GET_YEARLY_DSC_ESIGN_ISSUED = "/get-yearly-dsc-esign-issued";
	const DOWNLOAD_YEARLY_REPORT_DSC_ESIGN_ISSUED = "/download-yearly-report-dsc-esign-issued";
	const GET_CUSTOMIZED_PERIOD_DSC_ESIGN_ISSUED = "/get-customized-period-dsc-esign-issued";
	const DOWNLOAD_CUSTOMIZED_PERIOD_REPORT_DSC_ESIGN_ISSUED = "/download-customized-period-report-dsc-esign-issued";
	const GET_CUMULATIVE_DSC_ESIGN_ISSUED = "/get-cumulative-dsc-esign-issued";
	const DOWNLOAD_CUMULATIVE_REPORT_DSC_ESIGN_ISSUED = "/download-cumulative-report-dsc-esign-issued";
	const GET_CUSTOMIZED_CUMULATIVE_DSC_ESIGN_ISSUED = "/get-customized-cumulative-dsc-esign-issued";
	const DOWNLOAD_CUSTOMIZED_CUMULATIVE_REPORT_DSC_ESIGN_ISSUED = "/download-customized-cumulative-report-dsc-esign-issued";
	const GET_CA_ESP_LICENSING_REPORT = "/get-ca-esp-licensing-report";
	const GET_CUSTOMIZED_CA_ESP_LICENSING_REPORT = "/get-customized-ca-esp-licensing-report";
	const DOWNLOAD_CA_ESP_LICENSING_REPORT = "/download-ca-esp-licensing-report";
	const DOWNLOAD_CUSTOMIZED_CA_ESP_LICENSING_REPORT = "/download-customized-ca-esp-licensing-report";

	const GET_ANNUAL_AUDIT_INITIATED_ON_TIME = "/get-annual-audit-initiated-on-time";
	const GET_ANNUAL_AUDIT_DELAYED = "/get-annual-audit-delayed";
	const GET_ANNUAL_AUDIT_SUBMITTED_ON_TIME = "/get-annual-audit-submitted-on-time";
	const GET_ANNUAL_AUDIT_SUBMITTED_LATE = "/get-annual-audit-submitted-late";
	const GET_ANNUAL_AUDIT_CLOSURE_REPORT = "/get-annual-audit-closure-report";

	const DOWNLOAD_ANNUAL_AUDIT_INITIATED_ON_TIME = "/download-annual-audit-initiated-on-time";
	const DOWNLOAD_ANNUAL_AUDIT_DELAYED = "/download-annual-audit-delayed";
	const DOWNLOAD_ANNUAL_AUDIT_SUBMITTED_ON_TIME = "/download-annual-audit-submitted-on-time";
	const DOWNLOAD_ANNUAL_AUDIT_SUBMITTED_LATE = "/download-annual-audit-submitted-late";
	const DOWNLOAD_ANNUAL_AUDIT_CLOSURE_REPORT = "/download-annual-audit-closure-report";

	const GET_AUDIT_CONDUCTED_BY_AUDIT_AGENCY = "/get-audit-conducted-by-audit-agency";
	const DOWNLOAD_AUDIT_CONDUCTED_BY_AUDIT_AGENCY = "/download-audit-conducted-by-audit-agency";

	const GET_CA_LICENSE_DUE_FOR_RENEWAL = "/get-ca-license-due-for-renewal";
	const DOWNLOAD_CA_LICENSE_DUE_FOR_RENEWAL = "/download-ca-license-due-for-renewal";

	const GET_CA_DETAILS = "/get-ca-details";
	const DOWNLOAD_CA_DETAILS = "/download-ca-details";
	
	const GET_CA_SITE_LOCATIONS = "/get-ca-site-locations";
	const DOWNLOAD_CA_SITE_LOCATIONS = "/download-ca-site-locations";
	
	const GET_AUDIT_AGENCY_DETAILS = "/get-audit-agency-details";
	const DOWNLOAD_AUDIT_AGENCY_DETAILS = "/download-audit-agency-details";

	const GET_ALL_DSC_ESIGN_ISSUED_BY_YEAR_MONTH_AND_USERNAME = "/get-by-year-month-username";
	const VIEW_ALL_DSC_ESIGN_ISSUED = "/view-all-dsc-esign-issued";

	const sconfig={
		headers: {
			'Content-Type': 'application/octet-stream',
		},
	}

    const auth = () => {
        const state = store.getState();
        return state.jwtAuthentication;
      }

	  const getGraphDataEsignDSC = (obj)=>{
		return API.post(DASHBOARD_SERVICE_BASE_URL + GET_GRAPH_DATA_ESIGN_DSC, obj);
	}


	const addDSCeSign = (obj, selectedMonth, selectedYear, files) => {
		const username = auth().username;
	
		const list = obj.map((row) => ({
			...row,
			countryId: encrypt(row.countryId),
			stateId: encrypt(row.stateId),
		}));
	
		const formData = new FormData();
		formData.append("caUsername", encrypt(username));
		formData.append("month", selectedMonth);
		formData.append("year", selectedYear);
		
		if(list.length>0){
			list.forEach((item, index)=>{

				formData.append(`dscesignList[${index}].countryId`, item.countryId);
				formData.append(`dscesignList[${index}].stateId`, item.stateId);
				formData.append(`dscesignList[${index}].dscIssued`, item.dscIssued);
				formData.append(`dscesignList[${index}].eSignIssued`, item.eSignIssued);
			});
		}

		if(files.length > 0){
			files.forEach((item, index) => {
				if(item?.file)
					formData.append(`ldifFile[${index}].file`, item.file);
			});
		}
	
		return API.post(DASHBOARD_SERVICE_BASE_URL + ADD_DSC_ESIGN_ISSUED, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
	};
	

	const updateDSCeSign = (obj, selectedMonth, selectedYear) => {
		const username = auth().username;
	
		
		const list = obj.map((row) => ({
			...row,
			dscesignIssuedId: encrypt(row.dscesignIssuedId),
			countryId: encrypt(row.countryId),
			stateId: encrypt(row.stateId),
		}));
	
		
		const payload = {
			caUsername: encrypt(username),
			dscesignList: list,
			month: selectedMonth,
			year: selectedYear,
		};
	
		
		return API.post(DASHBOARD_SERVICE_BASE_URL + UPDATE_DSC_ESIGN_ISSUED, payload);
	};
	

	const addASPDetails = (obj)=>{
        const username = auth().username;
        let obj1= {...obj}
        obj1.caUsername = encrypt(username);
		obj1.countryId = encrypt(obj.countryId)
		obj1.stateId = encrypt(obj.stateId)
		return API.post(DASHBOARD_SERVICE_BASE_URL + ADD_ASP_DETAILS, obj1);
	}

	const updateASPDetails = (obj)=>{
        const username = auth().username;
        let obj1= {...obj}
        obj1.caUsername = encrypt(username);
		obj1.aspId = encrypt(obj.aspId)
		obj1.countryId = encrypt(obj.countryId)
		obj1.stateId = encrypt(obj.stateId)
		return API.post(DASHBOARD_SERVICE_BASE_URL + ADD_ASP_DETAILS, obj1);
	}

	const getAllASP = () =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + GET_ALL_ASP);
	}

	const getAllDSCeSignIssued = () =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + GET_ALL_DSC_ESIGN_ISSUED);
	}

	const getASPByID = (id) =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + GET_ASP_BY_ID,{
			params:{
				id:encrypt(id)
			}
		})
	}

	const getDSCeSignIssuedByID = (id) =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + GET_DSC_ESIGN_ISSUED_BY_ID,{
			params:{
				id:encrypt(id)
			}
		})
	}


	///

	const getCCADashboardDetails = () => {
		return API.get(DASHBOARD_SERVICE_BASE_URL + GET_CCA_DASHBOARD_DETAILS);
	}


	const getAllActiveCA = () => {
		return API.get(DASHBOARD_SERVICE_BASE_URL + GET_ALL_ACTIVE_CA);
	}

	const getAllActiveESP = () => {
		return API.get(DASHBOARD_SERVICE_BASE_URL + GET_ALL_ACTIVE_ESP);
	}

	const getTotalDSCEsignIssued = () => {
		return API.get(DASHBOARD_SERVICE_BASE_URL + GET_TOTAL_ESIGN_AND_DSC_ISSUED);
	}


	const getLicenseeDashboardDetails = () =>{
		const username = auth().username;
		return API.get(DASHBOARD_SERVICE_BASE_URL + GET_LICENSEE_DASHBOARD_DETAILS,{
			params:{
				id:encrypt(username)
			}
		})
	}

	const getLicenseeGraphDataEsignDSC = (obj)=>{
		return API.post(DASHBOARD_SERVICE_BASE_URL + GET_LICENSEE_GRAPH_DATA_ESIGN_DSC, obj);
	}
	
	const getMonthlyDSCEsignData = (month, year) =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + GET_MONTHLY_DSC_ESIGN_ISSUED,{
			params:{
				id: encrypt(month),
				pid: encrypt(year)
			}
		})
	}

	const downloadMonthlyDSCEsignDataReport = (month, year) =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + DOWNLOAD_MONTHLY_REPORT_DSC_ESIGN_ISSUED,{
			params:{
				id: encrypt(month),
				pid: encrypt(year)
			},
			responseType: 'blob', 
			...sconfig
		})
	}

	const getYearlyDSCEsignData = (year) =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + GET_YEARLY_DSC_ESIGN_ISSUED,{
			params:{
				id: encrypt(year)
			}
		})
	}

	const downloadYearlyDSCEsignDataReport = (year) =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + DOWNLOAD_YEARLY_REPORT_DSC_ESIGN_ISSUED,{
			params:{
				id: encrypt(year)
			},
			responseType: 'blob', 
			...sconfig
		})
	}


	const getCustomizedPeriodReportOnDSCEsignData = (month, year, month1, year1) =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + GET_CUSTOMIZED_PERIOD_DSC_ESIGN_ISSUED,{
			params:{
				id: encrypt(month),
				pid: encrypt(year),
				qid: encrypt(month1),
				rid: encrypt(year1)
			}
		})
	}

	const downloadCustomizedPeriodDSCEsignDataReport = (month, year, month1, year1) =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + DOWNLOAD_CUSTOMIZED_PERIOD_REPORT_DSC_ESIGN_ISSUED,{
			params:{
				id: encrypt(month),
				pid: encrypt(year),
				qid: encrypt(month1),
				rid: encrypt(year1)
			},
			responseType: 'blob', 
			...sconfig
		})
	}


	const getCumulativeReportOnDSCEsignData = (month, year) =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + GET_CUMULATIVE_DSC_ESIGN_ISSUED,{
			params:{
				id: encrypt(month),
				pid: encrypt(year),
			}
		})
	}

	const downloadCumulativeDSCEsignDataReport = (month, year) =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + DOWNLOAD_CUMULATIVE_REPORT_DSC_ESIGN_ISSUED,{
			params:{
				id: encrypt(month),
				pid: encrypt(year),
			},
			responseType: 'blob', 
			...sconfig
		})
	}


	const getCustomizedCumulativeReportOnDSCEsignData = (month, year, month1, year1) =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + GET_CUSTOMIZED_CUMULATIVE_DSC_ESIGN_ISSUED,{
			params:{
				id: encrypt(month),
				pid: encrypt(year),
				qid: encrypt(month1),
				rid: encrypt(year1)
			}
		})
	}

	const downloadCustomizedCumulativeDSCEsignDataReport = (month, year, month1, year1) =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + DOWNLOAD_CUSTOMIZED_CUMULATIVE_REPORT_DSC_ESIGN_ISSUED,{
			params:{
				id: encrypt(month),
				pid: encrypt(year),
				qid: encrypt(month1),
				rid: encrypt(year1)
			},
			responseType: 'blob', 
			...sconfig
		})
	}

	const getCustomizedLicensingReport = (fromdate, todate) =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + GET_CUSTOMIZED_CA_ESP_LICENSING_REPORT,{
			params:{
				id: encrypt(fromdate),
				pid: encrypt(todate)
			}
		})
	}

	const getLicensingReport = () => {
		return API.get(DASHBOARD_SERVICE_BASE_URL + GET_CA_ESP_LICENSING_REPORT);
	}

	const downloadCustomizedLicensingReport = (fromdate, todate) =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + DOWNLOAD_CUSTOMIZED_CA_ESP_LICENSING_REPORT,{
			params:{
				id: encrypt(fromdate),
				pid: encrypt(todate)
			},
			responseType: 'blob', 
			...sconfig
		})
	}

	const downloadLicensingReport = () => {
		return API.get(DASHBOARD_SERVICE_BASE_URL + DOWNLOAD_CA_ESP_LICENSING_REPORT, {
			responseType: 'blob', 
			...sconfig});
	}
	const getAnnualAuditInitiatedOnTime = () =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + GET_ANNUAL_AUDIT_INITIATED_ON_TIME);
	}
	const getAnnualAuditDelayed = () =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + GET_ANNUAL_AUDIT_DELAYED);
	}
	const getAnnualAuditSubmittedOnTime = () =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + GET_ANNUAL_AUDIT_SUBMITTED_ON_TIME);
	}
	const getAnnualAuditSubmittedLate = () =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + GET_ANNUAL_AUDIT_SUBMITTED_LATE);
	}
	const getAnnualAuditClosureReport = () =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + GET_ANNUAL_AUDIT_CLOSURE_REPORT);
	}


	const downloadAnnualAuditInitiatedOnTime = () =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + DOWNLOAD_ANNUAL_AUDIT_INITIATED_ON_TIME, {
			responseType: 'blob', 
			...sconfig});
	}
	const downloadAnnualAuditDelayed = () =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + DOWNLOAD_ANNUAL_AUDIT_DELAYED, {
			responseType: 'blob', 
			...sconfig});
	}
	const downloadAnnualAuditSubmittedOnTime = () =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + DOWNLOAD_ANNUAL_AUDIT_SUBMITTED_ON_TIME, {
			responseType: 'blob', 
			...sconfig});
	}
	const downloadAnnualAuditSubmittedLate = () =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + DOWNLOAD_ANNUAL_AUDIT_SUBMITTED_LATE, {
			responseType: 'blob', 
			...sconfig});
	}
	const downloadAnnualAuditClosureReport = () =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + DOWNLOAD_ANNUAL_AUDIT_CLOSURE_REPORT, {
			responseType: 'blob', 
			...sconfig});
	}

	const getAuditConductedByAuditAgency = (aid, fid, tid) =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + GET_AUDIT_CONDUCTED_BY_AUDIT_AGENCY,{
			params:{
				id: encrypt(aid),
				pid: encrypt(fid),
				qid: encrypt(tid)
			}
		})
	}

	const downloadAuditConductedByAuditAgency = (aid, fid, tid) =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + DOWNLOAD_AUDIT_CONDUCTED_BY_AUDIT_AGENCY,{
			params:{
				id: encrypt(aid),
				pid: encrypt(fid),
				qid: encrypt(tid)
			},
			responseType: 'blob', 
			...sconfig
		})
	}


	const getCALicenseDueForRenewal = () =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + GET_CA_LICENSE_DUE_FOR_RENEWAL);
	}


	const downloadCALicenseDueForRenewal = () =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + DOWNLOAD_CA_LICENSE_DUE_FOR_RENEWAL, {
			responseType: 'blob', 
			...sconfig});
	}


	const getCADetails = () =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + GET_CA_DETAILS);
	}


	const downloadCADetails = () =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + DOWNLOAD_CA_DETAILS, {
			responseType: 'blob', 
			...sconfig});
	}

	const getAuditAgencyDetails = () =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + GET_AUDIT_AGENCY_DETAILS);
	}


	const downloadAuditAgencyDetails = () =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + DOWNLOAD_AUDIT_AGENCY_DETAILS, {
			responseType: 'blob', 
			...sconfig});
	}

	const getCASiteLocations = () =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + GET_CA_SITE_LOCATIONS);
	}


	const downloadCASiteLocations = () =>{
		return API.get(DASHBOARD_SERVICE_BASE_URL + DOWNLOAD_CA_SITE_LOCATIONS, {
			responseType: 'blob', 
			...sconfig});
	}


	const getAllDSCeSignIssuedByYearMonthAndUsername = (month, year) =>{

		const username = auth().username;

		return API.get(DASHBOARD_SERVICE_BASE_URL + GET_ALL_DSC_ESIGN_ISSUED_BY_YEAR_MONTH_AND_USERNAME,{
			params:{
				id: encrypt(username),
				pid: encrypt(month),
				qid: encrypt(year),
			}
		})
	}

	const viewAllDSCeSignIssued = () =>{
		const username = auth().username;

		return API.get(DASHBOARD_SERVICE_BASE_URL + VIEW_ALL_DSC_ESIGN_ISSUED,{
			params:{
				id: encrypt(username),
			}
		});
	}


export default{
    addDSCeSign,
	addASPDetails,
	getAllASP,
	getAllDSCeSignIssued,
	getASPByID,
	getDSCeSignIssuedByID,
	updateDSCeSign,
	updateASPDetails,
	getCCADashboardDetails,
	getAllActiveCA,
	getAllActiveESP,
	getTotalDSCEsignIssued,
	getGraphDataEsignDSC,
	getLicenseeDashboardDetails,
	getLicenseeGraphDataEsignDSC,
	getMonthlyDSCEsignData,
	downloadMonthlyDSCEsignDataReport,
	getYearlyDSCEsignData,
	downloadYearlyDSCEsignDataReport,
	getCustomizedPeriodReportOnDSCEsignData,
	downloadCustomizedPeriodDSCEsignDataReport,
	getCumulativeReportOnDSCEsignData,
	downloadCumulativeDSCEsignDataReport,
	getCustomizedCumulativeReportOnDSCEsignData,
	downloadCustomizedCumulativeDSCEsignDataReport,
	getCustomizedLicensingReport,
	getLicensingReport,
	downloadCustomizedLicensingReport,
	downloadLicensingReport,
	getAnnualAuditInitiatedOnTime,
	getAnnualAuditDelayed,
	getAnnualAuditSubmittedOnTime,
	getAnnualAuditSubmittedLate,
	getAnnualAuditClosureReport,
	downloadAnnualAuditInitiatedOnTime,
	downloadAnnualAuditDelayed,
	downloadAnnualAuditSubmittedOnTime,
	downloadAnnualAuditSubmittedLate,
	downloadAnnualAuditClosureReport,
	getAuditConductedByAuditAgency,
	downloadAuditConductedByAuditAgency,
	getCALicenseDueForRenewal,
	downloadCALicenseDueForRenewal,
	getCADetails,
	downloadCADetails,
	getAuditAgencyDetails,
	downloadAuditAgencyDetails,
	getCASiteLocations,
	downloadCASiteLocations,
	getAllDSCeSignIssuedByYearMonthAndUsername,
	viewAllDSCeSignIssued
};
