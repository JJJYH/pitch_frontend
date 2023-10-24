import { Box, Card, CardHeader, Divider, Grid, IconButton, Typography } from '@mui/material';
import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import OpenIconSpeedDial from './OpenIconSpeedDial';
import Profile from './components/Profile';
import Education from './components/Education';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import Skills from './components/Skills';
import Career from './components/Career';
import Certification from './components/Certification';
import Language from './components/Language';
import Advantage from './components/Advantage';
import CVSide from './components/CVSide';
import { useRef } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Activity from './components/Activity';
import { addEducation } from 'store/educationSlice';
import { addCareer } from 'store/careerSlice';
import { addActivity } from 'store/activitySlice';
import { addLang } from 'store/langSlice';
import { addCert } from 'store/certSlice';

const CV = () => {
  const dispatch = useDispatch();

  const eduAddFields = () => {
    const newEduArr = { eduType: '', enterDay: '', graduateDay: '', major: '', graduateType: '', totalScore: '', score: '' };
    dispatch(addEducation(newEduArr));
  };

  const careerAddFields = () => {
    const newCareerArr = { companyName: '', deptName: '', exPosition: '', joinDate: '', salary: '', job: '', note: '' };
    dispatch(addCareer(newCareerArr));
  };

  const langAddFields = () => {
    const newLangyArr = { examType: '', langName: '', langScore: '' };
    dispatch(addLang(newLangyArr));
  };

  const activityAddFields = () => {
    const newActivityArr = { activityType: '', organization: '', startDate: '', endDate: '', activityDetail: '' };
    dispatch(addActivity(newActivityArr));
  };
  const certAddFields = () => {
    const newCertArr = { certName: '', publisher: '', acqDate: '' };
    dispatch(addCert(newCertArr));
  };

  const [currentTab, setCurrentTab] = useState(null);

  const tabRef = useRef({});

  const scrollToTab = (index) => {
    if (tabRef.current[index]) {
      tabRef.current[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
      setCurrentTab(index);
    }
  };

  return (
    <Grid container spacing={2.5}>
      <OpenIconSpeedDial />
      <Grid item xs={1.5} />
      <Grid item xs={7}>
        <MainCard>
          <CardHeader title={<Typography variant="h3">이력서 작성</Typography>} />
          <Divider />
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Grid item xs={12}>
              <MainCard>
                <SubCard
                  ref={(el) => (tabRef.current['profile'] = el)}
                  sx={{ mb: 1, boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}
                >
                  <Typography variant="h3" sx={{ mb: 2.5 }}>
                    인적사항
                  </Typography>
                  <Profile />
                </SubCard>
                <SubCard sx={{ mb: 1, boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}>
                  <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                    <Typography
                      ref={(el) => (tabRef.current['education'] = el)}
                      variant="h3"
                      sx={{ mb: 2.5 }}
                      textAlign={'center'}
                      alignContent={'center'}
                    >
                      학력
                    </Typography>
                    <IconButton onClick={() => eduAddFields()}>
                      <AddBoxOutlinedIcon />
                    </IconButton>
                  </Box>
                  <Education />
                </SubCard>
                <SubCard sx={{ mb: 1, boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}>
                  <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                    <Typography
                      ref={(el) => (tabRef.current['skills'] = el)}
                      variant="h3"
                      sx={{ mb: 2.5 }}
                      textAlign={'center'}
                      alignContent={'center'}
                    >
                      보유 스킬
                    </Typography>
                  </Box>
                  <Skills />
                </SubCard>
                <SubCard sx={{ mb: 1, boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}>
                  <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                    <Typography
                      ref={(el) => (tabRef.current['career'] = el)}
                      variant="h3"
                      sx={{ mb: 2.5 }}
                      textAlign={'center'}
                      alignContent={'center'}
                    >
                      경력 사항
                    </Typography>
                    <IconButton onClick={() => careerAddFields()}>
                      <AddBoxOutlinedIcon />
                    </IconButton>
                  </Box>
                  <Career />
                </SubCard>
                <SubCard sx={{ mb: 1, boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}>
                  <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                    <Typography
                      ref={(el) => (tabRef.current['cert'] = el)}
                      variant="h3"
                      sx={{ mb: 2.5 }}
                      textAlign={'center'}
                      alignContent={'center'}
                    >
                      자격증
                    </Typography>
                    <IconButton onClick={() => certAddFields()}>
                      <AddBoxOutlinedIcon />
                    </IconButton>
                  </Box>
                  <Certification />
                </SubCard>
                <SubCard sx={{ mb: 1, boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}>
                  <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                    <Typography
                      ref={(el) => (tabRef.current['lang'] = el)}
                      variant="h3"
                      sx={{ mb: 2.5 }}
                      textAlign={'center'}
                      alignContent={'center'}
                    >
                      어학 성적
                    </Typography>
                    <IconButton onClick={() => langAddFields()}>
                      <AddBoxOutlinedIcon />
                    </IconButton>
                  </Box>
                  <Language />
                </SubCard>
                <SubCard sx={{ mb: 1, boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}>
                  <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                    <Typography
                      ref={(el) => (tabRef.current['activity'] = el)}
                      variant="h3"
                      sx={{ mb: 2.5 }}
                      textAlign={'center'}
                      alignContent={'center'}
                    >
                      대외 활동
                    </Typography>
                    <IconButton onClick={() => activityAddFields()}>
                      <AddBoxOutlinedIcon />
                    </IconButton>
                  </Box>
                  <Activity />
                </SubCard>
                <SubCard sx={{ mb: 1, boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}>
                  <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                    <Typography
                      ref={(el) => (tabRef.current['advantage'] = el)}
                      variant="h3"
                      sx={{ mb: 2.5 }}
                      textAlign={'center'}
                      alignContent={'center'}
                    >
                      우대 사항
                    </Typography>
                  </Box>
                  <Advantage />
                </SubCard>
              </MainCard>
            </Grid>
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={2}>
        <CVSide currentTab={currentTab} scrollToTab={scrollToTab} tabRef={tabRef} />
      </Grid>

      <Grid item xs={1.5} />
    </Grid>
  );
};

export default CV;
