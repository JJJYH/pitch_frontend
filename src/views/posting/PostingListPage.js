import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, Divider, Grid, IconButton, MenuItem, Paper, Select, Typography } from '@mui/material';
import PostingDetailModal from './components/PostingDetailModal';
import { Box } from '@mui/system';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const PostingListPage = () => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(2);
  const [jobPostings, setJobPostings] = useState([]);
  const [selectedJobPosting, setSelectedJobPosting] = useState(null);
  const userId = useSelector((state) => state.userInfo.user_id);

  useEffect(() => {
    const likedList = async () => {
      try {
        const jobPostingResponse = await axios.get('http://localhost:8888/admin/hire/getJobPostingList');
        setJobPostings(jobPostingResponse.data);

        const likedResponse = await axios.get('http://localhost:8888/admin/hire/liked');
        const likedJobPostings = likedResponse.data;
        console.log(likedJobPostings);
        setJobPostings((prevJobPostings) =>
          prevJobPostings.map((jobPosting) => {
            const isLiked = likedJobPostings.some((liked) => liked.job_posting_no === jobPosting.job_posting_no);
            return {
              ...jobPosting,
              isLiked: isLiked
            };
          })
        );
      } catch (error) {
        console.error(error);
      }
    };

    likedList();
  }, [userId]);

  const handleJobPostingClick = (jobPosting) => {
    setSelectedJobPosting(jobPosting);
    setCurrentPage(2);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = (e, jobPostingNo) => {
    e.stopPropagation();
    setJobPostings((prevJobPostings) => {
      return prevJobPostings.map((jobPosting) => {
        if (jobPosting.job_posting_no === jobPostingNo) {
          const updatedJobPosting = {
            ...jobPosting,
            isLiked: !jobPosting.isLiked
          };

          if (updatedJobPosting.isLiked) {
            axios.post('http://localhost:8888/admin/hire/liked', { job_posting_no: jobPostingNo });
          } else {
            axios.delete('http://localhost:8888/admin/hire/liked', { data: { job_posting_no: jobPostingNo } });
          }
          return updatedJobPosting;
        }
        return jobPosting;
      });
    });

    setSelectedJobPosting((prevSelectedJobPosting) => {
      if (prevSelectedJobPosting && prevSelectedJobPosting.job_posting_no === jobPostingNo) {
        return {
          ...prevSelectedJobPosting,
          isLiked: !prevSelectedJobPosting.isLiked
        };
      }
      return prevSelectedJobPosting;
    });
  };

  const handleSortByLatest = () => {
    axios
      .get('http://localhost:8888/admin/hire/getJobPostingList?orderType=latest')
      .then((response) => {
        setJobPostings(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get('http://localhost:8888/admin/hire/liked')
      .then((response) => {
        const likedJobPostings = response.data;
        console.log(likedJobPostings);
        setJobPostings((prevJobPostings) =>
          prevJobPostings.map((jobPosting) => {
            const isLiked = likedJobPostings.some((liked) => liked.job_posting_no === jobPosting.job_posting_no);
            return {
              ...jobPosting,
              isLiked: isLiked
            };
          })
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSortByDeadline = () => {
    axios
      .get('http://localhost:8888/admin/hire/getJobPostingList?orderType=deadline')
      .then((response) => {
        setJobPostings(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get('http://localhost:8888/admin/hire/liked')
      .then((response) => {
        const likedJobPostings = response.data;
        console.log(likedJobPostings);
        setJobPostings((prevJobPostings) =>
          prevJobPostings.map((jobPosting) => {
            const isLiked = likedJobPostings.some((liked) => liked.job_posting_no === jobPosting.job_posting_no);
            return {
              ...jobPosting,
              isLiked: isLiked
            };
          })
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSortByMostLiked = () => {
    axios
      .get('http://localhost:8888/admin/hire/getJobPostingList?orderType=mostLiked')
      .then((response) => {
        setJobPostings(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get('http://localhost:8888/admin/hire/liked')
      .then((response) => {
        const likedJobPostings = response.data;
        console.log(likedJobPostings);
        setJobPostings((prevJobPostings) =>
          prevJobPostings.map((jobPosting) => {
            const isLiked = likedJobPostings.some((liked) => liked.job_posting_no === jobPosting.job_posting_no);
            return {
              ...jobPosting,
              isLiked: isLiked
            };
          })
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Grid container>
      <Grid item xs={1.5} />
      <Grid item xs={9}>
        <Paper>
          <Grid container direction="column">
            <Grid item>
              <Box sx={{ height: '150px', pt: 8, pl: 12, pr: 12 }}>
                <Typography sx={{ fontSize: '35px', fontWeight: 'bold' }}>채용공고</Typography>
                <Divider sx={{ border: '1px solid', mt: 2 }} />
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ height: '100px' }}>
                <Grid container display="flex" justifyContent="space-between" pt={1} pl={12} pr={12}>
                  <Grid item>
                    <Grid container spacing={1}>
                      <Grid item>
                        <Select size="small" value="defaultType">
                          <MenuItem value="defaultType" disabled style={{ display: 'none' }}>
                            인재유형
                          </MenuItem>
                          <MenuItem value="전체">전체</MenuItem>
                          <MenuItem value="신입">신입</MenuItem>
                          <MenuItem value="경력">경력</MenuItem>
                        </Select>
                      </Grid>
                      <Grid item>
                        <Select size="small" value="defaultGroup">
                          <MenuItem value="defaultGroup" disabled style={{ display: 'none' }}>
                            분야
                          </MenuItem>
                          <MenuItem value="전체">전체</MenuItem>
                          <MenuItem value="직군1">직군1</MenuItem>
                          <MenuItem value="직군2">직군2</MenuItem>
                        </Select>
                      </Grid>
                      <Grid item>
                        <Select size="small" value="defaultLoc">
                          <MenuItem value="defaultLoc" disabled style={{ display: 'none' }}>
                            근무지
                          </MenuItem>
                          <MenuItem value="전체">전체</MenuItem>
                          <MenuItem value="근무지1">근무지1</MenuItem>
                          <MenuItem value="근무지2">근무지2</MenuItem>
                        </Select>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid container spacing={1}>
                      <Grid item>
                        <Button variant="outlined" onClick={handleSortByLatest}>
                          최신순
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button variant="outlined" onClick={handleSortByDeadline}>
                          마감순
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button variant="outlined" onClick={handleSortByMostLiked}>
                          관심공고순
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ minHeight: '700px' }}>
                <Grid container spacing={2} pt={1} pl={12} pr={12}>
                  {jobPostings.map((jobPosting) => {
                    const postingStart = new Date(jobPosting.jobReq.posting_start);
                    const today = new Date();
                    //console.log(today);
                    //console.log(postingStart);

                    const postingEndDate = dayjs(jobPosting.jobReq.posting_end);
                    const daysRemaining = postingEndDate.diff(today, 'day') + 1;

                    if (postingStart <= today) {
                      return (
                        <Grid item xs={4} key={jobPosting.job_posting_no}>
                          <Card
                            sx={{ border: '1px solid', cursor: 'pointer', height: '250px' }}
                            onClick={() => handleJobPostingClick(jobPosting)}
                          >
                            <CardContent>
                              <Grid container alignItems="center" justifyContent="flex-end" spacing={1}>
                                <Grid item>
                                  <IconButton
                                    onClick={(e) => handleToggle(e, jobPosting.job_posting_no)}
                                    sx={{ display: jobPosting.isLiked ? 'block' : 'none', p: 0 }}
                                  >
                                    <FavoriteIcon style={{ fontSize: 20, color: '#FF6F6F' }} />
                                  </IconButton>
                                  <IconButton
                                    onClick={(e) => handleToggle(e, jobPosting.job_posting_no)}
                                    sx={{
                                      display: !jobPosting.isLiked ? 'block' : 'none',
                                      p: 0
                                    }}
                                  >
                                    <FavoriteBorderIcon style={{ fontSize: 20, color: ' #666666' }} />
                                  </IconButton>
                                </Grid>
                                <Grid item>
                                  <IconButton sx={{ p: 0 }}>
                                    <ShareRoundedIcon style={{ fontSize: 20 }} />
                                  </IconButton>
                                </Grid>
                              </Grid>

                              <Typography sx={{ fontSize: '22px', fontWeight: 'bold' }}>{jobPosting.jobReq.req_title}</Typography>
                              <Grid container mt={1}>
                                <Typography mr={1}>{jobPosting.jobReq.job_type}</Typography>
                                <Typography mr={1}>|</Typography>
                                <Typography mr={1}>{dayjs(jobPosting.jobReq.posting_start).format('YYYY-MM-DD')}</Typography>
                                <Typography mr={1}>~</Typography>
                                {jobPosting.jobReq.posting_type === '수시채용' ? (
                                  <Typography mr={1}>{dayjs(jobPosting.jobReq.posting_end).format('YYYY-MM-DD')}</Typography>
                                ) : (
                                  <Typography mr={1}> 채용시</Typography>
                                )}
                              </Grid>
                              <Grid container mt={4} direction="column">
                                <Grid item>
                                  <Stack direction="row" spacing={1}>
                                    <Chip
                                      label={jobPosting.jobReq.posting_type === '상시채용' ? '상시채용' : `D-${daysRemaining}`}
                                      sx={{ backgroundColor: '#38678f', color: '#fff' }}
                                    />
                                    <Chip label={jobPosting.jobReq.job_group} />
                                    <Chip label={jobPosting.jobReq.job_role} />
                                  </Stack>
                                </Grid>
                                <Grid item mt={1}>
                                  <Stack direction="row" spacing={1}>
                                    <Chip label={jobPosting.jobReq.location} />
                                    <Chip label={jobPosting.jobReq.education} />
                                  </Stack>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    }
                    return null;
                  })}
                </Grid>
                {selectedJobPosting && (
                  <PostingDetailModal
                    open={open}
                    close={handleClose}
                    page="postingList"
                    formData={selectedJobPosting.jobReq}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    handleToggle={(e) => handleToggle(e, selectedJobPosting.job_posting_no)}
                    job_posting_no={selectedJobPosting.job_posting_no}
                    jobPosting={selectedJobPosting}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={1.5}></Grid>
    </Grid>
  );
};
export default PostingListPage;
