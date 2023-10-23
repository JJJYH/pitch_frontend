import React from 'react';
import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { StatusChip1, StatusChip2, StatusChip3, StatusChip4, StatusChip5, StatusChip6 } from './StatusChips';

const ReqDataGrid = ({ rows, handleRowClick }) => {
  const columns = [
    {
      field: 'job_req_date',
      headerName: '요청일자',
      width: 150,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => {
        const timestamp = params.value;
        const dateObject = dayjs(timestamp);
        const formattedDate = dateObject.format('YYYY-MM-DD');
        return formattedDate;
      }
    },
    { field: 'req_title', headerName: '제목', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'job_role', headerName: '직무', width: 150, headerAlign: 'center', align: 'center' },
    {
      field: 'req_status',
      headerName: '상태',
      width: 180,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const status = params.row.req_status;
        switch (status) {
          case '작성중':
            return <StatusChip1 label={status} variant="selected" />;
          case '요청완료':
            return <StatusChip2 label={status} variant="selected" />;
          case '승인':
            return <StatusChip3 label={status} variant="selected" />;
          case '반려':
            return <StatusChip4 label={status} variant="selected" />;
          case '공고중':
            return <StatusChip5 label={status} variant="selected" />;
          case '공고종료':
            return <StatusChip6 label={status} variant="selected" />;
        }
      }
    }
  ];

  return (
    <div style={{ height: 590, width: '98%', margin: 'auto' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        hideFooter
        checkboxSelection
        disableRowSelectionOnClick
        getRowId={(row) => row.job_req_no}
        onRowClick={(selectedRow) => handleRowClick(selectedRow.row.job_req_no)}
      />
    </div>
  );
};

export default ReqDataGrid;
