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
import { Box, Card, CardContent, Chip, Divider, TextField } from '@mui/material';
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

  const currentDate = dayjs();
  const postingEndDate = dayjs(formData.posting_end);
  const daysRemaining = postingEndDate.diff(currentDate, 'day') + 1;
  const navigate = useNavigate();

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
  }, [formData.posting_start, formData.posting_period, formData.posting_end]);

  const handleInterviewers = (list) => {
    setInterviewers(list);
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
            미리보기
          </DialogTitle>
        )}
        <Divider />
        <DialogContent style={{ width: '1200px', overflow: 'auto', padding: 0 }} onScroll={handleScroll}>
          {page === 'postingList' && (
            <Box
              sx={{
                position: 'sticky',
                top: 0,
                backgroundColor: 'white',
                zIndex: 10,
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                opacity: isSticky ? 1 : 0,
                height: '100px',
                transition: 'opacity 0.5s ease-in-out',
                display: isSticky ? 'block' : 'none'
              }}
            >
              제발 돼라
            </Box>
          )}
          {page === 'readReq' && currentPage === 1 && (
            <Grid container>
              <Grid item>
                <Typography>공고 기간</Typography>
              </Grid>
              <Grid container item>
                <Grid item>
                  <Typography>공고시작</Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={dayjs(formData.posting_start)}
                      onChange={(data) => {
                        console.log(data);

                        setFormData({ ...formData, posting_start: data.$d });
                      }}
                      slotProps={{ textField: { size: 'small' } }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item>
                  <Typography>공고종료</Typography>

                  {formData.posting_type === '수시채용' ? (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={dayjs(formData.posting_end)}
                        onChange={(data) => {
                          console.log(data);
                          setFormData({ ...formData, posting_end: data.$d });
                        }}
                        slotProps={{ textField: { size: 'small' } }}
                      />
                    </LocalizationProvider>
                  ) : (
                    <TextField fullWidth variant="outlined" size="small" disabled value="상시채용 선택 시 종료일을 입력할 수 없습니다." />
                  )}
                </Grid>
              </Grid>
              <Grid item container xs={12}>
                <Typography>면접관 목록</Typography>
                <IconButton onClick={handleOpenInterviewers}>
                  <AddIcon />
                </IconButton>
                <TextField
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
                      {jobPosting.isLiked ? (
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
                      <ShareRoundedIcon />
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
                          <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mt: 3, mb: 2 }}>공통지원자격</Typography>
                          <Typography mb={1}>- 공통 필수사항 : 병역필 또는 면제자로, 해외여행에 결격 사유가 없는 자</Typography>
                          <Typography mb={1}>- 공통 우대사항 : 학사 취득 후 4년이상 유관경력 보유자</Typography>
                          <Typography mb={1}>※ 석/박사 학위취득(예정)자의 경우 수학기간을 경력기간으로 인정</Typography>
                        </Grid>
                        <Grid item mb={2}>
                          <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mt: 3, mb: 2 }}>채용인원</Typography>
                          <Typography mb={1}>{formData.hire_num}명</Typography>
                        </Grid>
                        <Grid item mb={2}>
                          <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mt: 3, mb: 2 }}>근무지</Typography>
                          <Typography mb={1}>{formData.location}</Typography>
                        </Grid>
                        <Grid item mb={2}>
                          <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mt: 3, mb: 2 }}>수행업무</Typography>
                          <Typography mb={1} sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
                            {formData.job_duties}
                          </Typography>
                        </Grid>
                        <Grid item mb={2}>
                          <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mt: 3, mb: 2 }}>지원자격</Typography>
                          <Typography mb={1} sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
                            {formData.qualification}
                          </Typography>
                        </Grid>
                        <Grid item mb={2}>
                          <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mt: 3, mb: 2 }}>우대사항</Typography>
                          <Typography mb={1} sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
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
                  <Typography sx={{ fontSize: '25px', fontWeight: 'bold', mt: 4, mb: 2.5, ml: 3 }}>제출서류</Typography>
                  <Box
                    sx={{
                      width: '1100px',
                      border: '1px solid #ddd',
                      borderTop: ' 2px solid #364152',
                      maxHeight: '400px',
                      p: 4
                    }}
                  >
                    <Typography mb={1}>- 증빙서류는 이력서 작성시 제출합니다.</Typography>
                    <Typography mb={1}>ㆍ졸업증명서(원본) / 성적증명서(원본) / 경력증명서(원본) 각 1부</Typography>
                    <Typography mb={3}>ㆍ기타 자격증 및 확인서</Typography>
                    <Typography mb={1}>※ 채용 서류 반환 관련 안내 (별도 안내 예정)</Typography>
                    <Typography mb={1}>회사는 채용 전형 과정에서 지원자의 불편을 최소화하기 위해</Typography>
                    <Typography mb={1}>입사지원서를 비롯하여 채용과 관련된 모든 서류는 채용 홈페이지를 통해</Typography>
                    <Typography mb={1}>접수 받고 있습니다. 채용 과정에서 서류를 직접 제출 받은 경우,</Typography>
                    <Typography mb={1}>
                      해당 서류를 반환해 드리고 있사오니 자세한 내용은 지원가이드 - 채용서류 반환신청을 참고해 주시기 바랍니다.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ width: '1100px', height: '300px' }}>
                  <Typography sx={{ fontSize: '25px', fontWeight: 'bold', mt: 4, mb: 2, ml: 3 }}>첨부자료</Typography>
                  <Typography ml={3} mb={1}>
                    본 공고에 첨부된 자기소개서 다운로드후 작성하여 주시기 바랍니다.
                  </Typography>
                  <Typography ml={3}>작성한 파일은 pdf 변환 후 &lsquo;이력서 첨부&rsquo;란에 등록하여 주시기 바랍니다.</Typography>
                  <Box
                    sx={{
                      width: '1100px',
                      borderBottom: '1px solid #ddd',
                      borderTop: ' 2px solid #364152',
                      maxHeight: '100px',
                      p: 4,
                      mt: 4
                    }}
                  >
                    <Grid container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Grid item xs={4}>
                        <Typography>(양식)입사지원서</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>여기에 파일 들어가고</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Button>다운로드</Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ width: '1100px', height: '400px' }}>
                  <Typography sx={{ fontSize: '25px', fontWeight: 'bold', mt: 3, mb: 2, ml: 3 }}>채용절차</Typography>
                  <Box sx={{ p: 2, height: '350px' }}>
                    <img src={procedure} alt="채용절차 이미지" style={{ width: '100%', height: '90%' }} />
                  </Box>
                </Box>
              </Grid>
              <Grid item>
                {page === 'postingList' && (
                  <Box
                    sx={{
                      width: '1100px',
                      height: '200px',
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
              <Grid item mb={3}>
                <Box sx={{ width: '1100px', height: '400px', border: '1px solid' }}>지원 안내, 기타사항</Box>
              </Grid>
              {/* 
              <Grid item>
                <Box sx={{ height: '250px', ml: 12, mr: 12, mb: 2, borderRadius: '4px', backgroundColor: '#f2f2f2' }}>
                  <Box sx={{ height: '50px', display: 'flex', alignItems: 'flex-end' }}>
                    <Typography sx={{ fontSize: '20px', fontWeight: 'bold', pl: 2 }}>추천공고1</Typography>
                  </Box>
                  <Box sx={{ height: '200px' }}>
                    <Carousel autoPlay={false} cycleNavigation={true} navButtonsAlwaysVisible={true}>
                      {[...Array(Math.ceil(recommendedPostings.length / itemsPerGroup))].map((_, groupIndex) => (
                        <Grid container key={groupIndex} spacing={2} pl={8} pr={8} pt={5}>
                          {recommendedPostings
                            .slice(groupIndex * itemsPerGroup, (groupIndex + 1) * itemsPerGroup)
                            .map((recommendedPosting, index) => {
                              const today = new Date();
                              const postingEndDate = dayjs(recommendedPosting.jobReq.posting_end);
                              const daysRemaining = postingEndDate.diff(today, 'day') + 1;

                              return (
                                <Grid item xs={12} md={4} key={index}>
                                  <Card
                                    sx={{ border: '1px solid', cursor: 'pointer', height: '100px' }}
                                    onClick={() => handleJobPostingClick(recommendedPosting)}
                                  >
                                    <CardContent>
                                      <Grid container alignItems="center" justifyContent="flex-end" spacing={1}></Grid>
                                      <Grid container item direction="row" display="flex" alignItems="center">
                                        <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>
                                          {recommendedPosting.jobReq.req_title}
                                        </Typography>
                                        <Chip
                                          label={recommendedPosting.jobReq.posting_type === '상시채용' ? '상시채용' : `D-${daysRemaining}`}
                                          sx={{ backgroundColor: '#38678f', color: '#fff', fontSize: '12px', ml: 1 }}
                                        />
                                      </Grid>

                                      <Grid container mt={1}>
                                        <Typography mr={1}>{recommendedPosting.jobReq.job_type}</Typography>
                                        <Typography mr={1}>|</Typography>
                                        <Typography mr={1}>
                                          {dayjs(recommendedPosting.jobReq.posting_start).format('YYYY-MM-DD')}
                                        </Typography>
                                        <Typography mr={1}>~</Typography>
                                        {recommendedPosting.jobReq.posting_type === '수시채용' ? (
                                          <Typography mr={1}>
                                            {dayjs(recommendedPosting.jobReq.posting_end).format('YYYY-MM-DD')}
                                          </Typography>
                                        ) : (
                                          <Typography mr={1}> 채용시</Typography>
                                        )}
                                      </Grid>
                                      <Grid container mt={4} direction="column">
                                        <Grid item mt={1}></Grid>
                                      </Grid>
                                    </CardContent>
                                  </Card>
                                </Grid>
                              );
                            })}
                        </Grid>
                      ))}
                    </Carousel>
                  </Box>
                </Box>
              </Grid> */}
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
                  color: '#38678f',
                  width: '80px'
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
