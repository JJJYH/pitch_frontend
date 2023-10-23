import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Modal,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material';
import SmartButtonIcon from '@mui/icons-material/SmartButton';
import React from 'react';
import MainCard from 'ui-component/cards/MainCard';

import { useState } from 'react';
import { useEffect } from 'react';
import DaumPostcode from 'react-daum-postcode';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from 'store/profileSlice';
import TitlebarImageList from '../TitlebarImageList';

const Profile = () => {
  const profileData = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  const handleProfileChange = (e, index) => {
    const { name, value } = e.target;

    dispatch(updateProfile({ index, name, value }));
  };

  const profileRemoveFields = (index) => {
    if (careerData.length === 1) {
      alert('At least one form must remain');
      return;
    }
    console.log('Remove Target : ' + index);
    dispatch(removeProfile(index));
  };

  /**모달 핸들러 */
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  /**주소 찾기 모달 스타일 */
  const Modalstyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
  };

  useEffect(() => {
    console.log('formFields changed:', profileData);
  }, [profileData]);

  return profileData.map((field, index) => (
    <React.Fragment key={index}>
      <Divider color="#4682B4" sx={{ mb: 2.5, height: 5, width: '100%' }} />
      <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}>
        <Grid item xs={8}>
          <Grid item xs={12} sx={{ mb: 2.5 }}>
            <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Name"
                  color="primary"
                  type="text"
                  variant="filled"
                  name="profileName"
                  value={field.profileName}
                  onChange={(e) => handleProfileChange(e, index)}
                  inputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  color="primary"
                  type="text"
                  variant="filled"
                  name="phoneNumber"
                  value={field.phoneNumber}
                  onChange={(e) => handleProfileChange(e, index)}
                  inputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label="Email"
                  color="primary"
                  type="text"
                  variant="filled"
                  name="email"
                  value={field.email}
                  onChange={(e) => handleProfileChange(e, index)}
                  inputProps={{ readOnly: true }}
                />
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} sx={{ mb: 2.5 }}>
            <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Position"
                  color="primary"
                  type="text"
                  variant="filled"
                  name="position"
                  value={field.position}
                  onChange={(e) => handleProfileChange(e, index)}
                  inputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Birth"
                  color="primary"
                  type="text"
                  name="birth"
                  value={field.birth}
                  onChange={(e) => handleProfileChange(e, index)}
                  variant="filled"
                  inputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item xs={4}>
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    label="Gender"
                    name="gender"
                    value={field.gender}
                    onChange={(e) => handleProfileChange(e, index)}
                    sx={{ height: 10 }}
                  >
                    <FormControlLabel value="남성" control={<Radio size="small" />} label="남성" />
                    <FormControlLabel value="여성" control={<Radio size="small" />} label="여성" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  color="primary"
                  type="text"
                  name="address"
                  value={field.address}
                  onChange={(e) => handleProfileChange(e, index)}
                  variant="outlined"
                />
                <Button onClick={handleOpen}>주소 찾기</Button>
                <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                  <Box sx={Modalstyle}>
                    <DaumPostcode
                      onComplete={(data) => {
                        handleProfileChange({ target: { name: 'address', value: data.address } }, index);
                        handleClose();
                      }}
                    />
                  </Box>
                </Modal>
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <Grid item xs={12}>
            <TitlebarImageList />
            {/* <Card sx={{ width: '128px', height: '135px', background: 'light-grey' }}></Card> */}
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  ));
};

export default Profile;
