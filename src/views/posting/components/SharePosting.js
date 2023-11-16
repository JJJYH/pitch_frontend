import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const SharePosting = () => {
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
        title: '오늘의 디저트',
        description: '아메리카노, 빵, 케익',
        imageUrl: 'https://mud-kage.kakao.com/dn/NTmhS/btqfEUdFAUf/FjKzkZsnoeE4o19klTOVI1/openlink_640x640s.jpg',
        link: {
          mobileWebUrl: 'http://localhost:3000/main?post=33',
          webUrl: 'http://localhost:3000/main?post=33'
        }
      },

      buttons: [
        {
          title: '공고 보러가기',
          link: {
            mobileWebUrl: 'http://localhost:3000/main?post=33',
            webUrl: 'http://localhost:3000/main?post=33'
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
