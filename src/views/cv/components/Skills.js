import { Grid } from '@mui/material';
import React from 'react';
import ControllableStates from '../ControllableStates';
import ChipsArray from '../ChipsArray';
{
  /* // ==============================|| 보유 기술 ||============================== // */
}
const Skills = () => {
  const [chipData, setChipData] = React.useState([
    { key: 0, label: 'Angular' },
    { key: 1, label: 'jQuery' },
    { key: 2, label: 'Polymer' },
    { key: 3, label: 'React' },
    { key: 4, label: 'Vue.js' }
  ]);

  const [value, setValue] = React.useState();
  const [inputValue, setInputValue] = React.useState('');

  const addChipData = (value) => {
    // 새로운 칩 데이터를 생성
    const newChip = {
      key: Date.now(), // 현재 시간을 사용하여 고유한 키 생성
      label: value
    };

    // 이전 칩 데이터와 새로운 칩 데이터를 합친 후 상태를 업데이트
    setChipData((prev) => [...prev, newChip]);
  };
  return (
    <>
      <Grid item xs={12}>
        <ControllableStates
          value={value}
          setValue={setValue}
          inputValue={inputValue}
          setInputValue={setInputValue}
          addChipData={addChipData}
        />
      </Grid>
      <Grid item xs={12}>
        <ChipsArray chipData={chipData} setChipData={setChipData} />
      </Grid>
    </>
  );
};

export default Skills;
