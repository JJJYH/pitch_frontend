import { Box, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import DisabledByDefaultOutlinedIcon from '@mui/icons-material/DisabledByDefaultOutlined';
import { useState } from 'react';
import { useEffect } from 'react';
import ControlledComponent from '../ControlledComponent';
import { useSelector, useDispatch } from 'react-redux';
import { addEducation, removeEducation, updateEducation } from 'store/educationSlice';
import ClearIcon from '@mui/icons-material/Clear';
const Education = () => {
  /**Default Setting Values */
  const graduate_type_arr = ['졸업', '졸업예정', '재학중', '중퇴', '수료', '휴학', '편입'];
  const score_arr = ['4.0', '4.3', '4.5', '100'];

  const education_data = useSelector((state) => state.education);
  const dispatch = useDispatch();

  const handleEduChange = (e, index) => {
    const { name, value } = e.target;
    dispatch(updateEducation({ index, name, value }));
  };

  const eduRemoveFields = (index) => {
    if (education_data.length === 1) {
      alert('At least one form must remain');
      return;
    }
    dispatch(removeEducation(index));
  };

  return education_data.map((field, index) => (
    <React.Fragment key={index}>
      <Grid item xs={12}>
        <Grid item xs={12} sx={{ mb: 2.5 }}>
          <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }} justifyContent={'space-between'} alignItems={'end'}>
            <Grid item xs={2}>
              <TextField
                fullWidth
                label="학교 입력"
                color="primary"
                type="text"
                name="edu_type"
                value={field.edu_type}
                placeholder={education_data[index].edu_type}
                variant="standard"
                onChange={(e) => handleEduChange(e, index)}
                size="small"
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                fullWidth
                label={field.edu_type.includes('대학교') ? '전공' : '계열'}
                color="primary"
                type="text"
                placeholder={education_data[index].major}
                variant="standard"
                name="major"
                value={field.major}
                onChange={(e) => handleEduChange(e, index)}
                size="small"
              />
            </Grid>
            {field.edu_type.includes('대학교') ? (
              <>
                <Grid item xs={1}>
                  <TextField
                    fullWidth
                    label="점수"
                    color="primary"
                    type="text"
                    variant="standard"
                    name="score"
                    value={field.score}
                    onChange={(e) => handleEduChange(e, index)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={1}>
                  <Box>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">총점</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        label="총점"
                        id="demo-simple-select"
                        variant="standard"
                        name="total_score"
                        value={field.total_score}
                        onChange={(e) => handleEduChange(e, index)}
                      >
                        {score_arr.map((type, index) => (
                          <MenuItem key={index} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </>
            ) : (
              ''
            )}

            <Grid item xs={2}>
              <ControlledComponent
                labelName={'입학일'}
                StartDate={(e) => handleEduChange(e, index)}
                name="enter_date"
                propState={field.enter_date}
              />
            </Grid>
            <Grid item xs={2}>
              <ControlledComponent
                labelName={'졸업일'}
                BeforeDay={field.enter_date}
                EndDate={(e) => handleEduChange(e, index)}
                name="graduate_date"
                propState={field.graduate_date}
              />
            </Grid>
            <Grid item xs={2}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel>졸업 상태</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="졸업 상태"
                    name="graduate_type"
                    variant="standard"
                    value={field.graduate_type}
                    onChange={(e) => handleEduChange(e, index)}
                  >
                    {graduate_type_arr.map((type, index) => (
                      <MenuItem key={index} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={1} sx={{ justifyContent: 'end', display: 'flex', flexDirection: 'row' }}>
              <IconButton onClick={() => eduRemoveFields(index)}>
                <ClearIcon />
              </IconButton>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  ));
};

export default Education;
