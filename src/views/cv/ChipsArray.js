import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { useDispatch } from 'react-redux';
import { removeSkill } from 'store/skillSlice';
import colors from '../../assets/scss/_themes-vars.module.scss';
const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5)
}));

export default function ChipsArray({ chipData, setChipData }) {
  const dispatch = useDispatch();

  const skillRemoveFields = (index) => {
    if (chipData.length === 1) {
      alert('At least one form must remain');
      return;
    }
    console.log('Remove Target : ' + index);
    dispatch(removeSkill(index));
  };

  return (
    <Paper
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        p: 0.5,
        m: 0
      }}
      component="ul"
    >
      {chipData.map((data, index) => {
        let icon;
        return (
          <ListItem key={index}>
            <Chip icon={icon} label={data.skill_name} color="secondary" onDelete={() => skillRemoveFields(index)} />
          </ListItem>
        );
      })}
    </Paper>
  );
}
