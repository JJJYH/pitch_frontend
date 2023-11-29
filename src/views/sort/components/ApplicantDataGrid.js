import * as React from 'react';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import { sort } from '../../../api.js';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';

/* custom components */

const ApplicantDataGrid = ({ columns, rows, isBtnClicked, isExcelClicked, btnType, setList, setIsSelected, setSelectedRows }) => {
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const posting = useSelector((state) => state.posting);

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
        loading={posting.isLoading}
        slots={{
          noRowsOverlay: () => (
            <Box style={{ width: '100%', height: '100%', position: 'relative' }}>
              <Box style={{ position: 'absolute', top: '48%', left: '42%', textAlign: 'center' }}>
                <Typography variant="h5">해당 전형에 지원자가 존재하지 않습니다.</Typography>
              </Box>
            </Box>
          ),
          loadingOverlay: () => (
            <Box style={{ width: '100%', height: '100%', position: 'relative' }}>
              <Box style={{ position: 'absolute', top: '42%', left: '45%', textAlign: 'center' }}>
                <CircularProgress style={{ color: '#38678f', zIndex: '9999' }} />
                <Typography variant="h5">데이터를 불러오는 중입니다.</Typography>
              </Box>
            </Box>
          )
        }}
        rowHeight={70}
        rows={posting.isLoading ? [] : rows}
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
