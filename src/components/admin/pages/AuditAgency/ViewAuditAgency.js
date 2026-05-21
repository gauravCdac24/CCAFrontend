import {useEffect, useState} from 'react';

import {
        GridActionsCellItem, 
    } from '@mui/x-data-grid';
import {Switch, Tooltip} from '@mui/material';
import  DeleteIcon  from '@mui/icons-material/Delete';
import  EditIcon  from '@mui/icons-material/Edit';
import  VisibilityIcon  from '@mui/icons-material/Visibility';
import showAlert from '../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../global/util/DateFormatter';
import CustomTable from '../../../global/util/CustomTable';
import AuditAgency from '../../../../service/AdminService/AuditAgency';
import { useNavigate } from 'react-router-dom';
import { encrypt } from '../../../global/util/EncryptDecrypt';
import ViewAuditAgencyDetails from './ViewAuditAgencyDetails';
const ViewAuditAgency = () => {

    const [allAuditAgencyList, setAllAuditAgencyList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();
    const label = { inputProps: { 'aria-label': 'Switch' } };

    const getAllAuditAgency = () =>{

        setLoading(true);

        AuditAgency.getAllAuditAgencyList()
        .then((response)=>{

            const list = response.data.map((obj, index) => {
                obj['id'] = index + 1;
                obj['created'] = dateFormatter(obj.created);
                obj['updated'] = dateFormatter(obj.updated);
                // obj['fullName']  =`${obj.salutation || ''} ${obj.firstName || ''} ${obj.middleName || ''} ${obj.lastName || ''}`.trim()
                obj['fullAddress']= `${obj.blockNo || ''}, ${obj.village || ''}, ${obj.postOffice || ''}, ${obj.subDivision || ''}`.trim()
                return obj;
              });
              setAllAuditAgencyList(list);

            
        })
        .catch((err)=>{

        })
        .finally(()=>{
            setLoading(false)
        })

    }

    const changeAgencyStatus = (id) => {
        setLoading(true);
        AuditAgency.changeAuditAgencyStatus(id)
        .then((response)=>{

        })
        .catch((err)=>{

        })
        .finally(()=>{
            setLoading(false);
        })
    }

    
    useEffect(()=>{

        getAllAuditAgency();

    }, [])
   

    const ViewAuditAgency = (cid) =>{
        const auditAgency = allAuditAgencyList.find((obj)=>obj.id===cid)
       
        showAlert({
            messageTitle: 'View Audit Agency',
            messageContent: (<>
                <ViewAuditAgencyDetails auditAgency={auditAgency} 
               />
            </>),
            confirmText: 'Ok',
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true,
            maxWidth:'md',
            fullWidth:true
        })
       
    }

    const editAuditAgency = (cid) => {
        const auditAgency = allAuditAgencyList.find((obj) => obj.id === cid);
        if (auditAgency) {
            const encryptedId = encodeURIComponent(encrypt(auditAgency.auditAgencyId));
            navigate(`/admin/agency/editagency/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit Audit Agency',
                messageContent: 'Error in updating audit agency details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const columns = [
        {field: 'id', headerName: 'Sl. No.', resizable: false},
        {field: 'auditAgencyName', headerName: 'Audit Agency Name', resizable: false, width: 200,},
        {field: 'fullAddress', headerName: 'Address', resizable: false, width: 200,},
        {field: 'effectiveFrom', headerName: 'Effective From', resizable: false, width: 200,},
        {field: 'effectiveTo', headerName: 'Effective To', resizable: false, width: 200,},
        {field: 'created', headerName: 'Created', resizable: false,  width: 150,},
        {field: 'updated', headerName: 'Updated', resizable: false,  width: 150,},
        {field: 'status', headerName: 'Status', resizable: false,  width: 150,
            renderCell: (params)=>(
                <Switch {...label} checked={params.row.status==="Active"} onClick={()=>changeAgencyStatus(params.row.auditAgencyId)} />
            )
        },
        {field: 'action', headerName: 'Action', resizable: false, flex: 1, minWidth: 150, sortable: false,

            
            renderCell: (params)=>(
                <>
                    <Tooltip title="View">
                        <GridActionsCellItem
                        icon={<VisibilityIcon color="success" />}
                        label="View"
                        onClick={()=>ViewAuditAgency(params.id)}
                        />
                    </Tooltip>
    
                    <Tooltip title="Edit">
                            <GridActionsCellItem icon={<EditIcon color="info" />} label="Edit" onClick={() => editAuditAgency(params.id)} />
                        </Tooltip>
    
                </>
             )},
    ]

    return(
        <>
            
            <CustomTable columns={columns} rows={allAuditAgencyList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />

        </>
    )

}

export default ViewAuditAgency;