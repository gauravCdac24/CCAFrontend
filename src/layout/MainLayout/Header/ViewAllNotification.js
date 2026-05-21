import { Grid, Box, Typography } from "@mui/material";
import dateFormatter from "../../../components/global/util/DateFormatter";
import CircleIcon from '@mui/icons-material/Circle';
import NotificationService from '../../../service/NotificationService/NotificationService';
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const ViewAllNotification = forwardRef((props,ref) =>{


    const [notificationList, setNotificationList] = useState([]);

    const getNotificationList = () =>{

        NotificationService.getNotificationByUsernameAndRole()
        .then((response)=>{
          setNotificationList(response.data);
        }).catch((err)=>{
    
        })
      }

      const markAllNotificationRead = () => {
        NotificationService.readNotificationByUsernameAndRole()
        .then((response)=>{
          getNotificationList();
          props.getNotificationList();
        }).catch((err)=>{
    
        })
    
      }

      useImperativeHandle(ref, () => {
        return{
            markAllNotificationRead,
        }
    })


      useEffect(()=>{
        getNotificationList();
      }, [])


    return(
        <>
        <Box >

            {
                notificationList.map((item, index)=>(

                <Box key={index}>
                    <Grid container  sx={{mt: 1}}>
                        <Grid item>
                            <Typography sx={{color: "primary.dark", fontSize: '14px'}}><CircleIcon sx={{fontSize: '12px', color: item.isread?'#DDDDDD':'primary.main'}}/> {dateFormatter(item.created)}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container  sx={{mt: 1}}>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={11}sx={{
                            border: '1px dotted',
                            borderRadius: '6px',
                            padding: '10px',
                            backgroundColor: 'primary.light',
                            color: 'primary.text',
                            boxShadow: 'rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px'
                        }}>
                            <Typography>{item.message}</Typography>
                        </Grid>
                    </Grid>
                </Box>

                ))
            }
            
        </Box>
        
        </>
    )


})

export default ViewAllNotification;