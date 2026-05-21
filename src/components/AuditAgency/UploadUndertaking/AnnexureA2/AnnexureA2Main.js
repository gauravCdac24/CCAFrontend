
import InternalAuditDetails from './InternalAuditDetails';
import EKYCAuditDetails from './EKYCAuditDetails';
import EKYCVerificationDetails from './EKYCVerificationDetails';
import RAAuditDetails from './RAAuditDetails';
import CourtCases from './CourtCases';
import RevocationDSC from './RevocationDSC';
import EmpanelmentCryptoToken from './EmpanelmentCryptoToken';
import CADetails from './CADetails';
import DCDetails from './DCDetails';
import CAServiceDetails from './CAServiceDetails';
import ASPDetails from './ASPDetails';
import PublicInformationWebsite from './PublicInformationWebsite';
import CostOfCertificates from './CostOfCertificates';
import CASelfAssessment from './CASelfAssessment';
import CASoftwareExternalConnectivity from './CASoftwareExternalConnectivity';
import DownTimeAuditPeriod from './DownTimeAuditPeriod';
import TrustedPersonsList from './TrustedPersonsList';
import AuditDetails from './AuditDetails';
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Collapse, IconButton, Typography } from '@mui/material';
import { useState } from 'react';

const AnnexureA2Main = () => {

    const [isCollapse, setIsCollapse] = useState(false);

    return (
        <>
        <Box sx={{ display: "flex", 
            alignItems: "center", 
            backgroundColor: "primary.main", p:1, 
            borderRadius: '5px',
            boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;', cursor: 'pointer'}}
            
            onClick={() =>
                setIsCollapse((prev) => !prev)
           }

            >
               <Typography variant="h6" sx={{flexGrow: 1 }}>
                    Details of CA (To be filled by CA & Verified by the Auditor)
               </Typography>
               <IconButton 
                 
               sx={{ backgroundColor: "transparent",
                 '&:hover': {
                     backgroundColor: "transparent"
                   },
                   fontSize: '20px',
                   color: 'primary.text'
               }}>
                 {isCollapse ? <ExpandLessIcon /> : <ExpandMoreIcon />}
               </IconButton>
               </Box>
               <Collapse in={isCollapse} sx={{pl: 1, pr: 1, m: 2, backgroundColor: 'primary.light', color: 'bodycolor.text'}}>
                    <AuditDetails />
                    <InternalAuditDetails />
                    <EKYCAuditDetails />
                    <EKYCVerificationDetails />
                    <RAAuditDetails />
                    <CourtCases />
                      <RevocationDSC />
                    <EmpanelmentCryptoToken />
                   <CADetails />
                   <DCDetails />
                    <CAServiceDetails />
                     <ASPDetails />
                     <PublicInformationWebsite />
                    <CostOfCertificates />
                   <CASelfAssessment />
                 <CASoftwareExternalConnectivity />
                    <DownTimeAuditPeriod />
                    <TrustedPersonsList /> 
            </Collapse>
        </>
    )
}

export default AnnexureA2Main;