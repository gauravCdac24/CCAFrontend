import { useEffect, useRef, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import {Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import showAlert from '../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../global/util/DateFormatter';
import CustomTable from '../../../global/util/CustomTable';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LicenseIssuanceService from '../../../../service/LicenseIssuanceService/LicenseIssuanceService';
import AuditAgencySelection from './AuditAgencySelection';
import { decrypt, encrypt } from '../../../global/util/EncryptDecrypt';
import AnnualAuditService from '../../../../service/AnnualAuditService/AnnualAuditService';

const AgencySelection = () => {
    const [allApplicationList, setAllApplicationList] = useState([]);
    const [isStarted, setStarted] = useState(false);
  
    const navigate = useNavigate();
    const routeRootPath = useSelector((state) => state.jwtAuthentication.rolePath);
    const userName = useSelector((state) => state.jwtAuthentication.username);
    

      //------Manish
      const ref = useRef();

  
      const handleAddAuditAgencySubmit = () =>{
          ref.current.handleSubmit();
      }
  
      const handleAddAuditAgencyReset = () => {
          ref.current.handleReset();
      }

      const getAllApplications = () => {
        LicenseIssuanceService.getLicenseDetailsByUserName(userName)
            .then((response) => {
                console.log(response.data);
    
                // Check if the response data is an object and not an array
                const applicationData = response.data; // If this is a single object
                
                // Add 'id', 'issueDate' and 'expiryDate' formatting directly to the object
                const formattedApplication = {
                    id: 1, // If you're adding a specific 'id' or if needed, you can generate it
                    issueDate: dateFormatter(applicationData.issueDate),
                    expiryDate: dateFormatter(applicationData.expiryDate),
                    ...applicationData, // Include other fields from response.data
                };
    
                // Set the formatted object (or array of objects if you prefer)
                setAllApplicationList([formattedApplication]); // Wrap in array if necessary
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error fetching application list. Please try again later.',
                    confirmText: 'OK',
                });
            });
    };
    

    const getAnnualAuditDetails = () => {
        AnnualAuditService.getAnnualAuditStartDateByUsername(userName)
            .then((response) => {

                console.log("decrypt yes" + decrypt(response.data))

                if(decrypt(response.data)==="Yes"){

                    

                    setStarted(true);
                }
    
            })
            
    };
    

    

      const selectAuditAgency = (userName) => {
   
        
        if (userName) {
            const encryptedId = encodeURIComponent(encrypt(userName));
            navigate(`${routeRootPath}/agencyselection/selectauditagency/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: ' NC Auditor Control',
                messageContent: 'Error in NC Auditor Control, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }

    }




useEffect(() => {
    getAllApplications();
    getAnnualAuditDetails();
        
}, []);


    const columns =  [
            { field: 'id', headerName: 'Sl. No.', resizable: false,width: 70},
            { field: 'userName', headerName: 'Licensee Username', resizable: false, width: 150},
            { field: 'serialNo', headerName: 'Serial No', resizable: false, width: 150},
            { field: 'issueDate', headerName: 'License Issue Date', resizable: false, width: 150},
            { field: 'expiryDate', headerName: 'Licensee Expiry Date', resizable: false, width: 150},
            { field: 'status', headerName: 'License Status', resizable: false, width: 150},

            {
                field: 'action',
                headerName: 'Action',
                resizable: false,
                width: 150,
                renderCell: (params) => (
             
                    <>
                        { isStarted && (<Tooltip title="View">
                            <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="View" onClick={() => selectAuditAgency(params.row.userName)} />
                        </Tooltip>) }
                        
                    </>
            ),
            },
        ]
        
    

    return (
        <>
            <CustomTable columns={columns} rows={allApplicationList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />
        </>
    );
};

export default AgencySelection;
