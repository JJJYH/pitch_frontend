import { Box, Card, CardHeader, Divider, Grid, IconButton, Typography } from '@mui/material';
import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import OpenIconSpeedDial from './OpenIconSpeedDial';
import Profile from './components/Profile';
import Education from './components/Education';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
// import Skills from './components/SkillsTest';
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
import { get } from 'api';
import AddIcon from '@mui/icons-material/Add';
import ControllableStates from './components/Skills';
const CV = () => {
  get.cvTest().then((data) => console.log(data));

  const dispatch = useDispatch();

  const eduAddFields = () => {
    const new_edu_arr = { edu_type: '', enter_date: '', graduate_date: '', major: '', graduate_type: '', total_score: '', score: '' };
    dispatch(addEducation(new_edu_arr));
  };

  const careerAddFields = () => {
    const new_career_arr = {
      company_name: '',
      cv_dept_name: '',
      position: '',
      join_date: '',
      salary: '',
      job: '',
      quit_date: '',
      note: ''
    };
    dispatch(addCareer(new_career_arr));
  };

  const langAddFields = () => {
    const new_lang_arr = { exam_type: '', language_name: '', language_score: '' };
    dispatch(addLang(new_lang_arr));
  };

  const activityAddFields = () => {
    const new_activity_arr = { activity_type: '', organization: '', start_date: '', end_date: '', activity_detail: '' };
    dispatch(addActivity(new_activity_arr));
  };

  const certAddFields = () => {
    const new_cert_arr = { cert_name: '', publisher: '', acquisition_date: '' };
    dispatch(addCert(new_cert_arr));
  };

  const [current_tab, set_current_tab] = useState(null);

  const tab_ref = useRef({});

  const scrollToTab = (index) => {
    if (tab_ref.current[index]) {
      const targetScrollY = tab_ref.current[index].offsetTop + -75;

      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth'
      });

      set_current_tab(index);
    }
  };

  return (
    <Grid container spacing={2.5}>
      <OpenIconSpeedDial />
      <Grid item xs={1} />
      <Grid item xs={9}>
        <MainCard>
          <CardHeader title={<Typography variant="h3">이력서 작성</Typography>} />
          <Divider />
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Grid item xs={12}>
              <MainCard>
                <Typography variant="h3" sx={{ mb: 2.5 }}>
                  인적사항
                </Typography>
                <Profile />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'start'} alignItems={'center'} sx={{ mt: 2.5 }}>
                  <Typography ref={(el) => (tab_ref.current['education'] = el)} variant="h3">
                    학력
                  </Typography>
                  <IconButton onClick={() => eduAddFields()}>
                    <AddIcon />
                  </IconButton>
                </Box>
                <Divider color="#4682B4" sx={{ mb: 2.5, height: 5, width: '100%' }} />
                <Education />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'start'} alignItems={'center'} sx={{ mt: 2.5, height: '40px' }}>
                  <Typography ref={(el) => (tab_ref.current['skills'] = el)} variant="h3">
                    보유 스킬
                  </Typography>
                </Box>
                <Divider color="#4682B4" sx={{ mb: 2.5, height: 5, width: '100%' }} />
                {/* <Skills /> */}
                <ControllableStates />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'start'} alignItems={'center'} sx={{ mt: 2.5 }}>
                  <Typography ref={(el) => (tab_ref.current['career'] = el)} variant="h3">
                    경력 사항
                  </Typography>
                  <IconButton onClick={() => careerAddFields()}>
                    <AddIcon />
                  </IconButton>
                </Box>
                <Divider color="#4682B4" sx={{ mb: 2.5, height: 5, width: '100%' }} />
                <Career />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'start'} alignItems={'center'} sx={{ mt: 2.5 }}>
                  <Typography ref={(el) => (tab_ref.current['cert'] = el)} variant="h3">
                    자격증
                  </Typography>
                  <IconButton onClick={() => certAddFields()}>
                    <AddIcon />
                  </IconButton>
                </Box>
                <Divider color="#4682B4" sx={{ mb: 2.5, height: 5, width: '100%' }} />
                <Certification />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'start'} alignItems={'center'} sx={{ mt: 2.5 }}>
                  <Typography ref={(el) => (tab_ref.current['lang'] = el)} variant="h3">
                    어학 성적
                  </Typography>
                  <IconButton onClick={() => langAddFields()}>
                    <AddIcon />
                  </IconButton>
                </Box>
                <Divider color="#4682B4" sx={{ mb: 2.5, height: 5, width: '100%' }} />
                <Language />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'start'} alignItems={'center'} sx={{ mt: 2.5 }}>
                  <Typography ref={(el) => (tab_ref.current['activity'] = el)} variant="h3">
                    대외 활동
                  </Typography>
                  <IconButton onClick={() => activityAddFields()}>
                    <AddIcon />
                  </IconButton>
                </Box>
                <Divider color="#4682B4" sx={{ mb: 2.5, height: 5, width: '100%' }} />
                <Activity />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'start'} alignItems={'center'} sx={{ mt: 2.5, height: '40px' }}>
                  <Typography ref={(el) => (tab_ref.current['advantage'] = el)} variant="h3">
                    우대 사항
                  </Typography>
                </Box>
                <Divider color="#4682B4" sx={{ mb: 2.5, height: 5, width: '100%' }} />
                <Advantage />
              </MainCard>
            </Grid>
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={1}>
        <CVSide currentTab={current_tab} scrollToTab={scrollToTab} tabRef={tab_ref} />
      </Grid>

      <Grid item xs={1} />
    </Grid>
  );
};

export default CV;
