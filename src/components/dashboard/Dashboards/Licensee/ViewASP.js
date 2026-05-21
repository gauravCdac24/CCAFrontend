import { useEffect, useMemo, useState } from 'react';
import DashboardService from '../../../../service/DashboardService/DashboardService';
import dateFormatter from '../../../global/util/DateFormatter';
import CustomTable from '../../../global/util/CustomTable';
import { useNavigate } from 'react-router-dom';
import { decrypt, encrypt } from '../../../global/util/EncryptDecrypt';
import { useSelector } from 'react-redux';
import { timeStampToDate } from '../../../global/util/TimestampConverter';
import CountryService from '../../../../service/AdminService/CountryService';

import { Button, Grid, Typography } from '@mui/material';
import StateService from '../../../../service/AdminService/StateService';

const ViewASP = () => {
    const [aspList, setASPList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const navigate = useNavigate();
    const rolePath = useSelector((state) => state.jwtAuthentication.rolePath);


    const getAllASP = async () => {
      //  setLoading(true);

            try{

                const [aspResponse, countries, states] = await Promise.all([

                    DashboardService.getAllASP(),
                    CountryService.getAllCountryList(),
                    StateService.getAllStateList()


                ]);

                    setCountryList(countries.data);
                    setStateList(states.data);


                const list = aspResponse.data.map((obj, index) => {
                    obj['id'] = index + 1;
                    obj['onBoardingDate'] = timeStampToDate(obj.onBoardingDate)
                    obj['exitDate'] = obj.exitDate? timeStampToDate(obj.exitDate) : '-'
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
                setASPList(list);



            }catch(err){

                

            }finally {
               // setLoading(false)
            }

        

    };

    useEffect(() => {
        getAllASP();
       
    }, []);


    const handleBack = () => {
        navigate(-1);
    }

    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'Sl. No.', resizable: false, width: 90 },
            { field: 'aspName', headerName: 'ASP Name', resizable: false, width: 200 },
            { field: 'emailId', headerName: 'Email Id', resizable: false, width: 150 },
            { field: 'countryId', headerName: 'Country Name', resizable: false, width: 150 },
            { field: 'stateId', headerName: 'State Name', resizable: false, width: 150 },
            { field: 'onBoardingDate', headerName: 'Onboarding Date', resizable: false, width: 150 },
            { field: 'exitDate', headerName: 'Exit Date', resizable: false, width: 150 },
        ],
        [aspList] 
    );

    return (
        <>

            <Grid container spacing={2} direction={'column'}>

            <Grid  sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                
                <Button variant="contained"  onClick={handleBack}>
                    <Typography variant="h6">Back</Typography>
                </Button>
            </Grid>

            </Grid>
            <CustomTable customTitle = "Application Service Provider List" columns={columns} rows={aspList} hideColumnsForExport={['']} pageSizeOptions={[10, 25, 50, 100]} />
        </>
    );
};

export default ViewASP;
