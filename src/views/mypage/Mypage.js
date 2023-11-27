import { Grid, Box, Card, CardHeader, Avatar, CardContent, Typography, Chip, Divider, IconButton } from '@mui/material';

import React from 'react';
import SubCard from 'ui-component/cards/SubCard';
import styles from './mypage.module.scss';
import { padding, width } from '@mui/system';
import RadarChart from './RadarChart';
import { useState } from 'react';
import { amber, red, teal } from '@mui/material/colors';
import { useDispatch, useSelector } from 'react-redux';
import Page from '../cv/Page';
import { cv } from 'api';
import { useEffect } from 'react';
import icon from '../../man.png';
const Mypage = () => {
  const [reqBtn, setReqBtn] = useState('reqList');
  const userInfo = useSelector((state) => state.userInfo);
  const [jobInfoList, setJobInfoList] = useState([]);
  let job_info = {
    req_title: '',
    applicant_status: '',
    apply_date: null,
    apply_no: '',
    cv_no: '',
    read_status: '',
    status_type: '',
    education: '',
    hire_num: '',
    job_duties: '',
    job_group: '',
    job_posting_no: '',
    job_req_no: '',
    posting_status: null,
    liked: false,
    job_role: '',
    job_type: '',
    job_year: '',
    location: '',
    posting_end: null,
    posting_period: '',
    posting_start: null,
    posting_type: '',
    preferred: '',
    qualification: '',
    req_status: '',
    user_id: ''
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const applyList = await cv.getApplyList();
        const newJobInfoList = [];

        for (const item of applyList.data) {
          console.log(item);

          // 지원 목록 정보 설정
          job_info.applicant_status = item.applicant_status;
          job_info.apply_date = item.apply_date;
          job_info.apply_no = item.apply_no;
          job_info.cv_no = item.cv_no;
          job_info.job_posting_no = item.job_posting_no;
          job_info.read_status = item.read_status;
          job_info.status_type = item.status_type;
          job_info.user_id = item.user_id;

          const result = await cv.getJobInfoList(item.job_posting_no);
          console.log(result.data[0]);

          job_info.education = result.data[0].education;
          job_info.hire_num = result.data[0].hire_num;
          job_info.job_duties = result.data[0].job_duties;
          job_info.job_group = result.data[0].job_group;
          job_info.job_req_no = result.data[0].job_req_no;
          job_info.posting_status = result.data[0].posting_status;
          job_info.job_role = result.data[0].job_role;
          job_info.job_type = result.data[0].job_type;
          job_info.job_year = result.data[0].job_year;
          job_info.location = result.data[0].location;
          job_info.posting_end = result.data[0].posting_end;
          job_info.posting_period = result.data[0].posting_period;
          job_info.posting_start = result.data[0].posting_start;
          job_info.posting_type = result.data[0].posting_type;
          job_info.preferred = result.data[0].preferred;
          job_info.qualification = result.data[0].qualification;
          job_info.req_status = result.data[0].req_status;
          job_info.req_title = result.data[0].req_title;
          // ... (다른 속성들)

          const newJobInfo = { ...job_info };
          newJobInfoList.push(newJobInfo);
          console.log(newJobInfoList);
        }

        setJobInfoList((prevList) => [...prevList, ...newJobInfoList]);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      }
    };
    fetchData();
  }, []);

  console.log(jobInfoList);
  const initialChartData = {
    data: [
      {
        avg_score: 0,
        cert_count: 0,
        career_count: 0,
        lang_count: 0,
        advantage_count: 0,
        skill_count: 0
      },
      {
        avg_score: 0,
        cert_count: 0,
        career_count: 0,
        lang_count: 0,
        advantage_count: 0,
        skill_count: 0
      }
    ]
  };

  useEffect(() => {
    // jobInfoList 배열의 첫 번째 요소를 가져옴
    if (jobInfoList.length > 0) {
      console.log(jobInfoList[0]);
      const sendParams = {
        job_posting_no: jobInfoList[0].job_posting_no,
        cv_no: jobInfoList[0].cv_no
      };
      cv.getChartData(sendParams)
        .then((res) => {
          setChartData(res);
          console.log(chartData);
        })
        .catch((error) => {
          // 에러 핸들링
          console.error('Error fetching chart data:', error);
        });
    }
  }, [jobInfoList]); // jobInfoList가 변경될 때마다 실행

  const [chartData, setChartData] = useState(initialChartData);
  const handleClickList = async (index) => {
    console.log(jobInfoList[index]);
    const sendParmas = {
      job_posting_no: jobInfoList[index].job_posting_no,
      cv_no: jobInfoList[index].cv_no
    };
    await cv.getChartData(sendParmas).then((res) => {
      setChartData(res);

      console.log(chartData);
    });
  };

  return (
    <Grid container>
      <Grid item xs={1.5}></Grid>
      <Grid item xs={9}>
        <Card sx={{ width: '100%', height: '100vh', justifyContent: 'center', position: 'relative' }}>
          {/* header */}
          <div style={{ height: '20%', backgroundColor: '#4682B4' }}></div>
          {/* profile */}
          <Avatar
            className={styles.avatarStyle}
            alt="User Image"
            src={icon}
            sx={{
              zIndex: 2,
              height: '100px',
              width: '100px',
              position: 'absolute',
              top: '6%',
              left: '10%',
              border: '2px solid #f5f5f5'
            }}
          ></Avatar>
          <div
            className={styles.profileGlass}
            style={{ margin: '10px', width: '90%', padding: '10px', position: 'absolute', justifyContent: 'end' }}
          >
            <CardHeader
              sx={{ color: 'white', justifyContent: 'end' }}
              title={
                <Typography fontSize={'16px'} sx={{ textAlign: 'end' }}>
                  {userInfo.user_nm ? userInfo.user_nm : 'Name'}
                </Typography>
              }
              subheader={
                <Typography fontSize={'12px'} sx={{ color: '#cccccc', textAlign: 'end' }}>
                  {userInfo.user_email ? userInfo.user_email : 'E-mail'}
                </Typography>
              }
            ></CardHeader>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: '24px'
              }}
            >
              <Box>
                <Typography fontWeight={'bold'} fontSize={'20px'} sx={{ '&:hover': { color: '#4682b4' } }}>
                  지원수
                </Typography>
                <Typography fontWeight={'bold'} fontSize={'16px'} sx={{ '&:hover': { color: '#4682b4' } }}>
                  {jobInfoList.length}회
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                <Typography
                  onClick={(e) => setReqBtn('CVWrite')}
                  fontWeight={'bold'}
                  fontSize={'20px'}
                  sx={{ color: reqBtn === 'CVWrite' ? '#4682b4' : 'black', '&:hover': { color: '#4682b4' } }}
                >
                  이력서 관리
                </Typography>
                <Typography
                  onClick={(e) => setReqBtn('reqList')}
                  fontWeight={'bold'}
                  fontSize={'20px'}
                  sx={{ color: reqBtn === 'reqList' ? '#4682b4' : 'black', '&:hover': { color: '#4682b4' } }}
                >
                  지원 공고
                </Typography>
              </Box>
            </div>
          </div>
          {/* Content */}
          <CardContent sx={{ position: 'relative', height: '100%', justifyContent: 'end' }}>
            <div
              style={{
                position: 'relative',
                top: '13%',
                marginLeft: '41px',
                marginRight: '41px',
                display: 'flex',
                flexDirection: 'row',
                gap: '24px'
              }}
            >
              {reqBtn !== 'CVWrite' ? (
                <>
                  <Grid item xs={6} sx={{ width: '100%', padding: '20px' }} className={styles.avatarStyle}>
                    {reqBtn === 'reqList' && (
                      <>
                        <Typography fontWeight={'bold'} fontSize={'20px'} sx={{ '&:hover': { color: '#4682b4' } }}>
                          지원자 평균 역량
                        </Typography>
                        <RadarChart user_nm={userInfo.user_nm} chartData={chartData} />
                      </>
                    )}
                  </Grid>
                  <Grid item xs={6} sx={{ width: '100%', padding: '20px' }} className={styles.avatarStyle}>
                    <Typography fontWeight={'bold'} fontSize={'20px'} sx={{ '&:hover': { color: '#4682b4' } }}>
                      지원하신 공고
                    </Typography>
                    <div style={{ overflow: 'auto', maxHeight: '500px' }}>
                      {jobInfoList.length !== 0
                        ? jobInfoList.map((info, index) => (
                            <Card
                              key={index}
                              sx={{ padding: '10px', '&:hover': { border: '2px solid #4682b4' } }}
                              onClick={() => {
                                handleClickList(index);
                              }}
                            >
                              <CardHeader
                                sx={{ padding: '10px' }}
                                title={
                                  <Typography fontSize={'18px'} fontWeight={'bold'}>
                                    {info.req_title}
                                  </Typography>
                                }
                              />
                              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <CardContent sx={{ padding: '10px', color: '#cccccc' }}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'row',
                                      paddingRight: '100x'
                                    }}
                                  >
                                    {info.job_role}
                                    <div style={{ marginLeft: '12px', marginRight: '12px', borderRight: '1px solid #cccccc' }}></div>
                                    {info.location}
                                  </div>
                                </CardContent>
                                <div className={styles.reqDateStyle} style={{ backgroundColor: teal[300], width: '125px' }}>
                                  {info.applicant_status === 'first' ? '1차 ' : info.applicant_status === 'second' ? '2차 ' : '최종 '}
                                  {info.status_type}
                                </div>
                              </div>
                            </Card>
                          ))
                        : ''}
                    </div>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} sx={{ overflow: 'auto', maxHeight: '500px' }}>
                    <Page isMainCV={'MainCV'} />
                  </Grid>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={1.5}></Grid>
    </Grid>
  );
};

export default Mypage;
