import { Box, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import DisabledByDefaultOutlinedIcon from '@mui/icons-material/DisabledByDefaultOutlined';
import { useState } from 'react';
import { useEffect } from 'react';
import ControlledComponent from '../ControlledComponent';
import { useSelector, useDispatch } from 'react-redux';
import { addEducation, removeEducation, updateEducation } from 'store/educationSlice';

const Education = () => {
  /**Default Setting Values */
  const graduateTypeArr = ['졸업', '졸업예정', '재학중', '중퇴', '수료', '휴학'];
  const scoreArr = ['4.5', '4.0', '4.3', '100'];

  const educationData = useSelector((state) => state.education);
  const dispatch = useDispatch();

  console.log('EducationData : ' + JSON.stringify(educationData[0].eduType));
  console.log('Education Detail : ' + JSON.stringify(educationData[0]));

  const handleEduChange = (e, index) => {
    const { name, value } = e.target;
    dispatch(updateEducation({ index, name, value }));
  };

  const eduRemoveFields = (index) => {
    if (educationData.length === 1) {
      alert('At least one form must remain');
      return;
    }
    console.log('Remove Target : ' + index);
    dispatch(removeEducation(index));
  };

  useEffect(() => {
    console.log('formFields changed:', educationData);
  }, [educationData]);

  return educationData.map((field, index) => (
    <React.Fragment key={index}>
      <Divider sx={{ mb: 2.5 }} />
      <Grid item xs={12}>
        <Grid item xs={12} sx={{ mb: 2.5 }}>
          <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="학교 입력"
                color="primary"
                type="text"
                name="eduType"
                value={field.eduType}
                placeholder={educationData[index].eduType}
                variant="outlined"
                onChange={(e) => handleEduChange(e, index)}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="전공"
                color="primary"
                type="text"
                placeholder={educationData[index].major}
                variant="outlined"
                name="major"
                value={field.major}
                onChange={(e) => handleEduChange(e, index)}
              />
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel>졸업 상태</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="졸업 상태"
                    name="graduateType"
                    value={field.graduateType}
                    onChange={(e) => handleEduChange(e, index)}
                  >
                    {graduateTypeArr.map((type, index) => (
                      <MenuItem key={index} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12} sx={{ mb: 2.5 }}>
          <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}>
            <Grid item xs={3}>
              <ControlledComponent labelName={'입학일'} StartDate={(e) => handleEduChange(e, index)} name="enterDay" />
            </Grid>
            <Grid item xs={3}>
              <ControlledComponent
                labelName={'졸업일'}
                BeforeDay={field.enterDay}
                EndDate={(e) => handleEduChange(e, index)}
                name="graduateDay"
              />
            </Grid>

            <Grid item xs={2}>
              <TextField
                fullWidth
                label="점수"
                color="primary"
                type="text"
                variant="outlined"
                name="score"
                value={field.score}
                onChange={(e) => handleEduChange(e, index)}
              />
            </Grid>
            <Grid item xs={2}>
              <Box>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">총점</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="totalScore"
                    value={field.totalScore}
                    onChange={(e) => handleEduChange(e, index)}
                  >
                    {scoreArr.map((type, index) => (
                      <MenuItem key={index} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={3} justifyContent={'end'}>
              <IconButton onClick={() => eduRemoveFields(index)}>
                <DisabledByDefaultOutlinedIcon />
              </IconButton>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  ));
};

export default Education;
