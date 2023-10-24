import * as React from 'react';


/* mui components */
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

/* custom components */




const ApplicantDataGrid = ({ columns, rows }) => {
  return (
    <Box sx={{ height: "540px", width: '1'}}>
      <DataGrid
        rowHeight={70}
        rows={rows}
        columns={columns}
        hideFooter
        checkboxSelection
        initialState={{
          columns: {
            columnVisibilityModel: {
              apply_no: false,
              cv_no: false,
            },
          },
        }}
      />
    </Box>
  );
}



export default ApplicantDataGrid;