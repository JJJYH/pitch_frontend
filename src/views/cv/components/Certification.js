import { Box, Divider, Grid, TextField, IconButton } from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeCert, updateCert } from 'store/certSlice';
import ClearIcon from '@mui/icons-material/Clear';
import ControlledComponent from '../ControlledComponent';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
const Certification = () => {
  const cert_data = useSelector((state) => state.cert);
  const dispatch = useDispatch();

  const handleCertChange = (e, index) => {
    const { name, value } = e.target;
    dispatch(updateCert({ index, name, value }));
  };

  const certRemoveFields = (index) => {
    console.log('Remove Target :' + index);
    dispatch(removeCert(index));
  };

  return cert_data.map((field, index) => (
    <React.Fragment key={index}>
      <Grid item xs={12}>
        <Grid item xs={12} sx={{ mb: 2.5 }}>
          <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="자격증명"
                color="primary"
                type="text"
                name="cert_name"
                value={field.cert_name}
                placeholder={cert_data[index].cert_name}
                variant="standard"
                onChange={(e) => handleCertChange(e, index)}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="발행처"
                color="primary"
                type="text"
                name="publisher"
                value={field.publisher}
                placeholder={cert_data[index].publisher}
                variant="standard"
                onChange={(e) => handleCertChange(e, index)}
              />
            </Grid>
            <Grid item xs={4}>
              <ControlledComponent labelName={'취득일'} StartDate={(e) => handleCertChange(e, index)} name="acquisition_date" />
            </Grid>

            <Grid item xs={1}>
              <IconButton onClick={() => certRemoveFields(index)}>
                <ClearIcon />
              </IconButton>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  ));
};

export default Certification;
