import {
  Box,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Modal,
  Typography
} from '@mui/material';
import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import OpenIconSpeedDial from './OpenIconSpeedDial';
import Profile from './components/Profile';
import Education from './components/Education';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import Career from './components/Career';
import Certification from './components/Certification';
import Language from './components/Language';
import Advantage from './components/Advantage';
import CVSide from './components/CVSide';
import { useRef } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Activity from './components/Activity';
import { addEducation, updateEducation } from 'store/educationSlice';
import { addCareer, updateCareer } from 'store/careerSlice';
import { addActivity, updateActivity } from 'store/activitySlice';
import { addLang, updateLang } from 'store/langSlice';
import { addCert, updateCert } from 'store/certSlice';
import { get, cv } from 'api';
import AddIcon from '@mui/icons-material/Add';
import ControllableStates from './components/Skills';
import FileUpload from './FileUpload';
import Statement from './Statement';
import Ocr from './Ocr';
import { updateProfile } from 'store/profileSlice';
import { useEffect } from 'react';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { updateCVNO } from 'store/cvSlice';
import { useLocation, useParams } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import { addSkill, updateSkill } from 'store/skillSlice';
import { addAdvantage, updateAdvantage } from 'store/advantageSlice';
import LoaderStyle from './Loader.module.scss';
import { useSnackbar } from 'notistack';

