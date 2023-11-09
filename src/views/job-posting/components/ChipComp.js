import React from 'react';
import { StatusChip1, StatusChip2, StatusChip3, StatusChip4, StatusChip5, StatusChip6 } from './StatusChips';
import Stack from '@mui/material/Stack';

const ChipComp = ({ selectedChips, handleChipClick }) => {
  return (
    <Stack direction="row" spacing={1}>
      {['공고중', '공고종료'].map((status, index) => (
        <React.Fragment key={index}>
          {status === '공고중' && (
            <StatusChip5
              label={status}
              variant={selectedChips.includes(status) ? 'selected' : 'outlined'}
              onClick={() => handleChipClick(status)}
            />
          )}
          {status === '공고종료' && (
            <StatusChip6
              label={status}
              variant={selectedChips.includes(status) ? 'selected' : 'outlined'}
              onClick={() => handleChipClick(status)}
            />
          )}
        </React.Fragment>
      ))}
    </Stack>
  );
};

export default ChipComp;
