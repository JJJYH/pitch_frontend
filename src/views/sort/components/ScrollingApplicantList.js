import React from 'react';
import { useEffect, useState } from 'react';
import { FixedSizeList } from 'react-window';
import styled from 'styled-components';
import { sort } from 'api.js';
import { getAge } from '../sorts.js';
import { useNavigate } from "react-router-dom";

/* mui components */
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { ListItemButton, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';

/* custom components */



const ScrollingApplicantList = ({height, width, itemSize, clickedBtn, postingNo, applyNo}) => {
  const [rows, setRows] = React.useState([]);
  const [selectedApplyNo, setSelectedApplyNo] = useState(applyNo);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    sort.applicantList(postingNo, 'A') 
      .then((res) => {
        setRows(res.data);
        setSelectedIndex(getIndex(res.data, applyNo));
      });
      setSelectedApplyNo(applyNo);
  }, []);

  useEffect((e) => {
    setNextIndex(clickedBtn);
    console.log('clicked');
  }, [clickedBtn]);

  const handleItemClick = (e, applyNo, index) => {
    setSelectedApplyNo(applyNo);
    setSelectedIndex(index);
    navigate(`/manage/${postingNo}/sort/${applyNo}/detail`);
  };

  return(
    <MyScrollingElement 
      height={height} 
      width={width} 
      itemSize={itemSize} 
      itemCount={rows.length} 
      overscanCount={5}
    >
      {({ index, style }) => renderRow({ index, style }, rows, handleItemClick, selectedApplyNo)}
    </MyScrollingElement>
  );
}


const renderRow = ({ index, style }, rows, handleItemClick, selectedApplyNo) => {
  return (
    <>
      <ListItem style={style} component="div" disablePadding
        onClick={(event) =>{ 
          handleItemClick(event, rows[index].apply_no, index) 
      }}>
        <ListItemButton selected={selectedApplyNo == rows[index].apply_no}>
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


const getIndex = (rows, applyNo) => rows.findIndex((row) => row.apply_no == applyNo);

const setNextIndex = (op) => {
  console.log(op)
  if(op == '-') {
    console.log('----');
  } else if(op == '+') {
    console.log('++++');
  }
}

export default ScrollingApplicantList;