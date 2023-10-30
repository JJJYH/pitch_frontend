import * as React from 'react';
import { styled as muiStyled } from '@mui/material/styles';
import { useEffect } from 'react';
import { sort } from 'api.js';
import styled from 'styled-components';

/* mui components */
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Paper, Rating, Typography } from '@mui/material';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';

/* custom components */
import ApplicantDataGrid from './components/ApplicantDataGrid';
import PostStatuses from './components/PostStatuses';
import FilteringModal from './components/FilteringModal';
import NoticeModal from './components/NoticeModal';
import InterviewDateModal from './components/InterviewDateModal';
import InterviewEvalModal from './components/InterviewEvalModal';
import MenuBtn from './components/MenuBtn';

/*
 *
 * 지원자 선별 페이지
 * url : manage/sort 추후 변경 예정
 *
 */
const SortingPage = () => {
  const [value, setValue] = React.useState('F');
  const [rows, setRows] = React.useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    sort.applicantList(1, value)
      .then((res) => {
        const arr = res.data.map((appl, index) => {
          return { ...appl, id: index };
        });
        setRows(arr);
      });

  }, [value]);

  return (
    <Paper
      sx={{
        height: '1'
      }}
    >
      <Box
        sx={{
          width: '1',
          height: '140px',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'start',
            marginLeft: '20px',
            marginTop: '40px'
          }}
        >
          <ManageAccountsOutlinedIcon fontSize="large" />
          <Typography variant="h2">
            지원자 관리
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            zIndex: '2',
            marginTop: '40px',
            marginRight: '2%'
          }}
        >
          <PostStatuses />
        </Box>
      </Box>
      <Box sx={{ width: '1', typography: 'body1', marginTop: '15px' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="sorting results tab">
              <Tab label="1차" value="F" />
              <Tab label="2차" value="S" />
              <Tab label="최종" value="FL" />
              <Tab label="종료" value="FH" />
            </TabList>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '30px',
              marginRight: '25px'
            }}
          >
            {value === 'F' && <FilteringModal />}
            {value === 'S' && <InterviewDateModal />}
            {value === 'FL' && <InterviewEvalModal />}
            <NoticeModal />
          </Box>
          <Box>
            <MyTabPanel value="F">
              <ApplicantDataGrid columns={fColumns} rows={rows} />
            </MyTabPanel>
            <MyTabPanel value="S">
              <ApplicantDataGrid columns={sColumns} rows={rows} />
            </MyTabPanel>
            <MyTabPanel value="FL">
              <ApplicantDataGrid columns={flColumns} rows={rows} />
            </MyTabPanel>
            <MyTabPanel value="FH">
              <ApplicantDataGrid columns={fhColumns} rows={rows} />
            </MyTabPanel>
          </Box>
        </TabContext>
      </Box>
    </Paper>
  );
};





/* styled components */

const MyTabPanel = muiStyled(TabPanel)(({ theme }) => ({
  paddingTop: '10px'
}));

function RenderAvatar() {
  return (
    <Avatar
      alt='profile'
      src='images/test2.png'
      sx={{ width: 50, height: 50 }}
    />
  );
}

const StatusChip3 = styled(Chip)(() => ({
  border: '3px solid',
  borderColor: '#A5D6A7',
  borderRadius: '8px',
  background: '#A5D6A7',
  color: 'white',
  fontWeight: 900,
  '&.Mui-selected': {
    backgroundColor: '#A5D6A7',
    color: '#fff',
  },
  minWidth: '82px',
  width: '82px'
}));

const StatusChip4 = styled(Chip)(() => ({
  border: '3px solid',
  borderColor: '#F48FB1',
  background: '#F48FB1',
  borderRadius: '8px',
  color: 'white',
  fontWeight: 900,
  '&.Mui-selected': {
    backgroundColor: '#F48FB1',
    color: '#fff',
  },
  minWidth: '82px',
  width: '82px'
}));

function RenderEval(score) {
  let isQualified = score >= 60 ? true : false;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant='h2'
        style={{ marginRight: '15px' }}
      >{score}</Typography>
      {isQualified ? <StatusChip3 label={'적합인재'} /> : <StatusChip4 label={'부적합'} />}
    </div>
  );
}

const RenderStar = (evals) => {

  if (evals.length == 0) return '평가전';
  let total = 0;

  evals.forEach(element => {
    total += (element["sub1_score"] + element["sub2_score"]) / 2;
  });

  const avg = total / evals.length;

  return <Rating name="read-only" defaultValue={avg} precision={0.5} readOnly />;
}

/* data grid column setting */

const fColumns = [
  {
    field: 'apply_no',
    headerName: '채용지원번호',
  },
  {
    field: 'cv_no',
    headerName: '이력서번호',
  },
  {
    field: 'picture',
    headerName: ' ',
    sortable: false,
    width: 120,
    align: 'center',
    headerAlign: 'center',
    renderCell: RenderAvatar
  },
  {
    field: 'user_nm',
    headerName: '이름',
    width: 140,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) =>
      `${params.row.user_nm} (${params.row.gender})`,
  },
  {
    field: 'user_birth',
    headerName: '생년월일',
    width: 200,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) =>
      `${getAge(params.row.user_birth)}세 (${params.row.user_birth})`,
  },
  {
    field: 'career',
    headerName: '경력구분',
    width: 120,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) =>
      `${params.row.career == 'y' ? '경력' : '신입'}`,
  },
  {
    field: 'apply_date',
    headerName: '지원일',
    width: 140,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) =>
      `${getFormattedDate(params.row.apply_date)}`,
  },
  {
    field: 'eval',
    headerName: '평가',
    sortable: false,
    width: 230,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) =>
      RenderEval(params.row.score)
  },
  {
    field: 'status_type',
    headerName: '상태',
    width: 140,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'read_status',
    headerName: '열람여부',
    align: 'center',
    headerAlign: 'center',
    width: 140
  },
  {
    field: 'tools',
    headerName: ' ',
    sortable: false,
    width: 210,
    align: 'center',
    headerAlign: 'center',
    renderCell: MenuBtn
  },
];

