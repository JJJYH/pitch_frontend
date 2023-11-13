import React, { useRef } from 'react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { IconButton } from '@mui/material';
import { cv } from '../../api';
import { useState } from 'react';
import { useEffect } from 'react';

const FileUpload = ({ endPath, selectedFiles, setSelectedFiles }) => {
  const cvFileUploadRef = useRef(null);

  const addFiles = (files) => {
    const existingFiles = selectedFiles[endPath] || [];
    const updatedFiles = [...existingFiles, ...files];

    setSelectedFiles((prevSelectedFiles) => ({
      ...prevSelectedFiles,
      [endPath]: updatedFiles
    }));
  };

  

  return (
    <React.Fragment>
      <IconButton onClick={() => cvFileUploadRef.current.click()}>
        <AttachFileIcon />
      </IconButton>
      <input type="file" style={{ display: 'none' }} onChange={(e) => addFiles(e.target.files)} multiple ref={cvFileUploadRef} />
    </React.Fragment>
  );
};

export default FileUpload;
