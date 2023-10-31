import * as React from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from 'react-redux';
import { cv } from 'api';

export default function OpenIconSpeedDial({ selectedFiles, endPath }) {
  const cvProfile = useSelector((state) => state.profile);
  const cvEducation = useSelector((state) => state.education);
  const cvActivity = useSelector((state) => state.activity);
  const cvAdvantage = useSelector((state) => state.advantage);
  const cvCareer = useSelector((state) => state.career);
  const cvLanguage = useSelector((state) => state.lang);
  const cvSkill = useSelector((state) => state.skill);
  const cvCertification = useSelector((state) => state.cert);
  const cvData = {
    cv: {
      cv_no: 6,
      user_id: 'user',
      ps_statement: null,
      gender: cvProfile[0].gender,
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

  const handleUploadFiles = () => {
    Object.keys(selectedFiles).map((groupKey) => {
      const formData = new FormData();
      selectedFiles[groupKey].forEach((file) => {
        formData.append('cvfile', file);
      });
      formData.append('endPath', groupKey);

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
    });

    // selectedFiles.forEach((file) => {
    //   formData.append('cvfile', file);
    // });

    // formData.append('endPath', endPath);

    // cv.postMultiFile(formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   }
    // })
    //   .then((response) => {
    //     console.log('파일 업로드 성공: ' + response.data);
    //   })
    //   .catch((error) => {
    //     console.log('파일 업로드 실패: ' + error);
    //   });

    console.log('Uploading files:', selectedFiles);
  };

  const sendCVData = async (cvData) => {
    try {
      handleUploadFiles();

      const res = await cv.postList(cvData);
      console.log('Response : ' + JSON.stringify(res));
    } catch (error) {
      console.log('Error : ' + error);
    }
  };

  const actions = [
    { icon: <FileCopyIcon />, name: 'Copy' },
    { icon: <SaveIcon onClick={(e) => sendCVData(cvData)} />, name: 'Save' },
    { icon: <PrintIcon />, name: 'Print' },
    { icon: <ShareIcon />, name: 'Share' }
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
