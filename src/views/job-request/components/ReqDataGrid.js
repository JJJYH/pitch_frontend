import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { StatusChip1, StatusChip2, StatusChip3, StatusChip4, StatusChip5, StatusChip6 } from './StatusChips';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedRow, resetSelectedRow, selectedRowSelector } from 'store/selectedRowSlice';
import { setJobReqNo } from 'store/jobReqNoSlice';
import { jobReqNoSelector } from 'store/jobReqNoSlice';
import { useRef, useImperativeHandle, forwardRef } from 'react';

const StyledDataGrid = styled(DataGrid)(() => ({
  '& .css-qvtrhg-MuiDataGrid-virtualScroller': {
    overflow: 'auto',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    },
    '&-ms-overflow-style:': {
      display: 'none'
    }
  },
  '& .selected-row': {
    backgroundColor: '#f0f0f0'
  }
}));

const ReqDataGrid = forwardRef(({ rows, setRows, postStatusData, selectedChips }, ref) => {
  const dispatch = useDispatch();
  const selectedRow = useSelector(selectedRowSelector);
  const jobReqNo = useSelector(jobReqNoSelector);

  const getRowClassName = (params) => {
    const isSelected = selectedRow && selectedRow.job_req_no === params.row.job_req_no;
    return isSelected ? 'selected-row' : '';
  };

  const handleRowClick = async (job_req_no) => {
    try {
      const response = await axios.get(`http://localhost:8888/admin/hire/jobreq/${job_req_no}`);

      dispatch(setSelectedRow(response.data));
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckedRowsDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8888/admin/hire/delete/checked`, { data: { jobReqNo } });

      console.log(response);

      const statusData = { selectedStatus: selectedChips };
      const responseData = await postStatusData(statusData);
      setRows(responseData);
      dispatch(resetSelectedRow());
    } catch (error) {
      console.error(error);
    }
  };

  useImperativeHandle(ref, () => ({
    handleCheckedRowsDelete
  }));

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
      <StyledDataGrid
        rows={rows}
        columns={columns}
        hideFooter
        checkboxSelection
        disableRowSelectionOnClick
        getRowId={(row) => row.job_req_no}
        onRowClick={(row) => {
          console.log(row);
          handleRowClick(row.row.job_req_no);
        }}
        getRowClassName={getRowClassName}
        onRowSelectionModelChange={(rows) => {
          console.log(rows);
          dispatch(setJobReqNo(rows));
        }}
      />
    </div>
  );
});

export default ReqDataGrid;
