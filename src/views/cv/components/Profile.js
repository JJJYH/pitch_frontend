import { Box, Divider, Grid, IconButton, TextField, Typography } from '@mui/material';
import SmartButtonIcon from '@mui/icons-material/SmartButton';
import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Preview from '../Preview';

const Profile = () => {
  return (
    <>
      <Divider sx={{ mb: 2.5 }} />
      <Grid item xs={12}>
        <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Name"
              color="primary"
              type="text"
              defaultValue="김철수"
              variant="filled"
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Phone Number"
              color="primary"
              type="text"
              defaultValue="010-1234-5678"
              variant="filled"
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Email"
              color="primary"
              type="text"
              defaultValue="example@google.com"
              variant="filled"
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={2}>
            <MainCard>이미지</MainCard>
          </Grid>
        </Box>
      </Grid>
    </>
  );
};

export default Profile;
