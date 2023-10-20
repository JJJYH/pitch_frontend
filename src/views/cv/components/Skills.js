import { Divider, Grid } from '@mui/material';
import React from 'react';
import ControllableStates from '../ControllableStates';
import ChipsArray from '../ChipsArray';
import { useDispatch, useSelector } from 'react-redux';
import { addSkill, updateSkill } from 'store/skillSlice';
{
  /* // ==============================|| 보유 기술 ||============================== // */
}
const Skills = () => {
  const chipData = useSelector((state) => state.skill);
  const dispatch = useDispatch();

  const skillAddFields = (index, value) => {
    const newSkillArr = { skillName: '', skillDomain: '' };
    dispatch(addSkill(newSkillArr));
    // const setIndex = index + 1;
    dispatch(updateSkill({ index, value }));
  };

  return (
    <>
      <Divider color="#4682B4" sx={{ mb: 2.5, height: 5, width: '100%' }} />
      <Grid item xs={12}>
        <ControllableStates addChipData={skillAddFields} />
      </Grid>
      <Grid item xs={12}>
        <ChipsArray chipData={chipData} setChipData={skillAddFields} />
      </Grid>
    </>
  );
};

export default Skills;
