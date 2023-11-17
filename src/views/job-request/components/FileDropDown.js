import React from 'react';
import { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/system';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ClearIcon from '@mui/icons-material/Clear';

const FileDropDown = () => {
  const [isActive, setActive] = useState(false);
  const handleDragStart = () => setActive(true);
  const handleDragEnd = () => setActive(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const StyledUploadBox = styled('label')(() => ({
    height: '50px',
    margin: 'auto',
    backgroundColor: isActive ? '#efeef3' : '#fff',
    borderRadius: '5px',
    border: '2px dashed #c0c0c0',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      borderColor: '#364152'
    }
  }));

  const UploadedFileInfoBox = styled('div')(() => ({
    border: '1px solid #c0c0c0',
    marginTop: '20px',
    padding: '8px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }));

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setUploadedFile(file);
    setActive(false);
  };

  const handleDeleteFile = () => {
    setUploadedFile(null);
  };
  return (
    <div>
      <StyledUploadBox onDragEnter={handleDragStart} onDragLeave={handleDragEnd} onDragOver={handleDragOver} onDrop={handleDrop}>
        <input type="file" className="file" style={{ display: 'none' }} />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <FileUploadIcon sx={{ fontSize: 20, color: '#888', mr: 1, mt: 0.8 }} />
          <Typography variant="subtitle1" fontWeight={500} sx={{ marginTop: '10px' }}>
            클릭 혹은 파일을 이곳에 드롭하세요.
          </Typography>
        </Box>
      </StyledUploadBox>
      {uploadedFile && (
        <UploadedFileInfoBox>
          <Box display="flex" justifyContent="center" alignItems="center">
            <AttachFileIcon sx={{ fontSize: 18, color: '#888', mr: 0.5 }} />
            <Typography>{uploadedFile.name}</Typography>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography mr={2} mt={0.5}>
              {(uploadedFile.size / 1024).toFixed(2)} KB
            </Typography>
            <IconButton onClick={handleDeleteFile}>
              <ClearIcon />
            </IconButton>
          </Box>
        </UploadedFileInfoBox>
      )}
    </div>
  );
};

export default FileDropDown;
