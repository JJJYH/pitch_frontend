import { Box, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import DisabledByDefaultOutlinedIcon from '@mui/icons-material/DisabledByDefaultOutlined';
import { useState } from 'react';
import { useEffect } from 'react';
// import ControlledComponent from './ControlledComponent';

const EducationTest = () => {
  /**Default Setting Values */
  const graduate_type_arr = ['졸업', '졸업예정', '재학중', '중퇴', '수료', '휴학'];
  const score_arr = ['4.5', '4.0', '4.3', '100'];

  /**Test */
  const [eduformFields, setEduFormFields] = useState([
    { eduType: '', enterDay: '', graduateDay: '', major: '', graduate_type: '', totalScore: '', score: '' }
  ]);
  const handleAddField = () => {
    const values = [
      ...eduformFields,
      { eduType: '', enterDay: '', graduateDay: '', major: '', graduate_type: '', totalScore: '', score: '' }
    ];
    setEduFormFields(values);
  };

  const handleInputChange = (e, index) => {
    const values = [...eduformFields];
    console.log('Event : ' + e.target.name);
    if (e.target.name === 'eduType') {
      values[index].eduType = e.target.value;
    }
    if (e.target.name === 'enterDay') {
      values[index].enterDay = e.target.value;
    }
    if (e.target.name === 'graduateDay') {
      values[index].graduateDay = e.target.value;
    }
    if (e.target.name === 'major') {
      values[index].major = e.target.value;
    }
    if (e.target.name === 'graduate_type') {
      values[index].graduate_type = e.target.value;
    }
    if (e.target.name === 'totalScore') {
      values[index].totalScore = e.target.value;
    }
    if (e.target.name === 'score') {
      values[index].score = e.target.value;
    }

    setEduFormFields(values);
  };

  const handleRemoveFields = (index) => {
    if (eduformFields.length === 1) {
      alert('At least one form must remain');
      return;
    }
    console.log('Remove Target : ' + index);
    // const values = [...eduformFields].splice(index, 1);
    // setEduFormFields(values);
    const filteredFields = eduformFields.filter((_, i) => i !== index);
    setEduFormFields(filteredFields);
  };

  useEffect(() => {
    console.log('formFields changed:', eduformFields);
  }, [eduformFields]);

  return eduformFields.map((field, index) => (
    <React.Fragment key={index}>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="edu_type"
              color="primary"
              type="text"
              name="eduType"
              value={field.eduType}
              placeholder={eduformFields.eduType}
              variant="outlined"
              onChange={(e) => handleInputChange(e, index)}
            />
          </Grid>
          {/* <Grid item xs={4}>
            <ControlledComponent labelName={'Enter_Date'} StartDate={(e)=>handleInputChange(e,index)} name="enterDay" />
          </Grid>
          <Grid item xs={4}>
            <ControlledComponent labelName={'Graduate_Date'} BeforeDay={field.enterDay} EndDate={(e)=>handleInputChange(e,index)} name="graduateDay" />
          </Grid> */}
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Graduate Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="graduate_type"
              value={field.graduate_type}
              onChange={(e) => handleInputChange(e, index)}
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
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="major"
          color="primary"
          type="text"
          placeholder={eduformFields.major}
          variant="outlined"
          name="major"
          value={field.major}
          onChange={(e) => handleInputChange(e, index)}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="score"
          color="primary"
          type="text"
          variant="outlined"
          name="score"
          value={field.score}
          onChange={(e) => handleInputChange(e, index)}
        />
      </Grid>
      <Grid item xs={6}>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Total Score</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="totalScore"
              value={field.totalScore}
              onChange={(e) => handleInputChange(e, index)}
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
      <Grid container item xs={12}>
        <Grid item xs={6}>
          <IconButton onClick={() => handleAddField()}>
            <AddBoxOutlinedIcon />
          </IconButton>
        </Grid>
        <Grid item xs={6}>
          <IconButton onClick={() => handleRemoveFields(index)}>
            <DisabledByDefaultOutlinedIcon />
          </IconButton>
        </Grid>
      </Grid>
    </React.Fragment>
  ));
};

export default EducationTest;
