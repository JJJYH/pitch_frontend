import React from 'react';
import { useEffect, useState } from 'react';
import { FixedSizeList } from 'react-window';
import styled from 'styled-components';
import { sort } from 'api.js';
import { getAge, getImage } from '../sorts.js';

/* mui components */
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { ListItemButton, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import { Box } from '@mui/system';

/* custom components */

const ScrollingApplicantList = ({ height, width, itemSize, list, isBtnClicked, setIsBtnClicked, total, setOpenModal }) => {
  const [checked, setChecked] = React.useState([]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  useEffect(() => {
    if (total > 0) {
      const sortedList = [...list];
      sortedList.sort((a, b) => a.score - b.score);

      const newChecked = sortedList.slice(0, total).map((applicant) => list.indexOf(applicant));
      setChecked(newChecked);
    } else {
      setChecked([]);
    }
  }, [list, total]);

  useEffect(() => {
    const tempList = [];
    if (isBtnClicked) {
      checked.map((index) => {
        tempList.push(list[index].apply_no);
      });

      sort.applicantHandle('fail', tempList).then((res) => {
        setIsBtnClicked(false);
        setOpenModal(false);
      });
    }
  }, [isBtnClicked]);

  return (
    <MyScrollingElement height={height} width={width} itemSize={itemSize} itemCount={list.length} overscanCount={5}>
      {({ index, style }) => renderRow({ index, style }, list, handleToggle, checked)}
    </MyScrollingElement>
  );
};

const renderRow = ({ index, style }, list, handleToggle, checked) => {
  const labelId = `checkbox-list-label-${index}`;
  const applicant = list[index];

  return (
    <>
      <ListItem style={style} component="div" disablePadding>
        <ListItemButton
          onClick={() => {
            handleToggle(index)();
          }}
        >
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={checked.indexOf(index) !== -1}
              tabIndex={-1}
              disableRipple
              inputProps={{ 'aria-labelledby': labelId }}
              sx={{
                color: '#38678f',
                '&.Mui-checked': {
                  color: '#38678f'
                }
              }}
            />
          </ListItemIcon>
          <ListItemAvatar>
            <Avatar
              alt="Profile"
              src={applicant.picture && getImage(applicant.picture)}
              sx={{
                height: '60px',
                width: '60px',
                mr: '15px',
                backgroundColor: 'white'
              }}
            />
          </ListItemAvatar>
          <ListItemText
            primary={`${applicant['cv']?.user_nm}  (${applicant['cv']?.gender.charAt(0)}), 만 ${getAge(applicant['cv']?.user_birth)}세`}
          />
          <Box>
            <Typography
              sx={{ display: 'inline', mr: '3px' }}
              component="span"
              variant="h3"
              color={applicant.score > 59 ? '#52af77' : applicant.score > 39 ? 'text.primary' : 'indianred'}
            >
              {applicant.score}
            </Typography>
            <Typography sx={{ display: 'inline', mr: '20px' }} component="span" variant="h3" color="text.primary">
              점
            </Typography>
          </Box>
        </ListItemButton>
      </ListItem>
    </>
  );
};

const MyScrollingElement = styled(FixedSizeList)(() => ({
  overflow: 'auto',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  '&-ms-overflow-style:': {
    display: 'none'
  }
}));

export default ScrollingApplicantList;
