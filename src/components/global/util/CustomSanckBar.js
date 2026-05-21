import { IconButton, Typography, Grid, Paper } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Close, Error, CheckCircle, Warning, Info } from '@mui/icons-material';
import { useTheme } from "@emotion/react";

const CustomSnackBar = ({ open, message, onClose, autoHideDuration, severity }) => {
    const [bgcolor, setBgcolor] = useState("");
    const [icon, setIcon] = useState(null);
    const theme = useTheme();

    useEffect(() => {
        const getStyle = () => {
            switch (severity) {
                case 'success':
                    setBgcolor(theme.palette.success.main);
                    setIcon(<CheckCircle sx={{ fontSize: "inherit" }} />);
                    break;
                case 'error':
                    setBgcolor(theme.palette.error.main);
                    setIcon(<Error sx={{ fontSize: "inherit" }} />);
                    break;
                case 'warning':
                    setBgcolor(theme.palette.warning.main);
                    setIcon(<Warning sx={{ fontSize: "inherit" }} />);
                    break;
                default:
                    setBgcolor(theme.palette.info.main);
                    setIcon(<Info sx={{ fontSize: "inherit" }} />);
            }
        };

        getStyle();

        let autoHide = null;

       if(autoHideDuration){

            autoHide = setTimeout(() => {
                onClose();
            }, autoHideDuration);

            return () => clearTimeout(autoHide); 

       }
        

        
    }, [open, onClose, autoHideDuration, severity, theme.palette]);

    return (
        <>
            {open && (
                <Paper
                    elevation={0}
                    sx={{
                        margin: '4px 0px',
                        padding: '2px',
                        backgroundColor: bgcolor,
                        color: "#FFFFFF",
                        borderRadius: '5px',
                    }}
                >
                    <Grid container alignItems="center">
                        <Grid item xs={1} color='inherit' sx={{fontSize: "20px", display: "flex", justifyContent: "center", alignItems: "center"}}>
                            {icon}
                        </Grid>
                        <Grid item xs={10} sx={{ textAlign: 'center' }}>
                            <Typography variant='subtitle2' sx={{ fontWeight: '300', userSelect: 'none' }}>
                                {message}
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton color='inherit' size="small" onClick={onClose}>
                                <Close sx={{ fontSize: "inherit" }} />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Paper>
            )}
        </>
    );
};

CustomSnackBar.propTypes = {
    open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    autoHideDuration: PropTypes.number,
    severity: PropTypes.oneOf(['success', 'error', 'warning', '']).isRequired,
};

export default CustomSnackBar;
