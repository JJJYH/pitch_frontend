import { Box, Card, CardContent, Divider, Grid, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddchartIcon from '@mui/icons-material/Addchart';
import ReactWordcloud from 'react-wordcloud';
import { useState } from 'react';
import { useEffect } from 'react';
import { sort } from '../../../api.js';

const ApplicantTotalEval = () => {
  const theme = useTheme();
  const [cloud, setCloud] = useState([]);

  useEffect(() => {
    sort.wordCloud().then((res) => {
      setCloud(res.data);
    });
  }, []);

  return (
    <Box sx={{ marginTop: '20px' }}>
      <Grid container direction="column">
        <Grid item xs={11} sx={{ ml: '30px', mr: '30px' }}>
          <Stack direction={'row'}>
            <AddchartIcon />
            <Typography variant="h4" sx={{ mb: '10px', ml: '4px' }}>
              종합 점수
            </Typography>
          </Stack>
          <Card variant="outlined">
            <CardContent sx={{ display: 'flex' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  height: 1
                }}
              >
                <Typography
                  sx={{
                    background: theme.palette.grey[200],
                    pl: '50px',
                    pr: '50px',
                    pt: '30px',
                    pb: '30px',
                    fontSize: '100px',
                    fontWeight: 'bold',
                    color: theme.palette.success.dark
                  }}
                >
                  A
                </Typography>
              </Box>
              <Grid container sx={{ ml: '20px', border: `${theme.palette.grey[200]} solid 1px` }}>
                <Grid item container xs={6} sx={{ display: 'flex' }} direction="column">
                  <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                    <Typography variant="h4">종합점수</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h1">87</Typography>
                      <Typography variant="h3" sx={{ color: theme.palette.grey[500] }}>
                        /100
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Divider variant="middle" />
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', mt: '30px' }}>
                      <Typography variant="h4">지원자 등수</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h1">6</Typography>
                        <Typography variant="h3" sx={{ color: theme.palette.grey[500] }}>
                          /1,223
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                <Divider orientation="vertical" flexItem />
                <Grid item xs={5}>
                  <Typography variant="h4" sx={{ mt: '15px', ml: '10px' }}>
                    평가 요약
                  </Typography>
                  <Grid container sx={{ mt: '15px', ml: '10px' }}>
                    <Grid item container xs={6} direction={'column'}>
                      <Grid item>
                        <Typography variant="h4">항목1</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h4">항목2</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h4">항목3</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h4">항목4</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h4">항목5</Typography>
                      </Grid>
                    </Grid>
                    <Grid item container xs={6} direction={'column'}>
                      <Grid item>
                        <Typography variant="h4">항목1 점수</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h4">항목2 점수</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h4">항목3 점수</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h4">항목4 점수</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h4">항목5 점수</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={11} sx={{ mt: '20px', ml: '30px' }}>
          <Stack direction={'row'}>
            <AddchartIcon />
            <Typography variant="h4" sx={{ mb: '10px', ml: '4px' }}>
              상세 내용
            </Typography>
          </Stack>
        </Grid>
        <Grid item>
          <ReactWordcloud words={cloud} callbacks={callbacks} options={options} size={size} />
        </Grid>
      </Grid>
    </Box>
  );
};

const callbacks = {
  getWordColor: (word) => (word.value > 3 ? '#38678f' : '#90CAF9')
};
const options = {
  rotations: 0,
  rotationAngles: [-90, 0]
};
const size = [900, 400];

export default ApplicantTotalEval;
