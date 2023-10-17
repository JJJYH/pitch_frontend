import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5)
}));

export default function ChipsArray(props) {
  const { chipData, setChipData } = props;

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
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
      {chipData.map((data) => {
        let icon;
        return (
          <ListItem key={data.key}>
            <Chip icon={icon} label={data.label} onDelete={handleDelete(data)} />
          </ListItem>
        );
      })}
    </Paper>
  );
}
