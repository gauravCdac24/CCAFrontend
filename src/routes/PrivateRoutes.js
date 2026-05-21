import {lazy} from "react";
import { Navigate } from "react-router-dom";
import PrivateRoute from "./util/PrivateRoute";
import MainLayout from "../layout/MainLayout";
import { useSelector } from "react-redux";


//Admin Service

//Dashboard

const AdminReports = lazy(()=>import('../components/admin/pages/Reports'))

//Country
const Country = lazy(()=>import('../components/admin/pages/LocationMaster/Country/Country'))
const AddCountry = lazy(()=>import('../components/admin/pages/LocationMaster/Country/AddCountry'))
const EditCountry = lazy(()=>import('../components/admin/pages/LocationMaster/Country/EditCountry'))

//Audit Criteria
const AuditCriteria = lazy(()=>import('../components/admin/pages/AuditMaster/AuditCriteria/AuditCriteria'))
const AddAuditCriteria = lazy(()=>import('../components/admin/pages/AuditMaster/AuditCriteria/AddAuditCriteria'))
const EditAuditCriteria = lazy(()=>import('../components/admin/pages/AuditMaster/AuditCriteria/EditAuditCriteria'))

//Audit Sub Criteria
const AuditSubCriteria = lazy(()=>import('../components/admin/pages/AuditMaster/AuditSubCriteria/AuditSubCriteria'))
const AddAuditSubCriteria = lazy(()=>import('../components/admin/pages/AuditMaster/AuditSubCriteria/AddAuditSubCriteria'))
const EditAuditSubCriteria = lazy(()=>import('../components/admin/pages/AuditMaster/AuditSubCriteria/EditAuditSubCriteria'))

//Audit Parameter
const AuditParameter = lazy(()=>import('../components/admin/pages/AuditMaster/AuditParameter/AuditParameter'))
const AddAuditParameter = lazy(()=>import('../components/admin/pages/AuditMaster/AuditParameter/AddAuditParameter'))
const EditAuditParameter = lazy(()=>import('../components/admin/pages/AuditMaster/AuditParameter/EditAuditParameter'))

//Audit Control Type
const AuditControlType = lazy(()=>import('../components/admin/pages/AuditMaster/AuditControlType/AuditControlType'))
const AddAuditControlType = lazy(()=>import('../components/admin/pages/AuditMaster/AuditControlType/AddAuditControlType'))
const EditAuditControlType = lazy(()=>import('../components/admin/pages/AuditMaster/AuditControlType/EditAuditControlType'))


//Audit Check
const AuditCheck = lazy(()=>import('../components/admin/pages/AuditMaster/AuditCheck/AuditCheck'))
const AddAuditCheck = lazy(()=>import('../components/admin/pages/AuditMaster/AuditCheck/AddAuditCheck'))
const EditAuditCheck = lazy(()=>import('../components/admin/pages/AuditMaster/AuditCheck/EditAuditCheck'))

//Audit Control
const AuditControl = lazy(()=>import('../components/admin/pages/AuditMaster/AuditControl/AuditControl'))
const AddAuditControl = lazy(()=>import('../components/admin/pages/AuditMaster/AuditControl/AddAuditControl'))
const EditAuditControl = lazy(()=>import('../components/admin/pages/AuditMaster/AuditControl/EditAuditControl'))


//Audit Agency
const AuditAgency = lazy(()=>import('../components/admin/pages/AuditAgency/AuditAgency'))
const AuditAgencyRegistrationForm = lazy(()=>import('../components/admin/pages/AuditAgency/AuditAgencyForm'))
const EditAuditAgencyForm = lazy(()=>import('../components/admin/pages/AuditAgency/EditAuditAgency'))

//User Management
const IntentManagement = lazy(()=>import('../components/admin/pages/UserManagement/Intent_Mangement/Intent'))
const AuditAgencyManagement = lazy(()=>import('../components/admin/pages/UserManagement/Audit_Agency_mangement/AuditAgency'))

//Role
const Role = lazy(()=>import('../components/admin/pages/AssignedRoleManagement/Role'))
const AddRole = lazy(()=>import('../components/admin/pages/AssignedRoleManagement/AddRole'))
const EditRole = lazy(()=>import('../components/admin/pages/AssignedRoleManagement/EditRole'))
const ViewRole=lazy(()=>import('../components/admin/pages/AssignedRoleManagement/ViewRoleDetails'))
//State
const State = lazy(()=>import('../components/admin/pages/LocationMaster/State/State'))
const EditState = lazy(()=>import('../components/admin/pages/LocationMaster/State/EditState'))
const AddState = lazy(()=>import('../components/admin/pages/LocationMaster/State/AddState'))

//City
const City = lazy(()=>import('../components/admin/pages/LocationMaster/City/City'))
const AddCity = lazy(()=>import('../components/admin/pages/LocationMaster/City/AddCity'))
const EditCity = lazy(()=>import('../components/admin/pages/LocationMaster/City/EditCity'))


//Document
const Document = lazy(()=>import('../components/admin/pages/DocumentMaster/Document'))
const AddDocument = lazy(()=>import('../components/admin/pages/DocumentMaster/AddDocument'))
const EditDocument = lazy(()=>import('../components/admin/pages/DocumentMaster/EditDocument'))

//CPSDoc
const CPSDoc = lazy(()=>import('../components/admin/pages/CPSDocument/CPSDoc'))
const EditCPSDoc = lazy(()=>import('../components/admin/pages/CPSDocument/EditCPSDoc'))
const AddCPSDoc = lazy(()=>import('../components/admin/pages/CPSDocument/AddCPSDoc'))

//Minimum Attempt
const MinimumAttempt = lazy(()=>import('../components/admin/pages/MinimumAttempts/MinimumAttempts'))
const AddMinimumAttempt = lazy(()=>import('../components/admin/pages/MinimumAttempts/AddMinimumAttempts'))
const EditMinimumAttempt = lazy(()=>import('../components/admin/pages/MinimumAttempts/EditMinimumAttempt'))

//Role Master
const RoleMaster = lazy(()=>import('../components/admin/pages/MenuManagement/RoleMaster/RoleMaster'))
const AddRoleMaster = lazy(()=>import('../components/admin/pages/MenuManagement/RoleMaster/AddRoleMaster'))
const EditRoleMaster = lazy(()=>import('../components/admin/pages/MenuManagement/RoleMaster/EditRoleMaster'))

//Menu Master
const MenuMaster = lazy(()=>import('../components/admin/pages/MenuManagement/MenuMaster/MenuMaster'))
const AddMenuMaster = lazy(()=>import('../components/admin/pages/MenuManagement/MenuMaster/AddMenuMaster'))
const EditMenuMaster = lazy(()=>import('../components/admin/pages/MenuManagement/MenuMaster/EditMenuMaster'))

//Sub Menu Master
const SubMenuMaster = lazy(()=>import('../components/admin/pages/MenuManagement/SubMenuMaster/SubMenuMaster'))
const AddSubMenuMaster = lazy(()=>import('../components/admin/pages/MenuManagement/SubMenuMaster/AddSubMenuMaster'))
const EditSubMenuMaster = lazy(()=>import('../components/admin/pages/MenuManagement/SubMenuMaster/EditSubMenuMaster'))

//Sub Menu Internal Master
const SubMenuInternalMaster = lazy(()=>import('../components/admin/pages/MenuManagement/SubMenuInternalMaster/SubMenuInternalMaster'))
const AddSubMenuInternalMaster = lazy(()=>import('../components/admin/pages/MenuManagement/SubMenuInternalMaster/AddSubMenuInternalMaster'))
const EditSubMenuInternalMaster = lazy(()=>import('../components/admin/pages/MenuManagement/SubMenuInternalMaster/EditSubMenuInternalMaster'))

//Intent Unique Code
const IntentUniqueCode = lazy(()=>import('../components/admin/pages/IntentUniqueCode/IntentUniqueCode'))
const AddIntentUniqueCode = lazy(()=>import('../components/admin/pages/IntentUniqueCode/AddIntentUniqueCode'))
const EditIntentUniqueCode = lazy(()=>import('../components/admin/pages/IntentUniqueCode/EditIntentUniqueCode'))

