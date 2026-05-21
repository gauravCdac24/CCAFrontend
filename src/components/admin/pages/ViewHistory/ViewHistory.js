import React, { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Link,
    Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { decrypt } from '../../../global/util/EncryptDecrypt';
import { useParams } from 'react-router-dom';
import SingleUserTracker from '../../../admin/pages/ViewHistory/SingleUserTracker';
import ApplicationForm from '../../../../service/NewLicenseService/ApplicationForm';

const events = {
    January: [
        {
            name: 'Bharati Vidyapeeth College of Engineering, Paschim Vihar, New Delhi',
            date: '27/01/2025',
        },
    ],
    February: [],
    March: [
        {
            name: 'Sharda University, Greater Noida, Uttar Pradesh',
            date: '11/03/2025',
        },
    ],
};

const ViewHistory = () => {

    const { id } = useParams();
    const userName = decrypt(id); // assuming decrypt returns plain string

    const [allTimeline, setAllTimeline] = useState([]);
    const [userData, setUserData] = useState({
        userName: userName,
        status: "",
    });

    useEffect(() => {
        const fetchTimelineList = async () => {
            try {
                const response = await ApplicationForm.getAllApplicationTimelineList(userName);
                const sortedTimeline = response.data.sort(
                    (a, b) => new Date(a.created) - new Date(b.created)
                );
                setAllTimeline(sortedTimeline);

                if (sortedTimeline.length > 0) {
                    const latestStatus = sortedTimeline[sortedTimeline.length - 1];
                    setUserData((prev) => ({
                        ...prev,
                        status: latestStatus.applicationStatus,
                    }));
                }
            } catch (error) {
                console.error("Error fetching application timeline:", error);
            }
        };

        fetchTimelineList();
    }, [userName]);


    return (
        <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
            <Typography
                variant="h5"
                align="center"
                sx={{ color: 'brown', fontWeight: 'bold', mb: 2 }}
            >
                Licensee History
            </Typography>

            <Accordion>
                <AccordionSummary
                    expandIcon={
                        0 ? <ExpandMoreIcon /> : <ExpandMoreIcon />
                    }
                    sx={{ bgcolor: '#039be5', color: 'white' }}
                >
                    <Typography fontWeight="bold">Application, 2025</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: '#e0f7fa' }}>

                    <SingleUserTracker username={userName} />


                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                    expandIcon={
                        0 ? <ExpandMoreIcon /> : <ExpandMoreIcon />
                    }
                    sx={{ bgcolor: '#039be5', color: 'white' }}
                >
                    <Typography fontWeight="bold">Annual Audit, 2025</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: '#e0f7fa' }}>

                    <SingleUserTracker username={userName} />


                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                    expandIcon={
                        0 ? <ExpandMoreIcon /> : <ExpandMoreIcon />
                    }
                    sx={{ bgcolor: '#039be5', color: 'white' }}
                >
                    <Typography fontWeight="bold">Reneawal Licensee, 2025</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: '#e0f7fa' }}>

                    <SingleUserTracker username={userName} />


                </AccordionDetails>
            </Accordion>

        </Box>
    );
};

export default ViewHistory;
