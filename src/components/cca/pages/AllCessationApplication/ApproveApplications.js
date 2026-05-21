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

const ApproveApplications = () => {
    const [allApplicationList, setAllApplicationList] = useState([]);
    
    const ref= useRef();
    const navigate = useNavigate();
    const routeRootPath = useSelector((state) => state.jwtAuthentication.rolePath);

    const getAllApplications = () => {
       
        CessationService.getAllDataForCCAOfficers()
            .then((response) => {
                const list = response.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['created'] = dateFormatter(obj.created);
                    
                    return obj;
                });
                setAllApplicationList(list);
            })
            .catch((err) => {
                
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error fetching application list. Please try again later.',
                    confirmText: 'OK',
                });
            })
            
    };

    
    
    const viewApplication = (id) => {

        const encryptedId = encodeURIComponent(encrypt(id));
        navigate(`${routeRootPath}/allcessationapplicationcca/viewallcessationdatacca/${encryptedId}`);
    };
    

    // const viewApplication = (id) => {

    //     showAlert({
    //         messageTitle: 'View',
    //         messageContent:(<><PreviewPreviousApplication espappid={id} /></>),
    //         confirmText: 'Ok',
    //         enableHeaderCloseBtn: true,
    //         disableOutsideKeyDown: true,
    //         fullWidth: true,
    //         maxWidth: "md"
    //     });

    //   }


useEffect(() => {
    getAllApplications();
        
}, []);


    const columns =  [
            { field: 'id', headerName: 'Sl. No.', resizable: false},
            { field: 'userName', headerName: 'Applicant Username', resizable: false, width: 150},
            { field: 'created', headerName: 'Cessation Start Date', resizable: false, width: 150},
            { field: 'status', headerName: 'Application Status', resizable: false, width: 150},

            {
                field: 'action',
                headerName: 'Action',
                resizable: false,
                width: 150,
                renderCell: (params) => (
                    <>
                        <Tooltip title="View">
                            <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="View" onClick={() => viewApplication(params.row.cessationAppId)} />
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

export default ApproveApplications;