//New License Service

const ApplicationForm = lazy(()=>import('../components/applicant/pages/ApplicationForm/ApplicationForm'))
const AddApplicationForm = lazy(()=>import('../components/applicant/pages/ApplicationForm/AddApplicationForm'))
const NCAuditorControl = lazy(()=>import('../components/applicant/pages/ApplicationForm/AuditorControls'))
const ApplicationAuditorControl = lazy(()=>import('../components/applicant/pages/ApplicationForm/ApplicationAuditControls'))

//Applicant Dashboard
const ApplicantDashboard = lazy(()=>import('../components/applicant/pages/Dashboard/Dashboard'))


//Aplication Type
const ApplicationType = lazy(()=>import('../components/admin/pages/LicenseServiceMaster/ApplicationTypeMaster/ApplicationType'))
const AddApplicationType = lazy(()=>import('../components/admin/pages/LicenseServiceMaster/ApplicationTypeMaster/AddApplicationType'))
const EditApplicationType = lazy(()=>import('../components/admin/pages/LicenseServiceMaster/ApplicationTypeMaster/EditApplicationType'))

//Service
const Service = lazy(()=>import('../components/admin/pages/LicenseServiceMaster/ServiceMaster/Service'))
const AddService = lazy(()=>import('../components/admin/pages/LicenseServiceMaster/ServiceMaster/AddService'))
const EditService = lazy(()=>import('../components/admin/pages/LicenseServiceMaster/ServiceMaster/EditService'))

//Sub Service
const SubService = lazy(()=>import('../components/admin/pages/LicenseServiceMaster/SubServiceMaster/SubService'))
const AddSubService = lazy(()=>import('../components/admin/pages/LicenseServiceMaster/SubServiceMaster/AddSubService'))
const EditSubService = lazy(()=>import('../components/admin/pages/LicenseServiceMaster/SubServiceMaster/EditSubService'))

//Undertaking
const Undertaking = lazy(()=>import('../components/admin/pages/LicenseServiceMaster/UndertakingMaster/Undertaking'))
const AddUndertaking = lazy(()=>import('../components/admin/pages/LicenseServiceMaster/UndertakingMaster/AddUndertaking'))
const EditUndertaking = lazy(()=>import('../components/admin/pages/LicenseServiceMaster/UndertakingMaster/EditUndertaking'))


//CCA Staff
const CCAStaff = lazy(()=>import('../components/admin/pages/CCAStaff/CCAStaff'))
const AddCCAStaff = lazy(()=>import('../components/admin/pages/CCAStaff/AddCCAStaff'))
const EditCCAStaff = lazy(()=>import('../components/admin/pages/CCAStaff/EditCCAStaff'))

//ReviewCommiteePage
const NewApplication = lazy(()=>import('../components/ReviewCommitteePage/NewApplicationForm/NewApplicationForm'))
const ReviewNCReport = lazy(()=>import('../components/ReviewCommitteePage/ReviewNCReport/ViewApplicationForm'))
const ReviewNCReports = lazy(()=>import('../components/ReviewCommitteePage/ReviewNCReport/AuditorControls'))
// const AddCCAStaff = lazy(()=>import('../components/admin/pages/CCAStaff/AddCCAStaff'))
// const EditCCAStaff = lazy(()=>import('../components/admin/pages/CCAStaff/EditCCAStaff'))

//CCA

const NewApplicationRecommended = lazy(()=>import('../components/cca/pages/RecommendedApplication/NewApplication'));
const RenewalApplicationRecommended = lazy(()=>import('../components/cca/pages/RecommendedApplication/RenewalApplication'));
const IssueNewLicense = lazy(()=>import('../components/cca/pages/IssueLicense/NewApplication'));
const AuditorLicense = lazy(()=>import('../components/cca/pages/AuditOfLicense/ViewApplicationForm'));
const AuditorDetailsFromCCA = lazy(()=>import('../components/cca/pages/AuditOfLicense/AuditorDetails'));
const SendToRejection = lazy(()=>import('../components/cca/pages/AuditOfLicense/SendToRejection'));
const CessationUndertakingFromCCA = lazy(()=>import('../components/cca/pages/CessationUndertaking/ApproveApplications'));
const ViewCessationUndertakingFromCCA = lazy(()=>import('../components/cca/pages/CessationUndertaking/ViewCessationApplication'));
const AproveCessationUndertakingFromCCA = lazy(()=>import('../components/cca/pages/ApproveCessation/ApproveApplications'));
const ViewAproveCessationUndertakingFromCCA = lazy(()=>import('../components/cca/pages/ApproveCessation/ViewCessationApplication'));
const AllCessationUndertakingFromCCA = lazy(()=>import('../components/cca/pages/AllCessationApplication/ApproveApplications'));
const ViewAllCessationUndertakingFromCCA = lazy(()=>import('../components/cca/pages/AllCessationApplication/ViewCessationApplication'));

// Audit Agency

const ReviewReport = lazy(()=>import('../components/AuditAgency/ReviewNCReport/ViewApplicationForm'))
const ReviewReports = lazy(()=>import('../components/AuditAgency/ReviewNCReport/AuditorControls'))


//CCA Officer

const NewApplicationListForOfficeOfCCA = lazy(()=>import('../components/ccaofficer/pages/ApplicationForm/NewApplication'));
const RenewalApplicationListForOfficeOfCCA = lazy(()=>import('../components/ccaofficer/pages/ApplicationForm/RenewalApplication'));
const CessationApplication = lazy(()=>import('../components/ccaofficer/pages/CessationApplication/ApproveApplications'));
const ApproveNoticeFile = lazy(()=>import('../components/ccaofficer/pages/CessationApplication/ApproveNoticeFile'));
const ApproveCessationUndertaking = lazy(()=>import('../components/ccaofficer/pages/CessationUndertaking/ViewCessationApplication'));
const CessationUndertaking = lazy(()=>import('../components/ccaofficer/pages/CessationUndertaking/ApproveApplications'));
const AllCessationUndertakingFromCCAOfficer = lazy(()=>import('../components/ccaofficer/pages/AllCessationApplication/ApproveApplications'));
const ViewAllCessationUndertakingFromCCAOfficer = lazy(()=>import('../components/ccaofficer/pages/AllCessationApplication/ViewCessationApplication'));


//Licensee
const ViewLicense = lazy(()=> import('../components/licensee/pages/ViewLicense'));
const RenewalLicense=lazy(()=>import('../components/licensee/pages/RenewalPages/ApplicationForm'))
const RenewApplication=lazy(()=>import('../components/ReviewCommitteePage/RenewApplicationForm/ViewNewApplicationForm'))
const ApplyForCessation=lazy(()=>import('../components/licensee/pages/CessationLicense/LicenseCessationChecklist'))
const EditLicenseCessationChecklist=lazy(()=>import('../components/licensee/pages/CessationLicense/EditLicenseCessationChecklist'))
const RenewalPages=lazy(()=>import('../components/licensee/pages/RenewalPages/AddApplicationForm'))


//Esign API Specification
const EsignAPISpecification = lazy(()=>import('../components/admin/pages/EsignAPISpecification/EsignAPISpecification'))
const AddEsignAPISpecification = lazy(()=>import('../components/admin/pages/EsignAPISpecification/AddEsignAPISpecification'))
const EditEsignAPISpecification = lazy(()=>import('../components/admin/pages/EsignAPISpecification/EditEsignAPISpecification'))

//Esign Doc Type
const EsignDocType = lazy(()=>import('../components/admin/pages/EsignDocType/EsignDocType'))
const AddEsignDocType = lazy(()=>import('../components/admin/pages/EsignDocType/AddEsignDocType'))
const EditEsignDocType = lazy(()=>import('../components/admin/pages/EsignDocType/EditEsignDocType'))


//EKYC Mode
const EKYCMode = lazy(()=>import('../components/admin/pages/EKYCMode/EKYCMode'))
const AddEKYCMode = lazy(()=>import('../components/admin/pages/EKYCMode/AddEKYCMode'))
const EditEKYCMode = lazy(()=>import('../components/admin/pages/EKYCMode/EditEKYCMode'))

