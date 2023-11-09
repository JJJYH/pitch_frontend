import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const JobRole = ({ onSelect, disabled, formData }) => {
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
      prefer: '- 우대사항2\n -우대사항2\n- 우대사항2',
      duties: '- 수행업무2\n- 수행업무2',
      group: '개발'
    },
    {
      label: '직무3',
      qual: '- 자격조건3\n- 자격조건3',
      prefer: '- 우대사항3\n- 우대사항3',
      duties: '- 수행업무3\n- 수행업무3',
      group: '개발'
    },
    {
      label: '직무4',
      qual: '- 자격조건4\n- 자격조건4',
      prefer: '- 우대사항4\n- 우대사항4',
      duties: '- 수행업무4\n- 수행업무4',
      group: '직군2'
    },
    {
      label: '직무5',
      qual: '- 자격조건5\n- 자격조건5',
      prefer: '- 우대사항5\n- 우대사항5',
      duties: '- 수행업무5\n- 수행업무5',
      group: '직군2'
    }
  ];

  return (
    <Autocomplete
      value={formData.job_role}
      disableClearable
      options={jobRoles}
      isOptionEqualToValue={(option, value) => option.label === value}
      renderInput={(params) => <TextField {...params} placeholder="직무 선택" variant="outlined" name="job_role" size="small" />}
      onChange={(event, value) => onSelect(value)}
      disabled={disabled} // Autocomplete를 비활성화
    />
  );
};

export default JobRole;
