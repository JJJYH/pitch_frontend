import { useState, useEffect } from 'react';
import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router';
import { sort } from '../../api.js';
import { getFormattedDate, getAge } from './sorts.js';
import { evalSub } from './sorts';

/* mui components */
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import {
  AvatarGroup,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Chip,
  Divider,
  Paper,
  Rating,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddchartIcon from '@mui/icons-material/Addchart';

/* custom components */
import ApplicantTotalEval from './components/ApplicantTotalEval';
import ApplicantExam from './components/ApplicantExam';
import ScrollingApplicantList from './components/ScrollingApplicantList';

/*
 *
 * 지원자 상세 페이지
 * url : manage/:job_posting_no/sort/:apply_no/detail
 *
 */
const ApplicantDetailPage = () => {
  const { apply_no, job_posting_no } = useParams();

  const [tabValue, setTabValue] = useState(0);
  const [clickedBtn, setClickedBtn] = useState(null);
  const [applicantInfo, setApplicantInfo] = useState({});

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  useEffect(() => {
    sort.applicantDetail(apply_no).then((res) => {
      setApplicantInfo({ ...res.data });
      console.log(res.data);
    });
  }, [apply_no]);

  return (
    <Paper sx={{ background: 'transparent', height: 1 }}>
      <Grid container xs="12" spacing={'1'} sx={{ height: 1 }}>
        <Grid item xs="3" container direction={'column'}>
          <Paper sx={{ height: 1 }}>
            {/* <applicant list> */}
            <Grid item xs={'3'}>
              <Box
                sx={{
                  width: '390px',
                  justifyContent: 'center',
                  display: 'flex',
                  marginTop: '15px',
                  marginBottom: '10px'
                }}
              >
                <ButtonGroup size="large" variant="outlined" aria-label="large button group">
                  <Button
                    value={'-'}
                    onClick={(event) => {
                      setClickedBtn(event.target.value);
                    }}
                  >
                    <ChevronLeftIcon />
                  </Button>
                  <Button>합격안내</Button>
                  <Button
                    value={'+'}
                    onClick={(event) => {
                      setClickedBtn(event.target.value);
                    }}
                  >
                    <ChevronRightIcon />
                  </Button>
                </ButtonGroup>
              </Box>
            </Grid>
            <Divider variant="middle" />
            <Grid item xs={'9'}>
              <ScrollingApplicantList
                height={770}
                width={390}
                itemSize={90}
                postingNo={job_posting_no}
                applyNo={apply_no}
                clickedBtn={clickedBtn}
              />
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
                  <Avatar
                    alt="profile"
                    src="images/test2.png"
                    sx={{
                      width: '100%',
                      height: '100%'
                    }}
                  />
                </Grid>
                <Grid item xs={3} container direction="column">
                  <Grid item xs>
                    <Typography variant="h2">{`${applicantInfo['cv']?.['user_nm']} (${applicantInfo['cv']?.['gender']})`}</Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="subtitle1">{`만 ${getAge(applicantInfo['cv']?.['user_birth'])}세 (${getFormattedDate(
                      applicantInfo['cv']?.['user_birth']
                    )})`}</Typography>
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
                <Grid item xs={12} md={6} lg={4} sx={{ ml: 'auto', mt: '-40px', minWidth: '430px' }}>
                  <Tabs value={tabValue} onChange={handleSetTabValue}>
                    <Tab label="종합평가" {...a11yProps(0)} />
                    <Tab label="입사지원서" {...a11yProps(0)} />
                    <Tab label="인적성검사" {...a11yProps(0)} />
                    <Tab label="면접평가" {...a11yProps(0)} />
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
              <CustomTabPanel value={tabValue} index={3}>
                {applicantInfo.evals != null && (
                  <Grid container direction={'column'} sx={{ mt: '20px' }}>
                    <Grid item xs={11} sx={{ ml: '30px', mr: '30px' }}>
                      <Stack direction={'row'}>
                        <AddchartIcon />
                        <Typography variant="h4" sx={{ mb: '10px', ml: '4px' }}>
                          면접 종합 평가
                        </Typography>
                      </Stack>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ mb: '20px', display: 'flex', justifyContent: 'space-between' }}>
                            <Box>
                              <Typography variant="h4" sx={{ mb: '10px' }}>
                                평균 점수
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                <Typography variant="h2" sx={{ mr: '3px', ml: '3px' }}>
                                  4.0
                                </Typography>
                                <Rating size="large" value={4} readOnly />
                              </Box>
                            </Box>
                            <AvatarGroup max={3}>
                              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                              <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                              <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                              <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
                              <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
                            </AvatarGroup>
                          </Box>
                          <Box>
                            <Typography variant="h4" sx={{ mb: '10px' }}>
                              항목별 점수
                            </Typography>
                            <Box sx={{ display: 'flex', '& .score': { mr: '60px' } }}>
                              {evalSub.map((e, i) => {
                                return (
                                  <Box key={i} className={'score'} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography component="legend" sx={{ mr: '5px' }}>
                                      {e.sub}
                                    </Typography>

                                    <Rating value={3} readOnly max={1} sx={{ mr: '3px' }} />
                                    <Typography variant="h5">3.0</Typography>
                                  </Box>
                                );
                              })}
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={11} sx={{ ml: '30px', mr: '30px', mt: '40px' }}>
                      <Stack direction={'row'}>
                        <AddchartIcon />
                        <Typography variant="h4" sx={{ mb: '10px', ml: '4px' }}>
                          면접 평가 상세
                        </Typography>
                      </Stack>
                    </Grid>
                    {applicantInfo.evals.map((e, index) => {
                      return (
                        <Grid key={index} item xs={11} sx={{ ml: '30px', mr: '30px', mb: '30px' }}>
                          <Card variant="outlined">
                            <CardContent>
                              <Box sx={{ mb: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                  <Typography variant="h4" sx={{ mb: '10px' }}>
                                    평균 점수
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <Typography variant="h2" sx={{ mr: '3px', ml: '3px' }}>
                                      4.0
                                    </Typography>
                                    <Rating size="large" value={4} readOnly />
                                  </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                                  <Typography variant="h5" sx={{ ml: '3px' }}>
                                    서창훈
                                  </Typography>
                                </Box>
                              </Box>
                              <Box>
                                <Typography variant="h4" sx={{ mb: '10px' }}>
                                  항목별 점수
                                </Typography>
                                <Box sx={{ display: 'flex', '& .score': { mr: '60px' } }}>
                                  {evalSub.map((e, i) => {
                                    return (
                                      <Box key={i} className={'score'} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography component="legend" sx={{ mr: '5px' }}>
                                          {e.sub}
                                        </Typography>

                                        <Rating value={3} readOnly max={1} sx={{ mr: '3px' }} />
                                        <Typography variant="h5">3.0</Typography>
                                      </Box>
                                    );
                                  })}
                                </Box>
                              </Box>
                              <Box>
                                <Typography variant="h4" sx={{ mb: '10px' }}>
                                  비고
                                </Typography>
                                <Typography>이 지원자는 어쩌구 저쩌구 해서 합격시키십쇼</Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
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
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
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

const changeSelectedAppl = (e) => {};

export default ApplicantDetailPage;