//API Version
const ESignAPIVersion = lazy(()=>import('../components/admin/pages/ESignAPIVersion/ESignAPIVersion'))
const AddESignAPIVersion = lazy(()=>import('../components/admin/pages/ESignAPIVersion/AddESignAPIVersion'))
const EditESignAPIVersion = lazy(()=>import('../components/admin/pages/ESignAPIVersion/EditESignAPIVersion'))

//ESP Application
const ESPApplication = lazy(()=>import('../components/licensee/pages/ESPApplication/ESPApplication'))

//---------> CCA Officer
const ESPUnderReviewApplicationsCCAOff = lazy(()=>import('../components/ccaofficer/pages/ESPApplication/UnderReviewApplications'))
const ViewESPApplicationCCAOff = lazy(()=>import('../components/ccaofficer/pages/ESPApplication/ViewESPApplication'))

//----------> CCA
const EspApplicationRecommandedForRejectionCCA = lazy(()=>import('../components/cca/pages/ESPApplication/RecommandedForRejection'))
const EspRjectionAppViewDetailsCCA = lazy(()=>import('../components/cca/pages/ESPApplication/ViewESPApplication'))

const EspApplicationRecommendedForeSignGoLiveCCA = lazy(()=>import('../components/cca/pages/ESPApplication/Recommended Application/RecommandedForeSignGoLive'))
const ViewRecommendedForeSignGoLiveApplicationCCA = lazy(()=>import('../components/cca/pages/ESPApplication/Recommended Application/ViewRecommandedApplication'))

const ViewRejectedApplicationCCA = lazy(()=>import('../components/cca/pages/ESPApplication/Rejected Application/RejectedApplication'))
const ViewRejectedPreviousReviewedApplicationCCA = lazy(()=>import('../components/cca/pages/ESPApplication/Rejected Application/ViewPreviousReviewedApplication'))

const ViewExpiredApplicationCCA = lazy(()=>import('../components/cca/pages/ESPApplication/Expired Application/ExpiredApplication'))
const ViewExpiredPreviousReviewedApplicationCCA = lazy(()=>import('../components/cca/pages/ESPApplication/Expired Application/ViewPreviousReviewedApplication'))

const ViewApprovedApplicationCCA = lazy(()=>import('../components/cca/pages/ESPApplication/Approved Application/ApprovedApplication'))
const ViewApprovedPreviousReviewedApplicationCCA = lazy(()=>import('../components/cca/pages/ESPApplication/Approved Application/ViewPreviousReviewedApplication'))



// upload undertaking by audit agency
const UploadUndertaking = lazy(()=>import('../components/AuditAgency/UploadUndertaking/ViewApplicationForm'))
const AuditorDetails = lazy(()=>import('../components/AuditAgency/UploadUndertaking/AuditorDetails'))
const AuditorControls = lazy(()=>import('../components/AuditAgency/UploadUndertaking/AuditorControls'))
const NCClosureReport= lazy(()=>import('../components/AuditAgency/UploadUndertaking/ActionTakenByApplicant'))


//DSCeSign Details
const DSCeSignIssued = lazy(()=>import('../components/dashboard/DSCeSign/DSCeSignIssued'))
const AddDSCeSignIssued = lazy(()=>import('../components/dashboard/DSCeSign/AddDSCeSignIssued'))
const EditDSCeSignIssued = lazy(()=>import('../components/dashboard/DSCeSign/EditDSCeSignIssued'))

//ASP Details
const ASP = lazy(()=>import('../components/dashboard/ASPDetails/ASP'))
const AddASP = lazy(()=>import('../components/dashboard/ASPDetails/AddASP'))
const EditASP = lazy(()=>import('../components/dashboard/ASPDetails/EditASP'))




//Dashboards
const CCADashboard = lazy(()=>import('../components/dashboard/Dashboards/CCA/CCADashboard'));
const CCAOfficerDashboard = lazy(()=>import('../components/dashboard/Dashboards/CCAOfficer/CCAOfficerDashboard'));
const AdminDashboard = lazy(()=>import('../components/dashboard/Dashboards/Admin/AdminDashboard'));
const LicenseeDashboard = lazy(()=>import('../components/dashboard/Dashboards/Licensee/LicenseeDashboard'));

const LicenseeASPList = lazy(()=>import('../components/dashboard/Dashboards/Licensee/ViewASP'));
const LicenseeDSCIssued = lazy(()=>import('../components/dashboard/Dashboards/Licensee/ViewDSCIssued'));
const LicenseeEsignIssued = lazy(()=>import('../components/dashboard/Dashboards/Licensee/ViewEsignIssued'));

const RegisteredCADashboard = lazy(()=>import('../components/dashboard/Global/RegisteredCA'));
const EsignIssuedDashboard = lazy(()=>import('../components/dashboard/Global/EsignIssued'));
const DSCIssuedDashboard = lazy(()=>import('../components/dashboard/Global/DSCIssued'));
const RegisteredESPDashboard = lazy(()=>import('../components/dashboard/Global/RegisteredESP'));


const ViewHistory = lazy(()=>import('../components/admin/pages/ViewHistory/RegisteredCA'))
const LicenseeHistory = lazy(()=>import('../components/admin/pages/ViewHistory/ViewHistory'))

//Reports

const CCAOfficerReports = lazy(()=>import('../components/dashboard/Dashboards/CCAOfficer/CCAOfficerReports'));
const MonthlyDSCEsignReport = lazy(()=>import('../components/dashboard/Dashboards/CCAOfficer/Reports/DSCeSign/MonthlyReport'));
const YearlyDSCEsignReport = lazy(()=>import('../components/dashboard/Dashboards/CCAOfficer/Reports/DSCeSign/YearlyReport'));
const CustomizedPeriodDSCEsignReport = lazy(()=>import('../components/dashboard/Dashboards/CCAOfficer/Reports/DSCeSign/CustomizedPeriodReport'));
const CumulativeDSCEsignReport = lazy(()=>import('../components/dashboard/Dashboards/CCAOfficer/Reports/DSCeSign/CumulativeReport'));
const CustomizedCumulativeDSCEsignReport = lazy(()=>import('../components/dashboard/Dashboards/CCAOfficer/Reports/DSCeSign/CustomizedCumulativeReport'));
const LicenseeReport = lazy(()=>import('../components/dashboard/Dashboards/CCAOfficer/Reports/Licensee/LicenseeReport'));
const CustomizedLicenseeReport = lazy(()=>import('../components/dashboard/Dashboards/CCAOfficer/Reports/Licensee/CustomizedLicenseeReport'));

const AnnualAuditClosureReport = lazy(()=>import('../components/dashboard/Dashboards/CCAOfficer/Reports/AnnualAudit/AnnualAuditClosureReport'));
const AnnualAuditDelayedReport = lazy(()=>import('../components/dashboard/Dashboards/CCAOfficer/Reports/AnnualAudit/AnnualAuditDelayed'));
const AnnualAuditOnTimeReport = lazy(()=>import('../components/dashboard/Dashboards/CCAOfficer/Reports/AnnualAudit/AnnualAuditOnTime'));
const AnnualAuditSubmittedLateReport = lazy(()=>import('../components/dashboard/Dashboards/CCAOfficer/Reports/AnnualAudit/AnnualAuditSubmittedLate'));
const AnnualAuditSubmittedOnTimeReport = lazy(()=>import('../components/dashboard/Dashboards/CCAOfficer/Reports/AnnualAudit/AnnualAuditSubmittedOnTime'));

const AuditByAuditAgencyReport = lazy(()=>import('../components/dashboard/Dashboards/CCAOfficer/Reports/AuditAgency/AuditByAuditAgency'));
const CALicenseDueForRenewwalReport = lazy(()=>import('../components/dashboard/Dashboards/CCAOfficer/Reports/Licensee/DueForRenewal'));
const CADetailsReport = lazy(()=>import('../components/dashboard/Dashboards/CCAOfficer/Reports/Licensee/CADetails'));
const CASiteLocationsReport = lazy(()=>import('../components/dashboard/Dashboards/CCAOfficer/Reports/Licensee/CASiteLocations'));
const AuditAgencyDetailsReport = lazy(()=>import('../components/dashboard/Dashboards/CCAOfficer/Reports/AuditAgency/AuditAgencyDetails'));


