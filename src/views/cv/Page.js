import { Box, Card, CardHeader, Divider, Grid, IconButton, Typography } from '@mui/material';
import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import OpenIconSpeedDial from './OpenIconSpeedDial';
import Profile from './components/Profile';
import Education from './components/Education';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { useDispatch } from 'react-redux';
import { addEducation } from 'store/educationSlice';
import Skills from './components/Skills';
import Career from './components/Career';
import { addCareer } from 'store/careerSlice';
import Certification from './components/Certification';
import Language from './components/Language';
import Advantage from './components/Advantage';
const CV = () => {
  const dispatch = useDispatch();

  const eduAddFields = () => {
    const newEduArr = { eduType: '', enterDay: '', graduateDay: '', major: '', graduateType: '', totalScore: '', score: '' };
    dispatch(addEducation(newEduArr));
  };

  const careerAddFields = () => {
    const newCareerArr = { companyName: '', deptName: '', exPosition: '', salary: '', job: '', note: '' };
    dispatch(addCareer(newCareerArr));
  };

  return (
    <Grid container spacing={2.5}>
      <OpenIconSpeedDial />
      <Grid item xs={1.5}>
        Empty
      </Grid>
      <Grid item xs={7}>
        <MainCard>
          <CardHeader title={<Typography variant="h3">이력서 작성</Typography>} />
          <Divider />
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Grid item xs={12}>
              <MainCard>
                <SubCard sx={{ mb: 1, boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}>
                  <Typography variant="h3" sx={{ mb: 2.5 }}>
                    인적사항
                  </Typography>
                  <Profile />
                </SubCard>
                <SubCard sx={{ mb: 1, boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}>
                  <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                    <Typography variant="h3" sx={{ mb: 2.5 }} textAlign={'center'} alignContent={'center'}>
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
                    <Typography variant="h3" sx={{ mb: 2.5 }} textAlign={'center'} alignContent={'center'}>
                      보유 스킬
                    </Typography>
                  </Box>
                  <Skills />
                </SubCard>
                <SubCard sx={{ mb: 1, boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}>
                  <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                    <Typography variant="h3" sx={{ mb: 2.5 }} textAlign={'center'} alignContent={'center'}>
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
                    <Typography variant="h3" sx={{ mb: 2.5 }} textAlign={'center'} alignContent={'center'}>
                      자격증
                    </Typography>
                  </Box>
                  <Certification />
                </SubCard>
                <SubCard sx={{ mb: 1, boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}>
                  <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                    <Typography variant="h3" sx={{ mb: 2.5 }} textAlign={'center'} alignContent={'center'}>
                      어학 성적
                    </Typography>
                  </Box>
                  <Language />
                </SubCard>
                <SubCard sx={{ mb: 1, boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}>
                  <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                    <Typography variant="h3" sx={{ mb: 2.5 }} textAlign={'center'} alignContent={'center'}>
                      대외 활동
                    </Typography>
                  </Box>
                </SubCard>
                <SubCard sx={{ mb: 1, boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}>
                  <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                    <Typography variant="h3" sx={{ mb: 2.5 }} textAlign={'center'} alignContent={'center'}>
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
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'sticky', top: 90, width: '100%' }}>
          <MainCard sx={{ width: '100%' }}>
            <SubCard sx={{ mb: 1, boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}>Item1</SubCard>
            <SubCard sx={{ mb: 1, boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}>Item2</SubCard>
            <SubCard sx={{ mb: 1, boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}>Item3</SubCard>
          </MainCard>
        </Box>
      </Grid>

      <Grid item xs={1.5}>
        Empty
      </Grid>
    </Grid>
  );
};

export default CV;
