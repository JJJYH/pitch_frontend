import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const JobRole = ({ onSelect, disabled, formData, validationErrors }) => {
  //   console.log('v:' + value);
  //   console.log('d:' + disabled);

  const jobRoles = [
    {
      label: '퍼블리싱',
      qual: '- HTML, CSS등 W3C 웹 표준 규격에 대한 이해 보유자\n- 웹, 모바일 반응형 프로젝트 경험이 있는 자\n- HTML,CSS, JavaScript에 대한 기본적인 이해/활용 능력',
      prefer:
        '- Reactjs 기반 퍼블리싱 경험이 있는 자\n- Git/Jira/Confluence 등의 협업툴을 이용한 경험이 있는 자\n- 다양한 협업부서와 적극적이고 긍정적으로 커뮤니케이션이 가능한 자',
      duties: '- 웹 퍼블리싱\n- UI/UX 설계',
      group: '개발'
    },
    {
      label: '프론트엔드',
      qual: '- JavaScript에 대한 개발역량과 HTML/CSS에 대한 이해 보유자\n- React와 같은 Front-End 라이브러리/프레임워크 사용 및 이해 보유자\n- 능동적이며, 개발분야의 트랜드와 기술 변화에 관심이 많은 자',
      prefer: '- UI/UX 최신 트렌드 관심자\n- React 등 SPA 개발 경험자\n- 솔루션 및 제품 서비스 기획 경험자',
      duties: '- 서비스 개발 및 운영을 위한 도구개발\n- 프론트엔드 빌드 시스템 및 서버 운영\n- 차트와 같은 시각화 모듈을 개발/연구',
      group: '개발'
    },
    {
      label: '백엔드',
      qual: '- Python, Java 중 1가지 이상의 언어를 활용하여 원활하게 웹 서비스를 개발 가능한 자\n- 프로그래밍에 대한 기초지식이 확실한 자\n- 웹 서비스의 일반적인 아키텍쳐에 대한 이해 및 RESTful API 설계 관련 경험이 있는 자',
      prefer:
        '- JavaScript, HTML, CSS 등 WEB Front-End 개발이 함께 가능한 Full-Stack 개발 가능자\n- 상용 서비스 및 제품 개발 참여 경험 보유자\n- C#, C/C++, Swift 중 1개 이상 활용 가능한 자',
      duties:
        '- Windows/Mac 기반의 개발업무 지원 프로그램 개발 및 유지보수\n- 플랫폼/서비스의 안정적인 운영을 위한 기술 연구, 개발\n- 플랫폼 공통 백엔드 API 개발 및 유지보수',
      group: '개발'
    },
    {
      label: 'IT기술영업',
      qual: '- 자격조건1\n- 자격조건1',
      prefer: '- 우대사항1\n- 우대사항1',
      duties: '- 수행업무1\n- 수행업무1',
      group: '영업/마케팅'
    },
    {
      label: '영업마케팅',
      qual: '- 자격조건2\n- 자격조건2',
      prefer: '- 우대사항2\n- 우대사항2',
      duties: '- 수행업무2\n- 수행업무2',
      group: '영업/마케팅'
    },
    {
      label: '영업지원/관리',
      qual: '- 자격조건3\n- 자격조건3',
      prefer: '- 우대사항3\n- 우대사항3',
      duties: '- 수행업무3\n- 수행업무3',
      group: '영업/마케팅'
    },
    {
      label: '경영기획',
      qual: '- 자격조건4\n- 자격조건4',
      prefer: '- 우대사항4\n- 우대사항4',
      duties: '- 수행업무4\n- 수행업무4',
      group: '경영'
    },
    {
      label: '경영관리',
      qual: '- 자격조건5\n- 자격조건5',
      prefer: '- 우대사항5\n- 우대사항5',
      duties: '- 수행업무5\n- 수행업무5',
      group: '경영'
    },
    {
      label: '관리회계/내부회계',
      qual: '- 자격조건6\n- 자격조건6',
      prefer: '- 우대사항6\n- 우대사항6',
      duties: '- 수행업무6\n- 수행업무6',
      group: '회계'
    },
    {
      label: '총무',
      qual: '- 자격조건7\n- 자격조건7',
      prefer: '- 우대사항7\n- 우대사항7',
      duties: '- 수행업무7\n- 수행업무7',
      group: '회계'
    }
  ];

  return (
    <Autocomplete
      value={formData.job_role}
      disableClearable
      options={jobRoles}
      isOptionEqualToValue={(option, value) => option.label === value}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="직무 선택"
          variant="outlined"
          name="job_role"
          size="small"
          error={validationErrors.job_role}
          helperText={validationErrors.job_role && '직무를 선택해주세요.'}
        />
      )}
      onChange={(event, value) => onSelect(value)}
      disabled={disabled}
    />
  );
};

export default JobRole;
