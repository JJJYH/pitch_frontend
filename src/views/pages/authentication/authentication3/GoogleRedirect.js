import { principal } from "api";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const GoogleRedirect = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const url = new URL(window.location.href);
        console.log(url);
        const href = url.href;
        if (!href) return;
        const code = href.split("=")[1].split("&")[0];
        console.log(code);
        principal.googleSocialLogin(code).then((res) => {
            console.log(res);
        })
        //navigate('/');
    }, [])
    return <></>
}
export default GoogleRedirect;