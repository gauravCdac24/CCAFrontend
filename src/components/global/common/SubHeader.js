import Tracker from "./Tracker";
import {useLocation, useParams} from 'react-router-dom';
import {Fragment, useEffect, useState} from "react";
import { Grid, Typography } from "@mui/material";
import PrivateTrackerService from "../../../service/AdditionalService/PrivateTrackerService";

const SubHeader = () =>{

    const location = useLocation();
    const [tracker, setTracker] = useState([]);
    const {id} = useParams();
    


    const getTracker = () =>{

        let lpath = location.pathname;
        if(id)
            lpath = lpath.replace("/"+encodeURIComponent(id),'')

       

        PrivateTrackerService.getTracker(lpath)
        .then((response)=>{
            setTracker(response.data);
        })
        .catch((err)=>{
            setTracker([]);
        })

    }

    useEffect(()=>{
        getTracker();
    }, [location.pathname])
    

    for (const item of tracker) {
        const isExactMatch = location.pathname === item.path;
        const isPatternMatch = id && location.pathname === (item.path + "/" + encodeURIComponent(id));
        
       
        if (isExactMatch || isPatternMatch) {
            return (
                <Grid key={item.id} container justifyContent="flex-end">
                    {/* <Grid item>
                        <Typography variant="h6">{item.heading}</Typography>
                    </Grid> */}
                    <Grid item>
                        <Tracker trackerpath={item.trackerPaths} />
                    </Grid>
                </Grid>
            );
        }
    }

    return null;

}

export default SubHeader;