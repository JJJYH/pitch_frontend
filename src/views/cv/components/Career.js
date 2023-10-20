import { Box, Divider, Grid, IconButton, TextField } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeCareer, updateCareer } from 'store/careerSlice';
import DisabledByDefaultOutlinedIcon from '@mui/icons-material/DisabledByDefaultOutlined';
const Career = () => {
  const careerData = useSelector((state) => state.career);
  const dispatch = useDispatch();

  //   console.log('careerData : ' + JSON.stringify(careerData[0].companyName));
  //   console.log('career Detail : ' + JSON.stringify(careerData[0]));

  const handleCareerChange = (e, index) => {
    const { name, value } = e.target;
    dispatch(updateCareer({ index, name, value }));
  };

  const careerRemoveFields = (index) => {
    if (careerData.length === 1) {
      alert('At least one form must remain');
      return;
    }
    console.log('Remove Target : ' + index);
    dispatch(removeCareer(index));
  };

  return careerData.map((field, index) => (
    <React.Fragment key={index}>
      <Divider color="#4682B4" sx={{ mb: 2.5, height: 5, width: '100%' }} />
      <Grid item xs={12}>
        <Grid item xs={12} sx={{ mb: 2.5 }}>
          <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="회사 입력"
                color="primary"
                type="text"
                name="companyName"
                value={field.companyName}
                placeholder={careerData[index].companyName}
                variant="outlined"
                onChange={(e) => handleCareerChange(e, index)}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="부서 입력"
                color="primary"
                type="text"
                name="eduType"
                value={field.eduType}
                placeholder={careerData[index].deptName}
                variant="outlined"
                onChange={(e) => handleCareerChange(e, index)}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                fullWidth
                label="직책 입력"
                color="primary"
                type="text"
                name="exPosition"
                value={field.eduType}
                placeholder={careerData[index].deptName}
                variant="outlined"
                onChange={(e) => handleCareerChange(e, index)}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                fullWidth
                label="연봉"
                type="number"
                placeholder="OOOO만원"
                name="salary"
                value={field.salary}
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
            <Grid item xs={2}>
              <TextField
                fullWidth
                label="직무"
                color="primary"
                type="text"
                variant="outlined"
                name="job"
                value={field.job}
                onChange={(e) => handleCareerChange(e, index)}
              />
            </Grid>
            <Grid item xs={3}>
              <IconButton onClick={() => careerRemoveFields(index)}>
                <DisabledByDefaultOutlinedIcon />
              </IconButton>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  ));
};

export default Career;
