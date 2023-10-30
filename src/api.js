import axios from 'axios';


// axios 인스턴스를 생성합니다.
const instance = axios.create({
    baseURL: 'http://localhost:8888'
});
// AccessToken 검증 로직
axios.interceptors.request.use((config) => {
    if (!config.headers) return config;

    let accessToken = sessionStorage.getItem('AccessToken');

    if (accessToken !== null) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
})
//accessToken 재발급 로직
axios.interceptors.response.use((response) => {
    console.log("get response", response);
    const accessToken = response.headers.accesstoken;
    console.log('1. ' + accessToken);
    if (accessToken) {
        sessionStorage.setItem('AccessToken', accessToken);
        principal.setToken(accessToken);
        console.log("accesstoken set storage");
    }
    return res;
},//accessToken 에러로직(진행중)
    async function (error) {
        const originalConfig = error.config;
        const msg = error.response.data.message;
        const status = error.response.status;

        console.log(error);
        return Promise.reject(error);
    }
)

// 각 방법별 예시
const get = {
    // get 작성방법
    // api: () => {return instance.post('/api경로')}
    userList: () => {
        return instance.get('/admin/list');
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
    login: (data) => { return instance.post('/login', data) },
    setToken: (token) => { return axios.defaults.headers.common['Authorization'] = `Bearer ${token}` },
    getUser: (accessToken) => { return instance.get('/auth/login-user', { params: { token: accessToken } }) },
    //로그아웃 api
    logout: (data) => { return instance.post('/logout', data) }
};

const sort = {
    // 지원자 목록 api
    applicantList: (posting_no, type) => {
        return instance.get(`/admin/${posting_no}/sort?type=${type}`);
    }
};

// 사용방법
// 각 파일에 import api from api.js 작성
// api.get.userList().then() ~~~

export { get, post, principal, sort };
