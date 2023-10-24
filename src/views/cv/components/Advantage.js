{
  /* // ==============================|| 우대사항 ||============================== // */
}

import { CheckCircleOutline, CheckCircle } from '@mui/icons-material';
import { Checkbox, Divider, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Box } from '@mui/system';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAdvantage, removeAdvantage, updateAdvantage } from 'store/advantageSlice';

const Advantage = () => {
  const advantageData = useSelector((state) => state.advantage);
  const dispatch = useDispatch();

  // 병역에 대한 선택
  const militaryAdvantage = advantageData.find((item) => item.advantageName === '병역');

  // 장애에 대한 선택
  const obstacleAdvantage = advantageData.find((item) => item.advantageName === '장애');

  const handleMilitaryChange = (event) => {
    dispatch(updateAdvantage({ name: 'militaryDetail', value: event.target.value }));
  };

  const handleObstacleChange = (event) => {
    dispatch(updateAdvantage({ name: 'obstacleDetail', value: event.target.value }));
  };

  const handleConsentChange = (event) => {
    if (event.target.name === 'militaryConsent' && (militaryAdvantage.consent === '' || militaryAdvantage.consent === 'F')) {
      dispatch(updateAdvantage({ name: 'militaryConsent', value: 'T' }));
    } else if (event.target.name === 'militaryConsent' && militaryAdvantage.consent === 'T') {
      dispatch(updateAdvantage({ name: 'militaryConsent', value: 'F' }));
    }

    if (event.target.name === 'obstacleConsent' && (obstacleAdvantage.consent === '' || obstacleAdvantage.consent === 'F')) {
      dispatch(updateAdvantage({ name: 'obstacleConsent', value: 'T' }));
    } else if (event.target.name === 'obstacleConsent' && obstacleAdvantage.consent === 'T') {
      dispatch(updateAdvantage({ name: 'obstacleConsent', value: 'F' }));
    }
  };

  const advantageTypeArr = ['병역', '보훈 대상', '장애', '고용지원금 대상', '취업보호 대상'];
  const advantageDetail = {
    병역: ['군필', '미필', '면제', '해당없음'],
    장애: ['중증', '경증', '1급', '2급', '3급', '4급', '5급', '6급']
  };

  //체크 여부
  const [checkedItems, setCheckedItems] = useState([]);

  const isChecked = (event) => {
    if (checkedItems.includes(event.target.value)) {
      // 체크 해제되면 해당 항목 제거
      const index = checkedItems.indexOf(event.target.value);
      setCheckedItems(checkedItems.filter((item) => item !== event.target.value));
      dispatch(removeAdvantage(index));
      console.log('Advantage Data : ' + JSON.stringify(advantageData));
    } else {
      // 체크되면 액션 호출하여 객체 추가
      setCheckedItems((prev) => [...prev, event.target.value]);
      dispatch(addAdvantage(event.target.value));
      console.log('Advantage Data : ' + JSON.stringify(advantageData));
    }
  };

  return (
    <>
      <Divider color="#4682B4" sx={{ mb: 2.5, height: 5, width: '100%' }} />
      <Grid item xs={12}>
        <Grid item xs={12} sx={{ mb: 2.5 }}>
          <Grid item xs={12}>
            <div>
              <FormGroup row>
                {advantageTypeArr.map((type, index) => (
                  <FormControlLabel
                    key={index}
                    control={<Checkbox icon={<CheckCircleOutline />} checkedIcon={<CheckCircle />} value={type} onChange={isChecked} />}
                    label={type}
                  />
                ))}
              </FormGroup>
            </div>
          </Grid>
          {checkedItems.includes('병역') && (
            <Grid item xs={12} sx={{ mb: 2.5 }}>
              <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}>
                <Grid item xs={4}>
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">세부 사항</InputLabel>
                      <Select
                        value={checkedItems.includes('병역') ? (militaryAdvantage ? militaryAdvantage.advantageDetail : '') : ''}
                        name="militaryDetail"
                        onChange={handleMilitaryChange}
                      >
                        {advantageDetail['병역'].map((type) => (
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
                      name="militaryConsent"
                      onChange={handleConsentChange}
                    />
                  </FormGroup>
                </Grid>
              </Box>
            </Grid>
          )}

          {checkedItems.includes('장애') && (
            <Grid item xs={12}>
              <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}>
                <Grid item xs={4}>
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">세부 사항</InputLabel>
                      <Select
                        value={checkedItems.includes('장애') ? (obstacleAdvantage ? obstacleAdvantage.advantageDetail : '') : ''}
                        name="obstacleDetail"
                        onChange={handleObstacleChange}
                      >
                        {advantageDetail['장애'].map((type) => (
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
                      name="obstacleConsent"
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
