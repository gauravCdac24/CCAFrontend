import {useEffect, useState} from 'react';

import {
        GridActionsCellItem, 
    } from '@mui/x-data-grid';
    import {Box, Grid, Switch, Tooltip} from '@mui/material';
import  DeleteIcon  from '@mui/icons-material/Delete';
import  EditIcon  from '@mui/icons-material/Edit';
import  VisibilityIcon  from '@mui/icons-material/Visibility';
import CityService from '../../../../../service/AdminService/CityService';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import dateFormatter from '../../../../global/util/DateFormatter';
import CustomTable from '../../../../global/util/CustomTable';
import ViewCityDetails from './ViewCityDetails'
import { encrypt } from '../../../../global/util/EncryptDecrypt';
import { useNavigate } from 'react-router-dom';
const ViewCity = () => {

    const [allCityList, setAllCityList] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const navigate=useNavigate()
    const label = { inputProps: { 'aria-label': 'Switch' } };

    const getAllState = () =>{

        setLoading(true);

        CityService.getAllCityList()
        .then((response)=>{

            const list = response.data.map((obj, index) => {
                obj['id'] = index + 1;
                obj['created'] = dateFormatter(obj.created);
                obj['updated'] = dateFormatter(obj.updated);
                return obj;
              });
              setAllCityList(list);

            
        })
        .catch((err)=>{

        })
        .finally(()=>{
            setLoading(false)
        })

    }

    const changeCityStatus = (id) => {
        setLoading(true);
        CityService.changeCityStatus(id)
        .then((response)=>{

        })
        .catch((err)=>{

        })
        .finally(()=>{
            setLoading(false);
        })
    }

    
    useEffect(()=>{

        getAllState();

    }, [])


    const viewCity = (cid) =>{
        const city = allCityList.find((obj)=>obj.id===cid)
        
        showAlert({
            messageTitle: 'View City',
            messageContent: (<>
                <ViewCityDetails cityObj={city} />
            </>),
            confirmText: 'Ok',
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true
        })
    }

    const deleteCityById = (id) =>{
        setLoading(true);
        CityService.delete(id)
        .then((response)=>{

            showAlert({
                messageTitle: 'Delete City',
                messageContent: 'City has been deleted successfully.',
                confirmText: 'OK',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: false
            })
            getAllState();

        }).catch((err)=>{

            showAlert({
                messageTitle: 'Delete City',
                messageContent: 'Error in deleting city.',
                confirmText: 'OK',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: false
            })

        })
        .finally(()=>{
            setLoading(false);
        })
    }

    const editCity = (cid) => {
        const city = allCityList.find((obj) => obj.id === cid);
        if (city) {
            const encryptedId = encodeURIComponent(encrypt(city.cityId));
            navigate(`/admin/city/editcity/${encryptedId}`);
        } else {
            showAlert({
                messageTitle: 'Edit City',
                messageContent: 'Error in updating City details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const deleteCity = (id) => {
        const city = allCityList.find((obj)=>obj.id===id);
        
        showAlert({
            messageTitle: 'Delete City',
            messageContent: 'Are you sure, you want to delete?',
            confirmText: 'Yes',
            closeText: 'No',
            onConfirm: () => {deleteCityById(city.cityId)},
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: false
        })
    }


    const columns = [
        {field: 'id', headerName: 'Sl. No.', resizable: false},
        {field: 'cityName', headerName: 'City Name', resizable: false, width: 200,},
        {field: 'stateId', headerName: 'State Name', resizable: false, width: 200, valueGetter: (params) =>
            `${params.stateName}`,},
        {field: 'created', headerName: 'Created', resizable: false,  width: 150,},
        {field: 'updated', headerName: 'Updated', resizable: false,  width: 150,},
        {field: 'status', headerName: 'Status', resizable: false,  width: 150,
            renderCell: (params)=>(
                <Switch {...label} checked={params.row.status==="Active"} onClick={()=>changeCityStatus(params.row.cityId)} />
            )
        },
        {field: 'action', headerName: 'Action', resizable: false, flex: 1, minWidth: 150, sortable: false,

            
            renderCell: (params)=>(
                <>
                    <Tooltip title="View">
                        <GridActionsCellItem
                        icon={<VisibilityIcon color="success" />}
                        label="View"
                        onClick={()=>viewCity(params.id)}
                        />
                    </Tooltip>
    
                    <Tooltip title="Edit">
                            <GridActionsCellItem icon={<EditIcon color="info" />} label="Edit" onClick={() => editCity(params.id)} />
                        </Tooltip>
    
                   
                </>
             )},
    ]

    return(
        <>
            
            <CustomTable columns={columns} rows={allCityList} hideColumnsForExport={['Action']} pageSizeOptions={[10, 25, 50, 100]} />

        </>
    )

}

export default ViewCity;