const AnnualAudit = lazy(()=>import('../components/ccaofficer/pages/AnnualAudit/AnnualAudit'))

const AuditSelection = lazy(()=>import('../components/licensee/pages/AgencySelectionByLicense/AgencySelection'))
const UploadAuditorAudit = lazy(()=>import('../components/AuditAgency/AnnualAudit/AnnualAudit'))
const UploadAuditReport = lazy(()=>import('../components/AuditAgency/AnnualAudit/AuditorDetails'))

const UploadAuditorAudits = lazy(()=>import('../components/cca/pages/AnnualAudit/AnnualAudit'))
const UploadAuditReports = lazy(()=>import('../components/cca/pages/AnnualAudit/AuditorDetails'))

const AnnualNCAudit = lazy(()=>import('../components/AuditAgency/AnnualNCAudit/AnnualAudit'))
const UploadNCControl = lazy(()=>import('../components/AuditAgency/AnnualNCAudit/AuditorControls'))
const AnnualNCAudits = lazy(()=>import('../components/licensee/pages/UploadNCReport/AgencySelection'))
const UploadNCControls = lazy(()=>import('../components/licensee/pages/UploadNCReport/AuditorControls'))
const UploadNCReport = lazy(()=>import('../components/AuditAgency/AnnualNCCloser/AnnualAudit'))
const UploadNCCloserReport = lazy(()=>import('../components/AuditAgency/AnnualNCCloser/ActionTakenByApplicant'))
const ReviewAnnualNCReport = lazy(()=>import('../components/ReviewCommitteePage/AnnualReviewNCReport/AuditorControls'))
const ReviewAnnualNCReports = lazy(()=>import('../components/ReviewCommitteePage/AnnualReviewNCReport/ViewApplicationForm'))
const IndividualReviewData = lazy(()=>import('../components/ReviewCommitteePage/NewApplicationForm/IndividualViewData'))
const GovernmentViewData = lazy(()=>import('../components/ReviewCommitteePage/NewApplicationForm/GovernmentViewData'))
const FirmViewData = lazy(()=>import('../components/ReviewCommitteePage/NewApplicationForm/FirmViewData'))

const RenewIndividualReviewData = lazy(()=>import('../components/ReviewCommitteePage/RenewApplicationForm/IndividualViewData'))
const RenewGovernmentViewData = lazy(()=>import('../components/ReviewCommitteePage/RenewApplicationForm/GovernmentViewData'))
const RenewFirmViewData = lazy(()=>import('../components/ReviewCommitteePage/RenewApplicationForm/FirmViewData'))


const ReviewRejectedApplication = lazy(()=>import('../components/cca/pages/NewApplicationForm/ViewNewApplicationForm'));
const IndividualReviewDataCCA = lazy(()=>import('../components/cca/pages/NewApplicationForm/IndividualViewData'));
const GovernmentReviewDataCCA = lazy(()=>import('../components/cca/pages/NewApplicationForm/GovernmentViewData'));
const FirmReviewDataCCA = lazy(()=>import('../components/cca/pages/NewApplicationForm/FirmViewData'));
const AuditAgencySelection = lazy(()=>import('../components/applicant/pages/AuditAgencySelection/AuditAgencySelection'))

const ReviewAnnualNCReportAuditAgency = lazy(()=>import('../components/AuditAgency/AuditNCList/ViewApplicationForm'))
const ReviewAnnualNCReportsAuditAgency = lazy(()=>import('../components/AuditAgency/AuditNCList/AuditorControls'))

const viewAnnexure = lazy(()=>import('../components/AuditAgency/UploadUndertaking/viewAnnexure'))

//paymet Verification
const PaymentVerification = lazy(()=>import('../components/ccaofficer/pages/PaymentVerification/PaymentVerification'))
const PaymentProofVerification = lazy(()=>import('../components/ccaofficer/pages/PaymentVerification/PaymentProof'))

const ApproveApplication = lazy(()=>import('../components/cca/pages/ApproveApplicationForm/ViewNewApplicationForm'))
const Ind = lazy(()=>import('../components/cca/pages/ApproveApplicationForm/IndividualViewData'))
const Gov = lazy(()=>import('../components/cca/pages/ApproveApplicationForm/GovernmentViewData'))
const Firm = lazy(()=>import('../components/cca/pages/ApproveApplicationForm/FirmViewData'))

//Renew Approve Review Application
const RecommandedReviewRejectedApplication = lazy(()=>import('../components/cca/pages/RenewApproveReviewApplication/ViewNewApplicationForm'));
const IndividualRecommandedReviewDataCCA = lazy(()=>import('../components/cca/pages/RenewApproveReviewApplication/IndividualViewData'));
const GovernmentRecommandedReviewDataCCA = lazy(()=>import('../components/cca/pages/RenewApproveReviewApplication/GovernmentViewData'));
const FirmRecommandedReviewDataCCA = lazy(()=>import('../components/cca/pages/RenewApproveReviewApplication/FirmViewData'));

// Renew Rejected Review Application
const RejectedRenewApplication = lazy(()=>import('../components/cca/pages/RenewRejectReviewApplication/ViewNewApplicationForm'));  
const IndividualRejectedRenewReviewDataCCA = lazy(()=>import('../components/cca/pages/RenewRejectReviewApplication/IndividualViewData'));
const GovernmentRejectedRenewReviewDataCCA = lazy(()=>import('../components/cca/pages/RenewRejectReviewApplication/GovernmentViewData'));
const FirmRejectedRenewReviewDataCCA = lazy(()=>import('../components/cca/pages/RenewRejectReviewApplication/FirmViewData'));
const RenewAuditAgencySelection = lazy(()=>import('../components/licensee/pages/AuditAgencySelection/AuditAgencySelection'));
const RenewNCAuditorControl = lazy(()=>import('../components/licensee/pages/RenewalPages/AuditorControls'))
const RenewApplicationAuditorControl = lazy(()=>import('../components/licensee/pages/RenewalPages/ApplicationAuditControls'))