const sColumns = [
  {
    field: 'apply_no',
    headerName: '채용지원번호',
  },
  {
    field: 'cv_no',
    headerName: '이력서번호',
  },
  {
    field: 'picture',
    headerName: ' ',
    sortable: false,
    width: 120,
    align: 'center',
    headerAlign: 'center',
    renderCell: RenderAvatar
  },
  {
    field: 'user_nm',
    headerName: '이름',
    width: 140,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) =>
      `${params.row.user_nm} (${params.row.gender})`,
  },
  {
    field: 'user_birth',
    headerName: '생년월일',
    width: 200,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) =>
      `${getAge(params.row.user_birth)}세 (${params.row.user_birth})`,
  },
  {
    field: 'career',
    headerName: '경력구분',
    width: 120,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) =>
      `${params.row.career == 'y' ? '경력' : '신입'}`,
  },
  {
    field: 'apply_date',
    headerName: '지원일',
    width: 140,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) =>
      `${getFormattedDate(params.row.apply_date)}`,
  },
  {
    field: 'eval',
    headerName: '평가',
    sortable: false,
    width: 230,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) =>
      RenderEval(params.row.score)
  },
  {
    field: 'status_type',
    headerName: '상태',
    width: 140,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'read_status',
    headerName: '열람여부',
    align: 'center',
    headerAlign: 'center',
    width: 140
  },
  {
    field: 'tools',
    headerName: ' ',
    sortable: false,
    width: 210,
    align: 'center',
    headerAlign: 'center',
    renderCell: MenuBtn
  },
];

const flColumns = [
  {
    field: 'apply_no',
    headerName: '채용지원번호',
  },
  {
    field: 'cv_no',
    headerName: '이력서번호',
  },
  {
    field: 'picture',
    headerName: ' ',
    sortable: false,
    width: 120,
    align: 'center',
    headerAlign: 'center',
    renderCell: RenderAvatar
  },
  {
    field: 'user_nm',
    headerName: '이름',
    width: 140,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) =>
      `${params.row.user_nm} (${params.row.gender})`,
  },
  {
    field: 'user_birth',
    headerName: '생년월일',
    width: 200,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) =>
      `${getAge(params.row.user_birth)}세 (${params.row.user_birth})`,
  },
  {
    field: 'career',
    headerName: '경력구분',
    width: 120,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) =>
      `${params.row.career == 'y' ? '경력' : '신입'}`,
  },
  {
    field: 'apply_date',
    headerName: '지원일',
    width: 200,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) =>
      `${getFormattedDate(params.row.apply_date)}`,
  },
  {
    field: 'status_type',
    headerName: '상태',
    width: 140,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'score',
    headerName: '면접 평가',
    width: 160,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => RenderStar(params.row.evals)
  },
  {
    field: 'note',
    headerName: '비고',
    width: 200,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'tools',
    headerName: ' ',
    sortable: false,
    width: 210,
    align: 'center',
    headerAlign: 'center',
    renderCell: MenuBtn
  },
];

const fhColumns = [
  {
    field: 'apply_no',
    headerName: '채용지원번호',
  },
  {
    field: 'cv_no',
    headerName: '이력서번호',
  },
  {
    field: 'picture',
    headerName: ' ',
    sortable: false,
    width: 120,
    align: 'center',
    headerAlign: 'center',
    renderCell: RenderAvatar
  },
  {
    field: 'user_nm',
    headerName: '이름',
    width: 140,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) =>
      `${params.row.user_nm} (${params.row.gender})`,
  },
  {
    field: 'user_birth',
    headerName: '생년월일',
    width: 200,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) =>
      `${getAge(params.row.user_birth)}세 (${params.row.user_birth})`,
  },
  {
    field: 'career',
    headerName: '경력구분',
    width: 120,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) =>
      `${params.row.career == 'y' ? '경력' : '신입'}`,
  },
  {
    field: 'apply_date',
    headerName: '지원일',
    width: 200,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) =>
      `${getFormattedDate(params.row.apply_date)}`,
  },
  {
    field: 'status_type',
    headerName: '상태',
    width: 140,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'score',
    headerName: '면접 평가',
    width: 160,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => RenderStar(params.row.evals)
  },
  {
    field: 'note',
    headerName: '비고',
    width: 200,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'tools',
    headerName: ' ',
    sortable: false,
    width: 210,
    align: 'center',
    headerAlign: 'center',
    renderCell: MenuBtn
  },
];


/* 날짜 1992/11/22 형식으로 변환하는 함수 */
const getFormattedDate = (data) => {
  const date = new Date(data);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}/${month}/${day}`;
}

/* 만나이 계산하는 함수 */
const getAge = (data) => {
  const birthday = new Date(data);
  const today = new Date();

  let age = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }

  return age;
}

export default SortingPage;
