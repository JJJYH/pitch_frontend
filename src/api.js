import axios from 'axios';

// axios 인스턴스를 생성합니다.
const instance = axios.create({
  baseURL: 'http://localhost:8888' // 여기에 원하는 기본 URL을 설정합니다.
});

// 각 방법별 예시
const get = {
  // get 작성방법
  // api: () => {return instance.post('/api경로')}
  userList: () => {
    return instance.get('/admin/list');
  },
  cvTest: () => {
    return instance.get('/admin/main/cv/list');
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
  getUser: (token) => {
    return instance.get('/login-user', token);
  },
  //로그아웃 api
  logout: (data) => {
    return instance.post('/logout', data);
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
  }
};

const cv = {
  //이력서 api
  getList: () => {
    return instance.get('/admin/main/cv/list');
  },
  postList: (data) => {
    return instance.post('/admin/main/cv/', data);
  },
  putList: (data) => {
    return instance.put('/admin/main/cv/', data);
  }
};

// 사용방법
// 각 파일에 import api from api.js 작성
// api.get.userList().then() ~~~

export { get, post, principal, sort, cv };
