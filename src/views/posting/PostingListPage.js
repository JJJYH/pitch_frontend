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
import Carousel from 'react-material-ui-carousel';

const PostingListPage = () => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(2);
  const [jobPostings, setJobPostings] = useState([]);
  const [selectedJobPosting, setSelectedJobPosting] = useState(null);
  const [recommendedPostings, setRecommendedPostings] = useState([]);
  const userId = useSelector((state) => state.userInfo.user_id);
  const [sortBy, setSortBy] = useState('latest');
  const [filters, setFilters] = useState({
    jobType: 'defaultValue',
    jobGroup: 'defaultValue',
    location: 'defaultValue',
    postingType: 'defaultValue',
    search: ''
  });

  const { jobType, jobGroup, location, postingType, search } = filters;

  useEffect(() => {
    const postingList = async () => {
      try {
        const response = await axios.post('http://localhost:8888/admin/hire/getJobPostingList', {
          jobType,
          jobGroup,
          location,
          postingType,
          search,
          orderType: sortBy
        });

        const data = response.data;
        setJobPostings(data.jobPostings);

        const likedResponse = await axios.get('http://localhost:8888/admin/hire/liked');
        const likedJobPostings = likedResponse.data;

        setJobPostings((prevJobPostings) =>
          prevJobPostings.map((jobPosting) => {
            const isLiked = likedJobPostings.some((liked) => liked.job_posting_no === jobPosting.job_posting_no);
            return {
              ...jobPosting,
              isLiked: isLiked
            };
          })
        );

        const recommendResponse = await axios.get('http://localhost:8888/admin/hire/getRecommendList');
        const recommendData = recommendResponse.data;
        setRecommendedPostings(recommendData);
      } catch (error) {
        console.error(error);
      }
    };

    postingList();
  }, [userId, filters, sortBy]);

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

  const handleFilter = (type, value) => {
    setFilters((filters) => {
      const newValue = value === '전체' ? 'defaultValue' : value;
      const newFilters = { ...filters, [type]: newValue };
      console.log(newFilters);
      return newFilters;
    });
  };

  const handleFilterJobType = (e) => {
    console.log('jobType', e.target.value);

    handleFilter('jobType', e.target.value);
  };

  const handleFilterJobGroup = (e) => {
    handleFilter('jobGroup', e.target.value);
  };

  const handleFilterLocation = (e) => {
    handleFilter('location', e.target.value);
  };

  const handleFilterPostingType = (e) => {
    handleFilter('postingType', e.target.value);
  };

  const handleSearch = (e) => {
    handleFilter('search', e.target.value);
  };

  const handleSort = async (orderType) => {
    if (sortBy === orderType) {
      setSortBy(null);
      return;
    }

    try {
      let orderTypeUrl = '';
      switch (orderType) {
        case 'latest':
          orderTypeUrl = 'latest';
          break;
        case 'deadline':
          orderTypeUrl = 'deadline';
          break;
        case 'mostLiked':
          orderTypeUrl = 'mostLiked';
          break;
        default:
          break;
      }

      const response = await axios.post('http://localhost:8888/admin/hire/getJobPostingList', {
        filters: filters,
        orderType: orderTypeUrl
      });

      const data = response.data;
      setJobPostings(data.jobPostings);
      setSortBy(orderType);
    } catch (error) {
      console.error(error);
    }
  };

  const itemsPerGroup = 3;

  return (
    <Paper>
      <Grid container>
        <Grid item xs={1.2}></Grid>
        <Grid container direction="column" item xs={9.6}>
          <Grid item>
            <Box sx={{ height: '150px', pt: 8, pl: 12, pr: 12 }}>
              <Typography sx={{ fontSize: '35px', fontWeight: 'bold' }}>채용공고</Typography>
              <Divider sx={{ border: '1px solid', mt: 2 }} />
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ height: '80px' }}>
              <Grid container display="flex" justifyContent="space-between" pt={1} pl={12} pr={12}>
                <Grid item>
                  <Grid container spacing={1}>
                    <Grid item>
                      <Select size="small" value={jobType} onChange={handleFilterJobType}>
                        <MenuItem value="defaultValue" disabled style={{ display: 'none' }}>
                          인재유형
                        </MenuItem>
                        <MenuItem value="전체">전체</MenuItem>
                        <MenuItem value="신입">신입</MenuItem>
                        <MenuItem value="경력">경력</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item>
                      <Select size="small" value={jobGroup} onChange={handleFilterJobGroup}>
                        <MenuItem value="defaultValue" disabled style={{ display: 'none' }}>
                          분야
                        </MenuItem>
                        <MenuItem value="전체">전체</MenuItem>
                        <MenuItem value="개발">개발</MenuItem>
                        <MenuItem value="직군2">직군2</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item>
                      <Select size="small" value={location} onChange={handleFilterLocation}>
                        <MenuItem value="defaultValue" disabled style={{ display: 'none' }}>
                          근무지
                        </MenuItem>
                        <MenuItem value="전체">전체</MenuItem>
                        <MenuItem value="근무지1">근무지1</MenuItem>
                        <MenuItem value="근무지2">근무지2</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item>
                      <Select size="small" value={postingType} onChange={handleFilterPostingType}>
                        <MenuItem value="defaultValue" disabled style={{ display: 'none' }}>
                          채용형태
                        </MenuItem>
                        <MenuItem value="전체">전체</MenuItem>
                        <MenuItem value="수시채용">수시채용</MenuItem>
                        <MenuItem value="상시채용">상시채용</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  <Grid container spacing={1}>
                    <Grid item>
                      <Typography
                        sx={{
                          fontSize: '16px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          color: sortBy === 'latest' ? 'black' : 'grey',
                          textDecoration: sortBy === 'latest' ? 'underline' : 'none'
                        }}
                        onClick={() => handleSort('latest')}
                      >
                        최신순
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        sx={{
                          fontSize: '16px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          color: sortBy === 'deadline' ? 'black' : 'grey',
                          textDecoration: sortBy === 'deadline' ? 'underline' : 'none'
                        }}
                        onClick={() => handleSort('deadline')}
                      >
                        마감순
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        sx={{
                          fontSize: '16px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          color: sortBy === 'mostLiked' ? 'black' : 'grey',
                          textDecoration: sortBy === 'mostLiked' ? 'underline' : 'none'
                        }}
                        onClick={() => handleSort('mostLiked')}
                      >
                        관심공고순
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
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
                                  <Grid container alignItems="center" justifyContent="flex-end" spacing={1}>
                                    {/* ... */}
                                  </Grid>
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
                                    <Typography mr={1}>{dayjs(recommendedPosting.jobReq.posting_start).format('YYYY-MM-DD')}</Typography>
                                    <Typography mr={1}>~</Typography>
                                    {recommendedPosting.jobReq.posting_type === '수시채용' ? (
                                      <Typography mr={1}>{dayjs(recommendedPosting.jobReq.posting_end).format('YYYY-MM-DD')}</Typography>
                                    ) : (
                                      <Typography mr={1}> 채용시</Typography>
                                    )}
                                  </Grid>
                                  <Grid container mt={4} direction="column">
                                    <Grid item>{/* ... */}</Grid>
                                    <Grid item mt={1}>
                                      {/* ... */}
                                    </Grid>
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
          </Grid>
          <Grid item>
            <Box sx={{ minHeight: '700px', mt: 2 }}>
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
        <Grid item xs={1.2}></Grid>
      </Grid>
    </Paper>
  );
};
export default PostingListPage;
