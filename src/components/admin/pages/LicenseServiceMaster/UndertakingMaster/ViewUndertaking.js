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
import ViewUndertakingDetails from './ViewUndertakingDetails';
import Undertaking from '../../../../../service/AdminService/Undertaking';
const ViewUndertaking = () => {
    const [allSubServiceList, setAllSubServiceList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();
    const label = { inputProps: { 'aria-label': 'Switch' } };

    const getAllUndertaking= () => {
        setLoading(true);
        Undertaking.getAllUndertakingList()
            .then((response) => {
                console.log("Fetched undertaking list:", response.data);
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
                console.error("Error fetching underTaking list:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

  
    const editUndertaking = (cid) => {
        const undertaking = allSubServiceList.find((obj) => obj.id === cid);
        if (undertaking) {
            console.log(undertaking.undertakingId)
            const encryptedId = encodeURIComponent(encrypt(undertaking.undertakingId));
            navigate(`/admin/undertaking/editundertaking/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit Undertaking',
                messageContent: 'Error in updating Undertaking details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };
   
  
   
   
    useEffect(() => {
        getAllUndertaking();
    }, []); 

    const viewUndertakings = (cid) => {
        console.log("Viewing undertaking:", cid);
        const service = allSubServiceList.find((obj) => obj.id === cid);
        console.log("Viewing undertaking:", service);
      
        showAlert({
            messageTitle: 'View Undertaking ',
            messageContent: (<ViewUndertakingDetails serviceObj={service} />),
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
            { field: 'undertakingsTitle', headerName: 'Undertaking', resizable: false, width: 200 },
            { field: 'appTypeMasterId', headerName: 'Application Type Name', resizable: false, width: 200 , valueGetter: (params) =>`${params.appType}`, },
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
                                onClick={() => viewUndertakings(params.row.id)} // Use params.row.id
                            />
                        </Tooltip>
                       { params.row.status === 'Active' && (
          <GridActionsCellItem
            icon={<EditIcon color="info" />}
            label="Edit"
            onClick={() => editUndertaking(params.row.id)}
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

export default ViewUndertaking;
