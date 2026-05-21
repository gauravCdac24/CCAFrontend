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
import ViewApplicationTypeDetails from './ViewServiceDetails';
import { encrypt } from '../../../../global/util/EncryptDecrypt';
import { useNavigate } from 'react-router-dom';
import ApplicationType from '../../../../../service/AdminService/ApplicationType';
import ViewServiceDetails from './ViewServiceDetails';
import ServiceMaster from '../../../../../service/AdminService/ServiceMaster';
const ViewService = () => {
    const [allServiceList, setAllServiceList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();
    const label = { inputProps: { 'aria-label': 'Switch' } };

    const getAllService= () => {
        setLoading(true);
        ServiceMaster.getAllServiceList()
            .then((response) => {
                console.log("Fetched Service list:", response.data);
                setAllServiceList(() => {
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

    const changeServiceStatus = (id) => {
        setLoading(true);
        MinimumAttempt.changeMinimumAttemptStatus(id)
            .then((response) => {
                getAllService(); 
            })
            .catch((err) => {
                console.error("Error changing Service status:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const editService = (cid) => {
        const service = allServiceList.find((obj) => obj.id === cid);
        if (service) {
            console.log(service)
            const encryptedId = encodeURIComponent(encrypt(service.serviceId));
            navigate(`/admin/service/editservice/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit Service',
                messageContent: 'Error in updating Service details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };
   
  
    const deleteCountryById = (id) => {
        setLoading(true);
        ServiceMaster.deleteMinimumAttempt(id)
            .then((response) => {
                showAlert({
                    messageTitle: 'Delete Service',
                    messageContent: 'Service has been deleted successfully.',
                    confirmText: 'OK',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false
                });
                getAllService(); 
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'DeleteService',
                    messageContent: 'Error in deleting Service.',
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
        getAllService();
    }, []); 

    const viewService = (cid) => {
        console.log("Viewing Service:", cid);
        const service = allServiceList.find((obj) => obj.id === cid);
        console.log("Viewing Service:", service);
      
        showAlert({
            messageTitle: 'View Service ',
            messageContent: (<ViewServiceDetails serviceObj={service} />),
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
            { field: 'serviceTitle', headerName: 'Service Name', resizable: false, width: 200 },
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
                                onClick={() => viewService(params.row.id)} // Use params.row.id
                            />
                        </Tooltip>
                       { params.row.status === 'Active' && (
          <GridActionsCellItem
            icon={<EditIcon color="info" />}
            label="Edit"
            onClick={() => editService(params.row.id)}
          />
        )
    }
                    </>
                )
            },
        ],
        [allServiceList]
    );

    return (
        <CustomTable columns={columns} rows={allServiceList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />
    );
};

export default ViewService;
