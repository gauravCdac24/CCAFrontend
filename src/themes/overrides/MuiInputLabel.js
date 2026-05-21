const MuiInputLabel = (theme) =>{

    return{
        MuiInputLabel: {
            styleOverrides: {
              root: {
                color: theme.palette.formcolor.text,
              },
            },
          },
    };
}

export default MuiInputLabel;
