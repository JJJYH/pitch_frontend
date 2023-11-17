import { principal } from "api";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const GoogleRedirect = () => {
    const navigate = useNavigate();
    let channel;

    useEffect(() => {
        // 채널 생성
        channel = new BroadcastChannel('token_channel');

        return () => {
            // 컴포넌트가 언마운트되면 채널을 닫음
            channel.close();
        };
    }, []);
    useEffect(() => {
        const url = new URL(window.location.href);
        console.log(url);
        const href = url.href;
        if (!href) return;
        const code = href.split("=")[1].split("&")[0];
        console.log(code);
        let token = '';
        principal.googleSocialLogin(code).then((res) => {
            console.log(res);
            token = res.headers.accesstoken
            channel.postMessage({ accesstoken: token });
            window.close();
        }).catch((err) => {
            console.log(err);
            if (err.response.data.message === 'This Account is not approved') {
                channel.postMessage({ NoneApp: 'noneApp' });
                window.close();
            } else {
                channel.postMessage({ notFoundAccount: 'nfa', email: err.response.data.email });
                window.close();
            }

            //window.close();
        })
    }, [])
    return <></>
}
export default GoogleRedirect;