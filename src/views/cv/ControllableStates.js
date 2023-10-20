import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import skiilDummy from '../../skillDummy.json';
const options = skiilDummy.skill;

export default function ControllableStates({ addChipData }) {
  const [textValue, setTextValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const chipData = useSelector((state) => state.skill);
  const chipLength = chipData.length;
  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setTextValue(newValue);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && inputValue) {
      console.log('ChipLength : ' + chipLength);
      addChipData(chipLength, inputValue);
      setInputValue(''); // 입력 필드 초기화
    }
  };

  return (
    <div>
      <br />
      <Autocomplete
        value={textValue}
        freeSolo
        onChange={(event, newValue) => {
          setTextValue(newValue);
          console.log('TextValue :' + textValue);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
          console.log('InputValue :' + inputValue);
        }}
        id="controllable-states-demo"
        options={options}
        renderInput={(params) => (
          <TextField {...params} fullWidth label="보유 기술" onKeyDown={handleKeyPress} onChange={handleInputChange} />
        )}
      />
    </div>
  );
}
