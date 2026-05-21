const TextField = (theme) =>{

    return{
        MuiTextField: {
            defaultProps: {
              FormHelperTextProps: {
                style: {
                  marginLeft: '0',
                },
              },
              
          },
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                  paddingLeft: 0,
                  backgroundColor: theme.palette.formcolor.textfield,
                },
                
            }
          }
        },
    };
}

export default TextField;
