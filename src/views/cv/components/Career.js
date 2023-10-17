import { Grid, TextField } from '@mui/material';
import React from 'react';
import ControlledComponent from '../ControlledComponent';
import { useState } from 'react';
{
  /* // ==============================|| 경력사항 ||============================== // */
}
const Career = () => {
  const [joinStartDay, setJoinStartDay] = useState(['2023-05-05']);
  return (
    <>
      {/* 이전 회사 */}
      <Grid item xs={3}>
        <TextField
          fullWidth
          label="company_name"
          color="primary"
          type="text"
          defaultValue=" AhnLab"
          variant="outlined"
          inputProps={{ readOnly: false }}
        />
      </Grid>
      {/* 이전 부서 */}
      <Grid item xs={3}>
        <TextField
          fullWidth
          label="dept_name"
          color="primary"
          type="text"
          defaultValue="CERT"
          variant="outlined"
          inputProps={{ readOnly: false }}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          fullWidth
          label="position"
          color="primary"
          type="text"
          defaultValue="선임 연구원"
          variant="outlined"
          inputProps={{ readOnly: false }}
        />
      </Grid>

      <Grid item xs={3}>
        <TextField
          fullWidth
          label="salary"
          InputProps={{
            onBlur: (e) => {
              const value = parseInt(e.target.value, 10);
              if (isNaN(value) || value < 0 || value > 100000000) {
                e.target.value = ''; // 유효하지 않은 값일 경우 입력 지우기 또는 오류 메시지 표시
              }
            }
          }}
          type="number"
          placeholder="OOOO만원"
        />
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="job"
              color="primary"
              type="text"
              defaultValue="보안 관제"
              variant="outlined"
              inputProps={{ readOnly: false }}
            />
          </Grid>
          <Grid item xs={4}>
            <ControlledComponent labelName={'start_Date'} setJoinStartDay={setJoinStartDay} />
          </Grid>
          <Grid item xs={4}>
            <ControlledComponent labelName={'exit_Date'} BeforeDay={joinStartDay} />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="note"
          color="primary"
          type="text"
          placeholder="담당하신 업무와 성과에 대해 간단명료하게 적어주세요."
          multiline
          maxRows={15}
          variant="outlined"
        />
      </Grid>
    </>
  );
};

export default Career;
