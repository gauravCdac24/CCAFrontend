import { useEffect, useState } from "react";

const Timer = ({onTimeout, timeLimit}) => {

    const [seconds, setSeconds] = useState(timeLimit);


    useEffect(()=>{
        const timerId = setInterval(()=>{
            setSeconds((prevSeconds)=>prevSeconds - 1);
        }, 1000);

        if(seconds === 0){
            clearInterval(timerId);
            onTimeout();
        }

        return () => clearInterval(timerId);

    }, [seconds, onTimeout]);


    return(
        <span>{seconds}</span>
    )


}

export default Timer;