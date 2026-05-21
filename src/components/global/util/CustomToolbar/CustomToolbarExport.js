
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import GetAppIcon from "@mui/icons-material/GetApp";
import { useState } from "react";
import { MenuItem, Menu, IconButton, Box, Tooltip } from '@mui/material';

const CustomToolbarExport = ({columns, rows, hideColumnsForExport, customTitle}) =>{

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const formatDateTime = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
      
        return `${day}${month}${year}${hours}${minutes}${seconds}`;
      };

    const exportToExcel = () => {

        handleMenuClose();

        const fileType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
    
        // Convert data with headers to sheet
        const dataWithHeaders = rows.map((row) => {
          const obj = {};
          columns
            .filter((column) => column.headerName && !hideColumnsForExport.includes(column.headerName))
            .forEach((column) => {
              if (column.headerName) obj[column.headerName] = row[column.field];
            });
          return obj;
        });
    
        const ws = XLSX.utils.json_to_sheet(dataWithHeaders);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, "Excel"+ formatDateTime(new Date()) + fileExtension);

      };


      const exportToCSV = () =>{
        const fileType = "text/csv;charset=UTF-8";
        const fileExtension = ".csv";
      
        // Convert data with headers to sheet
        const dataWithHeaders = rows.map((row) => {
          const obj = {};
          columns
            .filter((column) => column.headerName && !hideColumnsForExport.includes(column.headerName))
            .forEach((column) => {
              if (column.headerName) obj[column.headerName] = row[column.field];
            });
          return obj;
        });
      
        const ws = XLSX.utils.json_to_sheet(dataWithHeaders);
        const csv = XLSX.utils.sheet_to_csv(ws);
        const data = new Blob([csv], { type: fileType });
        FileSaver.saveAs(data, "CSV"+ formatDateTime(new Date()) + fileExtension);
        handleMenuClose();

      }

      const printTable = () => {
        handleMenuClose();
      
        // Generate the HTML for the table
        let html = `<html><head><style>ol > li{list-style-type:lower-alpha;}</style><title>${customTitle===''?'&nbsp;':customTitle}</title><style>`;
        html += 'table { width: 100%; border-collapse: collapse; }';
        html += 'th, td { border: 1px solid black; padding: 8px; text-align: left; }';
        html += 'th { background-color: #f2f2f2; }';
        html += '</style></head><body>';
        html += '<table><thead><tr>';
      
        // Add table headers
        columns
          .filter(column => column.headerName && !hideColumnsForExport.includes(column.headerName))
          .forEach(column => {
            html += `<th>${column.headerName}</th>`;
          });
      
        html += '</tr></thead><tbody>';
      
        // Add table rows
        rows.forEach(row => {
          html += '<tr>';
          columns
            .filter(column => column.headerName && !hideColumnsForExport.includes(column.headerName))
            .forEach(column => {
              html += `<td>${row[column.field]}</td>`;
            });
          html += '</tr>';
        });
      
        html += '</tbody></table></body></html>';
      
        // Create a temporary iframe to print the table
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '0px';
        iframe.style.height = '0px';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);
      
        const iframeDocument = iframe.contentWindow.document;
        iframeDocument.open();
        iframeDocument.write(html);
        iframeDocument.close();
      
        iframe.contentWindow.focus(); // Focus on the iframe
        iframe.contentWindow.print(); // Print the content
      
        document.body.removeChild(iframe); // Remove the iframe after printing
      };


    return(
        <>
            <Tooltip title="Export">
              <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                  sx={{'&:hover': {
                      borderRadius: '6px'
                  },
                  color: "tablecolor.toolbar"
                }}
              >
                  <GetAppIcon sx={{fontSize: '16px'}} /> <Box sx={{ml:1, fontSize: '13px'}}>Export</Box>
              </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={exportToExcel}>Download to Excel</MenuItem>
                <MenuItem onClick={exportToCSV}>Download to CSV</MenuItem>
                <MenuItem onClick={printTable}>Print</MenuItem>
            </Menu>
        
        </>
    )

}

export default CustomToolbarExport;