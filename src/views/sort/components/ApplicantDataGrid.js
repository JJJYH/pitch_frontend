import * as React from 'react';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { sort } from '../../../api.js';
import { useEffect } from 'react';

/* custom components */

const ApplicantDataGrid = ({ columns, rows, isBtnClicked, isExcelClicked, btnType, setList, setIsSelected, setSelectedRows }) => {
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);

  useEffect(() => {
    const list = [];
    rowSelectionModel.forEach((index) => {
      list.push(rows[index].apply_no);
    });
    sort.applicantHandle(btnType, list).then(() => {
      setList();
    });
  }, [isBtnClicked]);

  useEffect(() => {
    const list = [];
    rowSelectionModel.forEach((index) => {
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
    <Box sx={{ height: '620px', width: '100%' }}>
      <DataGrid
        sx={{
          '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
            outline: 'none !important'
          },
          [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]: {
            outline: 'none'
          },
          '&.Mui-selected': {
            background: 'rgba(56, 103, 143, 1)'
          }
        }}
        rowHeight={70}
        rows={rows}
        columns={columns}
        hideFooter
        checkboxSelection
        isRowSelectable={(params) => {
          return params.row.status_type !== '최종합격';
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
