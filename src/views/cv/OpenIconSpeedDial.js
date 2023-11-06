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

export default function OpenIconSpeedDial({ selectedFiles, endPath, componentRef }) {
  const cvProfile = useSelector((state) => state.profile);
  const cvEducation = useSelector((state) => state.education);
  const cvActivity = useSelector((state) => state.activity);
  const cvAdvantage = useSelector((state) => state.advantage);
  const cvCareer = useSelector((state) => state.career);
  const cvLanguage = useSelector((state) => state.lang);
  const cvSkill = useSelector((state) => state.skill);
  const cvCertification = useSelector((state) => state.cert);
  const [isWritten, setIsWritten] = useState(true);
  const dispatch = useDispatch();

  const eduUpdateFields = (data) => {
    const new_edu_arr = {
      edu_no: data.data.edu_no,
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

  const careerUpdateFields = (data) => {
    const new_career_arr = {
      career_no: data.data.career_no,
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

  const langUpdateFields = (data) => {
    const new_lang_arr = { language_no: data.data.language_no, exam_type: '', language_name: '', language_score: '' };
    dispatch(addLang(new_lang_arr));
  };

  const activityUpdateFields = (data) => {
    const new_activity_arr = {
      activity_no: data.data.activity_no,
      activity_type: '',
      organization: '',
      start_date: '',
      end_date: '',
      activity_detail: ''
    };
    dispatch(addActivity(new_activity_arr));
  };

  const certUpdateFields = (data) => {
    const new_cert_arr = { cert_no: data.data.cert_no, cert_name: '', publisher: '', acquisition_date: '' };
    dispatch(addCert(new_cert_arr));
  };

  // CV_LIST 쪽에서 받아와야 하는 cv_no 임시 설정
  const proto_cv_no = 48;

  //CV 데이터 포집 기능
  const cvData = {
    cv: {
      cv_no: proto_cv_no,
      user_id: 'doubest',
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

  //cv_no는 list쪽에서 받아와야함 지금은 임시로 7번 사용 중

  const loadCV = () => {
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

          if (data.data['skills'].length > cvSkill.length && !cvSkill.some((skill) => skill.skill_name === item.skill_name)) {
            dispatch(addSkill(item));
          } else {
            dispatch(updateSkill({ index: key, value: item.skill_name }));
          }
        });
        data.data['careers'].map((item, key) => {
          if (data.data['careers'].length > cvCareer.length) {
            dispatch(addCareer(item));
          }
          console.log(key);
          console.log(item);
        });
        data.data['certifications'].map((item, key) => {
          if (data.data['certifications'].length > cvCertification.length) {
            console.log('들어옴');
            dispatch(addCert(item));
          }
          console.log(key);
          console.log(item);
          console.log(cvCertification);
        });
        data.data['languages'].map((item, key) => {
          if (data.data['languages'].length > cvLanguage.length) {
            dispatch(addLang(item));
          }
          console.log(key);
          console.log(item);
        });
        data.data['activities'].map((item, key) => {
          if (data.data['activities'].length > cvActivity.length) {
            dispatch(addActivity(item));
          }
          console.log(key);
          console.log(item);
        });
        data.data['advantages'].map((item, key) => {
          if (data.data['advantages'].length > cvAdvantage.length) {
            dispatch(addAdvantage(item));
          }
          console.log(key);
          console.log(item);
          console.log(cvAdvantage);
        });
      }
    });
  };

  const updateCV = () => {
    cv.getList(proto_cv_no).then((data) => {
      console.log('LIST GET : ' + JSON.stringify(data));
      data.map((data) => {});
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

  //CV Data Send 기능
  const sendCVData = async (cvData) => {
    loadCV();
    if (isWritten) {
      console.log('기존에 작성중인 이력서가 존재합니다.');
      try {
        updateCV;
        const put_res = cv.putList(cvData);
        handleUploadFiles();
        console.log('Response : ' + JSON.stringify(res));
      } catch (error) {
        console.log('Error : ' + error);
      }
    } else {
      console.log('처음 작성하는 이력서 입니다.');
      try {
        const res = await cv.postList(cvData);
        handleUploadFiles();
        console.log('Response : ' + JSON.stringify(res));
      } catch (error) {
        console.log('Error : ' + error);
      }
    }
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
