import { Box, Divider, Grid, TextField, IconButton } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeLang, updateLang } from 'store/langSlice';
import DisabledByDefaultOutlinedIcon from '@mui/icons-material/DisabledByDefaultOutlined';
const Language = () => {
  const langData = useSelector((state) => state.lang);
  const dispatch = useDispatch();

  const handleLangChange = (e, index) => {
    const { name, value } = e.target;
    dispatch(updateLang({ index, name, value }));
  };

  const langRemoveFields = (index) => {
    console.log('Remove Target : ' + index);
    dispatch(removeLang(index));
  };

  return langData.map((field, index) => (
    <React.Fragment key={index}>
      <Divider color="#4682B4" sx={{ mb: 2.5, height: 5, width: '100%' }} />
      <Grid item xs={12}>
        <Grid item xs={12} sx={{ mb: 2.5 }}>
          <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="시험 구분"
                color="primary"
                type="text"
                name="examType"
                value={field.examType}
                placeholder={langData[index].examType}
                variant="outlined"
                onChange={(e) => handleLangChange(e, index)}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="외국어명"
                color="primary"
                type="text"
                name="langName"
                value={field.langName}
                placeholder={langData[index].langName}
                variant="outlined"
                onChange={(e) => handleLangChange(e, index)}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="어학 점수"
                type="number"
                name="langScore"
                value={field.langScore}
                onChange={(e) => handleLangChange(e, index)}
                InputProps={{
                  onBlur: (e) => {
                    const value = parseInt(e.target.value, 10);
                    if (isNaN(value) || value < 0 || value > 1000) {
                      e.target.value = ''; // 유효하지 않은 값일 경우 입력 지우기 또는 오류 메시지 표시
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={1} justifyContent={'end'}>
              <IconButton onClick={() => langRemoveFields(index)}>
                <DisabledByDefaultOutlinedIcon />
              </IconButton>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  ));
};

export default Language;
