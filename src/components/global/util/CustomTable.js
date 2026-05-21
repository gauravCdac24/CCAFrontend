import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DataGridCustomToolbar from "./CustomToolbar/DataGridCustomToolbar";

const CustomTable = ({columns, rows, hideColumnsForExport, pageSizeOptions, hidePagination=false, hideToolbar=false, customTitle=''}) =>{

    return(
        <Box
            sx={{
                width: '100%',
                height: '60vh',
                minHeight: 400,
                m: 2,
            }}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={hidePagination ? [10] : pageSizeOptions}
                slots={{ toolbar: hideToolbar ? undefined : () => <DataGridCustomToolbar columns={columns} rows={rows} hideColumnsForExport={hideColumnsForExport} customTitle={customTitle} /> }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                    },
                    loadingOverlay: {
                        variant: 'circular-progress',
                        noRowsVariant: 'skeleton',
                    },
                }}
                disableColumnMenu
                sx={{
                    height: '100%',
                    width: '100%',
                    '& .MuiDataGrid-columnHeaderTitle': {
                        fontWeight: 600,
                    },
                }}
            />
        </Box>
    );
};

export default CustomTable;
