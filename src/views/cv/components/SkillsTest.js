import { Chip, Divider, Grid } from '@mui/material';
import React from 'react';
import ControllableStates from './Skills';
import ChipsArray from '../ChipsArray';
import { useDispatch, useSelector } from 'react-redux';
import { addSkill, removeSkill, updateSkill } from 'store/skillSlice';
import classNames from './Skills.module.scss';
{
  /* // ==============================|| 보유 기술 ||============================== // */
}
const Skills = () => {
  const chip_data = useSelector((state) => state.skill);
  const dispatch = useDispatch();

  const skillAddFields = (index, value) => {
    const new_skill_arr = { skill_name: '', skill_domain: '' };
    dispatch(addSkill(new_skill_arr));
    // const setIndex = index + 1;
    dispatch(updateSkill({ index, value }));
  };

  return (
    <>
      <Grid item xs={12}>
        <div
          className={classNames.skillsRoot}
          style={{
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            gap: '10px',
            padding: '10px',
            marginBottom: '20px'
          }}
        >
          {chip_data.map((item, index) => {
            return (
              <Chip
                key={index}
                label={item.skill_name}
                color="secondary"
                onDelete={() => {
                  dispatch(removeSkill(index));
                }}
              />
            );
          })}
          <ControllableStates addChipData={skillAddFields} />
        </div>
      </Grid>
    </>
  );
};

export default Skills;
