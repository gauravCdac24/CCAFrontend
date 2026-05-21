import {useState, useEffect, useRef} from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import RefreshIcon from '@mui/icons-material/Refresh';
import useTextToSpeech from './useTextToSpeech';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { Typography, InputLabel, Box, useTheme } from '@mui/material';

const Captcha = ({setCaptcha, setCaptchaInput, captchaInput, captchaError, captchaErrorMsg}) =>{

    const theme = useTheme();
    const [captchaText, setCaptchaText] = useState('');
    const { setText, isSpeechSupported, speakEachCharacter, cancelTextToSpeech } = useTextToSpeech();
    //

    const canvasRef = useRef(null);


    const handleCpatchaInput = (e) =>{
        setCaptchaInput(e.target.value);
    }
   
    const generateCaptcha = () =>{
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        initializeCaptcha(ctx);
        cancelTextToSpeech();
        setCaptchaInput('');

       
        
    }

    const redrawCaptcha = () =>{
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        drawCaptchaOnCanvas(ctx, captchaText);
        cancelTextToSpeech();
    }

    const generateCaptchaText = () =>{
        
        const characters = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789@#$%&*^';
        let captcha = '';
        for (let i = 0; i < 6; i++) {
            captcha += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return captcha;
          
    }


    const drawCaptchaOnCanvas = (ctx, captcha) => { 
        
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
        const textColors = [theme.palette.formcolor.text, `rgb(${Math.random()*100}, ${Math.random()*100}, ${Math.random()*100})`]; 
        const letterSpace = 120 / captcha.length; 

        const numLines = 70;
        ctx.lineWidth = 1;

        for(let j=0; j<numLines; j++){
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255}, 0.2)`;
            ctx.moveTo(Math.random() * ctx.canvas.width, Math.random() * ctx.canvas.height); 
            ctx.lineTo(Math.random() * ctx.canvas.width, Math.random() * ctx.canvas.height); 
            ctx.stroke();
        }

        const numDots = 1200;  
        for (let i = 0; i < numDots; i++) {
            ctx.beginPath();
            const x = Math.random() * ctx.canvas.width; 
            const y = Math.random() * ctx.canvas.height; 
            ctx.arc(x, y, 1, 0, Math.PI * 2); 
            ctx.fillStyle = `rgba(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255}, 0.2)`;  
            ctx.fill();
        }

        for (let i = 0; i < captcha.length; i++) { 
            const xInitialSpace = 25; 
            ctx.font = '18px Arial, Helvetica, sans-serif'; 
            ctx.fillStyle = textColors[Math.floor(Math.random() * 2)];
            const textYPos = 25;
            const textXPos = xInitialSpace + i * letterSpace;

            ctx.fillText( 
                captcha[i], 
                textXPos, 
                textYPos,
                100 
            );  

            const textWidth = ctx.measureText(captcha[i]).width; 
            const spacing = i<captcha.length-1?letterSpace:textWidth;
            const strikeYPos = textYPos - 5; 
            ctx.beginPath();
            ctx.strokeStyle = theme.palette.formcolor.text; 
            ctx.lineWidth = 1; 
            ctx.moveTo(textXPos, strikeYPos); 
            ctx.lineTo(textXPos + spacing, strikeYPos); 
            ctx.stroke();

        } 


    }; 

    const initializeCaptcha = (ctx) => { 
        setCaptchaInput('');
        const newCaptcha = generateCaptchaText(); 
        setCaptchaText(newCaptcha); 
        setCaptcha(newCaptcha);
        drawCaptchaOnCanvas(ctx, newCaptcha);
        setText(newCaptcha); 
    }; 

    useEffect(()=>{
        redrawCaptcha();
    }, [theme.palette.formcolor.text])
  
    useEffect(()=>{
        generateCaptcha();
    }, []);


    return (
        <Box component='div' sx={{mt: 2}}>
        
        <Grid container  sx={{
                    margin: "0%",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    
                }}>

                    <Grid item>
                        <Grid container spacing={1}>
                            <Grid  item xs="auto" >
                                <canvas style={{backgroundColor: "transparent", marginTop: "2px"}} ref={canvasRef} width="150" height="45"></canvas> 
                            </Grid>
                            <Grid  item xs="auto" 
                                   sx={{
                                        height: "45",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        
                                      }} 
                            >
                                <Grid container direction="column">
                                    <Grid  item xs="auto" sx={{backgroundColor: "primary.main", borderRadius: "50%", height: "24px" }}>
                                        <RefreshIcon  onClick={generateCaptcha} sx={{cursor: 'pointer', color: "#FFFFFF"}} />
                                    </Grid>
                                {isSpeechSupported ? 
                                    <Grid  item xs="auto" sx={{backgroundColor: "primary.main", borderRadius: "50%", height: "24px", marginTop: "4px" }}> 
                                        <VolumeUpIcon  onClick={speakEachCharacter} sx={{cursor: 'pointer', color: "#FFFFFF"}} />
                                    </Grid> : ''}
                                    </Grid>
                                
                            </Grid>
                        </Grid>
                    </Grid>

                               
                </Grid>

                <InputLabel
                            shrink={false}
                            htmlFor={"captcha"}
                        >
                        <Typography variant='body1'>Enter Captcha*</Typography>
                </InputLabel>
                
                <TextField
                            margin="dense"
                            required
                            fullWidth
                            id="captcha"
                            placeholder='Enter Captcha'
                            name="captcha"
                            inputProps={{ maxLength: 6 }}
                            onChange={handleCpatchaInput}
                            error = {captchaError}
                            helperText = {captchaErrorMsg}
                            value={captchaInput}
                            size="small"
                            variant='outlined'
                        />
        
        </Box>
    )

}

export default Captcha;