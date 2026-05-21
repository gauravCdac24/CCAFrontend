import { useEffect, useMemo, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Link, Switch, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import IntentUniqueCodeService from '../../../../service/AdminService/IntentUniqueCodeService';
import showAlert from '../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../global/util/DateFormatter';
import CustomTable from '../../../global/util/CustomTable';
import ViewIntentUniqueCodeDetails from './ViewIntentUniqueCodeDetails';
import { useNavigate } from 'react-router-dom';
import { encrypt } from '../../../global/util/EncryptDecrypt';
import EditIcon from '@mui/icons-material/Edit';
import KeyIcon from '@mui/icons-material/Key';

const ViewIntentUniqueCode = () => {
    const [allUnicodeList, setAllUnicodeList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getAllIntentUniqueCode = () => {
        setLoading(true);

        IntentUniqueCodeService.getIntentUniqueCodeList()
            .then((response) => {
                const list = response.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['created'] = dateFormatter(obj.created);
                    obj['updated'] = dateFormatter(obj.updated);
                     obj['mobileNo'] = `+91 - ${obj.mobileNo}`;
                     obj['appTypeMasterId'] = obj.appTypeMasterId.appType;
                    obj['organizationName'] = obj.organizationName===''||obj.organizationName===null||obj.organizationName===undefined? "NA":obj.organizationName;
                    return obj;
                });
                setAllUnicodeList(list);
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error fetching intent code list. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getAllIntentUniqueCode();
    }, []);

    

    const viewIntentUniqueCode = (cid) => {
        const intentUniqueCode = allUnicodeList.find((obj) => obj.id === cid);
        if (intentUniqueCode) {
            showAlert({
                messageTitle: 'View Intent Code',
                messageContent: <ViewIntentUniqueCodeDetails intentUniqueCodeObj={intentUniqueCode} />,
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
                fullWidth: true,
                maxWidth: 'sm'
            });
        } else {
            showAlert({
                messageTitle: 'View Intent Code',
                messageContent: 'Error in getting intent code details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const regenrateCode = (id) => {
        setLoading(true);
        IntentUniqueCodeService.regenerateUniqueCodeById(id)
            .then((response) => {
                showAlert({
                    messageTitle: 'Regenrate Code',
                    messageContent: response.data,
                    confirmText: 'OK',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false,
                });
                getAllIntentUniqueCode(); //Refresh
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Regenrate Code',
                    messageContent: 'Error in generating unique code.',
                    confirmText: 'OK',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false,
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const regenerateIntentUniqueCode = (cid) => {
        const intentUniqueCode = allUnicodeList.find((obj) => obj.id === cid);
        if (intentUniqueCode) {
            showAlert({
                messageTitle: 'Regenerate Code',
                messageContent: 'Are you sure you want to regenrate unique code?',
                confirmText: 'Yes',
                closeText: 'No',
                onConfirm: () => regenrateCode(intentUniqueCode.uniqueCodeId),
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
                
            });
        } else {
            showAlert({
                messageTitle: 'Regenrate Code',
                messageContent: 'Error in generating unique code, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };


    const editIntentUniqueCode = (cid) => {
        const intentUniqueCode = allUnicodeList.find((obj) => obj.id === cid);
        if (intentUniqueCode) {
            const encryptedId = encodeURIComponent(encrypt(intentUniqueCode.uniqueCodeId));
            navigate(`/admin/iuniquecode/edituniquecode/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit Intent',
                messageContent: 'Error in updating intent details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    


    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false, width: 80 },
            { field: 'uniqueCode', headerName: 'Intent Code', resizable: false, width: 100},
            { field: 'emailId', headerName: 'Email Id', resizable: false, minWidth: 220,
                renderCell: (params)=>(
                    <Box component='span'><Link href={`mailto:${params.row.emailId}`}>{(params.row.emailId.replace('@', '[at]')).replace('.', '[dot]')}</Link></Box>
                )},
            { field: 'mobileNo', headerName: 'Mobile', resizable: false, width: 130},
            { field: 'organizationName', headerName: 'Organization Name', resizable: false, width: 250},
            { field: 'appTypeMasterId', headerName: 'Application Type', resizable: false, width: 130},
            { field: 'createdBy', headerName: 'Created By', resizable: false, width: 150 },
            { field: 'updatedBy', headerName: 'Updated By', resizable: false, width: 150 },
            { field: 'created', headerName: 'Created', resizable: false, width: 150 },
            { field: 'updated', headerName: 'Updated', resizable: false, width: 150 },
            { field: 'status', headerName: 'Status', resizable: false, width: 80 },
            {
                field: 'action',
                headerName: 'Action',
                resizable: false,
                flex: 1,
                minWidth: 120,
                sortable: false,
                renderCell: (params) => {
                    return (
                        <>
                            <Tooltip title="View">
                                <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="View" onClick={() => viewIntentUniqueCode(params.id)} />
                            </Tooltip>
                            {params.row.status === 'Active' && (
                                <>
                                <Tooltip title="Edit">
                                    <GridActionsCellItem icon={<EditIcon color="info" />} label="Edit" onClick={() => editIntentUniqueCode(params.id)} />
                                </Tooltip>
                                <Tooltip title="Regenrate Unique Code">
                                    <GridActionsCellItem icon={<KeyIcon color="info" />} label="Edit" onClick={() => regenerateIntentUniqueCode(params.id)} />
                                </Tooltip>
                            </>
                            )}
                        </>
                    );
                },
                
            },
        ],
        [allUnicodeList] 
    );

    return (
        <>
            <CustomTable columns={columns} rows={allUnicodeList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} customTitle='List of Generated Code for Intent' />
        </>
    );
};

export default ViewIntentUniqueCode;
