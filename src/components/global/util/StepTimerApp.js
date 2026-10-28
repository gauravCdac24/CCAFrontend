import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import showAlert from "../common/MessageBox/AlertService";

/**
 * Per-step countdown timer for application forms.
 * Resets when activeStep changes. Does not use localStorage key "timers"
 * so it can run alongside the form-wide TimerApp.
 */
const StepTimerApp = ({ activeStep, timeLimit = 600, onDecline }) => {
    const [seconds, setSeconds] = useState(timeLimit);
    const [isRunning, setIsRunning] = useState(true);
    const alertShownRef = useRef(false);
    const onDeclineRef = useRef(onDecline);

    useEffect(() => {
        onDeclineRef.current = onDecline;
    }, [onDecline]);

    // Reset countdown whenever the user moves to another step
    useEffect(() => {
        setSeconds(timeLimit);
        setIsRunning(true);
        alertShownRef.current = false;
    }, [activeStep, timeLimit]);

    const handleContinue = () => {
        alertShownRef.current = false;
        setSeconds(timeLimit);
        setIsRunning(true);
    };

    const handleDecline = () => {
        setIsRunning(false);
        if (onDeclineRef.current) {
            onDeclineRef.current();
        }
    };

    useEffect(() => {
        if (!isRunning) {
            return undefined;
        }

        const timerId = setInterval(() => {
            setSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
        }, 1000);

        return () => clearInterval(timerId);
    }, [isRunning, activeStep]);

    useEffect(() => {
        if (seconds !== 0 || alertShownRef.current) {
            return;
        }

        alertShownRef.current = true;
        setIsRunning(false);

        showAlert({
            messageTitle: "Alert",
            messageContent: "Do you want to continue?",
            disableOutsideKeyDown: true,
            confirmText: "Yes",
            closeText: "No",
            onConfirm: handleContinue,
            onClose: handleDecline,
        });
    }, [seconds, timeLimit]);

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return (
        <Box sx={{ display: "flex", justifyContent: "right", alignItems: "right", zIndex: 9999 }}>
            <Box>
                <b>Step Time Left:</b> {minutes}m {remainingSeconds}s
            </Box>
        </Box>
    );
};

export default StepTimerApp;
