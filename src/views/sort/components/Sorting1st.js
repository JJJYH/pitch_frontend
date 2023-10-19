import * as React from 'react';

/* mui components */
import Avatar from '@mui/material/Avatar';
import { DataGrid } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import { Typography } from '@mui/material';

/* custom components */
import MenuBtn from './MenuBtn';
import FilteringModal from './FilteringModal';
import NoticeModal from './NoticeModal';

function RenderAvatar() {
  return (
    <Avatar
        alt='profile'
        src='images/test2.png'
        sx={{ width: 50, height: 50 }}
      />
  );
}

function RenderEval(score) {
  let isQualified = score >= 60 ? true : false;

  return (
    <div style={{ display: 'flex', alignItems: 'center'}}>
      <Typography variant='h2' 
        style={{ marginRight: '15px' }}
      >{score}</Typography>
      <Chip 
        label={ isQualified ? "적합인재" : "부적합" } 
        color={ isQualified ? "success" : "error" }
      />
    </div>
  );
}


const columns = [
  {
    field: 'avatar',
    headerName: ' ',
    sortable: false,
    width: 120,
    align:'center',
    headerAlign: 'center',
    renderCell: RenderAvatar
  },
  {
    field: 'fullName',
    headerName: '이름',
    width: 140,
    align:'center',
    headerAlign: 'center',
    valueGetter: (params) =>
      `${params.row.lastName || ''} ${params.row.firstName || ''}`,
  },
  {
    field: 'birth',
    headerName: '생년월일',
    width: 200,
    align:'center',
    headerAlign: 'center',
    valueGetter: (params) =>
      `${params.row.birth || ''}`,
  },
  {
    field: 'experience',
    headerName: '경력구분',
    width: 120,
    align:'center',
    headerAlign: 'center',
  },
  {
    field: 'eval',
    headerName: '평가',
    sortable: false,
    width: 230,
    align:'center',
    headerAlign: 'center',
    renderCell: (params) => 
      RenderEval(params.row.score)
  },
  {
    field: 'status',
    headerName: '상태',
    width: 140,
    align:'center',
    headerAlign: 'center',
  },
  {
    field: 'readStatus',
    headerName: '열람여부',
    align:'center',
    headerAlign: 'center',
    width: 140
  },
  {
    field: 'tools',
    headerName: ' ',
    sortable: false,
    width: 210,
    align:'center',
    headerAlign: 'center',
    renderCell: MenuBtn
  },
];

const rows = [
  { id: 1, lastName: '이', firstName: '소영', birth: '1992/11/22',  experience: '신입', score: 77, status : '서류합격', readStatus: '열람' },
  { id: 2, lastName: '최', firstName: '소영', birth: '1992/11/24',  experience: '경력', score: 45, status : '평가대기', readStatus: '미열람' },
  { id: 3, lastName: '박', firstName: '소영', birth: '1992/11/23',  experience: '신입', score: 90, status : '서류합격', readStatus: '열람' },
];

export default function Sorting1st() {
  return (
    <div style={{ height: "550px", width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px'}}>
        <FilteringModal />
        <NoticeModal />
      </div>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          // pagination: {
          //   paginationModel: { page: 0, pageSize: 5 },
          // },
        }}
        hideFooter
        //pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}