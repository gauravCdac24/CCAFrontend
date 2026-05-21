import { useEffect, useMemo, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Grid, Switch, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import showAlert from '../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../global/util/DateFormatter';
import CustomTable from '../../../global/util/CustomTable';
import MinimumAttempt from '../../../../service/AdminService/MinimumAttempt';
import ViewMinimumAttemptsDetails from './ViewMinimumAttemptsDetails';
import { encrypt } from '../../../global/util/EncryptDecrypt';
import { useNavigate } from 'react-router-dom';
const ViewMinimumAttempts = () => {
    const [allMinimumAttemptList, setAllMinimumAttemptsList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();
    const label = { inputProps: { 'aria-label': 'Switch' } };

    const getAllMinimumAttempt= () => {
        setLoading(true);
        MinimumAttempt.getAllActiveMinimumAttemptList()
            .then((response) => {
                console.log("Fetched Minimum Attempts list:", response.data);
                setAllMinimumAttemptsList(() => {
                    return response.data.map((obj, index) => {
                        obj['id'] = index + 1;
                        obj['created'] = dateFormatter(obj.created);
                        obj['updated'] = dateFormatter(obj.updated);
                        return obj;
                    });
                });
            })
            .catch((err) => {
                console.error("Error fetching Minimum Attempts list:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const changeMinimumAttemptsStatus = (id) => {
        setLoading(true);
        MinimumAttempt.changeMinimumAttemptStatus(id)
            .then((response) => {
                getAllMinimumAttempt(); 
            })
            .catch((err) => {
                console.error("Error changing Minimum Attempts status:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const editCountry = (cid) => {
        const country = allMinimumAttemptList.find((obj) => obj.id === cid);
        if (country) {
            console.log(country)
            const encryptedId = encodeURIComponent(encrypt(country.attemptId));
            navigate(`/admin/minimumattempts/editminimumattempts/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit Minimum Attempts',
                messageContent: 'Error in updating Minimum Attempts details, try after some time.',
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
                    messageTitle: 'Delete Minimum Attempts',
                    messageContent: 'Minimum Attempts has been deleted successfully.',
                    confirmText: 'OK',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false
                });
                getAllMinimumAttempt(); 
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Delete Minimum Attempts',
                    messageContent: 'Error in deleting Minimum Attempts.',
                    confirmText: 'OK',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const deleteCountry = (id) => {
        const country = allMinimumAttemptList.find((obj) => obj.id === id);
        showAlert({
            messageTitle: 'Delete Minimum Attempts',
            messageContent: 'Are you sure, you want to delete?',
            confirmText: 'Yes',
            closeText: 'No',
            onConfirm: () => { deleteCountryById(country.countryId) },
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: false
        });
    };

    useEffect(() => {
        getAllMinimumAttempt();
    }, []); 

    const viewMinimumAttempts = (cid) => {
        console.log("Viewing Minimum Attempts:", cid);
        const country = allMinimumAttemptList.find((obj) => obj.id === cid);
        console.log("Viewing Minimum Attempt:", country);
      
        showAlert({
            messageTitle: 'View Minimum Attempts',
            messageContent: (<ViewMinimumAttemptsDetails countryObj={country} />),
            confirmText: 'Ok',
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true,
            fullWidth: true,
            maxWidth: 'sm'
        });
    };

    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false, width: 80 },
            { field: 'applicationScrutiny', headerName: 'Application Scrutiny', resizable: false, width: 150, align:'center' },
            { field: 'applicationReview', headerName: 'Application Review', resizable: false, width: 150, align:'center' },
            { field: 'applicationAudit', headerName: 'Application Audit', resizable: false, width: 150, align:'center' },
            { field: 'esignApplicationReview', headerName: 'EsignApplication Review', resizable: false, width: 150, align:'center' },
            { field: 'annualAuditReview', headerName: 'Annual Audit Review', resizable: false, width: 150, align:'center' },
            { field: 'created', headerName: 'Created', resizable: false, width: 150 },
            { field: 'updated', headerName: 'Updated', resizable: false, width: 150 },
            {
                field: 'status', headerName: 'Status', resizable: false, width: 100,
                // renderCell: (params) => (
                //     <Switch {...label} checked={params.row.status === "Active"} onClick={() => changeMinimumAttemptsStatus(params.row.countryId)} />
                // )
            },
            {
                field: 'action', headerName: 'Action', resizable: false, flex: 1, minWidth: 100, sortable: false,
                renderCell: (params) => (
                    <>
                        <Tooltip title="View">
                            <GridActionsCellItem
                                icon={<VisibilityIcon color="success" />}
                                label="View"
                                onClick={() => viewMinimumAttempts(params.row.id)} // Use params.row.id
                            />
                        </Tooltip>
                       { params.row.status === 'Active' && (
          <GridActionsCellItem
            icon={<EditIcon color="info" />}
            label="Edit"
            onClick={() => editCountry(params.row.id)}
          />
        )
    }
                        {/* <Tooltip title="Delete">
                            <GridActionsCellItem
                                icon={<DeleteIcon color="error" />}
                                label="Delete"
                                onClick={() => deleteCountry(params.id)}
                            />
                        </Tooltip> */}
                    </>
                )
            },
        ],
        [allMinimumAttemptList]
    );

    return (
        <CustomTable columns={columns} rows={allMinimumAttemptList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />
    );
};

export default ViewMinimumAttempts;
