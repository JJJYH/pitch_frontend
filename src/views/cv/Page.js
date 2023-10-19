import { Box, Card, CardHeader, Divider, Grid, Typography } from '@mui/material';
import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import OpenIconSpeedDial from './OpenIconSpeedDial';
import Profile from './components/Profile';

const CV = () => {
  return (
    <Grid container xs={12} spacing={2.5}>
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
                <SubCard sx={{ mb: 1, boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}>Item2</SubCard>
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
