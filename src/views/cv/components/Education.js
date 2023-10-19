import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';
import ControlledComponent from '../ControlledComponent';
import { useState } from 'react';
import { Box } from '@mui/system';

const Education = () => {
  /**Edu State */
  const [eduType, setEduType] = useState(['학교 명']);
  const [enterDay, setEnterDay] = useState(['2023-05-05']);
  const [graduateDay, setGraduateDay] = useState(['2023-05-05']);
  const [major, setMajor] = useState(['전공 명']);
  const [graduate_type, setGraduateType] = React.useState('');
  const [totalScore, setTotalScore] = React.useState('');
  const [score, setScore] = React.useState('');

  /**Console Print*/
  // console.log('EduType : ' + eduType);
  // console.log('Graduate Type : ' + graduate_type);
  // console.log('EnterDate : ' + enterDay);
  console.log('GraduateDate : ' + graduateDay);
  // console.log('Major : ' + major);
  // console.log('Score : ' + score);
  // console.log('Total Score : ' + totalScore);

  /**Default Setting Values */
  const graduate_type_arr = ['졸업', '졸업예정', '재학중', '중퇴', '수료', '휴학'];
  const score_arr = ['4.5', '4.0', '4.3', '100'];

  /**교육 타입 값 변경 시 업데이트 */
  const handleChangeEduType = (event) => {
    console.log('handleChangeEduType : ');
    setEduType(event.target.value);
  };

  /**졸업 상태 값 변경 시 업데이트 */
  const handleChange = (event) => {
    setGraduateType(event.target.value);
  };

  /**총점 선택시 상태 값 업데이트*/
  const handleChangeTotalScore = (event) => {
    setTotalScore(event.target.value);
  };

  /**총점 선택시 상태 값 업데이트*/
  const handleChangeScore = (event) => {
    setScore(event.target.value);
  };
  /**전공 선택시 상태 값 업데이트*/
  const handleChangeMajor = (event) => {
    setMajor(event.target.value);
  };

  /**
   * 
   * ...eduState, {
      index: {
        edu_type: null,
        enter_date: null,
        graduate_date: null,
        graduate_type: null,
        major: null,
        totalScore: null,
        total_score: null
   */

  return (
    <>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="edu_type"
              color="primary"
              type="text"
              placeholder={eduType[0]}
              variant="outlined"
              onChange={handleChangeEduType}
            />
          </Grid>
          <Grid item xs={4}>
            <ControlledComponent labelName={'Enter_Date'} StartDate={setEnterDay} />
          </Grid>
          <Grid item xs={4}>
            <ControlledComponent labelName={'Graduate_Date'} BeforeDay={enterDay} EndDate={setGraduateDay} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Graduate Type</InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={graduate_type} onChange={handleChange}>
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
          placeholder={major[0]}
          variant="outlined"
          onChange={handleChangeMajor}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="score"
          color="primary"
          type="text"
          defaultValue={score}
          variant="outlined"
          onChange={handleChangeScore}
        />
      </Grid>
      <Grid item xs={6}>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Total Score</InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={totalScore} onChange={handleChangeTotalScore}>
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
  );
};

export default Education;
