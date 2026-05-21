import { useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoaderProgress = ({ open }) => {
    useEffect(() => {
        if (open && document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    }, [open]);

    if (!open) {
        return null;
    }

    return (
        <Box
            role="status"
            aria-busy="true"
            aria-label="Loading"
            sx={{
                position: 'fixed',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                zIndex: (theme) => theme.zIndex.modal + 1,
            }}
        >
            <CircularProgress color="primary" />
        </Box>
    );
};

export default LoaderProgress;
