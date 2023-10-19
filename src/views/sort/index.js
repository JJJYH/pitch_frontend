import * as React from 'react';
import { useTheme } from '@mui/material/styles';

/* mui components */
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Paper, Typography } from '@mui/material';

/* custom components */
import Sorting1st from './components/Sorting1st';
import Sorting2nd from './components/Sorting2nd';
import SortingFinal from './components/SortingFinal';
import Sorted from './components/Sorted';
import PostStatuses from './components/PostStatuses';


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
    <Paper sx={{
      height: '1'
    }}>
      <Box sx={{
        width: '1000',
        height: '140px',
        display: 'flex',
        justifyContent: 'flex-end', 
        position: 'relative',
        background: theme.palette.secondary[200],
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px'
      }}>
        <Typography variant='h2'
          sx={{
            position: 'absolute',
            marginRight: '1300px',
            marginTop: '40px'
          }}>[인사] 인사팀 신입 ~~!@</Typography>
        <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            zIndex: '2',
            position: 'absolute',
            marginTop: '3%',
            marginRight: '2%'
          }}>
            <PostStatuses />
        </Box>
      </Box>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="sorting results tab">
              <Tab label="1차" value="1" />
              <Tab label="2차" value="2" />
              <Tab label="최종" value="3" />
              <Tab label="종료" value="4" />
            </TabList>
          </Box>
          <TabPanel value="1"><Sorting1st /></TabPanel>
          <TabPanel value="2"><Sorting2nd /></TabPanel>
          <TabPanel value="3"><SortingFinal /></TabPanel>
          <TabPanel value="4"><Sorted /></TabPanel>
        </TabContext>
      </Box>
    </Paper>
  );
}

export default SortingPage;
