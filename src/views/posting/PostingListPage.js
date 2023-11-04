import React from 'react';
import { useState } from 'react';
import { Button } from '@mui/material';
import PostingDetailModal from './components/PostingDetailModal';

const PostingListPage = () => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(2);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleOpen}>모달</Button>
      <PostingDetailModal open={open} close={handleClose} page="postingList" currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};
export default PostingListPage;
