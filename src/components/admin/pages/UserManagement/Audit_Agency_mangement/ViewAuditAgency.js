import { useEffect, useState } from 'react';
import {
    GridActionsCellItem,
} from '@mui/x-data-grid';
import { Switch, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PreviewIcon from '@mui/icons-material/Preview';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../../global/util/DateFormatter';
import CustomTable from '../../../../global/util/CustomTable';
import AuditAgency from '../../../../../service/AdminService/AuditAgency';
import { useNavigate } from 'react-router-dom';
import { encrypt } from '../../../../global/util/EncryptDecrypt';
import ViewAuditAgencyDetails from './ViewAuditAgencyDetails';
import ViewsAuditAgencyDetails from './ViewsAuditAgencyDetails';
import ActionCell from './ActionCell';

const ViewAuditAgency = () => {

    const [allAuditAgencyList, setAllAuditAgencyList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();
    const label = { inputProps: { 'aria-label': 'Switch' } };

    console.log("abc=>", encrypt(3))
    const getAllAuditAgency = () => {
        setLoading(true);
        AuditAgency.getAllAuditAgencyList()
            .then((response) => {
                let list = response.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['created'] = dateFormatter(obj.created);
                    obj['updated'] = dateFormatter(obj.updated);
                    obj['fullAddress'] = `${obj.blockNo || ''}, ${obj.village || ''}, ${obj.postOffice || ''}, ${obj.subDivision || ''}`.trim();
                   // obj['status'] = 'Inactive'; 

                    // Fetch statuses and update the list
                    AuditAgency.getAuditAgencyList()
                        .then((statusResponse) => {
                            console.log("abc=>", statusResponse);
                            const encryptedAuditAgencyId = encrypt(obj.auditAgencyId);

                            // Find the matching status using the encrypted ID
                            const matchingStatus = statusResponse.data.find(item => item.userId === encryptedAuditAgencyId);

                            if (matchingStatus) {
                                console.log("abc=>", matchingStatus);
                                obj['status'] = matchingStatus.status;
                            }
                        });


                    return obj;
                });

                setAllAuditAgencyList(list);
            })
            .catch((err) => {
                console.error('Error fetching audit agencies:', err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    console.log("allAuditAgencyList",allAuditAgencyList)

    const yes = (intent) => {
        setLoading(true);

        if (!intent) {
            setLoading(false);
            return;
        }

        console.log("intent.Id-=->",intent);

        AuditAgency.changeAuditAgencyStatus(intent.auditAgencyId)
            .then((response) => {
                showAlert({
                    messageTitle: 'Audit Agency Details',
                    messageContent: 'Audit Agency is verified.',
                    confirmText: 'OK',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false,
                });
                getAllAuditAgency();
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: err.response?.data ? typeof err.response.data === 'object' ? 'Your request cannot be processed at this time. Please try again later.' : err.response.data : 'Your request cannot be processed at this time. Please try again later.',
                    confirmText: 'Ok',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: true
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const changeCityStatus = (id) => {
        setLoading(true);
        console.log(id)
        AuditAgency.changeUserStatus(id)
            .then((response) => {
                console.log(response)
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Please Verified your Account',
                    confirmText: 'Ok',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: true
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const verify = (intent) => {
        showAlert({
            messageTitle: 'Verify',
            messageContent: "Are you sure you want to verify?",
            confirmText: 'Yes',
            closeText: "No",
            onConfirm: () => yes(intent),
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true,
            maxWidth: 'sm',
            fullWidth: true
        });
    }

    const ViewssAuditAgencyDetails = (cid) => {
        console.log("cid=-=-->",cid)
        const intent = allAuditAgencyList.find((obj) => obj.auditAgencyId === (cid));
        console.log(intent)
        const status = intent.status;

        console.log('status=---->',status);
        showAlert({
            messageTitle: 'Verify Intent Details',
            messageContent: <ViewAuditAgencyDetails auditAgency={intent} />,
            confirmText: status==='Active'?'Ok':'Verify',
            onConfirm: status==='Active'?'':() => verify(intent),
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true,
            fullWidth: true,
            maxWidth: "md",
        });
    };

    const AuditAgencysDetails = (cid) => {
        const intent = allAuditAgencyList.find((obj) => obj.id === cid);

        showAlert({
            messageTitle: 'View Intent Details',
            messageContent: <ViewsAuditAgencyDetails auditAgency={intent} />,
            confirmText: 'Ok',
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true,
            maxWidth: 'md',
            fullWidth: true
        });
    };

    useEffect(() => {
        getAllAuditAgency();
    }, [])

    const columns = [
        { field: 'id', headerName: 'Sl. No.', resizable: false },
        { field: 'auditAgencyName', headerName: 'Audit Agency Name', resizable: false, width: 200, },
        { field: 'fullAddress', headerName: 'Address', resizable: false, width: 200, },
        { field: 'effectiveFrom', headerName: 'Effective From', resizable: false, width: 200, },
        { field: 'effectiveTo', headerName: 'Effective To', resizable: false, width: 200, },
        { field: 'created', headerName: 'Created', resizable: false, width: 150, },
        { field: 'updated', headerName: 'Updated', resizable: false, width: 150, },
        {
            field: 'status', headerName: 'Status', resizable: false, width: 150,
            renderCell: (params) => (
                <Switch
                    {...label}
                    checked={params.row.status === "Active"}
                    onChange={() => changeCityStatus(params.row.auditAgencyId)}
                />
            )
        },

        {
            field: 'action', headerName: 'Action', resizable: false, flex: 1, minWidth: 150, sortable: false,
            renderCell: (params) => (

                <>
                <Tooltip title="View">
                    <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="View" onClick={() => ViewssAuditAgencyDetails(params.row.auditAgencyId)} />
                </Tooltip>
            </>


                // <ActionCell
                //     auditAgencyId={params.row.auditAgencyId}
                //     params={params}
                //     ViewssAuditAgencyDetails={ViewssAuditAgencyDetails}
                // />
            )
        }


    ]

    return (
        <>
            <CustomTable columns={columns} rows={allAuditAgencyList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />
        </>
    )
}

export default ViewAuditAgency;
