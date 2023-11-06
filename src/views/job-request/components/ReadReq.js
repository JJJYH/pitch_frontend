import * as React from 'react';
import axios from 'axios';
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import { Button, Divider, FormControl, IconButton, MenuItem, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Box, color } from '@mui/system';
import Stack from '@mui/material/Stack';
import { useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import JobRole from './JobRole';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedRow, resetSelectedRow, selectedRowSelector } from 'store/selectedRowSlice';
import PostingDetailModal from 'views/posting/components/PostingDetailModal';

const FormTypo = styled(Typography)(({ disabled }) => ({
  margin: '10px',
  display: 'flex',
  alignItems: 'center',
  color: disabled ? '#d0d0d0' : '#364152'
}));

const StyledBox = styled(Box)(() => ({
  margin: '10px',
  borderRadius: '4px',
  // border: '3px solid #f0f0f0',
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
  const dispatch = useDispatch();
  const selectedRow = useSelector(selectedRowSelector);
  const contentRef = useRef(null);

  const [formData, setFormData] = useState({
    job_req_no: '',
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
    posting_period: '',
    posting_start: new Date(),
    posting_end: new Date(),
    qualification: '',
    preferred: '',
    job_duties: '',
    req_status: '작성중'
  });

  const [copiedData, setCopiedData] = useState('');
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // 공고 등록 모달
  const handleOpen = () => {
    setCurrentPage(1);
    const today = new Date();
    setFormData((prevData) => ({
      ...prevData,
      posting_start: today
    }));

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // 직무 선택
  const handleJobRoleSelect = (selectedJobRole) => {
    console.log(selectedJobRole);

    setFormData((prevData) => ({
      ...prevData,
      job_role: selectedJobRole.label,
      qualification: selectedJobRole.qual,
      preferred: selectedJobRole.prefer,
      job_duties: selectedJobRole.duties
    }));
  };

  // 근무지 선택
  const handleLocation = (event) => {
    const selectedLocation = event.target.value;
    //setLocation(selectedLocation);
    console.log(location);
    setFormData((prevData) => ({
      ...prevData,
      location: selectedLocation
    }));
  };

  // 학력 선택
  const handleEducation = (event) => {
    const selectedEducation = event.target.value;
    //setEducation(selectedEducation);
    setFormData((prevData) => ({
      ...prevData,
      education: selectedEducation
    }));
  };

  // 채용형태
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

  // 공고 기간 선택
  const handlePeriod = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      posting_period: event.target.value
    }));
  };

  const handleCopy = () => {
    const copyData = { ...formData, job_req_no: 0, job_req_date: new Date(), req_status: '작성중' };
    console.log(copyData);
    setCopiedData(copyData);
    // dispatch(resetSelectedRow());
  };

  const handlePaste = () => {
    setFormData(copiedData);
    setCopiedData('');
  };

  const handlePosting = async () => {
    try {
      const jobPostingData = {
        jobReq: { job_req_no: selectedRow.job_req_no }
      };

      console.log(jobPostingData);

      await axios.post('http://localhost:8888/admin/hire/create-post', jobPostingData);

      const updatedJobReqNo = jobPostingData.jobReq.job_req_no;

      // 전체 데이터를 가져오기 위한 요청
      const response = await axios.get(`http://localhost:8888/admin/hire/jobreq/${updatedJobReqNo}`);

      const newSelectedRowData = response.data;
      console.log(newSelectedRowData);

      dispatch(setSelectedRow(newSelectedRowData));

      setSelectedChips([]);
      reqlisthandler();
    } catch (error) {
      console.log(error);
    }
  };

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
        posting_period: '',
        posting_start: new Date(),
        posting_end: new Date(),
        qualification: '',
        preferred: '',
        job_duties: '',
        req_status: '작성중'
      });
    }
  }, [selectedRow]);

  const onSubmit = async (e, status) => {
    e.preventDefault();

    const submitData = { ...formData, req_status: status };
    console.log(submitData);

    try {
      if (selectedRow) {
        if (status === '요청완료') {
          const job_req_no = selectedRow.job_req_no;
          const res = await axios.put(`http://localhost:8888/admin/hire/update/${job_req_no}`, submitData);
          console.log(res);

          dispatch(setSelectedRow(submitData));
          setSelectedChips([]);
          reqlisthandler();
        } else {
          const job_req_no = selectedRow.job_req_no;
          const res = await axios.put(`http://localhost:8888/admin/hire/update/${job_req_no}`, submitData);
          console.log(res);

          dispatch(setSelectedRow(submitData));

          // const statusData = { selectedStatus: selectedChips };
          // const responseData = await postStatusData(statusData);
          // setRows(responseData);
          const searchData = await handleCombinedSearch(startDate, endDate, searchKeyword, selectedChips);
          setRows(searchData);
        }
      } else {
        const res = await axios.post('http://localhost:8888/admin/hire/create', submitData);
        console.log(res);

        console.log(res.data);

        try {
          const response = await axios.get(`http://localhost:8888/admin/hire/jobreq/${res.data}`);
          dispatch(setSelectedRow(response.data));
          setSelectedChips([]);
          console.log(response.data);
        } catch (error) {
          console.error(error);
        }

        // const statusData = { selectedStatus: selectedChips };
        // const responseData = await postStatusData(statusData);
        // setRows(responseData);
        reqlisthandler();
      }
    } catch (error) {
      console.error(error);
    }
  };
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
              {selectedRow ? '요청 상세' : '요청서 등록'}
            </Typography>
            {formData.req_status !== '작성중' && (
              <Button variant="contained" style={{ backgroundColor: '#38678f ' }} onClick={handleCopy}>
                복사하기
              </Button>
            )}
            {copiedData && !selectedRow && (
              <Button variant="contained" style={{ backgroundColor: '#38678f ' }} onClick={handlePaste}>
                붙여넣기
              </Button>
            )}
          </Grid>

          <Divider sx={{ marginTop: '10px', marginLeft: '15px', borderColor: '#c0c0c0' }} />
          <TextField value={formData.job_req_no} style={{ display: 'none' }} />
          <TextField value={formData.users.user_id} style={{ display: 'none' }} />
          {/* <TextField value={formData.posting_start} style={{ display: 'none' }} />
          <TextField value={formData.posting_end} style={{ display: 'none' }} /> */}

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
                formData={formData}
                //onSelect={handleJobRoleSelect}
                // selectedRow={selectedRow}
                //value={formData.job_role}
                disabled={formData.req_status !== '작성중'}
              />
            </Grid>
            <Grid item xs={6}>
              <FormTypo>근무지</FormTypo>

              <FormControl fullWidth size="small" disabled={formData.req_status !== '작성중'}>
                <SelectBox value={formData.location || 'defaultLocation'} onChange={handleLocation}>
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
                <SelectBox value={formData.education || 'defaultEducation'} onChange={handleEducation}>
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
                <RadioGroup row onChange={handleJobType}>
                  <FormControlLabel
                    value="신입"
                    control={
                      <Radio
                        size="small"
                        checked={formData.job_type === '신입' || !formData.job_type}
                        disabled={formData.req_status !== '작성중'}
                      />
                    }
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
                <RadioGroup row onChange={handlePostingType}>
                  <FormControlLabel
                    value="수시채용"
                    control={
                      <Radio
                        size="small"
                        checked={formData.posting_type === '수시채용' || !formData.posting_type}
                        disabled={formData.req_status !== '작성중'}
                      />
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
                  onChange={handlePeriod}
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
            {formData.req_status === '작성중' && (
              <Stack direction="row" spacing={1}>
                <Button variant="contained" style={{ backgroundColor: '#38678f' }} onClick={(e) => onSubmit(e, '작성중')}>
                  임시 저장
                </Button>
                <Button variant="outlined" style={{ borderColor: '#38678f', color: '#38678f' }} onClick={(e) => onSubmit(e, '요청완료')}>
                  승인 요청
                </Button>
              </Stack>
            )}
            {formData.req_status === '요청완료' && (
              <Button variant="contained" style={{ backgroundColor: '#38678f' }} onClick={(e) => onSubmit(e, '작성중')}>
                요청 취소
              </Button>
            )}
            {formData.req_status === '승인' && (
              <Button variant="contained" style={{ backgroundColor: '#38678f' }} onClick={handleOpen}>
                공고 등록
              </Button>
            )}
            <PostingDetailModal
              open={open}
              close={handleClose}
              page="readReq"
              handlePosting={handlePosting}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              formData={formData}
              setFormData={setFormData}
            />
          </Grid>
        </Grid>
      </ReadBox>
    </StyledBox>
  );
};

export default ReadReq;
