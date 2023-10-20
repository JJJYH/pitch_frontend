import * as React from 'react';
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import { Divider, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';

const ModalTypo = styled(Typography)(() => ({
  margin: '10px',
  display: 'flex',
  alignItems: 'center'
}));

const ReadBox = styled(Box)(() => ({
  padding: '20px 40px'
}));

const ReadReq = ({ title, selectedRow }) => {
  return (
    <ReadBox>
      <Grid container direction="column" spacing={2}>
        <Grid item xs={12}>
          <Typography sx={{ color: '#616161', fontSize: '20px', fontWeight: 'bold' }}>{title}</Typography>
          <Divider sx={{ marginTop: '10px' }} />
        </Grid>
        <Grid item xs={12} container direction="row" spacing={2}>
          <Grid item xs={8}>
            <ModalTypo>제목</ModalTypo>
            <TextField
              fullWidth
              label="제목"
              variant="outlined"
              name="name"
              size="small"
              // value={formData.name}
              // onChange={handleChange}
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
              // value={formData.email}
              // onChange={handleChange}
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
              // value={formData.email}
              // onChange={handleChange}
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
              // value={formData.email}
              // onChange={handleChange}
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
              // value={formData.email}
              // onChange={handleChange}
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
              // value={formData.email}
              // onChange={handleChange}
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
              // value={formData.email}
              // onChange={handleChange}
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
              // value={formData.email}
              // onChange={handleChange}
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
              // value={formData.email}
              // onChange={handleChange}
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
              // value={formData.email}
              // onChange={handleChange}
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
            // value={formData.email}
            // onChange={handleChange}
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
            // value={formData.email}
            // onChange={handleChange}
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
            // value={formData.email}
            // onChange={handleChange}
          />
        </Grid>
      </Grid>
    </ReadBox>
  );
};

export default ReadReq;
