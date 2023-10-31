import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { sort } from 'api';
import { evalSub } from '../sorts';

/* mui components */
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Box, Grid, InputAdornment, Rating, TextField, Tooltip } from '@mui/material';
import AssignmentIndRoundedIcon from '@mui/icons-material/AssignmentIndRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

const InterviewEvalModal = ({ applyNo }) => {
  const posting = useSelector((state) => state.posting);
  const userInfo = useSelector((state) => state.userInfo);
  const [open, setOpen] = useState(false);
  const [noteArea, setNoteArea] = useState('');
  const theme = useTheme();
  const [evalScore, setEvalScore] = useState({
    sub1: 0,
    sub2: 0,
    sub3: 0,
    sub4: 0,
    sub5: 0
  });

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const onClickEval = () => {
    const data = {
      user_id: userInfo.user_id,
      note: noteArea,
      apply_no: applyNo,
      job_req_no: posting.reqNo,
      sub1_score: evalScore.sub1,
      sub2_score: evalScore.sub2,
      sub3_score: evalScore.sub3,
      sub4_score: evalScore.sub4,
      sub5_score: evalScore.sub5
    };
    sort.applicantEval(data).then((res) => {
      handleClose();
    });
  };

  return (
    <div>
      <Button
        variant="contained"
        size="medium"
        style={{ marginRight: '5px', borderColor: '#38678f', background: '#38678f' }}
        onClick={handleOpen}
      >
        평가등록
      </Button>
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth={'sm'}>
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }} id="customized-dialog-title">
          <AssignmentIndRoundedIcon />
          <Typography variant="h4">면접 평가</Typography>
          <IconButton aria-label="setting" size="large"></IconButton>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          dividers
          sx={{
            minWidth: '500px',
            minHeight: '500px',
            maxHeight: '900px',
            overflow: 'hidden'
          }}
        >
          <Grid
            container
            direction={'column'}
            spacing={2}
            sx={{
              // '& .MuiTypography-root': { ml: '30px' },
              '& .MuiRating-root': { ml: '20px' },
              '& .MuiBox-root': { display: 'flex', alignItems: 'end', justifyContent: 'space-between' },
              '& .MuiFormControl-root': { mr: '40px' }
            }}
          >
            {evalSub.map((row, index) => {
              const subKey = 'sub' + (index + 1);
              return (
                <Grid item key={index}>
                  <Box
                    sx={{
                      display: 'inline'
                    }}
                  >
                    <Tooltip title={row.description} placement="right">
                      <Typography component="legend">{row.sub}</Typography>
                    </Tooltip>
                  </Box>
                  <Box
                    sx={{
                      '& .MuiInputBase-input': { textAlign: 'end', maxWidth: '60px' }
                    }}
                  >
                    <Rating
                      size="large"
                      name="simple-controlled"
                      value={evalScore[subKey]}
                      onChange={(event, newValue) => {
                        setEvalScore({ ...evalScore, [subKey]: newValue });
                      }}
                      precision={0.5}
                    />
                    <TextField
                      id="standard-number"
                      label="점수"
                      type="number"
                      value={evalScore[subKey]}
                      onChange={(event) => {
                        setEvalScore({ ...evalScore, [subKey]: checkScore(event.target.value) });
                      }}
                      InputLabelProps={{
                        shrink: true
                      }}
                      variant="standard"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <StarRoundedIcon />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Box>
                </Grid>
              );
            })}
            <Grid item>
              <Typography component="legend">비고</Typography>
              <TextField
                multiline
                rows={8}
                value={noteArea}
                onChange={(event) => {
                  setNoteArea(event.target.value);
                }}
                sx={{
                  width: '98%'
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Box>
            <Button autoFocus onClick={onClickEval}>
              평가 등록
            </Button>
            <Button autoFocus onClick={handleClose}>
              취소
            </Button>
          </Box>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
};

const checkScore = (score) => {
  if (score < 0) {
    return 0;
  } else if (score > 5) {
    return 5;
  }
  return Math.round(score * 2) / 2;
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

export default InterviewEvalModal;
