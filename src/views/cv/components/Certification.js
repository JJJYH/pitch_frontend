import { Box, Divider, Grid } from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Certification = () => {
  const certData = useSelector((state) => state.cert);
  const dispatch = useDispatch();

  const handleCertChange = () => {};
  const certRemoveFields = (index) => {
    console.log('Remove Target :' + index);
  };

  useEffect(() => {
    console.log('formFields changed:', certData);
  }, [certData]);

  return certData.map((field, index) => (
    <React.Fragment key={index}>
      <Divider color="#4682B4" sx={{ mb: 2.5, height: 5, width: '100%' }} />
      <Grid item xs={12}>
        <Grid item xs={12} sx={{ mb: 2.5 }}>
          <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}>
            Certification
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  ));
};

export default Certification;
