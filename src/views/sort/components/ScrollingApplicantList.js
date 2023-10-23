import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { FixedSizeList } from 'react-window';
import { ListItemButton, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';

import styled from 'styled-components';

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

const ScrollingApplicantList = ({height, width, itemSize}) => {
  return(
    <MyScrollingElement height={height} width={width} itemSize={itemSize} itemCount={200} overscanCount={5}>
      {renderRow}
    </MyScrollingElement>
  );
}


function renderRow(props) {
  const { index, style } = props;

  return (
    <>
      <ListItem style={style} key={index} component="div" disablePadding>
        <ListItemButton>
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </ListItemAvatar>
          <ListItemText
            primary="Oui Oui"
            secondary={
              <React.Fragment>
                <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                  Sandra Adams
                </Typography>
                {' — Do you have Paris'}
              </React.Fragment>
            }
          />
        </ListItemButton>
      </ListItem>
    </>
  );
}

export default ScrollingApplicantList;