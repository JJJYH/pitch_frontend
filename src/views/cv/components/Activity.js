import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Divider, Grid, IconButton, TextField } from '@mui/material';
import { removeActivity, updateActivity } from 'store/activitySlice';
import ControlledComponent from '../ControlledComponent';
import ClearIcon from '@mui/icons-material/Clear';
const Activity = () => {
  const activity_data = useSelector((state) => state.activity);
  const dispatch = useDispatch();

  const handleActivityChange = (e, index) => {
    const { name, value } = e.target;
    dispatch(updateActivity({ index, name, value }));
  };

  const ActivityRemoveFields = (index) => {
    dispatch(removeActivity(index));
  };

  return activity_data.map((field, index) => (
    <React.Fragment key={index}>
      <Grid item xs={12}>
        <Grid item xs={12} sx={{ mb: 2.5 }}>
          <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="활동 구분"
                color="primary"
                type="text"
                name="activity_type"
                value={field.activity_type}
                placeholder={activity_data[index].activity_type}
                variant="standard"
                onChange={(e) => handleActivityChange(e, index)}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="기관명"
                color="primary"
                type="text"
                name="organization"
                value={field.organization}
                placeholder={activity_data[index].organization}
                variant="standard"
                onChange={(e) => handleActivityChange(e, index)}
              />
            </Grid>
            <Grid item xs={3}>
              <ControlledComponent labelName={'시작일'} StartDate={(e) => handleActivityChange(e, index)} name="start_date" />
            </Grid>
            <Grid item xs={3}>
              <ControlledComponent
                labelName={'종료일'}
                BeforeDay={field.start_date}
                EndDate={(e) => handleActivityChange(e, index)}
                name="end_date"
              />
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12} sx={{ mb: 2.5 }}>
          <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="활동 내용"
                color="primary"
                type="text"
                name="activity_detail"
                value={field.activity_detail}
                placeholder={activity_data[index].activity_detail}
                variant="standard"
                multiline={true}
                onChange={(e) => handleActivityChange(e, index)}
              />
            </Grid>
            <Grid item xs={1} justifyContent={'end'}>
              <IconButton onClick={() => ActivityRemoveFields(index)}>
                <ClearIcon />
              </IconButton>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  ));
};

export default Activity;
