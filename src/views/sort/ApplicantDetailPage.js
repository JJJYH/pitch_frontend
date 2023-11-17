import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import styled from 'styled-components';
import { sort } from '../../api.js';
import { evalSub, getFormattedDate, getAge, getFileNameFromContentDisposition, getImage } from './sorts.js';
import { useReactToPrint } from 'react-to-print';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import ReactWordcloud from 'react-wordcloud';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip as TT, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';

/* mui components */
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import { Box, Grid, InputAdornment, Rating, TextField, Tooltip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import PrintIcon from '@mui/icons-material/Print';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { AvatarGroup, Button, Card, CardContent, Chip, Divider, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import AddchartIcon from '@mui/icons-material/Addchart';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SaveAsOutlinedIcon from '@mui/icons-material/SaveAsOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';

/* custom components */
import ApplicantExam from './components/ApplicantExam';
import ApplicantCV from './components/ApplicantCV.js';
import { useSnackbar } from 'notistack';

/*
 *
 * 지원자 상세 페이지
 * url : manage/posts/:job_posting_no/sort/:apply_no/
 *
 */

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, TT, Legend);

const ApplicantDetailPage = ({ text }) => {
  const userInfo = useSelector((state) => state.userInfo);
  const posting = useSelector((state) => state.posting);
  const { enqueueSnackbar } = useSnackbar();
  const [info, setInfo] = useState({});
  const { apply_no, job_posting_no } = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [applicantInfo, setApplicantInfo] = useState({});
  const [score, setScore] = useState({});
  const componentRef = useRef();
  const navigate = useNavigate();
  const theme = useTheme();
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isChartFetched, setIsChartFetched] = useState(false);
  const [chartData, setChartData] = useState({});
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
  const [cloud, setCloud] = useState([]);
  const [hasEval, setHasEval] = useState(false);
  const [swords, setSwords] = useState({});

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  const handleDownload = (type) => {
    const data = {
      title: 'dddddd',
      type: [type],
      applyNo: [apply_no]
    };
    sort
      .fileDownload(data)
      .then((res) => {
        if (res.status === 200) {
          const header = res.headers['content-disposition'];

          const fileName = getFileNameFromContentDisposition(header);

          const blob = new Blob([res.data], { type: 'application/zip' });

          return { fileName, blob };
        } else {
          console.error('파일 다운로드 실패');
          throw new Error('파일 다운로드 실패');
        }
      })
      .then(({ fileName, blob }) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('파일 다운로드 오류:', error);
      });
  };

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
    sort.applicantEval(data).then((res) => {
      enqueueSnackbar('평가가 완료되었습니다.', { variant: 'info' });
      setIsDataFetched(!isDataFetched);
    });
  };

  const handleBtnClick = (event, value) => {
    setIsDataFetched(!isDataFetched);
    sort.applicantHandle(value, [apply_no]);
  };

  const handleOnClick = (event, value) => {
    let index = 0;

    posting.list.map((appl, i) => {
      if (appl.apply_no == apply_no) {
        index = i;
      }
    });

    if (value == '-') {
      index -= 1;
    } else {
      index += 1;
    }

    if (index < 0 || index >= posting.list.length) {
      return null;
    }

    navigate(`/manage/posts/${job_posting_no}/sort/${posting.list[index].apply_no}`);
  };

  useEffect(() => {
    sort.wordCloud().then((res) => {
      const words = [];
      res.data.map((word) => {
        if (word.text.length >= 2 && word.value > 1) {
          words.push(word);
        }
      });

      const sortedWords = words.sort((a, b) => b.value - a.value);
      const top5words = sortedWords.slice(0, 7);
      const matchWords = words.filter((item) => keywords.includes(item.text));

      setSwords({ ...swords, top5words, matchWords });
      setCloud(words);
    });
    sort.applicantDetail(apply_no).then((resp) => {
      setApplicantInfo({ ...resp.data });

      resp.data.evals.map((ev) => {
        if (ev.user_id == userInfo.user_id) {
          setHasEval(true);
        }
      });

      let total = 0,
        sub1 = 0,
        sub2 = 0,
        sub3 = 0,
        sub4 = 0,
        sub5 = 0;

      resp.data.evals?.map((e, i) => {
        sub1 += e.sub1_score;
        sub2 += e.sub2_score;
        sub3 += e.sub3_score;
        sub4 += e.sub4_score;
        sub5 += e.sub5_score;
      });

      total = (sub1 + sub2 + sub3 + sub4 + sub5) / resp.data.evals?.length / 5;
      sub1 = sub1 / resp.data.evals?.length;
      sub2 = sub2 / resp.data.evals?.length;
      sub3 = sub3 / resp.data.evals?.length;
      sub4 = sub4 / resp.data.evals?.length;
      sub5 = sub5 / resp.data.evals?.length;

      setRating({
        total,
        sub1,
        sub2,
        sub3,
        sub4,
        sub5
      });
      sort.applicantScore(job_posting_no, apply_no).then((res) => {
        setScore(res.data);
        sort.applicantAvg(job_posting_no).then((response) => {
          const avg = response.data;
          const applicant = resp.data;
          const applicantAvg = [];
          const recentEducation = applicant.cv.educations.reduce((prev, current) => {
            return current.graduate_date > prev.graduate_date ? current : prev;
          }, applicant.cv.educations[0]);

          let calculatedScore = null;
          if (recentEducation && recentEducation.total_score !== 0) {
            calculatedScore = Math.round((recentEducation.score / recentEducation.total_score) * 100);
          }

          const currentDate = new Date();

          const totalMonthsWorked = applicant.cv.careers.reduce((totalMonths, career) => {
            const joinDate = new Date(career.join_date);
            const quitDate = career.quit_date ? new Date(career.quit_date) : currentDate;
            const monthsWorked = (quitDate.getFullYear() - joinDate.getFullYear()) * 12 + quitDate.getMonth() - joinDate.getMonth();

            return totalMonths + monthsWorked;
          }, 0);

          const cert = applicant.cv.certifications[0].cert_name != null ? applicant.cv.certifications.length : 0;
          const activity = applicant.cv.activities[0].activity_detail != null ? applicant.cv.activities.length : 0;
          const language = applicant.cv.languages[0].language_name != null ? applicant.cv.languages.length : 0;
          const skill = applicant.cv.skills[0].skill_name != null ? applicant.cv.skills.length : 0;

          const tempInfo = {
            score: `${recentEducation.score} / ${recentEducation.total_score}`,
            experience: totalMonthsWorked,
            certification: cert,
            activity,
            language,
            skill
          };

          tempInfo.certTitle = applicant.cv.certifications
            .map((c) => c.cert_name)
            .filter(Boolean)
            .join(' / ');
          tempInfo.acTitle = applicant.cv.activities
            .map((a) => a.activity_detail)
            .filter(Boolean)
            .join(' / ');

          tempInfo.langTitle = applicant.cv.languages
            .map((l) => `${l.exam_type} ${l.language_score}점`)
            .filter(Boolean)
            .join(' / ');

          tempInfo.skillTitle = applicant.cv.skills
            .map((s) => s.skill_name)
            .filter(Boolean)
            .join(' / ');

          setInfo({ ...tempInfo });
          applicantAvg.push(cert);
          applicantAvg.push(totalMonthsWorked);
          applicantAvg.push(activity);
          applicantAvg.push(language);
          applicantAvg.push(skill);
          applicantAvg.push((calculatedScore / 100) * 4.5);

          const data = {
            labels: ['자격증', '경력', '대외활동', '어학시험', '보유기술', '학점'],
            datasets: [
              {
                label: resp.data['cv']?.user_nm,
                data: [...applicantAvg],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
              },
              {
                label: '지원자평균',
                data: [avg.avgCert, avg.avgExp, avg.avgAc, avg.avgLang, avg.avgSkill, (avg.avgScore / 100) * 4.5],
                backgroundColor: 'rgba(163, 164, 165, 0.2)',
                borderColor: 'rgba(163, 164, 165, 1)',
                borderWidth: 1
              }
            ]
          };
          setChartData({ ...data });
          setIsChartFetched(true);
        });
      });
    });
    setHasEval(false);
  }, [apply_no, isDataFetched]);
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
                    src={applicantInfo.picture && getImage(applicantInfo.picture)}
                    sx={{
                      width: '100%',
                      height: '100%',
                      mt: '-25px'
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
                    <Typography variant="subtitle1">{applicantInfo['cv']?.['careers'] ? '경력' : '신입'}</Typography>
                  </Grid>
                  <Grid item xs>
                    <Stack direction="row" spacing={1}>
                      <Chip label="💎필수조건 일치" variant="outlined" size="small" />
                      <Chip label="💔경력 불일치" variant="outlined" size="small" />
                      <Chip label="💎우대조건 일치" variant="outlined" size="small" />
                    </Stack>
                  </Grid>
                </Grid>
                <Grid item container xs={7} direction={'column'}>
                  <Grid
                    item
                    sx={{
                      ml: 'auto',
                      mt: '-40px',
                      minWidth:
                        applicantInfo.applicant_status == 'final' || applicantInfo.applicant_status == 'finished' ? '430px' : '330px'
                    }}
                  >
                    <Tabs
                      value={tabValue}
                      TabIndicatorProps={{
                        style: { background: '#38678f' }
                      }}
                      onChange={handleSetTabValue}
                      indicator={{ backgroundColor: '#38678f' }}
                    >
                      <Tab
                        label="지원자분석"
                        {...a11yProps(0)}
                        sx={{
                          color: '#38678f',
                          '&.Mui-selected': {
                            color: 'rgba(56, 103, 143, 1)'
                          }
                        }}
                      />
                      <Tab
                        label="입사지원서"
                        {...a11yProps(0)}
                        sx={{
                          color: '#38678f',
                          '&.Mui-selected': {
                            color: 'rgba(56, 103, 143, 1)'
                          }
                        }}
                      />
                      <Tab
                        label="인적성검사"
                        {...a11yProps(0)}
                        sx={{
                          color: '#38678f',
                          '&.Mui-selected': {
                            color: 'rgba(56, 103, 143, 1)'
                          }
                        }}
                      />
                      {(applicantInfo.applicant_status == 'final' || applicantInfo.applicant_status == 'finished') && (
                        <Tab
                          label="면접평가"
                          {...a11yProps(0)}
                          sx={{
                            color: '#38678f',
                            '&.Mui-selected': {
                              color: 'rgba(56, 103, 143, 1)'
                            }
                          }}
                        />
                      )}
                    </Tabs>
                  </Grid>
                  <Grid item sx={{ display: 'flex', justifyContent: 'flex-end', mt: '60px', mr: '60px' }}>
                    <Box>
                      <Typography variant="h4">
                        <span style={{ color: '#38678f' }}>{applicantInfo['cv']?.user_nm}</span>님의 전형별 현황
                      </Typography>
                      <Box
                        sx={{
                          mt: '10px',
                          height: '50px',
                          width: '320px',
                          background: 'rgba(245, 245, 245, 0.5)',
                          border: '1px solid rgba(245, 245, 245, 1)',
                          alignItems: 'center',
                          display: 'flex',
                          pl: '10px'
                        }}
                      >
                        <TripOriginIcon sx={{ fontSize: '13px', color: '#38678f', mr: '2px' }} />
                        <Typography variant="h4" sx={{ color: '#38678f' }}>
                          {applicantInfo.applicant_status == 'first'
                            ? '서류전형'
                            : applicantInfo.applicant_status == 'final'
                            ? '면접전형'
                            : '탈락'}
                        </Typography>
                        <Typography sx={{ ml: '10px', width: '80px' }} variant="h4">
                          {applicantInfo.status_type}
                        </Typography>
                        <Typography sx={{ color: 'rgba(163, 164, 165, 1)', ml: '60px', mr: '10px' }} variant="h4">
                          전체보기
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              {/* </applicant detail header> */}
            </Box>
            <Divider variant="middle" sx={{ marginTop: '10px' }} />
            {/* <applicant detail content> */}
            <Box>
              <CustomTabPanel value={tabValue} index={0}>
                <Box sx={{ marginTop: '20px' }}>
                  <Grid container direction="column">
                    <Grid item xs={11} sx={{ ml: '30px', mr: '30px' }}>
                      <Stack direction={'row'}>
                        <AddchartIcon />
                        <Typography variant="h3" sx={{ mb: '10px', ml: '4px' }}>
                          종합 점수
                        </Typography>
                      </Stack>
                      <Card variant="outlined" sx={{ mr: '50px' }}>
                        <CardContent sx={{ display: 'flex' }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              height: 1
                            }}
                          >
                            <Typography
                              sx={{
                                background: 'rgba(245, 245, 245, 0.5)',
                                pl: '50px',
                                pr: '50px',
                                pt: '30px',
                                pb: '30px',
                                fontSize: '100px',
                                fontWeight: 'bold',
                                color:
                                  score.score > 59 ? '#38678f' : score.score > 49 ? '#5092E2' : score.score > 40 ? '#D18AC7' : '#EC5C87'
                              }}
                            >
                              {score.score > 59 ? 'A' : score.score > 49 ? 'B' : score.score > 40 ? 'C' : 'D'}
                            </Typography>
                          </Box>
                          <Grid container sx={{ ml: '20px', border: `${theme.palette.grey[200]} solid 1px` }}>
                            <Grid item container xs={6} sx={{ display: 'flex' }} direction="column">
                              <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                <Typography variant="h3">종합점수</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography variant="h1">{score && score.score}</Typography>
                                  <Typography variant="h1" sx={{ color: 'rgba(163, 164, 165, 1)' }}>
                                    /100
                                  </Typography>
                                  <Typography variant="h2" sx={{ color: 'rgba(163, 164, 165, 1)' }}>
                                    점
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={6}>
                                <Divider variant="middle" />
                                <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', mt: '30px' }}>
                                  <Typography variant="h3">지원자 등수</Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', ml: '30px' }}>
                                    <Typography variant="h1">{score.total_rank}</Typography>
                                    <Typography variant="h1" sx={{ color: 'rgba(163, 164, 165, 1)' }}>
                                      /{score.applicant_count}
                                    </Typography>
                                    <Typography variant="h2" sx={{ color: 'rgba(163, 164, 165, 1)' }}>
                                      등
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            </Grid>
                            <Divider orientation="vertical" flexItem />
                            <Grid item xs={5}>
                              <Typography variant="h3" sx={{ mt: '15px', ml: '10px' }}>
                                항목 점수
                              </Typography>
                              <Grid container sx={{ mt: '15px', ml: '10px' }}>
                                <Grid item container xs={6} direction={'column'}>
                                  <Grid item>
                                    <Typography variant="h4">우대사항</Typography>
                                  </Grid>
                                  <Grid item>
                                    <Typography variant="h4">경력</Typography>
                                  </Grid>
                                  <Grid item>
                                    <Typography variant="h4">자격증</Typography>
                                  </Grid>
                                  <Grid item>
                                    <Typography variant="h4">어학점수</Typography>
                                  </Grid>
                                  <Grid item>
                                    <Typography variant="h4">학력</Typography>
                                  </Grid>
                                </Grid>
                                <Grid item container xs={6} direction={'column'}>
                                  <Grid item>
                                    <Typography variant="h4">
                                      {score.advantage_score} 점 ({score.advantage_rank} 위 / 전체 {score.applicant_count}명)
                                    </Typography>
                                  </Grid>
                                  <Grid item>
                                    <Typography variant="h4">
                                      {score.career_score} 점 ({score.career_rank} 위 / 전체 {score.applicant_count}명)
                                    </Typography>
                                  </Grid>
                                  <Grid item>
                                    <Typography variant="h4">
                                      {score.certification_score} 점({score.certification_rank} 위 / 전체 {score.applicant_count}명)
                                    </Typography>
                                  </Grid>
                                  <Grid item>
                                    <Typography variant="h4">
                                      {score.language_score} 점({score.language_rank} 위 / 전체 {score.applicant_count}명)
                                    </Typography>
                                  </Grid>
                                  <Grid item>
                                    <Typography variant="h4">
                                      {score.education_score} 점({score.education_rank} 위 / 전체 {score.applicant_count}명)
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={11} sx={{ mt: '20px', ml: '30px' }}>
                      <Stack direction={'row'}>
                        <AssessmentOutlinedIcon />
                        <Typography variant="h3" sx={{ mb: '10px', ml: '4px' }}>
                          스펙 분석
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item sx={{ ml: '150px', display: 'flex', mb: '30px' }}>
                      <Box sx={{ width: '50%', height: '350px' }}>
                        {isChartFetched && <Radar data={chartData} options={chartOptions} />}
                      </Box>
                      <Box>
                        <Typography sx={{ mt: '30px' }} variant="h3">
                          <b style={{ color: '#38678f' }}>{applicantInfo['cv']?.user_nm}</b>님의 상세 스펙
                        </Typography>
                        <Box
                          sx={{
                            mt: '10px',
                            border: `solid 1px rgba(245, 245, 245, 1)`,
                            width: '420px',
                            height: '200px',
                            display: 'flex',
                            background: 'rgba(245, 245, 245, 0.1)',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            pl: '15px',
                            pr: '15px'
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '50%', pr: '20px' }}>
                            <Box>
                              <Box sx={{ mb: '10px' }}>
                                <Typography variant="h4">학점</Typography>
                              </Box>
                              <Box sx={{ mb: '10px' }}>
                                <Typography variant="h4">경력</Typography>
                              </Box>
                              <Box sx={{ mb: '10px' }}>
                                <Typography variant="h4">자격증</Typography>
                              </Box>
                            </Box>
                            <Box>
                              <Box sx={{ mb: '10px' }}>
                                <Typography variant="h4" sx={{ textAlign: 'end' }}>
                                  {info.score} 점
                                </Typography>
                              </Box>
                              <Box sx={{ mb: '10px' }}>
                                <Typography variant="h4" sx={{ textAlign: 'end' }}>
                                  {info.experience} 개월
                                </Typography>
                              </Box>
                              <Box sx={{ mb: '10px' }}>
                                <Tooltip title={info.certTitle}>
                                  <Typography variant="h4" sx={{ textAlign: 'end' }}>
                                    {info.certification} 건
                                  </Typography>
                                </Tooltip>
                              </Box>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '50%', pl: '10px' }}>
                            <Box>
                              <Box>
                                <Box sx={{ mb: '10px' }}>
                                  <Typography variant="h4">보유기술</Typography>
                                </Box>
                                <Box sx={{ mb: '10px' }}>
                                  <Typography variant="h4">대외활동</Typography>
                                </Box>
                                <Box sx={{ mb: '10px' }}>
                                  <Typography variant="h4">어학시험</Typography>
                                </Box>
                              </Box>
                            </Box>
                            <Box>
                              <Box sx={{ mb: '10px' }}>
                                <Tooltip title={info.skillTitle}>
                                  <Typography variant="h4">{info.skill} 건</Typography>
                                </Tooltip>
                              </Box>
                              <Box sx={{ mb: '10px' }}>
                                <Tooltip title={info.acTitle}>
                                  <Typography variant="h4">{info.activity} 건</Typography>
                                </Tooltip>
                              </Box>
                              <Box sx={{ mb: '10px' }}>
                                <Tooltip title={info.langTitle}>
                                  <Typography variant="h4">{info.language} 건</Typography>
                                </Tooltip>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={11} sx={{ mt: '20px', ml: '30px' }}>
                      <Stack direction={'row'}>
                        <AssignmentIndOutlinedIcon />
                        <Typography variant="h3" sx={{ mb: '10px', ml: '4px' }}>
                          자기소개서 분석
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item container sx={{ ml: '50px' }}>
                      <Grid item xs={6}>
                        <ReactWordcloud words={cloud} callbacks={callbacks} options={options} size={size} />
                      </Grid>
                      <Grid item xs={6} sx={{ pl: '55px' }}>
                        <Typography variant="h3">키워드 분석</Typography>
                        <Grid
                          container
                          sx={{
                            mt: '10px',
                            width: '420px',
                            height: '270px',
                            background: 'rgba(245, 245, 245, 0.1)',
                            border: '1px solid rgba(245, 245, 245, 1)',
                            pt: '10px',
                            pl: '10px'
                          }}
                        >
                          <Grid item container xs={6} direction={'column'}>
                            <Grid item sx={{ mb: '15px' }}>
                              <Typography variant="h4">가장 많이 쓰인 단어 Top 7</Typography>
                            </Grid>
                            {swords &&
                              swords.top5words?.map((item, index) => {
                                return (
                                  <Grid item key={index} sx={{ display: 'flex', mb: '5px', ml: '5px' }}>
                                    <Typography
                                      variant="h4"
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        width: '35px',
                                        height: '25px',
                                        alignItems: 'center',
                                        mr: '10px',
                                        background: index < 3 ? '#38678f' : '#f1f2f3',
                                        color: index < 3 ? 'white' : 'black'
                                      }}
                                    >
                                      {`${index + 1}위`}
                                    </Typography>
                                    <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
                                      {item.text} ({item.value}회)
                                    </Typography>
                                  </Grid>
                                );
                              })}
                          </Grid>
                          <Grid item container xs={6} direction={'column'} sx={{ pl: '15px' }}>
                            <Grid item sx={{ mb: '15px' }}>
                              <Typography variant="h4">우리 회사 키워드와 비교</Typography>
                            </Grid>
                            {swords &&
                              swords.matchWords &&
                              keywords.map((word, index) => {
                                const matchingText = swords.matchWords.map((matchWord) => matchWord.text);
                                const count = swords.matchWords.map((matchWord) => matchWord.value);
                                const isMatch = matchingText.includes(word);
                                return (
                                  <Grid item key={index} sx={{ mb: '5px', display: 'flex', ml: '5px' }}>
                                    <Typography
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        background: isMatch ? '#38678f' : '#f1f2f3',
                                        color: isMatch ? 'white' : 'black',
                                        width: '40px',
                                        height: '25px'
                                      }}
                                      variant="h4"
                                    >
                                      {word}
                                    </Typography>
                                    <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
                                      &nbsp;&nbsp;
                                      <span
                                        style={{
                                          color: isMatch ? '#5092E2' : '#EC5C87'
                                        }}
                                      >
                                        {isMatch ? '일치' : '불일치'} ({isMatch ? `${count[index]}회` : ''})
                                      </span>
                                    </Typography>
                                  </Grid>
                                );
                              })}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </CustomTabPanel>
              <CustomTabPanel value={tabValue} index={1}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', pr: '10px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                      onClick={() => {
                        sort.cvToExcel([applicantInfo.apply_no]);
                      }}
                      variant="contained"
                      size="medium"
                      style={{ marginRight: '5px', borderColor: '#38678f', background: '#38678f' }}
                    >
                      <SaveAsOutlinedIcon />
                      엑셀로 저장
                    </Button>
                    <Button onClick={handlePrint} variant="outlined" size="medium" style={{ borderColor: '#38678f', color: '#38678f' }}>
                      <PrintIcon />
                      인쇄하기
                    </Button>
                  </Box>
                </Box>
                <ApplicantCV applicantInfo={applicantInfo} ref={componentRef} />
                <Box>
                  <Typography variant="h3" sx={{ mb: '10px', mt: '10px' }}>
                    첨부파일
                  </Typography>
                  <Divider sx={{ mb: '15px' }} />
                  <Grid container sx={{ minHeight: '300px' }}>
                    {applicantInfo['cv']?.['cvFiles']?.map((file, idx) => {
                      if (file.type == 'Portfolio') {
                        return (
                          <Grid item container xs={4} key={idx} direction={'column'}>
                            <Grid item xs={1} sx={{ pl: '15px' }}>
                              <Typography variant="h4">포트폴리오</Typography>
                            </Grid>
                            <Grid item xs={9} sx={{ pl: '30px', pt: '10px' }}>
                              ㅇㅇㅇㅇㅇ
                            </Grid>
                            <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-end', pr: '15px' }}>
                              <Button
                                onClick={() => {
                                  handleDownload('Portfolio');
                                }}
                                variant="contained"
                                size="medium"
                                style={{ marginRight: '5px', borderColor: '#38678f', background: '#38678f' }}
                              >
                                다운로드
                              </Button>
                            </Grid>
                            <Divider orientation="vertical" sx={{ width: '10px' }} />
                          </Grid>
                        );
                      } else if (file.type == 'etcDocs') {
                        return (
                          <Grid item container xs={4} key={idx} direction={'column'}>
                            <Grid item xs={1} sx={{ pl: '15px' }}>
                              <Typography variant="h4">기타</Typography>
                            </Grid>
                            <Grid item xs={10} sx={{ pl: '20px' }}>
                              ㅇㅇㅇㅇㅇ
                            </Grid>
                            <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'flex-end', pr: '15px' }}>
                              <Button
                                onClick={() => {
                                  handleDownload('etcDocs');
                                }}
                                variant="contained"
                                size="medium"
                                style={{ marginRight: '5px', borderColor: '#38678f', background: '#38678f' }}
                              >
                                다운로드
                              </Button>
                            </Grid>
                            <Divider orientation="vertical" sx={{ width: '10px' }} />
                          </Grid>
                        );
                      } else if (file.type == 'Statement') {
                        return (
                          <Grid item container xs={4} key={idx} direction={'column'}>
                            <Grid item xs={1} sx={{ pl: '15px' }}>
                              <Typography variant="h4">자기소개서</Typography>
                            </Grid>
                            <Grid item xs={10} sx={{ pl: '20px' }}>
                              ㅇㅇㅇㅇㅇ
                            </Grid>
                            <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'flex-end', pr: '15px' }}>
                              <Button
                                onClick={() => {
                                  handleDownload('Statement');
                                }}
                                variant="contained"
                                size="medium"
                                style={{ marginRight: '5px', borderColor: '#38678f', background: '#38678f' }}
                              >
                                다운로드
                              </Button>
                            </Grid>
                            <Divider orientation="vertical" sx={{ width: '10px' }} />
                          </Grid>
                        );
                      } else if (file.type == 'Career') {
                        return (
                          <Grid item container xs={4} key={idx} direction={'column'}>
                            <Grid item xs={1} sx={{ pl: '15px' }}>
                              <Typography variant="h4">경력기술서</Typography>
                            </Grid>
                            <Grid item xs={10} sx={{ pl: '20px' }}>
                              ㅇㅇㅇㅇㅇ
                            </Grid>
                            <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'flex-end', pr: '15px' }}>
                              <Button
                                onClick={() => {
                                  handleDownload('Career');
                                }}
                                variant="contained"
                                size="medium"
                                style={{ marginRight: '5px', borderColor: '#38678f', background: '#38678f' }}
                              >
                                다운로드
                              </Button>
                            </Grid>
                            <Divider orientation="vertical" sx={{ width: '10px' }} />
                          </Grid>
                        );
                      }
                    })}
                  </Grid>
                </Box>
              </CustomTabPanel>
              <CustomTabPanel value={tabValue} index={2}>
                <ApplicantExam />
              </CustomTabPanel>
              <CustomTabPanel value={tabValue} index={3}>
                {applicantInfo.evals != null && (
                  <Grid
                    container
                    direction={'column'}
                    sx={{
                      mt: '20px',
                      filter: applicantInfo.evals[0] == null ? 'blur(10px)' : null,
                      pointerEvents: applicantInfo.evals[0] == null ? 'none' : null
                    }}
                  >
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
                {!hasEval && (
                  <Box sx={{ zIndex: 20, mt: '-60px', ml: '450px' }}>
                    <Typography variant="h3">평가 완료 후 조회 가능합니다.</Typography>
                  </Box>
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
                  justifyContent: 'space-between',
                  display: 'flex',
                  marginTop: '15px',
                  marginBottom: '10px'
                }}
              >
                <Button
                  value={'-'}
                  onClick={(event) => {
                    handleOnClick(event, '-');
                  }}
                  sx={{ color: '#38678f' }}
                >
                  <ChevronLeftIcon />
                </Button>
                <Box sx={{ display: 'flex' }}>
                  <Button onClick={(event) => handleBtnClick(event, 'pass')} sx={{ color: '#38678f', mr: '5px' }}>
                    합격대기
                  </Button>
                  <span style={{ display: 'flex', alignItems: 'center' }}>|</span>
                  <Button onClick={(event) => handleBtnClick(event, 'fail')} sx={{ color: '#38678f', ml: '5px' }}>
                    불합격대기
                  </Button>
                </Box>
                <Button
                  sx={{ color: '#38678f' }}
                  value={'+'}
                  onClick={(event) => {
                    handleOnClick(event, '+');
                  }}
                >
                  <ChevronRightIcon />
                </Button>
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
                '& .MuiRating-root': { ml: '10px' },
                '& .MuiBox-root': { display: 'flex', alignItems: 'end', justifyContent: 'space-between' },
                '& .MuiFormControl-root': { mr: '10px' },
                ml: '20px',
                mt: '5px',
                filter: applicantInfo.applicant_status == 'final' ? (hasEval ? 'blur(10px)' : null) : 'blur(10px)',
                pointerEvents: applicantInfo.applicant_status == 'final' ? (hasEval ? 'none' : null) : 'none'
              }}
            >
              <Grid item sx={{ mb: '10px', display: 'flex', alignItems: 'center' }}>
                <RateReviewOutlinedIcon sx={{ mt: '4px' }} />
                <Typography variant="h4">면접평가 등록</Typography>
              </Grid>
              {evalSub.map((row, index) => {
                const subKey = 'sub' + (index + 1);
                return (
                  <Grid item key={index} sx={{ ml: '20px' }}>
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
                        sx={{ ml: '20px' }}
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
              <Grid item sx={{ ml: '20px' }}>
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
            {applicantInfo['evals']?.map((ev, i) => {
              if (ev.user_id == userInfo.user_id) {
                return (
                  <Box key={i} sx={{ zIndex: 10, mt: '-380px', ml: '160px' }}>
                    <Typography variant="h3">평가 완료</Typography>
                  </Box>
                );
              }
            })}
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

const callbacks = {
  getWordColor: (word) =>
    word.value > 5
      ? '#38678f'
      : word.value > 4
      ? '#699BC4'
      : word.value > 3
      ? '#4682B4'
      : word.value > 2
      ? '#90CAF9'
      : 'rgba(163, 164, 165, 1)'
};
const options = {
  rotations: 0,
  rotationAngles: [-90, 0],
  fontSizes: [15, 50]
};
const size = [580, 350];

const chartOptions = {
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: {
        usePointStyle: true
      }
    }
  }
};

const keywords = ['도전', '열정', '소통', '화합', '책임', '신뢰'];

export default ApplicantDetailPage;
