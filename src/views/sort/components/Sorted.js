import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import MenuBtn from './MenuBtn';

function RenderAvatar() {
  return (
    <Avatar
        alt='profile'
        src='images/test2.png'
        sx={{ width: 50, height: 50 }}
      />
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
    field: 'status',
    headerName: '상태',
    width: 140,
    align:'center',
    headerAlign: 'center',
  },
  {
    field: 'readStatus',
    headerName: '탈락사유',
    align:'center',
    headerAlign: 'center',
    width: 370
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
  { id: 1, lastName: '이', firstName: '소영', birth: '1992/11/22',  experience: '신입', score: 77, status : '서류합격' },
  { id: 2, lastName: '최', firstName: '소영', birth: '1992/11/24',  experience: '경력', score: 45, status : '평가대기' },
  { id: 3, lastName: '박', firstName: '소영', birth: '1992/11/23',  experience: '신입', score: 90, status : '서류합격' },
];

export default function Sorting1st() {
  return (
    <div style={{ height: 550, width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px'}}>
        <Button 
          variant='contained' 
          size='medium' 
          style={{marginRight: '5px'}}
          disabled
        >
          필터링
        </Button>
        <Button variant='outlined' size='medium'>
          합격등록
        </Button>
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
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}