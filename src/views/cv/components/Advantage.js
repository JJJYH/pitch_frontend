{
  /* // ==============================|| 우대사항 ||============================== // */
}

import { CheckCircleOutline, CheckCircle } from '@mui/icons-material';
import { Checkbox, Divider, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Box } from '@mui/system';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAdvantage, removeAdvantage, updateAdvantage } from 'store/advantageSlice';

const Advantage = () => {
  const advantage_data = useSelector((state) => state.advantage);
  const dispatch = useDispatch();

  // 병역에 대한 선택
  const military_advantage = advantage_data.find((item) => item.advantage_type === '병역');

  // 장애에 대한 선택
  const obstacle_advantage = advantage_data.find((item) => item.advantage_type === '장애');

  const handleMilitaryChange = (event) => {
    dispatch(updateAdvantage({ name: 'military_detail', value: event.target.value }));
  };

  const handleObstacleChange = (event) => {
    dispatch(updateAdvantage({ name: 'obstacle_detail', value: event.target.value }));
  };

  const handleConsentChange = (event) => {
    if (event.target.name === 'military_consent' && (military_advantage.consent === '' || military_advantage.consent === 'F')) {
      dispatch(updateAdvantage({ name: 'military_consent', value: 'T' }));
    } else if (event.target.name === 'military_consent' && military_advantage.consent === 'T') {
      dispatch(updateAdvantage({ name: 'military_consent', value: 'F' }));
    }
    if (event.target.name === 'obstacle_consent' && (obstacle_advantage.consent === '' || obstacle_advantage.consent === 'F')) {
      dispatch(updateAdvantage({ name: 'obstacle_consent', value: 'T' }));
    } else if (event.target.name === 'obstacle_consent' && obstacle_advantage.consent === 'T') {
      dispatch(updateAdvantage({ name: 'obstacle_consent', value: 'F' }));
    }
  };

  const advantage_type_arr = ['병역', '보훈 대상', '장애', '고용지원금 대상', '취업보호 대상'];
  const advantage_detail = {
    병역: ['군필', '미필', '면제', '해당없음'],
    장애: ['중증', '경증', '1급', '2급', '3급', '4급', '5급', '6급']
  };
  useEffect(() => {
    set_checked_items(advantage_data);
  }, []);
  //체크 여부
  const [checked_items, set_checked_items] = useState([]);

  const isChecked = (event) => {
    if (checked_items.includes(event.target.value)) {
      // 체크 해제되면 해당 항목 제거
      const index = checked_items.indexOf(event.target.value);
      set_checked_items(checked_items.filter((item) => item !== event.target.value));
      dispatch(removeAdvantage(index));
    } else {
      // 체크되면 액션 호출하여 객체 추가
      set_checked_items((prev) => [...prev, event.target.value]);
      dispatch(addAdvantage(event.target.value));
    }
  };

  console.log('CHECK ADVANATGE: ' + checked_items);

  return (
    <>
      <Grid item xs={12}>
        <Grid item xs={12} sx={{ mb: 2.5 }}>
          <Grid item xs={12}>
            <div>
              <FormGroup row>
                {advantage_type_arr.map((type, index) => (
                  <FormControlLabel
                    key={index}
                    control={<Checkbox icon={<CheckCircleOutline />} checkedIcon={<CheckCircle />} value={type} onChange={isChecked} />}
                    label={type}
                  />
                ))}
              </FormGroup>
            </div>
          </Grid>
          {checked_items.includes('병역') && (
            <Grid item xs={12} sx={{ mb: 2.5 }}>
              <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}>
                <Grid item xs={4}>
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">병역 상태</InputLabel>
                      <Select
                        value={checked_items.includes('병역') ? (military_advantage ? military_advantage.advantage_detail : '') : ''}
                        name="military_detail"
                        onChange={handleMilitaryChange}
                        variant="standard"
                      >
                        {advantage_detail['병역'].map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid item xs={4}>
                  <FormGroup row>
                    <FormControlLabel
                      control={<Checkbox icon={<CheckCircleOutline />} checkedIcon={<CheckCircle />} />}
                      label={'수집동의'}
                      name="military_consent"
                      onChange={handleConsentChange}
                    />
                  </FormGroup>
                </Grid>
              </Box>
            </Grid>
          )}

          {checked_items.includes('장애') && (
            <Grid item xs={12}>
              <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}>
                <Grid item xs={4}>
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">장애 등급</InputLabel>
                      <Select
                        value={checked_items.includes('장애') ? (obstacle_advantage ? obstacle_advantage.advantage_detail : '') : ''}
                        name="obstacle_detail"
                        onChange={handleObstacleChange}
                        variant="standard"
                      >
                        {advantage_detail['장애'].map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid item xs={4}>
                  <FormGroup row>
                    <FormControlLabel
                      control={<Checkbox icon={<CheckCircleOutline />} checkedIcon={<CheckCircle />} />}
                      label={'수집동의'}
                      name="obstacle_consent"
                      onChange={handleConsentChange}
                    />
                  </FormGroup>
                </Grid>
              </Box>
            </Grid>
          )}
          {/* </Box> */}
        </Grid>
      </Grid>
    </>
  );
};

export default Advantage;
