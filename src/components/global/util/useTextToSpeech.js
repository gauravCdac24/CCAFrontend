
import {useState, useEffect, useRef} from 'react';

const useTextToSpeech = () =>{

    const [text, setText] = useState('');
    const [isSpeechSupported, setIsSpeechSupported] = useState(false); 
    const [isPaused, setIsPaused] = useState(false);


    const synthesisRef = useRef(null);

    const checkIsTextToSpeechSupported = () =>{
        return 'speechSynthesis' in window;
    };

    useEffect(()=>{
        setIsSpeechSupported(checkIsTextToSpeechSupported());
        cancelTextToSpeech();
    },[])

    const convertTextToSpeechFormat = (text) =>{
      return text.split('').map(char => {
        if (char >= 'A' && char <= 'Z') {
          return `capital ${char}`;
        } else if (char >= 'a' && char <= 'z') {
          return `small ${char}`;
        } else {
          return char;
        }
      }).join(' ');
    }

    const convertTextToSpeech = () =>{
        if(checkIsTextToSpeechSupported()){

            
            let synthesis = window.speechSynthesis;
            synthesisRef.current = synthesis;

            let voice = synthesis.getVoices().filter((voice)=>{
                return voice.lang === 'en' ;
            })[0];


            let utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = voice;
            utterance.pitch = 1.5;
            utterance.rate = 1.25;
            utterance.volume = 0.8;

            synthesis.speak(utterance);
            

        }
    };

    const speakEachCharacter = () =>{



      if(checkIsTextToSpeechSupported()){

            
        let synthesis = window.speechSynthesis;
        synthesisRef.current = synthesis;

        let voice = synthesis.getVoices().filter((voice)=>{
            return voice.lang === 'en' ;
        })[0];

        const formattedText = convertTextToSpeechFormat(text);

        let utterance = new SpeechSynthesisUtterance(formattedText);
        utterance.voice = voice;
        utterance.pitch = 1.5;
        utterance.rate = 0.8;
        utterance.volume = 0.5;

        synthesis.speak(utterance);
        

    }

    }

    const pauseTextToSpeech = () => {
        if (synthesisRef.current && !isPaused) {
          synthesisRef.current.pause();
          setIsPaused(true);
        }
      };
    
      const resumeTextToSpeech = () => {
        if (synthesisRef.current && isPaused) {
          synthesisRef.current.resume();
          setIsPaused(false);
        }
      };
    
      const cancelTextToSpeech = () => {
        if (synthesisRef.current) {
          synthesisRef.current.cancel();
          setIsPaused(false);
        }
      };

    return {
        text,
        setText,
        isSpeechSupported,
        convertTextToSpeech,
        speakEachCharacter,
        pauseTextToSpeech,
        resumeTextToSpeech,
        cancelTextToSpeech,
        isPaused,
      };


}

export default useTextToSpeech;