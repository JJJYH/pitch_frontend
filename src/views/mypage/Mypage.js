import { Grid, Box, Card, CardHeader, Avatar, CardContent, Typography, Chip, Divider, IconButton } from '@mui/material';

import React from 'react';
import SubCard from 'ui-component/cards/SubCard';
import styles from './mypage.module.scss';
import { padding } from '@mui/system';
import RadarChart from './RadarChart';
import { useState } from 'react';
import { amber, red, teal } from '@mui/material/colors';
import { useDispatch, useSelector } from 'react-redux';
import Page from '../cv/Page';
import { cv } from 'api';
import { useEffect } from 'react';
const Mypage = () => {
  const [reqBtn, setReqBtn] = useState();
  const userInfo = useSelector((state) => state.userInfo);
  let job_info_list = [];
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
      cv.getApplyList().then((res) => {
        res.data.map((item) => {
          console.log(item);
          //**Setting Apply List Info */
          job_info.applicant_status = item.applicant_status;
          job_info.apply_date = item.apply_date;
          job_info.apply_no = item.apply_no;
          job_info.cv_no = item.cv_no;
          job_info.job_posting_no = item.job_posting_no;
          job_info.read_status = item.read_status;
          job_info.status_type = item.status_type;
          job_info.user_id = item.user_id;

          cv.getJobInfoList(item.job_posting_no).then((result) => {
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
            console.log(job_info);
            job_info_list.push(job_info);
            console.log(job_info_list);
          });
        });
      });
    };
    fetchData();
  }, []);

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
                  45회
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                <Typography
                  onClick={(e) => setReqBtn('CVWrite')}
                  fontWeight={'bold'}
                  fontSize={'20px'}
                  sx={{ '&:hover': { color: '#4682b4' } }}
                >
                  이력서 관리
                </Typography>
                <Typography
                  onClick={(e) => setReqBtn('reqList')}
                  fontWeight={'bold'}
                  fontSize={'20px'}
                  sx={{ '&:hover': { color: '#4682b4' } }}
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
                          지원자 평균 스펙
                        </Typography>
                        <RadarChart />
                      </>
                    )}
                  </Grid>
                  <Grid item xs={6} sx={{ width: '100%', padding: '20px' }} className={styles.avatarStyle}>
                    <Typography fontWeight={'bold'} fontSize={'20px'} sx={{ '&:hover': { color: '#4682b4' } }}>
                      지원하신 공고
                    </Typography>
                    <div style={{ overflow: 'auto', maxHeight: '500px' }}>
                      {job_info_list.map((info, index) => (
                        <div key={index}>{index} 입니다.</div>
                      ))}
                      <Card sx={{ padding: '10px', '&:hover': { border: '2px solid #4682b4' } }}>
                        <CardHeader
                          sx={{ padding: '10px' }}
                          title={
                            <Typography fontSize={'16px'} fontWeight={'bold'}>
                              Title
                            </Typography>
                          }
                        />
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                          <CardContent sx={{ padding: '10px', color: '#cccccc' }}>Content</CardContent>
                          <div className={styles.reqDateStyle} style={{ backgroundColor: teal[300] }}>
                            합격
                          </div>
                        </div>
                      </Card>

                      <Card sx={{ padding: '10px', '&:hover': { border: '2px solid #4682b4' } }}>
                        <CardHeader
                          sx={{ padding: '10px' }}
                          title={
                            <Typography fontSize={'16px'} fontWeight={'bold'}>
                              Title
                            </Typography>
                          }
                        />
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                          <CardContent sx={{ padding: '10px', color: '#cccccc' }}>Content</CardContent>
                          <div className={styles.reqDateStyle} style={{ backgroundColor: red[500] }}>
                            불합격
                          </div>
                        </div>
                      </Card>
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
