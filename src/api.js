import axios from 'axios';

const encodeIfNeeded = (value) => {
  // 정규식을 사용하여 문자열에 한글이 포함되어 있는지 체크합니다.
  const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(value);

  // 한글이 포함되어 있다면 인코딩을 수행합니다.
  if (hasKorean) {
    return encodeURIComponent(value);
  }

  return value;
}

// axios 인스턴스를 생성합니다.
const instance = axios.create({
  baseURL: 'http://localhost:8888'
});
// AccessToken 검증 로직
instance.interceptors.request.use((config) => {
  console.log(config);
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
    console.log('get response', response);
    const accessToken = response.headers.accesstoken;
    console.log('1. ' + accessToken);
    if (accessToken) {
      sessionStorage.setItem('AccessToken', accessToken);
      principal.setToken(accessToken);
      console.log('accesstoken set storage');
    }
    return response;
  }, //accessToken 에러로직(진행중)
  async function (error) {
    const originalConfig = error.config;
    console.log(error);
    const msg = error.response.data.message;
    const status = error.response.status;

    console.log(error);
    console.log(msg);
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
  }
}

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
  }
};

const cv = {
  //이력서 api
  postThumbnail: (data) => {
    return instance.post('/admin/main/cv/imageUpload', data);
  },
  postMultiFile: (data) => {
    return instance.post('/admin/main/cv/cvFileUpload', data);
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
  }
};

// 사용방법
// 각 파일에 import api from api.js 작성
// api.get.userList().then() ~~~

export { get, post, principal, sort, cv, admin };
