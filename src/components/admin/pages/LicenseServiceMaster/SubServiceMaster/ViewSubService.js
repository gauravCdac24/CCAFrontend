import { useEffect, useMemo, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Grid, Switch, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../../global/util/DateFormatter';
import CustomTable from '../../../../global/util/CustomTable';
import MinimumAttempt from '../../../../../service/AdminService/MinimumAttempt';
import { encrypt } from '../../../../global/util/EncryptDecrypt';
import { useNavigate } from 'react-router-dom';
import ApplicationType from '../../../../../service/AdminService/ApplicationType';
import ViewSubServiceDetails from './ViewSubServiceDetails';
import SubServiceMaster from '../../../../../service/AdminService/SubServiceMaster';
const ViewSubService = () => {
    const [allSubServiceList, setAllSubServiceList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();
    const label = { inputProps: { 'aria-label': 'Switch' } };

    const getAllSubService= () => {
        setLoading(true);
        SubServiceMaster.getAllServiceList()
            .then((response) => {
                console.log("Fetched Service list:", response.data);
                setAllSubServiceList(() => {
                    return response.data.map((obj, index) => {
                        obj['id'] = index + 1;
                        obj['created'] = dateFormatter(obj.created);
                        obj['updated'] = dateFormatter(obj.updated);
                        return obj;
                    });
                });
            })
            .catch((err) => {
                console.error("Error fetching Service list:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const changeSubServiceStatus = (id) => {
        setLoading(true);
        MinimumAttempt.changeMinimumAttemptStatus(id)
            .then((response) => {
                getAllSubService(); 
            })
            .catch((err) => {
                console.error("Error changing Service status:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const editSubService = (cid) => {
        const service = allSubServiceList.find((obj) => obj.id === cid);
        if (service) {
            console.log(service)
            const encryptedId = encodeURIComponent(encrypt(service.subServiceId));
            navigate(`/admin/subservice/editsubservice/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit Sub Service',
                messageContent: 'Error in updating Sub Service details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };
   
  
    const deleteCountryById = (id) => {
        setLoading(true);
        MinimumAttempt.deleteMinimumAttempt(id)
            .then((response) => {
                showAlert({
                    messageTitle: 'Delete Sub Service ',
                    messageContent: 'Sub Service has been deleted successfully.',
                    confirmText: 'OK',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false
                });
                getAllSubService(); 
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Delete Sub Service ',
                    messageContent: 'Error in deleting Sub Service.',
                    confirmText: 'OK',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

   
    useEffect(() => {
        getAllSubService();
    }, []); 

    const viewSubService = (cid) => {
        console.log("Viewing Sub Service:", cid);
        const service = allSubServiceList.find((obj) => obj.id === cid);
        console.log("Viewing Sub Service:", service);
      
        showAlert({
            messageTitle: 'View Sub Service ',
            messageContent: (<ViewSubServiceDetails serviceObj={service} />),
            confirmText: 'Ok',
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true,
            fullWidth: true,
            maxWidth: 'sm'
        });
    };

    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false, width: 100 },
            { field: 'subServiceName', headerName: 'Sub Service Name', resizable: false, width: 200 },
            { field: 'serviceId', headerName: 'Service Name', resizable: false, width: 200 , valueGetter: (params) =>`${params.serviceTitle}`, },
            { field: 'created', headerName: 'Created', resizable: false, width: 150 },
            { field: 'updated', headerName: 'Updated', resizable: false, width: 150 },
            {
                field: 'status', headerName: 'Status', resizable: false, width: 150,
              
            },
            {
                field: 'action', headerName: 'Action', resizable: false, flex: 1, minWidth: 150, sortable: false,
                renderCell: (params) => (
                    <>
                        <Tooltip title="View">
                            <GridActionsCellItem
                                icon={<VisibilityIcon color="success" />}
                                label="View"
                                onClick={() => viewSubService(params.row.id)} // Use params.row.id
                            />
                        </Tooltip>
                       { params.row.status === 'Active' && (
          <GridActionsCellItem
            icon={<EditIcon color="info" />}
            label="Edit"
            onClick={() => editSubService(params.row.id)}
          />
        )
    }
                    </>
                )
            },
        ],
        [allSubServiceList]
    );

    return (
        <CustomTable columns={columns} rows={allSubServiceList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />
    );
};

export default ViewSubService;
