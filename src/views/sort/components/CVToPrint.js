import React from 'react';
import ApplicantCV from './ApplicantCV';
import { Box } from '@mui/system';
import { sort } from '../../../api.js';
import { useState } from 'react';
import { useEffect } from 'react';

const CVToPrint = React.forwardRef(({ rows }, ref) => {
  const [printingPages, setPrintingPages] = useState([]);
  useEffect(() => {
    if (rows.length == 0) {
      setPrintingPages([]);
    }
    Promise.all(
      rows.map((row) => {
        return sort.applicantDetail(row.apply_no).then((res) => {
          return <ApplicantCV applicantInfo={res.data} key={res.data.cv.user_email} />;
        });
      })
    ).then((templates) => {
      setPrintingPages([...templates]);
    });
  }, [rows]);

  return (
    <Box
      ref={ref}
      sx={{
        '@media print': {
          overflow: 'visible',
          height: 'auto'
        },
        overflow: 'hidden',
        height: 0
      }}
    >
      {printingPages}
    </Box>
  );
});

export default CVToPrint;
