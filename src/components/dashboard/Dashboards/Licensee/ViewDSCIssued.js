import { useEffect, useMemo, useState } from 'react';
import { Button, Grid, Tooltip, Typography } from '@mui/material';
import DashboardService from '../../../../service/DashboardService/DashboardService';
import dateFormatter from '../../../global/util/DateFormatter';
import CustomTable from '../../../global/util/CustomTable';
import { useNavigate } from 'react-router-dom';
import { decrypt, encrypt } from '../../../global/util/EncryptDecrypt';
import { useSelector } from 'react-redux';
import CountryService from '../../../../service/AdminService/CountryService';
import StateService from '../../../../service/AdminService/StateService';

const ViewDSCIssued = () => {
    const [dsceSignIssued, setDSCeSignIssued] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const navigate = useNavigate();
    const rolePath = useSelector((state) => state.jwtAuthentication.rolePath);

    

    const getAllDSCeSignIssued = async () => {
       // setLoading(true);

            try{

                const [DSCeSignIssuedResponse, countries, states] = await Promise.all([

                    DashboardService.getAllDSCeSignIssued(),
                    CountryService.getAllCountryList(),
                    StateService.getAllStateList()


                ]);

                    setCountryList(countries.data);
                    setStateList(states.data);


                const list = DSCeSignIssuedResponse.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['created'] = dateFormatter(obj.created);
                    obj['updated'] = dateFormatter(obj.updated);
                   
                    const decryptedCountryId = parseInt(decrypt(obj.countryId), 10);
                    const decryptedStateId = parseInt(decrypt(obj.stateId), 10);

                    const country = countries.data.find((e) => e.countryId === decryptedCountryId);
                    const state = states.data.find((e) => e.stateId === decryptedStateId);

                    obj['countryId'] = country ? country.countryName : '-'; 
                    obj['stateId'] = state ? state.stateName : '-'; 



                    return obj;
                });
                setDSCeSignIssued(list);



            }catch(err){

               

            }finally {
              //  setLoading(false)
            }

        

    };

    useEffect(() => {
        getAllDSCeSignIssued();
       
    }, []);

    
    

    
    

    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false, width: 90 },
            { field: 'dscIssued', headerName: 'DSC Issued', resizable: false, width: 150 },
            { field: 'countryId', headerName: 'Country Name', resizable: false, width: 150 },
            { field: 'stateId', headerName: 'State Name', resizable: false, width: 150 },
            { field: 'month', headerName: 'Month', resizable: false, width: 150 },
            { field: 'year', headerName: 'Year', resizable: false, width: 150 },
        ],
        [dsceSignIssued] 
    );

    const handleBack = () => {
        navigate(-1);
    }

    return (
        <>
        <Grid container spacing={2} direction={'column'}>

            <Grid  sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                
                <Button variant="contained"  onClick={handleBack}>
                    <Typography variant="h6">Back</Typography>
                </Button>
            </Grid>

            </Grid>
            <CustomTable customTitle = "DSC Issued List" columns={columns} rows={dsceSignIssued} hideColumnsForExport={['']} pageSizeOptions={[10, 25, 50, 100]} />
        </>
    );
};

export default ViewDSCIssued;
