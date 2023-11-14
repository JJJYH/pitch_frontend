import { Box, Divider, Grid, TextField, IconButton } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeLang, updateLang } from 'store/langSlice';
import ClearIcon from '@mui/icons-material/Clear';
import langConvert from '../../../langConvert.json';

const Language = () => {
  const lang_data = useSelector((state) => state.lang);
  const dispatch = useDispatch();

  const handleLangChange = (e, index) => {
    const { name, value } = e.target;

    if (name === 'language_level') {
      // 등급이 변경된 경우
      const convertedScore = hskTo1000Score(value);

      // 기존의 language_score를 참조하여 업데이트
      dispatch(updateLang({ index, name: 'language_score', value: convertedScore }));
      // language_level 업데이트
      dispatch(updateLang({ index, name, value }));
    } else {
      // 다른 경우
      dispatch(updateLang({ index, name, value }));
    }
  };

  const langRemoveFields = (index) => {
    dispatch(removeLang(index));
  };

  /**hsk 1000점 환산 로직 */
  const hskTo1000Score = (hskLevel) => {
    // 등급별 HSK등급점수 범위

    const hsk1000ScoreRange = {
      '1급': [185, 280],
      '2급': [285, 380],
      '3급': [301, 499],
      '4급': [501, 699],
      '5급': [701, 899],
      '6급': [901, 999]
    };
    const gradeScoreRange = {
      '1급': [120, 200],
      '2급': [120, 200],
      '3급': [180, 300],
      '4급': [180, 300],
      '5급': [180, 300],
      '6급': [180, 300]
    };

    // 등급별 점수폭
    const scoreRange = {
      '1급': 0.98,
      '2급': 1.23,
      '3급': 1.63,
      '4급': 1.09,
      '5급': 1.09,
      '6급': 0.54
    };

    // 응시자 성적 총점
    const avgScore = 240;
    // 환산점수 계산
    if (Object.prototype.hasOwnProperty.call(hsk1000ScoreRange, hskLevel)) {
      console.log(hsk1000ScoreRange[hskLevel][0]);
      console.log(hskLevel);
      return hsk1000ScoreRange[hskLevel][0] + (avgScore - gradeScoreRange[hskLevel][0]) * scoreRange[hskLevel];
    } else {
      console.log('Invalid hskLevel:', hskLevel);
      return null; // 예외 처리 또는 기본값 반환 등을 수행할 수 있습니다.
    }
  };

  // function getConversionScore(certification, score) {
  //   // 입력된 자격증명과 점수로 검색
  //   const result = langConvert.scores.find((entry) => {
  //     if (certification === 'TEPS') {
  //       const minScore = entry[certification]['최소'];
  //       const maxScore = entry[certification]['최대'];
  //       return score >= minScore && score <= maxScore;
  //     } else {
  //       return entry[certification] === score;
  //     }
  //   });

  //   // 검색 결과가 있다면 환산 점수 반환, 없다면 null 반환
  //   return result ? result['환산 점수'] : null;
  // }

  // // 예시 사용법
  // // const certification = 'TEPS'; // 자격증명
  // // const score = 540; // 점수
  // // const conversionScore = getConversionScore(certification, score);

  // // if (conversionScore !== null) {
  // //   console.log(`환산 점수: ${conversionScore}`);
  // // } else {
  // //   console.log('해당 자격증명과 점수에 대한 데이터가 없습니다.');
  // // }

  return lang_data.map((field, index) => (
    <React.Fragment key={index}>
      <Grid item xs={12}>
        <Grid item xs={12} sx={{ mb: 2.5 }}>
          <Box display={'flex'} flexDirection={'row'} sx={{ gap: 2.5 }} justifyContent={'space-between'} alignItems={'end'}>
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
            {(field.exam_type === 'OPIC' || field.exam_type === 'JLPT' || field.exam_type === 'HSK') && (
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  label="어학 등급"
                  name="language_level"
                  variant="standard"
                  value={field.language_level || ''}
                  onChange={(e) => {
                    handleLangChange(e, index);
                  }}
                />
              </Grid>
            )}

            <Grid item xs={2}>
              <TextField
                fullWidth
                label="어학 점수"
                type="number"
                name="language_score"
                value={field.language_score || ''}
                variant="standard"
                onChange={(e) => {
                  handleLangChange(e, index);
                }}
                InputProps={{
                  readOnly: field.exam_type === 'OPIC' || field.exam_type === 'JLPT' || field.exam_type === 'HSK',
                  onBlur: (e) => {
                    const value = parseInt(e.target.value, 10);
                    if (isNaN(value) || value < 0 || value > 1000) {
                      e.target.value = ''; // 유효하지 않은 값일 경우 입력 지우기 또는 오류 메시지 표시
                    }
                  }
                }}
              />
            </Grid>

            <Grid item xs={1} sx={{ justifyContent: 'end', display: 'flex', flexDirection: 'row' }}>
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
