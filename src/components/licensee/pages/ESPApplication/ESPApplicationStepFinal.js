import { Box, Button, Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import { useState } from "react";
import ESPApplicationService from "../../../../service/ESPApplicationService/ESPApplicationService";
import { ErrorMessage } from "../../../global/common/MessageBox/ShowCustomMessage";
import showAlert from "../../../global/common/MessageBox/AlertService";
import PreviewApplication from "./PreviewApplication";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { decrypt } from "../../../global/util/EncryptDecrypt";


const undertakingText = `
Whoever makes any misrepresentation to, or suppresses any material fact from, the Controller or the Certifying Authority for obtaining any licence or Digital Signature Certificate, as the case may be, shall be punished with imprisonment for a term which may extend to two years, or with fine which may extend to one lakh rupees, or with both.
`;

const ESPApplicationStepFinal = ({handleBack}) => {

  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setLoading] = useState(false);
    
  const navigate = useNavigate();
  const rolePath = useSelector((state) => state.jwtAuthentication.rolePath);


  const confirmSubmit = () => {
    
    setLoading(true);
    ESPApplicationService.submitApplication()
    .then((response)=>{

      let isReviewed = decrypt(response.data)==="Review";
     
      showAlert({
        messageTitle: 'Alert',
        messageContent: isReviewed?(<>You have successfully submitted the application.</>):(<><p>Your application has been successfully submitted.</p><p>Your Application Number is <b>{decrypt(response.data)}</b></p></>),
        confirmText: 'Ok',
        onConfirm: ()=>navigate(`${rolePath}/viewlicense`),
        enableHeaderCloseBtn: false,
        disableOutsideKeyDown: true,
    });



    })
    .catch((err)=>{
      //ErrorMessage("Error", "Unable to submit application, try again.");
      showAlert({
        messageTitle: 'Error',
        messageContent: 'Unable to submit application, try again.',
        enableHeaderCloseBtn: false,
        disableOutsideKeyDown: true,
        confirmText: 'Ok',
    })
    })
    .finally(()=>{
      setLoading(false);
    })

  }



  const handleFormSubmit = (e) => {
    e.preventDefault();
      showAlert({
        messageTitle: 'Confirm',
        messageContent:"Are you sure you want to submit the application.",
        confirmText: 'Yes',
        closeText: 'No',
        onConfirm: ()=>confirmSubmit(),
        enableHeaderCloseBtn: false,
        disableOutsideKeyDown: true,
    });

  };

  const previewApplication = () => {


    showAlert({
        messageTitle: 'Preview',
        messageContent:(<><PreviewApplication /></>),
        confirmText: 'Ok',
        enableHeaderCloseBtn: true,
        disableOutsideKeyDown: true,
        fullWidth: true,
        maxWidth: "md"
    });


  }


  
  return (
    <Box component="form" noValidate sx={{ mt: 2, p: 2, maxWidth: '900px' }} onSubmit={handleFormSubmit}>
      
      <Grid container spacing={2}>
            
            <Grid item xs={12} sx={{ mt: 2, mb: 1 }}>
            <Typography variant="h7"><b>Undertaking</b></Typography>
            </Grid>

    </Grid>

    <Grid container>

        <Grid item xs={0.4} sx={{mt: 2, maxWidth: '10px'}}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="undertaking"
                    checked={isChecked}  
                    onChange={() => setIsChecked(!isChecked)}
                  />
                }
                
              />
            </Grid>

        <Grid item xs={11} sx={{textJustify: 'inter-word', textAlign: 'justify', whiteSpace: 'pre-line'}}>
            {undertakingText}
        </Grid>
    

    </Grid>


      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, ml: 1 }}>
        <Button
          sx={{ mr: 1, backgroundColor: "#000", color: "#FFFFFF" }}
          onClick={handleBack}
          variant="contained"
        >
          Back
        </Button>

        <Button
          onClick={previewApplication}
          sx={{ mr: 1 }}
          variant="contained"
          color="secondary"
        >
          Preview
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!isChecked}
        >
          Submit Application
        </Button>
      </Box>
    </Box>
  );
}

export default ESPApplicationStepFinal;