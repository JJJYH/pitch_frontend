import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import skiilDummy from '../../../skillDummy.json';
import { Chip, Paper, Popper } from '@mui/material';
import { addSkill, removeSkill, updateSkill } from 'store/skillSlice';

const options = skiilDummy.skill;

export default function ControllableStates() {
  const dispatch = useDispatch();
  const chip_data = useSelector((state) => state.skill);
  const chipLength = chip_data.length;
  const [inputValue, setInputValue] = useState('');

  const skillAddFields = (index, value) => {
    if (chip_data.some((skill) => skill.skill_name !== value)) {
      const new_skill_arr = { skill_name: value, skill_domain: '개발' };

      setInputValue(''); // 입력 필드 초기화
      dispatch(addSkill(new_skill_arr));
      dispatch(updateSkill({ index, value }));
    }
  };

  const skillRemoveFields = (index) => {
    console.log('Remove Target : ' + index);
    console.log('Current State: ' + JSON.stringify(chip_data));
    dispatch(removeSkill(index));
  };

  const handleKeyPress = (event) => {
    // console.log('Event : ' + event.key);
    if (event.key === 'Enter' && inputValue) {
      skillAddFields(chipLength, inputValue);
    }
  };

  return (
    <>
      <Autocomplete
        multiple
        options={options}
        value={chip_data.map((item) => item.skill_name)}
        freeSolo
        onChange={(event, newValue) => {
          const selectedValue = newValue[newValue.length - 1];
          if (selectedValue && event.key !== 'Backspace') {
            const isDuplicate = chip_data.some((skill) => skill.skill_name === selectedValue);
            if (selectedValue && !isDuplicate) {
              skillAddFields(chipLength, selectedValue);
            }
          }
        }}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={index}
              variant="filled"
              color="secondary"
              label={option}
              onDelete={() => skillRemoveFields(index)}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="보유 스킬을 입력해주세요."
            value={inputValue}
            onKeyDown={handleKeyPress}
            onChange={(e) => {
              setInputValue('');
            }} // 입력값을 업데이트
          />
        )}
      />
    </>
  );
}
