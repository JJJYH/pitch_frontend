import { useState, useEffect, useRef } from 'react';
import React from 'react';
import styled from 'styled-components';
import { sort } from '../../api.js';
import { getFormattedDate, getAge } from './sorts.js';
import { evalSub } from './sorts';
import { useReactToPrint } from 'react-to-print';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';

/* mui components */
import { Box, Grid, InputAdornment, Rating, TextField, Tooltip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import PrintIcon from '@mui/icons-material/Print';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

import { AvatarGroup, Button, Card, ButtonGroup, CardContent, Chip, Divider, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import AddchartIcon from '@mui/icons-material/Addchart';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

/* custom components */
import ApplicantTotalEval from './components/ApplicantTotalEval';
import ApplicantExam from './components/ApplicantExam';
import ApplicantCV from './components/ApplicantCV.js';

/*
 *
 * 지원자 상세 페이지
 * url : manage/posts/:job_posting_no/sort/:apply_no/
 *
 */
const ApplicantDetailPage = ({ text }) => {
  const userInfo = useSelector((state) => state.userInfo);

  const { apply_no, job_posting_no } = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [applicantInfo, setApplicantInfo] = useState({});
  const componentRef = useRef();
  const [rating, setRating] = useState({
    total: 0,
    sub1: 0,
    sub2: 0,
    sub3: 0,
    sub4: 0,
    sub5: 0
  });
  const [noteArea, setNoteArea] = useState('');
  const [evalScore, setEvalScore] = useState({
    sub1: 0,
    sub2: 0,
    sub3: 0,
    sub4: 0,
    sub5: 0
  });

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });
  const onClickEval = () => {
    const data = {
      user_id: userInfo.user_id,
      note: noteArea,
      apply_no: apply_no,
      job_req_no: posting.reqNo,
      sub1_score: evalScore.sub1,
      sub2_score: evalScore.sub2,
      sub3_score: evalScore.sub3,
      sub4_score: evalScore.sub4,
      sub5_score: evalScore.sub5
    };
    sort.applicantEval(data).then((res) => {});
  };
  useEffect(() => {
    sort.applicantDetail(apply_no).then((res) => {
      setApplicantInfo({ ...res.data });
      let total = 0,
        sub1 = 0,
        sub2 = 0,
        sub3 = 0,
        sub4 = 0,
        sub5 = 0;

      res.data.evals?.map((e, i) => {
        sub1 += e.sub1_score;
        sub2 += e.sub2_score;
        sub3 += e.sub3_score;
        sub4 += e.sub4_score;
        sub5 += e.sub5_score;
      });

      total = (sub1 + sub2 + sub3 + sub4 + sub5) / res.data.evals?.length / 5;
      sub1 = sub1 / res.data.evals?.length;
      sub2 = sub2 / res.data.evals?.length;
      sub3 = sub3 / res.data.evals?.length;
      sub4 = sub4 / res.data.evals?.length;
      sub5 = sub5 / res.data.evals?.length;

      setRating({
        total,
        sub1,
        sub2,
        sub3,
        sub4,
        sub5
      });
    });
  }, [apply_no]);

  return (
    <Paper sx={{ background: 'transparent', height: 1 }}>
      <Grid container xs="12" spacing={'1'} sx={{ height: 1 }}>
        <Grid item xs="9">
          <ScrollingPaper
            sx={{
              height: 1,
              minHeight: '800px',
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
                    <Typography variant="h2">{`${applicantInfo['cv']?.['user_nm']} (${applicantInfo['cv']?.['gender']
                      .toString()
                      .charAt(0)})`}</Typography>
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
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', pr: '10px' }}>
                  <Button onClick={handlePrint}>
                    <PrintIcon />
                    인쇄하기
                  </Button>
                  {/* <Typography>|</Typography>
                  <Button onClick={handlePrint}>
                    <DownloadIcon />
                    저장
                  </Button> */}
                </Box>
                <ApplicantCV applicantInfo={applicantInfo} ref={componentRef} />
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
                        <Typography variant="h3" sx={{ mb: '20px', ml: '4px' }}>
                          면접 종합 평가
                        </Typography>
                      </Stack>
                      <Card variant="outlined" sx={{ mb: '30px' }}>
                        <CardContent>
                          <Box sx={{ mb: '20px', display: 'flex', justifyContent: 'space-between' }}>
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                <Typography variant="h2" sx={{ mr: '3px', ml: '3px' }}>
                                  {rating.total}
                                </Typography>
                                <Rating size="large" value={4} readOnly precision={0.1} />
                              </Box>
                            </Box>
                            <AvatarGroup max={3}>
                              {applicantInfo.evals?.map((p, i) => {
                                return <Avatar key={i} alt={p.user_nm} src="/static/images/avatar/1.jpg" />;
                              })}
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
                                    <Typography variant="h5">{rating[`sub${i + 1}`]}</Typography>
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
                        <Typography variant="h3" sx={{ mb: '20px', ml: '4px' }}>
                          면접 평가 상세
                        </Typography>
                      </Stack>
                    </Grid>
                    {applicantInfo.evals.map((e, index) => {
                      let total = (e.sub1_score + e.sub2_score + e.sub3_score + e.sub4_score + e.sub5_score) / 5;
                      return (
                        <Grid key={index} item xs={11} sx={{ ml: '30px', mr: '30px', mb: '30px' }}>
                          <Card variant="outlined">
                            <CardContent>
                              <Box sx={{ mb: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                  <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <Typography variant="h2" sx={{ mr: '3px', ml: '3px' }}>
                                      {total}
                                    </Typography>
                                    <Rating size="large" value={total} readOnly precision={0.1} />
                                  </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Avatar alt={e.user_nm} src="/static/images/avatar/1.jpg" />
                                  <Typography variant="h5" sx={{ ml: '3px' }}>
                                    {e.user_nm}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box>
                                <Typography variant="h4" sx={{ mb: '10px' }}>
                                  항목별 점수
                                </Typography>
                                <Box sx={{ display: 'flex', '& .score': { mr: '60px', mb: '15px' } }}>
                                  {evalSub.map((ev, i) => {
                                    return (
                                      <Box key={i} className={'score'} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography component="legend" sx={{ mr: '5px' }}>
                                          {ev.sub}
                                        </Typography>
                                        <Rating value={3} readOnly max={1} sx={{ mr: '3px' }} />
                                        <Typography variant="h5">{e[`sub${i + 1}_score`]}</Typography>
                                      </Box>
                                    );
                                  })}
                                </Box>
                              </Box>
                              <Box>
                                <Typography variant="h4" sx={{ mb: '10px' }}>
                                  비고
                                </Typography>
                                <Typography>{e.note}</Typography>
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
                      //setClickedBtn(event.target.value);
                    }}
                  >
                    <ChevronLeftIcon />
                  </Button>
                  <Button>합격대기처리</Button>
                  <Button
                    value={'+'}
                    onClick={(event) => {
                      //setClickedBtn(event.target.value);
                    }}
                  >
                    <ChevronRightIcon />
                  </Button>
                </ButtonGroup>
              </Box>
            </Grid>
            <Divider variant="middle" />
            <Grid
              item
              xs={'9'}
              container
              direction={'column'}
              spacing={2}
              sx={{
                '& .MuiRating-root': { ml: '20px' },
                '& .MuiBox-root': { display: 'flex', alignItems: 'end', justifyContent: 'space-between' },
                '& .MuiFormControl-root': { mr: '40px' },
                ml: '40px',
                mt: '30px',
                filter: applicantInfo.applicant_status == 'final' ? null : 'blur(10px)',
                pointerEvents: applicantInfo.applicant_status == 'final' ? null : 'none'
              }}
            >
              {evalSub.map((row, index) => {
                const subKey = 'sub' + (index + 1);
                return (
                  <Grid item key={index}>
                    <Box
                      sx={{
                        display: 'inline'
                      }}
                    >
                      <Tooltip title={row.description} placement="right">
                        <Typography component="legend">{row.sub}</Typography>
                      </Tooltip>
                    </Box>
                    <Box
                      sx={{
                        '& .MuiInputBase-input': { textAlign: 'end', maxWidth: '60px' }
                      }}
                    >
                      <Rating
                        size="large"
                        name="simple-controlled"
                        value={evalScore[subKey]}
                        onChange={(event, newValue) => {
                          setEvalScore({ ...evalScore, [subKey]: newValue });
                        }}
                        precision={0.5}
                        sx={{ mr: '15px' }}
                      />
                      <TextField
                        id="standard-number"
                        label="점수"
                        type="number"
                        value={evalScore[subKey]}
                        onChange={(event) => {
                          setEvalScore({ ...evalScore, [subKey]: checkScore(event.target.value) });
                        }}
                        InputLabelProps={{
                          shrink: true
                        }}
                        variant="standard"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <StarRoundedIcon />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Box>
                  </Grid>
                );
              })}
              <Grid item>
                <Typography component="legend">비고</Typography>
                <TextField
                  multiline
                  rows={8}
                  value={noteArea}
                  onChange={(event) => {
                    setNoteArea(event.target.value);
                  }}
                  sx={{
                    width: '98%'
                  }}
                />
              </Grid>
              <Grid item sx={{ mt: '10px', mr: '5px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" style={{ backgroundColor: '#38678f ' }} onClick={onClickEval}>
                  평가 등록
                </Button>
              </Grid>
            </Grid>
            {applicantInfo.applicant_status != 'final' && (
              <Box sx={{ zIndex: 10, mt: '-380px', ml: '160px' }}>
                <Typography variant="h3">면접 전</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        {/* </applicant list> */}
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

export default ApplicantDetailPage;
