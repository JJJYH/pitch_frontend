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
import Preview from '../Preview';
import { useState } from 'react';
import { useEffect } from 'react';
import DaumPostcode from 'react-daum-postcode';

const Profile = () => {
  /**State 생성 */
  const [profileFormFields, setProfileFormFields] = useState([
    {
      profileName: '김철수',
      phoneNumber: '010-1234-5678',
      birth: '1996.05.05',
      email: 'example.@gmail.com',
      position: 'ERP 개발자',
      address: '',
      gender: ''
    }
  ]);

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
    console.log('formFields changed:', profileFormFields);
  }, [profileFormFields]);

  /**State 관리 */
  const handleInputChange = (e, index) => {
    const values = [...profileFormFields];
    console.log('Event : ' + e.target.name);

    if (e.target.name === 'profileName') {
      values[index].profileName = e.target.value;
    }
    if (e.target.name === 'phoneNumber') {
      values[index].phoneNumber = e.target.value;
    }
    if (e.target.name === 'birth') {
      values[index].birth = e.target.value;
    }
    if (e.target.name === 'email') {
      values[index].email = e.target.value;
    }
    if (e.target.name === 'position') {
      values[index].position = e.target.value;
    }
    if (e.target.name === 'address') {
      values[index].address = e.target.value;
    }
    if (e.target.name === 'gender') {
      values[index].gender = e.target.value;
    }

    setProfileFormFields(values);
  };

  return profileFormFields.map((field, index) => (
    <React.Fragment key={index}>
      <Divider sx={{ mb: 2.5 }} />
      <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}>
        <Grid item xs={10}>
          <Grid item xs={12} sx={{ mb: 2.5 }}>
            <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}>
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  label="Name"
                  color="primary"
                  type="text"
                  variant="filled"
                  name="profileName"
                  value={field.profileName}
                  onChange={(e) => handleInputChange(e, index)}
                  inputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={2.5}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  color="primary"
                  type="text"
                  variant="filled"
                  name="phoneNumber"
                  value={field.phoneNumber}
                  onChange={(e) => handleInputChange(e, index)}
                  inputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Email"
                  color="primary"
                  type="text"
                  variant="filled"
                  name="email"
                  value={field.email}
                  onChange={(e) => handleInputChange(e, index)}
                  inputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={2.5}>
                <TextField
                  fullWidth
                  label="Position"
                  color="primary"
                  type="text"
                  variant="filled"
                  name="position"
                  value={field.position}
                  onChange={(e) => handleInputChange(e, index)}
                  inputProps={{ readOnly: true }}
                />
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Birth"
                  color="primary"
                  type="text"
                  name="birth"
                  value={field.birth}
                  onChange={(e) => handleInputChange(e, index)}
                  variant="filled"
                  inputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Address"
                  color="primary"
                  type="text"
                  name="address"
                  value={field.address}
                  onChange={(e) => handleInputChange(e, index)}
                  variant="outlined"
                />
                <Button onClick={handleOpen}>주소 찾기</Button>
                <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                  <Box sx={Modalstyle}>
                    <DaumPostcode
                      onComplete={(data) => {
                        const updatedFields = [...profileFormFields];
                        updatedFields[index].address = data.address;
                        setProfileFormFields(updatedFields);
                        handleClose();
                      }}
                    />
                  </Box>
                </Modal>
              </Grid>

              <Grid item xs={3}>
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="gender"
                    value={field.gender}
                    onChange={(e) => handleInputChange(e, index)}
                  >
                    <FormControlLabel value="남성" control={<Radio />} label="남성" />
                    <FormControlLabel value="여성" control={<Radio />} label="여성" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={2}>
          <Grid item xs={12}>
            <Card sx={{ width: '128px', height: '135px', background: 'light-grey' }}>
              이미지
              <Divider />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  ));
};

export default Profile;
