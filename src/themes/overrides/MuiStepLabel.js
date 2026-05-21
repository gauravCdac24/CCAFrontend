const MuiStepLabel = (theme) =>{

    return{
      MuiStepLabel: {
            styleOverrides: {
              label: {
                '&.Mui-active': {
                  color: theme.palette.textcolor.active,
                },
                '&.Mui-disabled': {
                  color: theme.palette.textcolor.disabled,
                },
              },
            },
          },
    };
}

export default MuiStepLabel;
