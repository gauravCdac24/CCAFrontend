const MuiDataGrid = (theme) =>{

    return{
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    '& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus': {
                      outline: 'none'
                    },
                    '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus': {
                      outline: 'none'
                    },
                    '& .MuiDataGrid-cell':{
                        userSelect: "none"
                    },
                    '& .MuiDataGrid-columnSeparator': {
                        display: 'none'
                    },
                    '& .MuiTablePagination-toolbar':{
                      color: theme.palette.tablecolor.text,
                    },
                    '& .MuiButton-colorPrimary':{
                      color: theme.palette.tablecolor.toolbar,
                    },
                    '& .MuiInputBase-colorPrimary':{
                      color: theme.palette.tablecolor.toolbarsearch, 
                    },
                    backgroundColor: theme.palette.tablecolor.body,
                    color: theme.palette.tablecolor.text,
                  },   
                columnHeader: { 
                   backgroundColor: theme.palette.tablecolor.main,
                   color: theme.palette.tablecolor.text,
                   borderBottom: "none",
                   userSelect: "none"
                },
                footerContainer: {
                    backgroundColor: theme.palette.tablecolor.main,
                    borderTop: "none",
                },
            },
          },
    };
}

export default MuiDataGrid;
