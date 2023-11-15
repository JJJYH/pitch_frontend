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

const ScrollingApplicantList = ({ height, width, itemSize, list, isBtnClicked, setIsBtnClicked, setCheckedList, setOpenModal }) => {
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
    const newChecked = Array.from({ length: list.length }, (_, index) => index);
    setChecked(newChecked);
  }, [list]);

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
          <ListItemText primary={`${applicant['cv']?.user_nm}  ${applicant['cv']?.gender}, 만 ${getAge(applicant['cv']?.user_birth)}세`} />
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
