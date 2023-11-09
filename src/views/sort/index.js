import * as React from 'react';
import { styled as muiStyled } from '@mui/material/styles';
import { useEffect, useState, useRef } from 'react';
import { sort } from 'api.js';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { getAge, getFormattedDate, getDday } from './sorts.js';
import { useDispatch, useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';

/* mui components */
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Button, Paper, Rating, Typography } from '@mui/material';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import PrintIcon from '@mui/icons-material/Print';

/* custom components */
import ApplicantDataGrid from './components/ApplicantDataGrid';
import FilteringModal from './components/FilteringModal';
import NoticeModal from './components/NoticeModal';
import InterviewDateModal from './components/InterviewDateModal';
import InterviewEvalModal from './components/InterviewEvalModal';
import MenuBtn from './components/MenuBtn';
import classNames from './sort.module.scss';
import { setPosting } from 'store/postingSlice.js';
import CVToPrint from './components/CVToPrint.js';
import ApplicantDetailPage from './ApplicantDetailPage.js';

/*
 *
 * 지원자 선별 페이지
 * url : manage/:job_posting_no/sort
 *
 */
const SortingPage = () => {
  const { job_posting_no } = useParams();
  const dispatch = useDispatch();
  const componentRef = useRef();
  const [value, setValue] = useState('F');
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const [btnType, setBtnType] = useState('');
  const [info, setInfo] = useState({
    hire_num: 0,
    hired_num: 0,
    job_posting_no,
    job_req_no: 0,
    job_type: '',
    likedCnt: 0,
    posting_end: 0,
    posting_start: 0,
    posting_status: '',
    posting_type: '',
    req_title: '',
    total_applicants: 0
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleBtnClick = (event, value) => {
    setIsBtnClicked(!isBtnClicked);
    setBtnType(value);
  };

  const handlePrint = useReactToPrint({
    content: () => {
      return componentRef.current;
    }
  });

  const setList = () => {
    sort.applicantList(job_posting_no, value).then((res) => {
      console.log(res.data);
      const arr = res.data.map((appl, index) => {
        return { ...appl, id: index };
      });
      setRows(arr);
    });
  };

  useEffect(() => {
    setList();
  }, [value]);

  useEffect(() => {
    sort.postingInfo(job_posting_no).then((res) => {
      setInfo({ ...res.data });
      dispatch(setPosting({ postingNo: job_posting_no, reqNo: res.data.job_req_no }));
    });
  }, []);

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          flex: '0 0 auto',
          display: 'flex',
          alignItems: 'center',
          margin: '20px 20px 0px 20px',
          flexDirection: 'row'
        }}
      >
        <Typography variant="h2" sx={{ marginBottom: 'none' }}>
          {`[${info.job_type}] ${info.req_title}`}
        </Typography>
        {info.posting_end && (
          <div className={classNames.statusRoot} style={{ marginLeft: '10px' }}>
            <div className={classNames.dDay}>
              <div>
                <b>{`D-${getDday(info.posting_end)}`}</b>
              </div>
            </div>
          </div>
        )}
        <div style={{ flex: '1 1 auto' }} />
        <div className={classNames.statusRoot}>
          <div className={[classNames.status, classNames.badge].join(' ')}>
            <div>{info.posting_type}</div>
          </div>
          <div className={classNames.status}>
            <div>{`👑${info.hired_num} / ${info.hire_num}`}</div>
          </div>
          <div className={classNames.status}>
            <div>{`👤${info.total_applicants}`}</div>
          </div>
          <div className={classNames.status}>
            <img
              src="https://png.pngtree.com/png-vector/20190909/ourlarge/pngtree-red-heart-icon-isolated-png-image_1726594.jpg"
              style={{ width: '16px', height: '16px' }}
              alt={''}
            />
            <div>{info.likedCnt}</div>
          </div>
        </div>
      </Box>

      <Box sx={{ flex: '1 1 auto', typography: 'body1', marginTop: '15px' }}>
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
              justifyContent: 'space-between',
              marginTop: '30px',
              marginRight: '25px'
            }}
          >
            <Box sx={{ ml: '24px' }}>
              {isSelected && (
                <>
                  <Button
                    variant="contained"
                    size="medium"
                    sx={{
                      borderColor: '#38678f',
                      background: '#38678f',
                      mr: '5px'
                    }}
                    onClick={(event) => handleBtnClick(event, 'pass')}
                  >
                    합격대기
                  </Button>
                  <Button
                    variant="outlined"
                    size="medium"
                    sx={{
                      borderColor: '#38678f',
                      color: '#38678f',
                      mr: '5px'
                    }}
                    onClick={(event) => handleBtnClick(event, 'fail')}
                  >
                    불합격대기
                  </Button>
                </>
              )}
            </Box>

            <Box sx={{ display: 'flex' }}>
              {isSelected ? (
                <Button onClick={handlePrint} variant="outlined" size="medium" sx={{ borderColor: '#38678f', color: '#38678f' }}>
                  <PrintIcon />
                  인쇄하기
                </Button>
              ) : (
                <>
                  {value == 'F' && <FilteringModal />}
                  {value == 'S' && <InterviewDateModal />}
                  <NoticeModal postingNo={job_posting_no} title={info.req_title} />
                </>
              )}
            </Box>
          </Box>
          <Box>
            <MyTabPanel value="F">
              <ApplicantDataGrid
                columns={fColumns}
                rows={rows}
                btnType={btnType}
                isBtnClicked={isBtnClicked}
                setList={setList}
                setIsSelected={setIsSelected}
                setSelectedRows={setSelectedRows}
              />
            </MyTabPanel>
            <MyTabPanel value="S">
              <ApplicantDataGrid
                columns={sColumns}
                rows={rows}
                btnType={btnType}
                isBtnClicked={isBtnClicked}
                setList={setList}
                setIsSelected={setIsSelected}
                setSelectedRows={setSelectedRows}
              />
            </MyTabPanel>
            <MyTabPanel value="FL">
              <ApplicantDataGrid
                columns={flColumns}
                rows={rows}
                btnType={btnType}
                isBtnClicked={isBtnClicked}
                setList={setList}
                setIsSelected={setIsSelected}
                setSelectedRows={setSelectedRows}
              />
            </MyTabPanel>
            <MyTabPanel value="FH">
              <ApplicantDataGrid
                columns={fhColumns}
                rows={rows}
                btnType={btnType}
                setIsSelected={setIsSelected}
                isBtnClicked={isBtnClicked}
                setList={setList}
                setSelectedRows={setSelectedRows}
              />
            </MyTabPanel>
          </Box>
        </TabContext>
      </Box>
      <CVToPrint ref={componentRef} rows={selectedRows} />
    </Paper>
  );
};

