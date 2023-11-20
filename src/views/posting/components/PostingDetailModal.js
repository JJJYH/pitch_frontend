import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
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
import { Box, Card, CardContent, Chip, Divider, Menu, MenuItem, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import Carousel from 'react-material-ui-carousel';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import InterviewerListModal from 'views/posting/components/InterviewerListModal';
import { useNavigate } from 'react-router';
import procedure from './procedure.png';
import SharePosting from './SharePosting';
import { useDispatch, useSelector } from 'react-redux';
import { resetUploadedFiles, setUploadedFiles, uploadedFilesSelector } from 'store/uploadedFilesSlice';
import { file } from 'jszip';

const StyledDialog = styled(Dialog)(() => ({
  '& .MuiDialogContent-root': {
    padding: '20px',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    },
    '&-ms-overflow-style:': {
      display: 'none'
    }
  },
  '& .MuiDialogActions-root': {
    padding: '20px'
  }
}));

const PostingDetailModal = ({
  open,
  close,
  page,
  handlePosting,
  currentPage,
  setCurrentPage,
  formData,
  setFormData,
  handleToggle,
  job_posting_no,
  jobPosting
}) => {
  const [isSticky, setIsSticky] = useState(false);
  const [openInterviewers, setOpenInterviewers] = useState(false);
  const [interviewers, setInterviewers] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openAnchorEl = Boolean(anchorEl);
  const dispatch = useDispatch();
  const uploadedFiles = useSelector(uploadedFilesSelector);

  const currentDate = dayjs();
  const postingEndDate = dayjs(formData.posting_end);
  const daysRemaining = postingEndDate.diff(currentDate, 'day') + 1;
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const handleScroll = (e) => {
    const scrollY = e.target.scrollTop;

    if (scrollY > 100) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    if (open) {
      setIsSticky(false);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [open]);

  const handlePostingFunc = () => {
    close();
    setCurrentPage(1);
    handlePosting();
  };

  const handleNextPage = async () => {
    try {
      const interviewerIds = interviewers.map((interviewer) => interviewer.users.user_id);
      console.log(interviewerIds);

      const updatewithInterviewers = {
        jobReq: {
          ...formData,
          posting_start: formData.posting_start,
          posting_end: formData.posting_end
        },
        interviewer_id: interviewerIds
      };

      console.log(updatewithInterviewers);

      const jobReqNo = formData.job_req_no;

      const response = await axios.put(`http://localhost:8888/admin/hire/addInterviewers/${jobReqNo}`, updatewithInterviewers);
      setCurrentPage(2);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    close();
  };

  // 면접관 리스트 모달
  const handleOpenInterviewers = () => {
    setOpenInterviewers(true);
  };

  const handleCloseInterviewers = () => {
    setOpenInterviewers(false);
  };

  const downloadFile = async (file) => {
    const reqFileNo = file.reqfile_no;
    const downloadUrl = `http://localhost:8888/admin/hire/${reqFileNo}/download`;

    try {
      const response = await axios.get(downloadUrl, { responseType: 'blob' });
      console.log(response.data);

      const blobUrl = URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = file.file_name;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  useEffect(() => {
    if (open) {
      const handleFiles = async () => {
        const fileReqNo = formData.job_req_no;
        console.log(fileReqNo);
        const filesResponse = await axios.get(`http://localhost:8888/admin/hire/${fileReqNo}/files`);
        console.log(filesResponse.data);
        dispatch(setUploadedFiles(filesResponse.data));
      };
      handleFiles();
    } else {
      dispatch(resetUploadedFiles());
    }
  }, [formData.job_req_no, open]);

  useEffect(() => {
    if (formData.posting_period === '15일') {
      const postingEndDate = dayjs(formData.posting_start).add(15, 'day');
      setFormData((prevFormData) => ({
        ...prevFormData,
        posting_end: postingEndDate.toDate()
      }));
    } else if (formData.posting_period === '30일') {
      const postingEndDate = dayjs(formData.posting_start).add(30, 'day');
      setFormData((prevFormData) => ({
        ...prevFormData,
        posting_end: postingEndDate.toDate()
      }));
    } else if (formData.posting_period === '기타') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        posting_end: prevFormData.posting_end || new Date()
      }));
    }
  }, [formData.posting_start, formData.posting_period]);

  const handleInterviewers = (list) => {
    setInterviewers(list);
  };

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <StyledDialog maxWidth="xl" onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
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
        {page === 'readReq' && (
          <DialogTitle style={{ fontSize: '25px', fontWeight: 'bold', minHeight: '80px', display: 'flex', alignItems: 'center' }}>
            {currentPage === 1 ? '공고등록' : '미리보기'}
          </DialogTitle>
        )}
        <Divider />
        <DialogContent style={{ width: currentPage === 1 ? '800px' : '1200px', overflow: 'auto', padding: 0 }} onScroll={handleScroll}>
          {page === 'postingList' && (
            <Box
              sx={{
                position: 'sticky',
                top: 0,
                backgroundColor: 'white',
                zIndex: 10,
                borderBottom: '2px solid ',
                opacity: isSticky ? 1 : 0,
                height: '100px',
                transition: 'opacity 0.5s ease-in-out',
                display: isSticky ? 'block' : 'none'
              }}
            >
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
              <Grid container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, pt: 3 }}>
                <Box display="flex">
                  <Grid item pl={4}>
                    <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>{formData.req_title}</Typography>
                  </Grid>
                  <Grid item pl={3}>
                    <Typography sx={{ fontSize: '24px', fontWeight: 'bold', color: '#38678f' }}>
                      {formData.posting_type === '상시채용' ? '상시채용' : `D-${daysRemaining}`}
                    </Typography>
                  </Grid>
                </Box>
                <Grid item pr={6}>
                  <Button
                    variant="contained"
                    style={{
                      //color: '#38678f',
                      // border: '2px solid #38678f',
                      backgroundColor: '#38678f',
                      width: '150px',
                      height: '50px',
                      fontSize: '20px',
                      fontWeight: 'bold'
                    }}
                    onClick={() => {
                      navigate(`/main/cv/${job_posting_no}`);
                    }}
                  >
                    지원서 작성
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
          {page === 'readReq' && currentPage === 1 && (
            <Grid container>
              <Grid item container direction="row" display="flex" alignItems="center">
                <Typography sx={{ fontSize: '21px', fontWeight: 'bold', mt: 3, ml: 3, mb: 1 }}>공고 기간 선택</Typography>
              </Grid>
              <Grid container item>
                <Grid item mt={1}>
                  <Typography sx={{ fontSize: '16px', my: 1, mx: 3 }}>공고시작</Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{ mx: 3 }}
                      value={dayjs(formData.posting_start)}
                      onChange={(data) => {
                        console.log(data);

                        setFormData({ ...formData, posting_start: data.$d });
                      }}
                      format="YYYY/MM/DD"
                      // slotProps={{ textField: { size: 'small' } }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item mt={1}>
                  <Typography sx={{ fontSize: '16px', my: 1, mx: 3 }}>공고종료</Typography>

                  {formData.posting_type === '수시채용' ? (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        sx={{ mx: 3 }}
                        value={dayjs(formData.posting_end)}
                        onChange={(data) => {
                          console.log(data);
                          setFormData({ ...formData, posting_end: data.$d });
                        }}
                        format="YYYY/MM/DD"
                        // slotProps={{ textField: { size: 'small' } }}
                      />
                    </LocalizationProvider>
                  ) : (
                    <TextField
                      sx={{ mx: 3, width: '300px' }}
                      variant="outlined"
                      disabled
                      value="상시채용 시 종료일을 입력할 수 없습니다."
                    />
                  )}
                </Grid>
              </Grid>
              <Grid item container xs={12} mt={2}>
                <Grid container display="flex" alignItems="center" justifyContent="space-between">
                  <Typography sx={{ fontSize: '21px', fontWeight: 'bold', mt: 3, ml: 3, mb: 2 }}>면접관 목록 추가</Typography>
                  <IconButton onClick={handleOpenInterviewers} sx={{ mr: 2, pb: 0 }}>
                    <AddIcon sx={{ fontSize: '30px' }} />
                  </IconButton>
                </Grid>
                <TextField
                  sx={{ mx: 3, mb: 3 }}
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={10}
                  name="interviewers"
                  size="small"
                  value={interviewers
                    .map(
                      (interviewer) => ` ${interviewer.department.dept_name} ${interviewer.users.user_nm} ${interviewer.users.user_email}`
                    )
                    .join('\n')}
                />
                <InterviewerListModal open={openInterviewers} close={handleCloseInterviewers} handleInterviewers={handleInterviewers} />
              </Grid>
            </Grid>
          )}
          {currentPage === 2 && (
            <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
              <Grid item>
                <Box
                  sx={{
                    width: '1100px',
                    // border: '1px solid',
                    height: '50px'
                  }}
                >
                  <Grid container sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }} spacing={2}>
                    <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                      {page === 'postingList' && jobPosting.isLiked ? (
                        <IconButton onClick={(e) => handleToggle(e, jobPosting.job_posting_no)} sx={{ p: 0 }}>
                          <FavoriteIcon style={{ fontSize: 30, color: '#FF6F6F' }} />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={(e) => handleToggle(e, jobPosting.job_posting_no)}
                          sx={{
                            p: 0
                          }}
                        >
                          <FavoriteBorderIcon style={{ fontSize: 30, color: ' #666666' }} />
                        </IconButton>
                      )}

                      <Typography ml={2}>관심공고</Typography>
                    </Grid>
                    <Grid item sx={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                      {/* <IconButton>
                        <ShareRoundedIcon />
                      </IconButton> */}

                      <IconButton
                        onClick={handleClickMenu}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={openAnchorEl ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openAnchorEl ? 'true' : undefined}
                      >
                        <ShareRoundedIcon />
                      </IconButton>

                      <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={openAnchorEl}
                        onClose={handleCloseMenu}
                        onClick={handleCloseMenu}
                        PaperProps={{
                          elevation: 0,
                          sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiMenu-list': {
                              display: 'flex',
                              flexDirection: 'row'
                            },

                            '& .MuiAvatar-root': {
                              width: 32,
                              height: 32,
                              ml: -0.5,
                              mr: 1
                            },
                            '&:before': {
                              content: '""',
                              display: 'block',
                              position: 'absolute',
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: 'background.paper',
                              transform: 'translateY(-50%) rotate(45deg)',
                              zIndex: 0
                            }
                          }
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      >
                        <MenuItem onClick={handleCloseMenu}>d</MenuItem>
                        <MenuItem onClick={handleCloseMenu}>
                          <SharePosting postingNo={job_posting_no} jobPosting={jobPosting} />
                        </MenuItem>
                      </Menu>
                      <Typography ml={1}>공유</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    width: '1100px',
                    // border: '1px solid',
                    height: '150px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <Typography sx={{ fontSize: '35px', fontWeight: 'bold' }}>{formData.req_title}</Typography>
                  <Typography sx={{ fontSize: '16px', mt: 2 }}>{formData.job_type}</Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    width: '1100px',
                    // border: '1px solid',
                    height: '150px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Box
                    sx={{
                      width: '1100px',
                      border: '2px solid',
                      height: '90px',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '30px'
                    }}
                  >
                    <Grid container sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      {formData.posting_type === '수시채용' ? (
                        <Grid item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <Typography sx={{ fontSize: '24px', fontWeight: 'bold', mr: 1 }}>공고마감</Typography>
                          <Typography sx={{ fontSize: '24px', fontWeight: 'bold', color: '#38678f', mr: 1 }}>D-{daysRemaining}</Typography>
                          <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>확인해주세요!</Typography>
                        </Grid>
                      ) : (
                        <Typography sx={{ fontSize: '24px', fontWeight: 'bold', mr: 1 }}>채용 시 마감되는 공고입니다.</Typography>
                      )}
                      <Grid item sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Typography sx={{ fontSize: '16px' }}>게시</Typography>
                          <Typography ml={2} mr={2} sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                            {dayjs(formData.posting_start).format('YYYY-MM-DD')}
                          </Typography>
                        </Grid>
                        <Typography ml={1} sx={{ fontSize: '24px', fontWeight: 'bold' }}>
                          |
                        </Typography>
                        <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Typography ml={2} sx={{ fontSize: '16px' }}>
                            마감
                          </Typography>
                          {formData.posting_type === '수시채용' ? (
                            <Typography ml={2} sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                              {dayjs(formData.posting_end).format('YYYY-MM-DD')}
                            </Typography>
                          ) : (
                            <Typography ml={2} sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                              채용 시
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    width: '1100px',
                    // border: '1px solid',
                    maxHeight: '1000px'
                  }}
                >
                  <Typography sx={{ fontSize: '25px', fontWeight: 'bold', mt: 4, mb: 2.5, ml: 3 }}>모집분야 및 지원자격</Typography>
                  <Box
                    sx={{
                      width: '1100px',
                      border: '1px solid #ddd',
                      borderTop: ' 2px solid #364152',
                      maxHeight: '1000px'
                    }}
                  >
                    <Typography sx={{ fontSize: '20px', fontWeight: 'bold', mt: 3, mb: 3, ml: 5 }}>{formData.job_role}</Typography>
                    <Box sx={{ width: '1050px', borderTop: '1px solid #ddd', marginLeft: '25px', p: 2, pb: 3 }}>
                      <Grid container direction="column">
                        <Grid item mb={2}>
                          <Typography sx={{ fontSize: '18px', fontWeight: 'bold', mt: 3, mb: 2 }}>공통지원자격</Typography>
                          <Typography sx={{ fontSize: '16px' }} mb={1}>
                            - 공통 필수사항 : 병역필 또는 면제자로, 해외여행에 결격 사유가 없는 자
                          </Typography>
                          <Typography sx={{ fontSize: '16px' }} mb={1}>
                            - 공통 우대사항 : 학사 취득 후 4년이상 유관경력 보유자
                          </Typography>
                          <Typography sx={{ fontSize: '16px' }} mb={1}>
                            ※ 석/박사 학위취득(예정)자의 경우 수학기간을 경력기간으로 인정
                          </Typography>
                        </Grid>
                        <Grid item sx={{ fontSize: '16px' }} mb={2}>
                          <Typography sx={{ fontSize: '18px', fontWeight: 'bold', mt: 3, mb: 2 }}>채용인원</Typography>
                          <Typography sx={{ fontSize: '16px' }} mb={1}>
                            {formData.hire_num}명
                          </Typography>
                        </Grid>
                        <Grid item mb={2}>
                          <Typography sx={{ fontSize: '18px', fontWeight: 'bold', mt: 3, mb: 2 }}>근무지</Typography>
                          <Typography sx={{ fontSize: '16px' }} mb={1}>
                            {formData.location}
                          </Typography>
                        </Grid>
                        <Grid item mb={2}>
                          <Typography sx={{ fontSize: '18px', fontWeight: 'bold', mt: 3, mb: 2 }}>수행업무</Typography>
                          <Typography mb={1} sx={{ whiteSpace: 'pre-line', lineHeight: 1.8, fontSize: '16px' }}>
                            {formData.job_duties}
                          </Typography>
                        </Grid>
                        <Grid item mb={2}>
                          <Typography sx={{ fontSize: '18px', fontWeight: 'bold', mt: 3, mb: 2 }}>지원자격</Typography>
                          <Typography mb={1} sx={{ whiteSpace: 'pre-line', lineHeight: 1.8, fontSize: '16px' }}>
                            {formData.qualification}
                          </Typography>
                        </Grid>
                        <Grid item mb={2}>
                          <Typography sx={{ fontSize: '18px', fontWeight: 'bold', mt: 3, mb: 2 }}>우대사항</Typography>
                          <Typography mb={1} sx={{ whiteSpace: 'pre-line', lineHeight: 1.8, fontSize: '16px' }}>
                            {formData.preferred}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item mt={3}>
                <Box sx={{ width: '1100px', height: '400px' }}>
                  <Typography sx={{ fontSize: '25px', fontWeight: 'bold', mt: 10, mb: 2.5, ml: 3 }}>제출서류</Typography>
                  <Box
                    sx={{
                      width: '1100px',
                      border: '1px solid #ddd',
                      borderTop: ' 2px solid #364152',
                      maxHeight: '400px',
                      p: 4
                    }}
                  >
                    <Typography sx={{ fontSize: '16px' }} mb={1}>
                      - 증빙서류는 이력서 작성시 제출합니다.
                    </Typography>
                    <Typography sx={{ fontSize: '16px' }} mb={1}>
                      ㆍ졸업증명서(원본) / 성적증명서(원본) / 경력증명서(원본) 각 1부
                    </Typography>
                    <Typography sx={{ fontSize: '16px' }} mb={3}>
                      ㆍ기타 자격증 및 확인서
                    </Typography>
                    <Typography sx={{ fontSize: '16px' }} mb={1}>
                      ※ 채용 서류 반환 관련 안내 (별도 안내 예정)
                    </Typography>
                    <Typography sx={{ fontSize: '16px' }} mb={1}>
                      회사는 채용 전형 과정에서 지원자의 불편을 최소화하기 위해
                    </Typography>
                    <Typography sx={{ fontSize: '16px' }} mb={1}>
                      입사지원서를 비롯하여 채용과 관련된 모든 서류는 채용 홈페이지를 통해
                    </Typography>
                    <Typography sx={{ fontSize: '16px' }} mb={1}>
                      접수 받고 있습니다. 채용 과정에서 서류를 직접 제출 받은 경우,
                    </Typography>
                    <Typography sx={{ fontSize: '16px' }} mb={1}>
                      해당 서류를 반환해 드리고 있사오니 자세한 내용은 지원가이드 - 채용서류 반환신청을 참고해 주시기 바랍니다.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ width: '1100px', height: '300px' }}>
                  <Typography sx={{ fontSize: '25px', fontWeight: 'bold', mt: 4, mb: 2, ml: 3 }}>첨부자료</Typography>
                  <Typography sx={{ fontSize: '16px' }} ml={3} mb={1}>
                    본 공고에 첨부된 자기소개서 다운로드후 작성하여 주시기 바랍니다.
                  </Typography>
                  <Typography sx={{ fontSize: '16px' }} ml={3}>
                    작성한 파일은 pdf 변환 후 &lsquo;이력서 첨부&rsquo;란에 등록하여 주시기 바랍니다.
                  </Typography>
                  <Box
                    sx={{
                      width: '1100px',
                      borderBottom: '1px solid #ddd',
                      borderTop: ' 2px solid #364152',

                      p: 4,
                      mt: 4
                    }}
                  >
                    {uploadedFiles.map((file, index) => {
                      // 파일 이름과 확장자 분리
                      const fileNameParts = file.file_name.split('.');
                      // 확장자를 제외한 부분만 선택
                      const fileNameWithoutExtension = fileNameParts.slice(0, -1).join('.');

                      return (
                        <Grid key={index} container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Grid item xs={4}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>{fileNameWithoutExtension}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={{ fontSize: '16px', textDecoration: 'underline' }}>{file.file_name}</Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Button
                              onClick={() => {
                                downloadFile(file);
                              }}
                            >
                              다운로드
                            </Button>
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Box>
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ width: '1100px', height: '350px' }}>
                  <Typography sx={{ fontSize: '25px', fontWeight: 'bold', mt: 3, mb: 2, ml: 3 }}>채용절차</Typography>
                  <Box sx={{ p: 2, height: '350px' }}>
                    <img src={procedure} alt="채용절차 이미지" style={{ width: '100%', height: '70%' }} />
                  </Box>
                </Box>
              </Grid>
              <Grid item>
                {page === 'postingList' && (
                  <Box
                    sx={{
                      width: '1100px',
                      height: '100px',
                      // border: '1px solid',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: '#38678f',
                        width: '250px',
                        height: '70px',
                        fontSize: '22px',
                        fontWeight: 'bold'
                      }}
                      onClick={() => {
                        navigate(`/main/cv/${job_posting_no}`);
                      }}
                    >
                      지원서 작성
                    </Button>
                  </Box>
                )}
              </Grid>
              <Grid item mt={8}>
                <Box sx={{ width: '1200px', height: '550px', backgroundColor: '#f8f8f8', px: 8, pt: 3 }}>
                  <Typography sx={{ fontSize: '22px', fontWeight: 'bold', mt: 5, mb: 2 }}>지원안내</Typography>
                  <Typography mb={1}>※ 계정이 없으신 분들은 먼저 회원가입을 해주시기 바랍니다.</Typography>
                  <Typography mb={1}>※ 채용 서류 반환 관련 안내</Typography>
                  <Typography mb={1}>회사는 채용 전형 과정에서 지원자의 불편을 최소화하기 위해 입사지원서를 비롯하여</Typography>
                  <Typography mb={1}>채용과 관련된 모든 서류는 채용 홈페이지를 통해 접수 받고 있습니다.</Typography>
                  <Typography mb={1}>채용 과정에서 서류를 직접 제출 받은 경우, 해당 서류를 반환해 드리고 있사오니</Typography>
                  <Typography mb={1}>자세한 내용은 지원가이드 - 채용서류 반환신청을 참고해 주시기 바랍니다.</Typography>
                  <Typography sx={{ fontSize: '22px', fontWeight: 'bold', mt: 6, mb: 2 }}>기타 사항</Typography>
                  <Typography mb={1}>ㆍ지원서는 삼성채용 홈페이지를 통해 접수하며, 그 외의 개별 접수는 받지 않습니다.</Typography>
                  <Typography mb={1}>ㆍ국가등록장애인 및 국가보훈대상자는 관련법 및 내부규정에 의거하여 우대합니다.</Typography>
                  <Typography mb={1}>ㆍ기재 내용에 허위사실이 있는 경우 합격이 취소될 수 있습니다.</Typography>
                  <Typography mb={1}>ㆍ전형단계별 결과는 삼성채용 홈페이지에 로그인하여 확인하실 수 있습니다.</Typography>
                  <Typography mb={1}>
                    ㆍ입사지원자께서는 입사지원 시점부터 채용전형 전체 과정에 걸쳐 전/현직 직장의 영업비밀을 침해하는 일이 없도록 각별히
                    유의하시기 바랍니다.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <Divider />
        {page === 'readReq' && (
          <DialogActions sx={{ minHeight: '80px' }}>
            <Box sx={{ border: '1px, solid' }}>
              {currentPage === 1 && (
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: '#38678f',
                    marginRight: '10px'
                  }}
                  onClick={handleNextPage}
                >
                  다음
                </Button>
              )}
              {currentPage === 2 && (
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: '#38678f',
                    marginRight: '10px'
                  }}
                  onClick={handlePostingFunc}
                >
                  공고등록
                </Button>
              )}
              <Button
                variant="outlined"
                style={{
                  borderColor: '#38678f',
                  color: '#38678f'
                }}
                onClick={handleClose}
              >
                취소
              </Button>
            </Box>
          </DialogActions>
        )}
      </StyledDialog>
    </div>
  );
};

export default PostingDetailModal;
