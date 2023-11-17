import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const SharePosting = ({ postingNo, jobPosting }) => {
  useEffect(() => {
    window.Kakao.init(process.env.REACT_APP_KAKAO_SHARE_KEY);

    // window.Kakao.Share.createCustomButton({
    //   container: '#kakaotalk-sharing-btn',
    //   templateId: 100843,
    //   templateArgs: {
    //     title: '제목 영역입니다.',
    //     desc: '설명 영역입니다.'
    //   }
    // });

    window.Kakao.Share.createDefaultButton({
      container: '#kakaotalk-sharing-btn',
      objectType: 'feed',
      content: {
        title: jobPosting.jobReq.req_title,
        description: '당신을 기다립니다.',
        imageUrl: 'https://ifh.cc/g/wRzrPF.png',
        link: {
          mobileWebUrl: `http://localhost:3000/main?get=${postingNo}`,
          webUrl: `http://localhost:3000/main?get=${postingNo}`
        }
      },

      buttons: [
        {
          title: '공고 보러가기',
          link: {
            mobileWebUrl: `http://localhost:3000/main?get=${postingNo}`,
            webUrl: `http://localhost:3000/main?get=${postingNo}`
          }
        }
      ]
    });
  }, []);

  return (
    <>
      {/* <Helmet>
        <script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.5.0/kakao.min.js"
          integrity="sha384-kYPsUbBPlktXsY6/oNHSUDZoTX6+YI51f63jCPEIPFP09ttByAdxd2mEjKuhdqn4"
          crossOrigin="anonymous"
        />
      </Helmet> */}

      <a id="kakaotalk-sharing-btn" href="#">
        <img
          src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
          alt="카카오톡 공유 보내기 버튼"
        />
      </a>
    </>
  );
};

export default SharePosting;
