const MuiAutocomplete = (theme) =>{

    return{
        MuiAutocomplete: {
            styleOverrides: {
              paper: {
                backgroundColor: theme.palette.formcolor.main,
                color: theme.palette.bodycolor.text
              },
            },
          },
    };
}

export default MuiAutocomplete;
