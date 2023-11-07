import { Grid, Box, Card, CardHeader, Avatar, CardContent, Typography, Chip } from '@mui/material';

import React from 'react';
import SubCard from 'ui-component/cards/SubCard';
import styles from './mypage.module.scss';
import { padding } from '@mui/system';
import RadarChart from './RadarChart';
import { useState } from 'react';
import { amber, red, teal } from '@mui/material/colors';

const Mypage = () => {
  const [reqBtn, setReqBtn] = useState();

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
                  Name
                </Typography>
              }
              subheader={
                <Typography fontSize={'12px'} sx={{ color: '#cccccc', textAlign: 'end' }}>
                  E-mail
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
                <Typography onClick={(e) => setReqBtn(true)} fontWeight={'bold'} fontSize={'20px'} sx={{ '&:hover': { color: '#4682b4' } }}>
                  지원 공고
                </Typography>
                <Typography
                  onClick={(e) => setReqBtn(false)}
                  fontWeight={'bold'}
                  fontSize={'20px'}
                  sx={{ '&:hover': { color: '#4682b4' } }}
                >
                  추천 공고
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
              <Grid item xs={6} sx={{ width: '100%', padding: '20px' }} className={styles.avatarStyle}>
                {reqBtn ? (
                  <>
                    <Typography fontWeight={'bold'} fontSize={'20px'} sx={{ '&:hover': { color: '#4682b4' } }}>
                      지원자 평균 스펙
                    </Typography>
                    <RadarChart />
                  </>
                ) : (
                  <>
                    <Typography fontWeight={'bold'} fontSize={'20px'} sx={{ '&:hover': { color: '#4682b4' } }}>
                      추천 공고 목록
                    </Typography>

                    <Card sx={{ border: '1px solid #cccccc', padding: '10px', '&:hover': { border: '2px solid #4682b4' } }}>
                      <CardHeader sx={{ padding: '10px' }} title={<Typography fontSize={'16px'}>Title</Typography>} />
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <CardContent sx={{ padding: '10px' }}>Content</CardContent>
                        <div className={styles.reqDateStyle}>D-7</div>
                      </div>
                    </Card>
                  </>
                )}
              </Grid>

              <Grid item xs={6} sx={{ width: '100%', padding: '20px', overflow: 'auto' }} className={styles.avatarStyle}>
                <Typography fontWeight={'bold'} fontSize={'20px'} sx={{ '&:hover': { color: '#4682b4' } }}>
                  지원하신 공고
                </Typography>

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
                    <div className={styles.reqDateStyle} style={{ backgroundColor: amber[700] }}>
                      대기
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
                    <div className={styles.reqDateStyle} style={{ backgroundColor: amber[700] }}>
                      대기
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
              </Grid>
            </div>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={1.5}></Grid>
    </Grid>
  );
};

export default Mypage;
