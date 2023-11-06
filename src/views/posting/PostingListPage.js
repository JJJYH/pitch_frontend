import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import PostingDetailModal from './components/PostingDetailModal';

const PostingListPage = () => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(2);
  const [jobPostings, setJobPostings] = useState([]);
  const [selectedJobPosting, setSelectedJobPosting] = useState(null);

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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {jobPostings.map((jobPosting) => (
        <a href="#" key={jobPosting.job_posting_no} onClick={() => handleJobPostingClick(jobPosting)}>
          <span>{jobPosting.jobReq.req_title}</span>
        </a>
      ))}

      {selectedJobPosting && (
        <PostingDetailModal
          open={open}
          close={handleClose}
          page="postingList"
          formData={selectedJobPosting.jobReq}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};
export default PostingListPage;
