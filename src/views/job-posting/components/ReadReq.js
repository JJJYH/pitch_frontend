import * as React from 'react';
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import { Button, Divider, FormControl, MenuItem, Tab, Tabs, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Box, border, height } from '@mui/system';
import { useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import JobRole from './JobRole';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useDispatch, useSelector } from 'react-redux';
import { selectedRowSelector } from 'store/selectedRowSlice';
import { Link } from 'react-router-dom';
import { jobPostingNoSelector } from 'store/jobPostingNoSlice';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import { Chart as ChartJS } from 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { reqPosting } from 'api';
import DataSaverOffIcon from '@mui/icons-material/DataSaverOff';
import BarChartIcon from '@mui/icons-material/BarChart';

const FormTypo = styled(Typography)(({ disabled }) => ({
  margin: '10px',
  display: 'flex',
  alignItems: 'center',
  color: disabled ? '#d0d0d0' : '#364152'
}));

const StyledBox = styled(Box)(() => ({
  margin: '10px',
  borderRadius: '4px',
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
const ReadBox = styled(Box)(() => ({
  padding: '10px 40px'
}));

const SelectBox = styled(Select)(({ value }) => ({
  '& .MuiSelect-select': {
    color: value === 'defaultLocation' || value === 'defaultEducation' ? '#B0BEC5' : '#121926'
  }
}));

const ReadReq = ({ reqlisthandler, handleCombinedSearch, selectedChips, setSelectedChips, setRows, startDate, endDate, searchKeyword }) => {
  const selectedRow = useSelector(selectedRowSelector);
  const contentRef = useRef(null);
  const userId = useSelector((state) => state.userInfo.user_id);
  const jobPostingNo = useSelector(jobPostingNoSelector);
  const [tabValue, setTabValue] = useState(0);
  const [genderData, setGenderData] = useState([]);
  const [ageData, setAgeData] = useState([]);
  const [certData, setCertData] = useState([]);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const [formData, setFormData] = useState({
    job_req_no: '',
    users: { user_id: userId },
    req_title: '',
    job_req_date: new Date(),
    job_group: '',
    job_role: '',
    location: '',
    hire_num: '',
    education: '',
    job_type: '신입',
    job_year: '',
    posting_type: '수시채용',
    posting_period: '',
    posting_start: '',
    posting_end: '',
    qualification: '',
    preferred: '',
    job_duties: '',
    req_status: '작성중'
  });

  const currentDate = dayjs();
  const postingEndDate = dayjs(formData.posting_end);
  const daysRemaining = postingEndDate.diff(currentDate, 'day') + 1;
  const scrollToTop = () => {
    contentRef.current.scrollTo(0, 0);
  };

  useEffect(() => {
    scrollToTop();
    if (selectedRow) {
      setFormData(selectedRow);

      //console.log(selectedRow);
    } else {
      setFormData({
        job_req_no: '',
        users: { user_id: userId },
        req_title: '',
        job_req_date: new Date(),
        job_group: '',
        job_role: '',
        location: '',
        hire_num: '',
        education: '',
        job_type: '신입',
        job_year: '',
        posting_type: '수시채용',
        posting_period: '',
        posting_start: '',
        posting_end: '',
        qualification: '',
        preferred: '',
        job_duties: '',
        req_status: '작성중'
      });
    }
  }, [selectedRow]);

  useEffect(() => {
    // datalabels 플러그인을 등록
    ChartJS.register(ChartDataLabels);
  }, []);

  useEffect(() => {
    const getGenderData = async () => {
      try {
        const response = await reqPosting.getGender(jobPostingNo);
        //console.log(response.data);
        setGenderData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    const getAgeData = async () => {
      try {
        const res = await reqPosting.getAge(jobPostingNo);
        console.log(res.data);
        setAgeData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    const getCertData = async () => {
      try {
        const certRes = await reqPosting.getCert(jobPostingNo);
        console.log(certRes.data);
        setCertData(certRes.data);
      } catch (error) {
        console.log(error);
      }
    };
    getGenderData();
    getAgeData();
    getCertData();
  }, [jobPostingNo]);

  const genders = genderData.map((item) => item.gender);
  const totalApplicants = genders.length;
  const genderCounts = {};
  genders.forEach((gender) => {
    genderCounts[gender] = (genderCounts[gender] || 0) + 1;
  });

  const maleCount = genderCounts['남성'] || 0;
  const femaleCount = genderCounts['여성'] || 0;

  const doughnutData = {
    labels: ['남성', '여성'],
    datasets: [
      {
        data: [maleCount, femaleCount],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
        order: [0, 1]
      }
    ]
  };

  const total = doughnutData.datasets[0].data.reduce((acc, value) => acc + value, 0);

  const doughnutOptions = {
    plugins: {
      legend: {
        position: 'bottom'
      },
      datalabels: {
        formatter: (value, ctx) => {
          //const label = ctx.chart.data.labels[ctx.dataIndex];
          const percentage = Math.floor((value / total) * 100);
          return `${percentage}%`;
        },
        color: '#fff',
        display: true,
        font: {
          size: 18,
          weight: 'bold'
        }
      }
    }
  };

  function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  const calculateAverageAge = (ages) => {
    const totalAge = ages.reduce((sum, age) => sum + age, 0);
    const averageAge = totalAge / ages.length;
    return averageAge.toFixed(1);
  };

  const agesAvg = ageData.map((item) => {
    const age = calculateAge(item.user_birth);
    return age;
  });
  //console.log(agesAvg);

  const averageAge = calculateAverageAge(agesAvg);

  const getAgeCategory = (age) => {
    if (age >= 20 && age <= 25) return '20 ~ 25';
    else if (age >= 26 && age <= 30) return '26 ~ 30';
    else if (age >= 31 && age <= 35) return '31 ~ 35';
    else if (age >= 36 && age <= 40) return '36 ~ 40';
    else if (age >= 41 && age <= 45) return '41 ~ 45';
    else if (age >= 46 && age <= 50) return '46 ~ 50';
    else return '기타';
  };

  const ages = ageData.map((item) => {
    const age = calculateAge(item.user_birth);
    return getAgeCategory(age);
  });

  const ageCounts = {};
  ages.forEach((ageCategory) => {
    ageCounts[ageCategory] = (ageCounts[ageCategory] || 0) + 1;
  });

  const getMaxValue = (obj) => {
    let maxKey = null;
    let maxValue = -1;

    for (const key in obj) {
      if (obj[key] > maxValue) {
        maxKey = key;
        maxValue = obj[key];
      }
    }

    return maxKey;
  };

  const mainAgeCategory = getMaxValue(ageCounts);

  const labels = ['20 ~ 25', '26 ~ 30', '31 ~ 35', '36 ~ 40', '41 ~ 45', '46 ~ 50'];
  const data = labels.map((label) => ageCounts[label] || 0);

  const barData1 = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: '#38678f',
        borderColor: 'black',
        borderWidth: 1
      }
    ]
  };

  const barOptions1 = {
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          display: false
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: (value) => `${value} 명`
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  const certs = certData.map((item) => item.certifications);
  console.log(certs);
  const flattenedCerts = certs.flat();
  const certNames = flattenedCerts.map((cert) => cert.cert_name);
  const uniqueCertNames = [...new Set(flattenedCerts.map((cert) => cert.cert_name))];
  const formattedLabels = uniqueCertNames.map((label) => {
    if (label.length > 8) {
      return label === 'TensorFlow Developer Certificate' ? 'TensorFlow' : label.substring(0, 5) + '...';
    } else {
      // 그렇지 않으면 그대로 사용
      return label;
    }
  });

  console.log(certNames);
  console.log(uniqueCertNames);

  const certCounts = certNames.reduce((acc, certName) => {
    acc[certName] = (acc[certName] || 0) + 1;
    return acc;
  }, {});

  const countCertificationsByUserId = (certifications) => {
    const counts = {};
    certifications.forEach((cert) => {
      const userId = cert.user_id;
      counts[userId] = (counts[userId] || 0) + 1;
    });
    return counts;
  };

  const userCertCounts = countCertificationsByUserId(flattenedCerts);
  console.log(userCertCounts);

  const userCertCountsArray = Object.values(userCertCounts);

  const averageCertCount = (userCertCountsArray.reduce((acc, count) => acc + count, 0) / userCertCountsArray.length).toFixed(1);
  console.log('평균 자격증 개수:', averageCertCount);

  const maxCertName = Object.keys(certCounts).reduce(
    (a, b) => {
      return certCounts[a] > certCounts[b] ? a : b;
    },
    Object.keys(certCounts)[0] || ''
  );

  console.log('가장 많은 지원자가 가지고 있는 자격증:', maxCertName);

  const barData2 = {
    labels: formattedLabels,
    datasets: [
      {
        data: Object.values(certCounts),
        backgroundColor: '#38678f',
        borderColor: 'black',
        borderWidth: 1,
        barThickness: 30
      }
    ]
  };

  const barOptions2 = {
    indexAxis: 'y',
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          stepSize: 1
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };
  return (
    <StyledBox ref={contentRef}>
      <ReadBox>
        <Grid container direction="column" spacing={2}>
          <Grid container alignItems="center" justifyContent="space-between" item xs={12} sx={{ minHeight: '55px' }}>
            <Tabs
              value={tabValue}
              onChange={handleChangeTab}
              centered
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: '#38678f'
                },

                '& .css-1thlsoe-MuiButtonBase-root-MuiTab-root.Mui-selected': {
                  color: '#38678f'
                },
                paddingTop: '10px'
              }}
            >
              <Tab
                label="공고 상세"
                sx={{
                  color: '#616161',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  '& .Mui-selected': {
                    color: '#38678f'
                  }
                }}
              />
              <Tab
                label="지원자 현황"
                sx={{
                  color: '#616161',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  '& .Mui-selected': {
                    color: '#38678f'
                  }
                }}
              />
            </Tabs>

            <Button variant="contained" style={{ backgroundColor: '#38678f ' }}>
              <Link to={`/manage/posts/${jobPostingNo}/sort`} style={{ textDecoration: 'none', color: 'white' }}>
                관리하기
              </Link>
            </Button>
          </Grid>
          <Divider sx={{ marginLeft: '15px', borderColor: '#c0c0c0', width: '660px' }} />
          {tabValue === 0 && (
            <Grid container sx={{ display: 'flex', justifyContent: 'center', maxWidth: '650px', ml: 3 }}>
              <Grid item>
                <Box
                  sx={{
                    width: '650px',
                    // border: '1px solid',
                    height: '50px'
                  }}
                >
                  <Grid container sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }} spacing={2}>
                    <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                      {/* <FavoriteIcon style={{ fontSize: 30, color: '#FF6F6F' }} /> */}

                      <FavoriteBorderIcon style={{ fontSize: 30, color: ' #666666' }} />

                      <Typography ml={2}>관심공고</Typography>
                    </Grid>
                    <Grid item sx={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                      <ShareRoundedIcon />
                      <Typography ml={1}>공유</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    width: '650px',
                    // border: '1px solid',
                    height: '100px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <Typography sx={{ fontSize: '30px', fontWeight: 'bold' }}>{formData.req_title}</Typography>
                  <Typography sx={{ fontSize: '14px', mt: 1 }}>{formData.job_type}</Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    width: '650px',
                    // border: '1px solid',
                    height: '100px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Box
                    sx={{
                      width: '650px',
                      border: '2px solid',
                      height: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '30px'
                    }}
                  >
                    <Grid container sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      {formData.posting_type === '수시채용' ? (
                        <Grid item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <Typography sx={{ fontSize: '20px', fontWeight: 'bold', mr: 1 }}>공고마감</Typography>
                          <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#38678f', mr: 1 }}>D-{daysRemaining}</Typography>
                          <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>확인해주세요!</Typography>
                        </Grid>
                      ) : (
                        <Typography sx={{ fontSize: '20px', fontWeight: 'bold', mr: 1 }}>채용 시 마감되는 공고입니다.</Typography>
                      )}
                      <Grid item sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Typography sx={{ fontSize: '14px' }}>게시</Typography>
                          <Typography ml={2} mr={2} sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                            {dayjs(formData.posting_start).format('YYYY-MM-DD')}
                          </Typography>
                        </Grid>
                        <Typography ml={1} sx={{ fontSize: '20px', fontWeight: 'bold' }}>
                          |
                        </Typography>
                        <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Typography ml={2} sx={{ fontSize: '14px' }}>
                            마감
                          </Typography>
                          {formData.posting_type === '수시채용' ? (
                            <Typography ml={2} sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                              {dayjs(formData.posting_end).format('YYYY-MM-DD')}
                            </Typography>
                          ) : (
                            <Typography ml={2} sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                              채용 시
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    width: '650px',
                    // border: '1px solid',
                    maxHeight: '1000px'
                  }}
                >
                  <Typography sx={{ fontSize: '20px', fontWeight: 'bold', mt: 4, mb: 2.5, ml: 3 }}>모집분야 및 지원자격</Typography>
                  <Box
                    sx={{
                      width: '650px',
                      border: '1px solid #ddd',
                      borderTop: ' 2px solid #364152',
                      maxHeight: '1000px'
                    }}
                  >
                    <Typography sx={{ fontSize: '18px', fontWeight: 'bold', mt: 3, mb: 3, ml: 5 }}>{formData.job_role}</Typography>
                    <Box sx={{ width: '600px', borderTop: '1px solid #ddd', marginLeft: '25px', p: 2, pb: 3 }}>
                      <Grid container direction="column">
                        <Grid item mb={2}>
                          <Typography sx={{ fontSize: '14px', fontWeight: 'bold', mt: 3, mb: 2 }}>공통지원자격</Typography>
                          <Typography mb={1}>- 공통 필수사항 : 병역필 또는 면제자로, 해외여행에 결격 사유가 없는 자</Typography>
                          <Typography mb={1}>- 공통 우대사항 : 학사 취득 후 4년이상 유관경력 보유자</Typography>
                          <Typography mb={1}>※ 석/박사 학위취득(예정)자의 경우 수학기간을 경력기간으로 인정</Typography>
                        </Grid>
                        <Grid item mb={2}>
                          <Typography sx={{ fontSize: '14px', fontWeight: 'bold', mt: 3, mb: 2 }}>채용인원</Typography>
                          <Typography mb={1}>{formData.hire_num}명</Typography>
                        </Grid>
                        <Grid item mb={2}>
                          <Typography sx={{ fontSize: '14px', fontWeight: 'bold', mt: 3, mb: 2 }}>근무지</Typography>
                          <Typography mb={1}>{formData.location}</Typography>
                        </Grid>
                        <Grid item mb={2}>
                          <Typography sx={{ fontSize: '14px', fontWeight: 'bold', mt: 3, mb: 2 }}>수행업무</Typography>
                          <Typography mb={1} sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
                            {formData.job_duties}
                          </Typography>
                        </Grid>
                        <Grid item mb={2}>
                          <Typography sx={{ fontSize: '14px', fontWeight: 'bold', mt: 3, mb: 2 }}>지원자격</Typography>
                          <Typography mb={1} sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
                            {formData.qualification}
                          </Typography>
                        </Grid>
                        <Grid item mb={2}>
                          <Typography sx={{ fontSize: '14px', fontWeight: 'bold', mt: 3, mb: 2 }}>우대사항</Typography>
                          <Typography mb={1} sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
                            {formData.preferred}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item mt={3}>
                <Box sx={{ width: '650px', height: '350px' }}>
                  <Typography sx={{ fontSize: '20px', fontWeight: 'bold', mt: 3, mb: 2.5, ml: 3 }}>제출서류</Typography>
                  <Box
                    sx={{
                      width: '650px',
                      border: '1px solid #ddd',
                      borderTop: ' 2px solid #364152',
                      maxHeight: '400px',
                      p: 4
                    }}
                  >
                    <Typography mb={1}>- 증빙서류는 이력서 작성시 제출합니다.</Typography>
                    <Typography mb={1}>ㆍ졸업증명서(원본) / 성적증명서(원본) / 경력증명서(원본) 각 1부</Typography>
                    <Typography mb={3}>ㆍ기타 자격증 및 확인서</Typography>
                    <Typography mb={1}>※ 채용 서류 반환 관련 안내 (별도 안내 예정)</Typography>
                    <Typography mb={1}>회사는 채용 전형 과정에서 지원자의 불편을 최소화하기 위해</Typography>
                    <Typography mb={1}>입사지원서를 비롯하여 채용과 관련된 모든 서류는 채용 홈페이지를 통해</Typography>
                    <Typography mb={1}>접수 받고 있습니다. 채용 과정에서 서류를 직접 제출 받은 경우,</Typography>
                    <Typography mb={1}>
                      해당 서류를 반환해 드리고 있사오니 자세한 내용은 지원가이드 - 채용서류 반환신청을 참고해 주시기 바랍니다.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ width: '650px', height: '250px' }}>
                  <Typography sx={{ fontSize: '20px', fontWeight: 'bold', mt: 7, mb: 2, ml: 3 }}>첨부자료</Typography>
                  <Typography ml={3} mb={1}>
                    본 공고에 첨부된 자기소개서 다운로드후 작성하여 주시기 바랍니다.
                  </Typography>
                  <Typography ml={3}>작성한 파일은 pdf 변환 후 &lsquo;이력서 첨부&rsquo;란에 등록하여 주시기 바랍니다.</Typography>
                  <Box
                    sx={{
                      width: '650px',
                      borderBottom: '1px solid #ddd',
                      borderTop: ' 2px solid #364152',
                      maxHeight: '100px',
                      p: 2,
                      mt: 4
                    }}
                  >
                    <Grid container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Grid item xs={4}>
                        <Typography>(양식)입사지원서</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>입사지원서</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Button>다운로드</Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
          {tabValue === 1 && (
            <Grid container sx={{ display: 'flex', justifyContent: 'center', ml: 3 }}>
              <Grid item xs={12}>
                <Typography sx={{ fontSize: '18px', fontWeight: 'bold', mt: 5, mb: 2 }}>지원자 성비</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', width: '650px', pt: 4 }}>
                  <Box sx={{ height: '300px', mb: 4, ml: 5 }}>
                    {totalApplicants === 0 ? (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '550px',
                          height: '300px'
                        }}
                      >
                        <DataSaverOffIcon sx={{ fontSize: '150px', mb: 2, color: '#38678f' }} />
                        <Typography ml={1} sx={{ fontSize: '20px' }}>
                          지원자가 없습니다.
                        </Typography>
                      </Box>
                    ) : (
                      <Doughnut data={doughnutData} options={doughnutOptions} />
                    )}
                  </Box>
                  {totalApplicants > 0 && (
                    <Box sx={{ ml: 10, pb: 4 }}>
                      <Typography sx={{ fontSize: '18px', mb: 1 }}>
                        총 지원자 수: <span style={{ fontWeight: 'bold', paddingLeft: 5, fontSize: '22px' }}>{totalApplicants}</span> 명
                      </Typography>
                      <Typography sx={{ fontSize: '18px', mb: 1 }}>
                        남성 : <span style={{ fontWeight: 'bold', paddingLeft: 5, fontSize: '22px' }}>{maleCount}</span> 명
                      </Typography>
                      <Typography sx={{ fontSize: '18px', mb: 1 }}>
                        여성 : <span style={{ fontWeight: 'bold', paddingLeft: 5, fontSize: '22px' }}>{femaleCount}</span> 명
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography sx={{ fontSize: '18px', fontWeight: 'bold', mt: 5, mb: 2 }}>지원자 연령</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', width: '650px', pt: 4 }}>
                  <Box sx={{ height: '290px', mb: 4, width: '415px', pl: 3 }}>
                    {totalApplicants === 0 ? (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '580px',
                          height: '300px'
                        }}
                      >
                        <BarChartIcon sx={{ fontSize: '150px', color: '#38678f' }} />
                        <Typography ml={1} sx={{ fontSize: '20px' }}>
                          지원자가 없습니다.
                        </Typography>
                      </Box>
                    ) : (
                      <Bar data={barData1} options={barOptions1} height={250} />
                    )}
                  </Box>
                  {totalApplicants > 0 && (
                    <Box>
                      <Typography sx={{ fontSize: '18px', mb: 1 }}>평균 연령:</Typography>
                      <Typography sx={{ fontSize: '18px', mb: 2 }}>
                        <span style={{ fontWeight: 'bold', paddingLeft: 5, fontSize: '25px' }}>{averageAge}</span> 세
                      </Typography>
                      <Typography sx={{ fontSize: '18px', mb: 1 }}>주요 연령대:</Typography>
                      <Typography sx={{ fontSize: '18px', mb: 6 }}>
                        <span style={{ fontWeight: 'bold', paddingLeft: 5, fontSize: '25px' }}>{mainAgeCategory}</span>세
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ fontSize: '18px', fontWeight: 'bold', mt: 5, mb: 2 }}>자격증 분포</Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: '1px solid #e0e0e0',
                    width: '650px',
                    pt: 4
                  }}
                >
                  <Box sx={{ height: '350px', mb: 4, width: '600px', pl: 3 }}>
                    <Bar data={barData2} options={barOptions2} height={250} />
                  </Box>
                  {totalApplicants > 0 && (
                    <Box width={550}>
                      <Typography sx={{ fontSize: '18px', mb: 1 }}>지원자 평균 자격증 수:</Typography>
                      <Typography sx={{ fontSize: '18px', mb: 2 }}>
                        <span style={{ fontWeight: 'bold', paddingLeft: 5, fontSize: '25px' }}>{averageCertCount}</span> 개
                      </Typography>
                      <Typography sx={{ fontSize: '18px', mb: 1 }}>최다 보유 자격증:</Typography>
                      <Typography sx={{ fontSize: '18px', mb: 5 }}>
                        <span style={{ fontWeight: 'bold', paddingLeft: 5, fontSize: '25px' }}>{maxCertName}</span>
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}
          <Divider sx={{ marginTop: '40px' }} />
        </Grid>
      </ReadBox>
    </StyledBox>
  );
};

export default ReadReq;
