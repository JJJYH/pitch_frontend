import * as React from 'react';
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import { Button, Divider, FormControl, MenuItem, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import JobRole from './JobRole';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useDispatch, useSelector } from 'react-redux';
import { selectedRowSelector } from 'store/selectedRowSlice';
import { Link } from 'react-router-dom';

const FormTypo = styled(Typography)(({ disabled }) => ({
  margin: '10px',
  display: 'flex',
  alignItems: 'center',
  color: disabled ? '#d0d0d0' : '#364152'
}));

const StyledBox = styled(Box)(() => ({
  margin: '10px',
  borderRadius: '4px',
  border: '1px solid #c0c0c0',
  height: 680,
  overflow: 'auto',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  '&-ms-overflow-style:': {
    display: 'none'
  }
}));
const ReadBox = styled(Box)(() => ({
  padding: '20px 40px'
}));

const SelectBox = styled(Select)(({ value }) => ({
  '& .MuiSelect-select': {
    color: value === 'defaultLocation' || value === 'defaultEducation' ? '#B0BEC5' : '#121926'
  }
}));

const ReadReq = ({ reqlisthandler, handleCombinedSearch, selectedChips, setSelectedChips, setRows, startDate, endDate, searchKeyword }) => {
  const selectedRow = useSelector(selectedRowSelector);
  const contentRef = useRef(null);
  const userId = useSelector((state) => state.userInfo.user_id);

  const [formData, setFormData] = useState({
    job_req_no: '',
    users: { user_id: userId },
    req_title: '',
    job_req_date: new Date(),
    job_group: '',
    job_role: '',
    location: '',
    hire_num: '',
    education: '',
    job_type: '신입',
    job_year: '',
    posting_type: '수시채용',
    posting_period: '',
    posting_start: '',
    posting_end: '',
    qualification: '',
    preferred: '',
    job_duties: '',
    req_status: '작성중'
  });

  const scrollToTop = () => {
    contentRef.current.scrollTo(0, 0);
  };

  useEffect(() => {
    scrollToTop();
    if (selectedRow) {
      setFormData(selectedRow);

      //console.log(selectedRow);
    } else {
      setFormData({
        job_req_no: '',
        users: { user_id: userId },
        req_title: '',
        job_req_date: new Date(),
        job_group: '',
        job_role: '',
        location: '',
        hire_num: '',
        education: '',
        job_type: '신입',
        job_year: '',
        posting_type: '수시채용',
        posting_period: '',
        posting_start: '',
        posting_end: '',
        qualification: '',
        preferred: '',
        job_duties: '',
        req_status: '작성중'
      });
    }
  }, [selectedRow]);

  return (
    <StyledBox ref={contentRef}>
      <ReadBox>
        <Grid container direction="column" spacing={2}>
          <Grid container alignItems="center" justifyContent="space-between" item xs={12} sx={{ minHeight: '55px' }}>
            <Typography
              sx={{
                color: '#616161',
                fontSize: '20px',
                fontWeight: 'bold'
              }}
            >
              공고 상세
            </Typography>
            <Button variant="contained" style={{ backgroundColor: '#38678f ' }}>
              <Link to={`/manage/posts/${'1'}/sort`} style={{ textDecoration: 'none', color: 'white' }}>
                관리하기
              </Link>
            </Button>
          </Grid>

          <Divider sx={{ marginTop: '10px', marginLeft: '15px', borderColor: '#c0c0c0' }} />
          <TextField value={formData.job_req_no} style={{ display: 'none' }} />
          <TextField value={formData.users.user_id} style={{ display: 'none' }} />
          <TextField value={formData.job_group} style={{ display: 'none' }} />
          <Grid item xs={12} container direction="row" spacing={2}>
            <Grid item xs={8}>
              <FormTypo>제목</FormTypo>
              <TextField
                fullWidth
                placeholder="제목"
                variant="outlined"
                name="req_title"
                size="small"
                value={formData.req_title}
                disabled={formData.req_status !== '작성중'}
                onChange={(e) => {
                  setFormData({ ...formData, req_title: e.target.value });
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <FormTypo>요청일</FormTypo>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={dayjs(formData.job_req_date)}
                  onChange={(data) => {
                    console.log(data);
                    setFormData({ ...formData, job_req_date: data.$d });
                  }}
                  disabled={formData.req_status !== '작성중'}
                  slotProps={{ textField: { size: 'small' } }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          <Grid item xs={12} container direction="row" spacing={2}>
            <Grid item xs={6}>
              <FormTypo>직무</FormTypo>
              <JobRole formData={formData} disabled={formData.req_status !== '작성중'} />
            </Grid>
            <Grid item xs={6}>
              <FormTypo>근무지</FormTypo>

              <FormControl fullWidth size="small" disabled={formData.req_status !== '작성중'}>
                <SelectBox value={formData.location || 'defaultLocation'}>
                  <MenuItem value="defaultLocation" disabled>
                    근무지 선택
                  </MenuItem>
                  <MenuItem value="근무지1">근무지1</MenuItem>
                  <MenuItem value="근무지2">근무지2</MenuItem>
                </SelectBox>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12} container direction="row" spacing={2}>
            <Grid item xs={6}>
              <FormTypo>채용인원</FormTypo>
              <TextField
                fullWidth
                placeholder="숫자만 입력하세요"
                variant="outlined"
                name="hire_num"
                size="small"
                value={formData.hire_num}
                disabled={formData.req_status !== '작성중'}
                onChange={(e) => {
                  setFormData({ ...formData, hire_num: e.target.value });
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormTypo>학력</FormTypo>
              <FormControl fullWidth size="small" disabled={formData.req_status !== '작성중'}>
                <SelectBox value={formData.education || 'defaultEducation'}>
                  <MenuItem value="defaultEducation" disabled>
                    학력 선택
                  </MenuItem>
                  <MenuItem value="학력 무관">학력 무관</MenuItem>
                  <MenuItem value="초대졸">초대졸</MenuItem>
                  <MenuItem value="대졸">대졸</MenuItem>
                </SelectBox>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12} container direction="row" spacing={2}>
            <Grid item xs={6}>
              <FormTypo>채용형태</FormTypo>

              <FormControl sx={{ paddingLeft: '50px' }}>
                <RadioGroup row>
                  <FormControlLabel
                    value="신입"
                    control={<Radio size="small" checked={formData.job_type === '신입'} disabled={formData.req_status !== '작성중'} />}
                    label="신입"
                  />
                  <Box sx={{ width: 60 }} />
                  <FormControlLabel
                    value="경력"
                    control={<Radio size="small" checked={formData.job_type === '경력'} disabled={formData.req_status !== '작성중'} />}
                    label="경력"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormTypo disabled={formData.job_type !== '경력'}>경력기간</FormTypo>
              <TextField
                fullWidth
                placeholder={formData.job_type !== '경력' ? '경력 없음' : 'ex) 1~3년'}
                variant="outlined"
                name="job_year"
                size="small"
                value={formData.job_type === '신입' ? '' : formData.job_year}
                disabled={formData.req_status !== '작성중' || formData.job_type !== '경력'}
                onChange={(e) => {
                  setFormData({ ...formData, job_year: e.target.value });
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} container direction="row" spacing={2}>
            <Grid item xs={6}>
              <FormTypo>공고타입</FormTypo>
              <FormControl sx={{ paddingLeft: '50px' }}>
                <RadioGroup row>
                  <FormControlLabel
                    value="수시채용"
                    control={
                      <Radio size="small" checked={formData.posting_type === '수시채용'} disabled={formData.req_status !== '작성중'} />
                    }
                    label="수시"
                  />
                  <Box sx={{ width: 60 }} />
                  <FormControlLabel
                    value="상시채용"
                    control={
                      <Radio size="small" checked={formData.posting_type === '상시채용'} disabled={formData.req_status !== '작성중'} />
                    }
                    label="상시"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormTypo disabled={formData.posting_type === '상시채용'}>공고기간</FormTypo>
              <FormControl fullWidth size="small" disabled={formData.req_status !== '작성중' || formData.posting_type === '상시채용'}>
                <SelectBox
                  value={formData.posting_type === '상시채용' || !formData.posting_period ? 'defaultPeriod' : formData.posting_period}
                >
                  <MenuItem value="defaultPeriod" disabled>
                    기간 선택
                  </MenuItem>
                  <MenuItem value="15일">15일</MenuItem>
                  <MenuItem value="30일">30일</MenuItem>
                  <MenuItem value="기타">기타</MenuItem>
                </SelectBox>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <FormTypo>지원자격</FormTypo>
            <TextField
              fullWidth
              placeholder="지원자격"
              variant="outlined"
              multiline
              rows={10}
              name="qualification"
              size="small"
              value={formData.qualification}
              disabled={formData.req_status !== '작성중'}
            />
          </Grid>
          <Grid item xs={12}>
            <FormTypo>우대사항</FormTypo>
            <TextField
              fullWidth
              placeholder="우대사항"
              variant="outlined"
              multiline
              rows={10}
              name="preferred"
              size="small"
              value={formData.preferred}
              disabled={formData.req_status !== '작성중'}
            />
          </Grid>
          <Grid item xs={12}>
            <FormTypo>수행업무</FormTypo>
            <TextField
              fullWidth
              placeholder="수행업무"
              variant="outlined"
              multiline
              rows={10}
              name="job_duties"
              size="small"
              value={formData.job_duties}
              disabled={formData.req_status !== '작성중'}
            />
          </Grid>
          <Divider sx={{ marginTop: '40px' }} />
        </Grid>
      </ReadBox>
    </StyledBox>
  );
};

export default ReadReq;
