import { Box, Button, Card, CardHeader, Divider, Grid, IconButton, Modal, Typography } from '@mui/material';
import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import OpenIconSpeedDial from './OpenIconSpeedDial';
import Profile from './components/Profile';
import Education from './components/Education';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
// import Skills from './components/SkillsTest';
import Career from './components/Career';
import Certification from './components/Certification';
import Language from './components/Language';
import Advantage from './components/Advantage';
import CVSide from './components/CVSide';
import { useRef } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Activity from './components/Activity';
import { addEducation } from 'store/educationSlice';
import { addCareer } from 'store/careerSlice';
import { addActivity } from 'store/activitySlice';
import { addLang } from 'store/langSlice';
import { addCert } from 'store/certSlice';
import { get, cv } from 'api';
import AddIcon from '@mui/icons-material/Add';
import ControllableStates from './components/Skills';
import FileUpload from './FileUpload';
import Statement from './Statement';
import Ocr from './Ocr';
import { updateProfile } from 'store/profileSlice';
import { useEffect } from 'react';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const CV = () => {
  const dispatch = useDispatch();
  const profileInfo = useSelector((state) => state.profile);

  useEffect(() => {
    cv.getInit().then((res) => {
      dispatch(
        updateProfile({
          index: 0,
          name: 'user_nm',
          value: res.data.user_nm || ''
        })
      );
      dispatch(
        updateProfile({
          index: 0,
          name: 'user_phone',
          value: res.data.user_phone || ''
        })
      );
      dispatch(
        updateProfile({
          index: 0,
          name: 'user_email',
          value: res.data.user_email || ''
        })
      );
      dispatch(
        updateProfile({
          index: 0,
          name: 'user_birth',
          value: res.data.user_birth || ''
        })
      );
      console.log('Init Profile Data : ' + JSON.stringify(profileInfo));
    });
  }, []);

  const [selectedFiles, setSelectedFiles] = useState({
    Portfolio: [], // 초기에 빈 배열로 설정
    Career: [], // 초기에 빈 배열로 설정
    Statement: [], // 초기에 빈 배열로 설정
    etcDocs: [] // 초기에 빈 배열로 설정
  });

  const eduAddFields = () => {
    const new_edu_arr = {
      edu_no: '',
      edu_type: '',
      enter_date: '',
      graduate_date: '',
      major: '',
      graduate_type: '',
      total_score: '',
      score: ''
    };
    dispatch(addEducation(new_edu_arr));
  };

  const careerAddFields = () => {
    const new_career_arr = {
      career_no: '',
      company_name: '',
      cv_dept_name: '',
      position: '',
      join_date: '',
      salary: '',
      job: '',
      quit_date: '',
      note: ''
    };
    dispatch(addCareer(new_career_arr));
  };

  const langAddFields = () => {
    const new_lang_arr = { language_no: '', exam_type: '', language_name: '', language_score: '' };
    dispatch(addLang(new_lang_arr));
  };

  const activityAddFields = () => {
    const new_activity_arr = { activity_no: '', activity_type: '', organization: '', start_date: '', end_date: '', activity_detail: '' };
    dispatch(addActivity(new_activity_arr));
  };

  const certAddFields = () => {
    const new_cert_arr = { cert_no: '', cert_name: '', publisher: '', acquisition_date: '' };
    dispatch(addCert(new_cert_arr));
  };

  const [current_tab, set_current_tab] = useState(null);

  const tab_ref = useRef({});

  const componentRef = useRef(null);

  const scrollToTab = (index) => {
    if (tab_ref.current[index]) {
      const targetScrollY = tab_ref.current[index].offsetTop + -75;

      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth'
      });

      set_current_tab(index);
    }
  };

  /**모달 핸들러 */
  const [upload_open, set_upload_Open] = React.useState(false);
  const upload_handle_open = () => set_upload_Open(true);
  const upload_handle_close = () => set_upload_Open(false);

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

  return (
    <Grid container spacing={2.5}>
      <OpenIconSpeedDial selectedFiles={selectedFiles} componentRef={componentRef} />
      <Grid item xs={1} />
      <Grid item xs={9}>
        <MainCard>
          <CardHeader title={<Typography sx={{ fontSize: '25px', fontWeight: 'bold' }}>이력서 작성</Typography>} />
          {/* <Divider /> */}
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Grid item xs={12}>
              <MainCard ref={componentRef}>
                <Typography sx={{ fontSize: '20px', height: '40px', fontWeight: 'bold' }}>인적사항</Typography>
                <Divider color="black" sx={{ mb: 2.5, height: 3, width: '100%' }} />
                <Profile />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ mt: 5 }}>
                  <Typography
                    ref={(el) => (tab_ref.current['education'] = el)}
                    sx={{ fontSize: '20px', height: '40px', fontWeight: 'bold' }}
                  >
                    학력
                  </Typography>
                  <IconButton onClick={() => eduAddFields()}>
                    <AddIcon />
                  </IconButton>
                </Box>
                <Divider color="black" sx={{ mb: 2.5, height: 3, width: '100%' }} />
                <Education />
                <Box
                  display={'flex'}
                  flexDirection={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  sx={{ mt: 2.5, height: '40px' }}
                >
                  <Typography ref={(el) => (tab_ref.current['skills'] = el)} sx={{ fontSize: '20px', height: '40px', fontWeight: 'bold' }}>
                    보유 스킬
                  </Typography>
                </Box>
                <Divider color="black" sx={{ mb: 2.5, height: 3, width: '100%' }} />
                {/* <Skills /> */}
                <ControllableStates />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ mt: 5 }}>
                  <Typography ref={(el) => (tab_ref.current['career'] = el)} sx={{ fontSize: '20px', height: '40px', fontWeight: 'bold' }}>
                    경력 사항
                  </Typography>

                  <IconButton onClick={() => careerAddFields()}>
                    <AddIcon />
                  </IconButton>
                </Box>
                <Divider color="black" sx={{ mb: 2.5, height: 3, width: '100%' }} />
                <Career />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ mt: 5 }}>
                  <Typography ref={(el) => (tab_ref.current['cert'] = el)} sx={{ fontSize: '20px', height: '40px', fontWeight: 'bold' }}>
                    자격증
                  </Typography>
                  <Box display={'flex'} flexDirection={'row'} justifyContent={'end'}>
                    <Ocr />
                    <IconButton onClick={() => certAddFields()}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Divider color="black" sx={{ mb: 2.5, height: 3, width: '100%' }} />
                <Certification />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ mt: 5 }}>
                  <Typography ref={(el) => (tab_ref.current['lang'] = el)} sx={{ fontSize: '20px', height: '40px', fontWeight: 'bold' }}>
                    어학 성적
                  </Typography>
                  <Box display={'flex'} flexDirection={'row'} justifyContent={'end'}>
                    <Ocr />
                    <IconButton onClick={() => langAddFields()}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Divider color="black" sx={{ mb: 2.5, height: 3, width: '100%' }} />
                <Language />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ mt: 5 }}>
                  <Typography ref={(el) => (tab_ref.current['docs'] = el)} sx={{ fontSize: '20px', height: '40px', fontWeight: 'bold' }}>
                    포트폴리오 및 기타문서
                  </Typography>
                  <Modal open={upload_open} onClose={upload_handle_close}>
                    <Box sx={modal_style}>
                      <Button>포트폴리오</Button>
                      <FileUpload endPath={'Portfolio'} selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
                      <Button>경력기술서</Button>
                      <FileUpload endPath={'Career'} selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
                      <Button>자기소개서</Button>
                      <FileUpload endPath={'Statement'} selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
                      <Button>기타 문서</Button>
                      <FileUpload endPath={'etcDocs'} selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
                    </Box>
                  </Modal>
                  <IconButton onClick={upload_handle_open}>
                    <FileUploadIcon />
                  </IconButton>
                </Box>
                <Divider color="black" sx={{ mb: 2.5, height: 3, width: '100%' }} />
                <Statement selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ mt: 5 }}>
                  <Typography
                    ref={(el) => (tab_ref.current['activity'] = el)}
                    sx={{ fontSize: '20px', height: '40px', fontWeight: 'bold' }}
                  >
                    대외 활동
                  </Typography>
                  <IconButton onClick={() => activityAddFields()}>
                    <AddIcon />
                  </IconButton>
                </Box>
                <Divider color="black" sx={{ mb: 2.5, height: 3, width: '100%' }} />
                <Activity />

                <Box display={'flex'} flexDirection={'row'} justifyContent={'start'} alignItems={'center'} sx={{ mt: 5, height: '40px' }}>
                  <Typography
                    ref={(el) => (tab_ref.current['advantage'] = el)}
                    sx={{ fontSize: '20px', height: '40px', fontWeight: 'bold' }}
                  >
                    우대 사항
                  </Typography>
                </Box>
                <Divider color="black" sx={{ mb: 2.5, height: 3, width: '100%' }} />
                <Advantage />
              </MainCard>
            </Grid>
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={1}>
        <CVSide currentTab={current_tab} scrollToTab={scrollToTab} tabRef={tab_ref} />
      </Grid>

      <Grid item xs={1} />
    </Grid>
  );
};

export default CV;
