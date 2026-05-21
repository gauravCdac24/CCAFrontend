import ViewEsignAPISpecification from "./ViewEsignAPISpecification";
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from "react-redux";

const EsignAPISpecification = () => {

    const navigate = useNavigate();
    const rolePath = useSelector((state) => state.jwtAuthentication.rolePath);

    const addEsignAPISpecification = () =>{

        navigate(`${rolePath}/apispecification/addapispecification`);

    }

    return(
        
            <Box component="div">

                <Grid container spacing={2} direction={'column'}>

                    <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  startIcon={<AddIcon />} onClick={addEsignAPISpecification}>
                            <Typography variant="h6">Add Esign API Specification</Typography>
                        </Button>
                    </Grid>
                </Grid>
                
                <ViewEsignAPISpecification />


            </Box>
        
    )

}

export default EsignAPISpecification;