import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from "react-redux";
import ViewDocument from "./ViewDocument";

const Document = () => {

    const navigate = useNavigate();
    const rolePath = useSelector((state) => state.jwtAuthentication.rolePath);

    const addDocument = () =>{

        navigate(`${rolePath}/documentName/adddocumentName`);

    }

    return(
        
            <Box component="div">

                <Grid container spacing={2} direction={'column'}>

                    <Grid item sx={{display: 'flex', justifyContent:'right', alignItems:'right', mr: 2}}>
                        <Button variant="contained"  startIcon={<AddIcon />} onClick={addDocument}>
                            <Typography variant="h6">Add Document</Typography>
                        </Button>
                    </Grid>
                </Grid>
                
                <ViewDocument />


            </Box>
        
    )

}

export default Document;