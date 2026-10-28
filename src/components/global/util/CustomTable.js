import { useMemo } from "react";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DataGridCustomToolbar from "./CustomToolbar/DataGridCustomToolbar";

/** Approximate min width so header titles are not truncated. */
const estimateHeaderMinWidth = (headerName = "") =>
    Math.max(80, Math.ceil(String(headerName).length * 8.5) + 48);

/**
 * Expand columns across the full table width.
 * Fixed `width` becomes `minWidth` + `flex: 1` so columns grow instead of leaving empty space.
 */
const normalizeColumns = (columns = []) =>
    columns.map((col) => {
        const headerMin = estimateHeaderMinWidth(col.headerName);
        const minWidth = col.minWidth ?? col.width ?? headerMin;

        if (col.flex != null) {
            const { width, ...rest } = col;
            return {
                ...rest,
                flex: col.flex,
                minWidth,
            };
        }

        const { width, ...rest } = col;
        return {
            ...rest,
            flex: 1,
            minWidth,
        };
    });

const CustomTable = ({columns, rows, hideColumnsForExport, pageSizeOptions, hidePagination=false, hideToolbar=false, customTitle=''}) =>{
    const normalizedColumns = useMemo(() => normalizeColumns(columns), [columns]);

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
                columns={normalizedColumns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={hidePagination ? [10] : pageSizeOptions}
                slots={{ toolbar: hideToolbar ? undefined : () => <DataGridCustomToolbar columns={normalizedColumns} rows={rows} hideColumnsForExport={hideColumnsForExport} customTitle={customTitle} /> }}
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
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: 'tablecolor.main',
                    },
                    '& .MuiDataGrid-columnHeaders .MuiDataGrid-filler, & .MuiDataGrid-columnHeaders .MuiDataGrid-scrollbarFiller': {
                        backgroundColor: 'tablecolor.main',
                    },
                }}
            />
        </Box>
    );
};

export default CustomTable;
