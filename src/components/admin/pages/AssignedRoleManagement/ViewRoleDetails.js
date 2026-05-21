import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { InputLabel } from '@mui/material';
import { useState } from 'react';
import Captcha from '../../../global/util/Captcha';
import validatePattern from '../../../global/util/ValidatePattern';
import LoaderProgress from '../../../global/common/LoaderProgress';
import showAlert from '../../../global/common/MessageBox/AlertService';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import FormWrapper from '../../../global/util/FormWrapper';
import RoleService from '../../../../service/AdminService/RoleService';
import { decrypt } from '../../../global/util/EncryptDecrypt';
import RoleMasterService from '../../../../service/AdminService/RoleMasterService';
import CCAStaffService from '../../../../service/AdminService/CCAStaffService';
import { useSelector } from 'react-redux';
import { WidthFull } from '@mui/icons-material';

const ViewRoleDetails = () => {
    const [roleFormValues, setRoleFormValues] = useState([]);

    const [staffFormValues, setStaffFormValues] = useState({
        staffId: '',
        salutation: '',
        firstName: '',
        middleName: '',
        lastName: '',
        mobileNo: '',
        emailId: '',   
        designation: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    const routeRootPath = useSelector((state) => state.jwtAuthentication.rolePath);


    const navigate = useNavigate();
    let { id } = useParams();

    //Optional: Uncomment if needed to fetch role details
    useEffect(() => {
        if (id) {
            setLoading(true);
            RoleMasterService.getDetailsByUserid(decrypt(id))
                .then((response) => {
                    console.log(response.data)

                    setRoleFormValues(response.data)
                })
                .catch((err) => {
                   // navigate('/admin/userrole', { replace: true })
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            navigate('/admin/userrole', { replace: true });
        }
    }, [id, navigate]);

    console.log("-=-==->",roleFormValues)

    useEffect(()=>{
        if(id){

            setLoading(true);
            CCAStaffService.getCCAStaffById(decrypt(id))
            .then((response)=>{

                setStaffFormValues({

                    staffId: response.data.staffId,
                    salutation: response.data.salutation,
                    firstName: response.data.firstName,
                    middleName: response.data.middleName,
                    lastName: response.data.lastName,
                    mobileNo: response.data.mobileNo,
                    emailId: response.data.emailId,   
                    designation: response.data.designation
        
                })  

            })
            .catch((err)=>{
                navigate(`${routeRootPath}/ccastaff`, { replace: true })
            })
            .finally(()=>{
                setLoading(false);
            })

    }else{
       // navigate(`${routeRootPath}/addrole`, { replace: true })
    }

    },[])

    console.log("==-0-->",staffFormValues)

    const handleToggleChange = (roleId) => {
        // Find the role to update
        const updatedRoles = roleFormValues.map(role => {
            if (role.roleId === roleId) {
                return { ...role, status: role.status === 'Active' ? 'Inactive' : 'Active' };
            }
            return role;
        });
    
        setRoleFormValues(updatedRoles);
    
        console.log(roleId)
        // Call the API to update the status on the server
        RoleMasterService.changeUserRoleStatus(roleId)
            .then((response) => {
                console.log("Status updated successfully:", response.data);
            })
            .catch((err) => {
                console.error("Error updating status:", err);
                // Optionally revert the local state if the API call fails
                setRoleFormValues(roleFormValues); // Restore previous state
            });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (captchaText !== captchaInput) {
            showAlert({
                messageTitle: 'Captcha Error',
                messageContent: 'Captcha input does not match',
                confirmText: 'Ok',
                enableHeaderCloseBtn: true,
                disableOutsideKeyDown: false,
            });
            return;
        }
        setLoading(true);
        RoleService.updateRole(roleFormValues)
            .then((response) => {
                showAlert({
                    messageTitle: 'Update role',
                    messageContent: response.data,
                    confirmText: 'Ok',
                    onConfirm: () => { navigate("/admin/userrole"); },
                    enableHeaderCloseBtn: false,
                    disableOutsideKeyDown: true,
                });
            })
            .catch((err) => {
                showAlert({
                    messageTitle: 'Error',
                    messageContent: err.response?.data
                        ? typeof err.response.data === 'object'
                            ? 'Your request cannot be processed at this time. Please try again later.'
                            : err.response.data
                        : 'Your request cannot be processed at this time. Please try again later.',
                    confirmText: 'Ok',
                    enableHeaderCloseBtn: true,
                    disableOutsideKeyDown: false,
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleBack = () => {
        navigate("/admin/addrole", { replace: true });
    };

    return (
        <>
            <LoaderProgress open={isLoading} />
            <Box component="div">
                <Grid container spacing={2} direction={'column'}>
                    <Grid item sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right', mr: 2 }}>
                        <Button variant="contained" onClick={handleBack}>
                            <Typography variant="h6">Back</Typography>
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <FormWrapper headingText="View Assign Role" >
                <Box component="form" noValidate sx={{width: {md: '630px'}, mt: 2}} onSubmit={handleFormSubmit}>

                <Grid container spacing={2} sx={{ml: 1}}>
                <Grid item sm={6} >
                    <Typography variant="h6" color="primary.tabletext">Full Name:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="body1"sx={{ whiteSpace: 'nowrap' }}>
                        {staffFormValues.salutation} {staffFormValues.firstName} {staffFormValues.middleName} {staffFormValues.lastName}
                    </Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ml: 1}}>
                <Grid item sm={6} >
                    <Typography variant="h6" color="primary.tabletext">Designation:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="body1">
                        {staffFormValues.designation}
                    </Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ml: 1}}>
                <Grid item sm={6} >
                    <Typography variant="h6" color="primary.tabletext">Email Id:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="body1">
                        {staffFormValues.emailId}
                    </Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ml: 1}}>
                <Grid item sm={6} >
                    <Typography variant="h6" color="primary.tabletext">Mobile No:</Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="body1">
                        {staffFormValues.mobileNo}
                    </Typography>
                </Grid>
            </Grid>
            <TableContainer sx={{mt: 4, mb: 4}}>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: "tablecolor.main", color: "tablecolor.text" }}>
                        <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Sr.No.</TableCell>
                        <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Role Name</TableCell>
                        <TableCell sx={{ border: 0.5, borderColor: 'grey.500', fontWeight: 'bold' }}>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {roleFormValues.map((role, index) => (
                        <TableRow key={role.roleId}>
                            <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{index + 1}</TableCell>
                            <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>{role.roleName}</TableCell>
                            <TableCell sx={{ border: 0.5, borderColor: 'grey.500' }}>
                            {role.status}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
                </Box>
            </FormWrapper>
           
        </>
    );
};

export default ViewRoleDetails;
