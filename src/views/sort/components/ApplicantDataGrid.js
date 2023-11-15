import * as React from 'react';
import { useState } from 'react';

/* mui components */
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { sort } from '../../../api.js';
import { useEffect } from 'react';
import { template } from 'lodash';

/* custom components */

const ApplicantDataGrid = ({ columns, rows, isBtnClicked, isExcelClicked, btnType, setList, setIsSelected, setSelectedRows }) => {
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

  useEffect(() => {
    const list = [];
    rowSelectionModel.map((index) => {
      list.push(rows[index].apply_no);
    });
    sort.cvToExcel(list).then(() => {});
  }, [isExcelClicked]);

  useEffect(() => {
    if (rowSelectionModel.length > 0) {
      setIsSelected(true);
      const tempList = rowSelectionModel.map((index) => rows[index]);
      setSelectedRows(tempList);
    } else {
      setIsSelected(false);
      setSelectedRows([]);
    }
  }, [rowSelectionModel]);

  return (
    <Box sx={{ height: '620px', width: '1' }}>
      <DataGrid
        rowHeight={70}
        rows={rows}
        columns={columns}
        hideFooter
        checkboxSelection
        isRowSelectable={(params) => {
          return params.row.status_type != '최종합격';
        }}
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
