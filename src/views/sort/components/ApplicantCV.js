import React from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import classNames from '../sort.module.scss';
import { getFormattedDate } from '../sorts';
import styled from 'styled-components';

const ApplicantCV = React.forwardRef(({ applicantInfo }, ref) => {
  return (
    <Grid container direction={'column'} ref={ref} className={classNames.cvRoot}>
      <Box sx={{ padding: '50px', border: '1px solid black' }}>
        <Grid item className={classNames.title}>
          <Typography variant="h2">입사지원서</Typography>
        </Grid>
        <Grid item container className={classNames.row} sx={{ border: '1px solid black' }}>
          <Grid item xs={2} sx={{ minHeight: '230px', borderRight: '1px solid black' }}>
            사진
          </Grid>
          <Grid item container xs={10}>
            <Grid item xs={1} className={classNames.subTitleGrid} sx={{ borderRight: '1px solid black' }}>
              <Typography variant="h4" className={classNames.subTitle}>
                인적사항
              </Typography>
            </Grid>
            <Grid item xs={11}>
              <Grid item container direction={'column'}>
                <Grid item container sx={{ borderBottom: '1px solid black' }}>
                  <Grid item xs={2} container direction={'column'}>
                    <Grid item className={classNames.typeGrid} sx={{ borderBottom: '1px solid black' }}>
                      <Typography variant="h4" className={classNames.type}>
                        성 명
                      </Typography>
                    </Grid>
                    <Grid item className={classNames.typeGrid} sx={{ borderBottom: '1px solid black' }}>
                      <Typography variant="h4" className={classNames.type}>
                        생년월일
                      </Typography>
                    </Grid>
                    <Grid item className={classNames.typeGrid}>
                      <Typography variant="h4" className={classNames.type}>
                        휴대전화
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs={4} container direction={'column'}>
                    <Grid item className={classNames.contentGrid} sx={{ borderBottom: '1px solid black' }}>
                      <Typography variant="h4" className={classNames.contentCenter}>
                        {applicantInfo['cv']?.['user_nm']}
                      </Typography>
                    </Grid>
                    <Grid item className={classNames.contentGrid} sx={{ borderBottom: '1px solid black' }}>
                      <Typography variant="h4" className={classNames.contentCenter}>
                        {applicantInfo['cv']?.['user_birth']}
                      </Typography>
                    </Grid>
                    <Grid item className={classNames.contentGrid}>
                      <Typography variant="h4" className={classNames.contentCenter}>
                        {applicantInfo['cv']?.['user_phone']}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs={2} container direction={'column'}>
                    <Grid item className={classNames.typeGrid} sx={{ borderBottom: '1px solid black', borderLeft: '1px solid black' }}>
                      <Typography variant="h4" className={classNames.type}>
                        지원회사
                      </Typography>
                    </Grid>
                    <Grid item className={classNames.typeGrid} sx={{ borderLeft: '1px solid black', borderBottom: '1px solid black' }}>
                      <Typography variant="h4" className={classNames.type}>
                        지원분야
                      </Typography>
                    </Grid>
                    <Grid item className={classNames.typeGrid} sx={{ borderLeft: '1px solid black' }}>
                      <Typography variant="h4" className={classNames.type}>
                        e-mail
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs={4} container direction={'column'}>
                    <Grid item className={classNames.contentGrid} sx={{ borderBottom: '1px solid black' }}>
                      <Typography variant="h4" className={classNames.contentCenter}>
                        더존비즈온
                      </Typography>
                    </Grid>
                    <Grid item className={classNames.contentGrid} sx={{ borderBottom: '1px solid black' }}>
                      <Typography variant="h4" className={classNames.contentCenter}>
                        ERP 개발
                      </Typography>
                    </Grid>
                    <Grid item className={classNames.contentGrid}>
                      <Typography variant="h4" className={classNames.contentCenter}>
                        {applicantInfo['cv']?.['user_email']}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item container sx={{ borderBottom: '1px solid black' }}>
                  <Grid item xs={2} className={classNames.typeGrid}>
                    <Typography variant="h4" className={classNames.type}>
                      주 소
                    </Typography>
                  </Grid>
                  <Grid item xs={10} className={classNames.contentGrid}>
                    <Typography variant="h4" className={classNames.contentCenter}>
                      {applicantInfo['cv']?.['address']}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item container>
                  <Grid item xs={2} className={classNames.typeGrid} sx={{ height: '80px', borderRight: '1px solid black' }}>
                    <Typography variant="h4" className={classNames.type}>
                      우대사항
                    </Typography>
                  </Grid>
                  <Grid item container xs={10} direction={'column'}>
                    <Grid item container sx={{ height: '40px' }}>
                      <Grid item xs={3} className={classNames.typeGrid} sx={{ borderBottom: '1px solid black' }}>
                        <Typography variant="h4" className={classNames.type}>
                          병역여부
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        className={classNames.contentGrid}
                        sx={{ borderBottom: '1px solid black', borderRight: '1px solid black' }}
                      >
                        <Typography variant="h4" className={classNames.contentCenter}>
                          {applicantInfo['cv']?.['gender'] == '여'
                            ? '해당없음'
                            : applicantInfo['cv']?.['advantages'].map((advantage) => {
                                if (advantage['advantage_type'] == '병역') {
                                  return advantage['advantage_detail'];
                                }
                              })}
                        </Typography>
                      </Grid>
                      <Grid item xs={3} className={classNames.typeGrid} sx={{ borderBottom: '1px solid black' }}>
                        <Typography variant="h4" className={classNames.type}>
                          보훈여부
                        </Typography>
                      </Grid>
                      <Grid item xs={3} className={classNames.contentGrid} sx={{ borderBottom: '1px solid black' }}>
                        <Typography variant="h4" className={classNames.contentCenter}>
                          {applicantInfo['cv']?.['advantages'].map((advantage) => {
                            if (advantage['advantage_type'] == '보훈 대상') {
                              return '해당';
                            }
                          }) || '해당없음'}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item container sx={{ height: '40px' }}>
                      <Grid item xs={3} className={classNames.typeGrid}>
                        <Typography variant="h4" className={classNames.type}>
                          장애여부
                        </Typography>
                      </Grid>
                      <Grid item xs={3} className={classNames.contentGrid} sx={{ borderRight: '1px solid black' }}>
                        <Typography variant="h4" className={classNames.contentCenter}>
                          {applicantInfo['cv']?.['advantages'].some((advantage) => advantage['advantage_type'] == '장애 대상')
                            ? applicantInfo['cv']?.['advantages']
                                .filter((advantage) => advantage['advantage_type'] == '장애 대상')
                                .map((advantage) => advantage['advantage_detail'])
                            : '해당없음'}
                        </Typography>
                      </Grid>
                      <Grid item xs={3} className={classNames.typeGrid}>
                        <Typography variant="h4" className={classNames.type}>
                          저소득층여부
                        </Typography>
                      </Grid>
                      <Grid item xs={3} className={classNames.contentGrid}>
                        <Typography variant="h4" className={classNames.contentCenter}>
                          {applicantInfo['cv']?.['advantages'].some((advantage) => advantage['advantage_type'] == '취업보호 대상')
                            ? applicantInfo['cv']?.['advantages']
                                .filter((advantage) => advantage['advantage_type'] === '취업보호 대상')
                                .map((advantage) => '해당')
                            : '해당없음'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container className={classNames.row} sx={{ border: '1px solid black', borderTop: 0 }}>
          <Grid item xs={1} className={classNames.subTitleGrid} sx={{ borderRight: '1px solid black' }}>
            <Typography variant="h4" className={classNames.subTitle}>
              학력
            </Typography>
          </Grid>
          <Grid item xs={11} container direction={'column'}>
            <Grid item container sx={{ borderBottom: '1px solid black' }}>
              <Grid item xs={3} className={classNames.typeGrid} sx={{ borderRight: '1px solid black' }}>
                <Typography variant="h4" className={classNames.type}>
                  학교명
                </Typography>
              </Grid>
              <Grid item xs={2} className={classNames.typeGrid} sx={{ borderRight: '1px solid black' }}>
                <Typography variant="h4" className={classNames.type}>
                  입학일자
                </Typography>
              </Grid>
              <Grid item xs={2} className={classNames.typeGrid} sx={{ borderRight: '1px solid black' }}>
                <Typography variant="h4" className={classNames.type}>
                  졸업일자
                </Typography>
              </Grid>
              <Grid item xs={2} className={classNames.typeGrid} sx={{ borderRight: '1px solid black' }}>
                <Typography variant="h4" className={classNames.type}>
                  학과/전공
                </Typography>
              </Grid>
              <Grid item xs={1} className={classNames.typeGrid} sx={{ borderRight: '1px solid black' }}>
                <Typography variant="h4" className={classNames.type}>
                  졸업여부
                </Typography>
              </Grid>
              <Grid item xs={2} className={classNames.typeGrid}>
                <Typography variant="h4" className={classNames.type}>
                  학점
                </Typography>
              </Grid>
            </Grid>
            {applicantInfo['cv']?.['educations'].map((edu, index) => {
              return (
                <Grid item container key={index} sx={{ borderBottom: '1px solid black' }}>
                  <Grid item xs={3}>
                    <Typography variant="h4">{edu['edu_type']}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="h4">{getFormattedDate(edu['enter_date'])}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="h4">{getFormattedDate(edu['graduate_date'])}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="h4">{edu['major']}</Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography variant="h4">{edu['graduate_type']}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="h4">{`${edu['score']} / ${edu['total_score']}`}</Typography>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        <Grid item container className={classNames.row} sx={{ border: '1px solid black', borderTop: 0 }}>
          <Grid item xs={1} className={classNames.subTitleGrid} sx={{ borderRight: '1px solid black' }}>
            <Typography variant="h4" className={classNames.subTitle}>
              경력사항
            </Typography>
          </Grid>
          <Grid item xs={11} container direction={'column'}>
            <Grid item container sx={{ borderBottom: '1px solid black' }}>
              <Grid item xs={3} className={classNames.typeGrid} sx={{ borderRight: '1px solid black' }}>
                <Typography variant="h4" className={classNames.type}>
                  근무회사
                </Typography>
              </Grid>
              <Grid item xs={3} className={classNames.typeGrid} sx={{ borderRight: '1px solid black' }}>
                <Typography variant="h4" className={classNames.type}>
                  근무기간
                </Typography>
              </Grid>
              <Grid item xs={2} className={classNames.typeGrid} sx={{ borderRight: '1px solid black' }}>
                <Typography variant="h4" className={classNames.type}>
                  최종직급
                </Typography>
              </Grid>
              <Grid item xs={2} className={classNames.typeGrid} sx={{ borderRight: '1px solid black' }}>
                <Typography variant="h4" className={classNames.type}>
                  담당업무
                </Typography>
              </Grid>
              <Grid item xs={2} className={classNames.typeGrid}>
                <Typography variant="h4" className={classNames.type}>
                  최종연봉
                </Typography>
              </Grid>
            </Grid>
            {applicantInfo['cv']?.['careers'].map((career, index) => {
              return (
                <Grid item container key={index} sx={{ borderBottom: '1px solid black' }}>
                  <Grid item xs={3}>
                    <Typography variant="h4">{career['company_name']}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="h4">
                      {`${getFormattedDate(career['join_date'])} ~ `}
                      {career['quit_date'] ? `${getFormattedDate(career['quit_date'])}` : '재직중'}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="h4">{career['position']}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="h4">{career['job']}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="h4">{`${career['salary'].toLocaleString()} 만원`}</Typography>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        <Grid item container className={classNames.row} sx={{ border: '1px solid black', borderTop: 0 }}>
          <Grid item xs={1} className={classNames.subTitleGrid} sx={{ borderRight: '1px solid black' }}>
            <Typography variant="h4" className={classNames.subTitle}>
              자격/면허
            </Typography>
          </Grid>
          <Grid item xs={6} container direction={'column'}>
            <Grid item container sx={{ borderBottom: '1px solid black' }}>
              <Grid item xs={5} className={classNames.typeGrid} sx={{ borderRight: '1px solid black' }}>
                <Typography variant="h4" className={classNames.type}>
                  자격/면허사항
                </Typography>
              </Grid>
              <Grid item xs={4} className={classNames.typeGrid} sx={{ borderRight: '1px solid black' }}>
                <Typography variant="h4" className={classNames.type}>
                  취득일
                </Typography>
              </Grid>
              <Grid item xs={3} className={classNames.typeGrid}>
                <Typography variant="h4" className={classNames.type}>
                  발행처
                </Typography>
              </Grid>
            </Grid>
            {applicantInfo['cv']?.['certifications'].map((cert, index) => {
              return (
                <Grid item container key={index} sx={{ borderBottom: '1px solid black' }}>
                  <Grid item xs={5}>
                    <Typography variant="h4">{cert['cert_name']}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h4">{getFormattedDate(cert['acquisition_date'])}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="h4">{cert['publisher']}</Typography>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
          <Grid item xs={1} className={classNames.subTitleGrid} sx={{ borderRight: '1px solid black', borderLeft: '1px solid black' }}>
            <Typography variant="h4" className={classNames.subTitle}>
              외국어
            </Typography>
          </Grid>
          <Grid item xs={4} container direction={'column'}>
            <Grid item container sx={{ borderBottom: '1px solid black' }}>
              <Grid item xs={5} className={classNames.typeGrid} sx={{ borderRight: '1px solid black' }}>
                <Typography variant="h4" className={classNames.type}>
                  시험명
                </Typography>
              </Grid>
              <Grid item xs={4} className={classNames.typeGrid} sx={{ borderRight: '1px solid black' }}>
                <Typography variant="h4" className={classNames.type}>
                  외국어
                </Typography>
              </Grid>
              <Grid item xs={3} className={classNames.typeGrid}>
                <Typography variant="h4" className={classNames.type}>
                  어학점수
                </Typography>
              </Grid>
            </Grid>
            {applicantInfo['cv']?.['languages'].map((lang, index) => {
              return (
                <Grid item container key={index} sx={{ borderBottom: '1px solid black' }}>
                  <Grid item xs={5}>
                    <Typography variant="h4">{lang['exam_type']}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h4">{lang['language_name']}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="h4">{lang['language_score']}</Typography>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        <Grid item container className={classNames.row} sx={{ border: '1px solid black', borderTop: 0 }}>
          <Grid item xs={1} className={classNames.subTitleGrid} sx={{ borderRight: '1px solid black' }}>
            <Typography variant="h4" className={classNames.subTitle}>
              대외활동
            </Typography>
          </Grid>
          <Grid item xs={11} container direction={'column'}>
            <Grid item container sx={{ borderBottom: '1px solid black' }}>
              <Grid item xs={2} className={classNames.typeGrid} sx={{ borderRight: '1px solid black' }}>
                <Typography variant="h4" className={classNames.type}>
                  활동 구분
                </Typography>
              </Grid>
              <Grid item xs={2} className={classNames.typeGrid} sx={{ borderRight: '1px solid black' }}>
                <Typography variant="h4" className={classNames.type}>
                  기관명
                </Typography>
              </Grid>
              <Grid item xs={3} className={classNames.typeGrid} sx={{ borderRight: '1px solid black' }}>
                <Typography variant="h4" className={classNames.type}>
                  기간
                </Typography>
              </Grid>
              <Grid item xs={5} className={classNames.typeGrid}>
                <Typography variant="h4" className={classNames.type}>
                  활동내용
                </Typography>
              </Grid>
            </Grid>
            {applicantInfo['cv']?.['activities'].map((ac, index) => {
              return (
                <Grid item container key={index} sx={{ borderBottom: '1px solid black' }}>
                  <Grid item xs={2}>
                    <Typography variant="h4">{ac['activity_type']}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="h4">{ac['organization']}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="h4">{`${getFormattedDate(ac['start_date'])} ~ ${getFormattedDate(ac['end_date'])}`}</Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography variant="h4" sx={{ maxWidth: '427px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ac['activity_detail']}
                    </Typography>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Box>
      <PageBreakWrapper>&nbsp;</PageBreakWrapper>
    </Grid>
  );
});

const PageBreakWrapper = styled.div`
  && {
    page-break-after: always;
  }
`;

export default ApplicantCV;
