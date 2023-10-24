import React from 'react';
import { useEffect } from 'react';
import { FixedSizeList } from 'react-window';
import styled from 'styled-components';
import { sort } from 'api.js';
import { getAge, getFormattedDate } from '../sorts.js';

/* mui components */
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { ListItemButton, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';

/* custom components */



const ScrollingApplicantList = ({height, width, itemSize, applyNo, postingNo}) => {
  const [rows, setRows] = React.useState([]);

  useEffect(() => {
    sort.applicantList(postingNo, 'A') 
      .then((res) => {
        setRows(res.data);
      });
    
  }, []);


  return(
    <MyScrollingElement 
      height={height} 
      width={width} 
      itemSize={itemSize} 
      itemCount={rows.length} 
      overscanCount={5}
    >
      {({ index, style }) => renderRow({ index, style }, rows)}
    </MyScrollingElement>
  );
}


const renderRow = ({ index, style }, rows) => {
  return (
    <>
      <ListItem style={style} key={index} component="div" disablePadding>
        <ListItemButton>
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" 
              sx={{
                height: '60px',
                width: '60px',
                mr: '15px'
            }}/>
          </ListItemAvatar>
          <ListItemText
            primary={`${rows[index].user_nm}  ${rows[index].gender}, 만 ${getAge(rows[index].user_birth)}세`}
            secondary={
              <React.Fragment>
                <Typography sx={{ display: 'inline' }} 
                  component="span" 
                  variant="body2" 
                  color="text.primary"
                >
                  {rows[index].career == 'y' ? '경력' : '신입'}
                </Typography>   
              </React.Fragment>
            }
          />
        </ListItemButton>
    </ListItem>
    </>
  );
}

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