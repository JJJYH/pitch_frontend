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
import { setFiles } from 'store/cvFileSlice';
import JSZip from 'jszip';

export default function OpenIconSpeedDial({ cvData, selectedFiles, endPath, componentRef, setSelectedFiles }) {
  const [isWritten, setIsWritten] = useState();
  const dispatch = useDispatch();
  //인쇄 하기 기능
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  useEffect(() => {
    // DB에서 가져온 파일 정보로 파일 상태 초기화
    console.log(selectedFiles);
  }, [selectedFiles]);

  // const [selectedFiles, setSelectedFiles] = useState({
  //   Portfolio: [], // 초기에 빈 배열로 설정
  //   Career: [], // 초기에 빈 배열로 설정
  //   Statement: [], // 초기에 빈 배열로 설정
  //   etcDocs: [] // 초기에 빈 배열로 설정
  // });

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

    // downloadAndExtractZip();

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
        setIsWritten(false);
      } else {
        // console.log('LIST GET : ' + JSON.stringify(data));
        console.log(data);
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
          console.log(data.data['educations'].length);
          console.log(cvData);
          if (key !== 0 && data.data['educations'].length > cvData.cv.educations.length) {
            console.log(item);
            dispatch(addEducation(item));
          }
          console.log('Key: ' + key);
          console.log(item);
          console.log(cvData.cv.education);
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
          if (data.data['careers'].length > cvData.cv.careers.length && item.career_no !== 0) {
            dispatch(addCareer(item));
          }
          console.log(key);
          console.log(item);
        });
        data.data['certifications'].map((item, key) => {
          if (data.data['certifications'].length > cvData.cv.certifications.length && item.cert_no !== 0) {
            console.log('들어옴');
            dispatch(addCert(item));
          }
          console.log(key);
          console.log(item);
          console.log(cvData.cv.certifications);
        });
        data.data['languages'].map((item, key) => {
          if (data.data['languages'].length > cvData.cv.languages.length && item.language_no !== 0) {
            dispatch(addLang(item));
          }
          console.log(key);
          console.log(item);
        });
        data.data['activities'].map((item, key) => {
          if (data.data['activities'].length > cvData.cv.activities.length && item.activity_no !== 0) {
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
