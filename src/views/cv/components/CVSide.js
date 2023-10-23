import React from 'react';
import { Box, Divider, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import { useEffect } from 'react';

const CVSide = ({ currentTab, scrollToTab, tabRef }) => {
  useEffect(() => {
    if (currentTab >= 0 && currentTab < tabRef.length && tabRef[currentTab]) {
      tabRef[currentTab].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentTab, tabRef]);

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'sticky', top: 90, width: '100%' }}>
      <MainCard sx={{ width: '100%' }}>
        <SubCard
          onClick={() => scrollToTab('education')} // 학력 탭으로 스크롤
          sx={{ mb: 1, boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}
        >
          <Typography variant="h4" sx={{ mb: 2.5 }} textAlign={'center'} alignContent={'center'}>
            학력
          </Typography>
          <Divider color="#4682B4" sx={{ mb: 2.5, height: 5, width: '100%' }} />
        </SubCard>
        <SubCard
          onClick={() => scrollToTab('skills')} //보유 스킬 탭으로 스크롤
          sx={{ mb: 1, boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}
        >
          <Typography variant="h4" sx={{ mb: 2.5 }} textAlign={'center'} alignContent={'center'}>
            보유 스킬
          </Typography>
          <Divider color="#4682B4" sx={{ mb: 2.5, height: 5, width: '100%' }} />
        </SubCard>
        <SubCard
          onClick={() => scrollToTab('career')} //경력 사항 탭으로 스크롤
          sx={{ mb: 1, boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}
        >
          <Typography variant="h4" sx={{ mb: 2.5 }} textAlign={'center'} alignContent={'center'}>
            경력 사항
          </Typography>
          <Divider color="#4682B4" sx={{ mb: 2.5, height: 5, width: '100%' }} />
        </SubCard>
        <SubCard
          onClick={() => scrollToTab('cert')} //자격증 탭으로 스크롤
          sx={{ mb: 1, boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}
        >
          <Typography variant="h4" sx={{ mb: 2.5 }} textAlign={'center'} alignContent={'center'}>
            자격증
          </Typography>
          <Divider color="#4682B4" sx={{ mb: 2.5, height: 5, width: '100%' }} />
        </SubCard>
        <SubCard
          onClick={() => scrollToTab('activity')} //대외 활동 탭으로 스크롤
          sx={{ mb: 1, boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}
        >
          <Typography variant="h4" sx={{ mb: 2.5 }} textAlign={'center'} alignContent={'center'}>
            대외 활동
          </Typography>
          <Divider color="#4682B4" sx={{ mb: 2.5, height: 5, width: '100%' }} />
        </SubCard>
        <SubCard
          onClick={() => scrollToTab('advantage')} //우대사항 탭으로 스크롤
          sx={{ mb: 1, boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}
        >
          <Typography variant="h4" sx={{ mb: 2.5 }} textAlign={'center'} alignContent={'center'}>
            우대 사항
          </Typography>
          <Divider color="#4682B4" sx={{ mb: 2.5, height: 5, width: '100%' }} />
        </SubCard>
      </MainCard>
    </Box>
  );
};

export default CVSide;
