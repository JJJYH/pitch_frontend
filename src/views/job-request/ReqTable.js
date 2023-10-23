import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ReadReq from './ReadReq';
import { StatusChip1, StatusChip2, StatusChip3, StatusChip4, StatusChip5, StatusChip6 } from './StatusChips';

function createData(id, date, title, job_role, status) {
  return {
    id,
    date,
    title,
    job_role,
    status
  };
}

const rows = [
  createData(1, '2023-10-17', '채용요청서1', '직무1', '작성중'),
  createData(2, '2023-10-17', '채용요청서2', '직무2', '요청완료'),
  createData(3, '2023-10-17', '채용요청서11', '직무1', '작성중'),
  createData(4, '2023-10-17', '채용요청서3', '직무3', '승인'),
  createData(5, '2023-10-17', '채용요청서4', '직무4', '공고중'),
  createData(6, '2023-10-17', '채용요청서5', '직무5', '공고종료'),
  createData(7, '2023-10-17', '채용요청서6', '직무5', '반려')
];

const columns = [
  { field: 'date', headerName: '요청일자', width: 150, headerAlign: 'center', align: 'center' },
  { field: 'title', headerName: '제목', width: 150, headerAlign: 'center', align: 'center' },
  { field: 'job_role', headerName: '직무', width: 150, headerAlign: 'center', align: 'center' },
  {
    field: 'status',
    headerName: '상태',
    width: 200,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) => {
      const status = params.row.status;
      switch (status) {
        case '작성중':
          return <StatusChip1 label={status} variant="selected" />;
        case '요청완료':
          return <StatusChip2 label={status} variant="selected" />;
        case '승인':
          return <StatusChip3 label={status} variant="selected" />;
        case '반려':
          return <StatusChip4 label={status} variant="selected" />;
        case '공고중':
          return <StatusChip5 label={status} variant="selected" />;
        case '공고종료':
          return <StatusChip6 label={status} variant="selected" />;
      }
    }
  }
];

const StyledBox = styled(Box)(() => ({
  margin: '15px 10px',
  borderRadius: '8px',
  border: '3px solid #f0f0f0',
  height: 680,
  overflow: 'auto',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  '&-ms-overflow-style:': {
    display: 'none'
  }
}));

export default function ReqTable() {
  const [title, setTitle] = useState('요청서 등록');
  const [selectedChips, setSelectedChips] = useState([]);
  const [filteredRows, setFilteredRows] = useState(rows);
  const [selectedRow, setSelectedRow] = useState('');

  const handleCreate = () => {
    setSelectedChips([]);
    setFilteredRows(rows);
    setTitle('요청서 등록');
  };

  const handleRowClick = (params) => {
    setSelectedRow(params.row);
    console.log(params.row);
    setTitle('요청 상세');
  };

  const handleChipClick = (status) => {
    setSelectedChips((prevChips) => {
      const statusIndex = prevChips.indexOf(status);

      const newSelectedChips = statusIndex === -1 ? [...prevChips, status] : prevChips.filter((chip) => chip !== status);

      setFilteredRows(rows.filter((row) => newSelectedChips.includes(row.status) || newSelectedChips.length === 0));

      return newSelectedChips;
    });
  };

  return (
    <Paper sx={{ height: 1 }}>
      <Box sx={{ height: '140px' }}>
        <Typography sx={{ color: '#757575', padding: '40px 0px 20px 20px' }} variant="h2">
          <TaskOutlinedIcon /> 채용 요청 관리
        </Typography>
        <Box sx={{ padding: '0px 20px' }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Grid container spacing={2}>
                <Typography sx={{ marginTop: '28px', marginLeft: '20px' }}>신청일자</Typography>
                <Grid item>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker slotProps={{ textField: { size: 'small' } }} />
                  </LocalizationProvider>
                </Grid>
                <Grid item>
                  <p>~</p>
                </Grid>
                <Grid item>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker slotProps={{ textField: { size: 'small' } }} />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Stack direction="row" spacing={1}>
                <Button variant="contained" style={{ backgroundColor: '#b2cce1' }} onClick={handleCreate}>
                  등록
                </Button>
                <Button variant="outlined" style={{ borderColor: '#b2cce1', color: '#b2cce1' }}>
                  삭제
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Grid container sx={{ padding: '0px 10px' }}>
        <Grid item xs={6}>
          <StyledBox>
            <Grid container direction="column">
              <Grid item p={2}>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Stack direction="row" spacing={1}>
                      {['작성중', '요청완료', '승인', '반려', '공고중', '공고종료'].map((status, index) => (
                        <React.Fragment key={index}>
                          {status === '작성중' && (
                            <StatusChip1
                              label={status}
                              variant={selectedChips.includes(status) ? 'selected' : 'outlined'}
                              onClick={() => handleChipClick(status)}
                            />
                          )}
                          {status === '요청완료' && (
                            <StatusChip2
                              label={status}
                              variant={selectedChips.includes(status) ? 'selected' : 'outlined'}
                              onClick={() => handleChipClick(status)}
                            />
                          )}
                          {status === '승인' && (
                            <StatusChip3
                              label={status}
                              variant={selectedChips.includes(status) ? 'selected' : 'outlined'}
                              onClick={() => handleChipClick(status)}
                            />
                          )}
                          {status === '반려' && (
                            <StatusChip4
                              label={status}
                              variant={selectedChips.includes(status) ? 'selected' : 'outlined'}
                              onClick={() => handleChipClick(status)}
                            />
                          )}
                          {status === '공고중' && (
                            <StatusChip5
                              label={status}
                              variant={selectedChips.includes(status) ? 'selected' : 'outlined'}
                              onClick={() => handleChipClick(status)}
                            />
                          )}
                          {status === '공고종료' && (
                            <StatusChip6
                              label={status}
                              variant={selectedChips.includes(status) ? 'selected' : 'outlined'}
                              onClick={() => handleChipClick(status)}
                            />
                          )}
                        </React.Fragment>
                      ))}
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    height: 590,
                    width: '96%',
                    margin: 'auto'
                  }}
                >
                  <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    hideFooter
                    checkboxSelection
                    disableRowSelectionOnClick
                    onRowClick={handleRowClick}
                  />
                </Box>
              </Grid>
            </Grid>
          </StyledBox>
        </Grid>
        <Grid item xs={6}>
          <StyledBox>
            <ReadReq title={title} selectedRow={selectedRow} />
          </StyledBox>
        </Grid>
      </Grid>
    </Paper>
  );
}
