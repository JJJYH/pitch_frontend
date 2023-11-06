import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, Divider, Grid, MenuItem, Paper, Select, Typography } from '@mui/material';
import PostingDetailModal from './components/PostingDetailModal';
import { Box } from '@mui/system';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import dayjs from 'dayjs';

const PostingListPage = () => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(2);
  const [jobPostings, setJobPostings] = useState([]);
  const [selectedJobPosting, setSelectedJobPosting] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:8888/admin/hire/getJobPostingList')
      .then((response) => {
        setJobPostings(response.data);
      })
      .catch((error) => {
        console.error('Error fetching job postings:', error);
      });
  }, []);

  const handleJobPostingClick = (jobPosting) => {
    setSelectedJobPosting(jobPosting);
    setCurrentPage(2);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    setIsLiked((prev) => !prev); // 현재 상태를 토글
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
                        <Select>
                          <MenuItem value={1}>Option 1</MenuItem>
                          <MenuItem value={2}>Option 2</MenuItem>
                          <MenuItem value={3}>Option 3</MenuItem>
                        </Select>
                      </Grid>
                      <Grid item>
                        <Select>
                          <MenuItem value={1}>Option 1</MenuItem>
                          <MenuItem value={2}>Option 2</MenuItem>
                          <MenuItem value={3}>Option 3</MenuItem>
                        </Select>
                      </Grid>
                      <Grid item>
                        <Select>
                          <MenuItem value={1}>Option 1</MenuItem>
                          <MenuItem value={2}>Option 2</MenuItem>
                          <MenuItem value={3}>Option 3</MenuItem>
                        </Select>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid container spacing={1}>
                      <Grid item>최신순</Grid>
                      <Grid item>마감순</Grid>
                      <Grid item>좋아요순</Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ minHeight: '500px' }}>
                <Grid container spacing={2} pt={1} pl={12} pr={12}>
                  {jobPostings.map((jobPosting) => {
                    const postingStart = new Date(jobPosting.jobReq.posting_start);
                    const today = new Date();
                    //console.log(today);
                    //console.log(postingStart);

                    if (postingStart <= today) {
                      return (
                        <Grid item xs={4} key={jobPosting.job_posting_no}>
                          <Card sx={{ border: '1px solid', cursor: 'pointer' }} onClick={() => handleJobPostingClick(jobPosting)}>
                            <CardContent>
                              <Grid container sx={{ display: 'flex', justifyContent: 'flex-end' }} spacing={2}>
                                <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                                  {isLiked ? (
                                    <FavoriteIcon style={{ fontSize: 20, color: '#FF6F6F' }} onClick={handleToggle} />
                                  ) : (
                                    <FavoriteBorderIcon style={{ fontSize: 20, color: ' #666666' }} onClick={handleToggle} />
                                  )}
                                </Grid>
                                <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                                  <ShareRoundedIcon style={{ fontSize: 18 }} />
                                </Grid>
                              </Grid>
                              <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>{jobPosting.jobReq.req_title}</Typography>
                              <Grid container mt={1}>
                                <Typography mr={1}>{jobPosting.jobReq.job_type}</Typography>
                                <Typography mr={1}>|</Typography>
                                <Typography mr={1}>{dayjs(jobPosting.jobReq.posting_start).format('YYYY-MM-DD')}</Typography>
                                <Typography mr={1}>~</Typography>
                                <Typography mr={1}>{dayjs(jobPosting.jobReq.posting_end).format('YYYY-MM-DD')}</Typography>
                              </Grid>
                              <Grid container mt={4}>
                                <Grid item>d</Grid>
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
                    isLiked={isLiked}
                    handleToggle={handleToggle}
                    job_posting_no={selectedJobPosting.job_posting_no}
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
