import {
  Grid,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  IconButton

  // InputAdornment,
  // OutlinedInput
} from '@mui/material';
import OpenIconSpeedDial from './OpenIconSpeedDial';
// import ImageSearchOutlinedIcon from '@mui/icons-material/ImageSearchOutlined';
import SmartButtonIcon from '@mui/icons-material/SmartButton';
import React from 'react';
// import { useState } from 'react';
import Education from './components/Education';
import Skills from './components/Skills';
import Career from './components/Career';
import Certification from './components/Certification';
import Language from './components/Language';
import Activity from './components/Activity';
import Advantage from './components/Advantage';
import { useState } from 'react';
import AddButton from './AddButton';
import MainCard from 'ui-component/cards/MainCard';
import Preview from './Preview';

const CV = () => {
  const [selectedValue, setSelectedValue] = useState(''); // 선택된 값을 저장할 상태
  const [addressValue, setAddressValue] = useState('');

  /**라디오 버튼 값 변경 시 상태 업데이트 */
  const handleChangeRadio = (event) => {
    setSelectedValue(event.target.value);
  };
  /**주소 텍스트 필드 변경 시 상태 업데이트 */
  const handlrChangeAddress = (event) => {
    setAddressValue(event.target.value);
  };
  /**Console Print */
  console.log('Gender : ' + selectedValue);
  console.log('Address : ' + addressValue);

  /**실질적으로 axios에 실어서 보낼 json형식 form data*/
  /**Education Component State */
  // const [eduState, setEduState] = useState([]);

  // const addEduComp = () => {
  //   setEduState(...eduState, {
  //     index: {
  //       edu_type: null,
  //       enter_date: null,
  //       graduate_date: null,
  //       graduate_type: null,
  //       major: null,
  //       score: null,
  //       total_score: null
  //     }
  //   });
  // };

  // /**Career Component State */
  // const [careerState, setCareerState] = useState([<Career compstate={setCareerState} />]);

  // /**Certification Component State */
  // const [certState, setCertState] = useState([<Certification compstate={setCertState} />]);

  // /**Language Component State */
  // const [langState, setLangState] = useState([<Language compstate={setLangState} />]);

  // /**Activity Component State */
  // const [actState, setActState] = useState([<Activity compstate={setActState} />]);

  // const Preview = () => {
  //   const [imageSrc, setImageSrc] = useState(null);

  //   const onUpload = (e) => {
  //       const file = e.target.files[0];
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file);

  //       return new Promise((resolve) => {
  //           reader.onload = () => {
  //               setImageSrc(reader.result || null); // 파일의 컨텐츠
  //               resolve();
  //           };
  //       });
  //   }

  //   return (
  //       <div>
  //           <input
  //               accept="image/*"
  //               multiple type="file"
  //               onChange={(e) => onUpload(e)}
  //           />
  //           <img
  //               width={'100%'}
  //               src={imageSrc}
  //           />
  //       </div>
  //   )
  // }

  return (
    <>
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <OpenIconSpeedDial />
        <Grid container item xs={8} direction={'row'} spacing={3}>
          {/* // ==============================|| 인적사항 ||============================== // */}
          <Grid item xs={12}>
            <Typography variant="h3">인적사항</Typography>
          </Grid>
          <Grid container item xs={6} spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                color="primary"
                type="text"
                defaultValue="김철수"
                variant="filled"
                inputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                color="primary"
                type="text"
                defaultValue="010-1234-5678"
                variant="filled"
                inputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                color="primary"
                type="text"
                defaultValue="example@google.com"
                variant="filled"
                inputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={10}>
              <TextField
                fullWidth
                label="Address"
                color="primary"
                type="text"
                defaultValue="서울특별시 종로구 창경궁로 254"
                variant="outlined"
                onChange={handlrChangeAddress}
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton aria-label="OCR">
                <SmartButtonIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid container item xs={6} spacing={3}>
            <Grid item xs={12}>
              <MainCard>
                <Preview />
              </MainCard>
            </Grid>
            <Grid item xs={12}></Grid>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Position"
              color="primary"
              type="text"
              defaultValue="ERP 개발자"
              variant="filled"
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={selectedValue} // 현재 선택된 값
                onChange={handleChangeRadio} // 라디오 버튼 값 변경 시 호출될 함수
              >
                <FormControlLabel value="Female" control={<Radio />} label="Female" />
                <FormControlLabel value="Male" control={<Radio />} label="Male" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h3">학력</Typography>
          </Grid>
          {/* // ==============================|| 학력 ||============================== // */}
          <Education />
          {/* setCompState={setEduState} */}
          <Grid item xs={12}>
            <Typography variant="h3">보유 스킬</Typography>
          </Grid>
          {/* // ==============================|| 보유 스킬 ||============================== // */}
          <Skills />
          <Grid item xs={12}>
            <Typography variant="h3">경력사항</Typography>
          </Grid>
          {/* // ==============================|| 경력사항 ||============================== // */}
          <Career />
          {/* {careerState} */}
          <Grid item xs={12}>
            <Typography variant="h3">자격증</Typography>
          </Grid>
          {/* // ==============================|| 자격증 ||============================== // */}
          <Certification />
          {/* {certState} */}
          <Grid item xs={12}>
            <Typography variant="h3">어학성적</Typography>
          </Grid>
          {/* // ==============================|| 어학성적 ||============================== // */}
          <Language />
          {/* {langState} */}
          <Grid item xs={12}>
            <Typography variant="h3">대외활동</Typography>
          </Grid>
          {/* // ==============================|| 대외활동 ||============================== // */}
          <Activity />
          {/* {actState} */}
          <Grid item xs={12}>
            <Typography variant="h3">우대사항</Typography>
          </Grid>
          {/* // ==============================|| 우대 사항 ||============================== // */}
          <Advantage />
        </Grid>
        <Grid container item xs={4} direction={'row'} spacing={3}>
          <AddButton />
        </Grid>
      </Grid>
      {/* container Grid End*/}
    </>
  );
};

export default CV;
