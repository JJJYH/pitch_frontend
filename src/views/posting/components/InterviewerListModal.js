import * as React from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import { useState, useEffect } from 'react';

import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

import { TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
//import dayjs from 'dayjs';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
    // scrollbarWidth: "none",
    // '&::-webkit-scrollbar': {
    //     display: 'none',
    // },
    // '&-ms-overflow-style:': {
    //     display: 'none',
    // },
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

const InterviewerListModal = ({ open, close, handleInterviewers }) => {
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [expandedDepts, setExpandedDepts] = useState([]);

  // const leftChecked = intersection(checked, left);
  // const rightChecked = intersection(checked, right);
  const leftChecked = intersection(checked, left, 'user_id');
  const rightChecked = intersection(checked, right, 'user_id');

  const getDeptUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8888/admin/hire/deptusers');
      //console.log(response.data);
      //setLeft(response.data);
      const deptData = {}; // 데이터를 계층적 구조로 정리

      response.data.forEach((user) => {
        const deptName = user.department.dept_name;

        if (!deptData[deptName]) {
          deptData[deptName] = [];
        }

        deptData[deptName].push(user);
      });

      setLeft(deptData);
      console.log(deptData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDeptUsers();
  }, []);

  function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
  }

  // function intersection(a, b) {
  //   return a.filter((value) => b.indexOf(value) !== -1);
  // }
  // function intersection(a, b, prop) {
  //   return a.filter((valueA) => b.some((valueB) => valueA[prop] === valueB[prop]));
  // }
  function intersection(a, b, prop) {
    if (Array.isArray(b)) {
      return a.filter((valueA) => b.some((valueB) => valueA[prop] === valueB[prop]));
    } else {
      // b가 객체일 경우에 대한 처리
      return a.filter((valueA) => valueA[prop] === b[prop]);
    }
  }

  function union(a, b) {
    return [...a, ...not(b, a)];
  }

  // const handleToggle = (value) => () => {
  //   const currentIndex = checked.indexOf(value);
  //   const newChecked = [...checked];

  //   if (currentIndex === -1) {
  //     newChecked.push(value);
  //   } else {
  //     newChecked.splice(currentIndex, 1);
  //   }

  //   setChecked(newChecked);
  // };
  const handleToggle = (value) => () => {
    const isChecked = checked.includes(value.users.user_id);

    if (isChecked) {
      // 이미 체크된 상태이면 해당 아이템을 제거
      setChecked(checked.filter((id) => id !== value.users.user_id));
    } else {
      // 체크되지 않은 상태이면 해당 아이템을 추가
      setChecked([...checked, value.users.user_id]);
    }
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight([...right, ...left.filter((item) => checked.includes(item))]);

    setChecked([]);
  };

  const handleCheckedLeft = () => {
    setRight(right.filter((item) => !checked.includes(item)));
    setChecked([]);
  };

  const handleDeptClick = (deptName) => {
    // 부서의 가시성을 토글
    setExpandedDepts((prevExpandedDepts) => {
      if (prevExpandedDepts.includes(deptName)) {
        // 이미 펼쳐진 부서면 닫음
        return prevExpandedDepts.filter((d) => d !== deptName);
      } else {
        // 펼쳐지지 않은 부서면 열음
        return [...prevExpandedDepts, deptName];
      }
    });
  };

  // const customList = (title, items) => (
  //   <Card>
  //     <CardHeader
  //       sx={{ px: 2, py: 1 }}
  //       avatar={
  //         <Checkbox
  //           onClick={handleToggleAll(items)}
  //           checked={numberOfChecked(items) === items.length && items.length !== 0}
  //           indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
  //           disabled={items.length === 0}
  //           inputProps={{
  //             'aria-label': 'all items selected'
  //           }}
  //         />
  //       }
  //       title={title}
  //       subheader={`${numberOfChecked(items)}/${items.length} 선택`}
  //     />
  //     <Divider />
  //     <List
  //       sx={{
  //         width: 310,
  //         height: 250,
  //         bgcolor: 'background.paper',
  //         overflow: 'auto'
  //       }}
  //       dense
  //       component="div"
  //       role="list"
  //     >
  //       {items.map((value) => {
  //         const labelId = `transfer-list-all-item-${value}-label`;

  //         return (
  //           <ListItem key={value.users.user_id} role="listitem" button onClick={handleToggle(value)}>
  //             <ListItemIcon>
  //               <Checkbox
  //                 checked={checked.indexOf(value) !== -1}
  //                 tabIndex={-1}
  //                 disableRipple
  //                 inputProps={{
  //                   'aria-labelledby': labelId
  //                 }}
  //               />
  //             </ListItemIcon>
  //             <ListItemText id={labelId} primary={`${value.department.dept_name}\n ${value.users.user_nm}\n  ${value.users.user_email}`} />
  //           </ListItem>
  //         );
  //       })}
  //     </List>
  //   </Card>
  // );

  const customList = (title, items) => (
    <Card>
      <CardHeader sx={{ px: 2, py: 1 }} title={title} />
      <Divider />
      <List
        sx={{
          width: 310,
          height: 250,
          bgcolor: 'background.paper',
          overflow: 'auto'
        }}
        dense
        component="div"
        role="list"
      >
        {Object.keys(items).map((deptName) => (
          <React.Fragment key={deptName}>
            <ListItem button onClick={() => handleDeptClick(deptName)}>
              <ListItemText primary={deptName} />
            </ListItem>

            {/* 해당 부서가 펼쳐진 상태면 사용자 목록을 렌더링 */}
            {expandedDepts.includes(deptName) &&
              items[deptName].map((value) => {
                const labelId = `transfer-list-all-item-${value}-label`;

                return (
                  <ListItem key={value.users.user_id} role="listitem" button onClick={handleToggle(value)}>
                    <ListItemIcon>
                      <Checkbox
                        checked={checked.indexOf(value) !== -1}
                        // checked={checked.includes(value)}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{
                          'aria-labelledby': labelId
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={`${value.users.user_nm}\n  ${value.users.user_email}`} />
                  </ListItem>
                );
              })}
          </React.Fragment>
        ))}
      </List>
    </Card>
  );

  // const customList = (title, items) => (
  //   <Card>
  //     <CardHeader
  //       sx={{ px: 2, py: 1 }}
  //       avatar={
  //         <Checkbox
  //           onClick={handleToggleAll(items)}
  //           checked={numberOfChecked(items) === items.length && items.length !== 0}
  //           indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
  //           disabled={items.length === 0}
  //           inputProps={{
  //             'aria-label': 'all items selected'
  //           }}
  //         />
  //       }
  //       title={title}
  //       subheader={`${numberOfChecked(items)}/${items.length} 선택`}
  //     />
  //     <Divider />
  //     <List
  //       sx={{
  //         width: 310,
  //         height: 250,
  //         bgcolor: 'background.paper',
  //         overflow: 'auto'
  //       }}
  //       dense
  //       component="div"
  //       role="list"
  //     >
  //       {Object.keys(groupedLeft).map((departmentName) => (
  //         <React.Fragment key={departmentName}>
  //           <ListItem role="listitem" button onClick={() => handleDeptClick(departmentName)}>
  //             <ListItemText primary={departmentName} />
  //           </ListItem>

  //           {departmentName === selectedDept &&
  //             groupedLeft[selectedDept].map((value) => {
  //               const labelId = `transfer-list-all-item-${value}-label`;
  //               return (
  //                 <ListItem key={value.users.user_id} role="listitem" button onClick={handleToggle(value)}>
  //                   <ListItemIcon>
  //                     <Checkbox
  //                       checked={checked.indexOf(value) !== -1}
  //                       tabIndex={-1}
  //                       disableRipple
  //                       inputProps={{
  //                         'aria-labelledby': labelId
  //                       }}
  //                     />
  //                   </ListItemIcon>
  //                   <ListItemText id={labelId} primary={`${value.users.user_nm}\n  ${value.users.user_email}`} />
  //                 </ListItem>
  //               );
  //             })}
  //         </React.Fragment>
  //       ))}
  //     </List>
  //   </Card>
  // );

  return (
    <StyledDialog maxWidth="md" onClose={close} aria-labelledby="customized-dialog-title" open={open}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        <Typography sx={{ color: '#616161', fontSize: '20px', fontWeight: 'bold' }}>면접관 리스트</Typography>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={close}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500]
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers style={{ width: '800px', padding: '20px 40px' }}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item>{customList('면접관 목록', left)}</Grid>
          <Grid item>
            <Grid container direction="column" alignItems="center">
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleCheckedRight}
                disabled={leftChecked.length === 0}
                aria-label="move selected right"
              >
                &gt;
              </Button>
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleCheckedLeft}
                disabled={rightChecked.length === 0}
                aria-label="move selected left"
              >
                &lt;
              </Button>
            </Grid>
          </Grid>
          <Grid item>{customList('선택 목록', right)}</Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          variant="contained"
          style={{ backgroundColor: '#38678f', marginRight: '2px' }}
          onClick={() => {
            console.log(right);
            close();
            handleInterviewers(right);
          }}
        >
          등록
        </Button>
        <Button
          variant="outlined"
          style={{
            borderColor: '#38678f',
            color: '#38678f',
            marginRight: '10px'
          }}
          onClick={close}
        >
          취소
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default InterviewerListModal;
