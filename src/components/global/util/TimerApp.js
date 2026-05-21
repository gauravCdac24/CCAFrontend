import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import showAlert from "../common/MessageBox/AlertService";

const TimerApp = ({ onTimeout, timeLimit }) => {
    const [seconds, setSeconds] = useState(timeLimit);
    const [isRunning, setIsRunning] = useState(true);

    // Check if 'timers' exists in localStorage, otherwise set default value
    const timers = localStorage.getItem('timers');
    const alerttime = 5 * 60; // 5 minutes

    useEffect(() => {
        // If there is no timer in localStorage, set it to 1 (or the timeLimit if you prefer)
        if (timers === null) {
            localStorage.setItem('timers', timeLimit);
            setSeconds(timeLimit);
        } else {
            setSeconds(parseInt(timers, 10));
        }
    }, [timeLimit, timers]);

    const handleExtendTime = () => {
        setIsRunning(true);
        setSeconds(timeLimit); 
        localStorage.setItem('timers', timeLimit); 
    }

    useEffect(() => {
        // Set interval to update the timer every second
        if(isRunning){
        const timerId = setInterval(() => {
            const currentTimer = localStorage.getItem('timers');
            const newSeconds = parseInt(currentTimer, 10) - 1;

            setSeconds(newSeconds); // Update seconds state
            localStorage.setItem('timers', newSeconds); // Save updated seconds to localStorage

            if(alerttime === newSeconds) {
                setIsRunning(false);
                showAlert({
                    messageTitle: 'Alert',
                    messageContent: "Only 5 minutes left to submit the documents. Do you want to extend the time?",
                    disableOutsideKeyDown: true,
                    confirmText: "Yes",
                    closeText: "No",
                    onConfirm: () => handleExtendTime(),
                    onClose: () => setIsRunning(true)
                })
            }
        
        

        }, 1000);

        // When seconds reach 0, stop the timer and trigger onTimeout
        if (seconds === 0) {
            clearInterval(timerId);
            onTimeout();
        }

        return () => clearInterval(timerId); // Cleanup interval on unmount
    }
    }, [seconds, onTimeout, isRunning]);

    // Convert seconds to minutes (e.g., 120 seconds = 2 minutes)
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return (
        <Box sx={{display: 'flex', justifyContent: 'right', alignItems: 'right', zIndex: 9999}}><Box><b>Time Left:</b> {minutes}m {remainingSeconds}s</Box></Box>
    );
}

export default TimerApp;
