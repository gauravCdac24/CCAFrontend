import { Box } from "@mui/material"
import showAlert from "./AlertService"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export const SuccessMessage = (title, subtitle, handleConfirm) => {
    showAlert({
        messageTitle: 'Success',
        messageContent: <Box sx={{display: "flex", justifyContent: "center", alignItems:"center", width: "220px",
                                    background: 'radial-gradient(circle at top, #cdffcd 60%, #FFFFFF 20%)',
                                }}> 
                            
                            <Box component="div">
                                <Box component="div" sx={{m: 2, textAlign: 'center'}}><CheckCircleIcon sx={{fontSize: '60px', color:"success.main"}}/></Box>
                                <Box component="div" sx={{mt: 6, color: "#333", textAlign: 'center', fontWeight: 600}}>{title}</Box>
                                <Box component="div" sx={{color: "#333", textAlign: 'center', fontSize: '14px'}}>{subtitle}</Box>
                            </Box>

                        </Box>,
        confirmText: 'Ok',
        disableOutsideKeyDown: true,
        showHeader: false,
        showFooterBackgroundColor: false,
        centerFooterContent: true,
        divider: false,
        removeDialogPadding: true,
        onConfirm: () =>handleConfirm()
    })
}

export const ErrorMessage = (title, subtitle) => {

    showAlert({
        messageTitle: 'Error',
        messageContent: <Box sx={{display: "flex", justifyContent: "center", alignItems:"center", width: "220px",
                                    background: 'radial-gradient(circle at top, #ffcccb 60%, #FFFFFF 20%)',
                                }}> 
                            <Box component="div">
                                <Box component="div" sx={{m: 2, textAlign: 'center'}}><CancelIcon sx={{fontSize: '60px', color:"error.main"}}/></Box>
                                <Box component="div" sx={{mt: 6, color: "#333", textAlign: 'center', fontWeight: 600}}>{title}</Box>
                                <Box component="div" sx={{color: "#333", textAlign: 'center', fontSize: '14px'}}>{subtitle}</Box>
                            </Box>
                        </Box>,
        confirmText: 'Ok',
        disableOutsideKeyDown: true,
        showHeader: false,
        showFooterBackgroundColor: false,
        centerFooterContent: true,
        divider: false,
        removeDialogPadding: true,
    })

}