/* styled components */

const MyTabPanel = muiStyled(TabPanel)(({ theme }) => ({
  paddingTop: '10px'
}));

const RenderAvatar = () => {
  return <Avatar alt="profile" src="images/test2.png" sx={{ width: 50, height: 50 }} />;
};

const StatusChip3 = styled(Chip)(() => ({
  border: '3px solid',
  borderColor: '#A5D6A7',
  borderRadius: '8px',
  background: '#A5D6A7',
  color: 'white',
  fontWeight: 900,
  '&.Mui-selected': {
    backgroundColor: '#A5D6A7',
    color: '#fff'
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
    color: '#fff'
  },
  minWidth: '82px',
  width: '82px'
}));

const RenderEval = (score) => {
  let isQualified = score >= 60 ? true : false;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="h2" style={{ marginRight: '15px' }}>
        {score}
      </Typography>
      {isQualified ? <StatusChip3 label={'적합인재'} /> : <StatusChip4 label={'부적합'} />}
    </div>
  );
};

const RenderStar = (evals, apply_no) => {
  const userInfo = useSelector((state) => state.userInfo);

  let isEvaled = false;
  evals.forEach((element) => {
    if (element.user_id == userInfo.user_id) {
      isEvaled = true;
    }
  });
  if (!isEvaled) {
    return <InterviewEvalModal applyNo={apply_no} />;
  } else {
    let total = 0;

    evals.forEach((element) => {
      total += (element['sub1_score'] + element['sub2_score'] + element['sub3_score'] + element['sub4_score'] + element['sub5_score']) / 5;
    });

    const avg = total / evals.length;

    return <Rating name="read-only" value={avg} precision={0.5} readOnly />;
  }
};

