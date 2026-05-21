
import { Box, Grid, Typography, Paper, Divider } from "@mui/material";
import GradientBox from "./GradientBox";

const FormWrapper = ({children, headingText}) => {
    return(
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent'}}>
                    <Paper elevation={1} sx={{borderRadius: "10px", mt: 2, minWidth: {xs: '90%', sm: '450px'}, backgroundColor: 'formcolor.main', color: 'formcolor.text' }}>


                        { headingText && (<Grid container sx={{display: 'flex', justifyContent: 'left', alignItems: 'center', m: 2,  }}>
                                <Grid item>
                                    <GradientBox />
                                </Grid>
                                <Grid item >
                                    <Typography  sx={{fontWeight: '900'}}>{headingText}</Typography>
                                </Grid>
                            </Grid>)}

                            { headingText && <Divider sx={{mt: 2}}/> }

                            <Box component="div" sx={{ pl: 2, pr: 2, pb: 1, m: 1}}>    
                                    {children}
                            </Box>
                                
                        
                    </Paper>
                </Box>

    )
}

export default FormWrapper;