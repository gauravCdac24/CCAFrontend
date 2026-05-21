import {Fragment} from 'react';
import Link from '@mui/material/Link';
import { Typography, Grid} from '@mui/material';
import { useTheme } from "@emotion/react";

const Tracker = (props) =>{

  const theme = useTheme();

  const styles = {
    
    linkStyle:{
      cursor: "pointer",
      textDecoration: "none" ,
      color: "tracker.link",
      '&:hover': {
        color: theme.palette.hovercolor.main,
     },
    },

    contentCenter:{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }

    return(
        <>
           
            
                {props.trackerpath.map((item, index) => (
                    <Fragment key={index}>
                    {item.path === "" ? <Typography display="inline" variant='h6' >{item.name}</Typography> : <Typography display="inline" variant='h6' ><Link href={item.path} sx={styles.linkStyle}>{item.name}</Link></Typography>}
                    
                    {index < props.trackerpath.length - 1 ? <Typography display="inline" variant='h6' sx={{fontWeight: '300'}}>&nbsp;/&nbsp;</Typography> : null}
                    </Fragment>
                ))}
            

        </>
    )

}

export default Tracker;