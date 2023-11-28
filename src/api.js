import axios from 'axios';

const encodeIfNeeded = (value) => {
  // 정규식을 사용하여 문자열에 한글이 포함되어 있는지 체크합니다.
  const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(value);

  // 한글이 포함되어 있다면 인코딩을 수행합니다.
  if (hasKorean) {
    return encodeURIComponent(value);
  }

  return value;
};
// axios 인스턴스를 생성합니다.
const instance = axios.create({
  baseURL: 'http://localhost:8888'
});
// AccessToken 검증 로직
instance.interceptors.request.use((config) => {
  if (!config.headers) return config;

  let accessToken = sessionStorage.getItem('AccessToken');

  if (accessToken !== null) {
    accessToken = encodeIfNeeded(accessToken);
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
//accessToken 재발급 로직
instance.interceptors.response.use(
  (response) => {
    const accessToken = response.headers.accesstoken;
    if (accessToken) {
      sessionStorage.setItem('AccessToken', accessToken);
      principal.setToken(accessToken);
    }
    return response;
  }, //accessToken 에러로직(진행중)
  async function (error) {
    const originalConfig = error.config;
    const msg = error.response.data.message;
    const status = error.response.status;

    //AccessToken 값이 유효하지 않으면 없으면 자동 로그아웃
    if (msg === 'AccessToken is not valid') {
      sessionStorage.removeItem('AccessToken');
      localStorage.setItem('logoutEvent', 'true');
    }
    return Promise.reject(error);
  }
);

// 각 방법별 예시
const get = {
  // get 작성방법
  // api: () => {return instance.post('/api경로')}
  userList: () => {
    return instance.get('/admin/list');
  },
  cvTest: (data) => {
    return instance.get('/admin/main/cv/list', { params: { cv_no: data } });
  }
};

const post = {
  //post 작성방법
  //api: (data) => { return instance.post('/api경로', data) }
  test: () => {
    return instance.post('/admin/test');
  }
};

//실제 작성 코드는 각자 변수를 만들어서 작성 후 api에 추가 각자 api에 대해 간단하게 명세
const principal = {
  //로그인 api
  login: (data) => {
    return instance.post('/login', data);
  },
  setToken: (token) => {
    return (axios.defaults.headers.common['Authorization'] = `Bearer ${token}`);
  },
  getUser: (accessToken) => {
    return instance.get('/auth/login-user', { params: { token: accessToken } });
  },
  googleLogin: () => {
    return instance.get('/auth/google-login');
  },
  googleSocialLogin: (code) => {
    return instance.get('/auth/google', { params: { code: code } });
  },
  //로그아웃 api
  logout: (data) => {
    return instance.post('/auth/logout', data);
  },
  //회원가입 api
  register: (data) => {
    return instance.post('/auth/create', data);
  },
  //알림 List api
  notifications: () => {
    return instance.get('/api/notificate/get-noti', { headers: { 'Content-Type': 'application/json' } });
  },
  //알림 polling api
  polling: () => {
    return instance.post('/api/notificate/polling', null, { headers: { 'Content-Type': 'application/json' } });
  },
  //알림 delete api
  notiDelte: (data) => {
    return instance.post('/api/notificate/delete-noti', null, { headers: { 'Content-Type': 'application/json' }, params: { id: data } });
  },
  createNoti: (data) => {
    return instance.post('/api/notificate/create', data, { headers: { 'Content-Type': 'application/json' } });
  }
};

const admin = {
  //유저 리스트 조회
  userList: () => {
    return instance.get('/admin/user-list');
  },
  //인사당담자 리스트 조회
  hrList: () => {
    return instance.get('/admin/hr-list');
  },
  //인사담당자 계정 추가
  hrCreate: (data) => {
    return instance.post('/auth/create-hr', data);
  },
  //인사담당자 계정 수정, 업데이트
  hrModify: (data) => {
    return instance.put('/auth/update-hr', data);
  },
  hrDelete: (data) => {
    return instance.post('/auth/delete-hr-account', null, { params: { user_id: data } });
  },
  noneAppHrList: () => {
    return instance.get('/admin/none-app-hr-list');
  }
};

const sort = {
  //공고 정보 api
  postingInfo: (postingNo) => {
    return instance.get(`/admin/${postingNo}/info`);
  },
  // 지원자 목록 api
  applicantList: (postingNo, type) => {
    return instance.get(`/admin/${postingNo}/sort?type=${type}`);
  },
  // 지원자 상세 api
  applicantDetail: (applyNo) => {
    return instance.get(`/admin/${applyNo}/detail`);
  },
  //합격 처리 api
  applicantHandle: (type, data) => {
    const requestData = data.map((applyNo) => {
      return {
        apply_no: applyNo,
        status_type: type == 'pass' ? '합격대기' : '불합격대기'
      };
    });
    return instance.put(`/admin/type`, requestData);
  },
  //합격 발표 api
  noticeHandle: (postingNo, data) => {
    const requestData = {
      ...data,
      job_posting_no: postingNo
    };
    return instance.put(`/admin/${postingNo}/acceptance`, requestData);
  },
  //지원자 면접 평가 api
  applicantEval: (data) => {
    return instance.post(`/admin/${data.apply_no}/evaluation`, data);
  },
  //자소서 워드클라우드 api
  wordCloud: () => {
    return instance.get(`/admin/test-word`);
  },
  //지원자 선별 목록 요청 api
  applicantSortList: (postingNo, data) => {
    return instance.post(`/admin/${postingNo}/filter`, data);
  },
  //이력서 엑셀 저장 api
  cvToExcel: (data) => {
    return instance.post(`/admin/excel`, data);
  },
  //파일 다운로드 api
  fileDownload: (data) => {
    return instance.post(`/admin/file`, data, {
      responseType: 'arraybuffer'
    });
  },
  //점수 상세 조회 api
  applicantScore: (postingNo, applyNo) => {
    return instance.get(`/admin/${postingNo}/sort/${applyNo}`);
  },
  //평균점수 조회 api
  applicantAvg: (postingNo) => {
    return instance.get(`/admin/${postingNo}/average`);
  }
  //열람여부 조회 api
};

const cv = {
  //이력서 api
  postThumbnail: (data) => {
    return instance.post('/admin/main/cv/image-upload', data);
  },
  postMultiFile: (data) => {
    return instance.post('/admin/main/cv/cv-file-upload', data);
  },
  getList: (data) => {
    return instance.get('/admin/main/cv/list', { params: { cv_no: data } });
  },
  postList: (data) => {
    return instance.post('/admin/main/cv/', data);
  },
  putList: (data) => {
    return instance.put('/admin/main/cv/', data);
  },
  getInit: () => {
    return instance.get('/admin/main/cv/init-cv');
  },
  getCVNO: (data) => {
    return instance.get('/admin/main/cv/get-cv-no', { params: { job_posting_no: data } });
  },
  getMainCVNO: () => {
    return instance.get('/admin/main/cv/get-main-cv-no');
  },
  getPosition: (data) => {
    return instance.get('/admin/main/cv/find-position', { params: { job_posting_no: data } });
  },
  getFiles: (data) => {
    return instance.get('/admin/main/cv/get-files', { params: { cv_no: data }, responseType: 'arraybuffer' });
  },
  getFileInfos: (data) => {
    return instance.get('/admin/main/cv/get-files-infos', { params: { cv_no: data } });
  },
  getApplyList: () => {
    return instance.get('/admin/main/cv/apply-list');
  },
  getJobInfoList: (data) => {
    return instance.get('/admin/main/cv/job-info-list', { params: { job_posting_no: data } });
  },
  getApply: (data) => {
    return instance.get('/admin/main/cv/apply', { params: { cv_no: data } });
  },
  postApply: (data) => {
    return instance.post('/admin/main/cv/send-apply', data);
  },
  deleteActivity: (data) => {
    return instance.delete('/admin/main/cv/activity', data);
  },
  deleteAdvantage: (data) => {
    return instance.delete('/admin/main/cv/advantage', data);
  },
  deleteCareer: (data) => {
    return instance.delete('/admin/main/cv/career', data);
  },
  deleteCert: (data) => {
    return instance.delete('/admin/main/cv/cert', data);
  },
  deleteEducation: (data) => {
    return instance.delete('/admin/main/cv/edu', data);
  },
  deleteLanguage: (data) => {
    return instance.delete('/admin/main/cv/lang', data);
  },
  deleteSkill: (data) => {
    return instance.delete('/admin/main/cv/skill', data);
  },
  deleteCVFile: (data) => {
    return instance.delete('admin/main/cv/cvfile', data);
  }
};

const reqPosting = {
  // 채용요청서 리스트
  jobReqList: () => {
    return instance.get('/admin/hire/reqlist');
  },
  // 상태필터링
  statusList: (data) => {
    return instance.post('/admin/hire/statuslist', data);
  },
  // 요청서 모든 필터링
  search: (data) => {
    return instance.post('/admin/hire/search', data);
  },
  // 공고등록
  createPost: (data) => {
    return instance.post('/admin/hire/create-post', data);
  },
  jobReqOne: (jobReqNo) => {
    return instance.get(`/admin/hire/jobreq/${jobReqNo}`);
  },
  updateReq: (jobReqNo, data) => {
    return instance.put(`/admin/hire/update/${jobReqNo}`, data);
  },
  // 지원자 성비
  getGender: (jobPostingNo) => {
    return instance.get(`admin/hire/appliedGender/${jobPostingNo}`);
  },
  // 지원자 연령대
  getAge: (jobPostingNo) => {
    return instance.get(`admin/hire/appliedAge/${jobPostingNo}`);
  },
  // 지원자 자격증
  getCert: (jobPostingNo) => {
    return instance.get(`admin/hire/appliedCert/${jobPostingNo}`);
  },
  getByIdPostList: () => {
    return instance.get('admin/hire/getAllJobPostingListById');
  }
  // 파일 업로드
};
// 사용방법
// 각 파일에 import api from api.js 작성
// api.get.userList().then() ~~~

const languages = {
  영어: {
    grade1: [{ toeic: 900 }, { opic: 'al' }],
    grade2: [{ toeic: 800 }, { opic: 'ih' }],
    grade3: [{ toeic: 700 }, { opic: 'im1' }],
    grade4: [{ toeic: 600 }, { opic: 'il' }]
  },
  제2외국어: {
    grade1: [{ jpt: 880 }, { hsk: 6 }],
    grade2: [{ jpt: 750 }, { hsk: 5 }],
    grade3: [{ jpt: 700 }, { hsk: 4 }],
    grade4: [{ jpt: 650 }, { hsk: 5 }]
  }
};
export { get, post, principal, sort, cv, admin, reqPosting };
