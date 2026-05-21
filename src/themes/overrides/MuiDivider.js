const MuiDivider = (theme) =>{

    return{
        MuiDivider: {
            styleOverrides: {
              root: {
                backgroundColor: theme.palette.dividercolor.main,
              },
            },
          },
    };
}

export default MuiDivider;
