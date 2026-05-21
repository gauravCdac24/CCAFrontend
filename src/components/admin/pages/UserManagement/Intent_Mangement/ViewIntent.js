import { useState, useEffect, useMemo } from 'react';
import CustomTable from '../../../../global/util/CustomTable';
import IntentService from '../../../../../service/AdminService/IntentService';
import dateFormatter from '../../../../global/util/DateFormatter';
import ViewIntentDetails from './ViewIntentDetails';
import showAlert from '../../../../global/common/MessageBox/AlertService';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Tooltip, Switch, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';

const ViewIntent = () => {
    const [allIntentList, setAllIntentList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const label = { inputProps: { 'aria-label': 'Switch' } };

    const getAllIntentList = () => {

        setLoading(true);

        IntentService.getAllIntentWithLoginDetails()
        .then((response)=>{



            const list = response.data.map((obj, index) => {
                obj['id'] = index + 1;
                obj.intent['created'] = dateFormatter(obj.intent.created);
                obj.intent['updated'] = dateFormatter(obj.intent.updated);
                obj.intent['fullName'] = `${obj.intent.salutation || ''} ${obj.intent.firstName || ''} ${obj.intent.middleName || ''} ${obj.intent.lastName || ''}`.trim();
                
                return obj;
            });
            setAllIntentList(list);
            
        })
        .catch((err)=>{

        })
        .finally(()=>{
            setLoading(false);
        })
    }

    useEffect(()=>{
        getAllIntentList();
    },[])
    
    
    const verifyIntent = (id) => {
        
        setLoading(true);
        IntentService.verifyIntentById(id)
            .then((response) => {
                showAlert({
                    messageTitle: 'Intent Details',
                    messageContent: 'Intent Details is verified.',
                    confirmText: 'OK',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false,
                });
                getAllIntentList();
            })
            .catch((err) => {

                let msg = "";

                if(err?.response?.data?.error){
                    msg="Error in verifying intent details, try after some time.";
                }else if(err?.response?.data){
                    msg=err.response.data;
                }else{
                    msg="Error in verifying intent details, try after some time.";
                }


                showAlert({
                    messageTitle: 'Intent Details',
                    messageContent: msg,
                    confirmText: 'OK',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false,
                });
            })
            .finally(() => {
                setLoading(false);
            });

    };


    const verifyIntentDetails = (id) => {
        const intent = allIntentList.find((obj) => obj.id === id);


        if (intent) {
            showAlert({
                messageTitle: 'Intent Details',
                messageContent: 'Are you sure, you want to verify details?',
                confirmText: 'Yes',
                closeText: 'No',
                onConfirm: () => verifyIntent(intent.intent.intentId),
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: false,
            });
        } else {
            showAlert({
                messageTitle: 'Intent Details',
                messageContent: 'Error in verifying intent details, try after some time.',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: true,
            });
        }
    };

    const viewIntent = (id) => {

        const intent = allIntentList.find((obj) => obj.id === id);
        const status = intent.intent.status;

        showAlert({
            messageTitle: 'Intent Details',
            messageContent: <ViewIntentDetails intentObj={intent.intent} />,
            confirmText: status==='Active'?'Ok':'Verify',
            onConfirm: status==='Active'?'':() => verifyIntentDetails(id),
            enableHeaderCloseBtn: true,
            disableOutsideKeyDown: true,
            fullWidth: true,
            maxWidth: "md",
            
        });
    };

    const changeAccountStatus = (id)=>{
        setLoading(true);
        IntentService.changeIntentAccountStatus(id)
        .then((response)=>{
            getAllIntentList();
        })
        .catch((err)=>{

        })
        .finally(()=>{
            setLoading(false);
        })
    }


    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false },
            { field: 'fullName', headerName: 'Name', resizable: false, width: 200,
                renderCell: (params) => (
                    <>
                        {params.row.intent.fullName}
                    </>
                ),
            },
            { field: 'emailId', headerName: 'Email Id', resizable: false, width: 220,
                renderCell: (params)=>(
                    <Box component='span'><Link href={`mailto:${params.row.intent.uniqueCodeId.emailId}`}>{(params.row.intent.uniqueCodeId.emailId.replace('@', '[at]')).replace('.', '[dot]')}</Link></Box>
                )
            },

            { field: 'mobileNo', headerName: 'Mobile No', resizable: false, width: 130,

                renderCell: (params) => (
                    <>
                        {`+91 - ${params.row.intent.uniqueCodeId.mobileNo}`}
                    </>
                ),
            },

            { field: 'created', headerName: 'Created At', resizable: false, width: 150,

                renderCell: (params) => (
                    <>
                        {params.row.intent.created}
                    </>
                ),
            },

            { field: 'updated', headerName: 'Updated At', resizable: false, width: 100,

                renderCell: (params) => (
                    <>
                        {params.row.intent.updated}
                    </>
                ),
            },
            
            {
                field: 'status',
                headerName: 'Status',
                resizable: false,
                width: 150,
                renderCell: (params) => (
                    <>
                        {params.row.intent.status === "Active" ? (
                            <Switch
                                checked={params.row.accountStatus === 'Active'}
                                onClick={() => changeAccountStatus(params.row.intent.intentId)}
                            />
                        ) : (
                            <>Not Verified</>
                        )}
                    </>
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
                            <GridActionsCellItem icon={<VisibilityIcon color="success" />} label="View" onClick={() => viewIntent(params.id)} />
                        </Tooltip>
                    </>
                ),
            },
        ],
        [allIntentList]
    );
    



    return (
        <>
            <CustomTable
                rows={allIntentList}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                hideColumnsForExport={['Action']}
                pageSizeOptions={[5, 10, 15, 20]}
            />
        </>
    );
};

export default ViewIntent;
