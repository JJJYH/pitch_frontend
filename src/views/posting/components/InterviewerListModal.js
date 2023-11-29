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

  const getDeptUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8888/admin/hire/deptusers');
      //console.log(response.data);
      //setLeft(response.data);
      const deptData = {};

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

  const handleToggle = (deptName, user) => {
    const isChecked = checked.some((item) => item.users.user_id === user.users.user_id);

    if (isChecked) {
      setChecked(checked.filter((item) => item.users.user_id !== user.users.user_id));
    } else {
      setChecked([...checked, user]);
    }
    console.log(checked);
  };

  const handleDeptClick = (deptName) => {
    setExpandedDepts((prevExpandedDepts) => {
      if (prevExpandedDepts.includes(deptName)) {
        return prevExpandedDepts.filter((d) => d !== deptName);
      } else {
        return [...prevExpandedDepts, deptName];
      }
    });
  };

  const handleMoveRight = () => {
    setRight((prevRight) => [...prevRight, ...checked]);

    setChecked([]);
    console.log(right);
  };

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

            {expandedDepts.includes(deptName) &&
              items[deptName].map((user) => (
                <ListItem key={user.users.user_id} role="listitem" onClick={() => handleToggle(deptName, user)}>
                  <ListItemIcon>
                    <Checkbox disableRipple />
                  </ListItemIcon>
                  <ListItemText primary={`${user.users.user_nm}\n  ${user.users.user_email}`} />
                </ListItem>
              ))}
          </React.Fragment>
        ))}
      </List>
    </Card>
  );

  const customList2 = (title, items) => (
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
        {items.map((user) => (
          <ListItem key={user.users.user_id} role="listitem" onClick={() => handleToggle(deptName, user)}>
            <ListItemIcon>
              <Checkbox disableRipple />
            </ListItemIcon>
            <ListItemText primary={`${user.department.dept_name}\n${user.users.user_nm}\n  ${user.users.user_email}`} />
          </ListItem>
        ))}
      </List>
    </Card>
  );

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
                sx={{ my: 0.5, color: '#38678f', borderColor: '#38678f' }}
                variant="outlined"
                size="small"
                onClick={handleMoveRight}
                disabled={checked.length === 0}
                aria-label="move selected right"
              >
                &gt;
              </Button>

              <Button
                sx={{ my: 0.5, color: '#38678f', borderColor: '#38678f' }}
                variant="outlined"
                size="small"
                disabled={checked.length === 0}
                // onClick={handleMoveLeft}
                aria-label="move selected left"
              >
                &lt;
              </Button>
            </Grid>
          </Grid>
          <Grid item>{customList2('선택 목록', right)}</Grid>
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
