import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Box, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

//import dayjs from 'dayjs';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    },
    '&-ms-overflow-style:': {
      display: 'none'
    }
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

const ModalTypo = styled(Typography)(() => ({
  margin: '10px',
  display: 'flex',
  alignItems: 'center'
}));

const PostingDetailModal = ({ open, handleClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <StyledDialog maxWidth="xl" onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        {/* <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          <Typography sx={{ color: '#616161', fontSize: '20px', fontWeight: 'bold' }}>채용 요청서 등록</Typography>
        </DialogTitle> */}
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
        <DialogContent dividers style={{ width: '1200px' }}>
          <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
            <Grid item>
              <Box
                sx={{
                  width: '1100px',
                  border: '1px solid',
                  height: '100px'
                }}
              >
                좋아요, 공유
              </Box>
            </Grid>
            <Grid item>
              <Box
                sx={{
                  width: '1100px',
                  border: '1px solid',
                  height: '150px'
                }}
              >
                제목
              </Box>
            </Grid>
            <Grid item>
              <Box
                sx={{
                  width: '1100px',
                  border: '1px solid',
                  height: '150px'
                }}
              >
                d-day
              </Box>
            </Grid>
            <Grid item>
              <Box
                sx={{
                  width: '1100px',
                  border: '1px solid',
                  height: '800px'
                }}
              >
                모집직무 및 지원자격
              </Box>
            </Grid>
            <Grid item></Grid>
            <Grid item></Grid>
            <Grid item></Grid>
            <Grid item></Grid>
            <Grid item></Grid>
            <Grid item></Grid>
          </Grid>
          {/* <form onSubmit={handleSubmit}>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={12} container direction="row" spacing={2}>
                <Grid item xs={8}>
                  <ModalTypo>제목</ModalTypo>
                  <TextField
                    fullWidth
                    label="제목"
                    variant="outlined"
                    name="name"
                    size="small"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={4}>
                  <ModalTypo>요청일</ModalTypo>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker slotProps={{ textField: { size: 'small' } }} />
                  </LocalizationProvider>
                </Grid>
              </Grid>
              <Grid item xs={12} container direction="row" spacing={2}>
                <Grid item xs={6}>
                  <ModalTypo>직무</ModalTypo>
                  <TextField
                    fullWidth
                    label="직무"
                    variant="outlined"
                    name="email"
                    size="small"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ModalTypo>근무지</ModalTypo>
                  <TextField
                    fullWidth
                    label="근무지"
                    variant="outlined"
                    name="email"
                    size="small"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} container direction="row" spacing={2}>
                <Grid item xs={6}>
                  <ModalTypo>채용인원</ModalTypo>
                  <TextField
                    fullWidth
                    label="채용인원"
                    variant="outlined"
                    name="email"
                    size="small"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ModalTypo>학력</ModalTypo>
                  <TextField
                    fullWidth
                    label="학력"
                    variant="outlined"
                    name="email"
                    size="small"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} container direction="row" spacing={2}>
                <Grid item xs={6}>
                  <ModalTypo>채용형태</ModalTypo>
                  <TextField
                    fullWidth
                    label="채용형태"
                    variant="outlined"
                    name="email"
                    size="small"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ModalTypo>경력기간</ModalTypo>
                  <TextField
                    fullWidth
                    label="경력기간"
                    variant="outlined"
                    name="email"
                    size="small"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} container direction="row" spacing={2}>
                <Grid item xs={4}>
                  <ModalTypo>공고타입</ModalTypo>
                  <TextField
                    fullWidth
                    label="공고타입"
                    variant="outlined"
                    name="email"
                    size="small"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={4}>
                  <ModalTypo>공고시작</ModalTypo>
                  <TextField
                    fullWidth
                    label="공고시작"
                    variant="outlined"
                    name="email"
                    size="small"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={4}>
                  <ModalTypo>공고종료</ModalTypo>
                  <TextField
                    fullWidth
                    label="공고종료"
                    variant="outlined"
                    name="email"
                    size="small"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <ModalTypo>지원자격</ModalTypo>
                <TextField
                  fullWidth
                  label="지원자격"
                  variant="outlined"
                  multiline
                  rows={10}
                  name="email"
                  size="small"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <ModalTypo>우대사항</ModalTypo>
                <TextField
                  fullWidth
                  label="우대사항"
                  variant="outlined"
                  multiline
                  rows={10}
                  name="email"
                  size="small"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <ModalTypo>수행업무</ModalTypo>
                <TextField
                  fullWidth
                  label="수행업무"
                  variant="outlined"
                  multiline
                  rows={10}
                  name="email"
                  size="small"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </form> */}
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" color="primary">
            등록
          </Button>
          <Button autoFocus onClick={handleClose}>
            Save changes
          </Button>
        </DialogActions>
      </StyledDialog>
    </div>
  );
};

export default PostingDetailModal;
