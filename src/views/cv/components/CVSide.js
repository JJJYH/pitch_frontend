import React from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import { useEffect } from 'react';
import { useState } from 'react';
import CircleIcon from '@mui/icons-material/Circle';
import { display } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { cv } from 'api';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import SendIcon from '@mui/icons-material/Send';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import { updateProfile } from 'store/profileSlice';
import { addEducation, updateEducation } from 'store/educationSlice';
import { addSkill, updateSkill } from 'store/skillSlice';
import { addCareer } from 'store/careerSlice';
import { addCert } from 'store/certSlice';
import { addLang } from 'store/langSlice';
import { addActivity } from 'store/activitySlice';
import { addAdvantage, updateAdvantage } from 'store/advantageSlice';
import { updateCVNO } from 'store/cvSlice';
import JSZip from 'jszip';

const CVSide = ({
  reverseFuction,
  currentTab,
  scrollToTab,
  tabRef,
  cvData,
  selectedFiles,
  endPath,
  componentRef,
  setSelectedFiles,
  userInfo,
  isSelectCV,
  dialog_open
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const locationState = [];
  const [location_point, set_location_point] = useState('');
  for (const key in tabRef.current) {
    locationState.push(tabRef.current[key].getBoundingClientRect().top + window.scrollY - 80);
  }

  // const [isWritten, setIsWritten] = useState();
  const dispatch = useDispatch();
  //인쇄 하기 기능
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  useEffect(() => {
    // DB에서 가져온 파일 정보로 파일 상태 초기화
    console.log(selectedFiles);
  }, [selectedFiles]);

  const downloadAndExtractZip = async () => {
    try {
      // 서버에서 ZIP 파일 다운로드
      const zipResponse = await cv.getFiles(cvData.cv.cv_no);

      // ZIP 파일 데이터를 JSZip으로 해제
      const zip = new JSZip();
      const zipData = await zip.loadAsync(zipResponse.data);

      // 각 파일을 처리
      zipData.forEach(async (relativePath, zipEntry) => {
        try {
          // 각 파일의 데이터를 Uint8Array로 추출
          const fileData = await zipEntry.async('uint8array');

          // Uint8Array를 Blob으로 변환
          const blob = new Blob([fileData], { type: 'application/octet-stream' });

          // split() 함수를 사용하여 문자열을 나눕니다.
          const splittedArray = relativePath.split('_');
          console.log(splittedArray);
          //뒷부분을 변수에 저장
          const backPart = splittedArray[1];

          // Blob을 File 객체로 변환
          const fileName = backPart;

          const file = new File([blob], fileName, { type: 'application/octet-stream' });

          // 만든 File 객체를 사용하여 다른 작업을 수행
          console.log('File Object:', file);

          // fileData를 사용하여 각 파일에 대한 작업 수행
          console.log(`File: ${relativePath}, Size: ${fileData.length} bytes`);

          // 파일 데이터를 서버에 전송하거나 다른 작업을 수행할 수 있습니다.
        } catch (error) {
          console.error('Error processing file in ZIP:', error);
        }
      });
    } catch (error) {
      console.error('Error downloading or extracting ZIP file:', error);
    }
  };

  const loadCV = async () => {
    //이력서 불러오기 요청 시 이력서가 없을 경우 Written false

    try {
      const { data } = await cv.getFileInfos(cvData.cv.cv_no);
      console.log(data);
      data.forEach((res) => {
        const { type } = res;
        setSelectedFiles((prevSelectedFiles) => ({
          ...prevSelectedFiles,
          [type]: [...(prevSelectedFiles[type] || []), res]
        }));
      });
    } catch (error) {
      console.error('Error loading CV files:', error);
    }

    cv.getList(cvData.cv.cv_no).then((data) => {
      if (data.data === '') {
        console.log('IS Empty');
      } else {
        // console.log('LIST GET : ' + JSON.stringify(data));
        console.log(data);

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
          console.log(data.data['educations'].length);
          console.log(cvData);
          if (key !== 0 && !cvData.cv.educations.some((edu) => edu.edu_type === item.edu_type)) {
            console.log(item);
            dispatch(addEducation(item));
          }
          console.log('Key: ' + key);
          console.log(item);
          console.log(cvData.cv.educations);
        });
        data.data['skills'].map((item, key) => {
          const new_skill_arr = { skill_no: item.skill_no, skill_name: item.skill_name, skill_domain: item.skill_domain };
          if (
            data.data['skills'].length > cvData.cv.skills.length &&
            !cvData.cv.skills.some((skill) => skill.skill_name === item.skill_name) &&
            item.skill_no !== 0
          ) {
            dispatch(addSkill(item));
          } else if (item.skill_no !== 0) {
            dispatch(updateSkill({ index: key, value: item.skill_name }));
          }
          console.log(item);
        });
        data.data['careers'].map((item, key) => {
          if (!cvData.cv.careers.some((career) => career.company_name === item.company_name) && item.career_no !== 0) {
            dispatch(addCareer(item));
          }
          console.log(key);
          console.log(item);
        });
        data.data['certifications'].map((item, key) => {
          if (!cvData.cv.certifications.some((cert) => cert.cert_name === item.cert_name) && item.cert_no !== 0) {
            console.log(data.data['certifications'].length);
            console.log(cvData.cv.certifications.length);
            console.log('들어옴');
            dispatch(addCert(item));
          }
          console.log(key);
          console.log(item);
          console.log(cvData.cv.certifications);
        });
        data.data['languages'].map((item, key) => {
          if (!cvData.cv.languages.some((lang) => lang.exam_type === item.exam_type) && item.language_no !== 0) {
            dispatch(addLang(item));
          }
          console.log(key);
          console.log(item);
        });
        data.data['activities'].map((item, key) => {
          if (!cvData.cv.activities.some((activity) => activity.activity_type === item.activity_type) && item.activity_no !== 0) {
            dispatch(addActivity(item));
          }
          console.log(key);
          console.log(item);
        });
        data.data['advantages'].map((item, key) => {
          if (data.data['advantages'].length > cvData.cv.advantages.length && item.advantage_no !== 0) {
            dispatch(addAdvantage(item));
          }
          console.log(key);
          console.log(item);
          console.log(cvData.cv.advantages);
        });
      }
    });
  };

  const handleUploadFiles = () => {
    Object.keys(selectedFiles).map((groupKey) => {
      const formData = new FormData();
      selectedFiles[groupKey].forEach((file) => {
        if (file instanceof File) {
          //파일인 경우에만 파일 첨부
          formData.append('cvfile', file);
        }
      });
      formData.append('endPath', groupKey);
      formData.append('cv_no', cvData.cv.cv_no);

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
    const data = await cv.getList(cvData.cv.cv_no);

    // 작성 기록이 있는지 확인합니다.
    if (data.data === '') {
      console.log('작성 기록 없음');
      return false;
    } else {
      console.log('작성 기록 있음');
      return true;
    }
  };

  const processFileOrObject = (fileOrObject, fileDataArray, groupKey) => {
    if (fileOrObject instanceof File) {
      var lastDot = fileOrObject.name.lastIndexOf('.');
      var fileExt = fileOrObject.name.substring(lastDot, fileOrObject.name.length).toLowerCase();

      // 만약 fileOrObject가 File 객체이면 파일 정보를 추출하여 추가
      const fileInfo = {
        cv_file_no: 0, // 여기에 파일 번호를 생성하는 로직을 추가해주세요.
        cv_no: cvData.cv.cv_no, // 여기에 CV 번호를 가져오는 로직을 추가해주세요.
        file_name: fileOrObject.name,
        file_size: fileOrObject.size,
        file_type: fileExt, // 여기에 파일 타입을 추출하는 로직을 추가해주세요.
        path: fileOrObject.path, // 여기에 파일 경로를 생성하는 로직을 추가해주세요.
        type: groupKey, // 여기에 파일 타입을 경로에서 추출하는 로직을 추가해주세요.
        upload_date: new Date().getTime(), // 여기에 파일 업로드 일자를 생성하는 로직을 추가해주세요.
        user_id: cvData.cv.user_id // 여기에 사용자 아이디를 가져오는 로직을 추가해주세요.
      };

      // 파일 정보를 담은 객체를 배열에 추가
      fileDataArray.push(fileInfo);
    } else if (typeof fileOrObject === 'object') {
      // 만약 fileOrObject가 객체이면 그대로 배열에 추가
      fileDataArray.push(fileOrObject);
    }
  };

  //CV Data Send 기능
  const sendCVData = async (cvData) => {
    // CVChecked() 함수를 외부에서 호출합니다.
    const isUpdate = await CVChecked();
    cvData = {
      cv: {
        ...cvData.cv,
        cv_status: 'APPLY'
      }
    };
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
      handleUploadFiles();
    }
    if (isUpdate === true) {
      const fileDataArray = [];
      Object.keys(selectedFiles).map((groupKey) => {
        selectedFiles[groupKey].forEach((file) => {
          processFileOrObject(file, fileDataArray, groupKey);
        });
      });

      cvData = {
        cv: {
          ...cvData.cv,
          cvFiles: fileDataArray
        }
      };
      // 기존 이력서를 업데이트합니다.
      cv.putList(cvData).then((res) => {
        // 응답을 출력합니다.
        console.log('Response : ' + JSON.stringify(res));
      });
      // 첨부 파일을 처리합니다.
      handleUploadFiles();
    }
  };

  const sendApply = () => {
    if (cvData.cv_no === 0) {
      cv.postList(cvData).then((res) => {
        // 응답을 출력합니다.
        dispatch(updateCVNO(res.data));
        console.log(res);
        console.log('Response : ' + JSON.stringify(res));
      });
    }

    if (cvData.cv_no !== 0) {
      cv.postApply(cvData).then((res) => {
        console.log(res.data);
      });
    }
  };

  //length와 비교해서 누락 값 찾기
  // const countEmptyValues = (arrayOfObjects) => {
  //   return arrayOfObjects.reduce((count, obj) => {
  //     // 객체의 속성을 반복하고 속성 값이 "" 인 경우 카운트를 증가합니다.
  //     for (const key in obj) {
  //       if (obj[key] === '') {
  //         count++;
  //       }
  //     }
  //     console.log(count);
  //     return count;
  //   }, 0);
  // };
  // console.log(cvEducation);
  // countEmptyValues(cvProfile);
  // countEmptyValues(cvProfile);
  // countEmptyValues(cvProfile);

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    setScrollPosition(window.scrollY);

    if (scrollPosition > locationState[0] && scrollPosition < locationState[1]) {
      set_location_point('education');
    }
    if (scrollPosition > locationState[1] && scrollPosition < locationState[2]) {
      set_location_point('skills');
    }
    if (scrollPosition > locationState[2] && scrollPosition < locationState[3]) {
      set_location_point('career');
    }
    if (scrollPosition > locationState[3] && scrollPosition < locationState[4]) {
      set_location_point('cert');
    }
    if (scrollPosition > locationState[4] && scrollPosition < locationState[5]) {
      set_location_point('lang');
    }
    if (scrollPosition > locationState[5] && scrollPosition < locationState[6]) {
      set_location_point('activity');
    }
    if (scrollPosition > locationState[6] && scrollPosition < locationState[7]) {
      set_location_point('docs');
    }
    if (scrollPosition > locationState[7]) {
      set_location_point('advantage');
    }
  };

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollPosition]);

  //누락 값 Search
  let missingEduValuesCount = 0;
  let missingCareerValueCount = 0;
  let missingAdvantageValueCount = 0;
  let missingCertValueCount = 0;
  let missingLangValueCount = 0;
  let missingActivityValueCount = 0;

  const checkEmptyValue = (cvData) => {
    // console.log(JSON.stringify(cvData.cv));

    if (!cvData.cv || !cvData.cv.educations || !Array.isArray(cvData.cv.educations)) {
      console.log('데이터가 비어있습니다.');
      return;
    }
    // educations 배열 순회

    cvData.cv.educations.forEach((item) => {
      // 각 속성이 존재하고 값이 비어있는지 확인
      const requiredUnivFields = ['edu_type', 'enter_date', 'graduate_date', 'graduate_type', 'major', 'score', 'total_score'];
      const requiredHighFields = ['edu_type', 'enter_date', 'graduate_date', 'graduate_type', 'major'];

      if (item.edu_type.includes('고등학교') || !item.edu_type) {
        requiredHighFields.forEach((field) => {
          if (!item[field] || item[field].length === 0) {
            missingEduValuesCount++;
          }
        });
      } else if (item.edu_type.includes('대학교')) {
        requiredUnivFields.forEach((field) => {
          if (!item[field] || item[field].length === 0) {
            missingEduValuesCount++;
          }
        });
      }
    });

    cvData.cv.careers.forEach((item) => {
      const requiredCareerFields = ['company_name', 'cv_dept_name', 'join_date', 'position', 'job', 'salary', 'quit_date'];
      requiredCareerFields.forEach((field) => {
        if (!item[field] || item[field].length === 0) {
          missingCareerValueCount++;
        }
      });
    });

    cvData.cv.careers.forEach((item) => {
      const requiredCareerFields = ['company_name', 'cv_dept_name', 'join_date', 'position', 'job', 'salary', 'quit_date'];
      requiredCareerFields.forEach((field) => {
        if (!item[field] || item[field].length === 0) {
          missingCareerValueCount++;
        }
      });
    });

    cvData.cv.advantages.forEach((item) => {
      const requireAdvantageDetailFields = ['advantage_type', 'advantage_detail'];
      if (item.advantage_type.includes('병역') || item.advantage_type.includes('장애')) {
        requireAdvantageDetailFields.forEach((field) => {
          if (!item[field] || item[field].length === 0) {
            missingAdvantageValueCount++;
          }
        });
      }
    });

    cvData.cv.certifications.forEach((item) => {
      const requireCertFields = ['cert_name', 'publisher', 'acquisition_date'];
      requireCertFields.forEach((field) => {
        if (!item[field] || item[field].length === 0) {
          missingCertValueCount++;
        }
      });
    });

    cvData.cv.languages.forEach((item) => {
      const requireLangFields = ['exam_type', 'language_name', 'language_score'];
      requireLangFields.forEach((field) => {
        if (!item[field] || item[field].length === 0) {
          missingLangValueCount++;
        }
      });
    });

    cvData.cv.activities.forEach((item) => {
      const requrieActivityFields = ['activity_type', 'organiztion', 'start_date', 'end_date', 'activity_detail'];
      requrieActivityFields.forEach((field) => {
        if (!item[field] || item[field].length === 0) {
          missingActivityValueCount++;
        }
      });
    });

    // console.log(`Advantage 누락된 값의 개수: ${missingAdvantageValueCount}`);
    // console.log(`Activity 누락된 값의 개수: ${missingActivityValueCount}`);
    // console.log(`Language 누락된 값의 개수: ${missingLangValueCount}`);
    // console.log(`Certification 누락된 값의 개수: ${missingCertValueCount}`);
    // console.log(`Edu 누락된 값의 개수: ${missingEduValuesCount}`);
    // console.log(`Career 누락된 값의 개수: ${missingCareerValueCount}`);
  };

  // 색상 계산 함수
  const calculateColor = (MissingCount) => {
    const initialColor = '#D18AC7'; // 초기 색상
    const finalColor = '#4682B4'; // 최종 색상
    const maxCount = 100; // 최대 카운트 (증가할 때마다)

    // 계산된 비율을 기반으로 색상 계산
    const ratio = MissingCount / maxCount;
    const red = Math.round(parseInt(initialColor.slice(1, 3), 16) * (1 - ratio) + parseInt(finalColor.slice(1, 3), 16) * ratio);
    const green = Math.round(parseInt(initialColor.slice(3, 5), 16) * (1 - ratio) + parseInt(finalColor.slice(3, 5), 16) * ratio);
    const blue = Math.round(parseInt(initialColor.slice(5, 7), 16) * (1 - ratio) + parseInt(finalColor.slice(5, 7), 16) * ratio);

    // 계산된 RGB 값을 16진수로 변환하여 반환
    return `#${(red * 0x10000 + green * 0x100 + blue).toString(16).padStart(6, '0')}`;
  };
  checkEmptyValue(cvData);

  return (
    <Box sx={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', position: 'sticky', top: 90, width: '150px' }}>
      <MainCard sx={{ width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <CircleIcon fontSize="16px" style={{ color: missingEduValuesCount === 0 ? '#4682B4' : '#D18AC7', marginRight: '8px' }} />
          <Typography
            variant="h4"
            color={location_point === 'education' ? 'primary' : 'default'}
            sx={{ mb: 2.5, '&:hover': { color: 'secondary.main' } }}
            textAlign={'center'}
            alignContent={'center'}
            onClick={() => scrollToTab('education')} // 학력 탭으로 스크롤
          >
            학력
          </Typography>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <Typography
            variant="h4"
            color={location_point === 'skills' ? 'primary' : 'default'}
            sx={{ mb: 2.5, '&:hover': { color: 'secondary.main' } }}
            textAlign={'center'}
            alignContent={'center'}
            onClick={() => scrollToTab('skills')} // 스킬 탭으로 스크롤
          >
            보유 스킬
          </Typography>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <CircleIcon fontSize="16px" style={{ color: missingCareerValueCount === 0 ? '#4682B4' : '#D18AC7', marginRight: '8px' }} />
          <Typography
            variant="h4"
            color={location_point === 'career' ? 'primary' : 'default'}
            sx={{ mb: 2.5, '&:hover': { color: 'secondary.main' } }}
            textAlign={'center'}
            alignContent={'center'}
            onClick={() => scrollToTab('career')} // 경력 탭으로 스크롤
          >
            경력 사항
          </Typography>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <CircleIcon fontSize="16px" style={{ color: missingCertValueCount === 0 ? '#4682B4' : '#D18AC7', marginRight: '8px' }} />
          <Typography
            variant="h4"
            color={location_point === 'cert' ? 'primary' : 'default'}
            sx={{ mb: 2.5, '&:hover': { color: 'secondary.main' } }}
            textAlign={'center'}
            alignContent={'center'}
            onClick={() => scrollToTab('cert')}
          >
            자격증
          </Typography>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <CircleIcon fontSize="16px" style={{ color: missingLangValueCount === 0 ? '#4682B4' : '#D18AC7', marginRight: '8px' }} />
          <Typography
            variant="h4"
            color={location_point === 'lang' ? 'primary' : 'default'}
            sx={{ mb: 2.5, '&:hover': { color: 'secondary.main' } }}
            textAlign={'center'}
            alignContent={'center'}
            onClick={() => scrollToTab('lang')}
          >
            어학 성적
          </Typography>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          {/* <CircleIcon fontSize="16px" style={{ color: '#D18AC7', marginRight: '8px' }} /> */}
          <Typography
            variant="h4"
            color={location_point === 'activity' ? 'primary' : 'default'}
            sx={{ mb: 2.5, '&:hover': { color: 'secondary.main' } }}
            textAlign={'center'}
            alignContent={'center'}
            onClick={() => scrollToTab('docs')}
          >
            기타 문서
          </Typography>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <CircleIcon fontSize="16px" style={{ color: missingActivityValueCount === 0 ? '#4682B4' : '#D18AC7', marginRight: '8px' }} />
          <Typography
            variant="h4"
            color={location_point === 'docs' ? 'primary' : 'default'}
            sx={{ mb: 2.5, '&:hover': { color: 'secondary.main' } }}
            textAlign={'center'}
            alignContent={'center'}
            onClick={() => scrollToTab('activity')}
          >
            대외 활동
          </Typography>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <CircleIcon fontSize="16px" style={{ color: missingAdvantageValueCount === 0 ? '#4682B4' : '#D18AC7', marginRight: '8px' }} />
          <Typography
            variant="h4"
            color={location_point === 'advantage' ? 'primary' : 'default'}
            sx={{ mb: 2.5, '&:hover': { color: 'secondary.main' } }}
            textAlign={'center'}
            alignContent={'center'}
            onClick={() => scrollToTab('advantage')}
          >
            우대 사항
          </Typography>
        </div>
      </MainCard>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <Button
          onClick={() => {
            sendApply();
          }}
          sx={{
            width: '100%',
            fontSize: '16px',
            backgroundColor: '#4682b4',
            color: 'white',
            justifyContent: 'space-between',
            '&:hover': {
              color: '#4682b4',
              backgroundColor: 'white',
              border: '1px solid #4682b4'
            }
          }}
        >
          <SendIcon />
          지원하기
        </Button>
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <Button
          onClick={handlePrint}
          sx={{
            width: '100%',
            fontSize: '16px',
            backgroundColor: '#4682b4',
            color: 'white',
            justifyContent: 'space-between',
            '&:hover': {
              color: '#4682b4',
              backgroundColor: 'white',
              border: '1px solid #4682b4'
            }
          }}
        >
          <PrintIcon />
          인쇄하기
        </Button>
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <Button
          onClick={(e) => sendCVData(cvData)}
          sx={{
            width: '100%',
            fontSize: '16px',
            backgroundColor: '#4682b4',
            color: 'white',
            justifyContent: 'space-between',
            '&:hover': {
              color: '#4682b4',
              backgroundColor: 'white',
              border: '1px solid #4682b4'
            }
          }}
        >
          <SaveIcon />
          임시저장
        </Button>
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <Button
          onClick={(e) => loadCV()}
          sx={{
            width: '100%',
            fontSize: '16px',
            backgroundColor: '#4682b4',
            color: 'white',
            justifyContent: 'space-between',
            '&:hover': {
              color: '#4682b4',
              backgroundColor: 'white',
              border: '1px solid #4682b4'
            }
          }}
        >
          <FileCopyIcon />
          불러오기
        </Button>
      </div>
    </Box>
  );
};

export default CVSide;
