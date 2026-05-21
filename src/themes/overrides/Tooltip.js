import {useSelector} from 'react-redux';

const Tooltip = (theme) =>{

    const size = useSelector((state)=>state.fontSize.incdec);

    return{
        MuiTooltip:{
            styleOverrides: {
                tooltip:{
                    fontSize: `${16 + size}px`,
                    
                    '@media (max-width: 1200px)':{
                    fontSize: `${14 + size}px`,
                    },
                    '@media (max-width: 900px)':{
                    fontSize: `${12 + size}px`,
                    },
                    '@media (max-width: 600px)':{
                    fontSize: `${11 + size}px`,
                    },
                    '@media (max-width: 300px)':{
                    fontSize: `${10 + size}px`,
                    },

                    color: "#FFF",
                    backgroundColor: theme.palette.primary.main,
                    boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px"
                },
                arrow:{
                    fontSize: `${16 + size}px`,
                    color: theme.palette.primary.main, 
                    }
            }
        }
    };
}

export default Tooltip;