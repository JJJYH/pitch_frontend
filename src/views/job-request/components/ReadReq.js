import * as React from 'react';
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import { Button, Divider, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import Stack from '@mui/material/Stack';
import { useEffect } from 'react';
import dayjs from 'dayjs';

const ModalTypo = styled(Typography)(() => ({
  margin: '10px',
  display: 'flex',
  alignItems: 'center'
}));

const ReadBox = styled(Box)(() => ({
  padding: '20px 40px'
}));

const ReadReq = ({ selectedRow, editing }) => {
  const [formData, setFormData] = useState({
    users: { user_id: 'hr' },
    req_title: '',
    job_req_date: new Date(),
    job_role: '',
    location: '',
    hire_num: 0,
    education: '',
    job_type: '',
    job_year: '',
    posting_type: '',
    posting_start: new Date(),
    posting_end: new Date(),
    qualification: '',
    preferred: '',
    job_duties: '',
    req_status: '작성중'
  });

  useEffect(() => {
    if (editing && selectedRow) {
      setFormData(selectedRow);
    } else {
      setFormData({
        users: { user_id: 'hr' },
        req_title: '',
        job_req_date: new Date(),
        job_role: '',
        location: '',
        hire_num: 0,
        education: '',
        job_type: '',
        job_year: '',
        posting_type: '',
        posting_start: new Date(),
        posting_end: new Date(),
        qualification: '',
        preferred: '',
        job_duties: '',
        req_status: '작성중'
      });
    }
  }, [editing, selectedRow]);

  return (
    <ReadBox>
      <Grid container direction="column" spacing={2}>
        <Grid item xs={12}>
          <Typography
            sx={{
              color: '#616161',
              fontSize: '20px',
              fontWeight: 'bold'
            }}
          >
            {editing ? '요청 상세' : '요청서 등록'}
          </Typography>

          <Divider sx={{ marginTop: '10px' }} />
          <TextField value={formData.users.user_id} style={{ display: 'none' }} />
        </Grid>
        <Grid item xs={12} container direction="row" spacing={2}>
          <Grid item xs={8}>
            <ModalTypo>제목</ModalTypo>
            <TextField
              fullWidth
              placeholder="제목"
              variant="outlined"
              name="req_title"
              size="small"
              value={formData.req_title}
              disabled={formData.req_status !== '작성중'}
            />
          </Grid>
          <Grid item xs={4}>
            <ModalTypo>요청일</ModalTypo>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={dayjs(formData.job_req_date)}
                disabled={formData.req_status !== '작성중'}
                slotProps={{ textField: { size: 'small' } }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Grid item xs={12} container direction="row" spacing={2}>
          <Grid item xs={6}>
            <ModalTypo>직무</ModalTypo>
            <TextField
              fullWidth
              placeholder="직무"
              variant="outlined"
              name="job_role"
              size="small"
              value={formData.job_role}
              disabled={formData.req_status !== '작성중'}
              // onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <ModalTypo>근무지</ModalTypo>
            <TextField
              fullWidth
              placeholder="근무지"
              variant="outlined"
              name="location"
              size="small"
              value={formData.location}
              disabled={formData.req_status !== '작성중'}
              // onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} container direction="row" spacing={2}>
          <Grid item xs={6}>
            <ModalTypo>채용인원</ModalTypo>
            <TextField
              fullWidth
              placeholder="채용인원"
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
              placeholder="학력"
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
              placeholder="채용형태"
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
              placeholder="경력기간"
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
              placeholder="공고타입"
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
              placeholder="공고시작"
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
              placeholder="공고종료"
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
            placeholder="지원자격"
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
            placeholder="우대사항"
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
            placeholder="수행업무"
            variant="outlined"
            multiline
            rows={10}
            name="email"
            size="small"
            // value={formData.email}
            // onChange={handleChange}
          />
        </Grid>
        <Divider sx={{ marginTop: '40px' }} />
        <Grid item>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" style={{ backgroundColor: '#b2cce1' }}>
              임시 저장
            </Button>
            <Button variant="outlined" style={{ borderColor: '#b2cce1', color: '#b2cce1' }}>
              승인 요청
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </ReadBox>
  );
};

export default ReadReq;
