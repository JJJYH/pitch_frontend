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
  InputBase,
  Modal,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material';
import React from 'react';

import { useEffect } from 'react';
import DaumPostcode from 'react-daum-postcode';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from 'store/profileSlice';
import TitlebarImageList from '../TitlebarImageList';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
const Profile = () => {
  const profile_data = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  const handleProfileChange = (e, index) => {
    const { name, value } = e.target;

    dispatch(updateProfile({ index, name, value }));
  };

  /**모달 핸들러 */
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  /**주소 찾기 모달 스타일 */
  const modal_style = {
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

  return profile_data.map((field, index) => (
    <React.Fragment key={index}>
      <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}>
        <Grid item sx={{ flex: '1 1 auto' }}>
          <Grid item xs={12} sx={{ mb: 2.5 }}>
            <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}>
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  required
                  error={field.user_nm === ''}
                  helperText={field.user_nm === '' ? 'This field is required' : ''}
                  label="성명"
                  color="primary"
                  type="text"
                  variant="standard"
                  name="user_nm"
                  value={field.user_nm}
                  onChange={(e) => handleProfileChange(e, index)}
                  inputProps={{ readOnly: false }}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  required
                  error={field.user_phone === ''}
                  helperText={field.user_phone === '' ? 'This field is required' : ''}
                  label="전화번호"
                  color="primary"
                  type="text"
                  variant="standard"
                  name="user_phone"
                  value={field.user_phone}
                  onChange={(e) => handleProfileChange(e, index)}
                  inputProps={{ readOnly: false }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  required
                  error={field.user_email === ''}
                  helperText={field.user_email === '' ? 'This field is required' : ''}
                  label="E-mail"
                  color="primary"
                  type="text"
                  variant="standard"
                  name="user_email"
                  value={field.user_email}
                  onChange={(e) => handleProfileChange(e, index)}
                  inputProps={{ readOnly: false }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  required
                  error={field.position === ''}
                  helperText={field.position === '' ? 'This field is required' : ''}
                  label="지원 직무"
                  color="primary"
                  type="text"
                  variant="standard"
                  name="position"
                  value={field.position}
                  onChange={(e) => handleProfileChange(e, index)}
                  inputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  required
                  error={field.user_birth === ''}
                  helperText={field.user_birth === '' ? 'This field is required' : ''}
                  label="생년월일"
                  color="primary"
                  type="text"
                  name="user_birth"
                  value={field.user_birth}
                  onChange={(e) => handleProfileChange(e, index)}
                  variant="standard"
                  inputProps={{ readOnly: false }}
                />
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}>
              <Grid item xs={12}>
                <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    required
                    error={field.address === ''} // user_nm이 비어 있을 때 error를 true로 설정
                    helperText={field.address === '' ? 'This field is required' : ''} // 에러 메시지
                    label="주소"
                    color="primary"
                    type="text"
                    name="address"
                    placeholder="주소 입력"
                    value={field.address}
                    onChange={(e) => handleProfileChange(e, index)}
                    variant="standard"
                  />
                  <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                  <IconButton color="primary" sx={{ p: '10px' }} onClick={handleOpen}>
                    <LocationOnOutlinedIcon />
                  </IconButton>
                </Paper>
                <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                  <Box sx={modal_style}>
                    <DaumPostcode
                      onComplete={(data) => {
                        handleProfileChange({ target: { name: 'address', value: data.address } }, index);
                        handleClose();
                      }}
                    />
                  </Box>
                </Modal>
              </Grid>
              <Grid item xs={4}>
                <FormControl>
                  <FormLabel size="small" id="demo-row-radio-buttons-group-label">
                    Gender
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    label="Gender"
                    name="gender"
                    value={field.gender}
                    onChange={(e) => handleProfileChange(e, index)}
                    sx={{ height: 10 }}
                    size="small"
                  >
                    <FormControlLabel
                      value="남성"
                      control={<Radio size="small" checked={field.gender === '남성' ? true : false} />}
                      label="남성"
                    />
                    <FormControlLabel
                      value="여성"
                      control={<Radio size="small" checked={field.gender === '여성' ? true : false} />}
                      label="여성"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <Grid item sx={{ flex: '0 0 auto' }}>
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
