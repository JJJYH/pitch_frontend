{
  /* // ==============================|| 자격증 ||============================== // */
}
import { Grid, TextField } from '@mui/material';
import React from 'react';
import ControlledComponent from '../ControlledComponent';
import { useState } from 'react';

const Certification = () => {
  const [certName, setCertName] = useState([]);
  const [publisher, setPublisher] = useState([]);
  const [acquDate, setAcqDate] = useState([]);

  /**자격증 명 값 변경 시 업데이트 */
  const handleChangeCertName = (event) => {
    setCertName(event.target.value);
  };

  /**자격증 발행처 변경 시 업데이트 */
  const handleChangePublisher = () => {
    setPublisher(event.target.value);
  };

  /**Console Print */
  console.log('Certification : ' + certName);
  console.log('Publisher : ' + publisher);
  console.log('AcqDate : ' + acquDate);

  return (
    <>
      <Grid item xs={4}>
        <TextField
          fullWidth
          label="cert_name"
          color="primary"
          type="text"
          placeholder="자격증 명"
          variant="outlined"
          onChange={handleChangeCertName}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          fullWidth
          label="publisher"
          color="primary"
          type="text"
          placeholder="발행처"
          variant="outlined"
          onChange={handleChangePublisher}
        />
      </Grid>
      <Grid item xs={4}>
        <ControlledComponent labelName={'acquisition_date'} StartDate={setAcqDate} />
      </Grid>
    </>
  );
};

export default Certification;
