import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';

import { Card, Grid, IconButton, Typography } from '@mui/material';
// import SmartButtonIcon from '@mui/icons-material/SmartButton';
import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';

const AddButton = () => {
  //Eslint Error 회피

  const componentHandlr = () => {};

  return (
    <>
      <Card sx={{ width: '30vw', m: 3, position: 'fixed' }}>
        <MainCard>
          <Grid item xs={12}>
            <SubCard title="학력">
              <Grid container spacing={3}>
                <Grid item>
                  <Typography variant="h3">학력 추가</Typography>
                </Grid>
                <Grid item>
                  <IconButton onClick={componentHandlr}>
                    <AddBoxOutlinedIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </SubCard>
            <SubCard title="경력사항">
              <Grid container spacing={3}>
                <Grid item>
                  <Typography variant="h3">경력사항 추가</Typography>
                </Grid>
                <Grid item>
                  <IconButton onClick={componentHandlr}>
                    <AddBoxOutlinedIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </SubCard>
            <SubCard title="자격증">
              <Grid container spacing={3}>
                <Grid item>
                  <Typography variant="h3">자격증 추가</Typography>
                </Grid>
                <Grid item>
                  <IconButton onClick={componentHandlr}>
                    <AddBoxOutlinedIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </SubCard>
            <SubCard title="어학성적">
              <Grid container spacing={3}>
                <Grid item>
                  <Typography variant="h3">어학성적 추가</Typography>
                </Grid>
                <Grid item>
                  <IconButton onClick={componentHandlr}>
                    <AddBoxOutlinedIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </SubCard>
            <SubCard title="대외활동">
              <Grid container spacing={3}>
                <Grid item>
                  <Typography variant="h3">대외활동 추가</Typography>
                </Grid>
                <Grid item>
                  <IconButton onClick={componentHandlr}>
                    <AddBoxOutlinedIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </SubCard>
          </Grid>
        </MainCard>
      </Card>
    </>
  );
};

export default AddButton;
