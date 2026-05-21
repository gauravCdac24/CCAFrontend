
import {
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter 
} from "@mui/x-data-grid";
import CustomToolbarExport from "./CustomToolbarExport";
import { Box } from "@mui/material";

export default function DataGridCustomToolbar({columns, rows, hideColumnsForExport, customTitle}) {


  return (
    <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textColor: "#FFF" }}>
      <Box>
        <GridToolbarColumnsButton sx={{backgroundColor: "red"}} />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <CustomToolbarExport columns={columns} rows={rows} hideColumnsForExport={hideColumnsForExport} customTitle={customTitle} />
      </Box>
      <Box sx={{ marginLeft: 'auto' }}>
        <GridToolbarQuickFilter />
      </Box>
  </GridToolbarContainer>
  );
}
