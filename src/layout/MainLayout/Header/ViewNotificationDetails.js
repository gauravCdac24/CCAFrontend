import { Grid, Box, Typography } from "@mui/material";
import dateFormatter from "../../../components/global/util/DateFormatter";
import CircleIcon from '@mui/icons-material/Circle';


const ViewNotificationDetails = ({Obj}) =>{

   

    return(
        <>
        <Box sx={{width: '565px'}}>

        
                    <Grid container  sx={{mt: 1}}>
                        <Grid item>
                            <Typography sx={{color: "primary.dark", fontSize: '14px'}}><CircleIcon sx={{fontSize: '12px', color: Obj.isread?'#DDDDDD':'primary.main'}}/> {dateFormatter(Obj.created)}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container  sx={{mt: 1}}>
                        <Grid item xs={1}></Grid>
                        <Grid item  sx={{
                            border: '1px dotted',
                            borderRadius: '6px',
                            padding: '10px',
                            backgroundColor: 'primary.light',
                            color: 'primary.text',
                            boxShadow: 'rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px'
                        }}>
                            <Typography>{Obj.message}</Typography>
                        </Grid>
                    </Grid>
               

            
        </Box>
        
        </>
    )


}

export default ViewNotificationDetails;