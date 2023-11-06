import React from 'react';
import { Box, Divider, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import { useEffect } from 'react';
import { useState } from 'react';

const CVSide = ({ currentTab, scrollToTab, tabRef }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const locationState = [];
  const [location_point, set_location_point] = useState('');
  for (const key in tabRef.current) {
    locationState.push(tabRef.current[key].getBoundingClientRect().top + window.scrollY - 80);
  }
  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    setScrollPosition(window.scrollY);

    if (scrollPosition > locationState[0] && scrollPosition < locationState[1]) {
      set_location_point('education');
    }
    if (scrollPosition > locationState[1] && scrollPosition < locationState[2]) {
      set_location_point('skills');
    }
    if (scrollPosition > locationState[2] && scrollPosition < locationState[3]) {
      set_location_point('career');
    }
    if (scrollPosition > locationState[3] && scrollPosition < locationState[4]) {
      set_location_point('cert');
    }
    if (scrollPosition > locationState[4] && scrollPosition < locationState[5]) {
      set_location_point('lang');
    }
    if (scrollPosition > locationState[5] && scrollPosition < locationState[6]) {
      set_location_point('activity');
    }
    if (scrollPosition > locationState[6] && scrollPosition < locationState[7]) {
      set_location_point('docs');
    }
    if (scrollPosition > locationState[7]) {
      set_location_point('advantage');
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
          color={location_point === 'education' ? 'primary' : 'default'}
          sx={{ mb: 2.5, '&:hover': { color: 'secondary.main' } }}
          textAlign={'center'}
          alignContent={'center'}
          onClick={() => scrollToTab('education')} // 학력 탭으로 스크롤
        >
          학력
        </Typography>

        <Typography
          variant="h4"
          color={location_point === 'skills' ? 'primary' : 'default'}
          sx={{ mb: 2.5, '&:hover': { color: 'secondary.main' } }}
          textAlign={'center'}
          alignContent={'center'}
          onClick={() => scrollToTab('skills')} // 스킬 탭으로 스크롤
        >
          보유 스킬
        </Typography>

        <Typography
          variant="h4"
          color={location_point === 'career' ? 'primary' : 'default'}
          sx={{ mb: 2.5, '&:hover': { color: 'secondary.main' } }}
          textAlign={'center'}
          alignContent={'center'}
          onClick={() => scrollToTab('career')} // 경력 탭으로 스크롤
        >
          경력 사항
        </Typography>

        <Typography
          variant="h4"
          color={location_point === 'cert' ? 'primary' : 'default'}
          sx={{ mb: 2.5, '&:hover': { color: 'secondary.main' } }}
          textAlign={'center'}
          alignContent={'center'}
          onClick={() => scrollToTab('cert')}
        >
          자격증
        </Typography>

        <Typography
          variant="h4"
          color={location_point === 'lang' ? 'primary' : 'default'}
          sx={{ mb: 2.5, '&:hover': { color: 'secondary.main' } }}
          textAlign={'center'}
          alignContent={'center'}
          onClick={() => scrollToTab('lang')}
        >
          어학 성적
        </Typography>

        <Typography
          variant="h4"
          color={location_point === 'activity' ? 'primary' : 'default'}
          sx={{ mb: 2.5, '&:hover': { color: 'secondary.main' } }}
          textAlign={'center'}
          alignContent={'center'}
          onClick={() => scrollToTab('docs')}
        >
          기타 문서
        </Typography>
        <Typography
          variant="h4"
          color={location_point === 'docs' ? 'primary' : 'default'}
          sx={{ mb: 2.5, '&:hover': { color: 'secondary.main' } }}
          textAlign={'center'}
          alignContent={'center'}
          onClick={() => scrollToTab('activity')}
        >
          대외 활동
        </Typography>
        <Typography
          variant="h4"
          color={location_point === 'advantage' ? 'primary' : 'default'}
          sx={{ mb: 2.5, '&:hover': { color: 'secondary.main' } }}
          textAlign={'center'}
          alignContent={'center'}
          onClick={() => scrollToTab('advantage')}
        >
          우대 사항
        </Typography>
      </MainCard>
    </Box>
  );
};

export default CVSide;
