import { useEffect, useMemo, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Switch, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EsignDocTypeService from '../../../../service/AdminService/EsignDocTypeService';
import showAlert from '../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../global/util/DateFormatter';
import CustomTable from '../../../global/util/CustomTable';
import { useNavigate } from 'react-router-dom';
import { encrypt } from '../../../global/util/EncryptDecrypt';
import { useSelector } from 'react-redux';
import ViewDocumentDetails from './ViewDocumentDetails';
import DocumentService from '../../../../service/AdminService/DocumentService';

const ViewDocument = () => {
   
    const [isLoading, setLoading] = useState(false);
    const label = { inputProps: { 'aria-label': 'Switch' } };
    const navigate = useNavigate();
    const rolePath = useSelector((state) => state.jwtAuthentication.rolePath);


     const [docTypeList, setDocTypeList] = useState([]);
    const getAllDocType = () => {
        setLoading(true);

        DocumentService.getAllDocumentName()
            .then((response) => {
                const list = response.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['created'] = dateFormatter(obj.created);
                    obj['updated'] = dateFormatter(obj.updated);
                    return obj;
                });
                setDocTypeList(list);
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error fetching document name list. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getAllDocType();
    }, []);

    const changeEsignDocTypeStatus = (id) => {
        setLoading(true);
        DocumentService.changeDocumentNameStatus(id)
            .then((response) => {
                getAllDocType(); //Refresh
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error changing  document name status. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const viewDocument = (cid) => {
        const obj = docTypeList.find((obj) => obj.id === cid);
        if (obj) {
            showAlert({
                messageTitle: 'View Esign document type',
                messageContent: <ViewDocumentDetails docTypeObj={obj} />,
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        } else {
            showAlert({
                messageTitle: 'View Esign document type',
                messageContent: 'Error in getting document name details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const editDocument = (cid) => {
        const obj = docTypeList.find((obj) => obj.id === cid);
        if (obj) {
            const encryptedId = encodeURIComponent(encrypt(obj.documentId));
            navigate(`${rolePath}/documentName/editdocumentName/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit Esign document type',
                messageContent: 'Error in updating  document name details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    
    

    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false, width: 90 },
            { field: 'documentName', headerName: 'Document Name', resizable: false, width: 150 },
            { field: 'created', headerName: 'Created', resizable: false, width: 150 },
            { field: 'updated', headerName: 'Updated', resizable: false, width: 150 },
            {
                field: 'status',
                headerName: 'Status',
                resizable: false,
                width: 100,
                renderCell: (params) => (
                    <Switch {...label} checked={params.row.status === 'Active'} onClick={() => changeEsignDocTypeStatus(params.row.documentId)} />
                ),
            },
            {
                field: 'action',
                headerName: 'Action',
                resizable: false,
                flex: 1,
                minWidth: 100,
                sortable: false,
                renderCell: (params) => (
                    <>
                        <Tooltip title="View">
                            <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="View" onClick={() => viewDocument(params.id)} />
                        </Tooltip>
                        <Tooltip title="Edit">
                            <GridActionsCellItem icon={<EditIcon color="info" />} label="Edit" onClick={() => editDocument(params.id)} />
                        </Tooltip>
                        
                    </>
                ),
            },
        ],
        [docTypeList] 
    );

    return (
        <>
            <CustomTable customTitle = "Document Master" columns={columns} rows={docTypeList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />
        </>
    );
};

export default ViewDocument;
