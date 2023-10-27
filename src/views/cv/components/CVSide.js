import React from 'react';
import { Box, Divider, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import { useEffect } from 'react';
import { useState } from 'react';

const CVSide = ({ currentTab, scrollToTab, tabRef }) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    setScrollPosition(window.scrollY);
    console.log('이벤트 리스너 시작 : ' + scrollPosition);

    console.log('tabRef 위치:' + JSON.stringify(tabRef.current['skills'].getBoundingClientRect().top + -70));
    if (0 > tabRef.current['education'].getBoundingClientRect().top + -70) {
      console.log('지금은 학력 부분입니다!!!');
    }
    if (0 > tabRef.current['skills'].getBoundingClientRect().top + -70) {
      console.log('지금은 보유스킬 부분입니다!!!');
    }
    if (0 > tabRef.current['career'].getBoundingClientRect().top + -70) {
      console.log('지금은 경력 사항 부분입니다!!!');
    }
    if (0 > tabRef.current['cert'].getBoundingClientRect().top + -70) {
      console.log('지금은 자격증 부분입니다!!!');
    }
    if (0 > tabRef.current['lang'].getBoundingClientRect().top + -70) {
      console.log('지금은 어학 성적 부분입니다!!!');
    }
    if (0 > tabRef.current['activity'].getBoundingClientRect().top + -70) {
      console.log('지금은 대외활동 부분입니다!!!');
    }
    if (0 > tabRef.current['advantage'].getBoundingClientRect().top + -70) {
      console.log('지금은 우대사항 부분입니다!!!');
    }
  };

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollPosition]);

  return (
    <Box sx={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', position: 'sticky', top: 90, width: '150px' }}>
      <MainCard sx={{ width: '100%' }}>
        <Typography
          variant="h4"
          // color={currentTab === 'education' ? 'primary' : 'default'}
          sx={{ mb: 2.5, color: currentTab === 'education' ? 'primary' : 'text.primary' }}
          textAlign={'center'}
          alignContent={'center'}
          onClick={() => scrollToTab('education')} // 학력 탭으로 스크롤
        >
          학력
        </Typography>

        <Typography
          variant="h4"
          sx={{ mb: 2.5 }}
          textAlign={'center'}
          alignContent={'center'}
          onClick={() => scrollToTab('skills')} // 스킬 탭으로 스크롤
        >
          보유 스킬
        </Typography>

        <Typography
          variant="h4"
          sx={{ mb: 2.5 }}
          textAlign={'center'}
          alignContent={'center'}
          onClick={() => scrollToTab('career')} // 경력 탭으로 스크롤
        >
          경력 사항
        </Typography>

        <Typography variant="h4" sx={{ mb: 2.5 }} textAlign={'center'} alignContent={'center'} onClick={() => scrollToTab('cert')}>
          자격증
        </Typography>

        <Typography variant="h4" sx={{ mb: 2.5 }} textAlign={'center'} alignContent={'center'} onClick={() => scrollToTab('lang')}>
          어학 성적
        </Typography>

        <Typography variant="h4" sx={{ mb: 2.5 }} textAlign={'center'} alignContent={'center'} onClick={() => scrollToTab('activity')}>
          대외 활동
        </Typography>

        <Typography variant="h4" sx={{ mb: 2.5 }} textAlign={'center'} alignContent={'center'} onClick={() => scrollToTab('advantage')}>
          우대 사항
        </Typography>
      </MainCard>
    </Box>
  );
};

export default CVSide;
