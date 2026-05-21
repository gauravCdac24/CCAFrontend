import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Typography } from '@mui/material';

const MessageBox = ({open, 
                     container, 
                     messageTitle, 
                     messageContent, 
                     confirmText, 
                     closeText, 
                     handleConfirm, 
                     handleClose, 
                     buttonOneText, 
                     handleButtonOne, 
                     buttonTwoText, 
                     handleButtonTwo, 
                     enableHeaderCloseBtn, 
                     disableOutsideKeyDown, 
                     fullWidth, 
                     maxWidth, 
                     buttonOneColor, 
                     showHeader, 
                     showFooter,
                     showFooterBackgroundColor,
                     centerFooterContent,
                     divider,
                     removeDialogPadding
                    }) => {



    return(
        <Dialog 
            open={open}
            aria-labelledby="alert-dialog-title"
            aira-describedby="alert-dialog-description"
            onClose={disableOutsideKeyDown ? null: handleClose}
            disableEscapeKeyDown={disableOutsideKeyDown}
            container={container}
            fullWidth = {fullWidth}
            maxWidth = {maxWidth}
            sx={{zIndex: 10011}}
    >

      {showHeader && (

          <DialogTitle id="alert-dialog-title"  sx={{backgroundColor:"primary.dark", color: "#FFFFFF"}}>
              
          
            <Box display="flex" alignItems="center" sx={{height: "10px"}}>
                  <Box flexGrow={1} >
                    <Typography variant="h6">
                        {messageTitle.length>40?messageTitle.substring(0,40).trim()+"...":messageTitle}
                    </Typography>
                  </Box>
                  {enableHeaderCloseBtn && (
                  <Box>
                      <IconButton onClick={handleClose}>
                            <CloseIcon sx={{color: "#FFFFFF"}}/>
                      </IconButton>
                  </Box>)}
            </Box>

              
          </DialogTitle>

                )}

        <DialogContent dividers={divider} sx={{backgroundColor:"modalbody.main", p: removeDialogPadding? 0: ''}}>
            
        <Box id="alert-dialog-description" sx={{width: 'auto', color: "modalbody.text", width: "100%"}}>
            {messageContent}
          </Box>

        </DialogContent>

        {showFooter && (

          <DialogActions   sx={{
    backgroundColor: showFooterBackgroundColor ? 'primary.dark' : '#FFFFFF',
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center',    
    gap: 2,                  
    padding: 2               
  }}>
            <>
            {buttonOneText !== ''?<Button variant="contained"  sx={{color: 'primary.text', height: '30px', backgroundColor: buttonOneColor===''?'primary.main':buttonOneColor}} onClick={handleButtonOne}>{buttonOneText}</Button>:''}
            {buttonTwoText !== ''?<Button variant="contained"  onClick={handleButtonTwo} autoFocus sx={{color: "#FFFFFF", height: '30px', backgroundColor: buttonOneColor===''?'#000000':buttonOneColor}}>{buttonTwoText}</Button>: ''}

            {confirmText !== ''?<Button variant="contained" color="primary" sx={{color: 'primary.text', height: '30px'}} onClick={handleConfirm}>{confirmText}</Button>:''}
            {closeText !== ''?<Button variant="contained" color="reset" onClick={handleClose} autoFocus sx={{color: "#FFFFFF", height: '30px'}}>{closeText}</Button>: ''}
            </>

          </DialogActions>
        )}

    </Dialog>
    )


}

export default MessageBox;