import * as React from 'react';
import { useState, useEffect } from 'react';
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
import ReqDataGrid from './components/ReqDataGrid';
import ReadReq from './components/ReadReq';
import axios from 'axios';
import ChipComp from './components/ChipComp';

const JobReqPage = () => {
  const [selectedChips, setSelectedChips] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState('');

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

  const reqlisthandler = async () => {
    try {
      const response = await axios.get('http://localhost:8888/admin/hire/reqlist');
      setRows(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    reqlisthandler();
  }, []);

  const handleCreate = () => {
    setSelectedChips([]);
    reqlisthandler();
    setSelectedRow('');
  };

  const handleRowClick = async (job_req_no) => {
    try {
      const response = await axios.get(`http://localhost:8888/admin/hire/jobreq/${job_req_no}`);
      setSelectedRow(response.data);
      //console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChipClick = async (status) => {
    const newSelectedChips = selectedChips.includes(status) ? selectedChips.filter((chip) => chip !== status) : [...selectedChips, status];

    setSelectedChips(newSelectedChips);
    //console.log(newSelectedChips);
    setSelectedRow('');

    const statusData = {
      selectedStatus: newSelectedChips
    };

    try {
      const response = await axios.post('http://localhost:8888/admin/hire/statuslist', statusData);
      setRows(response.data);
    } catch (error) {
      console.error(error);
    }
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
                  <Grid item pl={1}>
                    <ChipComp selectedChips={selectedChips} handleChipClick={handleChipClick} />
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
                  <ReqDataGrid rows={rows} handleRowClick={handleRowClick} />
                </Box>
              </Grid>
            </Grid>
          </StyledBox>
        </Grid>
        <Grid item xs={6}>
          <StyledBox>
            <ReadReq
              selectedRow={selectedRow}
              reqlisthandler={reqlisthandler}
              handleRowClick={handleRowClick}
              selectedChips={selectedChips}
              setRows={setRows}
            />
          </StyledBox>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default JobReqPage;
