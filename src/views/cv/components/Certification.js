import { Box, Divider, Grid, TextField, IconButton } from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeCert, updateCert } from 'store/certSlice';
import DisabledByDefaultOutlinedIcon from '@mui/icons-material/DisabledByDefaultOutlined';
import ControlledComponent from '../ControlledComponent';
const Certification = () => {
  const certData = useSelector((state) => state.cert);
  const dispatch = useDispatch();

  const handleCertChange = (e, index) => {
    const { name, value } = e.target;
    dispatch(updateCert({ index, name, value }));
  };

  const certRemoveFields = (index) => {
    console.log('Remove Target :' + index);
    dispatch(removeCert(index));
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
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="자격증명"
                color="primary"
                type="text"
                name="certName"
                value={field.certName}
                placeholder={certData[index].certName}
                variant="outlined"
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
                placeholder={certData[index].publisher}
                variant="outlined"
                onChange={(e) => handleCertChange(e, index)}
              />
            </Grid>
            <Grid item xs={4}>
              <ControlledComponent labelName={'취득일'} StartDate={(e) => handleCertChange(e, index)} name="acqDate" />
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={() => certRemoveFields(index)}>
                <DisabledByDefaultOutlinedIcon />
              </IconButton>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  ));
};

export default Certification;