const CV = ({ isMainCV, sendData }) => {
  const profileInfo = useSelector((state) => state.profile);
  const params = useParams().job_posting_no;
  //공고 상세에서 넘어온 job_posting_no 세팅
  let job_posting_no = params;
  const [ocrText, setOcrText] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  /**State Selector 모음 */
  const cv_no = useSelector((state) => state.cv_no);
  const cvProfile = useSelector((state) => state.profile);
  const cvEducation = useSelector((state) => state.education);
  const cvActivity = useSelector((state) => state.activity);
  const cvAdvantage = useSelector((state) => state.advantage);
  const cvCareer = useSelector((state) => state.career);
  const cvLanguage = useSelector((state) => state.lang);
  const cvSkill = useSelector((state) => state.skill);
  const cvCertification = useSelector((state) => state.cert);
  const dispatch = useDispatch();
  const [isSelectCV, setIsSelectCV] = useState();
  const userInfo = useSelector((state) => state.userInfo);

  window.addEventListener('beforeunload', (event) => {
    // 페이지가 새로 고쳐질 때 실행할 코드
    // 예를 들어, 쿠키를 설정하거나 로컬 스토리지에 값을 저장하는 등의 작업을 수행할 수 있습니다.
  });

  //CV 데이터 포집 기능
  let cvData = {
    cv: {
      cv_no: cv_no.cv_no,
      job_posting_no: job_posting_no,
      user_id: cvProfile[0].user_id,
      user_nm: cvProfile[0].user_nm,
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

  const [cvNoChanged, setCvNoChanged] = useState(false);
  /**APPLY PAGE 대표이력서 불러오기 시 APPLY CV_NO로 SETTING*/
  const setting_cv_no = async () => {
    const res = cv.getCVNO(job_posting_no);
    return res;
  };

  const loadMainCV = async (cv_no) => {
    cv.getList(cv_no).then((data) => {
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
            {
              isMainCV !== 'MainCV'
                ? ''
                : dispatch(
                    updateEducation({
                      index: 0,
                      name: 'edu_no',
                      value: item.edu_no
                    })
                  );
            }

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
            //APPLY CV에서 부른 경우 edu_no 초기화
            {
              isMainCV !== 'MainCV' ? (item.edu_no = 0) : '';
            }
            dispatch(addEducation(item));
          }
          console.log('Key: ' + key);
          console.log(item);
          console.log(cvData.cv.educations);
        });

        data.data['skills'].map((item, key) => {
          const new_skill_arr = { skill_no: item.skill_no, skill_name: item.skill_name, skill_domain: item.skill_domain };
          {
            isMainCV !== 'MainCV'
              ? // 'MainCV'가 아닐 때 실행되는 블록
                (() => {
                  if (
                    data.data['skills'].length > cvData.cv.skills.length &&
                    !cvData.cv.skills.some((skill) => skill.skill_name === item.skill_name) &&
                    item.skill_no !== 0
                  ) {
                    // APPLY CV에서 부른 경우 skill_no 초기화
                    item.skill_no = 0;
                    dispatch(addSkill(item));
                  } else if (item.skill_no !== 0) {
                    dispatch(updateSkill({ index: key, value: item.skill_name }));
                  }
                })()
              : // 'MainCV'일 때 실행되는 블록
                (() => {
                  if (
                    data.data['skills'].length > cvData.cv.skills.length &&
                    !cvData.cv.skills.some((skill) => skill.skill_name === item.skill_name) &&
                    item.skill_no !== 0
                  ) {
                    dispatch(addSkill(item));
                  } else if (item.skill_no !== 0) {
                    dispatch(updateSkill({ index: key, value: item.skill_name }));
                  }
                })();
          }

          console.log(item);
        });

        data.data['careers'].map((item, key) => {
          if (data.data['careers'].length > cvData.cv.careers.length && item.career_no !== 0) {
            //APPLY CV에서 부른 경우 career_no 초기화
            if (isMainCV !== 'MainCV') {
              item.career_no = 0;
            }

            dispatch(addCareer(item));
          }
          console.log(key);
          console.log(item);
        });
        data.data['certifications'].map((item, key) => {
          if (data.data['certifications'].length > cvData.cv.certifications.length && item.cert_no !== 0) {
            console.log('들어옴');
            //APPLY CV에서 부른 경우 cert_no 초기화
            if (isMainCV !== 'MainCV') {
              item.cert_no = 0;
            }
            dispatch(addCert(item));
          }
          console.log(key);
          console.log(item);
          console.log(cvData.cv.certifications);
        });
        data.data['languages'].map((item, key) => {
          if (data.data['languages'].length > cvData.cv.languages.length && item.language_no !== 0) {
            console.log(item);

            //APPLY CV에서 부른 경우 language_no 초기화
            if (isMainCV !== 'MainCV') {
              item.language_no = 0;
            }
            dispatch(addLang(item));
          }
          console.log(key);
          console.log(item);
        });
        data.data['activities'].map((item, key) => {
          if (data.data['activities'].length > cvData.cv.activities.length && item.activity_no !== 0) {
            //APPLY CV에서 부른 경우 activity_no 초기화
            if (isMainCV !== 'MainCV') {
              item.activity_no = 0;
            }
            dispatch(addActivity(item));
          }
          console.log(key);
          console.log(item);
        });
        data.data['advantages'].map((item, key) => {
          if (data.data['advantages'].length > cvData.cv.advantages.length && item.advantage_no !== 0) {
            //APPLY CV에서 부른 경우 advantage_no 초기화
            if (isMainCV !== 'MainCV') {
              item.advantage_no = 0;
            }
            dispatch(addAdvantage(item));
          }
          console.log(key);
          console.log(item);
          console.log(cvData.cv.advantages);
        });
        if (isMainCV !== 'MainCV') {
          setting_cv_no().then((re_cv_no) => {
            console.log(re_cv_no.data);
            dispatch(updateCVNO(re_cv_no.data));
          });
        }
      }
    });
  };
  //대표 이력서 불러오기
  const MainToApplyCV = async () => {
    await cv.getMainCVNO().then((res) => {
      return loadMainCV(res.data);
    });
  };

  /**메인 CV 전용 Post, Put */
  const MainCVChecked = async () => {
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

  const sendMainCVData = async (cvMainData) => {
    // CVChecked() 함수를 외부에서 호출합니다.
    const isUpdate = await MainCVChecked();
    cvData = {
      cv: {
        ...cvData.cv,
        cv_status: 'MainCV'
      }
    };
    if (isUpdate === false) {
      console.log('POST 진행');
      console.log(JSON.stringify(cvData));
      cv.postList(cvData).then((res) => {
        console.log(JSON.stringify(res.data));
        dispatch(updateCVNO(res.data));
      });
    }
    if (isUpdate === true) {
      console.log('PUT 진행');
      cv.putList(cvData).then((res) => {
        console.log(JSON.stringify(res.data));
      });
    }
  };

  const [selectedFiles, setSelectedFiles] = useState({
    Portfolio: [], // 초기에 빈 배열로 설정
    Career: [], // 초기에 빈 배열로 설정
    Statement: [], // 초기에 빈 배열로 설정
    etcDocs: [] // 초기에 빈 배열로 설정
  });
  const noReset = (data) => {
    cv.getList(data).then((res) => {
      console.log(res);
      res.data['educations'].map((edu) => {
        const { edu_no, ...edu_no_reset } = edu;
        dispatch(updateEducation(edu_no_reset));
      });
      res.data['careers'].map((career) => {
        const { career_no, ...career_no_reset } = career;
        dispatch(updateCareer(career_no_reset));
      });
      res.data['certifications'].map((cert) => {
        const { cert_no, ...cert_no_reset } = cert;
        dispatch(updateCert(cert_no_reset));
      });
      res.data['skills'].map((skill) => {
        const { skill_no, ...skill_no_reset } = skill;
        dispatch(updateSkill(skill_no_reset));
      });
      res.data['languages'].map((lang) => {
        const { language_no, ...lang_no_reset } = lang;
        dispatch(updateLang(lang_no_reset));
      });
      res.data['activities'].map((activity) => {
        const { activity_no, ...activity_no_reset } = activity;
        dispatch(updateActivity(activity_no_reset));
      });
      res.data['advantages'].map((advantage) => {
        const { advantage_no, ...advantage_no_reset } = advantage;
        dispatch(updateAdvantage(advantage_no_reset));
      });
    });
  };

  useEffect(() => {}, [selectedFiles]);
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

  const handleClickOpen = () => {
    set_dialogOpen(true);
  };

  const handleClose = (e) => {
    set_dialogOpen(false);
    if (e.target.name === 'loadCVDial') {
      console.log('불러오기');
      setIsSelectCV(true);
      enqueueSnackbar('기존이력서 불러오기 성공', { variant: 'info' });
    }
  };

  const loadCV = async (res) => {
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
      }
    });
  };

  const handleUpdate = async (data) => {
    console.log(data);
    dispatch(updateProfile({ index: 0, name: 'user_id', value: data.user_id }));
    dispatch(updateProfile({ index: 0, name: 'address', value: data.address }));
    dispatch(updateProfile({ index: 0, name: 'gender', value: data.gender }));

    data['educations'].map((item, key) => {
      if (key == 0) {
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
      console.log(data['educations'].length);
      console.log(cvData);
      console.log(item);
      if (key !== 0 && !cvData.cv.educations.some((edu) => edu.edu_type === item.edu_type)) {
        console.log(item);
        dispatch(addEducation(item));
      } else {
        console.log(item);
        dispatch(
          updateEducation({
            index: key,
            name: 'edu_no',
            value: item.edu_no
          })
        );
        dispatch(
          updateEducation({
            index: key,
            name: 'edu_type',
            value: item.edu_type
          })
        );
        dispatch(
          updateEducation({
            index: key,
            name: 'enter_date',
            value: item.enter_date
          })
        );
        dispatch(
          updateEducation({
            index: key,
            name: 'graduate_date',
            value: item.graduate_date
          })
        );
        dispatch(
          updateEducation({
            index: key,
            name: 'major',
            value: item.major
          })
        );
        dispatch(
          updateEducation({
            index: key,
            name: 'graduate_type',
            value: item.graduate_type
          })
        );
        dispatch(
          updateEducation({
            index: key,
            name: 'total_score',
            value: item.total_score
          })
        );
        dispatch(
          updateEducation({
            index: key,
            name: 'score',
            value: item.score
          })
        );
      }
      //재랜더링
      console.log(cvEducation);
      console.log('Key: ' + key);
      console.log(item);
      console.log(cvData.cv.educations);
    });
    data['skills'].map((item, key) => {
      const new_skill_arr = { skill_no: item.skill_no, skill_name: item.skill_name, skill_domain: item.skill_domain };
      if (
        data['skills'].length > cvData.cv.skills.length &&
        !cvData.cv.skills.some((skill) => skill.skill_name === item.skill_name) &&
        item.skill_no !== 0
      ) {
        dispatch(addSkill(item));
      } else if (item.skill_no !== 0) {
        dispatch(updateSkill({ index: key, value: item.skill_name }));
      }
      console.log(item);
    });
    data['careers'].map((item, key) => {
      if (!cvData.cv.careers.some((career) => career.company_name === item.company_name) && item.career_no !== 0) {
        dispatch(addCareer(item));
      } else {
        dispatch(updateCareer({ index: key, name: 'company_name', value: item.company_name }));
        dispatch(updateCareer({ index: key, name: 'career_no', value: item.career_no }));
        dispatch(updateCareer({ index: key, name: 'cv_dept_name', value: item.cv_dept_name }));
        dispatch(updateCareer({ index: key, name: 'position', value: item.position }));
        dispatch(updateCareer({ index: key, name: 'salary', value: item.salary }));
        dispatch(updateCareer({ index: key, name: 'job', value: item.job }));
        dispatch(updateCareer({ index: key, name: 'join_date', value: item.join_date }));
        dispatch(updateCareer({ index: key, name: 'quit_date', value: item.quit_date }));
      }
      console.log(key);
      console.log(item);
    });
    data['certifications'].map((item, key) => {
      if (!cvData.cv.certifications.some((cert) => cert.cert_name === item.cert_name) && item.cert_no !== 0) {
        console.log(data['certifications'].length);
        console.log(cvData.cv.certifications.length);
        console.log('들어옴');
        dispatch(addCert(item));
      } else {
        dispatch(updateCert({ index: key, name: 'cert_name', vlaue: item.cert_name }));
        dispatch(updateCert({ index: key, name: 'cert_no', vlaue: item.cert_no }));
        dispatch(updateCert({ index: key, name: 'publisher', vlaue: item.publisher }));
        dispatch(updateCert({ index: key, name: 'acquisition_date', vlaue: item.acquisition_date }));
      }
      console.log(key);
      console.log(item);
      console.log(cvData.cv.certifications);
    });
    data['languages'].map((item, key) => {
      if (!cvData.cv.languages.some((lang) => lang.exam_type === item.exam_type) && item.language_no !== 0) {
        dispatch(addLang(item));
      }
      console.log(key);
      console.log(item);
    });
    data['activities'].map((item, key) => {
      if (!cvData.cv.activities.some((activity) => activity.activity_type === item.activity_type) && item.activity_no !== 0) {
        dispatch(addActivity(item));
      }
      console.log(key);
      console.log(item);
    });
    data['advantages'].map((item, key) => {
      if (data['advantages'].length > cvData.cv.advantages.length && item.advantage_no !== 0) {
        dispatch(addAdvantage(item));
      }
      console.log(key);
      console.log(item);
      console.log(cvData.cv.advantages);
    });
  };

  const sequentialProcess = async () => {
    await cv
      .getMainCVNO()
      .then((res) => {
        return loadMainCV(res.data);
      })
      .then(async () => {
        await cv
          .getList(cv_no.cv_no)
          .then((res) => {
            console.log(cv_no.cv_no);
            if (cv_no.cv_no > 0) {
              console.log(res);
              handleClickOpen();

              return res.data;
            }
          })
          .then(async (res) => {
            console.log(!dialog_open);
            console.log(isSelectCV);
            if (!isSelectCV) {
              console.log('UNDEFINED USER ID');
            }
            if (!dialog_open && isSelectCV) {
              console.log(res);
              await handleUpdate(res);
              console.log(cvData);
            }
          });
      });
  };

  const initData = async () => {
    await cv.getInit().then((res) => {
      dispatch(
        updateProfile({
          index: 0,
          name: 'user_id',
          value: res.data.user_id || ''
        })
      );
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
  };

  useEffect(() => {
    {
      isMainCV === 'MainCV'
        ? cv.getMainCVNO().then((res) => {
            dispatch(updateCVNO(res.data));
            console.log(cvData.cv.cv_no);
            loadMainCV(res.data);
          })
        : cv
            .getCVNO(job_posting_no)
            .then(async (res) => {
              console.log(res);

              console.log(job_posting_no);
              console.log(cv_no);
              return dispatch(updateCVNO(res.data));
            })
            .then(async (cvNoData) => {
              console.log(cv_no);
              console.log(cv_no.cv_no);
              console.log(cvNoData);
            });
    }

    //대표이력서 작성 이력이 있는 경우 자동 불러오기
    //APPLY CV에서 호출시 CV_NO를 APPLY CV_NO로 설정
    //이 부분에서 각 컴포넌트의 no 초기화 진행
    // MainToApplyCV();

    {
      isMainCV === 'MainCV'
        ? ''
        : cv.getPosition(job_posting_no).then((res) => {
            dispatch(
              updateProfile({
                index: 0,
                name: 'position',
                value: res.data
              })
            );
          });
    }
    //기존 작성 이력서 있는지 확인 Dialog로 선택가능
  }, []);

  const [delayCompleted, setDelayCompleted] = useState(false);

  useEffect(() => {
    // cv_no가 변경되면 cvNoChanged 상태를 토글하여 렌더링을 일으킴
    console.log(cv_no);
    const timer = setTimeout(() => {
      console.log('0.5초가 지났습니다.');
      if (cv_no && isMainCV !== 'MainCV') {
        setDelayCompleted(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [cv_no]);
  const [applyCheck, setApplyCheck] = useState(false);

  const ealryCheck = async () => {
    //지원 이력 확인
    console.log(cv_no.cv_no);
    const boolCheck = await cv.getApply(cv_no.cv_no);
    console.log(boolCheck.data);
    if (boolCheck.data > 0) {
      setApplyCheck(true);
    }
  };

  useEffect(() => {
    // delayCompleted 상태가 변경될 때 추가 작업 실행
    initData();
    ealryCheck();
    if (delayCompleted) {
      console.log('작업을 수행합니다.');
      const fetchData = async () => {
        // await sequentialProcess();
        cv.getMainCVNO()
          .then(async (res) => {
            console.log(res);
            await loadMainCV(res.data);
            enqueueSnackbar('대표이력서 불러오기 성공', { variant: 'info' });
          })
          .then(() => {
            console.log(cv_no.cv_no);
            cv.getList(cv_no.cv_no)
              .then(async (res) => {
                console.log(cv_no.cv_no);
                if (cv_no.cv_no > 0) {
                  console.log(res);
                  handleClickOpen();

                  return res.data;
                }
              })
              .then(async (res) => {
                console.log(!dialog_open);
                console.log(isSelectCV);

                // if (!isSelectCV) {
                //   console.log('UNDEFINED USER ID');
                // }
                if (!dialog_open && isSelectCV) {
                  console.log(res);

                  await handleUpdate(res);
                  console.log(cvData);
                }
              });
          });
        console.log(cvData);
      };
      // 여기서 원하는 작업을 수행
      fetchData();
    }
  }, [delayCompleted]);

  const [ocrImage, setOcrImage] = useState(); // OCR IMAGE SETTING
  const [dialog_open, set_dialogOpen] = useState(false); //불러오기 Dialog
  const [ocr_dialog_open, set_dialog_open] = useState(false); //OCR Dialog
  const [ocr_progress, set_ocr_progress] = useState(); //OCR PROGRESS
  console.log(ocrImage);

  const handle_ocr_open = (e) => {
    set_dialog_open(true);
  };

  const handle_ocr_close = (e) => {
    set_dialog_open(false);
  };

  return (
    <Grid container spacing={2.5}>
      <Dialog open={ocr_dialog_open} onClose={handle_ocr_close}>
        <DialogTitle>OCR 진행 중</DialogTitle>
        <DialogContent>
          <DialogContentText>OCR이 진행중입니다. 잠시만 기다려주세요.</DialogContentText>

          <Box sx={{ position: 'relative' }}>
            <Box
              sx={{
                position: 'relative',
                display: 'inline-block',
                width: 'fit-content'
              }}
            >
              <img src={ocrImage} alt="" style={{ width: '100%', height: 'auto', opacity: 0.4 }} />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <CircularProgress variant="determinate" size={200} value={parseInt(ocr_progress)} />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="caption" component="div" fontSize={25} color="text.secondary">
                    {`${Math.round(ocr_progress)}%`}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog_open} onClose={handleClose}>
        <DialogTitle>이력서 선택</DialogTitle>
        <DialogContent>
          <DialogContentText>작성중이던 이력서가 존재합니다. 불러오시겠습니까?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button name="loadCVDial" onClick={(e) => handleClose(e)}>
            불러오기
          </Button>
        </DialogActions>
      </Dialog>
      {isMainCV === 'MainCV' ? (
        <Grid item xs={12}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <CardHeader title={<Typography sx={{ fontSize: '25px', fontWeight: 'bold' }}>이력서 작성</Typography>} />
            <div style={{ justifyContent: 'center', marginRight: '10px' }}>
              <Button
                onClick={() => {
                  sendMainCVData();
                  enqueueSnackbar('대표이력서 저장 성공', { variant: 'info' });
                }}
                sx={{ color: 'black', '&:hover': { border: '2px solid #4682b4', color: '#4682b4' } }}
              >
                <SaveIcon />
                저장하기
              </Button>
            </div>
          </div>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Grid item xs={12}>
              <MainCard ref={componentRef}>
                <Typography sx={{ fontSize: '20px', height: '40px', fontWeight: 'bold' }}>인적사항</Typography>
                <Divider color="black" sx={{ mb: 2.5, height: 3, width: '100%' }} />
                <Profile isMainCV={isMainCV} />
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
                    <Ocr
                      ocrImage={ocrImage}
                      setOcrImage={setOcrImage}
                      dialogOpen={handle_ocr_open}
                      dialogClose={handle_ocr_close}
                      setOcrProgress={set_ocr_progress}
                    />
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
                    <IconButton onClick={() => langAddFields()}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Divider color="black" sx={{ mb: 2.5, height: 3, width: '100%' }} />
                <Language />
                {isMainCV == 'MainCV' ? (
                  ''
                ) : (
                  <>
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ mt: 5 }}>
                      <Typography
                        ref={(el) => (tab_ref.current['docs'] = el)}
                        sx={{ fontSize: '20px', height: '40px', fontWeight: 'bold' }}
                      >
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
                  </>
                )}

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
        </Grid>
      ) : (
        <>
          {/* <OpenIconSpeedDial
            cvData={cvData}
            selectedFiles={selectedFiles}
            componentRef={componentRef}
            setSelectedFiles={setSelectedFiles}
          /> */}
          <Grid item xs={1} />
          <Grid item xs={9}>
            <MainCard>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <CardHeader title={<Typography sx={{ fontSize: '25px', fontWeight: 'bold' }}>이력서 작성</Typography>} />
                {/* <Button onClick={MainToApplyCV}>대표 이력서 불러오기</Button> */}
              </div>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Grid item xs={12}>
                  <MainCard ref={componentRef}>
                    <Typography sx={{ fontSize: '20px', height: '40px', fontWeight: 'bold' }}>인적사항</Typography>
                    <Divider color="black" sx={{ mb: 2.5, height: 3, width: '100%' }} />
                    <Profile isMainCV={isMainCV} />
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
                      <Typography
                        ref={(el) => (tab_ref.current['skills'] = el)}
                        sx={{ fontSize: '20px', height: '40px', fontWeight: 'bold' }}
                      >
                        보유 스킬
                      </Typography>
                    </Box>
                    <Divider color="black" sx={{ mb: 2.5, height: 3, width: '100%' }} />
                    {/* <Skills /> */}
                    <ControllableStates />
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ mt: 5 }}>
                      <Typography
                        ref={(el) => (tab_ref.current['career'] = el)}
                        sx={{ fontSize: '20px', height: '40px', fontWeight: 'bold' }}
                      >
                        경력 사항
                      </Typography>

                      <IconButton onClick={() => careerAddFields()}>
                        <AddIcon />
                      </IconButton>
                    </Box>
                    <Divider color="black" sx={{ mb: 2.5, height: 3, width: '100%' }} />
                    <Career />
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ mt: 5 }}>
                      <Typography
                        ref={(el) => (tab_ref.current['cert'] = el)}
                        sx={{ fontSize: '20px', height: '40px', fontWeight: 'bold' }}
                      >
                        자격증
                      </Typography>
                      <Box display={'flex'} flexDirection={'row'} justifyContent={'end'}>
                        <Ocr
                          ocrImage={ocrImage}
                          setOcrImage={setOcrImage}
                          dialogOpen={handle_ocr_open}
                          dialogClose={handle_ocr_close}
                          setOcrProgress={set_ocr_progress}
                        />
                        <IconButton onClick={() => certAddFields()}>
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Divider color="black" sx={{ mb: 2.5, height: 3, width: '100%' }} />
                    <Certification />
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ mt: 5 }}>
                      <Typography
                        ref={(el) => (tab_ref.current['lang'] = el)}
                        sx={{ fontSize: '20px', height: '40px', fontWeight: 'bold' }}
                      >
                        어학 성적
                      </Typography>
                      <Box display={'flex'} flexDirection={'row'} justifyContent={'end'}>
                        <IconButton onClick={() => langAddFields()}>
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Divider color="black" sx={{ mb: 2.5, height: 3, width: '100%' }} />
                    <Language />
                    {isMainCV === 'MainCV' ? (
                      ''
                    ) : (
                      <>
                        <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ mt: 5 }}>
                          <Typography
                            ref={(el) => (tab_ref.current['docs'] = el)}
                            sx={{ fontSize: '20px', height: '40px', fontWeight: 'bold' }}
                          >
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
                      </>
                    )}

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

                    <Box
                      display={'flex'}
                      flexDirection={'row'}
                      justifyContent={'start'}
                      alignItems={'center'}
                      sx={{ mt: 5, height: '40px' }}
                    >
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
          {isMainCV === 'MainCV' ? (
            ''
          ) : (
            <>
              <Grid item xs={1}>
                <CVSide
                  currentTab={current_tab}
                  scrollToTab={scrollToTab}
                  tabRef={tab_ref}
                  cvData={cvData}
                  selectedFiles={selectedFiles}
                  componentRef={componentRef}
                  setSelectedFiles={setSelectedFiles}
                  dialog_open={dialog_open}
                  isSelectCV={isSelectCV}
                  userInfo={userInfo}
                  selectCV={isSelectCV}
                  applyCheck={applyCheck}
                  setApplyCheck={setApplyCheck}
                />
              </Grid>
              <Grid item xs={1} />
            </>
          )}
        </>
      )}
    </Grid>
  );
};

export default CV;
