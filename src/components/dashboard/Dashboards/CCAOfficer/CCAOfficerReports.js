import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CCAOfficerReports = () => {

    const theme = useTheme();

    const rolePath = useSelector((state) => state.jwtAuthentication.rolePath);
    const navigate = useNavigate();


    const navigateToMonthlyReport = () => {
        navigate(`${rolePath}/ccaofficerreports/monthlyreport`);
      }
    
      const navigateToYearlyReport = () => {
        navigate(`${rolePath}/ccaofficerreports/yearlyreport`);
      }
  
      const navigateToCustomizedPeriodReport = () => {
        navigate(`${rolePath}/ccaofficerreports/customizedperiodreport`);
      }

      const navigateToCumulativeReport = () => {
        navigate(`${rolePath}/ccaofficerreports/cumulativereport`);
      }

      const navigateToCustomizedCumulativeReport = () => {
        navigate(`${rolePath}/ccaofficerreports/customizedcumulativereport`);
      }

      const navigateToLicenseeReport = () => {
        navigate(`${rolePath}/ccaofficerreports/licenseereport`);
      }

      const navigateToCustomizedLicenseeReport = () => {
        navigate(`${rolePath}/ccaofficerreports/customizedlicenseereport`);
      }

      const navigateToAnnualAuditClosureReport = () => {
        navigate(`${rolePath}/ccaofficerreports/annualauditclosurereport`);
      }

      const navigateToAnnualAuditDelayedReport = () => {
        navigate(`${rolePath}/ccaofficerreports/annualauditdelayedreport`);
      }

      const navigateToAnnualAuditOnTimeReport = () => {
        navigate(`${rolePath}/ccaofficerreports/annualauditontimereport`);
      }

      const navigateToAnnualAuditSubmittedLateReport = () => {
        navigate(`${rolePath}/ccaofficerreports/annualauditsubmittedlatereport`);
      }

      const navigateToAnnualAuditSubmittedOnTimeReport = () => {
        navigate(`${rolePath}/ccaofficerreports/annualauditsubmittedontimereport`);
      }

      const navigateToAuditByAuditAgency = () => {
        navigate(`${rolePath}/ccaofficerreports/auditbyauditagencyreport`);
      }

      const navigateToDueForRenewal = () => {
        navigate(`${rolePath}/ccaofficerreports/dueforrenewal`);
      }

      const navigateToCADetails = () => {
        navigate(`${rolePath}/ccaofficerreports/cadetails`);
      }

      const navigateToCASiteLocations = () => {
        navigate(`${rolePath}/ccaofficerreports/casitelocations`);
      }

      const navigateToAuditAgencyDetails = () => {
        navigate(`${rolePath}/ccaofficerreports/auditagencydetails`);
      }


      const rows = [{
        monthly: {title:"Monthly Report of eSign & DSC", navigateToReport: navigateToMonthlyReport},
        yearly: {title:"Yearly Report of eSign & DSC", navigateToReport: navigateToYearlyReport},
        customized: {title:"Customized Report of eSign & DSC", navigateToReport: navigateToCustomizedPeriodReport},
        others: {title:"Licensing Report of CAs and ESPs from beginning", navigateToReport: navigateToLicenseeReport}
      },
      {
        monthly: {title:"", navigateToReport: ''},
        yearly: {title:"", navigateToReport: ''},
        customized: {title:"Cumulative Report of eSign & DSC", navigateToReport: navigateToCumulativeReport},
        others: {title:"Report on Annual Audits Initiated on Time", navigateToReport: navigateToAnnualAuditOnTimeReport}
      },
      {
        monthly: {title:"", navigateToReport: ''},
        yearly: {title:"", navigateToReport: ''},
        customized: {title:"Customized Cumulative Report of eSign & DSC", navigateToReport: navigateToCustomizedCumulativeReport},
        others: {title:"Report on Annual Audits Delayed", navigateToReport: navigateToAnnualAuditDelayedReport}
      },
      {
        monthly: {title:"", navigateToReport: ''},
        yearly: {title:"", navigateToReport: ''},
        customized: {title:"Customized Licensing Report of CAs and ESPs", navigateToReport: navigateToCustomizedLicenseeReport},
        others: {title:"Report on Annual Audits Submitted on Time", navigateToReport: navigateToAnnualAuditSubmittedOnTimeReport}
      },
      {
        monthly: {title:"", navigateToReport: ''},
        yearly: {title:"", navigateToReport: ''},
        customized: {title:"", navigateToReport: ''},
        others: {title:"Report on Annual Audits Submitted Late", navigateToReport: navigateToAnnualAuditSubmittedLateReport}
      }
      ,
      {
        monthly: {title:"", navigateToReport: ''},
        yearly: {title:"", navigateToReport: ''},
        customized: {title:"", navigateToReport: ''},
        others: {title:"Annual Audits Closure Report", navigateToReport: navigateToAnnualAuditClosureReport}
      }

      ,
      {
        monthly: {title:"", navigateToReport: ''},
        yearly: {title:"", navigateToReport: ''},
        customized: {title:"", navigateToReport: ''},
        others: {title:"Report on Audits Conducted By Audit Agency", navigateToReport: navigateToAuditByAuditAgency}
      }
      ,
      {
        monthly: {title:"", navigateToReport: ''},
        yearly: {title:"", navigateToReport: ''},
        customized: {title:"", navigateToReport: ''},
        others: {title:"Report on CAs licenses due for renewal", navigateToReport: navigateToDueForRenewal}
      }
      ,
      {
        monthly: {title:"", navigateToReport: ''},
        yearly: {title:"", navigateToReport: ''},
        customized: {title:"", navigateToReport: ''},
        others: {title:"Contact Information CA Report", navigateToReport: navigateToCADetails}
      }
      ,
      {
        monthly: {title:"", navigateToReport: ''},
        yearly: {title:"", navigateToReport: ''},
        customized: {title:"", navigateToReport: ''},
        others: {title:"Contact Information Audit Agency Report", navigateToReport: navigateToAuditAgencyDetails}
      }
      ,
      {
        monthly: {title:"", navigateToReport: ''},
        yearly: {title:"", navigateToReport: ''},
        customized: {title:"", navigateToReport: ''},
        others: {title:"Report on CA Site Location(s)", navigateToReport: navigateToCASiteLocations}
      }
    
    ];


    return(
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Box>
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            
            <TableContainer component={Box} sx={{backgroundColor: "bodycolor.main", border: 1, color: "#DDDDDD"}}>
                
                <Table>
                    <TableHead>
                        <TableRow sx={{backgroundColor: 'primary.main'}}>
                            <TableCell sx={{color: 'primary.text', fontWeight: 600, fontSize: '14px'}}>Monthly</TableCell>
                            <TableCell sx={{color: 'primary.text', fontWeight: 600, fontSize: '14px'}}>Yearly</TableCell>
                            <TableCell sx={{color: 'primary.text', fontWeight: 600, fontSize: '14px'}}>Customized</TableCell>
                            <TableCell sx={{color: 'primary.text', fontWeight: 600, fontSize: '14px'}}>Others</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.map((row, index)=>(
                            <TableRow key={index}>

                                {row.monthly.title !== "" ? (<TableCell sx={{ cursor: 'pointer', '&:hover':{color: 'primary.main'}, color: 'bodycolor.text'}} onClick={row.monthly.navigateToReport}>{row.monthly.title}</TableCell>): (<TableCell></TableCell>)}
                                {row.yearly.title !== "" ? (<TableCell sx={{ cursor: 'pointer', '&:hover':{color: 'primary.main'}, color: 'bodycolor.text'}} onClick={row.yearly.navigateToReport}>{row.yearly.title}</TableCell>): (<TableCell></TableCell>)}
                                {row.customized.title !== "" ? (<TableCell sx={{ cursor: 'pointer', '&:hover':{color: 'primary.main'}, color: 'bodycolor.text'}} onClick={row.customized.navigateToReport}>{row.customized.title}</TableCell>): (<TableCell></TableCell>)}
                                {row.others.title !== "" ? (<TableCell sx={{ cursor: 'pointer', '&:hover':{color: 'primary.main'}, color: 'bodycolor.text'}} onClick={row.others.navigateToReport}>{row.others.title}</TableCell>): (<TableCell></TableCell>)}
                                
                            </TableRow>
                        )) }
                    </TableBody>
                    
                </Table>

            </TableContainer>

            </Box>

            </Box>
        </Box>
    </Box>
    )

}

export default CCAOfficerReports;