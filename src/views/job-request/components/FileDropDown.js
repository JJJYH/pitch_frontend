import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/system';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ClearIcon from '@mui/icons-material/Clear';
import { useDispatch, useSelector } from 'react-redux';
import { setUploadedFiles, uploadedFilesSelector } from 'store/uploadedFilesSlice';

const FileDropDown = ({ handleFiles }) => {
  const [isActive, setActive] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const uploadedFiles = useSelector(uploadedFilesSelector);
  const dispatch = useDispatch();

  const StyledUploadBox = styled('label')(() => ({
    height: '50px',
    margin: 'auto',
    backgroundColor: isActive ? '#efeef3' : '#fff',
    borderRadius: '5px',
    border: '2px dashed #c0c0c0',
    padding: '5px',
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
    padding: '8px 20px'
  }));

  const handleDragOver = (event) => {
    event.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setActive(false);
    const files = Array.from(event.dataTransfer.files);
    handleFileSelect(files);
  };

  const handleFileInputChange = (event) => {
    const files = Array.from(event.target.files);
    handleFileSelect(files);
  };

  const handleFileSelect = (files) => {
    setUploadFiles((prevFiles) => [...prevFiles, ...files]);
    handleFiles(files);
  };

  const handleDeleteFile = (index) => {
    setUploadFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  return (
    <div>
      <StyledUploadBox onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        <input id="fileInput" type="file" className="file" style={{ display: 'none' }} multiple onChange={handleFileInputChange} />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <FileUploadIcon sx={{ fontSize: 20, color: '#888', mr: 1 }} />
          <Typography variant="subtitle1" fontWeight={500} sx={{ marginTop: '2px' }}>
            클릭, 드래그, 혹은 파일을 이곳에 드롭하세요.
          </Typography>
        </Box>
      </StyledUploadBox>

      {uploadFiles.length > 0 && uploadedFiles.length === 0 && (
        <UploadedFileInfoBox>
          {uploadFiles.map((file, index) => (
            <Box key={index} display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center">
                <AttachFileIcon sx={{ fontSize: 18, color: '#888', mr: 0.5 }} />
                <Typography>{file.name}</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Typography mr={2} mt={0.5}>
                  {(file.size / 1024).toFixed(2)} KB
                </Typography>
                <IconButton onClick={() => handleDeleteFile(index)}>
                  <ClearIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </UploadedFileInfoBox>
      )}

      {uploadedFiles.length > 0 && (
        <UploadedFileInfoBox>
          {uploadedFiles.map((file, index) => (
            <Box key={index} display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center">
                <AttachFileIcon sx={{ fontSize: 18, color: '#888', mr: 0.5 }} />
                <Typography>{file.file_name}</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Typography mr={2} mt={0.5}>
                  {(file.file_size / 1024).toFixed(2)} KB
                </Typography>
                <IconButton onClick={() => handleDeleteFile(index)}>
                  <ClearIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </UploadedFileInfoBox>
      )}
    </div>
  );
};

export default FileDropDown;