const RenderName = (data) => {
  return (
    <Link
      to={`${data.row.apply_no}`}
      sx={{
        color: 'black'
      }}
    >{`${data.row.user_nm} (${data.row.gender.charAt(0)})`}</Link>
  );
};

/* data grid column setting */

const fColumns = [
  {
    field: 'apply_no',
    headerName: '채용지원번호'
  },
  {
    field: 'cv_no',
    headerName: '이력서번호'
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
    renderCell: RenderName
  },
  {
    field: 'user_birth',
    headerName: '생년월일',
    width: 200,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) => `${getAge(params.row.user_birth)}세 (${params.row.user_birth})`
  },
  {
    field: 'career',
    headerName: '경력구분',
    width: 120,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) => `${params.row.career == 'y' ? '경력' : '신입'}`
  },
  {
    field: 'apply_date',
    headerName: '지원일',
    width: 140,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) => `${getFormattedDate(params.row.apply_date)}`
  },
  {
    field: 'eval',
    headerName: '평가',
    sortable: false,
    width: 230,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => RenderEval(params.row.score)
  },
  {
    field: 'status_type',
    headerName: '상태',
    width: 140,
    align: 'center',
    headerAlign: 'center'
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
  }
];

const sColumns = [
  {
    field: 'apply_no',
    headerName: '채용지원번호'
  },
  {
    field: 'cv_no',
    headerName: '이력서번호'
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
    renderCell: RenderName
  },
  {
    field: 'user_birth',
    headerName: '생년월일',
    width: 200,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) => `${getAge(params.row.user_birth)}세 (${params.row.user_birth})`
  },
  {
    field: 'career',
    headerName: '경력구분',
    width: 120,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) => `${params.row.career == 'y' ? '경력' : '신입'}`
  },
  {
    field: 'apply_date',
    headerName: '지원일',
    width: 140,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) => `${getFormattedDate(params.row.apply_date)}`
  },
  {
    field: 'eval',
    headerName: '평가',
    sortable: false,
    width: 230,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => RenderEval(params.row.score)
  },
  {
    field: 'status_type',
    headerName: '상태',
    width: 140,
    align: 'center',
    headerAlign: 'center'
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
  }
];

const flColumns = [
  {
    field: 'apply_no',
    headerName: '채용지원번호'
  },
  {
    field: 'cv_no',
    headerName: '이력서번호'
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
    renderCell: RenderName
  },
  {
    field: 'user_birth',
    headerName: '생년월일',
    width: 200,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) => `${getAge(params.row.user_birth)}세 (${params.row.user_birth})`
  },
  {
    field: 'career',
    headerName: '경력구분',
    width: 120,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) => `${params.row.career == 'y' ? '경력' : '신입'}`
  },
  {
    field: 'apply_date',
    headerName: '지원일',
    width: 200,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) => `${getFormattedDate(params.row.apply_date)}`
  },
  {
    field: 'score',
    headerName: '면접 평가',
    width: 160,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => RenderStar(params.row.evals, params.row.apply_no)
  },
  {
    field: 'status_type',
    headerName: '상태',
    width: 140,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'note',
    headerName: '비고',
    width: 200,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'tools',
    headerName: ' ',
    sortable: false,
    width: 210,
    align: 'center',
    headerAlign: 'center',
    renderCell: MenuBtn
  }
];

const fhColumns = [
  {
    field: 'apply_no',
    headerName: '채용지원번호'
  },
  {
    field: 'cv_no',
    headerName: '이력서번호'
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
    renderCell: RenderName
  },
  {
    field: 'user_birth',
    headerName: '생년월일',
    width: 200,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) => `${getAge(params.row.user_birth)}세 (${params.row.user_birth})`
  },
  {
    field: 'career',
    headerName: '경력구분',
    width: 120,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) => `${params.row.career == 'y' ? '경력' : '신입'}`
  },
  {
    field: 'apply_date',
    headerName: '지원일',
    width: 200,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) => `${getFormattedDate(params.row.apply_date)}`
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
    headerAlign: 'center'
  },
  {
    field: 'tools',
    headerName: ' ',
    sortable: false,
    width: 210,
    align: 'center',
    headerAlign: 'center',
    renderCell: MenuBtn
  }
];

export default SortingPage;
