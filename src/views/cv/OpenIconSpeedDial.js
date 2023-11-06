import * as React from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import { useDispatch, useSelector } from 'react-redux';
import { cv } from 'api';
import { useRef } from 'react';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import { updateProfile } from 'store/profileSlice';
import { IconSortAscendingLetters } from '@tabler/icons';
import { addEducation, updateEducation } from 'store/educationSlice';
import { useEffect } from 'react';
import { addSkill, updateSkill } from 'store/skillSlice';
import { addCareer } from 'store/careerSlice';
import { addCert } from 'store/certSlice';
import { addLang } from 'store/langSlice';
import { addActivity } from 'store/activitySlice';
import { addAdvantage, updateAdvantage } from 'store/advantageSlice';
import { flushSync } from 'react-dom';
import { updateCVNO } from 'store/cvSlice';

export default function OpenIconSpeedDial({ selectedFiles, endPath, componentRef }) {
  const cvProfile = useSelector((state) => state.profile);
  const cvEducation = useSelector((state) => state.education);
  const cvActivity = useSelector((state) => state.activity);
  const cvAdvantage = useSelector((state) => state.advantage);
  const cvCareer = useSelector((state) => state.career);
  const cvLanguage = useSelector((state) => state.lang);
  const cvSkill = useSelector((state) => state.skill);
  const cvCertification = useSelector((state) => state.cert);
  const [isWritten, setIsWritten] = useState();
  const dispatch = useDispatch();
  const cv_no = useSelector((state) => state.cv_no);

  // CV_LIST 쪽에서 받아와야 하는 cv_no 임시 설정
  let proto_cv_no = cv_no.cv_no;
  const job_posting_no = 1;
  //CV 데이터 포집 기능
  const cvData = {
    cv: {
      cv_no: proto_cv_no,
      job_posting_no: job_posting_no,
      user_id: cvProfile[0].user_id,
      user_nm: cvProfile[0].user_nm,
      ps_statement: null,
      gender: cvProfile[0].gender,
      position: cvProfile[0].position,
      address: cvProfile[0].address,
      activities: cvActivity,
      advantages: cvAdvantage,
      careers: cvCareer,
      certifications: cvCertification,
      educations: cvEducation,
      languages: cvLanguage,
      skills: cvSkill
    }
  };

  //인쇄 하기 기능
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  const loadCV = async () => {
    //이력서 불러오기 요청 시 이력서가 없을 경우 Written false
    cv.getList(proto_cv_no).then((data) => {
      if (data.data === '') {
        console.log('IS Empty');
        setIsWritten(false);
      } else {
        console.log('LIST GET : ' + JSON.stringify(data));
        setIsWritten(true);
        dispatch(updateProfile({ index: 0, name: 'user_id', value: data.data.user_id }));
        dispatch(updateProfile({ index: 0, name: 'address', value: data.data.address }));
        dispatch(updateProfile({ index: 0, name: 'gender', value: data.data.gender }));
        data.data['educations'].map((item, key) => {
          if (key == 0) {
            // console.log(item);
            dispatch(
              updateEducation({
                index: 0,
                name: 'edu_no',
                value: item.edu_no
              })
            );
            dispatch(
              updateEducation({
                index: 0,
                name: 'edu_type',
                value: item.edu_type
              })
            );
            dispatch(
              updateEducation({
                index: 0,
                name: 'enter_date',
                value: item.enter_date
              })
            );
            dispatch(
              updateEducation({
                index: 0,
                name: 'graduate_date',
                value: item.graduate_date
              })
            );
            dispatch(
              updateEducation({
                index: 0,
                name: 'major',
                value: item.major
              })
            );
            dispatch(
              updateEducation({
                index: 0,
                name: 'graduate_type',
                value: item.graduate_type
              })
            );
            dispatch(
              updateEducation({
                index: 0,
                name: 'total_score',
                value: item.total_score
              })
            );
            dispatch(
              updateEducation({
                index: 0,
                name: 'score',
                value: item.score
              })
            );
          }
          if (key !== 0 && data.data['educations'].length > cvEducation.length) {
            console.log(item);
            dispatch(addEducation(item));
          }
          console.log('Key: ' + key);
          console.log(item);
          console.log(cvEducation);
        });
        data.data['skills'].map((item, key) => {
          const new_skill_arr = { skill_no: item.skill_no, skill_name: item.skill_name, skill_domain: item.skill_domain };

          if (
            data.data['skills'].length > cvSkill.length &&
            !cvSkill.some((skill) => skill.skill_name === item.skill_name) &&
            item.skill_no !== 0
          ) {
            dispatch(addSkill(item));
          } else if (item.skill_no !== 0) {
            dispatch(updateSkill({ index: key, value: item.skill_name }));
          }
          console.log(item);
        });
        data.data['careers'].map((item, key) => {
          if (data.data['careers'].length > cvCareer.length && item.career_no !== 0) {
            dispatch(addCareer(item));
          }
          console.log(key);
          console.log(item);
        });
        data.data['certifications'].map((item, key) => {
          if (data.data['certifications'].length > cvCertification.length && item.cert_no !== 0) {
            console.log('들어옴');
            dispatch(addCert(item));
          }
          console.log(key);
          console.log(item);
          console.log(cvCertification);
        });
        data.data['languages'].map((item, key) => {
          if (data.data['languages'].length > cvLanguage.length && item.language_no !== 0) {
            dispatch(addLang(item));
          }
          console.log(key);
          console.log(item);
        });
        data.data['activities'].map((item, key) => {
          if (data.data['activities'].length > cvActivity.length && item.activity_no !== 0) {
            dispatch(addActivity(item));
          }
          console.log(key);
          console.log(item);
        });
        data.data['advantages'].map((item, key) => {
          if (data.data['advantages'].length > cvAdvantage.length && item.advantage_no !== 0) {
            dispatch(addAdvantage(item));
          }
          console.log(key);
          console.log(item);
          console.log(cvAdvantage);
        });
      }
    });
  };

  const handleUploadFiles = () => {
    Object.keys(selectedFiles).map((groupKey) => {
      const formData = new FormData();
      selectedFiles[groupKey].forEach((file) => {
        formData.append('cvfile', file);
      });
      formData.append('endPath', groupKey);
      formData.append('cv_no', proto_cv_no);

      if (formData.get('cvfile')) {
        cv.postMultiFile(formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then((response) => {
            console.log('파일 업로드 성공: ' + response.data);
          })
          .catch((error) => {
            console.log('파일 업로드 실패: ' + error);
          });
      } else {
        console.log('값 없음');
      }
    });

    console.log('Uploading files:', selectedFiles);
  };

  const CVChecked = async () => {
    // `cv.getList()` 함수의 비동기 호출 결과를 기다립니다.
    const data = await cv.getList(proto_cv_no);

    // 작성 기록이 있는지 확인합니다.
    if (data.data === '') {
      console.log('작성 기록 없음');
      return false;
    } else {
      console.log('작성 기록 있음');
      return true;
    }
  };

  //CV Data Send 기능
  const sendCVData = async (cvData) => {
    // CVChecked() 함수를 외부에서 호출합니다.
    const isUpdate = await CVChecked();

    // 기존에 작성한 이력서가 있는지 확인합니다.
    if (isUpdate === false) {
      // 새 이력서를 생성합니다.
      //const res = cv.postList(cvData);
      cv.postList(cvData).then((res) => {
        // 응답을 출력합니다.
        dispatch(updateCVNO(res.data));
        console.log(res);
        console.log('Response : ' + JSON.stringify(res));
      });
    }
    if (isUpdate === true) {
      // 기존 이력서를 업데이트합니다.
      cv.putList(cvData).then((res) => {
        // 응답을 출력합니다.
        console.log('Response : ' + JSON.stringify(res));
      });
    }

    // 첨부 파일을 처리합니다.
    handleUploadFiles();
  };

  const actions = [
    { icon: <FileCopyIcon onClick={loadCV} />, name: '불러오기' },
    { icon: <SaveIcon onClick={(e) => sendCVData(cvData)} />, name: '저장하기' },
    { icon: <PrintIcon onClick={handlePrint} />, name: '인쇄하기' },
    { icon: <ShareIcon />, name: '공유하기' }
  ];

  return (
    <SpeedDial
      ariaLabel="SpeedDial openIcon example"
      sx={{ position: 'fixed', bottom: 32, right: 32 }}
      icon={<SpeedDialIcon openIcon={<EditIcon />} color="secondary" />}
      FabProps={{
        sx: {
          bgcolor: 'secondary.main',
          '&:hover': {
            bgcolor: 'secondary.dark'
          }
        }
      }}
    >
      {actions.map((action) => (
        <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} />
      ))}
    </SpeedDial>
  );
}
