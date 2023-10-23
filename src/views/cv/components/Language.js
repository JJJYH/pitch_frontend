import { Box, Divider, Grid } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateLang } from 'store/langSlice';

const Language = () => {
  const langData = useSelector((state) => state.lang);
  const dispatch = useDispatch();

  const handleLangChange = (e, index) => {
    const { name, value } = e.target;
    dispatch(updateLang({ index, name, value }));
  };

  const langRemoveFields = (index) => {
    if (langData.length === 1) {
      alert('At least one form must remain');
      return;
    }
    console.log('Remove Target : ' + index);
    dispatch(removeLang(index));
  };

  return langData.map((field, index) => (
    <React.Fragment key={index}>
      <Divider color="#4682B4" sx={{ mb: 2.5, height: 5, width: '100%' }} />
      <Grid item xs={12}>
        <Grid item xs={12} sx={{ mb: 2.5 }}>
          <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}>
            Language
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  ));
};

export default Language;
