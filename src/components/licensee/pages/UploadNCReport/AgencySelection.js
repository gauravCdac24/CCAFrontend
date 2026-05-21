import { useEffect, useRef, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import {Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import showAlert from '../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../global/util/DateFormatter';
import CustomTable from '../../../global/util/CustomTable';
import ESPApplicationService from '../../../../service/ESPApplicationService/ESPApplicationService';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { encrypt } from '../../../global/util/EncryptDecrypt';
import CessationService from '../../../../service/CessationService/CessationService';
import LicenseIssuanceService from '../../../../service/LicenseIssuanceService/LicenseIssuanceService';
import AuditorControls from './AuditorControls';

const AnnualAudit = () => {
    const [allApplicationList, setAllApplicationList] = useState([]);
    
    const ref= useRef();
    const navigate = useNavigate();
    const routeRootPath = useSelector((state) => state.jwtAuthentication.rolePath);
    const userName = useSelector((state) => state.jwtAuthentication.username);
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

    console.log(allApplicationList);
    
    const viewApplication = (userName) => {
        //alert(routeRootPath);
    
        // Ensure proper URL construction with `encodeURIComponent`
        const encryptedUserName = encodeURIComponent(encrypt(userName));
        navigate(`${routeRootPath}/annualncaudits/uploadnccontrols/${encryptedUserName}`);
    };
    
    



useEffect(() => {
    getAllApplications();
        
}, []);


    const columns =  [
            { field: 'id', headerName: 'Sl. No.', resizable: false},
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
                        <Tooltip title="View">
                            <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="View" onClick={() => viewApplication(params.row.userName)} />
                        </Tooltip>
                        
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

export default AnnualAudit;
