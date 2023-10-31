import React from 'react';
import { useState } from 'react';
import { Button } from '@mui/material';
import PostingDetailModal from './PostingDetailModal';

const PostingListPage = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleOpen}>모달</Button>
      <PostingDetailModal open={open} handleClose={handleClose} />
    </div>
  );
};
export default PostingListPage;
