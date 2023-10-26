import { Box, Divider, Grid, IconButton, TextField } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeCareer, updateCareer } from 'store/careerSlice';
import ClearIcon from '@mui/icons-material/Clear';
import ControlledComponent from '../ControlledComponent';
const Career = () => {
  const career_data = useSelector((state) => state.career);
  const dispatch = useDispatch();

  //   console.log('career_data : ' + JSON.stringify(career_data[0].company_name));
  //   console.log('career Detail : ' + JSON.stringify(career_data[0]));

  const handleCareerChange = (e, index) => {
    const { name, value } = e.target;
    dispatch(updateCareer({ index, name, value }));
  };

  const careerRemoveFields = (index) => {
    console.log('Remove Target : ' + index);
    dispatch(removeCareer(index));
  };

  return career_data.map((field, index) => (
    <React.Fragment key={index}>
      <Grid item xs={12}>
        <Grid item xs={12} sx={{ mb: 2.5 }}>
          <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="회사 입력"
                color="primary"
                type="text"
                name="company_name"
                value={field.company_name}
                placeholder={career_data[index].company_name}
                variant="standard"
                onChange={(e) => handleCareerChange(e, index)}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="부서 입력"
                color="primary"
                type="text"
                name="cv_dept_name"
                value={field.cv_dept_name}
                placeholder={career_data[index].cv_dept_name}
                variant="standard"
                onChange={(e) => handleCareerChange(e, index)}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="직책 입력"
                color="primary"
                type="text"
                name="position"
                value={field.position}
                placeholder={career_data[index].position}
                variant="standard"
                onChange={(e) => handleCareerChange(e, index)}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="연봉"
                type="number"
                placeholder="OOOO만원"
                name="salary"
                value={field.salary}
                variant="standard"
                onChange={(e) => handleCareerChange(e, index)}
                InputProps={{
                  onBlur: (e) => {
                    const value = parseInt(e.target.value, 10);
                    if (isNaN(value) || value < 0 || value > 100000000) {
                      e.target.value = ''; // 유효하지 않은 값일 경우 입력 지우기 또는 오류 메시지 표시
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="직무"
                color="primary"
                type="text"
                variant="standard"
                name="job"
                value={field.job}
                onChange={(e) => handleCareerChange(e, index)}
              />
            </Grid>
            <Grid item xs={4}>
              <ControlledComponent labelName={'입사일'} StartDate={(e) => handleCareerChange(e, index)} name="join_date" />
            </Grid>
            <Grid item xs={4}>
              <ControlledComponent
                labelName={'퇴사일'}
                BeforeDay={field.join_date}
                EndDate={(e) => handleCareerChange(e, index)}
                name="quit_date"
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={() => careerRemoveFields(index)}>
                <ClearIcon />
              </IconButton>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12} sx={{ mb: 2.5 }}>
          <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}></Box>
        </Grid>
      </Grid>
    </React.Fragment>
  ));
};

export default Career;
