import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedRow, resetSelectedRow, selectedRowSelector } from 'store/selectedRowSlice';
import SearchIcon from '@mui/icons-material/Search';
import ReqPageSearch from './components/ReqPageSearch';
import { reqPosting } from 'api';
import { useSnackbar } from 'notistack';
import { setUploadedFiles, resetUploadedFiles, uploadedFilesSelector } from 'store/uploadedFilesSlice';

const JobReqPage = () => {
  const [selectedChips, setSelectedChips] = useState([]);
  const [rows, setRows] = useState([]);
  const [defaultRow, setDefaultRow] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const userId = useSelector((state) => state.userInfo.user_id);
  const [val, setVal] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const dataGridRef = useRef();

  const StyledBox = styled(Box)(() => ({
    margin: '10px',
    borderRadius: '4px',
    // border: '3px solid #f0f0f0',
    border: '1px solid #c0c0c0',
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
      const response = await reqPosting.jobReqList();
      setRows(response.data);
      const defaultRow = response.data[0];
      //console.log(defaultRow);
      setDefaultRow(defaultRow);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    reqlisthandler();
  }, []);

  const handleCreate = async () => {
    const searchData = await handleCombinedSearch(startDate, endDate, searchKeyword, selectedChips, userId);
    setRows(searchData);
    dispatch(resetUploadedFiles());
    dispatch(resetSelectedRow());
    updateVal();
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setSearchKeyword('');
    setSelectedChips([]);
    reqlisthandler();
  };

  const postStatusData = async (statusData) => {
    try {
      const response = await reqPosting.statusList(statusData);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleChipClick = async (status) => {
    const newSelectedChips = selectedChips.includes(status) ? selectedChips.filter((chip) => chip !== status) : [...selectedChips, status];

    setSelectedChips(newSelectedChips);

    dispatch(resetSelectedRow());

    const searchData = await handleCombinedSearch(startDate, endDate, searchKeyword, newSelectedChips, userId);
    setRows(searchData);
  };

  const handleDataGrid = () => {
    dataGridRef.current.handleCheckedRowsDelete();
  };

  const handleDataGridUpdate = (reqStatus) => {
    dataGridRef.current.handleCheckedRowsUpdateStatus(reqStatus);
  };

  const handleStartDateChange = (date) => {
    console.log(date.$d);
    setStartDate(date.$d);
  };

  const handleEndDateChange = (date) => {
    console.log(date);
    setEndDate(date.$d);
  };

  const handleSearchInputChange = (value) => {
    setSearchKeyword(value);
  };

  const handleCombinedSearch = async (startDate, endDate, searchKeyword, selectedStatus, userId) => {
    try {
      const response = await reqPosting.search({
        startDate,
        endDate,
        searchKeyword,
        selectedStatus,
        userId
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleCombinedSearchButton = async (startDate, endDate, searchKeyword, selectedStatus, userId) => {
    const searchData = await handleCombinedSearch(startDate, endDate, searchKeyword, selectedStatus, userId);
    setRows(searchData);
  };

  const updateVal = () => {
    setVal(true);
  };

  return (
    <Paper sx={{ height: 1 }}>
      <Box sx={{ height: '140px' }}>
        <Typography sx={{ color: '#364152', padding: '35px 0px 20px 20px', display: 'flex', alignItems: 'center', gap: 1 }} variant="h2">
          <TaskOutlinedIcon sx={{ mb: 0.5 }} /> 채용 요청 관리
        </Typography>
        <Box sx={{ padding: '0px 20px' }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Grid container spacing={1}>
                {/* <Typography sx={{ marginTop: '20px', marginLeft: '20px' }}>신청일자</Typography> */}
                <Grid item>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      slotProps={{ textField: { size: 'small' } }}
                      value={startDate}
                      onChange={handleStartDateChange}
                      format="YYYY/MM/DD"
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item>
                  <p>~</p>
                </Grid>
                <Grid item>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      slotProps={{ textField: { size: 'small' } }}
                      value={endDate}
                      onChange={handleEndDateChange}
                      format="YYYY/MM/DD"
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item sx={{ marginLeft: '20px' }}>
                  <ReqPageSearch value={searchKeyword} handleSearchInputChange={handleSearchInputChange} />
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    style={{ height: '38px', minWidth: '40px', width: '40px', backgroundColor: '#38678f' }}
                    onClick={() => handleCombinedSearchButton(startDate, endDate, searchKeyword, selectedChips, userId)}
                  >
                    <SearchIcon fontSize="small" />
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: '#38678f ', height: '40px', marginLeft: '20px' }}
                    onClick={handleReset}
                  >
                    초기화
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
              {userId !== 'admin' && (
                <Stack direction="row" spacing={1}>
                  <Button variant="contained" style={{ backgroundColor: '#38678f ' }} onClick={handleCreate}>
                    등록
                  </Button>
                  <Button variant="outlined" style={{ borderColor: '#38678f', color: '#38678f' }} onClick={handleDataGrid}>
                    삭제
                  </Button>
                </Stack>
              )}
              {userId === 'admin' && (
                <Stack direction="row" spacing={1}>
                  <Button variant="contained" style={{ backgroundColor: '#38678f ' }} onClick={() => handleDataGridUpdate('승인')}>
                    일괄승인
                  </Button>
                  <Button
                    variant="outlined"
                    style={{ borderColor: '#38678f', color: '#38678f' }}
                    onClick={() => handleDataGridUpdate('반려')}
                  >
                    일괄반려
                  </Button>
                </Stack>
              )}
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
                  <ReqDataGrid
                    rows={rows}
                    ref={dataGridRef}
                    postStatusData={postStatusData}
                    setRows={setRows}
                    selectedChips={selectedChips}
                    startDate={startDate}
                    endDate={endDate}
                    searchKeyword={searchKeyword}
                    handleCombinedSearch={handleCombinedSearch}
                    defaultRow={defaultRow}
                  />
                </Box>
              </Grid>
            </Grid>
          </StyledBox>
        </Grid>
        <Grid item xs={6}>
          <ReadReq
            reqlisthandler={reqlisthandler}
            postStatusData={postStatusData}
            selectedChips={selectedChips}
            setSelectedChips={setSelectedChips}
            setRows={setRows}
            startDate={startDate}
            endDate={endDate}
            searchKeyword={searchKeyword}
            handleCombinedSearch={handleCombinedSearch}
            updateVal={updateVal}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default JobReqPage;
