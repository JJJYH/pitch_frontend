import { Box, Divider, Grid, TextField, IconButton } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeLang, updateLang } from 'store/langSlice';
import ClearIcon from '@mui/icons-material/Clear';
const Language = () => {
  const lang_data = useSelector((state) => state.lang);
  const dispatch = useDispatch();

  const handleLangChange = (e, index) => {
    const { name, value } = e.target;
    dispatch(updateLang({ index, name, value }));
  };

  const langRemoveFields = (index) => {
    dispatch(removeLang(index));
  };

  return lang_data.map((field, index) => (
    <React.Fragment key={index}>
      <Grid item xs={12}>
        <Grid item xs={12} sx={{ mb: 2.5 }}>
          <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }}>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="시험 구분"
                color="primary"
                type="text"
                name="exam_type"
                value={field.exam_type}
                placeholder={lang_data[index].exam_type}
                variant="standard"
                onChange={(e) => handleLangChange(e, index)}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="외국어명"
                color="primary"
                type="text"
                name="language_name"
                value={field.language_name}
                placeholder={lang_data[index].language_name}
                variant="standard"
                onChange={(e) => handleLangChange(e, index)}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="어학 점수"
                type="number"
                name="language_score"
                value={field.language_score}
                variant="standard"
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
                <ClearIcon />
              </IconButton>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  ));
};

export default Language;
