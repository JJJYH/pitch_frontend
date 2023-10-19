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
const CV = () => {
  const dispatch = useDispatch();

  const handleAddField = () => {
    const newArr = { eduType: 'document', enterDay: '', graduateDay: '', major: '', graduateType: '', totalScore: '', score: '' };
    dispatch(addEducation(newArr));
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
                    <IconButton onClick={() => handleAddField()}>
                      <AddBoxOutlinedIcon />
                    </IconButton>
                  </Box>
                  <Education />
                  {/* <EducationTest /> */}
                </SubCard>
                <SubCard sx={{ mb: 1, boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}>Item3</SubCard>
              </MainCard>
            </Grid>
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={2}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
