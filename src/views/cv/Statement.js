import { Button, Grid, Typography } from '@mui/material';
import React from 'react';

const Statement = ({ selectedFiles, setSelectedFiles }) => {
  const handleRemoveFile = (groupKey, index) => {
    const updatedFiles = { ...selectedFiles };
    updatedFiles[groupKey].splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  return (
    <>
      {Object.keys(selectedFiles).map((groupKey) => (
        <Grid item xs={12} key={groupKey}>
          <Typography sx={{ fontSize: '20px', color: '#cccccc' }}>{groupKey}</Typography>
          {selectedFiles[groupKey].length > 0 && (
            <div>
              <h3>Selected Files:</h3>
              <ul>
                {selectedFiles[groupKey].map((file, index) => (
                  <li key={index}>
                    {file.name}
                    <Button onClick={() => handleRemoveFile(groupKey, index)}>Remove</Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Grid>
      ))}
    </>
  );
};

export default Statement;
