import { Grid, TextField } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import ControlledComponent from '../ControlledComponent';
{
  /* // ==============================|| 대외 활동 ||============================== // */
}
const Activity = () => {
  const [actStartDay, setActStartDay] = useState([]);

  return (
    <>
      <Grid item xs={2}>
        <TextField fullWidth label="activity_type" color="primary" type="text" defaultValue="활동 구분" variant="outlined" />
      </Grid>
      <Grid item xs={2}>
        <TextField fullWidth label="organization" color="primary" type="text" defaultValue="기관 명" variant="outlined" />
      </Grid>
      <Grid item xs={8}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <ControlledComponent labelName={'start_Date'} setJoinStartDay={setActStartDay} />
          </Grid>
          <Grid item xs={6}>
            <ControlledComponent labelName={'exit_Date'} BeforeDay={actStartDay} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="activity_detail"
          color="primary"
          type="text"
          defaultValue="활동 내용"
          variant="outlined"
          multiline
          maxRows={15}
        />
      </Grid>
    </>
  );
};

export default Activity;
