const MuiMenu = (theme) =>{

    return{
        MuiMenu: {
            styleOverrides: {
              paper: {
                backgroundColor: theme.palette.formcolor.main,
                color: theme.palette.bodycolor.text
              },
            },
          },
    };
}

export default MuiMenu;
