import { useState, useEffect, useRef } from 'react';
import React from 'react';
import styled from 'styled-components';
import { sort } from '../../api.js';
import { getFormattedDate, getAge } from './sorts.js';
import { evalSub } from './sorts';
import { useReactToPrint } from 'react-to-print';

/* mui components */
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import PrintIcon from '@mui/icons-material/Print';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { AvatarGroup, Button, Card, CardContent, Chip, Divider, Paper, Rating, Stack, Tab, Tabs, Typography } from '@mui/material';
import AddchartIcon from '@mui/icons-material/Addchart';
import PersonIcon from '@mui/icons-material/Person';

/* custom components */
import ApplicantTotalEval from './components/ApplicantTotalEval';
import ApplicantExam from './components/ApplicantExam';
import ApplicantCV from './components/ApplicantCV.js';

/*
 *
 * 지원자 상세 페이지
 * url : manage/:job_posting_no/sort/:apply_no/detail
 *
 */
const ApplicantDetailPage = ({ apply_no, job_posting_no, text }) => {
  const [open, setOpen] = useState(false);
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

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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
    <Box>
      <Button onClick={handleOpen}>{text}</Button>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth={'xl'}>
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }} id="customized-dialog-title">
          <PersonIcon />
          <Typography variant="h4">지원자 상세정보</Typography>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          dividers
          sx={{
            minWidth: '1200px',
            minHeight: '800px',
            overflow: 'hidden'
          }}
        >
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
        </DialogContent>
      </Dialog>
    </Box>
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
