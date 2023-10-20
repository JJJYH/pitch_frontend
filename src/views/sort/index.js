import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

/* mui components */
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Paper, Typography } from '@mui/material';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';


/* custom components */
import ApplicantDataGrid from './components/ApplicantDataGrid';
import PostStatuses from './components/PostStatuses';
import FilteringModal from './components/FilteringModal';
import NoticeModal from './components/NoticeModal';
import InterviewDateModal from './components/InterviewDateModal';
import InterviewEvalModal from './components/InterviewEvalModal';

/*
 *
 * 지원자 선별 페이지
 * url : manage/sorting
 *
 */
const SortingPage = () => {
  const theme = useTheme();
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper
      sx={{
        height: '1'
      }}
    >
      <Box
        sx={{
          width: '1',
          height: '140px',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'start',
            marginLeft: '20px',
            marginTop: '30px'
          }}
        >
          <ManageAccountsOutlinedIcon fontSize="large" />
          <Typography variant="h2">
            지원자 관리
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            zIndex: '2',
            marginTop: '40px',
            marginRight: '2%'
          }}
        >
          <PostStatuses />
        </Box>
      </Box>
      <Box sx={{ width: '1', typography: 'body1', marginTop: '15px' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="sorting results tab">
              <Tab label="1차" value="1" />
              <Tab label="2차" value="2" />
              <Tab label="최종" value="3" />
              <Tab label="종료" value="4" />
            </TabList>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '30px',
              marginRight: '25px'
            }}
          >
            { value === '1' && <FilteringModal /> }
            { value === '2' && <InterviewDateModal /> }
            { value === '3' && <InterviewEvalModal /> }
            <NoticeModal />
          </Box>
          <Box>
            <MyTabPanel value="1">
              <ApplicantDataGrid />
            </MyTabPanel>
            <MyTabPanel value="2">
              <ApplicantDataGrid />
            </MyTabPanel>
            <MyTabPanel value="3">
              <ApplicantDataGrid />
            </MyTabPanel>
            <MyTabPanel value="4">
              <ApplicantDataGrid />
            </MyTabPanel>
          </Box>
        </TabContext>
      </Box>
    </Paper>
  );
};

/* styled components */

const MyTabPanel = styled(TabPanel)(({ theme }) => ({
  paddingTop: '10px'
}));

export default SortingPage;