const PrivateRoutes = () => {

     const rolePath = useSelector((state)=>state.jwtAuthentication.rolePath)

    //if (!rolePath) return null; // or a loading spinner
const PrivateRoutesConfig = {

    path: rolePath,
    element: <MainLayout/>,
    children:[
        {
            path: '',
            element: (<Navigate to="admindashboard" replace/>)
        },
        
        {
            path: 'reports',
            element: (
                <PrivateRoute  component={AdminReports} />
            ),
        },
        //Country

        {
            path: 'country',
            element:(
                <PrivateRoute  component={Country} />
            )
        },
        {
            path: 'country/addcountry',
            element:(
                <PrivateRoute  component={AddCountry} />
            )
        },
        {
            path: 'country/editcountry/:id',
            element:(
                <PrivateRoute  component={EditCountry} />
            )
        },

        //State
        {
            path: 'state',
            element:(
                <PrivateRoute  component={State} />
            )
        },
        {
            path: 'state/addstate',
            element:(
                <PrivateRoute  component={AddState} />
            )
        }, 
        {
            path: 'state/editstate/:id',
            element:(
                <PrivateRoute  component={EditState} />
            )
        },
        
        //City
        {
            path: 'city',
            element:(
                <PrivateRoute  component={City} />
            )
        },
        {
            path: 'city/addcity',
            element:(
                <PrivateRoute  component={AddCity} />
            )
        },
        {
            path: 'city/editcity/:id',
            element:(
                <PrivateRoute  component={EditCity} />
            )
        },
 //Document Master
        {
            path: 'documentName',
            element:(
                <PrivateRoute  component={Document} />
            )
        },
        {
            path: 'documentName/adddocumentName',
            element:(
                <PrivateRoute  component={AddDocument} />
            )
        },
        {
            path: 'documentName/editdocumentName/:id',
            element:(
                <PrivateRoute  component={EditDocument} />
            )
        },

        // CPS
        {
            path: 'cps',
            element:(
                <PrivateRoute  component={CPSDoc} />
            )
        },
        {
            path: 'cps/addcps',
            element:(
                <PrivateRoute  component={AddCPSDoc} />
            )
        },
        {
            path: 'cps/editcps/:id',
            element:(
                <PrivateRoute  component={EditCPSDoc} />
            )
        },

        //Minimum Attempts
        {
            path: 'minimumattempts',
            element:(
                <PrivateRoute  component={MinimumAttempt} />
            )
        },
        {
            path: 'minimumattempts/addminimumattempts',
            element:(
                <PrivateRoute  component={AddMinimumAttempt} />
            )
        },
        {
            path: 'minimumattempts/editminimumattempts/:id',
            element:(
                <PrivateRoute  component={EditMinimumAttempt} />
            )
        },

        //Audit Agency
        {
            path: 'agency',
            element:(
                <PrivateRoute  component={AuditAgency} />
            )
        },
        {
            path: 'agency/addagency',
            element:(
                <PrivateRoute  component={AuditAgencyRegistrationForm} />
            )
        },
        {
            path: 'agency/editagency/:id',
            element:(
                <PrivateRoute  component={EditAuditAgencyForm} />
            )
        },

        //Role
        {
            path: 'addrole',
            element:(
                <PrivateRoute  component={Role} />
            )
        },
        {
            path: 'addrole/addassignedrole/:id',
            element:(
                <PrivateRoute  component={AddRole} />
            )
        },
        {
            path: 'addrole/editassignedrole/:id',
            element:(
                <PrivateRoute  component={EditRole} />
            )
        },
        {
            path: 'addrole/viewassignedrole/:id',
            element:(
                <PrivateRoute  component={ViewRole} />
            )
        },

        //Audit Criteria
        {
            path: 'audit',
            element:(
                <PrivateRoute  component={AuditCriteria} />
            )
        },
        {
            path: 'audit/addcriteria',
            element:(
                <PrivateRoute  component={AddAuditCriteria} />
            )
        },
        {
            path: 'audit/editcriteria/:id',
            element:(
                <PrivateRoute  component={EditAuditCriteria} />
            )
        },

        //Audit Sub Criteria
        {
            path: 'subaudit',
            element:(
                <PrivateRoute  component={AuditSubCriteria} />
            )
        },
        {
            path: 'subaudit/addsubcriteria',
            element:(
                <PrivateRoute  component={AddAuditSubCriteria} />
            )
        },
        {
            path: 'subaudit/editsubcriteria/:id',
            element:(
                <PrivateRoute  component={EditAuditSubCriteria} />
            )
        },

        //Audit Parameter
        {
            path: 'parameter',
            element:(
                <PrivateRoute  component={AuditParameter} />
            )
        },
        {
            path: 'parameter/addparameter',
            element:(
                <PrivateRoute  component={AddAuditParameter} />
            )
        },
        {
            path: 'parameter/editparameter/:id',
            element:(
                <PrivateRoute  component={EditAuditParameter} />
            )
        },

        //Audit Control Type
        {
            path: 'ctype',
            element:(
                <PrivateRoute  component={AuditControlType} />
            )
        },
        {
            path: 'ctype/addcontroltype',
            element:(
                <PrivateRoute  component={AddAuditControlType} />
            )
        },
        {
            path: 'ctype/editcontroltype/:id',
            element:(
                <PrivateRoute  component={EditAuditControlType} />
            )
        },


        //Audit Check
        {
            path: 'check',
            element:(
                <PrivateRoute  component={AuditCheck} />
            )
        },
        {
            path: 'check/addcheck',
            element:(
                <PrivateRoute  component={AddAuditCheck} />
            )
        },
        {
            path: 'check/editcheck/:id',
            element:(
                <PrivateRoute  component={EditAuditCheck} />
            )
        },

        //Audit Control
        {
            path: 'control',
            element:(
                <PrivateRoute  component={AuditControl} />
            )
        },
        {
            path: 'control/addcontrol',
            element:(
                <PrivateRoute  component={AddAuditControl} />
            )
        },
        {
            path: 'control/editcontrol/:id',
            element:(
                <PrivateRoute  component={EditAuditControl} />
            )
        },

        //User Management
        {
            path: 'userintent',
            element:(
                <PrivateRoute  component={IntentManagement} />
            )
        },
        {
            path: 'userauditagency',
            element:(
                <PrivateRoute  component={AuditAgencyManagement} />
            )
        },
        //Role Master
         {
            path: 'rolemaster',
            element:(
                <PrivateRoute  component={RoleMaster} />
            )
        },
        {
            path: 'rolemaster/addrole',
            element:(
                <PrivateRoute  component={AddRoleMaster} />
            )
        },
        {
            path: 'rolemaster/editrole/:id',
            element:(
                <PrivateRoute  component={EditRoleMaster} />
            )
        },

        //Menu Master
        {
            path: 'menumaster',
            element:(
                <PrivateRoute  component={MenuMaster} />
            )
        },
        {
            path: 'menumaster/addmenu',
            element:(
                <PrivateRoute  component={AddMenuMaster} />
            )
        },
        {
            path: 'menumaster/editmenu/:id',
            element:(
                <PrivateRoute  component={EditMenuMaster} />
            )
        },

        //Sub Menu Master
        {
            path: 'submenu',
            element:(
                <PrivateRoute  component={SubMenuMaster} />
            )
        },
        {
            path: 'submenu/addsubmenu',
            element:(
                <PrivateRoute  component={AddSubMenuMaster} />
            )
        },
        {
            path: 'submenu/editsubmenu/:id',
            element:(
                <PrivateRoute  component={EditSubMenuMaster} />
            )
        },


        //Sub Menu Master
        {
            path: 'internalsubmenu',
            element:(
                <PrivateRoute  component={SubMenuInternalMaster} />
            )
        },
        {
            path: 'internalsubmenu/addinternalsubmenu',
            element:(
                <PrivateRoute  component={AddSubMenuInternalMaster} />
            )
        },
        {
            path: 'internalsubmenu/editinternalsubmenu/:id',
            element:(
                <PrivateRoute  component={EditSubMenuInternalMaster} />
            )
        },

        //Intent Unique Code
        {
            path: 'iuniquecode',
            element:(
                <PrivateRoute  component={IntentUniqueCode} />
            )
        },
        {
            path: 'iuniquecode/adduniquecode',
            element:(
                <PrivateRoute  component={AddIntentUniqueCode} />
            )
        },
        {
            path: 'iuniquecode/edituniquecode/:id',
            element:(
                <PrivateRoute  component={EditIntentUniqueCode} />
            )
        },

	//Application Form

        {
            path: 'applicationform',
            element:(
                <PrivateRoute component={ApplicationForm} />
            )
        },
        {
            path: 'applicationform/addapplicationform',
            element:(
                <PrivateRoute component={AddApplicationForm} />
            )
        },

{
            path: 'applicationform/auditordetails/:id',
            element:(
                <PrivateRoute component={NCAuditorControl} />
            )
        },

        {
            path: 'applicationform/applicationauditordetails/:id',
            element:(
                <PrivateRoute component={ApplicationAuditorControl} />
            )
        },

//Undertaking
        {
            path: 'undertaking',
            element:(
                <PrivateRoute  component={Undertaking} />
            )
        },
        {
            path: 'undertaking/addundertaking',
            element:(
                <PrivateRoute  component={AddUndertaking} />
            )
        },
        {
            path: 'undertaking/editundertaking/:id',
            element:(
                <PrivateRoute  component={EditUndertaking} />
            )
        },

        //Applicant Dashboard
        {
            path: 'adashboard',
            element:(
                <PrivateRoute component={ApplicantDashboard} />
            )
        },

         //application Type
         {
            path: 'applicationtype',
            element:(
                <PrivateRoute  component={ApplicationType} />
            )
        },
        {
            path: 'applicationtype/addapplicationtype',
            element:(
                <PrivateRoute  component={AddApplicationType} />
            )
        }, 
        {
            path: 'applicationtype/editapplicationtype/:id',
            element:(
                <PrivateRoute  component={EditApplicationType} />
            )
        },



         //Service
         {
            path: 'service',
            element:(
                <PrivateRoute  component={Service} />
            )
        },
        {
            path: 'service/addservice',
            element:(
                <PrivateRoute  component={AddService} />
            )
        }, 
        {
            path: 'service/editservice/:id',
            element:(
                <PrivateRoute  component={EditService} />
            )
        },

          //SubService
          {
            path: 'subservice',
            element:(
                <PrivateRoute component={SubService} />
            )
        },
        {
            path: 'subservice/addsubservice',
            element:(
                <PrivateRoute  component={AddSubService} />
            )
        }, 
        {
            path: 'subservice/editsubservice/:id',
            element:(
                <PrivateRoute  component={EditSubService} />
            )
        },


        //CCA Staff
        {
            path: 'ccastaff',
            element:(
                <PrivateRoute component={CCAStaff} />
            )
        },
        {
            path: 'ccastaff/addccastaff',
            element:(
                <PrivateRoute  component={AddCCAStaff} />
            )
        }, 
        {
            path: 'ccastaff/editccastaff/:id',
            element:(
                <PrivateRoute  component={EditCCAStaff} />
            )
        },

        //ReviewCommitePage

        {
            path: 'newapplication',
            element:(
                <PrivateRoute component={NewApplication} />
            )
        },

        {
            path: 'ncreport',
            element:(
                <PrivateRoute component={ReviewNCReport} />
            )
        },

        {
            path: 'ncreport/ncreportbyid/:id',
            element:(
                <PrivateRoute component={ReviewNCReports} />
            )
        },

        // {
        //     path: 'ccastaff/addccastaff',
        //     element:(
        //         <PrivateRoute  component={AddCCAStaff} />
        //     )
        // }, 
        // {
        //     path: 'ccastaff/editccastaff/:id',
        //     element:(
        //         <PrivateRoute  component={EditCCAStaff} />
        //     )
        // },

       
        
        {
            path: 'recommendednewapp',
            element:(
                <PrivateRoute component={NewApplicationRecommended} />
            )
        },
        {
            path: 'recommendedrenewalapp',
            element:(
                <PrivateRoute component={RenewalApplicationRecommended} />
            )
        },
        {
            path: 'issuenewlicense',
            element:(
                <PrivateRoute component={IssueNewLicense} />
            )
        },

        //CCA Officer
        {
            path: 'newapplicationlist',
            element:(
                <PrivateRoute component={NewApplicationListForOfficeOfCCA} />
            )
        },
        {
            path: 'renewalapplicationlist',
            element:(
                <PrivateRoute component={RenewalApplicationListForOfficeOfCCA} />
            )
        },

        {
            path: 'viewlicense',
            element:(
                <PrivateRoute component={ViewLicense} />
            )
        },
	{
            path: 'renewallicense',
            element:(
                <PrivateRoute component={RenewalLicense} />
            )
        },

        {
            path: 'renewallicense/renewallicenses',
            element:(
                <PrivateRoute component={RenewalPages} />
            )
        },

        {
            path: 'renewallicense/selectauditagency/:id',
            element:(
                <PrivateRoute component={RenewAuditAgencySelection} />
            )
        },
        {
            path: 'renewallicense/auditordetails/:id',
            element:(
                <PrivateRoute component={RenewNCAuditorControl} />
            )
        },
        {
            path: 'renewallicense/applicationauditordetails/:id',
            element:(
                <PrivateRoute component={RenewApplicationAuditorControl} />
            )
        },

        {
            path: 'renewapplication',
            element:(
                <PrivateRoute component={RenewApplication} />
            )
        },



        //Esign API Specification
        {
            path: 'apispecification',
            element:(
                <PrivateRoute component={EsignAPISpecification} />
            )
        },
        {
            path: 'apispecification/addapispecification',
            element:(
                <PrivateRoute component={AddEsignAPISpecification} />
            )
        },
        {
            path: 'apispecification/editapispecification/:id',
            element:(
                <PrivateRoute component={EditEsignAPISpecification} />
            )
        },


        //Esign Doc Type
        {
            path: 'esigndoctype',
            element:(
                <PrivateRoute component={EsignDocType} />
            )
        },
        {
            path: 'esigndoctype/addesigndoctype',
            element:(
                <PrivateRoute component={AddEsignDocType} />
            )
        },
        {
            path: 'esigndoctype/editesigndoctype/:id',
            element:(
                <PrivateRoute component={EditEsignDocType} />
            )
        },


        //EKYC Mode
        {
            path: 'ekycmode',
            element:(
                <PrivateRoute component={EKYCMode} />
            )
        },
        {
            path: 'ekycmode/addekycmode',
            element:(
                <PrivateRoute component={AddEKYCMode} />
            )
        },
        {
            path: 'ekycmode/editekycmode/:id',
            element:(
                <PrivateRoute component={EditEKYCMode} />
            )
        },

        //API Version
        {
            path: 'apiversion',
            element:(
                <PrivateRoute component={ESignAPIVersion} />
            )
        },
        {
            path: 'apiversion/addapiversion',
            element:(
                <PrivateRoute component={AddESignAPIVersion} />
            )
        },
        {
            path: 'apiversion/editapiversion/:id',
            element:(
                <PrivateRoute component={EditESignAPIVersion} />
            )
        },

        //Esign Application
        {
            path: 'viewlicense/espapplication',
            element: (
                <PrivateRoute component={ESPApplication} />
            )
        },

        {
            path: 'espreviewapp',
            element: (
                <PrivateRoute component = {ESPUnderReviewApplicationsCCAOff} />
            )
        },

        {
            path: 'espreviewapp/viewdetails/:id',
            element: (
                <PrivateRoute component = {ViewESPApplicationCCAOff} />
            )
        },

        {
            path: 'esprejectionapp',
            element: (
                <PrivateRoute component = {EspApplicationRecommandedForRejectionCCA} />
            )
        },

        {
            path: 'esprejectionapp/viewdetails/:id',
            element: (
                <PrivateRoute component = {EspRjectionAppViewDetailsCCA} />
            )
        },

        {
            path: 'espapprecommended',
            element: (
                <PrivateRoute component = {EspApplicationRecommendedForeSignGoLiveCCA} />
            )
        },

        {
            path: 'espapprecommended/viewrecommended/:id',
            element: (
                <PrivateRoute component = {ViewRecommendedForeSignGoLiveApplicationCCA} />
            )
        },

	{
            path: 'espappcrejected',
            element: (
                <PrivateRoute component = {ViewRejectedApplicationCCA} />
            )
        },

        {
            path: 'espappcrejected/viewcprevappdetails/:id',
            element: (
                <PrivateRoute component = {ViewRejectedPreviousReviewedApplicationCCA} />
            )
        },

	{
            path: 'espappcexpired',
            element: (
                <PrivateRoute component = {ViewExpiredApplicationCCA} />
            )
        },

        {
            path: 'espappcexpired/viewcprevappdetails/:id',
            element: (
                <PrivateRoute component = {ViewExpiredPreviousReviewedApplicationCCA} />
            )
        },
	{
            path: 'espappcapproved',
            element: (
                <PrivateRoute component = {ViewApprovedApplicationCCA} />
            )
        },

        {
            path: 'espappcapproved/viewcprevappdetails/:id',
            element: (
                <PrivateRoute component = {ViewApprovedPreviousReviewedApplicationCCA} />
            )
        },

// Upload Undertaking by Audit Agency

{
    path: 'uploadundertaking',
    element:(
        <PrivateRoute component={UploadUndertaking} />
    )
},

{
    path: 'uploadundertaking/auditordetails/:id',
    element:(
        <PrivateRoute component={AuditorDetails} />
    )
},
{
    path: 'uploadundertaking/auditorcontrols/:id',
    element:(
        <PrivateRoute component={AuditorControls} />
    )
},
{
    path: 'uploadundertaking/ncclosurereport/:id',
    element:(
        <PrivateRoute component={NCClosureReport} />
    )
},

{
    path: 'auditorlicense',
    element:(
        <PrivateRoute component={AuditorLicense} />
    )
},
{
    path: 'auditorlicense/auditordetails/:id',
    element:(
        <PrivateRoute component={AuditorDetailsFromCCA} />
    )
},
{
    path: 'auditorlicense/sendToRejection/:id',
    element:(
        <PrivateRoute component={SendToRejection} />
    )
},



{
    path: 'dscesignissued',
    element:(
        <PrivateRoute component={DSCeSignIssued} />
    )
},
{
    path: 'dscesignissued/adddscesignissued',
    element:(
        <PrivateRoute component={AddDSCeSignIssued} />
    )
},
{
    path: 'dscesignissued/editdscesignissued/:id',
    element:(
        <PrivateRoute component={EditDSCeSignIssued} />
    )
},


{
    path: 'asplist',
    element:(
        <PrivateRoute component={ASP} />
    )
},
{
    path: 'asplist/addasp',
    element:(
        <PrivateRoute component={AddASP} />
    )
},
{
    path: 'asplist/editasp/:id',
    element:(
        <PrivateRoute component={EditASP} />
    )
},

{
    path: 'cessationapplication',
    element:(
        <PrivateRoute component={CessationApplication} />
    )
},

{
    path: 'cessationapplication/viewdetails/:id',
    element:(
        <PrivateRoute component={ApproveNoticeFile} />
    )
},
{
    path: 'viewlicense/licensecessationchecklist/:id',
    element:(
        <PrivateRoute component={ApplyForCessation} />
    )
},

{
    path: 'viewlicense/editlicensecessationchecklist/:id',
    element:(
        <PrivateRoute component={EditLicenseCessationChecklist} />
    )
},
{
    path: 'approvaundertaking',
    element:(
        <PrivateRoute component={CessationUndertaking} />
    )
},

{
    path: 'approvaundertaking/approveundertaking/:id',
    element:(
        <PrivateRoute component={ApproveCessationUndertaking} />
    )
},

{
    path: 'cessationapplicationforcca',
    element:(
        <PrivateRoute component={CessationUndertakingFromCCA} />
    )
},
{
    path: 'cessationapplicationforcca/editlicensecessationchecklist/:id',
    element:(
        <PrivateRoute component={ViewCessationUndertakingFromCCA} />
    )
},

{
    path: 'approvalcessationapplication',
    element:(
        <PrivateRoute component={AproveCessationUndertakingFromCCA} />
    )
},
{
    path: 'approvalcessationapplication/approvechecklist/:id',
    element:(
        <PrivateRoute component={ViewAproveCessationUndertakingFromCCA} />
    )
},

{
    path: 'allcessationapplicationcca',
    element:(
        <PrivateRoute component={AllCessationUndertakingFromCCA} />
    )
},
{
    path: 'allcessationapplicationcca/viewallcessationdatacca/:id',
    element:(
        <PrivateRoute component={ViewAllCessationUndertakingFromCCA} />
    )
},

{
    path: 'allcessationapplicationccaofficer',
    element:(
        <PrivateRoute component={AllCessationUndertakingFromCCAOfficer} />
    )
},
{
    path: 'allcessationapplicationccaofficer/viewallcessationdataccaofficer/:id',
    element:(
        <PrivateRoute component={ViewAllCessationUndertakingFromCCAOfficer} />
    )
},

//Dashboards -- CCA Dashboard

{
    path: 'ccadashboard',
    element:(
        <PrivateRoute component={CCADashboard} />
    )
},

{
    path: 'ccadashboard/registeredca',
    element:(
        <PrivateRoute component={RegisteredCADashboard} />
    )
},
{
    path: 'ccadashboard/esignissued',
    element:(
        <PrivateRoute component={EsignIssuedDashboard} />
    )
},
{
    path: 'ccadashboard/dscissued',
    element:(
        <PrivateRoute component={DSCIssuedDashboard} />
    )
},
{
    path: 'ccadashboard/registeredesp',
    element:(
        <PrivateRoute component={RegisteredESPDashboard} />
    )
},


{
    path: 'ccaofficerdashboard',
    element:(
        <PrivateRoute component={CCAOfficerDashboard} />
    )
},
{
    path: 'ccaofficerdashboard/registeredca',
    element:(
        <PrivateRoute component={RegisteredCADashboard} />
    )
},
{
    path: 'ccaofficerdashboard/esignissued',
    element:(
        <PrivateRoute component={EsignIssuedDashboard} />
    )
},
{
    path: 'ccaofficerdashboard/dscissued',
    element:(
        <PrivateRoute component={DSCIssuedDashboard} />
    )
},
{
    path: 'ccaofficerdashboard/registeredesp',
    element:(
        <PrivateRoute component={RegisteredESPDashboard} />
    )
},

{
    path: 'admindashboard',
    element:(
        <PrivateRoute component={AdminDashboard} />
    )
},
{
    path: 'admindashboard/registeredca',
    element:(
        <PrivateRoute component={RegisteredCADashboard} />
    )
},
{
    path: 'admindashboard/esignissued',
    element:(
        <PrivateRoute component={EsignIssuedDashboard} />
    )
},
{
    path: 'admindashboard/dscissued',
    element:(
        <PrivateRoute component={DSCIssuedDashboard} />
    )
},
{
    path: 'admindashboard/registeredesp',
    element:(
        <PrivateRoute component={RegisteredESPDashboard} />
    )
},
{
    path: 'licenseedashboard',
    element:(
        <PrivateRoute component={LicenseeDashboard} />
    )
},
{
    path: 'licenseedashboard/lesignissued',
    element:(
        <PrivateRoute component={LicenseeEsignIssued} />
    )
},
{
    path: 'licenseedashboard/lasplist',
    element:(
        <PrivateRoute component={LicenseeASPList} />
    )
},
{
    path: 'licenseedashboard/ldscissued',
    element:(
        <PrivateRoute component={LicenseeDSCIssued} />
    )
},

//Reports
{
    path: 'ccaofficerreports',
    element:(
        <PrivateRoute component={CCAOfficerReports} />
    )
},

{
    path: 'ccaofficerreports/monthlyreport',
    element:(
        <PrivateRoute component={MonthlyDSCEsignReport} />
    )
},

{
    path: 'ccaofficerreports/yearlyreport',
    element:(
        <PrivateRoute component={YearlyDSCEsignReport} />
    )
},

{
    path: 'ccaofficerreports/customizedperiodreport',
    element:(
        <PrivateRoute component={CustomizedPeriodDSCEsignReport} />
    )
},
{
    path: 'ccaofficerreports/cumulativereport',
    element:(
        <PrivateRoute component={CumulativeDSCEsignReport} />
    )
},
{
    path: 'ccaofficerreports/customizedcumulativereport',
    element:(
        <PrivateRoute component={CustomizedCumulativeDSCEsignReport} />
    )
},
{
    path: 'ccaofficerreports/licenseereport',
    element:(
        <PrivateRoute component={LicenseeReport} />
    )
},
{
    path: 'ccaofficerreports/customizedlicenseereport',
    element:(
        <PrivateRoute component={CustomizedLicenseeReport} />
    )
},

{
    path: 'ccaofficerreports/annualauditclosurereport',
    element:(
        <PrivateRoute component={AnnualAuditClosureReport} />
    )
},
{
    path: 'ccaofficerreports/annualauditdelayedreport',
    element:(
        <PrivateRoute component={AnnualAuditDelayedReport} />
    )
},
{
    path: 'ccaofficerreports/annualauditontimereport',
    element:(
        <PrivateRoute component={AnnualAuditOnTimeReport} />
    )
},
{
    path: 'ccaofficerreports/annualauditsubmittedlatereport',
    element:(
        <PrivateRoute component={AnnualAuditSubmittedLateReport} />
    )
},
{
    path: 'ccaofficerreports/annualauditsubmittedontimereport',
    element:(
        <PrivateRoute component={AnnualAuditSubmittedOnTimeReport} />
    )
},
{
    path: 'ccaofficerreports/auditbyauditagencyreport',
    element:(
        <PrivateRoute component={AuditByAuditAgencyReport} />
    )
},
{
    path: 'ccaofficerreports/dueforrenewal',
    element:(
        <PrivateRoute component={CALicenseDueForRenewwalReport} />
    )
},
{
    path: 'ccaofficerreports/cadetails',
    element:(
        <PrivateRoute component={CADetailsReport} />
    )
},
{
    path: 'ccaofficerreports/casitelocations',
    element:(
        <PrivateRoute component={CASiteLocationsReport} />
    )
},
{
    path: 'ccaofficerreports/auditagencydetails',
    element:(
        <PrivateRoute component={AuditAgencyDetailsReport} />
    )
},



//Temp
{
    path: 'dashboard',
    element:(
        <PrivateRoute component={CCAOfficerDashboard} />
    )
},

{
    path: 'annualaudit',
    element:(
        <PrivateRoute  component={AnnualAudit} />
    )
},

{
    path: 'agencyselection',
    element:(
        <PrivateRoute  component={AuditSelection} />
    )
},

{
    path: 'uploadannualundertaking',
    element:(
        <PrivateRoute  component={UploadAuditorAudit} />
    )
},

{
    path: 'uploadannualundertaking/annualauditreport/:id',
    element:(
        <PrivateRoute  component={UploadAuditReport} />
    )
},

{
    path: 'uploadundertaking/annexurea/:id',
    element:(
        <PrivateRoute  component={viewAnnexure} />
    )
},

{
    path: 'uploadannualundertakings',
    element:(
        <PrivateRoute  component={UploadAuditorAudits} />
    )
},

{
    path: 'uploadannualundertakings/annualauditreports/:id',
    element:(
        <PrivateRoute  component={UploadAuditReports} />
    )
},

{
    path: 'annualncaudit',
    element:(
        <PrivateRoute  component={AnnualNCAudit} />
    )
},

{
    path: 'annualncaudit/uploadnccontrol/:id',
    element:(
        <PrivateRoute  component={UploadNCControl} />
    )
},

{
    path: 'annualncaudits',
    element:(
        <PrivateRoute  component={AnnualNCAudits} />
    )
},

{
    path: 'annualncaudits/uploadnccontrols/:id',
    element:(
        <PrivateRoute  component={UploadNCControls} />
    )
},

{
    path: 'ncreports',
    element:(
        <PrivateRoute  component={UploadNCReport} />
    )
},

{
    path: 'ncreports/nccloserreports/:id',
    element:(
        <PrivateRoute  component={UploadNCCloserReport} />
    )
},


{
    path: 'reviewauditreport',
    element:(
        <PrivateRoute  component={ReviewReport} />
    )
},

{
    path: 'reviewauditreport/reviewreport/:id',
    element:(
        <PrivateRoute  component={ReviewReports} />
    )
},


{
    path: 'reviewannualncreport',
    element:(
        <PrivateRoute  component={ReviewAnnualNCReports} />
    )
},

{
    path: 'reviewannualncreport/reviewannualncreports/:id',
    element:(
        <PrivateRoute  component={ReviewAnnualNCReport} />
    )
},

{
    path: 'newapplication/reviewapplication/:id',
    element:(
        <PrivateRoute  component={IndividualReviewData} />
    )
},
{
    path: 'newapplication/reviewapplications/:id',
    element:(
        <PrivateRoute component={GovernmentViewData} />
    )
},

{
    path: 'newapplication/reviewapplicationes/:id',
    element:(
        <PrivateRoute component={FirmViewData} />
    )
},

{
    path: 'rejectedreviewapplication',
    element:(<PrivateRoute component={ReviewRejectedApplication} />)
    },
    {
            path: 'rejectedreviewapplication/indivreviewapplication/:id',
            element:(<PrivateRoute component={IndividualReviewDataCCA} />)
            },
        {
            path: 'rejectedreviewapplication/govreviewapplication/:id',
            element:(<PrivateRoute component={GovernmentReviewDataCCA} />)
            },
            {
                path: 'rejectedreviewapplication/firmreviewapplication/:id',
                element:(<PrivateRoute component={FirmReviewDataCCA} />)
                },

                {
                    path: 'applicationform/selectauditagency/:id',
                    element:(
                        <PrivateRoute  component={AuditAgencySelection} />
                    )
                },

                {
                    path: 'auditnclist',
                    element:(
                        <PrivateRoute  component={ReviewAnnualNCReportAuditAgency} />
                    )
                },
          
                {
                    path: 'auditnclist/ncclosurereport/:id',
                    element:(
                        <PrivateRoute  component={ReviewAnnualNCReportsAuditAgency} />
                    )
                },
                

                {
                    path: 'paymentverification',
                    element:(
                        <PrivateRoute  component={PaymentVerification} />
                    )
                },
                {
                    path: 'paymentverification/paymentProofs/:id',
                    element:(
                        <PrivateRoute  component={PaymentProofVerification} />
                    )
                },

                {
                    path: 'approvedreviewapplication',
                    element:(<PrivateRoute component={ApproveApplication} />)
                    },

                    {
                        path: 'approvedreviewapplication/indivreviewapplication/:id',
                        element:(<PrivateRoute component={Ind} />)
                        },
                    {
                        path: 'approvedreviewapplication/govreviewapplication/:id',
                        element:(<PrivateRoute component={Gov} />)
                        },
                        {
                            path: 'approvedreviewapplication/firmreviewapplication/:id',
                            element:(<PrivateRoute component={Firm} />)
                            },
            

                            // Renew Approved Review Application
                            {
                                path: 'renewapprovedapplication',
                                element:(<PrivateRoute component={RecommandedReviewRejectedApplication} />)
                                },
            
                                {
                                    path: 'renewapprovedapplication/indivreviewapplication/:id',
                                    element:(<PrivateRoute component={IndividualRecommandedReviewDataCCA} />)
                                    },
                                {
                                    path: 'renewapprovedapplication/govreviewapplication/:id',
                                    element:(<PrivateRoute component={GovernmentRecommandedReviewDataCCA} />)
                                    },
                                    {
                                        path: 'renewapprovedapplication/firmreviewapplication/:id',
                                        element:(<PrivateRoute component={FirmRecommandedReviewDataCCA} />)
                                        },


                                        {
                                            path: 'renewapplication/reviewapplication/:id',
                                            element:(
                                                <PrivateRoute  component={RenewIndividualReviewData} />
                                            )
                                        },
                                        {
                                            path: 'renewapplication/reviewapplications/:id',
                                            element:(
                                                <PrivateRoute component={RenewGovernmentViewData} />
                                            )
                                        },
                                        
                                        {
                                            path: 'renewapplication/reviewapplicationes/:id',
                                            element:(
                                                <PrivateRoute component={RenewFirmViewData} />
                                            )
                                        },


                                        // Renew Rejected Review Application
                                        {
                                            path: 'renewrejectedapplication',
                                            element:(<PrivateRoute component={RejectedRenewApplication} />)
                                            },
                        
                                            {
                                                path: 'renewrejectedapplication/indivreviewapplication/:id',
                                                element:(<PrivateRoute component={IndividualRejectedRenewReviewDataCCA} />)
                                                },
                                            {
                                                path: 'renewrejectedapplication/govreviewapplication/:id',
                                                element:(<PrivateRoute component={GovernmentRejectedRenewReviewDataCCA} />)
                                                },
                                                {
                                                    path: 'renewrejectedapplication/firmreviewapplication/:id',
                                                    element:(<PrivateRoute component={FirmRejectedRenewReviewDataCCA} />)
                                                    },

                                                    {
                                                        path: 'agencyselection/selectauditagency/:id',
                                                        element:(
                                                            <PrivateRoute component={RenewAuditAgencySelection} />
                                                        )
                                                    },



                                                {
                                                path: 'cawisehistory',
                                                element:(<PrivateRoute component={ViewHistory} />)
                                                },
                                                 {
                                                path: 'cawisehistory/licenseehistory/:id',
                                                element:(<PrivateRoute component={LicenseeHistory} />)
                                                },


                                                   

    ]
};



return PrivateRoutesConfig;
};

export default PrivateRoutes;

