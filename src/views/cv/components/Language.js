import { Grid, TextField } from '@mui/material';
import React from 'react';
{
  /* // ==============================|| 어학 성적 ||============================== // */
}
const Language = () => {
  return (
    <>
      <Grid item xs={4}>
        <TextField fullWidth label="exam_type" color="primary" type="text" defaultValue="시험구분" variant="outlined" />
      </Grid>
      <Grid item xs={4}>
        <TextField fullWidth label="language_name" color="primary" type="text" defaultValue="어학 명" variant="outlined" />
      </Grid>
      <Grid item xs={4}>
        {/* 어학점수는 combobox */}
        <TextField fullWidth label="language_score" color="primary" type="text" defaultValue="어학 점수" variant="outlined" />
      </Grid>
    </>
  );
};

export default Language;
