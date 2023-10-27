import * as React from 'react';
import axios from 'axios';
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import { Button, Divider, FormControl, MenuItem, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Box, color } from '@mui/system';
import Stack from '@mui/material/Stack';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import JobRole from './JobRole';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const FormTypo = styled(Typography)(({ disabled }) => ({
  margin: '10px',
  display: 'flex',
  alignItems: 'center',
  color: disabled ? '#d0d0d0' : '#364152'
}));

const ReadBox = styled(Box)(() => ({
  padding: '20px 40px'
}));

const SelectBox = styled(Select)(({ value }) => ({
  '& .MuiSelect-select': {
    color: value === 'defaultLocation' || value === 'defaultEducation' ? '#B0BEC5' : '#121926'
  }
}));

const ReadReq = ({ selectedRow, reqlisthandler, handleRowClick, selectedChips, setRows }) => {
  const [formData, setFormData] = useState({
    users: { user_id: 'hr' },
    req_title: '',
    job_req_date: new Date(),
    job_role: '',
    location: '',
    hire_num: '',
    education: '',
    job_type: '',
    job_year: '',
    posting_type: '',
    posting_start: '',
    posting_end: '',
    qualification: '',
    preferred: '',
    job_duties: '',
    req_status: '작성중'
  });

  const [location, setLocation] = useState(selectedRow.location || 'defaultLocation');
  const [education, setEducation] = useState(selectedRow.education || 'defaultEducation');

  const handleLocation = (event) => {
    const selectedLocation = event.target.value;
    setLocation(selectedLocation);
    setFormData((prevData) => ({
      ...prevData,
      location: selectedLocation
    }));
  };

  const handleEducation = (event) => {
    const selectedEducation = event.target.value;
    setEducation(selectedEducation);
    setFormData((prevData) => ({
      ...prevData,
      education: selectedEducation
    }));
  };

  const handleJobType = (event) => {
    const selectedJobType = event.target.value;
    //console.log(selectedJobType);
    setFormData((prevData) => ({
      ...prevData,
      job_type: selectedJobType
    }));
  };

  const handlePostingType = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      posting_type: event.target.value
    }));
  };

  useEffect(() => {
    if (selectedRow) {
      setFormData(selectedRow);
    } else {
      setFormData({
        users: { user_id: 'hr' },
        req_title: '',
        job_req_date: new Date(),
        job_role: '',
        location: '',
        hire_num: '',
        education: '',
        job_type: '',
        job_year: '',
        posting_type: '',
        posting_start: '',
        posting_end: '',
        qualification: '',
        preferred: '',
        job_duties: '',
        req_status: '작성중'
      });
    }
  }, [selectedRow]);

  const handleJobRoleSelect = (selectedJobRole) => {
    console.log(selectedJobRole);
    if (!selectedRow)
      setFormData((prevData) => ({
        ...prevData,
        job_role: selectedJobRole.label,
        qualification: selectedJobRole.qual,
        preferred: selectedJobRole.prefer,
        job_duties: selectedJobRole.duties
      }));
  };

  const onSubmit = (e, reqStatus) => {
    e.preventDefault();

    const submitData = {
      // users: { user_id: 'hr' },
      // req_title: formData.req_title,
      // job_req_date: formData.job_req_date,
      // job_role: formData.job_role,
      // location: formData.location,
      // hire_num: formData.hire_num,
      // education: formData.education,
      // job_type: formData.job_type,
      // job_year: '',
      // posting_type: '',
      // // posting_start: new Date(),
      // // posting_end: new Date(),
      // qualification: formData.qualification,
      // preferred: formData.preferred,
      // job_duties: '',
      // req_status: reqStatus
      ...formData
    };

    console.log(submitData);

    if (selectedRow) {
      console.log(submitData);
      const job_req_no = selectedRow.job_req_no;
      axios.put(`http://localhost:8888/admin/hire/update/${job_req_no}`, submitData).then((res) => {
        console.log(res);
        handleRowClick(job_req_no);
        const statusData = {
          selectedStatus: selectedChips
        };
        axios.post('http://localhost:8888/admin/hire/statuslist', statusData).then((response) => {
          setRows(response.data);
        });
      });
    } else {
      axios.post('http://localhost:8888/admin/hire/create', submitData).then((res) => {
        console.log(res);
        const statusData = {
          selectedStatus: selectedChips
        };
        axios.post('http://localhost:8888/admin/hire/statuslist', statusData).then((response) => {
          setRows(response.data);
        });
      });
    }
  };

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
            {selectedRow ? '요청 상세' : '요청서 등록'}
          </Typography>

          <Divider sx={{ marginTop: '10px' }} />
          <TextField value={formData.job_req_no} style={{ display: 'none' }} />
          <TextField value={formData.users.user_id} style={{ display: 'none' }} />
        </Grid>
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

            <JobRole
              onSelect={handleJobRoleSelect}
              selectedRow={selectedRow}
              // value={formData.job_role}
              disabled={formData.req_status !== '작성중'}
            />
          </Grid>
          <Grid item xs={6}>
            <FormTypo>근무지</FormTypo>

            <FormControl fullWidth size="small" disabled={formData.req_status !== '작성중'}>
              <SelectBox value={location} onChange={handleLocation}>
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
              <SelectBox value={education} onChange={handleEducation}>
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

            <FormControl sx={{ paddingLeft: '40px' }}>
              <RadioGroup row onChange={handleJobType} defaultValue={selectedRow.job_type}>
                <FormControlLabel value="신입" control={<Radio size="small" />} label="신입" />
                <Box sx={{ width: 20 }} />
                <FormControlLabel value="경력" control={<Radio size="small" />} label="경력" />
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
              value={formData.job_year}
              disabled={formData.req_status !== '작성중' || formData.job_type !== '경력'}
              onChange={(e) => {
                setFormData({ ...formData, job_year: e.target.value });
              }}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} container direction="row" spacing={2}>
          <Grid item xs={4}>
            <FormTypo>공고타입</FormTypo>
            <FormControl sx={{ paddingLeft: '40px' }}>
              <RadioGroup row onChange={handlePostingType} defaultValue={selectedRow.posting_type}>
                <FormControlLabel value="수시채용" control={<Radio size="small" />} label="수시" />
                <Box sx={{ width: 20 }} />
                <FormControlLabel value="상시채용" control={<Radio size="small" />} label="상시" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormTypo disabled={formData.posting_type === '상시채용'}>공고시작</FormTypo>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={selectedRow.posting_start ? dayjs(selectedRow.posting_start) : null}
                onChange={(data) => {
                  console.log(data);
                  setFormData({ ...formData, posting_start: data.$d });
                }}
                disabled={formData.req_status !== '작성중' || formData.posting_type === '상시채용'}
                slotProps={{ textField: { size: 'small' } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={4}>
            <FormTypo disabled={formData.posting_type == '상시채용'}>공고종료</FormTypo>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={selectedRow.posting_end ? dayjs(selectedRow.posting_end) : null}
                onChange={(data) => {
                  console.log(data);
                  setFormData({ ...formData, posting_end: data.$d });
                }}
                disabled={formData.req_status !== '작성중' || formData.posting_type == '상시채용'}
                slotProps={{ textField: { size: 'small' } }}
              />
            </LocalizationProvider>
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
            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, preferred: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, job_duties: e.target.value })}
            disabled={formData.req_status !== '작성중'}
          />
        </Grid>
        <Divider sx={{ marginTop: '40px' }} />
        <Grid item container justifyContent="center">
          {/* <Stack direction="row" spacing={1}>
            <Button variant="contained" style={{ backgroundColor: '#b2cce1' }} onClick={(e) => onSubmit(e, '작성중')}>
              임시 저장
            </Button>
            <Button variant="outlined" style={{ borderColor: '#b2cce1', color: '#b2cce1' }} onClick={(e) => onSubmit(e, '요청완료')}>
              승인 요청
            </Button>
          </Stack> */}

          {formData.req_status === '작성중' && (
            <Stack direction="row" spacing={1}>
              <Button variant="contained" style={{ backgroundColor: '#b2cce1' }} onClick={(e) => onSubmit(e, '작성중')}>
                임시 저장
              </Button>
              <Button variant="outlined" style={{ borderColor: '#b2cce1', color: '#b2cce1' }} onClick={(e) => onSubmit(e, '요청완료')}>
                승인 요청
              </Button>
            </Stack>
          )}
          {formData.req_status === '요청완료' && (
            <Button variant="contained" style={{ backgroundColor: '#b2cce1' }} onClick={(e) => onSubmit(e, '작성중')}>
              요청 취소
            </Button>
          )}
        </Grid>
      </Grid>
    </ReadBox>
  );
};

export default ReadReq;
