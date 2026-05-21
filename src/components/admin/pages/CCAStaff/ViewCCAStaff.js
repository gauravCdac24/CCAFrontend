import { useEffect, useMemo, useState } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import {Box, Link, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CCAStaffService from '../../../../service/AdminService/CCAStaffService';
import showAlert from '../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../global/util/DateFormatter';
import CustomTable from '../../../global/util/CustomTable';
import { useNavigate } from 'react-router-dom';
import { encrypt } from '../../../global/util/EncryptDecrypt';
import { useSelector } from "react-redux";
import ViewCCAStaffDetails from './ViewCCAStaffDetails';

const ViewCCAStaff = () => {
    const [allCCAStaffList, setAllCCAStaffList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const routeRootPath = useSelector((state) => state.jwtAuthentication.rolePath);

    const getAllCCAStaff = () => {
        setLoading(true);

        CCAStaffService.getAllCCAStaffList()
            .then((response) => {
                const list = response.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['created'] = dateFormatter(obj.created);
                    obj['updated'] = dateFormatter(obj.updated);
                    obj['fullname'] = `${obj.salutation || ''} ${obj.firstName || ''} ${obj.middleName || ''} ${obj.lastName || ''}`.trim();
                    obj['mobileNo'] = `+91 - ${obj.mobileNo}`
                    return obj;
                });
                setAllCCAStaffList(list);
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: 'Error fetching cca staff list. Please try again later.',
                    confirmText: 'OK',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getAllCCAStaff();
    }, []);

    const viewCCAStaff = (cid) => {
        const ccaStaff = allCCAStaffList.find((obj) => obj.id === cid);
        if (ccaStaff) {
            showAlert({
                messageTitle: 'View Registered Employee',
                messageContent: <ViewCCAStaffDetails ccaStaffObj={ccaStaff} />,
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        } else {
            showAlert({
                messageTitle: 'View Registered Employee',
                messageContent: 'Error in getting cca staff details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const editCCAStaff = (cid) => {
        const ccaStaff = allCCAStaffList.find((obj) => obj.id === cid);
        if (ccaStaff) {
            const encryptedId = encodeURIComponent(encrypt(ccaStaff.staffId));
            navigate(`${routeRootPath}/ccastaff/editccastaff/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit Registered Employee',
                messageContent: 'Error in updating cca staff details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false, width: 100 },
            { field: 'fullname', headerName: 'Name', resizable: false, width: 200},
            { field: 'designation', headerName: 'Designation', resizable: false, width: 150},
            { field: 'mobileNo', headerName: 'Mobile Number', resizable: false, width: 130},
            { field: 'emailId', headerName: 'Email Id', resizable: false, width: 200,
                renderCell: (params)=>(
                    <Box component='span'><Link href={`mailto:${params.row.emailId}`}>{(params.row.emailId.replace('@', '[at]')).replace('.', '[dot]')}</Link></Box>
                )
            },
            { field: 'created', headerName: 'Created', resizable: false, width: 150 },
            { field: 'updated', headerName: 'Updated', resizable: false, width: 150 },
           
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
                            <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="View" onClick={() => viewCCAStaff(params.id)} />
                        </Tooltip>
                        <Tooltip title="Edit">
                            <GridActionsCellItem icon={<EditIcon color="info" />} label="Edit" onClick={() => editCCAStaff(params.id)} />
                        </Tooltip>
                    </>
                ),
            },
        ],
        [allCCAStaffList] 
    );

    return (
        <>
            <CustomTable columns={columns} rows={allCCAStaffList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />
        </>
    );
};

export default ViewCCAStaff;
