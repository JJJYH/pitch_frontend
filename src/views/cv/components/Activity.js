import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Divider, Grid, IconButton, TextField } from '@mui/material';
import { removeActivity, updateActivity } from 'store/activitySlice';
import ControlledComponent from '../ControlledComponent';
import DisabledByDefaultOutlinedIcon from '@mui/icons-material/DisabledByDefaultOutlined';
const Activity = () => {
  const activityData = useSelector((state) => state.activity);
  const dispatch = useDispatch();

  const handleActivityChange = (e, index) => {
    const { name, value } = e.target;
    dispatch(updateActivity({ index, name, value }));
  };

  const ActivityRemoveFields = (index) => {
    console.log('Remove Target : ' + index);
    dispatch(removeActivity(index));
  };

  return activityData.map((field, index) => (
    <React.Fragment key={index}>
      <Divider color="#4682B4" sx={{ mb: 2.5, height: 5, width: '100%' }} />
      <Grid item xs={12}>
        <Grid item xs={12} sx={{ mb: 2.5 }}>
          <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="활동 구분"
                color="primary"
                type="text"
                name="activityType"
                value={field.activityType}
                placeholder={activityData[index].activityType}
                variant="outlined"
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
                placeholder={activityData[index].organization}
                variant="outlined"
                onChange={(e) => handleActivityChange(e, index)}
              />
            </Grid>
            <Grid item xs={3}>
              <ControlledComponent labelName={'시작일'} StartDate={(e) => handleActivityChange(e, index)} name="startDate" />
            </Grid>
            <Grid item xs={3}>
              <ControlledComponent
                labelName={'종료일'}
                BeforeDay={field.startDate}
                EndDate={(e) => handleActivityChange(e, index)}
                name="endDate"
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
                name="activityDetail"
                value={field.activityDetail}
                placeholder={activityData[index].activityDetail}
                variant="outlined"
                multiline={true}
                onChange={(e) => handleActivityChange(e, index)}
              />
            </Grid>
            <Grid item xs={1} justifyContent={'end'}>
              <IconButton onClick={() => ActivityRemoveFields(index)}>
                <DisabledByDefaultOutlinedIcon />
              </IconButton>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  ));
};

export default Activity;
