import * as React from 'react';
import { useState } from 'react';

/* mui components */
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { sort } from '../../../api.js';
import { useEffect } from 'react';

/* custom components */

const ApplicantDataGrid = ({ columns, rows, isBtnClicked, btnType, setList }) => {
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);

  useEffect(() => {
    const list = [];
    rowSelectionModel.map((index) => {
      list.push(rows[index].apply_no);
    });
    sort.applicantHandle(btnType, list).then(() => {
      setList();
    });
  }, [isBtnClicked]);

  return (
    <Box sx={{ height: '620px', width: '1' }}>
      <DataGrid
        rowHeight={70}
        rows={rows}
        columns={columns}
        hideFooter
        checkboxSelection
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        initialState={{
          columns: {
            columnVisibilityModel: {
              apply_no: false,
              cv_no: false
            }
          }
        }}
      />
    </Box>
  );
};

export default ApplicantDataGrid;
