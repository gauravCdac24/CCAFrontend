import ViewEsignDocType from "./ViewEsignDocType";
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from "react-redux";

const EsignDocType = () => {

    const navigate = useNavigate();
    const rolePath = useSelector((state) => state.jwtAuthentication.rolePath);

    const addEsignDocType = () =>{

        navigate(`${rolePath}/esigndoctype/addesigndoctype`);

    }

    return(
        
            <Box component="div">

                <Grid container spacing={2} direction={'column'}>

                    <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  startIcon={<AddIcon />} onClick={addEsignDocType}>
                            <Typography variant="h6">Add Esign Document Type</Typography>
                        </Button>
                    </Grid>
                </Grid>
                
                <ViewEsignDocType />


            </Box>
        
    )

}

export default EsignDocType;