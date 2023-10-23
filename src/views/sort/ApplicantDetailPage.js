import { useState } from 'react';
import React from 'react';
import styled from 'styled-components';

/* mui components */
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import { Button, ButtonGroup, Chip, Divider, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

/* custom components */
import ApplicantTotalEval from './components/ApplicantTotalEval';
import ApplicantExam from './components/ApplicantExam';
import ScrollingApplicantList from './components/ScrollingApplicantList';


/*
 *
 * 지원자 상세 페이지
 * url : manage/detail
 *
 */
const ApplicantDetailPage = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  return (
    <Paper sx={{background: 'transparent', height: 1}}>
      <Grid container xs="12" spacing={'1'} sx={{ height: 1 }}>
      <Grid item xs="3" container direction={'column'}>
          <Paper sx={{ height: 1 }}>
            {/* <applicant list> */}
            <Grid item xs={'3'}>
              <Box sx={{ 
                width: '390px', 
                justifyContent: 'center', 
                display: 'flex', 
                marginTop: '15px', 
                marginBottom: '10px' 
              }}>
                <ButtonGroup size="large" variant="outlined" aria-label="large button group">
                  <Button>
                    <ChevronLeftIcon />
                  </Button>
                  <Button>합격처리</Button>
                  <Button>
                    <ChevronRightIcon />
                  </Button>
                </ButtonGroup>
              </Box>
            </Grid>
            <Divider variant="middle" />
            <Grid item xs={'9'}>
              <ScrollingApplicantList height={770} width={390} itemSize={80} />
            </Grid>
          </Paper>
        </Grid>
        {/* </applicant list> */}
        <Grid item xs="9">
          <ScrollingPaper
            sx={{
              height: 1,
              maxHeight: '844px',
              overflow: 'auto'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                '& > :not(style)': {
                  m: 1,
                  height: 200
                }
              }}
            >
              {/* <applicant detail header> */}
              <Grid container spacing={5}>
                <Grid item xs={2}>
                  <Avatar alt="profile" src="images/test2.png" sx={{ 
                    width: '100%', height: '100%' 
                    }} />
                </Grid>
                <Grid item xs={3} container direction="column">
                  <Grid item xs>
                    <Typography variant="h2">이소영</Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="subtitle1">1992.11.22</Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h6">이소영</Typography>
                  </Grid>
                  <Grid item xs>
                    <Stack direction="row" spacing={1}>
                      <Chip label="💎필수조건 일치" variant="outlined" size="small" />
                      <Chip label="💔경력 불일치" variant="outlined" size="small" />
                      <Chip label="💎우대조건 일치" variant="outlined" size="small" />
                    </Stack>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6} lg={4} sx={{ ml: 'auto', mt: '-40px'  }}>
                  <Tabs value={tabValue} onChange={handleSetTabValue}>
                    <Tab label="종합평가" {...a11yProps(0)} />
                    <Tab label="입사지원서" {...a11yProps(0)} />
                    <Tab label="인적성검사" {...a11yProps(0)} />
                  </Tabs>
                </Grid>
              </Grid>
              {/* </applicant detail header> */}
            </Box>
            <Divider variant="middle" sx={{ marginTop: '10px' }} />
            {/* <applicant detail content> */}
            <Box>
              <CustomTabPanel value={tabValue} index={0}>
                <ApplicantTotalEval />
              </CustomTabPanel>
              <CustomTabPanel value={tabValue} index={1}>
                입사지원서
              </CustomTabPanel>
              <CustomTabPanel value={tabValue} index={2}>
                <ApplicantExam />
              </CustomTabPanel>
            </Box>
            {/* </applicant detail content> */}
          </ScrollingPaper>
        </Grid>
      </Grid>
    </Paper>
  );
};


/* styled components */

const ScrollingPaper = styled(Paper)(() => ({
  overflow: 'auto',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  '&-ms-overflow-style:': {
    display: 'none'
  }
}));

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" 
      hidden={value !== index} 
      id={`simple-tabpanel-${index}`} 
      aria-labelledby={`simple-tab-${index}`} 
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

export default ApplicantDetailPage;
