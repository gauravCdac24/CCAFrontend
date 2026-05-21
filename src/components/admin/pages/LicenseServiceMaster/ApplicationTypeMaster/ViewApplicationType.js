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
import ViewApplicationTypeDetails from './ViewApplicationTypeDetails';
import { encrypt } from '../../../../global/util/EncryptDecrypt';
import { useNavigate } from 'react-router-dom';
import ApplicationType from '../../../../../service/AdminService/ApplicationType';
const ViewApplicationType = () => {
    const [allApplicationTypeList, setAllApplicationTypeList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();
    const label = { inputProps: { 'aria-label': 'Switch' } };

    const getAllApplicationType= () => {
        setLoading(true);
        ApplicationType.getAllApplicationTypeList()
            .then((response) => {
                console.log("Fetched Application Type list:", response.data);
                setAllApplicationTypeList(() => {
                    return response.data.map((obj, index) => {
                        obj['id'] = index + 1;
                        obj['created'] = dateFormatter(obj.created);
                        obj['updated'] = dateFormatter(obj.updated);
                        return obj;
                    });
                });
            })
            .catch((err) => {
                console.error("Error fetching Application Type list:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const changeApplicationTypeStatus = (id) => {
        setLoading(true);
        MinimumAttempt.changeMinimumAttemptStatus(id)
            .then((response) => {
                getAllApplicationType(); 
            })
            .catch((err) => {
                console.error("Error changing Application Type status:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const editApplicationType = (cid) => {
        const applicationType = allApplicationTypeList.find((obj) => obj.id === cid);
        if (applicationType) {
            console.log(applicationType)
            const encryptedId = encodeURIComponent(encrypt(applicationType.appTypeMasterId));
            navigate(`/admin/applicationtype/editapplicationtype/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit Application Type',
                messageContent: 'Error in updating Application Type details, try after some time.',
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
                    messageTitle: 'DeleteApplication Type',
                    messageContent: 'Application Type has been deleted successfully.',
                    confirmText: 'OK',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false
                });
                getAllApplicationType(); 
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Delete Application Type',
                    messageContent: 'Error in deleting Application Type.',
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
        getAllApplicationType();
    }, []); 

    const viewApplicationType = (cid) => {
        console.log("Viewing Application Type:", cid);
        const applicationType = allApplicationTypeList.find((obj) => obj.id === cid);
        console.log("Viewing Application Type:", applicationType);
      
        showAlert({
            messageTitle: 'View Application Type ',
            messageContent: (<ViewApplicationTypeDetails applicationTypeObj={applicationType} />),
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
            { field: 'appType', headerName: 'Application Type Name', resizable: false, width: 200 },
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
                                onClick={() => viewApplicationType(params.row.id)} // Use params.row.id
                            />
                        </Tooltip>
                       { params.row.status === 'Active' && (
          <GridActionsCellItem
            icon={<EditIcon color="info" />}
            label="Edit"
            onClick={() => editApplicationType(params.row.id)}
          />
        )
    }
                    </>
                )
            },
        ],
        [allApplicationTypeList]
    );

    return (
        <CustomTable columns={columns} rows={allApplicationTypeList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />
    );
};

export default ViewApplicationType;
