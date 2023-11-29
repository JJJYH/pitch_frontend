import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import styled from 'styled-components';
import { sort } from '../../api.js';
import { evalSub, getFormattedDate, getAge, getImage } from './sorts.js';
import { useReactToPrint } from 'react-to-print';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import ReactWordcloud from 'react-wordcloud';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip as TT,
  Legend
} from 'chart.js';
import { Radar, Line } from 'react-chartjs-2';

/* mui components */
import SensorOccupiedOutlinedIcon from '@mui/icons-material/SensorOccupiedOutlined';
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import { Box, Grid, InputAdornment, Rating, TextField, Tooltip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import PrintIcon from '@mui/icons-material/Print';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import FilePresentOutlinedIcon from '@mui/icons-material/FilePresentOutlined';
import { AvatarGroup, Button, Card, CardContent, Chip, Divider, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import AddchartIcon from '@mui/icons-material/Addchart';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SaveAsOutlinedIcon from '@mui/icons-material/SaveAsOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import DonutSmallRoundedIcon from '@mui/icons-material/DonutSmallRounded';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';

/* custom components */
import ApplicantCV from './components/ApplicantCV.js';
import { useSnackbar } from 'notistack';
import SampleGraph from 'assets/images/sample.gif';

/*
 *
 * 지원자 상세 페이지
 * url : manage/posts/:job_posting_no/sort/:apply_no/
 *
 */

ChartJS.register(Title, CategoryScale, LinearScale, RadialLinearScale, PointElement, LineElement, Filler, TT, Legend);

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
  const [isMatchFetched, setIsMatchFetched] = useState(false);
  const [isKeywordFetched, setIsKeywordFetched] = useState(false);
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
  const [matches, setMatches] = useState({
    isSkillMatch: false,
    isQualMatch: false,
    skillMatchRate: 0,
    skill: 0,
    isFetched: false
  });
  const [keywordMatches, setKeywordMatches] = useState({
    isKeywordMatch: false,
    keywordMatchRate: 0,
    isFetched: false
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

  const handleCVDownload = (apply_no) => {
    sort.cvToExcel(apply_no).then((res) => {
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '입사지원서(' + applicantInfo.cv.user_nm + ')';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  };

  const handleDownload = (type) => {
    const data = {
      type: [type],
      applyNo: [apply_no]
    };
    const name =
      type == 'etcDocs'
        ? '기타문서'
        : type == 'Portfolio'
        ? '포트폴리오'
        : type == 'Career'
        ? '경력기술서'
        : type == 'Statement'
        ? '자기소개서'
        : '';

    const fileType = applicantInfo.cv.cvFiles
      .filter((file) => file.type == type)
      .map((file) => {
        return file.file_type;
      });

    sort
      .fileDownload(data)
      .then((res) => {
        if (res.status === 200) {
          const blob = new Blob([res.data]);

          return { blob };
        } else {
          console.error('파일 다운로드 실패');
          throw new Error('파일 다운로드 실패');
        }
      })
      .then(({ blob }) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name}(${applicantInfo.cv.user_nm}).${fileType}`;
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

    sort.readStatus(posting.list[index].apply_no);
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
      const rate = Math.round((matchWords.length / 6) * 100);

      setKeywordMatches({
        isKeywordMatch: rate >= 50 ? true : false,
        keywordMatchRate: rate,
        isFetched: true
      });
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
      const text = posting.preferred;

      const regex = /([a-zA-Z\s/]+)/g;
      let skills = [];
      let match;

      while ((match = regex.exec(text)) !== null) {
        const skill = match[1]
          .trim()
          .split(/[,\s]/)
          .filter((word) => word.length > 0);
        skills = [...new Set([...skills, ...skill])];
      }

      const cvSkills = resp.data.cv.skills;
      const matchingSkills = cvSkills.filter((skill) => skills.includes(skill.skill_name));
      let matchPercentage = 0;
      if (matchingSkills.length !== 0) {
        matchPercentage = Math.round((matchingSkills.length / skills.length) * 100);
      }
      setMatches({
        isQualMatch: true,
        isSkillMatch: matchPercentage >= 50 ? true : false,
        skillMatchRate: matchPercentage,
        skill: cvSkills.length,
        isFetched: true
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

  useEffect(() => {
    if (matches.isFetched) {
      setIsMatchFetched(true);
    }
  }, [matches]);
  useEffect(() => {
    if (keywordMatches.isFetched) {
      setIsKeywordFetched(true);
    }
  }, [keywordMatches]);
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
                    <Typography variant="h4">{`만 ${getAge(applicantInfo['cv']?.['user_birth'])}세 (${getFormattedDate(
                      applicantInfo['cv']?.['user_birth']
                    )})`}</Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h4">{applicantInfo['cv']?.['careers'] ? '경력' : '신입'}</Typography>
                  </Grid>
                  <Grid item xs>
                    <Stack direction="row" spacing={1}>
                      <Chip label={isMatchFetched ? '💎지원자격 일치' : '💔지원자격 불일치'} variant="outlined" size="small" />
                      <Chip
                        label={isMatchFetched && (matches.isSkillMatch ? '💎공고스킬 일치' : '💔공고스킬 불일치')}
                        variant="outlined"
                        size="small"
                      />
                      {isKeywordFetched && (
                        <Chip label={keywordMatches.isKeywordMatch ? '💎키워드 일치' : '💔키워드 불일치'} variant="outlined" size="small" />
                      )}
                      {applicantInfo.applicant_status == 'final' && (
                        <Chip
                          label={jobs.some((item) => item.includes('개발')) ? '💎적성 일치' : '💔적성 불일치'}
                          variant="outlined"
                          size="small"
                        />
                      )}
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
                        applicantInfo.applicant_status == 'final' || applicantInfo.applicant_status == 'finished' ? '450px' : '250px'
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
                        label={<Typography variant="h4">지원자분석</Typography>}
                        {...a11yProps(0)}
                        sx={{
                          color: '#38678f',
                          '&.Mui-selected': {
                            color: 'rgba(56, 103, 143, 1)'
                          }
                        }}
                      />
                      <Tab
                        label={<Typography variant="h4">입사지원서</Typography>}
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
                          label={<Typography variant="h4">인적성검사</Typography>}
                          {...a11yProps(0)}
                          sx={{
                            color: '#38678f',
                            '&.Mui-selected': {
                              color: 'rgba(56, 103, 143, 1)'
                            }
                          }}
                        />
                      )}
                      {(applicantInfo.applicant_status == 'final' || applicantInfo.applicant_status == 'finished') && (
                        <Tab
                          label={<Typography variant="h4">면접평가</Typography>}
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
                        <Typography
                          sx={{ cursor: 'pointer', color: 'rgba(163, 164, 165, 1)', ml: '60px', mr: '10px' }}
                          variant="h4"
                          onClick={() => {
                            const type =
                              applicantInfo.applicant_status == 'first' ? 'F' : applicantInfo.applicant_status == 'final' ? 'FL' : 'FH';
                            navigate(`/manage/posts/${job_posting_no}/sort`, {
                              state: { type }
                            });
                          }}
                        >
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
                              <Grid container sx={{ mt: '5px', ml: '10px' }}>
                                <Grid item container xs={6} direction={'column'} sx={{ pl: '20px' }} spacing={1}>
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
                                <Grid item container xs={6} direction={'column'} spacing={1}>
                                  <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Typography variant="h4">
                                      {score.advantage_score} 점 ({score.advantage_rank} 위 / 전체 {score.applicant_count}명)
                                    </Typography>
                                  </Grid>
                                  <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Typography variant="h4">
                                      {score.career_score} 점 ({score.career_rank} 위 / 전체 {score.applicant_count}명)
                                    </Typography>
                                  </Grid>
                                  <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Typography variant="h4">
                                      {score.certification_score} 점 ({score.certification_rank} 위 / 전체 {score.applicant_count}명)
                                    </Typography>
                                  </Grid>
                                  <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Typography variant="h4">
                                      {score.language_score} 점 ({score.language_rank} 위 / 전체 {score.applicant_count}명)
                                    </Typography>
                                  </Grid>
                                  <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Typography variant="h4">
                                      {score.education_score} 점 ({score.education_rank} 위 / 전체 {score.applicant_count}명)
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
                    <Grid item sx={{ display: 'flex', mb: '30px' }}>
                      <Box sx={{ width: '50%', height: '350px' }}>
                        {isChartFetched && <Radar data={chartData} options={chartOptions} />}
                      </Box>
                      <Box sx={{ ml: '80px' }}>
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
                                        {isMatch ? '일치' : '불일치'} {isMatch ? `(${count[index]}회)` : ''}
                                      </span>
                                    </Typography>
                                  </Grid>
                                );
                              })}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    {applicantInfo.applicant_status == 'final' && (
                      <>
                        <Grid item xs={11} sx={{ mt: '20px', ml: '30px' }}>
                          <Stack direction={'row'}>
                            <SensorOccupiedOutlinedIcon />
                            <Typography variant="h3" sx={{ mb: '10px', ml: '4px' }}>
                              인적성검사 분석
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={11} sx={{ mt: '20px', ml: '30px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: '20px' }}>
                            <FiberManualRecordRoundedIcon sx={{ color: 'rgb(56, 103, 143)', fontSize: '10px' }} />
                            <Typography variant="h4">직업 흥미검사 결과</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={11} sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Box sx={{ width: '50%', height: '300px', margin: '30px 0px' }}>
                            <Radar data={testData} options={testOptions} />
                          </Box>
                        </Grid>
                        <Grid item xs={11} sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Box sx={{ margin: '30px 30px' }}>
                            <Typography variant="h4">
                              [{applicantInfo['cv']?.user_nm}] 님의 대표 흥미 코드는
                              <b style={{ color: 'rgb(56, 103, 143)' }}> {'SA'} </b>
                              입니다.
                            </Typography>
                            <table
                              border={1}
                              style={{
                                textAlign: 'center',
                                width: '95%',
                                border: '1px solid grey',
                                borderCollapse: 'collapse',
                                marginTop: '5px'
                              }}
                            >
                              <tbody>
                                <tr>
                                  <td rowSpan={2} style={{ padding: '10px 20px', width: '10%' }}>
                                    <b style={{ color: 'rgb(56, 103, 143)' }}>사회형(S)</b>
                                  </td>
                                  <td style={{ padding: '10px 20px', textAlign: 'start', width: '40%' }}>
                                    사회형 점수가 높은 사람은 사람들과 교류하고 협력하는 일을 좋아합니다.
                                  </td>
                                  <td rowSpan={2} style={{ padding: '10px 20px', width: '10%' }}>
                                    <b style={{ color: 'rgb(56, 103, 143)' }}>예술형(A)</b>
                                  </td>
                                  <td style={{ padding: '10px 20px', textAlign: 'start', width: '40%' }}>
                                    예술형 점수가 높은 사람은 창의적이고 변화를 추구하는 일을 좋아합니다.
                                  </td>
                                </tr>
                                <tr>
                                  <td style={{ padding: '10px 20px', textAlign: 'start' }}>
                                    타인의 문제를 듣고 공감하고, 도와주고, 치료해주는 것을 선호하며 사람을 상대하는 활동에 능숙합니다.
                                    일반적으로 이타적이며 자애롭고 배려심이 깊은 인물로 평가를 받습니다. 사물을 지향하기 보다는 사람과 사람
                                    사이의 관계에 주목하는 경향이 강하여, 다른 사람들에게 어떤 사실을 가르쳐주고 도와주거나 지원해주는
                                    활동을 좋아합니다.
                                  </td>
                                  <td style={{ padding: '10px 20px', textAlign: 'start' }}>
                                    창의적이고 유연한 사고를 즐겨하며 아름다움을 추구하는 경향이 강합니다. 틀에 박힌 일이나 같은 패턴의 일,
                                    변화가 없이 틀에 맞추어 해야 하는 일을 별로 좋아하지 않습니다. 같은 사물이나 현상을 보고도 획일적으로
                                    판단하지 않으며 상상력이 풍부하고 독창적인 편입니다. 예술적 감수성이 뛰어나고 능력을 발휘하며 즐기는
                                    반면, 명확하고 규칙적인 활동이나 객관적 사실을 추구하는 활동에는 약한 편입니다. 개방적인 사고체계를
                                    소유하고 있어 변화를 주도하고 추구하며 자신의 직감에 의존하여 문제를 해결하려는 경향도 있습니다.
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </Box>
                        </Grid>
                        <Grid item xs={11}>
                          <Box sx={{ margin: '0px 30px' }}>
                            <Typography variant="h4">[{applicantInfo['cv']?.user_nm}] 님에게 적합한 직업</Typography>
                          </Box>
                          <table
                            border={1}
                            style={{
                              textAlign: 'center',
                              width: '90%',
                              border: '1px solid grey',
                              borderCollapse: 'collapse',
                              marginTop: '5px',
                              marginLeft: '30px'
                            }}
                          >
                            <tr style={{ height: '50px', background: '#f5f5f5' }}>
                              <td>
                                <b style={{ fontSize: '15px' }}>나의 직업흥미 특성과 잘 어울리는 직업</b>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ padding: '10px 10px' }}>{jobs.map((j) => j + ', ')}</td>
                            </tr>
                          </table>
                        </Grid>
                        <Grid item xs={11} sx={{ mt: '20px', ml: '30px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: '20px' }}>
                            <FiberManualRecordRoundedIcon sx={{ color: 'rgb(56, 103, 143)', fontSize: '10px' }} />
                            <Typography variant="h4">성격 5요인별 점수</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={11} sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Box sx={{ width: '50%', height: '300px', margin: '30px 0px' }}>
                            <Line data={dataLine} options={OptionsLine} />
                          </Box>
                        </Grid>
                        <Grid item xs={11} sx={{ ml: '30px' }}>
                          <table
                            border={1}
                            style={{
                              textAlign: 'center',
                              width: '92%',
                              border: '1px solid grey',
                              borderCollapse: 'collapse',
                              marginTop: '5px'
                            }}
                          >
                            <thead>
                              <tr style={{ height: '50px', background: '#f5f5f5' }}>
                                <th style={{ fontSize: '15px', width: '20%' }}>
                                  <b>외향성</b>
                                </th>
                                <th style={{ fontSize: '15px', width: '20%' }}>
                                  <b>호감성</b>
                                </th>
                                <th style={{ fontSize: '15px', width: '20%' }}>
                                  <b>성실성</b>
                                </th>
                                <th style={{ fontSize: '15px', width: '20%' }}>
                                  <b>정서적 불안정성</b>
                                </th>
                                <th style={{ fontSize: '15px', width: '20%' }}>
                                  <b>경험에대한 개방성</b>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{ height: '60px' }}>
                                {tData.lData.map((l, i) => {
                                  return (
                                    <td key={i} style={{ fontSize: ' 15px' }}>
                                      {l}
                                    </td>
                                  );
                                })}
                              </tr>
                            </tbody>
                          </table>
                        </Grid>
                      </>
                    )}
                    <Grid item xs={11} sx={{ mt: '50px', ml: '30px' }}>
                      <Stack direction={'row'}>
                        <LocalOfferOutlinedIcon />
                        <Typography variant="h3" sx={{ mb: '10px', ml: '4px' }}>
                          매칭 태그
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item container direction={'column'}>
                      <Grid item container sx={{ height: '200px' }}>
                        <Grid
                          item
                          xs={6}
                          sx={{
                            padding: '20px 15px 20px 50px'
                          }}
                        >
                          <Box
                            sx={{
                              height: '100%',
                              width: '100%',
                              border: `solid 1px rgba(245, 245, 245, 1)`,
                              background: 'rgba(245, 245, 245, 0.1)'
                            }}
                          >
                            <Box sx={{ height: '40px', display: 'flex', justifyContent: 'space-between' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', ml: '20px' }}>
                                <Typography variant="h3"># 지원자격 {isMatchFetched ? '일치' : '불일치'}</Typography>
                              </Box>
                              <Box
                                sx={{
                                  width: '40px',
                                  border: `solid 1px rgba(245, 245, 245, 1)`,
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  borderTop: 'none',
                                  borderRight: 'none'
                                }}
                              >
                                <Typography variant="h2" sx={{ textAlign: 'center' }}>
                                  {isMatchFetched ? '💎' : '💔'}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ ml: '35px', mt: '15px' }}>
                              <Typography variant="h5">
                                공고에 지정한 조건과 구직자의 조건이{isMatchFetched ? ' 모두 일치합니다.' : ' 일치하지 않습니다.'}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sx={{ padding: '20px 50px 20px 15px' }}>
                          <Box
                            sx={{
                              height: '100%',
                              width: '100%',
                              border: `solid 1px rgba(245, 245, 245, 1)`,
                              background: 'rgba(245, 245, 245, 0.1)'
                            }}
                          >
                            <Box sx={{ height: '40px', display: 'flex', justifyContent: 'space-between' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', ml: '20px' }}>
                                <Typography variant="h3">
                                  # 공고스킬 {isMatchFetched && (matches.isSkillMatch ? '일치' : '불일치')}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  width: '40px',
                                  border: `solid 1px rgba(245, 245, 245, 1)`,
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  borderTop: 'none',
                                  borderRight: 'none'
                                }}
                              >
                                <Typography variant="h2" sx={{ textAlign: 'center' }}>
                                  {isMatchFetched ? (matches.isSkillMatch ? '💎' : '💔') : ''}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ ml: '35px', mt: '15px' }}>
                              <Typography variant="h5">
                                {isMatchFetched
                                  ? `지원자의 보유 스킬은 [${matches.skill}]개로 공고 스킬과 일치도는 [${matches.skillMatchRate}%]입니다.`
                                  : ''}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid item container sx={{ height: '200px' }}>
                        <Grid item xs={6} sx={{ padding: '20px 15px 20px 50px' }}>
                          <Box
                            sx={{
                              height: '100%',
                              width: '100%',
                              border: `solid 1px rgba(245, 245, 245, 1)`,
                              background: 'rgba(245, 245, 245, 0.1)'
                            }}
                          >
                            <Box sx={{ height: '40px', display: 'flex', justifyContent: 'space-between' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', ml: '20px' }}>
                                <Typography variant="h3"># 키워드 {keywordMatches.isKeywordMatch ? '일치' : '불일치'}</Typography>
                              </Box>
                              <Box
                                sx={{
                                  width: '40px',
                                  border: `solid 1px rgba(245, 245, 245, 1)`,
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  borderTop: 'none',
                                  borderRight: 'none'
                                }}
                              >
                                <Typography variant="h2" sx={{ textAlign: 'center' }}>
                                  {keywordMatches.isKeywordMatch ? '💎' : '💔'}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ ml: '35px', mt: '15px' }}>
                              <Typography variant="h5">
                                지원자의 자기소개서와 우리 회사의 핵심 키워드 일치도는 [{keywordMatches.keywordMatchRate}%]입니다.
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        {applicantInfo.applicant_status == 'final' && (
                          <Grid item xs={6} sx={{ padding: '20px 50px 20px 15px' }}>
                            <Box
                              sx={{
                                height: '100%',
                                width: '100%',
                                border: `solid 1px rgba(245, 245, 245, 1)`,
                                background: 'rgba(245, 245, 245, 0.1)'
                              }}
                            >
                              <Box sx={{ height: '40px', display: 'flex', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', ml: '20px' }}>
                                  <Typography variant="h3">
                                    # 적성 {jobs.some((item) => item.includes('개발')) ? '일치' : '불일치'}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    width: '40px',
                                    border: `solid 1px rgba(245, 245, 245, 1)`,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderTop: 'none',
                                    borderRight: 'none'
                                  }}
                                >
                                  <Typography variant="h2" sx={{ textAlign: 'center' }}>
                                    {jobs.some((item) => item.includes('개발')) ? '💎' : '💔'}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box sx={{ ml: '35px', mt: '15px' }}>
                                <Typography variant="h5">
                                  공고의 직무와 구직자의 적성이
                                  {jobs.some((item) => item.includes('개발')) ? ' 일치합니다' : ' 일치하지 않습니다.'}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        )}
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
                        handleCVDownload([applicantInfo.apply_no]);
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
                  <Box sx={{ height: '300px', display: 'flex' }}>
                    {applicantInfo['cv']?.['cvFiles']?.map((file, idx) => {
                      let name = '';

                      if (file.type == 'Portfolio') {
                        name = '포트폴리오';
                      } else if (file.type == 'etcDocs') {
                        name = '기타문서';
                      } else if (file.type == 'Statement') {
                        name = '자기소개서';
                      } else if (file.type == 'Career') {
                        name = '경력기술서';
                      }
                      return name ? (
                        <>
                          <Box sx={{ width: '245px' }} key={idx}>
                            <Typography variant="h4" sx={{ pl: '15px' }}>
                              {name}
                            </Typography>
                            <Box item xs={9} sx={{ mt: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <FilePresentOutlinedIcon sx={{ fontSize: '120px' }} />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '60px', pr: '15px' }}>
                              <Button
                                onClick={() => {
                                  handleDownload(file.type);
                                }}
                                variant="contained"
                                size="medium"
                                style={{ marginRight: '5px', borderColor: '#38678f', background: '#38678f' }}
                              >
                                다운로드
                              </Button>
                            </Box>
                          </Box>
                          <Divider orientation="vertical" sx={{ width: '10px' }} />
                        </>
                      ) : null;
                    })}
                  </Box>
                </Box>
              </CustomTabPanel>
              <CustomTabPanel value={tabValue} index={2}>
                <Box sx={{ margin: '20px 30px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PsychologyAltIcon fontSize="large" />
                    <Typography style={{ fontSize: '18px' }}>
                      [<b>{applicantInfo['cv']?.user_nm}</b>] 님의 워크넷 직업선호도검사 (L형) 결과
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: '50px', ml: '15px' }}>
                    <DonutSmallRoundedIcon />
                    <Typography variant="h3">직업선호도검사(L형) 결과</Typography>
                  </Box>
                  <Box sx={{ ml: '30px', mt: '40px', mr: '30px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                      <FiberManualRecordRoundedIcon sx={{ color: 'rgb(56, 103, 143)', fontSize: '10px' }} />
                      <Typography variant="h4">직업선호도검사(L형) 구성</Typography>
                    </Box>
                    <Typography>
                      직업선호도검사(L형)은 개인의 관심과 흥미, 성향 그리고 생활경험을 측정하여 적합한 직업을 안내하는 검사입니다.
                      직업선호도검사(L형)은 다음 세 부분으로 구성되어 있습니다.
                    </Typography>
                    <Typography variant="h4" sx={{ mt: '15px' }}>
                      흥미검사
                    </Typography>
                    <Typography>
                      흥미검사는 다양한 분야에 대한 개인의 흥미를 측정하는 검사로 개인의 흥미특성을 6가지 유형으로 구분하여 흥미특성에
                      적합한 직업분야를 안내합니다.
                    </Typography>
                    <Typography variant="h4" sx={{ mt: '15px' }}>
                      성격검사
                    </Typography>
                    <Typography>
                      성격검사는 일상생활 속에서 나타나는 개인의 성향을 측정하는 검사로 5가지 요인에서의 성격특성과 세부적으로 28개
                      하위요인에서의 개인 성격특성을 알 수 있습니다.
                    </Typography>
                    <Typography variant="h4" sx={{ mt: '15px' }}>
                      생활사검사
                    </Typography>
                    <Typography>
                      생활사검사는 과거의 다양한 생활경험을 측정하여 개인을 이해하도록 돕는 검사로 9개 생활경험 요인에서의 개인 특성을
                      설명합니다.
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: '40px', mb: '10px' }}>
                      <FiberManualRecordRoundedIcon sx={{ color: 'rgb(56, 103, 143)', fontSize: '10px' }} />
                      <Typography variant="h4">직업선호도검사(L형) 길잡이</Typography>
                    </Box>
                    <Typography>
                      직업선호도검사는 개인의 현재 보유능력이나 학력, 전공, 자격, 가치관 등은 반영하지 않고 오로지 흥미성향과 성격, 생활사
                      등에 관련한 정보만을 제공합니다.
                    </Typography>
                    <Typography>
                      따라서 검사결과를 토대로 직업이나 진로를 결정하고자 하실 때에는 검사결과에 반영되지 않은 자신의 능력, 자격, 적성,
                      가치관 등을 함께 고려하실 필요가 있습니다.
                    </Typography>
                    <Typography>
                      이 검사의 결과는 개인이 직업이나 직무를 선택할 때 참조자료로 활용할 수 있으며, 또한 자기소개서 작성이나 면접준비시
                      자신을 객관적이고 구체적으로 소개하기 위한 기초자료로 활용할 수 있습니다.
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: '40px', mb: '10px' }}>
                      <FiberManualRecordRoundedIcon sx={{ color: 'rgb(56, 103, 143)', fontSize: '10px' }} />
                      <Typography variant="h4">검사결과 바르게 읽기</Typography>
                    </Box>
                    <Typography>직업선호도검사는 원점수와 표준점수라는 두 가지 검사 점수를 사용합니다.</Typography>
                    <table border={1} style={{ border: '1px solid grey', borderCollapse: 'collapse', marginTop: '15px' }}>
                      <thead>
                        <tr style={{ height: '40px', background: '#f5f5f5' }}>
                          <th style={{ fontSize: '15px' }}>
                            <b>원점수(row scores)</b>
                          </th>
                          <th style={{ fontSize: '15px' }}>
                            <b>표준점수(standard scores)</b>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ height: '60px' }}>
                          <td>일반적으로 결과해석에 편리하도록 점수전환을 하게 되는데 원점수란 전환을 위한 기초 점수 입니다.</td>
                          <td>타인과의 비교를 위해 원점수를 해석하기 편리하게 전환한 검사점수 입니다.</td>
                        </tr>
                      </tbody>
                    </table>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: '40px', mb: '10px' }}>
                      <FiberManualRecordRoundedIcon sx={{ color: 'rgb(56, 103, 143)', fontSize: '10px' }} />
                      <Typography variant="h4">표준점수분포와 점수의 의미</Typography>
                    </Box>
                    <Typography>
                      표준점수를 의미있게 해석하기 위해서는 다음의 표준점수 분포를 참고하면 됩니다. 당신의 점수가 분포의 어느 위치에
                      놓이는지 표시해가며 점수의 의미를 살펴보시기 바랍니다.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <img src={SampleGraph} alt="표준점수 설명" style={{ mt: '15px' }} />
                    </Box>
                    <table
                      border={1}
                      style={{
                        width: '100%',
                        textAlign: 'center',
                        border: '1px solid grey',
                        borderCollapse: 'collapse',
                        marginTop: '40px'
                      }}
                    >
                      <tbody>
                        <tr style={{ height: '60px' }}>
                          <td style={{ background: '#f5f5f5' }}>
                            <b>표준점수종합</b>
                          </td>
                          <td>40점 이하</td>
                          <td>41-59점</td>
                          <td>60점 이상</td>
                        </tr>
                        <tr style={{ height: '60px' }}>
                          <td style={{ background: '#f5f5f5' }}>
                            <b>백분점수</b>
                          </td>
                          <td>16점 이하</td>
                          <td>17-83점</td>
                          <td>84점 이상</td>
                        </tr>
                        <tr style={{ height: '60px' }}>
                          <td style={{ background: '#f5f5f5' }}>
                            <b>점수의미</b>
                          </td>
                          <td>대체로 낮은 점수</td>
                          <td>중간점수</td>
                          <td>대체로 높은 점수</td>
                        </tr>
                      </tbody>
                    </table>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: '50px', ml: '15px' }}>
                    <DonutSmallRoundedIcon />
                    <Typography variant="h3">직업흥미검사결과</Typography>
                  </Box>
                  <Box sx={{ ml: '30px', mt: '20px', mr: '30px' }}>
                    <Typography>
                      {applicantInfo['cv']?.user_nm}님의 대표 흥미 코드는 {'SA'} 입니다.
                    </Typography>
                  </Box>
                  <Box sx={{ ml: '30px', mt: '20px', mr: '30px', border: '1px solid grey', display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ width: '800px', height: '300px', margin: '30px 0px' }}>
                      <Radar data={testData} options={testOptions} />
                    </Box>
                  </Box>
                  <Box sx={{ ml: '30px', mt: '50px', mr: '30px', mb: '15px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: '30px' }}>
                      <FiberManualRecordRoundedIcon sx={{ color: 'rgb(56, 103, 143)', fontSize: '10px' }} />
                      <Typography variant="h4">직업 흥미 유형별 점수에 대한 표로 흥미코드와 원점수, 표준점수 제공</Typography>
                    </Box>
                    <table
                      border={1}
                      style={{
                        textAlign: 'center',
                        width: '100%',
                        border: '1px solid grey',
                        borderCollapse: 'collapse',
                        marginTop: '15px'
                      }}
                    >
                      <thead>
                        <tr style={{ height: '40px', background: '#f5f5f5' }}>
                          <th style={{ fontSize: '15px', height: '50px' }} colSpan="7">
                            <b>
                              당신의 흥미코드 : <span style={{ color: 'rgb(56, 103, 143)' }}>{'SA'}</span>
                            </b>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ height: '60px' }}>
                          <td>
                            <b>구분</b>
                          </td>
                          <td>
                            <b>현실형(R)</b>
                          </td>
                          <td>
                            <b>탐구형(I)</b>
                          </td>
                          <td>
                            <b>예술형(A)</b>
                          </td>
                          <td>
                            <b>사회형(S)</b>
                          </td>
                          <td>
                            <b>진취형(E)</b>
                          </td>
                          <td>
                            <b>관습형(C)</b>
                          </td>
                        </tr>
                        <tr style={{ height: '60px' }}>
                          <td>
                            <b>원점수</b>
                          </td>
                          {tData.oData.map((s, i) => {
                            return (
                              <td key={i}>
                                <b>{s}</b>
                              </td>
                            );
                          })}
                        </tr>
                        <tr style={{ height: '60px' }}>
                          <td>
                            <b>표준점수</b>
                          </td>
                          {tData.sData.map((s, i) => {
                            return (
                              <td key={i}>
                                <b>{s}</b>
                              </td>
                            );
                          })}
                        </tr>
                      </tbody>
                    </table>
                  </Box>
                  <Box sx={{ ml: '30px', mt: '30px', mr: '30px', border: '1px solid grey' }}>
                    <Box sx={{ margin: '30px 20px' }}>
                      <Typography variant="h4">원점수</Typography>
                      <Typography sx={{ mt: '5px' }}>원점수는 스스로가 좋아하거나 싫어한다고 주관적으로 여기는 흥미 정도입니다.</Typography>
                      <Typography variant="h4" sx={{ mt: '10px' }}>
                        표준점수
                      </Typography>
                      <Typography sx={{ mt: '5px' }}>
                        표준점수는 타인과 비교하였을 때의 흥미 수준을 말하며 보조적으로 활용할 수 있습니다.
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: '50px', ml: '15px' }}>
                    <DonutSmallRoundedIcon />
                    <Typography variant="h3">흥미검사 해석</Typography>
                  </Box>
                  <Box sx={{ ml: '30px', mt: '20px', mr: '30px' }}>
                    <Typography>
                      흥미검사 결과에서는 개인별 흥미코드, 흥미유형별 원점수, 표준점수, 흥미의 육각모형이 제공됩니다. 다음의 해석방법을
                      자세히 읽어보시면 결과이해에 도움이 될 것입니다.
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: '40px' }}>
                      <FiberManualRecordRoundedIcon sx={{ color: 'rgb(56, 103, 143)', fontSize: '10px' }} />
                      <Typography variant="h4">흥미의 육각모형</Typography>
                    </Box>
                    <table
                      border={1}
                      style={{
                        textAlign: 'center',
                        width: '100%',
                        border: '1px solid grey',
                        borderCollapse: 'collapse',
                        marginTop: '15px'
                      }}
                    >
                      <thead>
                        <tr style={{ height: '40px', background: '#f5f5f5' }}>
                          <th style={{ fontSize: '15px', height: '50px' }} colSpan="2" rowSpan="2"></th>
                          <th style={{ fontSize: '15px', height: '50px' }} colSpan="2">
                            육각형 모양
                          </th>
                        </tr>
                        <tr style={{ height: '40px', background: '#f5f5f5' }}>
                          <th style={{ fontSize: '15px', height: '50px' }}>한쪽으로 찌그러진 모양</th>
                          <th style={{ fontSize: '15px', height: '50px' }}>정육각형에 가까운 모양</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td rowSpan={2} style={{ padding: '10px 20px', width: '120px' }}>
                            <b>육각형크기</b>
                          </td>
                          <td style={{ padding: '10px 20px', width: '80px' }}>
                            <b>크다</b>
                          </td>
                          <td style={{ padding: '10px 20px', width: '410px' }}>
                            특정 분야에 뚜렷한 관심을 보입니다. 흥미가 잘 발달되어 있고 안정적인 형태입니다. 성격, 능력, 경험 등이
                            관심분야와 조화로운지 살펴보는 것이 바람직합니다.
                          </td>
                          <td style={{ padding: '10px 20px', width: '410px' }}>
                            관심분야가 폭넓은 경우입니다. 거의 모든 분야에 호기심이 있지만 자신의 진정한 흥미분야가 무엇인지 잘 모를 수
                            있습니다. 능력, 성격, 경험 등을 고려하여 흥미분야를 좁혀보는 것이 바람직합니다.
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: '10px 20px', width: '80px' }}>
                            <b>작다</b>
                          </td>
                          <td style={{ padding: '10px 20px', width: '410px' }}>
                            특정 분야에 대한 관심이 있기는 하지만 그 정도가 크지 않은 편입니다. 또한 대체로 어떤 분야에 흥미가 있는지 탐색이
                            더욱 깊이 이루어질 필요가 있습니다. 조금이라도 관심이 있는 분야에 대해 적극적 탐색을 해봅시다.
                          </td>
                          <td style={{ padding: '10px 20px', width: '410px' }}>
                            뚜렷한 관심분야가 없습니다. 무엇에 관심이 있는지, 무엇을 잘 할 수 있는지 등과 같은 자기이해가 부족한 경우입니다.
                            과거에 즐거웠거나 잘 할 수 있었던 작은 경험부터 떠올려 봅시다.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: '40px' }}>
                      <FiberManualRecordRoundedIcon sx={{ color: 'rgb(56, 103, 143)', fontSize: '10px' }} />
                      <Typography variant="h4">흥미 유형</Typography>
                    </Box>
                    <table
                      border={1}
                      style={{
                        textAlign: 'center',
                        width: '100%',
                        border: '1px solid grey',
                        borderCollapse: 'collapse',
                        marginTop: '15px'
                      }}
                    >
                      <tbody>
                        <tr>
                          <td rowSpan={2} style={{ padding: '10px 20px', width: '120px' }}>
                            <b style={{ color: 'rgb(56, 103, 143)' }}>현실형(R)</b>
                          </td>
                          <td style={{ padding: '10px 20px', textAlign: 'start' }}>
                            현실형 점수가 높은 사람은 활동적이며 실물적인 일을 좋아합니다.
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: '10px 20px', textAlign: 'start' }}>
                            명확하고 체계적이며 질서정연한 일을 좋아하고, 기존의 가치와 신념체계에 위배되지 않는 선에서 원리 원칙적으로
                            사고하고 명확한 방법을 사용하여 행동하는 경향이 강합니다. 전기나 기계, 공학계열 분야와 같이 실제적이고 규칙적인
                            행동양식이 존재하는 분야를 선호하는 편입니다. 사물을 다루고 조작하는 것을 좋아해 손재주가 있다는 평을 듣는
                            경우가 많으며 겸손하고 솔직하지만, 스스로 사회적인 영향력을 발휘해야 하는 일과 학문적이고 창의적인 일에 서툴다고
                            여기는 편입니다.
                          </td>
                        </tr>
                        <tr>
                          <td rowSpan={2} style={{ padding: '10px 20px', width: '120px' }}>
                            <b style={{ color: 'rgb(56, 103, 143)' }}>탐구형(I)</b>
                          </td>
                          <td style={{ padding: '10px 20px', textAlign: 'start' }}>
                            탐구형 점수가 높은 사람은 관찰하고 탐구하며 사고하는 일을 좋아합니다.
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: '10px 20px', textAlign: 'start' }}>
                            현상을 비판적이고 분석적으로 관찰하고, 체계적이고 창조적으로 탐구하는 것을 좋아하는 반면, 규칙적이고 반복적인
                            활동이나 리더십을 발휘해야 하는 활동은 별로 좋아하지 않습니다. 인간적 감정이나 사회적 환경 보다는 자연현상이나
                            사회현상에 대한 탐구활동에 대한 관심이 많습니다. 독립적이며 개방적인 태도로 정보를 수집하고 자료를 분석하며
                            현상에 대한 결론을 내리는 과정을 거쳐 문제를 해결하는 방식의 일을 선호합니다.
                          </td>
                        </tr>
                        <tr>
                          <td rowSpan={2} style={{ padding: '10px 20px', width: '120px' }}>
                            <b style={{ color: 'rgb(56, 103, 143)' }}>예술형(A)</b>
                          </td>
                          <td style={{ padding: '10px 20px', textAlign: 'start' }}>
                            예술형 점수가 높은 사람은 창의적이고 변화를 추구하는 일을 좋아합니다.
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: '10px 20px', textAlign: 'start' }}>
                            창의적이고 유연한 사고를 즐겨하며 아름다움을 추구하는 경향이 강합니다. 틀에 박힌 일이나 같은 패턴의 일, 변화가
                            없이 틀에 맞추어 해야 하는 일을 별로 좋아하지 않습니다. 같은 사물이나 현상을 보고도 획일적으로 판단하지 않으며
                            상상력이 풍부하고 독창적인 편입니다. 예술적 감수성이 뛰어나고 능력을 발휘하며 즐기는 반면, 명확하고 규칙적인
                            활동이나 객관적 사실을 추구하는 활동에는 약한 편입니다. 개방적인 사고체계를 소유하고 있어 변화를 주도하고
                            추구하며 자신의 직감에 의존하여 문제를 해결하려는 경향도 있습니다.
                          </td>
                        </tr>
                        <tr>
                          <td rowSpan={2} style={{ padding: '10px 20px', width: '120px' }}>
                            <b style={{ color: 'rgb(56, 103, 143)' }}>사회형(S)</b>
                          </td>
                          <td style={{ padding: '10px 20px', textAlign: 'start' }}>
                            사회형 점수가 높은 사람은 사람들과 교류하고 협력하는 일을 좋아합니다.
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: '10px 20px', textAlign: 'start' }}>
                            타인의 문제를 듣고 공감하고, 도와주고, 치료해주는 것을 선호하며 사람을 상대하는 활동에 능숙합니다. 일반적으로
                            이타적이며 자애롭고 배려심이 깊은 인물로 평가를 받습니다. 사물을 지향하기 보다는 사람과 사람 사이의 관계에
                            주목하는 경향이 강하여, 다른 사람들에게 어떤 사실을 가르쳐주고 도와주거나 지원해주는 활동을 좋아합니다.
                          </td>
                        </tr>
                        <tr>
                          <td rowSpan={2} style={{ padding: '10px 20px', width: '120px' }}>
                            <b style={{ color: 'rgb(56, 103, 143)' }}>진취형(E)</b>
                          </td>
                          <td style={{ padding: '10px 20px', textAlign: 'start' }}>
                            진취형 점수가 높은 사람은 목표를 정하고 성취하도록 이끄는 것을 좋아합니다.
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: '10px 20px', textAlign: 'start' }}>
                            자신이 기획하고 목표설정한 것을 실행시키는 데 탁월한 능력을 보이는 유형입니다. 개인과 조직의 목표를 달성하거나
                            경제적인 이익을 추구하기 위한 활동을 선호하며, 타인에게 영향력을 발휘하는 일을 하고 싶어 합니다. 계획하고
                            목표설정하며 추진하고 있는 일을 성공적으로 이끌기 위해 다른 사람들을 설득하거나 협상을 하는 등 사회성을
                            발휘하기도 합니다.
                          </td>
                        </tr>
                        <tr>
                          <td rowSpan={2} style={{ padding: '10px 20px', width: '120px' }}>
                            <b style={{ color: 'rgb(56, 103, 143)' }}>관습형(C)</b>
                          </td>
                          <td style={{ padding: '10px 20px', textAlign: 'start' }}>
                            관습형 점수가 높은 사람은 조직적이고 안정적이며 체계적인 일을 좋아합니다.
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: '10px 20px', textAlign: 'start' }}>
                            조직적이고 체계적이며 규칙과 시스템이 잡혀 있는 일을 좋아하고, 규정이나 시스템 등이 없이 불확실하고 애매하며
                            시시각각 변화하는 일을 피하려는 경향이 강합니다. 수립되어 있는 시스템에 적응하여 규칙에 맞게 성실하고
                            분명하면서도 체계적으로 일을 하는 것을 좋아하여, 서류 작성 및 기록 등과 같은 사무적인 일에 능력을 발휘합니다.
                            문제 상황에서 변화를 추구하거나 비판하기 보다는 조심스럽고 체계적으로 해결계획을 세우는 편입니다.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Box>
                </Box>
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
                                <Rating size="large" value={rating.total} readOnly precision={0.1} />
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
                  marginTop: '10px',
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
                  <ChevronLeftIcon fontSize="large" />
                </Button>
                <Box sx={{ display: 'flex' }}>
                  <Button onClick={(event) => handleBtnClick(event, 'pass')} sx={{ mr: '5px' }}>
                    <Typography variant="h4" sx={{ color: '#38678f' }}>
                      합격대기
                    </Typography>
                  </Button>
                  <span style={{ display: 'flex', alignItems: 'center' }}>|</span>
                  <Button onClick={(event) => handleBtnClick(event, 'fail')} sx={{ ml: '5px' }}>
                    <Typography variant="h4" sx={{ color: '#38678f' }}>
                      불합격대기
                    </Typography>
                  </Button>
                </Box>
                <Button
                  sx={{ color: '#38678f' }}
                  value={'+'}
                  onClick={(event) => {
                    handleOnClick(event, '+');
                  }}
                >
                  <ChevronRightIcon fontSize="large" />
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
            {applicantInfo.applicant_status == 'final' &&
              applicantInfo['evals']?.map((ev, i) => {
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
const tData = {
  oData: [11, 8, 17, 20, 9, 12],
  sData: [69, 56, 54, 58, 50, 51],
  lData: [57, 71, 62, 22, 72]
};

const chartOptions = {
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: {
        usePointStyle: true
      }
    }
  },
  maintainAspectRatio: false
};

const testOptions = {
  plugins: {
    legend: {
      display: false
    }
  },
  scale: {
    angleLines: {
      display: true,
      stepSize: 10
    },
    r: {
      min: 0,
      max: 30,
      stepSize: 2,
      pointLabels: {
        display: false
      },
      ticks: {
        display: false
      }
    }
  },
  maintainAspectRatio: false
};

const lineLabels = ['외향성', '호감성', '성실성', '정서적 불안정성', '경험에대한 개방성'];

const testData = {
  labels: [
    '현실형(R) : 실행/사물지향',
    '탐구형(I) : 사고/아이디어 지향',
    '예술형(A) : 창조/아이디어 지향',
    '사회형(S) : 자선/사람지향',
    '진취형(E) : 관리/과제지향',
    '관습형(C) : 동조/자료지향'
  ],
  datasets: [
    {
      data: [...tData.oData],
      backgroundColor: 'rgba(255, 99, 132, 0.4)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }
  ]
};

const dataLine = {
  labels: lineLabels,
  datasets: [
    {
      label: 'My First Dataset',
      data: tData.lData,
      fill: false,
      pointRadius: 5,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }
  ]
};

const OptionsLine = {
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      display: true
    },
    y: {
      type: 'linear',
      position: 'left'
    }
  }
};

const keywords = ['도전', '열정', '소통', '화합', '책임', '신뢰'];
const jobs = [
  '감독 및 기술감독',
  '개그맨 및 코미디언',
  '국어교사',
  '리포터',
  '문리학원강사',
  '바텐더(조주사)',
  '방송작가 및 스크립터',
  '보육교사 및 보육사',
  '스턴트맨(대역배우)',
  '애완동물미용사',
  '영화배우 및 탤런트',
  '예능강사',
  '외국어교사',
  '웨이터 및 웨이트리스',
  '유치원교사',
  '음악교사',
  '미술교사',
  '체육교사',
  '청소년지도사'
];

export default ApplicantDetailPage;
