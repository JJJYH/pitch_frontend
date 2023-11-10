import React from 'react';
import { StatusChip1, StatusChip2, StatusChip3, StatusChip4, StatusChip5, StatusChip6 } from './StatusChips';
import Stack from '@mui/material/Stack';
import { useSelector } from 'react-redux';

const ChipComp = ({ selectedChips, handleChipClick }) => {
  const userId = useSelector((state) => state.userInfo.user_id);

  return (
    <Stack direction="row" spacing={1}>
      {['작성중', '요청완료', '승인', '반려', '공고중', '공고종료'].map((status, index) => (
        <React.Fragment key={index}>
          {userId !== 'admin' && status === '작성중' && (
            <StatusChip1
              label={status}
              variant={selectedChips.includes(status) ? 'selected' : 'outlined'}
              onClick={() => handleChipClick(status)}
            />
          )}
          {status === '요청완료' && (
            <StatusChip2
              label={status}
              variant={selectedChips.includes(status) ? 'selected' : 'outlined'}
              onClick={() => handleChipClick(status)}
            />
          )}
          {status === '승인' && (
            <StatusChip3
              label={status}
              variant={selectedChips.includes(status) ? 'selected' : 'outlined'}
              onClick={() => handleChipClick(status)}
            />
          )}
          {status === '반려' && (
            <StatusChip4
              label={status}
              variant={selectedChips.includes(status) ? 'selected' : 'outlined'}
              onClick={() => handleChipClick(status)}
            />
          )}
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
