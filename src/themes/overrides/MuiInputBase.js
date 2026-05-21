const MuiInputBase = (theme) =>{

    return{
        MuiInputBase: {
            styleOverrides: {
                input: {
                    backgroundColor: theme.palette.formcolor.textfield,
                    color: theme.palette.formcolor.text,
                    '&::before': {
                        borderBottom: '1px solid rgba(0, 0, 0, 0.42)'
                    }
                }
            }
        }
    };
}

export default MuiInputBase;
